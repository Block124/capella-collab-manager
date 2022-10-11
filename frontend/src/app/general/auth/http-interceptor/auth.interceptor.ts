/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  AuthService,
  RefreshTokenResponse,
} from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/helpers/toast/toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const req = this.injectAccessToken(request);
    return next.handle(req).pipe(
      catchError((err) => {
        throwError(() => err);
        if (err.status === 401) {
          if (err.error.detail.err_code == 'token_exp') {
            return this.refreshToken().pipe(
              switchMap(() => {
                const req = this.injectAccessToken(request);
                return next.handle(req);
              }),
              catchError(() => {
                this.router.navigateByUrl('/logout?reason=session-expired');
                return throwError(err);
              })
            );
          } else {
            this.router.navigateByUrl('/logout?reason=unauthorized');
          }
        } else if (
          typeof err.error !== 'undefined' &&
          typeof err.error.detail !== 'undefined' &&
          err.error.detail.reason
        ) {
          this.toastService.showError(
            'An error occurred!',
            err.error.detail.reason
          );
        } else if (err.status === 0) {
          this.toastService.showError(
            'Backend not reachable',
            'Please check your internet connection and refresh the page!'
          );
        } else if (err.status !== 404) {
          this.toastService.showError(
            'An error occurred!',
            'Please try again!'
          );
        }

        return throwError(err);
      })
    );
  }

  injectAccessToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const access_token = this.authService.accessToken;
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${access_token}`),
    });
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    console.log('Token is expired. Refreshing token...');
    return this.authService.performTokenRefresh();
  }
}

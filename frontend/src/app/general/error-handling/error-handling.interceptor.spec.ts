/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { TestBed } from '@angular/core/testing';

import { ErrorHandlingInterceptor } from './error-handling.interceptor';

xdescribe('ErrorHandlingInterceptorService', () => {
  let service: ErrorHandlingInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlingInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

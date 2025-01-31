/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GitSettingsService {
  private BACKEND_URL_PREFIX =
    environment.backend_url + '/settings/modelsources/git/';

  private _gitSettings = new BehaviorSubject<GitSetting[]>([]);
  private _gitSetting = new Subject<GitSetting>();

  readonly gitSettings = this._gitSettings.asObservable();
  readonly gitSetting = this._gitSetting.asObservable();

  constructor(private http: HttpClient) {}

  loadGitSettings(): void {
    this.http
      .get<GitSetting[]>(this.BACKEND_URL_PREFIX)
      .subscribe((gitSettings) => this._gitSettings.next(gitSettings));
  }

  loadGitSettingById(id: number): void {
    this.http
      .get<GitSetting>(this.BACKEND_URL_PREFIX + id)
      .subscribe((gitSetting) => this._gitSetting.next(gitSetting));
  }

  createGitSettings(gitSetting: {
    name: string;
    url: string;
    type: GitType;
  }): Observable<GitSetting> {
    return this.http
      .post<GitSetting>(this.BACKEND_URL_PREFIX, gitSetting)
      .pipe(tap(() => this.loadGitSettings()));
  }

  editGitSettings(
    id: number,
    name: string,
    url: string,
    type: GitType
  ): Observable<GitSetting> {
    return this.http
      .put<GitSetting>(this.BACKEND_URL_PREFIX + id, {
        type,
        name,
        url,
      })
      .pipe(tap(() => this.loadGitSettings()));
  }

  deleteGitSettings(id: number) {
    return this.http
      .delete(this.BACKEND_URL_PREFIX + id)
      .pipe(tap(() => this.loadGitSettings()));
  }
}

export interface GitSetting {
  id: number;
  name: string;
  url: string;
  type: GitType;
}

export type GitType = 'general' | 'gitlab' | 'github' | 'azuredevops';

export type EditingMode = 't4c' | 'git';
export type ProjectType = 'project' | 'library';

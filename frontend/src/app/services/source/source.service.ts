/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ProjectService } from 'src/app/services/project/project.service';
import { environment } from 'src/environments/environment';
import { ModelService } from '../model/model.service';

export interface Source {
  path: string;
  entrypoint: string;
  revision: string;
  username?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SourceService {
  constructor(
    private http: HttpClient,
    private projectService: ProjectService
  ) {}

  source: Source | null = null;
  sources: Source[] | null = null;

  addGitSource(
    project_name: string,
    model_slug: string,
    source: Source
  ): Observable<Source> {
    return this.http.post<Source>(
      environment.backend_url +
        '/projects/' +
        project_name +
        '/extensions/modelsources/git/create/' +
        model_slug,
      source
    );
  }
}

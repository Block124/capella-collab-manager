/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  base_url = environment.backend_url + '/projects/';

  _project = new BehaviorSubject<Project | undefined>(undefined);
  _projects = new BehaviorSubject<Project[] | undefined>(undefined);

  get project() {
    return this._project.value;
  }

  get projects() {
    return this._projects.value;
  }

  constructor(private http: HttpClient) {}

  getProjectBySlug(slug: string): Observable<Project> {
    return this.http.get<Project>(this.base_url + slug);
  }

  list(): Observable<Project[]> {
    return this.http
      .get<Project[]>(this.base_url)
      .pipe(tap((projects: Project[]) => this._projects.next(projects)));
  }

  getProject(name: string): Observable<Project> {
    return this.http.get<Project>(this.base_url + name);
  }

  updateDescription(
    project_slug: string,
    description: string
  ): Observable<Project> {
    return this.http.patch<Project>(this.base_url + project_slug, {
      description,
    });
  }

  createProject(
    project: {
      name: string;
      description: string;
    },
    update?: boolean
  ): Observable<Project> {
    let observable = this.http.post<Project>(this.base_url, project);
    if (update) {
      observable = observable.pipe(
        tap({
          next: (value) => {
            this._project.next(value);
          },
          error: (_) => {
            this._project.next(undefined);
          },
        })
      );
    }
    return observable;
  }
}

export interface UserMetadata {
  leads: number;
  contributors: number;
  subscribers: number;
}

export interface Project {
  name: string;
  slug: string;
  description: string;
  users: UserMetadata;
}

export type EditingMode = 't4c' | 'git';
export type ProjectType = 'project' | 'library';

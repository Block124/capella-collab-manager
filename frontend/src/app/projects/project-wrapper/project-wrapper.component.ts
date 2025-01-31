/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, connectable, map, switchMap } from 'rxjs';
import { ProjectUserService } from 'src/app/projects/project-detail/project-users/service/project-user.service';
import { Model, ModelService } from 'src/app/services/model/model.service';
import {
  Project,
  ProjectService,
} from 'src/app/services/project/project.service';

@Component({
  selector: 'app-project-wrapper',
  templateUrl: './project-wrapper.component.html',
  styleUrls: ['./project-wrapper.component.css'],
})
export class ProjectWrapperComponent implements OnInit, OnDestroy {
  projectSubscription?: Subscription;
  modelsSubscription?: Subscription;
  projectUserSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    public projectService: ProjectService,
    public modelService: ModelService,
    private projectUserService: ProjectUserService
  ) {}

  ngOnInit(): void {
    const paramSubject = connectable<string>(
      this.route.params.pipe(map((params) => params.project)),
      {
        connector: () => new Subject(),
        resetOnDisconnect: false,
      }
    );

    this.projectSubscription = paramSubject
      .pipe(
        switchMap((projectSlug: string) =>
          this.projectService.getProjectBySlug(projectSlug)
        )
      )
      .subscribe({
        next: (project: Project) => this.projectService._project.next(project),
        error: () => {
          this.projectService._project.next(undefined);
        },
      });

    this.modelsSubscription = paramSubject
      .pipe(
        switchMap((projectSlug: string) =>
          this.modelService.getModels(projectSlug)
        )
      )
      .subscribe({
        next: (model: Model[]) => this.modelService._models.next(model),
        error: () => {
          this.modelService._models.next(undefined);
        },
      });

    this.projectUserSubscription = paramSubject
      .pipe(
        switchMap((projectSlug: string) =>
          this.projectUserService.getOwnProjectUser(projectSlug)
        )
      )
      .subscribe();

    paramSubject.connect();
  }

  ngOnDestroy(): void {
    this.projectSubscription?.unsubscribe();
    this.modelsSubscription?.unsubscribe();
    this.projectUserSubscription?.unsubscribe();
    this.projectService._project.next(undefined);
    this.modelService._models.next(undefined);
    this.projectUserService.projectUser.next(undefined);
  }
}

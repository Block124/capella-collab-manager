/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, switchMap, tap } from 'rxjs';
import { ModelService } from 'src/app/services/model/model.service';
import { ProjectService } from 'src/app/services/project/project.service';
import {
  ToolNature,
  ToolService,
  ToolVersion,
} from 'src/app/settings/core/tools-settings/tool.service';

@Component({
  selector: 'app-model-description',
  templateUrl: './model-description.component.html',
  styleUrls: ['./model-description.component.css'],
})
export class ModelDescriptionComponent implements OnInit {
  form = new FormGroup({
    description: new FormControl<string>(''),
    nature: new FormControl<number>(-1),
    version: new FormControl<number>(-1),
  });
  toolNatures?: ToolNature[];
  toolVersions?: ToolVersion[];

  constructor(
    public modelService: ModelService,
    public projectService: ProjectService,
    public toolService: ToolService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.modelService._model
      .pipe(filter(Boolean))
      .pipe(
        tap((model) => {
          this.form.patchValue({
            description: model.description,
            nature: model.nature?.id,
            version: model.version?.id,
          });
        }),
        switchMap((model) => {
          return combineLatest([
            this.toolService.getNaturesForTool(model.tool.id),
            this.toolService.getVersionsForTool(model.tool.id),
          ]);
        })
      )
      .subscribe((result: [ToolNature[], ToolVersion[]]) => {
        this.toolNatures = result[0];
        this.toolVersions = result[1];
      });
  }

  onSubmit(): void {
    if (
      this.form.value &&
      this.modelService.model &&
      this.projectService.project
    ) {
      this.modelService
        .updateModelDescription(
          this.projectService.project.slug,
          this.modelService.model.slug,
          {
            description: this.form.value.description || '',
            nature_id: this.form.value.nature || undefined,
            version_id: this.form.value.version || undefined,
          }
        )
        .pipe(
          switchMap((_model) =>
            this.modelService.getModels(this.projectService.project!.slug)
          )
        )
        .subscribe((models) => {
          this.modelService._models.next(models);
          this.router.navigate(['../../..'], { relativeTo: this.route });
        });
    }
  }
}

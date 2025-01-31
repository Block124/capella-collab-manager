/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavBarService } from 'src/app/general/navbar/service/nav-bar.service';
import {
  GitSetting,
  GitSettingsService,
} from 'src/app/services/settings/git-settings.service';

@Component({
  selector: 'app-edit-git-settings',
  templateUrl: './edit-git-settings.component.html',
  styleUrls: ['./edit-git-settings.component.css'],
})
export class EditGitSettingsComponent implements OnInit, OnDestroy {
  id: number = -1;

  gitSettingsForm = new FormGroup({
    type: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navbarService: NavBarService,
    private gitSettingsService: GitSettingsService
  ) {}

  private gitSettingsSubscription?: Subscription;
  private paramsSubscription?: Subscription;

  ngOnInit(): void {
    this.gitSettingsSubscription = this.gitSettingsService.gitSetting.subscribe(
      {
        next: (instance: GitSetting) => {
          this.gitSettingsForm.controls['type'].setValue(
            instance.type as string
          );
          this.gitSettingsForm.controls['name'].setValue(instance.name);
          this.gitSettingsForm.controls['url'].setValue(instance.url);
        },
      }
    );

    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.id = params['id'];
      if (!!this.id) {
        this.gitSettingsService.loadGitSettingById(this.id);
      }
      this.navbarService.title =
        'Settings / Modelsources / T4C / Instances / ' + this.id;
    });
  }

  ngOnDestroy(): void {
    this.gitSettingsSubscription?.unsubscribe();
    this.paramsSubscription?.unsubscribe();
  }

  editGitSettings() {
    this.gitSettingsService
      .editGitSettings(
        this.id,
        (this.gitSettingsForm.get('name') as FormControl).value,
        (this.gitSettingsForm.get('url') as FormControl).value,
        (this.gitSettingsForm.get('type') as FormControl).value
      )
      .subscribe((_) => this.goBack());
  }

  goBack(): void {
    this.router.navigateByUrl('/settings/modelsources/git');
  }
}

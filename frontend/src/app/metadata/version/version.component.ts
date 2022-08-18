/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BackendMetadata, Version, VersionService } from './version.service';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css'],
})
export class VersionComponent implements OnInit {
  backend: string = '-';
  frontend: string = '-';
  env: string = (environment as any)['environment'] || 'not specified';

  constructor(private versionService: VersionService) {}

  ngOnInit(): void {
    this.versionService.loadVersion().subscribe((version: Version) => {
      this.frontend = version.git.version;
    });

    this.versionService
      .loadBackendMetadata()
      .subscribe((metadata: BackendMetadata) => {
        this.backend = metadata.version;
      });
  }
}

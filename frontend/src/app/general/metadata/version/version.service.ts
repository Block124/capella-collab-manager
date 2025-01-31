/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { compare } from 'semver';
import { LocalStorageService } from 'src/app/general/auth/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';
import { ReleaseNote } from '../release-notes/release-note.service';
import { ReleaseNotesComponent } from '../release-notes/release-notes.component';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) {
    this.loadVersion();
  }

  public version: Version | undefined;
  public oldVersion: string | undefined;
  public changedVersion: boolean = false;

  loadVersion(): void {
    if (!this.version) {
      this.httpClient
        .get<Version>('assets/version.json')
        .subscribe((version: Version) => {
          this.version = version;
          this.determinateChangedVersion();
        });
    }
  }

  loadBackendMetadata(): Observable<BackendMetadata> {
    return this.httpClient.get<BackendMetadata>(
      environment.backend_url + '/metadata'
    );
  }

  determinateChangedVersion() {
    this.oldVersion = this.localStorageService.getValue('version');
    if (this.oldVersion != this.version?.git.tag) {
      this.changedVersion = true;
    }
  }

  compareFrontendVersionWithCurrent(version: string): number {
    /**
     * Compares a version with the current version
     * @param  {string} version  Version to compare with.
     * @return {number}          1 if version is higher, 0 if versions are equal, -1 if version is lower, -2 if error
     */
    if (this.version?.git.tag) {
      return this.compareFrontendVersions(version, this.version?.git.tag);
    } else {
      return -2;
    }
  }

  compareFrontendVersionWithOld(version: string) {
    if (this.oldVersion) {
      return this.compareFrontendVersions(version, this.oldVersion);
    } else {
      return -2;
    }
  }

  private compareFrontendVersions(version1: string, version2: string) {
    return compare(version1, version2);
  }

  openReleaseNotes(): void {
    this.dialog.open(ReleaseNotesComponent);
    this.localStorageService.setValue('version', this.version?.git.tag);
    this.changedVersion = false;
  }
}

export interface GitVersion {
  version: string;
  tag: string;
}

export interface Version {
  git: GitVersion;
  github: ReleaseNote[];
}

export interface BackendMetadata {
  version: string;
  tag: string;
}

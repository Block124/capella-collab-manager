/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Session } from '../../schemes';
import { BeautifyService } from '../../services/beatify/beautify.service';
import { OwnSessionService } from '../../services/own-session/own-session.service';
import { SessionService } from '../../services/session/session.service';
import { DeleteSessionDialogComponent } from '../delete-session-dialog/delete-session-dialog.component';
import { GuacamoleComponent } from '../session-created/guacamole/guacamole.component';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';

@Component({
  selector: 'app-active-sessions',
  templateUrl: './active-sessions.component.html',
  styleUrls: ['./active-sessions.component.css'],
})
export class ActiveSessionsComponent implements OnInit, OnDestroy {
  showSpinner = false;
  refreshSessionsSubscription: Subscription;

  constructor(
    public ownSessionService: OwnSessionService,
    private dialog: MatDialog,
    public sessionService: SessionService,
    public beautifyService: BeautifyService
  ) {
    this.refreshSessionsSubscription = timer(0, 2000)
      .pipe(
        map(() => {
          this.refreshSessions();
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.showSpinner = true;
  }

  ngOnDestroy(): void {
    this.refreshSessionsSubscription.unsubscribe();
  }

  refreshSessions() {
    this.ownSessionService.refreshSessions().subscribe(() => {
      this.showSpinner = false;
    });
  }

  openDeletionDialog(sessions: Session[]): void {
    const dialogRef = this.dialog.open(DeleteSessionDialogComponent, {
      data: sessions,
    });

    dialogRef.afterClosed().subscribe((_) => {
      this.refreshSessions();
    });
  }

  openConnectDialog(session: Session): void {
    this.dialog.open(GuacamoleComponent, {
      data: session,
    });
  }

  uploadFileDialog(session: Session): void {
    this.dialog.open(UploadDialogComponent, { data: session });
  }
}

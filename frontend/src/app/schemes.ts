/*
 * SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from 'src/app/services/project/project.service';
import { User } from 'src/app/services/user/user.service';
import { ToolVersionWithTool } from 'src/app/settings/core/tools-settings/tool.service';

export interface Session {
  created_at: string;
  id: string;
  last_seen: string;
  type: 'persistent' | 'readonly';
  rdp_username: string;
  rdp_password: string;
  guacamole_username: string;
  guacamole_password: string;
  guacamole_connection_id: string;
  project: Project | undefined;
  version: ToolVersionWithTool | undefined;
  state: string;
  owner: User;
  t4c_password: string;
}

export interface PathNode {
  path: string;
  name: string;
  type: 'file' | 'directory';
  isNew: boolean;
  children: PathNode[] | null;
}

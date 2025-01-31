# SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

import datetime
import enum
import typing as t

from pydantic import BaseModel

from capellacollab.core.models import Message
from capellacollab.projects.models import Project
from capellacollab.sessions.operators.k8s import FileType
from capellacollab.tools.models import ToolVersionWithTool
from capellacollab.users.models import BaseUser


class WorkspaceType(enum.Enum):
    PERSISTENT = "persistent"
    READONLY = "readonly"


class DepthType(enum.Enum):
    LatestCommit = "LatestCommit"
    CompleteHistory = "CompleteHistory"


class GetSessionsResponse(BaseModel):
    id: str
    type: WorkspaceType
    created_at: datetime.datetime
    owner: BaseUser
    state: str
    guacamole_username: str
    guacamole_connection_id: str
    warnings: t.Optional[list[Message]]
    last_seen: str
    project: t.Optional[Project]
    version: t.Optional[ToolVersionWithTool]

    class Config:
        orm_mode = True


class OwnSessionResponse(GetSessionsResponse):
    t4c_password: t.Optional[str]


class PostReadonlySessionRequest(BaseModel):
    model_slug: str

    class Config:
        orm_mode = True


class PostPersistentSessionRequest(BaseModel):
    tool_id: int
    version_id: int

    class Config:
        orm_mode = True


class GetSessionUsageResponse(BaseModel):
    free: int
    total: int

    class Config:
        orm_mode = True


class GuacamoleAuthentication(BaseModel):
    token: str
    url: str

    class Config:
        orm_mode = True


class FileTree(BaseModel):
    path: str
    name: str
    type: FileType
    children: t.Optional[list[FileTree]]

    class Config:
        orm_mode = True

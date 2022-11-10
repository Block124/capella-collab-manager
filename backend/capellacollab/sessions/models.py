# SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
# SPDX-License-Identifier: Apache-2.0


from sqlalchemy import (
    ARRAY,
    TIMESTAMP,
    Column,
    Enum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from capellacollab.core.database import Base
from capellacollab.projects.models import DatabaseProject
from capellacollab.sessions.schema import WorkspaceType


class DatabaseSession(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)
    owner_name = Column(String, ForeignKey("users.name"))
    owner = relationship("DatabaseUser")
    ports = Column(ARRAY(Integer))
    created_at = Column(TIMESTAMP)
    rdp_password = Column(String)
    guacamole_username = Column(String)
    guacamole_password = Column(String)
    guacamole_connection_id = Column(String)
    host = Column(String)
    type = Column(Enum(WorkspaceType), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    project = relationship(DatabaseProject)
    mac = Column(String)

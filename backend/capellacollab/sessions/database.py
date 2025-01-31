# SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
# SPDX-License-Identifier: Apache-2.0

from __future__ import annotations

from sqlalchemy.orm import Session

from capellacollab.sessions.models import DatabaseSession


def get_sessions_for_user(db: Session, username: str):
    return (
        db.query(DatabaseSession)
        .filter(DatabaseSession.owner_name == username)
        .all()
    )


def get_sessions_for_repository(db: Session, repository: str):
    return (
        db.query(DatabaseSession)
        .filter(DatabaseSession.repository == repository)
        .all()
    )


def get_session_by_id(db: Session, id: str) -> DatabaseSession | None:
    return db.query(DatabaseSession).filter(DatabaseSession.id == id).first()


def get_all_sessions(db: Session):
    return db.query(DatabaseSession).all()


def create_session(db: Session, session: DatabaseSession):
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def delete_session(db: Session, session: DatabaseSession):
    db.delete(session)
    db.commit()

# SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
# SPDX-License-Identifier: Apache-2.0


from sqlalchemy import select
from sqlalchemy.orm import Session

from capellacollab.extensions.modelsources.t4c.models import (
    DatabaseT4CModel,
    T4CRepositoryWithModels,
)
from capellacollab.settings.modelsources.t4c.repositories.models import (
    DatabaseT4CRepository,
)


def get_t4c_model(db: Session, id_: int):
    return db.execute(
        select(DatabaseT4CModel).where(DatabaseT4CModel.id == id_)
    ).scalar_one()


def get_t4c_model_by_id(db: Session, id: int, model_id: int):
    return (
        db.query(DatabaseT4CModel)
        .filter(DatabaseT4CModel.id == id)
        .filter(DatabaseT4CModel.model_id == model_id)
        .first()
    )


def get_all_t4c_models(db: Session, model_id: int):
    return (
        db.query(DatabaseT4CModel)
        .filter(DatabaseT4CModel.model_id == model_id)
        .all()
    )


def list_t4c_models_of_repository(
    db: Session, repository: DatabaseT4CRepository
):
    return T4CRepositoryWithModels.from_orm(repository)


def create_t4c_model(
    db: Session, model, repository, name: str
) -> DatabaseT4CModel:
    t4c_model = DatabaseT4CModel(name=name, model=model, repository=repository)
    db.add(t4c_model)
    db.commit()
    return t4c_model


def get_t4c_model(db: Session, t4c_model_id) -> DatabaseT4CModel:
    return db.execute(
        select(DatabaseT4CModel).where(DatabaseT4CModel.id == t4c_model_id)
    ).scalar_one()


def patch_t4c_model(
    db: Session, t4c_model: DatabaseT4CModel
) -> DatabaseT4CModel:
    db.add(t4c_model)
    db.commit()
    db.refresh(t4c_model)
    return t4c_model


def delete_project(db: Session, id: int, repo_name: str):
    db.query(DatabaseT4CModel).filter(DatabaseT4CModel.id == id).filter(
        DatabaseT4CModel.repository_name == repo_name
    ).delete()
    db.commit()

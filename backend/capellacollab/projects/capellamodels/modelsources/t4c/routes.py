# SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
# SPDX-License-Identifier: Apache-2.0


import typing as t

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, NoResultFound

import capellacollab.core.database as database
import capellacollab.projects.capellamodels.modelsources.t4c.crud as database_projects
from capellacollab.core.authentication.database import (
    verify_admin,
    verify_project_role,
)
from capellacollab.core.authentication.jwt_bearer import JWTBearer
from capellacollab.extensions.modelsources.t4c import crud
from capellacollab.extensions.modelsources.t4c.injectables import (
    load_project_model,
)
from capellacollab.extensions.modelsources.t4c.models import (
    SubmitT4CModel,
    T4CModel,
    T4CRepositoryWithModels,
)
from capellacollab.projects.capellamodels.models import DatabaseCapellaModel
from capellacollab.projects.models import DatabaseProject
from capellacollab.settings.modelsources.t4c.injectables import load_instance
from capellacollab.settings.modelsources.t4c.repositories.routes import (
    load_instance_repository,
)

router = APIRouter()


@router.get(
    "/",
    responses=AUTHENTICATION_RESPONSES,
    response_model=list[T4CModel],
)
def list_t4c_models(
    t4c_instance_id: int,
    t4c_repository_id: int,
    db: Session = Depends(database.get_db),
    token: JWTBearer = Depends(JWTBearer()),
):
    verify_admin(token, db)
    instance = load_instance(t4c_instance_id, db)
    repository = load_instance_repository(t4c_repository_id, db, instance)[1]
    return T4CRepositoryWithModels.from_orm(repository).models


@router.get("/{t4c_model_id}/", response_model=T4CModel)
def get_t4c_model(
    t4c_model_id: int,
    db: Session = Depends(database.get_db),
):
    return crud.get_t4c_model(db, t4c_model_id)


@router.post(
    "/",
)
def create_t4c_model(
    body: SubmitT4CModel,
    project_model: tuple[DatabaseProject, DatabaseCapellaModel] = Depends(
        load_project_model
    ),
    db: Session = Depends(database.get_db),
    token=Depends(JWTBearer()),
):
    verify_admin(token, db)
    instance = load_instance(body.t4c_instance_id, db)
    repository = load_instance_repository(
        body.t4c_repository_id, db, instance
    )[1]
    try:
        return crud.create_t4c_model(
            db, project_model[1], repository, body.name
        )
    except IntegrityError:
        raise HTTPException(
            409,
            {
                "reason": f"A model named {body.name} already exists in the repository {repository.name}."
            },
        )


@router.patch("/{t4c_model_id}", responses=AUTHENTICATION_RESPONSES)
def edit_t4c_model(
    t4c_model_id: int,
    body: SubmitT4CModel,
    project_model: tuple[DatabaseProject, DatabaseCapellaModel] = Depends(
        load_project_model
    ),
    db: Session = Depends(database.get_db),
    token=Depends(JWTBearer()),
):
    verify_admin(token, db)
    instance = load_instance(body.t4c_instance_id, db)
    repository = load_instance_repository(
        body.t4c_repository_id, db, instance
    )[1]
    try:
        t4c_model = crud.get_t4c_model(
            db, project_model[1], repository, t4c_model_id
        )
    except NoResultFound:
        raise HTTPException(
            404,
            {
                "reason": f"The model with the id {t4c_model_id} does not exist."
            },
        )
    for key in body.dict():
        if value := body.__getattribute__(key):
            t4c_model.__setattr__(key, value)
    try:
        return crud.patch_t4c_model(db, t4c_model)
    except IntegrityError:
        raise HTTPException(
            409,
            {
                "reason": f"A model named {body.name} already exists in the repository {repository.name}."
            },
        )

import importlib
import logging
from importlib import metadata

from fastapi import APIRouter
from t4cclient.config import config

from ..core.authentication.provider.azure import routes
from . import notices, repositories, sessions, sync, users

log = logging.getLogger(__name__)


router = APIRouter()
router.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
router.include_router(sync.router, prefix="/sync", tags=["T4C Server Synchronization"])
router.include_router(repositories.router, prefix="/projects")
router.include_router(users.router, prefix="/users", tags=["Users"])
router.include_router(notices.router, prefix="/notices", tags=["Notices"])

# Load authentication routes
try:
    ep = next(
        i
        for i in metadata.entry_points()["capellacollab.authentication.providers"]
        if i.name == config["authentication"]["provider"]
    )
except StopIteration:
    raise ValueError(
        f"Unknown authentication provider " + config["authentication"]["provider"]
    ) from None

router.include_router(
    importlib.import_module(".routes", ep.module).router,
    prefix="/authentication",
    tags=[ep.name],
)

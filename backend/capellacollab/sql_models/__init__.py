# SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
# SPDX-License-Identifier: Apache-2.0


import importlib
import logging
from importlib import metadata

# These import statements of the models are required and should not be removed! (SQLAlchemy will not load the models otherwise)
import capellacollab.projects.models
from capellacollab.config import models
from capellacollab.notices import models
from capellacollab.users import models

log = logging.getLogger(__name__)

# Load models of modelsources
eps = metadata.entry_points()["capellacollab.settings.modelsources"]
for ep in eps:
    log.info("Import models of extension %s", ep.name)
    try:
        importlib.import_module(".models", ep.module)
    except ModuleNotFoundError:
        log.error("Ignore module %s.models. Module not found.")

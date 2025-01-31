<!--
 ~ SPDX-FileCopyrightText: Copyright DB Netz AG and the capella-collab-manager contributors
 ~ SPDX-License-Identifier: Apache-2.0
 -->

In order to make the whole backend more consistent, it is divided into different modules.
This is intended to ensure that these are outsourced easily and without major effects
and that other modules can also be easily added as "plugins", e.g.,
via [Python entrypoints](https://docs.python.org/3/library/importlib.metadata.html).

A extension has the following structure: <br>

```bash
extension
├── __init__.py
├── crud.py
├── models.py
├── routes.py
└── ...
```

The different components are explained in the following section.

## Extension modules

### `__init__.py`

Code to be called to initialize a module.

### `crud.py`

All `CRUD` (Create, read, update and delete) related operations.
They should be used to access the database.

There should not be much logic in the `crud.py` files
(really just creating, reading, updating and deleting) models in the database.

### `models.py`

In the `models` module, all `pydantic` and `SQLAlchemy` models should be defined.
In general, we use the `Database` prefix for `SQLAlchemy` models, e.g., `DatabaseProject`.

### `routes.py`

The `routes` module should include all fastAPI routes.

### `...`

Other submodules can of course be created and are usually also useful if logic needs to be implemented.

## Entrypoints

Core modules are directly imported in the code. However, for modules that change
frequently or should be interchangeable, we use Python entrypoints.

A entrypoint can be defined in the `pyproject.toml` file:

```py title="pyproject.toml"
[project.entry-points."capellacollab.extensions"]
extension1 = "path.to.extension1"
extension2 = "path.to.extension2"
```

The `routes` and `models` components are then imported in the code:
For example, to include the routers, we use the following code:

```py title="routes.py"
eps = metadata.entry_points()["capellacollab.extensions"]
for ep in eps:
    log.info("Add routes of extension %s", ep.name)
    router.include_router(
        importlib.import_module(".routes", ep.module).router,
        prefix="/{project}/extensions/" + ep.name,
        tags=[ep.name],
    )
```

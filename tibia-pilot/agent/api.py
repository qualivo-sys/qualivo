"""Superficie HTTP que consume n8n.

Deliberadamente pequena. n8n lee estado y escribe configuracion; nunca toca
el juego directamente.
"""
from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel

from .config import SharedConfig
from .loop import ControlLoop
from .state import Action


class ConfigPatch(BaseModel):
    updates: dict[str, Any]


class CommandRequest(BaseModel):
    kind: str
    params: dict[str, Any] = {}


def create_app(loop: ControlLoop, config: SharedConfig) -> FastAPI:
    app = FastAPI(title="Tibia pilot agent", version="0.1.0")

    @app.get("/health")
    def health() -> dict[str, Any]:
        return {"ok": True, "ticks": loop.metrics.ticks}

    @app.get("/status")
    def status() -> dict[str, Any]:
        return loop.status()

    @app.get("/metrics")
    def metrics() -> dict[str, Any]:
        return loop.metrics.to_dict()

    @app.get("/config")
    def get_config() -> dict[str, Any]:
        return config.to_dict()

    @app.post("/config")
    def patch_config(patch: ConfigPatch) -> dict[str, Any]:
        applied = config.patch(patch.updates)
        ignored = sorted(set(patch.updates) - set(applied))
        return {"applied": applied, "ignored": ignored}

    @app.post("/pause")
    def pause() -> dict[str, Any]:
        config.patch({"paused": True})
        return {"paused": True}

    @app.post("/resume")
    def resume() -> dict[str, Any]:
        config.patch({"paused": False})
        return {"paused": False}

    @app.post("/command")
    def command(req: CommandRequest) -> dict[str, Any]:
        """Accion puntual desde el supervisor. Se marca source=supervisor para
        que en el dataset se distinga de lo que decidio la policy."""
        action = Action(req.kind, req.params, source="supervisor")
        loop.bridge.send([action])
        return {"sent": action.to_dict()}

    return app

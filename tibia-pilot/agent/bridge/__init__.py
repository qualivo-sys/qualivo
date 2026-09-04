"""Capa de transporte: lo unico que sabe como es el juego por dentro.

Cambiar de OTClient a cliente oficial (captura de pantalla) significa escribir
un Bridge nuevo. Nada mas del sistema cambia.
"""
from __future__ import annotations

from typing import Protocol, Sequence

from ..state import Action, GameState


class Bridge(Protocol):
    def connect(self) -> None: ...

    def read_state(self) -> GameState | None:
        """Ultimo estado conocido. No bloquea; None si aun no hay nada."""

    def observed_actions(self) -> list[Action]:
        """Acciones que hizo el HUMANO desde la ultima llamada (modo record)."""

    def send(self, actions: Sequence[Action]) -> None: ...

    def close(self) -> None: ...

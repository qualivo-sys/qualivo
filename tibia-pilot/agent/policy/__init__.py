from __future__ import annotations

from typing import Protocol

from ..config import Config
from ..state import Action, GameState


class Policy(Protocol):
    def decide(self, state: GameState, config: Config) -> list[Action]: ...

    def reset(self) -> None: ...


class NullPolicy:
    """No hace nada. Es la policy del modo `record`: el humano juega, nosotros
    solo miramos y grabamos."""

    def decide(self, state: GameState, config: Config) -> list[Action]:
        return []

    def reset(self) -> None:
        return None

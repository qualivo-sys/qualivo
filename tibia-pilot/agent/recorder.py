"""Grabador del dataset (fase 1).

Un JSONL por sesion, una linea por tick. Formato deliberadamente redundante y
legible: en esta fase el coste de disco no importa y el coste de un dataset mal
formado es rehacer las 2 horas de hunt.
"""
from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Sequence

from .state import Action, GameState


class Recorder:
    def __init__(self, path: str | Path, flush_every: int = 100) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._fh = self.path.open("a", encoding="utf-8")
        self._flush_every = flush_every
        self._since_flush = 0
        self.lines = 0

    def record(self, state: GameState, actions: Sequence[Action]) -> None:
        # Ticks sin accion tambien se graban: "no hacer nada" es una decision y
        # el modelo tiene que aprenderla, no solo los momentos interesantes.
        self._fh.write(json.dumps({
            "wall": time.time(),
            "state": state.to_dict(),
            "actions": [a.to_dict() for a in actions],
        }, ensure_ascii=False) + "\n")
        self.lines += 1
        self._since_flush += 1
        if self._since_flush >= self._flush_every:
            self._fh.flush()
            self._since_flush = 0

    def close(self) -> None:
        self._fh.flush()
        self._fh.close()

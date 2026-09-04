"""El bucle rapido.

Corre a tick_hz (20 Hz por defecto) en su propio hilo. No hace red, no hace
LLM, no hace disco sincrono mas alla del recorder. Todo lo lento vive detras
de una cola.

El criterio go/no-go de la fase 0 se mide aqui: p95 de duracion de tick y
porcentaje de overruns.
"""
from __future__ import annotations

import statistics
import threading
import time
from collections import deque
from typing import Any

from .bridge import Bridge
from .config import SharedConfig
from .events import EventEmitter
from .policy import Policy
from .recorder import Recorder
from .state import Action, GameState


class Metrics:
    def __init__(self, window: int = 2000) -> None:
        self.ticks = 0
        self.overruns = 0
        self.deaths = 0
        self.actions_sent = 0
        self.durations: deque[float] = deque(maxlen=window)
        self.started = time.monotonic()
        self.experience_start: int | None = None
        self.experience_last: int = 0

    def observe_tick(self, duration: float, budget: float) -> None:
        self.ticks += 1
        self.durations.append(duration)
        if duration > budget:
            self.overruns += 1

    def observe_state(self, state: GameState) -> None:
        if self.experience_start is None:
            self.experience_start = state.experience
        self.experience_last = state.experience

    @property
    def uptime_s(self) -> float:
        return time.monotonic() - self.started

    @property
    def xp_per_hour(self) -> float:
        if self.experience_start is None or self.uptime_s < 1:
            return 0.0
        return (self.experience_last - self.experience_start) * 3600.0 / self.uptime_s

    def to_dict(self) -> dict[str, Any]:
        d = sorted(self.durations)
        def pct(p: float) -> float:
            return round(d[min(len(d) - 1, int(len(d) * p))] * 1000, 3) if d else 0.0
        return {
            "ticks": self.ticks,
            "uptime_s": round(self.uptime_s, 1),
            "overruns": self.overruns,
            "overrun_pct": round(100.0 * self.overruns / self.ticks, 2) if self.ticks else 0.0,
            "tick_ms_p50": pct(0.50),
            "tick_ms_p95": pct(0.95),
            "tick_ms_max": round(max(d) * 1000, 3) if d else 0.0,
            "deaths": self.deaths,
            "actions_sent": self.actions_sent,
            "experience_gained": (self.experience_last - (self.experience_start or 0)),
            "xp_per_hour": round(self.xp_per_hour, 1),
        }


class ControlLoop:
    def __init__(
        self,
        bridge: Bridge,
        policy: Policy,
        config: SharedConfig,
        emitter: EventEmitter,
        recorder: Recorder | None = None,
    ) -> None:
        self.bridge = bridge
        self.policy = policy
        self.config = config
        self.emitter = emitter
        self.recorder = recorder
        self.metrics = Metrics()
        self.last_state: GameState | None = None
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None
        self._was_alive = True
        self._summary_at = 0.0

    def start(self) -> None:
        self._thread = threading.Thread(target=self.run, name="control-loop", daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread is not None:
            self._thread.join(timeout=2.0)

    def run(self, max_ticks: int | None = None) -> None:
        self.bridge.connect()
        while not self._stop.is_set():
            cfg = self.config.snapshot()
            budget = 1.0 / max(1.0, cfg.tick_hz)
            t0 = time.monotonic()

            self.tick(cfg_snapshot=cfg)

            if max_ticks is not None and self.metrics.ticks >= max_ticks:
                return
            remaining = budget - (time.monotonic() - t0)
            if remaining > 0:
                self._stop.wait(remaining)

    def tick(self, cfg_snapshot=None) -> None:
        """Un ciclo completo. Se mide a si mismo: las metricas de latencia
        tienen que salir igual conduzca el bucle run() o un test."""
        cfg = cfg_snapshot if cfg_snapshot is not None else self.config.snapshot()
        t0 = time.monotonic()
        try:
            self._tick_body(cfg)
        finally:
            self.metrics.observe_tick(time.monotonic() - t0, 1.0 / max(1.0, cfg.tick_hz))

    def _tick_body(self, cfg) -> None:
        state = self.bridge.read_state()
        if state is None:
            return
        self.last_state = state
        self.metrics.observe_state(state)

        observed = self.bridge.observed_actions()
        self._detect_events(state, cfg)

        actions: list[Action] = []
        if not cfg.paused and state.connected and state.alive:
            actions = self.policy.decide(state, cfg)
            if actions:
                self.bridge.send(actions)
                self.metrics.actions_sent += len(actions)

        if self.recorder is not None:
            self.recorder.record(state, list(observed) + actions)

    def _detect_events(self, state: GameState, cfg) -> None:
        # Muerte: transicion vivo -> muerto, no "esta muerto" (que se repetiria
        # 20 veces por segundo durante toda la pantalla de muerte).
        if self._was_alive and not state.alive:
            self.metrics.deaths += 1
            self.emitter.emit("death", {
                "position": {"x": state.x, "y": state.y, "z": state.z},
                "monsters_adjacent": [c.name for c in state.adjacent_monsters()],
                "metrics": self.metrics.to_dict(),
            })
        self._was_alive = state.alive

        if not state.alive:
            return

        adjacent = state.adjacent_monsters()
        if len(adjacent) >= cfg.surrounded_threshold:
            self.emitter.emit("surrounded", {
                "count": len(adjacent),
                "names": [c.name for c in adjacent],
                "hp_pct": round(state.hp_pct, 3),
            }, debounce_s=10.0)
            if cfg.panic_logout and state.hp_pct <= cfg.emergency_at_pct:
                self.bridge.send([Action.logout()])

        hp_pots = state.item_count(cfg.health_potion)
        mp_pots = state.item_count(cfg.mana_potion)
        if hp_pots < cfg.min_health_potions or mp_pots < cfg.min_mana_potions:
            self.emitter.emit("low_supplies", {
                "health_potions": hp_pots, "mana_potions": mp_pots,
            }, debounce_s=60.0)

        if state.players:
            self.emitter.emit("player_nearby", {
                "names": [c.name for c in state.players],
            }, debounce_s=120.0)

        now = time.monotonic()
        if now - self._summary_at >= 300.0:
            self._summary_at = now
            self.emitter.emit("session_summary", self.metrics.to_dict())

    def status(self) -> dict[str, Any]:
        state = self.last_state
        return {
            "paused": self.config.snapshot().paused,
            "metrics": self.metrics.to_dict(),
            "state": state.to_dict() if state is not None else None,
            "events": {
                "sent": self.emitter.sent,
                "dropped": self.emitter.dropped,
                "failed": self.emitter.failed,
            },
        }

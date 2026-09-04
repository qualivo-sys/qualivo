"""Configuracion mutable en caliente.

Todo lo que n8n puede tocar via POST /config vive aqui. Nada de esto se lee
de disco en el bucle rapido: se muta en memoria bajo un lock.
"""
from __future__ import annotations

import threading
from dataclasses import dataclass, field, asdict, fields
from typing import Any


@dataclass
class Config:
    # --- umbrales de supervivencia ---
    heal_at_pct: float = 0.70
    emergency_at_pct: float = 0.35
    mana_at_pct: float = 0.40

    # --- hechizos e items ---
    # Un caballero se cura con potions y usa el hechizo de apoyo; un mago al
    # reves. Esta bandera es la que distingue a los dos.
    prefer_potion_over_spell: bool = False
    heal_spell: str = "exura"
    heal_spell_cost: int = 20
    strong_heal_spell: str = "exura gran"
    strong_heal_spell_cost: int = 80
    health_potion: str = "health potion"
    mana_potion: str = "mana potion"

    # --- cooldowns (s) ---
    spell_cooldown_s: float = 1.0
    potion_cooldown_s: float = 1.0

    # --- ataque en area (exori y equivalentes) ---
    # Vacio = desactivado. Solo compensa con varios enemigos pegados encima.
    area_attack_spell: str = ""
    area_attack_cost: int = 0
    area_attack_min_targets: int = 3
    area_attack_cooldown_s: float = 2.0

    # --- targeting ---
    target_priority: list[str] = field(default_factory=lambda: ["dragon", "cyclops", "rotworm"])
    max_target_distance: int = 4
    attack_players: bool = False

    # --- seguridad ---
    surrounded_threshold: int = 4
    panic_logout: bool = False
    # Sin mana y sin potions no se puede sostener el hunt: seguir pegando solo
    # adelanta la muerte. El bucle rapido se retira; que hacer despues (ir a
    # reponer, cambiar de zona, parar) lo decide el supervisor.
    logout_when_unsustainable: bool = True
    min_health_potions: int = 20
    min_mana_potions: int = 20

    # --- bucle ---
    tick_hz: float = 20.0
    paused: bool = False

    def patch(self, updates: dict[str, Any]) -> dict[str, Any]:
        """Aplica solo claves conocidas y devuelve las que se aplicaron.

        Ignorar claves desconocidas en vez de reventar es deliberado: el
        supervisor LLM se inventara nombres de campo antes o despues.
        """
        known = {f.name: f.type for f in fields(self)}
        applied: dict[str, Any] = {}
        for key, value in updates.items():
            if key not in known:
                continue
            current = getattr(self, key)
            # Coaccion minima para no acabar con "0.7" (str) como umbral.
            if isinstance(current, bool):
                value = bool(value)
            elif isinstance(current, int) and not isinstance(value, bool):
                value = int(value)
            elif isinstance(current, float):
                value = float(value)
            elif isinstance(current, list):
                value = list(value)
            setattr(self, key, value)
            applied[key] = value
        return applied

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class SharedConfig:
    """Wrapper con lock: el bucle rapido lee, la API escribe."""

    def __init__(self, config: Config | None = None) -> None:
        self._config = config or Config()
        self._lock = threading.Lock()

    def snapshot(self) -> Config:
        with self._lock:
            return Config(**asdict(self._config))

    def patch(self, updates: dict[str, Any]) -> dict[str, Any]:
        with self._lock:
            return self._config.patch(updates)

    def to_dict(self) -> dict[str, Any]:
        with self._lock:
            return self._config.to_dict()

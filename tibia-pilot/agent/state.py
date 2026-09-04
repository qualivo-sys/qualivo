"""Modelo de datos compartido por bridge, policy, recorder y API.

Todo lo que cruza una frontera del sistema pasa por aqui. Es deliberadamente
plano y serializable: el dataset de la fase 1 son estos mismos objetos en JSONL.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

# Distancia Chebyshev: en Tibia el mapa es una rejilla y la diagonal cuesta
# lo mismo que la ortogonal, asi que "adyacente" es distance == 1.
def chebyshev(dx: int, dy: int) -> int:
    return max(abs(dx), abs(dy))


@dataclass(frozen=True)
class Creature:
    id: int
    name: str
    hp_pct: float
    dx: int
    dy: int
    dz: int = 0
    is_player: bool = False

    @property
    def distance(self) -> int:
        return chebyshev(self.dx, self.dy)

    @property
    def same_floor(self) -> bool:
        return self.dz == 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id, "name": self.name, "hp_pct": round(self.hp_pct, 3),
            "dx": self.dx, "dy": self.dy, "dz": self.dz, "is_player": self.is_player,
        }

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "Creature":
        return cls(
            id=int(d["id"]), name=str(d["name"]), hp_pct=float(d.get("hp_pct", 1.0)),
            dx=int(d["dx"]), dy=int(d["dy"]), dz=int(d.get("dz", 0)),
            is_player=bool(d.get("is_player", False)),
        )


@dataclass(frozen=True)
class GameState:
    t: float
    hp: int
    max_hp: int
    mana: int
    max_mana: int
    x: int
    y: int
    z: int
    creatures: tuple[Creature, ...] = ()
    inventory: dict[str, int] = field(default_factory=dict)
    target_id: int | None = None
    experience: int = 0
    connected: bool = True

    @property
    def hp_pct(self) -> float:
        return self.hp / self.max_hp if self.max_hp else 0.0

    @property
    def mana_pct(self) -> float:
        return self.mana / self.max_mana if self.max_mana else 0.0

    @property
    def alive(self) -> bool:
        return self.hp > 0

    @property
    def monsters(self) -> tuple[Creature, ...]:
        return tuple(c for c in self.creatures if not c.is_player and c.same_floor)

    @property
    def players(self) -> tuple[Creature, ...]:
        return tuple(c for c in self.creatures if c.is_player and c.same_floor)

    def adjacent_monsters(self) -> tuple[Creature, ...]:
        return tuple(c for c in self.monsters if c.distance <= 1)

    def target(self) -> Creature | None:
        if self.target_id is None:
            return None
        return next((c for c in self.creatures if c.id == self.target_id), None)

    def item_count(self, name: str) -> int:
        return int(self.inventory.get(name, 0))

    def to_dict(self) -> dict[str, Any]:
        return {
            "t": round(self.t, 4), "hp": self.hp, "max_hp": self.max_hp,
            "mana": self.mana, "max_mana": self.max_mana,
            "x": self.x, "y": self.y, "z": self.z,
            "creatures": [c.to_dict() for c in self.creatures],
            "inventory": dict(self.inventory), "target_id": self.target_id,
            "experience": self.experience, "connected": self.connected,
        }

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "GameState":
        return cls(
            t=float(d["t"]), hp=int(d["hp"]), max_hp=int(d["max_hp"]),
            mana=int(d["mana"]), max_mana=int(d["max_mana"]),
            x=int(d["x"]), y=int(d["y"]), z=int(d["z"]),
            creatures=tuple(Creature.from_dict(c) for c in d.get("creatures", [])),
            inventory=dict(d.get("inventory", {})),
            target_id=d.get("target_id"),
            experience=int(d.get("experience", 0)),
            connected=bool(d.get("connected", True)),
        )


@dataclass(frozen=True)
class Action:
    """Una accion atomica. `source` distingue quien la origino, que es lo que
    hace utilizable el mismo formato para el dataset de imitacion (human) y
    para la telemetria del bot (policy / supervisor)."""

    kind: str  # cast | use_item | attack | walk | say | logout | idle
    params: dict[str, Any] = field(default_factory=dict)
    source: str = "policy"  # policy | human | supervisor

    # Constructores con nombre: evitan strings sueltos por todo el codigo.
    @staticmethod
    def cast(words: str, source: str = "policy") -> "Action":
        return Action("cast", {"words": words}, source)

    @staticmethod
    def use_item(name: str, source: str = "policy") -> "Action":
        return Action("use_item", {"name": name}, source)

    @staticmethod
    def attack(creature_id: int, source: str = "policy") -> "Action":
        return Action("attack", {"creature_id": creature_id}, source)

    @staticmethod
    def walk(direction: str, source: str = "policy") -> "Action":
        return Action("walk", {"direction": direction}, source)

    @staticmethod
    def logout(source: str = "policy") -> "Action":
        return Action("logout", {}, source)

    def to_dict(self) -> dict[str, Any]:
        return {"kind": self.kind, "params": dict(self.params), "source": self.source}

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> "Action":
        return cls(str(d["kind"]), dict(d.get("params", {})), str(d.get("source", "policy")))

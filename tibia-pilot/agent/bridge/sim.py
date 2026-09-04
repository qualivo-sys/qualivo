"""Simulador de hunt: cierra el bucle sin necesidad de juego.

No pretende ser fiel a Tibia. Pretende ser suficientemente hostil como para
que un fallo en la policy (spam de heal, no curarse a tiempo, no cambiar de
target) se manifieste como una muerte. Es el banco de pruebas de la fase 0/2.
"""
from __future__ import annotations

import random
import time
from typing import Callable, Sequence

from ..state import Action, Creature, GameState

# nombre, hp, dano max por golpe, exp
MONSTERS = [
    ("rotworm", 65, 30, 40),
    ("cyclops", 260, 60, 150),
    ("dragon", 1000, 120, 700),
]

PLAYER_ATTACK_INTERVAL = 2.0
MONSTER_ATTACK_INTERVAL = 2.0
MONSTER_STEP_INTERVAL = 0.9
DEATH_DOWNTIME = 3.0


class SimBridge:
    def __init__(
        self,
        seed: int = 0,
        spawn_target: int = 2,
        burst_every: float = 90.0,
        clock: Callable[[], float] | None = None,
        max_hp: int = 800,
        max_mana: int = 600,
        inventory: dict[str, int] | None = None,
    ) -> None:
        # El reloj es inyectable para poder simular horas de hunt en segundos
        # durante los tests, en vez de esperarlas en tiempo real.
        self._clock = clock or time.monotonic
        self.rng = random.Random(seed)
        self.max_hp = max_hp
        self.max_mana = max_mana
        self.hp = self.max_hp
        self.mana = self.max_mana
        self.x, self.y, self.z = 1000, 1000, 7
        self.experience = 0
        self.inventory = dict(inventory) if inventory is not None \
            else {"health potion": 200, "mana potion": 200}
        self.target_id: int | None = None
        self.connected = True

        self._monsters: dict[int, dict] = {}
        self._next_id = 1
        self._spawn_target = spawn_target
        self._burst_every = burst_every
        self._now = 0.0
        self._wall0 = self._clock()
        self._last_player_attack = 0.0
        self._last_spawn = 0.0
        self._last_burst = 0.0
        self._cooldowns: dict[str, float] = {}
        self._dead_until = 0.0

        # metricas que solo el simulador conoce (ground truth del piloto)
        self.deaths = 0
        self.kills = 0
        self.heals_cast = 0
        self.potions_used = 0
        self.wasted_casts = 0  # casts rechazados por cooldown o mana: spam
        self.area_casts = 0

    # ---------------- Bridge protocol ----------------

    def connect(self) -> None:
        self._wall0 = self._clock()

    def observed_actions(self) -> list[Action]:
        return []  # no hay humano en el simulador

    def close(self) -> None:
        self.connected = False

    def read_state(self) -> GameState:
        self._advance(self._clock() - self._wall0)
        creatures = tuple(
            Creature(
                id=mid, name=m["name"],
                hp_pct=m["hp"] / m["max_hp"],
                dx=m["x"] - self.x, dy=m["y"] - self.y, dz=0,
            )
            for mid, m in self._monsters.items()
        )
        return GameState(
            t=self._now, hp=max(0, self.hp), max_hp=self.max_hp,
            mana=max(0, self.mana), max_mana=self.max_mana,
            x=self.x, y=self.y, z=self.z,
            creatures=creatures, inventory=dict(self.inventory),
            target_id=self.target_id, experience=self.experience,
            connected=self.connected and self._now >= self._dead_until,
        )

    def send(self, actions: Sequence[Action]) -> None:
        if self.hp <= 0:
            return
        for action in actions:
            self._apply(action)

    # ---------------- interno ----------------

    def _apply(self, action: Action) -> None:
        if action.kind == "cast":
            words = action.params.get("words", "")
            if not self._consume_cooldown("spell", 1.0):
                self.wasted_casts += 1
                return
            if words == "exura" and self.mana >= 20:
                self.mana -= 20
                self.hp = min(self.max_hp, self.hp + self.rng.randint(80, 120))
                self.heals_cast += 1
            elif words == "exura gran" and self.mana >= 80:
                self.mana -= 80
                self.hp = min(self.max_hp, self.hp + self.rng.randint(200, 300))
                self.heals_cast += 1
            elif words == "exura ico" and self.mana >= 70:
                self.mana -= 70
                self.hp = min(self.max_hp, self.hp + self.rng.randint(180, 260))
                self.heals_cast += 1
            elif words == "exori" and self.mana >= 115:
                self.mana -= 115
                self.area_casts += 1
                self._golpe_en_area()
            else:
                self.wasted_casts += 1

        elif action.kind == "use_item":
            name = action.params.get("name", "")
            if self.inventory.get(name, 0) <= 0:
                self.wasted_casts += 1
                return
            if not self._consume_cooldown("potion", 1.0):
                self.wasted_casts += 1
                return
            self.inventory[name] -= 1
            self.potions_used += 1
            if "health potion" in name:
                cura = (250, 400) if "strong" in name else (150, 250)
                self.hp = min(self.max_hp, self.hp + self.rng.randint(*cura))
            elif "mana potion" in name:
                gana = (150, 250) if "strong" in name else (80, 160)
                self.mana = min(self.max_mana, self.mana + self.rng.randint(*gana))

        elif action.kind == "attack":
            cid = action.params.get("creature_id")
            self.target_id = cid if cid in self._monsters else None

        elif action.kind == "walk":
            dx, dy = {"north": (0, -1), "south": (0, 1), "east": (1, 0), "west": (-1, 0)}.get(
                action.params.get("direction", ""), (0, 0)
            )
            self.x += dx
            self.y += dy

        elif action.kind == "logout":
            self.connected = False

    def _golpe_en_area(self) -> None:
        """Exori: dana a todo lo adyacente. Por eso solo compensa con varios."""
        for mid in list(self._monsters):
            m = self._monsters[mid]
            if max(abs(m["x"] - self.x), abs(m["y"] - self.y)) > 1:
                continue
            m["hp"] -= self.rng.randint(70, 130)
            if m["hp"] <= 0:
                self.experience += m["exp"]
                self.kills += 1
                del self._monsters[mid]
                if self.target_id == mid:
                    self.target_id = None

    def _consume_cooldown(self, key: str, cd: float) -> bool:
        if self._now < self._cooldowns.get(key, 0.0):
            return False
        self._cooldowns[key] = self._now + cd
        return True

    def _advance(self, now: float) -> None:
        dt = now - self._now
        if dt <= 0:
            return
        self._now = now

        if self.hp <= 0:
            if now >= self._dead_until:
                self.hp = self.max_hp
                self.mana = self.max_mana
                self._monsters.clear()
                self.target_id = None
            return

        # regeneracion lenta, como en el juego
        self.hp = min(self.max_hp, self.hp + int(dt * 2))
        self.mana = min(self.max_mana, self.mana + int(dt * 4))

        # Deslogueado: el personaje sale del mundo. Sigue regenerando, pero ni
        # le atacan ni ataca. Volver a entrar y reponer es cosa del supervisor.
        if not self.connected:
            self._monsters.clear()
            self.target_id = None
            return

        self._spawn(now)
        self._move_monsters(now)
        self._monsters_attack(now)
        self._player_attacks(now)

    def _spawn(self, now: float) -> None:
        burst = now - self._last_burst >= self._burst_every
        target = self._spawn_target + (4 if burst else 0)
        if burst:
            self._last_burst = now
        if len(self._monsters) >= target or now - self._last_spawn < 1.5:
            return
        self._last_spawn = now
        name, hp, dmg, exp = self.rng.choice(MONSTERS)
        mid = self._next_id
        self._next_id += 1
        self._monsters[mid] = {
            "name": name, "hp": hp, "max_hp": hp, "dmg": dmg, "exp": exp,
            "x": self.x + self.rng.randint(-6, 6), "y": self.y + self.rng.randint(-6, 6),
            "last_attack": now, "last_step": now,
        }

    def _move_monsters(self, now: float) -> None:
        for m in self._monsters.values():
            if now - m["last_step"] < MONSTER_STEP_INTERVAL:
                continue
            m["last_step"] = now
            if abs(m["x"] - self.x) > 1 or abs(m["y"] - self.y) > 1:
                m["x"] += (self.x > m["x"]) - (self.x < m["x"])
                m["y"] += (self.y > m["y"]) - (self.y < m["y"])

    def _monsters_attack(self, now: float) -> None:
        for m in self._monsters.values():
            adjacent = max(abs(m["x"] - self.x), abs(m["y"] - self.y)) <= 1
            if not adjacent or now - m["last_attack"] < MONSTER_ATTACK_INTERVAL:
                continue
            m["last_attack"] = now
            self.hp -= self.rng.randint(m["dmg"] // 3, m["dmg"])
            if self.hp <= 0:
                self.hp = 0
                self.deaths += 1
                self._dead_until = now + DEATH_DOWNTIME
                return

    def _player_attacks(self, now: float) -> None:
        target = self._monsters.get(self.target_id) if self.target_id else None
        if target is None:
            self.target_id = None
            return
        if max(abs(target["x"] - self.x), abs(target["y"] - self.y)) > 1:
            return
        if now - self._last_player_attack < PLAYER_ATTACK_INTERVAL:
            return
        self._last_player_attack = now
        target["hp"] -= self.rng.randint(60, 120)
        if target["hp"] <= 0:
            self.experience += target["exp"]
            self.kills += 1
            del self._monsters[self.target_id]
            self.target_id = None


def knight_sim(**kwargs) -> SimBridge:
    """Simulador con el molde de un caballero: mucha vida, poco mana, y el
    zurron lleno de potions fuertes, que es de lo que vive."""
    kwargs.setdefault("max_hp", 1400)
    kwargs.setdefault("max_mana", 400)
    kwargs.setdefault("inventory", {"strong health potion": 300,
                                    "strong mana potion": 100})
    return SimBridge(**kwargs)

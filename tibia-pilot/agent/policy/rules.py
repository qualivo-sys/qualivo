"""Policy por reglas: el baseline de la fase 2.

Es el rival a batir por el modelo aprendido de la fase 3. Si el BC no le gana
en xp/h y muertes, el BC no aporta eficiencia (y eso es un resultado valido:
lo que aporta es parecerse al humano, no jugar mejor).

Prioridad, de mayor a menor:
  1. Retirada    -> herido y sin forma de curarse
  2. Emergencia  -> heal fuerte / potion
  3. Curacion    -> heal normal
  4. Mana        -> mana potion
  5. Area        -> exori y equivalentes, con varios enemigos pegados
  6. Targeting   -> elegir y atacar

El orden entre potion y hechizo lo decide la vocacion (ver profiles.py).
"""
from __future__ import annotations

from ..config import Config
from ..state import Action, Creature, GameState


class RulePolicy:
    def __init__(self) -> None:
        # El cooldown se lleva aqui y no solo en el servidor porque a 20 Hz
        # mandariamos 20 exuras por segundo y el servidor nos tiraria por flood.
        self._ready_at: dict[str, float] = {}

    def reset(self) -> None:
        self._ready_at.clear()

    def _ready(self, key: str, now: float) -> bool:
        return now >= self._ready_at.get(key, 0.0)

    def _arm(self, key: str, now: float, cooldown: float) -> None:
        self._ready_at[key] = now + cooldown

    def decide(self, state: GameState, config: Config) -> list[Action]:
        if not state.connected or not state.alive:
            return []

        now = state.t
        actions: list[Action] = []

        if self._maybe_bail(state, config, actions):
            return actions

        healed = self._maybe_heal(state, config, now, actions)
        if not healed:
            self._maybe_restore_mana(state, config, now, actions)
            self._maybe_area_attack(state, config, now, actions)
        self._maybe_retarget(state, config, actions)
        return actions

    @staticmethod
    def _maybe_bail(s: GameState, cfg: Config, out: list[Action]) -> bool:
        """Retirada por insostenibilidad.

        Si estamos heridos y no podemos curarnos -- ni con mana ni con potions --
        la unica jugada correcta es salir. Sin esto el baseline vacia el zurron
        de potions y se muere: medido en el simulador, 8 muertes por hora.
        """
        if not cfg.logout_when_unsustainable:
            return False
        if s.hp_pct > cfg.heal_at_pct:
            return False
        can_cast = s.mana >= cfg.heal_spell_cost
        can_drink = s.item_count(cfg.health_potion) > 0
        if can_cast or can_drink:
            return False
        out.append(Action.logout())
        return True

    def _maybe_heal(self, s: GameState, cfg: Config, now: float, out: list[Action]) -> bool:
        emergency = s.hp_pct <= cfg.emergency_at_pct
        if not emergency and s.hp_pct > cfg.heal_at_pct:
            return False

        spell = cfg.strong_heal_spell if emergency else cfg.heal_spell
        cost = cfg.strong_heal_spell_cost if emergency else cfg.heal_spell_cost

        def por_hechizo() -> bool:
            if s.mana < cost or not self._ready("spell", now):
                return False
            self._arm("spell", now, cfg.spell_cooldown_s)
            out.append(Action.cast(spell))
            return True

        def por_potion() -> bool:
            # Para quien se cura con hechizo, la potion entra solo si el
            # hechizo no es una opcion (sin mana) o si es una emergencia. Sin
            # esa guarda se queman cientos de potions por hora con el mana
            # lleno, solo porque el hechizo estaba enfriando.
            if not cfg.prefer_potion_over_spell and not (emergency or s.mana < cost):
                return False
            if s.item_count(cfg.health_potion) <= 0 or not self._ready("potion", now):
                return False
            self._arm("potion", now, cfg.potion_cooldown_s)
            out.append(Action.use_item(cfg.health_potion))
            return True

        # Un caballero tiene poco mana: la potion es su curacion principal y el
        # hechizo el apoyo. Un mago justo al reves.
        orden = (por_potion, por_hechizo) if cfg.prefer_potion_over_spell \
            else (por_hechizo, por_potion)
        return any(intento() for intento in orden)

    def _maybe_restore_mana(self, s: GameState, cfg: Config, now: float, out: list[Action]) -> None:
        if s.mana_pct > cfg.mana_at_pct:
            return
        if s.item_count(cfg.mana_potion) <= 0 or not self._ready("potion", now):
            return
        self._arm("potion", now, cfg.potion_cooldown_s)
        out.append(Action.use_item(cfg.mana_potion))

    def _maybe_area_attack(self, s: GameState, cfg: Config, now: float,
                           out: list[Action]) -> None:
        """Exori y equivalentes: pegan a todo lo que este pegado a ti.

        Solo compensa con varios enemigos encima; con uno solo es mana tirado.
        Comparte cooldown con la curacion a proposito -- curarse siempre gana.
        """
        if not cfg.area_attack_spell:
            return
        if len(s.adjacent_monsters()) < cfg.area_attack_min_targets:
            return
        if s.mana < cfg.area_attack_cost or not self._ready("spell", now):
            return
        self._arm("spell", now, cfg.area_attack_cooldown_s)
        out.append(Action.cast(cfg.area_attack_spell))

    def _maybe_retarget(self, s: GameState, cfg: Config, out: list[Action]) -> None:
        current = s.target()
        # Solo cambiamos de objetivo si el actual ya no sirve: cambiar cada tick
        # es la forma clasica de que un bot no mate nada.
        if current is not None and current.distance <= cfg.max_target_distance:
            return
        best = self._best_target(s, cfg)
        if best is not None and best.id != s.target_id:
            out.append(Action.attack(best.id))

    @staticmethod
    def _best_target(s: GameState, cfg: Config) -> Creature | None:
        candidates = [c for c in s.monsters if c.distance <= cfg.max_target_distance]
        if cfg.attack_players:
            candidates += [c for c in s.players if c.distance <= cfg.max_target_distance]
        if not candidates:
            return None

        def rank(c: Creature) -> tuple[int, int, float]:
            try:
                priority = cfg.target_priority.index(c.name)
            except ValueError:
                priority = len(cfg.target_priority)
            # Prioridad configurada, luego el mas cercano, luego el mas herido.
            return (priority, c.distance, c.hp_pct)

        return min(candidates, key=rank)

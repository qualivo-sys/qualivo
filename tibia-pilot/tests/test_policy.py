"""Tests unitarios de la policy: decisiones aisladas, sin simulador."""
from __future__ import annotations

from agent.config import Config
from agent.policy.rules import RulePolicy
from agent.state import Creature, GameState

def state(**kw) -> GameState:
    base = dict(t=100.0, hp=800, max_hp=800, mana=600, max_mana=600, x=0, y=0, z=7,
                inventory={"health potion": 50, "mana potion": 50})
    base.update(kw)
    return GameState(**base)

def kinds(actions):
    return [a.kind for a in actions]

def test_no_actua_si_esta_sano_y_sin_monstruos():
    assert RulePolicy().decide(state(), Config()) == []

def test_cura_con_hechizo_por_debajo_del_umbral():
    actions = RulePolicy().decide(state(hp=500), Config())
    assert actions[0].kind == "cast"
    assert actions[0].params["words"] == "exura"

def test_emergencia_usa_hechizo_fuerte():
    actions = RulePolicy().decide(state(hp=200), Config())
    assert actions[0].params["words"] == "exura gran"

def test_sin_mana_cae_a_potion():
    actions = RulePolicy().decide(state(hp=200, mana=0), Config())
    assert actions[0].kind == "use_item"
    assert actions[0].params["name"] == "health potion"

def test_sin_mana_y_sin_potions_no_inventa_nada():
    s = state(hp=200, mana=0, inventory={"health potion": 0})
    assert "cast" not in kinds(RulePolicy().decide(s, Config()))
    assert "use_item" not in kinds(RulePolicy().decide(s, Config()))

def test_respeta_cooldown_entre_ticks():
    """El fallo clasico: a 20 Hz mandar 20 exuras por segundo."""
    policy, cfg = RulePolicy(), Config()
    assert kinds(policy.decide(state(t=100.0, hp=500), cfg)) == ["cast"]
    # 50 ms despues (un tick) el cooldown de 1 s sigue activo.
    assert kinds(policy.decide(state(t=100.05, hp=500), cfg)) == []
    # Pasado el cooldown vuelve a curar.
    assert kinds(policy.decide(state(t=101.1, hp=500), cfg)) == ["cast"]

def test_no_bebe_mana_potion_el_mismo_tick_que_health_potion():
    """En Tibia las potions comparten cooldown global de item."""
    s = state(hp=200, mana=0)
    actions = RulePolicy().decide(s, Config())
    assert len([a for a in actions if a.kind == "use_item"]) == 1

def test_prioridad_de_target():
    s = state(creatures=(
        Creature(1, "rotworm", 1.0, 1, 0),
        Creature(2, "dragon", 1.0, 2, 0),
    ))
    actions = RulePolicy().decide(s, Config())
    attack = next(a for a in actions if a.kind == "attack")
    assert attack.params["creature_id"] == 2  # dragon manda sobre rotworm

def test_no_cambia_de_target_si_el_actual_sigue_valido():
    s = state(target_id=1, creatures=(
        Creature(1, "rotworm", 0.5, 1, 0),
        Creature(2, "dragon", 1.0, 2, 0),
    ))
    assert "attack" not in kinds(RulePolicy().decide(s, Config()))

def test_ignora_monstruos_fuera_de_rango():
    s = state(creatures=(Creature(1, "rotworm", 1.0, 9, 9),))
    assert "attack" not in kinds(RulePolicy().decide(s, Config()))

def test_no_ataca_jugadores_por_defecto():
    s = state(creatures=(Creature(1, "Otro Jugador", 1.0, 1, 0, is_player=True),))
    assert "attack" not in kinds(RulePolicy().decide(s, Config()))

def test_no_actua_estando_muerto():
    assert RulePolicy().decide(state(hp=0), Config()) == []

def test_no_actua_desconectado():
    assert RulePolicy().decide(state(hp=100, connected=False), Config()) == []


def test_se_retira_si_no_puede_curarse_de_ninguna_forma():
    s = state(hp=300, mana=0, inventory={"health potion": 0, "mana potion": 5})
    actions = RulePolicy().decide(s, Config())
    assert kinds(actions) == ["logout"]


def test_no_se_retira_si_le_queda_mana():
    s = state(hp=300, mana=600, inventory={"health potion": 0})
    assert "logout" not in kinds(RulePolicy().decide(s, Config()))


def test_no_se_retira_si_le_quedan_potions():
    s = state(hp=300, mana=0, inventory={"health potion": 5})
    assert "logout" not in kinds(RulePolicy().decide(s, Config()))


def test_no_se_retira_estando_sano_aunque_no_tenga_recursos():
    """Sin potions pero a vida llena se sigue cazando: retirarse ahi seria
    abandonar un hunt perfectamente viable."""
    s = state(hp=800, mana=0, inventory={"health potion": 0})
    assert "logout" not in kinds(RulePolicy().decide(s, Config()))


def test_la_retirada_se_puede_desactivar():
    s = state(hp=300, mana=0, inventory={"health potion": 0})
    cfg = Config(logout_when_unsustainable=False)
    assert "logout" not in kinds(RulePolicy().decide(s, cfg))

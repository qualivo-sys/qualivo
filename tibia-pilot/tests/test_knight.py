"""Perfil de caballero, que es el del piloto.

Lo que se comprueba aqui no son numeros: es que las reglas del caballero son
las suyas y no las de un mago con otros umbrales.
"""
from __future__ import annotations

from agent.bridge.sim import knight_sim
from agent.config import Config, SharedConfig
from agent.events import EventEmitter
from agent.loop import ControlLoop
from agent.policy.rules import RulePolicy
from agent.profiles import load
from agent.state import Creature, GameState

from test_loop import VirtualClock


def estado(**kw) -> GameState:
    base = dict(t=100.0, hp=1400, max_hp=1400, mana=400, max_mana=400, x=0, y=0, z=7,
                inventory={"strong health potion": 200, "strong mana potion": 80})
    base.update(kw)
    return GameState(**base)


def rodeado(n: int, **kw) -> GameState:
    pos = [(1, 0), (0, 1), (-1, 0), (0, -1), (1, 1), (-1, -1)]
    return estado(creatures=tuple(
        Creature(i + 1, "cyclops", 1.0, dx, dy) for i, (dx, dy) in enumerate(pos[:n])
    ), **kw)


def test_el_caballero_se_cura_con_potion_no_con_hechizo():
    """La regla que mas se equivoca al portar un bot de mago a caballero."""
    acciones = RulePolicy().decide(estado(hp=700), load("knight"))
    curas = [a for a in acciones if a.kind in ("cast", "use_item")]
    assert curas[0].kind == "use_item"
    assert curas[0].params["name"] == "strong health potion"


def test_el_mago_hace_lo_contrario():
    s = estado(hp=700, inventory={"health potion": 50, "strong mana potion": 50})
    acciones = RulePolicy().decide(s, load("mage"))
    curas = [a for a in acciones if a.kind in ("cast", "use_item")]
    assert curas[0].kind == "cast"


def test_sin_potions_el_caballero_tira_del_hechizo():
    s = estado(hp=700, inventory={"strong health potion": 0})
    acciones = RulePolicy().decide(s, load("knight"))
    assert any(a.kind == "cast" and a.params["words"] == "exura ico" for a in acciones)


def test_exori_solo_con_varios_pegados():
    policy, cfg = RulePolicy(), load("knight")
    uno = [a for a in policy.decide(rodeado(2), cfg) if a.kind == "cast"]
    assert uno == []
    policy.reset()
    varios = [a for a in policy.decide(rodeado(4), cfg) if a.kind == "cast"]
    assert [a.params["words"] for a in varios] == ["exori"]


def test_exori_no_se_lanza_sin_mana():
    cfg = load("knight")
    acciones = RulePolicy().decide(rodeado(4, mana=10), cfg)
    assert not any(a.kind == "cast" for a in acciones)


def test_curarse_gana_al_exori():
    """Comparten cooldown: con la vida baja y cuatro encima, primero curarse."""
    acciones = RulePolicy().decide(rodeado(4, hp=400), load("knight"))
    assert acciones[0].kind == "use_item"
    assert not any(a.kind == "cast" for a in acciones)


def test_el_caballero_no_persigue_a_distancia():
    """max_target_distance=1: es cuerpo a cuerpo, no corre detras de nadie."""
    s = estado(creatures=(Creature(1, "cyclops", 1.0, 3, 0),))
    assert not any(a.kind == "attack" for a in RulePolicy().decide(s, load("knight")))


def test_una_hora_de_caza_con_perfil_de_caballero():
    clock = VirtualClock()
    bridge = knight_sim(seed=21, spawn_target=3, clock=clock)
    loop = ControlLoop(bridge, RulePolicy(), SharedConfig(load("knight")),
                       EventEmitter(None))
    loop.bridge.connect()
    for _ in range(int(3600 / clock.step)):
        clock.advance()
        loop.tick()
    assert bridge.deaths == 0
    assert bridge.kills > 50
    assert bridge.wasted_casts == 0
    assert bridge.potions_used > 0      # vive de las potions, como un caballero
    assert bridge.area_casts > 0        # y usa exori cuando le rodean


def test_el_perfil_desconocido_falla_claro():
    import pytest
    with pytest.raises(ValueError, match="perfil desconocido"):
        load("necromancer")

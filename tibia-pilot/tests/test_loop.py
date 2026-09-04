"""Tests de integracion contra el simulador con reloj virtual.

Una hora de hunt tarda ~1 segundo de test, asi que estos criterios pueden
correr en CI en cada commit.
"""
from __future__ import annotations

import json

from agent.bridge.sim import SimBridge
from agent.config import Config, SharedConfig
from agent.events import EventEmitter
from agent.loop import ControlLoop
from agent.policy.rules import RulePolicy
from agent.recorder import Recorder

class VirtualClock:
    def __init__(self, step: float = 0.05) -> None:
        self.now = 0.0
        self.step = step

    def __call__(self) -> float:
        return self.now

    def advance(self) -> None:
        self.now += self.step

def run_session(seconds: float, spawn_target: int = 2, seed: int = 7, **cfg_kw):
    clock = VirtualClock()
    bridge = SimBridge(seed=seed, spawn_target=spawn_target, clock=clock)
    config = SharedConfig(Config(**cfg_kw))
    loop = ControlLoop(bridge, RulePolicy(), config, EventEmitter(None))
    loop.bridge.connect()
    for _ in range(int(seconds / clock.step)):
        clock.advance()
        loop.tick()
    return bridge, loop

def test_sobrevive_una_hora_de_hunt_normal():
    """Criterio go/no-go de la fase 2: una hora sin morir.

    Sin la retirada por insostenibilidad esto daba 8 muertes por hora: el bot
    vaciaba las 400 potions y seguia peleando. Ahora se desloguea cuando ya no
    puede curarse, que es lo que hace un humano.
    """
    bridge, loop = run_session(3600)
    assert bridge.deaths == 0
    assert bridge.kills > 50
    # Sobrevivir "escondido" no cuenta: tiene que haber cazado de verdad antes
    # de retirarse, y la retirada tiene que ser una decision, no una muerte.
    assert loop.metrics.deaths == 0


def test_se_retira_en_vez_de_morir_cuando_se_queda_sin_recursos():
    bridge, _ = run_session(3600)
    assert bridge.connected is False       # se fue por su propio pie
    assert bridge.inventory["health potion"] == 0  # habiendo agotado el zurron

def test_no_desperdicia_acciones():
    """wasted_casts > 0 significa que la policy manda cosas que el servidor
    rechaza: spam. En un servidor real eso es un kick por flood."""
    bridge, _ = run_session(1800)
    assert bridge.wasted_casts == 0

def test_bajo_presion_alta_prefiere_potions_cuando_se_queda_sin_mana():
    bridge, _ = run_session(1800, spawn_target=5)
    assert bridge.potions_used > 0

def test_cuenta_las_muertes_cuando_las_hay():
    """Con umbrales suicidas el bot DEBE morir: si no, el test de supervivencia
    no estaria midiendo nada."""
    bridge, loop = run_session(1800, spawn_target=6,
                               heal_at_pct=0.02, emergency_at_pct=0.01)
    assert bridge.deaths > 0
    assert loop.metrics.deaths == bridge.deaths  # el loop las detecta todas

def test_metricas_de_tick_dentro_de_presupuesto():
    """Criterio go/no-go de la fase 0: p95 muy por debajo de 50 ms."""
    _, loop = run_session(600)
    m = loop.metrics.to_dict()
    assert m["tick_ms_p95"] < 5.0
    assert m["ticks"] > 10_000

def test_pausa_detiene_las_acciones():
    clock = VirtualClock()
    bridge = SimBridge(seed=3, spawn_target=4, clock=clock)
    config = SharedConfig(Config(paused=True))
    loop = ControlLoop(bridge, RulePolicy(), config, EventEmitter(None))
    loop.bridge.connect()
    for _ in range(400):
        clock.advance()
        loop.tick()
    assert loop.metrics.actions_sent == 0

def test_recorder_escribe_un_dataset_releible(tmp_path):
    """Fase 1: el dataset tiene que poder cargarse sin sorpresas."""
    from agent.state import Action, GameState

    path = tmp_path / "hunt.jsonl"
    clock = VirtualClock()
    bridge = SimBridge(seed=11, spawn_target=3, clock=clock)
    recorder = Recorder(path, flush_every=1)
    loop = ControlLoop(bridge, RulePolicy(), SharedConfig(Config()),
                       EventEmitter(None), recorder)
    loop.bridge.connect()
    for _ in range(600):
        clock.advance()
        loop.tick()
    recorder.close()

    lines = path.read_text().strip().split("\n")
    assert len(lines) == 600
    for raw in lines:
        row = json.loads(raw)
        state = GameState.from_dict(row["state"])   # round-trip sin perdidas
        assert 0 <= state.hp <= state.max_hp
        for a in row["actions"]:
            Action.from_dict(a)
    assert any(json.loads(l)["actions"] for l in lines)  # no esta vacio

def test_eventos_de_muerte_y_supplies_llegan_al_emisor():
    clock = VirtualClock()
    bridge = SimBridge(seed=5, spawn_target=6, clock=clock)
    bridge.inventory = {"health potion": 3, "mana potion": 3}
    emitter = EventEmitter(None)
    config = SharedConfig(Config(heal_at_pct=0.02, emergency_at_pct=0.01))
    loop = ControlLoop(bridge, RulePolicy(), config, emitter)
    loop.bridge.connect()
    kinds = []
    original = emitter.emit
    emitter.emit = lambda kind, payload, debounce_s=0.0: (
        kinds.append(kind), original(kind, payload, debounce_s))[1]
    for _ in range(int(600 / clock.step)):
        clock.advance()
        loop.tick()
    assert "death" in kinds
    assert "low_supplies" in kinds

def test_config_patch_ignora_claves_desconocidas():
    config = SharedConfig(Config())
    applied = config.patch({"heal_at_pct": 0.9, "inventado_por_el_llm": 42})
    assert applied == {"heal_at_pct": 0.9}
    assert config.snapshot().heal_at_pct == 0.9

def test_config_patch_coacciona_tipos():
    """El supervisor LLM manda JSON; los umbrales llegan como string mas de una vez."""
    config = SharedConfig(Config())
    config.patch({"heal_at_pct": "0.55", "surrounded_threshold": "6"})
    snapshot = config.snapshot()
    assert snapshot.heal_at_pct == 0.55
    assert snapshot.surrounded_threshold == 6

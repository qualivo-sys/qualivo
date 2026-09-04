"""El camino real de punta a punta: websocket, protocolo, ida y vuelta.

Estos tests corren en tiempo real (unos segundos), a diferencia del resto, que
usan reloj virtual. Es a proposito: lo que se prueba aqui es justamente el
transporte, y falsear el reloj lo dejaria sin probar.

Lo que queda fuera es el API de Lua del cliente, que no hay forma de ejercitar
sin un OTClient de verdad.
"""
from __future__ import annotations

import asyncio
import json
import socket
import time

import pytest

from agent.bridge.otclient import OTClientBridge
from agent.bridge.sim import knight_sim
from agent.config import SharedConfig
from agent.events import EventEmitter
from agent.loop import ControlLoop
from agent.policy import NullPolicy
from agent.policy.rules import RulePolicy
from agent.profiles import load
from agent.recorder import Recorder
from agent.state import Action

websockets = pytest.importorskip("websockets")
from websockets.asyncio.client import connect  # noqa: E402

PUERTO = 8899
TICK = 0.05


def _levantar(policy, recorder=None, puerto=PUERTO):
    bridge = OTClientBridge(port=puerto)
    loop = ControlLoop(bridge, policy, SharedConfig(load("knight")),
                       EventEmitter(None), recorder)
    loop.start()                              # start() ya llama a connect()
    for _ in range(60):                       # esperar a que el puerto escuche
        try:
            socket.create_connection(("127.0.0.1", puerto), 0.1).close()
            break
        except OSError:
            time.sleep(0.05)
    else:
        raise RuntimeError(f"el puente no abrio el puerto {puerto}")
    return bridge, loop


async def _cliente_falso(puerto, segundos, hp_inicial=None, observadas=None):
    """Hace lo mismo que el modulo Lua: empuja estado, aplica acciones."""
    juego = knight_sim(seed=5, spawn_target=4)
    juego.connect()
    if hp_inicial is not None:
        juego.hp = hp_inicial

    async with connect(f"ws://127.0.0.1:{puerto}") as ws:
        async def escuchar():
            async for crudo in ws:
                msg = json.loads(crudo)
                if msg.get("type") == "actions":
                    juego.send([Action.from_dict(a) for a in msg["actions"]])

        tarea = asyncio.create_task(escuchar())
        if observadas:
            await ws.send(json.dumps({"type": "observed", "actions": observadas}))
        fin = time.monotonic() + segundos
        while time.monotonic() < fin:
            await ws.send(json.dumps({"type": "state", "data": juego.read_state().to_dict()}))
            await asyncio.sleep(TICK)
        tarea.cancel()
    return juego


def test_el_agente_cura_al_personaje_a_traves_del_websocket():
    bridge, loop = _levantar(RulePolicy(), puerto=PUERTO)
    try:
        juego = asyncio.run(_cliente_falso(PUERTO, 4.0, hp_inicial=400))
    finally:
        loop.stop(); bridge.close()

    assert loop.metrics.ticks > 20          # llego estado
    assert loop.metrics.actions_sent > 0    # y volvieron acciones
    assert juego.potions_used > 0           # que el juego aplico
    assert juego.hp > 400                   # y surtieron efecto
    assert juego.wasted_casts == 0


def test_las_acciones_del_humano_llegan_al_dataset(tmp_path):
    """Modo grabacion: la policy calla y lo que se guarda es lo del humano."""
    destino = tmp_path / "hunt.jsonl"
    recorder = Recorder(destino, flush_every=1)
    bridge, loop = _levantar(NullPolicy(), recorder, puerto=PUERTO + 1)
    humano = [
        {"kind": "cast", "params": {"words": "exori"}},
        {"kind": "use_item", "params": {"name": "strong health potion"}},
    ]
    try:
        asyncio.run(_cliente_falso(PUERTO + 1, 2.0, observadas=humano))
    finally:
        loop.stop(); bridge.close(); recorder.close()

    filas = [json.loads(l) for l in destino.read_text().strip().split("\n")]
    acciones = [a for f in filas for a in f["actions"]]
    assert {a["kind"] for a in acciones} == {"cast", "use_item"}
    # Marcadas como humanas: es lo que distingue el dataset de la telemetria.
    assert all(a["source"] == "human" for a in acciones)
    assert not any(a["source"] == "policy" for a in acciones)


def test_el_puente_aguanta_mensajes_corruptos():
    """Un frame mal formado no puede tumbar el puente."""
    bridge, loop = _levantar(RulePolicy(), puerto=PUERTO + 2)

    async def guarrear():
        async with connect(f"ws://127.0.0.1:{PUERTO + 2}") as ws:
            for basura in ["esto no es json", "{}", '{"type":"state"}', "[1,2,3]"]:
                await ws.send(basura)
            juego = knight_sim(seed=1)
            juego.connect()
            for _ in range(20):               # y despues, trafico bueno
                await ws.send(json.dumps({"type": "state",
                                          "data": juego.read_state().to_dict()}))
                await asyncio.sleep(TICK)

    try:
        asyncio.run(guarrear())
    finally:
        loop.stop(); bridge.close()

    assert loop.last_state is not None       # se recupero y siguio leyendo

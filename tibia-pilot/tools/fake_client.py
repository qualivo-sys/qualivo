"""Cliente de mentira: habla el mismo protocolo que el modulo Lua.

Sirve para probar de punta a punta el camino real -- websocket, formato de
mensajes, ida y vuelta de acciones -- sin necesidad de juego ni de cliente
grafico. Lo que hace es exactamente lo que hace el modulo de OTClient:
empujar estado 20 veces por segundo y aplicar lo que le responda el agente.

Si esto funciona, lo unico que queda sin verificar del puente real es el API
de Lua. El protocolo y el lado Python quedan probados.

    python -m agent --bridge otclient --profile knight &
    python tools/fake_client.py --duration 15
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from websockets.asyncio.client import connect

from agent.bridge.sim import knight_sim
from agent.state import Action

TICK = 0.05  # 20 Hz, el mismo ritmo que el modulo Lua


async def main(url: str, duration: float, seed: int, hp_inicial: int | None) -> int:
    juego = knight_sim(seed=seed, spawn_target=4)
    juego.connect()
    if hp_inicial is not None:
        juego.hp = hp_inicial

    enviados = recibidos = 0

    async with connect(url) as ws:
        async def escuchar():
            nonlocal recibidos
            async for crudo in ws:
                msg = json.loads(crudo)
                if msg.get("type") != "actions":
                    continue
                acciones = [Action.from_dict(a) for a in msg.get("actions", [])]
                juego.send(acciones)
                recibidos += len(acciones)

        tarea = asyncio.create_task(escuchar())
        fin = asyncio.get_event_loop().time() + duration
        while asyncio.get_event_loop().time() < fin:
            estado = juego.read_state()
            await ws.send(json.dumps({"type": "state", "data": estado.to_dict()}))
            enviados += 1
            await asyncio.sleep(TICK)
        tarea.cancel()

    print(json.dumps({
        "estados_enviados": enviados,
        "acciones_recibidas": recibidos,
        "muertes": juego.deaths,
        "matados": juego.kills,
        "potions": juego.potions_used,
        "exori": juego.area_casts,
        "desperdiciadas": juego.wasted_casts,
        "hp_final": juego.hp,
    }, indent=2))
    return 0 if recibidos > 0 else 1


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--url", default="ws://127.0.0.1:8777")
    p.add_argument("--duration", type=float, default=15.0)
    p.add_argument("--seed", type=int, default=5)
    p.add_argument("--hp", type=int, default=None,
                   help="vida inicial, para forzar que el agente reaccione ya")
    a = p.parse_args()
    raise SystemExit(asyncio.run(main(a.url, a.duration, a.seed, a.hp)))

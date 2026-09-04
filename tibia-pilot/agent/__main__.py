"""Punto de entrada del piloto.

    python -m agent --sim --duration 60          # fase 0/2 sin juego
    python -m agent --sim --api                  # + superficie HTTP para n8n
    python -m agent --bridge otclient --mode record --out data/hunt.jsonl
"""
from __future__ import annotations

import argparse
import json
import sys
import time

from .config import SharedConfig
from .profiles import load as load_profile
from .events import EventEmitter
from .loop import ControlLoop
from .policy import NullPolicy
from .policy.rules import RulePolicy
from .recorder import Recorder


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="agent", description="Piloto de agente Tibia")
    p.add_argument("--bridge", choices=["sim", "otclient"], default="sim")
    p.add_argument("--sim", action="store_const", const="sim", dest="bridge",
                   help="alias de --bridge sim")
    p.add_argument("--mode", choices=["play", "record"], default="play",
                   help="play = la policy actua; record = solo observa al humano")
    p.add_argument("--out", help="ruta del dataset JSONL (activa la grabacion)")
    p.add_argument("--webhook", help="URL del webhook de n8n para eventos")
    p.add_argument("--api", action="store_true", help="levanta la API HTTP")
    p.add_argument("--api-port", type=int, default=8778)
    p.add_argument("--ws-port", type=int, default=8777, help="puerto del bridge OTClient")
    p.add_argument("--profile", choices=["knight", "paladin", "mage"], default="knight",
                   help="vocacion: decide que reglas existen, no solo los umbrales")
    p.add_argument("--hz", type=float, default=20.0)
    p.add_argument("--duration", type=float, default=0.0,
                   help="segundos a correr (0 = indefinido)")
    p.add_argument("--seed", type=int, default=0, help="semilla del simulador")
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)

    if args.bridge == "sim":
        # El simulador imita el molde de la vocacion: un caballero tiene el
        # doble de vida y un tercio del mana que un mago, y eso cambia por
        # completo que decisiones son correctas.
        from .bridge.sim import SimBridge, knight_sim
        bridge = knight_sim(seed=args.seed) if args.profile == "knight" \
            else SimBridge(seed=args.seed)
    else:
        from .bridge.otclient import OTClientBridge
        bridge = OTClientBridge(port=args.ws_port)

    policy = NullPolicy() if args.mode == "record" else RulePolicy()
    base = load_profile(args.profile)
    base.tick_hz = args.hz
    config = SharedConfig(base)
    emitter = EventEmitter(args.webhook)
    recorder = Recorder(args.out) if args.out else None

    loop = ControlLoop(bridge, policy, config, emitter, recorder)

    print(f"[agent] bridge={args.bridge} profile={args.profile} "
          f"mode={args.mode} hz={args.hz} "
          f"record={'si' if recorder else 'no'} webhook={'si' if args.webhook else 'no'}",
          file=sys.stderr)

    if args.api:
        import uvicorn
        from .api import create_app
        loop.start()
        uvicorn.run(create_app(loop, config), host="127.0.0.1", port=args.api_port,
                    log_level="warning")
        loop.stop()
    else:
        loop.start()
        try:
            deadline = time.monotonic() + args.duration if args.duration else None
            while deadline is None or time.monotonic() < deadline:
                time.sleep(0.25)
        except KeyboardInterrupt:
            pass
        loop.stop()

    if recorder:
        recorder.close()
    emitter.close()
    bridge.close()

    report = loop.status()["metrics"]
    if args.bridge == "sim":
        report["sim_ground_truth"] = {
            "deaths": bridge.deaths, "kills": bridge.kills,
            "heals_cast": bridge.heals_cast, "potions_used": bridge.potions_used,
            "wasted_casts": bridge.wasted_casts,
        }
    if recorder:
        report["dataset_lines"] = recorder.lines
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

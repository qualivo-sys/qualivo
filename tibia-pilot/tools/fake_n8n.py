"""Receptor de eventos de mentira: n8n sin n8n.

Sirve para ver que eventos emite el agente y con que contenido, antes de
montar nada. Imprime cada webhook segun llega.

    python tools/fake_n8n.py
    python -m agent --sim --api --sim-pressure 6 --sim-supplies 5 \
        --webhook http://127.0.0.1:5678/webhook/tibia-eventos
"""
from __future__ import annotations

import argparse
import json
from datetime import datetime
from http.server import BaseHTTPRequestHandler, HTTPServer

RESUMEN = {
    "death": "MURIO",
    "low_supplies": "Se queda sin suministros",
    "surrounded": "Le estan rodeando",
    "player_nearby": "Hay un jugador cerca",
    "session_summary": "Resumen de la sesion",
}


class Receptor(BaseHTTPRequestHandler):
    def do_POST(self) -> None:  # noqa: N802
        largo = int(self.headers.get("Content-Length", 0))
        crudo = self.rfile.read(largo)
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')

        try:
            evento = json.loads(crudo)
        except json.JSONDecodeError:
            print("  [?] mensaje ilegible:", crudo[:120])
            return

        kind = evento.get("kind", "?")
        hora = datetime.now().strftime("%H:%M:%S")
        print(f"\n  [{hora}] {RESUMEN.get(kind, kind)}  ({kind})")
        for clave, valor in (evento.get("payload") or {}).items():
            if isinstance(valor, dict):
                valor = ", ".join(f"{k}={v}" for k, v in list(valor.items())[:4]) + " ..."
            print(f"        {clave}: {valor}")

    def log_message(self, *args) -> None:
        return  # el log por defecto ensucia mas que ayuda


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--port", type=int, default=5678)
    a = p.parse_args()
    print(f"\n  Escuchando eventos en http://127.0.0.1:{a.port}/webhook/tibia-eventos")
    print("  (Ctrl+C para salir)\n")
    HTTPServer(("127.0.0.1", a.port), Receptor).serve_forever()

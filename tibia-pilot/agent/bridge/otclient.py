"""Bridge real: WebSocket contra el modulo Lua de OTClient.

El cliente Lua es el que abre la conexion (nosotros somos el servidor) y empuja
un frame de estado por tick. Nosotros devolvemos acciones. Todo JSON.

Protocolo (una linea JSON por mensaje):
    cliente -> agente  {"type":"state", "data": {...GameState...}}
    cliente -> agente  {"type":"observed", "actions": [{...Action...}]}
    agente  -> cliente {"type":"actions", "actions": [{...Action...}]}

Requiere `websockets` (pip install .[otclient]) y un OTClient con soporte de
websocket en Lua (el fork mehah/otclient lo trae via g_http.webSocket).
"""
from __future__ import annotations

import json
import queue
import threading
from typing import Sequence

from ..state import Action, GameState


class OTClientBridge:
    def __init__(self, host: str = "127.0.0.1", port: int = 8777) -> None:
        self.host = host
        self.port = port
        self._latest: GameState | None = None
        self._latest_lock = threading.Lock()
        self._observed: queue.Queue[Action] = queue.Queue()
        self._outbound: queue.Queue[list[Action]] = queue.Queue(maxsize=64)
        self._server = None
        self._thread: threading.Thread | None = None
        self._stop = threading.Event()
        self.client_connected = False

    def connect(self) -> None:
        try:
            from websockets.sync.server import serve
        except ImportError as exc:  # pragma: no cover - depende del entorno
            raise RuntimeError(
                "OTClientBridge necesita `websockets`. Instala con: pip install '.[otclient]'"
            ) from exc

        self._server = serve(self._handle, self.host, self.port)
        self._thread = threading.Thread(
            target=self._server.serve_forever, name="otclient-bridge", daemon=True
        )
        self._thread.start()

    def _handle(self, websocket) -> None:
        """Una conexion = un cliente de juego. Solo esperamos uno."""
        self.client_connected = True
        sender = threading.Thread(target=self._pump_outbound, args=(websocket,), daemon=True)
        sender.start()
        try:
            for raw in websocket:
                # Nada de lo que llegue por el cable puede tumbar el puente:
                # al otro lado hay un modulo Lua que puede mandar cualquier
                # cosa, y quedarse sin puente a media caza es perder el
                # personaje.
                try:
                    msg = json.loads(raw)
                except (json.JSONDecodeError, TypeError, ValueError):
                    continue
                if not isinstance(msg, dict):
                    continue
                kind = msg.get("type")
                if kind == "state":
                    datos = msg.get("data")
                    if not isinstance(datos, dict):
                        continue
                    try:
                        state = GameState.from_dict(datos)
                    except (KeyError, TypeError, ValueError):
                        continue
                    with self._latest_lock:
                        self._latest = state
                elif kind == "observed":
                    for a in msg.get("actions") or []:
                        if not isinstance(a, dict) or "kind" not in a:
                            continue
                        d = dict(a)
                        d["source"] = "human"
                        self._observed.put(Action.from_dict(d))
        finally:
            self.client_connected = False

    def _pump_outbound(self, websocket) -> None:
        while not self._stop.is_set():
            try:
                actions = self._outbound.get(timeout=0.5)
            except queue.Empty:
                continue
            try:
                websocket.send(json.dumps(
                    {"type": "actions", "actions": [a.to_dict() for a in actions]}
                ))
            except Exception:
                return

    # ---------------- Bridge protocol ----------------

    def read_state(self) -> GameState | None:
        with self._latest_lock:
            return self._latest

    def observed_actions(self) -> list[Action]:
        out: list[Action] = []
        while True:
            try:
                out.append(self._observed.get_nowait())
            except queue.Empty:
                return out

    def send(self, actions: Sequence[Action]) -> None:
        if not actions:
            return
        try:
            self._outbound.put_nowait(list(actions))
        except queue.Full:
            # Preferimos perder acciones antes que bloquear el bucle rapido:
            # una accion vieja en un juego en tiempo real no vale nada.
            pass

    def close(self) -> None:
        self._stop.set()
        if self._server is not None:
            self._server.shutdown()

"""Emisor de eventos hacia n8n.

Regla dura: esto NUNCA bloquea el bucle rapido. Cola + hilo de fondo, y si la
cola se llena se descartan eventos y se cuenta el descarte. Antes perder un
webhook que perder el personaje.
"""
from __future__ import annotations

import json
import queue
import threading
import time
import urllib.error
import urllib.request
from typing import Any


class EventEmitter:
    def __init__(self, webhook_url: str | None, timeout: float = 5.0, maxsize: int = 256) -> None:
        self.webhook_url = webhook_url
        self.timeout = timeout
        self._q: queue.Queue[dict[str, Any]] = queue.Queue(maxsize=maxsize)
        self._stop = threading.Event()
        self._last_sent: dict[str, float] = {}
        self.sent = 0
        self.dropped = 0
        self.failed = 0
        self._thread = threading.Thread(target=self._worker, name="event-emitter", daemon=True)
        self._thread.start()

    def emit(self, kind: str, payload: dict[str, Any], debounce_s: float = 0.0) -> bool:
        """Encola un evento. `debounce_s` evita que 'low_supplies' se dispare
        veinte veces por segundo mientras la condicion siga siendo cierta."""
        now = time.monotonic()
        if debounce_s > 0 and now - self._last_sent.get(kind, -1e9) < debounce_s:
            return False
        self._last_sent[kind] = now
        event = {"kind": kind, "ts": time.time(), "payload": payload}
        try:
            self._q.put_nowait(event)
            return True
        except queue.Full:
            self.dropped += 1
            return False

    def _worker(self) -> None:
        while not self._stop.is_set():
            try:
                event = self._q.get(timeout=0.5)
            except queue.Empty:
                continue
            if not self.webhook_url:
                self.sent += 1  # modo dry-run: contamos pero no mandamos
                continue
            self._post(event)

    def _post(self, event: dict[str, Any]) -> None:
        data = json.dumps(event).encode("utf-8")
        request = urllib.request.Request(
            self.webhook_url, data=data,
            headers={"Content-Type": "application/json"}, method="POST",
        )
        for attempt in range(2):
            try:
                with urllib.request.urlopen(request, timeout=self.timeout):
                    self.sent += 1
                    return
            except (urllib.error.URLError, OSError):
                if attempt == 0:
                    time.sleep(1.0)
        self.failed += 1

    def close(self) -> None:
        self._stop.set()

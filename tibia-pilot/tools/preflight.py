"""Comprobacion previa: dice que falta antes de que algo falle a medias.

    python tools/preflight.py

Pensado para la persona que monta el servidor. Cada fallo dice que hacer,
no solo que esta mal.
"""
from __future__ import annotations

import importlib.util
import os
import shutil
import socket
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
OK, AVISO, FALLO = "  OK  ", " AVISO", " FALLO"

resultados: list[tuple[str, str, str]] = []


def anota(estado: str, titulo: str, detalle: str = "") -> None:
    resultados.append((estado, titulo, detalle))


def python_reciente() -> None:
    v = sys.version_info
    if v >= (3, 11):
        anota(OK, f"Python {v.major}.{v.minor}")
    else:
        anota(FALLO, f"Python {v.major}.{v.minor} es viejo",
              "Hace falta 3.11 o mas. Descargalo de python.org.")


def el_agente_arranca() -> None:
    try:
        r = subprocess.run(
            [sys.executable, "-m", "agent", "--sim", "--profile", "knight",
             "--duration", "3"],
            cwd=RAIZ, capture_output=True, text=True, timeout=60,
        )
    except Exception as e:  # noqa: BLE001
        anota(FALLO, "El agente no arranca", str(e))
        return
    if r.returncode == 0 and '"ticks"' in r.stdout:
        anota(OK, "El agente corre", "3 s de caza simulada sin errores")
    else:
        anota(FALLO, "El agente no corre",
              (r.stderr or r.stdout)[-300:] or "sin salida")


def websockets_instalado() -> None:
    if importlib.util.find_spec("websockets"):
        anota(OK, "websockets instalado", "el puente con el cliente puede correr")
    else:
        anota(AVISO, "Falta websockets",
              "Solo hace falta para conectar con OTClient: pip install websockets")


def docker_vivo() -> None:
    if not shutil.which("docker"):
        anota(AVISO, "Docker no instalado",
              "Hace falta para el servidor y n8n. docker.com/get-started")
        return
    try:
        r = subprocess.run(["docker", "info"], capture_output=True, timeout=25)
    except Exception:  # noqa: BLE001
        anota(AVISO, "Docker no responde", "Abre Docker Desktop y espera a que arranque.")
        return
    if r.returncode == 0:
        anota(OK, "Docker funcionando")
    else:
        anota(AVISO, "Docker instalado pero apagado",
              "Abre Docker Desktop y espera a que ponga 'running'.")


def puertos_libres() -> None:
    usados = []
    for puerto, para in [(7171, "login del juego"), (7172, "juego"),
                         (5678, "n8n"), (8777, "puente"), (8778, "API")]:
        s = socket.socket()
        s.settimeout(0.3)
        try:
            s.bind(("127.0.0.1", puerto))
        except OSError:
            usados.append(f"{puerto} ({para})")
        finally:
            s.close()
    if usados:
        anota(AVISO, "Puertos ocupados: " + ", ".join(usados),
              "Cierra lo que los use, o cambialos en docker-compose.yml.")
    else:
        anota(OK, "Los 5 puertos estan libres")


def entorno_preparado() -> None:
    env = RAIZ / ".env"
    if not env.exists():
        anota(AVISO, "Falta el fichero .env", "Copia .env.example a .env y cambia las claves.")
        return
    texto = env.read_text()
    if "cambiaesto" in texto:
        anota(AVISO, "Las contrasenas de .env siguen sin cambiar",
              "Edita .env y pon dos claves de verdad.")
    else:
        anota(OK, "Fichero .env preparado")


def datapack_presente() -> None:
    data = RAIZ / "server" / "data"
    config = RAIZ / "server" / "config.lua"
    initdb = list((RAIZ / "server" / "initdb").glob("*.sql"))
    faltan = []
    if not data.is_dir():
        faltan.append("server/data/ (el mapa y los scripts)")
    if not config.is_file():
        faltan.append("server/config.lua")
    if not initdb:
        faltan.append("server/initdb/*.sql (el esquema de la base de datos)")
    if faltan:
        anota(AVISO, "Falta el datapack del servidor",
              "Falta: " + "; ".join(faltan) + ". Ver SETUP.md, paso 3.")
    else:
        anota(OK, "Datapack del servidor en su sitio")


def main() -> int:
    print("\n  Comprobacion previa del piloto\n  " + "-" * 44)
    for prueba in (python_reciente, el_agente_arranca, websockets_instalado,
                   docker_vivo, puertos_libres, entorno_preparado, datapack_presente):
        prueba()

    for estado, titulo, detalle in resultados:
        print(f"  [{estado}] {titulo}")
        if detalle:
            print(f"           -> {detalle}")

    fallos = sum(1 for e, _, _ in resultados if e == FALLO)
    avisos = sum(1 for e, _, _ in resultados if e == AVISO)
    print("  " + "-" * 44)
    if fallos:
        print(f"  {fallos} cosa(s) rota(s). Arreglalas antes de seguir.\n")
        return 1
    if avisos:
        print(f"  Lo esencial funciona. {avisos} aviso(s) para el servidor.\n")
        return 0
    print("  Todo listo.\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

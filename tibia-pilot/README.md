# Piloto de agente para Tibia

Agente que aprende a jugar observando a un humano, sobre **servidor propio**
(OTServer). No es para servidores oficiales de CipSoft: botear alli viola las
Tibia Rules y BattlEye borra cuentas. Sobre un OTServer vuestro no hay ni
reglas que romper ni anticheat que evadir, y ademas es el unico entorno donde
se puede entrenar y evaluar en serio (repetible, reseteable, acelerable).

## Arranque rapido (60 segundos, sin instalar nada)

Necesitas Python 3.11+. Nada mas: el nucleo es solo libreria estandar.

```bash
git clone https://github.com/qualivo-sys/qualivo.git
cd qualivo && git checkout claude/tibia-bot-gameplay-a2pnsn
cd tibia-pilot

python -m agent --sim --duration 60
```

Corre 60 s de hunt simulado y escupe metricas en JSON. Si imprime numeros, el
motor (bucle, policy, eventos, metricas) funciona. **Sin tocar el juego.**

```bash
python -m agent --sim --duration 60 --out data/prueba.jsonl   # + graba dataset
```

Tests (29, sin dependencias externas si usas el runner de abajo):

```bash
pip install pytest && pytest tests -q
```

## La arquitectura en una frase

Dos bucles a velocidades distintas. **El LLM nunca esta en el bucle rapido.**

```
Bucle rapido  (20 Hz, Python puro, cero red)     percepcion -> policy -> accion
Bucle lento   (eventos + minutos, n8n + LLM)     lee telemetria -> ajusta config
```

Un LLM tarda 1-5 s en responder. En Tibia te curas a 30% de vida con 1 s de
cooldown: si el "cerebro" esta en linea, el personaje muere mientras el modelo
redacta. El LLM **escribe y ajusta** la politica; no la ejecuta.

| Capa | Donde vive | Frecuencia |
|---|---|---|
| Percepcion + control | este agente (Python) | 10-20 Hz |
| Supervisor (LLM, decisiones) | n8n | eventos + 1-5 min |
| Programacion de sesiones | n8n (cron) | diaria |
| Metricas e historico | n8n -> Postgres | por evento |
| Alertas | n8n -> Telegram/Discord | por evento |

Contrato entre ambos, deliberadamente estrecho (n8n nunca toca el juego):

```
agente  --webhook-->  n8n     death, surrounded, low_supplies,
                              player_nearby, session_summary
n8n     --HTTP----->  agente  GET /status /metrics /config
                              POST /config /pause /resume /command
```

## Fases del piloto

| Fase | Entregable | Criterio go/no-go | Estado |
|---|---|---|---|
| 0 | Percepcion fiable | p95 de tick << 50 ms | **hecho** (p95 = 0,1 ms en simulador) |
| 1 | Grabador de dataset | ~144k transiciones de 2 h de hunt | **hecho** (falta el puente Lua) |
| 2 | Baseline por reglas | 1 h sin morir | **hecho** (0 muertes/h en simulador) |
| 3 | Modelo por imitacion | batir al baseline en xp/h y muertes | pendiente |
| 4 | Supervisor LLM | corregir >=1 fallo que las reglas no cubren | pendiente (workflow n8n) |

El baseline por reglas es el rival a batir en la fase 3. Si el modelo aprendido
no le gana en eficiencia, eso es un resultado valido: lo que aporta la
imitacion no es jugar mejor, es jugar **como el humano concreto** que grabo.

## Que hace falta de vosotros

**Datos, ninguno todavia.** Las fases 0 y 2 corren contra el simulador.

Para la fase 1, tres decisiones (no ficheros):

1. **Vocacion** — knight / paladin / druid / sorcerer. Cambia la policy entera.
2. **Nivel y zona de caza** — el dataset solo ensena a jugar *ese* personaje
   en *ese* sitio.
3. **Quien graba** — una persona, ~2 h de hunt normal. Si juega raro porque
   sabe que se graba, el modelo aprende a jugar raro.

**Los videos no sirven como dataset**: dan pixeles sin la accion etiquetada ni
su timing, y habria que reconstruir el estado con OCR. El modo `record` lee
estado y accion de los callbacks del propio cliente, con timestamp exacto.

**El dataset no se comparte**: 2 h a 20 Hz son ~100 MB. Se queda en la maquina
que graba. Lo que viaja son `head -3`, metricas y errores.

## Estructura

```
agent/
  state.py          GameState / Creature / Action  (serializables: son el dataset)
  config.py         Config mutable en caliente + SharedConfig con lock
  bridge/
    sim.py          Simulador de hunt con reloj inyectable (1 h en ~1 s)
    otclient.py     WebSocket contra el modulo Lua de OTClient
  policy/rules.py   Baseline: emergencia > curacion > mana > targeting
  loop.py           Bucle rapido + metricas de latencia
  recorder.py       Dataset JSONL
  events.py         Webhooks a n8n (cola + hilo: nunca bloquea el bucle)
  api.py            FastAPI para n8n
tests/              29 tests; los de integracion usan reloj virtual
```

Cambiar de OTClient a cliente oficial con captura de pantalla = escribir un
`Bridge` nuevo. Nada mas del sistema cambia.

## Dependencias opcionales

```bash
pip install fastapi uvicorn   # python -m agent --sim --api  (para n8n)
pip install websockets        # python -m agent --bridge otclient
```

## Pendiente

- Modulo Lua de OTClient (`otclient_module/`) — el puente real con el juego
- Workflow de n8n del supervisor (`n8n/`)
- `docker-compose.yml` con TFS + Postgres + n8n
- Fase 3: script de entrenamiento por clonacion de comportamiento

## Nota sobre el baseline

La retirada por insostenibilidad (`logout_when_unsustainable`) no estaba en el
diseno inicial y la anadio el simulador: sin ella el bot vaciaba las 400
potions y moria 8 veces por hora. Es el tipo de fallo que en un servidor real
cuesta un personaje y aqui costo un test.

# Montar el servidor, paso a paso

Para la persona que ponga el ordenador. Calcula **una tarde**, y la mayor
parte es esperar descargas.

Todo va en la misma maquina: el mundo del juego, el cliente y el robot.

> **Nota de honestidad.** No he podido ejecutar esta parte: no tengo forma de
> levantar un servidor de juego ni un cliente grafico. Los comandos estan
> escritos con cuidado y `tools/preflight.py` comprueba lo que se puede
> comprobar, pero esperad tropiezos y avisadme del error concreto.

---

## Probarlo tu solo antes de enseñarselo a nadie

Tres escalones. Los dos primeros no necesitan ni juego ni servidor, y se
hacen en media hora larga.

### Escalon 1 — el cerebro (15 min, solo Python)

```bash
python -m agent --sim --profile knight --duration 60
```

Un minuto de caza simulada y un resumen al final. Si imprime numeros, el
bucle rapido funciona. Para comparar vocaciones: `--profile mage`.

### Escalon 2 — el bucle lento (20 min, sigue sin juego)

Aqui ves la otra mitad del sistema: los avisos que el robot manda cuando algo
va mal, y como se le cambia la configuracion en caliente. **Tres terminales**:

```bash
# 1) el receptor de avisos (n8n de mentira)
python tools/fake_n8n.py

# 2) el robot, con la dificultad subida para que pasen cosas ya
python -m agent --sim --profile knight --api \
    --sim-pressure 7 --sim-supplies 4 \
    --webhook http://127.0.0.1:5678/webhook/tibia-eventos

# 3) tu, haciendo de supervisor
curl http://127.0.0.1:8778/status
curl -X POST http://127.0.0.1:8778/config \
     -H "Content-Type: application/json" \
     -d '{"updates": {"heal_at_pct": 0.85}}'
curl -X POST http://127.0.0.1:8778/pause
```

En la primera terminal van saliendo los avisos:

```
[23:43:25] Se queda sin suministros  (low_supplies)
      health_potions: 4
[23:43:35] Le estan rodeando  (surrounded)
      count: 5
      names: ['cyclops', 'dragon', 'dragon', 'dragon', 'rotworm']
      hp_pct: 0.677
```

Eso es exactamente lo que recibira n8n. Cuando cambies `heal_at_pct` veras
que el robot empieza a curarse antes, en vivo, sin reiniciarlo.

El `POST /config` contesta que aplico y que ignoro:

```json
{"applied": {"heal_at_pct": 0.85}, "ignored": ["campo_inventado"]}
```

Ignorar lo desconocido es deliberado: al otro lado hay una IA decidiendo, y
antes o despues se inventara un nombre de campo. Mejor que lo tire a que
reviente el agente a media caza.

`--sim-pressure` y `--sim-supplies` estan solo para esto: forzar que pasen
cosas malas sin esperar a la mala suerte.

### Escalon 3 — el juego de verdad

Los once pasos de abajo. Una tarde.

---

## Paso 0 — Comprobar la maquina

```bash
python tools/preflight.py
```

Te dice que falta y que hacer con cada cosa. Vuelve a lanzarlo despues de
cada paso; es la forma mas rapida de saber si vas bien.

Lo unico que tiene que salir en verde ya es **Python** y **el agente corre**.
El resto son avisos que iras resolviendo.

---

## Paso 1 — Instalar lo basico

- **Python 3.11 o mas** — <https://python.org>.
  En Windows marca la casilla *"Add Python to PATH"* durante la instalacion.
- **Docker Desktop** — <https://docker.com/get-started>. Abrelo y espera a
  que ponga *running*.
- **Git** — <https://git-scm.com>. Opcional si trabajas desde el zip.

---

## Paso 2 — El codigo

Desde el zip, o si tienes acceso al repositorio:

```bash
git clone https://github.com/qualivo-sys/qualivo.git
cd qualivo && git checkout claude/tibia-bot-gameplay-a2pnsn
cd tibia-pilot
```

Comprueba que el motor va, sin juego ni nada:

```bash
python -m agent --sim --profile knight --duration 60
```

Si escupe numeros, el cerebro funciona.

---

## Paso 3 — El datapack del servidor

El servidor es The Forgotten Server. El programa lo compila Docker, pero el
**contenido** del mundo lo pones tu.

```bash
git clone https://github.com/otland/forgottenserver.git /tmp/tfs

mkdir -p server/initdb
cp -r /tmp/tfs/data          server/data
cp    /tmp/tfs/config.lua.dist server/config.lua
cp    /tmp/tfs/schema.sql    server/initdb/01-schema.sql
```

Ahora edita `server/config.lua` y deja la base de datos apuntando al
contenedor:

```lua
mysqlHost = "db"
mysqlUser = "tfs"
mysqlPass = "la-que-pusiste-en-.env"
mysqlDatabase = "forgottenserver"
```

---

## Paso 4 — Las contrasenas

```bash
cp .env.example .env
```

Edita `.env` y cambia las dos claves. La de `DB_PASSWORD` tiene que ser la
misma que pusiste en `config.lua`.

---

## Paso 5 — Levantar la base de datos y n8n

```bash
docker compose up -d db n8n
```

n8n queda en <http://localhost:5678>. Entra, importa
`n8n/supervisor.workflow.json` desde su interfaz y activalo.

El esquema de la base de datos se importa solo la primera vez. Si te
equivocas y quieres empezar de cero:

```bash
docker compose down -v      # ojo: -v borra los datos
```

---

## Paso 6 — El servidor de juego

```bash
docker compose build tfs    # la primera vez tarda un buen rato
docker compose up -d tfs
docker compose logs -f tfs  # Ctrl+C para salir de los logs
```

Cuando en los logs veas que esta escuchando, ya hay mundo.

---

## Paso 7 — Crear una cuenta

TFS no trae cuentas hechas. Se crea a mano en la base de datos:

```bash
docker compose exec db mariadb -u tfs -p forgottenserver
```

```sql
INSERT INTO accounts (name, password, type)
VALUES ('prueba', SHA1('miclave'), 1);

INSERT INTO players (name, group_id, account_id, level, vocation, health, healthmax,
                     mana, manamax, town_id, conditions)
VALUES ('Piloto', 1, LAST_INSERT_ID(), 42, 4, 1400, 1400, 400, 400, 1, '');
```

`vocation = 4` es caballero (Knight), que es el perfil del robot.

**Aviso:** las columnas exactas cambian entre versiones de TFS. Si la insercion
se queja de una columna que falta, mira el `schema.sql` que copiaste y anadela.
Pasame el error y te lo ajusto.

---

## Paso 8 — El cliente

Descarga **OTClient** (el fork de mehah): <https://github.com/mehah/otclient>.

Necesita los ficheros graficos de Tibia — `Tibia.spr` y `Tibia.dat` — que
salen de una instalacion del cliente oficial. Van en la carpeta
`data/things/<version>/` de OTClient. **Sin ellos el cliente no dibuja nada**:
son los dibujos, y son de CipSoft.

Arranca OTClient y conecta a `127.0.0.1`, puerto `7171`, con la cuenta del
paso 7. Si entras y ves tu personaje, el servidor esta montado.

---

## Paso 9 — El puente

Copia la carpeta del modulo dentro de OTClient:

```bash
cp -r otclient_module/tibia_bridge  /ruta/a/otclient/modules/
```

Arranca OTClient y activalo desde su gestor de modulos. En la consola del
cliente deberia salir `[tibia_bridge] conectado al agente` en cuanto levantes
el agente.

```bash
pip install websockets
```

---

## Paso 10 — Soltar el robot

Con el personaje dentro del juego, en otra terminal:

```bash
python -m agent --bridge otclient --profile knight
```

Y a mirar la pantalla.

Para pararlo: Ctrl+C. Para pausarlo sin matarlo:
`curl -X POST http://127.0.0.1:8778/pause`.

---

## Paso 11 — Grabar al humano

Esto es lo que hace falta para que aprenda. **Dos horas jugando normal**:

```bash
python -m agent --bridge otclient --mode record --out data/hunt.jsonl
```

En este modo el robot **no** actua: solo mira y apunta. Juega como juegas
siempre; si juegas raro a proposito, el robot aprende raro.

Al acabar, mira que se grabo algo:

```bash
wc -l data/hunt.jsonl        # deberian ser decenas de miles de lineas
head -1 data/hunt.jsonl
```

Ese fichero se queda en tu ordenador. Para el entrenamiento me basta con la
salida de `head -3` y unas estadisticas.

---

## Si algo peta

1. `python tools/preflight.py` — la mitad de los problemas los canta el.
2. `docker compose logs tfs` — para fallos del servidor.
3. La consola de OTClient — para fallos del modulo.

Y me pasas el error tal cual. El sitio con mas papeletas de fallar es el
paso 9: el modulo Lua usa `g_http.webSocket`, que existe en el fork de mehah
pero puede llamarse distinto en otros. El transporte del lado Python si esta
probado (`tests/test_bridge_ws.py`), asi que si falla, falla en Lua.

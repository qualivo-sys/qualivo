# Pipeline de adquisición de creadores

Del descubrimiento en Apify a los entregables listos para enviar, en un comando.
Sin dependencias: Node 18+ y `fetch` nativo.

```bash
export APIFY_TOKEN=...          # obligatorio
export NOTION_API_KEY=...       # opcional: para deduplicar y dar de alta
export NOTION_DB_ID=...         # id de la base «Creadores»
export BOOKING_URL=...          # por defecto, el calendario de Scubalight

node pipeline/run.mjs --since 2d --out ./out          # solo entregables
node pipeline/run.mjs --since 2d --out ./out --push   # además da de alta en Notion
node pipeline/run.mjs --spanish=off                   # excluye español del scoring
```

## Qué hace

1. **Recoge** los datasets de las ejecuciones de Apify terminadas en la ventana `--since`.
   Distingue YouTube de Twitch por la forma de los datos, no por el nombre del actor.
2. **Normaliza** ambos a un registro común: nombre, URL, seguidores, audiencia, juegos,
   enlaces, email, idioma, vídeo o directo citable.
3. **Puntúa** con el modelo unificado (`score.mjs`). Lo que se juega ahora pesa más que el
   histórico del género; el tamaño del canal tiene techo bajo a propósito.
4. **Deduplica** contra la base de Notion por URL, para no reescribir a nadie.
5. **Personaliza** por reglas, no con IA: el vídeo o directo citado y el detalle salen de los
   datos reales. Es auditable y no inventa nada.
6. **Escribe los entregables** en `--out`.

## Entregables

| Archivo | Para qué |
|---|---|
| `smartlead_en.csv` / `smartlead_es.csv` | Importar en la campaña correspondiente. Trae ya `cited_video`, `video_detail`, `booking_link` y `steam_utm` por creador. |
| `dm_queue.md` | Los que no tienen email. Cada ficha trae por dónde escribirle y el mensaje ya redactado. Se copia y pega a mano. |
| `all_scored.csv` | Todo lo descubierto con su puntuación y el motivo, para auditar. |

## Lo que no automatiza, y por qué

- **Enviar los mensajes directos.** Twitch y X banean las cuentas que mandan mensajes
  idénticos en ráfaga, y es el canal del que sale la mayoría de esta lista. El pipeline
  reduce el trabajo a copiar y pegar; el envío es humano y con tope de 10 al día.
- **La sesión.** El valor de la oferta es que el Game Director esté en el lobby.
- **Tier 1.** Se llega por presentación de alguien que ya jugó, no por secuencia.

## Programarlo

Cron diario, después de la captura de Twitch de las 02:00 UTC:

```cron
30 2 * * *  cd /ruta/al/repo && node kill-ramble/pipeline/run.mjs --since 26h --out ./out --push >> ./out/pipeline.log 2>&1
```

## Importar las bases del estudio

El estudio deja sus listas en una carpeta de Drive compartida. Se descargan a una carpeta
local, se exportan a CSV las que sean Excel o Google Sheets, y:

```bash
node pipeline/import_partner.mjs --in ./entrantes --base ./out/all_scored.csv --out ./out
```

**No hace falta plantilla.** El importador detecta las columnas solo (nombre, canal, email,
seguidores, idioma, notas, en español y en inglés) y, además, rastrea cualquier enlace o email
que aparezca en cualquier columna, aunque venga sin `https://`.

### Cómo decide si alguien ya está

`identity.mjs` genera las claves con las que se reconoce a una persona y cruza por la primera
que coincida:

| Clave | Ejemplo | Fuerza |
|---|---|---|
| Plataforma y handle | `youtube:thefancycat` | Fuerte. Reconoce `@x`, `/c/x`, `/channel/UC…`, con o sin protocolo, con sufijos como `/videos` |
| Email normalizado | `email:contactsaparata@gmail.com` | Fuerte. En Gmail ignora puntos y lo que va tras `+` |
| Nombre | `name:kenji` | Frágil. **Nunca** se usa para descartar: manda a revisión |

### Qué devuelve

| Archivo | Qué contiene |
|---|---|
| `partner_nuevos.csv` | Los que no teníamos, ya puntuados y listos para la cola |
| `partner_ya_estaban.csv` | Los que ya teníamos, con la clave por la que cruzaron y lo que aportan (un email que nos faltaba, notas) |
| `partner_por_revisar.csv` | Coinciden solo por nombre. Se miran a mano: un falso negativo aquí significa escribir dos veces a alguien |
| `partner_sin_datos.csv` | Filas sin URL, email ni nombre |

### La regla que no se salta

Si una fila suya dice que **ya han hablado** con esa persona, no entra en la secuencia de
primer contacto. Escribirle como si no les conociera es peor que no escribirle. Esas filas
salen marcadas en las notas del informe.

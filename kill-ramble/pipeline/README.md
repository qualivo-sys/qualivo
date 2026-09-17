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

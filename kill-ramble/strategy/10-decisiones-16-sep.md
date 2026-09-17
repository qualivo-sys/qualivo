# 10 · Decisiones del estudio (16 sep) y plan vigente

Lea Agostino (Game Director, Scubalight) respondió en Notion a los 10 puntos y dejó 14 comentarios.
Esto sustituye a 08 y a la parte operativa de 09.

## Decisiones

| Tema | Decisión |
|---|---|
| Playtest | Abierto desde el 14 sep y extendido hasta el lanzamiento (se anuncia el 5 oct). Franjas de 1 h, 1-6 personas, zona horaria del creador. Reserva por Google Calendar. |
| Lobby | Siempre devs y bots. Lobbies públicos o con código desde el juego. El juego es de 1 a 6 jugadores: se puede jugar solo. El riesgo «lobby vacío» queda resuelto por diseño. |
| Embargo | No hay. |
| Remitente | Lea Agostino, Game Director, lea@scubalightstudios.com. |
| Juego completo | Más niveles, artefactos, cosméticos y trampas. Keys bajo petición. |
| Lanzamiento | Q4 2026: 29 oct o 3 nov. Anuncio de fecha el 5 oct. |
| Assets | Press kit en Google Docs con logo, key art, raw gameplay, clips, gifs, tráiler y capturas. Invitación oficial al playtest en Google Docs (nota de prensa con calendario, Discord y press kit). |
| Pagos | Coste cero. |
| **Cadencia** | **Un solo email por hito, sin recordatorios.** Hitos: playtest (14 sep), fecha (5 oct), lanzamiento (29 oct / 3 nov). Coste asumido: el segundo toque suele traer un tercio o la mitad de las respuestas. Excepción logística: confirmación a quien reserva y clips a quien juega. |
| Rumble Weekend | Descartado por riesgo de concentración; microhitos continuos en su lugar. Guardado para post-lanzamiento. |
| Producción | Nada. Fuera skin con nombre. Clips los corta Qualivo. |
| Ámbito | Pendiente: ¿entran hispanohablantes? Lea escribió el email en español; se asume que sí. |
| UTM | Documentación enviada; Qualivo genera enlaces por creador. |

## Plan vigente (microhitos)

- **Semanal hasta el lanzamiento:** descubrir y puntuar creadores nuevos; un email a cada uno; confirmación a quien reserva; clips en 24 h; tracking; un post por sesión para las redes del estudio.
- **Ahora:** invitación oficial a prensa (Apollo).
- **5 oct:** email 2 a toda la base (fecha + playtest extendido + dato acumulado).
- **29 oct / 3 nov:** email 3 (lanzamiento), Curator Connect, prensa.

## Mensajes vigentes

Ver `03-outreach-secuencias.md` para la estructura; el copy vigente del hito 1 (ES de Lea ajustado, EN equivalente, prensa) vive en la sección C del Notion. Regla nueva: un solo envío por hito.

## Formulario post-sesión

1. ¿Con cuántas personas jugaste y cuánto tiempo?
2. ¿Cuál fue el momento más divertido?
3. ¿Qué te frustró o no entendiste?
4. Del 1 al 10, ¿lo jugarías con tus amigos un fin de semana? ¿Por qué?
5. ¿Vas a publicar algo? ¿Cuándo? ¿Qué te falta para hacerlo?

## Bloqueos restantes (lado Qualivo)

1. Conectar el buzón de Lea a Smartlead (o enviar desde Qualivo con su nombre y reply-to).
2. Confirmación del ámbito de idioma.
3. Aprobación final de los dos mensajes.

## Anexo 17 sep · el descubrimiento deja de ser el cuello de botella

Cambiar las categorías de Twitch de los comparables clásicos (Gang Beasts, Pummel Party) a los de 2026
(PEAK, R.E.P.O., Meccha Chameleon, Bombanana, Mimic Party) multiplicó por cinco el resultado:
de 23 streamers con 7 en inglés a **120 únicos, 79 EN y 17 ES**, con audiencias reales en directo.

Lección para el scoring: en Twitch la afinidad se mide por **qué se está jugando ahora**, no por el
histórico del género. Las categorías de un juego de 2014 las ocupan comunidades residuales y
regionales; las de un éxito reciente, los creadores que buscan el siguiente juego. Los comparables
deben revisarse cada trimestre.

Campañas creadas en Smartlead (sin activar): `DKR · Open Playtest · Creadores EN` (3974838) y
`… ES` (3974839). Un toque, texto plano, sin tracking de aperturas, parada al responder,
L-V 9-18 hora de Argentina, 20 leads/día. Falta asignar el buzón del remitente.

Presupuesto Apify: 3,38 de 5 $ del plan gratuito. Captura de Twitch reducida a una vez al día
(02:00 UTC) para llegar a fin de mes.

## Anexo 17 sep (2) · el canal real es el mensaje directo

De los ~30 creadores con encaje, solo 11 tienen email público. Los mejores (Kenji, KaraCorvus,
BookOfKen, TheFancyCat, ItzXngel, purrjectyui) solo se alcanzan por DM en Twitch, X o Discord.

Consecuencia: **el outreach no depende de Smartlead**. Smartlead cubre un tercio de la lista; los
otros dos tercios los cubre una persona escribiendo a mano, 10 al día por cuenta, desde el perfil
del Game Director. Eso arranca hoy.

Reparto: Lea escribe a mano a los 6 Tier 1-2 grandes; el resto se reparte entre email (Smartlead) y
DM manual.

Plantillas de DM (EN/ES) en la sección 12 del Notion.

## Hallazgos sobre la ficha de Steam (17 sep)

1. Sigue en «próximamente» y **no dice que se pueda publicar vídeo**. Meccha Chameleon lo pone
   explícito en su ficha. Son dos líneas en Steamworks y quitan la duda al creador que llega solo.
2. Hay una línea de requisitos recomendados en español dentro del bloque en inglés
   («GPU dedicada con 4 GB de VRAM»).
3. **No está activado el Steam Playtest**, solo la demo. El Playtest de Steam notifica a todos los
   que tienen el juego en lista de deseados: tráfico gratis que no se está usando.
4. El calendario de reservas carga con JavaScript; no se puede auditar la disponibilidad desde
   fuera. Hay que comprobar qué franjas y qué zonas horarias ve un creador de EE. UU.

## Anexo 17 sep (3) · qué se automatiza y qué no

Se ha construido `pipeline/`: un comando lleva de las ejecuciones de Apify a los entregables
listos para enviar. Recoge datasets, normaliza YouTube y Twitch a un registro común, puntúa,
deduplica contra Notion por URL, personaliza por reglas y escribe:

- `smartlead_en.csv` y `smartlead_es.csv` con `cited_video`, `video_detail`, `booking_link` y `steam_utm` por creador.
- `dm_queue.md` con los que no tienen email: por dónde escribirles y el mensaje ya redactado.
- `all_scored.csv` para auditar.

Programable por cron tras la captura diaria de Twitch.

**Lo que no se automatiza, a propósito:**

1. **El envío de mensajes directos.** Es el canal de dos tercios de esta lista y las plataformas
   banean las cuentas que mandan mensajes idénticos en ráfaga. El pipeline lo reduce a copiar y
   pegar, con tope de 10 al día por cuenta.
2. **La sesión.** El valor de la oferta es que el Game Director esté dentro.
3. **Tier 1.** Se llega por presentación de quien ya jugó.

La personalización se hace **por reglas, no con IA**: el vídeo citado y el detalle salen de datos
reales (título, vistas, colaboradores, categoría en directo, espectadores). Es auditable y no
inventa. Si algún día el volumen lo pide, el punto de enganche para un modelo está en
`personalize.mjs`, con revisión humana antes de enviar.

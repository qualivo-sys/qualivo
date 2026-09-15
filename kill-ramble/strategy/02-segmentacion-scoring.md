# 02 · Segmentación y scoring

## Segmentos

| Segmento | Definición | Qué queremos de ellos | Cómo se les trata |
|---|---|---|---|
| **Tier 1** | YouTube > 500k subs con vídeos de party games, o Twitch > 3.000 espectadores medios, o TikTok > 1M | Un vídeo/stream en el lanzamiento. | Manual, uno a uno, remitente el CEO. Se les llega a través de un Tier 2 de su círculo o del editor. No entran en Smartlead. |
| **Tier 2** | YouTube 30k-500k, Twitch 100-3.000 espectadores medios, TikTok 100k-1M | Sesiones ahora, contenido en demo y lanzamiento, y ser puente a Tier 1. | Secuencia personalizada (Smartlead con campos de vídeo citado). Son el motor del sistema. |
| **Tier 3** | YouTube 2k-30k, Twitch 20-100 espectadores, TikTok 10k-100k | Volumen de sesiones, clips, comunidad, reseñas en Steam. | Secuencia estándar + invitación abierta a Rumble Night. Programa de embajadores. |
| **Curators** | Curators de Steam con > 5k seguidores y reseñas de party/indie | Reseña en la ficha en el lanzamiento. | Curator Connect al lanzamiento; sin email. |
| **Journalists** | Periodistas y editores de medios y newsletters que cubren indies y demos | Cobertura de demo/fecha/lanzamiento. | Email 1 + 1 seguimiento con press kit. Apollo para enriquecer. |
| **Communities** | Discords, subreddits, grupos de Steam de party games y regionales | Jugadores para Rumble Nights, primeros miembros del Discord propio. | Relación con mods, eventos co-organizados, nunca spam. |

Umbrales por plataforma en `tools/score.mjs` (`TIERS`). Se revisan cada mes con los datos reales de respuesta.

## Modelo de scoring (100 puntos)

Objetivo del score: ordenar a quién contactar primero y qué secuencia recibe. No es una nota de
«calidad» del creador; es una estimación de **probabilidad de que juegue y publique** ponderada por
**impacto si lo hace**.

| Bloque | Criterio | Pts | Justificación |
|---|---|---|---|
| **Afinidad con el género** (máx. 20) | ≥ 50 % de los últimos 30 vídeos son party/físicas/co-op caótico | 20 | El creador ya tiene el público que compra este juego. Es el predictor más fuerte de que publique y de que su vídeo rinda. |
| | 20-49 % | 12 | Lo cubre a veces; hará el vídeo si la sesión es buena. |
| | < 20 % pero con algún vídeo de género | 5 | Improbable pero no imposible. |
| **Afinidad con comparables** (máx. 20) | 3+ comparables de la lista núcleo en 6 meses | 20 | Si ha grabado Gang Beasts, Party Animals y Pummel Party, Don't Kill Rumble es su siguiente vídeo natural. |
| | 1-2 comparables | 12 | |
| | Solo adyacentes | 6 | |
| **Tamaño de audiencia** (máx. 15) | Escala logarítmica dentro de su plataforma | 0-15 | El tamaño importa menos que la afinidad: un canal grande sin afinidad no publica. Se satura a 15 para que nadie entre solo por ser grande. |
| **Engagement** (máx. 10) | (likes + comentarios) / vistas medias, o chat activo en Twitch | 0-10 | Diferencia canales vivos de canales inflados. En Twitch, ratio mensajes de chat por espectador (SullyGnome). |
| **Frecuencia** (máx. 10) | ≥ 8 publicaciones/mes o ≥ 12 streams/mes | 10 | Quien publica mucho necesita juegos nuevos: dice que sí más. |
| | 3-7 / 4-11 | 6 | |
| | Menos | 0 | |
| | Sin actividad en 45 días | tope 34 | Canal parado: no gastar un toque. El score total se limita a 34 (no contactar, revisar en 90 días). |
| **Historial cubriendo indies** (máx. 15) | ≥ 30 % de vídeos recientes de juegos con < 1.000 reseñas en Steam | 15 | Prueba de que juega demos y juegos sin nombre. Los que solo cubren AAA no cambiarán por nosotros. |
| | 10-29 % | 8 | |
| | < 10 % | 0 | |
| **Probabilidad de responder** (máx. 10) | Email de negocio público (About/bio/panel) | +4 | Sin canal directo no hay respuesta. |
| | Perfil en Keymailer/Lurkit/Woovit o menciona «keys welcome» | +3 | Pide juegos activamente. |
| | Ha respondido antes a nosotros o al editor | +3 | Relación existente. |
| **Ajustes** | Idioma español (ES/LatAm) | +5 | Mercado menos saturado, estudio nativo, sesión en su horario. Tope 100. |
| | Juega en squad reconocible (aparecen los mismos amigos en sus vídeos) | +5 | Trae a los otros cinco. |
| | Pide pago explícitamente en la bio para cualquier juego | −10 | No es descarte, pero no es prioridad pre-lanzamiento. |
| | Contenido no apto / polémico | −100 | Descarte. |

## Umbrales de acción

| Score | Acción | Secuencia |
|---|---|---|
| 75-100 | Contactar esta semana, mensaje personalizado a mano (aunque sea Tier 3) | Playtest con fecha concreta |
| 55-74 | Contactar en la tanda semanal | Secuencia estándar de su tier |
| 35-54 | Cola; solo con capacidad sobrante o si es squad de un 75+ | Invitación abierta a Rumble Night |
| < 35 | No contactar. Se revisa en 90 días | — |

## Cómo se obtienen los datos

| Dato | Fuente |
|---|---|
| Últimos 30 vídeos + títulos + vistas + likes + comentarios | Apify «YouTube Scraper» (canal) o YouTube Data API v3 (gratis, 10k unidades/día) |
| Juegos streameados en 90 días, espectadores medios, chat | SullyGnome (gratis), TwitchTracker |
| Email | About de YouTube (requiere clic «ver email» con captcha: Apify lo resuelve en parte), panel About de Twitch, bio de TikTok, Linktree |
| Indie share | Cruce de títulos de vídeo con lista de juegos y su nº de reseñas en Steam (Apify «Steam Store Scraper» o API `appreviews`) |
| Squad | Menciones de otros canales en descripciones y títulos («ft.», «w/», «con») |

El script `tools/score.mjs` toma un CSV con estas columnas y devuelve score, tier y una columna
`motivo` con los puntos por bloque para que cualquiera pueda auditar por qué alguien está arriba.

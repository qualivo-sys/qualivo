# 04 · Workflows de automatización

Cada workflow indica herramientas, coste mensual estimado (precios de lista aproximados, verificar al
contratar), complejidad de montaje (1 = una tarde, 5 = una semana con desarrollo) y ROI esperado
expresado en el KPI que mueve. La orquestación entre herramientas se hace con **n8n** (self-hosted,
gratis, o cloud ~20 €/mes) o Make; lo que no merece automatizarse se marca como manual.

## W1 · YouTube: descubrimiento → sesión → vídeo

```
Apify YouTube Scraper (búsqueda: "{comparable} funny moments", "{comparable} con amigos")
  ↓ canales únicos de los resultados
Apify YouTube Channel Scraper (últimos 30 vídeos, métricas, About, email si visible)
  ↓ CSV
tools/score.mjs → score, tier, motivo
  ↓ n8n
Airtable (tabla Creadores; estado = «por revisar» si score ≥ 55)
  ↓ revisión humana: rellenar video_citado + detalle (2 min por creador)
Smartlead (campaña por idioma y tier; secuencia A)
  ↓ webhook de respuesta → n8n → Airtable estado «respondió»; aviso en Discord #outreach
Cal.com o enlace a evento de Discord (Rumble Night)
  ↓ sesión jugada → Airtable «jugado» + notas de feedback
Clip pack (carpeta Drive por creador) + skin con nombre + enlace UTM
  ↓ Apify YouTube Search semanal: "Don't Kill Rumble"
Airtable tabla Contenido (URL, vistas a 7 y 30 días) + Steam UTM (visitas, wishlists)
  ↓ 30 días sin vídeo → secuencia E en el siguiente hito
```

| Concepto | Detalle |
|---|---|
| Herramientas | Apify (~49 $/mes plan Starter, cubre ~5.000 canales/mes), Airtable (Team ~20 €/usuario), Smartlead (Basic 39 $ / Pro 94 $), n8n (0-20 €), Cal.com (gratis) |
| Coste | ~110-180 €/mes + 1 dominio de envío (~15 €/año) + 2-3 buzones (Google Workspace ~6 €/buzón) |
| Complejidad | 3. Lo que cuesta es el enriquecimiento de email (Apify no siempre saca el email del About) y la revisión humana |
| Volumen realista | 400-600 canales descubiertos/mes → 150-250 con score ≥ 55 y email → 150-250 contactados |
| ROI esperado | Tasa de respuesta 8-12 % con `video_citado` bien hecho → 15-25 respuestas → 8-15 sesiones → 6-12 vídeos/mes. Es el workflow que produce wishlists |

## W2 · Twitch: quién juega a los comparables → Rumble Night

```
SullyGnome (gratis): lista de canales que streamearon Gang Beasts / Party Animals / Pummel Party /
Stick Fight / Rubber Bandits en los últimos 90 días, con espectadores medios y horas
  ↓ export CSV (manual, 10 min/semana) o Apify «Twitch Scraper» para el About y enlaces
score.mjs (variante Twitch: espectadores medios, ratio chat, juegos coincidentes)
  ↓
Airtable
  ↓ email del panel About → Smartlead (secuencia A, con hora de sesión en su zona)
  ↓ sin email → DM en X o Discord del streamer (manual, plantilla corta, máx. 10/día)
Rumble Night en su horario → el streamer trae viewers → lobby lleno
  ↓ TwitchTracker / SullyGnome: detectar stream de Don't Kill Rumble, horas, pico
Airtable Contenido + clips del VOD → TikTok del estudio
```

| Concepto | Detalle |
|---|---|
| Herramientas | SullyGnome (0 €), TwitchTracker (0 €), Apify (incluido en W1), Smartlead (incluido) |
| Coste | ~0 € adicional |
| Complejidad | 2 |
| Volumen | 100-200 streamers cualificados/mes; DM manual limita a ~40/mes sin email |
| ROI esperado | Es el mejor ratio sesión/esfuerzo del sistema. Tasa de respuesta 10-15 % en Tier 3, 5-8 % en Tier 2. Cada streamer que viene trae 5-30 jugadores extra a la sesión |

## W3 · TikTok / Shorts: alimentar clips, no hacer outreach masivo

```
Apify TikTok Scraper (hashtags: #gangbeasts #partyanimals #partygames #juegosconamigos)
  ↓ creadores con email en bio o Linktree
score.mjs (TikTok: seguidores, vistas medias, frecuencia)
  ↓
Secuencia ligera (1 email + 1 seguimiento) con clip pack + invitación abierta a Rumble Night
  ↓ en paralelo
Estudio publica 3 clips/semana de las Rumble Nights (formato: 6 personas, un fallo absurdo, 8 s)
  ↓ concurso mensual de clips en Discord (premio: skin exclusivo + mención en créditos)
Tracking: Apify TikTok Search "don't kill rumble" semanal → Airtable Contenido
```

| Concepto | Detalle |
|---|---|
| Herramientas | Apify, Smartlead, CapCut (0 €) |
| Coste | ~0 € adicional; 3-4 h/semana de edición |
| Complejidad | 2 |
| ROI esperado | Bajo en respuesta directa (3-5 %), alto en alcance: un clip que funciona vale más que 50 emails. Se mide en vistas y en visitas UTM desde bio |

## W4 · Steam Curators (en lanzamiento)

```
Apify «Steam Curator Scraper» (o scraper propio): curators con etiquetas party, multiplayer, indie,
  nº seguidores, idioma, reseñas recientes
  ↓ score simple: seguidores × afinidad de etiquetas × actividad 90 días
Steamworks → Curator Connect: enviar clave a los 100 mejores con mensaje de 2 líneas
  ↓ 14 días
Reseñas publicadas → Airtable Contenido; segunda tanda de 100 si el ratio > 15 %
```

| Concepto | Detalle |
|---|---|
| Herramientas | Steamworks (0 €), Apify |
| Coste | 0 € |
| Complejidad | 1 |
| ROI esperado | 10-20 reseñas de curator por cada 100 claves. Impacto individual bajo, pero suma en la ficha el día 1. Solo aplica cuando el juego se venda |

## W5 · Prensa y newsletters

```
Apollo: búsqueda «journalist / editor / writer» en dominios de medios objetivo (lista en 01-arquitectura)
  ↓ enriquecimiento de email (Apollo) · verificación (Smartlead verifier o MillionVerifier ~15 $)
Airtable (tabla Prensa; ángulo asignado por persona: LatAm, físicas, streamers, indie online)
  ↓ Smartlead secuencia F (1 + 1), remitente CEO, press kit enlazado
Respuesta → build/entrevista → cobertura → Airtable Contenido
```

| Concepto | Detalle |
|---|---|
| Herramientas | Apollo (plan actual), Smartlead, presskit() (0 €) |
| Coste | 0-15 € adicional |
| Complejidad | 2 |
| Volumen | 80-120 periodistas por hito (demo actualizada, fecha, lanzamiento) |
| ROI esperado | 5-10 % de respuesta; 3-8 piezas por hito. El valor está en poder citar «según PC Gamer» en los emails a creadores Tier 1 |

## W6 · Discord y Reddit: comunidades (manual por diseño)

No se automatiza el contacto. Se automatiza el calendario y el recordatorio.

```
Lista de 30 servidores objetivo (Disboard, servidores de comparables, LatAm gaming, streamers Tier 2)
  ↓ contacto con mods (manual)
Co-organizar una «noche de Don't Kill Rumble» en su servidor
  ↓ n8n: evento programado en Discord del estudio + recordatorio 24 h y 1 h
Jugadores → rol @Rumbler en nuestro Discord → formulario de feedback
Reddit: 1 post por hito en r/IndieGaming, r/playmygame, r/Games Indie Sunday, r/argentina
```

| Concepto | Detalle |
|---|---|
| Coste | 0 € |
| Complejidad | 1 |
| ROI esperado | 20-60 jugadores por servidor grande; alimenta las Rumble Nights para que ningún creador juegue en vacío. Comunidad inicial de 500-1.500 miembros en 90 días |

## W7 · Tracking de contenido y atribución

```
Semanal (n8n cron):
  Apify YouTube Search + TikTok Search + Twitch (SullyGnome «game» page) → "Don't Kill Rumble"
  ↓ nuevo contenido → Airtable Contenido (creador, URL, vistas, fecha)
  ↓ cruzar con Steamworks UTM (visitas, wishlists por enlace) exportado a mano semanalmente
Dashboard en Airtable Interface o Google Sheet: sesiones, respuestas, contenido, alcance, wishlists
```

| Concepto | Detalle |
|---|---|
| Coste | 0 € adicional |
| Complejidad | 2 |
| ROI esperado | Es lo que permite dejar de medir emails y empezar a medir wishlists. Sin esto, el resto es fe |

## Resumen de costes

| Partida | Mes |
|---|---|
| Apify Starter | ~49 $ |
| Smartlead Basic/Pro | 39-94 $ |
| Airtable Team (2 usuarios) | ~40 € |
| n8n cloud (opcional) | 0-20 € |
| Buzones de envío (3) | ~18 € |
| Verificador de emails | ~15 $ |
| **Total** | **~160-240 €/mes** |

Fase 2 (mes 3+, si W1 y W2 funcionan): Modash o HypeAuditor (~99-300 $/mes) para enriquecer emails y
audiencias de Tier 1-2; Clay solo si el volumen supera 2.000 creadores/mes.

## Qué no automatizar

- El campo `video_citado`. Es el trabajo.
- Los DMs en X y Discord. Las cuentas se banean y los creadores lo notan.
- El contacto con mods de comunidades.
- Tier 1. Uno a uno, desde el CEO, por presentación de alguien que ya jugó.

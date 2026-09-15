# 01 · Arquitectura: del descubrimiento al contenido publicado

## Embudo

```
DESCUBRIR ──► CALIFICAR ──► CONTACTAR ──► RESERVAR SESIÓN ──► JUGAR ──► CONTENIDO ──► AMPLIFICAR ──► RELACIÓN
 Apify         score.mjs     Smartlead      Cal.com /          Rumble     Seguimiento    Reshare,     Airtable
 SullyGnome    Airtable      Curator        Discord            Night      + clip pack    Steam UTM,   hitos:
 YouTube       (tiers)       Connect        (fecha fija)       (lobby     + tracking     clips a      demo update,
 Curators                    Discord/DM                        lleno)     Apify          TikTok       lanzamiento
```

Cada etapa tiene un dueño, una herramienta y un dato que la cierra:

| Etapa | Dueño | Herramienta | Dato que cierra la etapa |
|---|---|---|---|
| Descubrir | Growth | Apify, SullyGnome, TwitchTracker, búsqueda YouTube por comparables | Fila en Airtable con URL y métricas base |
| Calificar | Growth (automático) | `tools/score.mjs` | Score 0-100 + tier + motivo |
| Contactar | Growth, remitente humano del estudio | Smartlead (email), Discord/X DM (manual), Curator Connect | Estado «contactado» + secuencia activa |
| Reservar sesión | Creador | Cal.com o enlace Discord a evento | Fecha de sesión en Airtable |
| Jugar | Community manager + 2 devs | Discord + demo Steam | Sesión marcada «jugada», notas de feedback |
| Contenido | Creador | Clip pack, UTM propio | URL de vídeo/stream detectada |
| Amplificar | Estudio + comunidad | X, TikTok, Discord, Steam eventos | Alcance registrado, wishlists por UTM |
| Relación | Growth | Airtable, secuencia de hitos | Próximo toque programado |

## Canales, priorizados

Orden por impacto esperado sobre las prioridades 1-2 (playtests y contenido) con el coste de llegar.

| # | Canal | Para qué sirve | Cómo se descubre | Cómo se contacta | Prioridad |
|---|---|---|---|---|---|
| 1 | **Twitch** (streamers 100-3.000 espectadores medios) | Playtests con lobby garantizado: el streamer trae a sus viewers. Feedback en directo. | SullyGnome/TwitchTracker: quién ha streameado Gang Beasts, Party Animals, Pummel Party en 90 días. Apify Twitch para «about» y redes. | Email del panel «about», DM en X, Discord del streamer | **Alta** |
| 2 | **YouTube** (canales de party games y «con amigos») | Visibilidad duradera y wishlists. Un vídeo de 15 min con 6 amigos es el formato nativo del juego. | Apify YouTube: búsqueda por «[comparable] funny moments», canales de esos vídeos, email del About. | Email (Smartlead) | **Alta** |
| 3 | **Discord** (servidores de party games, comunidades LatAm y ES, servidores de creadores Tier 2) | Suministro de jugadores para las Rumble Nights y comunidad inicial. | Disboard, Discord Discovery, servidores de los comparables, servidores de los propios creadores | Manual, con permiso de mods; eventos programados | **Alta** |
| 4 | **TikTok / Shorts** | Clips. Las físicas ridículas son nativas del formato. No se hace outreach masivo: se alimenta a creadores y comunidad con clips y se organiza un concurso. | Apify TikTok por hashtags de comparables; creadores con email en bio | Email/DM ligero + clip pack | Media |
| 5 | **Steam Curators** | Presencia en la ficha y reseñas al lanzar. Impacto individual bajo, coste casi cero. | Steamworks Curator Connect (nativo) + Apify sobre páginas de curators con etiquetas party/multiplayer | Curator Connect (claves), sin email | Media (ejecutar en lanzamiento) |
| 6 | **Reddit** | Momentos: demo actualizada, fecha, lanzamiento. Prohibido spam. | r/IndieGaming, r/playmygame, r/Games (Indie Sunday), r/partygames, r/argentina, r/mexicogaming, r/Steam | Posts del propio dev, AMAs | Media (por hito) |
| 7 | **Prensa** | Cobertura y credibilidad para la ola de creadores. | Apollo (periodistas con email corporativo), Alpha Beta Gamer (cubren demos), Indie Games Plus, RPS, PC Gamer; ES: Vandal, 3DJuegos, MeriStation; LatAm: Malditos Nerds, Press Over, Cultura Geek, Los Andes | Email con press kit, 1 seguimiento | Media |
| 8 | **Newsletters** | Descubrimiento de calidad, público que sí juega demos. | Alpha Beta Gamer, Indie Games Plus, Buried Treasure, Warp Door, GameDiscoverCo (lado dev) | Email personal al editor | Baja-media |
| 9 | **X / Twitter** | Relación con creadores, prensa y gamedev. Poco alcance directo. Sirve para «calentar» antes del email. | Seguimiento de listas de comparables y periodistas | Interacción real + DM | Baja (soporte) |
| 10 | **Comunidades gamedev** | Testers y feedback, no visibilidad. | Steam Playtest (nativo), r/playmygame, Feedback Quest, ADVA, Polo TIC | Manual | Baja (feedback) |

## Por qué Twitch antes que YouTube para playtests

- Un stream es una sesión con jugadores garantizados y feedback en directo. Un vídeo de YouTube es
  grabado, editado y publicado semanas después.
- El streamer de 300 espectadores medios en Twitch responde más que el youtuber de 300.000 suscriptores.
- Los clips del stream alimentan TikTok sin producir nada nuevo.

YouTube sigue siendo el canal de visibilidad y wishlists: los mejores creadores están en los dos y el
mismo squad hace stream el jueves y sube el vídeo el domingo.

## La Rumble Night

Sesión semanal fija, dos horarios:

| Sesión | Horario | Público |
|---|---|---|
| Rumble Night ES | Jueves 21:00 Argentina / 02:00 España (o viernes 20:00 España si prima ES) | Creadores y comunidad hispanohablante |
| Rumble Night EN | Sábado 15:00 ET / 21:00 CET | Creadores EN, EU y US |

Reglas: 2 devs dentro, 1 community manager de anfitrión, 6 jugadores por lobby, lobbies rotando cada
20 min, formulario de feedback de 5 preguntas al terminar, clips grabados por el estudio y enviados a los
creadores en 24 h. Todo creador que juega recibe su enlace UTM y su clip pack.

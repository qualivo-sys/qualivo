# Esquema de la base Airtable · Don't Kill Rumble Creators

Una base, cinco tablas. Airtable Team (2 usuarios). Todo lo que importa se puede exportar a CSV.

## Tabla `Creadores`

| Campo | Tipo | Notas |
|---|---|---|
| Nombre | Texto | Nombre público del creador |
| Plataforma | Selección | youtube · twitch · tiktok |
| URL | URL | Canal principal |
| Idioma | Selección | es · en · otro |
| Región | Selección | ES · AR · MX · CL · LatAm-otros · US · UK · EU · otro |
| Seguidores | Número | Subs / seguidores |
| Vistas medias | Número | Media de los últimos 30 vídeos o espectadores medios en Twitch |
| Engagement | Número (%) | (likes + comentarios) / vistas, o ratio de chat |
| Publicaciones/mes | Número | |
| Último post (días) | Número | |
| Género % | Número | % de vídeos party/físicas |
| Comparables (núcleo) | Número | Cuántos comparables núcleo en 6 meses |
| Comparables (adyacentes) | Número | |
| Indie % | Número | % de vídeos de juegos con < 1.000 reseñas |
| Email | Email | |
| Fuente del email | Selección | about · bio · keymailer · manual |
| Keymailer/Lurkit | Casilla | |
| Squad | Enlace a Creadores | Otros creadores con los que aparece |
| Pide pago | Casilla | |
| Score | Número | Salida de score.mjs |
| Tier | Selección | T1 · T2 · T3 · descartado |
| Motivo | Texto largo | Salida de score.mjs |
| Video citado | Texto | Obligatorio para entrar en campaña |
| Detalle del vídeo | Texto | Obligatorio |
| Estado | Selección | nuevo · por revisar · listo · contactado · respondió · sesión reservada · jugado · publicó · rechazó · sin respuesta · reactivar |
| Campaña Smartlead | Texto | ID de campaña |
| Último toque | Fecha | |
| Próximo toque | Fecha | |
| Sesiones | Enlace a Sesiones | |
| Contenido | Enlace a Contenido | |
| UTM | URL | Enlace Steam con UTM propio |
| Notas | Texto largo | |

## Tabla `Prensa`

Nombre · Medio · Cargo · Email (Apollo) · Idioma · Región · Ángulo asignado · Estado · Último toque ·
Contenido (enlace) · Notas.

## Tabla `Sesiones`

| Campo | Tipo |
|---|---|
| Fecha y hora | Fecha |
| Tipo | Selección: Rumble Night ES · Rumble Night EN · privada · torneo · servidor externo |
| Anfitrión | Texto |
| Devs presentes | Número |
| Jugadores totales | Número |
| Creadores | Enlace a Creadores |
| Feedback recibido | Casilla |
| Notas de feedback | Texto largo |
| Clip pack enviado | Casilla |
| Build | Texto |

## Tabla `Contenido`

| Campo | Tipo |
|---|---|
| URL | URL |
| Plataforma | Selección |
| Creador | Enlace a Creadores (o Prensa) |
| Tipo | Selección: vídeo · stream · short/tiktok · artículo · newsletter · reseña curator |
| Fecha de publicación | Fecha |
| Vistas 7 d / 30 d | Número |
| Horas vistas (stream) | Número |
| Pico de espectadores | Número |
| Visitas UTM | Número |
| Wishlists UTM | Número |
| Sesión origen | Enlace a Sesiones |

## Tabla `Comunidades`

Nombre · Tipo (discord · subreddit · grupo steam) · URL · Miembros · Idioma · Mod de contacto · Estado ·
Evento co-organizado (fecha) · Jugadores aportados · Notas.

## Vistas que se usan a diario

- `Cola de revisión`: Estado = por revisar, ordenado por Score desc.
- `Listos para enviar`: Estado = listo y Video citado no vacío.
- `Respondieron sin sesión`: Estado = respondió y sin Sesiones.
- `Jugaron sin publicar`: Estado = jugado y sin Contenido, > 14 días.
- `Reactivar en próximo hito`: Estado = sin respuesta o reactivar.

## Automatizaciones (n8n)

1. CSV de score.mjs → upsert en Creadores por URL.
2. Smartlead webhook `reply` → Estado = respondió, aviso en Discord `#outreach`.
3. Estado = listo → añadir a campaña Smartlead según Idioma + Tier.
4. Sesión creada → recordatorio Discord 24 h y 1 h a los creadores enlazados.
5. Cron semanal → Apify búsquedas del nombre del juego → upsert en Contenido.

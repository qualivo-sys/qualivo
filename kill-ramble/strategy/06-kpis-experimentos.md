# 06 · KPIs, objetivos a 90 días y experimentos

## Lo que no se mide como éxito

Emails enviados, contactos encontrados, filas en Airtable, tasa de apertura. Son inputs. Se vigilan solo
para diagnosticar (p. ej., una apertura < 40 % es un problema de entregabilidad, no de estrategia).

## KPIs principales

| KPI | Definición exacta | Fuente | Frecuencia |
|---|---|---|---|
| **Sesiones de playtest jugadas** (KPI norte) | Sesiones con ≥ 4 jugadores y ≥ 1 creador externo, con formulario de feedback recibido | Airtable Sesiones | Semanal |
| **Tasa de respuesta** | Respuestas humanas (no auto-reply) / contactados, por canal, tier e idioma | Smartlead webhook → Airtable | Semanal |
| **Tasa de conversión a sesión** | Sesiones jugadas / respuestas positivas | Airtable | Semanal |
| **Vídeos publicados** | Vídeos de YouTube/TikTok de terceros con el juego, con vistas a 7 y 30 días | W7 tracking | Semanal |
| **Streams realizados** | Streams de terceros con el juego, horas y pico de espectadores | SullyGnome / TwitchTracker | Semanal |
| **Reseñas generadas** | Reseñas de curators y de usuarios en Steam atribuibles (post-lanzamiento) | Steamworks | Mensual |
| **Alcance generado** | Suma de vistas de vídeos + horas vistas en streams + vistas de clips propios | W7 | Mensual |
| **Wishlists influenciadas** | Wishlists por enlace UTM de creador + pico de wishlists en las 48 h siguientes a cada pieza | Steamworks UTM y gráfico de wishlists | Semanal |
| **Comunidad creada** | Miembros del Discord, activos en 7 días, asistentes a Rumble Nights | Discord | Semanal |
| **Coste por sesión y por pieza** | Coste de herramientas + horas / sesiones jugadas, y / piezas publicadas | Airtable | Mensual |

## Objetivos a 90 días (supuestos declarados)

Supuestos: 2 Rumble Nights semanales, 200-250 creadores contactados al mes con `video_citado` de
calidad, respuesta media del 9 %, conversión a sesión del 50 %, publicación del 60 % de los que juegan.

| KPI | Mes 1 | Mes 2 | Mes 3 |
|---|---|---|---|
| Sesiones jugadas | 6 | 10 | 14 |
| Creadores externos que han jugado | 10 | 25 | 45 |
| Vídeos + streams publicados | 6 | 15 | 25 |
| Alcance acumulado | 50k | 250k | 600k |
| Miembros Discord | 200 | 600 | 1.200 |
| Wishlists atribuidas (UTM) | 300 | 1.200 | 3.000 |
| Piezas de prensa | 2 | 4 | 8 |

Si en el mes 1 la tasa de respuesta es < 5 %, se para el volumen y se arregla el mensaje o la
entregabilidad. Si es > 12 %, se dobla el volumen antes de tocar nada más.

## Panel semanal (una pantalla)

Fila 1: sesiones jugadas esta semana · creadores nuevos que han jugado · respuestas / contactados.
Fila 2: contenido publicado esta semana con vistas · wishlists UTM · Discord activos.
Fila 3: cola: creadores 75+ sin contactar · respuestas sin sesión reservada · sesiones sin clip pack enviado.

Vive en Airtable Interfaces; copia mensual en el Sheet de mando de Qualivo.

## Experimentos (uno o dos a la vez, 2 semanas cada uno)

| # | Hipótesis | Cómo | Métrica de decisión |
|---|---|---|---|
| E1 | Invitar a fecha concreta responde más que «avísame si te interesa» | A/B toque 1 en Smartlead | Tasa de respuesta y de sesión |
| E2 | Los hispanohablantes responden el doble que los angloparlantes al mismo mensaje | Cohortes por idioma, mismo tier | Tasa de respuesta |
| E3 | Contactar al squad completo (3-6 creadores a la vez, citándose entre ellos) convierte más que uno a uno | 20 squads vs 60 individuales | Sesiones jugadas por contacto |
| E4 | El skin con su nombre sube la publicación | Ofrecerlo a la mitad de los que juegan | % que publica |
| E5 | Clip pack en 24 h sube vistas y velocidad de publicación | Con vs sin pack | Días hasta publicar, vistas a 7 días |
| E6 | Asunto que cita el comparable abre más que asunto que describe el juego | A/B de asunto | Apertura y respuesta |
| E7 | Streamers de 50-300 espectadores traen más jugadores por sesión que los de 300-3.000 | Comparar asistentes por sesión | Jugadores externos por sesión |
| E8 | Un torneo de 6 squads de creadores genera más contenido que 6 sesiones sueltas | Un torneo en el mes 2 | Piezas publicadas y alcance |
| E9 | Publicar en Keymailer genera solicitudes entrantes de Tier 3 con mejor ratio que el outbound | Activar y medir 30 días | Sesiones por hora invertida |
| E10 | Reddit «Indie Sunday» con GIF de 6 jugadores supera al tráiler | Dos posts en semanas distintas | Visitas UTM y wishlists 48 h |

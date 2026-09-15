# 05 · Evaluación de herramientas

Criterio: ¿qué problema resuelve para **este** juego en **esta** fase, cuánto cuesta, y cuándo entra?
«Sí» significa incorporar ahora; «después» significa con condición; «no» significa que no resuelve
un problema nuestro o lo resuelve algo más barato.

| Herramienta | Qué resuelve | ¿Merece la pena? | Cuándo |
|---|---|---|---|
| **Smartlead** (tenemos) | Envío de secuencias con rotación de buzones, warm-up, A/B y webhooks | **Sí**. Motor de envío. Ojo: sirve para email; no sustituye el DM ni el Discord | Ya |
| **Apollo** (tenemos) | Base de datos B2B con emails corporativos | **Sí, solo para prensa**. Los creadores no están en Apollo. Usarlo para youtubers es pensar como marketer B2B | Ya, W5 |
| **Apify** (tenemos) | Scrapers de YouTube, TikTok, Twitch, Steam, Reddit, Discord (Disboard) | **Sí**. Es el motor de descubrimiento. Elegir actores con mantenimiento reciente y presupuesto mensual fijo | Ya, W1-W4, W7 |
| **Airtable** | CRM ligero: creadores, prensa, sesiones, contenido; vistas por tier y estado; automatizaciones básicas; Interfaces para el dashboard | **Sí**. Una sola fuente de verdad. Esquema en `data/airtable-schema.md` | Ya |
| **SullyGnome** | Qué streamers jugaron cada juego en Twitch, con espectadores medios, horas, chat | **Sí**. Gratis y es la mejor fuente de descubrimiento de Twitch por comparables | Ya, W2 |
| **Stream Hatchet** | Analítica de streaming a nivel enterprise (Twitch, YouTube Live, Kick), informes de campaña | **No ahora**. Precio enterprise (miles al año). SullyGnome + TwitchTracker + Streams Charts cubren el 90 % gratis o barato | Post-lanzamiento, si hay presupuesto de campañas pagadas |
| **HypeAuditor** | Base de influencers con emails, calidad de audiencia (fake followers), YouTube/TikTok/Twitch | **Después**. Resuelve el enriquecimiento de emails y la detección de audiencias infladas en Tier 1-2. Desde ~300 $/mes | Mes 3, si W1 produce > 200 canales sin email al mes |
| **Modash** | Similar a HypeAuditor, mejor filtro por contenido y lookalikes, Instagram/TikTok/YouTube | **Después, alternativa a HypeAuditor**. Probar 1 mes (~99-199 $) y quedarse con el que devuelva más emails de Tier 2 | Mes 3 |
| **Favikon** | Rankings y perfiles de creadores, fuerte en LinkedIn/X/Instagram B2B | **No**. Enfoque B2B; no cubre bien gaming en YouTube/Twitch | — |
| **Clay** | Enriquecimiento en cascada, IA para redactar campos, integra Apollo, Apify y 50 proveedores | **Después**. Resuelve el `video_citado` a escala con IA + revisión y el waterfall de emails. Desde ~149 $/mes con créditos que se agotan rápido | Cuando el volumen supere 2.000 creadores/mes o haya 3+ juegos en cartera |
| **HeyReach** | Automatización de LinkedIn multi-cuenta | **No**. Los creadores gaming no viven en LinkedIn. Para prensa, un email funciona mejor | — |
| **Instantly** | Envío de secuencias de email | **No**. Duplica Smartlead | — |
| **PhantomBuster** | Automatizaciones de redes (X, Instagram, LinkedIn): follows, DMs, extracción | **No por ahora**. Los DMs automatizados en X queman cuentas y reputación. Para extracción, Apify es más flexible | Solo si se decide automatizar el follow en X a listas de creadores (riesgo medio) |
| **Taplio** | Contenido y crecimiento en LinkedIn | **No** | — |
| **SimilarWeb** | Tráfico web de terceros | **No**. No hay problema que resuelva aquí | — |
| **SparkToro** | Qué siguen, leen y ven las audiencias de un tema (research de audiencia) | **Quizá, un mes**. Para descubrir qué canales, podcasts y subreddits sigue la audiencia de «Gang Beasts» y ampliar la lista de comparables. ~50 $ | Mes 2, un mes |
| **Common Room** | CRM de comunidad: unifica Discord, GitHub, Slack, X en perfiles | **No**. Pensado para devtools B2B; caro. Discord + Airtable bastan | — |
| **Folk** | CRM ligero colaborativo | **No**. Compite con Airtable; elegir uno. Airtable gana por automatizaciones e Interfaces | — |

## Herramientas que faltan en la lista y sí importan

| Herramienta | Qué resuelve | Coste | Cuándo |
|---|---|---|---|
| **Steamworks: Curator Connect, Playtest, UTM analytics, Eventos** | Reparto de claves a curators, gestión de acceso a playtest, atribución de visitas y wishlists por enlace, visibilidad de eventos en la ficha | 0 € | Ya. La atribución UTM es la pieza que hace medible todo el sistema |
| **Keymailer** | Marketplace de claves creador ↔ estudio; verifica identidad del creador; los creadores solicitan | Gratis para devs en el plan básico | Ya. Publicar el juego: llegan solicitudes entrantes verificadas |
| **Lurkit** | Similar; fuerte en Twitch; «quests» con objetivos de contenido; tracking de streams | Gratis / desde ~100 €/mes según campaña | Mes 2, para lanzamiento |
| **Woovit** | Similar, YouTube y Twitch, verificación de canales | Gratis en básico | Mes 2 |
| **TwitchTracker / Streams Charts** | Complemento de SullyGnome; tendencias por juego | 0 € / desde ~50 $ | Ya (gratis) |
| **Social Blade** | Crecimiento histórico de canales para detectar canales en ascenso (mejor ratio respuesta/impacto) | 0 € | Ya |
| **presskit()** o página propia de prensa | Press kit estándar de la industria | 0 € | Semana 1 |
| **n8n** | Orquestación entre Apify, Airtable, Smartlead, Discord | 0-20 € | Semana 1 |
| **Cal.com** | Reserva de sesiones sin ir y venir de emails | 0 € | Semana 1 |
| **MillionVerifier** u otro verificador | Evitar rebotes que hunden la entregabilidad | ~15 $ / 10k | Ya |
| **Dominio de envío separado** (p. ej. `play-dontkillrumble.com`) | Proteger el dominio principal de la reputación del outreach | ~15 €/año + buzones | Semana 1, warm-up 2-3 semanas antes del primer envío |

## Stack recomendado por fase

| Fase | Stack |
|---|---|
| Semanas 1-8 | Apify · SullyGnome · score.mjs · Airtable · n8n · Smartlead · Cal.com · Discord · Steamworks UTM · Keymailer · presskit() |
| Mes 3+ | + Modash o HypeAuditor (1 mes de prueba) · + Lurkit para la campaña de lanzamiento · + SparkToro (1 mes) |
| Solo si hay > 2.000 creadores/mes o más juegos | + Clay |

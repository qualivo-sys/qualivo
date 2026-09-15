# 07 · Riesgos, prioridades y siguiente paso

## Riesgos y mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **Lobby vacío**: un creador entra solo y no hay nadie | Alta si no se hace nada | Muy alto: mata el vídeo y la relación | Rumble Nights fijas; nunca enviar sin fecha; 2 devs y comunidad de guardia; bots o modo local como red de seguridad si el juego lo permite |
| **Sin fecha de lanzamiento** | Actual | Alto: el contenido no convierte en urgencia | Pedir ventana pública al estudio; mientras tanto, usar «demo actualizada» y torneos como hitos |
| **Entregabilidad**: dominio quemado por enviar desde el principal sin warm-up | Media | Alto | Dominio separado, 3 buzones, warm-up 3 semanas, < 30 emails/buzón/día, verificador, texto plano |
| **Nombre incorrecto en materiales** («Kill & Ramble») | Media | Medio: parece descuido | Regla en `AGENT.md`; revisión de plantillas |
| **Objeción a Easy Anti-Cheat** (kernel) | Media | Medio en prensa y creadores técnicos | Respuesta en FAQ del press kit; explicar por qué (online competitivo) y qué datos no se recogen |
| **Zonas horarias** (estudio en Argentina; creadores EN en EU/US) | Alta | Medio | Dos horarios de sesión; un anfitrión que pueda cubrir el sábado EU |
| **Creadores que piden pago** | Media en Tier 1-2 EN | Bajo | Política clara: pre-lanzamiento sin pagos; en lanzamiento, presupuesto pequeño para 3-5 Tier 2 ES/LatAm con mejor ratio |
| **Scraping y datos personales** (RGPD/LOPD) | Media | Medio | Solo emails publicados como contacto profesional; interés legítimo; baja en un clic; no guardar más de lo necesario; borrar a los 12 meses sin interacción |
| **Fraude de claves** (falsos creadores) | Baja pre-lanzamiento (demo gratis), alta en lanzamiento | Bajo | Curator Connect y Keymailer verifican; nunca claves por DM sin verificar canal |
| **Demo con bugs durante una sesión con creador** | Media | Alto | Build estable congelada para Rumble Nights; sesión de prueba interna 24 h antes |
| **Fatiga del equipo**: 6 personas, 2 sesiones semanales + desarrollo | Alta | Alto | Anfitrión = community manager (Qualivo puede cubrirlo); devs solo 1 h por sesión; rotación |
| **Dependencia de Apify/actores de terceros que se rompen** | Media | Bajo | Presupuesto mensual fijo; YouTube Data API como respaldo; exportar CSVs a Drive |

## Prioridades (orden de ejecución)

### Semana 1 · Cimientos (sin esto, el outreach hace daño)
1. Confirmar nombre, remitente humano y ventana pública con el estudio.
2. Fijar las dos Rumble Nights (día, hora, anfitrión) y crear los eventos en Discord.
3. Dominio de envío + 3 buzones en Smartlead con warm-up.
4. Press kit (presskit()) con FAQ de EAC, GIFs de 5 s y tráiler.
5. Base Airtable según `data/airtable-schema.md`; n8n conectado a Smartlead y Airtable.
6. Enlaces UTM de Steam por canal y por creador.
7. Publicar el juego en Keymailer.

### Semana 2 · Primera lista de 100
- 50 hispanohablantes + 50 angloparlantes, Tier 2-3, 60 % Twitch y 40 % YouTube, todos con score ≥ 55.
- Fuentes: SullyGnome (comparables 90 días) y Apify YouTube (búsqueda por comparables).
- `video_citado` rellenado a mano en los 100.

### Semanas 3-4 · Primeras sesiones
- Envío de la secuencia A escalonado (25/día).
- 4 Rumble Nights. Objetivo: 10 creadores externos jugados, 6 piezas publicadas.
- Primer informe: tasa de respuesta por idioma, tier y canal. Decidir E1-E3.

### Mes 2 · Escalar lo que funciona
- 200-250 contactos/mes en el canal e idioma ganador.
- Torneo de creadores (E8). Prensa por hito (W5). Comunidades (W6).
- Prueba de Modash/HypeAuditor si faltan emails.

### Mes 3 · Preparar lanzamiento
- Lista de curators lista para Curator Connect.
- Tier 1: 5-10 aproximaciones por presentación de Tier 2 que ya jugaron.
- Build de prensa 14 días antes de la fecha.

## Siguiente paso recomendado

**Fijar las dos Rumble Nights con fecha y anfitrión antes de escribir un solo email.** Todo el sistema
invita a una fecha; sin fecha no hay sistema. En paralelo, arrancar el warm-up del dominio, porque son
tres semanas que no se pueden acortar. La primera lista de 100 se puede construir mientras tanto con
SullyGnome y Apify.

Lo que necesito del estudio esta semana: remitente, horarios de sesión, ventana de lanzamiento (aunque
sea trimestre) y acceso a Steamworks para UTM y Curator Connect.

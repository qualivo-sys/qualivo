# Inventario de sistemas de Qualivo · 3-nov-2026 (desde el código)

> Leído del repositorio (rama `claude/qualivo-landing-vercel-nubk1i`) en solo lectura. Madurez: **OPERATIVO** (en producción, llamado por cron, webhook o página) · **PILOTO** (existe pero apagado por bandera, en modo sombra o sin cron) · **PROTOTIPO/DEMO** · **IDEA** (solo en documentos).
> Banderas que cambian la madurez: voz (Raquel), reenganche, secuencias de correo y recordatorio de las 9:00 están **pausados** en el código. `COPILOTO=false`: el agente de WhatsApp contesta solo desde el 1-oct.
> Las respuestas de cada agente se añaden en Notion: «Qualivo Growth System · Arquitectura, agentes y casos de uso».

## 1 · Captación
- **OPERATIVO:** entrada de leads de Meta (webhook) + rescate cada 2 min de los que no llegaron al CRM (`meta-leadform.js`, `rescate-leads.js`); landings de diagnóstico por sector con huecos reales del calendario (`diagnostico.js`, `huecos.js`); páginas ABM por cuenta que avisan solo si hay comportamiento humano (`visita.js`); kit por reunión: demo, landing con la marca del prospecto y sector de Intelligence (`propuestas/`, proceso); cambios de campaña en Meta por el agente Paid/Growth, siempre con autorización citada (bus `cambio-meta`).
- **OPERATIVO como agente (manual):** skills de creatividad (guiones, brief, revisión); nada se genera sin aprobación.
- **PILOTO:** landing con precio delante (`encaja.js`); Al Milímetro: formulario «Calcula tu reforma» con puntuación hacia su CRM; EAC: 5 lead magnets (rama EAC).
- **OPERATIVO en código, dependiente de voz caída:** «Prueba tu agente» de voz (`prueba.js`).
- **PROTOTIPO:** fábrica de vídeo (idea → guion → storyboard, se para antes de generar).

## 2 · Cualificación
- **OPERATIVO:** puntuación A/B/C/D con dos notas, tipología y comportamiento (`_scoring.js`); ficha del negocio investigada con IA para A/B (`_enriquecer.js`); el agente de WhatsApp precualifica antes de ofrecer cita.
- **PILOTO:** formularios v2 y HZ en modo sombra (etiquetan, no descartan); Al Milímetro: descarte por zona y A/B/C.

## 3 · Atención y seguimiento
- **OPERATIVO:** cadencia con primer WhatsApp escrito con IA (`activacion.js`, cada 10 min; los A/B esperan 10 min por si interviene Maikel en horario); agente de WhatsApp que contesta, propone 2 huecos reales y reserva (`_agente.js`; pasa a Maikel con precio, queja, negociación o si lo piden); vigía de 15 min; avisos al móvil; 6 correos de nurturing (formación y clínicas); confirmación de cita + evento a Meta; recordatorios de víspera y de una hora antes; supresión antes de contactar.
- **PILOTO (pausado):** voz «Raquel», reenganche de conversaciones paradas, secuencias de no-show, correos de la radiografía, recordatorio de las 9:00.
- **Clientes:** asistente de WhatsApp para el directo de Nuria Roure (evento pasado); correos a Al Milímetro (sin cron en `vercel.json`).

## 4 · Reuniones y próximos pasos
- **NO EXISTE EN CÓDIGO:** transcripción de reuniones, resumen/acta automático, correo de seguimiento automático tras la reunión, actualización del CRM a partir de la reunión. Tactiq solo se usa a mano. El correo tras reunión es un borrador que aprueba Maikel (`content/proceso-comercial.md` §4).
- **PROTOTIPO/DEMO:** «Agente de reuniones» en Intelligence (`intelligence/js/reunion.js`): la preparación funciona también en modo real; el «después» (resumen, etapa, tareas, mensaje) solo cambia el estado local.
- **OPERATIVO:** tareas diarias en GHL: «¿se hizo la llamada?», «propuesta sin enviar», seguimiento de propuesta a los días 2, 5 y 10 con borrador, no presentado (`seguimientos.js`); kit de reunión; plantilla de propuesta (manual).

## 5 · Recuperación de oportunidades
- **OPERATIVO:** tareas diarias por trato parado con la acción escrita (`seguimientos.js`, L-V 07:15, no envía nada); el agente de WhatsApp ofrece dos huecos a quien no se presentó; rescate de leads.
- **PILOTO:** agente de reactivación de dormidos >90 días (`reactivacion.js`, sin cron); no-show y reenganche pausados.

## 6 · Atribución y medición
- **OPERATIVO:** Conversions API de Meta por etapa: Lead, Schedule, Contacted, Qualified (reunión celebrada con encaje), Converted y Disqualified (`_meta.js`, `_tratos.js`), con barrido cada 2 h (`senales-meta.js`); origen en cada trato; parte de campañas dos veces al día que separa lo que pide una decisión (`informe-paid.js`); Google Sheet diaria (Ads, GA4, GHL, Search Console); aperturas y clics de correo a la puntuación.
- **PILOTO:** EAC: CAPI por etapa en n8n (inactivo), panel de métricas (rama EAC).

## 7 · Qualivo Intelligence
- **OPERATIVO:** modo real con contraseña para Qualivo (GHL + Meta: leads de pago, conversaciones, tratos, citas, pantalla «Hoy»), con acciones por clic de Maikel (mover etapa, redactar, enviar WhatsApp, llamar); informes por mes, semana y vertical con «NO MEDIDO» si falta el dato; copiloto con IA que contesta sobre los datos; cuentas privadas de Nuria Roure y Al Milímetro.
- **DEMO:** unos 30 sectores con datos ficticios para enseñar a prospectos; agenda, voz y agente de reuniones simulados.

## 8 · Orquestación de agentes
- **PILOTO (práctica real, sin código que lo lea):** bus por archivo entre agentes (daily, cierre diario, cambios en Meta con la autorización de Maikel citada, correcciones, solicitudes a Creative), 22-sep a 28-oct.
- **OPERATIVO:** interruptor general de todo lo que sale a leads (`_pausa.js`); reglas de qué nunca sale sin Maikel (precio, propuesta, correo tras reunión, contactos en negociación o cliente); consulta común de supresión.
- **No encontrado:** el «Orchestrator» (solo se menciona).

## 9 · Dirección · Chief of Staff
- **Fuera del repo:** Chief of Staff y partes diarios viven en sesiones y en Notion. En código, las piezas de priorización son `informe-paid`, `seguimientos` y la pantalla «Hoy» de Intelligence.

## 10 capacidades operativas para enseñar a un empresario
1. Ningún lead de Meta se pierde: cada 2 minutos se cruza Meta con el CRM.
2. Un agente contesta tus WhatsApp, ofrece huecos reales y reserva; con precio o queja, te pasa el hilo.
3. Primer mensaje personalizado con IA en minutos, dentro del horario.
4. Un vigía te avisa si alguien lleva 15 minutos sin respuesta.
5. Cada contacto llega puntuado A/B/C/D; los mejores te avisan al momento con una ficha investigada.
6. Las reuniones se confirman y se recuerdan solas.
7. Cada mañana, una tarea por cada oportunidad parada, con el siguiente paso escrito.
8. Meta aprende de tus ventas, no de tus formularios.
9. Parte de campañas dos veces al día, separando lo que pide una decisión.
10. Un panel con tus datos reales y un copiloto al que preguntar (Qualivo Intelligence).

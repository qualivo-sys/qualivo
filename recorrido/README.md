# /recorrido/ · borrador de la landing V1 («¿Dónde se pierden tus oportunidades?»)

Paso 2 del test por patas: primero el anuncio 08 («Quién está entrando»), después esta landing, después la preparación de la reunión.
Vista previa, `noindex`, sin enlazar. **El formulario no se envía**: no crea contactos ni activa ninguna cadencia.

## Qué es
- Continúa literalmente el gancho del anuncio (el título es la frase del anuncio).
- Corta: título con el camino de un contacto (ejemplo), «¿te pasa esto?», reencuadre, datos propios (pendiente de aprobación), filtro «tiene sentido si / todavía no si», enlace al panel de ejemplo, tres preguntas frecuentes y formulario en dos pasos con calendario.
- Sin precio, sin garantía, sin nombres ni resultados de clientes, sin «scoring». El panel de Intelligence solo como enlace a la demo con datos de ejemplo.

## Qué NO hace todavía (V2, necesita aprobación)
- Pantalla de «ahora no es tu caso» y routing por encaje: toca la cadencia de entrada.
- Precio visible.
- Casos de clientes (el de Sonia, con su permiso, a partir del 12-nov).

## Para cablearlo a producción (pendiente de aprobación)
`api/diagnostico.js` hoy exige `sector`, `equipo`, `inversion` y `web`. Este formulario pregunta `sector`, `volumen`, `problema`, `valor`, `cuando` y pide `web` como opcional.
Cambio mínimo y compatible hacia atrás: aceptar un campo `version: 'recorrido-v1'`, relajar `equipo`, `inversion` y `web` solo en ese caso y guardar las respuestas nuevas en etiquetas y en la nota.
Antes de activarlo hay que comprobar que la puntuación A/B/C/D no depende de la etiqueta `inv-` (si falta, no debe degradar al contacto) y que el contacto sigue por la cadencia actual sin cambios.
Medición: UTM del anuncio en cada contacto (`utm_content` = anuncio) y `origen=recorrido`.

## Decisiones pendientes de Maikel
- Rangos de «valor de un cliente» y de volumen (propuesta del 7-oct, sección 14).
- Si se muestran datos de nuestro propio embudo como prueba.
- Que el «no encaja» y el precio visibles queden para V2.

## V2 (7-oct-2026) · `/recorrido/v2/`

Propuesta del Head of Content, más corta (44 % menos en móvil): gancho del anuncio 08 → «¿Cuáles te pasan?» (marcar rellena la pregunta del formulario) → qué te llevas de los 30 minutos + filtro en una línea → formulario con tres dudas al lado (cuánto cuesta, qué preparo, con quién hablo). Foto y nombre de Maikel en el hero, CTA fijo en móvil.

Quitado de la V1: la sección de datos propios (daba la tasa de plantones, regla R7), el enlace de salida a la demo de Intelligence, el bloque largo de reencuadre y el FAQ separado. Sin precio ni garantía. El formulario sigue sin enviarse; el cableado pendiente es el mismo que el de la V1.

Compromiso a confirmar por Maikel antes de publicar: «plan por escrito en 24 h».

## V3 (7-oct-2026) · `/recorrido/v3/` y `/recorrido/v3/confirmado/`

Landing madre con la revisión de Maikel del 7-oct y la arquitectura de oferta del mismo día (Notion 3f256e1ad6ed81718f99ea08a5003092). Orden: hero con la tesis madre y las cinco etapas ATTRACT → CLOSE → «¿Cuáles te pasan?» (seis dolores) → qué te llevas → 30 días → prueba → precio del Sprint y para quién todavía no → cierre con tres dudas. Todos los CTA abren el formulario en una ventana, no hacen scroll.

**Formulario:** paso 1 contacto (nombre, empresa, email, teléfono, RGPD); paso 2 volumen, valor de un cliente, problema principal y cuándo. Después, routing en pantalla: encaja → calendario; dudoso → «te escribo por WhatsApp»; no encaja → por qué y dos recursos, con una vía para decir «te equivocas» (falsos negativos).

**Routing (función `routing()` de la página, umbrales del §8 del doc):**
- No encaja: valor de cliente < 300 €, o < 20 oportunidades/mes con valor < 3.000 €.
- Encaje económico: ≥ 50 oportunidades y valor ≥ 1.000 €; 20-49 y valor ≥ 3.000 €; ≥ 100 y valor ≥ 300 €.
- Encaja = encaje económico + «este mes» o «1 a 3 meses». El resto, dudoso.

**Payload que tendría que recibir la API** (`window.__qvPayload` en la vista previa):
`version:'recorrido-v3'`, `origen:'recorrido'`, `cta` (botón que abrió el formulario), `nombre`, `empresa`, `email`, `telefono`, `volumen`, `valor`, `problema`, `cuando`, `pain_declared` (lista: no-encajan, no-contestan, no-vienen, propuestas-frias, crm-parado, no-se-donde), `ruta` (fit / duda / no), `utm`.

**Cableado pendiente (lo hace Growth, no esta página):**
1. `api/diagnostico.js` acepta `version:'recorrido-v3'` sin `equipo`/`inversion`/`web`, y guarda `empresa` como companyName.
2. `pain_declared` y `problema` van al CRM (campo o etiquetas `pain-…`), igual que `vol-…` y `cuando-…`, para que el scoring los lea.
3. El paso 1 crea el contacto parcial al momento, como hoy en /diagnostico/.
4. `ruta:'duda'` = etiqueta `precualificar` (agente de WhatsApp, horario de `_horario.js`). `ruta:'no'` = sin cadencia comercial; solo nurture con permiso.
5. CAPI: el Lead solo con `ruta:'fit'` o `'duda'`.
6. El calendario redirige a `/recorrido/v3/confirmado/?dia=…&hora=…` (o a la ruta definitiva, p. ej. `/diagnostico-confirmado/`).

**Pendiente de Maikel:**
- Grabar el vídeo de 90 s de la página de confirmación (guion en el doc, §20).
- Confirmar el precio visible (1.200 € + IVA) como test, con Paid/Growth (doc §13).
- Prueba: solo se usan casos ya publicados en /casos/ (EAC, Nuria Roure, BelloVinilo). «+100 funnels» y «+1 M€ en publicidad» no están porque no hay fuente en el repo; si son demostrables, se añaden.
- El compromiso «plan por escrito en 24 h».

# Revisión Paid · anuncio horizontal "Ya inviertes y no cierran" v6 (15-oct-2026, 16:40 CEST)

Entrega de Creative: rama `claude/qualivo-creative-performance`, `produccion/video-anuncios/finales/horizontal-ya-inviertes/` (45 y 916, 58,0 s, voz + música + subtítulos quemados, miniaturas del segundo 2). Revisado sobre hojas de contacto (1 fotograma cada 2 s) y fotogramas clave de los dos cortes.

## Veredicto

**Va.** Se monta en pausado tal cual, con dos peticiones a Creative que no bloquean: un corte de 30 s para probarlo como segundo anuncio del mismo conjunto, y acortar el gancho de 12 a 8 s en la versión larga si hay tiempo. Los cambios de Maikel (sin sectores, una sola historia, CTA demo, sin precio) se han aplicado bien y el vídeo respeta las reglas de la casa.

## Gancho y retención (0-12 s)

- Los tres primeros planos son texto grande sobre negro: "Inviertes +1.000 € al mes en anuncios" (0-2 s) → "Tienes comerciales. Y los leads no cierran" (2-6 s) → "Tu equipo: los leads de Meta no valen. ¿Los anuncios? ¿O lo que pasa después?" (6-12 s). El filtro funciona: quien no invierte se va en 2 s, y eso es lo que queremos pagar.
- **12 s de texto estático antes de que se mueva nada es largo.** El 3V2 llegaba a la demo antes. Riesgo: caída de retención en el 6-12 porque la tercera pantalla repite la idea de la segunda. Propuesta: fundir "Tienes comerciales. Y los leads no cierran" con "¿Los anuncios o lo que pasa después?" y entrar en el sistema en el segundo 8. No bloquea el montaje.
- La miniatura (segundo 2, gancho amarillo sobre negro) es correcta.

## Cuerpo (12-46 s)

- La historia de proceso tiene ocho pasos en 34 s: análisis → anuncios con ángulos → landings → formulario → aviso al comercial / seguimiento → agentes (WhatsApp, llamada, recordatorio) → CRM por campaña → señal a Meta. Se sigue, porque cada paso tiene su pantalla y su rótulo, pero es denso para feed.
- **El momento más flojo es 12-20 s** ("analizamos todo tu recorrido", wireframe vacío): es abstracto justo cuando hay que retener. En el corte de 30 s desaparece.
- **El momento más fuerte es 28-46 s**: formulario con tiempo "00:40", aviso al comercial con ficha, "si todavía no, lo seguimos nosotros", agentes con WhatsApp en minutos y llamada. Es la parte que enseña lo que el ICP no tiene.
- La tabla del CRM lleva "Datos de ejemplo" y la señal a Meta dice "presupuesto aceptado" y "buenos contactos". Cumple las reglas (sin cifras reales, sin "cuáles acabaron en cliente").

## Cierre (46-58 s)

- Tarjeta "El sistema que montaríamos para tu negocio" con los cuatro bloques, "todo medido en tu CRM", "Demo personalizada · Sin compromiso" y botón "Ver mi demo personalizada". Sin precio. Bien.

## Formato

- 9:16: el gancho queda en el tercio superior dentro de la zona segura y los subtítulos a media altura, no en la franja inferior. Correcto.
- 4:5: subtítulos en la franja inferior, legibles. Correcto.
- Audio presente en los dos. Música sin letra. 58,0 s exactos.

## ¿58 s es mucho?

Sí para feed, no para quien ya está dentro. La solución no es elegir: **dos anuncios en el mismo conjunto**, el de 58 s y un corte de 30 s (gancho 8 s → formulario que cualifica 6 s → aviso al comercial y seguimiento 6 s → CRM mide qué campañas traen clientes 6 s → CTA 4 s). Meta reparte y a los 150 € sabemos cuál retiene y cuál trae leads B. Petición a Creative, entrega cuando puedan; el de 58 s arranca sin esperar.

## Encaje con el formulario del nuevo ICP (CTA = demo)

El CTA ya no es "diagnóstico 30 min" sino "demo personalizada", y el formulario tiene que cumplir esa promesa. Cinco preguntas (en el formulario nativo las de opciones son obligatorias):
1. ¿Cuánto inviertes al mes en anuncios? Todavía no, me lo planteo / Menos de 500 € / 500-1.000 € / 1.000-3.000 € / Más de 3.000 €.
2. ¿Quién atiende hoy a los interesados? Yo mismo / 1-2 personas / Un equipo comercial.
3. ¿Cuál es tu sector? Formación / Clínica o salud / Reformas e instalaciones / Inmobiliaria / Otro.
4. ¿Cuántos interesados os llegan al mes? Menos de 20 / 20-50 / 50-100 / Más de 100.
5. ¿Cuándo querrías verlo funcionando? Este mes / En 1-3 meses / Más adelante.
Más un campo libre "Tu web" para preparar la demo (en el nativo, mejor pedirlo en el WhatsApp de confirmación, porque los campos libres bajan la tasa de envío).
Regla de encaje: B = inversión ≥ 1.000 € y alguien que atiende; medio = 500-1.000 o ≥ 1.000 atendido por él solo; C = "todavía no" o < 500 → sin agenda, recurso y nurturing.
**Aviso a Growth:** el webhook reconoce un formulario v2 por las claves `decisor` + `solicitudes`; este formulario trae claves nuevas (`inversion`, `atiende`, `sector`, `volumen`, `momento`). Hay que ampliar el reconocimiento y las etiquetas (`inv2-*`, `atiende-*`, `sector-*`) antes de activar, o los leads entran sin encaje.

## Textos del anuncio (CTA demo, sin precio)

- **Texto principal:** "Inviertes más de 1.000 € al mes en anuncios, tienes comerciales, y los leads no cierran. El problema casi nunca está en los anuncios: está en lo que pasa después del clic. Cualificamos desde el primer clic, avisamos a tu comercial solo cuando encaja, seguimos al resto nosotros y medimos en tu CRM qué campañas traen clientes, no formularios. Te enseñamos cómo funcionaría en tu empresa con una demo personalizada, sin compromiso."
- **Titular A:** "¿Tus comerciales dicen que los leads no valen?" · **Titular B:** "El problema no es el anuncio. Es lo que pasa después."
- **Descripción:** "Demo personalizada · Sin compromiso".
- **Botón:** "Más información" (nativo) o "Solicitar". Evitar "Registrarte".

## Dónde y con cuánto probarlo

- Campaña QV_VERTICALES_Sep26, **conjunto nuevo** "HZ · ya inviertes · demo · 15 €/día", público idéntico al 3V2 (ES 25-65, Advantage+, 3 exclusiones, feed + stories FB/IG), formulario nativo nuevo `Qualivo_HZ_demo`, optimización a leads de formulario (calidad). Dos anuncios: 58 s y 30 s cuando llegue.
- Presupuesto: 15 €/día; nada se toca en los dos conjuntos vivos. Si Maikel quiere mantener 30 €/día totales, decide él qué pausa.
- **Criterio de decisión** (muere a 150 € o 10 leads, lo que llegue antes): % de leads B (inversión ≥ 1.000 € y alguien que atiende) frente al 50 % de A+B del vertical; coste por cita confirmada; y, a 3 semanas, coste por reunión celebrada frente a los 118 € actuales. Gana si trae ≥ 40 % B con coste por cita ≤ 60 €, aunque el CPL sea el doble.
- Riesgos: CTR más bajo que el vertical (esperado, no es fallo); Stories con clics fantasma (vigilar como en la landing, pero en formulario nativo el problema es menor); la palabra "Meta" en el gancho es admisible mientras no implique respaldo.

## Pendientes antes de activar
1. Growth: reconocimiento del formulario nuevo en el webhook + etiquetas + regla de encaje.
2. Paid: crear formulario `Qualivo_HZ_demo`, subir vídeos, crear conjunto y anuncio en pausado (hoy).
3. Creative: corte de 30 s (no bloquea).
4. Ops: qué es exactamente la "demo personalizada" que prometemos y quién la hace; texto del WhatsApp de confirmación pidiendo la web.

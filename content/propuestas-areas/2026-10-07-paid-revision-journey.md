# Paid · revisión del "Revenue Acquisition & Sales Journey v1" y de la arquitectura de oferta

Respuesta de Paid al documento de Notion **📋 Decisión sobre la arquitectura de
oferta · 7 octubre 2026** (dos partes: arquitectura de oferta y "Revenue
Acquisition & Sales Journey v1", sección 34 "Preguntas para los demás agentes").
Escrito el 7-oct por la tarde, después del recorrido completo de Maikel por el
embudo de Impulso Business Lab (`paid/competidores/impulso-business-lab.md`).

Todo es revisión y propuesta: **no se ha tocado nada en Meta.** Cifras con fuente y
fecha. Sin nombres de leads ni de empresas.

---

## 0 · Veredicto corto

El documento es coherente con lo que Paid ha medido desde el 15-sep y con lo que
hemos visto en los competidores. Tres cosas que firmo, dos que chocan con los
datos, y una restricción que el documento no tiene en cuenta: **a 30 €/día
entran ~1,3 leads/día**, y eso decide cuántos experimentos caben en octubre
(uno, no cinco).

**Firmo**: Cost per Show como métrica primaria (es el KPI de Paid, con "show" = reunión
celebrada con tipo A/B); formulario de dos pasos con volumen + valor de cliente +
dolor + momento; routing con pantalla de "no encaja" y reserva inmediata para el
que encaja; página pre-call con vídeo de Maikel de 90 s a 3 min pidiendo tres
números y a quien decide (es exactamente lo que hace Impulso, y mejor: 3 min, no 11).

**Choca**: (1) el umbral de volumen aparece tres veces con tres cifras (50-250,
30-250, y la regla A/B/C de Paid ≥ 50); (2) la landing "madre" sin vertical es una
hipótesis sin dato a favor, y los dos datos que tenemos van en contra.

---

## 1 · Respuesta a las cuatro preguntas a Paid (sección 34)

### 1.1 ¿Qué parte puede testearse sin contaminar experimentos actuales?

Estado de la cuenta (7-oct): solo dos conjuntos activos (formación VIEJO 15 €/día,
clínicas VIEJO 15 €/día), vídeos de Maikel a cámara, formulario nativo de Meta.
Ningún experimento en marcha: el test de creativos (H-CREATIVO-02) se cerró
**falsado** el 5-oct. Es decir, la cuenta está limpia para un experimento nuevo.

Lo que cabe sin contaminar, por orden:

1. **Cambio de preguntas del formulario (12-oct, ya planificado)**. Es el "FORM 2"
   del documento. Afecta a los dos verticales a la vez y no es un test A/B: es un
   cambio de instrumento. Comparamos con la línea base de 15-sep→11-oct
   (42 leads, 27 % B, 46 % C, fuente CRM + formularios Meta).
2. **Landing con precio y routing en formación (12-oct → 1-nov)**. Una sola
   variable "paquete": destino nativo → landing con precio, pantalla de encaje y
   reserva inmediata. Se evalúa contra la línea base nativa de formación
   (17-sep→2-oct: 13 leads, 38 % B, 52 €/lead B, 2 reuniones B).
3. **Anuncios de Maikel con condición de inversión en el gancho** (encargo a
   Creative pendiente). Entran **después** de que la landing tenga dos semanas, o
   contaminan la lectura.

Lo que **no** cabe en octubre: landing madre sin vertical, cinco ángulos a la vez,
VSL, siete vídeos, scoring nuevo y routing nuevo al mismo tiempo. La sección 31
del documento ("qué NO hacer") ya lo dice; Paid lo suscribe con un número:

| presupuesto | leads/día (ritmo 15-sep→7-oct: 42 leads / 989,72 €) | leads en 3 semanas |
|---|---|---|
| 30 €/día (hoy) | ≈ 1,3 | ≈ 27 |
| 15 €/día (un vertical) | ≈ 0,65 | ≈ 14 |
| 5 €/día (la rama "landing" de un split 10/5) | ≈ 0,2 | ≈ 4 |

Con 4 leads no se decide nada. Por eso el split 10/5 que propuse el 5-oct **no
sirve**: lo retiro. Ver 1.2.

### 1.2 Landing vs Native: cómo se diseña limpiamente

Con 30 €/día, el diseño limpio no es un A/B simultáneo sino **secuencial con línea
base**:

- **Control**: formación con formulario nativo, 17-sep → 11-oct (ya medido: coste
  por lead, % B, % cita confirmada, reuniones celebradas).
- **Tratamiento**: formación con landing, 12-oct → 1-nov, **mismo anuncio, mismo
  conjunto, mismo presupuesto (15 €/día)**; solo cambia el destino.
- **Clínicas sigue nativa** todo octubre: es el control de deriva (si clínicas
  también cambia en el mismo periodo, el cambio no es de la landing).

Lo que mide cada métrica, y cuándo se puede leer:

| métrica | se lee a 3 semanas con ~14 leads | papel |
|---|---|---|
| coste por lead | sí (subirá; la landing añade un clic y un precio) | control, no decisión |
| % B (por volumen y ticket declarados) | sí, direccional | **decisión en octubre** |
| % con cita reservada al instante | sí | decisión en octubre |
| coste por reunión celebrada (Cost per Show) | **no** (esperamos 2-4 reuniones) | decisión a 6-8 semanas |

Regla de salida escrita antes de empezar: a 1-nov, si la landing da **≥ 50 % B** con
coste por lead B igual o menor que nativo (52 €), se extiende a clínicas en
noviembre. Si da < 30 % B o coste por lead B > 100 €, vuelve nativo. En medio,
otras tres semanas. El Cost per Show se lee en la revisión del 6-nov con lo que
haya, sin decidir por él todavía.

Requisitos para que sea limpio (fuera de Paid): la landing lleva los mismos
UTM/`form-<id>` lógicos que hoy, el webhook escribe los mismos tags en GHL, y
Ops marca "reunión celebrada" igual que hasta ahora. Si cambia el tracking a la
vez, el test está muerto.

### 1.3 Qué anuncios y ángulos priorizaría

Datos que tenemos sobre creatividad (cuenta Qualivo, 15-sep→5-oct):

- Maikel a cámara sostiene CTR 3-4 % varias semanas; los seis ganchos nuevos
  sin cara abrieron a 5-7 % y cayeron en 48 h (H-CREATIVO-02, falsada 5-oct).
- Lo que trae B hoy es el **anuncio por vertical** (formación 38 % B, clínicas
  33 % B). El anuncio de "leads curiosos" nunca llegó a gastar.
- Nuestra propia cuenta es el ejemplo del ángulo D: optimizamos a "formulario
  enviado" y Meta nos trajo 46 % de C.

Prioridad de Paid, con esa evidencia:

1. **Ángulo D ("Meta aprende del lead equivocado") vestido de vertical.** Es el
   encargo a Creative ya redactado: *"tus anuncios de la clínica traen gente que
   no puede pagar el tratamiento"* / *"más de 100 solicitudes al mes y tu equipo
   no llega"*. Mismo dolor, concreto, con Maikel a cámara, condición de
   inversión en los primeros 3 s. Es el que repele C en el gancho.
2. **Ángulo A ("no necesitas más leads")** como segundo anuncio, dirigido al que
   ya invierte. Contraintuitivo, bueno para parar el scroll, pero sin vertical
   puede traer agencias y consultores (no es nuestro ICP). Probarlo **dentro del
   conjunto de formación** primero.
3. **Ángulo C (propuestas sin siguiente paso)**: dolor de etapa CLOSE, exige que el
   espectador se imagine su CRM. Mejor en retargeting y en email, no en frío.
4. **Ángulo B ("100 leads")**: es un visual de landing, no un gancho de 3 s.
   Va a la landing, no a un anuncio.

**Lo que no haría**: la "landing madre" sectorial-agnóstica como destino de
anuncios en frío. Dos razones medidas: (a) en Meta no hay segmentación por
tamaño; el vertical en el gancho es lo único que hoy nos separa B de C; (b) las
dos reuniones celebradas de la semana pasada, nivel A las dos, entraron por el
anuncio de clínicas, con el dolor de clínicas. El documento mismo lo reconoce
("clínicas, formación... son contextos creativos"): de acuerdo, pero el contexto
creativo es lo que hace que el anuncio funcione. La landing madre puede existir
como **plantilla** con bloque variable por vertical (hero, "¿te suena?", caso),
no como una sola página.

### 1.4 ¿Mostrar 1.200 € ayuda o perjudica?

**No hay dato propio**: nunca hemos mostrado precio ni en anuncio ni en
formulario. Lo que hay:

- Nuestro coste de no filtrar: 17 de 37 leads eran C y **7 de ellos llegaron a
  cita** (41 %, igual que los B). Cada C en reunión son 30 min de Maikel y una
  cuota que no puede pagar.
- Competidores: Intelligent Syndicate pone 799 € **en el anuncio** y pregunta
  tamaño y decisor; Impulso pregunta precio y forma de pago **en el formulario**
  (5.000 € o 456 €/mes); Solumize "desde 280 €/mes" en la web. Los tres filtran
  por precio antes de la reunión.
- Ops ya ofrece 1.000 €/mes en las dos propuestas abiertas de clínicas.

Recomendación de Paid: **precio en la landing y en el paso 2 del formulario, no en
el anuncio.** En el anuncio sube el CPL sin filtrar (el formulario nativo ni lo
muestra); en la landing es el filtro más barato que existe. Formato: *"Los proyectos
empiezan con un sprint de 1.200 € + IVA"* en la landing (sección 13 del documento,
tal cual) y una pregunta en el paso 2: *"¿Encaja una inversión inicial de 1.200 €?"*
sí / necesito saber más / no. Esa pregunta es la que en Impulso decide el
"encajas / no encajas".

Efecto esperado y cómo saberlo: coste por lead sube, % B sube, citas con C bajan.
Se lee en el mismo test de 1.2: el precio forma parte del "paquete landing", no
es un experimento aparte. Si el documento quiere aislarlo, es el experimento de
**noviembre**, no de octubre.

Condición: el precio que vea el lead tiene que ser el que luego oiga en la
reunión. Hoy las dos propuestas de clínicas hablan de 1.000 €/mes y el documento
propone sprint 1.200 € + 800/1.000 €/mes. Que Ops y Maikel cierren esto **antes**
del 12-oct o la landing dice una cosa y la reunión otra.

---

## 2 · Contradicciones y riesgos que Paid ve en el documento

1. **Tres umbrales de volumen.** Arquitectura §8: 50-250 leads/mes (20-49 solo con
   margen). Journey §3: 30-250. Paid (2-oct): B ≥ 50 (reformas ≥ 30). Formulario
   §14: < 20 / 20-49 / 50-99 / 100-250 / 250+. Propuesta: una sola tabla,
   **B ≥ 50, medio 20-49, C < 20**, y los tramos del formulario tal como están en
   §14 (encajan). Reformas se queda en pausa, así que su excepción sobra.
2. **"Economics: valor aproximado de un cliente".** Es la pregunta que falta y la
   que más separa B de C (Ops: el ticket predice la reunión). Que entre el 12-oct
   en los dos verticales, con tramos por vertical (clínicas: < 500 / 500-1.500 /
   1.500-5.000 / > 5.000 €; formación: precio del programa). Sin esto, la regla
   A/B/C sigue a ciegas sobre el ticket.
3. **Cost per Opportunity y Cost per Customer no se pueden medir hoy.** Faltan los
   estados "oportunidad cualificada" y "ganada / perdida con motivo" en GHL. Paid
   mide hasta "reunión celebrada" (tag existente). Dueño: Ops / Intelligence,
   antes del 6-nov o la revisión se hará sin esas dos métricas.
4. **Optimizar Meta hacia el lead correcto (ángulo D) no es posible a este
   presupuesto.** Meta necesita del orden de 50 conversiones/semana por conjunto
   para aprender de un evento; con ~9 leads/semana en total, el evento
   `LeadTipoB` por CAPI es **solo de medición** (como propuse el 2-oct). El
   anuncio puede decirlo; la cuenta no puede hacerlo todavía. Que el mensaje
   comercial no prometa lo que la cuenta no ejecuta.
5. **Cinco experimentos (§30) con una cuenta de 30 €/día.** Cabe uno por
   ciclo de 3-4 semanas. Orden propuesto por Paid: (1) formulario + landing con
   precio y routing, octubre; (2) pre-call y show rate, noviembre (no depende de
   Paid, puede ir en paralelo porque mide otra etapa); (3) ángulos, cuando
   Creative entregue; (4) precio aislado, si el paquete de octubre deja dudas;
   (5) routing y falsos negativos, continuo, con la muestra de descartados que ya
   revisa Ops ("lead falso").
6. **Garantía por hitos (300 / 400 / 500 €).** Fuera del área de Paid, pero lo
   que vimos en Impulso es la lección: dos garantías distintas en el mismo
   dominio destruyen la confianza. Una sola redacción, la misma en landing,
   propuesta y contrato.

---

## 3 · Lo que el recorrido por Impulso confirma del documento

El documento ya tiene la página pre-call (§18-23) y el vídeo de Maikel (§20)
antes de que viéramos el de Impulso. Lo que el recorrido añade:

- El vídeo de Impulso dura 11 min y enseña el entregable entero. El nuestro,
  90 s a 3 min y tres números: **mejor**. Mantener.
- Impulso pide "acompañado de tu socio". El guion de §20 ya lo pide. Mantener.
- Impulso responde siete objeciones en vídeo antes de la llamada. §23 propone
  tres FAQ. De acuerdo con tres; las siete de Impulso son la lista de
  **objeciones a resolver en la reunión** (§25), no en la página.
- La pantalla "todavía no encajamos" con el porqué (§15) es literalmente lo que
  Maikel vio. Añadir el **motivo por tamaño** ("trabajamos con negocios de más de
  50 solicitudes al mes") y la puerta abierta ("si creces, vuelve").
- Lo que Impulso hace y nosotros no debemos: candado de contenido, cifras sin
  fuente, garantía con dos redacciones.

---

## 4 · Qué necesita Paid para ejecutar el 12-oct

De Maikel:
- OK a la regla B ≥ 50 / medio 20-49 / C < 20, y a los tramos de valor de cliente
  por vertical (§2.2).
- OK al diseño secuencial de la landing en formación (§1.2) en lugar del split
  10/5 del plan de octubre. Sustituye a ese punto del plan.
- Precio que verá el lead (1.200 € sprint) confirmado con Ops antes del 12.
- Pago de Meta: la cuenta sigue en periodo de gracia (50,66 € pendientes, 7-oct).

De Growth / Web:
- Landing de formación con precio, paso 2 del formulario, pantalla de encaje y
  calendario de GHL con reserva inmediata; mismos tags que el formulario nativo.

De Ops:
- Estados "oportunidad cualificada" y "ganada / perdida con motivo" en GHL.

De Creative:
- Los dos vídeos del encargo (ángulo D por vertical, Maikel a cámara) para la
  semana del 19; el vídeo pre-call de 90 s a 3 min con el guion de §20.

Paid no toca nada hasta el OK. Siguiente corte: lunes 12-oct 08:05.

**Fuentes**: Notion "Decisión sobre la arquitectura de oferta · 7 octubre 2026"
(leído 7-oct 12:40 UTC); `content/propuestas-areas/2026-10-05-paid.md`;
`paid/revisiones/2026-10-07-plan-octubre.md`; `paid/competidores/*.md`; Meta
Insights y GHL, 15-sep → 7-oct.

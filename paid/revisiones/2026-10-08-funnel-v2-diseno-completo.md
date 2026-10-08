# Funnel v2 · diseño completo para revisar antes de montarlo · 8-oct-2026

Pedido por Maikel el 8-oct: "documentar los nuevos anuncios, los formularios, lo que vamos a hacer,
cómo serían los WhatsApps, el recorrido, la landing, qué pasa si agendan… para probar este nuevo
funnel y analizarlo antes", y "sobre qué trabaja este nuevo funnel, cuál es la tesis que queremos
contrarrestar". Todo es propuesta: nada de esto está activo. Cifras con fuente y fecha. Sin
nombres de leads.

---

## 1 · Sobre qué trabaja este funnel y qué tesis queremos contrarrestar

**La tesis que queremos contrarrestar es "más leads = más clientes".** Es la que lleva implícita
el embudo actual: anuncio → formulario → WhatsApp → cita, con el coste por lead como brújula.
Lo que hemos medido en tres semanas dice que esa tesis es falsa para Qualivo:

| dato | valor | fuente |
|---|---|---|
| leads de pago clasificados por tamaño | 37 (17-sep → 2-oct) | CRM + formularios Meta |
| tipo C (< 20 solicitudes/mes y < 500 € de inversión) | 17 (46 %) | ídem |
| tipo B (≥ 50 solicitudes o ≥ 2.000 €/mes) | 10 (27 %) | ídem |
| C que llegan a cita | 7 de 17 (41 %) | ídem |
| B que llegan a cita | 5 de 10 (50 %) | ídem |
| reuniones celebradas → pilotos | 11 → 1 | informe de Ops, 8-oct |
| reuniones sin decisor presente | 4 de 11 | ídem |
| reuniones acabadas en "más adelante" | 5 de 11 | ídem |

Es decir: **los C agendan casi igual que los B** y ocupan la misma media hora de Maikel, y de
las reuniones que sí se celebran, la mitad no tenía a quien decide o no era el momento. El
cuello de botella no es el número de leads, es **quién llega a la reunión y en qué
condiciones**. Más presupuesto con este embudo compra más de lo mismo.

**La tesis del funnel v2** (hipótesis H-FUNNEL-01, nace con fecha de muerte el 26-oct):

> Si filtramos por tamaño antes del contacto (solicitudes, ticket, quién decide, cuándo), y al
> que encaja lo llevamos directo al calendario mientras al que no encaja le decimos "todavía
> no", entonces: la proporción de reuniones con tipo B sube del 27 % actual a ≥ 50 %, las
> citas con C bajan a cero, las reuniones con decisor presente superan el 75 %, y el coste por
> reunión celebrada con tipo B no empeora más de un 25 % (hoy ≈ 134 €, 1-oct → 7-oct).

**Lo que la falsaría**: que las cuatro preguntas repelan a los B tanto como a los C (apertura →
envío por debajo del 25 % y % B sin subir), o que el coste por reunión B suba más de un 25 %
sin que mejore la tasa de reunión → propuesta.

**De dónde sale la tesis**: de nuestros datos (arriba), del informe de Ops del 8-oct, del
documento de arquitectura de oferta (Journey v1, secciones 14-23) y de tres competidores que
filtran antes de la reunión: Intelligent Syndicate (precio en el anuncio, tamaño y decisor en el
formulario), Impulso Business Lab (tres preguntas → "encajas / todavía no" al instante →
calendario → página de preparación) y Solumize (precio visible). Ninguno de ellos vende la
reunión a cualquiera.

**Lo que no cambia**: el ángulo por vertical (clínicas, formación), el público abierto, los
vídeos viejos como control, y la regla de un cambio por ciclo.

---

## 2 · Estructura en Meta

Campaña `QV_VERTICALES_Sep26` (tope 1.604 €). Cuatro conjuntos, misma audiencia en los cuatro
(España 25-65, abierto, Advantage+, feed y stories de FB e IG):

| conjunto | anuncio | estado hoy | papel | presupuesto propuesto |
|---|---|---|---|---|
| formación · VIEJO | QV_3V formación (demo "alumno pide información", 70 s) | activo 15 €/día | control | 15 → ver opciones |
| clínicas · VIEJO | QV_3V clínicas (demo "paciente pide precio", 70 s) | activo 15 €/día | control | 15 → ver opciones |
| formación · NUEVO 3V2 | QV_3V2 formación (demo-caso v2, 60 s) | **pausado**, 10 €/día marcador | test creativo | 10 |
| clínicas · NUEVO 3V2 | QV_3V2 clínicas (demo-caso v2, 60 s) | **pausado**, 10 €/día marcador | test creativo | 10 |

Los cuatro anuncios sirven 4:5 en feed y 9:16 en stories dentro del mismo anuncio.

**Presupuesto, dos opciones (decide Maikel):**
- **A · se respetan los 1.200 € de octubre**: desde el 12, 10 + 10 + 10 + 10 = 40 €/día. Los
  viejos bajan de 15 a 10. Octubre cierra en ≈ 1.230 €.
- **B · octubre sube a ≈ 1.400 €**: 15 + 15 + 10 + 10 = 50 €/día desde el 12 hasta el 26, luego
  se decide. Es la que deja leer bien el test (los viejos no pierden entrega). Son 200 € más,
  no es escalar.

Hasta el 12 todo sigue como está (viejos a 15 + 15; nuevos pausados).

---

## 3 · Los anuncios nuevos (QV_3V2, ya montados en pausado)

Formato: el de los QV_3V que funcionan (tipografía grande sobre negro y verde, pantallas
simuladas, reloj con marcas de tiempo, sin personas ni imagen de archivo). Voz en off y
música. 60 s. Todo número con rótulo "datos de ejemplo". Nombres ficticios.

**Guion común, con el caso de cada vertical:**

| seg | pantalla | clínicas | formación |
|---|---|---|---|
| 0-7 | gancho, negro | Tu recepción: «Los pacientes de Instagram solo preguntan precio.» → Mira el anuncio que los trajo. | Tu comercial: «Los leads de Meta no se matriculan.» → Mira el anuncio que los trajo. |
| 7-15 | el anuncio del cliente (00:00) | «¿Te falta una pieza y quieres empezar este mes?» | «Curso de electricista. Empieza en noviembre.» |
| 15-22 | el formulario del cliente (00:40) | tratamiento · cuándo · ¿ya te han valorado? | curso · cuándo · ¿puedes por las tardes? |
| 22-27 | tablero encaja / necesita info / no encaja (00:01) | cinco contactos caen en su sitio | ídem |
| 27-37 | dos caminos (00:02) | no encaja: «Todavía no. No ocupa una hora de tu agenda. La puerta queda abierta.» · encaja: reserva su valoración al momento, confirmación por WhatsApp, recordatorio la víspera | ídem con «llamada de admisión» |
| 37-45 | señal a Meta (+3 días) | «Carla encaja. Vino a la valoración. → Busca más como ella.» | «Laura encaja. Vino a la llamada.» |
| 45-50 | informe de la mañana (07:30) | 42 solicitudes · 17 encajan · 9 valoraciones · 1 anuncio solo trae preguntas de precio | 38 · 15 · 8 llamadas · 1 anuncio trae solo curiosos |
| 50-55 | mapa de 7 pasos | No son siete automatizaciones. Es un sistema. | ídem |
| 55-60 | cierre | ¿Tu clínica ya invierte en anuncios? ¿Y no te compran? Dónde falla tu recorrido → Revisar mis fugas | ¿Tu centro ya invierte…? |

**Texto del anuncio (feed)**, clínicas: *Tu recepción dice que los pacientes de Instagram solo
preguntan precio. Antes de darle la razón, mira el anuncio que los trajo. Un anuncio que le
habla a quien sí quieres. Un formulario que pregunta lo que importa. Cada contacto en su sitio
antes de que nadie descuelgue… Y le decimos a Meta quién era un buen contacto. No son siete
automatizaciones. Es un sistema sobre el CRM que ya tienes. ¿Tu clínica ya invierte en
anuncios y no te compran? Cuéntanos tu caso y te decimos dónde falla tu recorrido.*
Título: *¿Los pacientes de Instagram solo preguntan precio?* Formación: equivalente con
"tu comercial" y "no se matriculan".

Identificadores (Meta): conjuntos `120245993821070358` (formación) y `120245993828710358`
(clínicas); anuncios `120245993826920358` y `120245993831070358`.

---

## 4 · Los formularios

### 4.1 Formulario nativo de Meta (los cuatro anuncios desde el 12)

Tipo "mayor intención" (pantalla de revisión antes de enviar), como hoy. Cuatro preguntas de
negocio, luego nombre, empresa, email y teléfono autorrellenados.

**Formación**
1. ¿Cuántas solicitudes de información recibís al mes? · Menos de 20 · Entre 20 y 49 · Entre 50 y 99 · Entre 100 y 250 · Más de 250
2. ¿Cuánto paga de media un alumno por un curso o programa? · Menos de 300 € · Entre 300 y 1.000 € · Entre 1.000 y 3.000 € · Más de 3.000 €
3. ¿Quién decide contratar un servicio como este? · Yo · Yo con mi socio o gerente · Otra persona
4. ¿Cuándo quieres resolverlo? · Este mes · En 1 a 3 meses · Más adelante, solo estoy mirando

**Clínicas**: 1. ¿Cuántos pacientes nuevos piden cita o presupuesto al mes? (mismos tramos) ·
2. ¿Cuánto vale de media un tratamiento de los que presupuestáis? (mismos tramos) · 3 y 4 iguales.

**Qué sale**: "¿cuánto invertís?" (falsada dos veces: apertura → envío 14 %, 17 de 20 pasan sin
presupuesto) y "¿dónde se te escapa?" (mayoría "no lo sé"; pasa al WhatsApp y a la landing).

**Pantalla de gracias** (Meta no permite una distinta por respuesta): "Hecho. Te escribo en
unos minutos." + botón **"Elegir hora ahora"** → hoy lleva a `qualivo.io/diagnostico/?paso=agenda`
(la página larga); propuesta: que lleve a una página de gracias nueva con el calendario arriba
(hoy `qualivo.io/gracias/` da 404).

### 4.2 Formulario de la landing (solo formación, test del 12)

Mismas cuatro preguntas (misma regla, mismas etiquetas) más una quinta: *¿Qué te pasa ahora
mismo?* · Entran leads pero no compran · No entran suficientes · Los que entran no son el perfil
· No lo sé. En dos pasos: primero las preguntas, luego los datos de contacto. La landing sí puede
responder distinto según las respuestas (sección 7).

### 4.3 Regla de clasificación (la aplica el webhook y la escribe en GHL)

- **B**: ≥ 50 solicitudes/mes, **o** 20-49 con ticket ≥ 1.000 €.
- **medio**: 20-49 con ticket < 1.000 €.
- **C**: < 20.
- Modificadores: `decisor-otro` (pedir que esté en la reunión); `momento-luego` (nurture, no cita).
- Etiquetas: `vol-*` (existe), `ticket-*`, `decisor-yo|socio|otro`, `momento-mes|1-3|luego`,
  `nivel-b|medio|c`. `inv-*` y `fuga-*` dejan de llegar de estos formularios.

---

## 5 · El recorrido completo, paso a paso

```
anuncio (feed 4:5 / stories 9:16)
  → formulario nativo (clínicas, y formación-control) · o landing (formación-test)
    → webhook → contacto en GHL con etiquetas de tamaño, decisor, momento, nivel
      → rama por nivel:
          B           → WhatsApp 1 con enlace al calendario (reserva al momento)
          B, otro decide → igual, pidiendo que esa persona esté
          medio       → WhatsApp 1 con la pregunta del dolor → SDR precalifica → calendario
          C / "luego" → WhatsApp único "todavía no" + recurso → nurture (sin cadencia de cita)
        → reserva en el calendario (GHL)
          → página de confirmación con preparación (vídeo, tres números, quién debe estar)
          → WhatsApp de confirmación (misma hora) + recordatorio la víspera
            → reunión de 30 min (guion según dolor: seguimiento o captación)
              → propuesta en una página en 24 h, con fecha de decisión
                → ganada / perdida con motivo / aplazada con fecha
```

Tiempos objetivo: webhook < 20 min (hoy 4-20); WhatsApp 1 en los 5 min siguientes dentro de
horario (fuera de horario, a las 09:00, como ahora); confirmación inmediata al reservar;
recordatorio la víspera a las 18:00; recuperación de plantón a las 2 h y a los 2 días.

---

## 6 · Los WhatsApps (borradores para Ops; el primer toque va como plantilla aprobada por la ventana de 24 h)

**W1 · B (encaja, decide, este mes o 1-3 meses)**
> Hola {nombre}, soy Maikel, de Qualivo. He visto lo que nos has contado de {empresa}: {X} solicitudes al mes y lo que vale un {alumno/tratamiento}. Encajas con lo que hacemos. Coge aquí 30 minutos y vemos dónde se te escapa el negocio entre el anuncio y la venta: {enlace calendario}. Sin tarjeta, sin compromiso.

**W1 · B, decide otra persona**
> …Encajas con lo que hacemos. Como me dices que la decisión la toma otra persona, mejor que esté en la reunión: así os llevamos un plan y no dos. Coge hora aquí y reenvíale la invitación: {enlace}.

**W1 · medio**
> Hola {nombre}, soy Maikel, de Qualivo. Gracias por contarnos cómo está {empresa}. Antes de pedirte 30 minutos, una pregunta: ¿lo que te pasa es que entran leads y no compran, o que no entran suficientes? Con eso te digo si tiene sentido que hablemos y qué miraríamos.
> *(si responde con dolor concreto → enlace al calendario; si "no sé" o no responde en 24 h → segundo toque; a los 3 días sin respuesta, cierre con puerta abierta)*

**W1 · C o "más adelante"**
> Hola {nombre}, soy Maikel, de Qualivo. Gracias por escribirnos. Con {X} solicitudes al mes todavía no tiene sentido que pagues por lo nuestro: trabajamos con negocios a partir de 50 al mes, donde el problema es que se pierden por el camino. Te dejo {recurso: guía/checklist}. Si creces o cambia la situación, escríbeme aquí mismo.
> *(sin más mensajes; etiqueta nurture; recordatorio interno a 90 días)*

**W2 · confirmación al reservar (todos los que reservan)**
> Confirmado: {día} a las {hora}, 30 minutos, por videollamada: {enlace}. Para aprovecharlo, ten a mano tres números: solicitudes al mes, cuántas compran y lo que vale un cliente. Si decide alguien más, que esté. ¿Cambiar la hora? Responde aquí.

**W3 · recordatorio la víspera**
> Mañana a las {hora} tenemos la reunión. Aquí el enlace: {enlace}. Si no vas a poder, dímelo ahora y la movemos; una hora tuya y una mía valen lo mismo.

**W4 · plantón, a las 2 horas**
> {nombre}, te hemos esperado a las {hora}. Pasa. ¿La movemos a {dos opciones}? Si no es el momento, dímelo y no insisto.
> *(un segundo intento a los 2 días; después, pausa)*

**W5 · tras la reunión, 24 h**
> Aquí tienes la propuesta en una página: {enlace}. Es lo que hablamos: {fuga}, {intervención}, {precio}. ¿Lo vemos el {fecha acordada}?

Reglas: ningún mensaje de más de 5 líneas; nunca "te mando propuesta y me dices"; cada mensaje
termina en una acción con fecha o enlace; quien dice "no" sale de todo.

---

## 7 · La landing (formación, test del 12) · esqueleto para Growth

Una página, móvil primero, con el mismo lenguaje visual que los anuncios.

1. **Hero**: *¿Dónde se te escapan los alumnos entre el anuncio y la matrícula?* · subtítulo:
   *Conectamos captación, respuesta, seguimiento y admisiones para encontrar la fuga que más te
   cuesta y corregirla.* · botón *Analizar mi recorrido* (ancla al formulario) · microcopy: *Para
   centros que ya invierten en anuncios y quieren convertir mejor lo que entra.*
2. **Precio, visible antes del formulario**: *Los proyectos empiezan con un sprint de
   diagnóstico e implantación de 1.200 € + IVA. Después decidimos si seguimos operándolo contigo
   o te lo dejamos montado.* (cifra pendiente de confirmar por Maikel)
3. **"¿Te suena alguna?"**: pagas por leads que no responden · solicitudes sin siguiente paso ·
   plantones en las llamadas de admisión · no sabes qué anuncio trae matrículas · tienes CRM pero
   el seguimiento depende de acordarse.
4. **Cómo trabajamos**: las cinco etapas en una línea (atraer · filtrar · conversar · preparar ·
   cerrar), *primero medimos, después intervenimos donde está la fuga*. Un párrafo, no un catálogo.
5. **Caso de ejemplo** (el vídeo QV_3V2 de formación, 60 s) con "datos de ejemplo".
6. **No sustituimos lo que funciona**: tu CRM, tu equipo, tu agencia siguen.
7. **Formulario en dos pasos**: paso 1, las cinco preguntas (sección 4.2); paso 2, nombre,
   empresa, email, teléfono, consentimiento.
8. **Respuesta en la misma página**:
   - **Encaja**: *Por lo que nos cuentas, tiene sentido verlo juntos.* + calendario de GHL
     embebido, reserva al instante.
   - **Necesita info** (medio): *Antes de pedirte 30 minutos, te escribimos por WhatsApp con una
     pregunta.* + lo que pasará.
   - **Todavía no** (C): *Con menos de 20 solicitudes al mes todavía no tendría sentido que pagaras
     por Qualivo. Te dejamos {recurso}. Si creces, vuelve por aquí.*
9. Pie: aviso legal, privacidad, "este sitio no forma parte de Facebook".

Lo que no lleva: garantías, ROAS, "IA", cifras sin fuente, candados de contenido.

---

## 8 · Si agendan: página de confirmación y preparación (Growth + Creative)

Se llega desde el calendario (landing o enlace del WhatsApp). Una sola página:

1. *Tu diagnóstico está confirmado*: día, hora, duración, enlace de la videollamada, botón para
   cambiar o cancelar.
2. **Vídeo de preparación, 90 s a 3 min**, voz en off (Maikel no sale), mismo estilo: *no vamos a
   enseñarte una presentación; vamos a coger vuestro recorrido real y ver dónde intervenir
   primero. Ten a mano tres números: cuántas solicitudes entran al mes, cuántas compran y cuánto
   vale un alumno. Si decide otra persona, que esté. Si después de verlo creo que Qualivo no
   tiene sentido para vosotros, te lo diré.*
3. **Qué traer**: solicitudes/mes · matrículas/mes · valor de un alumno · qué CRM y herramientas
   usáis · cuánto invertís y en qué canales.
4. **Quién debería estar**: *si alguien más decide o va a usar el sistema, reenvíale la
   invitación* (botón).
5. **Tres preguntas frecuentes**: ¿tengo que cambiar de CRM? · ¿la IA habla sola con mis
   alumnos? · ¿esto sustituye a mi equipo o a mi agencia?
6. Nada más: ni muro de reseñas, ni siete vídeos, ni candados.

Después de la página: W2 (confirmación) en el momento, W3 la víspera. La reunión sigue el guion
de 30 minutos del Journey (objetivo → economics → diagnóstico → prescripción → modalidad →
precio y siguiente paso con fecha). Propuesta en una página en 24 h (W5).

---

## 9 · Qué medimos y contra qué

| métrica | línea base (fuente, fecha) | objetivo del test | se lee |
|---|---|---|---|
| apertura → envío del formulario | formación 12,6 %, clínicas ≈ 12 % (Meta, sep) | ≥ 10 % (puede bajar algo) | semana 1 |
| % B entre los envíos | formación 38 %, clínicas 33 % (CRM, 17-sep → 2-oct) | ≥ 50 % | semana 2 |
| citas con C | 7 de 17 C (41 %) | 0 | semana 2 |
| reuniones con decisor presente | 7 de 11 (64 %) (Ops, 8-oct) | ≥ 75 % | semana 3 |
| coste por reunión celebrada B | ≈ 134 € (1-oct → 7-oct) | ≤ 170 € | 4-6 semanas |
| reunión → propuesta / propuesta → cierre | 11 → 1 piloto | medir, sin objetivo aún | 6-8 semanas |
| CTR y coste por apertura, 3V2 frente a 3V | 3V: CTR 3-4 %, 2,59 €/apertura clínicas | igual o mejor a ≥ 2.000 impr | semana 1-2 |
| landing frente a nativo (formación) | nativo: línea base de arriba | % B y reserva instantánea | 1-nov (direccional) |

Regla de un cambio por ciclo: el 12 entran formulario + anuncios nuevos (el anuncio nuevo tiene
conjunto propio, así que se lee aparte) y la landing solo en formación. Nada más hasta el 26.

---

## 10 · Quién hace qué y cuándo

| cuándo | quién | qué |
|---|---|---|
| jue 8 | Maikel | OK a tramos y texto del formulario; precio de la landing; presupuesto (A o B) |
| vie 9 | Paid | crea los dos formularios nativos por API; vista previa a Maikel |
| vie 9 | Growth | webhook: claves nuevas → etiquetas; regla B/medio/C; envío de prueba etiquetado |
| vie 9 → dom 11 | Growth | landing de formación (sección 7) y página de confirmación (sección 8); página de gracias con calendario |
| vie 9 → dom 11 | Ops | tres ramas de cadencia y plantillas W1-W5 (sección 6); guiones de reunión |
| vie 9 → lun 12 | Creative | vídeo de preparación (voz en off) |
| lun 12, 08:05 | Paid | creativos nuevos en los cuatro anuncios con los formularios nuevos; formación-test apuntando a la landing; presupuestos según opción; Maikel activa los 3V2 |
| lun 19 | Paid + Ops | lectura: CTR/coste por apertura 3V2 vs 3V; % B; citas con C; decisores |
| lun 26 | todos | veredicto H-FUNNEL-01; decidir escala, relevo de clínicas, landing en clínicas |

---

## 11 · Riesgos y lo que puede salir mal

- **Menos envíos**: cuatro preguntas en vez de tres, y una de ticket. Esperable un 20-30 % menos
  de envíos; es el precio del filtro. Si cae más del 50 %, revisar la pregunta de ticket primero.
- **Plantillas de WhatsApp**: el primer toque va fuera de la ventana de 24 h y necesita plantilla
  aprobada por Meta; aprobarlas lleva 1-2 días. Si no están el 12, el W1 sale con la plantilla
  actual y el enlace del calendario dentro.
- **Falsos negativos**: alguien que marca "menos de 20" y es un buen cliente. Revisar cada semana
  una muestra de los C descartados (Ops ya revisa los "lead falso").
- **Tracking**: si la landing no escribe las mismas etiquetas que el nativo, el test está muerto.
  Envío de prueba antes del lunes, obligatorio.
- **Dos precios**: landing (1.200 € sprint) frente a propuestas abiertas (1.000 €/mes). Cerrarlo
  antes del 12.

---

## 12 · Decisiones pendientes de Maikel

- [ ] Tramos de solicitudes y ticket, y texto de las cuatro preguntas (sección 4.1).
- [ ] Precio que verá el lead en la landing (1.200 € sprint + IVA).
- [ ] Presupuesto: opción A (1.200 € octubre, 10/10/10/10) u opción B (≈ 1.400 €, 15/15/10/10).
- [ ] Activar los dos anuncios 3V2 el 12 (o antes, con el formulario actual, si quiere empezar a
  leer CTR ya).
- [ ] Textos de los WhatsApps (sección 6) con Ops.
- [ ] Que el botón de gracias del nativo lleve al calendario en vez de a la página larga.

**Fuentes**: Meta Marketing API (cuenta `act_3453332464718877`, 8-oct); GoHighLevel (8-oct);
`content/propuestas-areas/2026-10-05-paid.md`; informe de Ops reenviado por Maikel el 8-oct;
Notion "Decisión sobre la arquitectura de oferta · 7 octubre 2026"; `paid/competidores/*.md`;
`paid/revisiones/2026-10-08-formulario-tamano-12oct.md`; `2026-10-08-montaje-3v2-en-pausado.md`.

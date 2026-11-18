# Scoring real frente a la demo: qué se puede enseñar en el anuncio de Laura

Fecha: 18-nov-2026 · Solo se ha leído código. No hay commit ni push, y no se ha tocado GHL ni Meta.

## Lo primero: a quién puntúa cada sistema

- **El sistema real (`api/_scoring.js` y `api/_form-v3.js`) puntúa los leads de Qualivo**, es decir, academias y escuelas que piden el servicio. Sus preguntas son «¿cuántas solicitudes os llegan al mes?», «¿cuánto invertís en publicidad?» y «vuestra web».
- **Laura es otra cosa:** es una alumna particular que pide información a una academia (Escuela Norte) sobre un Curso de Marketing Digital. En el repo no hay ningún scoring real en producción para los alumnos de una academia. El único sistema de puntos de un cliente que está en producción es el de Al Milímetro, que es de reformas (`api/_am-modelo.js:62-76`, umbrales A ≥ 70 y B ≥ 45).
- **Para una alumna como Laura, el scoring real de Qualivo no aplica tal cual.** Lo que sí es real es el **mecanismo**: puntos por respuestas del formulario + umbrales → nivel → siguiente acción. Con cada cliente se monta con **sus** criterios (la escuela decide qué respuestas suman y cuánto).
- Por eso no tiene sentido pasar las respuestas de Laura por `_scoring.js`: una particular no contesta «solicitudes al mes» ni «inversión en publicidad». Si se hace a la fuerza, sale lo que se ve en el punto 2.4: nivel D.

---

## 1. Qué pregunta hoy el formulario de Meta de formación

**Formularios activos:** el formulario Formación V3 del 17-nov tiene dos versiones con las mismas preguntas.
- `1183570324226136`: ángulo `form-v3-17nov`.
- `1024313877362865`: ángulo `form-v3b-17nov`, con la página de gracias en `/formacion/agenda/`.

Están en `api/meta-leadform.js:184-188` y en `api/_form-v3.js:89`. Los dos ponen `sector-formacion`.

**Las preguntas:** son cuatro (web, solicitudes al mes, inversión en publicidad y qué mejorar) más nombre, email de trabajo y teléfono (`api/_form-v3.js:1-2`; `api/meta-leadform.js:184`).

**El texto exacto de cada pregunta no está en el repo.** Intelligence lo lee en directo de Meta (`api/intelligence-datos.js:584-590`, `fields: 'name,questions'`). Lo que sí está son las claves de cada opción y cómo se traducen:

| Pregunta | Claves de Meta → texto que se guarda | Etiqueta en GHL | Dónde está |
|---|---|---|---|
| Web (texto libre; campo `website`/`web`) | URL | (en el contacto) `v3-web-ok`, `v3-web-redes`, `v3-web-no-existe`… | `meta-leadform.js:256`; `_form-v3.js:52-61` |
| Solicitudes al mes (campo `volumen`) | `menos20` → «Menos de 20 al mes» · `20_49` → «20-50 al mes» · `50_99` → «50-100 al mes» · `100mas` → «Más de 100 al mes» | `vol-menos-de-20-al-mes`, `vol-20-50-al-mes`, `vol-50-100-al-mes`, `vol-mas-de-100-al-mes` | `meta-leadform.js:253-255`, `:360` |
| Inversión mensual en publicidad (campo que contiene «invers») | `no_invertimos` → «Sin publicidad actualmente» · `menos1000` → «Menos de 1.000 €» · `1000_2999` → «Entre 1.000 y 2.999 €» · `3000mas` → «Más de 3.000 €» | `inv-sin-publicidad-actualmente`, `inv-menos-de-1-000`, `inv-entre-1-000-y-2-999`, `inv-mas-de-3-000` | `meta-leadform.js:258-269`, `:276-278`, `:358`; `_form-v3.js:66` |
| Qué mejorar (campo `mejora`) | `calidad` «Conseguir solicitudes de mayor calidad» · `conversion` «Convertir más solicitudes en matrículas» · `seguimiento` «Mejorar la atención y el seguimiento» · `medicion` «Saber qué campañas generan matrículas» | `mejora-calidad`, `mejora-conversion`, `mejora-seguimiento`, `mejora-medicion` | `_form-v3.js:16-21`, `:74-75` |

**Otras etiquetas que deja cada lead:**
- `leadform`, `paid` y `diagnostico-cualificado`.
- `form-1024313877362865`, `angulo-form-v3b-17nov`, `meta-lead-…` y `creativo-…`.
- Las de la prioridad V3: `v3-prio-a`, `v3-prio-b` o `v3-prio-c` (y `v3-revision`).

Todo esto está en `meta-leadform.js:345-381`.

**«No invertimos» no se filtra** (es el caso Cancomar). Se guarda como «Sin publicidad actualmente», que no casa con el filtro de «nada» (`meta-leadform.js:267-268`, `:339-340`).

---

## 2. Sistema real en GHL: nivel A/B/C/D y prioridad V3

Hay **dos clasificaciones distintas**, y las dos son reglas fijas: ni predicción ni IA.

### 2.1 Nivel A/B/C/D (`api/_scoring.js`)

Se calculan dos notas de 0 a 10, una de tipología y otra de comportamiento, y con ellas sale una letra (`_scoring.js:1-26`).

**Tipología: lo que es** (`_scoring.js:42-75`), con un tope de 10.

- **Capacidad:** cuenta lo mejor entre la inversión y el encaje con el precio (`:46-64`).

  | Inversión declarada | Puntos |
  |---|---|
  | Más de 2.000 €, entre 1.000 y 2.999 €, más de 3.000 € o más de 1.500 € | 5 |
  | 500-2.000 € | 4 |
  | Menos de 1.000 € (formulario V3) | 3 |
  | Menos de 500 € | 2 |
  | «nada» | 0 |
  | Sin dato de inversión ni de precio (incluye «Sin publicidad actualmente») | 2 |

  El precio no se pregunta en el V3, así que aquí no cuenta. En otros formularios: `precio-si` da 4, `precio-depende` da 3 y `precio-no` da 0.
- **Solicitudes al mes** (`:65-70`):

  | Tramo | Puntos |
  |---|---|
  | Más de 50 (`mas` o `50-100`) | 3 |
  | 20-50 | 2 |
  | 5-15 | 1 |
  | `menos…` | 0 |
  | Sin dato | 1 |

- **Sector** (`:71-73`): clínica, formación, reformas o asesoría dan 2; otro sector da 1; sin sector, 1.

**Comportamiento: lo que hace** (`_scoring.js:99-126`), entre 0 y 10.

| Señal | Puntos |
|---|---|
| Contestó | +3 |
| Contestó en menos de 1 hora | +1 |
| 3 mensajes o más | +1 |
| `cuando-este-mes` / `cuando-1-3-meses` / `cuando-mirando` (no está en el V3) | +3 / +1 / −1 |
| Habló con Raquel | +2 |
| Cogió cita | +4 |
| Vino a la reunión | +1 |
| No se presentó | −3 |
| Pidió la baja | se queda en 0 |
| No responde o descartado | como máximo 1 |

**Umbrales del nivel** (`_scoring.js:128-135`):

| Nivel | Condición | Qué significa |
|---|---|---|
| D | `act-baja`, `no-responde` o `act-descartado` | — |
| A | tipología ≥ 6 y comportamiento ≥ 5 | prioridad de Maikel, aviso al momento |
| A | tipología ≥ 9 y comportamiento ≥ 1 | ídem |
| B | tipología ≥ 6 (y lo anterior no se cumple) | el sistema insiste |
| C | comportamiento ≥ 5 | se atiende sin dedicarle horas |
| D | el resto | se guarda |

**Qué sale de cada sitio:**
- **Del formulario sale toda la tipología:** inversión, solicitudes y sector. El sector no es una pregunta del V3: lo pone el id del formulario.
- **Del comportamiento sale todo lo demás.** El V3 no tiene «¿cuándo?», así que **el comportamiento de un lead V3 al entrar es 0**. Con solo el formulario, **lo máximo es B**. Para llegar a A hace falta comportamiento real: con tipología 9-10 basta con que conteste; con tipología 6-8 hacen falta 5 puntos, por ejemplo contestar, hacerlo rápido y tener tres mensajes, o coger cita.
- La web y «qué mejorar» **no puntúan** en `_scoring.js`.

**Precualificar** (`_scoring.js:80-97`): si la tipología es menor que 6, siempre se precualifica por WhatsApp antes de dar reunión.

**Quién lo llama:**
- El reloj de activación, en cada vuelta, con `puntuarTodos` (`api/activacion.js:618-628`).
- Tras el primer WhatsApp, con `puntuar` (`api/_activacion.js:462`).
- Para decidir la cadencia, con `nivelAhora` y `nivelDe` (`activacion.js:30-36`, `:131-135`; `_activacion.js:443-450`, `:469-472`):
  - **A:** aviso al móvil de Maikel y llamada.
  - **B/C:** una llamada de Raquel.
  - **D:** solo WhatsApp.
  - **A y B en horario de supervisión:** el primer WhatsApp espera 10 minutos a que Maikel lo revise.

**Dónde se escribe:** en los campos «Score · Tipología / Comportamiento / Nivel / Motivo», en la etiqueta `nivel-a`, `nivel-b`, `nivel-c` o `nivel-d`, y en la hoja «Puntuación de leads Qualivo» (`_scoring.js:150-168`, `:190-225`).

### 2.2 Prioridad V3 A/B/C (`api/_form-v3.js:40-87`)

**No es una suma de puntos.** Mira la coherencia de las respuestas y solo añade etiquetas `v3-*` y un resumen. No cambia el nivel A-D (`_form-v3.js:3-9`).

| Prioridad V3 | Condición |
|---|---|
| A | web real (el dominio resuelve, o coincide con el del email) **y** volumen alto (50-99 o 100+) o capacidad (1.000-2.999 € o 3.000 €+) **y** email corporativo o que coincide con la web |
| C (a revisión) | web inexistente o no válida, o respuestas incoherentes (100+, 3.000 €+, email gratuito y web sin verificar) |
| B | el resto («por validar») |

Va a la nota del contacto como «Prioridad V3: X · motivos» (`meta-leadform.js:477-478`).

### 2.3 Ejemplos reales: una academia que entra por el formulario V3

Calculados ejecutando `_scoring.js` sobre las etiquetas que dejaría el webhook. La sesión fue de solo lectura y no escribió nada.

| Solicitudes | Inversión | Sector | Tipología | Nivel al entrar | Si contesta en menos de 1 h (comp. 4) |
|---|---|---|---|---|---|
| 50-100 (+3) | 1.000-2.999 € (+5) | formación (+2) | **10** | B | **A** |
| 20-50 (+2) | 1.000-2.999 € (+5) | formación (+2) | **9** | B | **A** |
| 20-50 (+2) | menos de 1.000 € (+3) | formación (+2) | **7** | B | B (con comp. 5 o más, A) |
| 20-50 (+2) | sin publicidad (+2) | formación (+2) | **6** | B | B |
| menos de 20 (0) | menos de 1.000 € (+3) | formación (+2) | **5** | D, precualificar | D |

**Detalle encontrado (no corregido):** con el tramo V3 «Menos de 20 al mes», el motivo que se escribe es «menos de 5 peticiones/mes» (`_scoring.js:69`). Puntúa 0, que es correcto, pero el texto no corresponde.

### 2.4 Laura (particular, Curso de Marketing Digital) en el sistema real

**Ninguna respuesta coherente de una particular le da A o B.** Las preguntas no son para ella. Si contestara lo que haría una alumna, quedaría así:
- solicitudes «menos de 20»: 0 puntos;
- inversión «sin publicidad»: 2 puntos;
- formación: 2 puntos.

Eso da **tipología 4**, que es nivel D y obliga a precualificar. Aunque conteste rápido, como mucho llega a C.

Para que saliera A o B tendría que decir que recibe 20 solicitudes o más al mes e invierte en publicidad. Es decir, tendría que ser una academia.

---

## 3. La demo de Intelligence: Encaje, Actividad, Intención y Riesgo

**De dónde salen las siglas:** ENC, ACT, INT y RIE son las tres primeras letras de Encaje, Actividad, Intención y Riesgo en la lista (`intelligence/js/app.js:200-203`). La ficha las muestra enteras, de 0 a 100 (`app.js:781-787`). Las calcula `intelligence/js/motor.js:427-458` sumando reglas fijas a una base y recortando a 0-100 (`motor.js:168-181`).

| Puntuación | Pregunta que responde | Base | Reglas (puntos) |
|---|---|---|---|
| **Encaje** (fit) | ¿Es el cliente que queremos? | la pone el sector; en formación, 22 (`sectores/formacion.js:69`) | Formación (`formacion.js:70-82`): empresa de 50 o más empleados +30; de 10 a 49, +16; crédito FUNDAE +14; su puesto decide la formación +14; **particular con 3 años o más en el área +22**; junior +10; la empresa le paga +14; ticket de 3.000 € o más +8; estudiante −14; fuera de España −26; busca formación gratis −22 |
| **Actividad** (comp) | ¿Qué está haciendo? | 8 | `motor.js:127-137`: actividad hace menos de 1 h +28, en menos de 24 h +16, esta semana +6; 3 visitas o más +22, menos +10; 2 correos abiertos +10; respondió +20; 3 mensajes o más +10; habló por teléfono 45 s o más +16 |
| **Intención** (int) | ¿Cuánto quiere comprar? | 6 | `motor.js:138-152` y `formacion.js:83-88`: precio +20; urgencia +22; presupuesto +14; cita +18; propuesta abierta 2 veces o más +16; visitas +8; conversación +10; escribió hace menos de 24 h +12; acaba de pedir información (menos de 3 h) +14; dijo «más adelante» −18; sin presupuesto −16; agendó por teléfono +6; no le interesa −28; en formación también próxima convocatoria +14, FUNDAE +12, temario +8, pago a plazos +10 |
| **Riesgo** | ¿Qué se puede perder? | 4 | `motor.js:153-165`: sin respuesta más de 2 días +32; sin seguimiento +30 (+16 a los 5 días); esperando respuesta más de 2 h +24; no-show +36; propuesta sin abrir +26; propuesta vista sin respuesta +24; sin actividad 14 días +16; cita sin confirmar +22; aplazado +10; no coge el teléfono +10 |

**Prioridad** (`motor.js:195-207`). Primero se calcula la oportunidad: `0,35·Encaje + 0,2·Actividad + 0,45·Intención`.

| Prioridad | Condición |
|---|---|
| Urgente | oportunidad ≥ 72, o Encaje ≥ 70, Intención ≥ 60 y Riesgo ≥ 55 |
| Alta | oportunidad ≥ 58, o Encaje ≥ 62 y Riesgo ≥ 50, o Encaje ≥ 50 y Riesgo ≥ 65, o recién entrado (menos de 3 h) con Encaje ≥ 70 |
| Media | oportunidad ≥ 42 |
| Baja | el resto |

El «porqué» se compone con los motivos de más peso (`motor.js:216-232`).

**¿Son las mismas reglas que el sistema real? No.**
- **Escala y criterios:** la demo usa 0-100 y cuatro dimensiones. El real usa 0-10, dos notas y la letra A-D.
- **Umbrales:** los de Urgente, Alta, Media y Baja no existen en GHL.
- **Sector Qualivo:** sus reglas de encaje en Intelligence (`sectores/qualivo.js:78-97`) se inspiran en la tipología de `_scoring.js`, pero con otros números.
- **Sector formación (la demo de Laura):** sus reglas son ejemplos inventados para la demo.

**La historia «lauramkt» no calcula nada: lo fija a mano.** Cada paso lleva `forzar` con Encaje 84, la prioridad y el porqué (`formacion.js:164-188`; `motor.js:444-453`). Lo comprobé con Playwright, evaluando el mismo contacto sin `forzar`:

| Paso | Lo que se ve | Lo que calcularía el motor |
|---|---|---|
| 1 | Encaje 84, Actividad 36, Intención 20, Riesgo 4 → **Urgente** | Encaje **22** (ninguna regla de encaje se cumple: Laura solo tiene `horario`), oportunidad 24 → **Baja** |
| 6 | Encaje 84, Actividad 52, **Intención 0**, Riesgo 14 → **Alta** | Encaje 22 → **Baja** |

En el paso 6, Intención 0 con prioridad Alta se ve incoherente en pantalla.

---

## 4. Conclusión para Creative

1. **Real:** el mecanismo. Respuestas del formulario → puntos por criterio → total → umbral → prioridad → siguiente acción en la ficha. Es por reglas fijas, como `_scoring.js` (Qualivo) o `_am-modelo.js` (Al Milímetro, en producción).
2. **No real para Laura:** los criterios y los puntos concretos. El scoring de Qualivo puntúa academias, no alumnos, y la escuela del anuncio (Escuela Norte) es ficticia. Hay que rotularlos **«criterios de ejemplo»**.
3. **Simulado:** toda la demo de Intelligence (Datos simulados en cabecera). En «lauramkt» el Encaje 84 y la prioridad de cada paso están fijados a mano (`forzar`), no salen de la suma.
4. **Umbral real del motor:** recién entrada (menos de 3 h) con Encaje ≥ 70 → **Alta** (`motor.js:204`). Para **Urgente** haría falta oportunidad ≥ 72 (Intención ≈ 79 con Encaje 84). El paso 1 de la historia muestra «Urgente» forzado: o se rotula como ejemplo, o se cambia a «Alta» (una línea en la historia; no lo he tocado porque no se pidió).
5. **No decir:** «predice», «IA que puntúa», «probabilidad de matrícula». Sí: «reglas de puntos que define la escuela».

### Las 3 respuestas para el vídeo (rótulo: «criterios de ejemplo»)

Escala 0-100 como el Encaje del motor: se parte de la base de formación (22, `formacion.js:69`) y se suman los criterios.

| Pregunta del formulario | Respuesta de Laura | Criterio de ejemplo | Puntos |
|---|---|---|---|
| ¿Qué modalidad y horario te viene mejor? | Online en directo, por las tardes (desde las 18:00) | Encaja con un grupo que la escuela tiene abierto | **+20** |
| ¿Cuándo te gustaría empezar? | En la convocatoria de enero | Quiere empezar en la próxima convocatoria | **+22** |
| ¿Trabajas ya en marketing? | No, trabajo en atención al cliente y quiero cambiar de sector | Es el perfil del curso («desde cero», cambio de sector) | **+20** |

- **Total:** 22 de base + 62 = **84/100** (el mismo 84 que enseña la ficha).
- **Prioridad con el umbral real del motor:** **Alta** (acaba de entrar y Encaje ≥ 70). Si el vídeo necesita «Urgente», rotularlo como ejemplo.
- **Ficha del CRM:** prioridad (Alta/Urgente, ver arriba) · origen «Instagram · Curso de Marketing Digital · anuncio "Aprende marketing desde cero"» · siguiente acción «Responder por WhatsApp» (paso 1) → «Llamar en 6 semanas · Ana, admisiones» (paso 6).
- **Coherencia con la historia:** «empezar en enero» casa con la llamada de Raquel («en un mes y medio»): hoy es 18-nov, seis semanas son principios de enero.
- Si se prefiere encajarlo en el motor tal cual: horario y perfil son Encaje, y «cuándo empezar» sería Intención (urgencia +22, `motor.js:140`). Para 4-5 s es más claro una sola suma.

---

## Parte B: hecho (sin commit ni push)

- `intelligence/sectores/formacion.js`, historia «lauramkt», solo el contacto: el campo `f` pasa a las 3 respuestas de arriba (se pintan en «Lo que respondió en el formulario» con la pregunta como etiqueta), y el «porqué» del primer paso dice: «Prioridad urgente porque acaba de pedir información y suma en los tres criterios de la escuela: horario de tarde, empezar en enero y cambio de sector a marketing.»
- No se han tocado el Encaje 84, las prioridades forzadas ni los demás pasos.
- `intelligence/index.html`: caché `20261118a` → `20261118b` (16 apariciones).

**Pruebas (Playwright, servidor local en 8766, ya parado):** `?sector=formacion&historia=lauramkt&demo=1&limpio=1`, pasos 1 y 6, a 1440 y 390 px, con la ficha de Laura abierta. Versión cargada `20261118b`. Sin errores de consola, sin NaN ni undefined y sin scroll horizontal. La ficha muestra las 3 respuestas en «Lo que respondió en el formulario» y el porqué nuevo en el paso 1 (Urgente, Encaje 84); en el paso 6 sale Alta con el porqué de siempre. Capturas: `nuevo-paso{1,6}-{1440,390}.png` y `…-form.png` en este directorio.

**Pendiente de decidir (no tocado):** paso 1 «Urgente» frente al umbral real del motor («Alta»), y el paso 6 con Intención 0 y prioridad Alta, que en pantalla se ve incoherente.

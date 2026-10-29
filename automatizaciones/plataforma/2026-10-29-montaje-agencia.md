# Montaje de la agencia de GoHighLevel · guía para Maikel

29-oct-2026 · Automatización. Decisión del Chief of Staff (13:58): **GHL, con el plan de agencia, pasa a ser el
motor estándar de todos los clientes nuevos.** Cada cliente tiene su subcuenta en nuestra agencia, el
WhatsApp va con Wazzap y el cliente trabaja en Qualivo Intelligence, en su dominio.
**Al Milímetro es el primer cliente** y su subcuenta sirve para guardar la plantilla
**«Qualivo · Reformas v1»**.

**Orden:** primero la parte A, que es tuya y lleva unos 40 minutos; crea la subcuenta y su clave (A3). Con esa clave
en el entorno, Automatización hace la parte B por API. Después tú montas la parte C (los 7 workflows, unos 90 minutos)
y la guardas como plantilla. La parte D es la prueba.

> **Reglas que no cambian:** nada sale a leads reales hasta el OK de Sonia (viernes 30). Todos los
> workflows llevan el filtro de la etiqueta `prueba`. Con Wazzap solo se escribe a quien ha pedido
> contacto, a ritmo humano, nunca en frío y nunca con mensajes idénticos en serie. **No se toca la
> subcuenta de Qualivo** (`bHGMuZEGUESZmVoNv9HT`).

---

## A · Lo que solo puedes hacer tú (interfaz de GHL), en este orden

Los nombres de los menús son los de la interfaz en inglés. Si alguno no coincide, busca la palabra clave
en el buscador de *Settings*.

### A1 · Marca blanca: nombre y logo (5 min)

1. Entra en la vista de agencia (arriba a la izquierda, *Switch to Agency View*).
2. **Settings → Company:** nombre **Qualivo**, logo (el horizontal, PNG con fondo transparente), favicon, email de soporte `maikel@qualivo.io`, zona horaria **Europe/Madrid**.
3. Guardar.

### A2 · Dominio `app.qualivo.io` (10 min + propagación)

1. **Settings → White Label → Whitelabel domain** (puede aparecer como *Agency domain*).
2. GHL te enseña un **registro CNAME**. Lo habitual es `app` → `whitelabel.ludicrous.cloud`, pero copia el valor exacto que veas en la pantalla.
3. En el proveedor del DNS de `qualivo.io` (si es Vercel: *Domains → qualivo.io → Add record*), crea:
   - Tipo **CNAME** · Nombre **app** · Valor: el de GHL · Sin proxy (si es Cloudflare, nube **gris**).
4. Antes, comprueba que `app.qualivo.io` no esté ya usado en Vercel. Si lo está, quítalo de allí.
5. Vuelve a GHL, pulsa **Verify** y espera a que salga en verde. Es posible que tenga que pasar un rato.
6. A partir de aquí, Sonia y los clientes entran por `https://app.qualivo.io`.

### A3 · Subcuenta y su clave de API (5 min)

> **Cambio (29-oct, 14:20):** con el plan de agencia de 297 $, la API **no crea subcuentas**. Al
> intentarlo, `POST /locations/` devolvió 403 «The company does not have access to this feature»; eso es
> del plan Agency Pro (497 $). Por eso la subcuenta se crea a mano y toda la configuración se hace con la
> clave **de la subcuenta**. La clave de agencia no hace falta.

**A3.1 · Crear la subcuenta** (2 min). Vista de agencia → **Sub-Accounts → Create Sub-Account** →
*Blank* (para Al Milímetro, que es la primera) → nombre **«Almilimetro»** (así está creada), país España, zona
horaria **Europe/Madrid**. Copia su **ID** (*Settings → Business Profile*, o de la URL `/location/<ID>/`).
Para los clientes siguientes, ver «Clientes siguientes» en la parte B.

**A3.2 · Clave de la subcuenta (Private Integration)** (3 min). Entra en la subcuenta → **Settings →
Private Integrations → Create new integration**.
- Nombre: `Qualivo · web e Intelligence`.
- Permisos:
  - para la web y para Intelligence: `contacts.write`, `contacts.readonly`, `opportunities.write`, `opportunities.readonly`, `calendars.readonly`, `calendars/events.readonly`, `conversations.readonly` y `conversations/message.readonly`;
  - para que Automatización monte la plantilla: `locations.readonly`, `locations/customValues.write`, `locations/customValues.readonly`, `locations/customFields.write`, `locations/customFields.readonly`, `locations/tags.write`, `locations/tags.readonly` y `calendars.write`.

  Cuando la plantilla esté montada, puedes quitar los `.write` del segundo grupo.
- Copia el token **una sola vez** y ponlo, junto con el ID, en **dos sitios**:
  - en el entorno de Claude (claude.ai/code → el entorno → *Environment variables*), como **`AM_GHL_API_KEY`** y **`AM_GHL_LOCATION_ID`**;
  - en Vercel no hace falta que lo pongas tú: lo hace el script de la parte G, en la preview. Para producción, cuando Sonia dé el OK.
- **Ese token no caduca.** Si se filtra, se revoca en la misma pantalla.

### A4 · Wazzap en la subcuenta de Al Milímetro (15 min, con el móvil de Sonia delante)

1. Vista de agencia → **Marketplace** (o *App Marketplace*) → busca **Wazzap** («WhatsApp Gateway») → instálala **en la subcuenta Al Milímetro**, no en la de Qualivo.
2. Dentro de la subcuenta, abre la app de Wazzap y **escanea el código QR con el WhatsApp del número del negocio de Sonia**. Es como enlazar WhatsApp Web, así que su móvil tiene que estar delante. Si no está, se hace en la reunión del viernes.
3. En la subcuenta: **Settings → Phone Numbers** (o *Phone System → Advanced*) → proveedor de SMS = **Wazzap**, igual que en la subcuenta de Qualivo. Así, toda acción *Send SMS* de los workflows sale **como WhatsApp** desde el número de Sonia, sin plantillas de Meta y sin ventana de 24 h.
4. Prueba: desde *Conversations*, manda un «hola» a tu móvil desde un contacto de prueba. Tiene que llegarte por WhatsApp desde el número de Sonia.

> **Ojo, la lección del 22-sep:** WhatsApp restringió tu número personal tras ~60 mensajes en dos días,
> muchos iguales. Wazzap no es la API oficial: si el patrón parece automatizado, el número de Sonia puede
> quedar restringido. Por eso: solo leads que han pedido contacto, todos los mensajes personalizados
> (nombre, obra, zona), nada de envíos masivos ni recuperaciones en bloque y, como mucho, unos
> **20 mensajes al día** por número.

---

## B · Lo que hace Automatización por API (en cuanto estén `AM_GHL_API_KEY` y `AM_GHL_LOCATION_ID`)

Script: `automatizaciones/plataforma/ghl-alta-subcuenta.js`. Por defecto solo enseña lo que haría y no toca
nada; con `--aplicar`, lo hace. Se niega a tocar la subcuenta de Qualivo y comprueba que el token es de la
subcuenta indicada.

| # | Qué | ¿Por API, con el plan de 297 $? |
|---|---|---|
| — | Crear la subcuenta | ❌ **a mano** (A3.1). Por API solo con Agency Pro (497 $). |
| — | La clave de la subcuenta (Private Integration) | ❌ a mano (A3.2) |
| B3 | **Valores personalizados** de la plantilla (lista en C1) con los datos de Sonia | ✅ |
| B4 | **Campos del contacto** (lista en C2), con las opciones exactas del formulario | ✅ |
| B5 | **Etiquetas** (lista en C3) | ✅ |
| B6 | **Calendario «Visita técnica»** con su horario | ✅ (los huecos se ajustan a mano cuando Sonia los dé) |
| — | Pipeline «Reformas» y sus etapas | ❌ solo interfaz → C4 |
| — | Workflows | ❌ solo interfaz → C5 |
| — | Guardar la plantilla (snapshot) | ❌ solo interfaz → C6 |
| — | Variables de la preview de Vercel y su redeploy | ✅ `vercel-preview-am.js` (parte G) |

### Clientes siguientes («fábrica»): un paso manual de 2 minutos por cliente

Con este plan, el alta de cada cliente nuevo de reformas es:

1. **A mano, 2 minutos:** *Sub-Accounts → Create Sub-Account* → **desde la plantilla «Qualivo · Reformas v1»**. Así nacen el pipeline, los workflows, el calendario, los campos, los valores y las etiquetas. Después, su Private Integration (A3.2), y el token y el ID al entorno.
2. **Por API, 1 minuto:** `ghl-alta-subcuenta.js <cliente>.json --aplicar` con sus datos (copia de `al-milimetro.json`). Cambia los valores personalizados y añade lo que falte. Lo que vino de la plantilla lo da por bueno.
3. **A mano:** el horario de los bloques ⏰ si no es el mismo, Wazzap con su número (A4) y los huecos del calendario.

Si algún día compensa pasar a Agency Pro (497 $), el paso 1 también se hace por API (`POST /locations/` con
`snapshotId`). El script ya sabe hacerlo con `GHL_AGENCY_API_KEY` + `GHL_COMPANY_ID`.

---

## C · La plantilla «Qualivo · Reformas v1» (en la subcuenta de Al Milímetro)

**Principio:** ningún workflow lleva un dato de Sonia escrito a mano. Todo sale de los **valores
personalizados** (C1) y de los **campos del contacto** (C2). Para el siguiente cliente de reformas, se carga
la plantilla y solo se cambian los valores de C1 y el horario (⏰).

### C1 · Valores personalizados (*Settings → Custom Values*), que crea B3

| Clave (`{{custom_values.…}}`) | Al Milímetro |
|---|---|
| `negocio_nombre` | Al Milímetro |
| `persona_nombre` | Sonia |
| `persona_presentacion` | arquitecta de Al Milímetro |
| `negocio_lema` | Tu reforma, sin agobios |
| `horario_texto` | de lunes a jueves de 9:00 a 19:00 y los viernes de 9:00 a 15:00 |
| `servicios_texto` | reformas completas de viviendas, y cocina y baño de la misma vivienda |
| `obra_minima` | 15.000 € |
| `enlace_web` | (la landing de Sonia) |
| `enlace_reserva` | (enlace del calendario «Visita técnica») |
| `whatsapp_negocio` | (número de Sonia en Wazzap) |
| `aviso_movil` | **en pruebas, tu móvil (663)**; después, el de Sonia |
| `aviso_email` | **en pruebas, maikel@qualivo.io**; después, el de Sonia |
| `email_remite` | (dirección del dominio de Sonia, por confirmar) |
| `direccion_postal` | (por confirmar con Sonia: va en el pie de los emails) |

### C2 · Campos del contacto, que crea B4

Claves **genéricas**, sin el prefijo `am_`, para que valgan para cualquier cliente de reformas:
`obra_tipo` · `obra_texto` («tu piso») · `codigo_postal` · `zona` · `metros` · `cuando` ·
`presupuesto` · `vivienda_propia` · `clase` · `puntos` · `origen` · `revision` · `precio_desde` ·
`instalaciones` · `que_cambiar` · `visita_direccion`. Las opciones son exactamente las de
`api/_am-modelo.js`.

> El agente de Al Milímetro cambia las claves `am_…` de su receptor por estas (un único mapa).

### C3 · Etiquetas, que crea B5

`prueba` (**la llave del modo prueba**) · `nuevo` · `clase-a` · `clase-b` · `clase-c` · `revision` ·
`respondio` · `visita` · `presupuesto` · `mas-adelante` · `stop` · `origen-pared` · `origen-chalet` ·
`origen-precio` · `origen-portal` · `origen-web`.

### C4 · Pipeline (solo interfaz, 3 min)

**Opportunities → Pipelines → Create pipeline** con el nombre **«Reformas»** y estas etapas, en este orden:
**Nuevo → Contactado → Visita técnica → Presupuesto enviado → Seguimiento → Firmado → Perdido**.
Son las etapas que ya espera el receptor de la landing.

### C5 · Los 7 workflows (solo interfaz)

**Cómo se crea cada uno:** *Automation → Workflows → + Create Workflow → Start from Scratch*. Pon el nombre,
pulsa **Add New Trigger** y, en cada «+», **Add Action**.

**En todos, en la pestaña *Settings* del workflow:**
- *Time zone*: **Europe/Madrid**.
- *Allow re-entry*: **OFF**.
- *Stop on response*: **ON**. Si el contacto contesta por cualquier canal, sale del workflow.
- Los textos se copian de `propuestas-wip/sistema/mensajes.md` (rama `claude/al-milimetro-landing`), cambiando «Sonia» por `{{custom_values.persona_nombre}}`, «Al Milímetro» por `{{custom_values.negocio_nombre}}`, etc.
- En los textos, el nombre es `{{contact.first_name}}`, la obra `{{contact.obra_texto}}` y la zona `{{contact.zona}}`.

**Filtro de prueba, en el disparador de TODOS:** dentro del trigger, *Add filters* →
**Contact Tag · Includes · `prueba`**. Mañana, con el OK de Sonia, se quita este filtro de cada workflow.

**⏰ Bloque «¿En horario?»** (se usa donde pone ⏰). Hay dos formas de montarlo; usa la primera que te deje
la interfaz:

- **Opción 1, If/Else con fecha y hora.** Acción **If/Else** con nombre «¿En horario?».
  - Rama **Sí**:
    - (*Current day of week* is Monday, Tuesday, Wednesday or Thursday) **AND** (*Current time* between 09:00 and 18:59),
    - **OR** (*Current day of week* is Friday) **AND** (*Current time* between 09:00 and 14:59).
  - Rama **No**: **Wait** → *Advanced window* → días Mon–Fri, de 09:00 a 09:15. Después, **Go To** al If/Else.
- **Opción 2, conservadora, si el If/Else no ofrece día y hora.** Una sola acción **Wait** → *Wait for: time window* → días **Mon–Fri**, **09:00–15:00**. Nunca escribe fuera de horario. A cambio, lo que entre de lunes a jueves entre las 15:00 y las 19:00 espera a las 9:00 del día siguiente. Apúntalo si usas esta opción y lo afinamos después.

El horario es lo único que se cambia a mano para otro cliente: en cada bloque ⏰.

---

#### WF0 · Entrada (lo usa la web)

No hace falta: el receptor de la landing (`api/al-milimetro-lead.js`) ya crea el contacto, sus campos y
etiquetas, y la oportunidad en «Nuevo». Para leads de **formularios de Meta**: trigger *Facebook Lead Form
Submitted* → acciones *Add Tag* `nuevo` (y la clase, cuando se decida cómo se puntúa ahí). Esto, más adelante.

#### WF1 · Primer contacto

- **Nombre:** `Reformas · 1 · Primer contacto`
- **Trigger:** *Contact Tag* → *Tag added* = `nuevo` · filtro `prueba`.
- **Acciones:**
  1. **Send Email**: E1 «Lo que pasa ahora con tu reforma». Remitente: `{{custom_values.email_remite}}`. Sale al momento, a cualquier hora.
  2. **If/Else** «¿Revisión?»: *Contact Tag includes* `revision`.
     - **Sí** → **Send SMS** (sale como WhatsApp por Wazzap) con W3 → fin.
     - **No** → paso 3.
  3. ⏰ «¿En horario?» **sin la espera**:
     - **Sí** → **Send SMS** con W1.
     - **No** → **Send SMS** con W2 («ahora estoy fuera de horario: te escribo {mañana por la mañana | el lunes por la mañana}»). Para esa frase, pon dos ramas de If/Else por día de la semana o, si usas la opción 2, el texto genérico «en cuanto abra».
  4. **If/Else** «¿Clase A?»: *Contact Tag includes* `clase-a` → **Send Internal Notification** → *SMS* al número `{{custom_values.aviso_movil}}`: «Nuevo contacto A: {{contact.first_name}}, {{contact.obra_texto}} en {{contact.zona}}, {{contact.metros}} m². Llámale hoy.» Más una copia por email a `{{custom_values.aviso_email}}`.
  - **Comprobar en D-1** que la notificación interna por SMS sale por Wazzap. En Qualivo, los avisos al móvil van a un **contacto** («Maikel · avisos») y no como notificación interna. Si aquí no sale, se hace igual: un contacto «Avisos · {{custom_values.persona_nombre}}» con su móvil y **Send SMS** desde un workflow aparte, disparado con *Add to Workflow*.
  5. **Update Opportunity** → etapa **Contactado**.
  6. **Add to Workflow** → `Reformas · 2 · Seguimiento`.

#### WF2 · Seguimiento sin respuesta

- **Nombre:** `Reformas · 2 · Seguimiento` · sin trigger propio (lo añade WF1) · *Stop on response* ON.
- **Acciones:**
  1. **Wait** 2 horas → ⏰ → **If/Else** `clase-a` → **Send Internal Notification** (SMS a `aviso_movil`): «{{contact.first_name}} (A) lleva 2 h sin contestar. Llámale hoy.»
  2. **Wait** 1 día → ⏰ → **Send SMS**: W5 (versión sin fotos).
  3. **Wait** 2 días → ⏰ → **Send SMS**: W6 + **Send Email**: E2.
  4. **Wait** 4 días → ⏰ → **Send Email**: E3.
  5. **Wait** 7 días → **If/Else** «¿clase B o C?» → **Send Email**: E4.
- **Ritmo humano:** con W1, W5 y W6 son 3 WhatsApp sin respuesta. Es lo que se le plantea mañana a Sonia (propuesta: quitar W6). Si dice que sí, se borra la acción del paso 3.

#### WF3 · Visita: confirmación y recordatorio

- **Nombre:** `Reformas · 3 · Visita` · **Trigger:** *Customer Booked Appointment* → calendario «Visita técnica» · filtro `prueba`.
- **Acciones:**
  1. **Remove from Workflow** → `Reformas · 2 · Seguimiento`.
  2. **Add Tag** `visita`.
  3. **Update Opportunity** → **Visita técnica**.
  4. **Send SMS**: W7 «¡Perfecto, {{contact.first_name}}! Nos vemos el {{appointment.start_date}} a las {{appointment.start_time}}…».
  5. **Wait** → *Event/appointment time*: **1 día antes** de la cita → ⏰ → **Send SMS**: W8 «…te recuerdo que el {{appointment.start_date}} a las {{appointment.start_time}} paso a ver tu casa. ¿Sigue en pie?». W8 dice el día y no «mañana», porque con cita en lunes el ⏰ lo deja para el viernes.
- En el calendario, **desactiva los recordatorios propios** (*Calendar → Notifications*), para que no salgan dos.

#### WF4 · Recuperación del presupuesto

- **Nombre:** `Reformas · 4 · Presupuesto` · **Trigger:** *Pipeline Stage Changed* → pipeline «Reformas», etapa **Presupuesto enviado** · filtro `prueba` · *Stop on response* ON.
- **Acciones:**
  1. **Add Tag** `presupuesto`.
  2. **Wait** 2 días → ⏰ → **Send SMS**: W9.
  3. **Wait** 5 días → ⏰ → **Send SMS**: W10.
  4. **Wait** 7 días → ⏰ → **Send SMS**: W11 (propuesta para Sonia: quitarlo).
  5. **Wait** 7 días → ⏰ → **Send SMS**: W12.
  6. **Wait** 1 día → **Add Task** a la usuaria Sonia: «Marca {{contact.first_name}} como firmado o perdido, con el motivo».
- No se pasa a «Perdido» solo: el motivo lo pone ella.

#### WF5 · Ha contestado → aviso a Sonia

- **Nombre:** `Reformas · 5 · Respuesta` · **Trigger:** *Customer Replied* (cualquier canal) · filtro `prueba`.
- **Acciones:**
  1. **Add Tag** `respondio`.
  2. **Remove from Workflow** → `Reformas · 2 · Seguimiento` y `Reformas · 4 · Presupuesto`.
  3. **Send Internal Notification** (SMS a `aviso_movil`): «{{contact.first_name}} te ha contestado: "{{message.body}}"».
  4. **If/Else** etapa = Nuevo → **Update Opportunity** → **Contactado**.
- **Ojo:** las respuestas por WhatsApp entran por Wazzap como mensajes entrantes de tipo SMS. Comprueba en la prueba D-4 que disparan este trigger.

#### WF6 · Paradas

- **Nombre:** `Reformas · 6 · Paradas`. **Tres disparadores** en el mismo workflow, cada uno con el filtro `prueba`:
  - *Contact Tag added* = `stop` → **Remove from Workflow**: los workflows 1, 2, 3 y 4.
  - *Contact Tag added* = `mas-adelante` → **Remove from Workflow** → 2 → **Add Tag** `clase-c` → (los emails de nutrición de C, cuando estén escritos).
  - *Pipeline Stage Changed* → **Firmado** o **Perdido** → **Remove from Workflow**: los workflows 1, 2, 3 y 4.
- Para Sonia, «parar» es poner la etiqueta `stop` en la ficha del contacto, y «más adelante» es la etiqueta `mas-adelante`.

**Al terminar:** **Publish** en cada workflow. Arriba a la derecha, el interruptor *Draft → Publish*.
Con el filtro `prueba`, publicar no escribe a nadie más.

### C6 · Guardar la plantilla (5 min)

Vista de agencia → **Account Snapshots → Create new snapshot** → subcuenta **Al Milímetro** → nombre
**«Qualivo · Reformas v1»**. La plantilla incluye pipeline, workflows, calendario, campos, valores y
etiquetas, pero **no los contactos**. Con ella, el próximo cliente de reformas se crea en 2 minutos (parte B,
«Clientes siguientes»).

> Guarda la plantilla **después** de la prueba D, para que no se guarde con errores. Si cambias algo
> después, *Update snapshot*.

---

## D · Prueba (antes del viernes, solo con contactos internos)

Crea los contactos de prueba con **tu móvil o uno interno** y la etiqueta `prueba`. Más fácil todavía:
rellena la landing con un nombre que lleve «PRUEBA QUALIVO», y el receptor pone la etiqueta él solo.

| # | Caso | Qué tiene que pasar |
|---|---|---|
| D-1 | Lead A en horario | E1 + W1 por WhatsApp desde el número de Sonia + aviso a `aviso_movil` |
| D-2 | Lead B fuera de horario (después de las 19:00, o del viernes a las 15:00) | E1 + W2 y nada más hasta la apertura |
| D-3 | Revisión | E1 + W3 |
| D-4 | Contestas al W1 desde el móvil | Aviso «te ha contestado» y salida de WF2 (no llega W5) |
| D-5 | Reservas visita en el calendario | Salida de WF2 + W7; W8 la víspera (para la prueba, acorta la espera) |
| D-6 | Mueves la oportunidad a «Presupuesto enviado» | W9 (para la prueba, acorta las esperas a minutos y después vuélvelas a poner) |
| D-7 | Contacto **sin** la etiqueta `prueba` | **No le llega nada** |
| D-8 | Etiqueta `stop` a mitad de secuencia | No sale nada más |

---

## E · Qué cambia para el agente de Al Milímetro

- Su landing y su puntuación siguen valiendo. El receptor vuelve a escribir en GHL, en la subcuenta nueva: contacto, campos (claves de C2), etiquetas (C3) y oportunidad en «Nuevo». La única novedad es que tiene que poner la etiqueta **`nuevo`**, que es la que dispara WF1.
- Los mensajes los lanzan los workflows de GHL (C5) más el WhatsApp de Wazzap. Intelligence lee de GHL con `AM_GHL_API_KEY`.
- Su Postgres y el reloj de Resend (`claude/al-milimetro-landing-v2-site`) quedan **de reserva**, sin desplegar el cron.

## F · Pendiente de Sonia (reunión del viernes 30)

Su móvil delante para el QR de Wazzap (A4) · su dirección de email y la postal (C1) · sus huecos para
visitas (calendario) · si quita W6 y W11 (regla de 2 WhatsApp) · el OK para quitar el filtro `prueba`.

---

## G · Para la sesión que ejecuta la parte B (la lanza el Chief of Staff con las variables ya puestas)

Necesita en su entorno **`AM_GHL_API_KEY`** y **`AM_GHL_LOCATION_ID`** (A3.2) y **`VERCEL_TOKEN`**.
Opcionales: `VERCEL_PROJECT` (por defecto `qualivo`) y `VERCEL_TEAM_ID`, si el proyecto está en un equipo.
**No** necesita la clave de agencia.

```bash
git fetch origin claude/qualivo-automatizaciones-b7k2m9 && git checkout claude/qualivo-automatizaciones-b7k2m9

# 0 · Pruebas sin red (todas las líneas con ✓)
node automatizaciones/plataforma/pruebas/probar-alta.js
node automatizaciones/plataforma/pruebas/probar-vercel.js

# 1 · Plantilla en la subcuenta: vista previa (no escribe) y después de verdad
node automatizaciones/plataforma/ghl-alta-subcuenta.js automatizaciones/plataforma/al-milimetro.json
node automatizaciones/plataforma/ghl-alta-subcuenta.js automatizaciones/plataforma/al-milimetro.json --aplicar

# 2 · Repetir: todo con ✓ y ninguna línea «+» (es idempotente)
node automatizaciones/plataforma/ghl-alta-subcuenta.js automatizaciones/plataforma/al-milimetro.json

# 3 · Variables de la preview de Vercel (solo la rama de Al Milímetro; nunca producción) + redeploy
node automatizaciones/plataforma/vercel-preview-am.js             # vista previa
node automatizaciones/plataforma/vercel-preview-am.js --aplicar
```

**Comprobar después:**

1. El paso 1 imprime `✓ subcuenta existente · <id>`, y ese id **no** es `bHGMuZEGUESZmVoNv9HT`. Si sale «⚠ la subcuenta se llama…», para y confirma con el Chief of Staff que es la de Al Milímetro.
2. Ninguna línea con `⚠` de campos. Si sale «GHL ha puesto otra clave a…», ese campo se renombra en *Settings → Custom Fields* para que su clave sea exactamente la de la lista. Si no, el receptor no lo encuentra.
3. El paso 2 sale entero con `✓`.
4. El paso 3 dice `✓ Private Integration de la subcuenta … (no caduca)` y lista `AM_GHL_LOCATION_ID`, `AM_GHL_API_KEY`, `AM_SOLO_PRUEBA` e `INTELLIGENCE_CLAVE_AM` con «+», en *preview* y en la rama `claude/al-milimetro-landing-v2-site`. Al final imprime `Redeploy lanzado: https://…`.

**Después:**

- **`INTELLIGENCE_CLAVE_AM`** sale impresa una sola vez. Se le pasa **solo al Chief of Staff** (o a Maikel), nunca al agente de Al Milímetro ni al repositorio.
- **Al agente de Al Milímetro** (`session_01MkLw1AucMdomaoD3uZM2Zs`) solo el **ID de la subcuenta** y la **URL de la preview** del paso 3. Que espere un par de minutos a que termine el deploy y haga la prueba de punta a punta con «PRUEBA QUALIVO».
- **Cuando Maikel cree el pipeline «Reformas»** (C4), se repite el paso 3 con `--pipeline=<id del pipeline>`. Hasta entonces, el receptor guarda el contacto, los campos y las etiquetas, pero no la oportunidad.

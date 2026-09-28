# Playbook · Panel comercial en vivo + informe de recorrido (replicable por cliente)

Caso de referencia: **Eleva Academy** (sept-2026). Todo lo de abajo está vivo en
`netlify-dashboard/` y en dos páginas de Notion. Este documento explica **qué hay montado,
cómo se calcula cada número y cómo replicarlo para otro cliente** (GoHighLevel + Meta Ads +
Google Ads + Search Console + GA4). Sin secretos en el repo: todo va por variables de entorno.

Hermanos: `playbooks/atribucion-utm/README.md` (cómo hacer que cada lead traiga campaña y anuncio)
y `playbooks/MOTOR-CRECIMIENTO-QUALIVO.md` (visión de sistema).

---

## 1. Qué es y cómo está montado

```
 GoHighLevel (CRM)      Meta Ads API       Google Ads API      Search Console / GA4 / Sheet
   oportunidades          insights            GAQL diario           (service account)
   citas, usuarios        por campaña/anuncio  por campaña
        │                     │                   │                       │
        └──────────┬──────────┴───────────┬───────┴───────────────────────┘
                   ▼                      ▼
        netlify/functions/data.mjs  (una función serverless, caché 2 min, protegida por contraseña)
                   │  JSON: rows (1 trato = 1 fila), spend, appts, metaExtra, seo, ga4, email
                   ▼
        public/index.html  (web estática: filtros + tablas + embudo + recorrido + rentabilidad)

        netlify/functions/sync-stages.mjs  (cada 5 min)  ─► _lib/sync.mjs  (motor etiqueta → columna)
        netlify/functions/sync-worker-background.mjs     (pasadas largas, hasta 15 min)
        netlify/functions/sync-stages-run.mjs            (pasada manual: ?pw=&apply=1&backlog=1)
```

- **Sin base de datos ni servidor propio.** Cada apertura del panel pide los datos en vivo (caché 2 min).
- **Un solo sitio Netlify por cliente.** Base directory `netlify-dashboard`, publish `public`, functions `netlify/functions`.
  Un push a la rama conectada despliega solo.
- **Acceso** por contraseña compartida (`DASHBOARD_PASSWORD`), la misma protege las funciones manuales.

### Archivos

| Archivo | Qué hace |
|---|---|
| `netlify/functions/data.mjs` | Trae todo y calcula las filas. Exporta `fetchGoogleAdsDaily`, `googleAdsNames`. |
| `netlify/functions/_lib/sync.mjs` | Motor etiqueta → columna: `target(tags, columnaActual, ctx)`, `tagFixes(tags, columna)`, `runSync(opts)`, `runBacklog(opts)`. |
| `netlify/functions/sync-stages.mjs` | Programada (`schedule: '*/5 * * * *'`). Delega en el worker background si existe `URL`. `SYNC_APPLY=0` = solo simulación. |
| `netlify/functions/sync-worker-background.mjs` | Pasada larga (`max 1500`, `budgetMs 240000`, 6 escrituras en paralelo). Protegida por `?key=DASHBOARD_PASSWORD`. |
| `netlify/functions/sync-stages-run.mjs` | Manual: `/.netlify/functions/sync-stages-run?pw=…&apply=1&max=40&backlog=1&slice=Ilocalizable`. |
| `public/index.html` | Todo el front en un archivo: gate de contraseña, filtros, `render()` y una función por sección. |
| `netlify.toml` | publish/functions relativos a la base + redirect `/api/data` → función. |
| `README.md` | Despliegue en 5 minutos y variables de entorno. |

### Variables de entorno (Netlify → Site configuration → Environment variables)

| Variable | Para qué | Si falta |
|---|---|---|
| `GHL_TOKEN`, `GHL_LOCATION_ID` | CRM (oportunidades, pipelines, usuarios, calendarios, etiquetas) | el panel no arranca |
| `DASHBOARD_PASSWORD` | acceso al panel y a las funciones manuales | el panel no arranca |
| `META_TOKEN`, `META_ACT` (`act_…`), `META_API_VERSION` (v21.0) | inversión y leads por campaña/anuncio, provincias | sección Meta vacía |
| `GOOGLE_SA_B64` | JSON de la cuenta de servicio en base64 (`base64 -w0 sa.json`) | SEO, GA4, email y Google Ads en vivo caen a "sin datos" |
| `GADS_DEV_TOKEN`, `GADS_CUSTOMER_ID`, `GADS_LOGIN_CUSTOMER_ID`, `GADS_API_VERSION` (v22) | Google Ads en vivo (la SA debe ser usuario de la cuenta o del MCC) | usa el bloque manual `GOOGLE_INV` |
| `GOOGLE_INV` | JSON `{ "2026-09": { "search": [gasto, leads], "pmax": [gasto, leads] } }` para meses sin API | 0 € en Google |
| `GSC_DOMAIN`, `GA4_PROPERTY_ID`, `SEO_SHEET_ID` | Search Console (`sc-domain:`), propiedad GA4, hoja con KPIs de email | pestañas SEO/Email vacías |
| `SYNC_APPLY` | `0` deja el motor en simulación | aplica cambios |
| `COURSE_PRICE` (constante en el código) | ticket medio para ingresos y ROAS | 1.500 € |

**Scopes del token de GHL** (Private Integration): `opportunities.readonly/write`, `contacts.readonly/write`,
`locations/tags.write`, `calendars.readonly`, `calendars/events.readonly`, `users.readonly`, `emails/builder.write`
(solo si se suben plantillas), `forms.readonly`. Los tokens de Meta/Google se piden al cliente; nunca se pegan en el repo.

---

## 2. Cómo se calcula cada número (`build()` en `data.mjs`)

**Una fila por oportunidad** con: `fecha` (createdAt), `semana` (lunes), `mes`, `comercial` (assignedTo → nombre),
`procedencia` (canal deducido del `source`: "Meta · Landing", "Meta · Instantáneo", "Google Ads", "Otro"…),
`anuncio` y `campana` (de `attributions[]` → `utmContent`/`utmCampaign`, o de la `pageUrl` con `utm_*`; los IDs de
Google se traducen a nombres con `googleAdsNames()`), `etapa` (nombre de la columna) y las banderas:

| Bandera | Regla (por **nombre de columna**, no por posición) |
|---|---|
| `matricula` | columna `Alumna matriculada` o `Alumna activa` |
| `perdido` | status `lost` o columna `No interesa`, `Baja`, `Entrev. nula` |
| `abandonado` | status `abandoned` o columna `Inválido`, `Ilocalizable` |
| `pendiente` | ninguna de las anteriores |
| `contactado` | hubo conversación: `Llamada agendada`, `Entrevistado`, `Alumna matriculada`, `No interesa`, `Entrev. nula`, `Baja` |
| `entrevista` | la entrevista se hizo: `Entrevistado`, `Alumna matriculada`, `Baja` |
| `estado` | Ganado / Perdido / Abandonado-Inválido / Pendiente |

Lección aprendida: **no contar "entrevista" como "todo lo que va después de X en el pipeline"**. Las columnas de
perdidos van al final y lo inflaban. Con nombres explícitos el dato es exacto y sobrevive a que renombren columnas.

**Inversión (`buildSpend`)**: Meta diario por campaña (`level=campaign&time_increment=1`, leads = acción `lead`,
si no `onsite_conversion.lead_grouped` + `offsite_conversion.fb_pixel_lead`) + Google diario por campaña (GAQL)
o el bloque manual. Canales: "Meta · Landing", "Meta · Instantáneo", "Meta · (otro)", "Google · Search",
"Google · Performance Max". No sumar `lead` y `lead_grouped`: se duplican (nos pasó: 2,40 € vs 4,25 € reales).

**Citas (`fetchAppointments`)**: `GET /calendars/events?locationId&startTime&endTime` con ventana amplia (incluye
futuras). Status: `confirmed`, `showed`, `noshow`, `cancelled`. Es la fuente histórica fiable de entrevistas.

**Extras Meta (`metaExtras`)**: últimos 30 días, `level=ad` con `ad_name` y `breakdowns=region`.

**Rentabilidad**: ingresos = matrículas × ticket · ROAS = ingresos / inversión · CPA = inversión / matrículas ·
coste por entrevista = inversión / entrevistas. Solo respeta el rango de fechas, no los filtros de comercial/estado.

---

## 3. Secciones del panel (en orden, `public/index.html`)

1. **Gate** de contraseña → `fetch('/api/data?pw=')`.
2. **Filtros**: desde/hasta, comercial, procedencia, estado (combinables).
3. **KPIs**: leads, contactados, entrevistas, matrículas, perdidos, abandonados, tasa de cierre.
4. **Embudo** + tabla **por estado**.
5. **Citas / entrevistas** (bookings): agendadas, realizadas, no-show, canceladas, por comercial.
6. **Vista semanal** del rango.
7. **Por etapa del pipeline**.
8. **Recorrido del pipeline** (`renderRecorrido`): barras Leads → Llamada agendada → Entrevistado → Matriculadas
   por **columna actual o posterior**, y tabla "dónde se caen" con % sobre leads. Es el que el cliente entiende mejor.
9. **Por comercial** y **por procedencia**.
10. **Provincias** y **anuncios que mejor rinden** (Meta 30 días).
11. **Rendimiento por anuncio** (`renderAdsDetail`): Meta gasto/leads 30 días × CRM leads/entrevistas/matrículas por `anuncio`.
12. **Inversión y rentabilidad** por canal y mes (Meta subtotal, Google subtotal, total).
13. Pestañas **SEO** (GA4 28 días, Search Console consultas y páginas) y **Email** (KPIs de la secuencia).

Regla de oro al tocar el front: hay un script de validación que comprueba que existen todas las funciones
`render*` referenciadas (nos cargamos `renderAdsDetail` al simplificar otra sección y el panel dejó de pintar).
Captura con Playwright (`/opt/pw-browsers/chromium`, `--ignore-certificate-errors`) antes de decir "se ve bien".

---

## 4. Motor etiqueta → columna (`_lib/sync.mjs`)

El equipo comercial y el call center (Calligence) ponen etiquetas; el motor mueve cada trato a la columna que
corresponde, cada 5 minutos, y corrige etiquetas incoherentes. Reglas en orden de precedencia (Eleva):

```
baja                                   → Baja
venta / alumna-activa                  → Alumna matriculada
no interesa (+ motivo) / calligence: no interesado → No interesa
entrevista nula                        → Entrev. nula         (solo si viene de nivel ≤ 2)
entrevista-realizada                   → Entrevistado         (solo si viene de nivel ≤ 2)
calligence: éxito / llamada-agendada   → Llamada agendada     (solo si viene de nivel ≤ 1)
inválido / invalid-wa / calligence: inválido → Inválido        (solo si viene de nivel ≤ 1)
ilocalizable                           → Ilocalizable         (solo si viene de nivel ≤ 1)
Leads manual con origen de pago        → > 30 días: Ilocalizable · si no: Nuevo lead (IA)
```

`tagFixes` añade lo que el documento del cliente exige (por ejemplo `+venta` en matriculadas, `+motivo pendiente`
en "no interesa" sin motivo) y migra etiquetas viejas (`entrevistada` / `entrevistado` → `entrevista-realizada`).

Detalles que ahorran horas:
- `GET /opportunities/search` ya embebe `contact.tags` y `attributions`: **no hagas un GET por contacto**.
- Netlify scheduled = 10 s de límite → delega en una función `-background` (15 min) y escribe en paralelo (6).
- Primero `SYNC_APPLY=0` y un `resync_plan.json` con los movimientos previstos; se lo enseñas al cliente; luego aplicas.
- Nunca mover hacia atrás un trato avanzado ni tocar `Alumna matriculada`/`Baja` salvo por etiqueta explícita.

---

## 5. El informe (dos páginas de Notion) y cómo se produce

### 5.1 "Análisis del recorrido y plan de acción" (para dirección)

Estructura que funcionó en la reunión:

1. **La frase de apertura** (callout): rentable sí, pero X de cada 4 € se pierden antes de la entrevista.
2. **La foto del mes** (tabla): etapa · nº · % sobre leads del CRM · coste.
3. **Dónde se rompe** (5 fugas ordenadas por dinero): teléfonos inválidos, "no interesa" al descolgar, no-show,
   adquisición cansada, calidad vs volumen. Cada una con 2-3 bullets de evidencia.
4. **Plan de acción** (tabla): acción · efecto esperado · esfuerzo · quién.
5. **Lo que pedimos al cliente** (checklist).
6. **Cómo sabremos que funciona** (métrica · hoy · objetivo).

Ejemplo real (Eleva, 1-28 sept):

| Etapa | Nº | % sobre leads del CRM | Coste |
|---|---|---|---|
| Inversión Meta + Google | 2.064 € | — | — |
| Leads que reportan las plataformas | 777 aprox. | — | 2,66 €/lead |
| Leads reales en el CRM | 537 | 100 % | 3,84 €/lead |
| Teléfono inválido | 199 | 37 % | 765 € perdidos |
| "No interesa" en la primera llamada | 204 | 38 % | 785 € |
| Citas agendadas | 180 (154 personas) | 29 % | 13 €/cita |
| Entrevistas realizadas | 50 (+71 pendientes) | 9,3 % de los leads | 41 €/entrevista |
| Matrículas (cohorte madurando) | 4 → previsible 12-16 | 0,7 % hoy · cierre histórico 32 % | 130-170 €/matrícula |

### 5.2 "Insights de anuncios y landing" (para el creativo / media buyer)

1. **8 insights** en una frase cada uno (qué canal trae la alumna, coste por matrícula, evolución de la calidad,
   fatiga creativa, qué claim gana, qué visual gana, coherencia anuncio-landing, geografía).
2. **Números por campaña**: mes actual e histórico con € por lead del CRM, por entrevista y por matrícula.
3. **Qué pasó con el último test** y por qué Meta repartió así el presupuesto (CBO + muchos anuncios = el primero
   con señal se lo lleva todo; con 1-4 leads no hay dato).
4. **Ranking de creativos** con una lectura por fila y **qué tienen en común ganadores y perdedores**.
5. **La landing, elemento por elemento**: hoy · problema · qué probar.
6. **Propuesta**: conjunto de test con presupuesto propio (ABO) y 3 anuncios, ángulos de landing, guiones de vídeo,
   retargeting, presupuesto mensual, KPIs con umbral.
7. **Cómo leer los datos** (avisos de calidad del dato).

### 5.3 Cómo se saca (scripts de un día, Python sin dependencias)

1. **CRM**: paginar `/opportunities/search` (100 por página, `nextPageUrl`), mapear etapa por nombre, agregar por
   procedencia × mes: leads, % inválido, % entrevista, matrículas. Las matriculadas suelen tener `source` manual:
   ir a `GET /contacts/{id}` → `attributionSource` (`Direct traffic` + `medium: form` = formulario web; `facebook` =
   instantáneo) para saber de dónde salió cada venta.
2. **Citas**: `/calendars/events` por status → agendadas, realizadas, no-show, pendientes.
3. **Meta**: insights `level=campaign` y `level=ad` (`ad_name, spend, actions, ctr, cpm, reach, frequency`),
   semana contra semana, `breakdowns=region`. Para dinámicos: `breakdowns=image_asset` / `body_asset`.
4. **Google Ads**: GAQL `campaign` diario; `ad_group_ad` para nombres.
5. **Formularios**: `/forms/submissions` para cuadrar "leads de la plataforma" con "leads del CRM" (duplicados, incompletos).
6. Escribir la página con `notion-create-pages` (Markdown de Notion). **Evitar `≈`, `~`, `<`, `>` en celdas**:
   Notion los interpreta (tachado, html) y deja la celda en blanco. Usar "aprox.", "menos de", "mayor de".
   Para corregir después, `replace_content` con la página completa es más fiable que `update_content` por celdas.

---

## 6. Replicarlo para otro cliente (checklist, ~1 jornada + accesos)

1. **Accesos**: token GHL (Private Integration con los scopes de arriba) + location id; token de Meta (usuario
   con acceso a la cuenta publicitaria) + `act_id`; cuenta de servicio de Google (`apiclaude@…`) añadida como
   usuario en Google Ads (o MCC), Search Console (propiedad de dominio) y GA4 (lector); developer token de Google Ads.
2. **Copiar** `netlify-dashboard/` a `clientes/<cliente>/dashboard/` (o rama propia) y cambiar:
   - nombres de columnas en las regex de `build()` (`matricula`, `perdido`, `abandonado`, `contactado`, `entrevista`);
   - `provider(source)` con los `source` reales del cliente (mirar `Counter(o.source)` antes);
   - `metaChannel(name)` / `gadsChannel(name, type)` con los nombres de sus campañas;
   - `COURSE_PRICE` (ticket) y textos del pie de rentabilidad;
   - reglas del motor en `_lib/sync.mjs` (sets `NOINT`, `INV`, `ENTREV`, `AGEND` y la precedencia de `target`).
     Si el cliente no usa etiquetas, no desplegar el motor (borrar las 3 funciones `sync-*`).
3. **Netlify**: nuevo site desde el repo, base directory, variables de entorno, deploy. Probar `/api/data?pw=`.
4. **Atribución** (playbook hermano): `form_embed.js` en la landing, UTM en Meta (`url_tags`) y sufijo en Google.
   Sin esto la tabla "por anuncio" sale vacía.
5. **Validar con el cliente** los 6 números que van a mirar (leads, contactados, entrevistas, matrículas, coste por
   lead, coste por matrícula) contra su propia cuenta de una semana antes de enseñar el panel.
6. **Informe**: pedir el documento de proceso comercial del cliente (columnas, etiquetas, reglas) y hacer primero la
   auditoría (¿las etiquetas se usan?, ¿las entrevistas se marcan?). Sin eso los porcentajes engañan.

---

## 7. Brief para pegar en la sesión del nuevo cliente

```
Vamos a montar para <CLIENTE> el mismo panel comercial en vivo y el mismo informe que hicimos para Eleva
Academy. Lee primero playbooks/dashboard-comercial/README.md y playbooks/atribucion-utm/README.md del repo
qualivo-sys/qualivo. Referencia de código: netlify-dashboard/ (data.mjs, public/index.html, _lib/sync.mjs).

Datos del cliente:
- CRM: GoHighLevel, location <ID>. Pipeline: <nombres de columnas en orden>. Etiquetas que usa el equipo: <lista>.
- Canales de pago: Meta (cuenta act_<ID>, campañas <nombres>), Google Ads (<customer id>, MCC <id>).
- Landing(s): <urls>. Formularios: <GHL / otro>. Ticket medio: <€>.
- Web/SEO: dominio <…>, GA4 property <…>.
- Reglas del proceso comercial (documento del cliente): <pegar o adjuntar>.

Entregables:
1. Panel en Netlify (site nuevo) con contraseña, con las mismas secciones que Eleva y las columnas de este cliente.
2. Atribución por anuncio funcionando (form_embed.js + UTM + sufijo Google) verificada con un lead de prueba.
3. Motor etiqueta → columna solo si el cliente trabaja con etiquetas; primero en simulación con plan de movimientos.
4. Informe en Notion "Análisis del recorrido y plan de acción" con la tabla de la foto del mes y las fugas por dinero.
5. Playbook actualizado con lo que cambie.

Restricciones: ningún token en el repo (variables de entorno de Netlify), rama de trabajo propia, validar cada
número con una captura del panel antes de enviarlo al cliente.
```

---

## 8. Errores que ya nos comimos (para no repetirlos)

| Síntoma | Causa | Arreglo |
|---|---|---|
| Panel 404 en Netlify | publish `netlify-dashboard/public` con base directory ya puesta | publish = `public` (relativo) |
| Entrevistas infladas | contadas por posición en el pipeline (perdidos van después) | regex por nombre de columna |
| Coste por lead de Meta a la mitad del real | sumar `lead` + `lead_grouped` | usar `lead`; si no existe, la suma de onsite + pixel |
| Motor mueve 7 tratos por pasada | 10 s de límite en scheduled + 1 GET por contacto | `contact.tags` embebido + worker background + paralelo |
| Contactos "Direct traffic" | iframe del formulario sin `form_embed.js` | script en la landing (GTM) |
| `url_tags` no editable | Meta bloquea editar tracking en creativos | clonar creativo + `POST /{ad} creative=` |
| Google Ads API 404 HTML | versión antigua (v18-v21) | v22; `NOT_ADS_USER` = añadir la SA como usuario (tarda ~10 min) |
| Sheets 403 al crear | la SA no puede ser dueña de archivos | crear con el conector de Drive, compartir a la SA, rellenar por API |
| Celdas vacías en Notion | `≈`, `~`, `<` en Markdown | palabras ("aprox.", "menos de") |
| Lead de prueba no crea atribución | GHL deduplica por email **y** teléfono | email y teléfono nuevos; borrar después |
| `renderX is not defined` | función borrada al simplificar otra | script de validación + captura Playwright antes de enviar |

---

## 9. Segundo cliente: EAC (Escola Aeronàutica de Catalunya)

Replicado en `eac-growth/panel/` (Vercel, no Netlify): `api/data.js` + `index.html`.
Panel vivo en `https://eac-panel.vercel.app`. Lo que hubo que cambiar de verdad, y por qué:

| Lo que asume el playbook | Lo que pasa en EAC | Qué se hizo |
|---|---|---|
| `appointmentStatus` es la fuente fiable de entrevistas | Las 161 citas están **todas** como `confirmed`: nadie usa showed/noshow | El resultado se lee de las columnas **Plantón** / **Entrevistado**, uniendo la cita al trato por `contactId` |
| Cuenta de servicio para Google Ads, GSC y GA4 | La SA da `NOT_ADS_USER` y en Search Console solo ve qualivo.io y elevanails.es | **OAuth con refresh token** (scopes `adwords` + `webmasters.readonly`) para Ads y GSC; la SA se queda solo para GA4 |
| Hay columna de matrícula → ingresos, ROAS, CPA | EAC **no tiene** columna de matrícula (0 `won` en septiembre) | Sin ingresos ni ROAS: la economía se cierra en **coste por entrevista**, y el panel lo dice en los avisos |
| Netlify (`netlify/functions`, `netlify.toml`) | EAC ya vive en Vercel | `api/data.js` con `export default async function handler(req, res)` y `vercel.json`; el resto del motor es idéntico |

### Lo que costó caro y no estaba en el playbook

1. **Contar los `source` ANTES de escribir `provider()` no es opcional.** El playbook lo
   menciona de pasada y me lo salté: asumí que `source` traía el nombre de campaña. En EAC
   el valor real es `«Meta Lead Ads»` (329 de 557), y el nombre de campaña vive en
   `attributions[].campaign`. Con la suposición equivocada, 329 leads caían en «Meta · (otro)».
   **Primer comando de cualquier réplica**: contar los `source` distintos y mirarlos.

2. **Separar cohorte de periodo en los propios KPIs, no solo en las notas.** Mezclarlos
   produce dos números de plantón distintos en la misma pantalla (45% arriba, 55% en la
   tabla) y nadie sabe cuál creer. El panel de EAC tiene dos bloques de KPIs con título
   explícito: «De los leads que entraron en el periodo» (cohorte) y «De las citas que había
   en el periodo» (periodo). Es el error que más informes ha estropeado; conviene que la
   estructura de la página lo haga imposible.

3. **El status de GHL y la columna del tablero se contradicen.** En EAC hay **690 tratos**
   con status `lost`/`abandoned` sentados en columnas vivas. El panel los cuenta como
   cerrados (criterio conservador, el mismo del playbook) pero **avisa de cuántos son**,
   porque cambia por completo la lectura de «cuántos leads siguen vivos».

4. **Las cifras manuales de un canal necesitan acotar los días que cubren.** `TIKTOK_INV`
   admite `{"2026-09":{"spend":138.02,"leads":11,"days":8}}`: sin `days` el gasto se reparte
   entre los 30 días del mes y el total del rango sale corto (€128,82 en vez de €138,02).

5. **Tablas con `overflow-x` propio.** Sin `.scroll` alrededor de cada tabla, la página se
   iba 848 px de ancho en un móvil de 390. Se comprueba con Playwright comparando
   `scrollWidth` contra `innerWidth`, no a ojo.

### Avisos de calidad del dato como sección de primera clase

En vez de esconder lo que no se sabe, el panel de EAC abre con una caja amarilla que dice:
cuántas citas pasadas nadie marcó (35), cuántos tratos tienen el estado en desacuerdo con su
columna (690), que no hay columna de matrícula, y qué fuente de datos está caída. Es lo primero
que pregunta el cliente cuando un número no le cuadra, y adelantarse ahorra la conversación.

### Validación contra el análisis a mano

Antes de enseñar nada, se cuadró el motor contra el análisis manual del mismo día:
leads 557 = 557 · consiguen cita 75 = 75 · entrevistas 41 = 41 · plantón 34 = 34 ·
inversión €3.549 contra €3.548 (0,04% por sumar días contra pedir el agregado).
Las dos diferencias que aparecieron estaban bien explicadas y se documentaron en vez de taparse:
«no localizados» 215 = 156 en la columna + 59 con status `abandoned`, y
«perdidos» 119 = 24 en la columna + 95 con status `lost`.

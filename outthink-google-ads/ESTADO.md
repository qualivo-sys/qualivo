# OutThink 2026 — Estado de la cuenta de Google Ads

Cuenta cliente: **918-811-5388** (acceso estándar vía info@) · API v25 · Actualizado: 28-08-2026

## Creado — las 3 campañas del plan, todas en PAUSED (0 € de gasto)

| Campaña | ID | Presupuesto/día | Tipo |
|---|---|---|---|
| OT26_Search | 24182552133 | 25,00 € (600 € ÷ 24d) | Search · Maximizar clics · ENABLED |
| OT26_DemandGen_Prospecting | 24188461112 | 41,67 € (1.000 € ÷ 24d) | Demand Gen · Maximizar clics |
| OT26_DemandGen_Remarketing | 24193394560 | 16,67 € (400 € ÷ 24d) | Demand Gen · Maximizar clics |

Común: fechas 31-08 → 24-09 · Comunidad de Madrid · español · UTMs `utm_content=OT26_[concepto]` por pieza.

### Campaña 1 — OT26_Search
- Ad groups: AIAct `200661841858` · ComplianceRiesgo `197433188617` · EventosIA `199171526786` · Marca `203250685081` — keywords en frase según plan.
- 1 RSA por grupo (15 titulares + 4 descripciones validados, "Comprende el AI Act en 1 día").
- Sitelinks (Agenda /agenda · Ponentes /speakers · Talleres /eventos · Registro espacio.adigital.org/evento/outthink-2026/), callouts, snippet, negativas (empleo, curso, gratis, máster, pdf, resumen).

### Campaña 2 — OT26_DemandGen_Prospecting
- Ad group A · Compliance y Legal `199003405385`: audiencia `OT26_AUD_ComplianceLegal` (segmento personalizado: ai act, ai act empresas, compliance ia, rgpd inteligencia artificial, regulación ia, dpo). Anuncios: **P1 · P2 · R3 · R5** (3 ratios cada uno).
- Ad group B · Dirección e Innovación `199003405425`: audiencia `OT26_AUD_DireccionInnovacion` (transformación digital, estrategia ia, adopción ia empresas). Anuncios: **P3 · P5 · R7**.
- Titulares ≤40 y descripciones por ángulo del plan. Nota: "El foro que reúne a quienes regulan la IA" (41 car.) acortado a "El foro de quienes regulan la IA".

### Campaña 3 — OT26_DemandGen_Remarketing
- Ad group RMK `199003405585`: audiencia `OT26_AUD_Interesados_RMK` = listas `OT26_RL_Visitantes_Web` (rai.outthink.es) + `OT26_RL_Registro_Iniciado` (espacio.adigital.org/evento/outthink-2026). **Las listas se poblarán cuando el equipo del cliente active la medición/tag.**
- Anuncios: **R1 · R6 · C4 (solo SQ) · C5** (SQ generado por recorte del VT + VT).

### Assets subidos
34 imágenes (P1-P3-P5, R1-R2-R3-R5-R6-R7 en 3 ratios; C4 SQ; C5 SQ+VT; logo 270×270 desde favicon oficial). IDs en `api/` (asset_map).

## Decisiones (28-08, "quitar lo que no tiene sentido")
- **Fuera ad group C "Similar a registrados"**: no existe la lista de registrados (customer match) ni el lookalike, y faltan sus creatividades (P4, P4C).
- **Fuera el carrusel**: solo llegaron 2 de 5 tarjetas (CAR_T1, CAR_T5).
- **Fuera P4/P4B/P4D** (no venían en el zip), y C1/C3/R4 (sin hueco en el plan de ad groups).
- **Medición (conversiones, GTM, Consent Mode)**: la lleva el equipo del cliente.
- Puja en las 3: Maximizar clics (sin conversiones aún). Cuando su medición esté activa, valorar Maximizar conversiones.

### Ajustes 28-08 (tarde)
- **Automatización de creativos desactivada** en los 11 anuncios Demand Gen (a nivel de anuncio): vídeos generados (`GENERATE_VIDEOS_FROM_OTHER_ASSETS`), imágenes animadas y versiones de diseño auto-generadas → OPTED_OUT. Solo se sirven las imágenes originales del design system.
- **Conversión creada** en la cuenta: `OT26_Registro` (id `7737267067`, categoría Registro, primaria, 1 por clic).
  - ID de conversión: **AW-18413667658** · Etiqueta/send_to: **AW-18413667658/JmwmCPumtekcEMqKqcxE**
  - Entregado a Adigital (Aída) para configurar la etiqueta en el GTM de espacio.adigital.org con vinculador entre dominios (rai.outthink.es ↔ espacio.adigital.org).

## Medición — GTM (28-08)

Contenedores reales en producción (verificado leyendo el HTML de ambos dominios):
- `rai.outthink.es` (landing) → **GTM-WC7PTQTB** + GA4 `G-SZBKQGZFN5` · **sin acceso desde info@**
- `espacio.adigital.org` (registro) → **GTM-WV69PHLH** + GA4 `G-52Z0M6VHBR` · acceso OK
- GTM-NT3ZHDL5 (Observatorio) no está en ninguno de los dos dominios — irrelevante.

### PUBLICADO en producción (28-08) — versión 8 del contenedor
Verificado en el `gtm.js` que sirve Google para GTM-WV69PHLH: la etiqueta de conversión,
el vinculador con los tres dominios y el activador filtrado están en vivo.
Probado end-to-end en Vista previa con un registro real: la conversión se dispara al
enviar el formulario (mensaje de éxito de Divi confirmado). El registro de prueba queda
en la lista de Adigital para que lo borren.

### Contenido (originalmente preparado en workspace 9)
`accounts/318940788/containers/204427292/workspaces/9` — "OutThink 2026 — Qualivo (pendiente de revisión)"
https://tagmanager.google.com/#/container/accounts/318940788/containers/204427292/workspaces/9

| Elemento | Detalle |
|---|---|
| Trigger 10 | "Envío de formulario — Registro OutThink" · formSubmission · filtro Page URL contiene `outthink-2026` |
| Tag 11 | Google Ads conversión · `18413667658` / `JmwmCPumtekcEMqKqcxE` · conversion linker activo |
| Tag 12 | Vinculador de conversiones · cross-domain `rai.outthink.es, espacio.adigital.org, outthink.es` · en Initialization |

Notas para la revisión de Adigital:
- El activador existente (id 5) **no tiene filtro**: dispara en todos los formularios del sitio. Por eso la conversión de OutThink usa un activador propio acotado a la URL del evento. Implicación colateral: la etiqueta antigua del Observatorio está contando también los registros de OutThink en AW-16923064235.
- Falta la mitad del cross-domain: la decoración del enlace ocurre en la landing (GTM-WC7PTQTB), donde no tenemos acceso. Sin eso, el `_gl` no viaja.
- Riesgo a validar en la prueba: en formularios Divi el activador nativo puede dispararse aunque falle la validación. Si sobrecuenta, cambiar a visibilidad de `.et-pb-contact-message`.
- No se detecta CMP en el HTML; revisar Consent Mode v2 antes de lanzar.

**Plan B si la landing no se toca a tiempo:** apuntar las URLs finales de los anuncios directamente a `espacio.adigital.org/evento/outthink-2026/` — mismo dominio, sin salto, atribución garantizada a costa de perder la landing como página de venta.

## Remarketing — corrección 28-08
GA4 está vinculado a la cuenta (hay conversiones importadas y audiencias tipo REMARKETING de
las propiedades "RAI Outthink", "Espacio Adigital v2" y "adigital.org"). Eso permite hacer
remarketing de los visitantes de la landing **sin acceso a GTM-WC7PTQTB**: la etiqueta GA4
que ya existe allí alimenta las audiencias.

Las listas propias `OT26_RL_*` son RULE_BASED y dependen de una etiqueta de remarketing de
Google Ads que no existe en ningún contenedor, así que probablemente no se poblarán. La
audiencia `OT26_AUD_Interesados_RMK` (357704231) se ha ampliado para incluir las de GA4:
`OT26 · Visitó la landing`, `OT26 · Vio la agenda`, `All Users of RAI Outthink`, además de
las dos propias como respaldo.

Todas las listas están a 0 miembros: son nuevas y necesitan 24-48 h + tráfico. Demand Gen
exige un mínimo (~1.000 usuarios) para servir, así que la campaña de remarketing no
entregará hasta que haya volumen — es lo esperado y por eso arranca con el 20% del
presupuesto.


## Landing — GTM-WC7PTQTB (acceso concedido 28-08)

Contenedor `accounts/318940788/containers/259282561` ("rai.outthink.es/"), cuenta Adigital.
Contenido previo: solo dos etiquetas — **Cookiebot Banner** (plantilla `cvt_57SF4`) y **GA4**
(`googtag`, id via variable `{{GA4 ID}}`), esta última disparada por el activador 10
"Cookie Consent Update". Es decir: **sí hay CMP** y la medición está condicionada al
consentimiento — queda resuelta la duda que teníamos sobre Consent Mode.

### Workspace 5 — PENDIENTE DE PUBLICAR (Adigital autorizó la vinculación el 28-08)
`accounts/318940788/containers/259282561/workspaces/5` — "OutThink 2026 — Qualivo"

| Tag | Detalle |
|---|---|
| 13 · Vinculador de conversiones — dominios OutThink | `gclidw` · cross-domain `rai.outthink.es, espacio.adigital.org, outthink.es` · url passthrough |
| 14 · Google Ads — Remarketing OutThink | `sp` · conversionId 18413667658 · alimenta las listas `OT26_RL_*` |

Ambas disparan en el **activador 10 (Cookie Consent Update)**, el mismo que usa su GA4:
así heredan exactamente el gating de consentimiento que ya tienen validado, sin introducir
una dependencia nueva que pudiera bloquear las etiquetas en silencio.

`quick_preview` sin errores de compilación. Pendiente de publicar.

Al publicar: **sincronizar el Default Workspace** (workspace 4) para que no quede anclado a
la versión anterior — mismo problema que ocurrió en el contenedor de espacio.adigital.org.

## Pendiente para activar (31-08/01-09)
- [x] Conversión de registro creada, publicada y probada end-to-end (28-08)
- [x] Anuncios aprobados: los 15 en APPROVED / REVIEWED
- [~] Vinculación de dominios en la landing: montada en workspace 5, **falta publicar**
- [x] Facturación: billing_setup **APPROVED**, cuenta de pagos «Adigital» (verificado 28-08)
- [ ] Confirmar que la conversión de prueba aparece en Google Ads (~3 h de retardo)
- [ ] Lista de registrados → exclusión en las 3 campañas + lookalike (reactivaría el ad group C)
- [ ] Creatividades faltantes: P4/P4B/P4C/P4D y tarjetas CAR_T2–T4 → añadir anuncios/carrusel
- [x] Consent Mode: la landing usa Cookiebot y gatea GA4 tras el consentimiento; nuestras
      etiquetas replican ese gating
- [x] Campañas **ENABLED** el 28-08 con serving_status=PENDING: arrancan solas el lunes
      31-08 a las 00:00 por fecha de inicio. Sin franjas horarias (24 h) a propósito,
      para no limitar la recogida de datos la primera semana.
- [ ] Con conversiones ya midiendo: valorar paso de Maximizar clics → Maximizar conversiones

## Día 1 (31-08) — diagnóstico y primera optimización

Datos a las ~11:00 (11 h servidas): Search 4 impresiones / 0 clics / **0 € de 25 €**;
DG Prospecting 127 impr / 2 clics / 3,60 €; DG Remarketing 0 (audiencias vacías, esperado).

**Diagnóstico Search:** 4 de las 17 keywords marcadas `RARELY_SERVED` por volumen insuficiente
(`conferencia inteligencia artificial madrid`, `regulación ia cumplimiento`,
`ai act normativa inteligencia artificial`, `outthink madrid`). Un único término de búsqueda
real en todo el día: «congreso ia madrid 2026». Causa: se multiplican tres filtros —
keywords hipernicho × concordancia de frase × solo Comunidad de Madrid.

**Aplicado (decisión de Maikel: solo keywords, sin tocar geo de momento):**
- 19 keywords nuevas en **concordancia amplia** repartidas en AI Act (7), Compliance (6) y
  Eventos (6). Ejemplos: `ai act`, `reglamento ia`, `ley de inteligencia artificial`,
  `gobernanza inteligencia artificial`, `congreso inteligencia artificial`.
- Marca **se queda en frase** a propósito: «outthink» en amplia arrastraría tráfico en inglés
  sin relación. Añadidos `outthink for ai`, `outthink 2026`, `foro outthink`.
- 16 negativas nuevas (22 en total) como contrapeso a la concordancia amplia: chatgpt, curso
  online, certificacion, universidad, tfg, tfm, descargar, wikipedia, generador, trabajo,
  sueldo, becas, apuntes...

**Pendiente sobre la mesa:** abrir el geo a toda España. Es el cambio con más recorrido
(el geo actual recorta ~85% de un mercado ya pequeño) pero se desvía del brief aprobado,
así que queda a decisión de Maikel/Adigital.

**A vigilar mañana:** términos de búsqueda reales que traiga la amplia — hay que revisarlos
a diario los primeros días y añadir negativas de lo que no encaje.

### Optimización 31-08 (tarde)
- **RSA reescritos por grupo.** Los cuatro grupos compartían los mismos 15 titulares y el de
  Compliance estaba en calidad POOR. Se mantienen 11 de los 15 aprobados y se sustituyen 4
  genéricos (Networking institucional, Agenda de primer nivel, Ponencias y talleres de IA,
  IA/ciberseguridad/cuántica) por titulares propios de cada tema:
  - AI Act: AI Act para empresas · Reglamento europeo de IA · Obligaciones del AI Act · ¿Cumples ya el AI Act?
  - Compliance: Riesgos de la IA en tu empresa · Protección de datos e IA · Compliance de IA en España · Gobernanza de IA aplicada
  - Eventos: Congreso de IA en Madrid · Foro de IA · 24 septiembre · Evento IA Madrid 2026 · Jornada de IA para empresas
  - Marca: OutThink for AI · Adigital · OutThink: foro de IA · OutThink 2026 · Registro · OutThink · Casa del Lector
- **Techo de CPC de 3,00 €** en Search: maximizar clics sin límite + concordancia amplia era
  una combinación con riesgo de que una sola subasta cara se comiera el día.
- **Recursos de imagen en Search: no se pueden añadir por API.** `AD_IMAGE` devuelve
  `UNSUPPORTED_FIELD_TYPE` (no admitido vía asset links) y MARKETING_IMAGE/SQUARE no son
  compatibles con campañas de búsqueda. Hay que añadirlos a mano desde la interfaz
  (Anuncios y recursos → Recursos → Imágenes).

### Nota sobre la conversión a 0
Google Ads solo contabiliza conversiones atribuibles a un clic en anuncio. El registro de
prueba del 28-08 se hizo entrando directo, sin gclid, así que la etiqueta disparó pero no
aparece en informes. No es un fallo de medición. La validación real llega con el primer
registro procedente de un clic de campaña.

## Reporte diario automatizado
`scripts/reporte_diario.js` — script de Google Ads (se ejecuta dentro de la cuenta, sin
infraestructura externa ni credenciales que mantener).

Instalación: Google Ads → Herramientas → Acciones masivas → Scripts → "+" → pegar → autorizar
→ Vista previa para probar → Programar diariamente a las 08:00. Ajustar `DESTINATARIOS`.

Envía por email: acumulado por campaña con CPL, datos del día anterior, términos de búsqueda
del día (para ir limpiando la concordancia amplia), consumo de presupuesto y proyección de
registros al ritmo actual. Incluye bloque de avisos: campañas activas sin impresiones, gasto
sin conversiones (posible fallo de medición), CPL por encima de 15 €, ritmo de gasto bajo y
alerta de objetivo cuando quedan menos de 7 días.

### Cierre del día 1 (31-08)
Total: 317 impresiones · 2 clics · 7,09 € · 0 conversiones.
- Search 75 impr / 0 clics / 0 € · DG Prospecting 242 impr / 2 clics / 7,09 € (CPC 3,54 €) ·
  DG Remarketing 0 (audiencias aún vacías).
- **Las keywords en amplia funcionaron**: Search pasó de 4 a 75 impresiones en el día.
- **Los RSA por grupo también**: los cuatro APPROVED, Compliance POOR → AVERAGE, Marca → GOOD.
- `OT26_RL_Visitantes_Web` ya tiene 8 usuarios → la etiqueta de remarketing de la landing
  está alimentando la lista (quedaba la duda de si las rule-based se poblarían).

**Problema detectado:** 75 impresiones con 0 clics. Cuota de impresiones 30%, con el **70%
perdido por ranking y 0% por presupuesto** — no falta dinero, no ganamos subastas. Los
términos confirman intención informativa/legal: `reglamento ue 2024 1689`, `eu ai act que es`,
`article 50 eu ai act`, `ley de la ia`. Gente buscando el texto normativo, no un evento.

**Aplicado:**
- Techo de CPC 3 € → **5 €**. El de 3 € se puso por la mañana como protección ante la
  concordancia amplia, pero ese riesgo no se materializó (0 € gastados en Search) y muy
  probablemente estaba contribuyendo a la pérdida por ranking en un vertical B2B legal.
- 15 negativas nuevas contra búsquedas de texto legal (37 en total): 2024 1689, eur lex, boe,
  texto legal, artículo, article, consolidado, diario oficial, traducción, infografía...

**A comprobar mañana:** si Search empieza a recibir clics. Si sigue sin arrancar con el techo
más alto y las negativas puestas, el cuello de botella es el geo y hay que llevar la
propuesta de abrir a toda España a Adigital.

## Día 2 (01-09) — arranque confirmado

| | 31-08 | 01-09 (mediodía) |
|---|---|---|
| Impresiones | 504 | 815 |
| Clics | 15 | 53 |
| Coste | 42,04 € | 52,38 € |
| Conversiones | **1** | 0 |

Acumulado: 1.319 impr · 68 clics · 94,42 € (4,7% del presupuesto) · **1 registro**.

- **Primera conversión registrada**, procedente de `OT26_Search_EventosIA`. Valida la cadena
  de medición completa de punta a punta (clic → landing → cross-domain → registro → Ads).
- Search desbloqueada del todo: 0 → 18 clics, CTR 5,23%, CPC 2,45 € (por debajo del techo de
  5 €, así que el techo ya no limita).
- Demand Gen saliendo del aprendizaje: CPC de 3,54 € → 1,01 €.
- **Cuota de impresiones de Search al 45,8%, con 22,7% perdido por presupuesto** (ayer 0%).
  Search ya se queda corta de dinero: es el primer candidato a recibir presupuesto de otras
  campañas en la revisión de la semana 2.
- Negativas añadidas: `caepia`, `sepln`, `congreso academico` — «caepia 2026» es un congreso
  académico de informática, se llevó 4,06 € sin convertir.

## Automatización del reporte
Dos vías, ambas en el repo:
- `scripts/reporte_diario.js` — script nativo de Google Ads, sin dependencias externas.
- `n8n/workflow_reporte_diario.json` — flujo de n8n con dashboard histórico en Google Sheets
  y email a varios destinatarios. Ver `n8n/README.md`.

**La API de Google Ads no admite cuentas de servicio** (solo con delegación en todo el
dominio de Workspace). El flujo usa el refresh token de OAuth para Ads y reserva la cuenta
de servicio para Google Sheets, que sí la soporta.

### Dashboard operativo (01-09)
Hoja **Dashboard - Adigital** (`1-UKqrxTObh4ME2LHldlD6eREll1EiIqM9x1ozHVA-MA`), pestaña
`Historico` creada, formateada y rellenada con los datos reales desde el 31-08. Acceso de la
cuenta de servicio `apiclaude@kinetic-dream-377917.iam.gserviceaccount.com` verificado.
El flujo de n8n añade una fila por día sobre esa pestaña.

### n8n desplegado (01-09)
- Workflow **`t6g8nV3pQXqYLpuN`** — «Qualivo — OutThink 2026 · Reporte diario Google Ads»,
  **activo**, ejecución diaria a las 08:00. https://qualivo.app.n8n.cloud/workflow/t6g8nV3pQXqYLpuN
- Credencial `Np6XgvlYOuBp9rmM` («Google SA · apiclaude (OutThink)») creada con la cuenta de
  servicio, usada por el nodo de Google Sheets.
- Corregido antes de activar: el nodo de Sheets recibía un objeto anidado y no habría mapeado
  las columnas. Se añadió el nodo «Fila para el dashboard» que la aplana.
- **Nodo de email desactivado**: no existe ninguna credencial SMTP/Gmail en la instancia
  (revisados los 35 workflows). Falta crearla, o usar el script nativo de Google Ads para el
  correo y dejar n8n solo para el dashboard.

### Dashboard con formato (01-09)
Pestaña `Dashboard` creada en la hoja, con panel de KPIs por fórmulas (registros, CPL,
invertido, proyección, días restantes — se recalculan solos al añadir filas), cuatro gráficos
(registros acumulados, coste diario, clics por día, inversión acumulada) y formato condicional
en el histórico: días con registros en verde, CPL por encima de 15 € en rojo.

### Reporte diario en producción (01-09) — validado
Ejecución `27542` correcta de punta a punta: consulta a Google Ads, cálculo de KPIs, fila en
el dashboard y **email enviado**. Credencial SMTP `2lt9aBFiTuuZWMV7` (Gmail con contraseña de
aplicación de info@). El webhook temporal usado para la prueba se eliminó tras validar.

Cuatro fallos corregidos durante el despliegue: `pageSize` no soportado en v25, expresiones
`{{ }}` anidadas en n8n, orden de ejecución de las dos consultas en paralelo, y el objeto
anidado que llegaba al nodo de Sheets. Detalle en `n8n/README.md`.

Destinatarios definitivos: `info@maikelechevarria.com`, `maikel@qualivo.io` y
`asanchez@adigital.org`. Remitente `info@maikelechevarria.com` (debe coincidir con la cuenta
del SMTP o Gmail rechaza el envío).

### Corrección del dashboard (01-09)
El panel de KPIs mostraba ceros. Dos causas, ambas mías:
1. Al deduplicar la hoja tras la ejecución manual leí los valores **ya formateados** y los
   reescribí como texto (`'504'`, `'2.98%'`). `SUM` y `COUNT` sobre texto devuelven 0.
   Histórico reconstruido desde la API con tipos numéricos reales.
2. Las fórmulas usaban `COUNT` sobre la columna de fechas, que son texto → cero filas
   contadas → proyección a 0. Cambiado a `COUNTA`, y el subtítulo de `MAX()` a
   `INDEX(...;COUNTA(...))`.

Panel verificado: 1 registro · CPL 99,42 € · 99,42 € invertidos (5%) · proyección 13 ·
23 días restantes. Nota: al deduplicar a mano hay que leer siempre con
`valueRenderOption=UNFORMATTED_VALUE`; el nodo de n8n sí escribe tipos correctos.

## Día 3 (02-09) — PMax de prueba con el presupuesto de Remarketing

Acumulado a mediodía: 113 € (5,7 %), 137 clics, 1 registro (Search/EventosIA, escritorio).
Search pierde el 39 % de impresiones por presupuesto; DG Prospecting 106 clics / 0 registros;
Remarketing sin servir (16 usuarios en lista, necesita ~1.000).

Propuse mover los 16,67 €/día de Remarketing a Search. **Decisión de Maikel: probar PMax
con ese presupuesto, a Maximizar conversiones.** Ejecutado con `api/create_pmax.py`:

- `OT26_DemandGen_Remarketing` `24193394560` → **PAUSADA** (se reactivará si las listas
  superan ~1.000 usuarios, improbable antes del evento).
- **`OT26_PMax_Test` `24210974587`** · presupuesto `15843105114` 16,67 €/día · Maximizar
  conversiones sin CPA objetivo · 02-09 → 24-09 · Comunidad de Madrid (solo presencia) ·
  español · **exclusión de marca** por negativas de campaña en frase (`outthink`,
  `out think`, `adigital`) para que no se coma a Search/Marca.
- Sin expansión de URL final ni automatizaciones generativas (texto, vídeos mejorados,
  mejoras/extracción/versiones de imagen): solo creatividades y copies validados.
- Grupo de recursos `OT26_AG_AIAct` `6744460423`: 9 titulares (≤30), 4 titulares largos,
  4 descripciones, imágenes P1/P2/P3/P5/R1 (horizontal), P1/P2/P3/P5/C5 (cuadrada),
  P1/P2/P5/C5 (vertical). Nombre de empresa y logo van como CampaignAsset (Brand
  Guidelines viene activado por defecto en PMax). Señales: audiencia
  `OT26_AUD_ComplianceLegal` + 10 temas de búsqueda del brief.
- Estado al crearla: grupo en revisión (`ASSET_GROUP_UNDER_REVIEW`), puja en aprendizaje.

**Criterio de corte acordado:** si a los 100 € gastados no hay ningún registro, se pausa y el
presupuesto vuelve a Search. Se juzga por registros totales de la cuenta, no solo por los
que se atribuya PMax.

Aprendizajes de API v25 para PMax: `urlExpansionOptOut` ya no existe (se controla con
`FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION`); los únicos opt-outs admitidos a nivel de
campaña son expansión de URL, texto, vídeos mejorados y los tres de imagen; titulares y
descripciones deben crearse en un mutate previo (la validación del grupo es incremental y
rechaza recursos temporales para esos dos tipos).

Pendiente que sigue sobre la mesa: ajuste −30 % en móvil en Search (no ejecutado, sin
confirmación) y subir Search de presupuesto si PMax no arranca.

### Revisión de términos (02-09, tarde)
`congreso inteligencia artificial` (amplia) está casando con otros eventos: AI Summit
Barcelona, Tech Show Madrid, eShow, CAEPIA, Gartner, South Summit, Smart City Expo…
17,5 € sin registro. `ley de inteligencia artificial` y `reglamento ia` traen búsquedas
informativas («qué es», «cuándo entra en vigor», «2024/1689») con muchas impresiones y
casi ningún clic. Añadidas 32 negativas de campaña en frase (ciudades fuera de Madrid,
nombres de otros eventos, términos informativos y de texto legal). Total: 72 negativas.

Datos nuevos del día: en Search el móvil cuesta 2,78 €/clic frente a 1,21 € en escritorio y
no ha convertido; las franjas 20–23 h y 06–07 h concentran la mitad del gasto de Search con
CPC > 3 €. En DG Prospecting el 96 % de los clics son móvil (0 registros) y el grupo A
(ComplianceLegal) apenas sirve: 81 impresiones frente a 1.619 del grupo B.

### Ajustes aplicados (02-09, tarde) — aprobados por Maikel · `api/ajuste_dia3.py`
1. **Search, móvil −40 %** (CPC móvil 2,78 € vs 1,21 € escritorio, 0 registros en móvil).
2. **Search, programación de anuncios**: 07–22 h al 100 %, 22–07 h al 50 %, todos los días
   (21 franjas; se cubren las 24 h para que la campaña no deje de servir de noche).
3. **Presupuestos**: Search 25 → **35 €/día** · DG Prospecting 41,67 → **31,67 €/día**.
   Total diario sin cambios: 35 + 31,67 + 16,67 (PMax) = 83,34 €.
4. **DG Prospecting, URL final directa al formulario** `espacio.adigital.org/evento/outthink-2026/`
   (mismos UTM). Elimina el doble salto landing → formulario en móvil (96 % de sus clics).
   Los 7 anuncios han vuelto a revisión de políticas (`REVIEW_IN_PROGRESS`); unas horas sin
   servir. Search sigue apuntando a la landing porque es la que convierte.

Sin tocar: grupo A de DG (ComplianceLegal, ya va como señal en PMax). Pendiente: pedir a
Aída el embudo GA4 landing → registro → formulario completado.

### Correo de Aída (02-09) y acciones
Aída propone: subir Search quitando a Prospecting (hecho hoy); pasar DG Prospecting a
conversiones; quitar pantallas de TV; duda sobre las UTM (opciones de URL de campaña vacías).
Informa de que la **CSP de la landing bloqueaba `google.com/ccm/collect` y
`doubleclick.net/ccm/collect`** (connect-src), ya resuelto: la etiqueta de remarketing no
había podido construir audiencia desde el lunes. Eso explica las listas a 16 usuarios.

Hecho tras su correo:
- **TV excluida en DG Prospecting** (ajuste −100 % en CONNECTED_TV; la exclusión negativa
  no se admite y en Search no aplica).
- **UTM duplicadas corregidas.** La cuenta tenía un sufijo de URL final
  (`utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}`)
  que se añadía detrás de las UTM ya incluidas en cada anuncio → `utm_campaign` dos veces
  (nombre e ID). Sufijo a nivel de campaña, que tiene prioridad: Search
  `utm_id={campaignid}&utm_term={keyword}`; DG, RMK y PMax `utm_id={campaignid}`.
- **Hallazgo:** los enlaces de la landing al formulario (`espacio.adigital.org/evento/outthink-2026/`)
  van sin parámetros. El tráfico de Search llega al formulario sin UTM (solo `_gl` del
  vinculador), así que en el listado de inscritos no se puede separar por campaña salvo
  que la landing propague la query string a esos enlaces. DG ya va directa desde hoy.
- DG a Maximizar conversiones: propuesto para el viernes, con dos días de datos de la URL
  directa. PMax ya corre en Maximizar conversiones.
- **DG Prospecting → Maximizar conversiones** (sin CPA objetivo) aplicado el mismo 02-09 a
  petición de Aída, con el visto bueno de Maikel. Se pierde el tope de CPC de 5 € que tenía
  Maximizar clics; vigilar el CPC los dos primeros días. Search sigue en Maximizar clics.

## Día 4 (03-09) — primera conversión de PMax, presupuestos y fuerza del anuncio

Datos del 02-09: PMax 140 clics / 18,07 € / **1 registro** (móvil, red Display, CPC 0,13 €),
con el 75 % de impresiones perdidas por presupuesto. Search 29 clics / 35,42 € / 0 (65 % IS
perdido por presupuesto). DG Prospecting 100 clics / 23,37 € / 0. Acumulado: 202,75 €
gastados, 2 registros (Search 31-08, PMax 02-09). Restante 1.797 € → 85,6 €/día para 21 días.

Hallazgos en PMax: campaña `LIMITED` por `HAS_ASSET_GROUPS_LIMITED_BY_POLICY` — la imagen
**OT26_R1_HZ rechazada por `MISLEADING_AD_DESIGN`** (en DG el anuncio que la usa sigue
aprobado). Fuerza del anuncio POOR.

Aplicado (decisión de Maikel de subir PMax; el resto, rutina):
- Imagen R1_HZ retirada del grupo de recursos de PMax.
- +5 titulares (Congreso de IA en Madrid · AI Act para empresas · Reglamento europeo de IA ·
  Jornada de IA para empresas · Gobernanza de IA aplicada), +1 titular largo, +1 descripción.
  Ahora 14/5/5. Grupo de nuevo en revisión.
- Presupuestos: **PMax 16,67 → 26,67 €/día · DG Prospecting 31,67 → 23,67 €/día** · Search 35.
  Total 85,34 €/día, ajustado al restante.
- Search **se mantiene en Maximizar clics** (tope 5 €): con 1 registro propio y limitada por
  presupuesto, Maximizar conversiones subiría el CPC sin añadir volumen. Cambiar cuando
  Search acumule ~5 registros, con CPA objetivo.

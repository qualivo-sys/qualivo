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

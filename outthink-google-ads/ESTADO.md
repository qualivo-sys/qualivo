# OutThink 2026 — Estado de la cuenta de Google Ads

Cuenta cliente: **918-811-5388** (acceso estándar vía info@) · API v25 · Actualizado: 28-08-2026

## Creado — las 3 campañas del plan, todas en PAUSED (0 € de gasto)

| Campaña | ID | Presupuesto/día | Tipo |
|---|---|---|---|
| OT26_Search | 24182552133 | 25,00 € (600 € ÷ 24d) | Search · Maximizar clics |
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

## Pendiente para activar (31-08/01-09)
- [x] Conversión de registro creada, publicada y probada end-to-end (28-08)
- [x] Anuncios aprobados: los 15 en APPROVED / REVIEWED
- [ ] **Vinculación de dominios en la landing** (GTM-WC7PTQTB, sin acceso) — sin esto la
      atribución se pierde en el salto rai.outthink.es → espacio.adigital.org
- [ ] Cliente: método de pago/facturación activo en la cuenta (bloqueante real del día 31)
- [ ] Confirmar que la conversión de prueba aparece en Google Ads (~3 h de retardo)
- [ ] Lista de registrados → exclusión en las 3 campañas + lookalike (reactivaría el ad group C)
- [ ] Creatividades faltantes: P4/P4B/P4C/P4D y tarjetas CAR_T2–T4 → añadir anuncios/carrusel
- [ ] Revisar Consent Mode v2 (no se detecta CMP en el HTML del registro)
- [ ] Quitar PAUSED (decisión con Maikel)
- [ ] Con conversiones ya midiendo: valorar paso de Maximizar clics → Maximizar conversiones

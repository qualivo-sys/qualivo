# Campaña de Retargeting — Eleva Nails (lista para lanzar)

> Estado: **especificada, pendiente de lanzar.** El píxel "Nail Boss Academy" está activo y
> disparando (verificado), pero **no hay audiencias creadas todavía**. Crear audiencias + campaña
> son acciones de escritura en Meta (gastan dinero) → las lanza una persona en Ads Manager o Claude
> con permiso de `ads_management`.
>
> Cuenta: **Eleva Nails** (`act_2028650084720565`) · Píxel: **Pixel Nail Boss Academy**.

## Por qué retargeting ahora
- El 100 % de los leads actuales vienen de Meta en frío. El retargeting recupera al que **ya nos
  conoce** pero no dejó datos → es el tráfico más barato de convertir.
- Destino: la **Landing**, que convierte a matrícula 4,5× mejor (2,7 % vs 0,6 %) — es donde mandar
  al público caliente.

## 1) Audiencias — ✅ CREADAS (cuenta Eleva Nails)
Creadas por API el 11/09/2026 (píxel 962769166393542, página 945259455348081, IG @elevanailboss
17841448140451000). Ya se pueden seleccionar en Ads Manager:

1. ✅ **RTG · Visitantes web 30d** (id 120253598745040359)
2. ✅ **RTG · Visitantes web 90d** (id 120253598745150359)
3. ✅ **RTG · Landing sin Lead 30d** (id 120253598757310359) — visitó y NO dejó datos
4. ✅ **RTG · Engagement Instagram 365d** (id 120253598759750359)
5. ✅ **RTG · Engagement Facebook 365d** (id 120253598760500359)

Pendiente (manual, opcional): **Leads del CRM sin matricular** — exportar CSV desde GHL (contactos
sin etiqueta de alumna) y subirlo como audiencia. Requiere el export manual.

**Lookalike (opcional, fase 2):** LAL 1 % a partir de la audiencia de matriculadas → prospección de
mejor calidad. (No es retargeting, pero es el siguiente paso natural.)

## 2) Estructura de la campaña
- **Objetivo:** Ventas/Leads (conversión, evento Lead).
- **1 campaña "Retargeting"** con 2 conjuntos de anuncios:
  - AdSet A — **Web + engagement** (audiencias 1-5, excluyendo quienes ya son Lead).
  - AdSet B — **Leads sin matricular** (audiencia 6) → mensaje de "vuelve y reserva".
- **Presupuesto de arranque:** 5-8 €/día total (el retargeting necesita poco; la audiencia es
  pequeña). Subir solo si la frecuencia se mantiene sana (<3-4).
- **Destino:** Landing (`Nail Boss Academy - Landing`).
- **Exclusiones:** matriculadas y leads ya en llamada agendada (para no gastar en quien ya avanza).

## 3) Creatividades (ángulo recordatorio + prueba social + urgencia)
- **A · "Sé que lo estuviste mirando"** — recordatorio directo: "¿Te quedaste con las ganas de
  formarte en uñas? Aún estás a tiempo." → CTA reservar.
- **B · Prueba social** — testimonio/resultado de una alumna ("empezó de cero y hoy trabaja de
  esto") → CTA.
- **C · Urgencia/plazas** — "Nuevas fechas abiertas, plazas limitadas" → CTA.
- Formatos: reel vertical + imagen única. Refrescar cada 2-3 semanas para no fatigar (la cuenta ya
  arrastra CPM al alza por saturación del público frío).

## 4) Medición
- KPI: CPL de retargeting (debería ser **menor** que el frío ~2,7 €) y, sobre todo, **coste por
  matrícula**.
- Se verá en el panel (pestaña Comercial → "Anuncios que mejor rinden"), donde la nueva campaña
  aparecerá como una fila más.

## 5) Pasos para lanzar (checklist)
- [x] **Aceptar TOS de Custom Audiences** de la cuenta (hecho).
- [x] **Crear las audiencias** (5 creadas por API — ver sección 1).
- [ ] Exportar de GHL el CSV de leads sin matricular y subirlo como audiencia (opcional).
- [ ] **Crear la campaña** con los 2 AdSets y las exclusiones (Ads Manager — gasta dinero).
- [ ] Subir 3 creatividades (A/B/C).
- [ ] Presupuesto 5-8 €/día. Publicar.
- [ ] Revisar a los 3-4 días: frecuencia, CPL y coste por matrícula.

> Falta solo el paso de campaña + creatividades. Eso ya gasta dinero, así que va por Ads Manager
> (seleccionando estas audiencias) o quitando el bloqueo de gasto para que Claude lo monte.

---
*Qualivo — Eleva Nails. No se lanza automáticamente porque implica gasto publicitario; requiere
aprobación explícita.*

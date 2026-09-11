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

## 1) Audiencias a crear (Custom Audiences)
1. **Visitantes web 30 días** — todo el tráfico del píxel, 30 días.
2. **Visitantes web 90 días** — para tener volumen suficiente.
3. **Vieron la landing pero NO enviaron formulario** — visitantes de la landing menos los que
   dispararon el evento Lead (exclusión).
4. **Video-views 50 %+** de los anuncios actuales (engagement alto).
5. **Engagement Instagram/Facebook 365 días** — han interactuado con el perfil/anuncios.
6. **Leads del CRM sin matricular** — subir CSV desde GHL (contactos sin etiqueta de alumna) para
   retargetear a los que ya son lead pero no cerraron.

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
- [ ] Crear las 6 audiencias (Ads Manager → Audiencias, o API con `ads_management`).
- [ ] Exportar de GHL el CSV de leads sin matricular y subirlo como audiencia.
- [ ] Crear la campaña con los 2 AdSets y las exclusiones.
- [ ] Subir 3 creatividades (A/B/C).
- [ ] Presupuesto 5-8 €/día. Publicar.
- [ ] Revisar a los 3-4 días: frecuencia, CPL y coste por matrícula.

---
*Qualivo — Eleva Nails. No se lanza automáticamente porque implica gasto publicitario; requiere
aprobación explícita.*

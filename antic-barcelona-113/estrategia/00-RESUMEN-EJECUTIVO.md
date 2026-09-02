# Antic Barcelona 113 — Campaña de captación
## Resumen ejecutivo

> Documento de trabajo para la reunión de comisión. Todo lo marcado como **[SUPUESTO]**
> necesita validación del cliente antes de comprometerse con cifras.

---

## 1. Qué vendemos realmente

Antic Barcelona 113 no vende mesas. Vende **la pieza que cierra una reforma**.

El cliente que compra aquí ya se ha gastado 40.000 € en obra, ha elegido el gres, ha
discutido la grifería — y llega al comedor y no encuentra nada. Todo lo que ve en las
tiendas es la misma mesa que ya tienen sus cuñados. Ese es el momento de dolor, y es
un momento **con fecha**: ocurre en las 8-12 semanas finales de una reforma.

Esa es la palanca de toda la campaña.

## 2. Diagnóstico en una línea

**Producto excepcional, fotografía de nave industrial.**

Las nueve fotos disponibles muestran piezas magníficas — mesas de tronco de una sola
pieza, encajes de ebanistería, roble recuperado — fotografiadas sobre hormigón, con
etiquetas de precio a la vista y muebles amontonados al fondo. En Meta compites contra
interiorismo editorial. Con estas fotos, el CPM sube y el CTR baja, y ningún copy lo
compensa.

**La foto es la palanca número uno de esta campaña. Por delante del copy, del público
y de la estructura de cuenta.** Ver `03-creatividades-y-copys.md` §1.

## 3. La decisión estratégica con 600-1.000 €/mes

Con ~25-33 €/día no caben cuatro campañas. Cabe **una de captación y una de retargeting**.
Y hay un problema técnico que hay que resolver antes de gastar el primer euro:

> Si optimizamos directamente a "lead cualificado" (cuestionario completo), generaremos
> 20-30 eventos al mes. Meta necesita ~50 por conjunto y **semana** para salir de fase
> de aprendizaje. El algoritmo nunca aprendería y el CPL se dispararía.

**Solución: funnel de dos peldaños.**

| | Evento | Volumen esperado/mes | Uso |
|---|---|---|---|
| Peldaño 1 | Descarga de la guía (`Lead`) | 70-110 | **Evento de optimización.** Da señal suficiente al algoritmo. |
| Peldaño 2 | Cuestionario completo (`CompleteRegistration`) | 20-30 | **Evento de negocio.** Cualifica y prioriza el comercial. |

El cuestionario que ya está diseñado (6 pasos, scoring HOT/WARM/COLD) no es un formulario:
es el filtro comercial. Su trabajo no es captar, es decidir a quién llama el cliente primero.

## 4. Números esperados (escenario 900 €/mes)

**[SUPUESTO]** — Estimaciones de benchmark para mueble a medida de ticket alto en
Cataluña. Se recalibran con datos reales a partir de la semana 3.

| Métrica | Rango esperado | Notas |
|---|---|---|
| CPM | 6-12 € | Cataluña, público amplio |
| CTR (enlace) | 0,8-1,5 % | Por debajo de 0,6 % → apagar creatividad |
| CPC | 0,45-1,00 € | |
| Landing → guía | 15-25 % | Depende de la landing, no de Meta |
| **CPL guía** | **6-15 €** | KPI de optimización |
| Guía → cuestionario | 20-35 % | |
| **CPL cualificado** | **35-80 €** | KPI de negocio |
| Cuestionario → presupuesto | 40-60 % | Depende del comercial |
| Presupuesto → venta | 15-30 % | |
| **CAC estimado** | **250-600 €** | |

**Lectura honesta:** con 900 €/mes salen **1-2 ventas al mes**. Con un ticket medio
**[SUPUESTO 3.000 €]** y margen bruto **[SUPUESTO 45 %]**, eso son 1.350-2.700 € de
margen contra 900 € de medios más el fee de agencia.

- **Mes 1: probablemente en tablas.** Es fase de aprendizaje y construcción de audiencias.
- **Mes 2-3: positivo**, cuando el retargeting empieza a trabajar sobre una base de
  700-1.000 visitantes acumulados y las creatividades ganadoras están identificadas.

Decir esto en la reunión es lo que hace creíble el resto. Un plan que promete ROAS 4x
el primer mes con 900 € en mueble a medida no lo cumple nadie.

## 5. Los cinco ángulos creativos

Los cinco conceptos ya definidos son buenos y cubren el espectro. La apuesta de partida
por volumen de inversión:

| # | Concepto | Tesis | % presupuesto inicial |
|---|---|---|---|
| 01 | **Anti-catálogo** | "No hay dos mesas iguales porque no hay dos espacios iguales" | 25 % |
| 02 | **Reforma** | "Has diseñado toda la casa. ¿Por qué la mesa va a salir de un catálogo?" | **30 %** ← favorito |
| 03 | **Personalización** | "Dime cuánto mide tu comedor" | 20 % |
| 04 | **Artesanía** | "Hecho aquí, a mano" | 15 % |
| 05 | **Historia** | "Esto no empezó siendo una mesa" | 10 % |

**El 02 es el favorito** porque es el único que ataca un momento con fecha (la reforma
terminando) en lugar de un gusto genérico. Los momentos con fecha convierten; los gustos
generan guardados.

El **05 (Historia)** es el mejor para retargeting y contenido orgánico, no para frío:
la historia del roble centenario emociona a quien ya te conoce, pero no detiene el scroll
de quien no.

## 6. Qué entregamos

| Entregable | Estado | Dónde |
|---|---|---|
| Estrategia completa (7 documentos) | ✅ | `estrategia/` |
| Landing + funnel de 4 pantallas, navegable | ✅ | Vercel (enlace para el cliente) |
| 10 creatividades × 3 formatos (4:5, 1:1, 9:16) | ✅ | Google Drive |
| Copys completos de anuncio (texto, titular, descripción) | ✅ | `03-creatividades-y-copys.md` |
| Plan de medición (Pixel, CAPI, eventos, UTMs) | ✅ | `04-medicion-y-tracking.md` |
| Secuencia de seguimiento de leads | ✅ | `05-funnel-y-seguimiento.md` |
| Calendario de 90 días | ✅ | `06-calendario-90-dias.md` |
| Piezas hero recontextualizadas con IA | ⚠️ Muestra | Ver `03` §1.3 |

## 7. Las tres cosas que hay que pedirle al cliente en la reunión

1. **Ticket medio real y margen.** Todo el modelo económico cuelga de ahí. Sin eso, el
   CPL objetivo es una invención.
2. **Acceso a fotos de proyectos entregados en casa del cliente.** Si existen aunque sean
   de móvil, cambian la campaña. Si no existen, hay que producirlas (§ 3 de `03-`).
3. **Quién contesta el WhatsApp y en cuánto tiempo.** Un lead HOT del cuestionario tiene
   ventana de horas. Si se contesta al tercer día, la campaña no falla en Meta: falla
   en el teléfono.

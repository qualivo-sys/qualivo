# 02 · Plan de medios — Meta Ads

Presupuesto de trabajo: **600-1.000 €/mes**. El plan detallado usa **900 €/mes (30 €/día)**
como escenario central; al final hay las variantes de 600 € y 1.000 €.

---

## 1. Principio rector

> Con 30 €/día, el enemigo no es el CPM. Es la **fragmentación**.

Cada conjunto de anuncios necesita ~50 conversiones/semana para salir de fase de
aprendizaje. Con 30 €/día y un CPL de 10 €, todo el presupuesto genera ~21 leads/semana.
**Eso da para UN conjunto en aprendizaje. No para tres.**

Por tanto: pocas campañas, pocos conjuntos, muchas creatividades. La variedad va en el
anuncio, no en la estructura.

## 2. Antes de gastar el primer euro — checklist técnico

| # | Requisito | Por qué |
|---|---|---|
| 1 | Cuenta publicitaria en Business Manager propio del cliente | Que el activo sea suyo, no de la agencia |
| 2 | **Dominio verificado** en Meta | Sin esto no se pueden priorizar eventos (AEM) |
| 3 | Pixel instalado en las 4 pantallas del funnel | — |
| 4 | **Conversions API** activa y deduplicada | iOS 14.5+ pierde 20-40 % de eventos solo con pixel |
| 5 | 8 eventos priorizados y configurados | Ver `04-medicion-y-tracking.md` |
| 6 | Página de Facebook e Instagram vinculadas | Necesario para publicar |
| 7 | Método de pago con límite de gasto de cuenta | Protección ante errores |
| 8 | Política de privacidad y aviso de cookies en la landing | Requisito de Meta y del RGPD |
| 9 | WhatsApp Business configurado con respuesta rápida | Ver `05-funnel-y-seguimiento.md` |
| 10 | Guía PDF terminada y entrega automatizada | Es el evento de optimización |

**Ninguno de estos diez es opcional.** Lanzar sin el 4 o sin el 10 es tirar el presupuesto
del primer mes.

## 3. Estructura de cuenta — Fase 1 (meses 1-3)

### CAMPAÑA 01 — Captación en frío
```
Objetivo:        Ventas (Sales)
Optimización:    Conversión → Lead
Presupuesto:     CBO 22 €/día  (73 %)
Atribución:      7 días clic / 1 día visualización
Puja:            Coste más bajo (sin límite) las primeras 2 semanas
```

**Conjunto único: `ES-CAT | Amplio | Lead`**

| Parámetro | Valor | Razón |
|---|---|---|
| Ubicación | Radio 80 km de Terrassa (cubre Barcelona, Vallès, Maresme, Bages, Penedès, parte de Girona) | Coincide con el radio real de transporte e instalación |
| Edad | 32-65 | Por debajo de 32 raramente hay capacidad para 3.000 € en una mesa |
| Género | Todos | La decisión es de pareja |
| Intereses | **Ninguno.** Segmentación detallada con expansión Advantage | Con este presupuesto, el público amplio da mejor señal que los intereses |
| Ubicaciones | Automáticas (Advantage+) | Feed, Reels y Stories a la vez; Meta reasigna |
| Exclusiones | Conversores últimos 90 d · Empleados | Evita gastar en quien ya compró |
| Idioma | Sin restricción | Castellano y catalán conviven |

> **Por qué público amplio y no intereses.** Con 22 €/día un público de interés de
> 80.000 personas se satura en semanas (frecuencia > 4) y no da a Meta margen para
> encontrar patrones. El público amplio (~1,5-2,5 M) deja que el algoritmo use la señal
> del píxel. **La segmentación real la hace la creatividad**: un anuncio que dice
> "has diseñado toda la casa, ¿por qué la mesa sale de un catálogo?" se autoselecciona.

**Anuncios:** los 10 (5 conceptos × 2 ejecuciones). Todos en el mismo conjunto, dejando
que Meta reparta. Ver `03-creatividades-y-copys.md`.

### CAMPAÑA 02 — Retargeting
```
Objetivo:        Ventas (Sales)
Optimización:    Conversión → Lead
Presupuesto:     8 €/día  (27 %)
Activación:      Semana 4 (antes no hay audiencia suficiente)
```

**Conjunto único: `RTG | Web + Social 180d`** — audiencias combinadas en OR:

- Visitantes del sitio, 180 días
- Visitantes que llegaron al cuestionario y no lo terminaron, 90 días ← *la más caliente*
- Interacción con Instagram, 365 días
- Interacción con Facebook, 365 días
- Reproducción de vídeo ≥ 50 %, 365 días
- Lista de clientes (leads del CRM sin cerrar) subida y actualizada mensualmente

Exclusiones: conversores 90 d.

**Anuncios (3):**
1. **Prueba social** — reseñas reales de Google sobre foto de pieza terminada
2. **Taller** — el proceso, las manos, el material (concepto 04)
3. **Rescate de abandono** — "Empezaste a contarnos tu espacio. ¿Seguimos?" ← solo para el
   segmento del cuestionario abandonado, si el volumen permite separarlo

> ⚠️ **Riesgo a vigilar:** con 8 €/día sobre una audiencia pequeña, la frecuencia se
> dispara. Regla: si `frecuencia > 3,5` en 7 días, bajar a 5 €/día o ampliar la ventana
> a 365 días. Quemar a tu propia audiencia caliente es el error más caro del retargeting
> con presupuesto bajo.

## 4. Lo que NO hacemos en fase 1 (y por qué)

| Descartado | Motivo |
|---|---|
| Campaña de tráfico | Optimiza a clics baratos, no a personas que dejan datos. Malgasta presupuesto. |
| Campaña de interacción / seguidores | No es el objetivo. El orgánico se trabaja aparte, sin pago. |
| Formularios instantáneos (Instant Forms) | Bajan el CPL a la mitad, pero la calidad se desploma y el cuestionario de 6 pasos —que es el activo de cualificación— se pierde. **Reevaluable en mes 3** si el CPL de landing no baja de 15 €. |
| Campañas separadas por concepto creativo | Fragmenta la señal. Meta ya reparte dentro del conjunto. |
| Advantage+ Shopping | Requiere catálogo y venta online. No aplica. |
| Públicos similares (Lookalike) | Necesitan ≥ 100 conversiones de origen. **Disponible a partir del mes 3-4.** |
| B2B / interioristas | Otro mensaje, otro funnel. Fase 3. |

## 5. Reparto por escenario de presupuesto

| | 600 €/mes (20 €/día) | **900 €/mes (30 €/día)** | 1.000 €/mes (33 €/día) |
|---|---|---|---|
| Captación frío | 15 €/día (75 %) | **22 €/día (73 %)** | 24 €/día (73 %) |
| Retargeting | 5 €/día (25 %) | **8 €/día (27 %)** | 9 €/día (27 %) |
| Creatividades activas | 6 | **10** | 10 |
| Leads guía/mes esperados | 45-70 | **70-110** | 80-120 |
| Leads cualificados/mes | 12-20 | **20-30** | 22-34 |
| Presupuestos enviados/mes | 3-5 | **4-8** | 5-9 |
| Ventas/mes esperadas | 0-1 | **1-2** | 1-3 |

**A 600 €/mes el plan es viable pero frágil**: la fase de aprendizaje se alarga a 3-4
semanas y hay meses con cero ventas atribuidas. Si el cliente solo puede 600 €,
recomendamos comprometerse a **cuatro meses** en vez de tres, porque el mes 1 no dará
lectura fiable.

## 6. Reglas de optimización

Escritas de antemano para no optimizar por sensación.

### Semana 1-2 — No tocar nada
Ni una pausa, ni un cambio de presupuesto, ni una edición de copy. Cada edición reinicia
el aprendizaje. Es la regla más incumplida y la más cara.

**Única excepción:** apagar un anuncio con >3.000 impresiones y **0** clics de enlace
(indica un problema técnico, no de rendimiento).

### Semana 3 — Primera poda
| Condición | Acción |
|---|---|
| CTR enlace < 0,6 % con > 2.000 impresiones | Apagar |
| CPL > 2× objetivo con > 30 € gastados | Apagar |
| CPL < objetivo y frecuencia < 2 | Mantener y no tocar |
| Todo el conjunto por debajo de objetivo | **No apagar la campaña.** Revisar landing primero: si el CTR es bueno y la conversión mala, el problema es la landing, no Meta |

### Semana 4 en adelante — Ritmo de escalado
- Escalar **máximo +20 % cada 3-4 días**. Subidas mayores reinician el aprendizaje.
- Bajar es igual de peligroso: bajar más de un 20 % también reinicia.
- Regla de creatividad: **1 anuncio nuevo por semana**, sustituyendo al peor. La fatiga
  creativa en audiencias pequeñas aparece a las 3-4 semanas.

### Señales de fatiga creativa
| Señal | Interpretación |
|---|---|
| Frecuencia > 3 y CTR bajando | Fatiga. Renovar creatividad |
| CPM subiendo con CTR estable | Competencia/estacionalidad, no fatiga. Aguantar |
| CTR alto pero CPL alto | Problema de landing o de promesa. El anuncio promete algo que la página no cumple |
| CPL bueno pero leads no cualificados | Promesa demasiado ancha. Endurecer el copy (mencionar "a medida", "proyecto") |

## 7. Estacionalidad catalana

| Periodo | Comportamiento esperado | Acción |
|---|---|---|
| Enero-marzo | **Alta.** Propósitos, reformas post-navidad, ferias de decoración | Escalar |
| Abril-junio | **Alta.** Reformas para tener la casa lista en verano | Escalar |
| Julio | Media-baja. Empieza el éxodo | Mantener |
| **Agosto** | **Muy baja.** Cataluña cierra. El CPM baja pero la conversión también | **Reducir a 10 €/día** o pausar y acumular presupuesto |
| Septiembre-noviembre | **Alta.** La "vuelta al cole" de la casa | Escalar. Mejor trimestre |
| Diciembre | Baja para ticket alto (el gasto va a regalos), pero **sube el interés** | Mantener bajo y capturar para enero |

## 8. Nomenclatura

Obligatoria desde el minuto uno; sin ella el informe mensual es imposible.

```
Campaña:   AB113 | [FRIO|RTG] | [Objetivo] | [AAAA-MM]
           AB113 | FRIO | Lead | 2026-09

Conjunto:  [Geo] | [Publico] | [Optimizacion]
           CAT80 | Amplio | Lead

Anuncio:   [ID] | [Concepto] | [Formato] | [Version]
           1A | AntiCatalogo | 4x5 | v1
```

UTMs en todos los enlaces — plantilla en `04-medicion-y-tracking.md` §5.

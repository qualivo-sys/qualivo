# Lead Scoring — Eleva Nails (modelo + workflow para montar en GHL)

> Objetivo: que el comercial hable **primero con quien está listo**. Cada contacto acumula puntos
> según lo que hace; al superar umbrales cambia de nivel (frío → templado → **caliente**) y, si se
> pone caliente, salta aviso al equipo.
>
> Etiquetas ya creadas en GHL: `lead-frio`, `lead-templado`, `lead-caliente`.
> La **lógica de puntos se monta en el editor de Workflows de GHL** (la API no crea esa automatización).

## 1) Campo de puntuación
Crear un **custom field numérico** en el contacto: `Lead Score` (número, por defecto 0).
(GHL → Settings → Custom Fields → Contact → Number → "Lead Score".)

## 2) Tabla de puntos (señales → puntos)

| Acción del contacto | Puntos |
|---|---|
| Entra como lead (usa una calculadora/test) | +10 |
| Origen **Landing** (mejor calidad, convierte 4,5×) | +10 |
| Abre un email de la secuencia | +5 (máx. 20) |
| **Clic en el CTA "Agendar reunión"** | +20 |
| Visita página de precios / curso | +15 |
| **Agenda una cita** (calendario) | +30 |
| Responde por email o WhatsApp | +15 |
| Origen formulario instantáneo (peor calidad) | +0 |
| — Rebote/baja de email | −10 |
| — Inactividad 14 días | −10 |
| — Marcado "No cualificada" | −50 (pasa a frío y sale de secuencias) |

## 3) Umbrales → nivel (etiqueta)

| Score | Nivel | Etiqueta | Acción |
|---|---|---|---|
| 0–24 | Frío | `lead-frio` | Sigue en nurturing/contenido |
| 25–49 | Templado | `lead-templado` | Nurturing activo + vigilar |
| **50+** | **Caliente** | `lead-caliente` | **Aviso al comercial + handoff inmediato** |

## 4) Workflow a montar en GHL (mapa)

**WF · Lead Scoring**
- **Triggers** (uno por señal, todos en el mismo workflow o en varios que sumen al mismo campo):
  - Form/lead magnet enviado → `Lead Score += 10` (y +10 si source contiene "Landing").
  - Email abierto → `+5` (con tope).
  - Clic en enlace de email (CTA) → `+20`.
  - Cita agendada (trigger de calendario) → `+30`.
  - Respuesta recibida (Customer Replied) → `+15`.
  - Página de precios vista (si hay trigger de tracking) → `+15`.
- **Acción común tras cada suma:** recalcular nivel con condiciones If/Else sobre `Lead Score`:
  - `>=50` → quitar `lead-frio`/`lead-templado`, poner `lead-caliente`, **notificar al comercial**
    (email/SMS interno o tarea) y mover la oportunidad a "Llamada agendada"/prioridad.
  - `25–49` → poner `lead-templado`.
  - `<25` → `lead-frio`.
- **WF · Decaimiento (diario):** si sin actividad 14 días → `−10` y recalcular nivel.
- **Salida:** si `No cualificada` → `−50`, quitar de secuencias de nurturing.

## 5) Enganche con lo ya montado
- Los **9 emails** ya tienen el CTA a **agendar reunión** → el clic y la cita son las señales de más
  peso (suman +20 y +30), así que el que agenda se vuelve caliente casi solo.
- El **panel** ya distingue por fuente; cuando el scoring esté vivo, el comercial filtra por
  `lead-caliente` y llama primero a esos.

## 6) Qué falta (paso humano)
Montar el workflow anterior en **GHL → Automation → Workflows** (≈20-30 min) y crear el custom field
`Lead Score`. Todo lo demás (etiquetas, emails, CTA, fuentes) ya está listo.

---
*Qualivo — Eleva Nails. La automatización de scoring se construye en el editor de workflows de GHL.*

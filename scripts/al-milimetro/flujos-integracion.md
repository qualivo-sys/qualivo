# Al Milímetro · cómo enchufar `api/_am-flujos.js`

Hecho por Automatización el 29-oct-2026 para el agente de Al Milímetro.
Sistema propio: base de datos de qualivo.io, Resend y wa.me; GHL ya no se usa.
Pruebas: `node scripts/al-milimetro/probar-flujos.js` (17 casos más el de `waEnlace`).

## Qué resuelve el módulo

Dado un lead y su historial, `plan(lead)` devuelve **todos los pasos pendientes con su
hora** y `debidos(lead, ahora)` devuelve **los que tocan ya**. Ahí dentro están el horario de
Sonia (lun-jue 9-19, vie 9-15, sin festivos nacionales), las esperas en días de
calendario de Madrid (el cambio de hora no mueve los mensajes), las paradas (contesta,
visita, presupuesto, cambio de etapa a mano, «más adelante», stop, ganado o perdido y
baja de emails), el recordatorio de la visita el último día de trabajo antes de la cita
y la recuperación del presupuesto (W9-W12 y la tarea de marcar perdido).
No toca la red: el que envía es el reloj.

## Dos tablas

```sql
create table am_leads (
  id           text primary key,           -- el que ya genera al-milimetro-lead.js
  creado       timestamptz not null,
  clase        text not null,              -- 'A' | 'B' | 'C'
  revision     boolean not null default false,
  nombre text, telefono text, email text,
  respuestas   jsonb not null,             -- tipo, cp, mun, m2, cuando, ppto, propia, inst, frase, utm
  cita         timestamptz,                -- visita técnica, si la hay
  prueba       boolean not null default false
);
create table am_eventos (
  lead_id  text references am_leads(id),
  tipo     text not null,   -- enviado | respondio | visita | visita_cancelada | presupuesto
                            -- | mas_adelante | etapa_manual | stop | ganado | perdido | baja
  clave    text,            -- para «enviado»: E1, W1… (y caducado: true en datos)
  en       timestamptz not null default now(),
  datos    jsonb
);
create index on am_eventos (lead_id);
```

El lead para el módulo es `{ ...am_leads, creado: ms, cita: ms, eventos: [{ tipo, clave, en: ms }] }`.

## El reloj (`/api/am-reloj`, Vercel Cron cada 10 min: `*/10 * * * *`)

```
para cada lead sin stop/ganado/perdido (y, mientras AM_SOLO_PRUEBA=1, solo prueba = true):
  para cada paso de debidos(lead):
    si paso.caducado → insertar evento enviado {clave, datos:{caducado:true}} y seguir
    E*      → Resend (remite de Sonia, con enlace de baja) → evento enviado
    W*      → tarea para Sonia: email (o su panel) con el texto ya relleno y el botón
              waEnlace(lead.telefono, texto); evento enviado al crear la tarea
    AVISO_A / LLAMAR_A → email a Sonia con la ficha → evento enviado
    PERDIDO → tarea para Sonia «márcalo como perdido con su motivo» → evento enviado
```

El evento se inserta **antes** de enviar (o en la misma transacción) para que dos
ejecuciones del cron no manden lo mismo dos veces.

## Lo que marca Sonia (enlaces firmados en sus emails o en su panel)

«Ha contestado» → `respondio` · «Visita el …» → `visita` + `cita` · «Presupuesto enviado» →
`presupuesto` · «Más adelante» → `mas_adelante` · «Parar» → `stop` · «Ganado» /
«Perdido» → `ganado` / `perdido`. Las respuestas al email de Resend (inbound) pueden
apuntar `respondio` solas.

## Cambios respecto a `mensajes.md`, por usar wa.me

1. **W2 desaparece.** Fuera de horario sale E1 al momento y W1 queda como tarea para la apertura siguiente. Sonia es quien envía, así que fuera de su horario no sale nada.
2. **Las plantillas de Meta ya no hacen falta** (no hay API), y tampoco los botones rápidos de W1, W6 y W8: las respuestas llegan como texto libre y Sonia marca lo que toque.
3. **La regla «nunca más de 2 WhatsApp seguidos sin respuesta» choca con el propio mapa:** W1, W5 y W6 son 3, y W9-W12 son 4. El módulo sigue el mapa. **Hay que decidir con Sonia** si se quita W6 o W11, o si la regla es «2 por semana».

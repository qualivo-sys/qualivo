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
-- Candado contra envíos dobles: un paso solo se reserva una vez por lead.
create unique index am_eventos_paso on am_eventos (lead_id, clave) where tipo = 'enviado';
```

El lead para el módulo es `{ ...am_leads, creado: ms, cita: ms, eventos: [{ tipo, clave, en: ms }] }`.

## El reloj, ya escrito

- **`api/al-milimetro-cron.js`:** Vercel Cron cada 10 minutos, ya añadido a `vercel.json`. Protegido con `CRON_SECRET`. Por cada paso que toca: E1-E4 van al lead por Resend, con enlace de baja firmado. W1-W12 van a Sonia como email con el texto ya escrito, el botón wa.me y los botones para marcar. AVISO_A, LLAMAR_A y PERDIDO van a Sonia como avisos. Cada paso se **reserva antes de enviarse** (índice único) y se suelta si Resend falla; lo atrasado más de 36 h se marca como caducado sin enviarse.
- **`api/al-milimetro-marca.js`:** los botones de Sonia (ha contestado, visita con fecha y hora, presupuesto enviado, más adelante, parar, ganado y perdido) y la baja de los leads. Los enlaces van firmados con HMAC sobre `CRON_SECRET`.
- **`api/_am-db.js`:** Postgres de Neon por HTTP, sin dependencias, porque el repo no tiene `package.json`. **Verificar el endpoint con la primera consulta real** (`AM_DB_HTTP` para cambiarlo).
- **`api/_am-textos.js`:** los textos de `mensajes.md`. W8 dice «el {día} a las {hora}», y no «mañana», porque con cita en lunes se envía el viernes.
- **Pruebas:** `node scripts/al-milimetro/probar-cron.js` (8 casos) y `node scripts/al-milimetro/probar-flujos.js` (17 casos).

**Seguro por defecto:** mientras `AM_SOLO_PRUEBA` no valga `0`, solo se tocan los leads con `prueba = true`, y `AM_SONIA_EMAIL` debe apuntar a un email interno. Nada de deploy hasta después de la reunión con Sonia (Chief of Staff, 29-oct).

**Variables:** `CRON_SECRET`, `AM_DATABASE_URL`, `RESEND_API_KEY`, `AM_FROM` (dominio de Sonia verificado en Resend), `AM_SONIA_EMAIL`, y opcionales `AM_REPLY_TO`, `AM_AVISOS_FROM`, `AM_WHATSAPP_NEGOCIO`, `AM_PAUSA` y `AM_DB_HTTP`.

**Lo que falta de tu lado:** que `api/al-milimetro-lead.js` inserte en `am_leads` (con `prueba = true` para «PRUEBA QUALIVO»). Desde ese momento, el reloj lo recoge solo.

**Límite conocido:** si la visita cambia de fecha, Sonia vuelve a pulsar «Ha reservado visita» y se actualiza la cita, pero W7 y W8 ya se habían enviado y no se repiten. Para la v2.

## Lo que marca Sonia (enlaces firmados en sus emails o en su panel)

«Ha contestado» → `respondio` · «Visita el …» → `visita` + `cita` · «Presupuesto enviado» →
`presupuesto` · «Más adelante» → `mas_adelante` · «Parar» → `stop` · «Ganado» /
«Perdido» → `ganado` / `perdido`. Las respuestas al email de Resend (inbound) pueden
apuntar `respondio` solas.

## Cambios respecto a `mensajes.md`, por usar wa.me

1. **W2 desaparece.** Fuera de horario sale E1 al momento y W1 queda como tarea para la apertura siguiente. Sonia es quien envía, así que fuera de su horario no sale nada.
2. **Las plantillas de Meta ya no hacen falta** (no hay API), y tampoco los botones rápidos de W1, W6 y W8: las respuestas llegan como texto libre y Sonia marca lo que toque.
3. **La regla «nunca más de 2 WhatsApp seguidos sin respuesta» choca con el propio mapa:** W1, W5 y W6 son 3, y W9-W12 son 4. El módulo sigue el mapa. **Hay que decidir con Sonia** si se quita W6 o W11, o si la regla es «2 por semana».

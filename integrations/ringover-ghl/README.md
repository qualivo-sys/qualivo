# Ringover → GHL · Registro de llamadas (Nuria Roure)

Los agentes **llaman desde Ringover** (app móvil / web / escritorio, con número español como
identificador) y **cada llamada queda registrada como nota en la ficha del contacto en
GoHighLevel** (dirección, agente, nº del lead, duración, fecha, estado y enlace a grabación).

> Alcance actual: **solo registro de llamadas**. Sin transcripción/IA (Fase 2). No requiere
> subir de plan ni el add-on Empower.

## Enfoque: POLLING (no webhooks)

El workflow consulta la API de Ringover cada 5 min y registra las llamadas nuevas. Es
compatible con el plan **SMART** (API + grabación básica incluidas) y no requiere configurar
webhooks en Ringover.

```
Schedule (cada 5 min)
  → POST https://public-api.ringover.com/v2/calls   (últimos 15 min)
  → IF call_list_count > 0
  → Split call_list
  → Normalizar + DEDUP (Code)         ← mapea campos y evita notas duplicadas
  → GHL: Buscar contacto por teléfono (E.164 con +)
  → IF contacto encontrado
  → GHL: Crear nota con los datos de la llamada
```

- **n8n Cloud**: `https://qualivo.app.n8n.cloud`
- **Workflow**: `Nuria - Ringover -> GHL · Registro de llamadas` (ID `1pBaY5gfx7b8Sqmb`)
- **GHL Location**: `NqtT9FXlZmVKuyA4HDbV` (subcuenta de Nuria, ~104k contactos)

Este JSON (`n8n-ringover-to-ghl-call-logging.json`) es la copia versionada **sin secretos**
(placeholders `<RINGOVER_API_KEY>` y `<GHL_PRIVATE_TOKEN>`). El workflow desplegado en n8n
tiene los valores reales en las cabeceras de los nodos HTTP.

## Estado

- [x] APIs validadas: Ringover (`/v2/users`, `/v2/calls`), GHL (token + location), n8n.
- [x] Workflow corregido y desplegado en n8n — **INACTIVO** (a la espera de validación).
- [ ] Llamada de prueba → confirmar que la nota cae en la ficha del contacto.
- [ ] **Activar** el workflow.
- [ ] Provisionar agentes en Ringover (Ferran, Alba, Raquel, Eva). Hoy solo Maikel.
- [ ] Mover secretos a credenciales de n8n y **rotar** la API key de Anthropic expuesta.

## Bugs corregidos respecto a la versión anterior

Verificados contra la API real de Ringover:

| # | Antes (roto) | Ahora |
|---|---|---|
| 1 | Fechas con espacio → la API devolvía **400** (nunca llegaba a GHL) | RFC 3339 (`toISOString()`) |
| 2 | Parámetros `from_date/to_date` | `start_date/end_date` |
| 3 | `direction` comparado con `'INBOUND'` (Ringover usa `in`/`out`) | `in`/`out`, nº del lead correcto entrante/saliente |
| 4 | Duración leía `duration` (no existe) → siempre 0 | `total_duration` / `incall_duration` |
| 5 | Grabación leía `record_url` (no existe) | `record` |
| 6 | Teléfono sin `+` → GHL no encontraba el contacto | normaliza a **E.164 con `+`** |
| 7 | Resumen IA sobre transcripción inexistente (gastaba Claude) | nodo de IA **eliminado** (Fase 2) |
| 8 | Ventana 10 min cada 5 min → notas duplicadas | **dedup** por `call_id` (static data) |

## Esquema real de Ringover `/v2/calls` (referencia)

`call_id, direction (in/out), from_number, to_number, total_duration, incall_duration,
record, start_time, is_answered, missed, voicemail, last_state, user.concat_name`.
**No incluye transcripción** (eso es Empower / Fase 2).

## Fase 2 (futuro, opcional) — Transcripción
Sin Empower (caro): n8n descarga la grabación (`record`) → Whisper/Deepgram → resumen con un
LLM → se añade a la nota. ~20-30 €/mes a volumen alto. No incluido en esta fase.

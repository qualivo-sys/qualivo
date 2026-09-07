# n8n · Los 3 workflows del agente de llamadas

Montaje en el n8n existente (~30 min). Credencial GHL: la que ya está
configurada en n8n. Credencial Vapi: header `Authorization: Bearer <VAPI_KEY>`.

---

## WF1 · LANZADOR (recibe la cola y dispara las llamadas)

1. **Webhook** — POST `/agente-llamadas/lanzador`. Recibe `{fecha, leads:[...]}`.
   (Su URL se pasa a `cola_llamadas.py` como segundo argumento.)
2. **IF horario** — `{{ $now.hour >= 10 && $now.hour < 18 && $now.weekday <= 5 }}`.
   Si no, nodo **Wait** hasta las 10:00 del siguiente laborable.
3. **Split In Batches** — tamaño 1, con **Wait 3-5 min** entre llamadas (no
   disparar 8 llamadas a la vez).
4. **HTTP Request → Vapi**:
   ```
   POST https://api.vapi.ai/call
   {
     "phoneNumberId": "<ID del numero +34 en Vapi>",
     "customer": { "number": "{{ $json.telefono }}" },
     "assistantId": "<ID del assistant con guion.md>",
     "assistantOverrides": {
       "variableValues": {
         "nombre": "{{ $json.nombre }}",
         "empresa": "{{ $json.empresa }}",
         "cargo": "{{ $json.cargo || 'responsable' }}",
         "vertical": "{{ $json.vertical }}",
         "email_que_abrio": "{{ $json.email_que_abrio }}",
         "n_aperturas": "{{ $json.n_aperturas }}",
         "dato_concreto": "{{ $json.dato_concreto }}",
         "dato_corto": "{{ $json.dato_corto }}",
         "dias_ofrecidos": "{{ $json.dias_ofrecidos }}",
         "email": "{{ $json.email }}"
       },
       "metadata": { "email": "{{ $json.email }}", "campana": "{{ $json.campana_id }}" }
     }
   }
   ```
5. Antes del paso 4, **HTTP Request → GHL** (free slots del calendario
   llamada-hackthelead, próximos 4 días laborables) y construir
   `dias_ofrecidos` = "martes a las 10 y media o jueves a las 4" (texto, no
   lista). Así el agente solo ofrece huecos reales.

## WF2 · AGENDA (tool que el agente usa EN VIVO durante la llamada)

1. **Webhook** — POST `/agente-llamadas/agendar`. En Vapi se registra como
   custom tool `agendar` con parámetros `{slot_elegido, email_confirmado}`;
   Vapi manda además el `metadata.email` del lead.
2. **HTTP Request → GHL**: crear appointment en el calendario
   llamada-hackthelead para ese contacto (buscar contacto por email; si no
   existe, crearlo). GHL envía la invitación por email automáticamente.
3. **Respond to Webhook** — `{ "result": "confirmado {{slot}}" }`. El agente
   lo lee en voz alta en la misma llamada.

## WF3 · RESULTADOS (al colgar)

1. **Webhook** — POST `/agente-llamadas/resultados`. En Vapi: Server URL del
   assistant, evento `end-of-call-report` (trae resumen, transcripción,
   grabación y `metadata.email`).
2. **Switch** por resultado (el resumen de Vapi trae `analysis.successEvaluation`
   o parsear el summary):
   - **Reunión agendada** → GHL: mover a etapa "Reunión agendada" (pipeline
     Prospección) + nota con resumen y link a grabación.
   - **Volver a llamar** → nodo Wait/Schedule hasta la fecha dicha → reinyectar
     el lead en WF1.
   - **No interesa** → GHL: cerrado-perdido + nota. Añadir email a un Data
     Store "supresion_llamadas" (cola_llamadas.py ya no lo reencola: guarda
     historial propio, doble red).
   - **No contesta / buzón** → si intentos < 2, reprogramar para el día
     siguiente a otra hora; si no, marcar agotado.
3. **Mensaje a Maikel** (Slack/Telegram/email, el canal que ya use en n8n):
   parte del día — llamadas hechas, conversaciones, reuniones agendadas, y
   links a las 2-3 grabaciones que valga la pena oír.

## Configuración del assistant en Vapi (resumen)

- System prompt: `guion.md` tal cual (con las {variables}).
- Voz: ElevenLabs → multilingual v2 → voz masculina es-ES (probar 2-3 y que
  Maikel elija con los oídos, no con el nombre).
- Transcriber: Deepgram nova-2, idioma `es`.
- firstMessage: la apertura del guion.
- Tool `agendar` → WF2. Server URL → WF3. `silenceTimeoutSeconds`: 10.
  `maxDurationSeconds`: 300 (si una llamada pasa de 5 min, algo va mal).
- Grabación: ON (revisión de calidad del piloto).

## Día 1 del piloto

3 llamadas con Maikel escuchando las grabaciones antes de soltar el resto.
Ajustar guion → segunda tanda. KPI en `diseno.md`.

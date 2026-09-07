# Agente de llamadas · Diseño (7-sep-2026)

Objetivo: convertir señales calientes del email (3-5 aperturas o clic) en
reuniones agendadas en el calendario de Maikel, con una llamada en castellano
nativo, contexto completo por lead y registro automático en GHL.

Regla de reparto acordada: el agente llama al SEGUNDO escalón (3-5 aperturas).
Los leads de 8+ aperturas (A-House, Nexitum...) los llama Maikel en persona.

## Stack elegido

| Pieza | Elección | Por qué |
|---|---|---|
| Plataforma de voz | **Vapi** (plan B: Retell) | `assistantOverrides.variableValues` permite inyectar el briefing entero por llamada; custom tools que llaman webhooks de n8n en mitad de la conversación (para agendar en vivo); webhook de fin de llamada con transcripción |
| Voz | ElevenLabs multilingual v2, voz masculina es-ES | La naturalidad en castellano es la variable nº 1 de conversión |
| Modelo | GPT-4o o Claude en Vapi | latencia <800ms, imprescindible para que no suene a robot |
| Teléfono | Número español (+34) comprado en Vapi/Twilio | un fijo de Madrid/Barcelona convierte más que un móvil raro |
| Orquestación | **n8n** (ya en el stack, ya conectado a GHL) | todo el sync GHL vive en n8n: no dependemos de las claves de GHL perdidas en esta sesión |
| Contexto | `cola_llamadas.py` (esta carpeta) | genera el briefing JSON por lead desde Smartlead + probe + historial |

## Flujo completo

```
[Esta sesión, cada mañana 9:00]
cola_llamadas.py → briefings JSON → POST al webhook de n8n "lanzador"

[n8n · workflow LANZADOR]
Webhook → filtro horario (lab. 10-18h) → por cada lead:
  POST https://api.vapi.ai/call
    { phoneNumberId, customer:{number},
      assistantId, assistantOverrides:{ variableValues: {briefing} } }

[Vapi · durante la llamada]
Tool "agendar" → webhook n8n "agenda" → n8n consulta huecos del calendario
GHL (llamada-hackthelead), crea la cita y devuelve "martes 10:30 confirmado"
→ el agente lo dice en la misma llamada. Invitación por email automática (GHL).

[Vapi · al colgar]
end-of-call-report → webhook n8n "resultados" →
  - GHL: nota con resumen + transcripción en el contacto
  - GHL: si reunión → etapa "Reunión agendada"; si "no" → etapa cerrado-perdido
  - si "llámame el jueves" → n8n reencola con fecha
  - Google Sheet / mensaje a Maikel con el parte del día
```

## Variables del briefing (lo que hace nativa la llamada)

`nombre`, `empresa`, `cargo`, `telefono`, `vertical`, `campana`,
`email_que_abrio` (asunto), `n_aperturas`, `dato_concreto` (la fuga del probe o
las líneas de servicio: "el formulario de vuestra web no dispara ninguna
medición"), `objetivo` (agendar 15 min), `dias_ofrecidos` (según huecos reales).

## Reglas duras

1. Solo teléfonos publicados en la web de la empresa (B2B, interés legítimo).
   Nada de móviles scrapeados de fuentes personales.
2. Si preguntan si es una máquina: se dice que sí, asistente automático de
   Maikel (AI Act + reputación). Está en el guion.
3. Máximo 2 intentos por lead, laborables 10:00-18:00.
4. "No me interesa" → fin, se marca en GHL y entra en supresión. Nunca rebatir.
5. El agente NO habla de precios ni de servicios en detalle: agenda.
6. Piloto 2 semanas, ~5-8 llamadas/día. KPI: llamadas → conversaciones →
   reuniones agendadas → reuniones celebradas. Si tras 40-50 llamadas no hay
   2+ reuniones, se para y se revisa el guion.

## Coste estimado (pendiente de ok del cerebro · modo caja)

Vapi ~0,08-0,13 €/min todo incluido + ~5 €/mes el número. A 6 llamadas/día de
~2 min: **25-45 €/mes**. Sin permanencia.

## Qué falta para encender (por orden)

1. Ok del cerebro al gasto (avisado 7-sep).
2. Maikel: crear cuenta Vapi + comprar número +34 (10 min, necesita tarjeta).
3. Maikel: ok al guion (`guion.md`, esta carpeta).
4. Configurar en n8n los 3 webhooks (lanzador, agenda, resultados) según este
   documento; pegar la URL del lanzador en `cola_llamadas.py`.
5. Pegar en Vapi el guion como system prompt del assistant + tool "agendar".
6. Día 1 del piloto: 3 llamadas supervisadas (Maikel escucha las grabaciones
   antes de soltar el resto).

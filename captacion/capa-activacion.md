# Capa de activación de demanda (11-sep-2026)

Cada agente tiene un momento concreto de intervención. No hacen lo mismo.

```
        PAID / OUTBOUND / INSTAGRAM
                    ↓
                 LANDING
                    ↓
               RADIOGRAFÍA
                    ↓
                  LEAD
                    ↓
             ┌──────┴──────┐
             ↓             ↓
         WHATSAPP        EMAIL
             ↓             ↓
             └──────┬──────┘
                    ↓
             INTENCIÓN ALTA
                    ↓
                   VOZ
                    ↓
            DIAGNÓSTICO 15 MIN
                    ↓
                  PLAN
                    ↓
                 PILOTO
```

- **WhatsApp** entra con lead que ya interactuó o hizo Radiografía: pregunta,
  conversación, contexto, diagnóstico.
- **Voz** entra con lead más caliente: confirma contexto, detecta interés, agenda.

## Trigger de voz: se endurece

Hasta hoy Raquel se disparaba con "abrió 3-5 veces y no contestó". Eso no es
intención. Tres aperturas pueden ser revisión desde el móvil, seguridad corporativa
escaneando el enlace, varias personas del equipo abriendo o una previsualización.

A partir de ahora la apertura repetida es **una señal de posible intención**, no
permiso para llamar. Se llama cuando se cumple una de estas tres:

1. aperturas repetidas **+** señal fuerte verificada **+** interacción previa;
2. Radiografía completada **+** sin respuesta;
3. respuesta positiva o petición explícita de contacto.

## Los clones

| | Maestro (no tocar) | Clon de esta campaña |
|---|---|---|
| Voz | Qualivo SDR `fe2ed34d-82e9-4c6b-b351-8acf90d9dcce` | **Raquel · Diagnóstico Qualivo V1** `93bf34d5-88bf-4540-96bd-16e13632c4d5` |
| WhatsApp | — | Qualivo WhatsApp · Diagnóstico V1 (prompt en `agente-whatsapp/`) |

Comparten trunk SIP, credenciales, voz de ElevenLabs y el número para salientes.
No comparten prompt ni lógica de conversación.

## Lo que se arregló al clonar

El asistente maestro **no tenía ninguna herramienta**. El workflow de agenda
(`agente-llamadas-agendar`, n8n `7q7jDW4mNgLQ5FFY`) llevaba activo desde el principio
pero nunca estuvo conectado, así que Raquel no podía cerrar una cita aunque el lead
dijera que sí: solo podía decir una hora en voz alta y esperar a que alguien lo
apuntara a mano. El clon lleva la función `agendar_diagnostico` conectada a ese
webhook. Eso explica los 0 agendados con 12 conversaciones reales del 10-sep.

## Agenda

Calendario `zBlsw8BEKA2zah81YlOl`, ahora de **15 minutos** (antes 20) para que case
con el KPI. El slug sigue siendo `qualivo-20` a propósito: ese enlace ya viaja dentro
del email 3 de los leads cargados en el motor y cambiarlo los rompería.

# FASE 0 · C. ROUTINE INVENTORY

23 rutinas activas. Son el **scheduler real** de Qualivo: quien no está aquí, no se ejecuta solo.

## C.1 Rutinas por sesión propietaria

### Client acquisition strategy — 10 rutinas (43% del total)

| Cron | Rutina | Propósito |
|---|---|---|
| `30 5 * * 1-5` | Carga diaria de leads + mejora continua | Prospección Smartlead |
| `0 6 * * 1-5` | Agente SDR autónomo (informe 8:00) | Ronda SDR |
| `30 7 * * 1-5` | Triaje de respuestas | Clasificar y responder |
| `0 10 * * 1-5` | Guardián reenvíos Smartlead | Anti-duplicado de envíos |
| `30 15 * * 1-5` | Reporte diario de envíos (17:30) | Embudo multicanal |
| `0 7 * * 1` | Informe de los lunes | Marcador por campaña |
| POKE | Parte ronda 1 Raquel | Voz / Vapi |
| POKE | Check bundle Twilio v2 | Infra telefonía |
| POKE | Outbound · Documento Madre | ICP y mensajes |
| POKE | Timbre Cerebro → Outbound | Canal de entrada |

### Quipu billing dashboard (Cerebro) — 5 rutinas

| Cron | Rutina |
|---|---|
| `30 7 * * 1-5` | Daily 9:30 · Revisión de agentes |
| `0 7 * * 1` | Lunes · Weekly Plan automático |
| `0 13 * * 5` | Viernes · Weekly Review + CEO Brief |
| `0 6 1 * *` | Día 1 · Cierre financiero + alertas CFO |
| POKE | Timbre Outbound → Cerebro |

### Landing Qualivo.io — 4 rutinas

| Cron | Rutina |
|---|---|
| `15 5 * * 1-5` | Content machine diaria (blog + redes) |
| `0 4 * * *` | Radar IA diario |
| `0 6 * * 1` | Qualivo Growth Review semanal |
| POKE | Canal cerebro → Landing/Growth |

### Otras
Ventas: 1 poke (reactivación cartera) · Automatización: 1 poke (secuencia 3-7-14) · Sesión fresca: Inglés diario (personal), Dashboard REBT (cliente).

## C.2 SALUD REAL — el hallazgo principal

`last_run` de cada rutina con cron, a 10-sep-2026 (jueves):

| Ritmo | Rutinas | Última ejecución registrada | Veredicto |
|---|---|---|---|
| **Diario** | 10 | Todas 09 o 10-sep | ✅ **funciona** |
| **Semanal** | 4 | **ninguna, nunca** | ❌ **nunca ha corrido** |
| **Mensual** | 1 | ninguna | ❌ sin registro |

Rutinas semanales/mensuales sin ninguna ejecución registrada, creadas mucho antes de su día:

| Rutina | Cron | Creada | Días que debió correr |
|---|---|---|---|
| Qualivo · Informe de los lunes | `0 7 * * 1` | 10-ago | ~5 lunes |
| Qualivo Growth Review semanal | `0 6 * * 1` | 11-ago | ~5 lunes |
| Lunes · Weekly Plan automático | `0 7 * * 1` | 01-sep | 08-sep |
| Viernes · Weekly Review + CEO Brief | `0 13 * * 5` | 01-sep | 05-sep |
| Día 1 · Cierre financiero mensual | `0 6 1 * *` | 01-sep | 01-oct (aún no) |

**Evidencia:** las diarias registran `last_run` con el mismo mecanismo, así que la ausencia en las semanales no es un fallo de registro genérico.
**A VERIFICAR CON MAIKEL:** ¿recibiste el CEO Brief el viernes 5-sep? ¿el Weekly Plan el lunes 8-sep? Si la respuesta es no, está confirmado.

## C.3 Clasificación: ¿agente o workflow?

| Rutina | Debería ser | Motivo |
|---|---|---|
| Carga diaria de leads | **WORKFLOW** + revisión | Ejecuta un script fijo |
| Guardián reenvíos Smartlead | **WORKFLOW** | Determinista, ejecuta `guardia_reenvios.py` |
| Reporte diario de envíos | **WORKFLOW** | Ejecuta script y formatea |
| Dashboard REBT | **WORKFLOW** | Refresco de datos puro |
| Check bundle Twilio | **WORKFLOW** | curl + comparación |
| Radar IA diario | AGENT | Criterio editorial |
| Triaje de respuestas | AGENT | Interpreta intención |
| SDR autónomo | AGENT | Decide y redacta |
| Content machine | AGENT | Decide tema y ángulo |
| Daily / Weekly / Cierre financiero | AGENT (Cerebro) | Diagnóstico y prioridad |
| Timbres y canales | **EVENT BUS** | Ver protocolos |

**Agent inflation detectada:** 5 de 23 rutinas gastan un modelo de razonamiento en trabajo determinista.

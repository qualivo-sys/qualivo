# Lead scoring v2 · comportamiento + tipología (propuesta, datos reales 22-sep-2026)

Muestra: 1.414 leads con trato · 23 matrículas. Tasas de matrícula por señal (dirección, no verdad absoluta: 23 ventas es poco).

| Señal | Valores | Matrícula % | Peso propuesto |
|---|---|---|---|
| Fuente | Meta · Landing / Facebook instantáneo / Google | 2,4 % / 0,5 % / 0 % | +20 / +5 / 0 |
| ¿Cuándo empezar? | Cuanto antes / 1-3 meses / Solo me informo | 2,1 % / 1,4 % / 1,3 % | +20 / +10 / 0 |
| ¿Inversión? | Financiación a plazos / Presupuesto ajustado / Sin problema / Gratuito | 1,8 % / 1,4 % / 0,6 % / 2,0 % | +15 / +10 / +10 / −10 |
| Calligence agendó (`calligence: éxito`) | sí / no | 2,3 % (entrevista 11,6 %) / 1,5 % | +25 |
| Responde WhatsApp (`respondio-wa`) | sí | — | +15 |
| No responde (`no-responde`) / 5 intentos | sí | 0 % | −30 |
| Email abierto / clic (tags `email-abierto` / `email-click`, a crear con workflow) | sí | — | +5 / +15 |
| Entrevista realizada | sí | 40+ % | +30 |
| Antigüedad sin actividad > 14 días | sí | — | −15 |

Umbrales: **caliente ≥ 60** (`lead-caliente`) · **templado 30-59** (`lead-templado`) · **frío < 30** (`lead-frio`).
Salida: campo personalizado `Lead score` (número) + etiqueta de temperatura; el motor de Netlify recalcula cada 5 min.
Aviso al comercial: workflow GHL *etiqueta `lead-caliente` añadida → notificación interna + tarea "Llamar hoy"*.
Señales de email: workflow GHL *Email opened → tag `email-abierto`* y *Email link clicked → tag `email-click`*.

# Rellamadas pendientes · cola manual

Esta cola la revisa el triaje diario (cron 07:30 UTC) y la carga diaria.
Si un trigger de rellamada no dispara, este fichero es la red de seguridad.

| Fecha objetivo | Hora (Madrid) | Quién | Teléfono | Contacto GHL | Estado |
|---|---|---|---|---|---|
| 2026-09-15 | 10:30 | Matti · Gold-Bricks | +34655757241 | HKFJtVZl1JH3kycOEO7g | pendiente · trigger trig_01Scy4SH5xC4nLh3wsxfjWGA |
| 2026-09-15 | 11:15 | Antonio · Alfainmo | (ver ficha GHL) | — | pendiente |
| — | — | Christian · RealEstate CJP | — | — | solo email (2 toques de teléfono ya gastados) |

## Incidente 11-sep (diagnóstico corregido)

El callback de Matti de las 11:00 del viernes 11-sep no salió a su hora. Primera
lectura: "el trigger no disparó". **Falso.** El trigger
`trig_01AZ7XhrPEn1mwBHgB2vPTHa` disparó puntual a las 09:00:25Z; lo que falló fue
la **entrega del aviso a la sesión**, que llegó con unas 3 horas de retraso. El
trigger desaparece del listado porque los disparos de una sola vez se ocultan
una vez ejecutados.

Consecuencia práctica: programar la llamada no basta. Un aviso puede llegar tarde
si la sesión está ocupada, y una llamada a destiempo es peor que no llamar. Por eso
existe esta cola: cualquier rutina que se despierte (triaje 07:30 UTC, carga diaria
05:30 UTC) mira este fichero y ve lo que toca hoy, sin depender de que el aviso
concreto llegue a su hora.

Recuperación manual a las 12:15 → buzón de voz (`silence-timed-out`). Registrado
en la ficha del contacto junto con esta corrección.

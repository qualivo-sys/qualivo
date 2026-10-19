# 4 · LinkedIn · informe de auditoría

Entregado como página hija en Notion el 19-oct:
https://app.notion.com/p/3fe56e1ad6ed81d19d07dfd57a1d3314

Periodo: **19-sep a 19-oct** (30 días), comparativa con los 60 anteriores (21-jul a 18-sep).
Fuente de toda la actividad: **API de HeyReach**, consultada el 19-oct a las 11:50 UTC.
Fase de solo lectura: no se ha lanzado, cambiado ni reanudado nada. Sin datos de contacto.

---

## 1 · El canal lleva 18 días a cero, y es deliberado

El Growth Review vio 0 actividad en HeyReach. **Es correcto.** Con fechas:

| Fecha | Qué pasó |
|---|---|
| 1-oct | Último día saliente: 18 invitaciones, 13 conversaciones |
| 1-oct | Un prospecto desmiente por escrito una afirmación del mensaje (el copy daba por hecho inversión en anuncios a partir de un píxel instalado) |
| ~1-oct | La campaña activa queda PAUSED |
| 2-oct | Se confirma la parada: no reanudar hasta corregir el copy |
| 2→19-oct | **0 invitaciones, 0 mensajes, 0 visitas de perfil** |

No fue abandono. Fue una parada tras detectar que el mensaje afirmaba hechos no verificados.

### Cuentas conectadas: hay un problema hoy

`get_all_linked_in_accounts` devuelve **`totalCount: 0`**. Comprobado dos veces. El 2-oct
devolvía 1. Pero los registros de conversación siguen mostrando la cuenta con
`authIsValid: true` y sin cooldowns. **Los dos endpoints se contradicen.**

- Confirmado: el endpoint de cuentas devuelve 0.
- Hipótesis sin demostrar: asiento liberado o cambio de plan. Alternativa: fallo del endpoint.
- **Si el asiento está liberado, no se puede enviar aunque se apruebe el plan.**

### Coste mensual

**NO DISPONIBLE.** La API no expone facturación. Hace falta de Finanzas o Maikel. Sin eso
no hay CAC ni coste por conversación.

---

## 2 · Embudo, sin mezclar etapas · últimos 30 días

| Etapa | Cifra |
|---|---|
| Invitaciones enviadas | 187 |
| Aceptadas | 99 · 52,9 % |
| Conversaciones iniciadas | 83 |
| Mensajes enviados | 40 |
| Respuestas | 4 · 4,8 % |
| **Respuestas positivas** | **1** |
| Reuniones reservadas / celebradas | **0 / 0** |
| Propuestas / clientes | **0 / 0** |
| Visitas de perfil | 295 |
| Likes / follows de la cuenta | 0 / 0 |

Las 4 respuestas, leídas una a una: 1 positiva, 1 corrección del prospecto, 1 derivación
("no lo llevo yo") y 1 emoji. **Tres de cuatro no son conversación comercial.**

### Comparativa

| | 21-jul→18-sep | 19-sep→19-oct |
|---|---|---|
| Invitaciones | 299 | 187 |
| Aceptación | 31,8 % | **52,9 %** |
| Conversaciones | 81 | 83 |
| Respuestas | **18 · 22,2 %** | 4 · 4,8 % |
| Reuniones / propuestas / clientes | 0/0/0 | 0/0/0 |

La aceptación sube del 32 % al 53 % y la respuesta cae del 22 % al 4,8 %.

**Matiz para no leerlo al revés:** buena parte de aquellas 18 respuestas eran rechazos
explícitos o cortesías. Más respuestas no fue más negocio: los dos periodos acaban en 0.

### Acumulado 90 días

**486 invitaciones · 194 aceptadas · 164 conversaciones · 22 respuestas · 0 reuniones ·
0 propuestas · 0 clientes.** LinkedIn no ha generado ingresos en 90 días.

### Calidad del dato

Los contadores diarios registran 4 respuestas; en los hilos encuentro 3, más 2 emojis que
no aparecen en los contadores. Hipótesis: HeyReach no cuenta reacciones como respuesta.

---

## 3 · Contenido orgánico de Maikel

**NO TENGO DATOS.** Lo único medible: la cuenta hizo **0 likes y 0 follows en 90 días**.
No hay calentamiento antes de invitar, solo visita de perfil. Se le pedirá captura.

---

## 4 · Potencial con lo que ya se paga

Hoy el potencial es **0** mientras el endpoint devuelva 0 cuentas.

| | Dato | Tipo |
|---|---|---|
| Límite configurado | **18/día** | confirmado |
| Máximo configurable | 40/día | confirmado |
| Ritmo real sostenido | 18–24/día, 10 días hábiles, sin cooldowns | confirmado |
| Techo semanal recomendado | ~90/semana | **estimación** |

A qué lista, por orden de coste:
1. **84 ya aceptadas** (coste de invitación cero). Triadas: **26 merecen mensaje**, 36 nunca debieron entrar.
2. **262 pendientes** de la campaña pausada. Requiere subir antes el copy corregido.
3. Lista nueva por señal de vacante comercial. Sin construir.

---

## 5 · Riesgos

| Riesgo | Tipo |
|---|---|
| **Cuenta no conectada** | síntoma confirmado |
| **Un solo perfil emisor** (el personal de Maikel) | confirmado |
| **Dependencia de Maikel**: emisor, respondedor y aprobador | confirmado |
| **Credibilidad del mensaje**: un prospecto ya desmintió una afirmación | confirmado, ya ocurrido |
| **Cruce con cold email**: una empresa recibió los dos canales sin saberlo | confirmado, ya ocurrido |
| Restricción por volumen | bajo · hipótesis |

---

## 6 · Tres cuellos de botella, por impacto

**6.1 · Una respuesta positiva lleva 16 días sin contestar.** El 3-oct un CEO de servicios
jurídicos respondió tres veces en un minuto ("lo miro y te digo", "pregunto a mi equipo").
Etiquetado Interested. Nadie le ha contestado. Es **el 100 % del pipeline que LinkedIn ha
producido en 90 días** y se está enfriando. Coste de arreglarlo: un mensaje.

**6.2 · El canal no puede enviar aunque se decida enviar.** Tres bloqueos encadenados:
cuenta no conectada, 262 leads con copy viejo congelado, y el cierre de la secuencia
apuntando a un caso de otro sector.

**6.3 · Nunca se ha probado el canal bien segmentado.** 36 de 84 cuentas de la primera
campaña estaban fuera de ICP; el 26 % de los destinatarios de la segunda tenía un cargo sin
relación con el recorrido comercial. **"LinkedIn no funciona" no está demostrado**, y
tampoco lo contrario.

---

## 7 · Hipótesis sin demostrar

1. Que filtrar por cargo suba la respuesta. Construido y validado contra datos pasados, **nunca probado en envío real**.
2. Que la señal de vacante comercial funcione mejor que la de tecnología. Nunca probada.
3. Que la caída 22 %→4,8 % sea por copy y cargo y no por poblaciones distintas. No separable hoy.
4. Que las 84 ya aceptadas respondan mejor. Lógico, sin medir.

---

## 8 · Recomendación · OPTIMIZAR CON TOPE BAJO, sin inversión nueva

No escalar: 0 reuniones y 0 clientes en 90 días no lo justifica.
No cerrar: el canal nunca se probó bien apuntado; cerrarlo sería concluir de un experimento
mal montado.

| # | Qué | Coste | Horas de Maikel |
|---|---|---|---|
| 1 | Contestar la respuesta positiva del 3-oct | 0 € | 15 min |
| 2 | Aclarar estado de la cuenta y si se sigue pagando | 0 € | 15 min |
| 3 | Subir copy corregido + trabajar las 26 ya aceptadas, máx. 10 invitaciones/día | 0 € | ~2 h |

**Criterio de corte a 4 semanas:** si con lista y copy corregidos no sale **≥1 reunión
celebrada**, se cierra LinkedIn como canal de captación. Sin prórrogas.

---

## 9 · Reparto en los tres escenarios

| | Conservador 500 € | Base 1.000 € | Crecimiento 1.500 € |
|---|---|---|---|
| Ya comprometido · HeyReach | cuota actual (**dato pendiente**) | ídem | ídem |
| **Inversión nueva** | **0 €** | **0 €** | ~80–100 €/mes (1 Sales Navigator, **precio estimado**) |
| Condición | — | — | Solo si el experimento da ≥1 reunión |

Con 0 clientes en 90 días, cualquier euro nuevo rinde más en un canal que ya convierte.
LinkedIn no necesita dinero: necesita tres decisiones y dos horas de Maikel.

**Caja:** si HeyReach se cobra y el canal lleva 18 días sin poder enviar, valorar congelar
la suscripción hasta aclarar el estado de la cuenta.

---

## 10 · Lo que necesito para cerrar

1. Cuota mensual de HeyReach y si sigue cobrándose.
2. Estado real de la cuenta en la interfaz de HeyReach y plan contratado.
3. Captura del LinkedIn orgánico de Maikel (30 días).
4. Confirmación de Ventas de que ninguna reunión del periodo vino de LinkedIn.

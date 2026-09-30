# Campañas por vertical · abiertas el 29-sep-2026

Orden de Maikel: "abre todas las campañas por vertical que puedas".
Siete campañas nuevas, creadas, configuradas y ACTIVE. **Todas con cero leads dentro.**

| Vertical | ID Smartlead | Estado |
|---|---|---|
| Clínica | 4042992 | ACTIVE |
| Formación | 4042994 | ACTIVE |
| Servicios B2B | 4042995 | ACTIVE |
| SaaS y Software | 4042996 | ACTIVE |
| Agencia de marketing | 4042998 | ACTIVE |
| Inmobiliaria | 4042999 | ACTIVE |
| Reformas y Construcción | 4043000 | ACTIVE |

## Configuración aplicada a las siete

- **Secuencia de 3 pasos**, idéntica a la de las campañas que funcionan:
  - Paso 1 (día 0): asunto `{{subject1}}`, cuerpo `{{body1}}{{signature}}`
  - Paso 2 (+3 días): sin asunto, responde en el hilo, `{{body2}}{{signature}}`
  - Paso 3 (+7 días): sin asunto, `{{body3}}{{signature}}`
- **15 buzones de Qualivo** adjuntos (goqualivo, gotqualivo, qualivoedge, novaqualivo).
  Los 11 de Scubalight quedan fuera: son de un cliente.
- **Horario**: L-V, 09:00-18:00 Europe/Madrid, 12 min entre correos, tope 60 leads nuevos/día.

## GUARDARRAÍL · leer antes de cargar nada

La secuencia **no lleva copy dentro**. El mensaje viaja en el lead, en los campos `subject1`,
`body1`, `body2` y `body3`. Así funcionan ya Clínicas y Formación, y es lo que permite que cada
correo abra con la señal verificada de esa empresa, como exige mensajes-v3.

**Consecuencia: un lead sin `subject1`/`body1` rellenos sale con el asunto en blanco.** La regla
de la rutina diaria ya lo dice y ahora es crítica: *sin señal verificada, el lead no entra.*

## Qué falta

Las siete están abiertas y vacías. Enviarán en cuanto entren leads con su señal escrita. El
cuello sigue siendo el mismo de siempre: **verificar**, no los buzones ni las campañas.

Capacidad disponible: 525 correos/día entre las 15 cuentas de Qualivo. Para evaluar una vertical
hacen falta 100 envíos en 7 días (regla de decisión del Brain), o sea unos 15/día por vertical.
Siete verticales son ~105/día: cabe de sobra. **El límite no es la capacidad de envío, es cuántos
leads se pueden verificar al día.**

# Outbound para clientes

Aquí vive lo que montamos **para terceros**, separado de la captación de Qualivo.
Un directorio por cliente.

## La regla que sostiene todo lo demás

**La infraestructura de envío no se comparte.** Los scripts sí, los datos y los
buzones no. Si el correo de un cliente sale desde un dominio de Qualivo, una
queja de spam suya se lleva por delante la reputación con la que captamos
nosotros, que es el activo que paga la empresa.

Concretamente, cada cliente necesita lo suyo:

| pieza | por qué no se comparte |
|---|---|
| Dominios y buzones | una queja contra su campaña quema los nuestros |
| Perfil de LinkedIn | no se invita desde el perfil de Maikel hablando de otro producto |
| Subcuenta de GHL | sus contactos no se mezclan con los nuestros |
| Cliente en Smartlead | `client_id` aísla campañas y buzones en la propia herramienta |
| Sesión del agente | el contexto es el sitio donde de verdad se mezclan las cosas |

Lo que sí se comparte, y es lo que hace barato el segundo cliente: los scripts de
`captacion/scripts/` (copy por puerta, detección de señales en web, extracción de
Google Maps, guardián de reenvíos, métricas, avisos) y la metodología de puertas.

## Y tampoco se usa su dominio corporativo real

Es la pregunta que hacen todos. La respuesta: si una campaña en frío se marca
como spam, se rompe el correo de facturación y de soporte de la empresa. Se
compran dominios parecidos, se usan para captar, y el dominio bueno se queda
limpio. Es lo que hacemos con el nuestro: `qualivo.io` no manda un solo correo
frío, salen de `novaqualivo`, `qualivoedge`, `goqualivo` y `gotqualivo`.

## El calentamiento manda en el calendario

Un buzón nuevo no puede mandar volumen. Los quince nuestros se crearon el
**6 de agosto** y llegaron al 100% de reputación y a 284 envíos diarios **seis
semanas después**. Las primeras dos semanas apenas mandaban nada.

Consecuencia práctica, y es la que se olvida al firmar: **los dominios se compran
el día que se firma el piloto**, antes incluso de tener el brief del cliente. El
reloj del calentamiento corre en paralelo a todo lo demás y no se acelera con
dinero.

Por eso el orden de arranque de un piloto de 30 días es:

1. **Días 1 a 14**: dominios comprados y calentando. El piloto arranca por
   LinkedIn y teléfono, que no necesitan calentamiento. Hay actividad y
   reuniones desde la primera semana.
2. **Día 15 en adelante**: entra el correo ya caliente y el motor va a tres
   canales.

Al revés, un piloto de 30 días enseña su primer resultado cuando ya se ha
acabado.

## Créditos de Apollo

Son una bolsa común de la cuenta de Qualivo. Lo que se gasta en un cliente se le
quita a nuestra propia captación. O se repercute en el precio del piloto, o se
tira de Google Maps y de las listas del propio cliente. Para software y B2B de
oficina, Apollo. Para oficios y negocio local, Maps: lo comprobamos el 17-sep,
donde Apollo daba portales y mayoristas mezclados, Maps daba empresas reales.

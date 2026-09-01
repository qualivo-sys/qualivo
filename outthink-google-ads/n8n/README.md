# Reporte diario automatizado — n8n

Flujo que cada mañana consulta la API de Google Ads, guarda una fila histórica en
Google Sheets (el dashboard) y envía un email con el resumen a los destinatarios.

**Ya desplegado y activo** en https://qualivo.app.n8n.cloud/workflow/t6g8nV3pQXqYLpuN
(se ejecuta cada día a las 08:00). El JSON de este repo es la copia de referencia, con los
secretos sustituidos por `{{ $vars.* }}`.

## Aviso importante sobre la cuenta de servicio

**La API de Google Ads no admite cuentas de servicio.** Solo funcionan con delegación
en todo el dominio de Google Workspace, y aun así hay que suplantar a un usuario que
tenga acceso a la cuenta de anuncios. Es una limitación de Google, no de n8n.

Reparto que sí funciona y es el que usa este flujo:

| Servicio | Autenticación |
|---|---|
| Google Ads API | OAuth2 de usuario (refresh token de info@) — ya lo tenemos |
| Google Sheets | **Cuenta de servicio** — aquí sí encaja la vuestra |

## Variables de n8n (Settings → Variables)

| Variable | Valor |
|---|---|
| `GADS_CLIENT_ID` | client id de OAuth |
| `GADS_CLIENT_SECRET` | client secret |
| `GADS_REFRESH_TOKEN` | refresh token de info@maikelechevarria.com |
| `GADS_DEVELOPER_TOKEN` | developer token del MCC |
| `GADS_CUSTOMER_ID` | 9188115388 |
| `SHEET_ID` | 1-UKqrxTObh4ME2LHldlD6eREll1EiIqM9x1ozHVA-MA (ya viene puesto en el nodo) |
| `REPORT_TO` | info@maikelechevarria.com,aida@adigital.org |

Si vuestro plan de n8n no tiene Variables, sustituir las expresiones `{{$vars.X}}`
por los valores directamente en cada nodo.

## Credenciales de n8n

1. **Google Sheets (Service Account)**: subir el JSON de la cuenta de servicio y
   **compartir la hoja de cálculo con el email de la cuenta de servicio** con permiso
   de edición. Sin ese paso el flujo falla con 403.
2. **SMTP**: para el envío del email. Alternativamente cambiar el nodo final por el
   nodo Gmail con OAuth.

## Hoja de cálculo — ya preparada

**Dashboard - Adigital** · https://docs.google.com/spreadsheets/d/1-UKqrxTObh4ME2LHldlD6eREll1EiIqM9x1ozHVA-MA

La pestaña `Historico` está creada, con cabecera, formato de moneda y porcentaje, y
**rellenada con los datos reales desde el 31 de agosto**. La cuenta de servicio
`apiclaude@kinetic-dream-377917.iam.gserviceaccount.com` ya tiene acceso comprobado.

Columnas: fecha · impresiones · clics · ctr · cpc_medio · coste · conversiones · cpl ·
coste_acumulado · conversiones_acumuladas · pct_presupuesto · proyeccion_registros

El flujo añade una fila por día. Sobre esa pestaña se pueden montar gráficos directamente
en Sheets (evolución de registros, CPL por día, ritmo de gasto frente a presupuesto).

## Qué envía el email

Tabla por campaña con el acumulado y CPL, datos del día anterior, términos de búsqueda
del día ordenados por gasto, presupuesto consumido y proyección de registros al ritmo
actual. Arriba, un bloque de avisos que solo aparece cuando hay algo que mirar:
campañas activas sin impresiones, gasto sin conversiones, CPL por encima del umbral,
ritmo de gasto bajo o pérdida de impresiones por presupuesto.


## Estado del despliegue (01-09)

| Pieza | Estado |
|---|---|
| Workflow `t6g8nV3pQXqYLpuN` | **activo**, ejecución diaria a las 08:00 |
| Credencial `Google SA · apiclaude (OutThink)` (`Np6XgvlYOuBp9rmM`) | creada, tipo cuenta de servicio |
| Escritura en la pestaña `Historico` | configurada |
| Credencial `SMTP Gmail · info@maikelechevarria.com` (`2lt9aBFiTuuZWMV7`) | creada, Gmail con contraseña de aplicación |
| Nodo «Enviar informe» | **activo**, probado end-to-end |

### Validado end-to-end (01-09)

Ejecución `27542`: los 9 nodos en verde, incluido el envío del correo. Para probarlo se
añadió temporalmente un trigger de webhook, que **se ha eliminado después** — un endpoint
sin autenticar capaz de enviar correos y escribir en la hoja no debe quedarse publicado.
Para lanzarlo a mano: botón *Execute workflow* en la interfaz.

### Problemas encontrados y resueltos durante el despliegue

1. **`pageSize` no soportado** en la v25 de la API de Google Ads → eliminado del cuerpo.
2. **Expresiones `{{ }}` anidadas** dentro de otra expresión de n8n: sintaxis inválida.
   Reescritas las consultas GAQL con plantillas de JavaScript (`${...}` entre backticks).
3. **Orden de ejecución**: las dos consultas colgaban en paralelo del mismo nodo, así que el
   de cálculo se disparaba antes de que llegara la segunda. Reencadenadas en serie
   (token → campañas → términos → cálculo) y el código lee las campañas con
   `$('Google Ads · campañas').all()`.
4. **Objeto anidado hacia Sheets**: el nodo recibía `{html, asunto, fila}` y no habría
   mapeado columnas. Añadido el nodo «Fila para el dashboard» que aplana la fila.

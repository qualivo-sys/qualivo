# Reporte diario automatizado — n8n

Flujo que cada mañana consulta la API de Google Ads, guarda una fila histórica en
Google Sheets (el dashboard) y envía un email con el resumen a los destinatarios.

Importar `workflow_reporte_diario.json` en n8n (Workflows → Import from File).

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

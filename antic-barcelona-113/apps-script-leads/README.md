# CRM de leads — Antic Barcelona 113

Tres capas, y la separación es deliberada:

| | Qué es | Quién lo hace |
|---|---|---|
| **La hoja de cálculo** | La base de datos. Ahí viven los leads | Google Sheets |
| **[/crm](https://antic-barcelona-113.vercel.app/crm)** | La cara. Escribe y lee la hoja directamente | Vercel |
| **Apps Script** | Correos automáticos y tareas a hora fija | Google, opcional |

No hay Pipedrive ni HubSpot: con 20-30 leads al mes, una suscripción más es un
sitio más donde perderlos. Se migra el día que haya más de 100 al mes o más de
una persona vendiendo a la vez.

`/crm` es la cara porque Ahmed va a mirar esto desde el móvil en el taller, y
una hoja de cálculo en un móvil no se puede usar. Se añade a la pantalla de
inicio y se comporta como una app.

## Lo importante: Apps Script no bloquea nada

Vercel escribe en la hoja con una cuenta de servicio de Google, así que **la
captura de leads y el CRM funcionan sin desplegar nada**. Apps Script queda
solo para lo que no se puede hacer desde fuera:

- mandar el correo con la guía en PDF
- avisar al comercial de cada lead nuevo
- el recordatorio de HOT sin contestar, el resumen diario y el semanal
- traer los leads del formulario instantáneo de Meta

Todo eso es valioso, pero ninguna de esas cosas pierde un lead si tarda unos
días en estar. Un lead que nunca se guardó, sí.

## Por dónde entran los leads

| Origen | Cómo llega | Retraso |
|---|---|---|
| Guía y cuestionario de la web | La web → `api/lead.js` → la hoja | Inmediato |
| Formulario instantáneo de Meta | `MetaLeads.gs` consulta la API cada 15 min | Máx. 15 min |

El formulario de Meta se consulta en vez de recibirse por webhook a propósito:
el webhook obliga a tener app secret, verificación de firma y un endpoint
público más que mantener. Con un SLA de 2 horas, 15 minutos de retraso no
cambian nada y hay la mitad de piezas que se pueden romper.

Sin esa consulta, esos leads se quedarían en el Centro de clientes potenciales
de Meta: un segundo buzón que no abre nadie.

## Qué pasa con cada lead

1. Se escribe como fila, con estado `Nuevo` y una **próxima acción ya
   propuesta** según lo caliente que sea. Al abrir el CRM nunca hay que
   decidir qué hacer, solo hacerlo.
2. Si viene de la guía, se le manda el PDF por correo *(requiere Apps Script)*.
3. Salta un aviso al comercial con 🔥 si es HOT *(requiere Apps Script)*.
4. Si un HOT sigue en `Nuevo` pasadas 2 horas de taller, recordatorio. Una
   sola vez, no cada hora *(requiere Apps Script)*.

## Lo automático *(todo requiere Apps Script)*

| Cuándo | Qué |
|---|---|
| Cada 15 min | Trae los leads nuevos del formulario de Meta |
| Cada hora (9-20 h) | Avisa de HOT sin contactar en más de 2 h |
| Cada día a las 8:00 | Lo que está sin contactar y lo vencido. **Si no hay nada pendiente no manda nada** |
| Lunes a las 9:00 | Resumen de la semana a cliente y agencia |

## Cómo se preparó la hoja

`scripts/crm/preparar-hoja.mjs` la construye entera desde fuera: pestañas,
columnas, desplegables, formatos, colores por estado y el panel de fórmulas.

Se hace desde aquí y no desde `configurar()` por dos razones. Quita un paso a
quien lo instala, y sobre todo permite comprobarlo: si algo sale mal, sale mal
en nuestra máquina y no en la de otro. Es idempotente.

```
SA_PATH=/ruta/cuenta-servicio.json node scripts/crm/preparar-hoja.mjs
```

## Puesta en marcha

**Esto no es urgente y no bloquea el lanzamiento.** Los leads ya se guardan
sin ello; lo que enciende son los correos y los leads del formulario de Meta.

Son cuatro pasos. El código está repartido en varios archivos porque así se
lee, pero se entrega junto en uno solo (`CRM-completo.gs`, que genera
`scripts/crm/juntar.mjs`) para pegar una vez en lugar de tres.

1. En la hoja: **Extensiones → Apps Script**. Pegar el archivo entero.
2. Arriba del todo hay un bloque `CONFIG` con **una línea vacía**: el correo
   donde deben llegar los avisos. Lo demás ya viene puesto.
3. Elegir la función **`configurar`** y darle al ▶. Pedirá permisos la primera
   vez — es normal, va a mandar correos en tu nombre. Programa los cinco avisos
   automáticos. Se puede volver a ejecutar sin miedo: no duplica nada.
4. **Implementar → Nueva implementación → Aplicación web**, ejecutar como
   *Yo* y acceso para *Cualquier usuario*. Copiar la URL que acaba en `/exec`
   y pasarla a la agencia.

Ese último paso es el único que no puede hacer la agencia por su cuenta: la
URL solo existe después de desplegar. Con ella se rellena `LEAD_WEBHOOK_URL`
en Vercel y se encienden los correos.

Para comprobar que Meta responde: ejecutar `probarConexionMeta()` y mirar el
registro. Debe listar el formulario «AB113 · Diseña tu pieza».

> Al cambiar el código más adelante hay que **editar la implementación
> existente** y subir la versión, no crear una nueva: una nueva cambia la URL
> y Vercel seguiría escribiendo en la vieja.

### Lo que ya está puesto en Vercel

| Variable | Estado |
|---|---|
| `CRM_PASSWORD` | ✅ puesta |
| `CRM_SESSION_SECRET` | ✅ puesta |
| `LEAD_SHARED_SECRET` | ✅ puesta, y la misma va dentro del `CONFIG` del script |
| `GOOGLE_SERVICE_ACCOUNT` | ✅ puesta |
| `SHEET_ID` | ✅ puesta |
| `LEAD_WEBHOOK_URL` | ⏳ pendiente del paso 4, y solo para los correos |

### Generar el archivo único

```
node scripts/crm/juntar.mjs                     # con huecos por rellenar
SECRETO=... META_TOKEN=... EMAIL_AVISOS=... \
  node scripts/crm/juntar.mjs --salida /ruta.gs # ya relleno
```

La versión rellena lleva el token de Meta dentro, así que **no se guarda en el
repositorio** (está en `.gitignore`): se genera aparte y se entrega por otro
canal.

## Cómo se trabaja el pipeline

La única columna que hay que tocar a mano es **estado**. Al cambiarla, el
script sella solo la fecha de primer contacto y, si se cierra, la de cierre.

```
Nuevo → Contactado → Visita o llamada → Presupuesto enviado → Ganado
                                                            → Perdido
```

Al marcar **Ganado** hay que rellenar **importe**: es lo que alimenta el
retorno del panel. Al marcar **Perdido**, el **motivo**: tres meses de motivos
de pérdida dicen más sobre qué cambiar en los anuncios que cualquier métrica
de Meta.

**proxima_accion** y **fecha_proxima** son el motor del aviso diario. Un lead
sin fecha próxima desaparece del radar hasta que alguien se acuerde.

## El panel

Se actualiza solo. La **única celda que se escribe a mano es B24**, la
inversión en Meta del mes: sin ella no hay coste por lead ni retorno, y son
las dos cifras que deciden si la campaña sigue.

La tabla de abajo, por creatividad, es la que manda de verdad. La columna que
importa no es «Leads» sino **«A presupuesto»**: una creatividad con muchos
leads y cero presupuestos está trayendo gente que no compra, y sale más cara
que otra con la mitad de leads.

## El CRM en el móvil

Abrir [/crm](https://antic-barcelona-113.vercel.app/crm), meter la contraseña
y, en el menú del navegador, **Añadir a pantalla de inicio**. Queda como una
app, sin barra de direcciones. La sesión dura 30 días.

Cuatro pestañas:

- **Hoy** — lo primero que se ve, y a propósito no es la lista de leads sino
  lo que hay que contestar: lo que nadie ha tocado y lo que se pasó de fecha,
  con los HOT arriba y el que lleva más tiempo esperando primero.
- **En marcha** — todo lo que está vivo.
- **Todos** — el histórico.
- **Panel** — embudo, dinero y la tabla por creatividad.

Al tocar un lead se abre su ficha: botón de WhatsApp que abre la conversación
con ese número, todo lo que contestó, y los cuatro campos que se tocan
(estado, próxima acción, cuándo e importe). Se guarda en la hoja al instante,
y el cambio de estado sella solo las fechas de primer contacto y de cierre.

## Probarlo sin tocar producción

```
node scripts/crm/servidor-simulado.mjs &
node scripts/crm/probar.mjs
```

Levanta la landing con una hoja falsa (contraseña `1234`) y recorre el CRM
entero en un móvil de 390 px. Deja las capturas en `/tmp/crm-*.png`.

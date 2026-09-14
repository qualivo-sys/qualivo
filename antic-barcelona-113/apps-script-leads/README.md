# CRM de leads — Antic Barcelona 113

Son dos capas y conviene entender por qué:

- **La hoja de cálculo es la base de datos.** No hay Pipedrive ni HubSpot y es
  una decisión: con 20-30 leads al mes, una suscripción más es un sitio más
  donde perder leads. Se migra el día que haya más de 100 al mes o más de una
  persona vendiendo a la vez.
- **[antic-barcelona-113.vercel.app/crm](https://antic-barcelona-113.vercel.app/crm)
  es la cara.** Porque Ahmed va a mirar esto desde el móvil en el taller, y una
  hoja de cálculo en un móvil no se puede usar. Se puede añadir a la pantalla
  de inicio y se comporta como una app.

Si la app web se cayera, los leads seguirían entrando en la hoja y los avisos
por correo seguirían saliendo. Esa es la razón de no haber montado una base de
datos propia.

## Por dónde entran los leads

Hay dos puertas y las dos acaban en la misma pestaña `Leads`:

| Origen | Cómo llega | Retraso |
|---|---|---|
| Guía descargada y cuestionario de la web | La web → `api/lead.js` en Vercel → esta app web | Inmediato |
| Formulario instantáneo de Meta | `MetaLeads.gs` consulta la API cada 15 min | Máx. 15 min |

El formulario de Meta se consulta en vez de recibirse por webhook a propósito:
el webhook obliga a tener app secret, verificación de firma y un endpoint
público más que mantener. Con un SLA de respuesta de 2 horas, 15 minutos de
retraso no cambian nada y hay la mitad de piezas que se pueden romper.

## Qué pasa con cada lead

1. Se escribe como fila, con estado `Nuevo` y una **próxima acción ya
   propuesta** según lo caliente que sea. Al abrir el CRM nunca hay que
   decidir qué hacer, solo hacerlo.
2. Si viene de la guía, se le manda el PDF por correo automáticamente.
3. Salta un aviso al comercial, con 🔥 en el asunto si es HOT y un botón de
   WhatsApp que abre la conversación con ese número.
4. Si un HOT sigue en `Nuevo` pasadas 2 horas de taller, salta un recordatorio.
   Una sola vez, no cada hora.

## Lo automático

| Cuándo | Qué |
|---|---|
| Cada 15 min | Trae los leads nuevos del formulario de Meta |
| Cada hora (9-20 h) | Avisa de HOT sin contactar en más de 2 h |
| Cada día a las 8:00 | Correo con lo que hay sin contactar y las acciones vencidas. **Si no hay nada pendiente no manda nada** |
| Lunes a las 9:00 | Resumen de la semana a cliente y agencia, desglosado por creatividad |

## Puesta en marcha

Son cuatro pasos y no hay que tocar nada más. El código está repartido en
varios archivos porque así se lee, pero se entrega junto en uno solo
(`CRM-completo.gs`, que genera `scripts/crm/juntar.mjs`) para pegar una vez en
lugar de cuatro.

1. En la hoja: **Extensiones → Apps Script**. Pegar el archivo entero.
2. Arriba del todo hay un bloque `CONFIG` con **una línea vacía**: el correo
   donde deben llegar los avisos. Lo demás ya viene puesto.
3. Elegir la función **`configurar`** y darle al ▶. Pedirá permisos la primera
   vez — es normal, va a escribir en la hoja y a mandar correos. Crea las
   pestañas, los desplegables, el panel y los cinco disparadores automáticos.
   Se puede volver a ejecutar sin miedo: no borra datos ni los duplica.
4. **Implementar → Nueva implementación → Aplicación web**, ejecutar como
   *Yo* y acceso para *Cualquier usuario*. Copiar la URL que acaba en `/exec`
   y pasarla a la agencia.

Ese último paso es el único que no puede hacer la agencia por su cuenta: la
URL solo existe después de desplegar. Con ella se rellena `LEAD_WEBHOOK_URL`
en Vercel y el circuito queda cerrado.

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
| `LEAD_WEBHOOK_URL` | ⏳ pendiente del paso 4 |

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

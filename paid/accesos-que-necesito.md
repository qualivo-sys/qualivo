# PAID · ACCESOS QUE NECESITO PARA OPERAR

```
AGENTE      qualivo.paid
RAMA        claude/qualivo-paid
FECHA       10-sep-2026
PARA        Maikel (concede) · Ops (inventaría dónde vive cada clave)
```

> **En este fichero no hay ni una credencial, y nunca la habrá.** Digo qué clave hace falta, con
> qué permiso, sobre qué activo y dónde vive hoy si lo sé. Regla del control plane:
> *«las claves no entran nunca en el repo»* (`docs/agent-os/06-control-plane/00-control-plane.md`).
>
> **Comprobado hoy:** este contenedor no tiene ninguna variable `META_*`, `GHL_*`, `GOOGLE_SA_JSON`
> ni `INFORME_SHEET_ID`. No puedo ver la cuenta. Por eso `paid/estado.md` va lleno de SIN DATO.

---

## GRUPO A · LO MÍNIMO PARA MIRAR (sin esto no existo)

Con este grupo puedo diagnosticar, escribir el Paid Review y proponer. **No puedo cambiar nada.**
Es el grupo que pediría primero si solo pudieras darme uno.

### A1 · Meta Ads · lectura de la cuenta publicitaria de Qualivo 🟢

| Campo | Valor |
|---|---|
| **Qué** | Token de acceso de Meta con permiso `ads_read` |
| **Sobre qué** | La cuenta publicitaria de Qualivo, `act_<SIN DATO>` — **necesito que me digas el ID** |
| **Para qué** | Campañas activas, presupuesto diario, gasto, impresiones, clics y leads por anuncio |
| **Dónde vive hoy** | Variables `META_ADS_TOKEN` y `META_AD_ACCOUNT` del proyecto de Vercel de qualivo.io. Lo sé porque `api/informe.js` las lee; **no he visto sus valores** |
| **Cómo prefiero recibirlo** | Un **usuario del sistema** propio en el Business Manager, con `ads_read` y sin fecha de caducidad corta, no una copia del token del informe. Si el del informe caduca, quiero que se caiga el informe o yo, no los dos a la vez |
| **Riesgo si se filtra** | Lectura de métricas publicitarias. Ningún gasto posible |

### A2 · Google Sheet del embudo · lector 🟢

| Campo | Valor |
|---|---|
| **Qué** | Permiso de **lector** sobre el Sheet, y su ID |
| **Sobre qué** | El Sheet de la variable `INFORME_SHEET_ID`, pestañas «Ads diario», «Web diario», «Posiciones 7d» |
| **Para qué** | Es la vía más barata a los datos por anuncio sin tocar la API de Meta. Si me das solo esto, ya escribo el primer Paid Review con cifras |
| **Dónde vive hoy** | Variable `INFORME_SHEET_ID` en Vercel; el Sheet lo escribe la cuenta de servicio `GOOGLE_SA_JSON` |
| **Nota** | Me vale el **enlace de solo lectura**. No necesito editarlo: lo escribe el cron de Growth y no soy yo el dueño de ese fichero |

### A3 · GoHighLevel · lectura de contactos y oportunidades 🟢

| Campo | Valor |
|---|---|
| **Qué** | Token v2 de GHL con `contacts.readonly` y `opportunities.readonly` |
| **Sobre qué** | La *location* de Qualivo (`GHL_LOCATION_ID`) |
| **Para qué** | **Mi número entero.** El CPL a secas sale de Meta; el CPL **cualificado** sale de cruzar Meta con las etiquetas `prioridad-alta`, `diagnostico-completo`, `reunion-reservada` y `cliente-ganado` |
| **Dónde vive hoy** | `GHL_API_KEY` y `GHL_LOCATION_ID` en Vercel |
| **Ojo** | Que sea de **solo lectura**. Escribir en el CRM no es mío |

---

## GRUPO B · PARA CONSTRUIR EN PAUSADO Y PARA FRENAR

Este grupo es el que me deja hacer mi trabajo de verdad: dejar campañas montadas y en PAUSADO para
que tú las revises, y pausar sola una que esté sangrando. **Sigue sin permitirme activar nada:** en
Meta, activar es un cambio de `status` que puedo hacer o no según el permiso, y por eso el punto B2
es una promesa de conducta, no una restricción técnica. Léelo entero antes de concederlo.

### B1 · Meta Ads · gestión de la cuenta publicitaria 🔴 *decisión tuya*

| Campo | Valor |
|---|---|
| **Qué** | Token con `ads_management` (además de `ads_read`) |
| **Sobre qué** | La misma cuenta `act_<SIN DATO>` |
| **Rol en el Business Manager** | **Anunciante** sobre la cuenta publicitaria. **NO administrador de la cuenta, NO acceso a métodos de pago, NO administrador del Business Manager** |
| **Para qué** | Crear campañas, conjuntos y anuncios **con `status: PAUSED`**; pausar lo que sangra; excluir públicos y ubicaciones que queman |
| **Lo que NO haré con él** | Poner nada en `ACTIVE`. Subir `daily_budget` ni `lifetime_budget`. Cambiar pujas. Lanzar |
| **Por qué te lo digo así de claro** | Porque el permiso técnico de Meta no distingue «crear en pausado» de «activar». La separación la sostengo yo, no la API. Si prefieres no correr ese riesgo, quédate en el Grupo A: te entrego las campañas escritas en Markdown y las montas tú a mano. Es más lento y es perfectamente válido |

### B2 · Lo único que haré sin preguntarte

De mi ficha, y no cambia nunca por buen historial:

| Acción | Color | Cómo te lo cuento |
|---|---|---|
| Analizar, diagnosticar, proponer, construir en **PAUSADO** | 🟢 | en el Paid Review |
| **Pausar** una campaña o un anuncio que sangra · **excluir** un público o término que quema | 🟡 | **aviso en el momento**, no espero al lunes |
| Activar · subir presupuesto · cambiar puja · lanzar | 🔴 | **te lo pido y espero**. Siempre |

Frenar es reversible. Acelerar no. Por eso la excepción va en ese sentido y solo en ese.

---

## GRUPO C · ÚTIL, NO URGENTE

### C1 · Events Manager · lectura del píxel 🟢
Acceso de **lectura** al conjunto de datos **«Qualivo Agencia», píxel `879197745226987`**
(`api/_meta.js:8`). Para ver la calidad de emparejamiento de los eventos `Lead`, `Schedule` y
`Purchase`, y confirmar que la deduplicación navegador/servidor funciona. No necesito el token de
la API de Conversiones (`META_CAPI_TOKEN`): ese es de Growth y no lo quiero.

### C2 · GA4 · lectura 🟢
Propiedad de la variable `GA4_PROPERTY_ID`. Para leer el recorrido en la landing del tráfico de
pago. Marginal: la pestaña «Web diario» ya trae lo importante.

### C3 · Relleno hacia atrás del informe 🟡 *se lo pido a Growth, no lo quiero yo*
El cron `/api/informe/` se subió el 9-sep a las 17:26 UTC y corre a las 06:45 UTC, así que el Sheet
no puede tener nada anterior al 10-sep. Hay que llamar a
`GET /api/informe/?fecha=AAAA-MM-DD&dias=N` con `Authorization: Bearer $CRON_SECRET` desde el primer
día de gasto real. **No pido el `CRON_SECRET`**: que lo ejecute Growth u Ops, que ya lo tienen.

---

## LO QUE NO PIDO, Y QUIERO QUE CONSTE

| No pido | Por qué |
|---|---|
| Métodos de pago, tarjetas, facturación de Meta | gastar es tuyo. No quiero ni poder tocarlo |
| Administrador del Business Manager | no lo necesito para operar una cuenta |
| `META_CAPI_TOKEN`, `META_WEBHOOK_KEY`, `CRON_SECRET` | son de la instrumentación, y la instrumentación es de Growth |
| Escritura en GoHighLevel | el CRM no es mío |
| Escritura en el repositorio de la web, la landing o el píxel | **no toco la web.** Es la frontera con Growth |
| Google Ads `918-811-5388` (OutThink) | es de Agente Adigital. Cuando salga el playbook hablamos, hoy no |
| Cuentas de EAC, Focus Practical, Eleva | un cliente por sesión. Confundir presupuestos es un `FAILURE_MODE` de mi ficha |

---

## CÓMO CONCEDERLO SIN QUE NADIE PEGUE UN SECRETO EN NINGÚN SITIO

1. Crea el usuario del sistema en el Business Manager y asígnale la cuenta publicitaria con el rol
   que decidas (A1 solo lectura, o B1 anunciante).
2. Genera el token y **guárdalo donde Ops lleve el inventario de claves**, no en un chat ni en el
   repo.
3. Dime **solo dos cosas en texto plano**: el **ID de la cuenta publicitaria** (`act_…`) y el **ID
   del Sheet del embudo**. No son secretos y sin ellos no sé ni a dónde mirar.
4. Inyecta el token como variable de entorno de mi sesión. Yo nunca lo escribo, ni lo imprimo, ni
   lo commiteo.

**Si hoy solo puedes hacer un movimiento:** dame **A2**, el enlace de lectura del Sheet del embudo.
Con eso solo, el lunes 14-sep tienes un Paid Review con cifras reales en vez de este documento
lleno de SIN DATO.

# PAID · ESTADO REAL DE QUALIVO EN META

```
AGENTE      qualivo.paid
RAMA        claude/qualivo-paid
FECHA       10-sep-2026
FUENTES     rama claude/qualivo-landing-vercel-nubk1i @ 9a6c388 (10-sep) · docs/agent-os @ main 84e97d5
```

> **Regla de este documento:** toda cifra lleva valor, fuente y fecha. Lo que no tengo se escribe
> `SIN DATO` y de dónde debería salir. No hay una sola cifra estimada aquí dentro.

---

## 1 · LA RESPUESTA CORTA

**Qué campañas de Meta de Qualivo están activas, con qué presupuesto, desde cuándo, cuánto llevan
gastado, cuántos leads y a qué coste: SIN DATO, las seis casillas.**

No es una omisión de este documento: **no está escrito en ninguna parte del repositorio**, en
ninguna de las dos ramas, y desde este contenedor no hay ninguna credencial de Meta con la que
mirarlo (`env` sin `META_*`, `GHL_*` ni `GOOGLE_SA_JSON`, comprobado 10-sep).

La propia ficha de Paid ya lo anticipaba: la fila «Estado real: qué campañas corren, con qué
presupuesto y cuánto llevan gastado» del traspaso pone **«SIN DATO en el repo»**
(`docs/agent-os/04-systems/70-paid.md`, 10-sep).

Lo que sí puedo afirmar con fuente es **toda la tubería de medición**, que está montada y es buena.
Eso es la sección 3. Lo que falta para poder gobernar el gasto es la sección 5.

**El traspaso de Growth no existe todavía.** `paid/traspaso.md` no está en
`claude/qualivo-landing-vercel-nubk1i` a 10-sep (comprobado sobre 9a6c388). Este documento se ha
escrito leyendo el código directamente, no esperándolo.

---

## 2 · EL CUADRO QUE HAY QUE RELLENAR

| Casilla | Valor | Fuente | Fecha |
|---|---|---|---|
| Cuenta publicitaria de Qualivo (`act_…`) | **SIN DATO** | variable `META_AD_ACCOUNT` en el proyecto Vercel de qualivo.io (`api/informe.js`) | — |
| Campañas en ACTIVE ahora mismo | **SIN DATO** | Meta Ads API `/{act_id}/campaigns?fields=name,status,daily_budget` | — |
| Presupuesto diario por campaña | **SIN DATO** | idem | — |
| Fecha de arranque de cada campaña | **SIN DATO** | idem, campo `start_time` | — |
| Gasto acumulado | **SIN DATO** | Meta Ads Insights, o pestaña «Ads diario» del Sheet del embudo | — |
| Leads (píxel) y CPL | **SIN DATO** | pestaña «Ads diario», columnas `Leads (píxel)` y `Coste/lead €` | — |
| Leads **cualificados** y CPL cualificado | **SIN DATO** · *y hoy no es calculable por anuncio*, ver §4.2 | GoHighLevel, etiquetas `prioridad-alta` / `diagnostico-completo` | — |

**Nunca voy a estimar ninguna de estas siete.** Un gasto inventado es peor que un hueco: el hueco
se ve.

---

## 3 · LO QUE SÍ ESTÁ MONTADO, CON FUENTE

Todo esto lo construyó la sesión Agente growth el **9-sep-2026**. Sigue siendo suyo: es
instrumentación, no inversión.

### 3.1 · Píxel

| Dato | Valor | Fuente |
|---|---|---|
| Píxel en uso | **879197745226987** («Qualivo Agencia») | `api/_meta.js:8`, `assets/consent.js:8` · commit `7215809`, 9-sep 15:02 UTC |
| Píxel descartado | `1055987250570278`, creado y abandonado el mismo día | diff de `7215809`: *«El token de la Conversions API pertenece a ese conjunto de datos; el pixel creado hoy queda sin uso»* |
| Dónde está puesto | qualivo.io, cargado **solo tras consentimiento** de cookies | `assets/consent.js`, función `cargarMeta()` |

**Consecuencia para mí:** el píxel de navegador no ve a quien rechaza cookies. Quien cubre ese
hueco es la API de Conversiones. Cualquier lectura de «leads» en el Administrador de Anuncios es la
suma de los dos, deduplicada.

### 3.2 · API de Conversiones y deduplicación

| Evento | Cuándo se dispara | Dónde | Commit |
|---|---|---|---|
| `Lead` | la Radiografía guarda un contacto | `api/fugas.js` → `META.enviarLead()` | `407400b`, 9-sep 14:35 UTC |
| `Schedule` | workflow *Appointment booked* de GoHighLevel | `api/meta-evento.js?evento=Schedule` | `c2ab9e8`, 9-sep 15:08 UTC |
| `Purchase` | workflow *Opportunity won* de GoHighLevel, con valor en EUR | `api/meta-evento.js?evento=Purchase` | `c2ab9e8` |

- **Deduplicación:** el `event_id` del servidor es el mismo que dispara el navegador
  (`api/fugas.js:104-106`), así que Meta no cuenta dos veces el mismo registro.
- **Reintentos de GHL:** el `eventoId` de los hitos se construye con el id de la cita o de la
  oportunidad (`api/meta-evento.js`), así que un reintento tampoco duplica.
- **Datos personales:** solo SHA-256 (`api/_meta.js`, función `sha`).
- **Seguridad del webhook:** `?k=` contra `META_WEBHOOK_KEY` (o `CRON_SECRET` si no existe).

### 3.3 · El informe diario por anuncio

| Dato | Valor | Fuente |
|---|---|---|
| Ruta | `/api/informe/` | `vercel.json`, bloque `crons` |
| Horario | `45 6 * * *` → **06:45 UTC diario** | `vercel.json` |
| Destino | Google Sheet, variable `INFORME_SHEET_ID` | `api/informe.js` |
| Pestaña «Ads diario» | una fila **por día y por anuncio**: campaña, conjunto, anuncio, impresiones, alcance, frecuencia, clics de enlace, CTR, CPC, gasto, visitas a la página, coste/visita, leads (píxel), coste/lead | `api/informe.js`, constante `TABS` |
| Ventana | reescribe **los 3 últimos días** en cada ejecución (GA4 y Search Console cierran tarde) | commit `ee45421`, 9-sep 17:30 UTC |
| Relleno hacia atrás | `GET /api/informe/?fecha=AAAA-MM-DD&dias=N` con `Authorization: Bearer $CRON_SECRET` | `api/informe.js` |

**Cuántas veces ha podido correr:** el cron se subió el **9-sep a las 17:26 UTC**, después de las
06:45 de ese día. La primera ejecución posible es la del **10-sep a las 06:45 UTC**, hoy. Es decir:
**el histórico del Sheet arranca, como muy pronto, hoy mismo.** Si hay campañas corriendo desde
antes, sus días previos hay que traerlos con el relleno hacia atrás.

Otros dos crons vecinos, que no son míos pero comparten secreto: `/api/secuencia/` a las 08:00 UTC
y `/api/seguimientos/` a las 07:15 UTC de lunes a viernes.

### 3.4 · Esquema de UTMs y etiquetado en el CRM

- Se capturan `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` y `ref`
  (`donde-se-rompe-tu-crecimiento/diagnostico.js:577`), se guardan en `sessionStorage` bajo
  `qv_utm` y viajan a la API con el registro.
- **Al CRM solo llega una etiqueta de origen: `utm-<source>`** (`api/fugas.js:144` y `:171`). El
  resto del recorrido —campaña, anuncio— queda únicamente en una nota de texto libre
  («Origen: utm_campaign=… · utm_content=…», `api/fugas.js:227`).

### 3.5 · Etiquetas de GoHighLevel que definen «cualificado»

De `api/fugas.js` y `api/informe.js`:

`diagnostico-crecimiento` · `qualivo-landing` · `radiografia-anonima` · `cuello-<x>` ·
`nivel-<x>` · `icp-1` · `sector-<x>` · `rol-<dueno|directivo|otro>` · `con-whatsapp` ·
`dx-AAAAMMDD` · **`diagnostico-completo`** · **`prioridad-alta`** · `utm-<source>` ·
**`reunion-reservada`** · **`cliente-ganado`**

Las cuatro en negrita son las que me sirven para el CPL cualificado. La pestaña «Web diario» ya
cuenta a diario `Registros GHL`, `De Meta`, `Prioritarios`, `Reuniones (acumulado)` y
`Clientes (acumulado)`.

---

## 4 · LOS TRES AGUJEROS QUE ENCUENTRO, Y NO SON MENORES

### 4.1 · El informe puede estar reportando cero anuncios sin que nadie se entere

En `api/informe.js`:

```js
async function filasAds(fecha) {
  const token = process.env.META_ADS_TOKEN, act = process.env.META_AD_ACCOUNT;
  if (!token || !act) return { filas: [], nota: 'sin META_ADS_TOKEN' };
```

Ese `nota` **no lo lee nadie después**. El handler solo apila `ads.filas.length` en el resumen y
devuelve `ok: true`. Traducido: si el token de Ads no está puesto o ha caducado, el informe diario
llega igual, con la pestaña «Ads diario» vacía y un `200 OK`, y **«0 anuncios» es indistinguible de
«no configurado»**. Es exactamente el modo de fallo que H11 describe para las rutinas semanales:
fallar en silencio.

Es código de Growth, no lo toco. Lo pido en §5 como arreglo de una línea.

### 4.2 · Mi KPI no es calculable por anuncio, y ese es el problema de fondo

Mi número es el **coste por lead cualificado**. Para calcularlo hace falta cruzar gasto por anuncio
(lo tiene Meta) con calidad del lead (la tiene GoHighLevel). Hoy ese cruce **no se puede hacer**:

- Meta da el gasto por anuncio → pestaña «Ads diario». ✅
- GHL da la cualificación por contacto → etiquetas `prioridad-alta`, `diagnostico-completo`,
  `reunion-reservada`. ✅
- **El contacto no lleva encima de qué anuncio vino**, porque solo se etiqueta `utm_source`. ❌

Lo máximo que sale hoy es un CPL cualificado **agregado del día**: gasto total de Meta ÷
`Prioritarios` con etiqueta `utm-meta`. Sirve para saber si el conjunto sangra. **No sirve para lo
único que hace ganar dinero a un presupuesto: saber cuál de los seis anuncios trae los buenos.**

Sin eso, optimizo por CPL a secas. Y optimizar por CPL a secas es, literalmente, el primer
`FAILURE_MODE` de mi ficha: *«traer basura barata»*.

**Arreglo, y es pequeño:** añadir `utm_content` (y `utm_campaign`) como etiqueta del contacto,
igual que ya se hace con `utm_source`. Es instrumentación → es de Growth. Es mi petición número uno.

### 4.3 · El único documento de campaña que existe es de otra empresa

`content/campana-meta-agenttome.md` es un plan de campaña **excelente** —14 ángulos, 10 anuncios,
reglas de matar y escalar— pero es de **Agent for Me (agentforme.io)**, no de Qualivo. Y su propia
tabla de bloqueantes dice, sin ambigüedad:

> | 1 | **Píxel de Meta + API de Conversiones** en agentforme.io | ❌ no instalado |

O sea: la instrumentación que verifiqué en §3 vive en **qualivo.io**, no en agentforme.io.

**Pregunta que necesito que me respondan antes de tocar nada:** el dinero que está corriendo ahora
mismo, ¿a qué destino manda? Si va a `qualivo.io/donde-se-rompe-tu-crecimiento/`, todo lo de §3
aplica y puedo medir. **Si va a agentforme.io, está corriendo sin píxel y sin API de Conversiones,
y entonces ese gasto no se está midiendo en absoluto.** Son dos situaciones completamente distintas
y no puedo distinguirlas desde el repositorio.

---

## 5 · LO QUE PIDO A AGENTE GROWTH (instrumentación, es suya)

Ordenado por lo que más me bloquea. Ninguna toca presupuesto: son todas de medición.

| # | Petición | Por qué | Tamaño |
|---|---|---|---|
| 1 | Etiquetar el contacto con `utm_content` y `utm_campaign`, no solo `utm_source` | sin esto no hay CPL cualificado por anuncio (§4.2) | 2 líneas en `api/fugas.js` |
| 2 | Que el informe grite cuando `META_ADS_TOKEN`/`META_AD_ACCOUNT` faltan o fallan | hoy falla en silencio con `200 OK` (§4.1) | leer `ads.nota` y meterla en `resumen.errores` |
| 3 | Relleno hacia atrás del Sheet desde el primer día de gasto real | el cron solo puede haber corrido desde hoy (§3.3) | una llamada con `?fecha=&dias=` |
| 4 | Confirmar el destino del tráfico de pago: qualivo.io o agentforme.io | decide si hay medición o no la hay (§4.3) | una frase |
| 5 | Escribir `paid/traspaso.md` con el ID de la cuenta publicitaria y el del Sheet del embudo | no están en el repo y son lo primero que necesito | una tabla |

Y una que es de Ops, no de Growth: **verificar que el `Purchase` lleva valor**. Hoy, si el
`monetaryValue` de la oportunidad viene vacío, se manda `value: 0` (`api/meta-evento.js`). Un
`Purchase` de 0 € entrena mal la puja y hace que cualquier ROAS sea mentira.

---

## 6 · LO QUE NO ES MÍO Y NO TOCO

| Cosa | Dueño |
|---|---|
| Píxel, API de Conversiones, eventos, webhook de GHL, landing, CRO, Radiografía | Agente growth |
| Fábrica de creatividades y `.claude/skills/director-creativo/` | Agente growth |
| El mensaje comercial y la oferta | Estrategia Central |
| Activar, subir presupuesto, cambiar pujas, gastar | **Maikel, siempre** |
| Google Ads de OutThink, cuenta `918-811-5388` | Agente Adigital |

**Sobre la oferta:** hay conflicto abierto (H10). La matriz obligatoria del **8-sep** dice
Radiografía + Growth System de 1.000-2.500 €/mes; la sesión de ofertas del **10-sep** propone Leak
Map y 24.000 €. Hasta que Maikel firme, **mando por la del 8-sep** y no cambio ningún mensaje por
mi cuenta. Aviso además de una tercera versión que ya está escrita en la rama de growth:
`content/biblioteca-estrategica/06-motor-campanas.md` cierra con «Sprint de Recuperación,
2.500–5.000 €». Son tres precios distintos en el mismo repositorio.

---

## 7 · CÓMO SE CIERRA ESTE DOCUMENTO

Este fichero se actualiza en cuanto tenga lectura de la cuenta. El orden es:

1. Maikel me da acceso de lectura (`paid/accesos-que-necesito.md`, petición A1).
2. Relleno las siete casillas de §2 con valor, fuente y fecha.
3. Primer Paid Review con datos de verdad, el lunes 14-sep.
4. Growth cierra las peticiones 1 y 2 de §5, y a partir de ahí el CPL cualificado es por anuncio.

Mientras tanto **no propongo ningún cambio de presupuesto ni de puja**: proponer sobre datos que no
he visto sería exactamente el error que mi barandilla existe para evitar.

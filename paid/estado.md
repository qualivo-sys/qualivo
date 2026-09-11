# PAID · ESTADO REAL DE QUALIVO EN META

```
AGENTE      qualivo.paid
RAMA        claude/qualivo-paid
FECHA       10-sep-2026 · 18:30 CEST
FUENTES     Meta Ads API v21.0 sobre act_3453332464718877 (lectura, 10-sep) ·
            rama claude/qualivo-landing-vercel-nubk1i @ 9a6c388 · docs/agent-os @ main 84e97d5
```

> **Regla de este documento:** toda cifra lleva valor, fuente y fecha. Lo que no tengo se escribe
> `SIN DATO` y de dónde debería salir. No hay una sola cifra estimada aquí dentro.
>
> **Actualizado el 10-sep a las 18:30** con lectura directa de la cuenta. La versión anterior de
> este fichero decía SIN DATO en las siete casillas; ya no. Las cifras de abajo salen de la API,
> no del repositorio.

---

## 1 · LA RESPUESTA CORTA

**Hay una sola campaña activa, lleva dos días, ha gastado 17,03 € y ha traído 0 leads.**

| Casilla | Valor | Fuente | Fecha |
|---|---|---|---|
| Cuenta publicitaria | **`act_3453332464718877` · «Qualivo Agencia»** · EUR · Europe/Madrid · business Qualivo (`637269043855234`) | Meta Ads API `/me/adaccounts` | 10-sep |
| Campañas ACTIVE | **1: `QV_HERO_LEADS_Sep26`** (objetivo `OUTCOME_LEADS`). De 68 campañas en la cuenta, las otras 67 están PAUSED | `/act_.../campaigns` | 10-sep |
| Presupuesto | **15,00 €/día**, en el conjunto `ES · Advantage+ (pymes como sugerencia) · Lead`. Sin tope total, sin fecha de fin | `/{campaign}/adsets` | 10-sep |
| Desde cuándo | **9-sep-2026, 18:16 CEST**. Hoy es el **día 2** | `adset.start_time` | 10-sep |
| Gasto acumulado | **17,03 €** (9-sep: 4,17 € en un cuarto de día · 10-sep: 12,86 € y el día sin cerrar) | `/insights` `time_increment=1` | 10-sep |
| Leads | **0** | `/insights`, acción `lead` ausente en las 5 filas | 10-sep |
| CPL | **no calculable: división por cero** | — | 10-sep |
| Leads cualificados y CPL cualificado | **0 leads ⇒ 0 cualificados.** No es un problema de instrumentación todavía: no hay nada que cualificar | — | 10-sep |

**No he tocado nada.** Ni activado, ni pausado, ni cambiado un presupuesto. Solo he leído.

---

## 2 · LA CAMPAÑA, ANUNCIO A ANUNCIO

Datos de `/insights` a nivel de anuncio, 9 y 10 de septiembre, cuenta en hora de Madrid. El 10-sep
es un día en curso, no cerrado.

| Anuncio | Gasto | Impresiones | Clics de enlace | CTR enlace | Visitas de página | Leads |
|---|---|---|---|---|---|---|
| **HERO 06 · Control tipográfico** | **9,13 €** | 433 | 11 | 2,54 % | 3 | **0** |
| **HERO 01 · Amplio tipográfico** | **7,74 €** | 551 | 11 | 2,79 % / 0,52 % | 1 | **0** |
| **HERO 03 · Seguimiento foto** | **0,16 €** | 18 | 1 | — | 0 | **0** |
| **TOTAL** | **17,03 €** | **1.002** | **23** | **2,30 %** | **4** | **0** |

CPC 0,74 € · CPM 17,00 €. Fuente: Meta Ads API, 10-sep 18:30.

**Destino y etiquetado, verificados en la creatividad:** los tres anuncios apuntan a
`https://qualivo.io/donde-se-rompe-tu-crecimiento/` con
`?utm_source=meta&utm_medium=paid&utm_campaign=hero-sep&utm_content=01|03|06`.

Eso **cierra la duda que dejé abierta ayer**: el dinero va a qualivo.io, donde el píxel y la API de
Conversiones sí están puestos. No va a agentforme.io. La medición existe para este gasto.

**El conjunto optimiza a `Lead` sobre el píxel `879197745226987`** (`promoted_object`), puja
`LOWEST_COST_WITHOUT_CAP`, cobro por impresiones. Es la configuración correcta.

### Lo que dice el píxel, que es más útil que lo que dice la campaña

Eventos recibidos por `879197745226987` (`/{pixel}/stats?aggregation=event`, 10-sep):

| Día | PageView | HeroStart | Lead | Schedule |
|---|---|---|---|---|
| 9-sep | 5 | 4 | 3 | 2 |
| **10-sep** | **15** | **2** | **0** | **0** |

Los `Lead` y `Schedule` del 9-sep caen a las 15:00-17:00 UTC, es decir **antes o justo al arrancar
el conjunto** (18:16 CEST = 16:16 UTC), y coinciden con la tarde en que Growth desplegó y verificó
el webhook. Son compatibles con pruebas de extremo a extremo, no con leads de campaña — y Meta, que
es la fuente que manda aquí, atribuye **0 leads a la campaña**.

**Lo que importa es el 10-sep: 15 visitas, 2 personas empiezan la Radiografía, 0 la terminan.**

---

## 3 · DÓNDE SE ROMPE, CON NÚMEROS

```
   23 clics de enlace          ← Meta cobra por esto
        ↓  −83 %
    4 visitas de página        ← lo que Meta ve llegar
        ↓
   15 PageView del píxel       ← lo que la web ve llegar (10-sep)
        ↓  −87 %
    2 empiezan la Radiografía
        ↓  −100 %
    0 la terminan  →  0 leads  →  0 cualificados
```

Tres lecturas, en orden de confianza:

1. **El salto de 23 clics a 4 visitas no es real, es de medición.** El píxel de navegador solo
   carga tras aceptar cookies (`assets/consent.js`), así que `landing_page_view` y `PageView`
   cuentan únicamente a quien consiente. La cifra honesta de visitas está entre 4 y 23, y **no la
   tengo**. Sale de GA4 o de los logs de Vercel, no de Meta.
2. **El salto de visita a inicio de Radiografía sí es real y es el peor**: 15 → 2. La gente llega y
   no empieza. Eso es CRO de la landing, o desajuste entre lo que promete el anuncio y lo que
   encuentra al llegar. **No es mío**: la landing es de Growth y el mensaje es de Estrategia
   Central. Lo devuelvo, no lo arreglo.
3. **2 inicios y 0 finales no significa nada todavía.** Con 2 casos no se concluye. Con 20, sí.

**Y una consecuencia de puja que sí es mía:** el conjunto optimiza a `Lead` y lleva dos días con
cero. Meta necesita del orden de 50 conversiones por semana para salir de la fase de aprendizaje.
A 15 €/día y este ritmo, **no va a salir nunca**. O baja mucho el coste por lead, o hay que
optimizar a un evento más arriba del embudo (`HeroStart`) hasta que haya volumen. Eso es una
propuesta 🔴, y está en el apartado 6 del Paid Review.

---

## 4 · LO QUE NO VOY A HACER, Y POR QUÉ

**No pauso nada hoy.** 17,03 € en dos días, con 1.002 impresiones, no es una campaña sangrando: es
una campaña que todavía no ha dicho nada. Pausar ahora destruiría el aprendizaje y me costaría los
únicos datos que tengo. La regla escrita —3-4 días o 50 € por anuncio antes de tocar— aún no se ha
cumplido para ninguno de los tres.

Frenar está en mi mano y no lo uso porque no toca. Ese es el criterio, no el permiso.

**El único anuncio que sí está muerto sin haber vivido es HERO 03**: 18 impresiones y 0,16 € en dos
días. Meta ha concentrado la entrega en 01 y 06 y lo ha dejado sin oxígeno. **El test de tres
ángulos es de hecho un test de dos.** No lo pauso (no gasta nada), pero conviene saber que de ese
tercer ángulo no va a salir ninguna conclusión.

---

## 4 bis · AUDITORÍA CONTRA LA PROPUESTA DE VALOR V1 (10-sep, 19:00)

La sesión de arquitectura me corrigió esta tarde: Maikel firmó hoy una **tercera** versión de la
oferta, que no es ninguna de las dos del conflicto H10. **Verificado en la fuente primaria**, no en
el aviso: commit `4de891a` en `main`, fichero `sistema/propuesta-de-valor.md`, que se declara
espejo de solo lectura y **deroga la matriz del 8-sep**.

Ayer escribí que hasta la firma mandaba la del 8-sep. **Ya no.** Manda la V1.

Lo que me ata a mí, literal de la tabla de propagación: *«Paid · Ningún anuncio promete cierre ni
resultado sin datos del cliente. Los ángulos salen de esta propuesta.»*

**Hay dinero corriendo sobre copy escrito bajo la norma derogada**, así que lo primero era auditar
los tres anuncios vivos. Copy completo leído de la API, 10-sep.

### Las siete prohibiciones del §9 · los tres anuncios pasan

| Prohibición | HERO 01 | HERO 03 | HERO 06 |
|---|---|---|---|
| «transformación digital» | ✅ no aparece | ✅ | ✅ |
| «IA» como argumento en frío | ✅ no aparece | ✅ | ✅ |
| «somos una agencia de X» | ✅ | ✅ | ✅ |
| Precio en abierto | ✅ | ✅ | ✅ |
| El piloto de riesgo compartido | ✅ | ✅ | ✅ |
| Promesa de resultado sin datos del cliente | ✅ ninguno promete un número | ✅ | ✅ |
| «agentizar» con quien no sabe que tiene un problema | ✅ no aparece | ✅ | ✅ |

El «Gratis · sin registro» de las descripciones no es un precio en frío: la Radiografía **es**
gratis por diseño (§7 de la V1). Está alineado, no infringido.

### Y encajan mejor de lo que esperaba

Los tres son **formato diagnóstico**, que es *la única evidencia propia en frío que existe*: 24
clics de 24. La corrección dice explícitamente que si voy a probar ángulos con dinero empiece por
ahí. Ya está empezado.

HERO 03 es casi el §3 de la V1 palabra por palabra —*«ese presupuesto ya te ha costado dinero:
atraer al cliente, visitarlo, calcular el precio»*— y HERO 06 ataca la fuga de **Control** de la
tabla del §8 bis. No hay que reescribir la campaña. Hay que leerla.

| Anuncio | Fuga de la V1 que ataca | Gasto |
|---|---|---|
| HERO 01 | Conversión + Dependencia | 7,74 € |
| HERO 03 | **Seguimiento** — la fuga de la prueba madre (Nuria) | 0,16 € |
| HERO 06 | **Control** | 9,13 € |

Sin cubrir: **Captación**, y está bien que lo esté. La promesa de la V1 es *más negocio sin comprar
más demanda*; un anuncio de captación se contradiría con ella.

### 🔴 LO QUE SÍ ESTÁ MAL, y es de segmentación, no de prohibición

**HERO 01 termina su copy diciendo, literalmente: «Para empresas de 2 a 20 personas.»**

La V1 firmada hoy define el ICP en **5 a 50 personas**, con ticket por encima de 1.000 € y
capacidad de atender más negocio.

Ese anuncio, ahora mismo, con dinero:

- **Repele al núcleo del ICP nuevo.** Una empresa de 30 personas lee «de 2 a 20» y se descarta sola.
- **Atrae al descarte explícito.** Las de 2 a 4 personas caen bajo el suelo de 500 €/mes que la V1
  fija como criterio de exclusión.
- **Y lo peor para mi trabajo: contamina el experimento.** Es el anuncio con más impresiones de los
  tres (551). Cualquier CPL que mida sobre él será el CPL de la gente equivocada, y un CPL barato
  de gente que no puede comprar es exactamente el `FAILURE_MODE` número uno de mi ficha.

**No lo he pausado, y quiero ser explícito sobre por qué, porque pausar sí está en mi mano.**

La propia V1 abre el asunto como **Conflicto #1 sin resolver**: dice 5-50, la rutina del Radar IA
dice «2 a 20 empleados, corregido por Maikel el 8-sep», y el OUTBOUND BRAIN de Notion tiene 18 ICPs
con su propio scoring. El documento firmado pide que *«los tres digan lo mismo»* y no dice cuál
gana operativamente. El «2 a 20» del anuncio no salió de la nada: **lo corrigió Maikel a mano hace
dos días.**

Pausar HERO 01 por mi cuenta sería resolver un conflicto abierto de posicionamiento con el dinero
de otro y sin que nadie me lo haya pedido. Eso no es frenar algo que sangra: es decidir el ICP. Y
el ICP no es mío.

Lo que hago en su lugar: dejarlo escrito, ponerlo el primero de la lista de decisiones, y avisar de
que **hasta que se resuelva, los datos de HERO 01 no son leíbles** — los de HERO 03 y HERO 06 sí,
porque no llevan esa línea.

### Ángulos candidatos que la V1 habilita, para cuando toque

No los invento: los saco de su §5 y su §6, y ninguno se lanza sin tu ok.

1. **La prueba madre.** «6,45 veces lo invertido sin captar un lead más» (Nuria Roure). Es prueba,
   no promesa. **Bloqueado hasta que Demand verifique la cifra contra el caso original**, como
   ordena el §5: una cifra mal redondeada quema la prueba entera.
2. **Contra la alternativa real.** «Contratar otro comercial cuesta más de 2.000 € al mes, tarda
   meses en rendir y también se olvida.» Del §6. Ojo: lleva una cifra de coste de mercado, no una
   promesa de resultado. Permitido, pero conviene revisarlo.
3. **El reloj.** «El plan por escrito en 48 horas.» Del §8 bis. Responde al miedo a implantaciones
   eternas y no promete ningún número del cliente.

---

## 5 · LO QUE SÍ ESTÁ MONTADO, CON FUENTE

Todo esto lo construyó la sesión Agente growth el **9-sep-2026**. Sigue siendo suyo: es
instrumentación, no inversión.

### 5.1 · Píxel

| Dato | Valor | Fuente |
|---|---|---|
| Píxel en uso | **879197745226987** («Qualivo Agencia») | `api/_meta.js:8`, `assets/consent.js:8` · commit `7215809`, 9-sep 15:02 UTC |
| Píxel descartado | `1055987250570278`, creado y abandonado el mismo día | diff de `7215809`: *«El token de la Conversions API pertenece a ese conjunto de datos; el pixel creado hoy queda sin uso»* |
| Dónde está puesto | qualivo.io, cargado **solo tras consentimiento** de cookies | `assets/consent.js`, función `cargarMeta()` |

**Consecuencia para mí:** el píxel de navegador no ve a quien rechaza cookies. Quien cubre ese
hueco es la API de Conversiones. Cualquier lectura de «leads» en el Administrador de Anuncios es la
suma de los dos, deduplicada.

### 5.2 · API de Conversiones y deduplicación

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

### 5.3 · El informe diario por anuncio

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

### 5.4 · Esquema de UTMs y etiquetado en el CRM

- Se capturan `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` y `ref`
  (`donde-se-rompe-tu-crecimiento/diagnostico.js:577`), se guardan en `sessionStorage` bajo
  `qv_utm` y viajan a la API con el registro.
- **Al CRM solo llega una etiqueta de origen: `utm-<source>`** (`api/fugas.js:144` y `:171`). El
  resto del recorrido —campaña, anuncio— queda únicamente en una nota de texto libre
  («Origen: utm_campaign=… · utm_content=…», `api/fugas.js:227`).

### 5.5 · Etiquetas de GoHighLevel que definen «cualificado»

De `api/fugas.js` y `api/informe.js`:

`diagnostico-crecimiento` · `qualivo-landing` · `radiografia-anonima` · `cuello-<x>` ·
`nivel-<x>` · `icp-1` · `sector-<x>` · `rol-<dueno|directivo|otro>` · `con-whatsapp` ·
`dx-AAAAMMDD` · **`diagnostico-completo`** · **`prioridad-alta`** · `utm-<source>` ·
**`reunion-reservada`** · **`cliente-ganado`**

Las cuatro en negrita son las que me sirven para el CPL cualificado. La pestaña «Web diario» ya
cuenta a diario `Registros GHL`, `De Meta`, `Prioritarios`, `Reuniones (acumulado)` y
`Clientes (acumulado)`.

---

## 6 · LOS AGUJEROS DE INSTRUMENTACIÓN

### 6.1 · El informe puede estar reportando cero anuncios sin que nadie se entere

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

### 6.2 · Mi KPI no es calculable por anuncio, y ese es el problema de fondo

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

### 6.3 · RESUELTO · el destino del tráfico es qualivo.io

Ayer dejé esto como la incógnita más peligrosa: el único documento de campaña del repositorio
(`content/campana-meta-agenttome.md`) es de **Agent for Me**, y su tabla de bloqueantes dice que
allí el píxel **no está instalado**. Si el dinero apuntaba a agentforme.io, estaba corriendo a
ciegas.

**No es el caso.** Leídas las creatividades, los tres anuncios van a
`qualivo.io/donde-se-rompe-tu-crecimiento/` con UTMs completas (§2). El gasto está medido.

Queda la nota de orden: ese documento de campaña **no describe lo que está corriendo**. La campaña
viva es `QV_HERO_LEADS_Sep26`, con tres creatividades HERO y un ángulo distinto del catálogo de
AtM. No hay documento de la campaña real. Cuando haya datos para decidir, lo escribo yo.

### 6.4 · El utm_content SÍ llega a la web, y se tira en el CRM

Matiz importante sobre §6.2, ahora que he visto las creatividades: los anuncios **ya vienen
correctamente etiquetados** con `utm_content=01|03|06`. Growth ha hecho bien su parte. El dato
llega al navegador, se guarda en `sessionStorage` y viaja a la API.

Donde se pierde es en `api/fugas.js`, que convierte en etiqueta de GoHighLevel **solo**
`utm_source`. El anuncio concreto acaba en una nota de texto libre y nadie lo puede cruzar.

Es decir: no falta instrumentar, **falta no tirar lo que ya está instrumentado**. Sigue siendo una
línea de código y sigue siendo de Growth, pero es aún más barato de lo que dije ayer.

## 7 · LO QUE PIDO A AGENTE GROWTH (instrumentación, es suya)

Ordenado por lo que más me bloquea. Ninguna toca presupuesto: son todas de medición.

| # | Petición | Por qué | Tamaño |
|---|---|---|---|
| 1 | Etiquetar el contacto con `utm_content` y `utm_campaign`, no solo `utm_source` | sin esto no hay CPL cualificado por anuncio (§6.2) | 2 líneas en `api/fugas.js` |
| 2 | Que el informe grite cuando `META_ADS_TOKEN`/`META_AD_ACCOUNT` faltan o fallan | hoy falla en silencio con `200 OK` (§6.1) | leer `ads.nota` y meterla en `resumen.errores` |
| 3 | Relleno hacia atrás del Sheet desde el primer día de gasto real | el cron solo puede haber corrido desde hoy (§5.3) | una llamada con `?fecha=&dias=` |
| 4 | ~~Confirmar el destino del tráfico~~ **RESUELTO por lectura de las creatividades: va a qualivo.io** (§6.3) | — | hecho |
| 5 | Escribir `paid/traspaso.md` con el ID del Sheet del embudo | el ID de la cuenta ya lo tengo (`act_3453332464718877`); el del Sheet no | una línea |
| 6 | **Por qué 15 visitas dan 2 inicios de Radiografía** (§3) | es la mayor pérdida del embudo hoy y es de la landing, no de la puja | diagnóstico de CRO |

Y una que es de Ops, no de Growth: **verificar que el `Purchase` lleva valor**. Hoy, si el
`monetaryValue` de la oportunidad viene vacío, se manda `value: 0` (`api/meta-evento.js`). Un
`Purchase` de 0 € entrena mal la puja y hace que cualquier ROAS sea mentira.

---

## 8 · LO QUE NO ES MÍO Y NO TOCO

| Cosa | Dueño |
|---|---|
| Píxel, API de Conversiones, eventos, webhook de GHL, landing, CRO, Radiografía | Agente growth |
| Fábrica de creatividades y `.claude/skills/director-creativo/` | Agente growth |
| El mensaje comercial y la oferta | Estrategia Central |
| Activar, subir presupuesto, cambiar pujas, gastar | **Maikel, siempre** |
| Google Ads de OutThink, cuenta `918-811-5388` | Agente Adigital |

**Sobre la oferta: H10 está cerrado y mi instrucción de ayer era la equivocada.** Escribí que
mandaba la matriz del 8-sep. Maikel firmó el 10-sep una tercera versión —`sistema/propuesta-de-valor.md`
en `main`, commit `4de891a`— que deroga esa matriz y también la propuesta de Leak Map. **Manda la
V1 definitiva.** La auditoría de los anuncios contra ella está en §4 bis. El «Sprint de
Recuperación 2.500-5.000 €» de la rama de growth también queda derogado: la V1 prohíbe precios en
abierto.

---

## 9 · CÓMO SIGUE ESTO

1. **10-sep, hecho.** Lectura de la cuenta. Las siete casillas de §1, rellenas.
2. **Hasta el 12-sep: no se toca.** La regla es 3-4 días o 50 € por anuncio. Dejar correr no es
   pereza, es la única forma de que 17 € compren una respuesta en vez de una anécdota.
3. **12-13 sep, primera decisión de verdad.** Con ~50 € gastados habrá base para saber si el
   problema es el anuncio, la landing o el evento de optimización.
4. **Lunes 14-sep, Paid Review con serie completa** y el primer experimento abierto con fecha de
   muerte a 14 días.
5. **Growth, en paralelo:** las peticiones 1 y 2 de §7. A partir de ahí el CPL cualificado es por
   anuncio y este documento deja de tener un agujero.

**Y una que no espera a nadie:** la caída de 15 visitas a 2 inicios de Radiografía (§3) es hoy el
número que más dinero cuesta, y no es mío. Va devuelta a Growth (landing) y a Estrategia Central
(promesa del anuncio frente a lo que se encuentra al llegar).

---

## 10 · CIERRE DE LA CAMPAÑA · 11-sep, 12:20 CEST

**Maikel pausó `QV_HERO_LEADS_Sep26` el 10-sep a las 23:00:10 UTC.** Consta en el registro de
actividad de la cuenta, actor «Maikel Echevarria Franconetti», `update_campaign_run_status`, Activa
→ Inactiva. No he sido yo: todas mis llamadas a Meta han sido de lectura.

La campaña vivió **de 9-sep 18:16 CEST a 11-sep 01:00 CEST**. Esta es la foto completa y final.

| Día | Gasto | Impresiones | Clics enlace | Visitas (Meta) | Leads |
|---|---|---|---|---|---|
| 9-sep | 4,17 € | 365 | 11 | 1 | 0 |
| 10-sep | 16,59 € | 764 | 14 | 4 | 0 |
| 11-sep (cola) | 0,20 € | 15 | 0 | 0 | 0 |
| **TOTAL** | **20,96 €** | **1.144** | **25** | **5** | **0** |

CTR de enlace 2,19 % · CPC 0,84 € · CPM 18,32 €. Fuente: Meta Ads API v21.0, 11-sep 12:20 CEST.

### En qué punto se cae, que es la pregunta del CEO Agent

Eventos del píxel `879197745226987` por día (todo el tráfico del sitio, solo quien acepta cookies):

| Día | PageView | HeroStart | HeroComplete | Lead |
|---|---|---|---|---|
| 9-sep | 5 | 4 | **4** | 3 |
| **10-sep** | **44** | **2** | **0** | **0** |

```
1 · Impresión → clic .......... 2,19 % CTR de enlace ........... SANO
2 · Clic → visita ............. entre 5 y 25 .................... NO MEDIBLE LIMPIO
3 · Visita → empezar el test .. 44 → 2  (≈4,5 %) ............... ◄── AQUÍ SE CAE
4 · Empezar → completar ....... 2 → 0 .......................... SIN BASE (n=2)
```

**El paso 1 funciona.** Un CTR de enlace del 2,19 % en frío es sano. El anuncio para el scroll.

**El paso 2 no lo puedo afirmar y no lo voy a inventar.** Meta cuenta 5 visitas de 25 clics, pero
`landing_page_view` depende del píxel y el píxel solo carga tras aceptar cookies. Las 44 PageView
del 10-sep, por su parte, incluyen tráfico orgánico y directo, no solo el pagado. La horquilla
honesta es **entre 5 y 25** y para cerrarla hace falta GA4 o los logs de Vercel, no Meta.

**El paso 3 es el que cuesta el dinero.** 44 visitas al sitio y 2 personas empiezan el test.

**Y el paso 4 no está roto, aunque lo parezca.** La prueba está en el 9-sep: cuando el equipo probó
el recorrido de extremo a extremo, **4 inicios dieron 4 completados y 3 Lead**. El test funciona.
Quien lo empieza, lo acaba.

> **Respuesta en una línea: hay clics y no hay completados porque casi nadie empieza. El problema
> es la página, no el anuncio.** Confirma tu heurística, y la confirma en el escalón de antes del
> que esperabas: no es que abandonen el test a la mitad, es que no lo abren.

**Y por eso no había que optimizar nada.** Con 25 clics no hay significancia para elegir ángulo,
público ni puja. Cambiar la puja sobre esto habría sido ruido caro.

### Los tres números para septiembre, para poner esto en contexto

El plan de septiembre fija **40-60 Radiografías completadas** (Meta + orgánico) como fuente de 5
conversaciones. Van **0 por la vía de pago**. A la tasa observada el 10-sep —44 visitas, 2 inicios,
0 completados— el presupuesto no es el cuello de botella: **el cuello es la portada del test.**
Arreglar eso vale más que cualquier cosa que yo pueda hacer con 15 €/día.


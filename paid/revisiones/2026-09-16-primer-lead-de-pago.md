# PRIMER LEAD DE PAGO · y no cualifica · 16-sep-2026, 15:36 CEST

```
AGENTE    qualivo.paid
CAMPAÑA   QV_CRM_VIDEO_Sep26 · día 1 · 83 % del presupuesto consumido
FUENTE    Meta Marketing API v21.0 + endpoint /leads del formulario 1006694072388659
```

## 1 · Los números del día, sin cerrar

| | Hoy | Referencia (campaña anterior) |
|---|---|---|
| Gasto | 16,67 € de 20 | 20,01 € |
| Impresiones | 235 | 953 |
| Alcance | 218 · frecuencia 1,08 | — |
| **CTR** | **7,66 %** | 3,15 % |
| CPM | 70,94 € | 21,00 € |
| Aperturas del formulario | 12 | 21 |
| Coste por apertura | **1,39 €** | 0,95 € |
| **Envíos de pago** | **1** | **0** |

## 2 · El lead existe y es nuestro

Recuperado del endpoint `/leads` del formulario, que es la fuente independiente:

```
creado      2026-09-16 13:13 CEST
is_organic  false
campaign_id 120245657051570358   ← la nuestra
ad_id       120245657153380358   ← el anuncio del vídeo v9
```

`leads_count: 2 · organic_leads_count: 1` → **1 de pago.** No es el contador de Meta diciéndolo: es
el formulario.

### Y por primera vez las dos fuentes coinciden

| | Meta dice | El formulario dice |
|---|---|---|
| 15-sep | `lead: 1` | 0 de pago |
| **16-sep** | **`lead: 1`** | **1 de pago** ✅ |

Hoy cuadran. Eso **no explica** la discrepancia de ayer — sigue sin explicarse — pero sí significa
que el marcador de hoy es fiable y que no hace falta desconfiar de este número.

## 3 · La letra pequeña: no cualifica

Las dos respuestas del formulario:

```
«¿Cuánto invertís al mes en conseguir clientes?»   →  NADA
«¿Dónde crees que se te escapan clientes?»         →  no sé
```

El suelo del ICP es «menos de 500 €». **«Nada» está por debajo del suelo.** Y «no sé» en la segunda
significa que ni siquiera tiene el problema identificado.

Traducido al número de este agente:

```
CPL bruto         16,67 €     ← la mitad de los 32,80 € de media de la cuenta a 90 días
CPL CUALIFICADO   sin calcular · 0 cualificados de 1
```

Esto es, literalmente, el modo de fallo escrito en la ficha de este agente:

> *«Optimizar CPL en vez de CPL cualificado y traer basura barata.»*

Un CPL de 16,67 € es un titular bonito. **No vale nada si el que entra no tiene presupuesto.**

## 4 · Lo que sospecho, con n = 1 y diciéndolo como sospecha

El vídeo cierra con **«PIDE AHORA EL DIAGNÓSTICO GRATUITO»** y el botón dice **«Enviar solicitud»**.
La palabra *gratuito* es un imán para quien no invierte nada: le sale gratis pedirlo.

**No lo afirmo.** Un lead no es una tendencia. Pero es la hipótesis que hay que vigilar, y si el
segundo y el tercero también contestan «nada», deja de ser sospecha y hay que cambiar el filtro:
o cualificar dentro del formulario, o quitar la gratuidad del titular.

## 5 · Colocaciones, con reserva por volumen

| Colocación | Gasto | Impr. | Clics | CPM |
|---|---|---|---|---|
| Facebook stories | 7,97 € | 64 | **12** | 124 € |
| Facebook feed | 4,03 € | 51 | 2 | 79 € |
| Instagram stories | 2,42 € | 87 | 3 | 28 € |
| Instagram feed | 2,25 € | 33 | 1 | 68 € |

Stories de Facebook se lleva 12 de los 18 clics con el CPM más caro. Instagram stories es la
impresión barata pero apenas convierte a clic. **Con 235 impresiones no toco nada**: repartir por
colocación con estos volúmenes es decidir con ruido.

## 6 · Qué hago

**Nada.** No sangra: entrega, tiene el mejor CTR que ha dado esta cuenta, y ha traído un lead real.
El día ni siquiera está cerrado.

El CPM de 70,94 € sigue siendo 3 veces el de la campaña anterior, y esa sigue siendo la factura de
apagar Advantage+. Pero con un CTR del 7,66 % el coste por apertura sale a 1,39 €, no muy lejos de
los 0,95 € de referencia. **El público estrecho se está pagando solo en calidad de clic. Lo que
todavía no se paga es en calidad de lead.**

## 7 · Lo que hay que ver mañana

1. **Si el segundo lead también dice «nada».** Ese es el dato que decide si hay que cambiar el filtro.
2. Si el CPM sigue bajando (128 € → 70,94 € en el día).
3. **H0.1 queda medio cerrada:** hoy los contadores coinciden. Sigue pendiente mirar GoHighLevel para
   saber si este lead entró en la cadencia y si alguien le escribe.

Y el token de Meta sigue sin rotar. Octavo día.

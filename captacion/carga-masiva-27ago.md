# Carga masiva del 27 de agosto y arreglo del cuello de botella

## El diagnóstico

Envíos por día:

| Día | Envíos |
|---|---:|
| 20-ago | 261 |
| 21-ago | 282 |
| 24-ago | 304 |
| 25-ago | 143 |
| 26-ago | **7** |
| 27-ago | 85 y subiendo |

No era un problema crónico. Las cohortes de julio y agosto terminaron su
secuencia y no había reposición.

**La matemática que faltaba.** Capacidad real: 275 envíos/día (5 buzones × 55).
Con una secuencia de 3 pasos, cargar N leads al día produce unos **3N envíos
diarios** en régimen estacionario. Para llenar 275 hacen falta **~90 leads
nuevos al día**. La rutina diaria pedía 30-40. Eso fija un techo estructural de
unos 110 envíos/día, que es exactamente lo que se estaba viendo.

## El reparto también estaba mal

Últimos 7 días: 158 emails 1 contra 663 follow-ups. El 81% del volumen eran
pasos 2 y 3.

| Paso | Envíos totales | Respuestas | Tasa |
|---|---:|---:|---:|
| Email 1 | 1.057 | 22 | 2,08% |
| Email 2 | 573 | **0** | **0,00%** |
| Email 3 | 297 | 2 | 0,67% |

573 emails 2 y cero respuestas.

## Margen para escalar

Rebote de los últimos 7 días: **0,49%**. Aperturas 35,8%. El umbral de peligro
es el 3%. La regla de descartar dominios catchall, introducida el 25 de agosto,
es lo que ha llevado el rebote ahí.

## Lo que se ha hecho hoy

- **79 leads cargados** en total: 36 por la mañana y 43 por la tarde.
- 130 créditos de Apollo consumidos.
- Objetivo diario de la rutina subido de 30-40 a **90**, con la explicación de
  la matemática dentro del propio guion para que no se vuelva a bajar sin
  motivo.

Estado del depósito tras la carga:

| Campaña | Enviados | notStarted | En curso |
|---|---:|---:|---:|
| Inmobiliarias (3772173) | 631 | 26 | 156 |
| Solar (3767479) | 468 | 17 | 133 |

## Lo que NO se ha hecho, y por qué

**Los 10 buzones dormidos siguen a cero.** Se propusieron como palanca, pero
hay 190 envíos diarios de capacidad sin usar en buzones al 100% de reputación.
Encender buzones al 58-66% mientras sobra capacidad sana es repetir el error que
provocó el colapso del 26 de agosto. La regla queda escrita en la rutina: subir
esos buzones solo cuando los cinco sanos estén saturando los 275 y el rebote
siga por debajo del 1%.

**No se han tocado las secuencias.** Cortar los emails 2 y 3 liberaría unos 660
envíos semanales que hoy rinden 0,00% y 0,67%, pero exige un POST sobre campañas
con 289 leads en curso, que es justo lo que provocó los dos incidentes de
reenvíos. Queda propuesto, no ejecutado.

## Un error mío

Sondeando qué campos acepta `POST /campaigns/{id}/settings`, dos de las pruebas
escribieron de verdad sobre la campaña de Inmobiliarias: `follow_up_percentage`
pasó a 30 y `unsubscribe_text` a "x". Se detectó al momento y se restauraron a
100 y vacío. Ninguna secuencia ni ningún lead se vieron afectados y el guardián
de reenvíos sigue en cero. Aun así fue un POST a ciegas sobre una campaña con
156 leads en curso.

`max_leads_per_day` no es escribible por ese endpoint. Se queda en 55 para
Inmobiliarias y 30 para Solar, que suman 85 leads nuevos al día y encajan con el
objetivo de 90.

## Hallazgo sobre el pool

El vertical inmobiliario está más agotado de lo que sugieren sus 10.679
registros. La página 3 del filtro owner/founder devolvió mayoritariamente
cuentas ya contactadas. De 133 decisores enriquecidos hoy, 33 cayeron por
dominio catchall y 11 por duplicado.

Páginas consumidas: inmo 10 (siguiente, la 11), solar 3 del tag nuevo
(siguiente, la 4).

# Estructura y presupuesto que yo montaría · 1-oct-2026

Propuesta de Paid. **Nada de esto está ejecutado**: activar y mover presupuesto es
de Maikel, y desde el 30-sep tampoco pauso sin su OK.

---

## 1 · Qué hay montado ahora mismo

**Corriendo · 35 €/día**

| campaña | conjunto | presupuesto | anuncio |
|---|---|---|---|
| QV_VERTICALES_Sep26 | formación | 20 €/día | `AD · VERT · formacion` (vídeo viejo, form viejo) |
| QV_VERTICALES_Sep26 | clínicas | 15 €/día | `AD · VERT · clinicas` (vídeo viejo) |

**Parado**

- `QV_3VERTICALES_Sep26` → reformas, pausada desde el 30-sep a las 14:45
- asesorías, muerta
- `QV_TEST_DOLOR_FORMACION` → 3 conjuntos a **10 €/día** cada uno
- `QV_TEST_DOLOR_CLINICAS` → 3 conjuntos a **10 €/día** cada uno
- el anuncio del formulario con precio, congelado desde el 28-sep

Los seis creativos nuevos, con sus ángulos:

| anuncio | titular | forma |
|---|---|---|
| `S1_PLA_v2_9x16` | *Tu agenda llena. Tu aula, no.* | el plantón |
| `S1_CUR_v2_9x16` | *El lead barato te sale carísimo.* | el lead curioso |
| `S1_VEL_v2_9x16` | *No fue el precio. Llegaste tarde.* | la velocidad |
| `CLI_HUE_v1_9x16` | *Ese hueco ya lo habías pagado.* | el hueco perdido |
| `CLI_VEL_v1_9x16` | *No fue el precio. Nadie le contestó.* | la velocidad |
| `CLI_PRI_v1_9x16` | *No contrates a nadie más en recepción todavía.* | la priorización |

Los ángulos son buenos y están bien diferenciados. El de recepción me parece el
mejor copy que hemos escrito.

---

## 2 · Dos problemas del montaje, antes de hablar de dinero

### a) Seis conjuntos a 10 €/día no van a aprender nunca

Es **mi propio error del 20-sep**, repetido. Partí el presupuesto en un conjunto
por vertical para que Meta no reasignara, y acabé con conjuntos demasiado pequeños
para salir de la fase de aprendizaje. Lo registré como H-APRENDIZAJE-01 el 25-sep.

Con 10 €/día y un envío cada 17,74 € de gasto, cada conjunto produce **0,6 envíos
al día**. Meta necesita del orden de 50 conversiones por semana y por conjunto para
optimizar; esto da 4. Seis conjuntos en aprendizaje permanente entregan peor y más
caro que dos conjuntos maduros.

**Y aquí está la distinción que importa:** separar por **vertical** sí tiene
sentido, porque son públicos y ofertas distintos que queremos medir por separado y
no queremos que Meta mueva dinero entre ellos. Separar por **ángulo** dentro del
mismo vertical, con el mismo público, **no**: elegir el mejor anuncio para cada
persona es exactamente lo que Meta hace bien. Los seis ángulos deben ser
**anuncios dentro del conjunto del vertical**, no conjuntos aparte.

### b) Los seis creativos son solo 9:16, y el 87 % del gasto va a feed

Los seis son vídeo único vertical, sin `asset_feed_spec` ni reglas de
personalización por colocación. Y sus conjuntos sirven en feed **y** en stories.

En el anuncio viejo de formación, el reparto real fue: instagram/feed 83,93 € +
facebook/feed 31,59 € = **87 % del gasto en feed**. Un 9:16 en feed se recorta o se
sirve con bandas y rinde peor.

**Esto hay que arreglarlo antes de encenderlos**, y es exactamente lo que hicimos
el 17-sep con los cuatro viejos: una versión 4:5 para feed y la 9:16 para stories,
dentro del mismo anuncio. Yo lo monto si me pasan los 4:5 exportados; recortarlos
yo daría un resultado peor que exportarlos bien.

---

## 3 · La estructura que yo montaría

**Tres conjuntos, 70 €/día.** Ni uno más.

| campaña | conjunto | presupuesto | anuncios dentro |
|---|---|---|---|
| QV_VERTICALES | **formación** | **30 €/día** | el vídeo viejo + `S1_PLA` + `S1_CUR` + `S1_VEL` |
| QV_VERTICALES | **clínicas** | **25 €/día** | `CLI_HUE` + `CLI_VEL` + `CLI_PRI`, el viejo pausado |
| QV_3VERTICALES | **reformas** | **15 €/día** | el vídeo viejo (es el único que hay) |

Las dos campañas `QV_TEST_DOLOR` se quedan vacías. No se borran todavía, por si
hace falta volver, pero no se encienden.

**Por qué ese reparto, con los números de hoy:**

| | €/reunión celebrada | €/envío | por qué |
|---|---|---|---|
| formación | **51,90 €** | 14,83 € | el mejor por reunión, con margen amplio. Se lleva el presupuesto mayor y los tres ángulos nuevos para empujar contra el vídeo viejo. |
| clínicas | 87,92 € | 35,17 € | **100 % de asistencia, 2 de 2.** Convierte mejor que nadie y capta caro: es el que más necesita creativo nuevo. Entra solo con los nuevos. |
| reformas | 94,90 € | **12,65 €** | el envío más barato, cero leads perdidos en el arranque y **la única negociación abierta**. Se mantiene, no se toca. |
| asesorías | — | — | muerta. |

**En clínicas quito el vídeo viejo a propósito.** Es el único sitio donde el
creativo viejo está claramente agotado: CPM el doble que formación y 13,29 € por
apertura desde que se reencendió. Dejarlo dentro se comería parte del reparto.

---

## 4 · Qué esperaría de eso

A las tasas de hoy (17,74 €/envío, 23,5 % de los envíos llegan a reunión):

| | ahora (35 €/día) | propuesta (70 €/día) |
|---|---|---|
| envíos/semana | ~14 | **~28** |
| reuniones celebradas/semana | ~3 | **~6-7** |
| coste por reunión | 75,39 € | **~74 €** (igual) |
| gasto semanal | 245 € | **490 €** |

No prometo que el coste por reunión baje: prometo que **no empeora** y que el
volumen se duplica. Si los creativos nuevos funcionan, el coste baja; si no,
seguimos donde estamos y lo sabremos en una semana.

**El techo no da para mucho:** quedan unos 412 € en `QV_VERTICALES` y 157 € en
`QV_3VERTICALES`. A 70 €/día son **ocho días**. Habría que subirlos alrededor del
9-oct, y aviso antes.

---

## 5 · Si la caja no da para 70 €/día

**Versión prudente, 45 €/día** (lo mismo que gastamos ahora):

| conjunto | presupuesto |
|---|---|
| formación | 20 €/día |
| clínicas | 15 €/día |
| reformas | 10 €/día |

Mismos anuncios, misma estructura. Aprende más despacio pero no gasta más de lo
que ya gastamos. **Entre las dos opciones, lo que no haría es 95 €/día** — que es
lo que saldría de encender todo lo que está montado.

---

## 6 · Lo que dejo fuera a propósito

**El formulario con precio.** Los seis creativos nuevos apuntan a los formularios
viejos, así que H-PRECIO-01 sigue congelada en 8 aperturas. La dejo congelada: con
el CTR de la cuenta partido por dos, el test de creatividad es la palanca grande y
**dos tests a la vez sobre 34 leads no se pueden separar.** Primero creatividad,
luego formulario.

**La confirmación de la víspera.** Sale de la lista: 3 de los 4 plantones ya tenían
la cita confirmada. Lo que propongo probar en su lugar es **acortar la distancia
hasta la cita**, pero eso no es mío.

---

## 7 · Lo que necesito para ejecutarlo

1. **OK al presupuesto**: 70 o 45 €/día.
2. **Los seis vídeos en 4:5** para montar la versión de feed. Sin eso, encenderlos
   es pagar feed con un creativo que no encaja.
3. Subir los topes de campaña alrededor del 9-oct.

Con el OK y los 4:5, lo monto en pausado y queda a un clic tuyo.

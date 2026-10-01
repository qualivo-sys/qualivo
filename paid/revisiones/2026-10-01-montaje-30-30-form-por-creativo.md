# Montaje del 1-oct: 30 + 30 €/día y un formulario por creativo

Ejecutado por instrucción de Maikel el 1-oct a las 10:03 CEST:
*"reformas de momento lo vamos a dejar en pausa y vamos a poner 30 y 30 en
formación y clínicas con los vídeos … y haz esto de los form id"*.

## Estado

| campaña | conjunto | presupuesto | estado |
|---|---|---|---|
| QV_VERTICALES_Sep26 | formación `120245699224780358` | **30 €/día** | activo |
| QV_VERTICALES_Sep26 | clínicas `120245699228280358` | **30 €/día** | activo |
| QV_3VERTICALES_Sep26 | reformas | — | pausada (decisión de Maikel) |
| QV_TEST_DOLOR_FORMACION / _CLINICAS | 6 conjuntos de 10 € | — | pausadas, sin usar |

**Total: 60 €/día.**

## Anuncios dentro de cada conjunto

**Formación** — el vídeo viejo más tres ángulos nuevos:

| anuncio | id | formulario | ángulo |
|---|---|---|---|
| `AD · VERT · formacion` | 120245699600960358 | **1786744439184083** (original) | vídeo viejo |
| `AD · VERT · S1_PLA · form propio` | 120245892933780358 | **1117304254006220** | el plantón |
| `AD · VERT · S1_CUR · form propio` | 120245892934550358 | **2076998082916565** | el lead curioso |
| `AD · VERT · S1_VEL · form propio` | 120245892935420358 | **2554711344941279** | la velocidad |

**Clínicas** — el vídeo viejo se queda, por la objeción de Maikel (las dos
reuniones celebradas de clínicas salieron de él):

| anuncio | id | formulario | ángulo |
|---|---|---|---|
| `AD · VERT · clinicas` | 120245699601980358 | **1479297290674260** (original) | vídeo viejo |
| `AD · VERT · CLI_HUE · form propio` | 120245892935740358 | **1110031651473942** | el hueco perdido |
| `AD · VERT · CLI_VEL · form propio` | 120245892936080358 | **1491348962802729** | la velocidad |
| `AD · VERT · CLI_PRI · form propio` | 120245892936260358 | **1077322415038373** | la priorización |

## Para qué sirve el formulario propio

Cada formulario nuevo es un duplicado exacto del original de su vertical —mismas
siete preguntas, misma tarjeta de contexto, misma página de gracias— comprobado
pregunta por pregunta. Lo único distinto es el id, y el nombre lleva el código del
creativo.

GoHighLevel ya etiqueta cada contacto con `form-<id>`. Así que a partir de hoy
**el id del formulario identifica el creativo**, y por primera vez se puede
calcular **coste por reunión celebrada por anuncio**, no solo por vertical.

La página de gracias y la URL de seguimiento llevan además `utm_content=<creativo>`
por si alguien pasa a la web.

## Lo que hay que comprobar con el primer lead de cada formulario nuevo

1. Que GoHighLevel lo recibe (el webhook es a nivel de página, debería).
2. Que le pone la etiqueta `form-<id nuevo>`.
3. Que le pone también la etiqueta `sector-<vertical>`. **Si el sector se deduce
   del id del formulario en alguna lista fija, los formularios nuevos podrían
   entrar sin sector.** La atribución no se rompe —el `form-<id>` basta, este mapa
   lo traduce— pero la cadencia o el scoring podrían depender de esa etiqueta.
4. Que arranca la cadencia (`act-wa1`).

## Pendiente

- **Versiones 4:5 de los seis vídeos nuevos.** Son solo 9:16 y sirven también en
  feed, donde va el ~87 % del gasto. Funcionan, pero peor de lo que podrían.
- **Techo:** a 60 €/día sobre `QV_VERTICALES_Sep26`, con ~410 € de margen hasta
  los 800 €, quedan unos 7 días. Aviso hacia el 7-oct.

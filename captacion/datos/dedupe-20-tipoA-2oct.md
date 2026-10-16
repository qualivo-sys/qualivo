# Dedupe de las 20 cuentas de tipo A · 2-oct-2026

Cierra el aviso obligatorio del apartado 2 de `content/propuestas-areas/2026-10-05-outbound.md`:
*«No he podido deduplicar. Sin claves de Smartlead en esta sesión no he cruzado estas 20 contra los
4.778 dominios ya cargados.»*

Cruzado contra **5.845 empresas y 4.840 dominios** que existen hoy en Smartlead, en cualquier
campaña y cualquier estado, más la lista de clientes bloqueados.

## Resultado: 18 limpias, 2 ya tocadas

| Cuenta | Veredicto | Detalle |
|---|---|---|
| Hotelverse | **YA TOCADA** | `fermin.carmona@hotelverse.tech`, campaña «V3 · Motor de puertas», estado COMPLETED |
| Smowltech | **YA TOCADA** | `ricardo.vea@smowltech.com`, campaña «Academias ES · Q3 2026 · voz Maikel», estado PAUSED |
| Las otras 18 | limpias | sin rastro en Smartlead ni en la lista de bloqueo |

Las dos son choques **de dominio, no de persona**: en los dos casos escribimos a otra persona de esa
empresa. No es exclusión automática, es una decisión: escribir a un segundo contacto de una empresa
que ya recibió correo nuestro y no contestó no es lo mismo que una cuenta fría.

Smowltech además está en una campaña **PAUSED**, lo que significa que su secuencia se cortó a medias.

## Un falso positivo de mi propio comparador, por si alguien repite el cruce

La primera pasada marcó **«AND & OR»** como choque contra `andorrafreetours@gmail.com`. No lo es:
normalizando a letras y números, «AND & OR» queda en `andor`, que está contenido dentro de
`andorrafreetours`. Comparar por subcadena sobre nombres cortos de empresa produce esto.

Quien repita el cruce: el mínimo de 5 caracteres no basta para nombres de 5 letras. Hace falta o
comparar por dominio, o exigir coincidencia de palabra completa.

## Lo que sigue faltando y no es mío

El Orchestrator pide **«un fichero de descartes que persista»**, porque el pool de Apollo devuelve lo
ya rechazado a mano (le salió Lizarte, descartado el 1-oct por ser fabricación). Eso no existe
todavía. `captacion/scripts/prefiltro_leads.py` deduplica contra Smartlead y contra la lista de
clientes, pero **no contra los descartes manuales**, porque no hay dónde leerlos.

Es un fichero, no un proyecto: una lista de dominios con la fecha y el motivo. Sin él, cada ciclo de
Apollo vuelve a proponer lo mismo y alguien lo vuelve a descartar a mano.

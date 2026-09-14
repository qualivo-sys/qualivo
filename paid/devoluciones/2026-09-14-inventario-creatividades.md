# Creatividades de la campaña de diagnóstico · 14 sep 2026

Inventario de lo que está corriendo **ahora mismo**, leído de la API de Meta, no
de memoria. Sirve para dos cosas: saber qué hay encendido y poder atribuir
resultados cuando lleguen los primeros datos.

## Qué está activo

| | |
|---|---|
| Campaña | `QV_DIAG_LEADFORM_Sep26` · 120245598917380358 · **ACTIVE** |
| Conjunto | ES · 25-65 · Advantage+ · dinámico · **30 €/día** |
| Anuncio | 120245599268040358 · dinámico |
| Creative | `1763516651231174` (v2, desde el 14-sep) |
| Formulario | `2138310840433939` (v2, texto corregido) |
| Campaña hermana | `QV_DIAG_LANDING_Sep26` · **PAUSED** a propósito |

La versión 1 del creative (`2154944008704196`) y del formulario
(`1006694072388659`) quedan retirados: apuntaban al formulario con el texto
viejo.

## Los cuatro titulares

1. Así se te escapa el dinero entre el anuncio y el cierre
2. Siete avisos encendidos. Y tú, pisando a fondo
3. Tu negocio no está enfermo. Está perdiendo dinero por el camino
4. Encontramos la fuga. Ponemos un agente justo ahí

El 4 es el único que nombra el mecanismo. Los otros tres abren por la fuga, que
es el orden que fija la propuesta de valor. Merece la pena mirar si el 4 rinde
distinto: si gana, dice algo sobre cuánto sabe ya el mercado.

## Los cuatro cuerpos

**Cuerpo 1 · el mecanismo.** Abre con lo que hacemos y cierra con la garantía.
Es el más cercano a la propuesta V1 palabra por palabra.

**Cuerpo 2 · los ocho puntos.** Lista el recorrido entero y remata con los
quince minutos.

**Cuerpo 3 · las cuatro escenas.** Cuatro cosas concretas que le están pasando
hoy, y el remate de que ninguna sale en un informe.

**Cuerpo 4 · la tesis contraria.** «Todo el mundo mira los anuncios y el dinero
casi nunca se pierde ahí.» El más diferencial de los cuatro.

## Las cuatro descripciones

- Si no mejora, no pagas el piloto
- Diagnóstico gratuito de 15 min
- Quince minutos. Plan por escrito
- Diagnóstico de 15 minutos

## Imágenes

Nueve, no diez. El quinto concepto de la tanda WOW (el plano) se descartó el
11-sep y no se llegó a elegir sustituto entre las tres alternativas que había
sobre la mesa: presupuesto tachado, cubo con tres fugas, informe con post-its.

Sigue pendiente de decisión.

## Lo que hay que corregir en el copy

Esto lo detectó una revisión contra la guía de voz el 14-sep, con la campaña ya
encendida:

| Dónde | Qué dice | Qué debería decir |
|---|---|---|
| Cuerpo 2 | «formularios, el **lead**, el tiempo de respuesta» | «el **contacto**» |
| Cuerpo 3 | «Te entran **leads** que probablemente nunca iban a comprarte» | «**contactos**» |
| Cuerpo 4 | «En el **lead** que tarda seis horas» | «En el **contacto**» |
| Cuerpo 4 | «**Sales con** un plan por escrito» | «**Te mandamos** el plan por escrito en 24 horas» |

«Lead» está prohibido en la guía de voz cuando existe alternativa natural, y
aquí la hay. Y lo del plan ya se corrigió en la web y en el formulario el mismo
día: dejarlo distinto en el anuncio es prometer dos cosas diferentes en el
mismo recorrido.

**No se ha corregido todavía a propósito.** Tocar el creative obliga a crear
uno nuevo (los de Meta son inmutables) y eso reinicia el aprendizaje. Hoy ya se
ha hecho una vez por el formulario. Hacerlo dos veces el mismo día es tirar la
poca señal que haya recogido.

Decisión: se corrige **cuando toque el primer cambio de creatividades**, o el
día 7 si para entonces hay que tocar algo. Si el copy se queda corriendo
semanas, se corrige igualmente: la incoherencia del plan pesa más que el
aprendizaje de un día.

## Qué medir cuando haya datos

No el CTR. **El coste por cita.** El ángulo del creativo viaja hasta la cita a
través de `utm_content`, que entra en el CRM como etiqueta `creativo-…`, así que
se puede saber cuál trajo a alguien que se sentó quince minutos y no solo cuál
tuvo más clics.

Umbrales ya fijados en el parte diario: aviso si el CPL del día pasa de 45 €, o
si un conjunto gasta más de 25 € sin un solo contacto.

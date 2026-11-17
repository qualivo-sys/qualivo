# Comparativa semanal por formulario · semanas 45 y 46 (2-15 nov 2026)

Entregada el 17-nov. Tocaba el lunes 16 y llega un día tarde.
Fuentes:
- Meta Insights a nivel de anuncio y la API de leads de cada formulario.
- Búsqueda de contactos en GHL.

Todo consultado el 17-nov a las 07:40 UTC. Todo es [C] salvo lo marcado [E]. El contacto de demo (`demo-anuncio`) está excluido. Sin datos personales.

## Semana 46 · 9-15 nov

| Anuncio / formulario | Gasto | Clics | Leads Meta | Leads GHL | Calidad en GHL |
|---|---|---|---|---|---|
| Formación vídeo viejo · FORM CUALIF (2063720777591278) | 177,06 € | 19 | 3 | 2 | 1 nivel-d descartado · 1 nivel-b marcado `lead-falso` |
| RT Javier · FORM CUALIF | 33,80 € | 3 | 1 | 1 | nivel-a, agendado. Marcado `no-encaja`/`lead-falso` y luego reservó reunión para el 17-nov (ver nota) |
| Formación vídeo viejo · FORM V2 (2252569821991323) | 50,45 € | 12 | 0 | 0 | — |
| **Total** | **261,31 €** | 34 | **4** | **3** (+1 suprimido por RGPD) | 0 leads válidos confirmados |

## Semana 45 · 2-8 nov

| Anuncio / formulario | Gasto | Clics | Leads Meta | Calidad en GHL |
|---|---|---|---|---|
| Formación vídeo viejo · FORM CUALIF | 197,90 € | 44 | 5 | 3 nivel-a · 1 nivel-c · 3 agendados (1 no-show) · 1 descalificado |
| E03 formulario corto | 11,07 € | 21 | 1 | `lead-falso` |
| E03/E03b/E03d/E03e formulario de 4 preguntas | 77,37 € | 11 | 1 | nivel-d descartado |
| E04 reformas formulario de 4 preguntas | 35,62 € | 12 | 1 | nivel-d descartado |
| **Total** | **321,96 €** | 88 | **8** | 3 agendados, todos del FORM CUALIF |

## Lectura

1. **El único formulario que ha dado reuniones en noviembre es el FORM CUALIF con el vídeo viejo.** Dio 3 de 3 en la semana 45. En la semana 46 cayó a 0 leads válidos con un gasto parecido (177 € frente a 198 €). Los clics bajaron de 44 a 19, lo que encaja con el desgaste de la creatividad.
2. **El FORM V2 no llegó a demostrar nada:** 50 € y 12 clics, con 0 envíos. Es una muestra demasiado pequeña para juzgar el formulario. El problema estuvo antes del formulario: el vídeo está gastado y Reels se llevó el 63 % del gasto.
3. **Los formularios cortos y los de 4 preguntas atraen leads de mala calidad:** de 3, salieron 2 nivel-d y 1 falso. No los repetiría.
4. **Hay 1 lead en Meta que no está en GHL, pero no se ha perdido.** Es el del 11-nov, del FORM CUALIF. Está en la lista de supresión RGPD del webhook (`SUPRIMIDOS` en `api/meta-leadform.js`): pidió que se borraran sus datos y no se vuelve a importar. La entrega al CRM fue correcta [C, código del webhook, 17-nov].

## Nota sobre el lead del retargeting

Lleva `no-encaja`/`lead-falso` y se mandó a Meta como Disqualified. Aun así reservó y confirmó una reunión para el 17-nov a las 16:00. Si se celebra, Maikel decide si se le quitan las etiquetas. No lo he tocado.

## Estado

La cuenta está en pausa desde el 16-nov a las 20:45, por decisión de Maikel. Gasto de noviembre del 1 al 16: 658,30 € de 1.450 €. El siguiente experimento es el vídeo nuevo de formación V2, cuando Maikel lo apruebe.

# Anunciantes con fugas verificadas · lista viva

Empresas ya cargadas en campañas que llevan píxel de Meta o etiqueta de Google
Ads en su web (están pagando por tráfico) y a la vez tienen una fuga de
captación comprobada por el probe. Son el tier caliente para el ángulo
"estás pagando por visitas que aterrizan donde no se capturan".

Detectadas el 27-ago (primer día del dataset):

| Dominio | Vertical | Fuga verificada |
|---|---|---|
| atraeinmobiliaria.com | inmobiliarias | sin formulario, sin medición propia, solo info@ |
| formacionh2o.es | academias | sin formulario, solo info@ |
| elison.es | academias | sin formulario, solo info@ |
| adelfas.es | solar | sin formulario en la home |
| globaenergy.com | solar | sin formulario en la home |
| nerosolar.com | solar | sin formulario en la home |
| rgmfincas.com | inmobiliarias | píxel puesto pero sin GTM/GA4, solo info@ |
| sosenergia.es | solar | solo info@ |
| keyrealestates.com | inmobiliarias | solo info@ |
| aprendeinglestoday.com | academias | solo info@ |
| alvaria.es | inmobiliarias | píxel sin medición propia |

Uso: cuando uno de estos abra 3+ veces o cliqué, sube directo a llamada o a
secuencia SDR personalizada con este ángulo. Estos leads ya están en las
campañas genéricas; el ángulo de anunciante se usa en el follow-up manual o
en el toque de LinkedIn, no duplicando emails.

El dataset completo vive en `captacion/datos/probe-dataset.csv` y crece cada
día con la carga (paso añadido a la rutina diaria). Primer corte con 100 webs:
40% sin formulario en la home, 46% sin ninguna medición, 31% con solo un
buzón genérico. Cuando la muestra pase de 500, hay informe publicable.

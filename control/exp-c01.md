# EXP-C-01 · cohorte experimental cerrada · abierta 5-oct-2026

Encargo de Maikel: aplicar su estructura del 5-oct desde el correo 1, como cohorte cerrada, sin
tocar el copy durante la tanda.

## Las reglas, suyas y no negociables durante la tanda

1. Misma estructura en los tres correos, de principio a fin.
2. **Ninguna modificación de copy mientras la tanda esté viva.**
3. Nada que sea una inferencia se presenta como hecho. **Tener el píxel o GA4 instalado demuestra
   tecnología instalada, no que midan correctamente las solicitudes ni las matrículas.**
4. La ausencia no es afirmable. Regla del 31-ago: HubSpot inyecta formularios por JavaScript, así
   que «no tenéis formulario» no se puede decir.
5. **Clics y aperturas no son señal de éxito.** Se mide respuesta humana, respuesta positiva,
   conversación, reunión y SQL.

## Son 18, no 24, y el motivo importa

De los 24 de clase C, **15 no tenían ninguna tecnología de medición detectada**. La estructura
exige un hecho en la primera línea, así que aplicarla a esos 15 era inventarse algo.

Volví a sondear los 15 buscando cualquier hecho verificable que no fuera medición: formularios,
WhatsApp, teléfono directo, calendario, año de fundación. **Nueve lo tenían. Seis no.**

| | Leads | El hecho de la primera línea |
|---|---:|---|
| **Estrato FUERTE** | **9** | tecnología de medición: píxel de Meta, GA4, etiqueta de Google Ads o GTM |
| **Estrato DÉBIL** | **9** | canal de contacto observado: formularios o teléfono directo |
| *Fuera* | 6 | **ningún hecho verificable** |

Los seis que se quedan fuera: CeGe Global y Agem Consultores (su web no resuelve), Clicollege
(devuelve 202, un WAF bloquea la sonda), y Developair, Neurologyca y Recodme (la web carga pero no
hay nada medible más allá del título).

**Lo que sale de esto, y es mejor que la cohorte original:** la cohorte tiene dos estratos, así que
al leer las respuestas se puede ver si **la fuerza del hecho** cambia algo. No cuesta nada y es una
pregunta que no nos habíamos hecho.

## Qué se ha cargado

| Campaña | Leads |
|---|---:|
| Formación · Intelligence (4042994) | 6 |
| Servicios B2B · Intelligence (4042995) | 12 |

`ok:true` en los dos lotes. 6 y 12 subidos, 0 bloqueados, 0 duplicados, 0 correos inválidos.

**Verificado leyendo de vuelta: 18 de 18** con los cuatro campos, ninguno con `¿Te la paso?` en el
correo 2 (que es el re-pedir permiso prohibido), ninguno con una inferencia presentada como hecho.

La cohorte **no vive en una campaña aparte**: se aísla por su lista de miembros, que está en el
scratchpad como `exp_c01_roster.json` con el estrato y el hecho de cada uno. No hacía falta crear
nada nuevo para poder medirla.

## Cómo se mide, y cómo no

`delivered → human reply → positive reply → conversation → meeting → SQL`

**Aperturas y clics no entran.** Están medidos desde el 1-oct como contaminados: en las campañas
que salían por los dominios de SURBL, 26 de 34 clics ocurrieron en menos de dos minutos del envío,
o sea escáneres de seguridad.

Con 18 leads **no se va a demostrar nada estadísticamente**, y eso ya lo dijo Maikel al encargarlo.
Lo que se puede hacer es leer las respuestas una a una y ver si la hipótesis genera conversación.

## Y una cosa que NO se hace

**No subir volumen mañana porque hoy salieron 86 y ninguno por los dominios problemáticos.** Orden
expresa de Maikel: primero se ven la entregabilidad y las respuestas de esta cohorte durante unos
días.

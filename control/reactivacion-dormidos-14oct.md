# Reactivación de los leads dormidos · 14-oct-2026

Maikel: «entra todo, adapta el mensaje a cada uno y ya está».

Esto documenta qué pasó con cada uno de los 1.778 leads que estaban cargados en
campañas pausadas, por qué solo 221 podían recibir un correo honesto, y qué se
hizo con el resto.

## Por qué no se despausaron las campañas viejas

Reanudar una campaña con leads a medias reinicia secuencias y reenvía a quien ya
recibió. Construcción ES tenía 1.028 envíos hechos y 161 leads sin empezar en la
misma campaña: despausarla habría escrito por segunda vez a los 1.028. Es
exactamente lo que vigila `guardia_reenvios.py`.

En su lugar se sacó cada lead de su campaña pausada y se cargó en la campaña de
Intelligence que le toca, con copy nuevo. Mismo resultado, sin riesgo de
reenvío, y además deja de existir el peligro de que alguien despause mañana una
campaña vieja y el lead reciba dos correos.

## De 1.778 a 221

| Filtro | Se caen |
|---|---:|
| Correo personal (gmail, hotmail, yahoo), no empresa | 818 |
| Buzón de rol (info@, contacto@, administracion@) | 518 |
| Sin nombre de pila: imposible personalizar | 220 |
| Fuera de España por dominio de primer nivel | 48 |
| **Pasan calidad** | **386** |
| Ya habían recibido un correo nuestro | 1 |
| Su web no responde | 63 |
| Su web responde pero no tiene ninguna señal verificable | 80 |
| **Entran** | **221** |

Los filtros se solapan, por eso las restas no cuadran a mano.

## Los 1.363 de Infoproducto no eran empresas

Es el hallazgo que cambia la lectura. Son cuentas de Instagram raspadas con
Mailerfind: el campo «empresa» es el usuario (`nomadito_`,
`albaalonso_saludintegrativa`, `lipsbyrous`) y el correo es un Gmail personal.
De ahí salen casi todos los 818 correos personales.

Se sondearon sus 192 dominios supervivientes uno a uno con curl. Responden 133 y
solo 69 tienen una señal verificable. Esos 69 entran con copy honesto. Los demás
no, porque no hay primera línea que escribir sin inventarla, y la regla es que
sin señal verificada el lead no entra.

## El dedupe que teníamos estaba mal

`contactados.json` lista lo **cargado** en Smartlead, no lo **enviado**. Al
cruzar los dormidos contra él salían 381 de 386 como duplicados, cuando esos
leads estaban ahí precisamente por estar en esas campañas: el cruce era circular.

Se rehízo leyendo `sent_time` de `/statistics`, que es lo único que dice quién
recibió algo de verdad: 4.712 direcciones y 3.970 dominios. De nuestros 386,
solo 1 había recibido un correo. Queda en `enviados_reales.py`.

## El copy

V3, señal verificada en la primera línea, entre 82 y 90 palabras, con un assert
por lead. Ejemplo real:

> Hola Manuel,
>
> He mirado Núbica y lleváis Mailchimp.
>
> Con la lista montada, lo que casi nadie ata es quién persigue al que pide
> presupuesto y no cierra.

Hubo que añadir un tercer escalón de recorte: con «Google Tag Manager instalado»
más «Midiendo el tráfico,» ni la versión corta bajaba de 90 palabras. El límite
de palabras manda sobre la redacción.

## Dos fallos corregidos sobre la marcha

1. **«España» contiene «spa»**, así que el clasificador de vertical mandaba
   empresas de software a la campaña de clínicas. Las claves de cuatro letras o
   menos ahora exigen límite de palabra.
2. **`ignore_duplicate_leads_in_other_campaign: true` no sirve.** La primera
   carga devolvió `upload_count: 221` y `total_leads: 0`, con
   `skipped_in_other_campaign_count: 221`. Parecía un éxito y no entró nada. Por
   eso hay que borrar de origen antes de cargar.

## Ritmo

`max_leads_per_day` es 60 en Servicios B2B, de lunes a viernes de 9:00 a 18:00
en hora de Madrid, con 12 minutos entre correos. Los 207 de esa campaña salen
solos en unos cuatro días. El primer día son unos 74 correos entre las tres, y
eso cabe en los dos dominios limpios, que hacen 250 al día.

## Lo que sigue pendiente de Maikel

- Los **63 con la web caída** merecen un segundo sondeo dentro de unos días:
  una web que no responde una tarde puede responder mañana.
- Los **80 sin señal** y los **1.392 que no pasan calidad** no tienen arreglo
  por correo. Si se quieren aprovechar, la vía es el teléfono, no el email.
- Decidir si se archivan las campañas vacías ya, para que el depósito del
  informe diario deje de contar leads que nunca van a salir.

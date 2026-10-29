# Kubysoft · alerta de 3 clics · diseño, lista para encender

Estado: **lista y probada, sin encender.** Encenderla supone enviar correos a Marc,
y eso necesita el OK de Maikel (regla del 29-oct). Escrito el 29-oct.

## Lo que pidió Marc el 27-oct

A partir del **tercer clic** de una empresa, y otra vez en el cuarto y el quinto, un
correo con: **empresa, email, número de clics, fecha de envío, fecha del primer,
segundo y tercer clic, y el mensaje enviado.** Ese lead pasa a su equipo comercial,
que lo trabaja a mano. **Con 1 o 2 clics no hay aviso: revisión manual.**

## Cómo funciona

```
Smartlead (campañas de Kubysoft)
   │  cada hora
   ▼
scripts/avisa_clics.py ── guarda la hora de cada clic nuevo ──► clics-estado.json (en el repo)
   │
   ├── 3 clics o más, y no avisado con ese número ──► un correo por empresa a Marc
   │                                                   (texto en datos/avisos/)
   └── 1 o 2 clics ──► datos/revisar_1_2_clics.csv ──► revisión cada 2 semanas
```

| pieza | dónde vive | estado |
|---|---|---|
| Lógica | `clientes/kubysoft/scripts/avisa_clics.py` | **hecha y probada** el 29-oct contra una API simulada |
| Contador con la hora de cada clic | `clientes/kubysoft/clics-estado.json`, versionado | **hecho**. Va en el repo porque el 19-oct un reciclado del contenedor se llevó el scratchpad |
| Ejecución cada hora | tarea programada de Claude en la nube, en este mismo entorno | **sin crear** |
| Clave de Smartlead | secreto del entorno (`SMARTLEAD_KEY`), no el scratchpad | **falta**: hoy no está en el contenedor |
| Envío del correo | conector de Gmail de la cuenta de Qualivo | **sin encender** |

## A quién llega

| qué | a quién |
|---|---|
| Aviso de 3 clics o más | **el equipo comercial de Marc**. Hoy solo tenemos `marc@kubysoft.com`, que es el traspaso acordado en el brief. **Falta que Marc diga si va a otra dirección del comercial** |
| Copia de cada aviso | Maikel |
| Lista de 1 o 2 clics | nadie por correo: se mira en la revisión de cada 2 semanas, con Maikel |
| Fallos (clave caducada, API caída) | Chief of Staff de Qualivo, para que no pase como el 19-oct, cuando la campaña estuvo 4 días sin vigilancia |

## Qué recibe Marc, literal

Ejemplo con fechas reales de Climar y el número de clics reducido a 3 para ilustrar
(Climar lleva 6).

```
Asunto: Lead caliente: Climar ha hecho 3 clics

Empresa:          Climar
Ciudad:           Barcelona
Teléfono:         (el de la empresa)
Email:            (el correo al que se envió)
Número de clics:  3  (nuevos desde el último aviso: 1)
Fecha de envío:   08-oct 09:21
Primer clic:      08-oct 09:22
Segundo clic:     16-oct 08:02
Tercer clic:      21-oct 09:12
Todos los clics:  ...

--- Mensaje enviado: correo 1 · enviado 08-oct · 1 clic ---
Asunto: una pregunta sobre Climar
(texto del correo)
```

## Lo que hay que saber antes de encenderla

1. **De los clics que ya han pasado solo tenemos la fecha del último de cada correo.**
   Smartlead no da la fecha de cada clic, solo cuántos hay y cuándo fue el último. A
   partir del encendido, cada clic queda con la hora en que se detecta, con una
   precisión de una hora. Por eso en los avisos de los clics antiguos puede salir
   "Tercer clic: sin fecha". Marc tiene que saberlo.
2. **Los clics de los bots de seguridad del correo cuentan.** Algunos servidores abren
   los enlaces nada más llegar el correo. Un clic al minuto del envío es casi seguro un
   bot (Climar: envío 09:21, primer clic 09:22). En la revisión manual se descuentan;
   en el aviso salen las fechas para que el comercial lo vea.
3. **Hoy los 3 clics o más son 4 empresas** [C, `clics-estado.json` a 27-oct 17:09]:
   Climar (6), Toshibamurcia (3), Levitec (3) y Seguas (3). Irtesc (2) va a revisión
   manual. Al encenderla, la primera ejecución las
   avisaría de golpe. Propongo mandarlas a Marc en un solo correo, a mano, y que la
   alerta automática empiece desde ahí.

## Para encenderla: 4 pasos, por este orden

| paso | quién | necesita OK |
|---|---|---|
| 1. Poner la clave de Smartlead como secreto del entorno | Maikel | — |
| 2. Confirmar a qué dirección del comercial de Marc va | Marc, vía Maikel | — |
| 3. Crear la tarea programada cada hora, de lunes a viernes de 8:00 a 20:00 | Qualivo | **sí, Maikel** |
| 4. Primera ejecución en seco, revisar los avisos y encender el envío | Qualivo | **sí, Maikel** |

Instrucción de la tarea programada, ya escrita:

> Ejecuta `python3 clientes/kubysoft/scripts/avisa_clics.py --campana 4071068
> --campana <id de la campaña de noviembre> --marcar-avisado`. Por cada fichero nuevo en
> `clientes/kubysoft/datos/avisos/`, envía un correo desde la cuenta de Qualivo a
> <dirección del comercial de Kubysoft>, con copia a Maikel, con la primera línea como
> asunto y el resto como cuerpo. Haz commit y push de `clics-estado.json`. Si el script
> falla, no envíes nada y avisa al Chief of Staff con el error.

`--marcar-avisado` solo se pasa cuando el envío esté encendido: sin él, el script
escribe los avisos pero no los da por enviados.

# El buzón de rol no es el problema: el nominal inferido sí

Medido el 1-oct-2026 sobre la campaña Clínicas · precio por WhatsApp (3976199),
213 envíos.

| Tipo de buzón | Enviados | Rebotes | Tasa | Respuestas |
|---|---:|---:|---:|---:|
| Rol (`info@`, `hola@`, `citas@`) | 155 | 5 | **3,23%** | **2** |
| Nominal (`nombre.apellido@`) | 58 | 7 | **12,07%** | 0 |
| Conjunto | 213 | 12 | 5,63% | 2 |

## Qué corrige esto

La regla era "descartar siempre los buzones de rol". El 30-sep avisé a Maikel de
que los 151 leads pausados de esta campaña eran de baja calidad **por ser buzones
de rol**. Los datos dicen lo contrario: rebotan al 3,23% y son los que han
producido las dos únicas respuestas de la campaña. Los que rebotan son los
nominales, al 12,07%.

## Por qué, y cuándo aplica

En una clínica pequeña el `info@` es la dirección que está publicada en su propia
web: existe con certeza y la lee alguien. El nominal, en cambio, suele venir de
inferir el patrón `nombre.apellido@dominio` sin comprobarlo, y en empresas de
menos de diez personas ese patrón falla muy a menudo.

**Es un problema de procedencia, no de forma del buzón.** Lo que hay que descartar
no es el `info@`: es la dirección adivinada.

| Procedencia | Qué hacer |
|---|---|
| Rol publicado en su web, comprobado | **entra** |
| Nominal con `email_status: verified` de Apollo | **entra** |
| Nominal inferido por patrón, sin verificar | **fuera** |
| Rol genérico de un dominio que no es suyo | fuera |

## Lo que queda por comprobar

Los 7 rebotes nominales de esta campaña venían de datos derivados de Google Maps
con patrón inferido, no de Apollo. Así que este 12% **no condena** a los nominales
verificados de Apollo, que es lo que lleva `carga-formacion-v4-30sep.json`. En la
muestra de control de Apollo del 30-sep salieron 10 de 10 verificados. Pero no
tenemos aún rebote medido sobre esos: hasta que haya 50 envíos de ese lote, el
dato no existe.

## Efecto en el filtro

`captacion/scripts/cosecha_apollo.py` descarta todo buzón de rol. Eso sigue bien
para los seis motores, donde el decisor nominal es localizable. **No vale para
clínicas pequeñas**, donde el rol publicado es a menudo el único contacto real y
además el que responde.

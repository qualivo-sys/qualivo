# El arreglo de SURBL dejó 36 leads colgados en silencio

**6-oct-2026.** Fallo mío, de mi propia corrección del 2-oct. Detectado hoy a las 10:10.

## Qué pasó

El 2-oct desenganché los 5 buzones de `goqualivo.com` y `gotqualivo.com` de las
62 campañas, para que no saliera nada por dominios listados en SURBL. Eso
funcionó: 0 envíos por esos dominios el lunes y hoy.

Lo que no vi es que Smartlead manda cada seguimiento **desde el mismo buzón que
abrió el hilo**, para que llegue como respuesta en la misma conversación. Al
desenganchar el buzón, los leads cuyo correo 1 había salido por ahí se quedaron
sin emisor posible. No fallan: se quedan `INPROGRESS` para siempre.

**36 leads bloqueados.** Ni un error, ni un aviso, ni un contador en rojo. La
campaña sigue `ACTIVE`, el lead sigue vivo, y no sale nada.

## Cómo se encontró

No lo encontró ninguna alarma. El triaje de las 10:05 devolvió **0 envíos hoy**
con la ventana de envío abierta desde las 09:00. Ayer a esa hora ya había
tráfico. Ese cero era el único síntoma.

Descartado por pasos: los 27 buzones están sanos (SMTP e IMAP OK, reputación
100% salvo uno a 79%); los 9 ACTIVE tienen buzones enganchados; el `scheduler_cron_value`
es correcto (L-V, 09:00–17:00 Europe/Madrid); hay 105 leads en depósito.

## La prueba

Correlación entre «paso vencido» y «emisor desenganchado», sobre los 105 leads
INPROGRESS de Qualivo:

| | emisor presente | emisor desenganchado |
|---|---|---|
| **paso vencido** | 0 | **36** |
| **al día** | 69 | 0 |

Sin una sola excepción en ninguna de las dos direcciones.

**Control independiente:** las 4 campañas de DKR usan buzones de Scubalight, que
nunca se desengancharon. Sus 66 leads INPROGRESS dan «emisor presente» y cero
atascos por esta causa. Sus 0 envíos de hoy se explican solos: sus ventanas son
`America/Sao_Paulo` y `America/Argentina/Buenos_Aires`, y a las 10:10 de Madrid
aún no habían abierto.

## Qué esperan los 36

| Campaña | Leads | Esperan | Vencido desde |
|---|---|---|---|
| Formación · Intelligence (29-sep) | 14 | correo 2 | 3 y 4-oct |
| Clínica · Intelligence (29-sep) | 4 | correo 2 | 3-oct |
| Formación · curso sin cerrar (landing 17-sep) | 12 | correo 3 (breakup) | 5-oct |
| Lista · ActiveCampaign (señal) | 6 | correo 3 (breakup) | 5-oct |

Los 18 que esperan correo 2 conservan íntegro su `body2` en `custom_fields`:
18 de 18 comprobados. La copia no se ha perdido.

## Hallazgo colateral: a quién pertenecen los rebotes

Al atribuir cada rebote al dominio que mandó el correo 1:

| | rebotes | envíos | tasa |
|---|---|---|---|
| goqualivo / gotqualivo | 4 | 25 | **16,0%** |
| dominios limpios | 0 | 74 | **0,0%** |

Los 4 rebotes de toda la cuenta salieron de los dominios listados. Esto cierra
dos cosas:

1. **El 4,9% de rebote de Formación · Intelligence no dispara la regla.** Ese
   4,9% (3 de 61 únicos) es íntegramente de la configuración que ya no existe.
   Sobre dominios limpios la campaña va 0 de 41. Pausarla hoy sería castigar a
   la configuración arreglada por los rebotes de la rota.
2. **El listado de SURBL no era cosmético.** 16% contra 0% es la diferencia
   medida entre mandar por un dominio listado y no hacerlo.

## La comprobación que faltaba

`captacion/scripts/atascados.py`. Recorre las campañas ACTIVE, compara el emisor
del último envío de cada lead INPROGRESS con los buzones enganchados, y marca
los que no pueden avanzar. Validado contra este caso: devuelve los 36 exactos y
135 al día. Entra en el triaje.

La lección es la de siempre, otra vez: **leer un ajuste no es comprobar un
comportamiento.** El 2-oct verifiqué que los buzones estaban desenganchados.
Eso era verdad. Lo que no comprobé es qué le pasaba a los hilos que esos buzones
habían abierto.

## Decisión pendiente (Maikel)

Los 18 que esperan el **correo 3** (breakup): mi recomendación es dejarlos ir.
Valor casi nulo y su correo 1 salió por un dominio con 16% de rebote.

Los 18 que esperan el **correo 2**: no recomiendo reenganchar los buzones de
SURBL, porque eso reintroduce envíos por los dominios malos sin poder dirigir
cuáles. Tampoco recomiendo continuar el hilo roto desde otro dominio: el correo 2
empieza por «Te la paso igual» y referencia un correo que 13 de los 18 no tienen
ninguna señal de haber recibido (5 sí registran apertura).

Lo que recomiendo: tratar a los 13 sin señal como **no contactados** y entrarlos
de nuevo con el correo 1 desde dominio limpio, con la estructura nueva. Es más
honesto que referenciar un correo que no les llegó, y mide de verdad.

**No he cargado ni activado nada.** Queda preparado y pendiente de tu ok.

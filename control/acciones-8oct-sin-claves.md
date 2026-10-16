# Más reuniones cualificadas, sin esperar a nadie · 8-oct-2026

Maikel: «soluciones, no problemas». Justo. Llevo medio día reportando muros y tres
tienen salida.

---

## La salida que tenía delante: Smartlead es la tubería, no el mensaje

Las 5 cuentas tipo A de nivel 2 están **reveladas, verificadas, limpias y con el copy
aprobado**, y llevan dos días paradas porque «no puedo cargar en Smartlead».

Pero el ABM tipo A son 18 cuentas, no 1.800. **Eso no necesita un motor de secuencias:
se manda a mano.** Y la propia rutina lo dice: *«o escribirle aparte desde Gmail, que es
más limpio»*.

Mandarlas desde `maikel@qualivo.io` arregla tres cosas de golpe:

1. No necesita la clave de Smartlead.
2. **Arregla el incumplimiento de LSSI**: el remitente queda identificado.
3. **Quita el desajuste de dominio** entre la firma (`qualivo.io`) y el `From:`
   (`qualivoedge.com`), que era desconfianza en cada correo.

Lo único que pierdo es el seguimiento automático del paso 2. Con 5 cuentas eso es una
línea en un fichero, no un problema.

| Cuenta | Persona | Cargo |
|---|---|---|
| StratioBD | Stella Buhrer | Chief Revenue Officer |
| Payflow | Alejandro De La Marca | Head of Sales |
| Kirey España | Antonio Pérez Cama | Sales Director |
| Recodme | Carlos García Díaz | Business Development Director |
| Ayscom | Andrés Sevillano Castaño | Sales Director |

---

## La acción con más palanca medida, y no necesita ninguna clave

11 propuestas, 1 cierre. Pero al revisarlo por casos **tengo que afinar mi propia
hipótesis**: de las 6 que señalé, en 3 la segunda persona **ya está en el hilo**. Así que
no son seis veces el mismo problema, son dos problemas distintos:

### Grupo 1 · les falta la segunda persona (3)

**Armando · Música de los Ríos · 3.150 €**

> Armando,
>
> te mandé la propuesta para que la vieras con tu socio. Antes de que la leáis los dos
> por separado, te propongo algo más rápido: veinte minutos los tres y os la explico en
> directo, con vuestros números delante.
>
> Así tu socio pregunta lo que quiera en el momento y no te toca defenderla tú solo.
>
> ¿Os va bien el lunes o el martes por la mañana?
>
> Maikel

**Ana Claros · 3.600 € · segunda reunión cancelada**

> Hola Ana,
>
> cancelamos la del lunes y no te he vuelto a agobiar.
>
> Te propongo algo distinto: en lugar de volver a verlo tú y yo, veinte minutos contigo y
> con tu socia. La propuesta nueva ya no lleva cuota mensual, así que es más corta de
> explicar de lo que parece y ella puede preguntar directamente.
>
> ¿Te cuadra algún día de la semana que viene?
>
> Maikel

**Betlem · TALKUAL · 4.200 €**

> Betlem,
>
> te pasé la propuesta para que la presentaras al equipo, y presentar algo de otro siempre
> es más trabajo del que parece.
>
> ¿Y si la presento yo? Veinte minutos con quien tenga que opinar, vosotros preguntáis y
> yo me llevo las dudas.
>
> Dime dos o tres personas y un hueco y lo monto.
>
> Maikel

### Grupo 2 · ya hay dos personas, lo que falta es una fecha o un no (3)

Aquí un cuarto seguimiento es ruido. Lo que hace falta es **forzar una respuesta
binaria**, y dar salida fácil es lo que la hace llegar.

**Remi · Skolae · le ofreciste la reunión con su director el 5-oct y silencio**

> Remi,
>
> el 5 te ofrecí conectarme veinte minutos con tu director comercial y no me dijiste nada,
> así que imagino que ha sido mala semana o que no es el momento.
>
> Te lo pongo fácil con dos opciones: o me dices su nombre y le escribo yo directamente, o
> lo dejamos aquí y te escribo en enero.
>
> Cualquiera de las dos me sirve.
>
> Maikel

**Dataslayer · Adela y Carolina, Juan en copia · tres toques sin respuesta**

> Adela, Carolina,
>
> van tres correos míos sin respuesta, así que el mensaje que me llega es que ahora no es
> el momento. Sin problema.
>
> Antes de cerrarlo: ¿lo dejo aparcado y os escribo en enero, o hay algo concreto que os
> frena y lo miramos en diez minutos?
>
> Con un «aparca» me basta y dejo de aparecer.
>
> Maikel

**ADELANTTA · Juan Carlos y Laura · en negociación y a 0 € desde el 10-sep**

> Juan Carlos, Laura,
>
> contesté a la duda de Laura sobre el compromiso del piloto y ahí se quedó, así que
> supongo que la respuesta no resolvió lo que de verdad os frenaba.
>
> ¿Me lo decís sin filtro? Si es el precio, si es el momento, o si hay alguien más que
> tiene que aprobarlo, lo prefiero saber que seguir mandando correos.
>
> Maikel

**Valor en juego en los seis: unos 11.000 € declarados.** Coste de mandarlos: cero.

---

## Lo que necesito de ti, y es una sola cosa bien hecha

El motivo real de que lleve el día ciego no es que falten las claves: es **dónde viven**.
El scratchpad muere con el contenedor, y el contenedor se reinicia en cada disparo de
rutina. Hoy llevo ocho reinicios.

La solución permanente es ponerlas como **variable de entorno del entorno**, no en el
scratchpad. Se configura en el menú del entorno en la barra de título de la sesión, en
Edit, en la sección de credenciales de API o como variable de entorno. Una sesión nueva
ya las coge, y **sobrevive a los reinicios**.

Nombres que leería: `SMARTLEAD_API_KEY`, `GHL_API_KEY`, `GHL_LOCATION_ID`,
`GHL_CALENDAR_ID`.

No me las pongas por chat. Y aprovecha para **rotar la de Smartlead**, que ahora está en
texto plano dentro del prompt de tres rutinas.

Con eso: `puertas.py` da su veredicto, `sin_contestar.py` saca las respuestas con el hilo
abierto, el guardián de reenvíos vuelve, y la carga diaria arranca. Y no se vuelve a caer
en el próximo reinicio.

---

## Orden de hoy

| Qué | Necesita | Reuniones que puede dar |
|---|---|---|
| Los 6 correos de arriba | tu ok, dos minutos | **cierres**, no reuniones: ~11.000 € |
| Las 5 cuentas tipo A por Gmail | tu ok y verificar su señal | 1-2 reuniones nuevas |
| Las 13 de nivel 2, revelar | 13 créditos de Apollo | cohorte cerrada en 18 |
| Variables de entorno | 5 minutos tuyos | desatasca todo lo demás |

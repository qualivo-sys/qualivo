# Revisión de la carga de 39 leads de formación · 1-oct

## Qué se hizo

Cargados 39 leads en *Formación · Intelligence* (4042994) a las 11:0x de Madrid. Salieron **los 39
en 24 minutos** (09:13 a 09:37 UTC). La campaña vuelve a estar seca.

## Lo que validé antes de cargar, y lo que NO validé

Comprobé: formato del correo, buzón de rol, dominio personal, dominio bloqueado de cliente o ex
cliente, duplicado contra los 6.211 correos ya cargados en Smartlead, dominio ya contactado, y que
nadie de la lista hubiera respondido antes. Todo salió a cero.

**No comprobé lo único que el copy afirma como hecho.** El email 1 empieza con *"He estado mirando
escuelas como [Empresa]. Con solicitudes por anuncios, el agujero no está en el anuncio sino entre
solicitud y matrícula."* Eso da por sentado dos cosas de cada empresa: que **es una escuela** y que
**capta solicitudes por anuncios**. Yo validé la forma del dato, no el encaje.

## Lo que ha salido mal

**1. Entre tres y cuatro de los 39 no son escuelas, son proveedores de escuelas.**

| empresa | qué es en realidad |
|---|---|
| Fiction Express Education (`boolino.com`) | plataforma de lectura que **vende a** colegios |
| tekman education | metodologías educativas que **venden a** colegios |
| Tutellus | plataforma de formación online, no capta matrículas de cursos propios |
| The Lemon Tree Education | asesoría a familias para estudiar en el extranjero |

A esas cuatro les hemos dicho "he estado mirando escuelas como vosotros" y no lo son. Es el mismo
error que cacé con *360 Recursos Humanos* ("re**curso**s" contiene "curso"), por otra puerta: ahí
fue un filtro de texto mal hecho, aquí fue no mirar a qué se dedica la empresa.

**2. Dos son instituciones demasiado grandes para este mensaje.** `ie.edu` (IE School of Politics)
y `bse.eu` (Barcelona School of Economics). Tienen departamentos de marketing enteros; un correo
frío diciéndoles dónde se les escapan las matrículas no va a encajar.

**3. Un rebote duro inmediato.** `mzapater@grupoesneca.com` devolvió *"the email account does not
exist"*. Apollo lo daba como `verified`.

**Sobre la tasa de rebote: 1 de 39 es 2,6% y la regla de Maikel corta en 2%.** No lo presento como
que hemos cruzado el umbral: con 39 envíos, un rebote da 2,6% y cero da 0%. **No es una tasa, es un
caso.** Hace falta ver los 39 completos y preferiblemente dos tandas antes de decir nada.

**4. Un fuera de oficina** (`edgardo@tlteducation.com`, vuelve el 9 de octubre). Sin acción.

## El filtro que falta, y que es la causa

Antes de cargar un lead en una campaña cuyo copy afirma un hecho sobre la empresa, hay que
**verificar ese hecho**, no solo la higiene del correo. Para el vertical formación, como mínimo:

- ¿La empresa **imparte** formación, o la **vende a** quien la imparte? Lo segundo no entra.
- ¿Capta alumnos **ella misma** por su web? Si vende B2B a colegios, el mensaje no aplica.
- ¿Tamaño dentro del ICP? Una universidad grande o una business school internacional no es el
  decisor alcanzable que busca este motor.

Mientras eso no esté automatizado, **la lista se repasa a mano empresa por empresa antes de cargar**,
y es un paso rápido: los 39 se revisan en diez minutos y habría evitado los seis casos de arriba.

## Lo que no se puede arreglar

Los correos ya salieron a las 09:13-09:37. No se pueden retirar. Lo que sí se puede es no mandarles
los pasos 2 y 3 de la secuencia, que es lo que convierte un correo mal dirigido en una queja.

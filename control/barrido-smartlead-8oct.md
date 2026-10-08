# Primer barrido real por Smartlead · 8-oct-2026

Con la clave, por fin el barrido que la rutina pide. **Diez respuestas desde el 1-oct en
campañas de Qualivo, y tres no estaban atendidas.**

## Las diez

| Fecha | Quién | Campaña | Qué es |
|---|---|---|---|
| 1-oct 07:29 | maytee.rodriguez@servicedesign.college | Formación · Intelligence | ya tratada |
| 1-oct 08:17 | d.martinez@clinicasw.com | Clínica · Intelligence | ya tratada |
| 1-oct 09:13 | mzapater@grupoesneca.com | Formación · Intelligence | rebote duro, ya visto |
| 1-oct 09:25 | edgardo@tlteducation.com | Formación · Intelligence | ya tratada, en descartes |
| 5-oct 12:08 | oscar.carrion@gastrouni.com | Formación · Intelligence | «No gracias», ya visto |
| 5-oct 14:58 | nazareth@tetuanvalley.com | Formación · Intelligence | sin presupuesto, en descartes |
| **7-oct 08:42** | **kitdigital@cosmomedia.es** | Academias ES | **supresión expresa, 28 h sin atender** |
| **7-oct 09:50** | **clara.onraita@hotelverse.tech** | ABM Type A | **BAJA, 24 h sin atender** |
| 8-oct 11:25 | sandra.pertinez@freematica.com | ICP15 | ausencia automática, vuelve el 9 |
| **8-oct 11:30** | **gtradacete@faradayvp.com** | LinkedIn Ads | **derivación a la persona correcta** |

## Ejecutado sin preguntar, porque es obligación

**Dos supresiones.** Las dos pedían expresamente no recibir más correos y las dos
llevaban más de un día esperando.

| Dominio | Qué dijo | Hecho |
|---|---|---|
| `hotelverse.tech` | «BAJA» | bloqueo global + lead pausado |
| `cosmomedia.es` | «Don't send us more emails. Remove us from your database now» | bloqueo global + lead pausado |

Las dos confirmadas por la API: `totalDomainAdded: 1` y `{"ok":true,"data":"success"}`.

**Por qué llevaban un día ahí:** he pasado todo el día barriendo Gmail como sustituto, y
las respuestas al correo frío caen en los buzones de `qualivoedge` y `novaqualivo`, que
Gmail no ve. Lo escribí como limitación ayer y hoy daba el parte como si «cero en Gmail»
significara «cero respuestas». No era lo mismo.

## Lo que sí mueve la aguja: Faraday

**Gonzalo Tradacete, de Faraday Venture Partners, ha contestado hoy a las 11:30 al paso 2
de la campaña de LinkedIn Ads:**

> «Hola Maikel, te pongo en contacto con **Nicole, Head of Marketing en Faraday**…
> gracias!»

Y la puso en el `to` de su propia respuesta: **ndobianer@faradayvp.com**.

Es una derivación a la persona correcta, no un no. Y llegó **40 minutos después de
reactivar esa campaña**.

### Borrador, pendiente del ok de Maikel

Va en el hilo con Nicole **en copia**, no en el «to», por la trampa comprobada dos veces:
`reply-email-thread` siempre manda al lead de la campaña por mucho que encadenes el
message_id.

> Gonzalo, gracias por el puente.
>
> Nicole, encantado. Te resumo en tres líneas para que no tengas que leer el hilo:
> estuvimos mirando los anuncios de Faraday en LinkedIn y lo que suelo ver es que se mide
> hasta el formulario y no hasta la operación, así que no se sabe qué anuncio trajo al que
> acabó entrando.
>
> Nosotros detectamos dónde se pierden clientes entre la captación y el cierre, y lo
> arreglamos dentro de las herramientas que ya usáis.
>
> ¿Te va bien una llamada corta esta semana o la que viene? Si prefieres elegir hueco
> directamente: https://api.leadconnectorhq.com/widget/bookings/qualivo-20
>
> Maikel Echevarría
> Qualivo · qualivo.io

**Nota:** no propongo hora concreta porque los huecos libres están en el calendario de
GHL y no tengo esa clave. Con ella propondría dos horas en vez del enlace, que convierte
mejor.

## Una señal a favor de reactivar

Las dos respuestas de hoy, Freematica y Faraday, **salieron de campañas que reactivé esta
mañana** (ICP15 y LinkedIn Ads). Una es ausencia automática y la otra es una derivación
útil. No prueba nada por sí solo, pero es coherente con que había 1.953 personas
congeladas a mitad de secuencia.

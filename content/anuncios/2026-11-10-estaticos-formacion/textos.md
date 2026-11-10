# Estáticos de formación · 10-nov-2026

**Encargo:** de Paid, pedido por Maikel.
**Estado:** borrador para que Maikel lo vea. No se publica nada sin su OK.

**Qué hay:**
- **Piezas:** 5 estáticos tipográficos, cada uno en 4:5 (feed) y 9:16 (stories y Reels), en `png/<pieza>-45.png` y `png/<pieza>-916.png`.
- **Zonas seguras del 9:16:** 270 px libres arriba y 400 px abajo.
- **Fuente editable:** `estaticos.html` (`#s1-45` … `#s5-916`). Se renderiza con `node render.js`, que avisa si algo se sale.

**Público:** negocios de formación que ya invierten en anuncios y venden cursos de 300 € o más.
**Destino:** el formulario de cualificación del anuncio viejo (2063720777591278), en un conjunto aparte.

**Reglas:**
- Sin casos de clientes.
- Sin cifras inventadas. Los 300 € son el filtro que puso Maikel el 4-nov.
- Las frases entre comillas son objeciones reales de leads, recogidas por Growth en WhatsApp de GHL, y no se atribuyen a nadie.

**Por qué tipográficos:**
- En octubre, «HERO 06 · Control tipográfico» trajo 2 leads con 11 € [C, Paid; muestra pequeña].
- 8 de 11 leads vienen del feed de Instagram [C, Paid].

## S1 · «¿Sabes qué campaña te trae matrículas… y cuál solo formularios?» (G1)
- **De dónde sale:** palabras del cliente que firmó («qué campañas terminan generando matrículas») y el «no lo sé», la respuesta más repetida del formulario (23 de 56) [C, Growth].
- **Titular:** ¿Qué campaña te trae matrículas?
- **Texto principal:** ¿Sabes qué campaña te trae matrículas… y cuál solo te trae formularios? En Qualivo montamos todo el recorrido de captación (anuncio, formulario, primera respuesta, seguimiento y reserva con admisiones) y lo conectamos con tu equipo, para que sepas de dónde viene cada contacto y qué campaña acaba en matrícula. Para academias que ya invierten en anuncios. Diagnóstico gratuito de 30 minutos.
- **Descripción:** Diagnóstico gratuito de 30 minutos.

## S2 · «Ya tengo a alguien que me lleva las campañas.» (objeción más repetida)
- **De dónde sale:** objeción más repetida según Growth, 6-nov [C].
- **Titular:** No sustituimos a quien te lleva los anuncios.
- **Texto principal:** ¿Ya tienes a alguien con las campañas? Perfecto: no venimos a sustituirle. Nosotros conectamos lo que viene después. Cada solicitud entra ordenada, recibe respuesta en minutos y tiene seguimiento hasta que reserva con admisiones. Y tú ves qué campaña trae matrículas. Diagnóstico gratuito de 30 minutos.
- **Descripción:** Del anuncio a la matrícula, conectado.

## S3 · «No quiero hablar con una máquina.»
- **De dónde sale:** objeción recogida por Growth, 6-nov [C].
- **Ojo:** no prometemos «voz automática» y no decimos que no haya automatización. El mensaje es la respuesta rápida y el seguimiento, que es lo que el lead valora.
- **Titular:** Respuesta rápida y alguien que les siga.
- **Texto principal:** Tus alumnos tampoco quieren hablar con una máquina. Quieren que alguien les conteste rápido y les siga hasta que deciden. Te ayudamos a que ninguna solicitud se quede sin respuesta ni seguimiento, y a ver qué campaña acaba en matrícula. Para academias que ya invierten en anuncios. Diagnóstico gratuito de 30 minutos.
- **Descripción:** Diagnóstico gratuito de 30 minutos.

## S4 · «Llenas grupos y no sabes qué campaña lo ha hecho.» (línea de HERO 06)
- **De dónde sale:** adapta a formación el HERO 06 de septiembre («Facturas más y no sabes por qué»).
- **Titular:** ¿Qué campaña llena tus grupos?
- **Texto principal:** Llenas grupos y no sabes qué campaña lo ha hecho. Mientras funciona da igual. El día que recortes, puedes apagar justo la que te traía alumnos. Antes de subir el presupuesto, mira qué está funcionando: te lo enseñamos en un diagnóstico gratuito de 30 minutos.
- **Descripción:** Antes de subir el presupuesto.

## S5 · «Solo para academias que ya invierten en anuncios.» (filtro dicho)
- **De dónde sale:** el filtro de Maikel del 4-nov y el patrón de la Biblioteca de anuncios del 6-nov (Scaling Digitals, Webpositer).
- **Titular:** No es para todas las academias.
- **Texto principal:** Solo para academias que ya invierten en anuncios y venden cursos de 300 € o más. Si te llegan solicitudes cada semana y no sabes cuáles acaban en matrícula, mira cómo conectamos la captación con tu equipo de admisiones. Si aún no inviertes, todavía no es el momento. Diagnóstico gratuito de 30 minutos.
- **Descripción:** Ver si encajo.

## Propuesta de prueba
- **Qué probar:** S1, S2 y S4 en el mismo conjunto. S1 es el gancho más fuerte del vídeo, S2 responde a la objeción más repetida y S4 es la línea que ya funcionó en estático.
- **Reserva:** S3 y S5.
- **Cómo leerlo:** CTR al formulario y coste por lead bueno, con la misma regla de parada que G1: 70 € sin ningún lead bueno, o más de 95 € por lead bueno a los 7 días [E, Paid].

---

# v2 (10-nov, después del comentario de Maikel)

**Qué dijo Maikel:** que la v1 era «muy básica» y no transmitía la propuesta de valor.

**Qué cambia:** cada estático enseña el sistema (el recorrido completo, el panel o una solicitud de principio a fin), no solo una frase. Los datos de ejemplo van marcados como «EJEMPLO · DATOS SIMULADOS».

**Archivos:** fuente `v2.html` (`#c1-45` … `#c4-916`), render con `node render-v2.js`, imágenes en `png-v2/`.

- **C1 · «Captación y ventas, por fin conectadas».** Los 4 pasos (anuncios, landing y formulario que filtra, respuesta y seguimiento, panel) en tarjetas de interfaz.
  - **Titular:** Captación y ventas, conectadas.
  - **Texto principal:** Diseñamos todo el recorrido de captación de tu academia: anuncios con ángulos para tu alumno ideal, una landing y un formulario que filtran, respuesta y seguimiento en minutos hasta la reserva, y un panel que te dice qué campaña acaba en matrícula. Lo conectamos con tu equipo de admisiones para que lleguen alumnos cualificados y se matriculen más. Diagnóstico gratuito de 30 minutos.
- **C2 · «¿Qué campaña te trae matrículas… y cuál solo formularios?».** G1 con el panel: campañas → solicitudes → aptas → reuniones → matrículas.
  - **Titular:** ¿Qué campaña te trae matrículas?
  - **Texto principal:** El texto de S1.
- **C3 · «Tienes las piezas. Te falta el sistema».** Responde a «ya tengo a alguien con las campañas»: a un lado, piezas sueltas (agencia, formulario, WhatsApp, Excel); al otro, la cadena conectada.
  - **Titular:** No sustituimos a quien te lleva los anuncios.
  - **Texto principal:** El texto de S2.
- **C4 · «Nadie se queda sin respuesta. Nadie se te escapa».** Una solicitud de ejemplo, de principio a fin: solicitud → WhatsApp → cualificada → reunión con admisiones. Va de día, para no parecerse a la demo nocturna de AI4Growth.
  - **Titular:** Del anuncio a la reunión, sin que nadie se olvide.
  - **Texto principal:** Una solicitud no debería esperar a que alguien tenga un hueco. Con Qualivo, cada persona que pide información recibe respuesta en minutos, se cualifica y llega a tu equipo de admisiones con todo el contexto. Si no viene a la reunión, se le vuelve a escribir. Para academias que ya invierten en anuncios. Diagnóstico gratuito de 30 minutos.

**Propuesta de prueba:** C2 (el gancho más fuerte, con el panel), C1 (la propuesta de valor completa) y C3 (la objeción más repetida). C4, de reserva.

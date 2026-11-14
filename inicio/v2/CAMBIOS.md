# Home v2 · posicionamiento del 12-oct (borrador en /inicio/v2/, noindex)

**Base:** `content/posicionamiento-v2-2026-10-12.md`.

**Estructura:** la misma de seis secciones que la landing de formación V2.1.

**Qué no se ha tocado:**
- la home publicada (`/index.html`);
- `assets/app.js`.

## Qué cambia frente a la home publicada

- **Mensaje.**
  - Fuera de la home: «Agentes de IA», «Lo agentizamos», los siete u ocho agentes, el piloto con «si no mejora, no pagas» (la garantía no está aprobada para la web) y el ROAS «0,1 → 7,6», que no tiene fuente en `/casos/`.
  - H1: «Conseguimos que más oportunidades se conviertan en clientes.» Es la propuesta de valor principal del documento.
  - El favorito del documento («No necesitas solo más leads. Necesitas convertir más en clientes.») va como H2 de la sección del problema.
- **Las seis fugas** del documento: captación, conversión, respuesta, seguimiento, ventas y visibilidad. La respuesta rápida es una más.
- **Las cinco funciones** (Atraer, Convertir, Responder y seguir, Vender, Medir y mejorar), con los medios en letra pequeña: voz IA e Intelligence son medios. Lleva la diferenciación sin decir que somos los únicos.
- **Casos:**
  - EAC y Nuria Roure en grande. Nuria cuenta «más negocio sin captar un lead más».
  - BelloVinilo, Nail Boss y Focus en una fila de enlaces.
  - Los 16 logos fijos.
- **Demostración.** Intelligence (sector B2B, datos simulados, con su etiqueta) y Raquel compacta con enlace a `/prueba/`.
- **Servicio.** Las fases, lo que podemos llevar y una sola oferta, sin precio. La nota de Growth: «la venta la cierra tu equipo».
- **Enlaces por sector** en el hero: formación, clínicas y B2B.

## Formulario

- **Es el mismo de la home:** campos, validación, `/api/lead`, calendario y eventos (`diagnostico_solicitado`).
- **Va en `inicio/v2/form.js`,** una copia literal de `CONFIG` e `initForm()` de `assets/app.js`. Motivo: `app.js` también rota el H1 cada 5 s con frases del mensaje anterior («No te falta demanda…»). Si se publica la home v2, la home tiene que cargar `form.js` y no `app.js`.
- **Arreglo de paso:** la home publicada manda `utm: null` porque nadie guarda `qv_utm`. La v2 guarda las UTM de la visita en la sesión y llegan al CRM (comprobado).

## Verificado (API simulada, sin envíos reales)

- Escritorio, tablet y móvil sin errores ni desbordes.
- Un solo H1 y seis secciones.
- Ninguna palabra prohibida.
- Las anclas y los enlaces internos existen.
- Formulario:
  - valida;
  - envía una vez;
  - muestra el calendario;
  - lleva las UTM en el payload;
  - el H1 sigue fijo pasados 11 s.

## Pendiente de Maikel

1. **H1:** la propuesta de valor principal o el favorito («No necesitas solo más leads…»). Es un buen test A/B. Ojo: el favorito tiene la forma «no X, sí Y» que la guía de voz evita.
2. **Nail Boss:** sigue sin informe que lo respalde. Aquí va solo como enlace a `/formacion/`.
3. **Formulario de la home:** son 6 campos con facturación. Se puede probar uno más corto (A/B), pero cambia lo que llega al CRM, así que es decisión con Growth.
4. **Al publicar:**
   - sustituir `index.html`;
   - cargar `form.js` en lugar de `app.js`;
   - quitar el noindex y la barra «BORRADOR»;
   - rehacer el JSON-LD de la home con el posicionamiento nuevo.

## 13-oct · mismo esquema que /formacion/v21/ (versión para tráfico de pago)

- **Sin barra de borrador.** Sigue siendo noindex, en una ruta oculta.
- **Portada:** el VSL de YouTube (oculto, sin cookies, carga al pulsar) sustituye al panel de ejemplo. El H1, el texto y los enlaces por sector no cambian.
- **Orden:** portada, casos, formulario. Debajo van las fugas y el sistema, la demo, el alcance y las preguntas. En móvil el formulario empieza en la pantalla 4,3.
- **Formulario: cambia de motor.**
  - Antes: `assets/app.js` y `/api/lead`, con el corte por facturación de menos de 500k y la pantalla «todavía no».
  - Ahora: el mismo de la landing de formación, `/diagnostico/landing.js` y `/api/diagnostico`, en tres pasos.
    - **Paso 1:** empresa, web, sector, solicitudes al mes y ticket medio.
    - **Paso 2:** contacto y «dónde se te escapa» (opcional).
    - **Paso 3:** calendario.
  - Con eso la home lleva las mismas etiquetas de encaje del funnel v2, el Lead del píxel y de la Conversions API, el primer WhatsApp y el correo de bienvenida que las landings de pago.
  - Ya no se deja fuera a nadie por facturación.
  - `form.js` ya no se usa.
- **Precio junto al formulario:** «Trabajamos con proyectos que empiezan en 1.200 € + IVA». La pregunta del precio lo repite y ya no promete «por escrito», que no está confirmado.
- **`?paso=agenda`:** agenda directa para quien ya ha dejado sus datos.
- **Eventos:** `home_vsl_play` (VSLPlay), `home_agenda_abierta` (HomeAgenda) y `home_reserva` (HomeReserva), además de los `diagnostico_*` de `landing.js`.
- **Probado** con API simuladas en escritorio y móvil:
  - envío único y carga útil con las UTM completas;
  - calendario, vídeo y agenda directa;
  - sin errores.
- **Decisión de Maikel:** el cambio de motor del formulario cuando esta versión pase a ser la home real (`/`).

## 14-oct · en producción

- **OK de Maikel:** «acepta la home me gusta».
- **`/index.html`** pasa a ser esta versión, sin `noindex`, con la cabecera SEO de producción.
- **Datos estructurados nuevos:** organización, Maikel, servicio, web y FAQ, sacada de las preguntas visibles.
- **Imágenes:** pasan a `/assets/img/home/`.
- **Anclas antiguas que siguen funcionando:** `/#analiza`, `/#diagnostic`, `/#wall` y `/#quienes`, que enlazan otras páginas.
- **`/inicio/v2/`** redirige a `/` (301, `vercel.json`).
- **sitemap y llms.txt** al día. Fuera Femxa, Formación Ninja y el filtro de 500k.
- **Lighthouse** en móvil, en local: rendimiento 97, SEO 92. El aviso que queda es por enlaces tipo «Ver el caso».
- **Los contactos de la home** entran por `/api/diagnostico` con la etiqueta `pagina-inicio`.
- **La home anterior** queda en el historial de git (commit anterior a este).

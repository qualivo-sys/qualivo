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

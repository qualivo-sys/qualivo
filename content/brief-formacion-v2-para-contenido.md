# Brief · Landing Formación V2 → para el agente de contenido (12-oct-2026)

## Objetivo
Rehacer qualivo.io/formacion/ como versión de prueba. Debe ser más corta, más visual y convertir mejor.
- Un director de academia entiende en 5 segundos qué hace Qualivo y pide un diagnóstico de captación.
- **La especificación completa está en `content/formacion-v2-instruccion-maestra.md`.** Es la instrucción de Maikel y manda sobre todo lo demás.

## Mensaje
- **H1:** «Más alumnos para tu centro. Del primer anuncio a la matrícula.» La segunda frase va en verde.
- **Qué hace Qualivo:** el recorrido completo: Captación → Conversión → Respuesta → Seguimiento → Venta → Medición.
- **NO es una agencia de «responder rápido».** No enfocar en la velocidad de respuesta.
- **Producto:** se vende como «Sistema de Crecimiento Qualivo · Gestionado».

## Estructura (6 secciones, entre 700 y 900 palabras)
1. **Hero.** Lleva un dashboard «Anuncio → Solicitud → Conversación → Reunión → Matrícula» con datos de ejemplo identificados como tales.
2. **Resultados reales.** Dos casos y la franja de logos.
3. **Las 3 fugas y las 5 funciones.**
   - Fugas: captación, interesados que no avanzan, oportunidades que se enfrían.
   - Funciones: Atraer, Convertir, Responder y seguir, Facilitar la venta, Medir y mejorar.
4. **«Todo conectado».** Sección oscura con el recorrido de un alumno, Intelligence y Raquel.
5. **Cómo trabajamos.** Diagnóstico, Implantación y Optimización, con una sola oferta y **sin precios**.
6. **CTA final, formulario y 4 FAQ.**

## Decisiones de Maikel (no negociables)
- **FEMXA y XFP: fuera.** Ya no son clientes: ni cifras ni logos.
- **Casos que se usan** (ya publicados):
  - **EAC:** ROAS 10,2× y 44.000 € atribuidos en un mes (/casos/eac/).
  - **Nail Boss Academy:** 1.160 leads y 21 matrículas en cuatro meses, partiendo de cero.
  - **Focus Practical:** −53 % en coste por contacto, como mucho como enlace.
- **Mantener la franja de los 16 logos de clientes** (`/assets/img/clientes/*.webp`). Dan autoridad y Maikel se enfadó cuando se quitaron.
- **Raquel (agente de voz) tiene que aparecer**, en formato compacto.
  - Tiene una prueba real de llamada que llama a `/api/prueba/` (barra final obligatoria).
  - Funciona de 9:00 a 21:00, con un máximo de 5 llamadas por móvil y día.
- **Intelligence tiene que aparecer**, con capturas de la demo etiquetadas como «Demo con datos simulados».
  - Hay capturas en `formacion/v2/img/intelligence-resumen.webp` e `intelligence-anuncios.webp`.
  - La demo está en `/intelligence/?sector=formacion`.
- **No reutilizar /encaja/:** a Maikel no le gusta.
- **Palabras prohibidas:** «agentes de IA», garantías de matrículas, precios (1.000 €/mes no está aprobado para la web) y cualquier resultado o función inventada.

## Técnico (no romper)
- **Formulario actual:** `<form id="f">` en `formacion/index.html`, gestionado por `/diagnostico/landing.js`, que lo envía a `api/diagnostico.js` y de ahí al CRM (GHL).
  - El backend exige sector, tamaño del equipo, inversión y web.
  - El nuevo formulario solo pide Nombre, Centro, Email, Teléfono, Web y Principal objetivo, así que hay que mapear esos campos y mandar valores por defecto en los que falten.
- **Consentimiento:** `/assets/consent.js`.
- **UTM:** si la página llega sin parámetros, se añade `utm_content=formacion`. Hay que mantenerlo.
- **Eventos de medición:** vista, clic en CTA, inicio de formulario, envío válido y lead confirmado.
  - Sin duplicados.
  - Un clic no cuenta como lead.
- **Probar con las API simuladas.** Nunca enviar nada al CRM real ni lanzar llamadas reales en las pruebas.

## Estado actual
- **Publicado:** `formacion/index.html` sigue intacta.
- **Borradores:** `formacion/v2/` contiene el borrador anterior (H1 «Más solicitudes que encajan…»), que a Maikel **no le convenció**. Se puede sobrescribir.
  - No está subido al repo: cada push a esta rama publica en qualivo.io.
- **Agentes:** el agente que estaba construyendo la versión nueva se ha parado. No hay trabajo a medias.
- **Pendiente de Maikel:**
  - precios que se pueden publicar;
  - si Focus Practical aparece;
  - si se borra /encaja/, que está publicada como noindex;
  - si se quiere un enlace de preview en una ruta oculta.

## Entrega esperada
- Borrador en `formacion/v2/index.html`, con noindex.
- Capturas de escritorio (1440 px) y móvil (390 px).
- Auditoría breve: qué se conserva, qué se modifica, qué se elimina y riesgos.
- Ideas de test A/B.
- **No se publica sin el OK de Maikel.**

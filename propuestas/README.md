# Propuestas · kit estándar de cada reunión de diagnóstico

Decidido por Maikel el 30-oct-2026: **todas las reuniones se preparan así**, no solo con una página de texto.

Para cada lead con reunión, en `propuestas/<empresa>/`:

1. **`demo/` · recorrido por pestañas** (plantilla: `barcelona-school-of-creativity/demo/` o `ca-makeup-academy/demo/`).
   - Arriba, un bloque «Para <nombre>» con lo que contó en el formulario y qué pestaña responde a cada fuga.
   - Siete pestañas: Anuncios (sus anuncios reales de la Biblioteca de Meta) · Formulario/solicitud (test interactivo) · WhatsApp (chat simulado con «Por detrás») · Llamada de voz · Ficha con puntuación · Seguimientos · Panel.
2. **`landing/` · landing de conversión** con sus fotos, su marca y sus textos, una sola llamada a la acción y el formulario que agenda en el mismo paso.
3. **Panel de Intelligence** con un sector propio en `intelligence/sectores/<id>.js` (sus programas o servicios, sus campañas y su volumen del formulario).
   - Si el cliente no quiere IA hablando con sus leads: `sinAgentes: true` (oculta copiloto y agentes, avisos en vivo y respuesta desde el sistema). Ejemplo: `sectores/bsc.js`.

Reglas:
- Datos reales marcados [C] y con fuente; supuestos [E]; personas y cifras del panel, «de ejemplo».
- Nada de precios inventados del cliente: si no están publicados, «te lo cuenta <persona> en la llamada».
- Probar en 390 px y 1280 px antes de publicar y comprobar que qualivo.io devuelve 200.
- Preparar el guion de la reunión: lo que sabemos, preguntas, orden de la demo, objeciones y cierre.

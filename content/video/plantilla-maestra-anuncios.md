# Plantilla maestra de producción de anuncios · Qualivo

Cada concepto de anuncio se entrega completo con estas diez piezas. Sin una de ellas, no está
listo para grabar ni para montar. La línea creativa de la casa es **LAS FUGAS**: el recorrido
ANUNCIO → LEAD → RESPUESTA → SEGUIMIENTO → CITA → ASISTENCIA → VENTA y dónde se rompe.

## 0 · Ficha
- Nombre del concepto y código de exportación (`NN_Qualivo_<Concepto>_Hook-<X>_9x16`).
- Sector (formación / clínicas / reformas / todos) y a quién le habla.
- Tesis en una frase (lo que el espectador tiene que creer al terminar).
- Sensación buscada y siguiente reacción («quiero que miren mi proceso»).
- Duración objetivo y formato (45-60 s, 9:16).

## 1 · Hook (0-5 s)
- Hook A y Hook B, escritos palabra por palabra, con quién lo dice (Maikel / voz) y el texto en
  pantalla. Entrar en situación; movimiento desde el primer segundo; nunca una tarjeta negra
  con una pregunta.

## 2 · Guion
- Por bloques con tiempo aproximado, marcando **[a cámara]** o **[voz]**. Máximo dos frases por
  bloque. Vocabulario del sector (alumno, paciente, presupuesto) y neutro cuando es «todos».
- Cifras: solo las que podamos defender; los ejemplos se dicen como ejemplos.

## 3 · Qué graba Maikel
- Lista de tomas numerada: texto exacto, énfasis, veces (2-3), y si es a cámara o voz sobre
  planos. Instrucciones de grabación (móvil vertical, luz de ventana, micro cerca, fondo con
  algo, un segundo antes y después). Tomas de recurso (escuchar, mirar el móvil, asentir).

## 4 · B-roll
- Planos generados (Kling): prompt en inglés, 9:16, 5 s, sin pantallas legibles, sin caras
  reconocibles, sin texto en imagen, ambiente español. Uno por momento del guion.
- Pantallas de Intelligence: qué vista, qué historia de la demo, qué recorte, qué se resalta.
  Siempre con «datos simulados» visibles si son demo. Nunca métricas inventadas como reales.

## 5 · Textos en pantalla
- Por momento: texto exacto, tipo (titular / etiqueta FUGA / subtítulo / cifra / línea de
  recorrido) y cuándo entra. Enfatizan y simplifican; no transcriben la voz. 1-2 líneas.
  Palabras clave destacadas con un solo color de marca.

## 6 · Instrucciones al editor
- Ritmo por tramo (0-10 dinámico, 10-30 respira, 30-50 acelera, 50-60 baja).
- Transiciones con sentido narrativo (fundido = entrar, barrido = pasa el tiempo, pierde color
  = conclusión falsa, apertura = solución). Nada llamativo por mantener atención.
- Sonido: música muy por debajo de la voz; efectos solo en lead, WhatsApp, cambio de fuga,
  calendario y venta.
- Lista de «no»: robots, cerebros, circuitos, hologramas, estética IA, stock, apretones de
  manos, dashboards falsos, zooms constantes, emojis.

## 7 · CTA
- Frase de Maikel a cámara + pantalla final breve (1,5-2 s) con pregunta, oferta (diagnóstico
  gratuito · 30 minutos), botón (VER MIS FUGAS →) y marca.

## 8 · Variantes A/B
- Qué cambia (una sola cosa: normalmente el hook) y qué se mantiene idéntico. Qué pregunta
  responde el test y qué se mide (coste por reunión celebrada y leads A/B, no coste por lead).

## 9 · Exportación
- Nombres de archivo, 1080×1920, zona segura de Reels/Stories, versión con y sin subtítulos
  quemados si hace falta.

## 10 · Criterio final
Las diez preguntas del brief V2 (`2026-09-29-fugas-v2/brief-v2.md`): problema en 5 s, ganas de
saber qué pasó, qué es una fuga, ver el problema, ver el sistema, lead ≠ venta, IA como
mecanismo, Maikel explica, CTA natural, se entiende sin sonido.

## Cómo se produce (cadena actual)
Voz (ElevenLabs, voz «Javier · Qualivo» o la de Maikel) con tiempos por letra → planos (Kling
vía Higgsfield) y pantallas (Intelligence grabado con Playwright a 720×1280) → montaje con
`herramientas/video-plantilla/montar.py` (escenas, textos, transiciones, música con ducking) →
revisión con la lista de arriba → exportación A/B.

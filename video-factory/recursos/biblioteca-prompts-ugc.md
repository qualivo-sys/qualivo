# Biblioteca de prompts UGC (curso «Creativos UGC Realistas»)

Aportada por Maikel el 19-ago-2026. Referencia para todos los vídeos de la
video-factory. Resumen operativo — las plantillas clave, adaptadas a nuestro
flujo (Higgsfield Soul / HeyGen / Seedance / KIE).

## Estructura del prompt de vídeo (orden fijo)
1. Cámara (un solo plano o estática) 2. Acción/gesto (opcional)
3. Guión (lo que dice) 4. Voz del personaje 5. Acento

## Acento — línea probada para España (pegar al final de todo prompt con voz)
> Spanish with a neutral Peninsular (Madrid) accent, informal and
> conversational, like a real casual chat in Spain.

## Cámara — las más útiles (todas anti-corte)
- Estática + gestos: `(static camera, no movement) realistic arm movements and subtle micro-movements. Single continuous take, no cuts or scene changes.`
- Zoom lento a cara: `Slow, continuous zoom-in toward the subject's face, starting from the very first frame..., then holding. Single continuous take, no cuts or scene changes.`
- Seguimiento andando: `Tracking shot following alongside the subject as they walk and talk, smooth and steady. Single continuous take, no cuts or scene changes.`
- Antídoto de cortes (pegar al final si montamos plano propio): `single continuous take, no cuts or scene changes — the camera holds steady on the framing after the move`

## Micro-acciones
- Antes de hablar: `The person [acción], then looks at the camera and says: "[guión]"`
- Mientras habla: `The person says: "[guión]" [acción]`
- Catálogo: adjusts their cap · takes a sip of coffee · waves hello · laughs ·
  points up/left/right · crosses arms · shrugs · thumbs up · tilts head ·
  snaps fingers · taps chin thoughtfully...

## Voz (si no usamos la clonada) — receta
género + edad (in his 30s) + gravedad (deep/bright) + textura
(gravelly/smooth/breathy) + entrega (calm/energetic/warm/authoritative).

## Imagen — identidad y variaciones (Soul/seedream/KIE)
- Cambiar SOLO ropa: `keep the SAME person — same face, hair, body, pose, background and lighting. Change ONLY their clothing to [outfit]...`
- Cambiar SOLO fondo: `Replace the background behind the person with [sitio], keeping the person, their pose, lighting and framing exactly the same.`
- Outfit/fondo por referencia (2 imágenes): persona = imagen 1, ropa/fondo = imagen 2, «do NOT copy the face from image 2».
- Ángulos (mantener identidad): front / three-quarter 45° / side profile /
  high-angle / low-angle hero / full-body / bird's-eye / worm's eye /
  backlit silhouette / dutch angle / wide establishing.
- Character sheet 3×3 (hoja de identidad VFX): 9 retratos mismos rasgos,
  fondo gris neutro, «No beautify... No skin smoothing».
- Voltear: `Flip the image horizontally` (para podcast a 2).

## Producto y pantallas (2 imágenes)
- Producto en mano: `place the product in the person's hand so they are holding it up and showing it to the camera...` (label sin cambios)
- App/web en pantalla — FLUJO 2 PASOS: 1) generar persona con móvil/portátil
  de PANTALLA NEGRA (blank black rectangle, no reflections/UI/logos);
  2) meter la captura real encajada a la perspectiva («Do NOT crop or
  stretch the screenshot»). ← ideal para enseñar Qualivo/AFM en pantalla.

## Formatos
- UGC 1 persona: cámara + guión + voz + acento (+ micro-acción).
- Podcast 2 personas: cada una por separado, misma sala desde el otro lado
  («Do NOT make it a mirror image»), `Single speaker: only the person from
  the reference image talks`, montar cortes alternos.
- Dualcast (2 en plano): `The person on the LEFT is actively speaking...
  The person on the RIGHT is only listening, occasionally nodding...`
- Voz en off / b-roll: SIEMPRE `no talking` (boca cerrada) y narración
  encima en edición. Plantilla: `[movimiento de cámara], cinematic, no
  talking. Keep the SAME person from the reference. She [acción].
  [sitio + luz]. No text, no watermark.`
- Skincare/moda: secuencias con mecánica exacta (tapa flip-top con imagen
  de referencia del mecanismo; crema que disminuye hasta absorberse).

## Catálogo b-roll sin hablar (rellenar acción + sitio/luz + plano)
Acciones: rutina/mañana (café, espejo, portátil), calle/lifestyle (andando,
terraza, compras), producto (sostener, señalar, unboxing, comparar),
fitness, emociones (sorpresa, pensativo, risa real), comida.
Sitios+luz: baño mañana / dormitorio cálido / ventana / cocina luminosa /
calle / terraza / salón tarde / tienda / parque / noche flash directo.
Planos: frontal / 3-4 / perfil / primer plano / medio / entero / picado /
contrapicado / desde atrás / espejo.

## Character sheet maestro de Maikel (19-ago-2026)
Archivo: `video-factory/recursos/character-sheet-maikel.png` (3×3, 2048px,
generado con seedream_v5_pro desde su foto real de entrenamiento del Soul).

Instrucción de uso en generaciones con 2 referencias (aportada por Maikel):
> Reference image 1 defines the scene, framing, composition and action.
> Reference image 2 is a character sheet provided only as an identity
> reference: match the subject's facial features, proportions and physical
> traits exactly. Do not copy the layout, background, framing or poses from
> reference image 2.

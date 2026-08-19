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
⚠️ **DESCARTADO por Maikel (19-ago): "no se parece nada a mí"** — el sheet de
seedream_v5_pro arrastra deriva de identidad. NO usarlo como referencia.
Pendiente de regenerar (nano banana pro con las 4 fotos reales, o los modelos
"omni" de KIE) cuando haya créditos. Mientras tanto: **usar SIEMPRE las 4 fotos
reales de `identidad/` directamente como referencias** — sin sheet intermedio
no hay deriva por construcción (nano banana pro admite hasta 8 imágenes).
Archivo antiguo: `video-factory/recursos/character-sheet-maikel.png`.

Instrucción de uso en generaciones con 2 referencias (aportada por Maikel):
> Reference image 1 defines the scene, framing, composition and action.
> Reference image 2 is a character sheet provided only as an identity
> reference: match the subject's facial features, proportions and physical
> traits exactly. Do not copy the layout, background, framing or poses from
> reference image 2.

## Fotos reales de identidad (19-ago-2026, aportadas por Maikel)
Carpeta: `video-factory/recursos/identidad/`
- `foto-frontal-escritorio.jpg` — frontal nítida, luz natural → REFERENCIA PRIMARIA de identidad
- `foto-perfil-bebiendo.jpg` — perfil izquierdo completo
- `foto-perfil-abajo.jpg` — perfil 3/4 mirada baja
- `foto-entrenamiento-soul.jpg` — la usada para entrenar el Soul de Higgsfield
Uso: en generaciones de 2 referencias, cualquiera de estas (o el character
sheet) va como imagen 2 = solo identidad. La frontal es la mejor ancla.

---

## Skill del curso: Método 6C (AvatarHype Prompt Engine)

Instalada en `.claude/skills/avatarhype-6c-prompt-engine/SKILL.md`. Genera prompts de imagen
hiperrealista estilo iPhone/UGC con 6 componentes: Character, Camera, Clothing, Context,
Cinematic Light, Consistency Anchors. Salida siempre en inglés, un solo bloque, terminando en
"No text, no watermark, no distortion." Nunca menciona AI/CGI/hyperrealistic; siempre incluye
detalle de piel (pores, freckles, imperfections). Modo CHANGE-ONLY: cambiar solo outfit /
localización / pose manteniendo el resto idéntico — encaja con la instrucción de 2 referencias
(ref 1 = escena, ref 2 = solo identidad).

---

## Herramienta: MakeItYours (makeityours.app) — conversión de voz en post

Cambia la voz de un vídeo YA terminado sin regrabar: aísla la pista vocal (respeta música y
ambiente) y la sustituye por una voz del catálogo o un clon de la voz de Maikel, manteniendo
imagen y lipsync. MP4/MOV hasta 3 min y 500 MB. Sin API pública → flujo manual por su web
(cuenta de Maikel; el clon de voz requiere muestra con verificación de consentimiento).
Planes: $13.99/20min · $27.99/65min · $54.99/140min+3 clones · $139/400min+10 clones.

**Cuándo usarla**: un clip generado (Seedance, Kling, etc.) trae buena interpretación pero la
voz no es la de Maikel o pronuncia mal → conversión en post conservando el ritmo. Complementa
la vía principal (nota de voz real de Maikel → lipsync). También vale para doblar a otros
idiomas con acento regional.

---

## Skill del curso: El Estratega (estratega-avatarhype)

Instalada en `.claude/skills/estratega-avatarhype/SKILL.md`. Director creativo de respuesta
directa: convierte cualquier producto en guiones UGC que venden para Meta/TikTok. Flujo de
5 fases (brief → estrategia con gate → guiones → revisión → handoff clip a clip). Incluye el
MÁSTER completo "Anuncios que venden" (12 ángulos, voz del cliente, Schwartz, mecanismo/Todd
Brown, oferta/Hormozi, Cialdini, historia A→B, Sugarman, testing modular hook/hold).
Usarla SIEMPRE que se pidan guiones de anuncio, hooks o ángulos — respeta el gate de Fase 2
(no escribir guiones hasta que Maikel elija ángulos). `metodo-angulos.md` queda como
referencia rápida; esta skill es el motor operativo.

---

## Capa de realismo (color grade del curso — aplicar a TODO clip generado por IA)

Valores CapCut del curso: temp -3 · tint +2 · saturation -6 · exposure -3 ·
contrast +12 · highlight -35 · shadow +18 · fade +6.

Objetivo: que el clip generado parezca grabado con móvil — se quita el look "render"
bajando saturación y aplastando luces altas, levantando sombras y con negros ligeramente
lavados (fade).

Equivalente ffmpeg para nuestro pipeline (aplicar antes del encode web-safe):

```
-vf "eq=saturation=0.94:contrast=1.12:brightness=-0.015,\
curves=master='0/0.023 0.25/0.30 0.75/0.70 1/0.97',\
colorbalance=bs=0.02:bm=0.01:gm=-0.01:bh=-0.02"
```

- `eq` → saturación -6, contraste +12, exposición -3.
- `curves master` → shadow +18 (sube el cuarto bajo), highlight -35 (comprime el cuarto
  alto), fade +6 (negro arranca en ~0.023, blanco no llega a 1).
- `colorbalance` → temp -3 (un punto más frío en sombras) y tint +2.

En Remotion, alternativa por CSS en el clip: `filter: saturate(0.94) contrast(1.12)
brightness(0.985)` + overlay negro al 2-3% para el fade (las curvas de highlights/shadows
solo salen bien en ffmpeg).

---

## Costes reales medidos en KIE (19-ago-2026)

- nano banana pro, imagen 1K con referencias: **18 créditos**
- Kling 2.6 image-to-video, 5 s 1080p: **~55 créditos**
- (saldo inicial 80 → tras 1 imagen + 1 clip: 7)

Regla: presupuestar ~73 créditos por plano de localización (imagen + animación).
Un vídeo de 3-4 localizaciones ≈ 220-300 créditos.

---

## El vídeo: montar el prompt de animación (imagen ya creada → clip con voz)

**Orden de piezas** (acción opcional):
1. Cámara → 2. Acción (gesto) → 3. Guión (`says: "..."`) → 4. Voz (`Voice: ...`) → 5. Acento.

### Movimientos de cámara (ya llevan el anti-corte)
- ★ **El más usado**: `(static camera, no movement) realistic arm movements and subtle micro-movements. Single continuous take, no cuts or scene changes.`
- **Plano fijo**: `Locked-off static shot, camera completely still on a tripod, no movement at all. Single continuous take, no cuts or scene changes.`
- **Zoom lento a la cara**: `Slow, continuous zoom-in toward the subject's face, starting from the very first frame and moving steadily closer, then holding steady on the close-up for the rest of the clip. Single continuous take, no cuts or scene changes.`
- **Zoom rápido al hablar**: `Fast zoom-in to the subject's face at the very start, settling into a close-up exactly as they begin to speak, then holding steady. Single continuous take, no cuts or scene changes.`
- **En mano sutil**: `Subtle handheld movement, very slight and natural, for a real human feel without distraction. Single continuous take, no cuts or scene changes.`
- **Acercamiento sutil (podcast)**: `Very gentle, almost imperceptible slow push-in on the speaker, from a medium shot to a medium close-up over the whole clip. Single continuous take, no cuts or scene changes.`
- **Retroceso que revela**: `Slow pull-back from a close-up, revealing the surrounding environment as the subject starts talking, then holding on the wider shot. Single continuous take, no cuts or scene changes.`
- **Órbita lenta**: `Slow arc shot, the camera orbiting around the subject in a smooth half-circle, subject stays centered. Single continuous take, no cuts or scene changes.`
- **Seguimiento al caminar**: `Tracking shot following alongside the subject as they walk and talk, smooth and steady. Single continuous take, no cuts or scene changes.`
- **Push-in a los ojos**: `Slow creeping push-in that tightens into an extreme close-up on the eyes right as the key line is delivered, then holds. Single continuous take, no cuts or scene changes.`
- **Contrapicado heroico**: `Low-angle hero shot looking up at the subject, slow push-in for authority and impact, then holding. Single continuous take, no cuts or scene changes.`
- **Bokeh**: `Shallow depth of field with a creamy bokeh background, slow push-in on the in-focus subject, then holding. Single continuous take, no cuts or scene changes.`
- **Cámara lenta**: `Slow-motion delivery, smooth and cinematic, with a subtle camera drift. Single continuous take, no cuts or scene changes.`
- Coletilla anti-corte para planos propios: `single continuous take, no cuts or scene changes — the camera holds steady on the framing after the move`

### Micro-acciones (gesto ≠ guión)
- Antes de hablar: `The person [acción], then looks at the camera and says: "[guión]"`
- Mientras/después: `The person says: "[guión]" [acción]`
- Combinadas: `The person adjusts their cap, then says: "[guión]" and smiles.`
- Catálogo: adjusts their cap · takes a sip of coffee and sets the cup down · fixes their hair · waves hello · laughs · with a surprised look on their face · and nods slowly, smiling · points up / up to the left / to the right · crosses their arms · shrugs · gives a thumbs up · claps once · tilts their head curiously · adjusts their glasses · tucks hair behind their ear · taps their chin thoughtfully · snaps their fingers · rolls their eyes playfully.

### Voz (misma línea `Voice:` en todos los clips del personaje, misma sesión)
**Para Maikel (hombre mediados de 30):**
`Voice: a male voice in his mid-30s, medium pitch, a bit fuller and more settled than a twenty-something, calm and confident, friendly but grounded.`
Otras plantillas: hombre ~50 (deep, warm, gravelly) · hombre 25-30 (bright, energetic) · mujer ~50 (warm, mature, smoky) · mujer 25-30 (light, lively) · mujer 30s (fuller, settled).
Receta libre: género + edad + gravedad (deep/bright) + textura (gravelly/smooth/breathy) + entrega (calm/energetic/warm/authoritative).

### Acentos (línea final de todo prompt con voz)
- **España (LA NUESTRA)**: `Spanish with a neutral Peninsular (Madrid) accent, informal and conversational, like a real casual chat in Spain.`
- Argentina rioplatense · Colombia Bogotá · México CDMX · LatAm neutro (mismas fórmulas, cambiar región).

### Acciones especiales moda/skincare (imagen → vídeo, no talking)
Patrón común: `Using this image as reference, keep the SAME person (same face and identity) and the SAME location, background and lighting as the reference (do NOT change the setting). [ACCIÓN]. Cinematic lighting, no talking, mouth closed. Single continuous take, no cuts.`
Acciones: cuerpo entero mostrando outfit · detalle de tejido · giro 360 turntable · andando tipo pasarela · pose editorial · detalle de accesorio.

---

## RECETA VALIDADA (19-ago): avatar walking-talking con Grok 1.5 vía KIE

Pipeline de 2 pasos por toma (~83 créditos KIE):

1. **Imagen de arranque en escena** — `nano-banana-pro`, 9:16, refs = 2 FOTOS REALES
   de `identidad/sesion-*.jpg` (nunca character sheets: doble salto = deriva).
   Prompt 6C describiendo el PRIMER frame de la toma (postura, calle, luz).
2. **Animar con diálogo** — `grok-imagine-video-1-5-preview`, image_urls = [imagen paso 1],
   1080p, 9:16, 8-10s. El prompt lleva: cámara + "Continue naturally from the first frame"
   + guión con `says:` + Voice línea hombre 30s + acento Madrid + anti-corte.

Reglas aprendidas a base de pruebas:
- **1 sola imagen de referencia en Grok = CON voz; varias = SIN voz.**
- Grok hereda el aspect ratio de la imagen de entrada (el parámetro se ignora) →
  la imagen de arranque debe ser ya 9:16.
- El vídeo siempre arranca mostrando la imagen de entrada → si la imagen es la foto
  en la pared, sale un morph raro; si es la escena, arranca perfecto.
- Contra el efecto robot: "continuous natural flow, WITHOUT long pauses", parpadeos,
  media sonrisa, mirada breve a un lado, un gesto de mano, "nothing exaggerated".
- La voz de Grok dice el guion EXACTO (verificar siempre con Whisper) con acento
  peninsular decente. La pausa entre frases se controla desde el prompt.
- Raccords entre tomas: terminar una toma con un objeto/gesto delante de cámara
  (móvil, mano) y arrancar la siguiente con el mismo elemento.
- Después de generar: recorte a 1080×1920 exacto + capa de realismo + encode web-safe.
- HeyGen queda SOLO para primeros planos estáticos con el gemelo (nunca para
  planos caminando: solo anima el busto).

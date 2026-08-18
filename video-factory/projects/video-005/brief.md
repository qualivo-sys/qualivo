# video-005 · «Demasiadas piezas» — el manifiesto

> Creado el 18-ago-2026 a partir del concepto de Maikel. 75-90 s, vertical 9:16.
> No es un anuncio de Qualivo + Agent for Me: es el vídeo de la filosofía.
> Tesis: **«No me interesa la IA. Me interesa construir empresas que funcionen
> mejor.»** Qualivo y Agent for Me son las dos herramientas de esa filosofía.

## Tres decisiones de dirección (cambian el concepto original)

### 1. Cero planos generados. Todo real + gráficos.

El concepto pide «90 % realidad + 10 % gráficos» y «que no parezca un vídeo de
IA». El bloque del problema (oficina con comercial, fundador, varias personas
a la vez) exigiría actores generados con Kling — exactamente la estética que el
propio concepto prohíbe, y contra las Reglas 1-6 (coreografías multi-persona =
fallo casi seguro).

**Solución: la versión honesta.** Maikel construye solo y lo cuenta en público.
El caos no se representa con una oficina fingida: se representa con SU mesa,
SUS pantallas y SUS manos. El «todo ocurre simultáneamente» se hace en montaje
— la pantalla se va partiendo en 2 y luego en 4 con sus propios clips sonando a
la vez. Más barato (0 creditos), más premium y más coherente con la marca que
un figurante sintético.

### 2. Los números de la interfaz son los reales

El concepto pone «Equipo comercial: 14 horas/semana» como ejemplo inventado.
Usamos la cifra real del caso de esta mañana: **15 h/semana** (la correduría,
3 h/día picando pólizas — el caso del Auditor). Regla editorial: ningún dato
sin fuente; este lo tenemos grabado.

### 3. La plantilla usa el catálogo real

«SOFÍA / DIEGO / LUCÍA» no existen. Las fichas que aparecen son las del
catálogo de la fuente de verdad: **SDR Digital · Collection Digital · Content
Creator** (+ las que se quieran de las 9). Se presentan como fichas de
plantilla, sin nombres de pila inventados.

## La voz

La voz en off es **la de Maikel, grabada de verdad** (nota de voz, habitación
sin eco, móvil a un palmo). Un manifiesto con voz sintética se desmiente a sí
mismo. El guion de locución completo está en `guion-voz.md`, numerado para
grabarlo línea a línea.

## Reparto de producción

| Quién | Qué |
|---|---|
| **Maikel rueda** (una sesión, ~30 min, móvil 4K vertical) | 8 clips + la voz. Lista exacta en `rodaje.md` |
| **Claude construye** | Las pantallas reales (CRM, correo, hoja de cálculo, WhatsApp Web), la interfaz de diagnóstico animada (el «capó» con zonas en rojo), el antes/después, las fichas de plantilla, los rótulos finales, el montaje entero, color, sonido, subtítulos |
| **Kling** | Nada. 0 creditos |
| **Música** | Externa (biblioteca con licencia o nativa de la plataforma). Higgsfield no genera música |

## Coste y plazo

- Creditos Higgsfield: **0**
- Lo único que bloquea: los 8 clips + la voz de Maikel. Con eso en el Drive,
  el montaje completo sale en un día de trabajo.

## Destinos

Pieza madre 9:16 (Reels/TikTok, 75-90 s) → recorte 45 s para LinkedIn →
los bloques 3-5 sirven sueltos como piezas cortas. Es también el vídeo de
cabecera natural para maikelechevarria.com.

---

## Actualización 18-ago (tarde) — versión producida SIN Maikel

Maikel decidió no salir ni grabar. Cambios sobre el plan original:

- **Sin rodaje**: los 7 clips previstos se sustituyeron por 5 planos de Kling
  sin cara visible (manos tecleando, hombre de espaldas ante la pantalla,
  móvil con notificaciones, portátil cerrándose, calle al atardecer). 50 creditos.
- **Sin voz en off**: se auditó todo el catálogo de voces de Higgsfield con un
  detector de acento (transcripción fonética con Whisper forzada a inglés: la
  zeta castellana aparece como «th») y todas las voces en castellano hacen
  seseo. Antes que una voz latina, la pieza es 100 % tipográfica.
- **Coletilla de honestidad** en la tarjeta final: «Este vídeo lo ha montado
  un empleado digital» + agentforme.io.
- Resultado: `manifiesto-v005.mp4`, 77 s, 1080×1920. La música se añade
  nativa al publicar. Si Maikel algún día graba la locución (10 min, sin
  cámara), se integra sin rehacer el montaje.

## Actualización 18-ago (2ª) — versión final CON voz y música

- **Voz**: Qwen Audio TTS con instrucción de acento castellano peninsular
  (verificado con heurística Whisper y aprobado por Maikel sobre muestra).
  14 líneas, incluidos dos puentes nuevos y el remate hablado: «Este vídeo,
  por cierto, lo ha narrado y montado un empleado digital».
- **Música**: sintetizada con ffmpeg — tres acordes graves encadenados
  (Am→F→C, filtrados a 650 Hz) + pulso suave a 61 Hz. Entra en «Por eso
  creamos Qualivo» y se retira al final.
- **Móvil arreglado**: el plano con texto ilegible en pantalla se sustituyó
  por uno nuevo de Kling con el móvil boca abajo vibrando (10 creditos más;
  60 en total).
- Resultado: `manifiesto-v005-voz.mp4`, 80 s. Montaje reproducible en
  `montar2.py` (scratchpad v005).

## Actualización 18-ago (3ª) — v10: mezcla real + motion, Remotion

Feedback de Maikel sobre la v9 (solo motion): «hay que hacer un mix entre
ambas cosas», tipografía «cutre», música aburrida, voz con poco ritmo y
frases de relleno.

- **Mezcla real + motion**: el proyecto Remotion (`remotion/`) intercala
  metraje Kling (portátil, espaldas, móvil) y grabaciones reales de pantalla
  (WhatsApp, CRM, hojas, correo, buscador) como tarjetas dentro de las
  escenas cinéticas. Pasos y Remate quedan como bloques 100 % motion.
- **Tipografía nueva**: Anton (display condensada, golpes en mayúsculas) +
  Space Grotesk (etiquetas con tracking) + Montserrat de apoyo. OJO: este
  Chromium headless no aplica webfonts → las fuentes van instaladas a nivel
  de sistema (`/usr/local/share/fonts/v10/` + `fc-cache`); `loadFont()` de
  @remotion/fonts NO basta en este entorno.
- **Voz v10**: guion condensado (se elimina «¿el resultado?… y mientras
  tanto el negocio…»), 5 tomas Qwen a speech_rate 1.2 con instrucción de
  ritmo de anuncio; ~41 s de locución sin huecos. Una pausa residual se
  recortó con ffmpeg (atrim+concat). Cada toma verificada con Whisper.
- **Música v10**: `music10.py` — 122 BPM, four-on-floor con hats en
  contratiempo, bajo sincopado Am-F-C-G, riff de gancho de 2 compases,
  fills, corte seco de 1 compás al entrar «Son dos pasos» y pico final.
  Risers + booms en cada transición, sidechain al bombo y ducking bajo la voz.
- Resultado: 49,9 s, 1080×1920, publicado en
  https://maikelechevarria.com/media/2026-08-18-manifiesto/manifiesto.mp4

## Actualización 18-ago (4ª) — v10.1: música real y voz continua

Feedback: «La música es horrible y la voz se corta».

- **Voz**: el `from` que retrasaba cada toma NO existe en el `<Audio>` de
  @remotion/media (se ignoraba en silencio). Se eliminó todo el audio de las
  escenas Remotion: la locución va ahora en UNA pista maestra continua
  (`vo-master`) montada con numpy a offsets exactos (0.30 / 6.30 / 13.50 /
  22.90 / 37.40 s) con microfades de 15 ms — imposible que se corte. La toma
  final se regeneró limpia (sin el empalme quirúrgico de la 3ª).
- **Música**: fuera el sintetizador. Track real: **«Exhilarate» de Kevin
  MacLeod (incompetech.com), licencia CC BY 4.0** — electrónica enérgica,
  ventana 3.88–53.78 s (arranque alineado a un golpe), ducking bajo la voz y
  fade final. ⚠️ Al publicar en redes hay que acreditar:
  «Música: Exhilarate — Kevin MacLeod (incompetech.com), CC BY 4.0».
  Alternativas descargadas y analizadas en caso de cambio: Cut and Run,
  Getting it Done, Voxel Revolution (más oscura), etc.
- Mezcla: voz +7 dB sobre la música + compresión sidechain; máster a
  −14 dB de media, pico −0.1 dB.

## Actualización 18-ago (5ª) — v11: estructura «editor de vídeo natural»

Feedback de Maikel: la primera mitad debe ser imagen real (como v5/v6), las
animaciones solo al final; música normal/animada (ni rock ni años 80);
pasar ejemplos cortos antes de montar el vídeo entero.

- **Primera mitad (0–13 s)**: metraje Kling y capturas de pantalla A PANTALLA
  COMPLETA con cortes secos sincronizados a la voz + subtítulos cinéticos
  (componente `Subs.tsx`, estilo ASS de v5/v6). Sin escenas de motion.
  El playbackRate de cada plano se elige para que el clip no se agote y
  congele dentro del plano.
- **Segunda mitad (13–50 s)**: las animaciones de v10 sin cambios (fugas con
  sellos, TIEMPO=DINERO, dos pasos, cadena, timeline, logos).
- **Música**: «Buddy» de Bensound (piano + palmas, animada sin pasarse).
  Crédito necesario en la caption: «Música: Buddy — Bensound.com».
  Descartadas por feedback: sintetizada propia (aburrida/horrible),
  Exhilarate (años 80), Voxel Revolution (rockera).
- **Flujo de trabajo**: preview corto por chat (SendUserFile) ANTES del
  montaje completo.
- Publicado (49.9 s, mismo URL).

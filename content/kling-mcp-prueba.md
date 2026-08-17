# Kling + MCP — prompt maestro de la primera prueba

> Guardado el 17-ago-2026. La especificación de abajo es de Maikel, literal. Las
> **anotaciones** son comprobaciones hechas contra la documentación y las
> herramientas que ya tenemos conectadas, para no perder tiempo mañana.

---

## ⚠️ Tres cosas comprobadas antes de empezar

### 1. Kling 3.0 ya está disponible sin construir nada

Higgsfield —que ya está pagado y conectado a Claude por MCP— expone Kling entre
sus modelos de vídeo. Su propia herramienta `generate_video` documenta:

> «Default generation models: `seedance_2_5` for general text-to-video and
> multimodal reference consistency; **`kling3_0` for multi-shot, audio, or motion
> transfer**».

Es decir: el criterio de éxito de la prueba —«Claude, genera este plano» y que
aparezca un MP4— **se puede cumplir hoy, sin escribir una línea de código.**

Eso no invalida construir el MCP propio, pero cambia el motivo. Las razones
buenas para hacerlo son: controlar el coste por vídeo, llegar a modelos que
Higgsfield no exponga, y no depender de un intermediario. La razón mala es
«para poder generar vídeo», porque eso ya lo tenemos.

**Decisión pendiente de Maikel.**

### 2. La suscripción de consumidor NO da acceso a la API

La API de Kling (`kling.ai/dev`) funciona con **paquetes de recursos de prepago
completamente separados** de las membresías de consumidor. Tener plan de pago en
la app no da acceso a la API.

Precios de referencia: de **0,18 $ a 1,70 $ por vídeo de 5 segundos** según el
modelo (11 niveles).

**Acción antes de empezar:** dar de alta el acceso de desarrollador y comprar un
paquete pequeño. Si esto no está hecho, la prueba se para en el paso 3.

### 3. Las credenciales de la especificación son las antiguas

La especificación pide `KLING_ACCESS_KEY` + `KLING_SECRET_KEY`. Según la
documentación de autenticación, ese par **solo sirve para Kling 3.0 y anteriores**.
Hay un formato nuevo de **API Key único** que es el requerido para todos los
modelos.

**Corrección propuesta:** que el servidor MCP soporte los dos, con el API Key
nuevo como camino principal y el par antiguo como respaldo. Documentación de
autenticación: <https://kling.ai/document-api/apiReference/commonInfo>

### 4. Conflicto de agenda

El plan de la semana acordado el lunes reserva el bloque de Producto de mañana
(10-12) para preparar el arranque de **Antic Barcelona, que empieza el viernes**.
Construir el MCP mañana se come ese bloque. Es decisión de Maikel, pero queda
escrito para que sea una decisión y no un despiste.

---

## Especificación (literal, de Maikel)

Quiero que construyas desde cero un proyecto para integrar Kling AI con Claude
Code mediante un servidor MCP.

### OBJETIVO

Quiero poder utilizar Claude Code como agente de producción de vídeo y darle
herramientas que llamen a la API oficial de Kling.

La primera versión debe permitir:

1. Generar un vídeo desde texto.
2. Generar un vídeo desde una imagen de referencia.
3. Consultar el estado de una generación.
4. Obtener la URL del vídeo generado.
5. Descargar el vídeo localmente.

### ARQUITECTURA

```
Claude Code
   ↓
MCP Server propio
   ↓
Kling AI API
   ↓
Generación de vídeo
   ↓
Resultado
```

### IMPORTANTE

No quiero utilizar scraping de la web de Kling.
No quiero automatizar el navegador.
No quiero utilizar APIs no oficiales si existe una API oficial.
Utiliza exclusivamente la documentación oficial de Kling AI.

Antes de escribir código:

1. Revisa la documentación oficial actual de Kling AI API.
2. Identifica: método de autenticación · endpoints disponibles · formato de las
   peticiones · formato de las respuestas · cómo se crean las tareas · cómo se
   consulta el estado · cómo se obtiene el resultado · límites de concurrencia ·
   modelos disponibles actualmente.
3. No inventes ningún endpoint ni parámetro.
4. Si algo de la documentación no está claro, detente y explícame qué falta.

### TECNOLOGÍA

Arquitectura sencilla y mantenible. Preferencia: TypeScript · Node.js · MCP
oficial/estándar compatible con Claude Code · cliente HTTP para Kling API ·
variables de entorno para las credenciales · estructura modular.

### CREDENCIALES

Nunca escribas claves API directamente en el código. Utiliza `KLING_ACCESS_KEY`
y `KLING_SECRET_KEY` en un `.env` local y crea un `.env.example` sin secretos.

> **Anotación:** ver punto 3 de arriba — hace falta también el API Key nuevo.

### MCP TOOLS

1. **`kling_text_to_video`** — prompt, duration, aspect_ratio, model. Crea la
   tarea y devuelve el identificador.
2. **`kling_image_to_video`** — image_url, prompt, duration, aspect_ratio, model.
3. **`kling_check_generation`** — task_id. Consulta el estado.
4. **`kling_get_video`** — task_id. Obtiene el resultado final.
5. **`kling_download_video`** — task_id, output_path. Descarga el vídeo.

### GESTIÓN DE ERRORES

Errores HTTP · errores de autenticación · task_id inexistente · generación
fallida · timeout · rate limits · respuestas incompletas · URL de vídeo
inexistente. Los errores deben ser claros para que Claude Code pueda decidir qué
hacer.

### POLLING

Crear tarea → guardar task_id → consultar estado → detectar éxito o fallo →
devolver resultado. **No hagas polling infinito.** Timeout y backoff razonables.

### LOGGING

Qué herramienta se ha ejecutado · qué task_id se ha generado · estado de la tarea
· errores · duración de la operación.

### TEST

Tests mínimos para: autenticación · creación de tarea · consulta de tarea ·
manejo de error · respuesta exitosa. **No gastes créditos de Kling
innecesariamente durante los tests automáticos.**

### PRIMER TEST REAL

> «Genera un vídeo de 5 segundos de una persona caminando por una calle de
> Barcelona al atardecer, estilo documental cinematográfico, movimiento natural
> de cámara, iluminación realista y textura de piel natural.»

Comprobar que: Claude llama al MCP → el MCP llama a Kling → Kling crea la tarea →
obtenemos el task_id → consultamos el estado → obtenemos el vídeo → el vídeo se
descarga localmente.

### FASE 2 — NO IMPLEMENTAR TODAVÍA

```
IDEA → RESEARCH AGENT → SCRIPT AGENT → DIRECTOR AGENT → STORYBOARD → PROMPTS
     → KLING → VOICE AGENT → EDITOR AGENT → QA AGENT → VIDEO FINAL
```

No construir esta fase hasta que la integración Kling + MCP esté funcionando.

### FORMA DE TRABAJO

No hagas todo de golpe. Primero: analiza la documentación · propón arquitectura ·
dime qué instalar · dime qué credenciales necesito · crea la estructura · implementa
· ejecuta tests · haz una primera generación real · comprueba el vídeo.

Después de cada fase, explica brevemente qué has hecho y qué hay que comprobar.

Si algo de esta especificación entra en conflicto con la documentación actual de
Kling, **prioriza siempre la documentación oficial** y explica el cambio.

### REQUISITOS DE MÁQUINA

1. Windows + Node.js
2. Claude Code funcionando
3. Cuenta y acceso de API de Kling (ver punto 2 de las anotaciones)

---

## Qué ya tenemos hecho y no hay que rehacer (17-ago-2026)

De la prueba de edición de hoy, todo verificado sobre un vídeo real de 52 s:

- **Transcripción en castellano con marcas por palabra** (faster-whisper, modelo
  `small`, 23 s para procesar 52 s de vídeo).
- **Detección y eliminación de silencios** a partir de esas marcas.
- **Reordenar planos** y reproyectar los rótulos al nuevo montaje — sin esto,
  cualquier corte descoloca todos los rótulos.
- **Subtítulos quemados** con la tipografía y la paleta de marca, con entrada
  animada. Dos trampas: `fontsdir` intenta cargar como fuente *todos* los
  archivos de la carpeta (usar una carpeta solo con la fuente), y las fuentes del
  repo son variables (hay que instanciar una estática en peso 900).
- **Rótulos** como PNG generados con Chromium, porque este ffmpeg **no tiene
  `drawtext`**.
- **Corrección de contraluz, viñeta, ecualización de voz, ducking de música,
  barra de progreso, fundidos** y compresión a tamaño publicable.
- Higgsfield **no genera música**: su herramienta de audio solo hace voz, y sus
  modelos de música son exclusivos del generador de juegos. La música tiene que
  venir de fuera.

El motor de edición existe. Lo que falta es la capa de decisión y, si se decide,
la generación de planos.

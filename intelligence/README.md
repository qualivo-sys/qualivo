# Qualivo Intelligence · demo comercial

Demo interactiva en `qualivo.io/intelligence`. HTML y JavaScript sin build ni dependencias. No se enlaza desde la web y lleva `noindex` (cabecera en `vercel.json`). Este README no se despliega (`.vercelignore`).

Todos los datos son ficticios. La demo no envía mensajes, no llama y no toca GHL: solo lee su propio dataset.

## Enlaces preparados

```
/intelligence/?sector=formacion&empresa=Skolae&objetivo=seguimiento&historia=empresa
/intelligence/?sector=saas&empresa=NOMBRE&objetivo=conversion
/intelligence/?sector=b2b&empresa=NOMBRE&objetivo=ventas
/intelligence/?sector=clinica&empresa=NOMBRE&objetivo=seguimiento
/intelligence/?sector=inmobiliaria  ·  ?sector=reformas  ·  ?sector=otro
```

Parámetros:

- `sector`: formacion, saas, b2b, clinica, inmobiliaria, reformas u otro. Sin él sale la pantalla de inicio.
- `empresa`: aparece en la cabecera («Intelligence System · Skolae») y en el Copilot.
- `objetivo`: captacion, conversion, seguimiento, ventas, retencion, expansion o todo. Ordena las preguntas sugeridas y resalta los KPI.
- `historia`: la historia del modo demo, si el sector tiene varias (formación: `empresa` o `alumno`).
- `vista`: pantalla inicial (resumen, oportunidades, senales…).
- `demo=1`: arranca el modo demo al abrir.

Guiones de presentación: `content/intelligence-guiones.md`.

## Cómo está hecho

- `js/motor.js`: el único motor. Calcula encaje, actividad, intención y riesgo (0-100) a partir de los datos de cada contacto, y de ahí saca la prioridad con su porqué, la siguiente acción, las señales y la línea de tiempo. Nada está puesto a mano.
- `js/app.js`: el estado único y las pantallas.
- `js/copilot.js`: el Copilot. Las preguntas sugeridas se calculan del estado, al instante y sin red. Las preguntas libres van a `/api/intelligence-copilot` (Claude con herramientas sobre el mismo estado). Si esa llamada tarda más de 9 s o falla, contesta la pregunta sugerida más parecida.
- Pantalla **Anuncios** (`anuncios()` y `notaAgencia()` en `js/app.js`): cruza cada campaña con los contactos que trajo y da un veredicto (escalar, mantener, revisar público o «no es el anuncio»), los eventos que vuelven a las plataformas y la nota semanal para la agencia. No gestiona campañas: es la capa de inteligencia encima de quien las lleve.
- `js/demo.js`: el modo demo. Modifica el mismo estado, así que el contacto nuevo aparece en Oportunidades y el Copilot lo conoce.
- `sectores/*.js`: un archivo por sector con sus términos, recorrido, campañas del mes, KPIs, reglas de encaje, preguntas, historia y contactos.

## Cambiar los datos de un sector

Edita `sectores/<sector>.js`:

- **Contactos** (`contactos`). Los tiempos van en minutos desde ahora (`creado`, `act` = su última actividad, `toque` = nuestro último mensaje). Las señales van en `s`: `precio`, `visitas`, `urg` + `urgTxt`, `ppto`, `luego` + `luegoTxt` («más adelante»), `noshow`, `cita` (minutos hasta la cita) + `citaOk`, `prop` (minutos desde que se envió la propuesta) + `propVista`, `intentos`, `exp` (expansión), `bloqueo`. La conversación va en `conv`: `[minutos, 'c' contacto | 'a' agente | 'h' persona | 'v' voz, 'wa' | 'email' | 'voz', texto]`.
- **Campañas del mes** (`campanas`). Cada una trae su inversión, su ticket y cuántos pasan por cada etapa. De ahí salen los KPI, el embudo y las fugas, así que siempre cuadran.
- **Reglas de encaje** (`reglas.fit`): `[condición, puntos, porqué, etiqueta para la pantalla Inteligencia]`.

Después de tocar datos, comprueba el reparto: cuántos requieren atención, quién va a una persona y cuál sale como mayor fuga. Con cualquier servidor estático en la raíz del repo, abre `/intelligence/?sector=<sector>`.

## Añadir un sector

1. Copia `sectores/formacion.js` a `sectores/<id>.js` y cambia `id`, `nombre`, los términos (`t`), el recorrido, las campañas, las reglas, las preguntas, la historia y los contactos.
2. Añade el sector a la lista `SECTORES` al principio de `js/app.js` (id, nombre, descripción e icono de `js/iconos.js`).

El motor, el Copilot y el modo demo no se tocan.

## Función del Copilot

`api/intelligence-copilot.js` usa `ANTHROPIC_API_KEY` (ya está en Vercel) y `ANTHROPIC_MODEL` (por defecto `claude-opus-5`). Topes de uso, en memoria de cada instancia: 30 preguntas al día por IP (`INTELLIGENCE_MAX_IP`) y 400 en total (`INTELLIGENCE_MAX_DIA`), con 1.500 tokens por respuesta. Devuelve bloques (texto, tarjetas de contacto, tabla, métricas, acción) y descarta cualquier contacto que no exista en el dataset.

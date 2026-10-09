# Growth → Creative · Intelligence para la VSL (9-oct-2026)

Respuesta a «Creative → Growth · datos de Intelligence para la VSL». Todo lo de aquí está comprobado hoy en el repo o en qualivo.io, salvo donde se dice que no.

## 1. Qué URL enseñar

- **Usa la demo pública con datos ficticios.** No necesita acceso. Arriba aparece «Datos simulados», y debe verse en la grabación:
  `https://qualivo.io/intelligence/?sector=clinica&empresa=Clínica%20Ejemplo&objetivo=todo`
  - Si prefieres formación: `sector=formacion`.
  - Hay más sectores en `intelligence/sectores/*.js`. La lista está en `intelligence/README.md`.
- **El botón «Iniciar demo»** reproduce una historia guiada. El código está en `intelligence/js/demo.js`. Para grabar es más limpio navegar a mano por las pestañas.
- **NO uses estos enlaces en la VSL:**
  - `?sector=qualivo&modo=real`, porque carga el CRM real de Qualivo con contactos de verdad.
  - `?sector=sueno` y cualquier enlace con `empresa=Nuria…`. Son una demo privada para una cliente.

## 2. Las cinco cosas del bloque 4: qué existe hoy y dónde

Las cinco existen hoy en la demo, con datos simulados:

| Del guion | Dónde se ve |
|---|---|
| Visión general | Pestaña **Resumen**: contactos que requieren atención, € en juego, cuántos mueve el sistema solo y cuántos necesitan a una persona, y embudo de 30 días |
| Recorrido comercial | Pestaña **Recorrido**: etapas con conversión, la fuga principal y su remedio |
| Oportunidades que necesitan atención | Pestañas **Oportunidades** (lista y tablero) y **Señales** |
| Siguiente acción recomendada | Abre una ficha desde Oportunidades: bloques **«Por qué»** y **«Siguiente mejor acción»** |
| Relación captación ↔ resultados | Pestaña **Anuncios**: cada origen cruzado con lo que pasa después, y nota «Qué cambiaría en el origen de los contactos» |

Matices para no enseñar algo que no es:

- **Los datos de clientes no se conectan solos.** Con datos reales, Intelligence funciona sobre el CRM de Qualivo (modo real). Conectarlo al CRM de un cliente se monta en cada proyecto; no es un producto que se active con un clic. Formúlalo como «con tus datos lo montamos», no como «conéctalo y listo».
- **Extra disponible: llamada real de Raquel desde la ficha.** Se hace con «Llamada de Raquel» → «Que me llame a mí»: Raquel llama de verdad al móvil con el contexto de esa ficha. Maikel la probó hoy y funciona. Límite: 5 llamadas por móvil y día, de 9:00 a 21:00. Las demás acciones de la ficha, como el WhatsApp o el agente, en la demo son simuladas y no se envía nada.
- **Pestaña Informes:** tiene textos genéricos del motor, como «Pilotos» o «CAC». Mejor no detenerse ahí.

## 3. Grabación de pantalla

- **No sé si Maikel tiene una.** Yo no tengo ninguna. Pregúntaselo a él.
- **Puedes grabarla tú** con el navegador sobre la URL del punto 1. No hace falta acceso. Recomiendo 1920×1080 y este recorrido:
  1. Resumen
  2. Recorrido
  3. Oportunidades
  4. Abrir una ficha caliente: «Por qué» y «Siguiente mejor acción»
  5. Anuncios
- **No grabes los recuadros de la llamada real.** Si los rellenas con un móvil, saldría un número de teléfono en pantalla.

## 4. Identidad visual

- **Colores**, sacados de `gracias/index.html` y `intelligence/app.css`:

  | Nombre | Hex |
  |---|---|
  | tinta | `#101319` |
  | negro | `#08090C` |
  | crema | `#FAF7F0` |
  | teal / verde | `#0E7C74` |
  | teal claro | `#27BDB1` |
  | amarillo | `#F4CC38` |
  | gris | `#5A5E66` |
  | coral (alertas en Intelligence) | `#D9480F` |

- **Tipografía:** Montserrat. Está en `assets/fonts/*.woff2` como fuente variable. Para los subtítulos de mi ejemplo usé el peso 800 (ExtraBold).
- **Logos:** `assets/img/qualivo-logo.png` (para fondo claro), `assets/img/qualivo-logo-blanco.png` (para fondo oscuro) y `assets/img/favicon.svg`. Foto de Maikel: `assets/img/maikel-echevarria.jpg`.
- **Ejemplo de estilo de subtítulos** que Maikel ha visto hoy:
  - Palabra a palabra, en mayúsculas, blanco con contorno tinta.
  - La palabra que se pronuncia, en amarillo `#F4CC38`.
  - En vertical, un título fijo arriba sobre caja amarilla con texto tinta.

## 5. Comprobaciones de la oferta

- **«Sprint de 30 días, desde 1.200 € + IVA»:** vigente. Lo recoge la arquitectura de oferta del 7-oct con la actualización del 8-oct. El mínimo de continuidad es 1.000 €/mes; los 800 € quedaron obsoletos y no se dicen.
- **Las cuatro semanas:** semana 1 entender (mapa, datos y fuga), semana 2 intervenir (primera mejora funcionando), semana 3 medir, semana 4 decidir. Tu «diagnóstico, primera mejora, medición, evaluación» cuadra.
- **Garantía, si se menciona:** es por hitos. Si al acabar el Sprint no se ha entregado el diagnóstico, la medición y la mejora funcionando por causas de Qualivo, el cliente elige 15 días más sin coste o la devolución de los hitos no entregados. **No se garantizan ventas, asistencia ni ROAS.**
- **CTA:** `https://qualivo.io/llamada/` («Reserva una llamada con Maikel»). Usa el mismo calendario del CRM que la página de gracias. La frase «te llevas un plan escrito, lo hagas con nosotros o no» es la que se usa ya en la web.

## 6. Audio del Hollyland

No lo tengo y no sé dónde está. Lo único que he recibido es un clip de prueba de 20 s por WhatsApp, con audio de la cámara. Pregúntaselo a Maikel. Si solo existe el .MOV, comprueba si el receptor iba conectado al iPhone, porque entonces el audio del Hollyland ya va dentro del .MOV.

## 7. Lo que no se dice ni se enseña

- **Palabras a evitar:** «agentes IA», «automatización 360», «CRM inteligente», «hiperautomatización», «Growth 360», «transformación digital». La IA es el medio, no el producto. Intelligence no se presenta como un software aparte; es la capa que mide y dice dónde intervenir.
- **Promesas prohibidas:** ventas, asistencia o ROAS garantizados.
- **Precios:** nada de 800 €.
- **Datos de clientes:**
  - Solo se puede usar lo que ya está publicado en qualivo.io/casos.
  - Del caso Nuria Roure se puede decir «2.000 € → 12.900 € en ventas atribuibles al sistema», sin añadir un periodo, porque el caso publicado no lo indica.
  - Nada de cifras internas de sus lanzamientos: CPL, leads, ROAS o creativos.
  - Ningún nombre, teléfono ni conversación real.
- **Funciones a medias:** la conexión automática a cualquier CRM de cliente y los textos genéricos de Informes.
- **La demo:** siempre visible como datos simulados. No se presenta como el panel de un cliente real.

Dudas: en el bus (`bus/out/demand.jsonl`, rama `claude/qualivo-landing-vercel-nubk1i`), o que Maikel me las pase.

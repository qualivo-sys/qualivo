# VSL Qualivo · plantilla de montaje (5 min, 16:9)

Estado (9-oct): Maikel vuelve a grabar el **mismo guion** el lunes con mejor audio (Hollyland con grabación interna).
Hasta entonces se monta la plantilla sobre la grabación del 9-oct, como borrador.
- Guion: Google Doc «BLOQUE 1 — GANCHO», en la carpeta de Drive 1TaSLcFgE3t9-9D326lUAFlyE3rlgFoDw.
- Brutos: no van al repo (es público); se trabajan en el scratchpad.

## Principio: los gráficos van atados a frases, no a segundos
Cada escena se dispara cuando aparece una frase en la transcripción (p. ej. «más presupuesto»). Con la grabación
nueva basta con:
1. transcribirla con tiempos por palabra (faster-whisper medium);
2. cortar silencios largos y quedarse con la última toma de cada frase repetida;
3. volver a montar. Las escenas caen solas en su sitio.

Si Maikel cambia una frase del guion, hay que actualizar el disparador de esa escena.

## Lo aprobado y lo descartado (9-oct)
- **Aprobado:**
  - gráficos de marca: Montserrat, navy, turquesa y coral;
  - entradas de 0,3 a 0,6 s;
  - tarjeta flotante sobre la pared;
  - pantallas completas cuando hacen falta;
  - planos de Kling desenfocados si llevan pantallas;
  - feed de anuncios propio.
- **Descartado:**
  - pantalla partida, porque corta a Maikel por la mitad;
  - el plano de IA del móvil, porque dibujaba letras inventadas;
  - el aislador de voz de ElevenLabs, porque suena raro;
  - la voz regrabada encima del vídeo, porque no casa con la boca.
- **Zoom:** nunca con `zoompan`, que desfasa la imagen del resto. Se hace con recorte, escala por fotograma y recorte.

## Encuadres (sobre el 4K girado, 3840x2160; ajustar si cambia la posición de cámara)
- abierto: (3200, 1800, 640, 0)
- cerrado: (2240, 1260, 1160, 90)
- de lado, con hueco para la tarjeta: (2400, 1350, 1440, 0)
- gancho: zoom suave de 1 a 1,25

## Escenas por bloque (disparador → qué se ve)
**B1 · Gancho**
- «miles de euros» → «Miles de € en publicidad», con zoom suave.
- «y siguen sin saber» → plano del portátil con el panel de anuncios (Kling, desenfocado).
- «saben cuánto» → tarjeta flotante con coste por lead, formularios e inversión. Datos de ejemplo.
- «pero no saben» → a pantalla completa, «¿Cuántos se convierten en clientes?».
- «y ahí / aquí está el problema» → plano cerrado, sin nada encima.
- «un anuncio que habla» → feed de anuncios propio. Luego «y conseguir» → flujo de contactos, con «Contactos ≠ oportunidades».

**B2 · Problema**
- «soy maikel» → rótulo con nombre y cargo.
- «lanzar anuncios» → anuncio genérico frente a anuncio para el cliente ideal (anuncios ilustrativos).
- «cinco euros» → tarjeta con las campañas de 5 € y 20 € por lead, «Clientes: ?». Ejemplo ilustrativo.
- «y si solamente» → a pantalla completa, «¿Cuál genera mejores clientes?».
- «crean anuncios genéricos» → tres errores, con ✕: anuncio genérico, la misma página para todos, formulario que no filtra.
- «después se preguntan» → plano del comercial cansado (Kling, recursos/broll-comercial.mp4).
- «más presupuesto» → tarjeta con + Presupuesto, + Anuncios y + Contactos.
- «pero invertir más» → «Más dinero no arregla el problema».

**B3 · Cómo trabajamos**
- «por eso en qualivo» → «En Qualivo trabajamos de otra manera».
- «no somos simplemente» → tachado «Agencia que gestiona anuncios», y después la cadena Estrategia → Anuncios → Landing →
  Cualificación → Seguimiento → Venta.
- «todo empieza» → tarjeta con cliente ideal, problema, qué le preocupa y mensaje.
- «diseñamos la estrategia» → plano del panel (Kling, desenfocado).
- «creamos anuncios» → tres variantes de anuncio, con ángulos distintos (ilustrativas).
- «páginas de destino» → maqueta de landing con formulario.
- «conectamos esa captación» → cadena solicitud → atención → cualificación → seguimiento.
- «whatsapp» → tarjeta con WhatsApp, automatizaciones y asistente de voz, «cuando aportan valor».
- «la tecnología no es» → «La tecnología no es el objetivo», y después «Mejores oportunidades».

**B4 · Intelligence** (pantallas reales de la demo, Clínica Dental Sur, «Datos simulados»)
- «qualivo intelligence» → rótulo.
- «aquí podemos analizar» → Resumen, con zoom a «Requieren atención» y a «Dónde se pierde más».
- «imagina que una campaña» → barras de 100 solicitudes frente a 20 conversaciones (ejemplo).
- «antes de aumentar» → tres preguntas: ¿público equivocado?, ¿curiosidad sin intención?, ¿se pierden después del formulario?
- «decidir dónde intervenir» → Oportunidades, con zoom a «Siguiente acción».
- «relacionar la captación» → Anuncios: «¿Qué anuncio trae clientes de verdad?» y la columna de tratamientos aceptados.

**B5 · Sprint**
- «cómo empezamos» → plano cerrado.
- «sprint inicial» → tarjeta «Sprint de 30 días · Desde 1.200 € + IVA». En la grabación del 9-oct no dice «+ IVA», pero en pantalla sí va.
- «primero analizamos» → cronología de cuatro semanas: diagnóstico, primera mejora, medición, siguientes pasos.
- «no te vamos a prometer» → tachado «Duplicar tus ventas en 30 días».
- «lo que sí podemos» → ✓ diagnóstico, ✓ una mejora implementada, ✓ datos para decidir.

**B6 · Cierre**
- Plano cerrado y pocos efectos.
- «reserva una sesión» → tarjeta CTA «Reserva una sesión de 30 minutos» y «Plan escrito con los siguientes pasos».
- «nos vemos dentro» → tarjeta final: logo, «Descubre dónde puedes mejorar tu captación» y el botón «Reserva una sesión de diagnóstico».

## Recursos (recursos/)
- `broll-panel.mp4`: Kling, portátil con un panel de anuncios. Lleva letras inventadas, así que se usa siempre desenfocado (gblur 7).
- `broll-comercial.mp4`: Kling, comercial cansado tachando una lista. La lista también lleva letras inventadas: desenfoque suave.
- `intel-*.png`: capturas de la demo de Intelligence a 3840x2160 (`?sector=clinica&empresa=Clínica Dental Sur&objetivo=captacion&vista=...`).

## Pendiente de Growth (pregunta del 9-oct, sin respuesta todavía)
- Si se pueden enseñar estas pantallas en una VSL pública.
- Si el precio del Sprint está vigente.
- La URL del CTA.

// ============================================================================
// QUALIVO BLUEPRINT — Estructura del curso para Whop
// Fuente: Documento 3 (Estructura del curso). Editable: cambia títulos y notas
// aquí y vuelve a ejecutar el script (es idempotente).
// ----------------------------------------------------------------------------
// Cada lección se crea como tipo "video". El campo `notes` se sube como
// `content` (markdown) y funciona como guion/teleprónter debajo del vídeo.
// Cuando grabes, solo tienes que añadir el embed (Loom o YouTube) a cada lección
// —desde el panel de Whop o con el script de update—.
// ============================================================================

export const course = {
  title: 'Hack the Lead',
  tagline: 'Instala tu Sistema Operativo de Crecimiento en 14 días',
  requireCompletingLessonsInOrder: false, // ponlo en true si quieres desbloqueo secuencial
  visibility: 'hidden', // créalo oculto; hazlo visible cuando esté listo
};

// Helper para escribir notas de forma compacta
const note = (objetivo, puntos, turno) =>
  `**Objetivo:** ${objetivo}\n\n` +
  puntos.map((p) => `- ${p}`).join('\n') +
  `\n\n**Tu turno:** ${turno}`;

export const modules = [
  {
    key: 'm0',
    title: 'Módulo 0 · Diseñar el sistema',
    lessons: [
      { key: 'm0l1', title: 'Por qué las herramientas sueltas no escalan', notes: note(
        'Cambiar el chip de "hacer marketing" a "instalar un sistema".',
        ['El problema real no es falta de herramientas, es falta de sistema.', 'Qué significa que el crecimiento no dependa del dueño.', 'La promesa del programa: un sistema montado en 14 días.'],
        'Escribe en una frase de qué depende hoy tu crecimiento.') },
      { key: 'm0l2', title: 'Anatomía de un Growth OS: las 6 piezas', notes: note(
        'Entender las 6 piezas del sistema y cómo se conectan.',
        ['Oferta, captación, conversión, CRM/seguimiento, automatización e IA, métricas.', 'Cómo el output de una pieza es el input de la siguiente.', 'Por qué conectarlas multiplica el resultado.'],
        'Marca qué piezas ya tienes y cuáles faltan.') },
      { key: 'm0l3', title: 'El rol de la IA en el sistema', notes: note(
        'Usar la IA como capa transversal, no como truco aislado.',
        ['Dónde aporta IA en cada subsistema.', 'Qué NO conviene automatizar todavía.', 'El principio: la IA acelera un sistema, no lo sustituye.'],
        'Anota los 3 puntos donde la IA te ahorraría más tiempo.') },
      { key: 'm0l4', title: 'Diagnóstico de tu punto de partida', notes: note(
        'Ver con claridad qué tienes, qué falta y dónde pierdes leads.',
        ['Auditoría rápida de tu embudo actual.', 'Detectar las fugas: dónde se enfrían las oportunidades.', 'Priorizar por impacto.'],
        'Completa el diagnóstico y señala tu mayor fuga.') },
      { key: 'm0l5', title: 'Traza el mapa de tu sistema', notes: note(
        'Dibujar el "antes" y fijar el objetivo a 14 días.',
        ['Plantilla de mapa del Growth OS.', 'Define tu foto de partida.', 'Fija el hito de las primeras 48 h.'],
        'Entregable del módulo: tu mapa del Growth OS con las fugas señaladas.') },
    ],
  },
  {
    key: 'm1',
    title: 'Módulo 1 · Crea una oferta irresistible',
    lessons: [
      { key: 'm1l1', title: 'Investigación de mercado con IA', notes: note(
        'Entender a tu cliente en horas, no en semanas.',
        ['Prompts de investigación de audiencia.', 'Extraer dolores, deseos y objeciones reales.', 'Sintetizar en un perfil accionable.'],
        'Genera tu perfil de cliente con los prompts incluidos.') },
      { key: 'm1l2', title: 'Posicionamiento: categoría propia', notes: note(
        'Ocupar una categoría propia en lugar de competir por precio.',
        ['Qué es una categoría y por qué te saca de la guerra de precios.', 'Cómo definir tu ángulo diferencial.', 'Ejemplo: "Sistema Operativo de Crecimiento".'],
        'Escribe tu frase de posicionamiento en una línea.') },
      { key: 'm1l3', title: 'Construcción de la oferta irresistible', notes: note(
        'Diseñar una oferta que el mercado quiera comprar.',
        ['Los 4 elementos: promesa, mecanismo, prueba y garantía.', 'Cómo hacer la promesa concreta y creíble.', 'Añadir garantía para reducir fricción.'],
        'Redacta tu oferta con la plantilla de los 4 elementos.') },
      { key: 'm1l4', title: 'Mensajes que venden', notes: note(
        'Pasar del dolor a la transformación en el lenguaje del cliente.',
        ['Del "antes" al "después" con sus palabras.', 'Titulares y ganchos.', 'Errores de mensaje que matan la conversión.'],
        'Escribe tu mensaje principal y 3 variantes.') },
      { key: 'm1l5', title: 'Test rápido de oferta', notes: note(
        'Validar la oferta antes de invertir en tráfico.',
        ['Formas baratas de testear demanda.', 'Señales de que la oferta funciona.', 'Cuándo iterar y cuándo seguir.'],
        'Entregable del módulo: oferta, posicionamiento y mensaje listos para la landing.') },
    ],
  },
  {
    key: 'm2',
    title: 'Módulo 2 · Construye el embudo',
    lessons: [
      { key: 'm2l1', title: 'Arquitectura del embudo mínimo viable', notes: note(
        'Diseñar el embudo más simple que ya convierte.',
        ['Las piezas mínimas: lead magnet, landing, CTA.', 'Cómo fluye un lead por el embudo.', 'Evitar la sobre-ingeniería.'],
        'Dibuja tu embudo mínimo viable.') },
      { key: 'm2l2', title: 'Lead magnet que atrae al cliente correcto', notes: note(
        'Crear un imán que atraiga al lead adecuado.',
        ['Qué regalar (y qué no).', 'Formatos que convierten.', 'Plantillas de lead magnet incluidas.'],
        'Crea tu lead magnet con la plantilla.') },
      { key: 'm2l3', title: 'Landing que convierte', notes: note(
        'Publicar una landing con estructura y copy de alta conversión.',
        ['Estructura sección a sección.', 'Copy y CTA (plantilla Qualivo lista para editar).', 'Buenas prácticas de conversión.'],
        'Edita la plantilla de landing con tu oferta.') },
      { key: 'm2l4', title: 'Publicación en tiempo récord', notes: note(
        'Publicar el embudo sobre el stack Qualivo.',
        ['Montaje paso a paso.', 'Checklist de publicación.', 'Prueba en móvil.'],
        'Publica tu landing y compártela contigo mismo.') },
      { key: 'm2l5', title: 'Conecta el formulario al sistema', notes: note(
        'Que cada lead entre solo en el CRM.',
        ['Conectar el formulario al CRM.', 'Comprobar que el lead llega.', 'Primer test de extremo a extremo.'],
        'Entregable del módulo: landing y lead magnet publicados capturando tu primer lead.') },
    ],
  },
  {
    key: 'm3',
    title: 'Módulo 3 · Captación',
    lessons: [
      { key: 'm3l1', title: 'Elegir el canal correcto', notes: note(
        'Seleccionar el canal adecuado para tu negocio.',
        ['Meta, Google o LinkedIn: cuándo cada uno.', 'Criterios de elección según tu cliente.', 'Empezar por un solo canal.'],
        'Elige tu canal principal y justifica por qué.') },
      { key: 'm3l2', title: 'Tu primera campaña paso a paso', notes: note(
        'Lanzar una campaña sin quemar presupuesto.',
        ['Segmentación, creatividad y presupuesto de prueba.', 'Estructura de campaña recomendada.', 'Errores de principiante a evitar.'],
        'Deja tu primera campaña lista para publicar.') },
      { key: 'm3l3', title: 'Contenido que capta', notes: note(
        'Alimentar el sistema sin depender solo de pagar anuncios.',
        ['Formatos de contenido que atraen leads.', 'Ritmo sostenible de publicación.', 'Reutilizar contenido con IA.'],
        'Planifica tu contenido de captación de la semana.') },
      { key: 'm3l4', title: 'Leer las primeras señales', notes: note(
        'Interpretar los primeros datos sin apagar campañas antes de tiempo.',
        ['Qué métricas mirar los primeros días.', 'Cuándo dar tiempo y cuándo cortar.', 'Señales de una campaña sana.'],
        'Define tus umbrales de decisión.') },
      { key: 'm3l5', title: 'Calcula tu CAC inicial', notes: note(
        'Conocer cuánto te cuesta captar un cliente.',
        ['Cómo calcular el CAC.', 'Definir el umbral de rentabilidad.', 'Relación con el precio del low ticket.'],
        'Entregable del módulo: una campaña activa llevando leads al CRM.') },
    ],
  },
  {
    key: 'm4',
    title: 'Módulo 4 · Creativos con IA y automatización con Claude Code',
    lessons: [
      { key: 'm4l1', title: 'Anatomía de un creativo que convierte', notes: note(
        'Entender qué hace que un anuncio funcione.',
        ['Hook, ángulo, oferta y CTA.', 'Los primeros 3 segundos lo son todo.', 'Ejemplos de creativos ganadores.'],
        'Descompón 3 anuncios que te gusten en sus 4 partes.') },
      { key: 'm4l2', title: 'Generación de imágenes con IA', notes: note(
        'Producir variaciones de anuncio a escala en minutos.',
        ['Herramientas de imagen con IA.', 'Prompts para creativos publicitarios.', 'Variaciones rápidas para testear.'],
        'Genera 5 variaciones de imagen para tu oferta.') },
      { key: 'm4l3', title: 'Vídeo y UGC con IA', notes: note(
        'Crear anuncios en formato reel/short sin equipo de rodaje.',
        ['UGC y vídeo con IA.', 'Guiones cortos de alto rendimiento.', 'Formato vertical para redes.'],
        'Crea tu primer anuncio en vídeo con IA.') },
      { key: 'm4l4', title: 'Copy de anuncios con IA', notes: note(
        'Escribir múltiples ángulos y afinar por audiencia.',
        ['Prompts para copy publicitario.', 'Ángulos: dolor, deseo, prueba, urgencia.', 'Afinar el tono por audiencia.'],
        'Genera 10 variantes de copy para tu anuncio.') },
      { key: 'm4l5', title: 'Automatización con Claude Code', notes: note(
        'Montar un pipeline que genera y organiza creativos casi solo.',
        ['Qué es Claude Code y cómo usarlo aquí.', 'Un pipeline que genera lotes de creativos, los renombra y los organiza.', 'Dejar los creativos listos para subir.'],
        'Ejecuta el pipeline y genera tu primer lote.') },
      { key: 'm4l6', title: 'Testing de creativos', notes: note(
        'Iterar rápido y matar a los perdedores.',
        ['Cómo estructurar un test de creativos.', 'Qué señales leer.', 'Cadencia de iteración.'],
        'Define tu plan de testing semanal.') },
      { key: 'm4l7', title: 'Reporte automático', notes: note(
        'Que Claude Code recoja resultados y proponga el siguiente lote.',
        ['Automatizar el reporte de rendimiento.', 'De los datos al siguiente lote a producir.', 'Cerrar el bucle de mejora.'],
        'Entregable del módulo: lote de creativos + pipeline de Claude Code funcionando.') },
    ],
  },
  {
    key: 'm5',
    title: 'Módulo 5 · CRM',
    lessons: [
      { key: 'm5l1', title: 'Monta tu CRM sobre el stack Qualivo', notes: note(
        'Poner en marcha el CRM preconfigurado.',
        ['Importar el CRM preconfigurado.', 'Ajustes iniciales.', 'Primer contacto de prueba.'],
        'Deja tu CRM importado y accesible.') },
      { key: 'm5l2', title: 'Diseña tu pipeline y sus estados', notes: note(
        'Definir el recorrido del lead nuevo al cliente.',
        ['Etapas del pipeline.', 'Qué significa cada estado.', 'Evitar pipelines demasiado complejos.'],
        'Configura tus estados en el CRM.') },
      { key: 'm5l3', title: 'Lead scoring', notes: note(
        'Priorizar a quién contactar primero.',
        ['Criterios de puntuación.', 'Cómo automatizar el scoring.', 'Actuar según la puntuación.'],
        'Define tu sistema de lead scoring.') },
      { key: 'm5l4', title: 'Sistema de seguimientos', notes: note(
        'Que el seguimiento deje de depender de tu memoria.',
        ['Cadencia de seguimiento.', 'Disparadores automáticos.', 'Plantillas de mensaje.'],
        'Configura tu primera cadencia de seguimiento.') },
      { key: 'm5l5', title: 'Higiene del CRM', notes: note(
        'Mantener los datos limpios sin esfuerzo.',
        ['Reglas de higiene de datos.', 'Automatizaciones de limpieza.', 'Rutina de revisión.'],
        'Entregable del módulo: CRM con pipeline, estados y lead scoring funcionando.') },
    ],
  },
  {
    key: 'm6',
    title: 'Módulo 6 · Automatizaciones con IA',
    lessons: [
      { key: 'm6l1', title: 'Mapa de automatizaciones', notes: note(
        'Decidir qué automatizar primero para máximo impacto.',
        ['Inventario de tareas repetitivas.', 'Priorizar por impacto y esfuerzo.', 'Roadmap de automatización.'],
        'Lista tus 5 automatizaciones prioritarias.') },
      { key: 'm6l2', title: 'Secuencias de email automáticas', notes: note(
        'Poner el email a trabajar solo.',
        ['Plantillas listas para importar.', 'Disparadores y condiciones.', 'Buenas prácticas de entregabilidad.'],
        'Importa y activa tu primera secuencia.') },
      { key: 'm6l3', title: 'Seguimiento por WhatsApp', notes: note(
        'Automatizar recordatorios y reactivación por WhatsApp.',
        ['Casos de uso que convierten.', 'Configuración del canal.', 'Evitar el spam.'],
        'Configura tu primer flujo de WhatsApp.') },
      { key: 'm6l4', title: 'Tareas y recordatorios automáticos', notes: note(
        'Que el equipo nunca olvide un seguimiento.',
        ['Tareas automáticas por estado.', 'Recordatorios inteligentes.', 'Asignación automática.'],
        'Configura una automatización de tareas.') },
      { key: 'm6l5', title: 'IA aplicada al seguimiento', notes: note(
        'Usar IA para cualificar, resumir y responder.',
        ['Cualificación automática con IA.', 'Resúmenes de conversaciones.', 'Borradores de respuesta.'],
        'Entregable del módulo: emails, WhatsApp, recordatorios y tareas automáticos.') },
    ],
  },
  {
    key: 'm7',
    title: 'Módulo 7 · Métricas',
    lessons: [
      { key: 'm7l1', title: 'Los KPIs que de verdad importan', notes: note(
        'Distinguir las métricas clave del ruido.',
        ['KPIs accionables vs métricas vanidad.', 'Qué mirar en cada subsistema.', 'Cómo evitar el exceso de datos.'],
        'Elige tus 5 KPIs principales.') },
      { key: 'm7l2', title: 'CAC y LTV', notes: note(
        'Entender la relación que decide si puedes escalar.',
        ['Cómo calcular CAC y LTV.', 'La ratio LTV:CAC.', 'Qué hacer si no cuadra.'],
        'Calcula tu CAC y tu LTV actuales.') },
      { key: 'm7l3', title: 'Tasas de conversión por etapa', notes: note(
        'Medir la conversión en cada paso del embudo.',
        ['Dónde medir la conversión.', 'Detectar el cuello de botella.', 'Benchmark orientativo.'],
        'Mide la conversión de cada etapa.') },
      { key: 'm7l4', title: 'Monta tu dashboard', notes: note(
        'Tener el sistema a la vista en un cuadro de mando.',
        ['Plantilla de dashboard incluida.', 'Conectar tus fuentes de datos.', 'Lectura de un vistazo.'],
        'Conecta tu dashboard y haz la primera lectura.') },
      { key: 'm7l5', title: 'Rutina semanal de revisión', notes: note(
        'Pilotar el sistema en 20 minutos a la semana.',
        ['Qué revisar cada semana.', 'Decisiones basadas en datos.', 'Plantilla de revisión.'],
        'Entregable del módulo: dashboard conectado y tu primera lectura de KPIs.') },
    ],
  },
  {
    key: 'm8',
    title: 'Módulo 8 · Escalar',
    lessons: [
      { key: 'm8l1', title: 'Optimización: dónde tocar primero', notes: note(
        'Mover la aguja con los cambios de mayor impacto.',
        ['Identificar el cuello de botella del sistema.', 'Priorizar optimizaciones.', 'Mejora continua.'],
        'Elige tu primera optimización.') },
      { key: 'm8l2', title: 'Testing sistemático', notes: note(
        'Probar de forma ordenada y leer resultados.',
        ['Qué testear y cómo.', 'Un test cada vez.', 'Documentar aprendizajes.'],
        'Diseña tu primer test estructurado.') },
      { key: 'm8l3', title: 'Abrir nuevos canales', notes: note(
        'Crecer sin romper lo que ya funciona.',
        ['Cuándo abrir un canal nuevo.', 'Cómo validar antes de escalar.', 'Riesgos a evitar.'],
        'Selecciona tu próximo canal a explorar.') },
      { key: 'm8l4', title: 'Sistemas y SOPs para delegar', notes: note(
        'Dejar de ser el cuello de botella.',
        ['Documentar procesos con SOPs.', 'Qué delegar primero.', 'Plantillas de SOP incluidas.'],
        'Escribe tu primer SOP.') },
      { key: 'm8l5', title: 'Tu plan de crecimiento a 90 días', notes: note(
        'Convertir el sistema en crecimiento predecible.',
        ['Objetivos a 90 días.', 'Prioridades e hitos.', 'Cómo medir el avance.'],
        'Entregable final: tu plan de crecimiento a 90 días.') },
    ],
  },
];

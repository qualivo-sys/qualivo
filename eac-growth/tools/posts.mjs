// EAC · Lote 1 de contenido nuevo (15 posts) — Qualivo
// Cada post está anclado a keywords reales (DinoRank + Search Console) y a un pilar del content-plan.
// NO canibalizan con los ~50 posts existentes: son huecos detectados en la auditoría.

const C = {           // páginas de destino (CTA)
  tcp:  '/curso-auxiliar-vuelo/',
  at:   '/azafata-de-tierra-y-operaciones/',
  fd:   '/curso-despachador-vuelo/',
  info: '/contacto/',
};

export const POSTS = [

/* ───────────────────────────── P1 · TCP ───────────────────────────── */
{
  slug: 'como-superar-entrevista-tcp-aerolinea',
  cat: 'Proceso de selección',
  kicker: 'Selección · TCP',
  title: 'Cómo superar la entrevista de TCP: el proceso de selección de una aerolínea, fase por fase',
  seoTitle: 'Entrevista TCP: cómo superar la selección de una aerolínea',
  metaDesc: 'Cómo es el proceso de selección de TCP paso a paso: CV, entrevista en inglés, dinámica de grupo y prueba final. Preguntas reales y errores que descartan.',
  focusKw: 'entrevista tcp',
  kws: ['proceso de selección tcp', 'entrevista azafata de vuelo', 'assessment tcp', 'dinámica de grupo aerolínea'],
  kicker2: null,
  lead: '<strong>La mayoría de candidatos a TCP no se quedan fuera por no cumplir los requisitos: se quedan fuera en la dinámica de grupo y en la entrevista en inglés.</strong> Este es el proceso de selección real de una aerolínea, fase por fase, con lo que evalúan en cada una y los errores que descartan de forma automática.',
  key: [
    'Un proceso típico tiene <strong>4 fases</strong>: criba de CV, entrevista/vídeo en inglés, dinámica de grupo y entrevista final.',
    'Lo que más pesa no es tu currículum: es <strong>actitud de servicio, trabajo en equipo y comunicación en inglés</strong>.',
    'El motivo nº1 de descarte en grupo es <strong>querer destacar pisando a los demás</strong>.',
    'Con el certificado oficial de TCP ya obtenido, entras a los procesos <strong>en mejor posición y sin depender del curso interno</strong> de la compañía.',
  ],
  stats: [
    { b: '4 fases', s: 'Es el formato más habitual de un assessment day' },
    { b: 'Inglés', s: 'Se evalúa hablado, no solo en el CV' },
    { b: 'Grupo', s: 'Donde se cae la mayoría de candidatos' },
  ],
  sections: [
    { id: 'cv', h2: 'Fase 1: la criba de CV (y por qué se descarta el 80%)', blocks: [
      ['p', 'Las aerolíneas reciben miles de candidaturas por convocatoria y la primera criba suele ser semiautomática. No buscan un CV bonito: buscan <strong>que se vea en 10 segundos que cumples</strong>.'],
      ['ul', [
        '<strong>Foto profesional</strong> tipo corporativa, con imagen cuidada y fondo neutro. No es una foto de perfil de redes.',
        '<strong>Certificado TCP</strong> visible arriba, no escondido al final. Si ya lo tienes, es tu principal diferencial.',
        '<strong>Idiomas con nivel concreto</strong> (B2, C1) y no "nivel medio".',
        '<strong>Experiencia de cara al público</strong> destacada: hostelería, retail, atención al cliente, turismo. Suma muchísimo.',
        '<strong>Disponibilidad</strong> explícita: turnos, cambios de base, viajar.',
      ]],
      ['warn', 'Error frecuente', 'Enviar el mismo CV a todas las aerolíneas. Cada compañía tiene un perfil y una cultura distinta: adapta el titular y el resumen a la aerolínea a la que te presentas.'],
    ]},
    { id: 'ingles', h2: 'Fase 2: la entrevista o vídeo en inglés', blocks: [
      ['p', 'Muchas compañías han sustituido la primera entrevista por un <strong>vídeo grabado</strong> (te dan una pregunta y tienes 60-90 segundos para responder). Se evalúa fluidez, pronunciación, sonrisa y naturalidad — no gramática perfecta.'],
      ['h3', 'Preguntas que se repiten'],
      ['ul', [
        '<em>Tell me about yourself.</em>',
        '<em>Why do you want to work for this airline?</em>',
        '<em>Tell me about a time you dealt with a difficult customer.</em>',
        '<em>How would you handle a passenger who refuses to follow safety instructions?</em>',
      ]],
      ['note', 'Truco que funciona', 'Prepara 3 historias reales de tu vida laboral (un cliente difícil, un error tuyo, un trabajo en equipo) y adáptalas a cualquier pregunta con el método <strong>situación → acción → resultado</strong>. Evitas quedarte en blanco.'],
    ]},
    { id: 'grupo', h2: 'Fase 3: la dinámica de grupo (aquí se decide todo)', blocks: [
      ['p', 'Es la fase más temida y la que más descarta. Te ponen con 8-12 candidatos a resolver un caso, ordenar prioridades o presentar a un compañero. <strong>No evalúan la solución: evalúan cómo te comportas mientras la buscáis.</strong>'],
      ['table',
        ['Lo que buscan', 'Lo que descarta'],
        [
          ['Escuchar y construir sobre lo que dicen otros', 'Interrumpir o monopolizar la palabra'],
          ['Incluir al que no habla', 'Ignorar o corregir en público a un compañero'],
          ['Sonreír y mantener energía todo el rato', 'Desconectar cuando no te toca hablar'],
          ['Reconducir al grupo hacia el objetivo', 'Imponer tu criterio "porque sí"'],
          ['Lenguaje corporal abierto', 'Brazos cruzados, mirar el móvil, cuchichear'],
        ]
      ],
      ['q', 'Te están observando desde que entras por la puerta, incluso en la sala de espera. Muchos evaluadores toman notas de cómo tratas a los demás candidatos antes de empezar.'],
    ]},
    { id: 'final', h2: 'Fase 4: entrevista final y prueba de alcance', blocks: [
      ['steps', [
        { t: 'Entrevista personal', d: 'Uno a uno o en panel. Profundizan en motivación, disponibilidad real y encaje con la cultura de la compañía.' },
        { t: 'Comprobación de requisitos', d: 'Documentación, certificado TCP, certificado médico aeronáutico, natación e idiomas.' },
        { t: 'Prueba de alcance', d: 'Comprobar que llegas a los compartimentos superiores de cabina. Se mide el alcance funcional, no la altura en sí.' },
        { t: 'Oferta y curso de habilitación', d: 'Si te seleccionan, pasas al curso de tipo de avión de esa aerolínea antes de empezar a volar.' },
      ]],
    ]},
    { id: 'prepararse', h2: 'Cómo prepararte para tener ventaja real', blocks: [
      ['p', 'Los candidatos que llegan con el <strong>certificado oficial de TCP ya obtenido</strong> y con el proceso de selección entrenado juegan otra liga: no dependen de que la aerolínea les pague el curso y llegan a la dinámica de grupo con la mecánica trabajada.'],
      ['pros',
        { t: 'Con formación previa', items: ['Certificado oficial ya en el CV', 'Has entrenado dinámicas y entrevista en inglés', 'Conoces la operativa y hablas su idioma técnico', 'Puedes presentarte a varias aerolíneas a la vez'] },
        { t: 'Sin formación previa', items: ['Dependes de conseguir plaza en el curso interno', 'Llegas al assessment sin haberlo practicado nunca', 'Compites contra gente ya certificada', 'Cada convocatoria fallida son meses perdidos'] }
      ],
    ]},
  ],
  cta: { h: '¿Quieres llegar a la selección con ventaja?', p: 'Fórmate como TCP con el certificado oficial y entrena el proceso de selección de las aerolíneas.', href: C.tcp, btn: 'Ver el curso de TCP', btn2: 'Hablar con el equipo', href2: C.info },
  recap: 'El proceso de selección de TCP tiene cuatro fases: criba de CV, entrevista o vídeo en inglés, dinámica de grupo y entrevista final con prueba de alcance. La dinámica de grupo es donde se cae la mayoría, y lo que se evalúa es la actitud de equipo, no la solución. Llegar con el certificado oficial ya obtenido y el proceso entrenado marca la diferencia.',
  faq: [
    { q: '¿Cuánto dura el proceso de selección de una aerolínea?', a: 'Depende de la compañía: desde un assessment day de una jornada hasta un proceso de varias semanas con fases online previas. Lo habitual es entre 2 y 6 semanas desde que envías el CV hasta la oferta.' },
    { q: '¿Puedo presentarme sin el certificado TCP?', a: 'Algunas aerolíneas seleccionan sin certificado y forman después, pero las plazas son muy limitadas y muy competidas. Con el certificado oficial ya obtenido puedes presentarte a cualquier convocatoria y no dependes del curso interno.' },
    { q: '¿Qué nivel de inglés piden realmente?', a: 'La referencia habitual es un B1-B2 funcional: que puedas atender al pasaje, dar instrucciones de seguridad y resolver una incidencia. Se evalúa hablado durante la entrevista, no por el título que pongas en el CV.' },
    { q: '¿Los tatuajes descartan?', a: 'Depende de cada aerolínea. La norma general es que no sean visibles con el uniforme. Algunas compañías han flexibilizado su política en los últimos años; conviene revisar los requisitos concretos de cada convocatoria.' },
  ],
  related: [
    { href: '/blog/requisitos-azafata-vuelo/', t: 'Requisitos para ser TCP en España' },
    { href: '/blog/cuanto-cobran-las-azafatas-de-vuelo/', t: '¿Cuánto cobra un TCP?' },
  ],
},

{
  slug: 'curso-tcp-precio-cuanto-cuesta',
  cat: 'Formación aeronáutica',
  kicker: 'Formación · TCP',
  title: 'Cuánto cuesta el curso de TCP en España: precio, qué incluye y cómo saber si es oficial',
  seoTitle: 'Curso de TCP: precio real y qué debe incluir (guía 2026)',
  metaDesc: 'Cuánto cuesta el curso de azafata de vuelo / TCP en España, qué debe incluir el precio, qué gastos extra existen y cómo detectar un curso que no es oficial de AESA.',
  focusKw: 'curso tcp precio',
  kws: ['curso de azafata de vuelo precio', 'precio curso azafata de vuelo', 'cuanto cuesta el curso de tcp', 'curso auxiliar de vuelo precio'],
  lead: '<strong>El precio de un curso de TCP no se compara por el número: se compara por lo que incluye.</strong> Dos cursos con el mismo importe pueden dejarte con un certificado válido para volar o con un diploma que no sirve para nada. Te explicamos qué debe incluir el precio y qué preguntas hacer antes de pagar.',
  key: [
    'Lo único que te habilita para volar es el <strong>Certificado de Tripulante de Cabina de Pasajeros</strong> conforme a la normativa europea y reconocido por AESA.',
    'Un curso barato que <strong>no expide certificado oficial</strong> no es más barato: es dinero perdido.',
    'Al precio del curso hay que sumar <strong>reconocimiento médico aeronáutico</strong> y, en algunos casos, la tasa oficial.',
    'Pide siempre por escrito: <strong>qué certificado emiten, horas de formación práctica y si incluye prácticas en simulador y piscina</strong>.',
  ],
  stats: [
    { b: 'Certificado oficial', s: 'Es el único requisito innegociable' },
    { b: 'Práctica real', s: 'Simulador, evacuación, fuego y piscina' },
    { b: 'Sin carrera', s: 'Con la ESO puedes acceder' },
  ],
  sections: [
    { id: 'incluye', h2: 'Qué debe incluir el precio de un curso de TCP', blocks: [
      ['p', 'Antes de mirar el importe, comprueba que el programa cubre lo que la normativa exige. Un curso completo incluye:'],
      ['table',
        ['Bloque', 'Qué debe cubrir'],
        [
          ['Formación teórica', 'Normativa aeronáutica, factores humanos, aeronaves, mercancías peligrosas, seguridad y CRM'],
          ['Primeros auxilios', 'Formación sanitaria a bordo y uso del equipamiento médico de cabina'],
          ['Supervivencia y evacuación', 'Prácticas reales de evacuación, humo, fuego y supervivencia en el agua'],
          ['Prácticas en simulador', 'Mock-up de cabina: puertas, salidas de emergencia, equipamiento'],
          ['Certificado', 'Emisión del certificado de TCP conforme a normativa europea, reconocido por AESA'],
          ['Preparación de selección', 'Entrevista, dinámica de grupo, CV e inglés aeronáutico (no obligatorio, pero decisivo)'],
        ]
      ],
      ['warn', 'Cuidado con esto', 'Si un centro te vende un "curso de azafata" que no termina en el certificado oficial de TCP, no podrás volar con él. Es la trampa más común del sector.'],
    ]},
    { id: 'extras', h2: 'Gastos que no siempre están en el precio', blocks: [
      ['ul', [
        '<strong>Reconocimiento médico aeronáutico</strong> en un centro autorizado: es obligatorio y suele ir aparte.',
        '<strong>Tasas oficiales</strong> asociadas a la tramitación del certificado, cuando aplican.',
        '<strong>Material y uniforme</strong> de prácticas, según el centro.',
        '<strong>Formación de idiomas</strong>, si necesitas subir tu nivel de inglés antes de presentarte.',
        '<strong>Habilitación de tipo de avión</strong>: la imparte la aerolínea cuando te contrata, no el centro de formación.',
      ]],
      ['note', 'Pregunta clave antes de matricularte', '"¿El precio incluye la emisión del certificado oficial y las prácticas de evacuación y agua, o van aparte?" La respuesta te dirá mucho más que el importe.'],
    ]},
    { id: 'gratis', h2: '¿Existen cursos de TCP gratis?', blocks: [
      ['p', 'Es una de las búsquedas más frecuentes y merece una respuesta honesta: <strong>no existe un curso oficial de TCP gratuito y generalizado</strong>. Lo que sí existe es:'],
      ['ul', [
        '<strong>Cursos internos de aerolínea</strong>: algunas compañías forman a los candidatos que seleccionan. Las plazas son escasísimas y muy competidas, y a veces el coste se descuenta de la nómina.',
        '<strong>Ayudas y financiación</strong>: fraccionamiento del pago, becas puntuales o programas de empleo autonómicos. No cubren el curso completo de forma habitual.',
        '<strong>Cursos "gratuitos" de captación</strong>: charlas o formaciones cortas que no expiden certificado oficial y que sirven de gancho comercial.',
      ]],
      ['q', 'Si el certificado no es válido para AESA, el curso no es barato: es inútil.'],
    ]},
    { id: 'rentable', h2: 'Cómo saber si te sale a cuenta', blocks: [
      ['p', 'La forma correcta de valorar el precio es compararlo con lo que ganarás y con la velocidad de acceso al empleo. El TCP es una profesión a la que se entra <strong>desde cero, sin carrera universitaria y en meses, no en años</strong>, con un sueldo de entrada que crece rápido con antigüedad, dietas y vuelos de largo radio.'],
      ['pros',
        { t: 'A favor de formarte', items: ['Acceso al empleo en meses, no en años', 'No necesitas carrera universitaria', 'Certificado válido en toda la Unión Europea', 'Puedes presentarte a todas las aerolíneas a la vez'] },
        { t: 'A tener en cuenta', items: ['Es una inversión inicial que hay que planificar', 'Requiere disponibilidad de turnos y movilidad', 'El inglés es imprescindible, no opcional', 'Debes pasar el reconocimiento médico'] }
      ],
    ]},
    { id: 'preguntas', h2: 'Las 6 preguntas que debes hacer a cualquier centro', blocks: [
      ['ol', [
        '¿Qué certificado exacto expedís al terminar y bajo qué normativa?',
        '¿Está reconocido por AESA y es válido en el resto de Europa?',
        '¿Cuántas horas son presenciales y cuáles son prácticas reales?',
        '¿Hacéis prácticas de evacuación, fuego y supervivencia en el agua?',
        '¿El precio incluye la emisión del certificado? ¿Y el reconocimiento médico?',
        '¿Preparáis el proceso de selección de las aerolíneas?',
      ]],
    ]},
  ],
  cta: { h: 'Pide el precio y el programa completo del curso de TCP', p: 'Te detallamos qué incluye, qué certificado obtienes y las opciones de financiación, sin compromiso.', href: C.tcp, btn: 'Ver el curso de TCP', btn2: 'Solicitar información', href2: C.info },
  recap: 'El precio del curso de TCP debe compararse por lo que incluye: formación teórica completa, prácticas reales de evacuación, fuego y agua, simulador de cabina y, sobre todo, la emisión del certificado oficial reconocido por AESA. Hay gastos que suelen ir aparte (reconocimiento médico, tasas). Los cursos "gratis" o sin certificado oficial no habilitan para volar.',
  faq: [
    { q: '¿Cuánto cuesta el curso de azafata de vuelo en España?', a: 'Varía según el centro y lo que incluya el programa. Lo importante no es el importe aislado, sino si incluye la emisión del certificado oficial de TCP, las prácticas reales de evacuación y agua y la preparación del proceso de selección. Pide siempre el desglose por escrito.' },
    { q: '¿El curso de TCP se puede pagar a plazos?', a: 'La mayoría de centros ofrecen fraccionamiento o financiación. Conviene confirmar si hay intereses y si el certificado se emite igualmente al terminar el curso.' },
    { q: '¿El curso de TCP sirve para toda Europa?', a: 'Sí. El certificado de tripulante de cabina de pasajeros emitido conforme a la normativa europea es válido en los Estados miembros, lo que te permite presentarte a aerolíneas de toda la UE.' },
    { q: '¿Hay cursos de TCP del INEM o del SEPE?', a: 'Puntualmente pueden aparecer programas de formación para el empleo, pero no es una vía estable ni generalizada para obtener el certificado oficial de TCP. Lo habitual es cursarlo en un centro de formación aeronáutica.' },
  ],
  related: [
    { href: '/blog/requisitos-azafata-vuelo/', t: 'Requisitos para ser TCP' },
    { href: '/blog/que-es-certificado-tcp/', t: 'Qué es el certificado TCP y por qué debe ser oficial' },
  ],
},

{
  slug: 'como-entrar-a-trabajar-en-una-aerolinea',
  cat: 'Carreras en aviación',
  kicker: 'Empleo · Aviación',
  title: 'Cómo entrar a trabajar en una aerolínea desde cero: todas las vías reales',
  seoTitle: 'Cómo entrar a trabajar en una aerolínea desde cero',
  metaDesc: 'Todas las vías reales para entrar a trabajar en una aerolínea sin experiencia: TCP, handling, operaciones y despacho de vuelo. Requisitos, plazos y por dónde empezar.',
  focusKw: 'trabajar en una aerolínea',
  kws: ['como entrar a trabajar en una aerolinea', 'trabajar como auxiliar de vuelo', 'trabajo auxiliar de vuelo', 'entrar en el sector aereo'],
  lead: '<strong>No hace falta ser piloto ni tener una carrera para trabajar en una aerolínea.</strong> El sector aéreo contrata cada año a miles de personas en cabina, en tierra y en operaciones, y la mayoría de esas vacantes se cubren con formación específica de meses, no con títulos universitarios. Estas son las vías reales, ordenadas por rapidez de acceso.',
  key: [
    'Las tres puertas de entrada más rápidas son <strong>TCP, handling/agente de pasaje y despacho de vuelo</strong>.',
    'Ninguna requiere carrera universitaria: <strong>ESO + formación específica + inglés</strong>.',
    'El aeropuerto contrata todo el año por <strong>rotación y picos de temporada</strong>.',
    'La formación previa es lo que te diferencia: casi nadie llega certificado a los procesos.',
  ],
  stats: [
    { b: '3 vías', s: 'Cabina, tierra y operaciones' },
    { b: 'Sin carrera', s: 'Basta la ESO y formación específica' },
    { b: 'Todo el año', s: 'El aeropuerto no cierra: hay rotación constante' },
  ],
  sections: [
    { id: 'mapa', h2: 'El mapa completo: quién trabaja en una aerolínea', blocks: [
      ['p', 'Cuando pensamos en una aerolínea pensamos en pilotos y tripulación de cabina, pero detrás de cada vuelo hay decenas de perfiles. Estos son los que se pueden alcanzar <strong>desde cero con formación específica</strong>:'],
      ['table',
        ['Puesto', 'Dónde trabaja', 'Formación de acceso'],
        [
          ['TCP / auxiliar de vuelo', 'A bordo', 'Certificado oficial de TCP'],
          ['Agente de pasaje / azafata de tierra', 'Terminal (mostrador y puerta)', 'Curso de operaciones y handling'],
          ['Agente de rampa / handling', 'Plataforma', 'Curso de handling + carné y permisos'],
          ['Despachador de vuelo', 'Centro de operaciones', 'Formación específica de operaciones de vuelo'],
          ['Atención al cliente y conexiones', 'Terminal', 'Curso de operaciones + idiomas'],
        ]
      ],
    ]},
    { id: 'tcp', h2: 'Vía 1: entrar volando (TCP)', blocks: [
      ['p', 'Es la vía más conocida y la más demandada. Requisitos: mayor de edad, ESO, inglés funcional, saber nadar, certificado médico aeronáutico y el <strong>certificado oficial de TCP</strong>. Con eso puedes presentarte a cualquier convocatoria en España y en Europa.'],
      ['note', 'Lo que casi nadie tiene en cuenta', 'Las convocatorias de las aerolíneas se abren y se cierran en cuestión de semanas. Si el día que se abre la convocatoria todavía no tienes el certificado, esa ventana la pierdes.'],
    ]},
    { id: 'tierra', h2: 'Vía 2: entrar por tierra (handling y agente de pasaje)', blocks: [
      ['p', 'Es la vía <strong>más rápida</strong> para pisar el aeropuerto. Las empresas de handling (las que dan servicio a las aerolíneas en el aeropuerto) contratan de forma continua: facturación, embarque, equipajes, rampa y atención al pasajero.'],
      ['ul', [
        'Requisitos de entrada más accesibles que en cabina.',
        'Alta rotación: eso significa vacantes constantes.',
        'Excelente trampolín: mucha gente empieza aquí y luego promociona a coordinación, operaciones o pasa a cabina.',
      ]],
    ]},
    { id: 'operaciones', h2: 'Vía 3: entrar por operaciones (despacho de vuelo)', blocks: [
      ['p', 'La menos conocida y, precisamente por eso, la de <strong>menor competencia por plaza</strong>. El despachador de vuelo planifica ruta, combustible y meteorología junto al comandante desde el centro de operaciones. Es un trabajo técnico, en tierra y con alta responsabilidad.'],
    ]},
    { id: 'plan', h2: 'Plan realista para entrar este año', blocks: [
      ['steps', [
        { t: 'Elige la vía que encaja contigo', d: 'Volar (TCP), trato con pasaje en aeropuerto (tierra) o perfil técnico de oficina (despacho).' },
        { t: 'Obtén la certificación de esa vía', d: 'Es lo que te permite presentarte a los procesos sin depender de que la empresa te forme.' },
        { t: 'Sube el inglés a nivel funcional', d: 'Hablado. Se evalúa en entrevista, no en el CV.' },
        { t: 'Prepara CV y proceso de selección', d: 'Foto profesional, certificado visible, experiencia de atención al público y entrenamiento de dinámica de grupo.' },
        { t: 'Presenta candidaturas en paralelo', d: 'Aerolíneas, empresas de handling y portales del sector. No dependas de una sola convocatoria.' },
      ]],
    ]},
  ],
  cta: { h: '¿Por dónde quieres entrar al sector?', p: 'Te ayudamos a elegir entre cabina, tierra u operaciones según tu perfil y tu disponibilidad.', href: C.info, btn: 'Hablar con un asesor', btn2: 'Ver los cursos', href2: C.tcp },
  recap: 'Se puede entrar a trabajar en una aerolínea desde cero por tres vías: TCP (a bordo), handling y agente de pasaje (aeropuerto) y despacho de vuelo (operaciones). Ninguna exige carrera universitaria: basta la ESO, inglés funcional y la formación específica de cada vía. Llegar ya certificado es lo que permite aprovechar las convocatorias cuando se abren.',
  faq: [
    { q: '¿Se puede trabajar en una aerolínea sin experiencia?', a: 'Sí. La mayoría de puestos de entrada (TCP, agente de pasaje, rampa) están pensados para gente sin experiencia previa en el sector. Lo que sí se exige es la formación o certificación específica del puesto.' },
    { q: '¿Qué es más fácil, TCP o trabajar en tierra?', a: 'El acceso a tierra suele ser más rápido por la alta rotación y unos requisitos algo más accesibles. Ser TCP tiene un proceso de selección más competido pero mejores condiciones económicas y proyección.' },
    { q: '¿Hace falta carrera universitaria?', a: 'No. Para TCP, handling y agente de pasaje basta la ESO más la formación específica. La carrera no es un requisito en ninguna de estas vías.' },
    { q: '¿Qué idiomas piden?', a: 'Inglés siempre, a nivel funcional hablado. Cualquier idioma adicional (francés, alemán, italiano, árabe, chino) es un diferencial muy valorado, especialmente en aeropuertos con mucho tráfico internacional.' },
  ],
  related: [
    { href: '/blog/requisitos-azafata-vuelo/', t: 'Requisitos para ser TCP' },
    { href: '/blog/agente-de-tierra-funciones-sueldo/', t: 'Agente de tierra: funciones y sueldo' },
  ],
},

{
  slug: 'salidas-profesionales-tcp-carrera-aviacion',
  cat: 'Carreras en aviación',
  kicker: 'Carrera · TCP',
  title: 'Salidas profesionales de un TCP: qué puedes hacer después de volar',
  seoTitle: 'Salidas profesionales de un TCP: la carrera después de volar',
  metaDesc: 'Qué salidas tiene un TCP a medio y largo plazo: sobrecargo, instructor, formación, operaciones, tierra o aviación privada. Cómo se promociona en una aerolínea.',
  focusKw: 'salidas profesionales tcp',
  kws: ['carrera profesional auxiliar de vuelo', 'promocion sobrecargo', 'que hacer despues de ser tcp', 'futuro profesional tcp'],
  lead: '<strong>Ser TCP no es un trabajo de paso: es la puerta de entrada a una carrera dentro del sector aéreo.</strong> La duda que frena a muchos candidatos es "¿y dentro de diez años, qué?". Estas son las salidas reales que se abren desde la cabina, dentro y fuera de la aerolínea.',
  key: [
    'La promoción natural dentro de la cabina es <strong>TCP → sobrecargo → jefe de cabina</strong>.',
    'También se puede salir a <strong>instrucción, formación, operaciones y selección de personal</strong>.',
    'Fuera de la aerolínea: <strong>aviación privada y ejecutiva</strong>, con condiciones muy distintas.',
    'La experiencia en cabina es <strong>muy transferible</strong> a cualquier puesto de atención al cliente premium.',
  ],
  stats: [
    { b: 'Sobrecargo', s: 'La promoción más habitual en cabina' },
    { b: 'Instructor', s: 'Formar a las nuevas promociones de TCP' },
    { b: 'Tierra', s: 'Operaciones, coordinación y selección' },
  ],
  sections: [
    { id: 'cabina', h2: 'Camino 1: promocionar dentro de la cabina', blocks: [
      ['p', 'Es la ruta más directa. Con antigüedad, formación interna y evaluación positiva, un TCP puede pasar a responsable de cabina.'],
      ['table',
        ['Puesto', 'Qué cambia'],
        [
          ['TCP', 'Seguridad y servicio a bordo bajo la coordinación del responsable de cabina'],
          ['Sobrecargo / jefe de cabina', 'Lidera la tripulación de cabina, coordina con los pilotos y responde de la operativa del vuelo'],
          ['Instructor de cabina', 'Forma y evalúa a las nuevas promociones y a los reciclajes anuales'],
        ]
      ],
      ['p', 'Además, dentro de la propia compañía hay especializaciones: largo radio, flota concreta, business/premium o vuelos ejecutivos.'],
    ]},
    { id: 'tierra', h2: 'Camino 2: pasar a tierra sin salir del sector', blocks: [
      ['p', 'Es muy habitual: después de unos años volando, muchos TCP buscan estabilidad horaria sin dejar la aviación. La experiencia en cabina es un activo enorme para estos puestos:'],
      ['ul', [
        '<strong>Operaciones y control de vuelos</strong>: coordinación de la operativa diaria.',
        '<strong>Formación</strong>: instructor de seguridad, primeros auxilios o servicio.',
        '<strong>Selección de tripulaciones</strong>: nadie evalúa mejor a un candidato que quien ha volado.',
        '<strong>Coordinación de handling</strong>: supervisión de la operativa en aeropuerto.',
        '<strong>Calidad y experiencia de cliente</strong>: diseño del servicio a bordo.',
      ]],
    ]},
    { id: 'privada', h2: 'Camino 3: aviación privada y ejecutiva', blocks: [
      ['p', 'Un mundo aparte: vuelos chárter, aviación corporativa y VIP. Se valora la experiencia previa en línea regular, un nivel alto de idiomas y una orientación al servicio muy exigente. A cambio, la operativa es más flexible y el trato con el pasajero, mucho más personalizado.'],
      ['note', 'Ojo al matiz', 'En aviación ejecutiva la disponibilidad manda: los vuelos se programan con poca antelación y la flexibilidad es parte del trabajo.'],
    ]},
    { id: 'fuera', h2: 'Camino 4: fuera del sector (y por qué te contratan)', blocks: [
      ['p', 'La formación de un TCP deja competencias muy cotizadas fuera de la aviación: gestión de crisis, primeros auxilios, atención a cliente exigente en espacios reducidos, trabajo en equipo con desconocidos y comunicación en varios idiomas. Es un perfil natural para hostelería de alto nivel, eventos, atención al cliente premium y turismo.'],
    ]},
    { id: 'decision', h2: 'Cómo construir la carrera desde el primer día', blocks: [
      ['steps', [
        { t: 'Elige bien la primera compañía', d: 'Corto radio para acumular horas y experiencia rápido; largo radio para mejores condiciones y destinos.' },
        { t: 'Suma idiomas desde el principio', d: 'Es el acelerador más rápido para largo radio, premium y aviación privada.' },
        { t: 'Aprovecha la formación interna', d: 'Cada curso adicional (seguridad, primeros auxilios, instructor) es un punto en las promociones internas.' },
        { t: 'Piensa la salida antes de necesitarla', d: 'Si tu objetivo a 8 años es tierra, empieza a construir relación con operaciones y formación mucho antes.' },
      ]],
    ]},
  ],
  cta: { h: 'Empieza la carrera por el principio', p: 'El certificado oficial de TCP es el primer paso de todo lo que has leído aquí.', href: C.tcp, btn: 'Ver el curso de TCP', btn2: 'Pedir información', href2: C.info },
  recap: 'Un TCP tiene cuatro caminos: promocionar en cabina (sobrecargo, jefe de cabina, instructor), pasar a tierra (operaciones, formación, selección, handling), moverse a aviación privada y ejecutiva, o transferir sus competencias fuera del sector. Los idiomas y la formación interna son los principales aceleradores de la carrera.',
  faq: [
    { q: '¿Cuántos años se tarda en ser sobrecargo?', a: 'Depende de la aerolínea, de su estructura y de las vacantes internas. Influye la antigüedad, la evaluación de desempeño, los idiomas y la formación adicional que hayas acumulado.' },
    { q: '¿Se puede ser TCP toda la vida?', a: 'Sí, es una profesión con recorrido completo. Muchos profesionales vuelan toda su carrera y otros combinan vuelo con instrucción o pasan a puestos de tierra buscando estabilidad horaria.' },
    { q: '¿La experiencia como TCP sirve fuera de la aviación?', a: 'Mucho. La gestión de crisis, los primeros auxilios, el trato con cliente exigente y el trabajo en equipo son competencias muy valoradas en hostelería de alto nivel, eventos, turismo y atención al cliente premium.' },
  ],
  related: [
    { href: '/blog/sobrecargo-vuelo/', t: 'Qué es un sobrecargo de vuelo' },
    { href: '/blog/cuanto-cobran-las-azafatas-de-vuelo/', t: 'Cuánto cobra un TCP' },
  ],
},

{
  slug: 'curso-tcp-gratis-existe-realidad',
  cat: 'Formación aeronáutica',
  kicker: 'Sin rodeos · TCP',
  title: 'Curso de TCP gratis: qué hay de verdad y qué es puro reclamo',
  seoTitle: 'Curso de TCP gratis: qué es real y qué no (sin rodeos)',
  metaDesc: '¿Existen cursos de TCP gratis, del SEPE o pagados por la aerolínea? Te explicamos qué opciones son reales, cuáles son un reclamo y cómo detectar un curso sin valor.',
  focusKw: 'curso tcp gratis',
  kws: ['curso de auxiliar de vuelo inem', 'curso azafata de vuelo gratis', 'curso tcp sepe', 'formacion tcp aerolinea'],
  lead: '<strong>Respuesta corta: no existe un curso oficial de TCP gratuito y abierto a todo el mundo.</strong> Existen algunas vías subvencionadas o pagadas por la aerolínea, pero son escasas, competidas y tienen letra pequeña. Aquí está lo que es real, lo que es un reclamo comercial y cómo no perder ni dinero ni meses.',
  key: [
    'No hay una vía pública estable para obtener gratis el certificado oficial de TCP.',
    'Algunas aerolíneas forman a quien seleccionan, pero <strong>primero hay que superar la selección</strong> y a veces el coste se descuenta de la nómina.',
    'Los "cursos gratis" que se anuncian suelen ser <strong>charlas o formaciones sin certificado oficial</strong>.',
    'Lo que sí existe de verdad: <strong>financiación y pago fraccionado</strong>.',
  ],
  stats: [
    { b: 'Certificado', s: 'Sin él no puedes volar, cueste lo que cueste' },
    { b: 'Plazas internas', s: 'Muy pocas y muy competidas' },
    { b: 'Financiación', s: 'La vía realista para la mayoría' },
  ],
  sections: [
    { id: 'aerolinea', h2: 'Opción real 1: que te forme la aerolínea', blocks: [
      ['p', 'Algunas compañías seleccionan candidatos sin certificado y les imparten la formación inicial. Suena ideal, pero hay que entender cómo funciona:'],
      ['ul', [
        'Primero tienes que <strong>superar todo el proceso de selección</strong>, compitiendo con miles de candidatos, muchos de ellos ya certificados.',
        'Las plazas son <strong>muy limitadas</strong> y las convocatorias, puntuales.',
        'En algunos casos el coste de la formación <strong>se descuenta de la nómina</strong> o queda vinculado a una permanencia mínima.',
        'El certificado obtenido así <strong>puede quedar ligado a esa compañía</strong> en la práctica, hasta que consolidas experiencia.',
      ]],
      ['warn', 'El coste oculto', 'Esperar a que "te lo pague una aerolínea" puede significar perder una o dos temporadas de contratación. Ese tiempo también es dinero.'],
    ]},
    { id: 'publica', h2: 'Opción real 2: formación para el empleo y ayudas', blocks: [
      ['p', 'De forma puntual pueden aparecer programas autonómicos de formación para el empleo relacionados con el sector aeroportuario, y en algunos casos ayudas o becas. Dos advertencias:'],
      ['ol', [
        'Casi nunca cubren el <strong>certificado oficial de TCP</strong>: suelen ser cursos de atención al pasajero o de handling.',
        'Las convocatorias son irregulares. Es una posibilidad, no un plan.',
      ]],
      ['note', 'Consejo práctico', 'Si te interesa la vía subvencionada, revisa las convocatorias de tu comunidad y del servicio de empleo, pero <strong>no bloquees tu plan por si sale</strong>. Avanza en paralelo.'],
    ]},
    { id: 'reclamo', h2: 'Lo que suele ser puro reclamo', blocks: [
      ['table',
        ['Lo que anuncian', 'Lo que suele ser en realidad'],
        [
          ['"Curso de azafata gratis"', 'Charla informativa o clase de muestra para captar matrículas'],
          ['"Formación gratuita con empleo garantizado"', 'Nadie puede garantizar la contratación: depende del proceso de la aerolínea'],
          ['"Curso homologado" (sin decir por quién)', 'Homologado no equivale a certificado oficial de TCP reconocido por AESA'],
          ['"Título de azafata de vuelo"', 'Un diploma de centro no habilita para volar; lo que habilita es el certificado de TCP'],
        ]
      ],
      ['q', 'La pregunta que lo resuelve todo: "¿Este curso termina con el certificado oficial de tripulante de cabina de pasajeros reconocido por AESA?" Si la respuesta no es un sí rotundo y por escrito, no sirve para volar.'],
    ]},
    { id: 'alternativa', h2: 'La alternativa que sí funciona: financiar y empezar ya', blocks: [
      ['p', 'La vía realista para la mayoría de candidatos es cursar la formación oficial con <strong>pago fraccionado</strong> y entrar al mercado con el certificado en la mano. La lógica es simple: cuanto antes tengas el certificado, antes puedes presentarte a <strong>todas</strong> las convocatorias, no solo a las que forman.'],
      ['pros',
        { t: 'Formarte ya, financiado', items: ['Puedes presentarte a cualquier aerolínea desde el día uno', 'No dependes de una convocatoria concreta', 'Certificado válido en toda la UE, es tuyo', 'Empiezas a generar ingresos antes'] },
        { t: 'Esperar a "lo gratis"', items: ['Plazas escasas y muy competidas', 'Puedes perder una o dos temporadas', 'Compites contra candidatos ya certificados', 'Posible permanencia o descuento en nómina'] }
      ],
    ]},
  ],
  cta: { h: '¿Hablamos de opciones de pago?', p: 'Te explicamos el precio real, qué incluye y cómo fraccionarlo para que puedas empezar ya.', href: C.info, btn: 'Solicitar información', btn2: 'Ver el curso de TCP', href2: C.tcp },
  recap: 'No existe un curso oficial de TCP gratuito y abierto. Algunas aerolíneas forman a quien seleccionan, pero las plazas son escasas y a veces el coste se descuenta o conlleva permanencia. Los cursos "gratis" que se anuncian suelen ser reclamos sin certificado oficial. La vía realista es la formación oficial con pago fraccionado, que te permite presentarte a todas las convocatorias desde el primer día.',
  faq: [
    { q: '¿El SEPE o el INEM dan el curso de TCP?', a: 'No de forma estable ni generalizada. Pueden aparecer cursos puntuales relacionados con el sector aeroportuario, pero no suelen incluir el certificado oficial de tripulante de cabina de pasajeros.' },
    { q: '¿Las aerolíneas pagan el curso de TCP?', a: 'Algunas forman a los candidatos que seleccionan. Hay que superar antes todo el proceso, las plazas son limitadas y en ocasiones el coste se descuenta de la nómina o implica un compromiso de permanencia.' },
    { q: '¿Cómo sé si un curso es oficial?', a: 'Pide por escrito qué certificado emiten y bajo qué normativa. Debe ser el certificado de tripulante de cabina de pasajeros conforme a la normativa europea y reconocido por AESA. "Homologado" o "titulación propia" no es lo mismo.' },
  ],
  related: [
    { href: '/blog/que-es-certificado-tcp/', t: 'Qué es el certificado TCP' },
    { href: '/blog/curso-tcp-precio-cuanto-cuesta/', t: 'Cuánto cuesta el curso de TCP' },
  ],
},

{
  slug: 'ser-azafato-de-vuelo-hombre-tcp',
  cat: 'Carreras en aviación',
  kicker: 'TCP · Hombres en cabina',
  title: 'Azafato de vuelo: ser hombre y TCP en 2026 (requisitos, sueldo y realidad del sector)',
  seoTitle: 'Azafato de vuelo: ser TCP siendo hombre (guía real)',
  metaDesc: '¿Puede un hombre ser azafato de vuelo? Requisitos, sueldo, qué buscan las aerolíneas y por qué cada vez hay más hombres en la tripulación de cabina.',
  focusKw: 'azafato de vuelo',
  kws: ['cuanto gana un azafato de vuelo', 'hombre auxiliar de vuelo', 'tcp hombre', 'azafato requisitos'],
  lead: '<strong>Sí, un hombre puede ser TCP: los requisitos son exactamente los mismos y las aerolíneas contratan hombres en todas sus convocatorias.</strong> La profesión se llama oficialmente <em>tripulante de cabina de pasajeros</em>, no tiene género, y el porcentaje de hombres en cabina lleva años creciendo. Te contamos la realidad del puesto sin tópicos.',
  key: [
    'El puesto oficial es <strong>TCP (tripulante de cabina de pasajeros)</strong>: mismo certificado, mismos requisitos, mismo convenio.',
    'El sueldo <strong>no depende del género</strong>: depende de aerolínea, antigüedad, radio y dietas.',
    'Las aerolíneas valoran tener <strong>tripulaciones mixtas</strong> por operativa y por perfil de pasaje.',
    'La imagen y el uniforme se ajustan a la normativa de cada compañía, igual que en el resto de la tripulación.',
  ],
  stats: [
    { b: 'Mismos requisitos', s: 'ESO, +18, inglés, natación y certificado' },
    { b: 'Mismo convenio', s: 'El sueldo no varía por género' },
    { b: 'Tendencia', s: 'Cada vez más hombres en cabina' },
  ],
  sections: [
    { id: 'nombre', h2: '"Azafato", "auxiliar" o "TCP": cómo se llama realmente', blocks: [
      ['p', 'Coloquialmente se dice azafata o azafato, pero el nombre oficial de la profesión es <strong>tripulante de cabina de pasajeros (TCP)</strong>, también llamado auxiliar de vuelo. Es el término que aparece en la normativa, en el certificado y en las convocatorias de las aerolíneas.'],
      ['note', 'Por qué importa', 'Cuando busques ofertas de empleo, busca por <strong>TCP</strong>, <strong>tripulante de cabina</strong> o <strong>cabin crew</strong>. Es como están publicadas la mayoría de vacantes.'],
    ]},
    { id: 'requisitos', h2: 'Requisitos: exactamente los mismos', blocks: [
      ['ul', [
        'Ser mayor de 18 años.',
        'ESO o equivalente. No se exige carrera universitaria.',
        'Inglés a nivel funcional (referencia habitual B1-B2).',
        'Saber nadar: hay pruebas de supervivencia en el agua.',
        'Certificado médico aeronáutico en centro autorizado.',
        '<strong>Certificado oficial de TCP</strong> conforme a la normativa europea, reconocido por AESA.',
        'Alcance funcional a los compartimentos superiores de cabina.',
      ]],
      ['q', 'No existe ningún requisito legal distinto para hombres y mujeres. Lo que varía entre compañías son las normas de imagen y uniformidad, que se aplican a toda la tripulación.'],
    ]},
    { id: 'sueldo', h2: 'Cuánto gana un azafato de vuelo', blocks: [
      ['p', 'El sueldo de un TCP se compone de <strong>salario base + variables</strong>, y esos variables pesan mucho. No hay diferencia por género: la retribución la fija el convenio y la política de la compañía.'],
      ['table',
        ['Componente', 'De qué depende'],
        [
          ['Salario base', 'Convenio de la aerolínea y antigüedad'],
          ['Dietas', 'Destinos, pernoctas y tiempo fuera de base'],
          ['Prima por hora de vuelo', 'Horas voladas en el mes'],
          ['Pluses', 'Nocturnidad, festivos, idiomas, funciones adicionales'],
          ['Largo radio', 'Vuelos intercontinentales: mejores condiciones'],
        ]
      ],
      ['p', 'Por eso dos TCP de la misma promoción pueden cobrar cantidades muy distintas: una compañía de largo radio con muchas dietas no se parece a una de corto radio con base fija.'],
    ]},
    { id: 'realidad', h2: 'La realidad del puesto para un hombre en cabina', blocks: [
      ['p', 'La operativa es idéntica: seguridad, evacuación, primeros auxilios, servicio y atención al pasaje. En el día a día, las tripulaciones mixtas están completamente normalizadas y hay compañías donde la presencia masculina en cabina es muy alta.'],
      ['pros',
        { t: 'Lo bueno', items: ['Profesión sin techo por género: se promociona a sobrecargo igual', 'Tripulaciones mixtas normalizadas', 'Mismo convenio y mismas condiciones', 'Perfil muy demandado en aviación ejecutiva'] },
        { t: 'Lo que hay que asumir', items: ['Turnos, festivos y noches fuera de casa', 'Normas de imagen y uniformidad estrictas', 'Proceso de selección igual de competido', 'Movilidad geográfica según la base asignada'] }
      ],
    ]},
  ],
  cta: { h: '¿Te ves volando?', p: 'Obtén el certificado oficial de TCP y preséntate a las convocatorias de las aerolíneas.', href: C.tcp, btn: 'Ver el curso de TCP', btn2: 'Pedir información', href2: C.info },
  recap: 'Un hombre puede ser TCP con exactamente los mismos requisitos: +18 años, ESO, inglés funcional, natación, certificado médico y el certificado oficial de TCP. El sueldo depende de aerolínea, antigüedad, radio y dietas, no del género. Las tripulaciones mixtas están normalizadas y la promoción a sobrecargo es igual de accesible.',
  faq: [
    { q: '¿Un hombre puede ser azafato de vuelo?', a: 'Sí. La profesión oficial es tripulante de cabina de pasajeros y no distingue por género. Los requisitos, el certificado y el convenio son los mismos.' },
    { q: '¿Cuánto gana un azafato de vuelo?', a: 'Lo mismo que cualquier TCP de su compañía y antigüedad: salario base más dietas, prima por hora de vuelo y pluses de nocturnidad o festivos. El largo radio suele tener mejores condiciones que el corto radio.' },
    { q: '¿Hay aerolíneas que prefieren mujeres?', a: 'Las convocatorias son abiertas y los requisitos son los mismos para todos los candidatos. Lo que sí varía entre compañías es la política de imagen y uniformidad, que se aplica a toda la tripulación.' },
  ],
  related: [
    { href: '/blog/requisitos-azafata-vuelo/', t: 'Requisitos para ser TCP' },
    { href: '/blog/cuanto-cobran-las-azafatas-de-vuelo/', t: 'Cuánto cobra un TCP' },
  ],
},

/* ───────────────────────────── P2 · Azafata de tierra / handling ───────────────────────────── */
{
  slug: 'azafata-de-tierra-que-es-requisitos-sueldo',
  cat: 'Carreras en aviación',
  kicker: 'Trabajo en tierra',
  title: 'Azafata de tierra: qué es, requisitos, sueldo y cómo empezar en el aeropuerto',
  seoTitle: 'Azafata de tierra: requisitos, sueldo y cómo empezar',
  metaDesc: 'Qué hace una azafata de tierra o agente de pasaje, requisitos reales, sueldo orientativo, turnos y cómo entrar a trabajar en el aeropuerto sin experiencia previa.',
  focusKw: 'azafata de tierra',
  kws: ['azafata de tierra requisitos', 'sueldo azafata de tierra', 'azafata de tierra que es', 'como ser azafata de tierra', 'azafata de tierra empleo'],
  lead: '<strong>La azafata o el azafato de tierra —oficialmente agente de pasaje— es la cara visible de la aerolínea en el aeropuerto: factura, embarca, resuelve incidencias y hace que el vuelo salga a su hora.</strong> Es la vía más rápida para trabajar en aviación sin volar, con contratación durante todo el año.',
  key: [
    'Trabajas en la <strong>terminal</strong>: mostrador de facturación, puerta de embarque y atención al pasajero.',
    'Requisitos accesibles: <strong>ESO, inglés e disponibilidad de turnos</strong>. No hace falta carrera.',
    'Contratan <strong>empresas de handling</strong>, no solo las aerolíneas.',
    'Es un <strong>trampolín</strong>: muchos profesionales promocionan a coordinación, operaciones o pasan a cabina.',
  ],
  stats: [
    { b: 'En tierra', s: 'Trabajas en el aeropuerto, sin volar' },
    { b: 'Todo el año', s: 'Alta rotación = vacantes constantes' },
    { b: 'Sin carrera', s: 'ESO + formación específica + idiomas' },
  ],
  sections: [
    { id: 'que', h2: 'Qué hace exactamente una azafata de tierra', blocks: [
      ['p', 'Su trabajo es el <strong>ciclo completo del pasajero en el aeropuerto</strong>, desde que llega a la terminal hasta que embarca (y desde que aterriza hasta que recoge su equipaje).'],
      ['ul', [
        '<strong>Facturación (check-in)</strong>: emisión de tarjetas de embarque, gestión de equipajes, control de documentación.',
        '<strong>Puerta de embarque</strong>: control de acceso, gestión de la cola, coordinación con la tripulación y con rampa.',
        '<strong>Atención e incidencias</strong>: retrasos, cancelaciones, reubicaciones, equipajes extraviados.',
        '<strong>Servicios especiales</strong>: pasajeros con movilidad reducida, menores no acompañados, conexiones.',
        '<strong>Documentación del vuelo</strong>: cierre de vuelo y comunicación de datos a la aerolínea.',
      ]],
      ['note', 'El nombre técnico', 'En las ofertas de empleo lo verás como <strong>agente de pasaje</strong>, <strong>agente de handling</strong> o <strong>customer service agent</strong>. Busca por esos términos, no solo por "azafata de tierra".'],
    ]},
    { id: 'requisitos', h2: 'Requisitos reales para trabajar en tierra', blocks: [
      ['table',
        ['Requisito', 'Detalle'],
        [
          ['Edad', 'Mayor de edad'],
          ['Estudios', 'ESO o equivalente. No se exige carrera universitaria'],
          ['Idiomas', 'Inglés imprescindible; un tercer idioma es un diferencial claro'],
          ['Disponibilidad', 'Turnos rotativos, madrugadas, noches, fines de semana y festivos'],
          ['Perfil', 'Atención al cliente, resolución bajo presión, buena presencia'],
          ['Formación específica', 'Curso de operaciones aeroportuarias y handling: te diferencia en la selección'],
          ['Permisos', 'Acreditación aeroportuaria, que se tramita al ser contratado'],
        ]
      ],
      ['warn', 'Lo que más se subestima', 'Los turnos. El aeropuerto opera de madrugada a medianoche: entrar a las 4:30 de la mañana es normal. Si tu vida no admite turnos rotativos, este puesto no encaja.'],
    ]},
    { id: 'sueldo', h2: 'Cuánto se gana como azafata de tierra', blocks: [
      ['p', 'El salario se rige por el <strong>convenio del sector de handling</strong> y por la empresa concreta que te contrate. El base es moderado, pero los complementos suben la nómina de forma significativa.'],
      ['ul', [
        '<strong>Nocturnidad</strong>: los turnos de madrugada se pagan aparte.',
        '<strong>Festivos y fines de semana</strong>: complemento habitual.',
        '<strong>Idiomas</strong>: algunas empresas retribuyen los idiomas adicionales.',
        '<strong>Antigüedad y categoría</strong>: la promoción a coordinador o supervisor cambia el tramo salarial.',
      ]],
      ['p', 'A menudo se empieza con <strong>contratos a tiempo parcial o de temporada</strong> que se van ampliando. Es el patrón normal del sector: se entra por temporada alta y se consolida.'],
    ]},
    { id: 'empezar', h2: 'Cómo entrar: el camino corto', blocks: [
      ['steps', [
        { t: 'Fórmate en operaciones y handling', d: 'Conocer la operativa, los sistemas de facturación y la normativa te pone por delante de quien llega sin preparación.' },
        { t: 'Prepara un CV orientado a atención al cliente', d: 'Hostelería, retail, turismo: todo lo que demuestre trato con público suma.' },
        { t: 'Apunta a las empresas de handling', d: 'No solo a las aerolíneas: gran parte de las vacantes las publican los operadores de handling del aeropuerto.' },
        { t: 'Aprovecha los picos de temporada', d: 'Verano y Navidad son los momentos de mayor contratación. Muchas incorporaciones estables empiezan así.' },
        { t: 'Piensa en la promoción desde el día uno', d: 'Coordinación, supervisión, operaciones o salto a cabina: la experiencia en tierra abre todas esas puertas.' },
      ]],
    ]},
  ],
  cta: { h: '¿Quieres trabajar en el aeropuerto?', p: 'Fórmate en azafata de tierra y operaciones aeroportuarias y entra al sector aéreo sin volar.', href: C.at, btn: 'Ver el curso', btn2: 'Pedir información', href2: C.info },
  recap: 'La azafata o agente de tierra atiende al pasajero en el aeropuerto: facturación, embarque, incidencias y servicios especiales. Requisitos accesibles (ESO, inglés, turnos) y contratación durante todo el año, principalmente a través de empresas de handling. El sueldo base es moderado y sube con nocturnidad, festivos e idiomas. La formación específica es lo que marca la diferencia en la selección.',
  faq: [
    { q: '¿Qué se necesita para ser azafata de tierra?', a: 'Ser mayor de edad, tener la ESO, inglés a nivel funcional y disponibilidad para turnos rotativos. No se exige carrera universitaria. Una formación específica en operaciones aeroportuarias y handling te posiciona mejor en la selección.' },
    { q: '¿Cuánto cobra una azafata de tierra?', a: 'Depende del convenio de handling y de la empresa. El salario base es moderado y se complementa con nocturnidad, festivos, fines de semana y, en algunos casos, idiomas. La promoción a coordinación o supervisión cambia el tramo salarial.' },
    { q: '¿Es lo mismo azafata de tierra que azafata de vuelo?', a: 'No. La azafata de tierra trabaja en el aeropuerto atendiendo al pasajero; el TCP o auxiliar de vuelo trabaja a bordo del avión y necesita el certificado oficial de tripulante de cabina.' },
    { q: '¿Se puede trabajar de azafata de tierra sin experiencia?', a: 'Sí. Muchas vacantes son de entrada y se cubren con perfiles sin experiencia previa en aviación, especialmente en los picos de temporada. Lo que se valora es la actitud de servicio, los idiomas y la formación específica.' },
  ],
  related: [
    { href: '/blog/agente-de-tierra-funciones-sueldo/', t: 'Agente de tierra y de rampa: funciones y sueldo' },
    { href: '/blog/que-es-un-agente-de-handling/', t: 'Qué es un agente de handling' },
  ],
},

{
  slug: 'agente-de-rampa-que-hace-cuanto-gana',
  cat: 'Carreras en aviación',
  kicker: 'Trabajo en tierra · Rampa',
  title: 'Agente de rampa: qué hace, cuánto gana y cómo entrar a trabajar en plataforma',
  seoTitle: 'Agente de rampa: funciones, sueldo y cómo entrar',
  metaDesc: 'Qué hace un agente de rampa en el aeropuerto, sueldo orientativo, requisitos, turnos y diferencias con el agente de pasaje. Cómo entrar a trabajar en plataforma.',
  focusKw: 'agente de rampa',
  kws: ['agente de rampa aeropuerto', 'cuanto gana un agente de rampa', 'agente de rampa empleo', 'trabajar en rampa aeropuerto'],
  lead: '<strong>El agente de rampa trabaja donde está el avión: carga y descarga equipajes, coloca la pasarela, señaliza el estacionamiento y prepara la aeronave para su próxima salida.</strong> Es el puesto que más contrata en un aeropuerto y una de las entradas más rápidas al sector aéreo.',
  key: [
    'Trabajas en <strong>plataforma</strong>, junto al avión, no en la terminal.',
    'Es un puesto <strong>físico y por turnos</strong>, con mucha contratación por rotación y temporada.',
    'Requisitos accesibles: ESO, <strong>carné de conducir</strong> y disponibilidad. Los permisos de plataforma se sacan al entrar.',
    'Muy buena base para promocionar a <strong>coordinador de rampa o supervisor de operaciones</strong>.',
  ],
  stats: [
    { b: 'En plataforma', s: 'Junto al avión, no en el mostrador' },
    { b: 'Turnos 24/7', s: 'Nocturnidad y festivos se pagan aparte' },
    { b: 'Alta demanda', s: 'El puesto que más se contrata en el aeropuerto' },
  ],
  sections: [
    { id: 'que', h2: 'Qué hace un agente de rampa', blocks: [
      ['p', 'Su misión es que el avión esté listo para volver a volar en el menor tiempo posible. Todo lo que ocurre entre que el avión aparca y vuelve a salir es, en buena medida, trabajo de rampa.'],
      ['ul', [
        '<strong>Equipajes y carga</strong>: descarga, clasificación y carga en bodega según el plan de carga.',
        '<strong>Señalización y estacionamiento</strong>: guiado del avión hasta su posición.',
        '<strong>Pasarela o escaleras</strong>: acoplamiento para el desembarque y embarque.',
        '<strong>Push-back</strong>: retroceso del avión con tractor antes del rodaje.',
        '<strong>Servicios a la aeronave</strong>: agua potable, residuos y apoyo a mantenimiento.',
        '<strong>Seguridad en plataforma</strong>: uno de los entornos con protocolos más estrictos del aeropuerto.',
      ]],
      ['q', 'La rampa es el reloj del aeropuerto: si un vuelo sale con retraso, casi siempre hay una parte de la explicación en plataforma.'],
    ]},
    { id: 'diferencia', h2: 'Rampa vs. pasaje: cuál te encaja', blocks: [
      ['table',
        ['', 'Agente de rampa', 'Agente de pasaje'],
        [
          ['Dónde trabaja', 'Plataforma, junto al avión', 'Terminal: mostrador y puerta'],
          ['Trato con pasajero', 'Mínimo', 'Constante'],
          ['Exigencia física', 'Alta (carga, intemperie)', 'Media (de pie muchas horas)'],
          ['Idiomas', 'Menos determinantes', 'Imprescindibles'],
          ['Promoción típica', 'Coordinador de rampa, supervisor', 'Coordinador de pasaje, operaciones'],
        ]
      ],
      ['note', 'Si dudas', 'Rampa encaja mejor si prefieres trabajo dinámico y físico al aire libre; pasaje, si te mueves bien con el público y los idiomas.'],
    ]},
    { id: 'sueldo', h2: 'Cuánto gana un agente de rampa', blocks: [
      ['p', 'Se rige por el <strong>convenio de handling</strong>. El salario base es similar al de agente de pasaje, y en la práctica <strong>los complementos suelen pesar más</strong> porque los turnos de rampa concentran madrugadas, noches y festivos.'],
      ['ul', [
        'Plus de <strong>nocturnidad</strong> (los turnos de madrugada son habituales).',
        'Complementos de <strong>festivos y fines de semana</strong>.',
        'Pluses por <strong>conducción de equipos</strong> y habilitaciones específicas de plataforma.',
        'Subida por <strong>categoría</strong> al promocionar a coordinador o supervisor.',
      ]],
      ['p', 'Igual que en pasaje, es muy frecuente empezar con contratos a tiempo parcial o de temporada que se van ampliando con el tiempo.'],
    ]},
    { id: 'entrar', h2: 'Requisitos y cómo entrar', blocks: [
      ['steps', [
        { t: 'Requisitos base', d: 'Mayor de edad, ESO o equivalente y, en la mayoría de vacantes, carné de conducir B (se conducen vehículos en plataforma).' },
        { t: 'Condición física y disponibilidad', d: 'Es un trabajo físico, a la intemperie y con turnos rotativos incluidas madrugadas.' },
        { t: 'Formación en handling y operaciones', d: 'Conocer la operativa, la seguridad en plataforma y el ciclo del vuelo te diferencia frente a candidaturas sin preparación.' },
        { t: 'Acreditación aeroportuaria', d: 'La tarjeta de acceso a zonas restringidas se tramita cuando te contratan, no antes.' },
        { t: 'Candidaturas a operadores de handling', d: 'Son ellos quienes contratan la mayoría de las plazas de rampa, no las aerolíneas directamente.' },
      ]],
    ]},
  ],
  cta: { h: 'Entra al aeropuerto por la vía más rápida', p: 'Fórmate en operaciones aeroportuarias y handling y preséntate con ventaja a las campañas de contratación.', href: C.at, btn: 'Ver el curso', btn2: 'Pedir información', href2: C.info },
  recap: 'El agente de rampa trabaja en plataforma: equipajes y carga, señalización, pasarela, push-back y servicios a la aeronave. Es un puesto físico, por turnos 24/7 y con mucha contratación. El sueldo se rige por el convenio de handling y los complementos de nocturnidad y festivos pesan mucho. Se entra con ESO, carné de conducir y, sobre todo, formación específica que te diferencie.',
  faq: [
    { q: '¿Qué hace un agente de rampa?', a: 'Se encarga de la operativa del avión en plataforma: carga y descarga de equipajes, señalización y estacionamiento, acoplamiento de pasarela o escaleras, push-back y servicios a la aeronave, siempre bajo protocolos estrictos de seguridad.' },
    { q: '¿Cuánto gana un agente de rampa en el aeropuerto?', a: 'Depende del convenio de handling y de la empresa. El salario base es moderado y los complementos de nocturnidad, festivos y habilitaciones específicas tienen mucho peso porque los turnos de rampa concentran madrugadas y fines de semana.' },
    { q: '¿Hace falta carné de conducir para trabajar en rampa?', a: 'En la mayoría de vacantes sí, porque se conducen vehículos y equipos dentro de la plataforma. Las habilitaciones específicas de cada equipo se obtienen ya dentro de la empresa.' },
    { q: '¿Es muy duro el trabajo en rampa?', a: 'Es físico y se desarrolla a la intemperie, con turnos rotativos que incluyen madrugadas. A cambio, es una de las entradas más rápidas al sector y tiene recorrido claro hacia coordinación y supervisión.' },
  ],
  related: [
    { href: '/blog/agente-de-tierra-funciones-sueldo/', t: 'Agente de tierra: funciones y sueldo' },
    { href: '/blog/azafata-de-tierra-que-es-requisitos-sueldo/', t: 'Azafata de tierra: requisitos y sueldo' },
  ],
},

/* ───────────────────────────── P4 · Sector / empleo aeroportuario ───────────────────────────── */
{
  slug: 'trabajar-en-aena-empleo-aeropuerto-guia',
  cat: 'Empleo en el aeropuerto',
  kicker: 'Empleo · Aeropuertos',
  title: 'Trabajar en AENA o en el aeropuerto: la diferencia que casi nadie explica',
  seoTitle: 'AENA empleo: cómo se trabaja realmente en un aeropuerto',
  metaDesc: 'AENA, ENAIRE, handling y aerolíneas: quién contrata realmente en un aeropuerto, cómo son las convocatorias y qué vías tienen salida más rápida.',
  focusKw: 'aena empleo',
  kws: ['enaire empleo', 'trabajar en el aeropuerto', 'como trabajar en el aeropuerto', 'se necesita personal para trabajar en el aeropuerto', 'empleo aeropuerto'],
  lead: '<strong>Miles de personas buscan cada mes "AENA empleo" pensando que AENA contrata a todo el que trabaja en un aeropuerto. No es así: la mayoría de los puestos que ves en una terminal no son de AENA.</strong> Entender quién contrata a quién es la diferencia entre esperar años una convocatoria y estar trabajando en unas semanas.',
  key: [
    '<strong>AENA</strong> gestiona los aeropuertos: sus plazas salen por convocatoria pública y son limitadas.',
    '<strong>ENAIRE</strong> gestiona la navegación aérea (controladores): proceso propio y muy exigente.',
    'La mayoría del empleo real lo generan <strong>empresas de handling, aerolíneas y comercios</strong> del aeropuerto.',
    'Si tu objetivo es <strong>empezar pronto</strong>, la vía del handling y las aerolíneas es incomparablemente más rápida.',
  ],
  stats: [
    { b: 'AENA', s: 'Gestor aeroportuario · convocatoria pública' },
    { b: 'ENAIRE', s: 'Navegación aérea · controladores' },
    { b: 'Handling', s: 'Donde está el grueso de las vacantes' },
  ],
  sections: [
    { id: 'quien', h2: 'Quién es quién en un aeropuerto', blocks: [
      ['table',
        ['Organización', 'De qué se encarga', 'Cómo se entra'],
        [
          ['AENA', 'Gestión del aeropuerto: infraestructura, terminal, seguridad, comercial', 'Convocatorias públicas con proceso selectivo y bolsas de empleo'],
          ['ENAIRE', 'Navegación aérea y control del tráfico', 'Convocatoria específica de controlador, muy competida'],
          ['Empresas de handling', 'Facturación, embarque, equipajes, rampa, servicios al avión', 'Selección privada continua, con picos de temporada'],
          ['Aerolíneas', 'Tripulación de cabina, operaciones, despacho de vuelo', 'Convocatorias propias abiertas durante el año'],
          ['Concesionarios', 'Tiendas, restauración, alquiler de coches, párking', 'Selección privada de cada empresa'],
        ]
      ],
      ['note', 'La clave', 'Cuando alguien dice "trabajo en el aeropuerto", lo más probable es que su empleador sea una <strong>empresa de handling o una aerolínea</strong>, no AENA.'],
    ]},
    { id: 'aena', h2: 'Cómo funciona el empleo público en AENA', blocks: [
      ['p', 'AENA publica sus procesos en su propio portal de empleo. Características que conviene conocer antes de enfocar tu plan hacia ahí:'],
      ['ul', [
        'Convocatorias <strong>puntuales</strong>, no continuas.',
        'Procesos <strong>largos</strong>, con pruebas y baremos.',
        'Ratio de candidatos por plaza <strong>muy alto</strong>.',
        'Perfiles muy variados: técnicos, administrativos, operativos y de seguridad.',
      ]],
      ['warn', 'Cuidado con esto', 'Circulan academias que venden "temarios AENA" como si hubiera oposición permanente. Revisa siempre las convocatorias reales en el portal oficial de empleo de AENA antes de pagar nada.'],
    ]},
    { id: 'rapido', h2: 'La vía rápida: handling y aerolíneas', blocks: [
      ['p', 'Si lo que quieres es <strong>trabajar en el aeropuerto pronto</strong>, esta es la vía. Las empresas de handling contratan de forma continua porque la rotación es alta y la operación no para.'],
      ['ul', [
        '<strong>Agente de pasaje</strong>: facturación, embarque y atención al pasajero.',
        '<strong>Agente de rampa</strong>: equipajes, carga y operativa en plataforma.',
        '<strong>Coordinación y operaciones</strong>: siguiente escalón tras la experiencia.',
        '<strong>TCP</strong>: a bordo, con el certificado oficial de tripulante de cabina.',
        '<strong>Despachador de vuelo</strong>: planificación de vuelos en el centro de operaciones.',
      ]],
    ]},
    { id: 'plan', h2: 'Qué hacer si quieres entrar este año', blocks: [
      ['steps', [
        { t: 'Decide el tipo de puesto', d: 'Trato con pasaje, plataforma, cabina u operaciones. Cada uno tiene su formación y su ritmo de contratación.' },
        { t: 'Fórmate en esa especialidad', d: 'Es lo que te diferencia en una selección donde la mayoría llega sin preparación específica.' },
        { t: 'Inscríbete en los operadores de handling de tu aeropuerto', d: 'Y en los portales de empleo de las aerolíneas que operan en él.' },
        { t: 'Sin renunciar a lo público', d: 'Si te interesa AENA, vigila sus convocatorias en paralelo. Pero no bloquees tu carrera esperando a que salgan.' },
      ]],
    ]},
  ],
  cta: { h: 'Entra al aeropuerto por la puerta que sí está abierta', p: 'Fórmate en operaciones aeroportuarias y handling y preséntate a las contrataciones continuas del sector.', href: C.at, btn: 'Ver el curso', btn2: 'Hablar con un asesor', href2: C.info },
  recap: 'AENA gestiona los aeropuertos y contrata por convocatoria pública; ENAIRE gestiona la navegación aérea. La mayor parte del empleo de un aeropuerto lo generan las empresas de handling, las aerolíneas y los concesionarios, con selección privada y contratación continua. Para empezar pronto, la vía de handling y aerolíneas es mucho más rápida que esperar a una convocatoria pública.',
  faq: [
    { q: '¿AENA contrata a todo el personal del aeropuerto?', a: 'No. AENA gestiona la infraestructura aeroportuaria, pero la mayoría de personas que trabajan en una terminal están contratadas por empresas de handling, aerolíneas o concesionarios comerciales.' },
    { q: '¿Cómo se entra a trabajar en AENA?', a: 'A través de sus convocatorias públicas, publicadas en su portal de empleo. Son procesos puntuales, largos y con mucha competencia por plaza.' },
    { q: '¿Cuál es la forma más rápida de trabajar en un aeropuerto?', a: 'Las empresas de handling, que contratan de forma continua para facturación, embarque, equipajes y rampa, especialmente en los picos de temporada. Una formación específica en operaciones aeroportuarias te posiciona mejor.' },
    { q: '¿ENAIRE y AENA son lo mismo?', a: 'No. AENA gestiona los aeropuertos y ENAIRE gestiona la navegación aérea y el control del tráfico. Son organizaciones distintas con procesos de selección diferentes.' },
  ],
  related: [
    { href: '/blog/azafata-de-tierra-que-es-requisitos-sueldo/', t: 'Azafata de tierra: requisitos y sueldo' },
    { href: '/blog/trabajos-en-el-aeropuerto-lista-puestos/', t: 'Todos los trabajos de un aeropuerto' },
  ],
},

{
  slug: 'trabajar-aeropuerto-barcelona-el-prat',
  cat: 'Empleo en el aeropuerto',
  kicker: 'Barcelona · El Prat',
  title: 'Trabajar en el aeropuerto de Barcelona-El Prat: puestos, empresas y cómo entrar',
  seoTitle: 'Trabajar en el aeropuerto de Barcelona-El Prat: guía real',
  metaDesc: 'Cómo entrar a trabajar en el aeropuerto de Barcelona-El Prat: qué empresas contratan, qué puestos hay, cuándo salen las campañas y qué formación te da ventaja.',
  focusKw: 'trabajar en el aeropuerto del prat',
  kws: ['empleo aeropuerto barcelona', 'trabajar aeropuerto el prat', 'handling barcelona empleo', 'azafata de tierra barcelona'],
  lead: '<strong>El Prat es uno de los aeropuertos con más movimiento de Europa y una de las mayores bolsas de empleo de Cataluña.</strong> Pero para entrar hay que saber a quién dirigirse: la mayoría de vacantes no las publica el aeropuerto, sino las empresas que operan dentro de él. Esta es la guía práctica.',
  key: [
    'En El Prat contratan sobre todo <strong>empresas de handling, aerolíneas y concesionarios</strong>.',
    'Los <strong>picos de contratación</strong> son antes de verano y antes de Navidad.',
    'Los puestos más accesibles: <strong>agente de pasaje y agente de rampa</strong>.',
    'Vivir en el área de Barcelona y <strong>poder cubrir turnos de madrugada</strong> es una ventaja real en la selección.',
  ],
  stats: [
    { b: 'Hub europeo', s: 'Gran volumen de tráfico y de plantilla' },
    { b: 'Temporada', s: 'Campañas fuertes antes de verano y Navidad' },
    { b: 'Turnos', s: 'Operativa prácticamente 24 horas' },
  ],
  sections: [
    { id: 'quien', h2: 'Quién contrata realmente en El Prat', blocks: [
      ['ul', [
        '<strong>Empresas de handling</strong>: son las que dan servicio a las aerolíneas en tierra. Generan el mayor número de vacantes: facturación, embarque, equipajes y rampa.',
        '<strong>Aerolíneas con base o presencia</strong> en el aeropuerto: tripulación de cabina, operaciones, atención al cliente.',
        '<strong>AENA</strong>: gestor del aeropuerto, con convocatorias públicas puntuales.',
        '<strong>Concesionarios</strong>: tiendas, restauración, alquiler de vehículos, párking.',
        '<strong>Seguridad y servicios auxiliares</strong>: empresas subcontratadas con sus propios procesos.',
      ]],
      ['note', 'Consejo', 'Inscríbete directamente en los portales de empleo de los operadores de handling que trabajan en El Prat, no solo en portales generalistas. Muchas campañas se cubren desde sus propias bases de datos.'],
    ]},
    { id: 'puestos', h2: 'Los puestos con más entrada', blocks: [
      ['table',
        ['Puesto', 'Perfil que buscan', 'Ritmo de contratación'],
        [
          ['Agente de pasaje', 'Idiomas, atención al cliente, turnos', 'Continuo, con picos de temporada'],
          ['Agente de rampa', 'Físico, carné de conducir, turnos', 'Continuo, muy alta rotación'],
          ['Atención y servicios especiales', 'Idiomas, empatía, resolución', 'Estacional'],
          ['TCP (aerolíneas con base)', 'Certificado TCP, inglés, disponibilidad', 'Por convocatoria'],
          ['Operaciones / coordinación', 'Experiencia previa en handling', 'Promoción interna sobre todo'],
        ]
      ],
    ]},
    { id: 'cuando', h2: 'Cuándo presentarse (esto importa mucho)', blocks: [
      ['p', 'El empleo aeroportuario es <strong>estacional</strong>. Las campañas de contratación grandes se lanzan con antelación al pico de tráfico:'],
      ['ul', [
        '<strong>Marzo–mayo</strong>: campaña de verano, la más fuerte del año.',
        '<strong>Octubre–noviembre</strong>: refuerzo de Navidad y Semana Santa siguiente.',
        '<strong>Todo el año</strong>: cobertura de rotación, que en rampa y pasaje es constante.',
      ]],
      ['q', 'Si te inscribes en junio para trabajar en verano, llegas tarde. Las campañas se cierran meses antes del pico.'],
    ]},
    { id: 'ventaja', h2: 'Qué te da ventaja frente a otros candidatos', blocks: [
      ['steps', [
        { t: 'Formación específica en handling y operaciones', d: 'La mayoría de candidaturas llegan sin ninguna preparación del sector. Es el diferencial más barato y más visible.' },
        { t: 'Idiomas demostrables', d: 'En un aeropuerto con tanto tráfico internacional, el inglés es obligatorio y un tercer idioma te sube posiciones.' },
        { t: 'Disponibilidad real de turnos', d: 'Poder entrar a las 4:30 y trabajar festivos es un criterio de selección, no un detalle.' },
        { t: 'Movilidad hasta el aeropuerto', d: 'Los turnos de madrugada empiezan antes del transporte público. Tener forma de llegar cuenta.' },
        { t: 'CV orientado a atención al cliente', d: 'Hostelería, retail y turismo son la experiencia que mejor se valora para pasaje.' },
      ]],
    ]},
  ],
  cta: { h: 'Prepárate para la próxima campaña de El Prat', p: 'Formación en azafata de tierra y operaciones aeroportuarias, en Barcelona, para entrar al aeropuerto con ventaja.', href: C.at, btn: 'Ver el curso', btn2: 'Pedir información', href2: C.info },
  recap: 'En el aeropuerto de Barcelona-El Prat contratan sobre todo las empresas de handling, las aerolíneas y los concesionarios, no solo AENA. Los puestos con más entrada son agente de pasaje y agente de rampa, con campañas fuertes antes de verano y Navidad. La formación específica, los idiomas y la disponibilidad real de turnos son lo que diferencia una candidatura.',
  faq: [
    { q: '¿Cómo puedo trabajar en el aeropuerto de El Prat?', a: 'Inscribiéndote en los procesos de las empresas de handling y de las aerolíneas que operan en el aeropuerto, además de en las convocatorias de AENA si te interesa la vía pública. Los puestos con más entrada son agente de pasaje y agente de rampa.' },
    { q: '¿Cuándo salen las ofertas de empleo del aeropuerto de Barcelona?', a: 'Las campañas grandes se lanzan antes de los picos de tráfico: de marzo a mayo para verano y en otoño para Navidad. Además hay cobertura de rotación durante todo el año.' },
    { q: '¿Piden experiencia para trabajar en El Prat?', a: 'Muchas vacantes son de entrada y no exigen experiencia previa en aviación. Se valora la experiencia de atención al público, los idiomas y una formación específica en operaciones aeroportuarias.' },
    { q: '¿Qué idiomas piden en el aeropuerto de Barcelona?', a: 'Inglés como mínimo, dado el volumen de tráfico internacional. El catalán y el castellano son habituales en el trato con pasaje local, y un cuarto idioma es un diferencial claro.' },
  ],
  related: [
    { href: '/blog/azafata-de-tierra-que-es-requisitos-sueldo/', t: 'Azafata de tierra: requisitos y sueldo' },
    { href: '/blog/trabajar-en-aena-empleo-aeropuerto-guia/', t: 'AENA, handling y aerolíneas: quién contrata' },
  ],
},

{
  slug: 'trabajos-en-el-aeropuerto-lista-puestos',
  cat: 'Empleo en el aeropuerto',
  kicker: 'Guía completa',
  title: 'Todos los trabajos que hay en un aeropuerto (y cuál encaja contigo)',
  seoTitle: 'Trabajos en un aeropuerto: la lista completa de puestos',
  metaDesc: 'La lista completa de trabajos que hay en un aeropuerto: cabina, pasaje, rampa, operaciones, seguridad y comercial. Requisitos, turnos y cuál encaja con tu perfil.',
  focusKw: 'trabajos en el aeropuerto',
  kws: ['que estudiar para trabajar en el aeropuerto', 'puestos de trabajo aeropuerto', 'como trabajar en el aeropuerto', 'empleos aeropuerto'],
  lead: '<strong>En un aeropuerto grande trabajan miles de personas y solo una parte pequeña vuela.</strong> Si quieres entrar al sector aéreo pero no sabes por dónde, esta es la lista completa de puestos, agrupada por área, con lo que se pide en cada uno y con qué perfil encaja mejor.',
  key: [
    'Cuatro grandes áreas: <strong>a bordo, pasaje, plataforma y operaciones</strong>, más seguridad y comercial.',
    'La mayoría de puestos de entrada <strong>no exigen carrera universitaria</strong>.',
    'Casi todos implican <strong>turnos rotativos</strong>: es la constante del sector.',
    'La formación específica es lo que te diferencia frente a candidaturas genéricas.',
  ],
  stats: [
    { b: '4 áreas', s: 'Cabina, pasaje, plataforma y operaciones' },
    { b: 'Sin carrera', s: 'La mayoría de puestos de entrada' },
    { b: 'Turnos', s: 'La operativa no para nunca' },
  ],
  sections: [
    { id: 'bordo', h2: 'Área 1: a bordo del avión', blocks: [
      ['table',
        ['Puesto', 'Qué hace', 'Acceso'],
        [
          ['TCP / auxiliar de vuelo', 'Seguridad y servicio a bordo', 'Certificado oficial de TCP + selección de aerolínea'],
          ['Sobrecargo / jefe de cabina', 'Lidera la tripulación de cabina', 'Promoción interna desde TCP'],
          ['Piloto', 'Conducción de la aeronave', 'Licencia de piloto comercial (formación larga y costosa)'],
        ]
      ],
      ['p', 'Es el área más conocida y la más competida, pero también la que mejor combina sueldo, proyección y acceso relativamente rápido en el caso del TCP.'],
    ]},
    { id: 'pasaje', h2: 'Área 2: atención al pasajero (terminal)', blocks: [
      ['ul', [
        '<strong>Agente de pasaje / azafata de tierra</strong>: facturación, embarque, incidencias.',
        '<strong>Servicios especiales</strong>: movilidad reducida, menores no acompañados, conexiones.',
        '<strong>Atención al cliente de aerolínea</strong>: mostradores de venta, cambios y reclamaciones.',
        '<strong>Información aeroportuaria</strong>: orientación al pasajero en la terminal.',
      ]],
      ['p', 'Perfil: idiomas, trato con público, aguante y capacidad de resolver bajo presión. Es el área con más vacantes accesibles sin experiencia previa.'],
    ]},
    { id: 'plataforma', h2: 'Área 3: plataforma y carga', blocks: [
      ['ul', [
        '<strong>Agente de rampa</strong>: equipajes, carga, señalización, push-back.',
        '<strong>Coordinador de rampa</strong>: supervisión de la operativa del avión en tierra.',
        '<strong>Carga y mercancías</strong>: gestión de carga aérea y mercancías peligrosas.',
        '<strong>Mantenimiento y servicios a la aeronave</strong>: apoyo técnico y abastecimiento.',
      ]],
      ['p', 'Perfil: trabajo físico, al aire libre, con protocolos de seguridad estrictos. Carné de conducir en la mayoría de vacantes.'],
    ]},
    { id: 'operaciones', h2: 'Área 4: operaciones y control', blocks: [
      ['table',
        ['Puesto', 'Qué hace', 'Dónde'],
        [
          ['Despachador de vuelo', 'Planifica ruta, combustible y meteorología junto al comandante', 'Centro de operaciones de la aerolínea'],
          ['Coordinador de operaciones', 'Gestiona la puntualidad y las incidencias de la operativa diaria', 'Aeropuerto / aerolínea'],
          ['Controlador aéreo', 'Gestiona el tráfico aéreo', 'Torre o centro de control (ENAIRE)'],
          ['Planificación y slots', 'Programación de vuelos y franjas horarias', 'Oficinas de aerolínea o gestor'],
        ]
      ],
      ['note', 'La menos conocida', 'El despacho de vuelo es, con diferencia, el área con mejor relación entre demanda de profesionales y número de personas formadas.'],
    ]},
    { id: 'otros', h2: 'Y además: seguridad, comercial y servicios', blocks: [
      ['ul', [
        '<strong>Seguridad aeroportuaria</strong>: control de accesos y filtros de pasajeros (empresas de seguridad privada, con habilitación específica).',
        '<strong>Comercial</strong>: tiendas, duty free, restauración, alquiler de coches.',
        '<strong>Servicios</strong>: limpieza, mantenimiento de terminal, párking, transporte.',
        '<strong>Administración</strong>: perfiles técnicos y de gestión en AENA, aerolíneas y handlings.',
      ]],
    ]},
    { id: 'elegir', h2: 'Cómo elegir el tuyo', blocks: [
      ['steps', [
        { t: '¿Quieres volar o no?', d: 'Si quieres volar, tu camino es el certificado de TCP. Si no, todo lo demás está en tierra.' },
        { t: '¿Público o técnico?', d: 'Trato con pasaje (pasaje, atención) o perfil técnico y de datos (operaciones, despacho).' },
        { t: '¿Oficina o intemperie?', d: 'Operaciones y despacho son de oficina; rampa es plataforma y aire libre.' },
        { t: '¿Cuánto puedes esperar?', d: 'Handling contrata todo el año; AENA y controladores van por convocatoria puntual.' },
        { t: 'Fórmate en esa vía concreta', d: 'La formación específica es lo que convierte una candidatura genérica en una candidatura que pasa el filtro.' },
      ]],
    ]},
  ],
  cta: { h: '¿No sabes cuál encaja contigo?', p: 'Cuéntanos tu perfil y tu disponibilidad y te orientamos entre cabina, tierra y operaciones.', href: C.info, btn: 'Hablar con un asesor', btn2: 'Ver todos los cursos', href2: C.at },
  recap: 'Un aeropuerto agrupa cuatro grandes áreas de empleo: a bordo (TCP, sobrecargo, piloto), atención al pasajero en terminal, plataforma y carga, y operaciones y control (despachador, coordinador, controlador), además de seguridad, comercial y servicios. La mayoría de puestos de entrada no requieren carrera, casi todos implican turnos y la formación específica es el principal diferencial en la selección.',
  faq: [
    { q: '¿Qué hay que estudiar para trabajar en un aeropuerto?', a: 'Depende del puesto. Para TCP, el certificado oficial de tripulante de cabina. Para pasaje y rampa, formación en operaciones aeroportuarias y handling. Para el centro de operaciones, formación de despachador de vuelo. Ninguna de esas vías exige carrera universitaria.' },
    { q: '¿Qué trabajo del aeropuerto es más fácil de conseguir?', a: 'Los puestos de handling (agente de pasaje y agente de rampa) son los que más contratan, por alta rotación y por los picos de temporada. Son la entrada más rápida al sector.' },
    { q: '¿Se puede trabajar en un aeropuerto sin idiomas?', a: 'En puestos sin trato directo con el pasajero (rampa, carga, servicios) el idioma pesa menos, pero el inglés sigue siendo muy recomendable. En atención al pasajero es imprescindible.' },
  ],
  related: [
    { href: '/blog/trabajar-en-aena-empleo-aeropuerto-guia/', t: 'AENA, handling y aerolíneas: quién contrata' },
    { href: '/blog/como-entrar-a-trabajar-en-una-aerolinea/', t: 'Cómo entrar a trabajar en una aerolínea' },
  ],
},

/* ───────────────────────────── P7 · Decisión ───────────────────────────── */
{
  slug: 'cursos-para-trabajar-en-el-aeropuerto-cuales-sirven',
  cat: 'Formación aeronáutica',
  kicker: 'Antes de matricularte',
  title: 'Cursos para trabajar en el aeropuerto: cuáles sirven de verdad (y cuáles no)',
  seoTitle: 'Cursos para trabajar en el aeropuerto: cuáles sirven',
  metaDesc: 'Qué cursos sirven realmente para trabajar en el aeropuerto y cuáles no aportan nada. Diferencias entre certificado oficial, curso homologado y titulación propia.',
  focusKw: 'cursos para trabajar en el aeropuerto',
  kws: ['cursos gratuitos para trabajar en el aeropuerto', 'curso para trabajar en el aeropuerto', 'que curso hacer para trabajar en un aeropuerto', 'formacion aeroportuaria'],
  lead: '<strong>No todos los cursos del sector aéreo valen lo mismo, y la diferencia no está en el precio: está en si terminan en una certificación que las empresas reconocen.</strong> Esta guía te ayuda a distinguir qué formación te abre puertas de verdad y a no gastar dinero en un diploma que nadie mira.',
  key: [
    'Para volar solo sirve el <strong>certificado oficial de TCP</strong> reconocido por AESA. No hay atajos.',
    'Para tierra no hay certificado obligatorio, pero la formación en <strong>handling y operaciones</strong> es lo que te diferencia.',
    '"Homologado" y "titulación propia" <strong>no significan oficial</strong>. Pregunta siempre qué se emite exactamente.',
    'Los cursos "gratuitos" que se anuncian suelen ser <strong>captación</strong>, no formación certificante.',
  ],
  stats: [
    { b: 'Volar', s: 'Certificado oficial de TCP · obligatorio' },
    { b: 'Tierra', s: 'Formación en handling · diferencial' },
    { b: 'Operaciones', s: 'Formación de despacho de vuelo' },
  ],
  sections: [
    { id: 'tipos', h2: 'Los tres tipos de formación que vas a encontrar', blocks: [
      ['table',
        ['Tipo', 'Qué es', '¿Sirve?'],
        [
          ['Certificación oficial', 'Certificado exigido por normativa (caso del TCP, reconocido por AESA)', 'Imprescindible: sin él no puedes ejercer'],
          ['Formación profesional del sector', 'Cursos de handling, operaciones aeroportuarias, despacho de vuelo', 'Muy útil: es lo que te diferencia en la selección'],
          ['Titulación propia / "homologada"', 'Diploma emitido por el propio centro', 'Solo vale lo que valga el centro: no habilita por sí mismo'],
        ]
      ],
      ['warn', 'La pregunta que lo aclara todo', '"¿Qué documento exacto recibo al terminar y quién lo reconoce?" Pídelo por escrito antes de pagar. Un centro serio te lo responde sin rodeos.'],
    ]},
    { id: 'volar', h2: 'Si quieres volar: solo hay un camino', blocks: [
      ['p', 'Para trabajar como tripulante de cabina de pasajeros necesitas el <strong>certificado de TCP conforme a la normativa europea, reconocido por AESA</strong>. Ningún otro curso te habilita. La formación debe incluir:'],
      ['ul', [
        'Teoría: normativa, aeronaves, factores humanos, mercancías peligrosas, seguridad y CRM.',
        'Primeros auxilios y equipamiento médico de cabina.',
        'Prácticas reales de evacuación, humo y fuego.',
        'Supervivencia en el agua (por eso se exige saber nadar).',
        'Prácticas en simulador o mock-up de cabina.',
      ]],
    ]},
    { id: 'tierra', h2: 'Si quieres trabajar en tierra: no hay certificado obligatorio, pero...', blocks: [
      ['p', 'Para agente de pasaje o agente de rampa <strong>no existe un certificado obligatorio por normativa</strong> como el del TCP. Eso lleva a mucha gente a pensar que la formación no importa. Es un error: cuando una empresa de handling recibe 400 candidaturas para 30 plazas, la formación específica es uno de los primeros filtros.'],
      ['p', 'Una formación útil en tierra cubre:'],
      ['ul', [
        'Operativa del aeropuerto y ciclo completo del vuelo.',
        'Sistemas de facturación y gestión de pasaje.',
        'Normativa de equipajes y mercancías peligrosas.',
        'Seguridad en plataforma y protocolos operativos.',
        'Atención al pasajero e incidencias (retrasos, cancelaciones, PMR).',
      ]],
    ]},
    { id: 'gratis', h2: '¿Y los cursos gratuitos?', blocks: [
      ['p', 'Es una búsqueda muy frecuente y conviene ser claro: <strong>los cursos gratuitos que se anuncian rara vez son formación certificante</strong>. Suelen ser:'],
      ['ol', [
        'Sesiones informativas o clases de muestra para captar matrículas.',
        'Cursos genéricos de atención al cliente sin contenido aeronáutico real.',
        'Programas puntuales de formación para el empleo, que existen pero son irregulares y no cubren el certificado de TCP.',
      ]],
      ['q', 'Si un curso es gratis y promete empleo garantizado en una aerolínea, la promesa es imposible: quien contrata es la aerolínea, y nadie puede garantizar su decisión.'],
    ]},
    { id: 'elegir', h2: 'Checklist antes de matricularte en cualquier curso', blocks: [
      ['steps', [
        { t: '¿Qué documento emite y quién lo reconoce?', d: 'Por escrito. Si es TCP, debe ser el certificado oficial reconocido por AESA.' },
        { t: '¿Cuántas horas son prácticas reales?', d: 'En el sector aéreo la práctica (evacuación, fuego, agua, simulador) es lo que da confianza y lo que se nota en la selección.' },
        { t: '¿Quién imparte las clases?', d: 'Profesionales en activo del sector, no formadores genéricos.' },
        { t: '¿Preparan el proceso de selección?', d: 'CV, entrevista en inglés y dinámica de grupo. Es donde se cae la mayoría de candidatos.' },
        { t: '¿Qué pasa después del curso?', d: 'Orientación, contacto con empresas y acompañamiento en las candidaturas.' },
      ]],
    ]},
  ],
  cta: { h: 'Habla con nosotros antes de decidir', p: 'Te decimos qué formación necesitas según el puesto al que quieres llegar, sin humo.', href: C.info, btn: 'Pedir información', btn2: 'Ver los cursos', href2: C.tcp },
  recap: 'Hay tres tipos de formación en el sector: certificación oficial (obligatoria para volar, el certificado de TCP reconocido por AESA), formación profesional del sector (handling, operaciones, despacho: no obligatoria pero decisiva en la selección) y titulaciones propias (que solo valen lo que valga el centro). Antes de pagar, pide por escrito qué documento se emite y quién lo reconoce.',
  faq: [
    { q: '¿Qué curso hay que hacer para trabajar en el aeropuerto?', a: 'Depende del puesto: certificado oficial de TCP para volar, formación en operaciones aeroportuarias y handling para pasaje y rampa, y formación de despachador de vuelo para el centro de operaciones.' },
    { q: '¿Hay cursos gratuitos para trabajar en el aeropuerto?', a: 'Los que se anuncian como gratuitos suelen ser sesiones de captación o cursos genéricos sin certificación. Puntualmente existen programas de formación para el empleo, pero no son una vía estable ni cubren el certificado oficial de TCP.' },
    { q: '¿Qué significa que un curso está homologado?', a: 'No es un término regulado de forma uniforme. Lo relevante es qué documento se emite al terminar y quién lo reconoce. Para volar, debe ser el certificado de tripulante de cabina conforme a normativa europea reconocido por AESA.' },
  ],
  related: [
    { href: '/blog/curso-tcp-gratis-existe-realidad/', t: 'Curso de TCP gratis: qué hay de verdad' },
    { href: '/blog/que-es-certificado-tcp/', t: 'Qué es el certificado TCP' },
  ],
},

{
  slug: 'tcp-o-azafata-de-tierra-cual-elegir',
  cat: 'Orientación',
  kicker: 'Decisión · Comparativa',
  title: 'TCP o azafata de tierra: cuál elegir según tu vida, tu sueldo y tus objetivos',
  seoTitle: 'TCP o azafata de tierra: cuál te conviene (comparativa)',
  metaDesc: 'Comparativa honesta entre TCP y azafata de tierra: requisitos, sueldo, turnos, estilo de vida y proyección. Cuál encaja mejor con tu situación.',
  focusKw: 'tcp o azafata de tierra',
  kws: ['diferencia tcp azafata de tierra', 'que es mejor azafata de vuelo o de tierra', 'elegir entre volar o tierra', 'trabajar en aviacion sin volar'],
  lead: '<strong>Es la duda más repetida de quien quiere entrar al sector aéreo: ¿volar o quedarse en tierra?</strong> No hay una respuesta mejor en abstracto: hay una que encaja con tu vida. Esta comparativa pone las dos opciones una al lado de la otra, sin vender ninguna.',
  key: [
    '<strong>TCP</strong>: mejor sueldo y proyección, a cambio de vida fuera de casa y certificado obligatorio.',
    '<strong>Tierra</strong>: acceso más rápido y vida más estable, con sueldo de entrada más contenido.',
    'Las dos vías <strong>se conectan</strong>: es habitual empezar en tierra y pasar a cabina, o al revés.',
    'La pregunta correcta no es cuál es mejor, sino <strong>cuánto puedes estar fuera de casa</strong>.',
  ],
  stats: [
    { b: 'TCP', s: 'Volar, viajar, mejor retribución' },
    { b: 'Tierra', s: 'Entrada rápida y base fija' },
    { b: 'Compatibles', s: 'Se puede cambiar de una a otra' },
  ],
  sections: [
    { id: 'tabla', h2: 'La comparativa completa', blocks: [
      ['table',
        ['', 'TCP / auxiliar de vuelo', 'Azafata de tierra / agente de pasaje'],
        [
          ['Dónde trabajas', 'A bordo del avión', 'En la terminal del aeropuerto'],
          ['Certificación obligatoria', 'Sí: certificado oficial de TCP (AESA)', 'No hay certificado obligatorio; la formación es diferencial'],
          ['Velocidad de acceso', 'Curso + convocatoria de aerolínea', 'Más rápida: contratación continua en handling'],
          ['Sueldo', 'Base + dietas + prima de vuelo + pluses', 'Base de convenio + nocturnidad y festivos'],
          ['Estilo de vida', 'Noches fuera, base asignada, turnos irregulares', 'Duermes en casa, turnos rotativos con base fija'],
          ['Idiomas', 'Inglés imprescindible', 'Inglés imprescindible, tercer idioma muy valorado'],
          ['Exigencia física', 'Media-alta, con cambios horarios', 'De pie muchas horas'],
          ['Proyección', 'Sobrecargo, instructor, operaciones', 'Coordinación, supervisión, operaciones'],
        ]
      ],
    ]},
    { id: 'vida', h2: 'La variable que decide de verdad: tu vida', blocks: [
      ['p', 'Sobre el papel se comparan sueldos, pero en la práctica lo que hace que alguien dure o no en un puesto es <strong>el encaje con su vida personal</strong>.'],
      ['pros',
        { t: 'Te encaja TCP si...', items: ['Puedes dormir fuera de casa varias noches al mes', 'Te motiva viajar y cambiar de destino', 'Aceptas turnos irregulares y madrugones', 'Quieres el mejor sueldo posible dentro del sector de entrada', 'Estás dispuesto a cambiar de base si hace falta'] },
        { t: 'Te encaja tierra si...', items: ['Necesitas volver a casa cada día', 'Tienes cargas familiares o estudios en paralelo', 'Quieres entrar al sector cuanto antes', 'Prefieres una base fija y estable', 'Te mueves muy bien con el público'] }
      ],
    ]},
    { id: 'dinero', h2: 'El dinero, sin marketing', blocks: [
      ['p', 'Un TCP suele tener un <strong>potencial de ingresos mayor</strong>, pero buena parte llega vía dietas y primas de vuelo: depende de cuánto vueles y de si operas corto o largo radio. Un agente de pasaje tiene un ingreso <strong>más predecible</strong>, con complementos de nocturnidad y festivos, y a menudo empieza con jornada parcial que se amplía.'],
      ['note', 'Cómo compararlo bien', 'No compares el salario base contra el salario base. Compara <strong>ingreso neto anual real</strong> incluyendo variables, y réstale el coste de vida asociado a cada opción (desplazamientos, noches fuera, base asignada).'],
    ]},
    { id: 'puente', h2: 'No es una decisión para siempre', blocks: [
      ['p', 'Es importante quitarle dramatismo a la elección: <strong>las dos vías están conectadas</strong>. Muchos TCP pasan a tierra cuando quieren estabilidad horaria, y mucha gente de handling da el salto a cabina cuando obtiene el certificado. La experiencia en el sector siempre suma.'],
      ['steps', [
        { t: 'Empezar en tierra y saltar a cabina', d: 'Entras rápido, conoces el sector desde dentro y obtienes el certificado de TCP mientras trabajas.' },
        { t: 'Empezar volando y pasar a tierra', d: 'Acumulas experiencia operativa muy valorada en operaciones, formación y coordinación.' },
        { t: 'Combinar', d: 'Hay perfiles que compaginan vuelo con instrucción o con funciones de tierra dentro de la misma compañía.' },
      ]],
    ]},
  ],
  cta: { h: '¿Todavía dudas entre volar o tierra?', p: 'Cuéntanos tu situación (horarios, cargas, objetivos) y te decimos con honestidad cuál encaja mejor.', href: C.info, btn: 'Hablar con un asesor', btn2: 'Ver los dos cursos', href2: C.tcp },
  recap: 'TCP ofrece mejor potencial de ingresos y proyección, a cambio de noches fuera de casa, turnos irregulares y el certificado oficial obligatorio. Trabajar en tierra da acceso más rápido y una vida más estable con base fija, con un sueldo de entrada más contenido. La variable decisiva es cuánto puedes estar fuera de casa, y la decisión no es definitiva: las dos vías están conectadas.',
  faq: [
    { q: '¿Qué es mejor, azafata de vuelo o azafata de tierra?', a: 'Depende de tu vida. TCP tiene mejor potencial de ingresos y proyección pero implica noches fuera de casa y turnos irregulares. Tierra da acceso más rápido y base fija, con un sueldo de entrada más contenido.' },
    { q: '¿Se puede pasar de azafata de tierra a azafata de vuelo?', a: 'Sí, y es un camino muy habitual. La experiencia en el aeropuerto se valora en las selecciones de cabina; solo necesitas obtener el certificado oficial de TCP.' },
    { q: '¿Cuál de las dos es más fácil de conseguir?', a: 'Los puestos en tierra, por la alta rotación y la contratación continua de las empresas de handling. Las convocatorias de TCP son más puntuales y competidas.' },
    { q: '¿Puedo formarme en las dos cosas?', a: 'Sí. De hecho, tener formación en operaciones aeroportuarias y el certificado de TCP amplía mucho el abanico de vacantes a las que puedes presentarte.' },
  ],
  related: [
    { href: '/blog/azafata-de-tierra-que-es-requisitos-sueldo/', t: 'Azafata de tierra: requisitos y sueldo' },
    { href: '/blog/diferencia-azafata-auxiliar-vuelo/', t: 'Diferencia entre azafata y auxiliar de vuelo' },
  ],
},

/* ───────────────────────────── P3 · Despachador de vuelo ───────────────────────────── */
{
  slug: 'curso-despachador-de-vuelo-que-incluye-salidas',
  cat: 'Formación aeronáutica',
  kicker: 'Formación · Despacho de vuelo',
  title: 'Curso de despachador de vuelo: qué incluye, a quién le encaja y qué salidas tiene',
  seoTitle: 'Curso de despachador de vuelo: contenido y salidas',
  metaDesc: 'Qué incluye un curso de despachador de vuelo, qué perfil encaja, cuánto dura y qué salidas laborales tiene en aerolíneas y centros de operaciones.',
  focusKw: 'curso de despachador de vuelo',
  kws: ['despachador de vuelo curso', 'curso flight dispatcher', 'formacion despachador de vuelo', 'operaciones de vuelo curso'],
  lead: '<strong>Es la formación aeronáutica con mejor relación entre demanda y número de profesionales formados.</strong> Mientras miles de personas compiten por una plaza de TCP, el despacho de vuelo pasa desapercibido: un trabajo técnico, en tierra, con responsabilidad real sobre cada vuelo y muy poca competencia por puesto.',
  key: [
    'Formas parte del <strong>centro de operaciones</strong> de la aerolínea, no de la tripulación.',
    'El curso cubre <strong>meteorología, navegación, performance, plan de vuelo y normativa</strong>.',
    'Perfil ideal: <strong>metódico, analítico y con inglés</strong>. No hace falta ser piloto.',
    'Salidas: aerolíneas, handling, centros de control operativo y aviación ejecutiva.',
  ],
  stats: [
    { b: 'En tierra', s: 'Trabajo técnico de centro de operaciones' },
    { b: 'Poca competencia', s: 'Muy pocos profesionales formados' },
    { b: 'Sin ser piloto', s: 'Es una profesión independiente' },
  ],
  sections: [
    { id: 'quien', h2: 'A quién le encaja este curso', blocks: [
      ['p', 'El despachador de vuelo no es un puesto de atención al cliente: es un puesto de <strong>análisis y decisión</strong>. Encaja especialmente bien con:'],
      ['ul', [
        'Personas con <strong>perfil metódico</strong> a las que se les dan bien los datos y los procedimientos.',
        'Quien quiere trabajar en aviación pero <strong>no quiere volar</strong> ni estar de cara al público.',
        'Quien busca <strong>estabilidad</strong>: no dependes de la temporada de vuelo ni de superar un assessment de imagen.',
        'Perfiles que vienen de logística, operaciones, meteorología o gestión y quieren especializarse en aéreo.',
      ]],
      ['pros',
        { t: 'Te encaja si...', items: ['Te gusta el detalle y la responsabilidad técnica', 'Trabajas bien bajo presión con datos', 'Tienes buen inglés técnico', 'Buscas trabajo de oficina en el sector aéreo'] },
        { t: 'No te encaja si...', items: ['Lo que te atrae es viajar y volar', 'Prefieres el trato constante con público', 'No te gusta trabajar con normativa y procedimientos', 'Buscas resultados sin formación técnica previa'] }
      ],
    ]},
    { id: 'contenido', h2: 'Qué debe incluir el programa', blocks: [
      ['table',
        ['Bloque', 'Contenido'],
        [
          ['Meteorología aeronáutica', 'Interpretación de METAR, TAF, mapas significativos y fenómenos peligrosos'],
          ['Navegación aérea', 'Cartas, espacio aéreo, rutas, procedimientos de salida y llegada'],
          ['Performance de la aeronave', 'Limitaciones, despegue y aterrizaje, alternativas'],
          ['Plan de vuelo y combustible', 'Cálculo de ruta óptima, reservas y política de combustible'],
          ['Peso y balance', 'Carga, centrado y documentación operativa'],
          ['Normativa y NOTAM', 'Regulación aplicable, avisos aeronáuticos y limitaciones operativas'],
          ['Seguimiento del vuelo', 'Monitorización, desvíos, incidencias y coordinación con la tripulación'],
          ['Inglés aeronáutico', 'Terminología y comunicación en entorno internacional'],
        ]
      ],
      ['note', 'Qué preguntar antes de matricularte', 'Si el programa incluye <strong>práctica real de elaboración de planes de vuelo</strong> y casos operativos, no solo teoría. Es lo que se nota en una entrevista técnica.'],
    ]},
    { id: 'licencia', h2: 'Sobre licencias y reconocimiento (lee esto)', blocks: [
      ['p', 'Aquí hay que ser preciso, porque es una fuente habitual de confusión. En Europa <strong>no existe una licencia europea única de despachador de vuelo equivalente a la de piloto</strong>. Lo que existe es:'],
      ['ul', [
        'Un estándar internacional de referencia para la formación de <em>flight operations officer / flight dispatcher</em>.',
        'La obligación del operador aéreo de que su personal de operaciones esté <strong>formado y cualificado</strong> conforme a su manual de operaciones.',
        'Formación específica de cada aerolínea al incorporarte, sobre sus procedimientos y sus sistemas.',
      ]],
      ['q', 'Traducción práctica: el curso te da la base técnica y la empleabilidad; la aerolínea te forma después en su operativa concreta.'],
    ]},
    { id: 'salidas', h2: 'Salidas laborales reales', blocks: [
      ['ul', [
        '<strong>Centro de control de operaciones (OCC)</strong> de una aerolínea: el destino natural.',
        '<strong>Empresas de handling</strong> con servicios de operaciones y despacho para terceros.',
        '<strong>Aviación ejecutiva y chárter</strong>: planificación de vuelos privados.',
        '<strong>Coordinación de operaciones aeroportuarias</strong>: puntualidad, slots e incidencias.',
        '<strong>Proveedores de servicios de planificación de vuelo</strong> y software aeronáutico.',
      ]],
    ]},
  ],
  cta: { h: '¿Te ves en el centro de operaciones?', p: 'Fórmate como despachador de vuelo y entra en una de las áreas con menos competencia del sector aéreo.', href: C.fd, btn: 'Ver el curso de Despachador', btn2: 'Pedir información', href2: C.info },
  recap: 'El curso de despachador de vuelo forma para planificar y hacer seguimiento de vuelos desde el centro de operaciones: meteorología, navegación, performance, plan de vuelo, peso y balance, normativa y seguimiento. Encaja con perfiles metódicos y con buen inglés que quieren trabajar en aviación sin volar. En Europa no hay licencia única: la formación da la base y el operador completa con su propia habilitación interna.',
  faq: [
    { q: '¿Cuánto dura el curso de despachador de vuelo?', a: 'Depende del centro y del formato. Lo relevante es que el programa cubra meteorología, navegación, performance, plan de vuelo, peso y balance, normativa y seguimiento del vuelo, con práctica real de elaboración de planes.' },
    { q: '¿Hay que ser piloto para ser despachador de vuelo?', a: 'No. Es una profesión independiente con su propia formación. Comparte conocimientos técnicos con la aviación, pero no requiere licencia de piloto.' },
    { q: '¿Existe una licencia europea de despachador de vuelo?', a: 'No hay una licencia europea única equivalente a la de piloto. El operador aéreo debe garantizar que su personal de operaciones está formado y cualificado conforme a su manual de operaciones, y completa la formación específica al incorporarte.' },
    { q: '¿Qué salidas tiene el despacho de vuelo?', a: 'Centros de control de operaciones de aerolíneas, empresas de handling con servicios de operaciones, aviación ejecutiva y chárter, coordinación de operaciones aeroportuarias y proveedores de planificación de vuelo.' },
  ],
  related: [
    { href: '/blog/despachador-de-vuelo-que-hace-cuanto-gana/', t: 'Despachador de vuelo: qué hace y cuánto gana' },
    { href: '/blog/despachador-de-vuelo-vs-controlador-aereo/', t: 'Despachador vs. controlador aéreo' },
  ],
},

{
  slug: 'despachador-de-vuelo-vs-controlador-aereo',
  cat: 'Carreras en aviación',
  kicker: 'Comparativa técnica',
  title: 'Despachador de vuelo vs. controlador aéreo: no son lo mismo (y el acceso no se parece en nada)',
  seoTitle: 'Despachador de vuelo vs controlador aéreo: diferencias',
  metaDesc: 'Diferencias entre despachador de vuelo y controlador aéreo: qué hace cada uno, para quién trabajan, formación, acceso y cuál es más realista según tu perfil.',
  focusKw: 'despachador de vuelo vs controlador aereo',
  kws: ['diferencia despachador controlador aereo', 'controlador aereo o despachador', 'que hace un controlador aereo', 'operaciones de vuelo'],
  lead: '<strong>Se confunden constantemente, pero trabajan para empleadores distintos, con responsabilidades distintas y con vías de acceso que no se parecen en nada.</strong> El controlador gestiona el tráfico aéreo de todos; el despachador planifica y sigue los vuelos de su aerolínea. Aquí está la comparación completa.',
  key: [
    'El <strong>controlador aéreo</strong> trabaja para el proveedor de navegación aérea y gestiona el tráfico de todas las aeronaves.',
    'El <strong>despachador</strong> trabaja para la aerolínea y planifica y sigue los vuelos de esa compañía.',
    'El acceso a controlador requiere <strong>licencia ATCO</strong> y un proceso selectivo largo y muy competido.',
    'El acceso a despachador es por <strong>formación específica</strong> y selección privada de aerolínea: mucho más directo.',
  ],
  stats: [
    { b: 'Controlador', s: 'Licencia ATCO · proceso muy competido' },
    { b: 'Despachador', s: 'Formación específica · selección privada' },
    { b: 'Ambos', s: 'En tierra, técnicos y con alta responsabilidad' },
  ],
  sections: [
    { id: 'tabla', h2: 'La diferencia, de un vistazo', blocks: [
      ['table',
        ['', 'Despachador de vuelo', 'Controlador aéreo'],
        [
          ['Empleador', 'Aerolínea u operador aéreo', 'Proveedor de servicios de navegación aérea'],
          ['Ámbito', 'Los vuelos de su compañía', 'Todo el tráfico en su sector o aeropuerto'],
          ['Función principal', 'Planificar el vuelo y hacerle seguimiento', 'Separar y secuenciar aeronaves en tiempo real'],
          ['Momento de actuación', 'Antes del vuelo y durante, desde operaciones', 'En tiempo real, mientras la aeronave vuela'],
          ['Herramienta principal', 'Sistemas de planificación, meteorología, NOTAM', 'Radar y comunicaciones con las aeronaves'],
          ['Titulación', 'Formación específica + habilitación del operador', 'Licencia oficial de controlador (ATCO)'],
          ['Acceso', 'Selección privada de la aerolínea', 'Convocatoria y proceso selectivo largo'],
        ]
      ],
    ]},
    { id: 'despachador', h2: 'Qué hace exactamente el despachador', blocks: [
      ['p', 'Trabaja en el centro de operaciones y es <strong>corresponsable del vuelo junto al comandante</strong>. Antes de la salida prepara el plan de vuelo: ruta óptima, combustible, alternativas, meteorología y NOTAM, peso y balance. Durante el vuelo, hace el seguimiento y apoya en cualquier imprevisto (desvío, cambio de alternativa, retraso en cadena).'],
      ['q', 'Sin el despacho del vuelo, el avión no sale. Es una responsabilidad técnica real, aunque nunca se suba al avión.'],
    ]},
    { id: 'controlador', h2: 'Qué hace exactamente el controlador', blocks: [
      ['p', 'Gestiona el tráfico aéreo en tiempo real desde torre, aproximación o centro de control: mantiene la separación entre aeronaves, autoriza maniobras y secuencia despegues y aterrizajes. Su ámbito es el espacio aéreo, no una compañía concreta.'],
      ['note', 'Diferencia clave', 'El controlador gestiona <strong>a todas las aerolíneas a la vez</strong>. El despachador gestiona <strong>los vuelos de la suya</strong>. Uno mira el espacio aéreo; el otro, la operación de su compañía.'],
    ]},
    { id: 'acceso', h2: 'Cómo se accede a cada uno (aquí está la gran diferencia)', blocks: [
      ['steps', [
        { t: 'Controlador aéreo', d: 'Requiere obtener la licencia oficial de controlador: proceso selectivo con pruebas psicotécnicas y de inglés muy exigentes, formación larga y costosa, y convocatorias puntuales con miles de aspirantes por plaza.' },
        { t: 'Despachador de vuelo', d: 'Requiere formación específica en operaciones de vuelo y superar la selección privada de la aerolínea, que después te habilita en sus procedimientos. El proceso es mucho más directo y hay muchos menos candidatos formados.' },
      ]],
      ['pros',
        { t: 'Despachador: a favor', items: ['Acceso realista y en plazos cortos', 'Muy pocos profesionales formados', 'Demanda estable en aerolíneas y handling', 'Recorrido claro dentro de operaciones'] },
        { t: 'Controlador: a tener en cuenta', items: ['Proceso selectivo largo y muy competido', 'Formación costosa y con alta tasa de abandono', 'Convocatorias puntuales, no continuas', 'Excelentes condiciones, pero para muy pocos'] }
      ],
    ]},
    { id: 'cual', h2: 'Cuál elegir según tu situación', blocks: [
      ['p', 'Si lo que te atrae es el <strong>trabajo técnico en aviación, en tierra y con responsabilidad real</strong>, y quieres entrar al sector en un horizonte de meses y no de años, el despacho de vuelo es la opción realista. Si tu objetivo concreto es el control aéreo y puedes asumir un proceso largo y muy exigente, esa es una carrera aparte que requiere su propio plan.'],
      ['p', 'Una combinación frecuente: <strong>entrar como despachador</strong>, consolidar experiencia en operaciones y decidir después si se quiere dar el salto a otra especialidad del sector.'],
    ]},
  ],
  cta: { h: 'La vía realista para trabajar en operaciones', p: 'Fórmate como despachador de vuelo y entra al centro de operaciones de una aerolínea.', href: C.fd, btn: 'Ver el curso de Despachador', btn2: 'Pedir información', href2: C.info },
  recap: 'El despachador de vuelo trabaja para una aerolínea planificando y siguiendo sus vuelos desde el centro de operaciones; el controlador aéreo trabaja para el proveedor de navegación aérea gestionando el tráfico de todas las aeronaves en tiempo real. El acceso a controlador exige licencia oficial y un proceso selectivo largo y muy competido; el de despachador se basa en formación específica y selección privada, mucho más directo y con menos competencia.',
  faq: [
    { q: '¿Es lo mismo un despachador de vuelo que un controlador aéreo?', a: 'No. El despachador trabaja para una aerolínea y planifica y hace seguimiento de sus vuelos desde el centro de operaciones. El controlador trabaja para el proveedor de navegación aérea y gestiona en tiempo real el tráfico de todas las aeronaves de su sector.' },
    { q: '¿Cuál es más fácil de conseguir?', a: 'El despacho de vuelo, con diferencia. Se accede por formación específica y selección privada de la aerolínea, mientras que el control aéreo exige una licencia oficial y un proceso selectivo largo con miles de candidatos por plaza.' },
    { q: '¿El despachador de vuelo habla con los pilotos?', a: 'Sí, coordina con la tripulación antes y durante el vuelo, especialmente ante cambios de ruta, meteorología adversa o incidencias operativas. La comunicación por radio con las aeronaves en vuelo corresponde al controlador.' },
  ],
  related: [
    { href: '/blog/despachador-de-vuelo-que-hace-cuanto-gana/', t: 'Despachador de vuelo: qué hace y cuánto gana' },
    { href: '/blog/curso-despachador-de-vuelo-que-incluye-salidas/', t: 'Curso de despachador: contenido y salidas' },
  ],
},

];

export default POSTS;

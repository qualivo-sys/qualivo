// EAC · Refrescos de los 5 posts que ya rankean (Qualivo)
// NO son URLs nuevas: sustituyen el contenido de posts existentes, manteniendo su slug.
// Objetivo: subir de posición 6-11 a top 3 en keywords con 335.000 impresiones al trimestre.

const C = { tcp:'/curso-auxiliar-vuelo/', at:'/azafata-de-tierra-y-operaciones/', fd:'/curso-despachador-vuelo/', info:'/contacto/' };

export const REFRESH = [

/* ═══ 1 · 99.000 impresiones · posición 6 ═══ */
{
  slug: 'cuanto-cobran-las-azafatas-de-vuelo',
  cat: 'Carreras en aviación',
  kicker: 'Sueldos · TCP',
  title: 'Cuánto cobra un auxiliar de vuelo (TCP) en España: sueldo real por aerolínea y antigüedad',
  seoTitle: 'Cuánto cobra un TCP en España: sueldo real 2026',
  metaDesc: 'Cuánto gana de verdad un auxiliar de vuelo en España: salario base, dietas, prima de vuelo y pluses. Diferencias por aerolínea, radio y antigüedad.',
  focusKw: 'cuanto cobra un auxiliar de vuelo',
  kws: ['sueldo auxiliar de vuelo','cuanto gana una azafata de vuelo','salario tcp españa','cuanto cobra un tripulante de cabina'],
  lead: '<strong>El sueldo de un TCP no es una cifra fija: es una suma.</strong> Salario base, dietas, prima por hora de vuelo y pluses de nocturnidad y festivos. Por eso dos compañeros de la misma promoción pueden acabar el año con nóminas muy distintas. Te explicamos de qué depende cada parte y cómo se llega a la parte alta de la horquilla.',
  key: [
    'La nómina se compone de <strong>base + dietas + prima de vuelo + pluses</strong>. La parte variable pesa mucho.',
    'La mayor diferencia entre dos TCP es el <strong>radio</strong>: el largo radio suma dietas y pernoctas que el corto radio no tiene.',
    'Los <strong>idiomas</strong> no son solo un complemento: abren las bases y las flotas mejor pagadas.',
    'El salto a <strong>sobrecargo</strong> cambia de tramo salarial, y llega antes de lo que la gente cree.',
  ],
  stats: [
    { b: '4 partidas', s: 'base · dietas · prima de vuelo · pluses' },
    { b: 'El radio manda', s: 'es lo que más separa dos nóminas' },
    { b: 'Sin carrera', s: 'se accede con la ESO y el certificado' },
  ],
  sections: [
    { id:'compone', h2:'De qué se compone realmente la nómina', blocks:[
      ['p','Cuando alguien pregunta «cuánto cobra un auxiliar de vuelo» espera un número. La respuesta honesta es que hay cuatro partidas y solo una es fija:'],
      ['table',['Partida','De qué depende','¿Es fija?'],[
        ['Salario base','Convenio de la aerolínea y tu antigüedad','Sí'],
        ['Dietas','Destinos, pernoctas y tiempo fuera de base','No'],
        ['Prima por hora de vuelo','Horas efectivamente voladas ese mes','No'],
        ['Pluses','Nocturnidad, festivos, idiomas, funciones adicionales','No'],
      ]],
      ['q','Por eso preguntar «cuánto se cobra» sin decir en qué aerolínea y en qué radio es como preguntar cuánto cuesta un coche.'],
    ]},
    { id:'radio', h2:'El factor que más cambia el resultado: corto o largo radio', blocks:[
      ['p','Es la diferencia más grande y la que menos se explica. Un TCP de <strong>corto radio</strong> suele hacer varios vuelos al día y dormir en su base: cobra base, prima por hora y pluses, pero apenas genera dietas.'],
      ['p','Un TCP de <strong>largo radio</strong> hace menos rotaciones pero más largas, con pernoctas fuera. Eso genera dietas que, mes a mes, suponen una parte muy significativa del ingreso total.'],
      ['pros',
        {t:'Largo radio', items:['Dietas y pernoctas que engordan la nómina','Destinos intercontinentales','Menos rotaciones, más descanso entre vuelos','Mejor tramo salarial en general']},
        {t:'Corto radio', items:['Duermes en casa la mayoría de noches','Más rotaciones y más horas de vuelo al mes','Vida personal más previsible','Entrada más habitual para quien empieza']}
      ],
      ['note','Para comparar bien','No compares salario base contra salario base. Compara el <strong>ingreso neto anual real</strong> incluyendo variables, y réstale el coste de vida de cada opción (desplazamientos a la base, noches fuera).'],
    ]},
    { id:'antiguedad', h2:'Cómo evoluciona con la antigüedad', blocks:[
      ['p','Es una profesión donde el recorrido se nota. La progresión típica:'],
      ['steps',[
        {t:'Primer año', d:'Entras en el tramo inicial del convenio. El ingreso depende mucho de cuánto vueles y de si hay temporada alta.'},
        {t:'Tres a cinco años', d:'Sube la base por antigüedad y sueles tener más control sobre tu programación mensual.'},
        {t:'Más de cinco años', d:'Tramo consolidado, acceso a flotas y rutas mejor pagadas, y posibilidad de funciones adicionales retribuidas.'},
        {t:'Sobrecargo', d:'Lideras la tripulación de cabina. Cambio de categoría y de tramo salarial.'},
      ]],
    ]},
    { id:'calculadora', h2:'Calcula tu horquilla en 30 segundos', blocks:[
      ['p','En lugar de darte una cifra genérica que no se parece a tu caso, hemos hecho una calculadora: eliges radio, tipo de aerolínea, antigüedad e idiomas, y te da tu horquilla estimada con el desglose de qué aporta cada factor.'],
      ['iman',{lab:'Calculadora gratuita', slug:'calculadora-sueldo', t:'¿Cuánto ganarías volando?', d:'Ajusta cuatro factores y mira tu horquilla estimada, con el desglose.'}],
    ]},
    { id:'mas', h2:'Lo que sube el sueldo (y lo que no)', blocks:[
      ['ul',[
        '<strong>Sube:</strong> idiomas adicionales, largo radio, antigüedad, promoción a sobrecargo, funciones de instructor.',
        '<strong>Sube:</strong> disponibilidad real para cubrir turnos, festivos y cambios de última hora.',
        '<strong>No sube:</strong> la altura, el aspecto físico o el género. La retribución la fija el convenio.',
        '<strong>No sube:</strong> tener carrera universitaria. No es un requisito ni se retribuye como tal.',
      ]],
      ['warn','Cuidado con las cifras que circulan','En internet verás sueldos de aerolíneas de Oriente Medio o de Estados Unidos mezclados con los españoles. Los convenios, los impuestos y el coste de vida no son comparables. Pide siempre la referencia del país y del convenio.'],
    ]},
  ],
  cta:{h:'¿Quieres empezar a volar?',p:'El certificado oficial de TCP es lo único que te separa de presentarte a cualquier convocatoria.',href:C.tcp,btn:'Ver el curso de TCP',btn2:'Pedir información',href2:C.info},
  recap:'El sueldo de un TCP en España se compone de salario base, dietas, prima por hora de vuelo y pluses. La variable que más lo cambia es el radio: el largo radio suma dietas y pernoctas que el corto radio no genera. Los idiomas, la antigüedad y el salto a sobrecargo son los principales aceleradores. Ni la altura ni el género influyen: la retribución la marca el convenio.',
  faq:[
    {q:'¿Cuánto cobra un auxiliar de vuelo al mes en España?',a:'Depende del convenio de la aerolínea, de la antigüedad y, sobre todo, de cuánto se vuele y en qué radio. El salario base es solo una parte: las dietas, la prima por hora de vuelo y los pluses de nocturnidad y festivos completan la nómina.'},
    {q:'¿Se gana más en largo radio o en corto radio?',a:'En general el largo radio ofrece mejores condiciones porque genera dietas y pernoctas que el corto radio no tiene. A cambio implica más noches fuera de casa.'},
    {q:'¿Cobra lo mismo un hombre que una mujer?',a:'Sí. La retribución la fija el convenio de cada aerolínea según categoría y antigüedad, no el género.'},
    {q:'¿Hace falta carrera universitaria para ser TCP?',a:'No. Con la ESO y el certificado oficial de tripulante de cabina de pasajeros es suficiente para presentarse a las convocatorias.'},
  ],
  related:[
    {href:'/blog/requisitos-azafata-vuelo/',t:'Requisitos para ser TCP en España'},
    {href:'/blog/sobrecargo-vuelo/',t:'Qué es un sobrecargo y cuánto gana'},
    {href:'/blog/salidas-profesionales-tcp-carrera-aviacion/',t:'Salidas profesionales de un TCP'},
  ],
},

/* ═══ 2 · 75.000 impresiones · posición 8 ═══ */
{
  slug: 'requisitos-azafata-vuelo',
  cat: 'Carreras en aviación',
  kicker: 'Requisitos · TCP',
  title: 'Requisitos para ser azafata o auxiliar de vuelo (TCP) en España',
  seoTitle: 'Requisitos para ser azafata de vuelo (TCP) en España',
  metaDesc: 'Todos los requisitos para ser TCP en España: edad, estudios, inglés, natación, certificado médico y el certificado oficial de AESA. Sin mitos.',
  focusKw: 'requisitos azafata de vuelo',
  kws: ['requisitos para ser tcp','requisitos auxiliar de vuelo','que se necesita para ser azafata de vuelo','altura minima azafata'],
  lead: '<strong>Para ser TCP necesitas seis cosas: ser mayor de edad, tener la ESO, defenderte en inglés, saber nadar, pasar el reconocimiento médico aeronáutico y obtener el certificado oficial de tripulante de cabina de pasajeros.</strong> Ni carrera universitaria, ni experiencia previa, ni una altura concreta. Vamos uno por uno, separando lo que exige la norma de lo que decide cada aerolínea.',
  key: [
    'Los requisitos <strong>legales</strong> son seis y ninguno incluye altura, aspecto ni carrera.',
    'El único innegociable es el <strong>certificado oficial de TCP reconocido por AESA</strong>.',
    'Lo que sí varía entre compañías son las <strong>políticas de imagen y uniformidad</strong>.',
    'El requisito que más candidatos deja fuera no está en la lista: es el <strong>inglés hablado</strong>.',
  ],
  stats: [
    { b: 'Desde 18', s: 'y con la ESO ya puedes empezar' },
    { b: 'Certificado AESA', s: 'el requisito que no se negocia' },
    { b: 'Sin experiencia', s: 'se entra desde cero' },
  ],
  sections: [
    { id:'lista', h2:'Los seis requisitos, uno por uno', blocks:[
      ['table',['Requisito','Qué se pide exactamente'],[
        ['Edad','Ser mayor de 18 años'],
        ['Estudios','ESO o equivalente. No se exige bachillerato ni carrera'],
        ['Idiomas','Inglés funcional hablado. La referencia habitual es B1-B2'],
        ['Natación','Saber nadar: hay prácticas de supervivencia y evacuación en el agua'],
        ['Aptitud médica','Reconocimiento médico aeronáutico en un centro autorizado'],
        ['Certificado','Certificado de tripulante de cabina de pasajeros conforme a normativa europea, reconocido por AESA'],
      ]],
      ['note','El orden importa','Los cinco primeros los cumples o los puedes cumplir. El sexto hay que obtenerlo, y es el que convierte una candidatura en una candidatura viable.'],
    ]},
    { id:'test', h2:'¿Los cumples? Compruébalo ahora', blocks:[
      ['p','Antes de seguir leyendo, resuélvelo en un minuto. Este test repasa los seis requisitos y te dice exactamente cuáles cumples, cuáles te faltan y por dónde deberías empezar.'],
      ['iman',{lab:'Test gratuito · 1 minuto', slug:'test-tcp', t:'¿Cumples los requisitos para ser TCP?', d:'Seis preguntas y un informe personalizado, requisito por requisito.'}],
    ]},
    { id:'mitos', h2:'Los mitos que hay que desmontar', blocks:[
      ['p','Tres creencias frenan cada año a candidatos perfectamente válidos:'],
      ['p','<strong>«Hay una altura mínima».</strong> Lo que se evalúa es el <em>alcance</em> a los compartimentos superiores de cabina, no la altura en sí. Algunas aerolíneas publican una referencia orientativa, pero no es un requisito legal universal.'],
      ['p','<strong>«Con tatuajes no te cogen».</strong> Depende de cada compañía. La norma general es que no sean visibles con el uniforme, y varias aerolíneas han flexibilizado su política.'],
      ['p','<strong>«Hay una edad máxima».</strong> No existe un tope legal. Se entra a los 20 y también a los 40; lo que se valora es la aptitud y la disponibilidad.'],
      ['q','El requisito que de verdad deja gente fuera no es ninguno de estos tres: es el inglés hablado, que se evalúa en la entrevista y no por el título que pongas en el CV.'],
    ]},
    { id:'certificado', h2:'El certificado oficial: dónde está la trampa', blocks:[
      ['p','Es el punto donde más dinero se pierde. Sin el <strong>certificado de tripulante de cabina de pasajeros reconocido por AESA</strong> no puedes volar, y no todos los cursos que se anuncian terminan en él.'],
      ['p','La pregunta que lo aclara todo, y que debes hacer por escrito a cualquier centro:'],
      ['q','«¿Qué documento exacto recibo al terminar y quién lo reconoce?»'],
      ['warn','«Homologado» no significa oficial','Un diploma de centro o una «titulación propia» no habilitan para volar. Solo sirve el certificado conforme a la normativa europea reconocido por AESA, que además es válido en toda la Unión Europea.'],
    ]},
    { id:'aerolineas', h2:'Lo que además piden las aerolíneas', blocks:[
      ['p','Cumplir los requisitos te permite <strong>presentarte</strong>. Superar la selección depende de otras cosas que ninguna norma recoge:'],
      ['ul',[
        'Orientación al cliente y capacidad de resolver bajo presión.',
        'Trabajo en equipo con gente que no conoces, en espacios reducidos.',
        'Disponibilidad real para turnos, festivos y cambios de base.',
        'Imagen cuidada conforme a la política de uniformidad de la compañía.',
        'Idiomas adicionales, que en la práctica funcionan como criterio de desempate.',
      ]],
    ]},
  ],
  cta:{h:'¿Cumples y quieres dar el paso?',p:'Fórmate con el certificado oficial de AESA y preséntate a las convocatorias de las aerolíneas.',href:C.tcp,btn:'Ver el curso de TCP',btn2:'Hablar con el equipo',href2:C.info},
  recap:'Para ser TCP en España hacen falta seis requisitos: mayor de 18 años, ESO o equivalente, inglés funcional, saber nadar, reconocimiento médico aeronáutico y el certificado oficial reconocido por AESA. Ni altura mínima legal, ni edad máxima, ni carrera universitaria. Lo que varía entre compañías son las políticas de imagen, y lo que de verdad decide la selección es el inglés hablado y la actitud.',
  faq:[
    {q:'¿Hay una altura mínima para ser azafata de vuelo?',a:'No existe un requisito legal universal de altura. Lo que se evalúa es el alcance funcional a los compartimentos superiores de cabina. Algunas aerolíneas publican una referencia orientativa en sus convocatorias.'},
    {q:'¿Se puede ser TCP sin inglés?',a:'No de forma realista. Casi todas las aerolíneas exigen un nivel funcional equivalente a B1-B2, y se evalúa hablado durante la entrevista.'},
    {q:'¿Hay edad máxima para ser auxiliar de vuelo?',a:'No hay un tope legal. Lo que se exige es cumplir la aptitud psicofísica y tener disponibilidad para la operativa.'},
    {q:'¿Necesito experiencia previa?',a:'No. Es una profesión a la que se accede desde cero. La experiencia de atención al público suma en la selección, pero no es un requisito.'},
  ],
  related:[
    {href:'/blog/cuanto-cobran-las-azafatas-de-vuelo/',t:'Cuánto cobra un TCP en España'},
    {href:'/blog/como-superar-entrevista-tcp-aerolinea/',t:'Cómo superar la entrevista de una aerolínea'},
    {href:'/blog/que-es-certificado-tcp/',t:'Qué es el certificado TCP'},
  ],
},

/* ═══ 3 · 63.000 impresiones · posición 11 ═══ */
{
  slug: 'que-hay-que-estudiar-para-ser-azafata-de-vuelo',
  cat: 'Formación aeronáutica',
  kicker: 'Formación · TCP',
  title: 'Qué hay que estudiar para ser azafata de vuelo: la ruta completa desde cero',
  seoTitle: 'Qué estudiar para ser azafata de vuelo (ruta completa)',
  metaDesc: 'Qué hay que estudiar para ser azafata o auxiliar de vuelo: qué formación sirve, qué incluye el curso oficial de TCP y cuánto se tarda en estar volando.',
  focusKw: 'que hay que estudiar para ser azafata de vuelo',
  kws: ['que estudiar para ser azafata','formacion tcp','curso auxiliar de vuelo que incluye','cuanto se tarda en ser tcp'],
  lead: '<strong>No hay que estudiar una carrera: hay que obtener un certificado.</strong> Es la confusión más común y la que hace perder años a mucha gente. Para volar como TCP no se cursa una titulación universitaria ni un grado de FP obligatorio, sino una formación específica que termina en el certificado oficial de tripulante de cabina de pasajeros. Esta es la ruta completa.',
  key: [
    'No existe una carrera ni un grado obligatorio: lo que habilita es el <strong>certificado oficial de TCP</strong>.',
    'La formación combina <strong>teoría y prácticas reales</strong> de evacuación, fuego y supervivencia en el agua.',
    'Se accede con la <strong>ESO</strong>; el bachillerato o una carrera no son requisito.',
    'Después del certificado, la aerolínea imparte la <strong>habilitación de su tipo de avión</strong>.',
  ],
  stats: [
    { b: 'Certificado', s: 'no carrera universitaria' },
    { b: 'Teoría + práctica', s: 'evacuación, fuego, agua y simulador' },
    { b: 'Meses', s: 'no años' },
  ],
  sections: [
    { id:'confusion', h2:'La confusión de partida: carrera vs. certificado', blocks:[
      ['p','Mucha gente busca «qué carrera hay que hacer para ser azafata» y acaba matriculándose en turismo, en idiomas o en un grado de FP pensando que es el camino. Son estudios útiles, pero <strong>ninguno te habilita para volar</strong>.'],
      ['table',['Lo que la gente cree','La realidad'],[
        ['Hay que estudiar turismo','Ayuda, pero no habilita ni es requisito'],
        ['Hace falta una carrera','No. Se accede con la ESO'],
        ['Es un grado de FP','No existe un grado obligatorio para TCP'],
        ['Basta un curso de atención al cliente','No habilita para volar'],
        ['Hay que hacer el certificado de TCP','✔ Esto es lo correcto'],
      ]],
    ]},
    { id:'temario', h2:'Qué se estudia exactamente en el curso de TCP', blocks:[
      ['p','El programa está marcado por la normativa europea y es fundamentalmente <strong>de seguridad</strong>, no de servicio. Esa es otra sorpresa habitual: la mayor parte de la formación va sobre qué hacer cuando algo va mal.'],
      ['ul',[
        '<strong>Normativa aeronáutica</strong> y responsabilidades de la tripulación.',
        '<strong>Conocimiento de aeronaves</strong>: sistemas, equipamiento y limitaciones.',
        '<strong>Factores humanos y CRM</strong>: coordinación, fatiga, toma de decisiones.',
        '<strong>Mercancías peligrosas</strong>: identificación y procedimientos.',
        '<strong>Primeros auxilios</strong> y uso del equipamiento médico de cabina.',
        '<strong>Supervivencia y evacuación</strong>: humo, fuego, salidas de emergencia y agua.',
        '<strong>Seguridad (security)</strong> y gestión de pasajeros conflictivos.',
        '<strong>Servicio a bordo</strong> y atención al pasaje.',
      ]],
      ['note','La parte que no se puede estudiar en casa','Las prácticas de evacuación, extinción de fuego y supervivencia en el agua son presenciales y obligatorias. Un curso que sea solo online no puede completar la formación.'],
    ]},
    { id:'ruta', h2:'La ruta completa, paso a paso', blocks:[
      ['steps',[
        {t:'Comprobar que cumples los requisitos', d:'Edad, ESO, inglés funcional, natación y aptitud médica.'},
        {t:'Cursar la formación oficial de TCP', d:'Teoría más prácticas presenciales de seguridad y supervivencia.'},
        {t:'Obtener el certificado', d:'Conforme a normativa europea y reconocido por AESA. Es válido en toda la UE.'},
        {t:'Pasar el reconocimiento médico aeronáutico', d:'En un centro autorizado. Es obligatorio para poder volar.'},
        {t:'Presentarte a las convocatorias', d:'CV orientado, entrevista en inglés y dinámica de grupo.'},
        {t:'Habilitación de tipo de avión', d:'La imparte la aerolínea que te contrata, sobre su flota y sus procedimientos.'},
      ]],
    ]},
    { id:'idiomas', h2:'Y en paralelo: el inglés', blocks:[
      ['p','Es la parte que la gente deja para el final y la que más candidatos descarta. No se trata de sacar un título: se trata de <strong>poder atender a un pasajero, dar instrucciones de seguridad y resolver una incidencia</strong> en inglés, en voz alta y con naturalidad.'],
      ['p','Si tu nivel es bajo, empieza hoy en paralelo a la formación. Llegar al proceso de selección con el certificado pero sin poder sostener una conversación es perder la convocatoria.'],
    ]},
    { id:'test', h2:'Antes de matricularte en nada, comprueba tu punto de partida', blocks:[
      ['iman',{lab:'Test gratuito', slug:'test-tcp', t:'¿Cumples los requisitos para ser TCP?', d:'Seis preguntas para saber qué te falta antes de invertir en formación.'}],
    ]},
  ],
  cta:{h:'¿Quieres el programa completo?',p:'Te enviamos el temario, el calendario y qué certificado obtienes al terminar.',href:C.tcp,btn:'Ver el curso de TCP',btn2:'Pedir el temario',href2:C.info},
  recap:'Para ser azafata o auxiliar de vuelo no se estudia una carrera: se obtiene el certificado oficial de tripulante de cabina de pasajeros reconocido por AESA. La formación es sobre todo de seguridad (normativa, aeronaves, mercancías peligrosas, primeros auxilios, evacuación, fuego y supervivencia en el agua) e incluye prácticas presenciales obligatorias. Se accede con la ESO y, después del certificado, la aerolínea imparte la habilitación de su tipo de avión.',
  faq:[
    {q:'¿Qué carrera hay que estudiar para ser azafata de vuelo?',a:'Ninguna. No existe una carrera universitaria ni un grado obligatorio. Lo que habilita para volar es el certificado oficial de tripulante de cabina de pasajeros reconocido por AESA, al que se accede con la ESO.'},
    {q:'¿Se puede hacer el curso de TCP online?',a:'La parte teórica puede tener componente online, pero las prácticas de evacuación, fuego y supervivencia en el agua son presenciales y obligatorias. Un curso exclusivamente online no completa la formación.'},
    {q:'¿Cuánto se tarda en ser TCP?',a:'Se habla de meses, no de años. El plazo depende del formato del curso y de cuándo se abran las convocatorias de las aerolíneas a las que quieras presentarte.'},
    {q:'¿Sirve estudiar turismo para ser azafata de vuelo?',a:'Es un complemento útil y se valora, pero no habilita para volar ni sustituye al certificado oficial de TCP.'},
  ],
  related:[
    {href:'/blog/requisitos-azafata-vuelo/',t:'Requisitos para ser TCP'},
    {href:'/blog/curso-tcp-precio-cuanto-cuesta/',t:'Cuánto cuesta el curso de TCP'},
    {href:'/blog/que-es-certificado-tcp/',t:'Qué es el certificado TCP'},
  ],
},

/* ═══ 4 · 50.000 impresiones · posición 6 ═══ */
{
  slug: 'sobrecargo-vuelo',
  cat: 'Carreras en aviación',
  kicker: 'Carrera · Cabina',
  title: 'Sobrecargo de vuelo: qué hace, cuánto gana y cómo se llega',
  seoTitle: 'Sobrecargo de vuelo: funciones, sueldo y cómo llegar',
  metaDesc: 'Qué hace un sobrecargo de vuelo, qué responsabilidades asume, cuánto gana respecto a un TCP y cuál es el camino real para llegar al puesto.',
  focusKw: 'sobrecargo de vuelo',
  kws: ['que es un sobrecargo','jefe de cabina funciones','cuanto gana un sobrecargo','como llegar a sobrecargo'],
  lead: '<strong>El sobrecargo es el responsable de la tripulación de cabina: lidera al equipo, coordina con los pilotos y responde de la seguridad y del servicio de todo el pasaje.</strong> No es un TCP con más años: es un puesto de mando con formación y responsabilidad propias. Te contamos qué hace exactamente, qué cambia en la nómina y cómo se llega.',
  key: [
    'Es el <strong>responsable de cabina</strong>: lidera al equipo y es el enlace con los pilotos.',
    'Asume la <strong>decisión operativa</strong> en cabina ante una incidencia o una emergencia.',
    'Supone un <strong>cambio de categoría</strong> y de tramo salarial, no solo un plus.',
    'Se llega por <strong>promoción interna</strong> desde TCP: antigüedad, evaluación y formación.',
  ],
  stats: [
    { b: 'Responsable', s: 'de toda la tripulación de cabina' },
    { b: 'Otro tramo', s: 'cambio de categoría salarial' },
    { b: 'Desde TCP', s: 'es promoción interna, no acceso directo' },
  ],
  sections: [
    { id:'que', h2:'Qué hace un sobrecargo durante un vuelo', blocks:[
      ['p','Su trabajo empieza antes de que embarque nadie y no termina hasta que el último pasajero baja.'],
      ['ul',[
        '<strong>Briefing previo</strong>: reúne a la tripulación, reparte posiciones y repasa procedimientos y particularidades del vuelo.',
        '<strong>Enlace con la cabina de vuelo</strong>: es el canal entre los pilotos y el resto de la tripulación.',
        '<strong>Comprobaciones de seguridad</strong>: verifica equipamiento, salidas y documentación antes del despegue.',
        '<strong>Gestión del pasaje</strong>: asume las incidencias que el resto de la tripulación no puede resolver.',
        '<strong>Decisión en emergencia</strong>: coordina la respuesta de cabina y la evacuación si hiciera falta.',
        '<strong>Informe posterior</strong>: reporta incidencias a la compañía.',
      ]],
      ['q','En cabina, cuando algo se complica, la tripulación mira al sobrecargo. Esa es la diferencia real con ser TCP.'],
    ]},
    { id:'diferencia', h2:'Sobrecargo y TCP: qué cambia exactamente', blocks:[
      ['table',['','TCP','Sobrecargo'],[
        ['Responsabilidad','Su zona de cabina y sus pasajeros','Toda la cabina y toda la tripulación'],
        ['Decisión','Ejecuta procedimientos','Decide y coordina la respuesta'],
        ['Relación con pilotos','Puntual','Es el enlace permanente'],
        ['Formación','Certificado de TCP','Formación adicional de mando y gestión'],
        ['Retribución','Tramo de TCP','Categoría superior, otro tramo salarial'],
      ]],
    ]},
    { id:'sueldo', h2:'Cuánto gana un sobrecargo', blocks:[
      ['p','El salto no es un complemento sobre la misma nómina: es un <strong>cambio de categoría</strong> en el convenio. A partir de ahí siguen aplicando las mismas variables que en cualquier puesto de cabina — dietas, prima por hora de vuelo, nocturnidad y festivos — pero sobre una base superior.'],
      ['p','Como en el resto de la profesión, el radio sigue marcando la diferencia: un sobrecargo de largo radio suma dietas y pernoctas que uno de corto radio no genera.'],
      ['iman',{lab:'Calculadora gratuita', slug:'calculadora-sueldo', t:'¿Cuánto ganarías volando?', d:'Incluye la opción de sobrecargo: mira cómo cambia la horquilla.'}],
    ]},
    { id:'llegar', h2:'Cómo se llega al puesto', blocks:[
      ['p','No hay acceso directo: <strong>se llega desde TCP</strong>, por promoción interna. Lo que pesa en esa promoción:'],
      ['steps',[
        {t:'Antigüedad y experiencia', d:'Horas de vuelo acumuladas y trayectoria en la compañía.'},
        {t:'Evaluación de desempeño', d:'Cómo trabajas en equipo, cómo gestionas incidencias y qué reportan tus responsables.'},
        {t:'Idiomas', d:'Especialmente en compañías de largo radio y en rutas premium.'},
        {t:'Formación adicional', d:'Cursos de mando, gestión de crisis, instrucción. Cada uno suma en la baremación.'},
        {t:'Vacantes disponibles', d:'Depende del crecimiento de la flota y de la rotación interna. Es el factor que no controlas.'},
      ]],
      ['note','Consejo práctico','Si tu objetivo es llegar a sobrecargo, empieza a construirlo desde tu primer año: acumula formación interna, cuida la evaluación y suma idiomas. Es una carrera que se prepara, no una que llega sola con la antigüedad.'],
    ]},
  ],
  cta:{h:'Todo empieza por el certificado',p:'Para llegar a sobrecargo primero hay que volar. Fórmate como TCP con el certificado oficial.',href:C.tcp,btn:'Ver el curso de TCP',btn2:'Pedir información',href2:C.info},
  recap:'El sobrecargo es el responsable de la tripulación de cabina: dirige el briefing, es el enlace con los pilotos, gestiona las incidencias graves y coordina la respuesta en una emergencia. Supone un cambio de categoría salarial, no un simple plus. Se llega por promoción interna desde TCP, y pesan la antigüedad, la evaluación de desempeño, los idiomas, la formación adicional y las vacantes disponibles.',
  faq:[
    {q:'¿Qué diferencia hay entre un sobrecargo y un TCP?',a:'El TCP se ocupa de su zona de cabina y ejecuta los procedimientos. El sobrecargo es el responsable de toda la cabina y de toda la tripulación: dirige el briefing, es el enlace con los pilotos y toma las decisiones operativas en cabina.'},
    {q:'¿Se puede entrar directamente como sobrecargo?',a:'No. Es un puesto de promoción interna al que se llega desde TCP, con antigüedad, evaluación positiva y formación adicional de mando.'},
    {q:'¿Cuánto gana un sobrecargo de vuelo?',a:'Su categoría en el convenio es superior a la de TCP, de modo que la base es mayor. Sobre ella siguen aplicando las mismas variables: dietas, prima por hora de vuelo y pluses de nocturnidad y festivos.'},
    {q:'¿Cuántos años se tarda en llegar a sobrecargo?',a:'Depende de la aerolínea, de su estructura y de las vacantes internas. Influyen la antigüedad, la evaluación de desempeño, los idiomas y la formación adicional acumulada.'},
  ],
  related:[
    {href:'/blog/cuanto-cobran-las-azafatas-de-vuelo/',t:'Cuánto cobra un TCP en España'},
    {href:'/blog/salidas-profesionales-tcp-carrera-aviacion/',t:'Salidas profesionales de un TCP'},
    {href:'/blog/diferencia-azafata-auxiliar-vuelo/',t:'Diferencia entre azafata y auxiliar de vuelo'},
  ],
},

/* ═══ 5 · 48.000 impresiones · posición 7 ═══ */
{
  slug: 'diferencia-azafata-auxiliar-vuelo',
  cat: 'Carreras en aviación',
  kicker: 'Conceptos claros',
  title: 'Azafata, auxiliar de vuelo o TCP: cuál es la diferencia (y cómo se llama de verdad)',
  seoTitle: 'Azafata, auxiliar de vuelo o TCP: cuál es la diferencia',
  metaDesc: 'Azafata de vuelo, auxiliar de vuelo y TCP son la misma profesión con nombres distintos. Te explicamos cuál es el término oficial y en qué se diferencian de azafata de tierra y sobrecargo.',
  focusKw: 'diferencia azafata y auxiliar de vuelo',
  kws: ['azafata o auxiliar de vuelo','que es tcp aviacion','tripulante de cabina de pasajeros','azafata de tierra o de vuelo'],
  lead: '<strong>Azafata de vuelo, auxiliar de vuelo y TCP son exactamente la misma profesión.</strong> Cambia el nombre, no el trabajo. Lo que sí son puestos distintos son la azafata de tierra y el sobrecargo, y ahí es donde se lía la gente. Este artículo pone cada término en su sitio para que sepas qué buscar cuando mires ofertas de empleo o cursos.',
  key: [
    '<strong>Azafata = auxiliar de vuelo = TCP</strong>. Misma profesión, tres nombres.',
    'El término oficial es <strong>tripulante de cabina de pasajeros (TCP)</strong>: es el que aparece en la normativa y en el certificado.',
    '<strong>Azafata de tierra</strong> es otro puesto: trabaja en el aeropuerto, no a bordo.',
    '<strong>Sobrecargo</strong> tampoco es lo mismo: es el responsable de la tripulación de cabina.',
  ],
  stats: [
    { b: 'TCP', s: 'el término oficial en la normativa' },
    { b: 'Mismo puesto', s: 'azafata y auxiliar de vuelo' },
    { b: 'Otro puesto', s: 'azafata de tierra y sobrecargo' },
  ],
  sections: [
    { id:'mismo', h2:'Azafata, auxiliar de vuelo y TCP: lo mismo', blocks:[
      ['p','Son tres formas de nombrar al profesional que trabaja a bordo del avión velando por la seguridad y atendiendo al pasaje:'],
      ['table',['Término','De dónde viene','¿Es oficial?'],[
        ['Azafata / azafato de vuelo','Uso coloquial histórico','No'],
        ['Auxiliar de vuelo','Uso común en ofertas y en el sector','Parcialmente'],
        ['TCP · tripulante de cabina de pasajeros','Normativa aeronáutica europea','✔ Sí'],
      ]],
      ['note','Por qué te interesa saberlo','Las ofertas de empleo de las aerolíneas casi nunca dicen «azafata». Buscan <strong>TCP</strong>, <strong>tripulante de cabina</strong> o <strong>cabin crew</strong>. Si buscas por el término coloquial, te pierdes la mayoría de convocatorias.'],
    ]},
    { id:'tierra', h2:'La confusión más cara: vuelo vs. tierra', blocks:[
      ['p','Aquí sí hay dos profesiones distintas, con formaciones distintas y vidas muy distintas. Mucha gente se matricula en el curso equivocado por no tenerlo claro.'],
      ['table',['','TCP / auxiliar de vuelo','Azafata de tierra'],[
        ['Dónde trabaja','A bordo del avión','En la terminal del aeropuerto'],
        ['Qué hace','Seguridad y servicio en cabina','Facturación, embarque, incidencias'],
        ['Certificación','Certificado oficial de TCP obligatorio','No hay certificado obligatorio'],
        ['Vida','Noches fuera, turnos irregulares','Base fija, duerme en casa'],
        ['Acceso','Convocatorias de aerolínea','Contratación continua de handling'],
      ]],
      ['p','Si dudas entre las dos, no lo decidas por cuál suena mejor: decídelo por cuánto puedes estar fuera de casa. Es la variable que de verdad separa las dos vidas.'],
      ['iman',{lab:'Test de orientación', slug:'test-perfil', t:'¿Cabina, tierra u operaciones?', d:'Ocho preguntas sobre tu vida real para saber cuál encaja contigo.'}],
    ]},
    { id:'sobrecargo', h2:'¿Y el sobrecargo?', blocks:[
      ['p','Tampoco es un sinónimo. El sobrecargo es un TCP que ha promocionado a <strong>responsable de la tripulación de cabina</strong>: dirige el briefing, es el enlace con los pilotos y coordina la respuesta ante una emergencia.'],
      ['p','Dicho de otro modo: todos los sobrecargos fueron TCP, pero no todos los TCP llegan a sobrecargo.'],
    ]},
    { id:'otros', h2:'Otros términos que te vas a encontrar', blocks:[
      ['ul',[
        '<strong>Cabin crew</strong>: el equivalente en inglés de TCP. Es como lo publican las aerolíneas internacionales.',
        '<strong>Agente de pasaje</strong>: el nombre técnico de la azafata de tierra en las ofertas de handling.',
        '<strong>Agente de rampa</strong>: personal de plataforma (equipajes, carga, señalización). No trata con el pasaje.',
        '<strong>Despachador de vuelo</strong>: planifica y sigue los vuelos desde el centro de operaciones. No vuela.',
        '<strong>Jefe de cabina</strong>: en algunas compañías, otro nombre para el sobrecargo.',
      ]],
    ]},
  ],
  cta:{h:'¿Ya tienes claro cuál es lo tuyo?',p:'Cuéntanos tu situación y te orientamos entre cabina, tierra y operaciones sin venderte humo.',href:C.info,btn:'Hablar con un asesor',btn2:'Ver los cursos',href2:C.tcp},
  recap:'Azafata de vuelo, auxiliar de vuelo y TCP son la misma profesión: el término oficial es tripulante de cabina de pasajeros, y es el que usan las aerolíneas en sus convocatorias. La azafata de tierra es un puesto distinto que trabaja en la terminal y no necesita certificado obligatorio. El sobrecargo es un TCP promocionado a responsable de la tripulación de cabina.',
  faq:[
    {q:'¿Es lo mismo azafata de vuelo que auxiliar de vuelo?',a:'Sí. Son dos nombres para la misma profesión, cuyo término oficial es tripulante de cabina de pasajeros (TCP), el que aparece en la normativa aeronáutica y en el certificado.'},
    {q:'¿Qué diferencia hay entre azafata de vuelo y azafata de tierra?',a:'La azafata de vuelo trabaja a bordo del avión y necesita el certificado oficial de TCP. La azafata de tierra trabaja en la terminal del aeropuerto (facturación, embarque, incidencias) y no requiere un certificado obligatorio.'},
    {q:'¿Cómo se llama oficialmente la profesión?',a:'Tripulante de cabina de pasajeros, abreviado TCP. En inglés, cabin crew. Es el término que usan las aerolíneas en sus ofertas de empleo.'},
    {q:'¿El sobrecargo es lo mismo que un TCP?',a:'No. El sobrecargo es un TCP que ha promocionado a responsable de la tripulación de cabina: dirige el briefing, coordina con los pilotos y toma las decisiones operativas en cabina.'},
  ],
  related:[
    {href:'/blog/requisitos-azafata-vuelo/',t:'Requisitos para ser TCP'},
    {href:'/blog/sobrecargo-vuelo/',t:'Qué es un sobrecargo de vuelo'},
    {href:'/blog/tcp-o-azafata-de-tierra-cual-elegir/',t:'TCP o azafata de tierra: cuál elegir'},
  ],
},

];
export default REFRESH;

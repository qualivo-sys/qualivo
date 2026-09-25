/* Sector: Formación (escuelas, formación corporativa, catálogo abierto + in-company).
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.formacion = {
    id: 'formacion',
    nombre: 'Formación',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso',
      paginaVisitas: 'la página del curso', cita: 'entrevista', Cita: 'Entrevista', laCita: 'la entrevista',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'el asesor de formación', Comercial: 'Asesor de formación',
      cliente: 'alumno', unCliente: 'un alumno', convierten: 'se matriculan', objetivoPaso: 'agendar la entrevista',
      casoExito: 'el testimonio de un antiguo alumno', valorAlto: 4000, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la matrícula', Producto: 'Curso', clientes: 'alumnos',
      propuestas: 'propuestas in-company', verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'empleados',
      pasoHumano: 'resolver sus dudas de precio y fechas y cerrar la matrícula'
    },
    // Recorrido: Anuncio → Solicita información → Contactado → Cualificado → Entrevista → Matrícula → Alumno
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'info', txt: 'Solicita información' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'entrevista', txt: 'Entrevista' },
      { id: 'matricula', txt: 'Matrícula' },
      { id: 'alumno', txt: 'Alumno', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 1900,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, cualificado: 0.6, entrevista: 0.45, matricula: 0.42 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'interesados que piden información y nunca llegan a hablar con nadie' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      entrevista: { txt: 'Seguimiento', exp: 'cualificados a los que nadie cierra la entrevista' },
      matricula: { txt: 'Cierre y no-show', exp: 'entrevistas que no terminan en matrícula' }
    },
    mesDatos: { respuestaAntes: 252, respuestaAhora: 2, agendadas: 129 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Máster en Dirección de Personas', inversion: 3800, ticket: 3900,
        embudo: { anuncio: 6120, info: 190, contactado: 98, cualificado: 61, entrevista: 24, matricula: 9, alumno: 8 } },
      { id: 'c2', canal: 'Google', nombre: 'Formación in-company bonificada', inversion: 2900, ticket: 7400,
        embudo: { anuncio: 1480, info: 58, contactado: 41, cualificado: 29, entrevista: 14, matricula: 5, alumno: 4 } },
      { id: 'c3', canal: 'LinkedIn', nombre: 'Programa de Liderazgo para mandos', inversion: 2600, ticket: 5600,
        embudo: { anuncio: 1950, info: 64, contactado: 40, cualificado: 26, entrevista: 13, matricula: 5, alumno: 4 } },
      { id: 'c4', canal: 'Meta', nombre: 'Curso de Excel e IA para finanzas', inversion: 3100, ticket: 690,
        embudo: { anuncio: 9400, info: 212, contactado: 104, cualificado: 45, entrevista: 17, matricula: 6, alumno: 6 } },
      { id: 'c5', canal: 'Meta', nombre: 'Certificación en Gestión de Proyectos', inversion: 2100, ticket: 1450,
        embudo: { anuncio: 4300, info: 98, contactado: 52, cualificado: 30, entrevista: 14, matricula: 6, alumno: 5 } },
      { id: 'c6', canal: 'Web', nombre: 'Catálogo abierto (orgánico)', inversion: 0, ticket: 1900,
        embudo: { anuncio: 2600, info: 70, contactado: 50, cualificado: 29, entrevista: 12, matricula: 7, alumno: 4 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Interesados', cualificados: 'Interesados cualificados', entrevistas: 'Entrevistas', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'entrevista' },

    reglas: {
      fitBase: 22,
      fit: [
        [function (c) { return c.seg === 'empresa' && c.tam >= 50; }, 30, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 50 empleados o más'],
        [function (c) { return c.seg === 'empresa' && c.tam >= 10 && c.tam < 50; }, 16, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 10 a 49 empleados'],
        [function (c) { return c.s.fundae; }, 14, 'crédito FUNDAE disponible'],
        [function (c) { return c.seg === 'empresa' && tieneRol(c, /forma|rrhh|personas|talento|people|director|gerente|ceo/i); }, 14, function (c) { return 'decide la formación (' + c.rol + ')'; }, 'Su puesto decide la formación'],
        [function (c) { return c.seg === 'particular' && (c.f && c.f.exp >= 3); }, 22, function (c) { return c.f.exp + ' años de experiencia en el área'; }, 'Particular con 3 años o más en el área'],
        [function (c) { return c.seg === 'particular' && (c.f && c.f.exp > 0 && c.f.exp < 3); }, 10, function (c) { return 'perfil junior en el área'; }],
        [function (c) { return c.f && c.f.empresaPaga; }, 14, 'su empresa le paga la formación'],
        [function (c) { return c.valor >= 3000; }, 8, 'programa de ticket alto'],
        [function (c) { return c.f && c.f.estudiante; }, -14, 'todavía estudiando, sin experiencia'],
        [function (c) { return c.f && c.f.fuera; }, -26, 'fuera de España, sin bonificación posible'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca formación gratuita']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 14, 'preguntó por la próxima convocatoria'],
        [function (c) { return c.s.fundaeQ; }, 12, 'preguntó por la bonificación FUNDAE'],
        [function (c) { return c.s.temario; }, 8, 'descargó el temario'],
        [function (c) { return c.s.financia; }, 10, 'preguntó por pago a plazos']
      ]
    },

    preguntas: [
      { q: '¿Qué alumnos tienen más probabilidad de matricularse?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Quién dijo que empezaría en la próxima convocatoria?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que lo retomarían más adelante. Ninguno es un no: el agente de reactivación les escribe en la fecha que ellos mismos dieron.'; },
        vista: 'tabla' },
      { q: '¿Qué interesados llevan demasiado tiempo sin seguimiento?', h: 'sinSeguimiento', obj: ['seguimiento', 'todo'] },
      { q: '¿Qué campaña está generando matrículas?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Qué empresas pueden bonificar la formación con FUNDAE?', h: 'lista', obj: ['ventas', 'expansion', 'todo'],
        filtro: function (c) { return !!c.s.fundae && !c.fin; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' empresas tienen crédito FUNDAE disponible y están abiertas. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en propuestas in-company.'; },
        vista: 'tabla' }
    ],

    historias: {
      empresa: {
        titulo: 'Una empresa pide formación in-company',
        contacto: { id: 'demo', n: 'Marta Ruiz', rol: 'Responsable de Formación', emp: 'Logística Levante Hub', seg: 'empresa', ciudad: '—', prod: 'Programa de Liderazgo (in-company)', orig: 'c3', canal: 'wa', etapa: 1, valor: 8400, creado: 0, act: 0, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde LinkedIn', feed: 'Nueva solicitud · Programa de Liderazgo', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: empresa, tamaño, crédito FUNDAE', feed: 'Ficha completada · 180 empleados · crédito FUNDAE', cambio: { tam: 180, ciudad: 'Valencia', s: { fundae: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 58 segundos', cambio: { conv: ['a', 'wa', 'Hola Marta, soy Laura, de formación in-company. He visto que os interesa el Programa de Liderazgo. ¿Para cuántas personas sería y para cuándo lo necesitáis?'] }, toque: true },
          { dur: 6, min: 9, txt: 'Marta vuelve a la página del programa y descarga el temario', feed: 'Visita la página del programa · descarga el temario', cambio: { s: { visitas: 3, temario: true } }, act: true },
          { dur: 7, min: 3, txt: 'Marta contesta por WhatsApp', feed: 'Respuesta recibida · intención al alza', cambio: { etapa: 2, s: { urg: true, urgTxt: 'quiere empezar antes de fin de año', fundaeQ: true }, conv: ['c', 'wa', 'Hola Laura. Sería para 14 mandos intermedios y queremos hacerlo antes de fin de año. ¿Se puede bonificar por FUNDAE?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente cualifica con una sola pregunta', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Sí, se bonifica con vuestro crédito y la gestión con FUNDAE la hacemos nosotros. ¿Lo veis presencial en vuestras oficinas o en remoto? Así te preparo la propuesta con las dos opciones.'] }, toque: true },
          { dur: 7, min: 4, txt: 'Marta confirma formato y plazo', feed: 'Presupuesto confirmado · pide propuesta esta semana', cambio: { s: { ppto: 'si', pptoTxt: 'tiene crédito FUNDAE y quiere la propuesta esta semana', precio: true }, conv: ['c', 'wa', 'Presencial, en Valencia. Y necesitaríamos la propuesta esta semana, que el comité se reúne el lunes.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la reunión con el asesor', feed: 'Reunión agendada · jueves 10:00', cambio: { etapa: 4, s: { cita: 1500, citaOk: true }, conv: ['a', 'wa', 'Hecho: jueves a las 10:00, 20 minutos con Javier, nuestro asesor de formación in-company. Te llega la invitación al correo con la propuesta preliminar.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Marta está lista para hablar', feed: 'Aviso enviado al asesor de formación', humano: { titulo: 'Marta está lista para hablar', texto: '14 mandos · presencial en Valencia · bonificado por FUNDAE · quiere la propuesta esta semana (el comité se reúne el lunes). Reunión el jueves a las 10:00.' } }
        ]
      },
      alumno: {
        titulo: 'Un profesional pide información de un máster',
        contacto: { id: 'demo', n: 'Javier Ortega', rol: 'Técnico de RR. HH.', seg: 'particular', ciudad: '—', prod: 'Máster en Dirección de Personas', orig: 'c1', canal: 'wa', etapa: 1, valor: 3900, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde un anuncio de Meta', feed: 'Nueva solicitud · Máster en Dirección de Personas', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · 5 años en RR. HH.', cambio: { ciudad: 'Madrid', f: { exp: 5, empresaPaga: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 47 segundos', cambio: { conv: ['a', 'wa', 'Hola Javier, soy Lucía, de admisiones. Te escribo por el Máster en Dirección de Personas. ¿Lo quieres para dar el salto a un puesto de responsable o para lo que haces ahora?'] }, toque: true },
          { dur: 6, min: 11, txt: 'Javier mira el plan de estudios dos veces más', feed: 'Visita la página del máster (3 veces)', cambio: { s: { visitas: 3, temario: true } }, act: true },
          { dur: 7, min: 2, txt: 'Javier contesta y pregunta por fechas y precio', feed: 'Respuesta recibida · pregunta precio y convocatoria', cambio: { etapa: 2, s: { precio: true, conv: true }, conv: ['c', 'wa', 'Para pasar a responsable. ¿Cuándo empieza la próxima convocatoria y cuánto cuesta? Mi empresa me pagaría una parte.'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente responde y cualifica', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Empieza el 19 de octubre, online en directo. Si tu empresa lo paga, se puede bonificar y te lo gestionamos. ¿Quieres que lo veamos 15 minutos con la directora del máster?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Javier acepta y pide pago a plazos', feed: 'Intención alta · pide pago a plazos', cambio: { s: { urg: true, urgTxt: 'quiere empezar en octubre', financia: true }, conv: ['c', 'wa', 'Sí, mejor mañana por la tarde. ¿La parte que pague yo se puede hacer a plazos?'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la entrevista', feed: 'Entrevista agendada · mañana 18:00', cambio: { etapa: 4, s: { cita: 1320, citaOk: true }, conv: ['a', 'wa', 'Sí, en diez plazos sin intereses. Te dejo la entrevista mañana a las 18:00 con Elena, la directora. Te llega el enlace al correo.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Javier está listo para hablar', feed: 'Aviso enviado a admisiones', humano: { titulo: 'Javier está listo para hablar', texto: 'Quiere pasar a responsable de RR. HH. · convocatoria de octubre · su empresa paga una parte (bonificable) · el resto a plazos. Entrevista mañana a las 18:00.' } }
        ]
      }
    },
    historiaDefecto: 'empresa',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'f01', n: 'Carmen Vidal', rol: 'Directora de RR. HH.', emp: 'Grupo Alimentario Serrano', seg: 'empresa', tam: 420, ciudad: 'Zaragoza', prod: 'Programa de Liderazgo (in-company)', orig: 'c3', canal: 'wa', etapa: 3, valor: 11200, creado: 3 * D, act: 23, toque: 40,
        s: { fundae: true, fundaeQ: true, visitas: 4, precio: true, urg: true, urgTxt: 'tiene que ejecutar el crédito FUNDAE antes de diciembre', resp: true },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Carmen, soy Laura, de formación in-company. ¿Para cuántas personas sería el programa?'], [3 * D - 50, 'c', 'wa', 'Unos 20 mandos entre dos plantas. Lo estamos valorando.'], [2 * D, 'a', 'wa', 'Perfecto. ¿Os encaja formato mixto, presencial y online?'], [45, 'c', 'wa', 'Sí. Tenemos que ejecutar el crédito antes de diciembre, ¿qué precio tendría y cuánto cubre FUNDAE?'], [40, 'a', 'wa', 'Te preparo la cifra exacta con lo que cubre vuestro crédito. ¿Te llama Javier hoy y lo cerráis en 15 minutos?']],
        ev: [[23, 'web', 'Visita la página de precios in-company']] },
      { id: 'f02', n: 'Álvaro Méndez', rol: 'Jefe de Proyectos', seg: 'particular', ciudad: 'Madrid', prod: 'Certificación en Gestión de Proyectos', orig: 'c5', canal: 'wa', etapa: 3, valor: 1450, creado: 26 * H, act: 17, toque: 20,
        f: { exp: 6, empresaPaga: true }, s: { visitas: 3, precio: true, conv: true, emails: 2 },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Álvaro, soy Lucía, de admisiones. ¿La certificación la quieres para tu puesto actual?'], [25 * H, 'c', 'wa', 'Sí, me la pide la empresa para este año.'], [60, 'a', 'wa', 'Genial. La próxima convocatoria empieza el 14 de octubre. ¿Te cuento cómo se bonifica?'], [17, 'c', 'wa', '¿Cuánto cuesta en total y si hay plazas para octubre?']] },
      { id: 'f03', n: 'Nerea Galán', rol: 'Responsable de Formación', emp: 'Transportes Ebro Norte', seg: 'empresa', tam: 260, ciudad: 'Logroño', prod: 'Formación in-company bonificada', orig: 'c2', canal: 'email', etapa: 4, valor: 9600, creado: 9 * D, act: 5 * H, toque: 5 * D,
        s: { fundae: true, prop: 5 * D, propVista: 3, visitas: 2 },
        conv: [[9 * D, 'a', 'email', 'Hola Nerea, te escribo por la formación bonificada para tu equipo de tráfico.'], [8 * D, 'c', 'email', 'Nos interesa para 30 personas. ¿Nos enviáis propuesta?'], [5 * D, 'h', 'email', 'Te envío la propuesta in-company con el cálculo de bonificación.']],
        ev: [[5 * H, 'web', 'Abre la propuesta por tercera vez']] },
      { id: 'f04', n: 'Sergio Blanco', rol: 'Analista financiero', seg: 'particular', ciudad: 'Valencia', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'wa', etapa: 1, valor: 690, creado: 12, act: 12, toque: null,
        f: { exp: 4 }, s: { visitas: 1 }, conv: [] },
      { id: 'f05', n: 'Lucía Ferrer', rol: 'Técnica de Selección', seg: 'particular', ciudad: 'Barcelona', prod: 'Máster en Dirección de Personas', orig: 'c1', canal: 'wa', etapa: 4, valor: 3900, creado: 6 * D, act: 3 * H, toque: 20 * H,
        f: { exp: 4, empresaPaga: false }, s: { cita: 22 * H, citaOk: false, precio: true, financia: true, visitas: 2 },
        conv: [[6 * D, 'a', 'wa', 'Hola Lucía, soy Lucía también, de admisiones. ¿Buscas el máster para cambiar de puesto?'], [6 * D - 30, 'c', 'wa', 'Sí, quiero pasar a HRBP.'], [2 * D, 'a', 'wa', 'Te dejo la entrevista con Elena mañana a las 11:00. ¿Te va bien?'], [2 * D - 20, 'c', 'wa', 'Perfecto, ¿y se puede pagar a plazos?'], [20 * H, 'a', 'wa', 'Sí, en diez plazos sin intereses. Nos vemos mañana.']] },
      { id: 'f06', n: 'Jorge Castillo', rol: 'Gerente', emp: 'Clínicas Dentales Albora', seg: 'empresa', tam: 65, ciudad: 'Málaga', prod: 'Formación in-company bonificada', orig: 'c2', canal: 'tel', etapa: 1, valor: 5200, creado: 34, act: 34, toque: null,
        s: { fundae: true }, conv: [] },
      { id: 'f07', n: 'Paula Rincón', rol: 'Controller', seg: 'particular', ciudad: 'Bilbao', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'wa', etapa: 2, valor: 690, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { exp: 7, empresaPaga: true }, s: { visitas: 2, precio: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Paula, soy Lucía, de admisiones. ¿El curso es para ti o para tu equipo?'], [4 * D, 'c', 'wa', 'Para mí, aunque igual se apunta alguien más del equipo. ¿Precio?'], [4 * D - 5, 'a', 'wa', 'Son 690 €, y si lo paga la empresa se bonifica. ¿Cuántos seríais?']] },
      { id: 'f08', n: 'Raúl Serrano', rol: 'Director de Operaciones', emp: 'Hoteles Costa Brava', seg: 'empresa', tam: 140, ciudad: 'Girona', prod: 'Programa de Liderazgo (in-company)', orig: 'c3', canal: 'wa', etapa: 3, valor: 7800, creado: 12 * D, act: 6 * D, toque: 6 * D,
        s: { fundae: true, visitas: 2, precio: true },
        conv: [[12 * D, 'a', 'wa', 'Hola Raúl, ¿para cuántos jefes de departamento sería?'], [11 * D, 'c', 'wa', 'Unos doce. Antes de temporada alta.'], [6 * D, 'a', 'wa', 'Te paso el programa y el cálculo con vuestro crédito.'], [6 * D - 30, 'c', 'wa', 'Vale, lo miro con dirección.']] },
      { id: 'f09', n: 'Irene Molina', rol: 'Responsable de Talento', emp: 'Seguros Atalaya', seg: 'empresa', tam: 900, ciudad: 'Madrid', prod: 'Programa de Liderazgo (in-company)', orig: 'c3', canal: 'email', etapa: 5, valor: 16500, creado: 40 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        s: { fundae: true, exp: true, expTxt: 'Ha preguntado por una segunda edición para otra sede', visitas: 2 },
        conv: [[2 * D, 'c', 'email', 'La primera edición ha ido muy bien. ¿Podríamos repetirla en la sede de Sevilla en primavera?']] },
      { id: 'f10', n: 'Daniel Prieto', rol: 'Consultor de RR. HH.', seg: 'particular', ciudad: 'Sevilla', prod: 'Máster en Dirección de Personas', orig: 'c1', canal: 'wa', etapa: 4, valor: 3900, creado: 11 * D, act: 3 * D, toque: 3 * D,
        f: { exp: 5 }, s: { noshow: true, precio: true, visitas: 3 },
        conv: [[11 * D, 'a', 'wa', 'Hola Daniel, soy Lucía, de admisiones. ¿Qué te gustaría conseguir con el máster?'], [10 * D, 'c', 'wa', 'Dar el salto a dirección. Me cuadra empezar en octubre.'], [4 * D, 'a', 'wa', 'Te espero mañana a las 17:00 con Elena.']],
        ev: [[3 * D, 'sistema', 'No se presenta a la entrevista']] },
      // --- Dijeron «más adelante»
      { id: 'f11', n: 'Marina Soto', rol: 'Técnica de PRL', seg: 'particular', ciudad: 'Oviedo', prod: 'Máster en Dirección de Personas', orig: 'c1', canal: 'wa', etapa: 3, valor: 3900, creado: 24 * D, act: 20 * D, toque: 20 * D,
        f: { exp: 3 }, s: { luego: 'enero', luegoTxt: 'empezaría en la convocatoria de enero', precio: true },
        conv: [[24 * D, 'a', 'wa', 'Hola Marina, ¿buscas empezar este curso?'], [20 * D, 'c', 'wa', 'Me encanta pero este trimestre no llego. Empezaría en la convocatoria de enero.']] },
      { id: 'f12', n: 'Hugo Navarro', rol: 'Jefe de Equipo', seg: 'particular', ciudad: 'Murcia', prod: 'Certificación en Gestión de Proyectos', orig: 'c5', canal: 'wa', etapa: 2, valor: 1450, creado: 30 * D, act: 28 * D, toque: 28 * D,
        f: { exp: 5 }, s: { luego: 'febrero', luegoTxt: 'lo haría en la convocatoria de febrero, cuando cierre el proyecto actual' },
        conv: [[30 * D, 'a', 'wa', 'Hola Hugo, ¿la certificación te la pide tu empresa?'], [28 * D, 'c', 'wa', 'No, es para mí. Pero estoy hasta arriba: la haría en la convocatoria de febrero, cuando cierre el proyecto actual.']] },
      { id: 'f13', n: 'Elena Ruiz', rol: 'Directora de Personas', emp: 'Cooperativa Agrícola del Segura', seg: 'empresa', tam: 210, ciudad: 'Murcia', prod: 'Formación in-company bonificada', orig: 'c2', canal: 'email', etapa: 3, valor: 8800, creado: 45 * D, act: 35 * D, toque: 35 * D,
        s: { fundae: true, luego: 'noviembre', luegoTxt: 'lo retomaría en noviembre, cuando tengan el plan de formación del año que viene' },
        conv: [[40 * D, 'h', 'email', 'Te comparto dos opciones de calendario para el programa.'], [35 * D, 'c', 'email', 'Gracias. Lo retomamos en noviembre, cuando tengamos el plan de formación del año que viene.']] },
      { id: 'f14', n: 'Iván Herrera', rol: 'Administrativo contable', seg: 'particular', ciudad: 'Valladolid', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'wa', etapa: 2, valor: 690, creado: 15 * D, act: 13 * D, toque: 13 * D,
        f: { exp: 2 }, s: { luego: 'enero', luegoTxt: 'empezaría en la próxima convocatoria, en enero', precio: true },
        conv: [[15 * D, 'a', 'wa', 'Hola Iván, ¿el curso te lo pagaría tu empresa?'], [13 * D, 'c', 'wa', 'No, lo pago yo. Ahora no puedo, empezaría en la próxima convocatoria, en enero.']] },
      // --- Sin seguimiento después de contestar
      { id: 'f15', n: 'Cristina Pardo', rol: 'HR Business Partner', seg: 'particular', ciudad: 'Madrid', prod: 'Máster en Dirección de Personas', orig: 'c1', canal: 'wa', etapa: 3, valor: 3900, creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: { exp: 6, empresaPaga: true }, s: { visitas: 2, conv: true },
        conv: [[8 * D, 'a', 'wa', 'Hola Cristina, soy Lucía, de admisiones. ¿Qué te llevó a mirar el máster?'], [7 * D, 'c', 'wa', 'Mi empresa me lo financia si empiezo este año. ¿Cuándo es la siguiente convocatoria?'], [5 * D, 'h', 'wa', 'Te lo confirmo esta semana.']] },
      { id: 'f16', n: 'Andrés Fuentes', rol: 'Responsable de Administración', emp: 'Talleres Fuentes', seg: 'empresa', tam: 28, ciudad: 'Burgos', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'wa', etapa: 2, valor: 2070, creado: 10 * D, act: 7 * D, toque: 7 * D,
        s: { fundae: true, precio: true },
        conv: [[10 * D, 'a', 'wa', 'Hola Andrés, ¿el curso sería para ti o para varias personas?'], [9 * D, 'c', 'wa', 'Para tres personas de administración. ¿Precio de grupo?'], [7 * D, 'h', 'wa', 'Lo miro y te digo.']] },
      { id: 'f17', n: 'Beatriz Lozano', rol: 'Project Manager', seg: 'particular', ciudad: 'Zaragoza', prod: 'Certificación en Gestión de Proyectos', orig: 'c5', canal: 'wa', etapa: 3, valor: 1450, creado: 7 * D, act: 4 * D, toque: 4 * D,
        f: { exp: 4 }, s: { visitas: 2, emails: 3 },
        conv: [[7 * D, 'a', 'wa', 'Hola Beatriz, ¿buscas la certificación para este año?'], [6 * D, 'c', 'wa', 'Sí, antes de marzo si puede ser.'], [4 * D, 'a', 'wa', 'Te envío el calendario de las próximas fechas.']] },
      { id: 'f18', n: 'Tomás Ibáñez', rol: 'Coordinador de Formación', emp: 'Ayuda a Domicilio Levante', seg: 'empresa', tam: 320, ciudad: 'Alicante', prod: 'Formación in-company bonificada', orig: 'c2', canal: 'wa', etapa: 3, valor: 6400, creado: 14 * D, act: 9 * D, toque: 9 * D,
        s: { fundae: true, fundaeQ: true },
        conv: [[14 * D, 'a', 'wa', 'Hola Tomás, ¿para qué perfiles buscáis la formación?'], [13 * D, 'c', 'wa', 'Coordinadoras de zona. ¿Nos gestionáis vosotros la bonificación?'], [9 * D, 'a', 'wa', 'Sí, la gestionamos nosotros. ¿Hablamos 15 minutos?']] },
      // --- Nuevos o en cadencia sin respuesta
      { id: 'f19', n: 'Silvia Campos', rol: 'Técnica de Nóminas', seg: 'particular', ciudad: 'Toledo', prod: 'Máster en Dirección de Personas', orig: 'c1', canal: 'wa', etapa: 1, valor: 3900, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { exp: 2 }, s: { intentos: 1 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Silvia, soy Lucía, de admisiones. ¿Buscas el máster para cambiar de puesto?']] },
      { id: 'f20', n: 'Óscar Delgado', rol: 'Estudiante', seg: 'particular', ciudad: 'Granada', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'wa', etapa: 1, valor: 690, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { estudiante: true, gratis: true }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Óscar, ¿el curso es para tu trabajo actual?']] },
      { id: 'f21', n: 'Natalia Gil', rol: 'Responsable de Compras', emp: 'Suministros Industriales Norte', seg: 'empresa', tam: 75, ciudad: 'Santander', prod: 'Certificación en Gestión de Proyectos', orig: 'c5', canal: 'email', etapa: 1, valor: 4350, creado: 4 * D, act: 30 * H, toque: 4 * D - 2,
        s: { visitas: 3, fundae: true, intentos: 2, emails: 2 },
        conv: [[4 * D - 2, 'a', 'email', 'Hola Natalia, te escribo por la certificación para tu equipo.']] },
      { id: 'f22', n: 'Pablo Reyes', rol: 'Técnico de Calidad', seg: 'particular', ciudad: 'Vigo', prod: 'Certificación en Gestión de Proyectos', orig: 'c5', canal: 'tel', etapa: 1, valor: 1450, creado: 5 * H, act: 5 * H, toque: 5 * H - 2,
        f: { exp: 3 }, s: { intentos: 1 },
        conv: [[5 * H - 2, 'a', 'wa', 'Hola Pablo, soy Lucía, de admisiones. ¿Te llamo en 5 minutos o prefieres por aquí?']] },
      { id: 'f23', n: 'Laura Esteban', rol: 'Directora General', emp: 'Academia de Idiomas Bravo', seg: 'empresa', tam: 18, ciudad: 'Salamanca', prod: 'Programa de Liderazgo (in-company)', orig: 'c3', canal: 'wa', etapa: 1, valor: 3600, creado: 55, act: 50, toque: null,
        s: { visitas: 2 }, conv: [] },
      { id: 'f24', n: 'Mario Cano', rol: 'Recepcionista', seg: 'particular', ciudad: 'Cádiz', prod: 'Máster en Dirección de Personas', orig: 'c1', canal: 'wa', etapa: 1, valor: 3900, creado: 25 * D, act: 25 * D, toque: 18 * D, f: { exp: 0 }, s: { intentos: 3 },
        conv: [[25 * D, 'a', 'wa', 'Hola Mario, ¿buscas el máster para este curso?']] },
      { id: 'f25', n: 'Rocío Aguilar', rol: 'Administrativa', seg: 'particular', ciudad: 'Córdoba', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'wa', etapa: 1, valor: 690, creado: 18 * D, act: 18 * D, toque: 12 * D, f: { exp: 1, gratis: true }, s: { intentos: 3 },
        conv: [[18 * D, 'a', 'wa', 'Hola Rocío, ¿el curso lo quieres para tu puesto actual?']] },
      { id: 'f26', n: 'Enrique Vega', rol: 'Director Financiero', emp: 'Distribuciones Vega', seg: 'empresa', tam: 55, ciudad: 'Pamplona', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'email', etapa: 1, valor: 3450, creado: 3 * H, act: 2 * H, toque: 3 * H - 1,
        s: { visitas: 2, fundae: true },
        conv: [[3 * H - 1, 'a', 'email', 'Hola Enrique, te escribo por el curso de Excel e IA para tu equipo financiero.']] },
      // --- Entrevistas y cualificados en marcha
      { id: 'f27', n: 'Alicia Moreno', rol: 'Técnica de Formación', seg: 'particular', ciudad: 'Madrid', prod: 'Máster en Dirección de Personas', orig: 'c6', canal: 'wa', etapa: 4, valor: 3900, creado: 5 * D, act: 6 * H, toque: 6 * H,
        f: { exp: 3 }, s: { cita: 50 * H, citaOk: true, visitas: 2 },
        conv: [[5 * D, 'a', 'wa', 'Hola Alicia, ¿qué te gustaría conseguir con el máster?'], [5 * D - 60, 'c', 'wa', 'Llevar la formación de mi empresa.'], [6 * H, 'a', 'wa', 'Confirmada la entrevista del viernes a las 12:00.'], [6 * H - 10, 'c', 'wa', 'Perfecto, allí estaré.']] },
      { id: 'f28', n: 'Víctor Sanz', rol: 'Mando intermedio', seg: 'particular', ciudad: 'Valencia', prod: 'Certificación en Gestión de Proyectos', orig: 'c5', canal: 'wa', etapa: 3, valor: 1450, creado: 3 * D, act: 20 * H, toque: 20 * H,
        f: { exp: 8, empresaPaga: true }, s: { visitas: 1 },
        conv: [[3 * D, 'a', 'wa', 'Hola Víctor, ¿la certificación es para tu puesto?'], [3 * D - 40, 'c', 'wa', 'Sí, me la paga la empresa.'], [20 * H, 'a', 'wa', '¿Te viene bien una llamada de 15 minutos esta semana?']] },
      { id: 'f29', n: 'Susana Ortiz', rol: 'Responsable de Personas', emp: 'Bodegas Ribera Alta', seg: 'empresa', tam: 48, ciudad: 'Aranda de Duero', prod: 'Programa de Liderazgo (in-company)', orig: 'c3', canal: 'wa', etapa: 4, valor: 4800, creado: 7 * D, act: 2 * H, toque: 2 * H,
        s: { fundae: true, cita: 3 * D, citaOk: true, visitas: 2 },
        conv: [[7 * D, 'a', 'wa', 'Hola Susana, ¿para cuántas personas sería?'], [6 * D, 'c', 'wa', 'Ocho encargados. Después de vendimia.'], [2 * H, 'a', 'wa', 'Reunión confirmada el lunes a las 9:30.']] },
      { id: 'f30', n: 'Adrián Romero', rol: 'Contable', seg: 'particular', ciudad: 'Palma', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'wa', etapa: 2, valor: 690, creado: 2 * D, act: 30, toque: 90,
        f: { exp: 3 }, s: { visitas: 1 },
        conv: [[2 * D, 'a', 'wa', 'Hola Adrián, ¿buscas el curso para tu trabajo?'], [90, 'a', 'wa', '¿Te cuento cómo es el temario?'], [30, 'c', 'wa', 'Sí, ¿cuántas horas son a la semana?']] },
      // --- Encaje bajo o fuera
      { id: 'f31', n: 'Martina López', rol: 'Estudiante de Psicología', seg: 'particular', ciudad: 'Buenos Aires', prod: 'Máster en Dirección de Personas', orig: 'c1', canal: 'wa', etapa: 2, valor: 3900, creado: 4 * D, act: 3 * D, toque: 3 * D,
        f: { estudiante: true, fuera: true }, s: { precio: true },
        conv: [[4 * D, 'a', 'wa', 'Hola Martina, ¿buscas el máster para este curso?'], [3 * D, 'c', 'wa', 'Hola, soy de Argentina, ¿hay becas completas?']] },
      { id: 'f32', n: 'Gonzalo Peña', rol: 'Autónomo', seg: 'particular', ciudad: 'Huelva', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'wa', etapa: 2, valor: 690, creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { exp: 1, gratis: true }, s: { ppto: 'no' },
        conv: [[6 * D, 'a', 'wa', 'Hola Gonzalo, ¿el curso lo quieres para tu negocio?'], [5 * D, 'c', 'wa', 'Buscaba algo gratuito, la verdad.']] },
      { id: 'f33', n: 'Clara Benítez', rol: 'Recién titulada', seg: 'particular', ciudad: 'León', prod: 'Certificación en Gestión de Proyectos', orig: 'c5', canal: 'email', etapa: 1, valor: 1450, creado: 9 * D, act: 9 * D, toque: 7 * D, f: { estudiante: true }, s: { intentos: 3 },
        conv: [[9 * D, 'a', 'email', 'Hola Clara, te escribo por la certificación.']] },
      // --- Ya matriculados / alumnos
      { id: 'f34', n: 'Fernando Gallego', rol: 'Director de Planta', emp: 'Cerámicas del Mediterráneo', seg: 'empresa', tam: 310, ciudad: 'Castellón', prod: 'Programa de Liderazgo (in-company)', orig: 'c3', canal: 'email', etapa: 6, valor: 9800, creado: 70 * D, act: 9 * D, toque: 9 * D, fin: 'ganado',
        s: { fundae: true }, conv: [] },
      { id: 'f35', n: 'Eva Marín', rol: 'Técnica de RR. HH.', seg: 'particular', ciudad: 'Madrid', prod: 'Máster en Dirección de Personas', orig: 'c1', canal: 'wa', etapa: 5, valor: 3900, creado: 20 * D, act: 2 * D, toque: 2 * D, fin: 'ganado', f: { exp: 4 }, s: {}, conv: [] },
      { id: 'f36', n: 'Ramón Cortés', rol: 'Jefe de Obra', seg: 'particular', ciudad: 'Tarragona', prod: 'Certificación en Gestión de Proyectos', orig: 'c5', canal: 'wa', etapa: 5, valor: 1450, creado: 16 * D, act: 5 * D, toque: 5 * D, fin: 'ganado', f: { exp: 10 }, s: {}, conv: [] },
      { id: 'f37', n: 'Nuria Valls', rol: 'Responsable de Formación', emp: 'Farmacias Grupo Valls', seg: 'empresa', tam: 120, ciudad: 'Lleida', prod: 'Formación in-company bonificada', orig: 'c2', canal: 'email', etapa: 1, valor: 5600, creado: 22 * D, act: 22 * D, toque: 15 * D, fin: 'perdido', s: { fundae: true, intentos: 3 }, conv: [] },
      // --- Empresas medianas en cualificación
      { id: 'f38', n: 'Diego Salas', rol: 'CEO', emp: 'Ingeniería Salas & Asociados', seg: 'empresa', tam: 35, ciudad: 'Madrid', prod: 'Programa de Liderazgo (in-company)', orig: 'c6', canal: 'wa', etapa: 2, valor: 4200, creado: 30 * H, act: 3 * H, toque: 28 * H,
        s: { fundae: true, visitas: 2 },
        conv: [[30 * H - 1, 'a', 'wa', 'Hola Diego, ¿para cuántos responsables sería el programa?'], [3 * H, 'c', 'wa', 'Para 6. ¿Se puede hacer por las tardes?']] },
      { id: 'f39', n: 'Teresa Márquez', rol: 'Técnica de Formación', emp: 'Grupo Sanitario Sur', seg: 'empresa', tam: 640, ciudad: 'Sevilla', prod: 'Formación in-company bonificada', orig: 'c2', canal: 'email', etapa: 1, valor: 12400, creado: 2 * D, act: 20 * H, toque: 2 * D - 3,
        s: { fundae: true, visitas: 1, emails: 2, intentos: 1 },
        conv: [[2 * D - 3, 'a', 'email', 'Hola Teresa, te escribo por la formación bonificada para vuestros mandos.']] },
      { id: 'f40', n: 'Luis Román', rol: 'Técnico de Sistemas', seg: 'particular', ciudad: 'Albacete', prod: 'Curso de Excel e IA para finanzas', orig: 'c4', canal: 'wa', etapa: 1, valor: 690, creado: 12 * D, act: 12 * D, toque: 8 * D, f: { exp: 2 }, s: { intentos: 3 },
        conv: [[12 * D, 'a', 'wa', 'Hola Luis, ¿el curso es para tu trabajo actual?']] }
    ]
  };
})();

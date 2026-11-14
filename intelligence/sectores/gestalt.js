/* Sector: Institut Gestalt (escuela de formación en terapia y acompañamiento: Barcelona, Madrid y online). Preparado el 9-nov para la
 * reunión con su director. Recorrido según su web: piden el dosier → presentación gratuita por Zoom → entrevista previa → reserva de
 * plaza de 454 € → matrícula. La matrícula de referencia de la Formación en Terapia Gestalt (2.270 €) es de su web; los importes del
 * resto de programas, la inversión (unos 3.000 €/mes), el embudo, las personas y los mensajes son DATOS SIMULADOS de ejemplo. */
(function () {
  const H = 60, D = 1440;

  const Q = window.QV.voz;
  const TG = 'Formación en Terapia Gestalt', CF = 'Constelaciones Familiares', CTI = 'Constelaciones en Terapia Individual (online)',
    PNL = 'PNL', COA = 'Coaching', TRA = 'Trauma', TC = 'Terapia corporal';
  // 2.270 € es la matrícula de referencia de su web; el resto son importes de ejemplo.
  const P = {}; P[TG] = 2270; P[CF] = 1800; P[CTI] = 1400; P[PNL] = 1200; P[COA] = 1500; P[TRA] = 1300; P[TC] = 1500;

  // Historia principal: la entrevista queda dos días laborables después, a las 11:00.
  const ent = Q.hueco(11), pres = Q.hueco(19);
  const MIN_HISTORIA = 1 + 1 + 5 + 9 + 1 + 90 + 2;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.gestalt = {
    id: 'gestalt',
    nombre: 'Institut Gestalt',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'formación',
      paginaVisitas: 'la página de la formación', cita: 'entrevista previa', Cita: 'Entrevista previa', laCita: 'la entrevista previa',
      propuesta: 'la reserva de plaza', Propuesta: 'Reserva de plaza', propuestas: 'reservas de plaza', comercial: 'Montse', Comercial: 'Montse',
      cliente: 'alumno', unCliente: 'un alumno', clientes: 'alumnos', convierten: 'se matriculan', objetivoPaso: 'apuntarse a la presentación gratuita por Zoom',
      casoExito: 'el testimonio de un antiguo alumno que ya acompaña procesos', valorAlto: 2000, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la matrícula', Producto: 'Formación',
      verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'personas del equipo',
      pasoHumano: 'hacer la entrevista previa y acompañar la reserva de plaza'
    },
    // Recorrido: Anuncio → Pide el dosier → Contactado → Presentación por Zoom → Entrevista previa → Reserva de plaza → Matrícula
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'dosier', txt: 'Pide el dosier' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'presentacion', txt: 'Presentación por Zoom' },
      { id: 'entrevista', txt: 'Entrevista previa' },
      { id: 'reserva', txt: 'Reserva de plaza (454 €)' },
      { id: 'matricula', txt: 'Matrícula' }
    ],
    ventaEtapa: 'matricula',
    ticket: 2270,
    // Qué conversión es razonable en cada paso cuando se contesta a tiempo y se hace seguimiento (referencia de ejemplo).
    referencia: { contactado: 0.9, presentacion: 0.5, entrevista: 0.6, reserva: 0.6, matricula: 0.9 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'peticiones del formulario instantáneo que esperan horas a recibir el dosier' },
      presentacion: { txt: 'Asistencia a la presentación', exp: 'personas que piden el dosier y nunca se conectan a la presentación por Zoom' },
      entrevista: { txt: 'Paso a entrevista', exp: 'asistentes a la presentación a los que nadie les propone la entrevista previa' },
      reserva: { txt: 'Reserva de plaza', exp: 'entrevistas que no terminan en la reserva de 454 €: «me lo pienso», fechas o forma de pago' },
      matricula: { txt: 'Matrícula', exp: 'reservas que no completan la matrícula' }
    },
    remedioFuga: {
      contactado: 'Respuesta en minutos por WhatsApp, a cualquier hora, con el dosier y la fecha de la próxima presentación. Los mensajes los aprueba el Institut.',
      presentacion: 'Recordatorios el día antes y una hora antes de la presentación, con el enlace de Zoom; a quien no se conecta, la grabación y la siguiente fecha.',
      entrevista: 'Al terminar la presentación, propuesta de entrevista previa con huecos reales del equipo. La entrevista la hace siempre una persona del Institut.'
    },
    mesDatos: { respuestaAntes: 320, respuestaAhora: 2, agendadas: 44 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Carrusel · Formación en Terapia Gestalt (formulario instantáneo)', inversion: 1500, ticket: P[TG],
        embudo: { anuncio: 98000, dosier: 62, contactado: 41, presentacion: 15, entrevista: 8, reserva: 4, matricula: 3 } },
      { id: 'c2', canal: 'Meta', nombre: 'Dinámico · Constelaciones en Terapia Individual (online)', inversion: 800, ticket: P[CTI],
        embudo: { anuncio: 41000, dosier: 21, contactado: 18, presentacion: 11, entrevista: 7, reserva: 4, matricula: 4 } },
      { id: 'c3', canal: 'Meta', nombre: 'Formulario · Constelaciones Familiares', inversion: 450, ticket: P[CF],
        embudo: { anuncio: 26000, dosier: 14, contactado: 10, presentacion: 5, entrevista: 3, reserva: 2, matricula: 1 } },
      { id: 'c4', canal: 'Emagister', nombre: 'Emagister · fichas de PNL, coaching y terapia', inversion: 250, ticket: P[COA],
        embudo: { anuncio: 3200, dosier: 12, contactado: 7, presentacion: 2, entrevista: 1, reserva: 0, matricula: 0 } },
      { id: 'c5', canal: 'Web', nombre: 'Web y buscadores (orgánico)', inversion: 0, ticket: P[TG],
        embudo: { anuncio: 6400, dosier: 16, contactado: 14, presentacion: 9, entrevista: 6, reserva: 4, matricula: 4 } },
      { id: 'c6', canal: 'WhatsApp', nombre: 'WhatsApp directo', inversion: 0, ticket: P[CF],
        embudo: { anuncio: 1200, dosier: 9, contactado: 9, presentacion: 5, entrevista: 4, reserva: 3, matricula: 3 } },
      { id: 'c7', canal: 'Antiguos alumnos', nombre: 'Antiguos alumnos y recomendación', inversion: 0, ticket: P[TC],
        embudo: { anuncio: 900, dosier: 8, contactado: 8, presentacion: 6, entrevista: 5, reserva: 4, matricula: 4 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'sinReserva', 'ventas', 'cpv', 'ingresos'],
    kpiNombres: { interesados: 'Peticiones de dosier', cualificados: 'Asisten a la presentación', entrevistas: 'Entrevistas previas', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'dosier', cualificados: 'presentacion', entrevistas: 'entrevista' },
    kpiCustom: function (m, cfg, M) {
      return {
        sinReserva: { l: 'Entrevista sin reserva', v: M.num(m.tot.entrevista - m.tot.reserva), em: M.pct(1 - m.tot.reserva / Math.max(1, m.tot.entrevista)) + ' de las entrevistas', clase: 'mal' }
      };
    },

    reglas: {
      fitBase: 40,
      fit: [
        [function (c) { return c.f && c.f.acompana; }, 18, function (c) { return 'ya acompaña procesos (' + String(c.rol || '').toLowerCase() + ')'; }, 'Ya acompaña procesos'],
        [function (c) { return c.f && c.f.formPrevia; }, 10, 'formación previa en psicología, salud o educación', 'Formación previa en psicología, salud o educación'],
        [function (c) { return c.valor >= 2000; }, 8, 'formación larga (Terapia Gestalt)'],
        [function (c) { return c.f && c.f.taller; }, -10, 'busca un taller suelto, no una formación'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca algo gratuito']
      ],
      intencion: [
        [function (c) { return c.s.presentacion; }, 14, 'asistió a la presentación por Zoom'],
        [function (c) { return c.s.conv; }, 12, 'quiere empezar en la próxima edición'],
        [function (c) { return c.s.temario; }, 8, 'abrió el dosier'],
        [function (c) { return c.s.financia; }, 10, 'preguntó por el pago fraccionado'],
        [function (c) { return c.s.carrito; }, 18, 'empezó la reserva de 454 € en la web y no la terminó']
      ]
    },

    preguntas: [
      { q: '¿Quién tiene más probabilidad de matricularse?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Quién pidió el dosier y no se ha apuntado a la presentación?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa <= 2; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas pidieron el dosier y todavía no tienen plaza en la presentación por Zoom. Es la parte de la inversión que hoy se pierde.'; }, vista: 'tabla' },
      { q: '¿Quién empezó la reserva de 454 € y no la terminó?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !!c.s.carrito && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas empezaron la reserva de plaza en la web y no la terminaron. Montse recibe el aviso con su ficha.'; }, vista: 'tabla' },
      { q: '¿Quién dijo «más adelante» y cuándo?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que lo retomarían, cada uno con su fecha. Ninguno es un no.'; }, vista: 'tabla' },
      { q: '¿Qué interesados llevan demasiado tiempo sin respuesta?', h: 'sinSeguimiento', obj: ['seguimiento', 'todo'] },
      { q: '¿Qué anuncio trae matrículas y no solo formularios?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Quién ya acompaña procesos y pregunta por las Constelaciones en Terapia Individual?', h: 'lista', obj: ['ventas', 'expansion', 'todo'],
        filtro: function (c) { return c.prod === CTI && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' profesionales abiertos para Constelaciones en Terapia Individual (online, inicio el 17 de febrero). Ordenados por probabilidad de matrícula.'; }, vista: 'tabla' }
    ],

    historias: {
      dosier: {
        titulo: 'Núria pide el dosier desde el carrusel y, sin esperar al día siguiente, llega a la presentación y a la entrevista con Montse',
        contacto: { id: 'demo', n: 'Núria Casas', rol: 'Psicóloga sanitaria', seg: 'particular', ciudad: '—', prod: TG, orig: 'c1', canal: 'wa', etapa: 1, valor: P[TG], creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Núria rellena el formulario instantáneo del carrusel «Formación Terapia Gestalt»', feed: 'Nueva petición de dosier · ' + TG, cambio: {} },
          { dur: 6, min: 1, txt: 'El formulario ya filtra: perfil profesional, qué formación le interesa y cuándo quiere empezar', feed: 'Ficha completada · Barcelona · psicóloga · quiere empezar en la próxima edición', cambio: { ciudad: 'Barcelona', f: { acompana: true, formPrevia: true } } },
          { dur: 7, min: 1, txt: 'En el minuto uno le llega por WhatsApp el dosier y la fecha de la próxima presentación gratuita por Zoom', feed: 'WhatsApp enviado en 48 segundos · dosier y presentación', toque: true,
            cambio: { conv: ['a', 'wa', 'Hola Núria, te escribimos desde admisiones del Institut Gestalt 😊 Aquí tienes el dosier de la Formación en Terapia Gestalt. La próxima presentación gratuita por Zoom es el ' + pres.txt + ' a las 19:00: conocerás al equipo docente y podrás preguntar lo que quieras. ¿Te reservo un lugar?'] } },
          { dur: 6, min: 5, txt: 'Núria abre el dosier y vuelve a la página de la formación', feed: 'Abre el dosier · visita la página de la formación (2 veces)', cambio: { s: { temario: true, visitas: 2 } }, act: true },
          { dur: 7, min: 9, txt: 'Contesta: es psicóloga y quiere saber si la formación le sirve para su consulta', feed: 'Respuesta recibida · psicóloga con consulta · pregunta por el pago', cambio: { etapa: 2, s: { precio: true, financia: true }, conv: ['c', 'wa', 'Sí, apúntame. Soy psicóloga y tengo consulta en Gràcia, ¿la formación me sirve para incorporarla a mi trabajo? ¿Y se puede pagar fraccionado?'] }, act: true },
          { dur: 7, min: 1, txt: 'El asistente responde con la información que ha aprobado el Institut y la apunta a la presentación', feed: 'Apuntada a la presentación por Zoom · recordatorios programados', toque: true,
            cambio: { conv: ['a', 'wa', 'Te he apuntado 🙌 Muchas personas que hacen la formación ya acompañan procesos y la incorporan a su consulta; en la presentación lo verás con ejemplos. Las condiciones de pago te las explica Montse en la entrevista previa. Te mando el enlace de Zoom el mismo día.'] } },
          { dur: 7, min: 90, txt: 'Recordatorio con el enlace de Zoom y Núria se conecta a la presentación', feed: 'Asiste a la presentación por Zoom · se queda al turno de preguntas', act: true,
            cambio: { etapa: 3, s: { presentacion: true, conv: true, urg: true, urgTxt: 'quiere empezar en la próxima edición' }, conv: ['c', 'wa', 'Me ha encantado la presentación. Quiero dar el paso.'] } },
          { dur: 7, min: 2, txt: 'Al terminar, el asistente le propone la entrevista previa con huecos reales de Montse', feed: 'Entrevista previa agendada · ' + ent.txt + ' 11:00 con Montse', vista: 'agenda', toque: true,
            cambio: { etapa: 4, s: { cita: ent.min - MIN_HISTORIA, citaOk: true }, conv: ['a', 'wa', '¡Qué bien, Núria! El siguiente paso es una entrevista previa con Montse, de admisiones: os conocéis, te cuenta fechas y forma de pago y resuelve tus dudas. ¿Te va bien el ' + ent.txt + ' a las 11:00?'] } },
          { dur: 0, min: 1, txt: 'Aviso a Montse con la ficha completa', feed: 'Aviso enviado a Montse', humano: { titulo: 'Núria, entrevista previa el ' + ent.txt + ' a las 11:00', texto: 'Barcelona · psicóloga sanitaria con consulta en Gràcia · vino del carrusel de Terapia Gestalt · abrió el dosier y asistió a la presentación por Zoom · pregunta por el pago fraccionado. Siguiente paso: reserva de plaza de 454 €.' } }
        ]
      },
      cti: {
        titulo: 'Una coach que ya acompaña procesos ve el anuncio de Constelaciones en Terapia Individual y llega a la presentación del 27 de enero',
        contacto: { id: 'demo', n: 'Elena Robles', rol: 'Coach con consulta online', seg: 'particular', ciudad: '—', prod: CTI, orig: 'c2', canal: 'wa', etapa: 1, valor: P[CTI], creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una petición del anuncio «¿Acompañas procesos individuales y quieres incorporar las Constelaciones Familiares a tu consulta?»', feed: 'Nueva petición de dosier · ' + CTI, cambio: {} },
          { dur: 6, min: 1, txt: 'La ficha se completa con lo que contestó en el formulario', feed: 'Ficha completada · online (Valencia) · coach con consulta propia', cambio: { ciudad: 'Online (Valencia)', f: { acompana: true } } },
          { dur: 7, min: 1, txt: 'Le llega el dosier y las fechas reales del programa', feed: 'WhatsApp enviado en 39 segundos · dosier y presentación del 27 de enero', toque: true,
            cambio: { conv: ['a', 'wa', 'Hola Elena, te escribimos desde admisiones del Institut Gestalt. Aquí tienes el dosier de Constelaciones Familiares en Terapia Individual: es online, empieza el 17 de febrero y es los miércoles de 17 a 21 h. La presentación gratuita por Zoom es el 27 de enero. ¿Te apunto?'] } },
          { dur: 7, min: 6, txt: 'Elena contesta y cuenta su caso', feed: 'Respuesta · coach con consulta · quiere incorporarlo a sus sesiones', cambio: { etapa: 2, s: { temario: true, conv: true }, conv: ['c', 'wa', 'Sí, apúntame. Acompaño procesos individuales online desde hace 6 años y quiero incorporarlo a mis sesiones. ¿Hace falta haber hecho constelaciones antes?'] }, act: true },
          { dur: 7, min: 1, txt: 'Esa duda la resuelve una persona: aviso a Montse', feed: 'Pregunta de requisitos · aviso a Montse', toque: true,
            cambio: { conv: ['a', 'wa', 'Te apunto a la presentación del 27 de enero. Lo de los requisitos te lo confirma Montse, de admisiones, para que te lo diga con precisión.'] } },
          { dur: 0, min: 1, txt: 'Aviso a Montse', feed: 'Aviso enviado a Montse', humano: { titulo: 'Elena pregunta por los requisitos', texto: 'Online (Valencia) · coach con consulta propia desde hace 6 años · vino del anuncio dinámico de Constelaciones en Terapia Individual · apuntada a la presentación del 27 de enero. Pregunta si hace falta experiencia previa en constelaciones.' } }
        ]
      }
    },
    historiaDefecto: 'dosier',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'g01', n: 'Laia Vidal', rol: 'Psicóloga sanitaria', seg: 'particular', ciudad: 'Barcelona', prod: TG, orig: 'c1', canal: 'wa', etapa: 4, valor: P[TG], creado: 9 * D, act: 30, toque: 45,
        f: { acompana: true, formPrevia: true }, s: { presentacion: true, carrito: true, financia: true, visitas: 4, precio: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Laia, te escribimos desde admisiones del Institut Gestalt. Aquí tienes el dosier de la Formación en Terapia Gestalt.'], [2 * D, 'h', 'wa', 'Laia, un placer la entrevista de esta mañana. Te dejo el enlace para la reserva de plaza.'], [40, 'c', 'wa', 'He empezado la reserva de 454 € en la web pero no me ha dejado terminar el pago.'], [45, 'a', 'wa', 'Te lo resolvemos ahora: Montse te llama en 5 minutos y la terminas con ella.']],
        ev: [[30, 'web', 'Reserva de plaza de 454 € empezada y no terminada']] },
      { id: 'g02', n: 'Jordi Puig', rol: 'Educador social', seg: 'particular', ciudad: 'Barcelona', prod: TG, orig: 'c5', canal: 'wa', etapa: 3, valor: P[TG], creado: 5 * D, act: 2 * H, toque: 3 * H,
        f: { acompana: true, formPrevia: true }, s: { presentacion: true, conv: true, urg: true, urgTxt: 'quiere empezar en la próxima edición', visitas: 3 },
        conv: [[5 * D, 'a', 'wa', 'Hola Jordi, aquí tienes el dosier y la fecha de la próxima presentación por Zoom.'], [3 * H, 'a', 'wa', 'Gracias por venir a la presentación. ¿Te propongo la entrevista previa con Montse?'], [2 * H, 'c', 'wa', 'Sí, por favor. Mejor por la tarde, salgo del centro a las 16:00.']] },
      { id: 'g03', n: 'Carmen Ortiz', rol: 'Enfermera de salud mental', seg: 'particular', ciudad: 'Madrid', prod: TG, orig: 'c1', canal: 'wa', etapa: 4, valor: P[TG], creado: 6 * D, act: 5 * H, toque: 5 * H,
        f: { acompana: true, formPrevia: true }, s: { presentacion: true, cita: 20 * H, citaOk: true, visitas: 2 },
        conv: [[6 * D, 'a', 'wa', 'Hola Carmen, aquí tienes el dosier de la Formación en Terapia Gestalt.'], [4 * D, 'c', 'wa', 'Gracias. ¿Hay grupo en Madrid?'], [5 * H, 'a', 'wa', 'Te confirmo la entrevista previa con Montse mañana a las 10:00.']] },
      { id: 'g04', n: 'Marc Ferrer', rol: 'Coach ejecutivo', seg: 'particular', ciudad: 'Online (Bilbao)', prod: CTI, orig: 'c2', canal: 'wa', etapa: 2, valor: P[CTI], creado: 20 * H, act: 25, toque: 19 * H,
        f: { acompana: true }, s: { temario: true, conv: true, visitas: 2 },
        conv: [[20 * H - 1, 'a', 'wa', 'Hola Marc, aquí tienes el dosier de Constelaciones en Terapia Individual. La presentación gratuita por Zoom es el 27 de enero.'], [25, 'c', 'wa', 'Me interesa mucho para mis sesiones. ¿La presentación queda grabada si no puedo conectarme?']] },
      { id: 'g05', n: 'Ana Belén Prieto', rol: 'Maestra de primaria', seg: 'particular', ciudad: 'Madrid', prod: TG, orig: 'c1', canal: 'wa', etapa: 1, valor: P[TG], creado: 11, act: 11, toque: null,
        f: { formPrevia: true }, s: { visitas: 1 }, conv: [] },
      // --- Dijeron «más adelante»
      { id: 'g06', n: 'Sílvia Roca', rol: 'Fisioterapeuta', seg: 'particular', ciudad: 'Barcelona', prod: TC, orig: 'c7', canal: 'wa', etapa: 4, valor: P[TC], creado: 22 * D, act: 16 * D, toque: 16 * D,
        f: { acompana: true, formPrevia: true }, s: { presentacion: true, luego: 'enero', luegoTxt: 'reservaría en enero, cuando cierre el año en la clínica', precio: true },
        conv: [[17 * D, 'h', 'wa', 'Sílvia, gracias por la entrevista. Cuando quieras te paso el enlace de la reserva.'], [16 * D, 'c', 'wa', 'Me encaja mucho, pero hasta enero no puedo. Cuando cierre el año en la clínica.']] },
      { id: 'g07', n: 'Pablo Herrero', rol: 'Psicólogo', seg: 'particular', ciudad: 'Online (Sevilla)', prod: TRA, orig: 'c4', canal: 'email', etapa: 3, valor: P[TRA], creado: 30 * D, act: 25 * D, toque: 25 * D,
        f: { acompana: true, formPrevia: true }, s: { presentacion: true, luego: 'febrero', luegoTxt: 'lo retomará en febrero, después de las oposiciones' },
        conv: [[25 * D, 'c', 'email', 'La presentación me gustó, pero lo retomo en febrero, después de las oposiciones.']] },
      { id: 'g08', n: 'Mireia Soler', rol: 'Trabajadora social', seg: 'particular', ciudad: 'Barcelona', prod: CF, orig: 'c3', canal: 'wa', etapa: 2, valor: P[CF], creado: 14 * D, act: 10 * D, toque: 10 * D,
        f: { acompana: true }, s: { luego: 'enero', luegoTxt: 'se lo piensa y lo hablará en casa', financia: true },
        conv: [[14 * D, 'a', 'wa', 'Hola Mireia, aquí tienes el dosier de Constelaciones Familiares.'], [10 * D, 'c', 'wa', 'Me lo pienso y lo hablo en casa. ¿Se puede pagar en varios plazos?']] },
      // --- Sin seguimiento después de contestar
      { id: 'g09', n: 'Raquel Domínguez', rol: 'Terapeuta corporal', seg: 'particular', ciudad: 'Madrid', prod: TC, orig: 'c6', canal: 'wa', etapa: 3, valor: P[TC], creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: { acompana: true }, s: { presentacion: true, visitas: 2, conv: true },
        conv: [[8 * D, 'c', 'wa', 'Hola, ¿cuándo es la próxima presentación de terapia corporal?'], [7 * D, 'h', 'wa', 'El jueves a las 19:00 por Zoom, te mando el enlace.'], [5 * D, 'c', 'wa', 'Ya la vi, me encantó. ¿Cuál es el siguiente paso?']] },
      { id: 'g10', n: 'Xavier Martí', rol: 'Orientador educativo', seg: 'particular', ciudad: 'Girona', prod: TG, orig: 'c1', canal: 'wa', etapa: 2, valor: P[TG], creado: 6 * D, act: 4 * D, toque: 4 * D,
        f: { acompana: true, formPrevia: true }, s: { precio: true, financia: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Xavier, aquí tienes el dosier de la Formación en Terapia Gestalt.'], [4 * D, 'c', 'wa', '¿La formación es en Barcelona? ¿Cada cuánto son los encuentros?']] },
      { id: 'g11', n: 'Lucía Medina', rol: 'Psicopedagoga', seg: 'particular', ciudad: 'Online (Málaga)', prod: CF, orig: 'c3', canal: 'wa', etapa: 2, valor: P[CF], creado: 9 * D, act: 7 * D, toque: 7 * D,
        f: { formPrevia: true }, s: { visitas: 3, precio: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Lucía, aquí tienes el dosier de Constelaciones Familiares.'], [7 * D, 'c', 'wa', 'Gracias. ¿Se puede hacer online desde Málaga?']] },
      // --- Nuevos o sin respuesta
      { id: 'g12', n: 'Gemma Riera', rol: 'Profesora de yoga', seg: 'particular', ciudad: 'Barcelona', prod: TC, orig: 'c1', canal: 'wa', etapa: 1, valor: P[TC], creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: {}, s: { intentos: 1 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Gemma, te escribimos desde admisiones del Institut Gestalt. ¿Te mando el dosier y la próxima presentación por Zoom?']] },
      { id: 'g13', n: 'Óscar Benítez', rol: 'Coach deportivo', seg: 'particular', ciudad: 'Madrid', prod: COA, orig: 'c4', canal: 'wa', etapa: 1, valor: P[COA], creado: 5 * H, act: 4 * H, toque: 5 * H - 1,
        f: { acompana: true }, s: { visitas: 2, intentos: 1 },
        conv: [[5 * H - 1, 'a', 'wa', 'Hola Óscar, aquí tienes el dosier de Coaching. ¿Te apunto a la próxima presentación?']] },
      { id: 'g14', n: 'Teresa Llorens', rol: 'Enfermera', seg: 'particular', ciudad: 'Tarragona', prod: TG, orig: 'c1', canal: 'wa', etapa: 1, valor: P[TG], creado: 40, act: 35, toque: null,
        f: { formPrevia: true }, s: { visitas: 2 }, conv: [] },
      { id: 'g15', n: 'Iván Sanz', rol: 'Comercial', seg: 'particular', ciudad: 'Online (Zaragoza)', prod: PNL, orig: 'c4', canal: 'wa', etapa: 1, valor: P[PNL], creado: 18 * D, act: 18 * D, toque: 12 * D,
        f: { taller: true }, s: { intentos: 3 },
        conv: [[18 * D, 'a', 'wa', 'Hola Iván, aquí tienes el dosier de PNL. ¿Te apunto a la presentación?']] },
      // --- Entrevistas en marcha
      { id: 'g16', n: 'Marta Pujol', rol: 'Médica de familia', seg: 'particular', ciudad: 'Barcelona', prod: TG, orig: 'c5', canal: 'email', etapa: 4, valor: P[TG], creado: 4 * D, act: 6 * H, toque: 6 * H,
        f: { acompana: true, formPrevia: true }, s: { presentacion: true, cita: 26 * H, citaOk: false },
        conv: [[4 * D, 'a', 'email', 'Hola Marta, aquí tienes el dosier y la próxima presentación por Zoom.'], [6 * H, 'a', 'wa', 'Te propongo la entrevista previa con Montse pasado mañana a las 12:00. ¿Te va bien?']] },
      { id: 'g17', n: 'Héctor Navarro', rol: 'Terapeuta', seg: 'particular', ciudad: 'Madrid', prod: CF, orig: 'c3', canal: 'wa', etapa: 4, valor: P[CF], creado: 10 * D, act: 3 * D, toque: 3 * D,
        f: { acompana: true }, s: { presentacion: true, noshow: true, visitas: 2 },
        conv: [[10 * D, 'a', 'wa', 'Hola Héctor, aquí tienes el dosier de Constelaciones Familiares.'], [8 * D, 'c', 'wa', 'Estuve en la presentación, muy interesante.'], [4 * D, 'a', 'wa', 'Te espera Montse mañana a las 18:00 para la entrevista previa.']],
        ev: [[3 * D, 'sistema', 'No se conecta a la entrevista previa']] },
      { id: 'g18', n: 'Clara Esteve', rol: 'Psicóloga infantil', seg: 'particular', ciudad: 'Online (Valencia)', prod: CTI, orig: 'c2', canal: 'wa', etapa: 3, valor: P[CTI], creado: 7 * D, act: 20 * H, toque: 20 * H,
        f: { acompana: true, formPrevia: true }, s: { presentacion: true, temario: true, conv: true },
        conv: [[7 * D, 'a', 'wa', 'Hola Clara, aquí tienes el dosier de Constelaciones en Terapia Individual.'], [20 * H, 'c', 'wa', 'Los miércoles de 17 a 21 h me van perfectos. ¿Cómo sigo?']] },
      // --- Encaje bajo
      { id: 'g19', n: 'Rubén Gallego', rol: 'Estudiante', seg: 'particular', ciudad: 'Madrid', prod: TG, orig: 'c1', canal: 'wa', etapa: 2, valor: P[TG], creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { gratis: true }, s: { precio: true }, conv: [[4 * D, 'c', 'wa', '¿Hay algo gratis o alguna beca completa?']] },
      { id: 'g20', n: 'Patricia León', rol: 'Administrativa', seg: 'particular', ciudad: 'Online (Murcia)', prod: PNL, orig: 'c4', canal: 'wa', etapa: 2, valor: P[PNL], creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { taller: true }, s: {}, conv: [[5 * D, 'c', 'wa', 'Solo busco un taller de fin de semana, no una formación larga.']] },
      // --- Reservas y matrículas
      { id: 'g21', n: 'Albert Camps', rol: 'Psicólogo', seg: 'particular', ciudad: 'Barcelona', prod: TG, orig: 'c1', canal: 'wa', etapa: 5, valor: P[TG], creado: 16 * D, act: 2 * D, toque: 2 * D,
        f: { acompana: true, formPrevia: true }, s: { presentacion: true },
        conv: [[2 * D, 'c', 'wa', 'Hecha la reserva de 454 €. ¿Qué me falta para la matrícula?']] },
      { id: 'g22', n: 'Inés Morales', rol: 'Educadora infantil', seg: 'particular', ciudad: 'Madrid', prod: TG, orig: 'c5', canal: 'wa', etapa: 6, valor: P[TG], creado: 25 * D, act: 6 * D, toque: 6 * D, fin: 'ganado',
        f: { acompana: true, formPrevia: true }, s: {}, conv: [] },
      { id: 'g23', n: 'Rosa Ballester', rol: 'Coach', seg: 'particular', ciudad: 'Online (Palma)', prod: CTI, orig: 'c2', canal: 'wa', etapa: 6, valor: P[CTI], creado: 20 * D, act: 9 * D, toque: 9 * D, fin: 'ganado',
        f: { acompana: true }, s: {}, conv: [] },
      { id: 'g24', n: 'Joan Serra', rol: 'Terapeuta Gestalt, antiguo alumno', seg: 'particular', ciudad: 'Barcelona', prod: TRA, orig: 'c7', canal: 'wa', etapa: 6, valor: P[TRA], creado: 40 * D, act: 8 * D, toque: 8 * D, fin: 'ganado',
        f: { acompana: true, formPrevia: true }, s: { exp: true, expTxt: 'Pregunta por Constelaciones en Terapia Individual al acabar Trauma' },
        conv: [[8 * D, 'c', 'wa', 'Me está sirviendo mucho. ¿Al acabar puedo seguir con Constelaciones en Terapia Individual?']] }
    ]
  };
})();

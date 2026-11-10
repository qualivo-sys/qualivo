/* Sector: IGMA · Instituto Gallego de Música Avanzada (formación presencial en producción musical y DJ, en el centro de Vigo).
 * Preparado el 10-nov para la primera reunión. Cursos y sede según igma.es: Producción Musical, DJ profesional, DJ iniciación,
 * intensivos y la formación completa de Producción Musical, DJ & Music Business. Recorrido propuesto: petición (Instagram, web,
 * WhatsApp) → contactado → visita o clase de prueba → familia decidiendo → plaza reservada → matriculado.
 * TODO lo numérico (importes, inversión, embudo), las personas y los mensajes son DATOS SIMULADOS de ejemplo; no son cifras de IGMA. */
(function () {
  const H = 60, D = 1440;

  const Q = window.QV.voz;
  const PD = 'Producción Musical, DJ y Music Business', PM = 'Producción Musical', DJ = 'DJ profesional',
    DJI = 'DJ iniciación', INT = 'Intensivo de producción', URB = 'Producción de música urbana';
  // Importes de ejemplo, redondos, solo para que el panel calcule. No son los precios de IGMA.
  const P = {}; P[PD] = 3000; P[PM] = 2400; P[DJ] = 1800; P[DJI] = 600; P[INT] = 700; P[URB] = 900;

  // Historia principal: la clase de prueba queda dos días laborables después, a las 18:00.
  const vis = Q.hueco(18);
  const MIN_HISTORIA = 1 + 1 + 1 + 1 + 1 + 600 + 2;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.igma = {
    id: 'igma',
    nombre: 'IGMA',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso',
      paginaVisitas: 'la página del curso', cita: 'clase de prueba', Cita: 'Clase de prueba', laCita: 'la clase de prueba',
      propuesta: 'la reserva de plaza', Propuesta: 'Reserva de plaza', propuestas: 'reservas de plaza', comercial: 'Alba', Comercial: 'Alba',
      cliente: 'alumno', unCliente: 'un alumno', clientes: 'alumnos', convierten: 'se matriculan', objetivoPaso: 'venir al estudio a una visita o clase de prueba',
      casoExito: 'un tema producido por un antiguo alumno', valorAlto: 2000, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la matrícula', Producto: 'Curso',
      verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'personas del equipo',
      pasoHumano: 'dar la clase de prueba y hablar con la familia de precio y forma de pago'
    },
    // Recorrido: Anuncio → Petición nueva → Contactado → Visita / clase de prueba → Familia decidiendo → Plaza reservada → Matriculado
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'peticion', txt: 'Petición nueva' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'visita', txt: 'Visita / clase de prueba' },
      { id: 'familia', txt: 'Familia decidiendo' },
      { id: 'reserva', txt: 'Plaza reservada' },
      { id: 'matricula', txt: 'Matriculado' }
    ],
    ventaEtapa: 'matricula',
    ticket: P[PD],
    // Conversión razonable en cada paso cuando se contesta a tiempo y se hace seguimiento (referencia de ejemplo).
    referencia: { contactado: 0.9, visita: 0.45, familia: 0.7, reserva: 0.5, matricula: 0.9 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'mensajes de Instagram y formularios que llegan de noche y esperan al día siguiente' },
      visita: { txt: 'Paso a la visita', exp: 'interesados a los que nadie les propone venir al estudio a una clase de prueba' },
      familia: { txt: 'Visita a decisión', exp: 'visitas que acaban sin hablar con la familia, que es quien suele decidir y pagar' },
      reserva: { txt: 'Reserva de plaza', exp: 'familias que se lo piensan y no reciben seguimiento: precio, plazos o fechas' },
      matricula: { txt: 'Matrícula', exp: 'reservas que no completan la matrícula' }
    },
    remedioFuga: {
      contactado: 'Respuesta al minuto por WhatsApp e Instagram, a cualquier hora, con tres preguntas: qué quiere hacer, si estudia o trabaja y cuándo quiere empezar.',
      visita: 'Propuesta de clase de prueba con huecos reales del estudio, confirmación y recordatorios el día antes y una hora antes.',
      familia: 'Precio y financiación los explica siempre una persona del equipo. El sistema no da cifras: agenda la llamada con la familia.'
    },
    mesDatos: { respuestaAntes: 540, respuestaAhora: 1, agendadas: 38 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Reels · Producción Musical (mensaje a Instagram)', inversion: 900, ticket: P[PD],
        embudo: { anuncio: 120000, peticion: 70, contactado: 52, visita: 19, familia: 13, reserva: 7, matricula: 6 } },
      { id: 'c2', canal: 'Meta', nombre: 'Reels · DJ profesional en cabina', inversion: 600, ticket: P[DJ],
        embudo: { anuncio: 85000, peticion: 48, contactado: 33, visita: 14, familia: 9, reserva: 5, matricula: 4 } },
      { id: 'c3', canal: 'Meta', nombre: 'Formulario · Clase de prueba gratuita', inversion: 450, ticket: P[PM],
        embudo: { anuncio: 40000, peticion: 36, contactado: 30, visita: 12, familia: 7, reserva: 3, matricula: 3 } },
      { id: 'c4', canal: 'Google', nombre: 'Búsqueda · «curso DJ Vigo» y «producción musical Galicia»', inversion: 350, ticket: P[DJ],
        embudo: { anuncio: 5200, peticion: 22, contactado: 19, visita: 9, familia: 6, reserva: 4, matricula: 3 } },
      { id: 'c5', canal: 'Web', nombre: 'Web y buscadores (orgánico)', inversion: 0, ticket: P[PM],
        embudo: { anuncio: 7000, peticion: 18, contactado: 15, visita: 7, familia: 5, reserva: 3, matricula: 3 } },
      { id: 'c6', canal: 'Instagram', nombre: 'Instagram orgánico (mensajes directos)', inversion: 0, ticket: P[PD],
        embudo: { anuncio: 3000, peticion: 25, contactado: 14, visita: 5, familia: 3, reserva: 2, matricula: 2 } },
      { id: 'c7', canal: 'Antiguos alumnos', nombre: 'Antiguos alumnos y recomendación', inversion: 0, ticket: P[PD],
        embudo: { anuncio: 600, peticion: 9, contactado: 9, visita: 7, familia: 6, reserva: 5, matricula: 5 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'sinReserva', 'ventas', 'cpv', 'ingresos'],
    kpiNombres: { interesados: 'Peticiones', cualificados: 'Visitas y clases de prueba', entrevistas: 'Familias decidiendo', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'peticion', cualificados: 'visita', entrevistas: 'familia' },
    kpiCustom: function (m, cfg, M) {
      return {
        sinReserva: { l: 'Visita sin reserva', v: M.num(m.tot.visita - m.tot.reserva), em: M.pct(1 - m.tot.reserva / Math.max(1, m.tot.visita)) + ' de las visitas', clase: 'mal' }
      };
    },

    reglas: {
      fitBase: 40,
      fit: [
        [function (c) { return c.f && c.f.ambos; }, 14, 'quiere producir y pinchar', 'Quiere producir y pinchar'],
        [function (c) { return c.f && c.f.familia; }, 10, 'la familia está en la conversación', 'La familia está en la conversación'],
        [function (c) { return c.f && c.f.cerca; }, 8, 'vive cerca de Vigo', 'Vive cerca de Vigo'],
        [function (c) { return c.valor >= 2000; }, 8, 'curso anual'],
        [function (c) { return c.f && c.f.online; }, -14, 'busca un curso online (IGMA es presencial)'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca algo gratuito']
      ],
      intencion: [
        [function (c) { return c.s.visita; }, 16, 'vino a la clase de prueba'],
        [function (c) { return c.s.conv; }, 12, 'quiere empezar en septiembre'],
        [function (c) { return c.s.temario; }, 8, 'vio el programa del curso'],
        [function (c) { return c.s.financia; }, 10, 'la familia preguntó por el pago a plazos'],
        [function (c) { return c.s.carrito; }, 18, 'pidió el enlace de la reserva y no la terminó']
      ]
    },

    preguntas: [
      { q: '¿Quién tiene más probabilidad de matricularse?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Quién escribió y todavía no tiene visita?', h: 'lista', obj: ['captacion', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa <= 2; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas escribieron y aún no tienen una clase de prueba en la agenda. Es donde hoy se pierde la inversión.'; }, vista: 'tabla' },
      { q: '¿Qué familias están decidiendo?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa === 4; }, orden: 'prob',
        intro: function (l) { return l.length + ' familias vinieron a la visita y se lo están pensando. Precio y plazos los explica Alba.'; }, vista: 'tabla' },
      { q: '¿Quién dijo «más adelante» y cuándo?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que lo retomarían, cada uno con su fecha. Ninguno es un no.'; }, vista: 'tabla' },
      { q: '¿Qué interesados llevan demasiado tiempo sin respuesta?', h: 'sinSeguimiento', obj: ['seguimiento', 'todo'] },
      { q: '¿Qué anuncio trae matrículas y no solo mensajes?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Quién hizo DJ iniciación y puede seguir con el curso completo?', h: 'lista', obj: ['ventas', 'expansion', 'todo'],
        filtro: function (c) { return (c.prod === DJI || c.prod === INT) && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas de cursos cortos que encajan en la formación completa. Ordenadas por probabilidad.'; }, vista: 'tabla' }
    ],

    historias: {
      instagram: {
        titulo: 'Brais escribe a las 23:00 desde un reel de Instagram y sale con una clase de prueba en el estudio',
        contacto: { id: 'demo', n: 'Brais Rodríguez', rol: 'Estudiante de 2º de bachillerato', seg: 'particular', ciudad: '—', prod: PD, orig: 'c1', canal: 'wa', etapa: 1, valor: P[PD], creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Brais ve un reel de IGMA a las 23:04 y escribe por Instagram', feed: 'Nueva petición · Instagram · ' + PD, cambio: { conv: ['c', 'ig', 'Holaa, vi el reel. Info del curso porfa 🎧'] } },
          { dur: 7, min: 1, txt: 'Respuesta en el minuto, con la primera pregunta: qué quiere hacer', feed: 'Respuesta en 40 segundos · fuera de horario', toque: true,
            cambio: { conv: ['a', 'ig', '¡Hola, Brais! Gracias por escribir a IGMA 🙌 Para contarte lo que te encaja: ¿qué te tira más, producir tus temas, pinchar o las dos cosas?'] } },
          { dur: 6, min: 1, txt: 'Contesta: las dos cosas', feed: 'Interés: producción y DJ', cambio: { etapa: 2, f: { ambos: true }, conv: ['c', 'ig', 'Las dos cosas'] }, act: true },
          { dur: 7, min: 1, txt: 'Segunda y tercera pregunta: si estudia o trabaja y cuándo quiere empezar', feed: 'Ficha completada · estudia · tardes libres · septiembre', toque: true,
            cambio: { ciudad: 'Vigo', f: { cerca: true }, s: { conv: true, urg: true, urgTxt: 'quiere empezar en septiembre' }, conv: ['a', 'ig', '¿Ahora estudias o trabajas? ¿Y cuándo te gustaría empezar?'] } },
          { dur: 6, min: 1, txt: 'Estudia, tiene las tardes y quiere empezar en septiembre', feed: 'Respuesta · estudiante · septiembre', cambio: { conv: ['c', 'ig', 'Estoy en 2º de bachiller, por las tardes libre. En septiembre'] }, act: true },
          { dur: 7, min: 600, txt: 'Por la mañana, Alba aprueba la propuesta de clase de prueba con huecos reales del estudio', feed: 'Clase de prueba agendada · ' + vis.txt + ' 18:00', vista: 'agenda', toque: true,
            cambio: { etapa: 3, s: { cita: vis.min - MIN_HISTORIA, citaOk: true }, conv: ['h', 'wa', 'Buenos días, Brais. Soy Alba, de IGMA. Te hago hueco para la clase de prueba el ' + vis.txt + ' a las 18:00 en el estudio, en el centro de Vigo. Si quieres, vente con alguien de casa 🙂'] } },
          { dur: 0, min: 2, txt: 'Aviso a Alba con la ficha completa', feed: 'Aviso enviado a Alba', humano: { titulo: 'Brais, clase de prueba el ' + vis.txt + ' a las 18:00', texto: 'Vigo · 18 años, estudia 2º de bachillerato, tardes libres · vino de un reel de Producción Musical · quiere producir y pinchar y empezar en septiembre. Siguiente paso: que venga con su familia.' } }
        ]
      },
      familia: {
        titulo: 'La madre de Carla pregunta por el precio y la financiación, y el sistema se lo pasa a Alba sin dar cifras',
        contacto: { id: 'demo', n: 'Rosa Míguez (madre de Carla)', rol: 'Familia · paga el curso', seg: 'particular', ciudad: 'Vigo', prod: PM, orig: 'c3', canal: 'wa', etapa: 3, valor: P[PM], creado: 0, act: 0, f: { familia: true, cerca: true }, s: { visita: true }, conv: [] },
        pasos: [
          { dur: 6, min: 0, txt: 'La madre de Carla escribe después de la clase de prueba', feed: 'Mensaje de la familia · precio y plazos', cambio: { s: { precio: true, financia: true }, conv: ['c', 'wa', 'Buenas tardes, soy la madre de Carla. ¿Cuánto cuesta el año y se puede pagar a plazos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El asistente no da cifras: propone que se lo explique una persona', feed: 'Precio y financiación → persona', toque: true,
            cambio: { etapa: 4, conv: ['a', 'wa', 'Hola, Rosa, encantados. El precio depende del programa y de la forma de pago, y prefiero que te lo explique Alba, de admisiones, con todo el detalle. ¿Te llamamos hoy?'] } },
          { dur: 6, min: 3, txt: 'Rosa pide la llamada a partir de las 17:00', feed: 'Llamada pedida · 17:00', cambio: { conv: ['c', 'wa', 'Sí, llamadme a partir de las 17:00'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso a Alba', feed: 'Aviso enviado a Alba', humano: { titulo: 'Llamar a la madre de Carla hoy a las 17:00', texto: 'Carla, 17 años, hizo la clase de prueba de producción con su madre · la familia paga · preguntan precio del año y pago a plazos. El sistema no ha dado ninguna cifra.' } }
        ]
      }
    },
    historiaDefecto: 'instagram',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'i01', n: 'Lois Táboas', rol: 'Estudiante, 19 años', seg: 'particular', ciudad: 'Vigo', prod: PD, orig: 'c1', canal: 'wa', etapa: 4, valor: P[PD], creado: 12 * D, act: 30, toque: 45,
        f: { ambos: true, familia: true, cerca: true }, s: { visita: true, carrito: true, financia: true, visitas: 4, precio: true },
        conv: [[12 * D, 'a', 'ig', 'Hola Lois, gracias por escribir a IGMA. ¿Qué te tira más: producir, pinchar o las dos cosas?'], [2 * D, 'h', 'wa', 'Lois, un placer teneros en el estudio. Te dejo el enlace para la reserva de plaza.'], [40, 'c', 'wa', 'Mi padre ha empezado la reserva pero le da error el pago.'], [45, 'a', 'wa', 'Lo resolvemos ahora: Alba os llama en 5 minutos y la terminamos con vosotros.']],
        ev: [[30, 'web', 'Reserva de plaza empezada y no terminada']] },
      { id: 'i02', n: 'Carla Míguez', rol: 'Estudiante, 17 años', seg: 'particular', ciudad: 'Vigo', prod: PM, orig: 'c3', canal: 'wa', etapa: 4, valor: P[PM], creado: 6 * D, act: 2 * H, toque: 3 * H,
        f: { familia: true, cerca: true }, s: { visita: true, conv: true, financia: true, precio: true, urg: true, urgTxt: 'quiere empezar en septiembre' },
        conv: [[6 * D, 'a', 'wa', 'Hola Carla, ¿te apetece venir a una clase de prueba de producción?'], [3 * H, 'c', 'wa', 'Soy su madre. ¿Se puede pagar a plazos?'], [2 * H, 'a', 'wa', 'Te lo explica Alba por teléfono hoy a las 17:00.']] },
      { id: 'i03', n: 'Antía Gómez', rol: 'Estudiante, 18 años', seg: 'particular', ciudad: 'Redondela', prod: DJ, orig: 'c2', canal: 'wa', etapa: 3, valor: P[DJ], creado: 4 * D, act: 5 * H, toque: 5 * H,
        f: { cerca: true }, s: { cita: 6 * H, citaOk: true, visitas: 2 },
        conv: [[4 * D, 'a', 'ig', 'Hola Antía, ¿quieres venir a probar la cabina?'], [5 * H, 'a', 'wa', 'Te esperamos hoy a las 18:00 en el estudio 🎧']] },
      { id: 'i04', n: 'Noa Castro', rol: 'Estudiante, 19 años', seg: 'particular', ciudad: 'Ourense', prod: PD, orig: 'c1', canal: 'ig', etapa: 2, valor: P[PD], creado: 20 * H, act: 25, toque: 19 * H,
        f: { ambos: true }, s: { temario: true, conv: true, visitas: 2 },
        conv: [[20 * H - 1, 'a', 'ig', 'Hola Noa, gracias por escribir a IGMA. ¿Producir, pinchar o las dos cosas?'], [25, 'c', 'ig', 'Las dos. ¿Las clases son entre semana? Vivo en Ourense']] },
      { id: 'i05', n: 'Uxía Pereira', rol: 'Estudiante, 17 años', seg: 'particular', ciudad: 'Vigo', prod: PM, orig: 'c1', canal: 'ig', etapa: 1, valor: P[PM], creado: 11, act: 11, toque: null,
        f: { cerca: true }, s: { visitas: 1 }, conv: [[11, 'c', 'ig', 'Hola! Info del curso de producción porfa']] },
      // --- Dijeron «más adelante»
      { id: 'i06', n: 'Iago Fernández', rol: 'Trabaja en hostelería, 26 años', seg: 'particular', ciudad: 'Vigo', prod: PM, orig: 'c4', canal: 'wa', etapa: 3, valor: P[PM], creado: 25 * D, act: 16 * D, toque: 16 * D,
        f: { cerca: true }, s: { visita: true, luego: 'enero', luegoTxt: 'empezaría en enero, cuando acabe la temporada' },
        conv: [[16 * D, 'c', 'wa', 'Me encantó la clase, pero hasta enero no puedo, acabo la temporada.']] },
      { id: 'i07', n: 'Sabela Rey', rol: 'Estudiante, 18 años', seg: 'particular', ciudad: 'Pontevedra', prod: PD, orig: 'c1', canal: 'wa', etapa: 4, valor: P[PD], creado: 30 * D, act: 20 * D, toque: 20 * D,
        f: { ambos: true, familia: true }, s: { visita: true, luego: 'junio', luegoTxt: 'lo decidirá con su familia cuando acabe la selectividad', financia: true },
        conv: [[20 * D, 'c', 'wa', 'Lo hablamos en casa después de la selectividad.']] },
      // --- Sin seguimiento después de contestar
      { id: 'i08', n: 'Pablo Freire', rol: 'Estudiante, 18 años', seg: 'particular', ciudad: 'Cangas', prod: DJ, orig: 'c2', canal: 'wa', etapa: 4, valor: P[DJ], creado: 9 * D, act: 5 * D, toque: 5 * D,
        f: { cerca: true, familia: true }, s: { visita: true, conv: true },
        conv: [[7 * D, 'h', 'wa', 'Gracias por venir a probar la cabina, Pablo.'], [5 * D, 'c', 'wa', 'Lo hablamos en casa y te digo. ¿Cuál es el siguiente paso?']] },
      { id: 'i09', n: 'Martiña López', rol: 'Estudiante, 20 años', seg: 'particular', ciudad: 'Vigo', prod: DJ, orig: 'c5', canal: 'wa', etapa: 2, valor: P[DJ], creado: 4 * D, act: 4 * D, toque: 3 * D,
        f: { cerca: true }, s: { intentos: 2 },
        conv: [[4 * D, 'a', 'wa', 'Hola, Martiña. ¿Te apetece venir a probar la cabina esta semana?'], [3 * D, 'a', 'wa', 'Por si se te pasó: tenemos huecos el jueves y el sábado.']] },
      { id: 'i10', n: 'Hugo Vázquez', rol: 'Trabaja por las mañanas, 24 años', seg: 'particular', ciudad: 'Pontevedra', prod: DJ, orig: 'c4', canal: 'wa', etapa: 2, valor: P[DJ], creado: 6 * D, act: 4 * D, toque: 4 * D,
        f: { cerca: true }, s: { precio: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Hugo, ¿quieres venir a una clase de prueba de DJ?'], [4 * D, 'c', 'wa', '¿Hay grupo de tarde? Trabajo por las mañanas.']] },
      { id: 'i11', n: 'Iker Santos', rol: 'Diseñador gráfico, 27 años', seg: 'particular', ciudad: 'Vigo', prod: URB, orig: 'c6', canal: 'ig', etapa: 2, valor: P[URB], creado: 8 * D, act: 6 * D, toque: 6 * D,
        f: { cerca: true }, s: { temario: true, visitas: 3 },
        conv: [[6 * D, 'c', 'ig', '¿El curso de música urbana es para empezar de cero?']] },
      // --- Nuevos o sin respuesta
      { id: 'i12', n: 'Xián Otero', rol: 'Estudiante, 16 años', seg: 'particular', ciudad: 'Vigo', prod: DJI, orig: 'c2', canal: 'ig', etapa: 1, valor: P[DJI], creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { cerca: true }, s: { intentos: 1 },
        conv: [[2 * D - 1, 'a', 'ig', 'Hola Xián, gracias por escribir a IGMA. ¿Quieres venir a probar la cabina?']] },
      { id: 'i13', n: 'Andrea Lago', rol: 'Estudiante, 19 años', seg: 'particular', ciudad: 'Santiago', prod: PM, orig: 'c3', canal: 'wa', etapa: 1, valor: P[PM], creado: 40, act: 35, toque: null,
        f: {}, s: { visitas: 2 }, conv: [] },
      { id: 'i14', n: 'Brais Costas', rol: 'Productor aficionado, 22 años', seg: 'particular', ciudad: 'A Coruña', prod: PM, orig: 'c1', canal: 'ig', etapa: 1, valor: P[PM], creado: 18 * D, act: 18 * D, toque: 12 * D,
        f: { online: true }, s: { intentos: 3 },
        conv: [[18 * D, 'c', 'ig', '¿Lo tenéis online? Vivo en A Coruña.']] },
      // --- Encaje bajo
      { id: 'i15', n: 'Rubén Gil', rol: 'Estudiante', seg: 'particular', ciudad: 'Madrid', prod: PM, orig: 'c1', canal: 'ig', etapa: 2, valor: P[PM], creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { gratis: true, online: true }, s: {}, conv: [[4 * D, 'c', 'ig', '¿Hay algo gratis online?']] },
      // --- Reservas y matrículas
      { id: 'i16', n: 'Sara Domínguez', rol: 'Trabaja, 25 años', seg: 'particular', ciudad: 'Vigo', prod: PM, orig: 'c5', canal: 'wa', etapa: 5, valor: P[PM], creado: 20 * D, act: 2 * D, toque: 2 * D,
        f: { cerca: true }, s: { visita: true },
        conv: [[2 * D, 'c', 'wa', 'Hecha la reserva. ¿Qué me falta para la matrícula?']] },
      { id: 'i17', n: 'Diego Alonso', rol: 'Estudiante, 18 años', seg: 'particular', ciudad: 'Baiona', prod: DJ, orig: 'c2', canal: 'wa', etapa: 6, valor: P[DJ], creado: 30 * D, act: 6 * D, toque: 6 * D, fin: 'ganado',
        f: { cerca: true, familia: true }, s: {}, conv: [] },
      { id: 'i18', n: 'Lucía Araújo', rol: 'Estudiante, 19 años', seg: 'particular', ciudad: 'Vigo', prod: PD, orig: 'c7', canal: 'wa', etapa: 6, valor: P[PD], creado: 28 * D, act: 9 * D, toque: 9 * D, fin: 'ganado',
        f: { ambos: true, familia: true, cerca: true }, s: {}, conv: [] },
      { id: 'i19', n: 'Marcos Prieto', rol: 'Antiguo alumno de DJ iniciación', seg: 'particular', ciudad: 'Vigo', prod: DJI, orig: 'c7', canal: 'wa', etapa: 6, valor: P[DJI], creado: 40 * D, act: 8 * D, toque: 8 * D, fin: 'ganado',
        f: { cerca: true }, s: { exp: true, expTxt: 'Pregunta por el curso completo al acabar DJ iniciación' },
        conv: [[8 * D, 'c', 'wa', 'Me ha encantado. ¿Puedo seguir con el curso completo en septiembre?']] }
    ]
  };
})();

/* Sector: Clínica (dental, estética, fisioterapia).
 * Todos los nombres son inventados. */
(function () {
  const H = 60, D = 1440;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.clinica = {
    id: 'clinica',
    nombre: 'Clínica',
    t: {
      contacto: 'paciente', contactos: 'pacientes', Contactos: 'Pacientes', Contacto: 'Paciente',
      venta: 'tratamiento aceptado', ventas: 'tratamientos aceptados', Ventas: 'Tratamientos aceptados', producto: 'tratamiento',
      paginaVisitas: 'la página del tratamiento', txtPrecio: 'preguntó por el precio', cita: 'primera visita', Cita: 'Primera visita', laCita: 'la primera visita',
      propuesta: 'el presupuesto', Propuesta: 'Presupuesto', comercial: 'la coordinadora de pacientes', Comercial: 'Coordinadora de pacientes',
      cs: 'la coordinadora de pacientes', CS: 'Coordinadora de pacientes',
      cliente: 'paciente', unCliente: 'un paciente', convierten: 'aceptan el tratamiento', objetivoPaso: 'reservar la primera visita',
      casoExito: 'el caso de un paciente con un tratamiento parecido', valorAlto: 3000, oportunidades: 'pacientes',
      laVenta: 'el tratamiento aceptado', Producto: 'Tratamiento', clientes: 'pacientes', propuestas: 'presupuestos', verbo: 'aceptar el tratamiento',
      clientesReales: 'tratamientos de verdad', empleados: 'empleados', pasoHumano: 'resolver sus dudas del presupuesto y la financiación',
      senales: { propuesta: 'Presupuesto sin respuesta', nueva: 'Consulta nueva', intencion: 'Intención alta' }
    },
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'consulta', txt: 'Consulta' },
      { id: 'contacto', txt: 'Contactado' },
      { id: 'cita', txt: 'Cita' },
      { id: 'asistencia', txt: 'Asistencia' },
      { id: 'diagnostico', txt: 'Diagnóstico', sinFuga: true },
      { id: 'presupuesto', txt: 'Presupuesto' },
      { id: 'seguimiento', txt: 'Seguimiento', sinFuga: true },
      { id: 'tratamiento', txt: 'Tratamiento' }
    ],
    ventaEtapa: 'tratamiento',
    ticket: 2400,
    referencia: { contacto: 0.9, cita: 0.7, asistencia: 0.88, presupuesto: 0.8, tratamiento: 0.55 },
    nombresFuga: {
      contacto: { txt: 'Respuesta', exp: 'pacientes que escriben y nadie les contesta a tiempo' },
      cita: { txt: 'Reserva', exp: 'pacientes contactados que no llegan a reservar cita' },
      asistencia: { txt: 'No-show', exp: 'citas reservadas a las que el paciente no viene' },
      presupuesto: { txt: 'Presupuesto', exp: 'diagnósticos que no terminan en presupuesto' },
      tratamiento: { txt: 'Seguimiento de presupuestos', exp: 'presupuestos entregados a los que nadie hace seguimiento' }
    },
    remedioFuga: {
      tratamiento: 'Seguimiento de cada presupuesto con fecha: el agente resuelve dudas y financiación por WhatsApp y avisa a la coordinadora cuando el paciente está listo para decidir.'
    },
    mesDatos: { respuestaAntes: 190, respuestaAhora: 1, agendadas: 227 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Implantes dentales', inversion: 1800, ticket: 3200,
        embudo: { anuncio: 5200, consulta: 150, contacto: 110, cita: 70, asistencia: 52, diagnostico: 52, presupuesto: 44, seguimiento: 44, tratamiento: 13 } },
      { id: 'c2', canal: 'Meta', nombre: 'Ortodoncia invisible', inversion: 1300, ticket: 3900,
        embudo: { anuncio: 4100, consulta: 120, contacto: 90, cita: 55, asistencia: 40, diagnostico: 40, presupuesto: 34, seguimiento: 34, tratamiento: 10 } },
      { id: 'c3', canal: 'Google', nombre: 'Urgencias y limpieza', inversion: 800, ticket: 180,
        embudo: { anuncio: 2100, consulta: 95, contacto: 72, cita: 50, asistencia: 41, diagnostico: 41, presupuesto: 20, seguimiento: 20, tratamiento: 12 } },
      { id: 'c4', canal: 'Google', nombre: 'Estética facial', inversion: 300, ticket: 450,
        embudo: { anuncio: 900, consulta: 30, contacto: 22, cita: 14, asistencia: 11, diagnostico: 11, presupuesto: 10, seguimiento: 10, tratamiento: 3 } },
      { id: 'c5', canal: 'Web', nombre: 'Web y recomendación', inversion: 0, ticket: 1600,
        embudo: { anuncio: 700, consulta: 60, contacto: 50, cita: 38, asistencia: 34, diagnostico: 34, presupuesto: 26, seguimiento: 26, tratamiento: 10 } }
    ],
    kpis: ['interesados', 'respuesta', 'cualificados', 'show', 'presupuestos', 'aceptados', 'ventas', 'pptoAbierto', 'ingresos', 'recuperada'],
    kpiNombres: { interesados: 'Consultas', cualificados: 'Citas', entrevistas: 'Asisten', ventas: 'Tratamientos aceptados', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'consulta', cualificados: 'cita', entrevistas: 'asistencia' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      const abiertos = cs.filter(function (c) { return !c.fin && c.s.tProp != null; });
      const sinSeg = abiertos.filter(function (c) { return c.x && c.x.k.toque > 2 * 1440; });
      const rec = cs.filter(function (c) { return c.fin === 'ganado' && c.s.recuperado; });
      return {
        presupuestos: { l: 'Presupuestos entregados', v: M.num(m.tot.presupuesto), em: M.pct(m.tot.presupuesto / m.tot.asistencia) + ' de los que vienen' },
        aceptados: { l: 'Presupuestos aceptados', v: M.pct(m.tot.tratamiento / m.tot.presupuesto), em: 'Referencia: 55 %', clase: 'mal' },
        pptoAbierto: { l: 'En presupuestos abiertos', v: M.euros(abiertos.reduce(function (a, c) { return a + c.valor; }, 0)), em: M.euros(sinSeg.reduce(function (a, c) { return a + c.valor; }, 0)) + ' sin seguimiento', clase: 'mal' },
        recuperada: { l: 'Facturación recuperada', v: M.euros(rec.reduce(function (a, c) { return a + c.valor; }, 0)), em: rec.length + ' presupuestos que estaban parados', clase: 'bien' }
      };
    },

    reglas: {
      fitBase: 34,
      fit: [
        [function (c) { return c.valor >= 2000; }, 20, function (c) { return 'tratamiento de ' + QV.motor.euros(c.valor); }, 'Tratamiento de 2.000 € o más'],
        [function (c) { return c.valor >= 400 && c.valor < 2000; }, 8, 'tratamiento de ticket medio', 'Tratamiento de 400 a 2.000 €'],
        [function (c) { return c.f && c.f.cerca; }, 16, function (c) { return 'vive a ' + c.f.cerca + ' de la clínica'; }, 'Vive cerca de la clínica'],
        [function (c) { return c.f && c.f.paciente; }, 16, 'ya es paciente de la clínica', 'Ya es paciente'],
        [function (c) { return c.f && c.f.lejos; }, -18, function (c) { return 'vive lejos (' + c.f.lejos + ')'; }, 'Vive lejos'],
        [function (c) { return c.f && c.f.soloSeguro; }, -14, 'solo busca lo que cubre su seguro', 'Solo busca lo que cubre el seguro'],
        [function (c) { return c.f && c.f.compara; }, -10, 'pide precio para comparar', 'Solo compara precios']
      ],
      intencion: [
        [function (c) { return c.s.financia; }, 12, 'preguntó por financiación'],
        [function (c) { return c.s.pienso; }, -8, 'dijo «me lo pienso»']
      ],
      riesgo: [
        [function (c) { return c.s.pienso && !c.fin; }, 12, 'dijo «me lo pienso» y nadie le ha vuelto a escribir']
      ]
    },

    preguntas: [
      { q: '¿Qué presupuestos deberíamos recuperar hoy?', h: 'lista', obj: ['seguimiento', 'ventas', 'todo'],
        filtro: function (c) { return c.s.tProp != null && !c.fin; }, orden: 'prob', suma: true,
        intro: function (l, T, M) { return 'Hay ' + l.length + ' presupuestos abiertos por ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '. Estos son los que más probabilidad tienen de aceptarse si alguien los trabaja hoy.'; },
        cols: ['nombre', 'valor', 'prob', 'accion'], vista: 'tabla' },
      { q: '¿Qué pacientes tienen riesgo de no-show?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && (c.s.noshow || (c.s.tCita != null && c.x.k.cita > 0 && c.x.k.cita < 3 * 1440 && !c.s.citaOk)); }, orden: 'riesgo',
        intro: function (l) { return l.length + ' pacientes tienen riesgo de no venir: citas sin confirmar en los próximos días o que ya fallaron una vez. El recordatorio sale solo; a los que fallaron, el agente les propone otro hueco.'; },
        cols: ['nombre', ['Cita', function (c) { return c.s.noshow ? 'no vino' : QV.motor.dentroDe(c.x.k.cita); }], ['Confirmada', function (c) { return c.s.citaOk ? 'sí' : 'no'; }], 'accion'], vista: 'tabla' },
      { q: '¿Quién preguntó por financiación?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !!c.s.financia && !c.fin; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' pacientes preguntaron por financiación (' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '). La financiación es la objeción que más presupuestos bloquea: resolverla rápido es media venta.'; },
        vista: 'tabla' },
      { q: '¿Cuánto dinero tenemos en presupuestos sin seguimiento?', h: 'lista', obj: ['seguimiento', 'ventas', 'todo'],
        filtro: function (c) { return c.s.tProp != null && !c.fin && c.x.k.toque > 2 * 1440; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return 'Hay **' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '** en ' + l.length + ' presupuestos a los que nadie ha escrito en más de dos días. Es dinero casi ganado: el paciente ya vino, se diagnosticó y se le dio precio.'; },
        cols: ['nombre', 'valor', 'sinSeg', 'accion'], vista: 'tabla',
        cierre: 'Con seguimiento con fecha y el agente resolviendo dudas y financiación, una parte de esto se recupera sin captar un paciente más.' }
    ],

    historias: {
      implantes: {
        titulo: 'Una consulta de implantes a las diez de la noche',
        contacto: { id: 'demo', n: 'Pilar Ortega', rol: 'Consulta por implantes', seg: 'nuevo', ciudad: '—', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 1, valor: 3200, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una consulta de implantes desde Meta, fuera de horario', feed: 'Consulta nueva · implantes dentales', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 52 segundos', cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Pilar, soy Ana, de la clínica. He visto tu consulta sobre implantes. ¿Es para una pieza o para varias?'] }, toque: true },
          { dur: 6, min: 2, txt: 'Pilar contesta y el agente completa su ficha', feed: 'Ficha completada · vive a 10 minutos', cambio: { f: { cerca: '10 minutos' }, ciudad: 'Valencia', conv: ['c', 'wa', 'Para dos muelas. Vivo aquí al lado, en Benimaclet. ¿Cuánto cuesta más o menos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente no da precio sin diagnóstico: explica y cualifica', feed: 'Pregunta de cualificación enviada', cambio: { conv: ['a', 'wa', 'Depende del hueso que haya, por eso la primera visita con el escáner es gratis y sales con el presupuesto cerrado. ¿Te preocupa más el precio o el tiempo del tratamiento?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Pilar pregunta por financiación y visita la página', feed: 'Pregunta por financiación · visita la página del tratamiento', cambio: { s: { precio: true, financia: true, visitas: 2 }, conv: ['c', 'wa', 'El precio. ¿Se puede pagar a plazos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente resuelve la financiación y propone cita', feed: 'Financiación explicada · dos huecos propuestos', cambio: { conv: ['a', 'wa', 'Sí, hasta 24 meses sin intereses. Te propongo mañana a las 10:30 o el jueves a las 17:00. ¿Cuál te va mejor?'] }, toque: true },
          { dur: 6, min: 2, txt: 'Pilar elige hora: quiere resolverlo ya', feed: 'Intención alta · quiere empezar este mes', cambio: { s: { urg: true, urgTxt: 'quiere empezar este mes' }, conv: ['c', 'wa', 'Mañana a las 10:30. Quiero quitármelo de encima este mes.'] }, act: true },
          { dur: 6, min: 1, txt: 'Cita reservada y recordatorio programado', feed: 'Primera visita reservada · mañana 10:30', cambio: { etapa: 3, s: { cita: 12 * 60, citaOk: true }, conv: ['a', 'wa', 'Hecho, mañana a las 10:30 con la doctora Ruiz. Te llega la ubicación y te escribo por la mañana para recordártelo.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Pilar está lista', feed: 'Aviso enviado a la coordinadora de pacientes', humano: { titulo: 'Pilar viene mañana y quiere decidir', texto: 'Dos implantes · vive a 10 minutos · le preocupa el precio y pregunta por financiación (24 meses sin intereses explicado) · quiere empezar este mes. Primera visita mañana a las 10:30: que la coordinadora tenga el plan de pago preparado.' } }
        ]
      }
    },
    historiaDefecto: 'implantes',

    contactos: [
      // --- Presupuestos abiertos
      { id: 'k01', n: 'Mercedes Alonso', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Valencia', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 6, valor: 6400, creado: 12 * D, act: 35, toque: 6 * D,
        f: { cerca: '15 minutos' }, s: { prop: 6 * D, propVista: 2, financia: true, precio: true },
        conv: [[6 * D, 'h', 'wa', 'Mercedes, te dejo el presupuesto que vimos con la doctora.'], [35, 'c', 'wa', 'Lo he hablado con mi marido. ¿La financiación a 24 meses sigue en pie? Querríamos empezar pronto.']] },
      { id: 'k02', n: 'Antonio Gil', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Valencia', prod: 'Ortodoncia invisible', orig: 'c2', canal: 'wa', etapa: 6, valor: 3900, creado: 20 * D, act: 9 * D, toque: 9 * D,
        f: { cerca: '20 minutos' }, s: { prop: 10 * D, propVista: 1, pienso: true },
        conv: [[10 * D, 'h', 'wa', 'Antonio, aquí tienes el presupuesto de la ortodoncia.'], [9 * D, 'c', 'wa', 'Gracias, me lo pienso y te digo.']] },
      { id: 'k03', n: 'Rosa Jiménez', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Mislata', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 6, valor: 3200, creado: 16 * D, act: 5 * D, toque: 5 * D,
        f: { cerca: '10 minutos' }, s: { prop: 8 * D, propVista: 3, financia: true },
        conv: [[8 * D, 'h', 'wa', 'Rosa, te mando el presupuesto.'], [7 * D, 'c', 'wa', '¿Esto se puede financiar?'], [5 * D, 'h', 'wa', 'Sí, te lo miro y te digo.']] },
      { id: 'k04', n: 'Javier Ribas', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Valencia', prod: 'Carillas', orig: 'c5', canal: 'wa', etapa: 6, valor: 4800, creado: 30 * D, act: 14 * D, toque: 14 * D,
        f: { paciente: true, cerca: '5 minutos' }, s: { prop: 14 * D, propVista: 0 }, conv: [[14 * D, 'h', 'wa', 'Javier, te envío el presupuesto de las carillas.']] },
      { id: 'k05', n: 'Lourdes Peña', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Burjassot', prod: 'Ortodoncia invisible', orig: 'c2', canal: 'wa', etapa: 6, valor: 3900, creado: 9 * D, act: 2 * D, toque: 3 * D,
        f: { cerca: '25 minutos' }, s: { prop: 4 * D, propVista: 4, financia: true, visitas: 3 },
        conv: [[4 * D, 'h', 'wa', 'Lourdes, aquí tienes el presupuesto.'], [3 * D, 'c', 'wa', '¿Cuántos meses dura el tratamiento?'], [3 * D, 'a', 'wa', 'Entre 12 y 18 meses según cómo evolucione. ¿Te resuelvo algo más?']] },
      { id: 'k06', n: 'Tomás Ferrer', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Torrent', prod: 'Implantes dentales', orig: 'c1', canal: 'tel', etapa: 6, valor: 2600, creado: 25 * D, act: 20 * D, toque: 20 * D, f: { compara: true }, s: { prop: 21 * D, propVista: 1 }, conv: [] },
      // --- Citas y no-show
      { id: 'k07', n: 'Elena Soriano', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Valencia', prod: 'Ortodoncia invisible', orig: 'c2', canal: 'wa', etapa: 3, valor: 3900, creado: 3 * D, act: 20 * H, toque: 20 * H,
        f: { cerca: '10 minutos' }, s: { cita: 18 * H, citaOk: false, visitas: 2 }, conv: [[3 * D, 'a', 'wa', 'Hola Elena, ¿te va bien mañana a las 12:00?'], [3 * D - 20, 'c', 'wa', 'Sí, perfecto.']] },
      { id: 'k08', n: 'Raúl Navarro', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Paterna', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 3, valor: 3200, creado: 6 * D, act: 2 * D, toque: 2 * D,
        f: { cerca: '20 minutos' }, s: { noshow: true, precio: true }, conv: [[3 * D, 'a', 'wa', 'Te esperamos mañana a las 9:30, Raúl.'], [3 * D - 10, 'c', 'wa', 'Ok gracias']], ev: [[2 * D, 'sistema', 'No se presenta a la primera visita']] },
      { id: 'k09', n: 'Carmen Vázquez', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Valencia', prod: 'Estética facial', orig: 'c4', canal: 'wa', etapa: 3, valor: 450, creado: 4 * D, act: 1 * D, toque: 1 * D, f: { cerca: '5 minutos' }, s: { cita: 40 * H, citaOk: false }, conv: [[1 * D, 'a', 'wa', 'Carmen, te confirmo la cita del jueves a las 18:00.']] },
      { id: 'k10', n: 'Julián Moreno', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Valencia', prod: 'Limpieza y revisión', orig: 'c3', canal: 'wa', etapa: 3, valor: 180, creado: 2 * D, act: 5 * H, toque: 5 * H, f: {}, s: { cita: 3 * D, citaOk: true }, conv: [[5 * H, 'c', 'wa', 'Confirmado, el lunes allí estoy.']] },
      { id: 'k11', n: 'Beatriz Llopis', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Alboraya', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 3, valor: 3200, creado: 9 * D, act: 4 * D, toque: 4 * D, f: { cerca: '15 minutos' }, s: { noshow: true, financia: true }, conv: [[5 * D, 'a', 'wa', 'Beatriz, te esperamos mañana a las 11:00.']], ev: [[4 * D, 'sistema', 'No se presenta a la primera visita']] },
      // --- Consultas nuevas
      { id: 'k12', n: 'Francisco Ruiz', rol: 'Consulta por implantes', seg: 'nuevo', ciudad: 'Valencia', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 1, valor: 3200, creado: 7, act: 7, toque: null, f: { cerca: '10 minutos' }, s: {}, conv: [] },
      { id: 'k13', n: 'Isabel Mora', rol: 'Consulta por ortodoncia', seg: 'nuevo', ciudad: 'Valencia', prod: 'Ortodoncia invisible', orig: 'c2', canal: 'tel', etapa: 1, valor: 3900, creado: 26, act: 26, toque: null, f: {}, s: {}, conv: [] },
      { id: 'k14', n: 'Marta Sanz', rol: 'Consulta por estética', seg: 'nuevo', ciudad: 'Valencia', prod: 'Estética facial', orig: 'c4', canal: 'wa', etapa: 2, valor: 450, creado: 3 * H, act: 1 * H, toque: 2 * H,
        f: {}, s: { precio: true, cita: 4 * D, citaOk: true }, conv: [[3 * H - 1, 'a', 'wa', 'Hola Marta, soy Ana, de la clínica. ¿Qué te gustaría tratar?'], [2 * H, 'c', 'wa', 'Arrugas del entrecejo. ¿Precio?'], [2 * H - 1, 'a', 'wa', 'Desde 250 € según la zona, y la valoración es gratis. ¿Te va bien el martes?'], [60, 'c', 'wa', 'El martes por la tarde sí.'], [59, 'a', 'wa', 'Te reservo el martes a las 18:00. Te escribo ese día por la mañana para recordártelo.']] },
      { id: 'k15', n: 'Diego Castro', rol: 'Consulta por urgencia', seg: 'nuevo', ciudad: 'Valencia', prod: 'Urgencia dental', orig: 'c3', canal: 'tel', etapa: 2, valor: 180, creado: 50, act: 45, toque: 48, f: { cerca: '10 minutos' }, s: { urg: true, urgTxt: 'tiene dolor desde ayer', cita: 5 * H, citaOk: true }, conv: [[48, 'v', 'voz', 'Llamada de la agente de voz: tiene dolor en una muela desde ayer. Se le ofrece hueco hoy a las 17:00.'], [46, 'c', 'voz', 'Acepta el hueco de hoy a las 17:00.'], [45, 'a', 'wa', 'Diego, te confirmo hoy a las 17:00. Te dejo aquí la ubicación.']] },
      // --- En cadencia / sin respuesta
      { id: 'k16', n: 'Nieves Guerrero', rol: 'Consulta por implantes', seg: 'nuevo', ciudad: 'Sagunto', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 1, valor: 3200, creado: 2 * D, act: 2 * D, toque: 2 * D - 1, f: {}, s: { intentos: 1 }, conv: [[2 * D - 1, 'a', 'wa', 'Hola Nieves, soy Ana, de la clínica. ¿Es para una pieza o para varias?']] },
      { id: 'k17', n: 'Ramón Esteve', rol: 'Consulta por ortodoncia', seg: 'nuevo', ciudad: 'Gandía', prod: 'Ortodoncia invisible', orig: 'c2', canal: 'wa', etapa: 1, valor: 3900, creado: 18 * D, act: 18 * D, toque: 12 * D, f: { lejos: '65 km' }, s: { intentos: 3 }, conv: [[18 * D, 'a', 'wa', 'Hola Ramón, ¿para quién sería el tratamiento?']] },
      { id: 'k18', n: 'Sofía Blasco', rol: 'Consulta por limpieza', seg: 'nuevo', ciudad: 'Valencia', prod: 'Limpieza y revisión', orig: 'c3', canal: 'wa', etapa: 2, valor: 180, creado: 8 * D, act: 7 * D, toque: 7 * D, f: { soloSeguro: true }, s: {}, conv: [[8 * D, 'a', 'wa', 'Hola Sofía, ¿te va bien esta semana?'], [7 * D, 'c', 'wa', '¿Esto me lo cubre Sanitas?']] },
      // --- Más adelante / me lo pienso
      { id: 'k19', n: 'Luis Campos', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Valencia', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 5, valor: 5400, creado: 40 * D, act: 30 * D, toque: 30 * D, f: { cerca: '15 minutos' }, s: { luego: 'enero', luegoTxt: 'lo haría en enero, después de la paga extra', financia: true },
        conv: [[30 * D, 'c', 'wa', 'Lo tengo claro, pero lo haré en enero, después de la paga extra.']] },
      { id: 'k20', n: 'Amparo Vidal', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Xirivella', prod: 'Ortodoncia invisible', orig: 'c2', canal: 'wa', etapa: 5, valor: 3900, creado: 50 * D, act: 44 * D, toque: 44 * D, f: {}, s: { luego: 'noviembre', luegoTxt: 'empezaría en noviembre, cuando vuelva de viaje' },
        conv: [[44 * D, 'c', 'wa', 'Ahora me voy de viaje. Empiezo en noviembre cuando vuelva.']] },
      // --- Pacientes actuales
      { id: 'k21', n: 'Josefa Martí', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Valencia', prod: 'Implantes dentales', orig: 'c5', canal: 'wa', etapa: 8, valor: 3200, creado: 200 * D, act: 180 * D, toque: 170 * D, fin: 'ganado', f: { paciente: true }, s: { revision: true, revisionTxt: 'Revisión de implantes pendiente desde hace 6 meses' }, conv: [] },
      { id: 'k22', n: 'Andrés Company', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Valencia', prod: 'Ortodoncia invisible', orig: 'c2', canal: 'wa', etapa: 8, valor: 3900, creado: 90 * D, act: 20 * D, toque: 20 * D, fin: 'ganado', f: { paciente: true }, s: { recuperado: true }, conv: [] },
      { id: 'k23', n: 'Pepa Ballester', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Valencia', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 8, valor: 6400, creado: 60 * D, act: 10 * D, toque: 10 * D, fin: 'ganado', f: { paciente: true }, s: { recuperado: true }, conv: [] },
      { id: 'k24', n: 'Vicente Olmos', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Valencia', prod: 'Limpieza y revisión', orig: 'c5', canal: 'wa', etapa: 8, valor: 180, creado: 400 * D, act: 380 * D, toque: 365 * D, fin: 'ganado', f: { paciente: true }, s: { revision: true, revisionTxt: 'Revisión anual sin reservar (última hace 13 meses)' }, conv: [] },
      { id: 'k25', n: 'Noelia Andrés', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Valencia', prod: 'Estética facial', orig: 'c4', canal: 'wa', etapa: 8, valor: 450, creado: 120 * D, act: 110 * D, toque: 110 * D, fin: 'ganado', f: { paciente: true }, s: { revision: true, revisionTxt: 'Retoque de estética a los 4 meses, sin reservar' }, conv: [] },
      { id: 'k26', n: 'Gregorio Sáez', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Valencia', prod: 'Implantes dentales', orig: 'c1', canal: 'wa', etapa: 6, valor: 3200, creado: 60 * D, act: 50 * D, toque: 40 * D, fin: 'perdido', f: { compara: true }, s: { prop: 55 * D, propVista: 1 }, conv: [] },
      { id: 'k27', n: 'Consuelo Pastor', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Valencia', prod: 'Carillas', orig: 'c5', canal: 'wa', etapa: 4, valor: 4800, creado: 5 * D, act: 1 * D, toque: 1 * D, f: { cerca: '10 minutos' }, s: { visitas: 2 },
        conv: [[2 * D, 'c', 'wa', '¿Cuándo tendré el presupuesto de las carillas?'], [1 * D, 'h', 'wa', 'Consuelo, la doctora está preparando tu presupuesto. Te lo mando mañana.']] }
    ]
  };
})();

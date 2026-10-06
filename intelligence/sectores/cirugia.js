/* Sector: Cirugía plástica y medicina estética (consulta privada de cirujano).
 * Body contouring, cirugía de pecho, lipoescultura y medicina estética.
 * Todos los nombres, casos e importes son inventados. */
(function () {
  const H = 60, D = 1440;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.cirugia = {
    id: 'cirugia',
    nombre: 'Cirugía y medicina estética',
    t: {
      contacto: 'paciente', contactos: 'pacientes', Contactos: 'Pacientes', Contacto: 'Paciente',
      venta: 'tratamiento aceptado', ventas: 'tratamientos aceptados', Ventas: 'Tratamientos aceptados', producto: 'tratamiento',
      paginaVisitas: 'la página del tratamiento', txtPrecio: 'preguntó por el precio', cita: 'primera valoración', Cita: 'Primera valoración', laCita: 'la primera valoración',
      propuesta: 'el presupuesto', Propuesta: 'Presupuesto', comercial: 'la coordinadora de pacientes', Comercial: 'Coordinadora de pacientes',
      cs: 'la coordinadora de pacientes', CS: 'Coordinadora de pacientes',
      cliente: 'paciente', unCliente: 'un paciente', convierten: 'aceptan el tratamiento', objetivoPaso: 'reservar la primera valoración',
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
    ticket: 4500,
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
    mesDatos: { respuestaAntes: 190, respuestaAhora: 1, agendadas: 97 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Body contouring · reel antes y después', inversion: 1600, ticket: 4500,
        embudo: { anuncio: 6200, consulta: 70, contacto: 50, cita: 30, asistencia: 22, diagnostico: 22, presupuesto: 20, seguimiento: 20, tratamiento: 5 } },
      { id: 'c2', canal: 'Meta', nombre: 'Aumento de pecho', inversion: 1100, ticket: 5500,
        embudo: { anuncio: 4300, consulta: 45, contacto: 33, cita: 20, asistencia: 15, diagnostico: 15, presupuesto: 14, seguimiento: 14, tratamiento: 4 } },
      { id: 'c3', canal: 'Google', nombre: 'Cirujano plástico Barcelona', inversion: 900, ticket: 4800,
        embudo: { anuncio: 1500, consulta: 30, contacto: 25, cita: 17, asistencia: 14, diagnostico: 14, presupuesto: 12, seguimiento: 12, tratamiento: 4 } },
      { id: 'c4', canal: 'Meta', nombre: 'Medicina estética facial', inversion: 400, ticket: 400,
        embudo: { anuncio: 1200, consulta: 25, contacto: 20, cita: 14, asistencia: 12, diagnostico: 12, presupuesto: 11, seguimiento: 11, tratamiento: 7 } },
      { id: 'c5', canal: 'Instagram', nombre: 'Orgánico, web y recomendación', inversion: 0, ticket: 3800,
        embudo: { anuncio: 900, consulta: 25, contacto: 22, cita: 16, asistencia: 14, diagnostico: 14, presupuesto: 12, seguimiento: 12, tratamiento: 5 } }
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
        [function (c) { return c.f && c.f.soloSeguro; }, -14, 'pregunta si lo cubre el seguro', 'Pregunta por el seguro'],
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
      bodycontouring: {
        titulo: 'Escribe tras el reel de body contouring un domingo a las 22:40',
        contacto: { id: 'demo', n: 'Laura Puig', rol: 'Consulta por body contouring', seg: 'nuevo', ciudad: '—', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 1, valor: 4500, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una consulta desde el reel de body contouring, fuera de horario', feed: 'Consulta nueva · body contouring · domingo 22:40', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 50 segundos', cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Laura, soy Clara, de la consulta del doctor. He visto que te interesa el body contouring. ¿Qué zona te gustaría trabajar?'] }, toque: true },
          { dur: 6, min: 2, txt: 'Laura contesta y el agente completa su ficha', feed: 'Ficha completada · abdomen y flancos · vive en Sant Cugat', cambio: { f: { cerca: '20 minutos' }, ciudad: 'Sant Cugat', conv: ['c', 'wa', 'Abdomen y flancos, después de dos embarazos. Vivo en Sant Cugat. ¿Cuánto cuesta más o menos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente no da precio sin valoración: explica y cualifica', feed: 'Pregunta de cualificación enviada', cambio: { conv: ['a', 'wa', 'Depende de la zona y de tu caso, por eso el doctor hace primero una valoración y sales con el plan y el presupuesto cerrados. ¿Lo estás pensando para antes del verano o no tienes prisa?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Laura pregunta por financiación y mira los casos de antes y después', feed: 'Pregunta por financiación · ve la galería de casos', cambio: { s: { precio: true, financia: true, visitas: 3 }, conv: ['c', 'wa', 'Para antes del verano. ¿Se puede pagar a plazos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente explica la financiación y propone valoración', feed: 'Financiación explicada · dos huecos propuestos', cambio: { conv: ['a', 'wa', 'Sí, se puede financiar. Te propongo la valoración el jueves a las 17:00 o el sábado a las 11:00, en la consulta de Bonanova. ¿Cuál te va mejor?'] }, toque: true },
          { dur: 6, min: 2, txt: 'Laura elige hora', feed: 'Intención alta · quiere operarse antes del verano', cambio: { s: { urg: true, urgTxt: 'quiere operarse antes del verano' }, conv: ['c', 'wa', 'El jueves a las 17:00.'] }, act: true },
          { dur: 6, min: 1, txt: 'Valoración reservada y recordatorio programado', feed: 'Primera valoración reservada · jueves 17:00', cambio: { etapa: 3, s: { cita: 4 * 24 * 60, citaOk: true }, conv: ['a', 'wa', 'Hecho, el jueves a las 17:00 con el doctor. Te llega la ubicación y la víspera te escribo para recordártelo.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Laura está lista', feed: 'Aviso enviado a la coordinadora de pacientes', humano: { titulo: 'Laura viene el jueves y quiere decidir', texto: 'Body contouring abdomen y flancos tras dos embarazos · vive en Sant Cugat · pregunta por financiación · quiere operarse antes del verano · vino del reel de antes y después. Valoración el jueves a las 17:00: tener preparado el plan de pago.' } }
        ]
      }
    },
    historiaDefecto: 'bodycontouring',

    contactos: [
      // --- Presupuestos abiertos
      { id: 'k01', n: 'Mercedes Alonso', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 6, valor: 6400, creado: 12 * D, act: 35, toque: 6 * D,
        f: { cerca: '15 minutos' }, s: { prop: 6 * D, propVista: 2, financia: true, precio: true },
        conv: [[6 * D, 'h', 'wa', 'Mercedes, te dejo el presupuesto que vimos con el doctor.'], [35, 'c', 'wa', 'Lo he hablado con mi marido. ¿La financiación a 24 meses sigue en pie? Querríamos empezar pronto.']] },
      { id: 'k02', n: 'Antonio Gil', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Aumento de pecho', orig: 'c2', canal: 'wa', etapa: 6, valor: 3900, creado: 20 * D, act: 9 * D, toque: 9 * D,
        f: { cerca: '20 minutos' }, s: { prop: 10 * D, propVista: 1, pienso: true },
        conv: [[10 * D, 'h', 'wa', 'Antonio, aquí tienes el presupuesto del aumento de pecho.'], [9 * D, 'c', 'wa', 'Gracias, me lo pienso y te digo.']] },
      { id: 'k03', n: 'Rosa Jiménez', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Sant Cugat', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 6, valor: 3200, creado: 16 * D, act: 5 * D, toque: 5 * D,
        f: { cerca: '10 minutos' }, s: { prop: 8 * D, propVista: 3, financia: true },
        conv: [[8 * D, 'h', 'wa', 'Rosa, te mando el presupuesto.'], [7 * D, 'c', 'wa', '¿Esto se puede financiar?'], [5 * D, 'h', 'wa', 'Sí, te lo miro y te digo.']] },
      { id: 'k04', n: 'Javier Ribas', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Barcelona', prod: 'Lipoescultura', orig: 'c5', canal: 'wa', etapa: 6, valor: 4800, creado: 30 * D, act: 14 * D, toque: 14 * D,
        f: { paciente: true, cerca: '5 minutos' }, s: { prop: 14 * D, propVista: 0 }, conv: [[14 * D, 'h', 'wa', 'Javier, te envío el presupuesto de la lipoescultura.']] },
      { id: 'k05', n: 'Lourdes Peña', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Badalona', prod: 'Aumento de pecho', orig: 'c2', canal: 'wa', etapa: 6, valor: 3900, creado: 9 * D, act: 2 * D, toque: 3 * D,
        f: { cerca: '25 minutos' }, s: { prop: 4 * D, propVista: 4, financia: true, visitas: 3 },
        conv: [[4 * D, 'h', 'wa', 'Lourdes, aquí tienes el presupuesto.'], [3 * D, 'c', 'wa', '¿Cuánto tiempo de baja necesito después?'], [3 * D, 'a', 'wa', 'Suele ser una semana de reposo relativo; el doctor te lo concreta en tu caso. ¿Te resuelvo algo más?']] },
      { id: 'k06', n: 'Tomás Ferrer', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Terrassa', prod: 'Body contouring', orig: 'c1', canal: 'tel', etapa: 6, valor: 2600, creado: 25 * D, act: 20 * D, toque: 20 * D, f: { compara: true }, s: { prop: 21 * D, propVista: 1 }, conv: [] },
      // --- Citas y no-show
      { id: 'k07', n: 'Elena Soriano', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Aumento de pecho', orig: 'c2', canal: 'wa', etapa: 3, valor: 3900, creado: 3 * D, act: 20 * H, toque: 20 * H,
        f: { cerca: '10 minutos' }, s: { cita: 18 * H, citaOk: false, visitas: 2 }, conv: [[3 * D, 'a', 'wa', 'Hola Elena, ¿te va bien mañana a las 12:00?'], [3 * D - 20, 'c', 'wa', 'Sí, perfecto.']] },
      { id: 'k08', n: 'Raúl Navarro', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Sabadell', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 3, valor: 3200, creado: 6 * D, act: 2 * D, toque: 2 * D,
        f: { cerca: '20 minutos' }, s: { noshow: true, precio: true }, conv: [[3 * D, 'a', 'wa', 'Te esperamos mañana a las 9:30 para la valoración, Raúl.'], [3 * D - 10, 'c', 'wa', 'Ok gracias']], ev: [[2 * D, 'sistema', 'No se presenta a la primera valoración']] },
      { id: 'k09', n: 'Carmen Vázquez', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Medicina estética facial', orig: 'c4', canal: 'wa', etapa: 3, valor: 450, creado: 4 * D, act: 1 * D, toque: 1 * D, f: { cerca: '5 minutos' }, s: { cita: 40 * H, citaOk: false }, conv: [[1 * D, 'a', 'wa', 'Carmen, te confirmo la cita del jueves a las 18:00.']] },
      { id: 'k10', n: 'Julián Moreno', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Revisión postoperatoria', orig: 'c3', canal: 'wa', etapa: 3, valor: 180, creado: 2 * D, act: 5 * H, toque: 5 * H, f: {}, s: { cita: 3 * D, citaOk: true }, conv: [[5 * H, 'c', 'wa', 'Confirmado, el lunes allí estoy.']] },
      { id: 'k11', n: 'Beatriz Llopis', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'L\'Hospitalet', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 3, valor: 3200, creado: 9 * D, act: 4 * D, toque: 4 * D, f: { cerca: '15 minutos' }, s: { noshow: true, financia: true }, conv: [[5 * D, 'a', 'wa', 'Beatriz, te esperamos mañana a las 11:00.']], ev: [[4 * D, 'sistema', 'No se presenta a la primera valoración']] },
      // --- Consultas nuevas
      { id: 'k12', n: 'Francisco Ruiz', rol: 'Consulta por body contouring', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 1, valor: 3200, creado: 7, act: 7, toque: null, f: { cerca: '10 minutos' }, s: {}, conv: [] },
      { id: 'k13', n: 'Isabel Mora', rol: 'Consulta por aumento de pecho', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Aumento de pecho', orig: 'c2', canal: 'tel', etapa: 1, valor: 3900, creado: 26, act: 26, toque: null, f: {}, s: {}, conv: [] },
      { id: 'k14', n: 'Marta Sanz', rol: 'Consulta por medicina estética', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Medicina estética facial', orig: 'c4', canal: 'wa', etapa: 2, valor: 450, creado: 3 * H, act: 1 * H, toque: 2 * H,
        f: {}, s: { precio: true, cita: 4 * D, citaOk: true }, conv: [[3 * H - 1, 'a', 'wa', 'Hola Marta, soy Clara, de la consulta del doctor. ¿Qué te gustaría tratar?'], [2 * H, 'c', 'wa', 'Arrugas del entrecejo. ¿Precio?'], [2 * H - 1, 'a', 'wa', 'Depende de la zona; la valoración con el doctor te lo concreta. ¿Te va bien el martes?'], [60, 'c', 'wa', 'El martes por la tarde sí.'], [59, 'a', 'wa', 'Te reservo el martes a las 18:00. Te escribo ese día por la mañana para recordártelo.']] },
      { id: 'k15', n: 'Diego Castro', rol: 'Duda tras la operación', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Duda postoperatoria', orig: 'c3', canal: 'tel', etapa: 2, valor: 180, creado: 50, act: 45, toque: 48, f: { cerca: '10 minutos' }, s: { urg: true, urgTxt: 'nota inflamación tras la operación', cita: 5 * H, citaOk: true }, conv: [[48, 'v', 'voz', 'Llamada de la agente de voz: operado hace una semana, nota más inflamación de la esperada. Se le ofrece revisión hoy a las 17:00.'], [46, 'c', 'voz', 'Acepta el hueco de hoy a las 17:00.'], [45, 'a', 'wa', 'Diego, te confirmo hoy a las 17:00. Te dejo aquí la ubicación.']] },
      // --- En cadencia / sin respuesta
      { id: 'k16', n: 'Nieves Guerrero', rol: 'Consulta por body contouring', seg: 'nuevo', ciudad: 'Mataró', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 1, valor: 3200, creado: 2 * D, act: 2 * D, toque: 2 * D - 1, f: {}, s: { intentos: 1 }, conv: [[2 * D - 1, 'a', 'wa', 'Hola Nieves, soy Clara, de la consulta del doctor. ¿Qué zona te gustaría trabajar?']] },
      { id: 'k17', n: 'Ramón Esteve', rol: 'Consulta por aumento de pecho', seg: 'nuevo', ciudad: 'Girona', prod: 'Aumento de pecho', orig: 'c2', canal: 'wa', etapa: 1, valor: 3900, creado: 18 * D, act: 18 * D, toque: 12 * D, f: { lejos: '100 km' }, s: { intentos: 3 }, conv: [[18 * D, 'a', 'wa', 'Hola Ramón, ¿qué zona te gustaría trabajar?']] },
      { id: 'k18', n: 'Sofía Blasco', rol: 'Consulta por revisión', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Revisión postoperatoria', orig: 'c3', canal: 'wa', etapa: 2, valor: 180, creado: 8 * D, act: 7 * D, toque: 7 * D, f: { soloSeguro: true }, s: {}, conv: [[8 * D, 'a', 'wa', 'Hola Sofía, ¿te va bien esta semana?'], [7 * D, 'c', 'wa', '¿Esto lo cubre algún seguro?']] },
      // --- Más adelante / me lo pienso
      { id: 'k19', n: 'Luis Campos', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 5, valor: 5400, creado: 40 * D, act: 30 * D, toque: 30 * D, f: { cerca: '15 minutos' }, s: { luego: 'enero', luegoTxt: 'se operará en enero, cuando pueda coger la baja', financia: true },
        conv: [[30 * D, 'c', 'wa', 'Lo tengo claro, pero me operaré en enero, cuando pueda coger la baja.']] },
      { id: 'k20', n: 'Amparo Vidal', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Castelldefels', prod: 'Aumento de pecho', orig: 'c2', canal: 'wa', etapa: 5, valor: 3900, creado: 50 * D, act: 44 * D, toque: 44 * D, f: {}, s: { luego: 'noviembre', luegoTxt: 'empezaría en noviembre, cuando vuelva de viaje' },
        conv: [[44 * D, 'c', 'wa', 'Ahora me voy de viaje. Empiezo en noviembre cuando vuelva.']] },
      // --- Pacientes actuales
      { id: 'k21', n: 'Josefa Martí', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Barcelona', prod: 'Body contouring', orig: 'c5', canal: 'wa', etapa: 8, valor: 3200, creado: 200 * D, act: 180 * D, toque: 170 * D, fin: 'ganado', f: { paciente: true }, s: { revision: true, revisionTxt: 'Revisión de los 6 meses pendiente' }, conv: [] },
      { id: 'k22', n: 'Andrés Company', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Barcelona', prod: 'Aumento de pecho', orig: 'c2', canal: 'wa', etapa: 8, valor: 3900, creado: 90 * D, act: 20 * D, toque: 20 * D, fin: 'ganado', f: { paciente: true }, s: { recuperado: true }, conv: [] },
      { id: 'k23', n: 'Pepa Ballester', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Barcelona', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 8, valor: 6400, creado: 60 * D, act: 10 * D, toque: 10 * D, fin: 'ganado', f: { paciente: true }, s: { recuperado: true }, conv: [] },
      { id: 'k24', n: 'Vicente Olmos', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Barcelona', prod: 'Revisión postoperatoria', orig: 'c5', canal: 'wa', etapa: 8, valor: 180, creado: 400 * D, act: 380 * D, toque: 365 * D, fin: 'ganado', f: { paciente: true }, s: { revision: true, revisionTxt: 'Revisión del año sin reservar' }, conv: [] },
      { id: 'k25', n: 'Noelia Andrés', rol: 'Paciente de la clínica', seg: 'paciente', ciudad: 'Barcelona', prod: 'Medicina estética facial', orig: 'c4', canal: 'wa', etapa: 8, valor: 450, creado: 120 * D, act: 110 * D, toque: 110 * D, fin: 'ganado', f: { paciente: true }, s: { revision: true, revisionTxt: 'Retoque de medicina estética a los 4 meses, sin reservar' }, conv: [] },
      { id: 'k26', n: 'Gregorio Sáez', rol: 'Paciente nuevo', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Body contouring', orig: 'c1', canal: 'wa', etapa: 6, valor: 3200, creado: 60 * D, act: 50 * D, toque: 40 * D, fin: 'perdido', f: { compara: true }, s: { prop: 55 * D, propVista: 1 }, conv: [] },
      { id: 'k27', n: 'Consuelo Pastor', rol: 'Paciente nueva', seg: 'nuevo', ciudad: 'Barcelona', prod: 'Lipoescultura', orig: 'c5', canal: 'wa', etapa: 4, valor: 4800, creado: 5 * D, act: 1 * D, toque: 1 * D, f: { cerca: '10 minutos' }, s: { visitas: 2 },
        conv: [[2 * D, 'c', 'wa', '¿Cuándo tendré el presupuesto de la lipoescultura?'], [1 * D, 'h', 'wa', 'Consuelo, el doctor está preparando tu presupuesto. Te lo mando mañana.']] }
    ]
  };
})();

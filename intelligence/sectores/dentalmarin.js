/* Sector: Clínica Dental Marín (dos sedes: Patraix, en Valencia, y Torrent).
 * Cuenta de cliente oculta: se abre por enlace (?sector=dentalmarin) y no sale en la pantalla de inicio.
 * Preparado el 10-nov a partir de clinica.js para la primera reunión. Las sedes y los temas de las campañas
 * salen de sus anuncios públicos de Meta (Limpieza + TAC, Implantes «desde 1 €/día», Ortodoncia invisible,
 * Carillas / diseño de sonrisa y Recupera tu sonrisa en 24 h). Las etapas son las propuestas: Petición nueva ·
 * Contactado · Primera visita agendada · Primera visita hecha · Presupuesto entregado · Presupuesto aceptado.
 * Todo lo demás (pacientes, equipo de recepción, inversión, volúmenes, embudo, mensajes e importes) son
 * DATOS DE EJEMPLO inventados. Los importes solo sirven para que cuadren las sumas: no son sus precios. */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  const hv = Q.hueco(10);

  const IMP = 'Implantes', S24 = 'Sonrisa en 24 h (implantes)', ORT = 'Ortodoncia invisible', CAR = 'Carillas y diseño de sonrisa',
    LIM = 'Limpieza + TAC', GEN = 'Odontología general';
  // Importes de ejemplo para las sumas del panel (no son precios de la clínica).
  const P = {}; P[IMP] = 2800; P[S24] = 6000; P[ORT] = 3200; P[CAR] = 2400; P[LIM] = 90; P[GEN] = 250;
  // Recepción de cada sede (nombres inventados).
  const REC = { Patraix: 'Paula', Torrent: 'Rocío' };
  const rec = function (c) { return REC[c.sede] || 'recepción'; };
  const MIN_HISTORIA = 1 + 1 + 2 + 1 + 3 + 1 + 2 + 1;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.dentalmarin = {
    id: 'dentalmarin',
    nombre: 'Clínica Dental Marín',
    t: {
      contacto: 'paciente', contactos: 'pacientes', Contactos: 'Pacientes', Contacto: 'Paciente',
      venta: 'presupuesto aceptado', ventas: 'presupuestos aceptados', Ventas: 'Presupuestos aceptados', producto: 'tratamiento',
      paginaVisitas: 'la página del tratamiento', txtPrecio: 'preguntó por el precio', cita: 'primera visita', Cita: 'Primera visita', laCita: 'la primera visita',
      propuesta: 'el presupuesto', Propuesta: 'Presupuesto', comercial: 'recepción', Comercial: 'Recepción',
      cs: 'recepción', CS: 'Recepción',
      cliente: 'paciente', unCliente: 'un paciente', convierten: 'aceptan el presupuesto', objetivoPaso: 'reservar la primera visita en su sede',
      casoExito: 'cómo es el tratamiento paso a paso', valorAlto: 2000, oportunidades: 'pacientes',
      laVenta: 'la aceptación del presupuesto', Producto: 'Tratamiento', clientes: 'pacientes', propuestas: 'presupuestos', verbo: 'aceptar el presupuesto',
      clientesReales: 'tratamientos de verdad', empleados: 'empleados', pasoHumano: 'resolver sus dudas del presupuesto y la financiación',
      nombreAgenteVoz: 'Clara',
      senales: { propuesta: 'Presupuesto sin respuesta', nueva: 'Petición nueva', intencion: 'Intención alta', noshow: 'Primera visita en riesgo' }
    },
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'peticion', txt: 'Petición nueva' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'agendada', txt: 'Primera visita agendada' },
      { id: 'hecha', txt: 'Primera visita hecha' },
      { id: 'presupuesto', txt: 'Presupuesto entregado' },
      { id: 'aceptado', txt: 'Presupuesto aceptado' }
    ],
    ventaEtapa: 'aceptado',
    ticket: 2400,
    // Lo habitual en clínicas cuando se contesta a tiempo y se hace seguimiento (referencia de ejemplo, no datos suyos).
    referencia: { contactado: 0.9, agendada: 0.7, hecha: 0.85, presupuesto: 0.75, aceptado: 0.5 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'peticiones de formulario y WhatsApp que nadie llama a tiempo, sobre todo fuera de horario' },
      agendada: { txt: 'Primera visita', exp: 'pacientes contactados a los que nadie les cierra un hueco en su sede' },
      hecha: { txt: 'Asistencia', exp: 'primeras visitas agendadas a las que el paciente no viene' },
      presupuesto: { txt: 'Presupuesto', exp: 'primeras visitas que no terminan en un presupuesto entregado' },
      aceptado: { txt: 'Seguimiento de presupuestos', exp: 'presupuestos de implantes y ortodoncia entregados a los que nadie hace seguimiento' }
    },
    remedioFuga: {
      contactado: 'Respuesta por WhatsApp en el minuto uno, a cualquier hora, que pregunta la sede (Patraix o Torrent) y propone huecos reales de esa sede.',
      hecha: 'Recordatorio el día antes y el mismo día, con la dirección de su sede. A quien no viene, se le propone otro hueco sin llamar.',
      aceptado: 'Seguimiento de cada presupuesto con fecha: el sistema resuelve dudas por WhatsApp y avisa a recepción de la sede cuando el paciente pregunta por la financiación o está listo para decidir.'
    },
    mesDatos: { respuestaAntes: 260, respuestaAhora: 1, agendadas: 300 },
    campanas: [
      { id: 'c1', sede: 'Patraix', canal: 'Meta', nombre: 'Limpieza + TAC · Patraix', inversion: 600, ticket: P[LIM],
        embudo: { anuncio: 6000, peticion: 95, contactado: 70, agendada: 52, hecha: 42, presupuesto: 18, aceptado: 5 } },
      { id: 'c2', sede: 'Torrent', canal: 'Meta', nombre: 'Limpieza + TAC · Torrent', inversion: 450, ticket: P[LIM],
        embudo: { anuncio: 4200, peticion: 70, contactado: 44, agendada: 30, hecha: 23, presupuesto: 9, aceptado: 2 } },
      { id: 'c3', sede: 'Patraix', canal: 'Meta', nombre: 'Implantes «desde 1 €/día» · Patraix', inversion: 1500, ticket: P[IMP],
        embudo: { anuncio: 7800, peticion: 80, contactado: 60, agendada: 40, hecha: 31, presupuesto: 26, aceptado: 5 } },
      { id: 'c4', sede: 'Torrent', canal: 'Meta', nombre: 'Implantes «desde 1 €/día» · Torrent', inversion: 1100, ticket: P[IMP],
        embudo: { anuncio: 6100, peticion: 64, contactado: 38, agendada: 24, hecha: 18, presupuesto: 15, aceptado: 2 } },
      { id: 'c5', sede: 'Patraix', canal: 'Meta', nombre: 'Ortodoncia invisible · Patraix', inversion: 1000, ticket: P[ORT],
        embudo: { anuncio: 5200, peticion: 52, contactado: 40, agendada: 27, hecha: 22, presupuesto: 18, aceptado: 3 } },
      { id: 'c6', sede: 'Torrent', canal: 'Meta', nombre: 'Ortodoncia invisible · Torrent', inversion: 650, ticket: P[ORT],
        embudo: { anuncio: 3600, peticion: 34, contactado: 22, agendada: 14, hecha: 11, presupuesto: 9, aceptado: 1 } },
      { id: 'c7', sede: 'Patraix', canal: 'Meta', nombre: 'Carillas / diseño de sonrisa · Patraix', inversion: 650, ticket: P[CAR],
        embudo: { anuncio: 4100, peticion: 30, contactado: 22, agendada: 14, hecha: 11, presupuesto: 9, aceptado: 2 } },
      { id: 'c8', sede: 'Torrent', canal: 'Meta', nombre: 'Carillas / diseño de sonrisa · Torrent', inversion: 400, ticket: P[CAR],
        embudo: { anuncio: 2600, peticion: 18, contactado: 11, agendada: 7, hecha: 5, presupuesto: 4, aceptado: 1 } },
      { id: 'c9', sede: 'Patraix', canal: 'Meta', nombre: 'Recupera tu sonrisa en 24 h · Patraix', inversion: 1000, ticket: P[S24],
        embudo: { anuncio: 4300, peticion: 26, contactado: 20, agendada: 14, hecha: 11, presupuesto: 9, aceptado: 2 } },
      { id: 'c10', sede: 'Torrent', canal: 'Meta', nombre: 'Recupera tu sonrisa en 24 h · Torrent', inversion: 700, ticket: P[S24],
        embudo: { anuncio: 3400, peticion: 21, contactado: 13, agendada: 8, hecha: 6, presupuesto: 5, aceptado: 1 } },
      { id: 'c11', canal: 'Web', nombre: 'Web, Google y recomendación (las dos sedes)', inversion: 0, ticket: 1500,
        embudo: { anuncio: 2200, peticion: 60, contactado: 54, agendada: 42, hecha: 37, presupuesto: 22, aceptado: 12 } }
    ],
    kpis: ['interesados', 'respuesta', 'sedes', 'cualificados', 'show', 'presupuestos', 'aceptados', 'pptoAbierto', 'ventas', 'ingresos'],
    kpiNombres: { interesados: 'Peticiones nuevas', cualificados: 'Primeras visitas agendadas', entrevistas: 'Primeras visitas hechas', ventas: 'Presupuestos aceptados', ingresos: 'Facturación aceptada' },
    kpiEtapas: { interesados: 'peticion', cualificados: 'agendada', entrevistas: 'hecha' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      const abiertos = cs.filter(function (c) { return !c.fin && c.s.tProp != null; });
      const sinSeg = abiertos.filter(function (c) { return c.x && c.x.k.toque > 2 * 1440; });
      const porSede = function (s) { return cfg.campanas.filter(function (c) { return c.sede === s; }).reduce(function (a, c) { return a + (c.embudo.peticion || 0); }, 0); };
      return {
        sedes: { l: 'Peticiones · Patraix / Torrent', v: M.num(porSede('Patraix')) + ' / ' + M.num(porSede('Torrent')), em: M.num((cfg.campanas.filter(function (c) { return !c.sede; })[0] || { embudo: {} }).embudo.peticion || 0) + ' más de la web, sin sede elegida' },
        presupuestos: { l: 'Presupuestos entregados', v: M.num(m.tot.presupuesto), em: M.pct(m.tot.presupuesto / Math.max(1, m.tot.hecha)) + ' de las primeras visitas hechas' },
        aceptados: { l: 'Presupuestos aceptados', v: M.pct(m.tot.aceptado / Math.max(1, m.tot.presupuesto)), em: 'Con seguimiento suele rondar el 50 %', clase: 'mal' },
        pptoAbierto: { l: 'En presupuestos abiertos', v: M.euros(abiertos.reduce(function (a, c) { return a + c.valor; }, 0)), em: M.euros(sinSeg.reduce(function (a, c) { return a + c.valor; }, 0)) + ' sin seguimiento (ejemplo)', clase: 'mal' }
      };
    },
    agenda: { horas: [9, 20], pausa: [14, 16], ocupacion: 0.55, etapa: 'agendada',
      tipos: ['Primera visita · Patraix', 'Primera visita · Torrent', 'Limpieza + TAC · Patraix', 'Limpieza + TAC · Torrent', 'Entrega de presupuesto'] },
    textoAlta: function (c) {
      const cp = (window.QV_SECTORES.dentalmarin.campanas || []).filter(function (x) { return x.id === c.orig; })[0];
      return 'Petición nueva · ' + c.prod + (c.sede ? ' · sede ' + c.sede : '') + (cp ? ' · desde ' + cp.canal : '');
    },

    reglas: {
      fitBase: 34,
      fit: [
        [function (c) { return c.valor >= 2000; }, 20, function (c) { return 'tratamiento de ' + c.prod.toLowerCase(); }, 'Implantes, ortodoncia o estética'],
        [function (c) { return c.valor >= 200 && c.valor < 2000; }, 6, 'tratamiento de ticket medio'],
        [function (c) { return c.f && c.f.cerca; }, 16, function (c) { return 'vive a ' + c.f.cerca + ' de la sede de ' + c.sede; }, 'Vive cerca de una de las sedes'],
        [function (c) { return c.f && c.f.paciente; }, 16, 'ya es paciente de la clínica', 'Ya es paciente'],
        [function (c) { return c.f && c.f.tac; }, 10, 'ya tiene el TAC hecho en la clínica', 'Se hizo el TAC en la clínica'],
        [function (c) { return c.f && c.f.lejos; }, -18, function (c) { return 'vive lejos (' + c.f.lejos + ')'; }, 'Vive lejos de las dos sedes'],
        [function (c) { return c.f && c.f.soloSeguro; }, -14, 'solo busca lo que cubre su seguro', 'Solo busca lo que cubre el seguro'],
        [function (c) { return c.f && c.f.compara; }, -10, 'pide precio para comparar', 'Solo compara precios']
      ],
      intencion: [
        [function (c) { return c.s.financia; }, 12, 'preguntó por la financiación'],
        [function (c) { return c.s.fuera && !c.fin; }, 8, 'escribió fuera de horario'],
        [function (c) { return c.s.pienso; }, -8, 'dijo «me lo pienso»']
      ],
      riesgo: [
        [function (c) { return c.s.pienso && !c.fin; }, 12, 'dijo «me lo pienso» y nadie le ha vuelto a escribir'],
        [function (c, k) { return c.s.fuera && !c.fin && !c.conv.length; }, 40, function (c, k) { return 'lleva ' + QV.motor.duracion(k.creado) + ' sin primera respuesta (escribió fuera de horario)'; }]
      ]
    },

    nba: function (c, k, x, T, M) {
      if (c.s.fuera && !c.fin && !c.conv.length) {
        return { id: 'wa', accion: 'Respuesta inmediata por WhatsApp', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Escribió fuera de horario (' + M.hace(k.creado) + ') y nadie le ha contestado. El agente le pregunta qué le preocupa, confirma la sede (' + (c.sede || 'Patraix o Torrent') + ') y propone huecos reales; a primera hora, ' + rec(c) + ' lo encuentra todo en la ficha.' };
      }
      if (!c.fin && c.s.tProp != null && c.s.financia) {
        return { id: 'comercial', accion: 'Llamada de ' + rec(c) + ' para explicar la financiación', quien: rec(c) + ' · recepción ' + c.sede, tipo: 'humano', estado: 'humano',
          por: 'Tiene el presupuesto de ' + c.prod.toLowerCase() + ' entregado y ha preguntado por la financiación. El sistema no da precios ni condiciones: eso lo explica una persona de su sede, con el presupuesto delante.' };
      }
      return M.nbaGenerica(c, k, x, T);
    },
    vozMotivo: function (c) { return 'Pidió información de «' + c.prod + '» en la sede de ' + (c.sede || 'Patraix') + '.'; },

    preguntas: [
      { q: '¿Qué presupuestos deberíamos recuperar hoy?', h: 'lista', obj: ['seguimiento', 'ventas', 'conversion', 'todo'],
        filtro: function (c) { return c.s.tProp != null && !c.fin; }, orden: 'prob', suma: true,
        intro: function (l, T, M) { return 'Hay ' + l.length + ' presupuestos abiertos entre las dos sedes (' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ', importes de ejemplo). Estos son los que más probabilidad tienen de aceptarse si alguien los trabaja hoy.'; },
        cols: ['nombre', ['Sede', function (c) { return c.sede || '—'; }], 'prob', 'accion'], vista: 'tabla' },
      { q: '¿Qué pasa en Torrent?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return c.sede === 'Torrent' && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' pacientes abiertos en la sede de Torrent, ordenados por probabilidad. Cada uno con su siguiente paso y quién lo hace.'; },
        cols: ['nombre', ['Etapa', function (c) { return QV.estado.cfg.etapaTxt(c.etapa); }], ['Tratamiento', function (c) { return c.prod; }], 'accion'], vista: 'tabla' },
      { q: '¿Qué pasa en Patraix?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return c.sede === 'Patraix' && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' pacientes abiertos en la sede de Patraix, ordenados por probabilidad. Cada uno con su siguiente paso y quién lo hace.'; },
        cols: ['nombre', ['Etapa', function (c) { return QV.estado.cfg.etapaTxt(c.etapa); }], ['Tratamiento', function (c) { return c.prod; }], 'accion'], vista: 'tabla' },
      { q: '¿Qué pacientes tienen riesgo de no venir a la primera visita?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && (c.s.noshow || (c.s.tCita != null && c.x.k.cita > 0 && c.x.k.cita < 3 * 1440 && !c.s.citaOk)); }, orden: 'riesgo',
        intro: function (l) { return l.length + ' pacientes tienen riesgo de no venir: primeras visitas sin confirmar o que ya fallaron una vez. El recordatorio sale solo, con la dirección de su sede; a los que fallaron se les propone otro hueco.'; },
        cols: ['nombre', ['Sede', function (c) { return c.sede || '—'; }], ['Visita', function (c) { return c.s.noshow ? 'no vino' : QV.motor.dentroDe(c.x.k.cita); }], 'accion'], vista: 'tabla' },
      { q: '¿Quién preguntó por la financiación?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !!c.s.financia && !c.fin; }, orden: 'valor',
        intro: function (l) { return l.length + ' pacientes preguntaron por la financiación. Es la duda que más presupuestos frena: la resuelve una persona de su sede, no el sistema.'; },
        cols: ['nombre', ['Sede', function (c) { return c.sede || '—'; }], ['Tratamiento', function (c) { return c.prod; }], 'accion'], vista: 'tabla' },
      { q: '¿Qué campaña trae presupuestos aceptados y no solo formularios?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] }
    ],

    historias: {
      implantes: {
        titulo: 'Una petición de implantes en Torrent a las diez de la noche',
        contacto: { id: 'demo', n: 'Pilar Ortega', rol: 'Torrent · implantes', sede: 'Torrent', seg: 'nuevo', ciudad: '—', prod: IMP, orig: 'c4', canal: 'wa', etapa: 1, valor: P[IMP], creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una petición del anuncio de implantes de Torrent, fuera de horario', feed: 'Petición nueva · implantes · sede Torrent', cambio: { s: { fuera: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 49 segundos', cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Pilar, te escribimos de la Clínica Dental Marín 😊 Hemos visto tu petición sobre implantes. ¿Es para una pieza o para varias? ¿Te va mejor la sede de Torrent o la de Patraix?'] }, toque: true },
          { dur: 6, min: 2, txt: 'Pilar contesta y la ficha se completa', feed: 'Ficha completada · Torrent · vive a 5 minutos', cambio: { f: { cerca: '5 minutos' }, ciudad: 'Torrent', conv: ['c', 'wa', 'Para dos muelas. Torrent, vivo al lado. ¿Cuánto cuesta más o menos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente no da precio sin diagnóstico: explica la primera visita', feed: 'Pregunta de cualificación enviada', cambio: { conv: ['a', 'wa', 'El precio depende de cada caso, por eso en la primera visita el equipo te explora y sales con tu presupuesto por escrito. ¿Te preocupa más el precio o el tiempo del tratamiento?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Pilar pregunta por la financiación y visita la página', feed: 'Pregunta por la financiación · visita la página de implantes', cambio: { s: { precio: true, financia: true, visitas: 2 }, conv: ['c', 'wa', 'El precio. ¿Se puede pagar a plazos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente confirma que hay financiación y propone dos huecos reales de Torrent', feed: 'Dos huecos propuestos en Torrent', cambio: { conv: ['a', 'wa', 'Sí, la clínica tiene financiación; las condiciones te las explica Rocío, de recepción, con tu presupuesto delante. Te propongo el ' + hv.txt + ' a las 10:00 o a las 17:30 en Torrent. ¿Cuál te va mejor?'] }, toque: true },
          { dur: 6, min: 2, txt: 'Pilar elige hora: quiere resolverlo ya', feed: 'Intención alta · quiere empezar este mes', cambio: { s: { urg: true, urgTxt: 'quiere empezar este mes' }, conv: ['c', 'wa', 'A las 10:00. Quiero quitármelo de encima este mes.'] }, act: true },
          { dur: 6, min: 1, txt: 'Primera visita agendada y recordatorio programado', feed: 'Primera visita agendada · ' + hv.txt + ' 10:00 · Torrent', vista: 'agenda', cambio: { etapa: 3, s: { cita: hv.min - MIN_HISTORIA, citaOk: true }, conv: ['a', 'wa', 'Hecho, Pilar: el ' + hv.txt + ' a las 10:00 en la sede de Torrent. Te llega la dirección y te escribimos ese día por la mañana para recordártelo.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a Rocío, de recepción de Torrent', feed: 'Aviso enviado a Rocío (Torrent)', humano: { titulo: 'Pilar viene el ' + hv.txt + ' a las 10:00 a Torrent', texto: 'Dos implantes · vive a 5 minutos de la sede · le preocupa el precio y pregunta por la financiación · quiere empezar este mes · escribió a las 22:00 y recibió respuesta en 49 segundos. Que la financiación se la explique recepción con el presupuesto delante.' } }
        ]
      },
      ortodoncia: {
        titulo: 'Un presupuesto de ortodoncia invisible en Patraix que no se queda en el cajón',
        contacto: { id: 'demo', n: 'Andrea Climent', rol: 'Patraix · ortodoncia invisible', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: ORT, orig: 'c5', canal: 'wa', etapa: 4, valor: P[ORT], creado: 0, act: 0, f: { cerca: '10 minutos' }, s: { prop: 0, propVista: 0 }, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Andrea sale de la primera visita en Patraix con su presupuesto', feed: 'Primera visita hecha · presupuesto de ortodoncia invisible', cambio: { etapa: 5 } },
          { dur: 7, min: 1, txt: 'Le llega por WhatsApp el resumen de lo que habló con el equipo', feed: 'WhatsApp enviado · resumen y presupuesto', toque: true,
            cambio: { conv: ['a', 'wa', 'Hola Andrea, gracias por venir hoy a Patraix. Te dejamos aquí el presupuesto de la ortodoncia invisible y el resumen de lo que viste con el equipo. Si te surge cualquier duda, escríbenos por aquí.'] } },
          { dur: 6, min: 600, txt: 'Por la noche abre el presupuesto dos veces', feed: 'Abre el presupuesto (2 veces)', cambio: { s: { propVista: 2, visitas: 2 } }, act: true },
          { dur: 7, min: 3, txt: 'Al día siguiente pregunta por la duración y la financiación', feed: 'Pregunta duración y financiación', cambio: { s: { financia: true }, conv: ['c', 'wa', 'Me lo he mirado. ¿Cuánto dura más o menos? ¿Y se puede pagar a plazos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente responde lo que puede y pasa la financiación a Paula', feed: 'Respuesta · aviso a Paula (Patraix)', toque: true,
            cambio: { conv: ['a', 'wa', 'La duración depende de cada caso y te la confirma el equipo en el plan. Lo de la financiación te lo explica Paula, de recepción de Patraix: te llama hoy por la tarde, ¿te va bien?'] } },
          { dur: 0, min: 1, txt: 'Aviso a Paula con la ficha completa', feed: 'Aviso enviado a Paula (Patraix)', humano: { titulo: 'Andrea pregunta por la financiación de su ortodoncia', texto: 'Patraix · presupuesto de ortodoncia invisible entregado ayer · lo ha abierto dos veces · pregunta duración y pago a plazos. Llámala esta tarde con el presupuesto delante.' } }
        ]
      }
    },
    historiaDefecto: 'implantes',

    contactos: [
      // --- Presupuestos entregados (abiertos)
      { id: 'd01', n: 'Mercedes Alonso', rol: 'Patraix · presupuesto de implantes', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: IMP, orig: 'c3', canal: 'wa', etapa: 5, valor: 5600, creado: 12 * D, act: 35, toque: 6 * D,
        f: { cerca: '15 minutos', tac: true }, s: { prop: 6 * D, propVista: 2, financia: true, precio: true },
        conv: [[6 * D, 'h', 'wa', 'Mercedes, te dejo el presupuesto que viste con el equipo.'], [35, 'c', 'wa', 'Lo he hablado en casa. ¿Cómo sería lo de pagarlo a plazos? Querríamos empezar pronto.']] },
      { id: 'd02', n: 'Antonio Gil', rol: 'Patraix · presupuesto de ortodoncia', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: ORT, orig: 'c5', canal: 'wa', etapa: 5, valor: P[ORT], creado: 20 * D, act: 9 * D, toque: 9 * D,
        f: { cerca: '20 minutos' }, s: { prop: 10 * D, propVista: 1, pienso: true },
        conv: [[10 * D, 'h', 'wa', 'Antonio, aquí tienes el presupuesto de la ortodoncia invisible.'], [9 * D, 'c', 'wa', 'Gracias, me lo pienso y te digo.']] },
      { id: 'd03', n: 'Rosa Jiménez', rol: 'Torrent · presupuesto de implantes', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: IMP, orig: 'c4', canal: 'wa', etapa: 5, valor: P[IMP], creado: 16 * D, act: 5 * D, toque: 5 * D,
        f: { cerca: '10 minutos', tac: true }, s: { prop: 8 * D, propVista: 3, financia: true },
        conv: [[8 * D, 'h', 'wa', 'Rosa, te mando el presupuesto.'], [7 * D, 'c', 'wa', '¿Esto se puede financiar?'], [5 * D, 'h', 'wa', 'Sí, te lo miro y te digo.']] },
      { id: 'd04', n: 'Javier Ribas', rol: 'Patraix · presupuesto de carillas', sede: 'Patraix', seg: 'paciente', ciudad: 'Valencia', prod: CAR, orig: 'c11', canal: 'wa', etapa: 5, valor: P[CAR], creado: 30 * D, act: 14 * D, toque: 14 * D,
        f: { paciente: true, cerca: '5 minutos' }, s: { prop: 14 * D, propVista: 0 }, conv: [[14 * D, 'h', 'wa', 'Javier, te envío el presupuesto de las carillas.']] },
      { id: 'd05', n: 'Lourdes Peña', rol: 'Torrent · presupuesto de ortodoncia', sede: 'Torrent', seg: 'nuevo', ciudad: 'Picanya', prod: ORT, orig: 'c6', canal: 'wa', etapa: 5, valor: P[ORT], creado: 9 * D, act: 2 * D, toque: 3 * D,
        f: { cerca: '10 minutos' }, s: { prop: 4 * D, propVista: 4, visitas: 3 },
        conv: [[4 * D, 'h', 'wa', 'Lourdes, aquí tienes el presupuesto.'], [3 * D, 'c', 'wa', '¿Cuántos meses dura el tratamiento?'], [3 * D, 'a', 'wa', 'Depende de cada caso: el equipo te lo concreta en el plan. ¿Te llama recepción para verlo?']] },
      { id: 'd06', n: 'Tomás Ferrer', rol: 'Torrent · sonrisa en 24 h', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: S24, orig: 'c10', canal: 'tel', etapa: 5, valor: P[S24], creado: 25 * D, act: 20 * D, toque: 20 * D, f: { compara: true, tac: true }, s: { prop: 21 * D, propVista: 1 }, conv: [] },
      { id: 'd07', n: 'Encarna Soler', rol: 'Patraix · sonrisa en 24 h', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: S24, orig: 'c9', canal: 'wa', etapa: 5, valor: P[S24], creado: 11 * D, act: 2 * D, toque: 4 * D,
        f: { cerca: '10 minutos', tac: true }, s: { prop: 5 * D, propVista: 3, financia: true, visitas: 2 },
        conv: [[5 * D, 'h', 'wa', 'Encarna, te dejo el plan y el presupuesto de lo que viste ayer.'], [2 * D, 'c', 'wa', 'Mi hija quiere venir conmigo a que se lo expliquéis. ¿Y lo de financiarlo?']] },
      // --- Primera visita hecha (sin presupuesto todavía)
      { id: 'd08', n: 'Consuelo Pastor', rol: 'Patraix · carillas, espera presupuesto', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: CAR, orig: 'c7', canal: 'wa', etapa: 4, valor: P[CAR], creado: 5 * D, act: 1 * D, toque: 1 * D, f: { cerca: '10 minutos' }, s: { visitas: 2 },
        conv: [[2 * D, 'c', 'wa', '¿Cuándo tendré el presupuesto de las carillas?'], [1 * D, 'h', 'wa', 'Consuelo, el equipo lo está preparando. Te lo mandamos mañana.']] },
      { id: 'd09', n: 'Salvador Monzó', rol: 'Torrent · limpieza + TAC, necesita implante', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: LIM, orig: 'c2', canal: 'wa', etapa: 4, valor: P[LIM], creado: 7 * D, act: 2 * D, toque: 2 * D, f: { cerca: '5 minutos', tac: true }, s: { exp: true, expTxt: 'En el TAC se ve que le falta una pieza: candidato a implante' },
        conv: [[2 * D, 'h', 'wa', 'Salvador, gracias por venir. Te escribimos cuando el equipo tenga el plan de la pieza que falta.']] },
      // --- Primera visita agendada y no-show
      { id: 'd10', n: 'Elena Soriano', rol: 'Patraix · ortodoncia invisible', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: ORT, orig: 'c5', canal: 'wa', etapa: 3, valor: P[ORT], creado: 3 * D, act: 20 * H, toque: 20 * H,
        f: { cerca: '10 minutos' }, s: { cita: 18 * H, citaOk: false, visitas: 2 }, conv: [[3 * D, 'a', 'wa', 'Hola Elena, ¿te va bien mañana a las 12:00 en Patraix?'], [3 * D - 20, 'c', 'wa', 'Sí, perfecto.']] },
      { id: 'd11', n: 'Raúl Navarro', rol: 'Torrent · no vino a la primera visita', sede: 'Torrent', seg: 'nuevo', ciudad: 'Alaquàs', prod: IMP, orig: 'c4', canal: 'wa', etapa: 3, valor: P[IMP], creado: 6 * D, act: 2 * D, toque: 2 * D,
        f: { cerca: '15 minutos' }, s: { noshow: true, precio: true }, conv: [[3 * D, 'a', 'wa', 'Te esperamos mañana a las 9:30 en Torrent, Raúl.'], [3 * D - 10, 'c', 'wa', 'Ok gracias']], ev: [[2 * D, 'sistema', 'No se presenta a la primera visita']] },
      { id: 'd12', n: 'Carmen Vázquez', rol: 'Patraix · limpieza + TAC', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: LIM, orig: 'c1', canal: 'wa', etapa: 3, valor: P[LIM], creado: 4 * D, act: 1 * D, toque: 1 * D, f: { cerca: '5 minutos' }, s: { cita: 40 * H, citaOk: false }, conv: [[1 * D, 'a', 'wa', 'Carmen, te confirmamos la limpieza con TAC del jueves a las 18:00 en Patraix.']] },
      { id: 'd13', n: 'Julián Moreno', rol: 'Torrent · limpieza + TAC', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: LIM, orig: 'c2', canal: 'wa', etapa: 3, valor: P[LIM], creado: 2 * D, act: 5 * H, toque: 5 * H, f: { cerca: '5 minutos' }, s: { cita: 3 * D, citaOk: true }, conv: [[5 * H, 'c', 'wa', 'Confirmado, el lunes allí estoy.']] },
      { id: 'd14', n: 'Beatriz Llopis', rol: 'Patraix · no vino a la primera visita', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: IMP, orig: 'c3', canal: 'wa', etapa: 3, valor: P[IMP], creado: 9 * D, act: 4 * D, toque: 4 * D, f: { cerca: '15 minutos' }, s: { noshow: true, financia: true }, conv: [[5 * D, 'a', 'wa', 'Beatriz, te esperamos mañana a las 11:00 en Patraix.']], ev: [[4 * D, 'sistema', 'No se presenta a la primera visita']] },
      // --- Peticiones nuevas y fuera de horario
      { id: 'd15', n: 'Francisco Ruiz', rol: 'Patraix · implantes', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: IMP, orig: 'c3', canal: 'wa', etapa: 1, valor: P[IMP], creado: 7, act: 7, toque: null, f: { cerca: '10 minutos' }, s: {}, conv: [] },
      { id: 'd16', n: 'Isabel Mora', rol: 'Torrent · escribió el domingo', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: ORT, orig: 'c6', canal: 'wa', etapa: 1, valor: P[ORT], creado: 30 * H, act: 30 * H, toque: null, f: { cerca: '5 minutos' }, s: { fuera: true, visitas: 2 }, conv: [] },
      { id: 'd17', n: 'Vicent Puchol', rol: 'Torrent · sonrisa en 24 h, de noche', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: S24, orig: 'c10', canal: 'wa', etapa: 1, valor: P[S24], creado: 10 * H, act: 10 * H, toque: null, f: { cerca: '10 minutos' }, s: { fuera: true, visitas: 3, financia: true }, conv: [] },
      { id: 'd18', n: 'Marta Sanz', rol: 'Patraix · carillas', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: CAR, orig: 'c7', canal: 'wa', etapa: 2, valor: P[CAR], creado: 3 * H, act: 1 * H, toque: 2 * H,
        f: {}, s: { precio: true },
        conv: [[3 * H - 1, 'a', 'wa', 'Hola Marta, te escribimos de la Clínica Dental Marín. ¿Qué te gustaría mejorar de tu sonrisa?'], [2 * H, 'c', 'wa', 'Tengo los dientes de delante desgastados. ¿Precio?'], [2 * H - 1, 'a', 'wa', 'Depende de cada caso: en la primera visita el equipo te lo explica y sales con el presupuesto. ¿Te va bien el martes por la tarde en Patraix?'], [60, 'c', 'wa', 'El martes no puedo, ¿el miércoles?']] },
      { id: 'd19', n: 'Diego Castro', rol: 'Torrent · urgencia, dolor de muela', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: GEN, orig: 'c11', canal: 'tel', etapa: 3, valor: P[GEN], creado: 50, act: 45, toque: 48, f: { cerca: '10 minutos' }, s: { urg: true, urgTxt: 'tiene dolor desde ayer', cita: 5 * H, citaOk: true },
        conv: [[48, 'v', 'voz', 'Llamada de la agente de voz: tiene dolor en una muela desde ayer. Se le ofrece hueco hoy a las 17:00 en Torrent.'], [46, 'c', 'voz', 'Acepta el hueco de hoy a las 17:00.'], [45, 'a', 'wa', 'Diego, te confirmamos hoy a las 17:00 en Torrent. Te dejamos aquí la dirección.']] },
      // --- Contactados sin respuesta o en cadencia
      { id: 'd20', n: 'Nieves Guerrero', rol: 'Torrent · implantes', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: IMP, orig: 'c4', canal: 'wa', etapa: 2, valor: P[IMP], creado: 2 * D, act: 2 * D, toque: 2 * D - 1, f: {}, s: { intentos: 1 }, conv: [[2 * D - 1, 'a', 'wa', 'Hola Nieves, te escribimos de la Clínica Dental Marín. ¿Es para una pieza o para varias?']] },
      { id: 'd21', n: 'Ramón Esteve', rol: 'Patraix · ortodoncia', sede: 'Patraix', seg: 'nuevo', ciudad: 'Gandia', prod: ORT, orig: 'c5', canal: 'wa', etapa: 2, valor: P[ORT], creado: 18 * D, act: 18 * D, toque: 12 * D, f: { lejos: '65 km' }, s: { intentos: 3 }, conv: [[18 * D, 'a', 'wa', 'Hola Ramón, ¿para quién sería el tratamiento?']] },
      { id: 'd22', n: 'Sofía Blasco', rol: 'Patraix · limpieza', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: LIM, orig: 'c1', canal: 'wa', etapa: 2, valor: P[LIM], creado: 8 * D, act: 7 * D, toque: 7 * D, f: { soloSeguro: true }, s: {}, conv: [[8 * D, 'a', 'wa', 'Hola Sofía, ¿te va bien esta semana en Patraix?'], [7 * D, 'c', 'wa', '¿Esto me lo cubre el seguro?']] },
      { id: 'd23', n: 'Pau Ribera', rol: 'Torrent · carillas', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: CAR, orig: 'c8', canal: 'wa', etapa: 2, valor: P[CAR], creado: 6 * D, act: 4 * D, toque: 4 * D, f: { cerca: '5 minutos' }, s: { visitas: 2 },
        conv: [[6 * D, 'a', 'wa', 'Hola Pau, ¿qué te gustaría mejorar?'], [4 * D, 'c', 'wa', 'El color y un diente torcido. ¿Cuándo podría ir a Torrent?']] },
      // --- Más adelante
      { id: 'd24', n: 'Luis Campos', rol: 'Patraix · implantes, lo hará en enero', sede: 'Patraix', seg: 'nuevo', ciudad: 'Valencia', prod: IMP, orig: 'c3', canal: 'wa', etapa: 5, valor: 5600, creado: 40 * D, act: 30 * D, toque: 30 * D, f: { cerca: '15 minutos', tac: true }, s: { prop: 32 * D, propVista: 2, luego: 'enero', luegoTxt: 'lo haría en enero, después de las fiestas' },
        conv: [[30 * D, 'c', 'wa', 'Lo tengo claro, pero lo haré en enero, después de las fiestas.']] },
      { id: 'd25', n: 'Amparo Vidal', rol: 'Torrent · ortodoncia, a la vuelta del viaje', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: ORT, orig: 'c6', canal: 'wa', etapa: 4, valor: P[ORT], creado: 50 * D, act: 44 * D, toque: 44 * D, f: { cerca: '5 minutos' }, s: { luego: 'diciembre', luegoTxt: 'empezaría en diciembre, cuando vuelva de viaje' },
        conv: [[44 * D, 'c', 'wa', 'Ahora me voy de viaje. Empiezo en diciembre cuando vuelva.']] },
      // --- Presupuestos aceptados
      { id: 'd26', n: 'Andrés Company', rol: 'Patraix · ortodoncia aceptada', sede: 'Patraix', seg: 'paciente', ciudad: 'Valencia', prod: ORT, orig: 'c5', canal: 'wa', etapa: 6, valor: P[ORT], creado: 30 * D, act: 6 * D, toque: 6 * D, fin: 'ganado', f: { paciente: true }, s: {}, conv: [] },
      { id: 'd27', n: 'Pepa Ballester', rol: 'Torrent · implantes aceptados', sede: 'Torrent', seg: 'paciente', ciudad: 'Torrent', prod: IMP, orig: 'c4', canal: 'wa', etapa: 6, valor: P[IMP], creado: 25 * D, act: 8 * D, toque: 8 * D, fin: 'ganado', f: { paciente: true }, s: {}, conv: [] },
      { id: 'd28', n: 'Vicente Olmos', rol: 'Patraix · revisión anual pendiente', sede: 'Patraix', seg: 'paciente', ciudad: 'Valencia', prod: GEN, orig: 'c11', canal: 'wa', etapa: 6, valor: P[GEN], creado: 400 * D, act: 380 * D, toque: 365 * D, fin: 'ganado', f: { paciente: true }, s: { revision: true, revisionTxt: 'Revisión anual sin reservar (la última, hace 13 meses)' }, conv: [] },
      { id: 'd29', n: 'Gregorio Sáez', rol: 'Torrent · implantes, perdido', sede: 'Torrent', seg: 'nuevo', ciudad: 'Torrent', prod: IMP, orig: 'c4', canal: 'wa', etapa: 5, valor: P[IMP], creado: 60 * D, act: 50 * D, toque: 40 * D, fin: 'perdido', f: { compara: true }, s: { prop: 55 * D, propVista: 1 }, conv: [] }
    ]
  };
})();

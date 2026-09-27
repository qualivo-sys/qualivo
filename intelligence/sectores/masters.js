/* Sector: Másteres online (escuela de negocios online con sede en Barcelona,
 * alumnos en España y Latinoamérica, equipo de admisiones pequeño).
 * Todos los nombres, empresas y personas son inventados. */
(function () {
  const H = 60, D = 1440, MS = 60000;
  const Q = window.QV.voz;
  const Mo = function () { return window.QV.motor; };
  const E = function () { return window.QV.estado; };

  // Muchas solicitudes entran de noche en España. Para que la hora que se ve
  // cuadre con el reloj de la demo, algunas altas se calculan desde la última
  // vez que el reloj marcó esa hora (hoy de madrugada, ayer por la noche…).
  const T0 = Date.now();
  function desdeLas(h, m, dias) {
    const d = new Date(T0);
    d.setHours(h, m, 0, 0);
    if (d.getTime() > T0 - 30 * MS) d.setDate(d.getDate() - 1);
    d.setDate(d.getDate() - (dias || 0));
    return Math.round((T0 - d.getTime()) / MS);
  }
  // Día laborable (n = 1 el anterior, 2 el de antes…) a las h:m. Así los
  // mensajes del equipo siempre caen en horario de oficina y entre semana.
  function L(h, m, n) {
    const d = new Date(T0);
    d.setHours(h, m, 0, 0);
    let k = n;
    while (k > 0) { d.setDate(d.getDate() - 1); if (d.getDay() !== 0 && d.getDay() !== 6) k--; }
    return Math.round((T0 - d.getTime()) / MS);
  }
  const FMT = {};
  function horaEn(tz, t) {
    try {
      FMT[tz] = FMT[tz] || new Intl.DateTimeFormat('es-ES', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
      return FMT[tz].format(new Date(t));
    } catch (e) { return ''; }
  }
  function horaNum(tz, t) { const h = parseInt(horaEn(tz, t), 10); return isNaN(h) ? 12 : h; }
  const deNoche = function (t) { const h = horaNum('Europe/Madrid', t); return h >= 21 || h < 8; };
  const sinContestar = function (c) { return Mo().contesto(c) === 0 && c.tToque == null && !c.fin; };
  const minDesde = function (t) { return (E().ahora - t) / MS; };
  // Solicitudes esperando: nadie les ha contestado, o escribieron y siguen esperando.
  function esperando(c) {
    if (c.fin || c.s.luego) return null;
    if (sinContestar(c) && minDesde(c.tCreado) >= 45) return c.tCreado;
    const u = Mo().ultimoMsg(c);
    if (u && u.de === 'c' && /\?/.test(u.texto) && minDesde(u.t) >= 120 && minDesde(u.t) < 36 * H) return u.t;
    return null;
  }
  // Hueco de la historia de empresa (en punto, hora de España).
  const h12 = Q.hueco(12);

  // Historia de Valentina: el reloj de la demo salta a las 2:10 de la
  // madrugada y la entrevista queda ese mismo día a las 17:00 de España
  // (primera hora de la mañana en Bogotá). Todo se calcula en el momento.
  function minHasta(h, m, desde) {
    const d = new Date(desde);
    d.setHours(h, m, 0, 0);
    if (d.getTime() <= desde) d.setDate(d.getDate() + 1);
    return Math.round((d.getTime() - desde) / MS);
  }
  function citaV() {
    const d = new Date(E().ahora);
    d.setHours(17, 0, 0, 0);
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    return d.getTime();
  }
  const diaV = function () { return new Date(citaV()).toLocaleDateString('es-ES', { weekday: 'long' }); };
  const bogV = function () { return horaEn('America/Bogota', citaV()) || '10:00'; };

  const MKT = 'Máster en Marketing Digital', IA = 'Máster en Inteligencia Artificial y Machine Learning',
    MBA = 'MBA online', ESG = 'Máster en Sostenibilidad y ESG', CIB = 'Máster en Ciberseguridad';
  const P = {}; P[MKT] = 4900; P[IA] = 6500; P[MBA] = 7200; P[ESG] = 4500; P[CIB] = 5900;

  // Noches recientes (minutos desde entonces)
  const n1 = desdeLas(3, 5), n2 = desdeLas(1, 20), n3 = desdeLas(23, 35), n4 = desdeLas(4, 50), n5 = desdeLas(22, 30);

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.masters = {
    id: 'masters',
    nombre: 'Másteres online',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'máster',
      paginaVisitas: 'la página del máster', txtPrecio: 'preguntó por el precio',
      cita: 'entrevista', Cita: 'Entrevista', laCita: 'la entrevista de admisión',
      propuesta: 'la oferta de plaza', Propuesta: 'Oferta de plaza', propuestas: 'ofertas de plaza',
      comercial: 'el equipo de admisiones', Comercial: 'Admisiones',
      cliente: 'alumno', unCliente: 'un alumno', clientes: 'alumnos', convierten: 'se matriculan',
      objetivoPaso: 'agendar la entrevista de admisión',
      casoExito: 'el testimonio de un antiguo alumno de su país', valorAlto: 5500, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la matrícula', Producto: 'Máster',
      verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'empleados',
      pasoHumano: 'resolver beca, financiación y fechas y cerrar la reserva de plaza',
      senales: { propuesta: 'Admitido sin reservar' },
      anunciosIntro: 'Quien lleve las campañas, vosotros o una agencia, sigue igual. El sistema une cada anuncio con lo que pasa después (quién encaja, quién se queda horas sin respuesta, quién se matricula) y lo devuelve a las plataformas para optimizar a la matrícula, no al formulario.'
    },
    // Recorrido: Anuncio → Solicitud → Contactado → Entrevista de admisión → Admitido → Reserva de plaza → Matriculado
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'solicitud', txt: 'Solicitud' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'entrevista', txt: 'Entrevista de admisión' },
      { id: 'admitido', txt: 'Admitido' },
      { id: 'reserva', txt: 'Reserva de plaza' },
      { id: 'matriculado', txt: 'Matriculado' }
    ],
    ventaEtapa: 'matriculado',
    ticket: 5500,
    // Qué conversión es razonable en cada paso cuando se contesta a tiempo y se hace seguimiento.
    referencia: { contactado: 0.85, entrevista: 0.5, admitido: 0.78, reserva: 0.72, matriculado: 0.92 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'solicitudes que entran de noche o desde otro huso horario y esperan horas a que alguien conteste' },
      entrevista: { txt: 'Paso a entrevista', exp: 'conversaciones que no llegan a la entrevista de admisión' },
      admitido: { txt: 'Admisión', exp: 'entrevistas que no terminan en admisión' },
      reserva: { txt: 'Reserva de plaza', exp: 'admitidos que no reservan plaza porque nadie les resuelve la beca ni la financiación' },
      matriculado: { txt: 'Matrícula', exp: 'reservas que no terminan en matrícula' }
    },
    remedioFuga: {
      contactado: 'Respuesta en el minuto uno a cualquier hora y en el huso de cada interesado: el agente de WhatsApp contesta de madrugada, hace una pregunta para cualificar y deja la entrevista de admisión agendada para el día siguiente.',
      reserva: 'Seguimiento de cada admitido: el agente resuelve becas y plazos con la política de la escuela en el momento y avisa a admisiones cuando alguien está listo para reservar.'
    },
    mesDatos: { respuestaAntes: 470, respuestaAhora: 1, agendadas: 124, fueraHorario: 0.58 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'España', inversion: 2200, ticket: 5600,
        embudo: { anuncio: 5400, solicitud: 140, contactado: 84, entrevista: 40, admitido: 30, reserva: 14, matriculado: 12 } },
      { id: 'c2', canal: 'Meta', nombre: 'Latinoamérica', inversion: 1600, ticket: 5100,
        embudo: { anuncio: 9800, solicitud: 190, contactado: 66, entrevista: 22, admitido: 16, reserva: 5, matriculado: 4 } },
      { id: 'c3', canal: 'Google', nombre: 'Búsqueda de másteres', inversion: 1400, ticket: 6400,
        embudo: { anuncio: 1300, solicitud: 42, contactado: 30, entrevista: 17, admitido: 13, reserva: 9, matriculado: 8 } },
      { id: 'c4', canal: 'Portales', nombre: 'Portales de másteres', inversion: 700, ticket: 5400,
        embudo: { anuncio: 900, solicitud: 24, contactado: 16, entrevista: 8, admitido: 6, reserva: 3, matriculado: 3 } },
      { id: 'c5', canal: 'Web', nombre: 'Orgánico y recomendación', inversion: 0, ticket: 5800,
        embudo: { anuncio: 2100, solicitud: 30, contactado: 24, entrevista: 14, admitido: 11, reserva: 7, matriculado: 6 } }
    ],
    kpis: ['interesados', 'respuesta', 'fueraHorario', 'cpl', 'entrevistas', 'show', 'sinReserva', 'ventas', 'cpv', 'ingresos'],
    kpiNombres: { interesados: 'Solicitudes', entrevistas: 'Entrevistas de admisión', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'solicitud', cualificados: 'admitido', entrevistas: 'entrevista' },
    kpiCustom: function (m, cfg, M) {
      const pago = cfg.campanas.filter(function (c) { return c.inversion > 0; });
      const sol = pago.reduce(function (a, c) { return a + (c.embudo.solicitud || 0); }, 0);
      const md = cfg.mesDatos || {};
      return {
        cpl: { l: 'Coste por solicitud', v: M.euros(m.inversion / Math.max(1, sol)), em: 'Solo campañas de pago' },
        fueraHorario: { l: 'Llegan fuera de horario', v: M.pct(md.fueraHorario || 0), em: 'noches, findes y otros husos', clase: 'mal' },
        sinReserva: { l: 'Admitidos sin reservar', v: M.num(m.tot.admitido - m.tot.reserva), em: M.pct(1 - m.tot.reserva / Math.max(1, m.tot.admitido)) + ' de los admitidos', clase: 'mal' }
      };
    },
    agenda: { horas: [9, 20], pausa: [14, 15], ocupacion: 0.5 },

    // Veredicto propio: una campaña que trae mucho y barato pero casi nadie
    // llega a hablar con admisiones no es un problema de anuncio, es de respuesta.
    veredictoAnuncio: function (a, M) {
      const e = a.c.embudo || {};
      const tc = (e.contactado || 0) / Math.max(1, e.solicitud || 0);
      if (a.c.inversion && a.roas < a.R * 0.6 && tc < 0.5) {
        return { id: 'despues', txt: 'No es el anuncio', tono: 't-amber',
          por: 'Trae más solicitudes que ninguna y las más baratas (' + M.euros(a.c.inversion / Math.max(1, e.solicitud)).replace(' ', '\u00a0') + '), pero solo el ' + M.pct(tc) + ' llega a hablar con alguien: entran por la noche, hora de España, y se contestan a la mañana siguiente. El público está bien; falla la respuesta.' };
      }
      return null;
    },
    notaAnuncios: function (a, T, M) {
      const pago = a.filas.filter(function (f) { return f.c.inversion > 0; });
      const lin = [];
      pago.filter(function (f) { return f.ver.id === 'escalar'; }).forEach(function (f) { lin.push('Subiría presupuesto en «' + f.c.canal + ' · ' + f.c.nombre + '»: ' + f.ventas + ' matrículas y ' + M.num(f.roas, 1) + '× de retorno con solo ' + f.entra + ' solicitudes.'); });
      pago.filter(function (f) { return f.ver.id === 'despues'; }).forEach(function (f) { lin.push('No tocaría «' + f.c.canal + ' · ' + f.c.nombre + '»: trae ' + f.entra + ' solicitudes a ' + M.euros(f.cpl) + ' y el perfil encaja (encaje medio ' + f.fitMedio + '). Se pierden porque llegan de noche y nadie contesta hasta la mañana. Eso lo arreglamos nosotros.'); });
      pago.filter(function (f) { return f.ver.id === 'publico'; }).forEach(function (f) { lin.push('Revisaría el público de «' + f.c.nombre + '»: lo que trae no encaja (encaje medio ' + f.fitMedio + ').'); });
      lin.push('Desde esta semana os llegan a Meta y Google los eventos de ' + M.unir(a.eventos.map(function (e) { return e.etapa.toLowerCase(); })) + ', con su valor. Optimizad a la matrícula, no a la solicitud.');
      return lin;
    },

    reglas: {
      fitBase: 22,
      fit: [
        [function (c) { return c.f && c.f.titulo; }, 16, function (c) { return 'titulación universitaria (' + c.f.titulo + ')'; }, 'Titulación universitaria'],
        [function (c) { return c.f && c.f.exp >= 3; }, 16, function (c) { return c.f.exp + ' años de experiencia'; }, 'Tres años o más de experiencia'],
        [function (c) { return c.f && c.f.exp > 0 && c.f.exp < 3; }, 8, 'algo de experiencia profesional', 'Uno o dos años de experiencia'],
        [function (c) { return c.f && c.f.objetivo; }, 14, function (c) { return 'objetivo claro: ' + c.f.objetivo; }, 'Objetivo profesional claro'],
        [function (c) { return c.f && c.f.empresaPaga; }, 16, 'su empresa paga el máster', 'Lo paga su empresa'],
        [function (c) { return (c.f && c.f.puedePagar) || c.s.financia || c.s.beca; }, 8, function (c) { return c.f && c.f.puedePagar ? 'tiene cómo pagarlo' : 'busca cómo financiarlo (beca o cuotas)'; }, 'Puede pagarlo o pregunta por beca o financiación'],
        [function (c) { return c.f && c.f.gratis; }, -34, 'busca un curso gratis', 'Busca un curso gratis'],
        [function (c) { return c.f && c.f.sinGrado; }, -22, 'todavía no tiene el grado terminado', 'Estudiante sin grado terminado'],
        [function (c) { return c.f && c.f.menor; }, -40, 'es menor de edad', 'Menor de edad']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 12, 'preguntó por la próxima edición'],
        [function (c) { return c.s.beca; }, 10, 'preguntó por becas'],
        [function (c) { return c.s.financia; }, 10, 'preguntó por financiación'],
        [function (c) { return c.s.oficial; }, 6, 'preguntó si el título es oficial'],
        [function (c) { return c.s.temario; }, 6, 'descargó el plan de estudios']
      ],
      riesgo: [
        [function (c, k) { return sinContestar(c) && k.creado >= 45; }, 42, function (c, k) { return 'lleva ' + Mo().duracion(k.creado) + ' sin que nadie le conteste'; }],
        [function (c, k) { return sinContestar(c) && k.creado >= 45 && deNoche(c.tCreado); }, 10, function (c) { return 'pidió información a las ' + horaEn('Europe/Madrid', c.tCreado) + ', hora de España'; }]
      ]
    },

    // Solicitudes que nadie ha contestado todavía: el agente contesta ya, en su huso.
    nba: function (c, k, x, T, M) {
      if (!sinContestar(c) || k.creado < 45 || x.fit < 40) return null;
      const es = horaEn('Europe/Madrid', c.tCreado), loc = c.f && c.f.tz ? horaEn(c.f.tz, c.tCreado) : '';
      return { id: 'wa', accion: 'Contestar ya por WhatsApp', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
        por: 'Pidió información a las ' + es + ', hora de España' + (loc ? ' (' + loc + ' en ' + c.ciudad + ')' : '') + ', y lleva ' + M.duracion(k.creado) + ' sin respuesta. Cuanto más espera, menos probable es que conteste. El agente le escribe ahora, a una hora razonable en su país, y le propone la entrevista de admisión.' };
    },
    vozMotivo: function (c) { return c.f && c.f.objetivo ? 'Quiere ' + c.f.objetivo + '.' : 'Le interesa el ' + c.prod + '.'; },
    vozDijo: function (c) {
      const out = [];
      if (c.f && c.f.objetivo) out.push('Objetivo: ' + c.f.objetivo);
      if (c.s.beca) out.push('Pregunta por becas');
      return out;
    },

    preguntas: [
      { q: '¿Qué debería trabajar hoy el equipo de admisiones?', h: 'trabajar', obj: ['todo', 'conversion', 'ventas', 'seguimiento'] },
      { q: '¿Qué solicitudes llevan horas sin respuesta?', h: 'lista', obj: ['seguimiento', 'captacion', 'todo'],
        filtro: function (c) { return esperando(c) != null; }, orden: 'prio',
        intro: function (l, T, M) {
          const noche = l.filter(function (c) { return deNoche(esperando(c)); }).length;
          const latam = l.filter(function (c) { return c.f && c.f.pais && c.f.pais !== 'España'; }).length;
          return '**' + l.length + ' solicitudes** llevan horas esperando respuesta. ' + noche + ' escribieron de noche, hora de España, y ' + latam + ' son de Latinoamérica, donde a esa hora todavía es la tarde o el principio de la noche. Este mes, la primera respuesta tarda de media ' + M.duracionLarga(E().cfg.mesDatos.respuestaAntes) + '; con el agente, un minuto.';
        },
        cols: ['nombre', ['Escribió', function (c) { return Mo().fechaCorta(esperando(c), E().ahora); }], ['Esperando', function (c) { return Mo().duracion(minDesde(esperando(c))); }], ['Desde', function (c) { return c.ciudad; }], 'accion'], vista: 'tabla',
        cierre: 'El agente de WhatsApp contesta a cualquier hora, hace una sola pregunta para cualificar y deja la entrevista agendada para el día siguiente.' },
      { q: '¿Qué admitidos no han reservado plaza?', h: 'lista', obj: ['seguimiento', 'ventas', 'conversion', 'todo'],
        filtro: function (c) { return c.etapa === 4 && !c.fin; }, orden: 'valor', suma: true,
        intro: function (l, T, M) {
          const dinero = l.filter(function (c) { return c.s.beca || c.s.financia; }).length;
          return '**' + l.length + ' admitidos** no han reservado plaza. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '. ' + dinero + ' preguntaron por beca o financiación y se quedaron sin respuesta clara. Es la segunda fuga del mes: ya pasaron la entrevista y la escuela los quiere.';
        },
        cols: ['nombre', 'valor', ['Oferta de plaza', function (c) { return c.s.propVista ? 'vista ' + c.s.propVista + (c.s.propVista === 1 ? ' vez' : ' veces') : 'sin abrir'; }], ['Sin seguimiento', function (c) { return Mo().duracion(c.x.k.toque); }], 'accion'], vista: 'tabla',
        cierre: 'El agente resuelve beca y plazos con la política de la escuela y pasa a admisiones a quien está listo para reservar.' },
      { q: '¿Quién dijo que empezaría en la próxima convocatoria?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que empezarían en una edición posterior. Ninguno es un no: el agente de reactivación les escribe cuando toca, con lo que contaron.'; },
        vista: 'tabla' },
      { q: '¿Quién preguntó por becas o financiación?', h: 'lista', obj: ['conversion', 'ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return (c.s.beca || c.s.financia) && !c.fin; }, orden: 'prio',
        intro: function (l, T, M) {
          const adm = l.filter(function (c) { return c.etapa === 4; }).length;
          return l.length + ' interesados preguntaron por becas o financiación (' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '). ' + adm + ' ya están admitidos. La duda del dinero se resuelve en un mensaje; el problema es que nadie la conteste.';
        },
        cols: ['nombre', ['Preguntó por', function (c) { return c.s.beca && c.s.financia ? 'beca y cuotas' : c.s.beca ? 'beca' : 'financiación'; }], 'etapa', 'accion'], vista: 'tabla' }
    ],

    historias: {
      alumno: {
        titulo: 'Una solicitud desde Bogotá a las 2:10 de la madrugada',
        contacto: { id: 'demo', n: 'Valentina Arboleda', rol: 'Solicitud de información', seg: 'particular', ciudad: '—', prod: MKT, orig: 'c2', canal: 'wa', etapa: 1, valor: P[MKT], creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 7, get min() { return minHasta(2, 10, E().ahora); },
            get txt() { return 'Son las 2:10 en España (' + horaEn('America/Bogota', E().ahora) + ' en Bogotá). Valentina pide información del Máster en Marketing Digital'; },
            feed: 'Nueva solicitud · Meta Latinoamérica · Máster en Marketing Digital',
            cambio: { get tCreado() { return E().ahora; }, get tAct() { return E().ahora; } } },
          { dur: 6, min: 0, txt: 'El agente completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · licenciada en Comunicación · 4 años de experiencia', cambio: { rol: 'Community manager', ciudad: 'Bogotá', f: { titulo: 'Comunicación Social', exp: 4, pais: 'Colombia', tz: 'America/Bogota' } } },
          { dur: 7, min: 1, txt: 'El agente de WhatsApp le contesta en un minuto. En admisiones no hay nadie hasta las 9:00', feed: 'WhatsApp enviado en 58 segundos', cambio: { conv: ['a', 'wa', '¡Hola, Valentina! Soy Sara, del equipo de admisiones. Vi que pediste información del Máster en Marketing Digital. ¿Te cuento cómo funciona o tienes alguna duda concreta?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Valentina pregunta si el título es oficial y si hay becas', feed: 'Respuesta recibida · pregunta por el título y las becas', cambio: { etapa: 2, s: { oficial: true, beca: true, visitas: 2 }, conv: ['c', 'wa', 'Hola! Dos cosas: ¿el título es oficial? ¿Y tienen becas para Colombia?'] }, act: true },
          { dur: 8, min: 1, txt: 'El agente responde y hace una sola pregunta para cualificar', feed: 'Dudas resueltas · pregunta de cualificación', cambio: { conv: ['a', 'wa', 'Es un título propio de la escuela, de 60 ECTS, y las empresas con las que trabajamos en Colombia lo conocen bien. Becas: sí, hasta el 25 % para Latinoamérica, y se asignan en la entrevista de admisión. Para orientarte: ¿qué te gustaría conseguir con el máster y cuándo querrías empezar?'] }, toque: true },
          { dur: 8, min: 4, txt: 'Valentina quiere empezar en la próxima edición y pregunta por financiación', feed: 'Intención alta · próxima edición · pide pagar en cuotas', cambio: { s: { conv: true, financia: true, precio: true, urg: true, urgTxt: 'quiere empezar en la próxima edición' }, f: { objetivo: 'pasar a responsable de marketing digital' }, conv: ['c', 'wa', 'Quiero pasar de community manager a responsable de marketing digital. Me gustaría empezar en la próxima edición. ¿Se puede pagar en cuotas? En pesos me sale caro de una vez.'] }, act: true },
          { dur: 8, min: 1, txt: 'El agente agenda la entrevista de admisión a una hora buena para Bogotá',
            get feed() { return 'Entrevista agendada · ' + diaV() + ' 17:00 en España (' + bogV() + ' en Bogotá)'; },
            cambio: { etapa: 3,
              s: { get cita() { return Math.round((citaV() - E().ahora) / MS); }, citaOk: true },
              get conv() { return ['a', 'wa', 'Sí: hasta 12 cuotas sin intereses, y la beca se descuenta antes. Te dejo la entrevista de admisión el ' + diaV() + ' a las ' + bogV() + ' de Bogotá (17:00 en España) con Marcos, asesor de admisiones para Latinoamérica: revisa tu perfil, la beca y el plan de pagos. Te llega el enlace por correo.']; } },
            toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Valentina está lista para hablar', feed: 'Aviso enviado a admisiones',
            humano: { titulo: 'Valentina está lista para hablar', get texto() { return 'Bogotá · comunicadora con 4 años como community manager · quiere pasar a responsable de marketing digital · próxima edición · pregunta por beca para Colombia y pago en cuotas. Entrevista con Marcos el ' + diaV() + ' a las 17:00 (' + bogV() + ' en Bogotá). Se le contestó en un minuto, a las 2:11 de la madrugada.'; } } }
        ]
      },
      empresa: {
        titulo: 'Una empresa quiere el MBA para cinco directivos',
        contacto: { id: 'demo', n: 'Rebeca Almeida', rol: 'Directora de Personas', emp: 'Grupo Logístico Meridiano', seg: 'empresa', tam: 240, ciudad: '—', prod: MBA + ' · 5 plazas', orig: 'c3', canal: 'wa', etapa: 1, valor: 32400, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud desde Google: una empresa pregunta por el MBA para su equipo', feed: 'Nueva solicitud · MBA online para empresas', cambio: {} },
          { dur: 6, min: 0, txt: 'El agente completa la ficha: empresa, tamaño y quién decide', feed: 'Ficha completada · 240 empleados · decide la formación', cambio: { ciudad: 'Madrid', f: { titulo: 'Psicología', exp: 15, empresaPaga: true, puedePagar: true, pais: 'España' } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 51 segundos', cambio: { conv: ['a', 'wa', 'Hola Rebeca, soy Sara, del equipo de admisiones. He visto que os interesa el MBA online para vuestro equipo. ¿Para cuántas personas sería y qué perfil tienen?'] }, toque: true },
          { dur: 7, min: 6, txt: 'Rebeca contesta: cinco directores de área, para febrero', feed: 'Respuesta recibida · 5 plazas · edición de febrero', cambio: { etapa: 2, s: { precio: true, conv: true, urg: true, urgTxt: 'quiere a los cinco directivos dentro en la edición de febrero' }, f: { objetivo: 'preparar a cinco directores de área para el plan de crecimiento' }, conv: ['c', 'wa', 'Serían cinco directores de área y queremos que empiecen en febrero. ¿Tenéis condiciones para empresas? Lo pagaría la empresa.'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente resuelve condiciones y propone el siguiente paso', feed: 'Condiciones de grupo enviadas', cambio: { conv: ['a', 'wa', 'Sí: a partir de tres plazas hay un 10 % de descuento y se factura a la empresa. Cada directivo hace luego su entrevista de admisión. Antes te propongo 20 minutos con Inés, responsable de empresas, para cerrar condiciones. ¿Te va bien el ' + h12.txt + ' a las 12:00?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Rebeca acepta y pide la propuesta para dirección', feed: 'Presupuesto confirmado · pide propuesta por escrito', cambio: { s: { ppto: 'si', pptoTxt: 'la empresa paga las cinco plazas' }, conv: ['c', 'wa', 'Perfecto, el ' + h12.txt + ' me va bien. Si me mandas antes una propuesta, la llevo al comité de dirección.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la reunión con la responsable de empresas', feed: 'Reunión agendada · ' + h12.txt + ' 12:00', cambio: { etapa: 3, s: { cita: h12.min - 12, citaOk: true }, conv: ['a', 'wa', 'Hecho: ' + h12.txt + ' a las 12:00 con Inés. Te llega la invitación con una propuesta preliminar para las cinco plazas.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Rebeca está lista para hablar', feed: 'Aviso enviado a admisiones', humano: { titulo: 'Rebeca está lista para hablar', texto: 'Grupo Logístico Meridiano (240 empleados) · 5 plazas del MBA para directores de área · edición de febrero · paga la empresa (32.400 € con el 10 % de grupo) · quiere la propuesta para el comité. Reunión con Inés el ' + h12.txt + ' a las 12:00.' } }
        ]
      }
    },
    historiaDefecto: 'alumno',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'm01', n: 'Andrea Salgado', rol: 'Content manager', emp: 'Editorial Brújula', seg: 'particular', ciudad: 'Madrid', prod: MKT, orig: 'c1', canal: 'wa', etapa: 4, valor: P[MKT], creado: L(21, 40, 12), act: 40, toque: L(11, 0, 3) - 260,
        f: { titulo: 'Periodismo', exp: 5, objetivo: 'dirigir el marketing digital de la editorial', pais: 'España', puedePagar: true }, s: { prop: L(11, 0, 3), propVista: 3, beca: true, precio: true, visitas: 4 },
        conv: [[L(10, 20, 11), 'h', 'wa', 'Hola Andrea, soy Clara, de admisiones. Gracias por tu interés en el Máster en Marketing Digital. ¿Cuándo te va bien que hablemos?'], [L(10, 20, 11) - 25, 'c', 'wa', 'Hola Clara, mejor por la tarde, a partir de las 18:00.'], [L(9, 30, 7), 'h', 'wa', 'Te confirmo la entrevista de admisión de mañana a las 18:30 con Inés.'], [L(11, 0, 3), 'h', 'wa', '¡Enhorabuena, Andrea! Estás admitida. Te he enviado al correo la oferta de plaza con una beca del 15 % por perfil profesional.'], [L(11, 0, 3) - 240, 'c', 'wa', '¡Qué bien! Gracias, lo miro con calma.'], [L(11, 0, 3) - 260, 'h', 'wa', 'Perfecto, cualquier duda me dices.'], [40, 'c', 'wa', 'Hola Clara, una duda: si reservo esta semana, ¿se me mantiene la beca del 15 %? ¿Y la reserva se descuenta del total?']],
        ev: [[3 * H, 'web', 'Abre la oferta de plaza por tercera vez']] },
      { id: 'm02', n: 'Tomás Echeverri', rol: 'Ingeniero de datos', emp: 'Pagos Andinos', seg: 'particular', ciudad: 'Medellín', prod: IA, orig: 'c2', canal: 'wa', etapa: 3, valor: P[IA], creado: L(3, 40, 4), act: L(17, 30, 1) - 12, toque: L(17, 30, 1),
        f: { titulo: 'Ingeniería de Sistemas', exp: 4, objetivo: 'pasar a machine learning', pais: 'Colombia', tz: 'America/Bogota' }, s: { cita: 22 * H, citaOk: true, beca: true, visitas: 3, temario: true },
        conv: [[L(9, 50, 4), 'h', 'wa', 'Hola Tomás, soy Marcos, asesor de admisiones para Latinoamérica. Vi tu solicitud del máster de IA. ¿Tienes 15 minutos esta semana?'], [L(9, 50, 4) - 300, 'c', 'wa', 'Hola Marcos, sí. Ya trabajo con Python y SQL y quiero pasar a machine learning.'], [L(10, 10, 2), 'h', 'wa', 'Genial. Te propongo la entrevista de admisión a primera hora de la mañana en Medellín. ¿Te encaja?'], [L(17, 30, 1), 'h', 'wa', 'Te confirmo la entrevista de admisión. Te llega el enlace al correo con la hora de Colombia.'], [L(17, 30, 1) - 12, 'c', 'wa', 'Perfecto, ahí estaré. ¿En la entrevista vemos lo de la beca?']] },
      { id: 'm03', n: 'Lucía Paredes', rol: 'Controller financiera', emp: 'Grupo Hostelero Turia', seg: 'particular', ciudad: 'Valencia', prod: MBA, orig: 'c3', canal: 'wa', etapa: 2, valor: P[MBA], creado: L(8, 50, 1), act: 17, toque: L(12, 30, 1),
        f: { titulo: 'ADE', exp: 8, objetivo: 'dar el salto a dirección financiera', pais: 'España', empresaPaga: true }, s: { precio: true, financia: true, conv: true, visitas: 3 },
        conv: [[L(12, 30, 1), 'h', 'wa', 'Hola Lucía, soy Inés, de admisiones. ¿Buscas el MBA para crecer en tu empresa o para cambiar?'], [L(12, 30, 1) - 55, 'c', 'wa', 'Para crecer aquí: quiero llegar a dirección financiera. Mi empresa me paga una parte.'], [17, 'c', 'wa', 'Perdona que insista: ¿cuánto cuesta en total, cuándo empieza la siguiente edición y la parte que pague yo se puede fraccionar?']] },
      { id: 'm04', n: 'Ricardo Mondragón', rol: 'Gerente de TI', emp: 'Distribuidora del Bajío', seg: 'particular', ciudad: 'Guadalajara', prod: CIB, orig: 'c2', canal: 'wa', etapa: 4, valor: P[CIB], creado: L(4, 10, 15), act: L(18, 40, 4), toque: L(12, 0, 5),
        f: { titulo: 'Ingeniería en Computación', exp: 9, objetivo: 'liderar la seguridad de su empresa', pais: 'México', tz: 'America/Mexico_City' }, s: { prop: L(12, 0, 5), propVista: 2, financia: true, precio: true },
        conv: [[L(10, 5, 15), 'h', 'wa', 'Hola Ricardo, soy Marcos, de admisiones. Vi tu solicitud del Máster en Ciberseguridad. ¿Te llamo mañana?'], [L(10, 5, 15) - 420, 'c', 'wa', 'Sí, mejor mañana en la tarde de aquí.'], [L(12, 0, 5), 'h', 'email', 'Ricardo, ¡enhorabuena! Estás admitido en el Máster en Ciberseguridad. Te adjunto la oferta de plaza.'], [L(18, 40, 4), 'c', 'wa', 'Gracias. ¿Se puede pagar en pesos y en mensualidades? Con el tipo de cambio se me complica pagar todo de una vez.']] },

      // --- Solicitudes de anoche que siguen sin respuesta
      { id: 'm05', n: 'Daniela Quispe', rol: 'Analista de sostenibilidad', emp: 'Agroexportadora Pacífico', seg: 'particular', ciudad: 'Lima', prod: ESG, orig: 'c2', canal: 'wa', etapa: 1, valor: P[ESG], creado: n1, act: n1, toque: null, llamadas: [],
        f: { titulo: 'Ingeniería Ambiental', exp: 3, objetivo: 'especializarse en reporting ESG', pais: 'Perú', tz: 'America/Lima' }, s: { visitas: 2 }, conv: [] },
      { id: 'm06', n: 'Jorge Villalobos', rol: 'Desarrollador backend', seg: 'particular', ciudad: 'Ciudad de México', prod: IA, orig: 'c2', canal: 'wa', etapa: 1, valor: P[IA], creado: n2, act: n2 - 20, toque: null, llamadas: [],
        f: { titulo: 'Ingeniería en Sistemas', exp: 5, objetivo: 'pasar a IA aplicada', pais: 'México', tz: 'America/Mexico_City' }, s: { visitas: 3, temario: true }, conv: [],
        ev: [[n2 - 20, 'web', 'Descarga el plan de estudios']] },
      { id: 'm07', n: 'Marta Llorente', rol: 'Técnica de medio ambiente', emp: 'Consultora Verdemar', seg: 'particular', ciudad: 'Sevilla', prod: ESG, orig: 'c1', canal: 'wa', etapa: 1, valor: P[ESG], creado: n3, act: n3, toque: null, llamadas: [],
        f: { titulo: 'Ciencias Ambientales', exp: 6, objetivo: 'llevar la estrategia ESG de su empresa', pais: 'España' }, s: { visitas: 1 }, conv: [] },
      { id: 'm08', n: 'Sebastián Arango', rol: 'Consultor de negocio', seg: 'particular', ciudad: 'Medellín', prod: MBA, orig: 'c2', canal: 'wa', etapa: 1, valor: P[MBA], creado: n4, act: n4, toque: null, llamadas: [],
        f: { titulo: 'Administración de Empresas', exp: 7, objetivo: 'montar su propia consultora', pais: 'Colombia', tz: 'America/Bogota' }, s: { visitas: 2 }, conv: [] },
      { id: 'm09', n: 'Pablo Ferrer', rol: 'Técnico de sistemas', seg: 'particular', ciudad: 'Bilbao', prod: CIB, orig: 'c3', canal: 'wa', etapa: 2, valor: P[CIB], creado: L(19, 10, 3), act: n5, toque: L(16, 20, 1),
        f: { titulo: 'Grado en Informática', exp: 3, objetivo: 'pasar a ciberseguridad', pais: 'España' }, s: { visitas: 2, temario: true },
        conv: [[L(10, 40, 2), 'h', 'wa', 'Hola Pablo, soy Inés, de admisiones. ¿El máster lo buscas para especializarte en tu puesto actual?'], [L(10, 40, 2) - 35, 'c', 'wa', 'Sí, llevo tres años en sistemas y quiero pasarme a seguridad.'], [L(16, 20, 1), 'h', 'wa', 'Perfecto. Te dejo el plan de estudios. ¿Lo vemos en una entrevista de admisión?'], [n5, 'c', 'wa', 'Sí, pero trabajo a turnos: ¿las clases en directo se graban? Y si es así, ¿cuándo podríamos hablar?']] },

      { id: 'm31', n: 'Irene Castaño', rol: 'Responsable de sistemas', emp: 'Frutas del Ebro', seg: 'particular', ciudad: 'Zaragoza', prod: CIB, orig: 'c3', canal: 'wa', etapa: 1, valor: P[CIB], creado: L(16, 40, 1), act: L(16, 40, 1), toque: L(17, 5, 1), llamadas: [],
        f: { titulo: 'Ingeniería Informática', exp: 7, objetivo: 'dirigir la seguridad de la empresa', pais: 'España' }, s: { intentos: 1 },
        conv: [[L(17, 5, 1), 'h', 'wa', 'Hola Irene, soy Inés, de admisiones. Vi tu solicitud del Máster en Ciberseguridad. ¿Cuándo te va bien que hablemos?']] },

      // --- Admitidos que no han reservado plaza
      { id: 'm10', n: 'Fernanda Ibarra', rol: 'Coordinadora de RSC', emp: 'Pesquera Humboldt', seg: 'particular', ciudad: 'Lima', prod: ESG, orig: 'c2', canal: 'wa', etapa: 4, valor: P[ESG], creado: L(2, 30, 14), act: L(18, 15, 6), toque: L(9, 40, 5),
        f: { titulo: 'Comunicación', exp: 5, objetivo: 'liderar la estrategia de sostenibilidad', pais: 'Perú', tz: 'America/Lima' }, s: { prop: L(11, 30, 7), propVista: 1, beca: true, precio: true },
        conv: [[L(9, 45, 14), 'h', 'wa', 'Hola Fernanda, soy Marcos, de admisiones. Vi tu solicitud del Máster en Sostenibilidad. ¿Hablamos esta semana?'], [L(9, 45, 14) - 480, 'c', 'wa', 'Hola Marcos, sí, en la tarde de Lima me va mejor.'], [L(11, 30, 7), 'h', 'email', 'Fernanda, estás admitida en el Máster en Sostenibilidad y ESG. Te envío la oferta de plaza.'], [L(18, 15, 6), 'c', 'wa', '¡Qué bien! Una consulta: ¿hay alguna beca para Perú? Sin beca este año no me alcanza.'], [L(9, 40, 5), 'h', 'wa', 'Lo consulto con dirección y te digo.']] },
      { id: 'm11', n: 'Álvaro Rubio', rol: 'Jefe de ventas', emp: 'Suministros Hidráulicos Centro', seg: 'particular', ciudad: 'Madrid', prod: MBA, orig: 'c1', canal: 'wa', etapa: 4, valor: P[MBA], creado: L(13, 20, 10), act: 2 * H, toque: L(12, 10, 3),
        f: { titulo: 'Ingeniería Industrial', exp: 10, objetivo: 'pasar a dirección general', pais: 'España', empresaPaga: true }, s: { prop: L(12, 10, 3), propVista: 4, precio: true, financia: true },
        conv: [[L(16, 0, 10), 'h', 'wa', 'Hola Álvaro, soy Inés, de admisiones. ¿Te va bien que hablemos del MBA esta semana?'], [L(16, 0, 10) - 20, 'c', 'wa', 'Sí, mejor por la tarde.'], [L(12, 10, 3), 'h', 'wa', 'Álvaro, estás admitido en el MBA. Te acabo de mandar la oferta de plaza. Si tu empresa paga una parte, preparamos la factura a su nombre.'], [L(12, 10, 3) - 90, 'c', 'wa', 'Genial, gracias. Lo hablo con mi director esta semana y te digo cómo lo pagamos.']],
        ev: [[2 * H, 'web', 'Abre la oferta de plaza por cuarta vez']] },
      { id: 'm12', n: 'Natalia Cordero', rol: 'Especialista en e-commerce', seg: 'particular', ciudad: 'Ciudad de México', prod: MKT, orig: 'c2', canal: 'wa', etapa: 4, valor: P[MKT], creado: L(5, 0, 17), act: L(18, 20, 8), toque: L(9, 35, 7),
        f: { titulo: 'Mercadotecnia', exp: 4, objetivo: 'llevar el e-commerce de una marca grande', pais: 'México', tz: 'America/Mexico_City' }, s: { prop: L(11, 0, 9), financia: true },
        conv: [[L(10, 30, 17), 'h', 'wa', 'Hola Natalia, soy Marcos, de admisiones. ¿Te cuento cómo es el máster?'], [L(10, 30, 17) - 340, 'c', 'wa', 'Sí porfa, me interesa mucho.'], [L(11, 0, 9), 'h', 'email', 'Natalia, ¡admitida! Te envío la oferta de plaza y las opciones de pago.'], [L(18, 20, 8), 'c', 'wa', '¿Me pueden explicar por aquí las opciones de pago? El correo no me abre bien en el celular.'], [L(9, 35, 7), 'h', 'wa', 'Claro, te lo reenvío.']] },

      // --- Entrevistas de admisión
      { id: 'm13', n: 'Elena Sanz', rol: 'Coordinadora de marketing', emp: 'Muebles Levante Hogar', seg: 'particular', ciudad: 'Valencia', prod: MKT, orig: 'c1', canal: 'wa', etapa: 3, valor: P[MKT], creado: L(12, 10, 4), act: L(16, 30, 4) - 50, toque: L(10, 0, 2),
        f: { titulo: 'Publicidad y RR. PP.', exp: 4, objetivo: 'llevar el marketing digital de su empresa', pais: 'España' }, s: { cita: 26 * H, citaOk: false, visitas: 2 },
        conv: [[L(16, 30, 4), 'h', 'wa', 'Hola Elena, soy Clara, de admisiones. ¿Buscas el máster para tu puesto actual?'], [L(16, 30, 4) - 50, 'c', 'wa', 'Sí, me interesa mucho, pero voy justa de tiempo.'], [L(10, 0, 2), 'h', 'wa', 'Te he reservado un hueco para la entrevista de admisión. ¿Me confirmas si te va bien?']] },
      { id: 'm14', n: 'Diego Huamán', rol: 'Analista de redes', seg: 'particular', ciudad: 'Lima', prod: CIB, orig: 'c4', canal: 'wa', etapa: 3, valor: P[CIB], creado: L(6, 20, 3), act: L(9, 50, 1) - 300, toque: L(9, 50, 1),
        f: { titulo: 'Ingeniería de Telecomunicaciones', exp: 4, objetivo: 'especializarse en ciberseguridad', pais: 'Perú', tz: 'America/Lima' }, s: { cita: 3 * D, citaOk: true, visitas: 1 },
        conv: [[L(10, 15, 3), 'h', 'email', 'Hola Diego, te escribo desde admisiones por tu solicitud en el portal de másteres.'], [L(18, 0, 2), 'c', 'wa', 'Hola, mejor por WhatsApp. Sí, quiero hacer la entrevista.'], [L(9, 50, 1), 'h', 'wa', 'Hecho: entrevista de admisión confirmada. Te mando el enlace con la hora de Lima.'], [L(9, 50, 1) - 300, 'c', 'wa', '¡Gracias!']] },
      { id: 'm15', n: 'Mariana Ochoa', rol: 'Product manager', emp: 'Seguros Altiplano', seg: 'particular', ciudad: 'Ciudad de México', prod: IA, orig: 'c3', canal: 'wa', etapa: 3, valor: P[IA], creado: L(3, 30, 3), act: L(18, 5, 2), toque: L(9, 30, 1),
        f: { titulo: 'Actuaría', exp: 6, objetivo: 'liderar productos con IA', pais: 'México', tz: 'America/Mexico_City', puedePagar: true }, s: { cita: 50 * H, citaOk: true, visitas: 2 },
        conv: [[L(10, 20, 3), 'h', 'wa', 'Hola Mariana, soy Marcos, de admisiones. ¿El máster de IA lo buscas para tu puesto actual?'], [L(10, 20, 3) - 420, 'c', 'wa', 'Sí, lidero producto y quiero entender bien los modelos.'], [L(18, 5, 2), 'c', 'wa', '¿Tienen hueco para la entrevista esta semana?'], [L(9, 30, 1), 'h', 'wa', 'Sí, te la dejo agendada. Te llega la invitación al correo.']] },
      { id: 'm16', n: 'Javier Lozano', rol: 'Director de oficina bancaria', seg: 'particular', ciudad: 'Sevilla', prod: MBA, orig: 'c1', canal: 'wa', etapa: 3, valor: P[MBA], creado: L(20, 15, 8), act: L(19, 0, 2), toque: L(10, 0, 3),
        f: { titulo: 'Economía', exp: 12, objetivo: 'pasar a dirección regional', pais: 'España' }, s: { noshow: true, precio: true, visitas: 3 },
        conv: [[L(9, 40, 7), 'h', 'wa', 'Hola Javier, soy Inés, de admisiones. ¿Te cuento cómo es el MBA?'], [L(9, 40, 7) - 30, 'c', 'wa', 'Sí. Quiero dar el salto a dirección regional.'], [L(10, 0, 3), 'h', 'wa', 'Javier, te recuerdo la entrevista de admisión de mañana a las 19:00.'], [L(10, 0, 3) - 30, 'c', 'wa', 'Ok, allí estaré.']],
        ev: [[L(19, 0, 2), 'sistema', 'No se presenta a la entrevista de admisión']] },

      // --- Empezarían en otra edición
      { id: 'm17', n: 'Paula Hernández', rol: 'Community manager', seg: 'particular', ciudad: 'Guadalajara', prod: MKT, orig: 'c2', canal: 'wa', etapa: 2, valor: P[MKT], creado: L(4, 0, 14), act: L(21, 30, 12), toque: L(9, 20, 11),
        f: { titulo: 'Mercadotecnia', exp: 2, pais: 'México', tz: 'America/Mexico_City' }, s: { luego: 'febrero', luegoTxt: 'empezaría en la edición de febrero, cuando cobre el aguinaldo', precio: true },
        conv: [[L(10, 10, 14), 'h', 'wa', 'Hola Paula, soy Marcos, de admisiones. ¿Buscas empezar en octubre?'], [L(21, 30, 12), 'c', 'wa', 'Me encanta, pero ahorita no me alcanza. Empezaría en la de febrero, cuando cobre el aguinaldo.'], [L(9, 20, 11), 'h', 'wa', 'Perfecto, Paula. Te escribimos antes de febrero.']] },
      { id: 'm18', n: 'Raúl Ortega', rol: 'Analista de datos', seg: 'particular', ciudad: 'Madrid', prod: IA, orig: 'c5', canal: 'wa', etapa: 3, valor: P[IA], creado: L(11, 0, 22), act: L(19, 10, 18), toque: L(9, 30, 17),
        f: { titulo: 'Matemáticas', exp: 3, objetivo: 'pasar a científico de datos', pais: 'España' }, s: { luego: 'febrero', luegoTxt: 'empezaría en la edición de febrero, cuando cierre el proyecto que lidera', temario: true },
        conv: [[L(12, 40, 22), 'h', 'wa', 'Hola Raúl, soy Inés, de admisiones. Te escribo porque nos llegó tu nombre por un antiguo alumno. ¿Te cuento cómo es el máster de IA?'], [L(19, 10, 18), 'c', 'wa', 'La entrevista me ha encantado, pero ahora no puedo. Empezaría en la edición de febrero, cuando cierre el proyecto que estoy liderando.'], [L(9, 30, 17), 'h', 'wa', 'Lo apunto, Raúl. Hablamos antes de febrero.']] },
      { id: 'm19', n: 'Carolina Vega', rol: 'Analista de proyectos sociales', seg: 'particular', ciudad: 'Bogotá', prod: ESG, orig: 'c2', canal: 'wa', etapa: 2, valor: P[ESG], creado: L(2, 50, 16), act: L(20, 10, 15), toque: L(10, 5, 14),
        f: { titulo: 'Economía', exp: 3, pais: 'Colombia', tz: 'America/Bogota' }, s: { luego: 'el verano que viene', luegoTxt: 'empezaría en la edición de octubre del año que viene', beca: true },
        conv: [[L(9, 55, 16), 'h', 'wa', 'Hola Carolina, soy Marcos, de admisiones. ¿Te cuento cómo funcionan las becas?'], [L(20, 10, 15), 'c', 'wa', 'Sí, gracias. Este año no llego: me gustaría entrar en la edición de octubre del año que viene, con beca si se puede.'], [L(10, 5, 14), 'h', 'wa', 'Perfecto, te escribimos con tiempo.']] },
      { id: 'm20', n: 'Martín Salazar', rol: 'Soporte TI', seg: 'particular', ciudad: 'Lima', prod: CIB, orig: 'c4', canal: 'wa', etapa: 2, valor: P[CIB], creado: L(3, 15, 11), act: L(19, 40, 9), toque: L(9, 45, 8),
        f: { titulo: 'Ingeniería de Software', exp: 2, pais: 'Perú', tz: 'America/Lima' }, s: { luego: 'febrero', luegoTxt: 'se apuntaría a la edición de febrero, cuando termine la certificación que está haciendo' },
        conv: [[L(10, 0, 11), 'h', 'wa', 'Hola Martín, soy Marcos, de admisiones. ¿El máster lo quieres para este año?'], [L(19, 40, 9), 'c', 'wa', 'Estoy terminando una certificación. Me apuntaría a la de febrero.'], [L(9, 45, 8), 'h', 'wa', 'Genial, te escribimos en enero.']] },

      // --- Sin seguimiento después de contestar
      { id: 'm21', n: 'Gabriel Soto', rol: 'Consultor de proyectos', seg: 'particular', ciudad: 'Medellín', prod: MBA, orig: 'c2', canal: 'wa', etapa: 2, valor: P[MBA], creado: L(4, 30, 7), act: L(19, 50, 3), toque: L(12, 15, 4),
        f: { titulo: 'Ingeniería Industrial', exp: 6, objetivo: 'pasar a gerencia', pais: 'Colombia', tz: 'America/Bogota' }, s: { precio: true, financia: true, visitas: 2 },
        conv: [[L(10, 25, 7), 'h', 'wa', 'Hola Gabriel, soy Marcos, de admisiones. ¿Te interesa el MBA para crecer en tu empresa?'], [L(10, 25, 7) - 360, 'c', 'wa', 'Sí, para pasar a gerencia en la consultora.'], [L(12, 15, 4), 'h', 'wa', 'Te comparto el programa. ¿Alguna duda?'], [L(19, 50, 3), 'c', 'wa', '¿Me pueden pasar el precio en pesos colombianos y si se puede pagar en cuotas?']] },
      { id: 'm22', n: 'Nuria Pons', rol: 'Técnica de calidad', emp: 'Azulejos Plana Alta', seg: 'particular', ciudad: 'Castellón', prod: ESG, orig: 'c4', canal: 'wa', etapa: 2, valor: P[ESG], creado: L(17, 40, 5), act: L(21, 5, 4), toque: L(12, 30, 2),
        f: { titulo: 'Química', exp: 5, objetivo: 'llevar la sostenibilidad de su fábrica', pais: 'España' }, s: { oficial: true, visitas: 2 },
        conv: [[L(10, 10, 4), 'h', 'wa', 'Hola Nuria, soy Clara, de admisiones. Vi tu solicitud desde el portal. ¿Te cuento el programa?'], [L(21, 5, 4), 'c', 'wa', '¿El título es oficial o propio? Lo necesito para un proceso interno de mi empresa.'], [L(12, 30, 2), 'h', 'wa', 'Es un título propio, de 60 ECTS. Te paso más información por correo.']] },

      // --- Encaje bajo
      { id: 'm23', n: 'Kevin Rojas', rol: 'Estudiante de Administración', seg: 'particular', ciudad: 'Ciudad de México', prod: MKT, orig: 'c2', canal: 'wa', etapa: 2, valor: P[MKT], creado: L(1, 50, 4), act: L(9, 40, 4) - 420, toque: L(9, 40, 4),
        f: { gratis: true, sinGrado: true, pais: 'México', tz: 'America/Mexico_City' }, llamadas: [], s: { beca: true },
        conv: [[L(9, 40, 4), 'h', 'wa', 'Hola Kevin, soy Marcos, de admisiones. ¿Te cuento cómo es el máster?'], [L(9, 40, 4) - 420, 'c', 'wa', 'Hola, vi lo de la beca en el anuncio, ¿el máster sale gratis? Todavía voy en 3.er semestre.']] },
      { id: 'm24', n: 'Lucas Martín', rol: 'Estudiante de bachillerato', seg: 'particular', ciudad: 'Valencia', prod: IA, orig: 'c1', canal: 'wa', etapa: 2, valor: P[IA], creado: L(18, 30, 2), act: L(10, 15, 1) - 15, toque: L(10, 15, 1),
        f: { menor: true, sinGrado: true, pais: 'España' }, llamadas: [], s: {},
        conv: [[L(10, 15, 1), 'h', 'wa', 'Hola Lucas, soy Clara, de admisiones. ¿El máster lo buscas para tu trabajo actual?'], [L(10, 15, 1) - 15, 'c', 'wa', 'Tengo 17 años, ¿me puedo apuntar ya o tengo que esperar a la uni?']] },
      { id: 'm25', n: 'Brenda Jiménez', rol: 'Asistente administrativa', seg: 'particular', ciudad: 'Guadalajara', prod: MKT, orig: 'c2', canal: 'wa', etapa: 1, valor: P[MKT], creado: L(3, 20, 13), act: L(3, 20, 13), toque: L(11, 0, 9),
        f: { gratis: true, exp: 1, pais: 'México', tz: 'America/Mexico_City' }, llamadas: [], s: { intentos: 3 },
        conv: [[L(10, 5, 13), 'h', 'wa', 'Hola Brenda, soy Marcos, de admisiones. ¿Te cuento cómo es el máster?']] },

      // --- Matriculados
      { id: 'm26', n: 'Sofía Navarro', rol: 'Marketing manager', seg: 'particular', ciudad: 'Madrid', prod: MKT, orig: 'c5', canal: 'wa', etapa: 6, valor: P[MKT], creado: L(12, 0, 25), act: L(19, 20, 3), toque: L(10, 0, 4), fin: 'ganado',
        f: { titulo: 'ADE', exp: 6, pais: 'España' }, s: {},
        conv: [[L(19, 20, 3), 'c', 'wa', '¡Ya tengo acceso al campus! Gracias por todo, Clara.']] },
      { id: 'm27', n: 'Andrés Castillo', rol: 'Científico de datos', seg: 'particular', ciudad: 'Bogotá', prod: IA, orig: 'c2', canal: 'wa', etapa: 6, valor: P[IA], creado: L(3, 0, 28), act: L(12, 0, 4), toque: L(12, 0, 4), fin: 'ganado',
        f: { titulo: 'Estadística', exp: 5, pais: 'Colombia', tz: 'America/Bogota' }, s: {}, conv: [] },
      { id: 'm28', n: 'Beatriz Ramos', rol: 'Directora de operaciones', emp: 'Laboratorios Aralia', seg: 'particular', ciudad: 'Madrid', prod: MBA, orig: 'c3', canal: 'email', etapa: 6, valor: P[MBA], creado: L(11, 0, 42), act: L(9, 15, 2), toque: L(9, 15, 2), fin: 'ganado',
        f: { titulo: 'Farmacia', exp: 12, empresaPaga: true, pais: 'España' }, s: { exp: true, expTxt: 'Pregunta si dos personas de su equipo pueden entrar en la edición de febrero' },
        conv: [[L(9, 15, 2), 'c', 'email', 'El MBA va genial. En RR. HH. preguntan si dos personas de mi equipo podrían entrar en la edición de febrero con las mismas condiciones.']] },

      // --- Perdidos
      { id: 'm29', n: 'Hugo Delgado', rol: 'Técnico de redes', seg: 'particular', ciudad: 'Sevilla', prod: CIB, orig: 'c3', canal: 'wa', etapa: 1, valor: P[CIB], creado: L(0, 40, 14), act: L(9, 50, 14) - 30, toque: L(9, 50, 14), fin: 'perdido',
        f: { titulo: 'Grado en Telecomunicación', exp: 3, pais: 'España' }, s: {},
        conv: [[L(9, 50, 14), 'h', 'wa', 'Hola Hugo, soy Inés, de admisiones. Vi tu solicitud del Máster en Ciberseguridad. ¿Te cuento?'], [L(9, 50, 14) - 30, 'c', 'wa', 'Gracias, pero ya me he matriculado en otra escuela. Me contestaron esa misma noche.']] },
      { id: 'm30', n: 'Valeria Montes', rol: 'Diseñadora gráfica', seg: 'particular', ciudad: 'Ciudad de México', prod: MKT, orig: 'c2', canal: 'wa', etapa: 1, valor: P[MKT], creado: L(2, 10, 19), act: L(2, 10, 19), toque: L(10, 0, 15), fin: 'perdido',
        f: { titulo: 'Diseño Gráfico', exp: 2, pais: 'México', tz: 'America/Mexico_City' }, s: { intentos: 3 },
        conv: [[L(10, 0, 19), 'h', 'wa', 'Hola Valeria, soy Marcos, de admisiones. ¿Te cuento cómo es el máster?']] }
    ]
  };

  // Copilot: en este sector la campaña con peor retorno no se recorta, porque
  // se pierde en la respuesta y no en el anuncio. Solo cambia la recomendación
  // final de «¿Qué campañas están trayendo matrículas de verdad?», y solo aquí.
  const C = window.QV.copilot;
  if (C && C.H && C.H.campanas && !C.H.campanas._masters) {
    const orig = C.H.campanas;
    const envuelta = function (p) {
      const out = orig(p);
      const est = E();
      if (!est || !est.cfg || est.cfg.id !== 'masters' || !window.QV.anuncios) return out;
      const a = window.QV.anuncios();
      const desp = a.filas.filter(function (f) { return f.ver.id === 'despues'; })[0];
      const esc = a.filas.filter(function (f) { return f.ver.id === 'escalar'; })[0];
      if (!desp) return out;
      return out.filter(function (b) { return b.tipo !== 'accion'; }).concat([{ tipo: 'accion', texto: 'No recortaría «' + desp.c.nombre + '»: trae perfiles que encajan y se pierden porque escriben de noche y nadie contesta hasta la mañana. Primero, respuesta en el minuto uno' + (esc ? '; después, más presupuesto en «' + esc.c.nombre + '»' : '') + '.' }]);
    };
    envuelta._masters = true;
    C.H.campanas = envuelta;
  }
})();

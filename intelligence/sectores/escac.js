/* Sector: ESCAC (escuela de cine en Terrassa, Barcelona: grado universitario, másteres y cursos; alumnos
 * nacionales e internacionales). Cuenta de cliente oculta: se abre por enlace (?sector=escac) y no sale en la
 * pantalla de inicio. Preparado el 27-nov para la reunión del mismo día a partir de masters.js.
 * Lo que viene de la llamada: el proceso (solicitud de información → entrevista o prueba de acceso → matrícula),
 * el problema declarado (se escapan solicitudes en el seguimiento y presupuestos sin respuesta), 20-49 solicitudes
 * al mes y 500-999 €/mes en publicidad. TODO LO DEMÁS SON DATOS DE EJEMPLO inventados: nombres de programa
 * genéricos, importes (no son sus precios), embudo, inversión por canal, personas, equipo de admisiones y
 * mensajes. Ninguna cifra es de ESCAC ni ninguna persona es real. */
(function () {
  const H = 60, D = 1440, MS = 60000;
  const Mo = function () { return window.QV.motor; };
  const E = function () { return window.QV.estado; };

  // Muchas solicitudes entran de noche o en fin de semana. Algunas altas se
  // calculan desde la última vez que el reloj marcó esa hora.
  const T0 = Date.now();
  function desdeLas(h, m, dias) {
    const d = new Date(T0);
    d.setHours(h, m, 0, 0);
    if (d.getTime() > T0 - 30 * MS) d.setDate(d.getDate() - 1);
    d.setDate(d.getDate() - (dias || 0));
    return Math.round((T0 - d.getTime()) / MS);
  }
  // Día laborable (n = 1 el anterior, 2 el de antes…) a las h:m: los mensajes
  // del equipo siempre caen en horario de oficina y entre semana.
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
  const fueraHora = function (t) { const d = new Date(t).getDay(), h = horaNum('Europe/Madrid', t); return d === 0 || d === 6 || h >= 20 || h < 9; };
  const sinContestar = function (c) { return Mo().contesto(c) === 0 && c.tToque == null && !c.fin; };
  const minDesde = function (t) { return (E().ahora - t) / MS; };
  // Solicitudes esperando: nadie les ha contestado, o preguntaron algo y siguen esperando.
  function esperando(c) {
    if (c.fin || c.s.luego) return null;
    if (sinContestar(c) && minDesde(c.tCreado) >= 45) return c.tCreado;
    const u = Mo().ultimoMsg(c);
    if (u && u.de === 'c' && /\?/.test(u.texto) && minDesde(u.t) >= 120 && minDesde(u.t) < 10 * D) return u.t;
    return null;
  }
  const diasSin = function (c) { const t = esperando(c); return t == null ? 0 : minDesde(t) / D; };
  const olvidadas = function () { return ((E() && E().contactos) || []).filter(function (c) { return c.id !== 'demo' && (!c.x || c.x.fit >= 40) && diasSin(c) >= 2; }); };

  // Historia principal: el reloj salta a las 23:40 y la entrevista queda el
  // siguiente día laborable a las 17:00. Todo se calcula en el momento.
  function minHasta(h, m, desde) {
    const d = new Date(desde);
    d.setHours(h, m, 0, 0);
    if (d.getTime() <= desde) d.setDate(d.getDate() + 1);
    return Math.round((d.getTime() - desde) / MS);
  }
  function citaM() {
    const d = new Date(E().ahora);
    d.setDate(d.getDate() + 1);
    d.setHours(17, 0, 0, 0);
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    return d.getTime();
  }
  const dia = function (t) { return new Date(t).toLocaleDateString('es-ES', { weekday: 'long' }); };
  let tCitaM = null; // se fija al agendar, para que el recordatorio caiga el mismo día
  const diaCita = function () { return dia(tCitaM || citaM()); };

  const GRA = 'Grado en Cine', DIR = 'Máster en Dirección', GUI = 'Máster en Guion',
    FOT = 'Máster en Dirección de Fotografía', VER = 'Curso de verano de cine';
  // Importes de ejemplo, redondos, solo para que el panel calcule. No son los precios de la escuela.
  const P = {}; P[GRA] = 9500; P[DIR] = 8000; P[GUI] = 6500; P[FOT] = 8000; P[VER] = 900;

  const n1 = desdeLas(23, 10), n2 = desdeLas(2, 40), n3 = desdeLas(22, 15);

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.escac = {
    id: 'escac',
    nombre: 'ESCAC',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'programa', Producto: 'Programa',
      paginaVisitas: 'la página del programa', txtPrecio: 'preguntó por el precio',
      cita: 'entrevista', Cita: 'Entrevista', laCita: 'la entrevista o prueba de acceso',
      propuesta: 'el presupuesto de matrícula', Propuesta: 'Presupuesto de matrícula', propuestas: 'presupuestos de matrícula',
      comercial: 'el equipo de admisiones', Comercial: 'Admisiones',
      cliente: 'alumno', unCliente: 'un alumno', clientes: 'alumnos', convierten: 'se matriculan',
      objetivoPaso: 'agendar la entrevista o la prueba de acceso',
      casoExito: 'el corto de un antiguo alumno', valorAlto: 7000, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la matrícula',
      verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'empleados',
      pasoHumano: 'resolver presupuesto, plazos y fechas y cerrar la matrícula',
      senales: { propuesta: 'Presupuesto sin respuesta' },
      anunciosIntro: 'Quien lleve las campañas, vosotros o una agencia, sigue igual. El sistema une cada canal con lo que pasa después (quién recibe respuesta, quién hace la entrevista o la prueba, quién recibe el presupuesto y quién se matricula) y lo devuelve a Meta y Google para optimizar a la matrícula, no al formulario.'
    },
    // Recorrido: Canal → Solicitud de información → Contactado → Entrevista / prueba de acceso → Admitido → Matriculado
    recorrido: [
      { id: 'anuncio', txt: 'Canal', sinFuga: true },
      { id: 'solicitud', txt: 'Solicitud de información' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'entrevista', txt: 'Entrevista / prueba de acceso' },
      { id: 'admitido', txt: 'Admitido' },
      { id: 'matriculado', txt: 'Matriculado' }
    ],
    ventaEtapa: 'matriculado',
    ticket: 7000,
    // Conversión razonable en cada paso cuando se contesta a tiempo y se hace seguimiento (referencia de ejemplo).
    referencia: { contactado: 0.9, entrevista: 0.62, admitido: 0.78, matriculado: 0.7 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'solicitudes que entran de noche, en fin de semana o desde otro país y se contestan tarde o nunca' },
      entrevista: { txt: 'Paso a entrevista', exp: 'contactados a los que nadie vuelve a escribir y no llegan a la entrevista ni a la prueba de acceso' },
      admitido: { txt: 'Admisión', exp: 'entrevistas y pruebas que no terminan en admisión' },
      matriculado: { txt: 'Presupuesto y matrícula', exp: 'admitidos con el presupuesto de matrícula enviado a los que nadie vuelve a escribir' }
    },
    remedioFuga: {
      contactado: 'Respuesta en el minuto uno a cualquier hora: el agente de WhatsApp contesta de noche y en fin de semana con la información que ha aprobado admisiones, hace una pregunta para orientar y deja la entrevista o la prueba de acceso agendada.',
      entrevista: 'Ninguna solicitud se queda sin siguiente paso: si alguien pregunta y nadie contesta en 48 horas, el sistema avisa a admisiones con el hilo y el borrador de la respuesta.',
      matriculado: 'Seguimiento de cada presupuesto: el agente resuelve plazos y becas con la política de la escuela y avisa a admisiones cuando alguien está listo para matricularse o lleva días sin respuesta.'
    },
    mesDatos: { respuestaAntes: 1260, respuestaAhora: 1, agendadas: 19, fueraHorario: 0.46 },
    // Últimos 30 días, de ejemplo: 41 solicitudes y 750 € de publicidad.
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Instagram · grado y curso de verano', inversion: 450, ticket: 6000,
        embudo: { anuncio: 3600, solicitud: 16, contactado: 7, entrevista: 3, admitido: 2, matriculado: 1 } },
      { id: 'c2', canal: 'Google', nombre: 'Búsqueda «escuela de cine» y másteres', inversion: 300, ticket: 7500,
        embudo: { anuncio: 950, solicitud: 9, contactado: 7, entrevista: 5, admitido: 4, matriculado: 2 } },
      { id: 'c3', canal: 'Web', nombre: 'Formulario de la web y recomendación', inversion: 0, ticket: 7000,
        embudo: { anuncio: 2400, solicitud: 10, contactado: 8, entrevista: 5, admitido: 4, matriculado: 2 } },
      { id: 'c4', canal: 'Ferias', nombre: 'Ferias educativas y jornadas de puertas abiertas', inversion: 0, ticket: 9000,
        embudo: { anuncio: 140, solicitud: 6, contactado: 5, entrevista: 3, admitido: 2, matriculado: 1 } }
    ],
    kpis: ['interesados', 'respuesta', 'fueraHorario', 'olvidadas', 'entrevistas', 'show', 'sinPresupuesto', 'ventas', 'cpv', 'ingresos'],
    kpiNombres: { interesados: 'Solicitudes de información', entrevistas: 'Entrevistas y pruebas', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'solicitud', cualificados: 'admitido', entrevistas: 'entrevista' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      const md = cfg.mesDatos || {};
      const presu = cs.filter(function (c) { return c.etapa === 4 && c.s.tProp != null && !c.fin; });
      return {
        fueraHorario: { l: 'Llegan fuera de horario', v: M.pct(md.fueraHorario || 0), em: 'noches, findes y otros husos', clase: 'mal' },
        olvidadas: { l: 'Más de 2 días sin respuesta', v: M.num(olvidadas().length), em: 'solicitudes y preguntas sin contestar', clase: 'mal' },
        sinPresupuesto: { l: 'Presupuestos sin respuesta', v: M.num(presu.length), em: M.euros(presu.reduce(function (a, c) { return a + c.valor; }, 0)) + ' pendientes', clase: 'mal' }
      };
    },
    agenda: { horas: [9, 19], pausa: [14, 15], ocupacion: 0.45,
      tipos: ['Entrevista de admisión · Grado', 'Prueba de acceso', 'Entrevista · Máster', 'Visita a la escuela', 'Llamada de admisiones'] },

    // Una campaña que trae muchas solicitudes pero casi nadie llega a hablar
    // con admisiones no es un problema de anuncio, es de respuesta.
    veredictoAnuncio: function (a, M) {
      const e = a.c.embudo || {};
      const tc = (e.contactado || 0) / Math.max(1, e.solicitud || 0);
      if (a.c.inversion && a.roas < a.R * 0.6 && tc < 0.5) {
        return { id: 'despues', txt: 'No es el anuncio', tono: 't-amber',
          por: 'Trae más solicitudes que ninguna y las más baratas (' + M.euros(a.c.inversion / Math.max(1, e.solicitud)).replace(' ', ' ') + '), pero solo el ' + M.pct(tc) + ' llega a hablar con alguien: entran de noche y en fin de semana y se contestan días después. El público está bien; falla el seguimiento.' };
      }
      return null;
    },
    notaAnuncios: function (a, T, M) {
      const pago = a.filas.filter(function (f) { return f.c.inversion > 0; });
      const lin = [];
      pago.filter(function (f) { return f.ver.id === 'escalar'; }).forEach(function (f) { lin.push('Subiría presupuesto en «' + f.c.canal + ' · ' + f.c.nombre + '»: ' + M.pl(f.ventas, 'matrícula', 'matrículas') + ' y ' + M.num(f.roas, 1) + '× de retorno con solo ' + f.entra + ' solicitudes.'); });
      pago.filter(function (f) { return f.ver.id === 'despues'; }).forEach(function (f) { lin.push('No tocaría «' + f.c.canal + ' · ' + f.c.nombre + '»: trae ' + f.entra + ' solicitudes a ' + M.euros(f.cpl) + ' y el perfil encaja. Se pierden porque llegan de noche o en fin de semana y nadie contesta a tiempo. Eso lo arreglamos nosotros.'); });
      pago.filter(function (f) { return f.ver.id === 'publico'; }).forEach(function (f) { lin.push('Revisaría el público de «' + f.c.nombre + '»: lo que trae no encaja (encaje medio ' + f.fitMedio + ').'); });
      lin.push('Las ferias y la web no cuestan anuncio y traen los perfiles que más se matriculan: a cada contacto de feria, mensaje el mismo día.');
      lin.push('Desde esta semana os llegan a Meta y Google los eventos de ' + M.unir(a.eventos.map(function (e) { return e.etapa.toLowerCase(); })) + ', con su valor. Optimizad a la matrícula, no a la solicitud.');
      return lin;
    },

    reglas: {
      fitBase: 24,
      fit: [
        [function (c) { return c.f && c.f.bach; }, 16, 'termina bachillerato este curso', 'Termina bachillerato (grado)'],
        [function (c) { return c.f && c.f.titulo; }, 16, function (c) { return 'titulación universitaria (' + c.f.titulo + ')'; }, 'Titulación universitaria (máster)'],
        [function (c) { return c.f && c.f.porfolio; }, 14, 'tiene trabajos propios (cortos, guiones o fotografía)', 'Trae trabajos propios'],
        [function (c) { return c.f && c.f.exp > 0; }, 6, function (c) { return c.f.exp + (c.f.exp === 1 ? ' año' : ' años') + ' en rodajes o producción'; }, 'Experiencia en rodajes'],
        [function (c) { return c.f && c.f.objetivo; }, 12, function (c) { return 'objetivo claro: ' + c.f.objetivo; }, 'Sabe qué quiere hacer'],
        [function (c) { return (c.f && (c.f.puedePagar || c.f.familia)) || c.s.financia || c.s.beca; }, 8, function (c) { return c.f && c.f.familia ? 'la familia acompaña la decisión' : c.f && c.f.puedePagar ? 'tiene cómo pagarlo' : 'busca cómo pagarlo (plazos o beca)'; }, 'Puede pagarlo o pregunta por plazos o beca'],
        [function (c) { return c.f && c.f.gratis; }, -34, 'busca un curso gratis', 'Busca un curso gratis'],
        [function (c) { return c.f && c.f.menor; }, -40, 'todavía está en la ESO', 'Todavía en la ESO']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 12, 'quiere entrar el curso que viene'],
        [function (c) { return c.s.prueba; }, 10, 'preguntó por la prueba de acceso'],
        [function (c) { return c.s.visita; }, 8, 'pidió visitar la escuela'],
        [function (c) { return c.s.beca; }, 8, 'preguntó por becas'],
        [function (c) { return c.s.financia; }, 8, 'preguntó por el pago a plazos'],
        [function (c) { return c.s.plan; }, 6, 'descargó el plan de estudios']
      ],
      riesgo: [
        [function (c, k) { return sinContestar(c) && k.creado >= 45; }, 40, function (c, k) { return 'lleva ' + Mo().duracion(k.creado) + ' sin que nadie le conteste'; }],
        [function (c, k) { return sinContestar(c) && k.creado >= 45 && fueraHora(c.tCreado); }, 8, function (c) { return 'pidió información fuera de horario (' + horaEn('Europe/Madrid', c.tCreado) + ')'; }],
        [function (c) { return !sinContestar(c) && diasSin(c) >= 2; }, 30, function (c) { return 'preguntó algo hace ' + Mo().duracion(diasSin(c) * D) + ' y nadie le ha contestado'; }]
      ]
    },

    nba: function (c, k, x, T, M) {
      // Solicitudes que nadie ha contestado: el agente contesta ya.
      if (sinContestar(c) && k.creado >= 45 && x.fit >= 40) {
        const loc = c.f && c.f.tz ? horaEn(c.f.tz, c.tCreado) : '';
        return { id: 'wa', accion: 'Contestar ya por WhatsApp', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Pidió información a las ' + horaEn('Europe/Madrid', c.tCreado) + (loc ? ' (' + loc + ' en ' + c.ciudad + ')' : '') + ' y lleva ' + M.duracion(k.creado) + ' sin respuesta. Cuanto más espera, más probable es que se apunte a la prueba de otra escuela. El agente le escribe ahora y le propone la entrevista o la prueba de acceso.' };
      }
      // Preguntas sin contestar desde hace días: aviso a admisiones con el borrador.
      if (!sinContestar(c) && diasSin(c) >= 2 && x.fit >= 40) {
        const u = M.ultimoMsg(c);
        return { id: 'aviso', accion: 'Contestar hoy: lleva ' + M.duracion(diasSin(c) * D) + ' esperando', quien: T.Comercial, tipo: 'humano', estado: 'humano',
          por: 'Escribió hace ' + M.duracion(diasSin(c) * D) + ' («' + u.texto.slice(0, 70) + (u.texto.length > 70 ? '…' : '') + '») y nadie le ha contestado. El sistema ya ha avisado a admisiones con el hilo y un borrador de respuesta listo para enviar.' };
      }
      return null;
    },
    vozMotivo: function (c) { return c.f && c.f.objetivo ? 'Quiere ' + c.f.objetivo + '.' : 'Le interesa el ' + c.prod + '.'; },
    vozDijo: function (c) {
      const out = [];
      if (c.f && c.f.objetivo) out.push('Objetivo: ' + c.f.objetivo);
      if (c.s.prueba) out.push('Pregunta por la prueba de acceso');
      if (c.s.financia) out.push('Pregunta por el pago a plazos');
      return out;
    },

    preguntas: [
      { q: '¿Qué debería trabajar hoy el equipo de admisiones?', h: 'trabajar', obj: ['todo', 'conversion', 'ventas', 'seguimiento'] },
      { q: '¿Qué solicitudes llevan días sin respuesta?', h: 'lista', obj: ['seguimiento', 'conversion', 'captacion', 'todo'],
        filtro: function (c) { return esperando(c) != null && (!c.x || c.x.fit >= 40); }, orden: 'prio',
        intro: function (l, T, M) {
          const dias = l.filter(function (c) { return diasSin(c) >= 2; }).length;
          const fuera = l.filter(function (c) { return fueraHora(esperando(c)); }).length;
          return '**' + l.length + ' solicitudes** están esperando respuesta y **' + dias + '** llevan más de dos días. ' + fuera + ' escribieron de noche o en fin de semana. Este mes, la primera respuesta tarda de media ' + M.duracionLarga(E().cfg.mesDatos.respuestaAntes) + '; con el agente, un minuto.';
        },
        cols: ['nombre', ['Escribió', function (c) { return Mo().fechaCorta(esperando(c), E().ahora); }], ['Esperando', function (c) { return Mo().duracion(minDesde(esperando(c))); }], ['Programa', function (c) { return c.prod; }], 'accion'], vista: 'tabla',
        cierre: 'De noche y en fin de semana contesta el agente. Si una pregunta lleva 48 horas sin respuesta, admisiones recibe un aviso con el hilo y el borrador.' },
      { q: '¿Qué presupuestos de matrícula siguen sin respuesta?', h: 'lista', obj: ['seguimiento', 'conversion', 'ventas', 'todo'],
        filtro: function (c) { return c.etapa === 4 && c.s.tProp != null && !c.fin; }, orden: 'valor', suma: true,
        intro: function (l, T, M) {
          const dinero = l.filter(function (c) { return c.s.beca || c.s.financia; }).length;
          return '**' + l.length + ' admitidos** tienen el presupuesto de matrícula y no han contestado. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' (importes de ejemplo). ' + dinero + ' preguntaron por plazos o becas y se quedaron sin respuesta clara. Ya pasaron la entrevista y la escuela los quiere.';
        },
        cols: ['nombre', 'valor', ['Presupuesto', function (c) { return c.s.propVista ? 'visto ' + c.s.propVista + (c.s.propVista === 1 ? ' vez' : ' veces') : 'sin abrir'; }], ['Sin seguimiento', function (c) { return Mo().duracion(c.x.k.toque); }], 'accion'], vista: 'tabla',
        cierre: 'El agente resuelve plazos y becas con la política de la escuela y pasa a admisiones a quien está listo para matricularse.' },
      { q: '¿Quién dijo que entraría más adelante?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que entrarían en otra convocatoria. Ninguno es un no: el agente de reactivación les escribe cuando toca, con lo que contaron.'; },
        vista: 'tabla' },
      { q: '¿Quién preguntó por plazos o becas?', h: 'lista', obj: ['conversion', 'ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return (c.s.beca || c.s.financia) && !c.fin; }, orden: 'prio',
        intro: function (l, T, M) {
          const adm = l.filter(function (c) { return c.etapa === 4; }).length;
          return l.length + ' interesados preguntaron por plazos o becas (' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '). ' + adm + ' ya están admitidos. La duda del dinero se resuelve en un mensaje; el problema es que nadie la conteste.';
        },
        cols: ['nombre', ['Preguntó por', function (c) { return c.s.beca && c.s.financia ? 'beca y plazos' : c.s.beca ? 'beca' : 'plazos'; }], 'etapa', 'accion'], vista: 'tabla' }
    ],

    historias: {
      alumno: {
        titulo: 'Una solicitud del Grado en Cine a las 23:40',
        contacto: { id: 'demo', n: 'Martina Roig', rol: 'Solicitud de información', seg: 'particular', ciudad: '—', prod: GRA, orig: 'c1', canal: 'wa', etapa: 1, valor: P[GRA], creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 7, get min() { tCitaM = null; return minHasta(23, 40, E().ahora); },
            get txt() { return 'Son las 23:40 del ' + dia(E().ahora) + '. Martina pide información del Grado en Cine desde un anuncio de Instagram'; },
            feed: 'Nueva solicitud · Meta · Grado en Cine',
            cambio: { get tCreado() { return E().ahora; }, get tAct() { return E().ahora; } } },
          { dur: 6, min: 0, txt: 'El agente completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · 2.º de bachillerato · Girona · hace fotografía', cambio: { rol: 'Estudiante de 2.º de bachillerato', ciudad: 'Girona', f: { bach: true, porfolio: true, pais: 'España' } } },
          { dur: 7, min: 1, txt: 'El agente de WhatsApp le contesta en un minuto. En admisiones no hay nadie hasta mañana a las 9:00', feed: 'WhatsApp enviado en 52 segundos',
            cambio: { conv: ['a', 'wa', '¡Hola, Martina! Soy el asistente de admisiones de la escuela. Vi que pediste información del Grado en Cine. ¿Te cuento cómo es la admisión o tienes alguna duda concreta?'] }, toque: true },
          { dur: 7, min: 4, txt: 'Martina pregunta cómo es la prueba de acceso y cuánto cuesta', feed: 'Respuesta recibida · pregunta por la prueba y el precio',
            cambio: { etapa: 2, s: { prueba: true, precio: true, visitas: 3 }, conv: ['c', 'wa', '¡Hola! ¿Cómo es la prueba de acceso? ¿Hay que llevar algo hecho? Y otra cosa: ¿cuánto cuesta el grado?'] }, act: true },
          { dur: 8, min: 1, txt: 'El agente responde con lo que ha aprobado admisiones y hace una sola pregunta para orientar', feed: 'Dudas resueltas · pregunta de orientación',
            cambio: { conv: ['a', 'wa', 'La admisión tiene una entrevista personal y una prueba de acceso. No hace falta traer nada, pero si tienes fotos, cortos o guiones, nos encanta verlos. El presupuesto de matrícula te lo enviamos por escrito, con las opciones de pago. Para orientarte: ¿qué parte del cine te atrae más y para qué curso quieres entrar?'] }, toque: true },
          { dur: 8, min: 3, txt: 'Martina quiere entrar el curso que viene y pregunta si puede venir con sus padres', feed: 'Intención alta · curso que viene · quiere visitar la escuela',
            cambio: { s: { conv: true, visita: true, urg: true, urgTxt: 'quiere entrar el curso que viene' }, f: { objetivo: 'estudiar dirección de fotografía', familia: true }, conv: ['c', 'wa', 'Me encanta la fotografía, hago fotos analógicas desde los 15. Quiero entrar el curso que viene. ¿Puedo venir con mis padres a conocer la escuela?'] }, act: true },
          { dur: 8, min: 1, txt: 'El agente agenda la entrevista y la visita, con la familia',
            get feed() { return 'Entrevista agendada · ' + diaCita() + ' 17:00 · con visita a la escuela'; },
            cambio: { etapa: 3,
              s: { get cita() { tCitaM = citaM(); return Math.round((tCitaM - E().ahora) / MS); }, citaOk: true },
              get conv() { return ['a', 'wa', '¡Claro que sí! Os dejo la entrevista de admisión y una visita a la escuela el ' + diaCita() + ' a las 17:00 con Pau, de admisiones. Si quieres, trae tus fotos. Te llega la confirmación por correo y te lo recuerdo ese día por la mañana.']; } },
            toque: true },
          { dur: 7, get min() { const d = new Date(tCitaM || citaM()); d.setHours(10, 0, 0, 0); return Math.max(1, Math.round((d.getTime() - E().ahora) / MS)); },
            get txt() { return 'El ' + diaCita() + ' a las 10:00, el agente le envía el recordatorio'; },
            feed: 'Recordatorio enviado · entrevista hoy a las 17:00',
            cambio: { conv: ['a', 'wa', '¡Buenos días, Martina! Te recuerdo que hoy a las 17:00 tienes la entrevista y la visita a la escuela con Pau. ¿Os va bien? Si os ha surgido algo, la cambiamos ahora.'] }, toque: true },
          { dur: 7, min: 14, txt: 'Martina confirma: viene con su madre', feed: 'Entrevista confirmada · vienen dos personas',
            cambio: { conv: ['c', 'wa', '¡Sí! Venimos mi madre y yo. Llevo las fotos en el móvil.'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso al equipo: Martina viene hoy, y hay solicitudes que llevan días sin respuesta', feed: 'Aviso enviado a admisiones',
            humano: { titulo: 'Martina viene hoy a las 17:00',
              get texto() {
                const ol = olvidadas().sort(function (a, b) { return diasSin(b) - diasSin(a); });
                const pri = ol[0];
                return 'Girona · 2.º de bachillerato · hace fotografía analógica · quiere entrar en el Grado el curso que viene · viene con su madre. Pidió información a las 23:40 y se le contestó en un minuto; entrevista y visita con Pau hoy a las 17:00, confirmada tras el recordatorio.' +
                  (ol.length ? ' Además: ' + ol.length + (ol.length === 1 ? ' solicitud lleva' : ' solicitudes llevan') + ' más de dos días sin respuesta' + (pri ? '; la más antigua, ' + pri.n + ' (' + pri.prod + '), ' + Mo().duracion(diasSin(pri) * D) : '') + '. Tenéis el hilo y el borrador en cada ficha.' : '');
              } } }
        ]
      },
      presupuesto: {
        titulo: 'Un presupuesto de matrícula con cuatro días sin respuesta',
        contacto: { id: 'demo', n: 'Álex Morera', rol: 'Guionista de publicidad', seg: 'particular', ciudad: 'Valencia', prod: GUI, orig: 'c2', canal: 'wa', etapa: 4, valor: P[GUI], creado: 16 * D, act: 4 * D, toque: 5 * D,
          f: { titulo: 'Comunicación Audiovisual', exp: 3, porfolio: true, objetivo: 'escribir series de ficción', pais: 'España', puedePagar: true },
          s: { prop: 5 * D, propVista: 2, precio: true },
          conv: [[16 * D - 30, 'h', 'wa', 'Hola Álex, soy Pau, de admisiones. Vi tu solicitud del Máster en Guion. ¿Te va bien que hablemos esta semana?'], [16 * D - 70, 'c', 'wa', 'Sí, perfecto. Mejor por la tarde.'], [8 * D, 'h', 'wa', 'Te confirmo la entrevista de mañana a las 18:00. Trae alguno de tus guiones si quieres.'], [5 * D, 'h', 'email', '¡Enhorabuena, Álex! Estás admitido en el Máster en Guion. Te adjunto el presupuesto de matrícula.'], [4 * D, 'c', 'wa', '¡Gracias! Una duda antes de decidir: ¿se puede pagar en plazos? ¿Y la reserva se descuenta del total?']] },
        riesgo: true,
        pasos: [
          { dur: 7, min: 0, txt: 'Álex está admitido en el Máster en Guion. El presupuesto se envió hace 5 días', feed: 'Presupuesto de matrícula enviado · Máster en Guion', cambio: {} },
          { dur: 7, min: 0, txt: 'Hace 4 días preguntó por los plazos. Nadie le ha contestado', feed: 'Pregunta sin respuesta · 4 días', cambio: {} },
          { dur: 7, min: 1, txt: 'El sistema avisa a admisiones: lleva más de 48 horas sin respuesta', feed: 'Aviso a admisiones · presupuesto de 6.500 € sin respuesta', persona: true, cambio: {} },
          { dur: 8, min: 3, txt: 'Con el visto bueno de admisiones, el agente contesta con la política de pagos de la escuela', feed: 'Respuesta enviada · plazos y reserva',
            cambio: { s: { financia: true }, conv: ['a', 'wa', 'Hola, Álex, perdona la espera. Sí: la matrícula se puede pagar en plazos, y la reserva de plaza se descuenta del total. Te reenvío el presupuesto con las dos opciones de pago. ¿Lo vemos en una llamada de diez minutos?'] }, toque: true },
          { dur: 8, min: 26, txt: 'Álex contesta: quiere cerrar la plaza esta semana', feed: 'Respuesta recibida · quiere reservar esta semana',
            cambio: { s: { urg: true, urgTxt: 'quiere reservar la plaza esta semana', ppto: 'si', pptoTxt: 'pagará en plazos' }, conv: ['c', 'wa', '¡Genial! Entonces lo hago en plazos. ¿Me llamáis mañana a mediodía y cerramos la reserva?'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Álex está listo para matricularse', feed: 'Aviso enviado a admisiones',
            humano: { titulo: 'Álex está listo para matricularse', texto: 'Valencia · guionista de publicidad · admitido en el Máster en Guion · presupuesto de ejemplo de 6.500 € visto dos veces · pagará en plazos · quiere reservar esta semana. Llevaba 4 días esperando respuesta: el sistema avisó a las 48 horas. Llamada pedida para mañana a mediodía.' } }
        ]
      }
    },
    historiaDefecto: 'alumno',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'e01', n: 'Júlia Serrat', rol: 'Estudiante de 2.º de bachillerato', seg: 'particular', ciudad: 'Barcelona', prod: GRA, orig: 'c3', canal: 'wa', etapa: 4, valor: P[GRA], creado: L(19, 30, 14), act: 50, toque: L(12, 0, 3),
        f: { bach: true, porfolio: true, familia: true, objetivo: 'dirigir ficción', pais: 'España' }, s: { prop: L(12, 0, 3), propVista: 3, precio: true, financia: true, visitas: 5 },
        conv: [[L(10, 15, 13), 'h', 'wa', 'Hola Júlia, soy Laia, de admisiones. Gracias por tu solicitud del Grado en Cine. ¿Te va bien venir a la entrevista y a la prueba de acceso?'], [L(10, 15, 13) - 40, 'c', 'wa', '¡Sí! Mejor por la tarde, salgo del instituto a las 15:00.'], [L(12, 0, 3), 'h', 'email', '¡Enhorabuena, Júlia! Estás admitida en el Grado en Cine. Te enviamos el presupuesto de matrícula con las opciones de pago.'], [50, 'c', 'wa', 'Hola Laia, mis padres preguntan si el primer pago se puede partir en dos y hasta cuándo tenemos para confirmar la plaza.']],
        ev: [[2 * H, 'web', 'Abre el presupuesto de matrícula por tercera vez']] },
      { id: 'e02', n: 'Matteo Ricci', rol: 'Ayudante de dirección', seg: 'particular', ciudad: 'Bolonia', prod: DIR, orig: 'c2', canal: 'wa', etapa: 3, valor: P[DIR], creado: L(21, 10, 6), act: L(17, 20, 1) - 15, toque: L(17, 20, 1),
        f: { titulo: 'Comunicación Audiovisual', exp: 3, porfolio: true, objetivo: 'dirigir su primer largometraje', pais: 'Italia', tz: 'Europe/Rome' }, s: { cita: 26 * H, citaOk: true, visitas: 3, plan: true },
        conv: [[L(10, 5, 5), 'h', 'wa', 'Hola Matteo, soy Pau, de admisiones. Vi tu solicitud del Máster en Dirección. ¿Hacemos la entrevista por videollamada?'], [L(10, 5, 5) - 60, 'c', 'wa', 'Sí, perfecto. Os mando el enlace a mis cortos.'], [L(17, 20, 1), 'h', 'wa', 'Te confirmo la entrevista por videollamada. Te llega el enlace al correo.'], [L(17, 20, 1) - 15, 'c', 'wa', 'Grazie! Allí estaré.']] },
      { id: 'e03', n: 'Daniela Robles', rol: 'Productora de contenidos', seg: 'particular', ciudad: 'Ciudad de México', prod: GUI, orig: 'c1', canal: 'wa', etapa: 2, valor: P[GUI], creado: L(2, 30, 6), act: L(19, 40, 3), toque: L(11, 20, 4),
        f: { titulo: 'Ciencias de la Comunicación', exp: 4, objetivo: 'escribir series', pais: 'México', tz: 'America/Mexico_City' }, s: { prueba: true, beca: true, visitas: 2 },
        conv: [[L(11, 20, 5), 'h', 'wa', 'Hola Daniela, soy Laia, de admisiones. Gracias por tu interés en el Máster en Guion. ¿Te cuento cómo es la admisión?'], [L(11, 20, 5) - 400, 'c', 'wa', 'Sí, porfa. Trabajo en una productora y quiero pasar a guion de series.'], [L(11, 20, 4), 'h', 'wa', 'Te paso el plan de estudios. Cualquier duda me dices.'], [L(19, 40, 3), 'c', 'wa', '¿Puedo hacer la entrevista en línea desde México? ¿Y hay alguna beca para alumnos de Latinoamérica?']] },
      { id: 'e04', n: 'Pol Garriga', rol: 'Estudiante de 2.º de bachillerato', seg: 'particular', ciudad: 'Sabadell', prod: GRA, orig: 'c4', canal: 'wa', etapa: 2, valor: P[GRA], creado: L(11, 0, 9), act: L(18, 30, 3), toque: L(10, 30, 3),
        f: { bach: true, familia: true, pais: 'España' }, s: { prueba: true, visitas: 2 },
        conv: [[L(12, 0, 8), 'h', 'wa', 'Hola Pol, soy Laia, nos conocimos en la feria. ¿Quieres que te reserve plaza en la próxima prueba de acceso?'], [L(12, 0, 8) - 120, 'c', 'wa', 'Sí, me interesa. ¿Cuándo son?'], [L(10, 30, 3), 'h', 'wa', 'Te mando las fechas en cuanto las cerremos.'], [L(18, 30, 3), 'c', 'wa', 'Hola, ¿ya hay fechas? ¿La prueba es un día entero? Lo digo por el instituto.']] },

      // --- Solicitudes de anoche que siguen sin respuesta
      { id: 'e05', n: 'Aina Ferrer', rol: 'Estudiante de 2.º de bachillerato', seg: 'particular', ciudad: 'Palma', prod: GRA, orig: 'c1', canal: 'wa', etapa: 1, valor: P[GRA], creado: n1, act: n1, toque: null, llamadas: [],
        f: { bach: true, porfolio: true, objetivo: 'estudiar montaje', pais: 'España' }, s: { visitas: 2 }, conv: [] },
      { id: 'e06', n: 'Santiago Mejía', rol: 'Fotógrafo', seg: 'particular', ciudad: 'Medellín', prod: FOT, orig: 'c1', canal: 'wa', etapa: 1, valor: P[FOT], creado: n2, act: n2 - 10, toque: null, llamadas: [],
        f: { titulo: 'Comunicación Audiovisual', exp: 5, porfolio: true, objetivo: 'pasar de la foto fija a la dirección de fotografía', pais: 'Colombia', tz: 'America/Bogota' }, s: { visitas: 3, plan: true }, conv: [],
        ev: [[n2 - 10, 'web', 'Descarga el plan de estudios']] },
      { id: 'e07', n: 'Lucía Prats', rol: 'Estudiante de 1.º de bachillerato', seg: 'particular', ciudad: 'Valencia', prod: VER, orig: 'c1', canal: 'wa', etapa: 1, valor: P[VER], creado: n3, act: n3, toque: null, llamadas: [],
        f: { familia: true, pais: 'España' }, s: { visitas: 1 }, conv: [] },
      // --- Días sin que nadie conteste
      { id: 'e08', n: 'Hugo Navarro', rol: 'Estudiante de 2.º de bachillerato', seg: 'particular', ciudad: 'Zaragoza', prod: GRA, orig: 'c2', canal: 'wa', etapa: 1, valor: P[GRA], creado: L(20, 40, 3), act: L(20, 40, 3), toque: null, llamadas: [],
        f: { bach: true, objetivo: 'ser director de cine', pais: 'España' }, s: { visitas: 2, prueba: true }, conv: [] },
      { id: 'e09', n: 'Emma Laurent', rol: 'Montadora', seg: 'particular', ciudad: 'Lyon', prod: DIR, orig: 'c3', canal: 'email', etapa: 1, valor: P[DIR], creado: L(21, 50, 2), act: L(21, 50, 2), toque: null, llamadas: [],
        f: { titulo: 'Estudios cinematográficos', exp: 2, porfolio: true, pais: 'Francia', tz: 'Europe/Paris' }, s: { visitas: 2 }, conv: [] },
      { id: 'e10', n: 'Marc Soler', rol: 'Estudiante de CFGS de Realización', seg: 'particular', ciudad: 'Terrassa', prod: GRA, orig: 'c4', canal: 'wa', etapa: 1, valor: P[GRA], creado: L(12, 30, 2), act: L(12, 30, 2), toque: L(16, 0, 1), llamadas: [],
        f: { exp: 1, porfolio: true, pais: 'España' }, s: { intentos: 1 },
        conv: [[L(16, 0, 1), 'h', 'wa', 'Hola Marc, soy Laia, de admisiones. Nos dejaste tus datos en la jornada de puertas abiertas. ¿Te cuento cómo es la prueba de acceso?']] },

      // --- Admitidos con el presupuesto sin respuesta
      { id: 'e11', n: 'Irene Campos', rol: 'Periodista cultural', seg: 'particular', ciudad: 'Madrid', prod: GUI, orig: 'c2', canal: 'wa', etapa: 4, valor: P[GUI], creado: L(13, 20, 18), act: L(19, 10, 4), toque: L(11, 30, 6),
        f: { titulo: 'Periodismo', exp: 2, objetivo: 'escribir largometrajes', pais: 'España' }, s: { prop: L(11, 30, 6), propVista: 1, beca: true, precio: true },
        conv: [[L(10, 0, 17), 'h', 'wa', 'Hola Irene, soy Pau, de admisiones. ¿Te va bien la entrevista del Máster en Guion esta semana?'], [L(10, 0, 17) - 30, 'c', 'wa', 'Sí, el jueves por la tarde.'], [L(11, 30, 6), 'h', 'email', 'Irene, estás admitida en el Máster en Guion. Te adjunto el presupuesto de matrícula.'], [L(19, 10, 4), 'c', 'wa', '¡Qué alegría! Una pregunta: ¿hay becas o descuentos? Sin algo de ayuda este año se me hace difícil.']] },
      { id: 'e12', n: 'Bruno Esteve', rol: 'Estudiante de 2.º de bachillerato', seg: 'particular', ciudad: 'Girona', prod: GRA, orig: 'c1', canal: 'wa', etapa: 4, valor: P[GRA], creado: L(22, 30, 20), act: L(18, 0, 6), toque: L(10, 30, 4),
        f: { bach: true, familia: true, porfolio: true, pais: 'España' }, s: { prop: L(10, 30, 4), precio: true },
        conv: [[L(10, 20, 19), 'h', 'wa', 'Hola Bruno, soy Laia, de admisiones. ¿Venís a la prueba de acceso del sábado?'], [L(18, 0, 6), 'c', 'wa', 'Mis padres quieren ver el presupuesto antes de decidir.'], [L(10, 30, 4), 'h', 'email', 'Bruno, te enviamos el presupuesto de matrícula del Grado en Cine.']] },
      { id: 'e13', n: 'Renata Ortiz', rol: 'Asistente de producción', seg: 'particular', ciudad: 'Bogotá', prod: DIR, orig: 'c3', canal: 'wa', etapa: 4, valor: P[DIR], creado: L(3, 10, 21), act: L(20, 0, 7), toque: L(9, 40, 6),
        f: { titulo: 'Cine y Televisión', exp: 3, porfolio: true, objetivo: 'dirigir documental', pais: 'Colombia', tz: 'America/Bogota' }, s: { prop: L(11, 30, 8), propVista: 2, financia: true, precio: true },
        conv: [[L(10, 0, 21), 'h', 'wa', 'Hola Renata, soy Pau, de admisiones. ¿Hacemos la entrevista por videollamada?'], [L(10, 0, 21) - 380, 'c', 'wa', 'Sí, en la mañana de Bogotá me va mejor.'], [L(11, 30, 8), 'h', 'email', 'Renata, ¡admitida en el Máster en Dirección! Te enviamos el presupuesto de matrícula.'], [L(20, 0, 7), 'c', 'wa', '¿Se puede pagar en cuotas mensuales? En pesos me sale muy caro de una vez.'], [L(9, 40, 6), 'h', 'wa', 'Lo consulto y te digo.']] },

      // --- Entrevistas y pruebas de acceso
      { id: 'e14', n: 'Carlos Medina', rol: 'Estudiante de 2.º de bachillerato', seg: 'particular', ciudad: 'Sevilla', prod: GRA, orig: 'c2', canal: 'wa', etapa: 3, valor: P[GRA], creado: L(17, 40, 5), act: L(16, 30, 4) - 60, toque: L(10, 0, 2),
        f: { bach: true, objetivo: 'estudiar producción', pais: 'España' }, s: { cita: 2 * D, citaOk: false, prueba: true, visitas: 2 },
        conv: [[L(16, 30, 4), 'h', 'wa', 'Hola Carlos, soy Laia, de admisiones. ¿Puedes venir a la prueba de acceso?'], [L(16, 30, 4) - 60, 'c', 'wa', 'Tengo que mirar el viaje desde Sevilla.'], [L(10, 0, 2), 'h', 'wa', 'Te he reservado plaza en la próxima prueba. ¿Me confirmas si te va bien?']] },
      { id: 'e15', n: 'Sara Gil', rol: 'Operadora de cámara', seg: 'particular', ciudad: 'Barcelona', prod: FOT, orig: 'c3', canal: 'wa', etapa: 3, valor: P[FOT], creado: L(12, 10, 7), act: L(9, 30, 1) - 20, toque: L(9, 30, 1),
        f: { titulo: 'Bellas Artes', exp: 4, porfolio: true, objetivo: 'firmar la fotografía de un largo', pais: 'España', puedePagar: true }, s: { cita: 5 * H, citaOk: true, visitas: 2 },
        conv: [[L(10, 40, 6), 'h', 'wa', 'Hola Sara, soy Pau, de admisiones. ¿Te va bien la entrevista esta semana?'], [L(10, 40, 6) - 25, 'c', 'wa', 'Sí, y llevo mi bobina.'], [L(9, 30, 1), 'h', 'wa', 'Hecho: entrevista confirmada para mañana.'], [L(9, 30, 1) - 20, 'c', 'wa', '¡Gracias!']] },
      { id: 'e16', n: 'Adrià Mas', rol: 'Estudiante de 2.º de bachillerato', seg: 'particular', ciudad: 'Badalona', prod: GRA, orig: 'c1', canal: 'wa', etapa: 3, valor: P[GRA], creado: L(23, 0, 10), act: L(17, 0, 2), toque: L(10, 0, 3),
        f: { bach: true, pais: 'España' }, s: { noshow: true, visitas: 2 },
        conv: [[L(10, 0, 9), 'h', 'wa', 'Hola Adrià, soy Laia, de admisiones. ¿Te apunto a la entrevista?'], [L(10, 0, 9) - 45, 'c', 'wa', 'Vale, sí.'], [L(10, 0, 3), 'h', 'wa', 'Te recuerdo la entrevista del jueves a las 17:00.']],
        ev: [[L(17, 0, 2), 'sistema', 'No se presenta a la entrevista']] },

      // --- Entrarían más adelante
      { id: 'e17', n: 'Noa Bernal', rol: 'Estudiante de 1.º de bachillerato', seg: 'particular', ciudad: 'Tarragona', prod: GRA, orig: 'c4', canal: 'wa', etapa: 2, valor: P[GRA], creado: L(11, 30, 15), act: L(19, 0, 13), toque: L(10, 0, 12),
        f: { porfolio: true, familia: true, pais: 'España' }, s: { luego: 'el curso que viene', luegoTxt: 'hará la prueba de acceso el curso que viene, cuando esté en 2.º de bachillerato' },
        conv: [[L(10, 0, 14), 'h', 'wa', 'Hola Noa, soy Laia, nos vimos en la feria. ¿Te cuento cómo es el grado?'], [L(19, 0, 13), 'c', 'wa', 'Estoy en 1.º de bachillerato. Me gustaría hacer la prueba el curso que viene.'], [L(10, 0, 12), 'h', 'wa', 'Perfecto, te escribimos antes de la convocatoria.']] },
      { id: 'e18', n: 'Diego Paredes', rol: 'Redactor', seg: 'particular', ciudad: 'Lima', prod: GUI, orig: 'c1', canal: 'wa', etapa: 2, valor: P[GUI], creado: L(4, 0, 16), act: L(20, 30, 14), toque: L(10, 10, 13),
        f: { titulo: 'Literatura', exp: 0, pais: 'Perú', tz: 'America/Lima' }, s: { luego: 'el año que viene', luegoTxt: 'entraría en la edición del año que viene, si consigue beca', beca: true },
        conv: [[L(10, 0, 16), 'h', 'wa', 'Hola Diego, soy Pau, de admisiones. ¿Te cuento cómo funciona el máster?'], [L(20, 30, 14), 'c', 'wa', 'Este año no llego. Me gustaría entrar el año que viene, con beca si se puede.'], [L(10, 10, 13), 'h', 'wa', 'Lo apunto, te escribimos con tiempo.']] },
      { id: 'e19', n: 'Laura Vives', rol: 'Estudiante de 4.º de ESO', seg: 'particular', ciudad: 'Castellón', prod: VER, orig: 'c1', canal: 'wa', etapa: 2, valor: P[VER], creado: L(21, 0, 9), act: L(19, 30, 8), toque: L(10, 0, 8),
        f: { familia: true, pais: 'España' }, s: { luego: 'primavera', luegoTxt: 'su familia decide el curso de verano en primavera' },
        conv: [[L(10, 0, 8), 'h', 'wa', 'Hola Laura, soy Laia, de admisiones. ¿Te cuento cómo es el curso de verano?'], [L(19, 30, 8), 'c', 'wa', 'Mis padres lo deciden en primavera. ¿Me escribís entonces?']] },

      // --- Encaje bajo
      { id: 'e20', n: 'Kevin Torres', rol: 'Sin datos', seg: 'particular', ciudad: 'Murcia', prod: VER, orig: 'c1', canal: 'wa', etapa: 2, valor: P[VER], creado: L(1, 20, 4), act: L(9, 50, 3) - 200, toque: L(9, 50, 3),
        f: { gratis: true, pais: 'España' }, llamadas: [], s: {},
        conv: [[L(9, 50, 3), 'h', 'wa', 'Hola Kevin, soy Laia, de admisiones. ¿Te cuento cómo es el curso de verano?'], [L(9, 50, 3) - 200, 'c', 'wa', 'Hola, ¿el curso es gratis? Lo vi en un anuncio.']] },
      { id: 'e21', n: 'Iker Romero', rol: 'Estudiante de 2.º de ESO', seg: 'particular', ciudad: 'Bilbao', prod: GRA, orig: 'c1', canal: 'wa', etapa: 2, valor: P[GRA], creado: L(18, 10, 2), act: L(10, 20, 1) - 10, toque: L(10, 20, 1),
        f: { menor: true, pais: 'España' }, llamadas: [], s: {},
        conv: [[L(10, 20, 1), 'h', 'wa', 'Hola Iker, soy Laia, de admisiones. ¿El grado lo quieres para el curso que viene?'], [L(10, 20, 1) - 10, 'c', 'wa', 'Tengo 13 años jaja, ¿puedo ir ya?']] },

      // --- Matriculados
      { id: 'e22', n: 'Ona Riera', rol: 'Estudiante de 2.º de bachillerato', seg: 'particular', ciudad: 'Terrassa', prod: GRA, orig: 'c3', canal: 'wa', etapa: 5, valor: P[GRA], creado: L(12, 0, 26), act: L(18, 40, 3), toque: L(10, 0, 4), fin: 'ganado',
        f: { bach: true, familia: true, pais: 'España' }, s: {},
        conv: [[L(18, 40, 3), 'c', 'wa', '¡Matrícula hecha! Gracias por todo, Laia.']] },
      { id: 'e23', n: 'Tomás Herrera', rol: 'Guionista', seg: 'particular', ciudad: 'Buenos Aires', prod: GUI, orig: 'c2', canal: 'wa', etapa: 5, valor: P[GUI], creado: L(3, 0, 28), act: L(12, 0, 5), toque: L(12, 0, 5), fin: 'ganado',
        f: { titulo: 'Diseño de Imagen y Sonido', exp: 3, pais: 'Argentina', tz: 'America/Argentina/Buenos_Aires' }, s: {}, conv: [] },
      { id: 'e24', n: 'Elena Costa', rol: 'Estudiante universitaria', seg: 'particular', ciudad: 'Barcelona', prod: VER, orig: 'c1', canal: 'email', etapa: 5, valor: P[VER], creado: L(20, 0, 22), act: L(9, 15, 6), toque: L(9, 15, 6), fin: 'ganado',
        f: { familia: true, pais: 'España' }, s: {}, conv: [] },
      { id: 'e25', n: 'Nerea Ugarte', rol: 'Ayudante de cámara', seg: 'particular', ciudad: 'San Sebastián', prod: FOT, orig: 'c4', canal: 'wa', etapa: 5, valor: P[FOT], creado: L(11, 0, 30), act: L(10, 0, 8), toque: L(10, 0, 8), fin: 'ganado',
        f: { titulo: 'Comunicación Audiovisual', exp: 2, porfolio: true, pais: 'España' }, s: {}, conv: [] },

      // --- Perdidos
      { id: 'e26', n: 'Javier Lillo', rol: 'Estudiante de 2.º de bachillerato', seg: 'particular', ciudad: 'Alicante', prod: GRA, orig: 'c1', canal: 'wa', etapa: 1, valor: P[GRA], creado: L(23, 20, 12), act: L(12, 0, 9) - 40, toque: L(12, 0, 9), fin: 'perdido',
        f: { bach: true, pais: 'España' }, s: {},
        conv: [[L(12, 0, 9), 'h', 'wa', 'Hola Javier, soy Laia, de admisiones. Vi tu solicitud del Grado en Cine. ¿Te cuento cómo es la prueba?'], [L(12, 0, 9) - 40, 'c', 'wa', 'Gracias, pero ya me he apuntado a la prueba de otra escuela. Me contestaron esa misma noche.']] },
      { id: 'e27', n: 'Paula Méndez', rol: 'Productora', seg: 'particular', ciudad: 'Madrid', prod: DIR, orig: 'c2', canal: 'wa', etapa: 1, valor: P[DIR], creado: L(21, 30, 19), act: L(21, 30, 19), toque: L(10, 0, 14), fin: 'perdido',
        f: { titulo: 'Comunicación Audiovisual', exp: 4, pais: 'España' }, s: { intentos: 3 },
        conv: [[L(10, 0, 18), 'h', 'wa', 'Hola Paula, soy Pau, de admisiones. ¿Te cuento cómo es el Máster en Dirección?']] }
    ]
  };

  // Copilot: en este sector la campaña con peor retorno no se recorta, porque
  // se pierde en la respuesta y no en el anuncio. Solo cambia la recomendación
  // final de «¿Qué campañas están trayendo matrículas de verdad?», y solo aquí.
  const C = window.QV.copilot;
  if (C && C.H && C.H.campanas && !C.H.campanas._escac) {
    const orig = C.H.campanas;
    const envuelta = function (p) {
      const out = orig(p);
      const est = E();
      if (!est || !est.cfg || est.cfg.id !== 'escac' || !window.QV.anuncios) return out;
      const a = window.QV.anuncios();
      const desp = a.filas.filter(function (f) { return f.ver.id === 'despues'; })[0];
      const esc = a.filas.filter(function (f) { return f.ver.id === 'escalar'; })[0];
      if (!desp) return out;
      return out.filter(function (b) { return b.tipo !== 'accion'; }).concat([{ tipo: 'accion', texto: 'No recortaría «' + desp.c.nombre + '»: trae perfiles que encajan y se pierden porque escriben de noche o en fin de semana y nadie contesta a tiempo. Primero, respuesta en el minuto uno y aviso a las 48 horas' + (esc ? '; después, más presupuesto en «' + esc.c.nombre + '»' : '') + '.' }]);
    };
    envuelta._escac = true;
    C.H.campanas = envuelta;
  }
})();

/* Vista para agencias (partners): la agencia ve su cartera de clientes.
 * Los «contactos» del sistema son las cuentas de la agencia (clientes y
 * prospectos). Las campañas son las de cada cliente, y el recorrido es el de
 * los contactos que esas campañas traen al negocio del cliente.
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const M = function () { return window.QV.motor; };
  const cae = function (c) { return c.s.roasPrev > 0 && c.s.roas > 0 && c.s.roas < c.s.roasPrev * 0.8; };
  const x1 = function (v) { return M().num(v, 1) + '×'; };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.agencias = {
    id: 'agencias',
    nombre: 'Agencias (partners)',
    t: {
      contacto: 'cuenta', contactos: 'cuentas', Contactos: 'Cuentas', Contacto: 'Cuenta',
      venta: 'cliente nuevo', ventas: 'clientes nuevos', Ventas: 'Clientes nuevos', producto: 'servicio',
      paginaVisitas: 'vuestra web', txtPrecio: 'preguntó por el precio', cita: 'reunión', Cita: 'Reunión', laCita: 'la reunión',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'el director de cuentas', Comercial: 'Director de cuentas',
      cs: 'el responsable de cuenta', CS: 'Responsable de cuenta',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'firman', objetivoPaso: 'agendar la reunión',
      casoExito: 'el caso de una cuenta parecida', valorAlto: 9000, oportunidades: 'cuentas',
      laVenta: 'la firma', Producto: 'Servicio', clientes: 'clientes', propuestas: 'propuestas', verbo: 'firmar',
      clientesReales: 'ventas de verdad', empleados: 'empleados', nuevos: 'nuevas', pasoHumano: 'entender la cuenta y proponer el siguiente paso',
      senales: { baja: 'Cuenta en riesgo', expansion: 'Ampliación', nueva: 'Prospecto nuevo' },
      // Lo que traen las campañas al negocio de cada cliente
      recorrido: { contacto: 'contacto', contactos: 'contactos', Contactos: 'Contactos', Contacto: 'Contacto', venta: 'venta', ventas: 'ventas', Ventas: 'Ventas del cliente', laVenta: 'la venta de tu cliente', convierten: 'compran' },
      anunciosIntro: 'Las campañas las lleváis vosotros. El sistema une cada cuenta con lo que pasa después en el negocio del cliente (quién atiende, quién agenda, quién compra) y os dice, cuenta a cuenta, si el problema es la campaña o lo que pasa después.',
      notaTitulo: 'Lo que tu equipo de cuentas tiene que saber esta semana', notaBoton: 'Redactar el resumen para el equipo',
      notaIntro: 'Esto es lo que el sistema le diría hoy a tu equipo de cuentas. Sale de cruzar cada campaña con lo que pasa después en el negocio de cada cliente.',
      preguntaNota: '¿Qué le decimos esta semana a cada cliente?', notaAsunto: 'Asunto: Cuentas de esta semana', notaCorreo: 'Resumen para el equipo de cuentas'
    },
    sinColumnas: true,
    timelineSinOrigen: true,
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'contacto', txt: 'Contacto recibido' },
      { id: 'atendido', txt: 'Atendido por el cliente' },
      { id: 'cita', txt: 'Cita o visita' },
      { id: 'venta', txt: 'Venta del cliente' }
    ],
    ventaEtapa: 'venta',
    ticket: 1800,
    referencia: { atendido: 0.92, cita: 0.45, venta: 0.35 },
    nombresFuga: {
      atendido: { txt: 'Atención del cliente', exp: 'contactos que traéis y el cliente no atiende (y luego culpa a la campaña)' },
      cita: { txt: 'Paso a cita', exp: 'contactos atendidos que no llegan a cita o visita' },
      venta: { txt: 'Cierre del cliente', exp: 'citas que el cliente no convierte en venta' }
    },
    remedioFuga: {
      atendido: 'La capa de seguimiento de Qualivo encima de cada cliente: respuesta en el minuto uno, recordatorios y aviso a una persona. La agencia la ofrece como servicio y deja de cargar con lo que no depende de ella.'
    },
    mesDatos: { respuestaAntes: 300, respuestaAhora: 1, agendadas: 0 },
    campanas: [
      { id: 'a1', canal: 'Meta', nombre: 'Clínica Dental Arenal', inversion: 2400, ticket: 1800, embudo: { anuncio: 6800, contacto: 180, atendido: 150, cita: 70, venta: 22 } },
      { id: 'a2', canal: 'Meta', nombre: 'Academia Nexo', inversion: 3200, ticket: 1400, embudo: { anuncio: 9000, contacto: 240, atendido: 140, cita: 40, venta: 11 } },
      { id: 'a3', canal: 'Google', nombre: 'Reformas Pladur Sur', inversion: 1800, ticket: 12000, embudo: { anuncio: 2200, contacto: 70, atendido: 64, cita: 30, venta: 3 } },
      { id: 'a4', canal: 'Meta', nombre: 'Inmobiliaria Costa Blanca', inversion: 2000, ticket: 6500, embudo: { anuncio: 7000, contacto: 150, atendido: 132, cita: 40, venta: 4 } },
      { id: 'a5', canal: 'Google', nombre: 'Fisioterapia Movimiento', inversion: 900, ticket: 450, embudo: { anuncio: 1500, contacto: 60, atendido: 55, cita: 38, venta: 20 } },
      { id: 'a6', canal: 'Meta', nombre: 'Estética Lumen', inversion: 1500, ticket: 600, embudo: { anuncio: 5200, contacto: 160, atendido: 90, cita: 40, venta: 14 } },
      { id: 'a7', canal: 'LinkedIn', nombre: 'Asesoría Fiscal Norte', inversion: 1200, ticket: 2400, embudo: { anuncio: 1800, contacto: 45, atendido: 42, cita: 20, venta: 3 } },
      { id: 'a8', canal: 'Meta', nombre: 'Centro Auditivo Oír Más', inversion: 1600, ticket: 2200, embudo: { anuncio: 4000, contacto: 110, atendido: 101, cita: 45, venta: 12 } }
    ],
    // Veredicto por cuenta: primero, ¿el cliente atiende lo que le traéis?
    veredictoAnuncio: function (f, Mo) {
      const e = f.c.embudo;
      const at = e.atendido / Math.max(1, e.contacto);
      if (at < 0.7) return { id: 'despues', txt: 'No es el anuncio', tono: 't-amber', por: 'El cliente no atiende el ' + Mo.pct(1 - at) + ' de los contactos. Los que atiende compran bien. Aquí entra la capa de seguimiento.' };
      if (f.roas >= f.R * 1.3) return { id: 'escalar', txt: 'Escalar', tono: 't-teal', por: 'Devuelve ' + x1(f.roas) + ' (la cartera, ' + x1(f.R) + ') y el cliente atiende el ' + Mo.pct(at) + '. Buen momento para proponer más inversión.' };
      if (f.roas < f.R * 0.6) return { id: 'publico', txt: 'Revisar campaña', tono: 't-coral', por: 'El cliente atiende bien (' + Mo.pct(at) + ') y aun así devuelve ' + x1(f.roas) + '. Esta vez sí es la campaña: mejor que lo veáis vosotros antes que el cliente.' };
      return { id: 'mantener', txt: 'Mantener', tono: 't-lila', por: 'Retorno de ' + x1(f.roas) + ' y ' + Mo.pct(at) + ' de contactos atendidos. Sin cambios.' };
    },
    notaAnuncios: function (a, T, Mo) {
      const lin = [];
      a.filas.forEach(function (f) {
        if (f.ver.id === 'despues') lin.push(f.c.nombre + ': no atienden el ' + Mo.pct(1 - f.c.embudo.atendido / f.c.embudo.contacto) + ' de los contactos. Llevadle el dato antes de que culpe a la campaña y proponed la capa de seguimiento.');
        if (f.ver.id === 'publico') lin.push(f.c.nombre + ': el retorno ha bajado a ' + x1(f.roas) + ' y el cliente atiende bien. Revisad la campaña esta semana.');
        if (f.ver.id === 'escalar') lin.push(f.c.nombre + ': ' + x1(f.roas) + ' de retorno con los datos de venta del cliente. Es el momento de proponer más inversión.');
      });
      return lin;
    },
    kpis: ['cuentas', 'inversionG', 'contactosG', 'atendidos', 'ventasC', 'retorno', 'riesgo', 'feeRiesgo', 'ampliacion', 'sinDatos'],
    kpiCustom: function (m, cfg, Mo, est) {
      const cs = (est && est.contactos) || [];
      const clientes = cs.filter(function (c) { return c.fin === 'ganado'; });
      const riesgo = clientes.filter(function (c) { return c.x && c.x.riesgo >= 45; });
      const exp = cs.filter(function (c) { return c.s.exp; });
      const sin = clientes.filter(function (c) { return !c.s.conectado; });
      return {
        cuentas: { l: 'Cuentas activas', v: clientes.length, em: cs.length - clientes.length + ' prospectos en curso' },
        inversionG: { l: 'Inversión gestionada', v: Mo.euros(m.inversion), em: 'Al mes, en ' + cfg.campanas.length + ' cuentas' },
        contactosG: { l: 'Contactos generados', v: Mo.num(m.tot.contacto), em: Mo.euros(m.inversion / m.tot.contacto) + ' por contacto' },
        atendidos: { l: 'Atendidos por el cliente', v: Mo.pct(m.tot.atendido / m.tot.contacto), em: Mo.num(m.tot.contacto - m.tot.atendido) + ' sin atender', clase: 'mal' },
        ventasC: { l: 'Ventas de tus clientes', v: Mo.num(m.tot.venta), em: 'Medidas con su CRM' },
        retorno: { l: 'Retorno real (a venta)', v: Mo.num(m.ingresos / m.inversion, 1) + '×', em: 'No al formulario', clase: 'bien' },
        riesgo: { l: 'Cuentas en riesgo', v: riesgo.length, em: 'Antes de que avisen', clase: 'mal' },
        feeRiesgo: { l: 'Fee en riesgo', v: Mo.euros(riesgo.reduce(function (a, c) { return a + c.valor; }, 0)), em: 'Al año', clase: 'mal' },
        ampliacion: { l: 'Ampliaciones', v: exp.length, em: Mo.euros(exp.reduce(function (a, c) { return a + (c.s.expValor || 0); }, 0)) + ' al año', clase: 'bien' },
        sinDatos: { l: 'Cuentas sin datos de venta', v: sin.length, em: 'Se optimizan a ciegas' }
      };
    },

    reglas: {
      fitBase: 30,
      soloPropiasRiesgo: true,
      fit: [
        [function (c) { return c.f && c.f.inversion >= 3000; }, 22, function (c) { return M().euros(c.f.inversion) + ' al mes en anuncios'; }, 'Invierte 3.000 € al mes o más'],
        [function (c) { return c.f && c.f.inversion >= 1000 && c.f.inversion < 3000; }, 12, function (c) { return M().euros(c.f.inversion) + ' al mes en anuncios'; }, 'Invierte de 1.000 a 3.000 € al mes'],
        [function (c) { return c.f && c.f.inversion > 0 && c.f.inversion < 800; }, -16, 'inversión demasiado pequeña', 'Invierte menos de 800 € al mes'],
        [function (c) { return c.s.conectado; }, 14, 'CRM conectado: se ven sus ventas', 'Tiene el CRM conectado'],
        [function (c) { return c.f && c.f.ticketAlto; }, 10, 'su cliente final tiene ticket alto', 'Su venta es de ticket alto'],
        [function (c) { return c.f && c.f.soloRedes; }, -18, 'solo quiere que le lleven las redes', 'Solo busca redes sociales']
      ],
      riesgo: [
        [function (c) { return cae(c); }, 42, function (c) { return 'retorno de ' + x1(c.s.roasPrev) + ' a ' + x1(c.s.roas); }],
        [function (c) { return (c.s.sinAtender || 0) >= 30; }, 36, function (c) { return 'no atiende el ' + c.s.sinAtender + ' % de los contactos'; }],
        [function (c) { return (c.s.sinAtender || 0) >= 40; }, 12, null],
        [function (c) { return c.s.queja; }, 16, function (c) { return c.s.quejaTxt; }],
        [function (c) { return c.fin === 'ganado' && c.s.renovacion != null && c.s.renovacion <= 30; }, 12, function (c) { return 'renueva en ' + c.s.renovacion + ' días'; }],
        [function (c) { return c.fin === 'ganado' && !c.s.conectado; }, 12, 'sin datos de venta: se optimiza a ciegas'],
        [function (c, k) { return !c.fin && M().contesto(c) === 0 && k.creado > 2 * D; }, 30, function (c, k) { return 'no responde desde hace ' + M().duracion(k.creado); }],
        [function (c, k) { return !c.fin && M().contesto(c) > 0 && k.toque > 2 * D && !c.s.luego; }, 30, function (c, k) { return M().duracion(k.toque) + ' sin seguimiento'; }],
        [function (c, k) { return !c.fin && c.s.tProp != null && k.toque > 3 * D; }, 24, 'propuesta sin respuesta']
      ]
    },
    nba: function (c, k, x, T, Mo) {
      if (c.asignado || c.fin !== 'ganado') return null;
      if ((c.s.sinAtender || 0) >= 30) {
        return { id: 'capa', accion: 'Proponer la capa de seguimiento', quien: 'Responsable de cuenta', tipo: 'humano', estado: 'humano',
          por: 'El cliente no atiende el ' + c.s.sinAtender + ' % de los contactos que le traéis' + (c.s.queja ? ' y ya ' + c.s.quejaTxt : '') + '. El problema no es la campaña. Con el agente de seguimiento se atienden en un minuto, el cliente vende más y vosotros dejáis de ser el culpable.' };
      }
      if (cae(c)) {
        return { id: 'revisar', accion: 'Revisar la campaña esta semana', quien: 'Responsable de cuenta', tipo: 'humano', estado: 'humano',
          por: 'Retorno de ' + x1(c.s.roasPrev) + ' a ' + x1(c.s.roas) + ', y el cliente atiende bien. Esta vez sí es la campaña: mejor detectarlo vosotros que el cliente.' };
      }
      if (!c.s.conectado) {
        return { id: 'conectar', accion: 'Conectar su CRM', quien: 'Automatización', tipo: 'auto', estado: 'esperando',
          por: 'Sin sus ventas, la cuenta se optimiza al formulario y no podéis demostrar lo que traéis. Se conecta en una tarde.' };
      }
      return null;
    },

    preguntas: [
      { q: '¿Qué clientes están en riesgo de irse?', h: 'lista', obj: ['retencion', 'todo'],
        filtro: function (c) { return c.fin === 'ganado' && c.x.riesgo >= 40; }, orden: 'riesgo',
        intro: function (l, T, Mo) { return Mo.pl(l.length, 'cuenta está', 'cuentas están') + ' en riesgo. Suman ' + Mo.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' de fee al año. Lo sabéis hoy, no el día que os mandan el correo de baja.'; },
        cols: ['nombre', 'riesgo', ['Motivo', function (c) { return (c.x.riesgoM[0] || {}).txt || ''; }], 'accion'], vista: 'tabla' },
      { q: '¿En qué cuentas el problema no es el anuncio?', h: 'lista', obj: ['retencion', 'conversion', 'todo'],
        filtro: function (c) { return (c.s.sinAtender || 0) >= 30; }, orden: 'riesgo',
        intro: function (l, T, Mo) { return 'En ' + Mo.pl(l.length, 'cuenta', 'cuentas') + ' el cliente no atiende una buena parte de lo que le traéis. La campaña funciona; se pierde después. Es la conversación que evita que os cambien de agencia.'; },
        cols: ['nombre', ['Sin atender', function (c) { return c.s.sinAtender + ' %'; }], 'accion'], vista: 'tabla',
        cierre: 'Aquí la agencia ofrece la capa de seguimiento: el cliente vende más con la misma inversión y la conversación deja de ser sobre la campaña.' },
      { q: '¿Qué cuentas no nos dan datos de venta?', h: 'lista', obj: ['todo'],
        filtro: function (c) { return c.fin === 'ganado' && !c.s.conectado; }, orden: 'valor',
        intro: function (l, T, Mo) { return Mo.pl(l.length, 'cuenta se optimiza', 'cuentas se optimizan') + ' al formulario porque no vemos sus ventas. Sin ese dato no podéis demostrar lo que traéis cuando llegue la renovación.'; },
        cols: ['nombre', 'valor', 'accion'], vista: 'tabla' },
      { q: '¿Dónde podemos ampliar?', h: 'lista', obj: ['expansion', 'ventas', 'todo'],
        filtro: function (c) { return !!c.s.exp; }, orden: 'valor',
        intro: function (l, T, Mo) { return Mo.pl(l.length, 'cliente pide', 'clientes piden') + ' más. Suman ' + Mo.euros(l.reduce(function (a, c) { return a + (c.s.expValor || 0); }, 0)) + ' al año de ampliación.'; },
        cols: ['nombre', ['Qué pide', function (c) { return c.s.expTxt; }], ['Ampliación', function (c) { return M().euros(c.s.expValor || 0); }]], vista: 'tabla' }
    ],

    historias: {
      cuenta: {
        titulo: 'Una cuenta nueva y el cliente que no atiende',
        riesgo: true,
        contacto: { id: 'demo', n: 'Iker Salas', rol: 'Director', emp: 'Autoescuela Vía Rápida', seg: 'cliente', ciudad: 'Bilbao', prod: 'Campañas en Meta', orig: 'a2', canal: 'email', etapa: 1, etapaTxt: 'Cliente nuevo', valor: 9600, creado: 0, act: 0, toque: 0, fin: 'ganado', f: { inversion: 2500 }, s: { renovacion: 60 }, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una cuenta nueva: Autoescuela Vía Rápida', feed: 'Cuenta nueva · 2.500 € al mes en Meta', cambio: {} },
          { dur: 6, min: 2, txt: 'Se conecta su CRM: el sistema ve lo que pasa después del anuncio', feed: 'CRM del cliente conectado', cambio: { s: { conectado: true } } },
          { dur: 7, min: 3, txt: 'Primera semana: 64 contactos y un retorno de 6,1×', feed: 'Primera semana medida · 64 contactos', cambio: { s: { roas: 6.1, roasPrev: 6.1 } } },
          { dur: 7, min: 2, txt: 'El sistema detecta que el cliente no atiende el 41 % de los contactos', feed: 'Fuga detectada · 41 % sin atender', cambio: { s: { sinAtender: 41 } } },
          { dur: 7, min: 2, txt: 'Los que sí se atienden compran igual que en tus mejores cuentas', feed: 'Comparativa con la cartera · la campaña funciona', cambio: {} },
          { dur: 7, min: 4, txt: 'El cliente escribe: «los contactos que nos llegan son malos»', feed: 'Queja del cliente recibida', cambio: { s: { queja: true, quejaTxt: 'dice que los contactos «son malos»' }, conv: ['c', 'email', 'Oye, los contactos que nos llegan son bastante malos. ¿Podéis revisar las campañas?'] }, act: true },
          { dur: 7, min: 3, txt: 'Segunda semana: el retorno baja a 4,2×', feed: 'Retorno de 6,1× a 4,2×', cambio: { s: { roas: 4.2 } } },
          { dur: 0, min: 1, txt: 'Aviso a una persona: llama a Iker antes de que culpe a la campaña', feed: 'Aviso enviado al responsable de cuenta', humano: { titulo: 'Llama a Iker antes de que culpe a la campaña', texto: 'No atienden el 41 % de los contactos · los que sí atienden compran como en tus mejores cuentas · el retorno ha pasado de 6,1× a 4,2× por eso, no por la campaña. Llévale el dato y propón la capa de seguimiento.' } }
        ]
      }
    },
    historiaDefecto: 'cuenta',

    contactos: [
      // --- Cartera de clientes
      { id: 'g01', n: 'Laura Pons', rol: 'Gerente', emp: 'Clínica Dental Arenal', seg: 'cliente', ciudad: 'Valencia', prod: 'Campañas en Meta', orig: 'a1', canal: 'email', etapa: 1, etapaTxt: 'Cliente desde 2024', valor: 10800, creado: 500 * D, act: 5 * H, toque: 3 * D, fin: 'ganado',
        f: { inversion: 2400, ticketAlto: true }, s: { conectado: true, roas: 16.5, roasPrev: 15, sinAtender: 17, exp: true, expTxt: 'Abre una segunda clínica y quiere duplicar la inversión', expValor: 7200 },
        conv: [[5 * H, 'c', 'email', 'Abrimos la clínica de Ruzafa en noviembre. ¿Cómo lo hacemos con las campañas?']] },
      { id: 'g02', n: 'Iván Rueda', rol: 'Director', emp: 'Academia Nexo', seg: 'cliente', ciudad: 'Madrid', prod: 'Campañas en Meta', orig: 'a2', canal: 'email', etapa: 1, etapaTxt: 'Cliente desde 2025', valor: 12000, creado: 300 * D, act: 1 * D, toque: 6 * D, fin: 'ganado',
        f: { inversion: 3200 }, s: { conectado: true, roas: 4.8, roasPrev: 7.9, sinAtender: 42, queja: true, quejaTxt: 'dice que los contactos «son malos»', renovacion: 30 },
        conv: [[1 * D, 'c', 'email', 'Este mes los contactos son bastante malos. Tenemos que hablar de las campañas.']] },
      { id: 'g03', n: 'Pilar Montes', rol: 'Gerente', emp: 'Reformas Pladur Sur', seg: 'cliente', ciudad: 'Sevilla', prod: 'Campañas en Google', orig: 'a3', canal: 'email', etapa: 1, etapaTxt: 'Cliente desde 2024', valor: 9600, creado: 420 * D, act: 3 * D, toque: 7 * D, fin: 'ganado',
        f: { inversion: 1800, ticketAlto: true }, s: { conectado: true, roas: 20, roasPrev: 18, sinAtender: 9 }, conv: [] },
      { id: 'g04', n: 'Óscar Belda', rol: 'Director Comercial', emp: 'Inmobiliaria Costa Blanca', seg: 'cliente', ciudad: 'Alicante', prod: 'Campañas en Meta', orig: 'a4', canal: 'email', etapa: 1, etapaTxt: 'Cliente desde 2025', valor: 10800, creado: 200 * D, act: 6 * D, toque: 9 * D, fin: 'ganado',
        f: { inversion: 2000, ticketAlto: true }, s: { conectado: false, roas: 13, roasPrev: 13, sinAtender: 12 }, conv: [] },
      { id: 'g05', n: 'Marta Gil', rol: 'Fisioterapeuta y socia', emp: 'Fisioterapia Movimiento', seg: 'cliente', ciudad: 'Zaragoza', prod: 'Campañas en Google', orig: 'a5', canal: 'email', etapa: 1, etapaTxt: 'Cliente desde 2025', valor: 6000, creado: 150 * D, act: 2 * D, toque: 5 * D, fin: 'ganado',
        f: { inversion: 900 }, s: { conectado: true, roas: 10, roasPrev: 9.6, sinAtender: 8, renovacion: 20 }, conv: [] },
      { id: 'g06', n: 'Nuria Sala', rol: 'Directora', emp: 'Estética Lumen', seg: 'cliente', ciudad: 'Barcelona', prod: 'Campañas en Meta', orig: 'a6', canal: 'email', etapa: 1, etapaTxt: 'Cliente desde 2025', valor: 7200, creado: 180 * D, act: 4 * D, toque: 10 * D, fin: 'ganado',
        f: { inversion: 1500 }, s: { conectado: true, roas: 5.6, roasPrev: 6, sinAtender: 44 }, conv: [] },
      { id: 'g07', n: 'Jaime Ortiz', rol: 'Socio', emp: 'Asesoría Fiscal Norte', seg: 'cliente', ciudad: 'Bilbao', prod: 'Campañas en LinkedIn', orig: 'a7', canal: 'email', etapa: 1, etapaTxt: 'Cliente desde 2024', valor: 8400, creado: 380 * D, act: 2 * D, toque: 12 * D, fin: 'ganado',
        f: { inversion: 1200, ticketAlto: true }, s: { conectado: true, roas: 6, roasPrev: 11, sinAtender: 7 }, conv: [] },
      { id: 'g08', n: 'Ana Vives', rol: 'Gerente', emp: 'Centro Auditivo Oír Más', seg: 'cliente', ciudad: 'Murcia', prod: 'Campañas en Meta', orig: 'a8', canal: 'email', etapa: 1, etapaTxt: 'Cliente desde 2025', valor: 8400, creado: 160 * D, act: 1 * D, toque: 4 * D, fin: 'ganado',
        f: { inversion: 1600, ticketAlto: true }, s: { conectado: true, roas: 16.5, roasPrev: 12, sinAtender: 8, exp: true, expTxt: 'Pide campañas también en Google', expValor: 4800 }, conv: [] },
      { id: 'g09', n: 'Rafa Soto', rol: 'Propietario', emp: 'Talleres Soto', seg: 'cliente', ciudad: 'Burgos', prod: 'Campañas en Google', orig: '', canal: 'email', etapa: 1, etapaTxt: 'Cliente desde 2025', valor: 4200, creado: 250 * D, act: 20 * D, toque: 25 * D, fin: 'ganado',
        f: { inversion: 500 }, s: { conectado: false, renovacion: 15 }, conv: [] },
      // --- Prospectos de la agencia
      { id: 'g10', n: 'Carolina Ferrer', rol: 'Directora de Marketing', emp: 'Grupo Clínicas Aurea', seg: 'prospecto', ciudad: 'Madrid', prod: 'Gestión de campañas', orig: '', canal: 'email', etapa: 1, etapaTxt: 'Prospecto · reunión hecha', valor: 21600, creado: 6 * D, act: 40, toque: 1 * D,
        f: { inversion: 8000, ticketAlto: true }, s: { precio: true, urg: true, urgTxt: 'cambia de agencia en noviembre', ppto: 'si' },
        conv: [[6 * D, 'a', 'email', 'Hola Carolina, ¿qué os gustaría cambiar respecto a vuestra agencia actual?'], [5 * D, 'c', 'email', 'Que nos digan qué campaña trae pacientes, no formularios.'], [40, 'c', 'email', '¿Nos pasáis precio? Queremos cambiar en noviembre.']] },
      { id: 'g11', n: 'Tomás Rivas', rol: 'Gerente', emp: 'Concesionario Motor Sur', seg: 'prospecto', ciudad: 'Málaga', prod: 'Gestión de campañas', orig: '', canal: 'email', etapa: 1, etapaTxt: 'Prospecto · propuesta enviada', valor: 14400, creado: 20 * D, act: 5 * D, toque: 6 * D,
        f: { inversion: 4000, ticketAlto: true }, s: { prop: 6 * D, propVista: 2 }, conv: [[6 * D, 'h', 'email', 'Tomás, te dejo la propuesta con el plan de los tres primeros meses.']] },
      { id: 'g12', n: 'Elena Prats', rol: 'Directora', emp: 'Colegio Mayor Alameda', seg: 'prospecto', ciudad: 'Salamanca', prod: 'Gestión de campañas', orig: '', canal: 'email', etapa: 1, etapaTxt: 'Prospecto · reunión agendada', valor: 9600, creado: 4 * D, act: 1 * D, toque: 1 * D,
        f: { inversion: 1500 }, s: { cita: 2 * D, citaOk: true }, conv: [[1 * D, 'a', 'email', 'Confirmada la reunión del lunes a las 10:00.']] },
      { id: 'g13', n: 'Hugo Lara', rol: 'Responsable de Marketing', emp: 'Ópticas Brillo', seg: 'prospecto', ciudad: 'Valencia', prod: 'Gestión de campañas', orig: '', canal: 'wa', etapa: 1, etapaTxt: 'Prospecto nuevo', valor: 9600, creado: 22, act: 22, toque: null, f: { inversion: 2000 }, s: {}, conv: [] },
      { id: 'g14', n: 'Paco Muñoz', rol: 'Propietario', emp: 'Bar La Esquina', seg: 'prospecto', ciudad: 'Cuenca', prod: 'Redes sociales', orig: '', canal: 'wa', etapa: 1, etapaTxt: 'Prospecto', valor: 1800, creado: 3 * D, act: 2 * D, toque: 2 * D,
        f: { inversion: 150, soloRedes: true }, s: {}, conv: [[2 * D, 'c', 'wa', '¿Me lleváis el Instagram por 100 € al mes?']] }
    ]
  };
})();

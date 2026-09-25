/* Sector: SaaS / Software (producto con prueba gratis o versión free).
 * Producto genérico inventado: una plataforma de informes de marketing.
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const cae = function (c) { return c.s.usoPrev > 0 && c.s.uso != null && c.s.uso < c.s.usoPrev * 0.6; };
  const sube = function (c) { return c.s.usoPrev > 0 && c.s.uso > c.s.usoPrev * 1.4; };
  const pctCambio = function (c) { return Math.round(Math.abs(c.s.uso - c.s.usoPrev) / c.s.usoPrev * 100); };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.saas = {
    id: 'saas',
    nombre: 'SaaS / Software',
    t: {
      contacto: 'usuario', contactos: 'usuarios', Contactos: 'Usuarios', Contacto: 'Usuario / cuenta',
      venta: 'suscripción', ventas: 'suscripciones', Ventas: 'Suscripciones', producto: 'plan',
      paginaVisitas: 'la página de precios', txtPrecio: 'ha visitado la página de precios', cita: 'demo', Cita: 'Demo', laCita: 'la demo',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'el equipo de ventas', Comercial: 'Ventas',
      cs: 'Customer Success', CS: 'Customer Success',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'pasan a pago', objetivoPaso: 'que se active o pida una demo',
      casoExito: 'el caso de una agencia parecida', valorAlto: 4000, oportunidades: 'cuentas',
      laVenta: 'el pago', Producto: 'Plan', clientes: 'clientes', propuestas: 'propuestas', verbo: 'pasar a pago',
      clientesReales: 'clientes que pagan', empleados: 'empleados', pasoHumano: 'resolver lo que le falta para pasar al plan de pago',
      accionBloqueo: 'Ayuda de activación', agenteBloqueo: 'Agente de activación'
    },
    recorrido: [
      { id: 'anuncio', txt: 'Visita', sinFuga: true },
      { id: 'signup', txt: 'Registro' },
      { id: 'activacion', txt: 'Activación' },
      { id: 'valor', txt: 'Primer valor' },
      { id: 'pago', txt: 'Pago' },
      { id: 'adopcion', txt: 'Adopción', sinFuga: true },
      { id: 'expansion', txt: 'Expansión', sinFuga: true }
    ],
    ventaEtapa: 'pago',
    ticket: 1788,
    referencia: { activacion: 0.6, valor: 0.7, pago: 0.22 },
    nombresFuga: {
      activacion: { txt: 'Activación', exp: 'usuarios que se registran y no llegan a conectar su primera fuente' },
      valor: { txt: 'Primer valor', exp: 'usuarios activados que no llegan a sacar su primer informe' },
      pago: { txt: 'Paso a pago', exp: 'usuarios que ya ven valor y nadie les acompaña a pagar' }
    },
    remedioFuga: {
      activacion: 'Agente de activación: detecta en qué paso se atasca cada usuario y le escribe con la solución exacta en ese momento, y avisa a una persona si es una cuenta grande.'
    },
    mesDatos: { respuestaAntes: 1140, respuestaAhora: 3, mrr: 184300, retencion: 0.94, freePago: 0.031 },
    campanas: [
      { id: 'c1', canal: 'Google', nombre: 'Búsqueda · informes automáticos', inversion: 6200, ticket: 1788,
        embudo: { anuncio: 5400, signup: 610, activacion: 305, valor: 190, pago: 44, adopcion: 38, expansion: 6 } },
      { id: 'c2', canal: 'LinkedIn', nombre: 'Directores de marketing de agencias', inversion: 4800, ticket: 4188,
        embudo: { anuncio: 2100, signup: 180, activacion: 110, valor: 80, pago: 26, adopcion: 23, expansion: 5 } },
      { id: 'c3', canal: 'Meta', nombre: 'Plantillas gratis', inversion: 3100, ticket: 1188,
        embudo: { anuncio: 9800, signup: 820, activacion: 250, valor: 120, pago: 18, adopcion: 14, expansion: 1 } },
      { id: 'c4', canal: 'Web', nombre: 'Orgánico y blog', inversion: 0, ticket: 1788,
        embudo: { anuncio: 7600, signup: 940, activacion: 470, valor: 300, pago: 62, adopcion: 55, expansion: 9 } },
      { id: 'c5', canal: 'Partners', nombre: 'Directorios de software', inversion: 1500, ticket: 2388,
        embudo: { anuncio: 900, signup: 120, activacion: 78, valor: 60, pago: 21, adopcion: 19, expansion: 4 } }
    ],
    kpis: ['signups', 'activacion', 'trialPago', 'freePago', 'pqls', 'expansion', 'mrr', 'churn', 'retencion', 'cac'],
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      const pqls = cs.filter(function (c) { return !c.fin && c.x && c.x.int >= 65 && c.x.fit >= 55; });
      const exp = cs.filter(function (c) { return c.s.exp; });
      const riesgo = cs.filter(function (c) { return c.fin === 'ganado' && c.x && c.x.riesgo >= 55; });
      const pagoPago = cfg.campanas.filter(function (c) { return c.inversion > 0; }).reduce(function (a, c) { return a + c.embudo.pago; }, 0);
      const md = cfg.mesDatos;
      return {
        signups: { l: 'Registros', v: M.num(m.tot.signup), em: M.euros(m.inversion) + ' invertidos' },
        activacion: { l: 'Tasa de activación', v: M.pct(m.tot.activacion / m.tot.signup), em: 'Referencia: 60 %', clase: 'mal' },
        trialPago: { l: 'Prueba → pago', v: M.pct(m.tot.pago / m.tot.signup), em: m.tot.pago + ' nuevas suscripciones' },
        freePago: { l: 'Free → pago', v: M.pct(md.freePago), em: 'Usuarios del plan gratis' },
        pqls: { l: 'Listos para comprar (PQL)', v: pqls.length, em: 'Hoy, por uso e intención', clase: 'bien' },
        expansion: { l: 'Oportunidades de expansión', v: exp.length, em: M.euros(exp.reduce(function (a, c) { return a + (c.s.expValor || 0); }, 0)) + ' al año', clase: 'bien' },
        mrr: { l: 'MRR', v: M.euros(md.mrr), em: 'Ingreso recurrente mensual', clase: 'bien' },
        churn: { l: 'Riesgo de baja', v: M.pl(riesgo.length, 'cuenta', 'cuentas'), em: M.euros(riesgo.reduce(function (a, c) { return a + c.valor; }, 0) / 12) + ' de MRR en juego', clase: 'mal' },
        retencion: { l: 'Retención a 12 meses', v: M.pct(md.retencion), em: 'Cuentas que siguen pagando' },
        cac: { l: 'Coste por cliente (CAC)', v: M.euros(m.inversion / Math.max(1, pagoPago)), em: pagoPago + ' clientes de pago' }
      };
    },
    kpiEtapas: { interesados: 'signup', cualificados: 'activacion', entrevistas: 'valor' },
    clienteSinIntencion: true,

    reglas: {
      fitBase: 18,
      soloPropiasRiesgo: true,
      fit: [
        [function (c) { return c.tam >= 15 && c.tam <= 250; }, 26, function (c) { return c.tam + ' empleados, el tamaño que mejor encaja'; }, 'Empresa de 15 a 250 empleados'],
        [function (c) { return c.tam > 250; }, 16, function (c) { return 'empresa grande (' + c.tam + ' empleados)'; }, 'Empresa de más de 250 empleados'],
        [function (c) { return c.tam > 0 && c.tam < 5; }, -10, 'empresa muy pequeña', 'Menos de 5 empleados'],
        [function (c) { return /market|datos|data|director|head|ceo|fundador|cmo|growth/i.test(c.rol || ''); }, 16, function (c) { return 'decide la compra (' + c.rol + ')'; }, 'Su puesto decide la compra'],
        [function (c) { return c.f && /agencia|ecommerce|saas/.test(c.f.tipo || ''); }, 16, function (c) { return c.f.tipo + ': el caso de uso ideal'; }, 'Agencia, e-commerce o SaaS'],
        [function (c) { return (c.s.fuentes || 0) >= 3; }, 8, function (c) { return 'conecta ' + c.s.fuentes + ' fuentes de datos'; }, 'Conecta 3 fuentes o más'],
        [function (c) { return c.f && c.f.gmail; }, -14, 'se registró con un correo personal', 'Correo personal, no de empresa'],
        [function (c) { return c.f && c.f.estudiante; }, -26, 'estudiante', 'Estudiante']
      ],
      comportamiento: [
        [function (c) { return sube(c); }, 20, function (c) { return 'uso +' + pctCambio(c) + ' % esta semana'; }],
        [function (c) { return (c.s.invitados || 0) >= 2; }, 12, function (c) { return 'ha invitado a ' + c.s.invitados + ' compañeros'; }],
        [function (c) { return (c.s.fuentes || 0) >= 2; }, 10, function (c) { return 'ha conectado ' + c.s.fuentes + ' fuentes'; }],
        [function (c) { return (c.s.uso || 0) >= 10; }, 10, function (c) { return c.s.uso + ' sesiones esta semana'; }]
      ],
      intencion: [
        [function (c) { return c.s.limite; }, 22, 'ha llegado al límite de su plan'],
        [function (c) { return (c.s.precio || 0) >= 2; }, 8, function (c) { return 'precios visitados ' + c.s.precio + ' veces'; }],
        [function (c) { return c.s.vuelve; }, 12, function (c) { return 'ha vuelto tras ' + c.s.vuelve + ' días sin entrar'; }]
      ],
      riesgo: [
        [function (c) { return c.fin === 'ganado' && cae(c); }, 44, function (c) { return 'uso −' + pctCambio(c) + ' % en dos semanas'; }],
        [function (c) { return (c.s.sinEntrar || 0) >= 7; }, 18, function (c) { return c.s.sinEntrar + ' días sin entrar'; }],
        [function (c) { return (c.s.tickets || 0) >= 2; }, 14, function (c) { return c.s.tickets + ' incidencias abiertas'; }],
        [function (c) { return c.s.finPrueba != null && c.s.finPrueba <= 3 && !c.fin; }, 18, function (c) { return 'le quedan ' + c.s.finPrueba + ' días de prueba'; }],
        [function (c) { return c.s.bloqueo; }, 22, function (c) { return c.s.bloqueoTxt.toLowerCase(); }],
        [function (c) { return c.s.renovacion != null && c.s.renovacion <= 30 && c.fin === 'ganado'; }, 12, function (c) { return 'renueva en ' + c.s.renovacion + ' días'; }],
        [function (c, k) { return !c.fin && !c.s.uso && k.creado > 3 * D; }, 26, 'no ha vuelto a entrar desde que se registró'],
        [function (c) { return !!c.s.luego; }, 10, 'decisión aplazada']
      ]
    },
    nba: function (c, k, x, T) {
      if (c.asignado || c.fin) return null;
      if (x.int >= 78 && x.fit >= 62) return null; // aviso a ventas (genérico)
      if (c.s.bloqueo) return null;
      if (k.creado < 120 && !(c.s.fuentes > 0)) {
        return { id: 'wa', accion: 'Guía del primer paso', quien: 'Agente de activación', tipo: 'agente', estado: 'trabajando', por: 'Se registró ' + (k.creado < 60 ? 'hace ' + Math.round(k.creado) + ' min' : 'hace un rato') + ' y aún no ha conectado ninguna fuente. El agente le escribe con el paso exacto para su caso: los que conectan la primera fuente en la primera hora se activan tres veces más.' };
      }
      if (c.seg === 'free' && x.int >= 45 && x.fit >= 50) {
        return { id: 'upgrade', accion: 'Mensaje con el plan Pro', quien: 'Automatización', tipo: 'auto', estado: 'esperando', por: 'Usa el plan gratis con intensidad (' + (x.intM.filter(function (m) { return m.pts > 0; })[0] || { txt: 'buen uso' }).txt + '). Un mensaje dentro del producto, en el momento en que choca con el límite, convierte más que un correo.' };
      }
      if (c.s.vuelve) {
        return { id: 'wa', accion: 'Correo del agente: bienvenida de vuelta', quien: 'Agente de activación', tipo: 'agente', estado: 'trabajando', por: 'Ha vuelto tras ' + c.s.vuelve + ' días sin entrar. Es el mejor momento para enseñarle lo que ha cambiado y el informe que más usan empresas como la suya.' };
      }
      if (c.s.uso > 0 && k.act < 7 * D && x.riesgo < 20) {
        return { id: 'esperar', accion: 'Seguir observando', quien: 'Sistema', tipo: 'nada', estado: 'vigilando', por: 'Usa el producto con normalidad (' + c.s.uso + ' sesiones esta semana). No hay que interrumpirle: el sistema avisa si choca con un límite, se atasca o baja el uso.' };
      }
      if (!c.s.uso && k.creado > 3 * D && !(c.s.intentos >= 3)) {
        return { id: 'voz', accion: 'Correo del agente con su caso', quien: 'Agente de activación', tipo: 'agente', estado: 'trabajando', por: 'Se registró y no ha vuelto. Le escribe con un ejemplo de informe hecho para ' + (c.f && c.f.tipo ? 'una ' + c.f.tipo : 'alguien como él') + ', que es lo que suele traerles de vuelta.' };
      }
      return null;
    },

    preguntas: [
      { q: '¿Qué usuarios Free muestran intención de compra?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return c.seg === 'free' && !c.fin && c.x.int >= 40; }, orden: 'prob',
        intro: function (l, T, M) { return l.length === 1 ? 'Un usuario del plan gratis da señales claras de compra: ha llegado al límite, vuelve a precios y su uso sube. Es el PQL de esta semana.' : l.length + ' usuarios del plan gratis dan señales de compra: han llegado al límite, vuelven a precios o su uso sube. Son los PQL de esta semana.'; },
        vista: 'cards', max: 3 },
      { q: '¿Qué trials tienen mayor probabilidad de convertir?', h: 'lista', obj: ['conversion', 'todo'],
        filtro: function (c) { return c.seg === 'trial' && !c.fin; }, orden: 'prob',
        intro: function (l) { return 'Hay ' + l.length + ' cuentas en prueba. Estas son las que más probabilidad tienen de pasar a pago, con lo que haría el sistema con cada una.'; },
        cols: ['nombre', 'prob', ['Prueba', function (c) { return c.s.finPrueba != null ? c.s.finPrueba + ' días' : '—'; }], 'accion'], vista: 'tabla' },
      { q: '¿Qué clientes tienen riesgo de churn?', h: 'lista', obj: ['retencion', 'todo'],
        filtro: function (c) { return c.fin === 'ganado' && c.x.riesgo >= 40; }, orden: 'riesgo',
        intro: function (l, T, M) { return l.length + ' clientes muestran señales de baja. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0) / 12) + ' de MRR. Customer Success recibe cada uno con el motivo.'; },
        cols: ['nombre', 'riesgo', ['Motivo', function (c) { return (c.x.riesgoM[0] || {}).txt || ''; }], 'accion'], vista: 'tabla' },
      { q: '¿Dónde hay oportunidades de expansión?', h: 'lista', obj: ['expansion', 'todo'],
        filtro: function (c) { return !!c.s.exp; }, orden: 'valor',
        intro: function (l, T, M) { return l.length + ' clientes piden más de lo que tienen contratado. Suman ' + M.euros(l.reduce(function (a, c) { return a + (c.s.expValor || 0); }, 0)) + ' al año de ampliación.'; },
        cols: ['nombre', ['Qué pide', function (c) { return c.s.expTxt; }], ['Ampliación', function (c) { return QV.motor.euros(c.s.expValor || 0); }]], vista: 'tabla' },
      { q: '¿Qué usuarios están bloqueados antes de activarse?', h: 'lista', obj: ['conversion', 'captacion', 'todo'],
        filtro: function (c) { return !c.fin && (c.s.bloqueo || (!c.s.fuentes && c.x.k.creado > 1440)); }, orden: 'prio',
        intro: function (l) { return l.length + ' usuarios se han quedado antes de activarse. El agente de activación detecta en qué paso se atascan y les escribe con la solución, no con un recordatorio genérico.'; },
        cols: ['nombre', ['Dónde se atasca', function (c) { return c.s.bloqueoTxt || 'no ha conectado ninguna fuente'; }], 'accion'], vista: 'tabla' }
    ],

    historias: {
      trial: {
        titulo: 'Una agencia en prueba se atasca, se desbloquea y quiere comprar',
        contacto: { id: 'demo', n: 'Sofía Navarro', rol: 'Head of Marketing', emp: 'Agencia Brava Digital', seg: 'trial', ciudad: '—', prod: 'Prueba del plan Business', orig: 'c2', canal: 'email', etapa: 1, valor: 4188, creado: 0, act: 0, f: {}, s: { finPrueba: 14 }, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Sofía se registra en la prueba desde LinkedIn', feed: 'Registro nuevo · prueba del plan Business', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: agencia de 45 personas', feed: 'Ficha completada · agencia · 45 empleados', cambio: { tam: 45, ciudad: 'Madrid', f: { tipo: 'agencia' } } },
          { dur: 6, min: 6, txt: 'Conecta dos fuentes y se atasca en la tercera', feed: 'Bloqueo detectado · error al conectar Google Ads', cambio: { etapa: 2, s: { fuentes: 2, uso: 4, bloqueo: true, bloqueoTxt: 'Se ha atascado conectando Google Ads (permiso de cuenta de administrador)' } }, act: true },
          { dur: 7, min: 1, txt: 'El agente de activación le escribe con la solución exacta', feed: 'Ayuda de activación enviada', cambio: { conv: ['a', 'email', 'Hola Sofía, he visto que Google Ads te ha dado un error de permisos. Pasa cuando la cuenta la administra otra persona: con este enlace se lo pides en un clic y la conexión se completa sola.'] }, toque: true },
          { dur: 7, min: 9, txt: 'Se desbloquea y saca su primer informe', feed: 'Primer valor · primer informe creado', cambio: { etapa: 3, s: { bloqueo: false, fuentes: 3, uso: 9, usoPrev: 4 } }, act: true },
          { dur: 7, min: 14, txt: 'Invita a su equipo y visita precios dos veces', feed: 'Invita a 3 compañeros · visita precios 2 veces', cambio: { s: { invitados: 3, precio: 2, uso: 14 } }, act: true },
          { dur: 7, min: 3, txt: 'Llega al límite de clientes del plan y pregunta', feed: 'Límite del plan alcanzado · pregunta por el chat', cambio: { s: { limite: true, urg: true, urgTxt: 'quiere tener los informes de sus 18 clientes antes de fin de mes' }, conv: ['c', 'email', 'Tenemos 18 clientes y el plan se me queda corto. ¿El Business incluye marca blanca? Nos gustaría tenerlo antes de fin de mes.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente responde y agenda una demo con Ventas', feed: 'Demo agendada · mañana 11:00', cambio: { s: { cita: 1400, citaOk: true }, conv: ['a', 'email', 'Sí, el Business incluye marca blanca y clientes ilimitados. Te dejo 20 minutos mañana a las 11:00 con Pablo, que lleva cuentas de agencias, y lo dejáis configurado.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Sofía está lista para comprar', feed: 'Aviso enviado a Ventas', humano: { titulo: 'Sofía está lista para hablar', texto: 'Agencia de 45 personas · 18 clientes · 3 fuentes conectadas · 3 compañeros invitados · ha llegado al límite y pide marca blanca antes de fin de mes. Demo mañana a las 11:00.' } }
        ]
      }
    },
    historiaDefecto: 'trial',

    contactos: [
      // --- Listos para comprar (PQL)
      { id: 's01', n: 'Lorena Gálvez', rol: 'Directora de Marketing', emp: 'Estudio Norte Creativo', seg: 'trial', tam: 38, ciudad: 'Bilbao', prod: 'Prueba del plan Business', orig: 'c2', canal: 'email', etapa: 3, valor: 4188, creado: 9 * D, act: 23, toque: 26 * H,
        f: { tipo: 'agencia' }, s: { fuentes: 4, invitados: 3, uso: 17, usoPrev: 7, precio: 2, limite: true, finPrueba: 5, urg: true, urgTxt: 'la prueba acaba en 5 días y pregunta por el pago anual' },
        conv: [[8 * D, 'a', 'email', 'Hola Laura, te dejo la plantilla de informe para agencias que usan otras como la vuestra.'], [26 * H, 'c', 'email', 'Gracias, nos está funcionando. ¿El plan Business se puede pagar anual?']],
        ev: [[23, 'web', 'Visita la página de precios (segunda vez esta semana)']] },
      { id: 's02', n: 'Marcos Villa', rol: 'CEO', emp: 'Tienda Nativa', seg: 'free', tam: 22, ciudad: 'Valencia', prod: 'Plan gratis', orig: 'c4', canal: 'email', etapa: 3, valor: 1788, creado: 40 * D, act: 2 * H, toque: 12 * D,
        f: { tipo: 'ecommerce' }, s: { fuentes: 3, uso: 12, usoPrev: 5, precio: 3, limite: true },
        ev: [[2 * H, 'sistema', 'Choca con el límite de fuentes del plan gratis']], conv: [] },
      { id: 's03', n: 'Irene Campos', rol: 'Growth Lead', emp: 'Rutas App', seg: 'trial', tam: 60, ciudad: 'Madrid', prod: 'Prueba del plan Pro', orig: 'c1', canal: 'email', etapa: 3, valor: 2388, creado: 11 * D, act: 50, toque: 3 * D,
        f: { tipo: 'saas' }, s: { fuentes: 3, invitados: 2, uso: 11, usoPrev: 9, precio: 2, finPrueba: 2, urg: true, urgTxt: 'quiere pasar a pago la semana que viene' },
        conv: [[3 * D, 'a', 'email', 'Hola Irene, ¿te ayudo a dejar los informes semanales programados antes de que acabe la prueba?'], [50, 'c', 'email', 'Sí, porfa. Y dime qué pasa con los datos si pasamos a pago la semana que viene.']] },
      // --- Bloqueados antes de activarse
      { id: 's04', n: 'Carlos Martín', rol: 'Analista de datos', emp: 'Grupo Ópticas Vista', seg: 'trial', tam: 140, ciudad: 'Sevilla', prod: 'Prueba del plan Pro', orig: 'c1', canal: 'email', etapa: 1, valor: 2388, creado: 2 * D, act: 3 * H, toque: 2 * D,
        f: { tipo: 'ecommerce' }, s: { fuentes: 0, uso: 3, bloqueo: true, bloqueoTxt: 'Se ha atascado conectando Google Analytics (dos propiedades distintas)', finPrueba: 12 }, conv: [] },
      { id: 's05', n: 'Nuria Pons', rol: 'Responsable de Marketing', emp: 'Clínicas Sonrisa Mar', seg: 'trial', tam: 85, ciudad: 'Tarragona', prod: 'Prueba del plan Pro', orig: 'c2', canal: 'email', etapa: 2, valor: 2388, creado: 4 * D, act: 20 * H, toque: 4 * D,
        f: {}, s: { fuentes: 1, uso: 2, bloqueo: true, bloqueoTxt: 'No encuentra cómo crear el primer informe', finPrueba: 10 }, conv: [] },
      { id: 's06', n: 'Tomás Rey', rol: 'Fundador', emp: 'Rey Consultores', seg: 'trial', tam: 8, ciudad: 'Zaragoza', prod: 'Prueba del plan Pro', orig: 'c3', canal: 'email', etapa: 1, valor: 1188, creado: 6 * D, act: 6 * D, toque: 5 * D, f: {}, s: { intentos: 2 },
        conv: [[5 * D, 'a', 'email', 'Hola Tomás, ¿te ayudo a conectar tu primera fuente? Tarda dos minutos.']] },
      // --- Nuevos registros
      { id: 's07', n: 'Andrea Solís', rol: 'Head of Performance', emp: 'Agencia Faro 360', seg: 'trial', tam: 52, ciudad: 'Barcelona', prod: 'Prueba del plan Business', orig: 'c2', canal: 'email', etapa: 1, valor: 4188, creado: 18, act: 12, toque: null, f: { tipo: 'agencia' }, s: { finPrueba: 14 }, conv: [] },
      { id: 's08', n: 'Javier Lema', rol: 'Estudiante de máster', emp: '', seg: 'free', tam: 0, ciudad: 'A Coruña', prod: 'Plan gratis', orig: 'c3', canal: 'email', etapa: 1, valor: 0, creado: 50, act: 50, toque: null, f: { estudiante: true, gmail: true }, s: {}, conv: [] },
      { id: 's09', n: 'Patricia Gil', rol: 'Directora de Marketing', emp: 'Cadena Hotelera Alba', seg: 'trial', tam: 420, ciudad: 'Palma', prod: 'Prueba del plan Business', orig: 'c1', canal: 'email', etapa: 2, valor: 5988, creado: 5 * H, act: 40, toque: 5 * H, f: {}, s: { fuentes: 1, uso: 3, finPrueba: 14 }, conv: [] },
      // --- Free con uso
      { id: 's10', n: 'Rubén Ortega', rol: 'Freelance de marketing', emp: '', seg: 'free', tam: 1, ciudad: 'Málaga', prod: 'Plan gratis', orig: 'c3', canal: 'email', etapa: 3, valor: 588, creado: 70 * D, act: 1 * D, toque: 30 * D, f: { gmail: true }, s: { fuentes: 2, uso: 6, usoPrev: 6, precio: 1 }, conv: [] },
      { id: 's11', n: 'Elena Duarte', rol: 'Marketing Manager', emp: 'Muebles Duarte Online', seg: 'free', tam: 30, ciudad: 'Murcia', prod: 'Plan gratis', orig: 'c4', canal: 'email', etapa: 3, valor: 1788, creado: 25 * D, act: 5 * H, toque: 20 * D, f: { tipo: 'ecommerce' }, s: { fuentes: 2, uso: 9, usoPrev: 5, precio: 1 }, conv: [] },
      { id: 's12', n: 'Hugo Benítez', rol: 'Director de Marketing', emp: 'Seguros Cierzo', seg: 'free', tam: 180, ciudad: 'Zaragoza', prod: 'Plan gratis', orig: 'c4', canal: 'email', etapa: 2, valor: 4188, creado: 60 * D, act: 2 * D, toque: 45 * D, f: {}, s: { fuentes: 1, uso: 3, usoPrev: 0, vuelve: 38, precio: 1 },
        ev: [[2 * D, 'web', 'Vuelve al producto después de 38 días']], conv: [] },
      // --- Trials que se enfrían
      { id: 's13', n: 'Silvia Robles', rol: 'Responsable de Datos', emp: 'Laboratorios Ébano', seg: 'trial', tam: 230, ciudad: 'Madrid', prod: 'Prueba del plan Business', orig: 'c1', canal: 'email', etapa: 3, valor: 4188, creado: 12 * D, act: 5 * D, toque: 6 * D, f: {}, s: { fuentes: 3, uso: 2, usoPrev: 8, finPrueba: 2, precio: 1 },
        conv: [[7 * D, 'c', 'email', '¿Se puede exportar a nuestro almacén de datos?'], [6 * D, 'a', 'email', 'Sí, con el conector de BigQuery. Te dejo la guía.']] },
      { id: 's14', n: 'Óscar Iglesias', rol: 'Marketing Manager', emp: 'Deportes Cumbre', seg: 'trial', tam: 45, ciudad: 'Granada', prod: 'Prueba del plan Pro', orig: 'c3', canal: 'email', etapa: 2, valor: 2388, creado: 8 * D, act: 6 * D, toque: 6 * D, f: { tipo: 'ecommerce' }, s: { fuentes: 1, uso: 0, usoPrev: 3, finPrueba: 6, sinEntrar: 6 }, conv: [] },
      { id: 's15', n: 'Beatriz Llorente', rol: 'CMO', emp: 'Fintech Arco', seg: 'trial', tam: 95, ciudad: 'Madrid', prod: 'Prueba del plan Business', orig: 'c5', canal: 'email', etapa: 3, valor: 5988, creado: 10 * D, act: 3 * D, toque: 3 * D, f: { tipo: 'saas' }, s: { fuentes: 4, invitados: 1, uso: 6, usoPrev: 7, finPrueba: 4, luego: 'enero', luegoTxt: 'lo contratarían con el presupuesto de enero' },
        conv: [[3 * D, 'c', 'email', 'Nos encaja, pero el presupuesto de herramientas se aprueba en enero. Lo retomamos entonces.']] },
      // --- Clientes: riesgo de baja
      { id: 's16', n: 'Raúl Pastor', rol: 'Director de Operaciones', emp: 'Acme Logística', seg: 'cliente', tam: 310, ciudad: 'Valencia', prod: 'Plan Business', orig: 'c1', canal: 'email', etapa: 5, valor: 7188, creado: 400 * D, act: 9 * D, toque: 40 * D, fin: 'ganado', f: {}, s: { uso: 5, usoPrev: 22, sinEntrar: 9, tickets: 2, renovacion: 24 },
        conv: [[12 * D, 'c', 'email', 'Seguimos con el error en el conector de facturación. ¿Hay novedades?']] },
      { id: 's17', n: 'Marina Esteve', rol: 'Head of Marketing', emp: 'Agencia Pulso', seg: 'cliente', tam: 28, ciudad: 'Alicante', prod: 'Plan Pro', orig: 'c2', canal: 'email', etapa: 5, valor: 2388, creado: 220 * D, act: 6 * D, toque: 30 * D, fin: 'ganado', f: { tipo: 'agencia' }, s: { uso: 3, usoPrev: 11, sinEntrar: 6, renovacion: 40 }, conv: [] },
      { id: 's18', n: 'Gonzalo Prieto', rol: 'Responsable de BI', emp: 'Retail Sur', seg: 'cliente', tam: 160, ciudad: 'Córdoba', prod: 'Plan Business', orig: 'c4', canal: 'email', etapa: 5, valor: 4188, creado: 300 * D, act: 2 * D, toque: 20 * D, fin: 'ganado', f: {}, s: { uso: 9, usoPrev: 12, tickets: 3 }, conv: [] },
      // --- Clientes: expansión
      { id: 's19', n: 'Cristina Ferrán', rol: 'Directora General', emp: 'Agencia Mosaico', seg: 'cliente', tam: 70, ciudad: 'Barcelona', prod: 'Plan Pro', orig: 'c2', canal: 'email', etapa: 6, valor: 2388, creado: 180 * D, act: 5 * H, toque: 10 * D, fin: 'ganado', f: { tipo: 'agencia' }, s: { uso: 24, usoPrev: 15, limite: true, exp: true, expTxt: 'Ha llegado al límite de 10 clientes y pide 15 cuentas más', expValor: 3600 },
        conv: [[5 * H, 'c', 'email', 'Hemos cerrado 5 clientes nuevos. ¿Cómo ampliamos el plan sin perder lo que tenemos?']] },
      { id: 's20', n: 'Diego Aranda', rol: 'Growth Manager', emp: 'Marketplace Brote', seg: 'cliente', tam: 120, ciudad: 'Madrid', prod: 'Plan Business', orig: 'c1', canal: 'email', etapa: 6, valor: 4188, creado: 260 * D, act: 1 * D, toque: 14 * D, fin: 'ganado', f: { tipo: 'ecommerce' }, s: { uso: 30, usoPrev: 21, invitados: 6, exp: true, expTxt: 'Ha invitado a 6 personas de otros equipos: tienen 3 licencias', expValor: 2400 }, conv: [] },
      { id: 's21', n: 'Ana Morales', rol: 'Marketing Lead', emp: 'Viajes Horizonte', seg: 'cliente', tam: 55, ciudad: 'Las Palmas', prod: 'Plan Pro', orig: 'c5', canal: 'email', etapa: 6, valor: 2388, creado: 150 * D, act: 3 * D, toque: 60 * D, fin: 'ganado', f: {}, s: { uso: 14, usoPrev: 12, exp: true, expTxt: 'Consulta la página del conector de CRM, que solo va en Business', expValor: 1800 }, conv: [] },
      // --- Clientes sanos
      { id: 's22', n: 'Pablo Ramírez', rol: 'Director de Marketing', emp: 'Seguros Levante', seg: 'cliente', tam: 240, ciudad: 'Valencia', prod: 'Plan Business', orig: 'c1', canal: 'email', etapa: 5, valor: 4188, creado: 500 * D, act: 5 * H, toque: 30 * D, fin: 'ganado', f: {}, s: { uso: 18, usoPrev: 17 }, conv: [] },
      { id: 's23', n: 'Lucía Serra', rol: 'Head of Growth', emp: 'App Mercado', seg: 'cliente', tam: 40, ciudad: 'Barcelona', prod: 'Plan Pro', orig: 'c4', canal: 'email', etapa: 5, valor: 2388, creado: 90 * D, act: 1 * D, toque: 25 * D, fin: 'ganado', f: { tipo: 'saas' }, s: { uso: 11, usoPrev: 10 }, conv: [] },
      { id: 's24', n: 'Jaime Toledo', rol: 'Consultor', emp: 'Toledo Analytics', seg: 'cliente', tam: 3, ciudad: 'Toledo', prod: 'Plan Starter', orig: 'c4', canal: 'email', etapa: 5, valor: 588, creado: 120 * D, act: 4 * D, toque: 60 * D, fin: 'ganado', f: {}, s: { uso: 4, usoPrev: 5 }, conv: [] },
      // --- Resto: fríos, bajo encaje, perdidos
      { id: 's25', n: 'Sergio Nieto', rol: 'Estudiante', emp: '', seg: 'free', tam: 0, ciudad: 'Salamanca', prod: 'Plan gratis', orig: 'c3', canal: 'email', etapa: 1, valor: 0, creado: 20 * D, act: 20 * D, toque: 15 * D, f: { estudiante: true, gmail: true }, s: { intentos: 3 }, conv: [] },
      { id: 's26', n: 'Carla Méndez', rol: 'Community Manager', emp: 'Panadería La Espiga', seg: 'free', tam: 4, ciudad: 'León', prod: 'Plan gratis', orig: 'c3', canal: 'email', etapa: 2, valor: 588, creado: 30 * D, act: 25 * D, toque: 25 * D, f: { gmail: true }, s: { fuentes: 1, uso: 0, usoPrev: 1, sinEntrar: 25, intentos: 3 }, conv: [] },
      { id: 's27', n: 'Ignacio Varela', rol: 'Director de Marketing', emp: 'Bodegas Varela', seg: 'trial', tam: 35, ciudad: 'Logroño', prod: 'Prueba del plan Pro', orig: 'c1', canal: 'email', etapa: 2, valor: 2388, creado: 35 * D, act: 30 * D, toque: 20 * D, fin: 'perdido', f: {}, s: { fuentes: 1, intentos: 3 }, conv: [] },
      { id: 's28', n: 'Mónica Rubio', rol: 'Responsable de Ecommerce', emp: 'Moda Rubio', seg: 'free', tam: 18, ciudad: 'Valladolid', prod: 'Plan gratis', orig: 'c4', canal: 'email', etapa: 2, valor: 1788, creado: 9 * D, act: 9 * D, toque: 8 * D, f: { tipo: 'ecommerce' }, s: { fuentes: 1, intentos: 1 }, conv: [] },
      { id: 's29', n: 'Fernando Casas', rol: 'Analista de marketing', emp: 'Aseguradora Pilar', seg: 'trial', tam: 600, ciudad: 'Madrid', prod: 'Prueba del plan Business', orig: 'c5', canal: 'email', etapa: 3, valor: 7188, creado: 6 * D, act: 4 * H, toque: 2 * D, f: {}, s: { fuentes: 2, uso: 7, usoPrev: 3, invitados: 1, finPrueba: 8 },
        conv: [[2 * D, 'a', 'email', 'Hola Fernando, ¿quieres que te prepare el informe mensual para dirección con vuestras fuentes?']] },
      { id: 's30', n: 'Rocío Pardo', rol: 'Marketing Manager', emp: 'Gimnasios Impulso', seg: 'trial', tam: 75, ciudad: 'Sevilla', prod: 'Prueba del plan Pro', orig: 'c1', canal: 'email', etapa: 3, valor: 2388, creado: 7 * D, act: 1 * D, toque: 1 * D, f: {}, s: { fuentes: 3, uso: 8, usoPrev: 6, finPrueba: 7, cita: 26 * H, citaOk: false },
        conv: [[1 * D, 'a', 'email', 'Te dejo la demo con Pablo el jueves a las 10:00 para ver los informes por centro.']] }
    ]
  };
})();

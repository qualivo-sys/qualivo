/* Sector: Suscripción (cajas de fruta y verdura a domicilio).
 * Negocio D2C ficticio: cajas de fruta y verdura de agricultores locales
 * (producto «imperfecto» rescatado del desperdicio), semanales o quincenales,
 * ~9.000 suscriptores activos y ~5.000 cajas a la semana, más una línea de
 * fruta para oficinas (B2B).
 * Todos los nombres, empresas y casos son inventados. */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  const M = function () { return window.QV.motor; };
  const hogar = function (c) { return c.seg !== 'empresa'; };
  const suscr = function (c) { return c.fin === 'ganado' && hogar(c); };
  const hc = Q.hueco(10);

  const CAMPANAS = [
    // embudo: clics → alta empezada → primera caja → segunda caja → recurrente (4+ cajas) → fiel (3+ meses)
    // ticket: lo que factura al mes un suscriptor recurrente de esa campaña
    { id: 'c1', canal: 'Meta', nombre: 'Caja de prueba', inversion: 9000, ticket: 84,
      embudo: { anuncio: 26000, alta: 1350, primera: 960, segunda: 370, recurrente: 200, fiel: 120 } },
    { id: 'c2', canal: 'Meta', nombre: 'Antidesperdicio', inversion: 4000, ticket: 118,
      embudo: { anuncio: 9800, alta: 330, primera: 250, segunda: 196, recurrente: 146, fiel: 112 } },
    { id: 'c3', canal: 'Google', nombre: 'Fruta a domicilio', inversion: 3000, ticket: 108,
      embudo: { anuncio: 4600, alta: 290, primera: 205, segunda: 142, recurrente: 98, fiel: 74 } },
    { id: 'c4', canal: 'Recomendación', nombre: 'Código amigo', inversion: 0, ticket: 124,
      embudo: { anuncio: 1100, alta: 240, primera: 212, segunda: 184, recurrente: 156, fiel: 131 } },
    { id: 'c5', canal: 'LinkedIn', nombre: 'Empresas (anuncio y correo)', inversion: 800, ticket: 310, b2b: true,
      embudo: { anuncio: 1500, alta: 32, primera: 12, segunda: 10, recurrente: 9, fiel: 8 } }
  ];
  const camp = function (id) { return CAMPANAS.filter(function (x) { return x.id === id; })[0]; };
  const retiene = function (cp) { return cp.embudo.recurrente / Math.max(1, cp.embudo.primera); };
  const x1 = function (v) { return M().num(v, 1) + '×'; };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.suscripcion = {
    id: 'suscripcion',
    nombre: 'Suscripción',
    t: {
      contacto: 'suscriptor', contactos: 'suscriptores', Contactos: 'Suscriptores', Contacto: 'Suscriptor / empresa',
      venta: 'cliente recurrente', ventas: 'clientes recurrentes', Ventas: 'Recurrentes', producto: 'caja', Producto: 'Caja',
      paginaVisitas: 'la web', txtPrecio: 'ha mirado los precios', cita: 'llamada', Cita: 'Llamada', laCita: 'la llamada',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'atención al cliente', Comercial: 'Atención al cliente',
      cs: 'atención al cliente', CS: 'Atención al cliente',
      cliente: 'cliente', unCliente: 'un suscriptor', clientes: 'suscriptores', convierten: 'se quedan', objetivoPaso: 'resolver lo que necesita',
      casoExito: 'recetas y la opinión de un suscriptor parecido', valorAlto: 3000, oportunidades: 'suscriptores',
      laVenta: 'la cuarta caja', propuestas: 'propuestas', verbo: 'quedarse',
      clientesReales: 'clientes recurrentes', empleados: 'empleados', nuevos: 'nuevos',
      pasoHumano: 'resolver su caso y dejarle la caja como la quiere',
      accionBloqueo: 'Ayuda para terminar el alta', agenteBloqueo: 'Agente de altas',
      senales: { nueva: 'Solicitud nueva', bloqueo: 'Alta a medias', expansion: 'Ampliación', revision: 'Vuelta de la pausa', noshow: 'Llamada sin confirmar' },
      recorrido: { contacto: 'suscriptor', contactos: 'suscriptores', Contactos: 'Altas', venta: 'cliente recurrente', ventas: 'clientes recurrentes', Ventas: 'Recurrentes', convierten: 'se queda más allá de la primera caja' },
      anunciosIntro: 'Las campañas las sigue llevando vuestro equipo. El sistema une cada anuncio con lo que pasa después de la primera caja (quién repite, quién pausa, quién se da de baja) y se lo devuelve a las plataformas, para optimizar a suscriptores que se quedan y no a altas baratas.',
      notaTitulo: 'Nota de esta semana para el equipo de campañas', notaBoton: 'Redactar la nota para campañas',
      notaIntro: 'Esto es lo que cambiaría esta semana en las campañas. Sale de cruzar cada una con lo que pasa después de la primera caja.',
      preguntaNota: '¿Qué cambiaríamos esta semana en las campañas?', notaAsunto: 'Asunto: Campañas · qué cambiar esta semana', notaCorreo: 'Nota para el equipo de campañas'
    },
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'alta', txt: 'Alta empezada' },
      { id: 'primera', txt: 'Primera caja' },
      { id: 'segunda', txt: 'Segunda caja' },
      { id: 'recurrente', txt: 'Recurrente' },
      { id: 'fiel', txt: 'Fiel (3+ meses)', sinFuga: true }
    ],
    ventaEtapa: 'recurrente',
    ticket: 110,
    referencia: { primera: 0.88, segunda: 0.8, recurrente: 0.85 },
    nombresFuga: {
      primera: { txt: 'Alta sin terminar', exp: 'gente que empieza el alta y se queda a medias (día de reparto, código postal o el pago)' },
      segunda: { txt: 'Baja tras la primera caja', exp: 'suscriptores que prueban una caja y no repiten: nadie les pregunta qué tal llegó ni les ayuda a aprovecharla' },
      recurrente: { txt: 'Pausas que no vuelven', exp: 'suscriptores que pausan tras dos o tres cajas y no llegan a la cuarta: nadie les escribe para volver' }
    },
    remedioFuga: {
      segunda: 'Agente de retención: dos días después de la primera caja pregunta qué tal llegó, manda dos recetas con lo que traía y, si algo no encaja (tamaño, frecuencia o calidad), lo ajusta antes de que se dé de baja. Si hay una queja, avisa a atención al cliente con todo el contexto.',
      primera: 'Agente de altas: detecta en qué paso se queda cada alta (día de reparto, código postal, pago) y le escribe por WhatsApp con la solución exacta en ese momento.',
      recurrente: 'Agente de retención: a quien pausa sin fecha le escribe antes de que se olvide, con lo que trae la caja de esa semana y la opción de volver con la pequeña o cada 15 días.'
    },
    mesDatos: { activos: 9120, cajasSemana: 5040, ret3: 0.44, pausas: 640, pausasSinFecha: 230, senalesBaja: 312, respuestaAntes: 960, respuestaAhora: 2 },
    campanas: CAMPANAS,

    // Veredicto por campaña: no basta con el alta barata, cuenta quién repite
    veredictoAnuncio: function (f, Mo) {
      const c = f.c, e = c.embudo;
      const cpl = c.inversion ? c.inversion / Math.max(1, e.alta) : 0;
      if (c.b2b) return { id: 'despues', txt: 'No es el anuncio', tono: 't-amber', por: 'Pocas solicitudes, pero cada empresa que se queda factura ' + Mo.euros(c.ticket) + ' al mes. Lo que falla es el seguimiento de las solicitudes, no la campaña.' };
      if (!c.inversion) return { id: 'organico', txt: 'La que más retiene', tono: 't-teal', por: 'Sin inversión. El ' + Mo.pct(f.post) + ' de los que reciben la primera caja llega a la cuarta: nadie retiene mejor que quien viene recomendado por otro suscriptor.' };
      if (f.post < f.postTotal * 0.8) return { id: 'publico', txt: 'Revisar la oferta', tono: 't-coral', por: 'Las altas más baratas (' + Mo.euros(cpl) + '), pero solo el ' + Mo.pct(f.post) + ' de los que reciben la primera caja llega a la cuarta (media ' + Mo.pct(f.postTotal) + '). El descuento trae gente que prueba una caja y se va.' };
      if (f.post >= f.postTotal * 1.6) return { id: 'escalar', txt: 'Escalar', tono: 't-teal', por: 'Cada alta cuesta más (' + Mo.euros(cpl) + '), pero el ' + Mo.pct(f.post) + ' llega a la cuarta caja (media ' + Mo.pct(f.postTotal) + '). Aquí hay margen para subir presupuesto.' };
      return { id: 'mantener', txt: 'Mantener', tono: 't-lila', por: 'Alta a ' + Mo.euros(cpl) + ' y el ' + Mo.pct(f.post) + ' llega a la cuarta caja, por encima de la media (' + Mo.pct(f.postTotal) + '). Sin cambios.' };
    },
    notaAnuncios: function (a, T, Mo) {
      const lin = [];
      const pago = a.filas.filter(function (f) { return f.c.inversion > 0; });
      pago.filter(function (f) { return f.ver.id === 'publico'; }).forEach(function (f) {
        lin.push('Cambiaría la oferta de «' + f.c.nombre + '» (' + f.c.canal + '): trae las altas más baratas (' + Mo.euros(f.cpl) + '), pero solo el ' + Mo.pct(f.post) + ' llega a la cuarta caja y cada recurrente sale a ' + Mo.euros(f.cpv) + '. Probaría la primera caja sin descuento, con el mensaje antidesperdicio.');
      });
      pago.filter(function (f) { return f.ver.id === 'escalar'; }).forEach(function (f) {
        lin.push('Subiría presupuesto en «' + f.c.nombre + '» (' + f.c.canal + '): el alta cuesta ' + Mo.euros(f.cpl) + ', pero el ' + Mo.pct(f.post) + ' llega a la cuarta caja y cada recurrente sale a ' + Mo.euros(f.cpv) + '.');
      });
      a.filas.filter(function (f) { return f.ver.id === 'organico'; }).forEach(function (f) {
        lin.push('El código amigo es lo que mejor retiene (' + Mo.pct(f.post) + ' llega a la cuarta caja). Merece un empujón antes que más anuncios: por ejemplo, una caja gratis al tercer amigo.');
      });
      pago.filter(function (f) { return f.ver.id === 'despues'; }).forEach(function (f) {
        lin.push('No tocaría «' + f.c.nombre + '»: las empresas que piden información encajan y se pierden en el seguimiento. Eso lo arreglamos nosotros.');
      });
      lin.push('Desde esta semana os llegan a ' + Mo.unir(a.canales) + ' los eventos de ' + Mo.unir(a.eventos.map(function (e) { return e.etapa.toLowerCase(); })) + ', con su valor. Optimizad a la segunda caja, no al alta.');
      return lin;
    },

    kpis: ['activos', 'altas', 'primeraK', 'segundaK', 'recurrentes', 'churn', 'retencion', 'pausas', 'cpr', 'expansion'],
    kpiEtapas: { interesados: 'alta', cualificados: 'primera', entrevistas: 'segunda' },
    kpiCustom: function (m, cfg, Mo, est) {
      const cs = (est && est.contactos) || [];
      const md = cfg.mesDatos;
      const riesgo = cs.filter(function (c) { return suscr(c) && c.x && c.x.riesgo >= 45; });
      const exp = cs.filter(function (c) { return c.fin === 'ganado' && c.s.exp; });
      const pago = cfg.campanas.filter(function (c) { return c.inversion > 0; });
      const recPago = pago.reduce(function (a, c) { return a + c.embudo.recurrente; }, 0);
      return {
        activos: { l: 'Suscriptores activos', v: Mo.num(md.activos), em: Mo.num(md.cajasSemana) + ' cajas/semana', clase: 'bien' },
        altas: { l: 'Altas empezadas', v: Mo.num(m.tot.alta), em: Mo.euros(m.inversion) + ' invertidos' },
        primeraK: { l: 'Primeras cajas', v: Mo.num(m.tot.primera), em: Mo.pct(m.tot.primera / m.tot.alta) + ' de las altas' },
        segundaK: { l: 'Repiten 2.ª caja', v: Mo.pct(m.tot.segunda / m.tot.primera), em: 'Referencia: 80 %', clase: 'mal' },
        recurrentes: { l: 'Nuevos recurrentes', v: Mo.num(m.tot.recurrente), em: Mo.pct(m.tot.recurrente / m.tot.primera) + ' llega a 4 cajas' },
        churn: { l: 'Con señales de baja', v: Mo.num(md.senalesBaja), em: riesgo.length + ' urgentes hoy', clase: 'mal' },
        retencion: { l: 'Siguen a los 3 meses', v: Mo.pct(md.ret3), em: 'Tras la primera caja' },
        pausas: { l: 'Cajas en pausa', v: Mo.num(md.pausas), em: Mo.num(md.pausasSinFecha) + ' sin fecha de vuelta', clase: 'mal' },
        cpr: { l: 'Coste por recurrente', v: Mo.euros(m.inversion / Math.max(1, recPago)), em: 'Solo campañas de pago' },
        expansion: { l: 'Ampliaciones', v: exp.length, em: Mo.euros(exp.reduce(function (a, c) { return a + (c.s.expValor || 0); }, 0)) + ' al año', clase: 'bien' }
      };
    },
    clienteSinIntencion: true,
    vozAuto: false,
    historiaGenerica: false,
    agenda: { horas: [9, 18], pausa: [14, 15], ocupacion: 0.3, etapa: 'ninguna',
      tipos: ['Llamada · empresa', 'Llamada · cambio de caja', 'Llamada · incidencia de calidad', 'Llamada · empresa'] },
    timelineSinOrigen: true,
    textoAlta: function (c) {
      const cp = camp(c.orig);
      const desde = cp ? ' · desde ' + cp.canal + ' · ' + cp.nombre : '';
      return (hogar(c) ? 'Alta · ' : 'Solicitud de información · ') + c.prod + desde;
    },

    reglas: {
      fitBase: 20,
      fit: [
        [function (c) { return hogar(c) && c.f.zona === 'ok'; }, 22, function (c) { return 'vive en zona de reparto (' + c.ciudad + ')'; }, 'Vive en zona de reparto'],
        [function (c) { return hogar(c) && c.f.hogar >= 3; }, 16, function (c) { return 'hogar de ' + c.f.hogar + ' personas: aprovecha la caja'; }, 'Hogar de 3 o más personas'],
        [function (c) { return hogar(c) && c.f.frec === 'semanal'; }, 12, 'recibe la caja cada semana', 'Caja semanal'],
        [function (c) { return c.orig === 'c4'; }, 14, 'viene recomendado por otro suscriptor', 'Viene por recomendación (código amigo)'],
        [function (c) { return !hogar(c) && c.tam >= 50 && c.tam <= 500; }, 30, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 50 a 500 empleados'],
        [function (c) { return !hogar(c) && /personas|rrhh|people|office|oficina|operaciones|bienestar|servicios generales/i.test(c.rol || ''); }, 14, function (c) { return 'decide la compra (' + c.rol + ')'; }, 'Lleva personas u oficina: decide'],
        [function (c) { return c.f.zona === 'fuera'; }, -34, function (c) { return 'fuera de la zona de reparto (' + c.ciudad + ')'; }, 'Fuera de la zona de reparto'],
        [function (c) { return c.f.soloDescuento; }, -16, 'solo busca el descuento de la primera caja', 'Solo busca el descuento'],
        [function (c) { return !hogar(c) && c.tam > 0 && c.tam < 30; }, -14, 'empresa pequeña para el plan de oficina', 'Empresa de menos de 30 personas'],
        [function (c) { return c.f.antidesperdicio; }, 8, 'le mueve el antidesperdicio y el producto local', 'Le mueve el antidesperdicio']
      ],
      comportamiento: [
        [function (c) { return (c.s.cajas || 0) >= 12; }, 12, function (c) { return c.s.cajas + ' cajas recibidas'; }],
        [function (c) { return (c.s.amigos || 0) >= 1; }, 14, function (c) { return 'ha traído a ' + M().pl(c.s.amigos, 'amigo', 'amigos') + ' con su código'; }],
        [function (c) { return c.s.extras; }, 10, 'añade productos extra a la caja']
      ],
      intencion: [
        [function (c) { return c.s.personasDia; }, 8, function (c) { return c.s.personasDia + ' personas al día en la oficina'; }],
        [function (c) { return (c.s.oficinas || 0) >= 2; }, 10, function (c) { return 'quiere fruta en ' + c.s.oficinas + ' centros'; }]
      ],
      riesgo: [
        [function (c) { return suscr(c) && (c.s.cancelar || 0) >= 1; }, 30, function (c) { return c.s.cancelar > 1 ? 'ha visitado la página de cancelar ' + c.s.cancelar + ' veces' : 'ha visitado la página de cancelar'; }],
        [function (c) { return suscr(c) && (c.s.saltos || 0) >= 2; }, 24, function (c) { return 'ha saltado ' + c.s.saltos + ' envíos seguidos'; }],
        [function (c) { return suscr(c) && c.s.saltos === 1; }, 12, 'ha saltado el último envío'],
        [function (c) { return suscr(c) && c.s.queja; }, 28, function (c) { return c.s.quejaTxt || 'se ha quejado de la calidad'; }],
        [function (c) { return suscr(c) && c.s.fueraZona; }, 30, function (c) { return c.s.fueraZonaTxt || 'cambia de dirección fuera de la zona de reparto'; }],
        [function (c) { return suscr(c) && c.s.pausa; }, 18, function (c) { return 'lleva ' + (c.s.pausaDias >= 14 ? Math.round(c.s.pausaDias / 7) + ' semanas' : c.s.pausaDias + ' días') + ' con la caja en pausa'; }],
        [function (c) { return suscr(c) && c.s.pausa && !c.s.vuelta; }, 16, 'pausa sin fecha de vuelta'],
        [function (c) { return suscr(c) && c.s.bajaFrec; }, 14, 'ha bajado de semanal a quincenal'],
        [function (c) { return suscr(c) && (c.s.sinAbrir || 0) >= 3; }, 10, function (c) { return 'no abre los correos (' + c.s.sinAbrir + ' seguidos)'; }],
        [function (c, k) { return suscr(c) && (c.s.intentos || 0) >= 2 && !c.conv.some(function (m) { return m.de === 'c' && (k.ahora - m.t) / 60000 < 30 * D; }); }, 10, 'no contesta a los mensajes'],
        [function (c) { return suscr(c) && c.etapa === 2; }, 30, function (c) { return 'recibió la primera caja ' + (c.s.primeraHace === 1 ? 'ayer' : 'hace ' + c.s.primeraHace + ' días') + ' y aún no ha confirmado la segunda'; }],
        [function (c) { return suscr(c) && c.f.soloDescuento; }, 12, 'entró por el descuento de la primera caja'],
        [function (c) { return c.fin === 'ganado' && !hogar(c) && c.s.queja; }, 30, function (c) { return c.s.quejaTxt; }]
      ]
    },

    // Qué hace el sistema con cada uno. Los suscriptores los lleva el agente de
    // retención; a una persona solo van las quejas de calidad y las empresas.
    nba: function (c, k, x, T, Mo) {
      if (c.asignado || c.fin === 'perdido') return null;
      const MIN = Mo.MIN;
      const quienEmp = 'El equipo de empresas';
      if (!hogar(c)) {
        if (c.fin === 'ganado') {
          if (c.s.exp) return { id: 'expansion', accion: 'Pasar al equipo de empresas', quien: quienEmp, tipo: 'humano', estado: 'humano', por: c.s.expTxt + '. Es una empresa contenta: la ampliación la lleva una persona, con el historial de entregas delante.' };
          if (x.riesgo >= 45) return { id: 'retener', accion: 'Aviso al equipo de empresas', quien: quienEmp, tipo: 'humano', estado: 'humano', por: 'Hay señales de que se puede ir: ' + Mo.unir(x.riesgoM.slice(0, 2).map(function (m) { return m.txt; })) + '. Con una empresa, una llamada ahora vale más que diez correos después.' };
          return null;
        }
        const r = Mo.nbaGenerica(c, k, x, T);
        const cambia = function (s) { return String(s).split('a atención al cliente').join('al equipo de empresas').split('de atención al cliente').join('del equipo de empresas').split('atención al cliente').join('el equipo de empresas'); };
        if (r.quien === T.Comercial) return Object.assign({}, r, { accion: cambia(r.accion), quien: quienEmp, por: cambia(r.por) });
        if (r.quien === 'Agente de WhatsApp' && c.canal === 'email') return Object.assign({}, r, { quien: 'Agente de seguimiento' });
        return r;
      }
      if (!c.fin) return null; // altas a medias: ayuda para terminar el alta o cierre amable
      const um = Mo.ultimoMsg(c);
      const dias = function (n) { return n >= 14 ? Math.round(n / 7) + ' semanas' : n + ' días'; };
      if (c.s.queja) {
        return { id: 'calidad', accion: 'Revisar la queja de calidad', quien: T.CS, tipo: 'humano', estado: 'humano',
          por: 'Queja de calidad: ' + c.s.quejaTxt + '. La resuelve una persona: reponer la fruta en la próxima caja y revisar el lote con el almacén. El agente no promete compensaciones.' };
      }
      if (c.s.exp && x.riesgo < 45) {
        return { id: 'wa', accion: c.s.expAccion || 'Proponer la caja grande', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: c.s.expTxt + '. Se le propone en su momento, con lo que ya compra y sin tocar nada que no haya pedido.' };
      }
      if (um && um.de === 'c' && (k.ahora - um.t) / MIN < 1440) {
        return { id: 'wa-seguir', accion: 'Contestar por WhatsApp', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Escribió ' + Mo.hace((k.ahora - um.t) / MIN) + ' y está esperando respuesta. El agente contesta con su contexto (su caja, su día de reparto, lo que ha pedido antes) y solo pasa a una persona si hay una queja.' };
      }
      if (c.s.fueraZona) {
        return { id: 'wa', accion: 'Proponer otra dirección de entrega', quien: 'Agente de retención', tipo: 'agente', estado: 'trabajando',
          por: (c.s.fueraZonaTxt || 'Cambia de dirección fuera de la zona').replace(/^./, function (z) { return z.toUpperCase(); }) + '. Antes de darle de baja, el agente le propone recibir la caja en el trabajo o en un punto de recogida dentro de la zona.' };
      }
      if (c.s.pausa && !c.s.vuelta) {
        if ((c.s.intentos || 0) >= 2) return { id: 'voz', accion: 'Llamada del agente de voz', quien: 'Agente de voz', tipo: 'voz', estado: 'trabajando',
          por: 'Lleva ' + dias(c.s.pausaDias) + ' en pausa y no ha contestado a dos WhatsApp. Una llamada corta, en su franja, para saber si quiere volver, cambiar de caja o darse de baja sin dejarlo a medias.' };
        return { id: 'wa', accion: 'WhatsApp de vuelta de la pausa', quien: 'Agente de retención', tipo: 'agente', estado: 'trabajando',
          por: 'Lleva ' + dias(c.s.pausaDias) + ' en pausa sin fecha de vuelta: así se pierden las pausas. El agente le enseña qué trae la caja de esta semana y le propone volver con la pequeña o cada 15 días.' };
      }
      if (c.s.pausa && c.s.vuelta) {
        return { id: 'esperar', accion: 'Reactivar la caja ' + c.s.vuelta, quien: 'Agente de retención', tipo: 'agente', estado: 'vigilando',
          por: 'Pausa con fecha (' + (c.s.pausaTxt || 'vuelve ' + c.s.vuelta) + '). El sistema le escribe dos días antes con lo que trae la caja de esa semana; antes no se le molesta.' };
      }
      if (x.riesgo >= 45) {
        return { id: 'wa', accion: 'Preguntar qué ha pasado', quien: 'Agente de retención', tipo: 'agente', estado: 'trabajando',
          por: 'Señales de baja: ' + Mo.unir(x.riesgoM.slice(0, 2).map(function (m) { return m.txt; })) + '. El agente le escribe en su contexto, sin un descuento genérico: pregunta qué ha pasado y propone el ajuste que encaje (caja más pequeña, cada 15 días o una pausa con fecha).' };
      }
      if (c.etapa === 2) {
        return { id: 'wa', accion: 'Mensaje tras la primera caja', quien: 'Agente de retención', tipo: 'agente', estado: 'trabajando',
          por: 'Recibió la primera caja ' + (c.s.primeraHace === 1 ? 'ayer' : 'hace ' + c.s.primeraHace + ' días') + '. Entre la primera y la segunda es donde más suscriptores se van: el agente le pregunta qué tal llegó y le manda dos recetas con lo que traía.' };
      }
      return null;
    },

    preguntas: [
      { q: '¿Qué suscriptores tienen riesgo de baja esta semana?', h: 'lista', obj: ['retencion', 'todo'],
        filtro: function (c) { return suscr(c) && c.x.riesgo >= 45; }, orden: 'riesgo',
        intro: function (l, T, Mo) {
          const hum = l.filter(function (c) { return c.x.nba.tipo === 'humano'; }).length;
          return '**' + l.length + ' suscriptores** dan señales claras de baja esta semana (' + Mo.euros(l.reduce(function (a, c) { return a + c.valor; }, 0) / 12) + ' al mes en juego). El agente de retención escribe a ' + (l.length - hum) + ' en su contexto, sin descuentos genéricos' + (hum ? '; ' + (hum === 1 ? 'la queja de calidad va' : 'las ' + hum + ' quejas de calidad van') + ' a atención al cliente.' : '.');
        },
        cols: ['nombre', 'riesgo', ['Motivo', function (c) { return (c.x.riesgoM[0] || {}).txt || ''; }], 'accion'], vista: 'tabla' },
      { q: '¿Quién ha pausado y no ha vuelto?', h: 'lista', obj: ['retencion', 'todo'],
        filtro: function (c) { return suscr(c) && c.s.pausa; }, orden: 'riesgo',
        intro: function (l) {
          const sin = l.filter(function (c) { return !c.s.vuelta; }).length;
          return l.length + ' suscriptores tienen la caja en pausa. **' + sin + ' no tienen fecha de vuelta**: son las pausas que no vuelven si nadie les escribe. Al que tiene fecha, el sistema le escribe dos días antes, no antes.';
        },
        cols: ['nombre', ['En pausa', function (c) { return c.s.pausaDias >= 14 ? Math.round(c.s.pausaDias / 7) + ' semanas' : c.s.pausaDias + ' días'; }], ['Vuelta', function (c) { return c.s.vuelta || 'sin fecha'; }], 'accion'], vista: 'tabla' },
      { q: '¿Qué campaña trae suscriptores que se quedan?', h: 'lista', obj: ['retencion', 'captacion', 'todo'],
        filtro: function (c) { return suscr(c) && c.etapa >= 4; }, orden: 'valor',
        intro: function (l, T, Mo) {
          const cs = CAMPANAS.filter(function (cp) { return !cp.b2b; }).slice().sort(function (a, b) { return retiene(b) - retiene(a); });
          return 'De cada 100 que reciben la primera caja, llegan a la cuarta: ' + cs.map(function (cp) { return '**' + cp.nombre + '** ' + Math.round(retiene(cp) * 100); }).join(', ') + '. La caja de prueba trae las altas más baratas y la gente que menos se queda. Estos son los suscriptores recurrentes de la muestra y de dónde vinieron:';
        },
        cols: ['nombre', ['Vino por', function (c) { const cp = camp(c.orig); return cp ? cp.nombre : '—'; }], ['Cajas', function (c) { return c.s.cajas || '—'; }], 'etapa'], vista: 'tabla',
        cierre: 'Movería presupuesto de la caja de prueba a antidesperdicio y daría un empujón al código amigo. Y devolvería a Meta la segunda caja como conversión, para que optimice a quien repite y no a quien prueba.' },
      { q: '¿Qué empresas pidieron información y nadie ha seguido?', h: 'lista', obj: ['seguimiento', 'ventas', 'todo'],
        filtro: function (c) { const u = M().ultimoMsg(c); return !hogar(c) && !c.fin && M().contesto(c) > 0 && (c.x.k.toque > 1440 || (u && u.de === 'c')); }, orden: 'valor', suma: true,
        intro: function (l, T, Mo) { return l.length + ' empresas pidieron fruta para la oficina y están esperando: suman ' + Mo.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' al año. Las de más valor las llama el equipo de empresas; el resto las retoma el agente con su contexto.'; },
        cols: ['nombre', ['Sin respuesta nuestra', function (c) { return M().duracion(c.x.k.toque); }], 'valor', 'accion'], vista: 'tabla' },
      { q: '¿A quién le propondríamos una caja más grande o productos nuevos?', h: 'lista', obj: ['expansion', 'todo'],
        filtro: function (c) { return c.fin === 'ganado' && !!c.s.exp; }, orden: 'valor',
        intro: function (l, T, Mo) { return l.length + ' clientes piden más de lo que tienen: caja más grande, extras u otra oficina. Suman ' + Mo.euros(l.reduce(function (a, c) { return a + (c.s.expValor || 0); }, 0)) + ' al año. A los suscriptores se lo propone el agente; las empresas van al equipo de empresas.'; },
        cols: ['nombre', ['Qué pide', function (c) { return c.s.expTxt; }], ['Más al año', function (c) { return M().euros(c.s.expValor || 0); }], 'accion'], vista: 'tabla' },
      { q: '¿Quién recibió la primera caja y todavía no ha repetido?', h: 'lista', obj: ['retencion', 'conversion', 'todo'],
        filtro: function (c) { return suscr(c) && c.etapa === 2; }, orden: 'riesgo',
        intro: function (l) { return l.length + ' suscriptores han recibido la primera caja y aún no la segunda. Es la mayor fuga del recorrido: casi la mitad de los que prueban no repite. El agente de retención les pregunta qué tal llegó antes de que decidan.'; },
        cols: ['nombre', ['Primera caja', function (c) { return c.s.primeraHace === 1 ? 'ayer' : 'hace ' + c.s.primeraHace + ' días'; }], ['Vino por', function (c) { const cp = camp(c.orig); return cp ? cp.nombre : '—'; }], 'accion'], vista: 'tabla' }
    ],

    historias: {
      retencion: {
        titulo: 'Marta salta dos envíos y visita la página de cancelar',
        riesgo: true,
        contacto: { id: 'demo', n: 'Marta Ibáñez', rol: 'Hogar de 2 personas · Sant Andreu', emp: '', seg: 'hogar', ciudad: 'Barcelona', prod: 'Caja mediana · semanal', orig: 'c2', canal: 'wa', etapa: 5, valor: 1508, fin: 'ganado',
          creado: 98 * D, act: 8 * D, toque: 30 * D, f: { zona: 'ok', hogar: 2, frec: 'semanal', antidesperdicio: true }, s: { cajas: 11, saltos: 1 },
          conv: [[30 * D, 'a', 'wa', 'Hola Marta, esta semana la caja trae las primeras granadas y calabaza de Lleida. ¿Quieres añadir algo?']],
          ev: [[8 * D, 'sistema', 'Salta el envío de la semana']] },
        pasos: [
          { dur: 6, min: 0, txt: 'Marta lleva 14 semanas con la caja mediana cada semana', feed: 'Suscriptora · 11 cajas · caja mediana semanal', cambio: {} },
          { dur: 6, min: 2, txt: 'Salta el envío de esta semana: el segundo seguido', feed: 'Envío saltado · segundo seguido', cambio: { s: { saltos: 2 } }, act: true },
          { dur: 8, min: 3, txt: 'Visita la página de cancelar: el sistema detecta el riesgo de baja', feed: 'Visita la página de cancelar la suscripción', cambio: { s: { cancelar: 1 } }, act: true, vista: 'senales' },
          { dur: 8, min: 1, txt: 'El agente le escribe por WhatsApp en su contexto, sin descuentos', feed: 'WhatsApp del agente de retención', vista: 'conversaciones', toque: true,
            // Al pasar a Conversaciones se abre el hilo de Marta, aunque antes se haya mirado otro
            get cambio() { if (window.QV && window.QV.estado) window.QV.estado.convSel = 'demo'; return { conv: ['a', 'wa', 'Hola Marta, he visto que has saltado las dos últimas cajas. ¿Ha pasado algo? Si algo no te ha encajado, prefiero saberlo y ajustarlo antes que perderte.'] }; } },
          { dur: 8, min: 6, txt: 'Marta contesta: la caja es grande para dos y la fruta llegó muy madura', feed: 'Respuesta de Marta',
            cambio: { conv: ['c', 'wa', 'Pues sí. Somos dos y la caja nos sobra: acabo tirando fruta, que es justo lo que no quiero. Y en la última los plátanos y los melocotones llegaron pasadísimos.'] }, act: true },
          { dur: 9, min: 1, txt: 'El agente propone la caja pequeña cada 15 días y registra la queja', feed: 'Propuesta: caja pequeña quincenal · queja registrada',
            cambio: { s: { queja: true, quejaTxt: 'la fruta de la última caja llegó demasiado madura (plátanos y melocotones)' }, conv: ['a', 'wa', 'Tiene toda la lógica. Para dos personas funciona mejor la caja pequeña cada 15 días (19 €). Lo de la fruta madura se lo paso ahora a atención al cliente para que revisen el lote y te la repongan en la próxima caja. ¿Te la cambio?'] }, toque: true },
          { dur: 7, min: 4, txt: 'Marta acepta y se queda', feed: 'Marta acepta la caja pequeña quincenal',
            cambio: { prod: 'Caja pequeña · quincenal', valor: 494, s: { saltos: 0, cancelar: 0, bajaFrec: true }, conv: ['c', 'wa', 'Vale, así sí. Cámbiamela a la pequeña cada 15 días. ¡Gracias!'] }, act: true },
          { dur: 6, min: 1, txt: 'Cambio aplicado: caja pequeña cada 15 días desde la próxima semana', feed: 'Suscripción cambiada · caja pequeña quincenal', cambio: {}, vista: 'oportunidades' },
          { dur: 0, min: 1, txt: 'Aviso a atención al cliente: la queja de calidad, con todo el contexto', feed: 'Aviso enviado a atención al cliente',
            humano: { titulo: 'Marta se queda: falta resolver la queja de calidad', texto: 'Suscriptora desde hace 14 semanas · 11 cajas · saltó 2 envíos y visitó la página de cancelar. Motivo: la caja mediana le sobraba (son dos) y en la última los plátanos y los melocotones llegaron demasiado maduros. Ya está cambiada a caja pequeña cada 15 días. Pendiente: reponerle esa fruta en la próxima caja y revisar el lote con el almacén.' } }
        ]
      },
      empresa: {
        titulo: 'Una empresa de 120 personas pide fruta para la oficina',
        contacto: { id: 'demo', n: 'Irene Sanz', rol: 'Responsable de Personas', emp: 'Estudio Lumbre Arquitectura', seg: 'empresa', ciudad: '—', prod: 'Fruta para la oficina', orig: 'c5', canal: 'email', etapa: 1, etapaTxt: 'Pide información', valor: 3600, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Irene pide fruta para la oficina desde LinkedIn', feed: 'Solicitud nueva · fruta para la oficina', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: estudio de 120 personas en Madrid', feed: 'Ficha completada · 120 empleados · Madrid', cambio: { tam: 120, ciudad: 'Madrid' } },
          { dur: 7, min: 1, txt: 'El agente contesta en el minuto uno con dos preguntas', feed: 'Correo del agente enviado', toque: true,
            cambio: { conv: ['a', 'email', 'Hola Irene, gracias por escribir. Para prepararte una propuesta que encaje: ¿cuántas personas vienen a la oficina cada día y qué día de la semana os iría mejor la entrega?'] } },
          { dur: 8, min: 12, txt: 'Irene da los datos: 70 personas al día, empezar en noviembre', feed: 'Cualificada · 70 personas al día · noviembre', act: true,
            cambio: { etapaTxt: 'Cualificada', s: { personasDia: 70, urg: true, urgTxt: 'quiere empezar en noviembre, dentro del plan de bienestar', ppto: 'si', pptoTxt: 'tiene presupuesto del plan de bienestar' },
              conv: ['c', 'email', 'Somos 120, pero vienen unas 70 personas al día. Nos iría bien el lunes. Queremos empezar en noviembre, dentro del plan de bienestar, y ya tenemos presupuesto.'] } },
          { dur: 7, min: 1, txt: 'El agente agenda una llamada con el equipo de empresas', feed: 'Llamada agendada · ' + hc.txt + ' 10:00', vista: 'agenda', toque: true,
            cambio: { etapaTxt: 'Llamada agendada', s: { cita: hc.min - 15, citaOk: true }, conv: ['a', 'email', 'Perfecto. Te dejo una llamada de 15 minutos el ' + hc.txt + ' a las 10:00 con el equipo de empresas: con 70 personas al día, lo normal son dos cajas de oficina los lunes. Te llega la invitación al correo.'] } },
          { dur: 0, min: 1, txt: 'Aviso al equipo de empresas: Irene está lista para hablar', feed: 'Aviso enviado al equipo de empresas',
            humano: { titulo: 'Irene está lista para hablar', texto: 'Estudio de arquitectura de 120 personas en Madrid · unas 70 al día en la oficina · entrega los lunes · quiere empezar en noviembre con el presupuesto del plan de bienestar. Llamada el ' + hc.txt + ' a las 10:00, ya confirmada.' } }
        ]
      }
    },
    historiaDefecto: 'retencion',

    contactos: [
      // --- Suscriptores con riesgo de baja (varias señales)
      { id: 'h01', n: 'Laura Casals', rol: 'Hogar de 3 personas · Poblenou', emp: '', seg: 'hogar', ciudad: 'Barcelona', prod: 'Caja mediana · semanal', orig: 'c1', canal: 'wa', etapa: 4, valor: 1508, fin: 'ganado', creado: 52 * D, act: 5 * H, toque: 21 * D,
        f: { zona: 'ok', hogar: 3, frec: 'semanal' }, s: { cajas: 6, saltos: 2, cancelar: 2, sinAbrir: 3 },
        conv: [[21 * D, 'a', 'wa', 'Hola Laura, esta semana la caja trae caquis y las primeras mandarinas de Castellón. ¿Quieres añadir algo?'], [21 * D - 40, 'c', 'wa', 'Así está bien, gracias.']],
        ev: [[10 * D, 'sistema', 'Salta el envío de la semana'], [3 * D, 'sistema', 'Salta el envío de la semana (segundo seguido)'], [1 * D + 4 * H, 'web', 'Visita la página de cancelar la suscripción'], [5 * H, 'web', 'Vuelve a la página de cancelar']] },
      { id: 'h02', n: 'Javier Ortega', rol: 'Hogar de 4 personas · Chamberí', emp: '', seg: 'hogar', ciudad: 'Madrid', prod: 'Caja grande · semanal', orig: 'c3', canal: 'wa', etapa: 5, valor: 1820, fin: 'ganado', creado: 150 * D, act: 26 * H, toque: 9 * D,
        f: { zona: 'ok', hogar: 4, frec: 'semanal' }, s: { cajas: 20, saltos: 1, cancelar: 1, queja: true, quejaTxt: 'se queja de la calidad: lechuga mustia y fresas aplastadas dos semanas seguidas' },
        conv: [[9 * D, 'c', 'wa', 'La lechuga ha llegado mustia otra vez.'], [9 * D - 30, 'a', 'wa', 'Lo siento, Javier. Te la reponemos en la próxima caja.'], [26 * H, 'c', 'wa', 'Segunda semana que la lechuga llega mustia y las fresas aplastadas. Así no me compensa, la verdad.']],
        ev: [[25 * H, 'web', 'Visita la página de cancelar la suscripción']] },
      { id: 'h03', n: 'Nuria Vidal', rol: 'Hogar de 2 personas · Russafa', emp: '', seg: 'hogar', ciudad: 'Valencia', prod: 'Caja pequeña · quincenal', orig: 'c1', canal: 'wa', etapa: 5, valor: 494, fin: 'ganado', creado: 120 * D, act: 2 * D, toque: 35 * D,
        f: { zona: 'ok', hogar: 2, frec: 'quincenal' }, s: { cajas: 10, bajaFrec: true, saltos: 2, sinAbrir: 4 },
        ev: [[18 * D, 'sistema', 'Cambia de semanal a quincenal'], [2 * D, 'sistema', 'Salta el envío (segundo seguido)']], conv: [] },
      { id: 'h04', n: 'Pablo Herrero', rol: 'Hogar de 3 personas · Arganzuela', emp: '', seg: 'hogar', ciudad: 'Madrid', prod: 'Caja mediana · semanal', orig: 'c2', canal: 'wa', etapa: 5, valor: 1508, fin: 'ganado', creado: 210 * D, act: 20 * H, toque: 40 * D,
        f: { zona: 'ok', hogar: 3, frec: 'semanal', antidesperdicio: true }, s: { cajas: 29, cancelar: 1, fueraZona: true, fueraZonaTxt: 'ha cambiado su dirección a Toledo, fuera de la zona de reparto' },
        ev: [[22 * H, 'sistema', 'Cambia la dirección de entrega a Toledo (fuera de zona)'], [20 * H, 'web', 'Visita la página de cancelar la suscripción']], conv: [] },
      // --- Pausas
      { id: 'h05', n: 'Elena Roca', rol: 'Hogar de 3 personas · Sants', emp: '', seg: 'hogar', ciudad: 'Barcelona', prod: 'Caja mediana · semanal', orig: 'c3', canal: 'wa', etapa: 4, valor: 1508, fin: 'ganado', creado: 70 * D, act: 28 * D, toque: 28 * D,
        f: { zona: 'ok', hogar: 3, frec: 'semanal' }, s: { cajas: 7, pausa: true, pausaDias: 28, sinAbrir: 3 },
        conv: [[28 * D, 'c', 'wa', 'Pausadme la caja unas semanas, que tenemos lío.'], [28 * D - 20, 'a', 'wa', 'Hecho, Elena. Cuando quieras volver, me escribes por aquí.']], ev: [] },
      { id: 'h06', n: 'Marc Soler', rol: 'Hogar de 4 personas · Sant Cugat', emp: '', seg: 'hogar', ciudad: 'Sant Cugat del Vallès', prod: 'Caja grande · semanal', orig: 'c4', canal: 'wa', etapa: 5, valor: 1820, fin: 'ganado', creado: 260 * D, act: 12 * D, toque: 12 * D,
        f: { zona: 'ok', hogar: 4, frec: 'semanal' }, s: { cajas: 33, amigos: 1, pausa: true, pausaDias: 12, vuelta: 'la semana que viene', pausaTxt: 'se fue de viaje tres semanas y vuelve la semana que viene', luego: 'octubre', luegoTxt: 'vuelve de viaje la semana que viene', revision: true, revisionTxt: 'Pausa por viaje: vuelve la semana que viene' },
        conv: [[12 * D, 'c', 'wa', 'Nos vamos tres semanas de viaje. ¿Me pausáis la caja hasta la vuelta?'], [12 * D - 15, 'a', 'wa', 'Claro, Marc. Pausada hasta tu vuelta. Dos días antes te escribo con lo que trae la caja de esa semana.']] },
      { id: 'h07', n: 'Carmen Ruiz', rol: 'Hogar de 2 personas · Carabanchel', emp: '', seg: 'hogar', ciudad: 'Madrid', prod: 'Caja pequeña · semanal', orig: 'c1', canal: 'wa', etapa: 4, valor: 988, fin: 'ganado', creado: 90 * D, act: 45 * D, toque: 3 * D,
        f: { zona: 'ok', hogar: 2, frec: 'semanal' }, s: { cajas: 5, pausa: true, pausaDias: 45, sinAbrir: 5, intentos: 2 },
        conv: [[45 * D, 'c', 'wa', 'Pausa la caja, por favor.'], [20 * D, 'a', 'wa', 'Hola Carmen, ¿qué tal? Esta semana vuelven las mandarinas. Si quieres retomar la caja, solo dime.'], [3 * D, 'a', 'wa', 'Hola Carmen, si te va mejor la caja cada 15 días, te la dejo así. Y si prefieres darte de baja, también me lo puedes decir por aquí.']] },
      // --- Recién llegados: después de la primera caja
      { id: 'h08', n: 'Sergio Blanco', rol: 'Hogar de 3 personas · Tetuán', emp: '', seg: 'hogar', ciudad: 'Madrid', prod: 'Caja mediana · quincenal', orig: 'c1', canal: 'wa', etapa: 2, valor: 754, fin: 'ganado', creado: 9 * D, act: 2 * D, toque: 2 * D,
        f: { zona: 'ok', hogar: 3, frec: 'quincenal', soloDescuento: true }, s: { cajas: 1, primeraHace: 2 },
        ev: [[2 * D, 'sistema', 'Primera caja entregada (con el 50 % de descuento)']], conv: [] },
      { id: 'h09', n: 'Lucía Moreno', rol: 'Hogar de 4 personas · Benimaclet', emp: '', seg: 'hogar', ciudad: 'Valencia', prod: 'Caja grande · semanal', orig: 'c2', canal: 'wa', etapa: 2, valor: 1820, fin: 'ganado', creado: 8 * D, act: 50, toque: 3 * D,
        f: { zona: 'ok', hogar: 4, frec: 'semanal', antidesperdicio: true }, s: { cajas: 1, primeraHace: 3 },
        ev: [[3 * D, 'sistema', 'Primera caja entregada']],
        conv: [[3 * D, 'a', 'wa', 'Hola Lucía, tu primera caja está de camino. Si algo no llega bien, me lo dices por aquí.'], [50, 'c', 'wa', '¡Qué buena pinta todo! Una pregunta: las cremas de verdura, ¿también son de temporada? Me gustaría añadir alguna.']] },
      { id: 'h10', n: 'Andrea Gil', rol: 'Hogar de 2 personas · Horta', emp: '', seg: 'hogar', ciudad: 'Barcelona', prod: 'Caja pequeña · semanal', orig: 'c1', canal: 'wa', etapa: 2, valor: 988, fin: 'ganado', creado: 13 * D, act: 6 * D, toque: 6 * D,
        f: { zona: 'ok', hogar: 2, frec: 'semanal' }, s: { cajas: 1, primeraHace: 6, saltos: 1, sinAbrir: 3 },
        ev: [[6 * D, 'sistema', 'Primera caja entregada (con el 50 % de descuento)'], [1 * D, 'sistema', 'Salta la segunda caja']], conv: [] },
      { id: 'h11', n: 'Diego Navarro', rol: 'Hogar de 3 personas · Moncloa', emp: '', seg: 'hogar', ciudad: 'Madrid', prod: 'Caja mediana · semanal', orig: 'c3', canal: 'wa', etapa: 2, valor: 1508, fin: 'ganado', creado: 6 * D, act: 1 * D, toque: 5 * D,
        f: { zona: 'ok', hogar: 3, frec: 'semanal' }, s: { cajas: 1, primeraHace: 1 },
        ev: [[1 * D, 'sistema', 'Primera caja entregada']], conv: [] },
      // --- Fieles con señales de ampliación
      { id: 'h12', n: 'Rosa Martí', rol: 'Hogar de 5 personas · Sarrià', emp: '', seg: 'hogar', ciudad: 'Barcelona', prod: 'Caja mediana · semanal', orig: 'c2', canal: 'wa', etapa: 5, valor: 1508, fin: 'ganado', creado: 240 * D, act: 3 * H, toque: 10 * D,
        f: { zona: 'ok', hogar: 5, frec: 'semanal', antidesperdicio: true }, s: { cajas: 32, exp: true, expTxt: 'Pregunta por la caja grande: con los niños no llegan al viernes', expValor: 312, expAccion: 'Proponer la caja grande' },
        conv: [[3 * H, 'c', 'wa', '¿La caja grande trae mucha más fruta? Con los niños no llegamos al viernes.']] },
      { id: 'h13', n: 'Alberto Campos', rol: 'Hogar de 2 personas · El Carmen', emp: '', seg: 'hogar', ciudad: 'Valencia', prod: 'Caja mediana · semanal', orig: 'c3', canal: 'wa', etapa: 5, valor: 1508, fin: 'ganado', creado: 180 * D, act: 1 * D, toque: 25 * D,
        f: { zona: 'ok', hogar: 2, frec: 'semanal' }, s: { cajas: 25, extras: true, exp: true, expTxt: 'Añade cremas y mermeladas tres semanas seguidas: encaja la caja con despensa', expValor: 416, expAccion: 'Proponer la caja con despensa' },
        ev: [[15 * D, 'sistema', 'Añade 2 cremas de verdura'], [8 * D, 'sistema', 'Añade mermelada de naranja amarga y una crema'], [1 * D, 'sistema', 'Añade 2 cremas de verdura']], conv: [] },
      // --- Fieles sin nada que hacer
      { id: 'h14', n: 'Silvia Prats', rol: 'Hogar de 3 personas · Gràcia', emp: '', seg: 'hogar', ciudad: 'Barcelona', prod: 'Caja mediana · semanal', orig: 'c4', canal: 'wa', etapa: 5, valor: 1508, fin: 'ganado', creado: 300 * D, act: 2 * D, toque: 30 * D,
        f: { zona: 'ok', hogar: 3, frec: 'semanal', antidesperdicio: true }, s: { cajas: 41, amigos: 3 },
        ev: [[2 * D, 'sistema', 'Su código amigo trae un alta nueva (la tercera)']], conv: [] },
      { id: 'h15', n: 'Tomás Aguilar', rol: 'Hogar de 4 personas · Salamanca', emp: '', seg: 'hogar', ciudad: 'Madrid', prod: 'Caja grande · semanal', orig: 'c3', canal: 'wa', etapa: 5, valor: 1820, fin: 'ganado', creado: 380 * D, act: 9 * D, toque: 45 * D,
        f: { zona: 'ok', hogar: 4, frec: 'semanal' }, s: { cajas: 52 }, conv: [] },
      { id: 'h16', n: 'Clara Benet', rol: 'Hogar de 2 personas · Eixample', emp: '', seg: 'hogar', ciudad: 'Barcelona', prod: 'Caja pequeña · semanal', orig: 'c4', canal: 'wa', etapa: 5, valor: 988, fin: 'ganado', creado: 140 * D, act: 10 * D, toque: 60 * D,
        f: { zona: 'ok', hogar: 2, frec: 'semanal' }, s: { cajas: 19, amigos: 1 }, conv: [] },
      { id: 'h17', n: 'Iván Castillo', rol: 'Hogar de 3 personas · Campanar', emp: '', seg: 'hogar', ciudad: 'Valencia', prod: 'Caja mediana · semanal', orig: 'c2', canal: 'wa', etapa: 3, valor: 1508, fin: 'ganado', creado: 16 * D, act: 2 * D, toque: 9 * D,
        f: { zona: 'ok', hogar: 3, frec: 'semanal', antidesperdicio: true }, s: { cajas: 2 },
        ev: [[2 * D, 'sistema', 'Segunda caja entregada']],
        conv: [[9 * D, 'a', 'wa', 'Hola Iván, ¿qué tal la primera caja? Te dejo dos recetas con la calabaza y las acelgas que traía.'], [9 * D - 60, 'c', 'wa', 'Genial, la crema de calabaza triunfó en casa.']] },
      // --- Altas a medias
      { id: 'h18', n: 'Beatriz León', rol: 'Hogar de 4 personas · Hortaleza', emp: '', seg: 'hogar', ciudad: 'Madrid', prod: 'Caja grande · semanal', orig: 'c2', canal: 'wa', etapa: 1, valor: 1820, creado: 4 * H, act: 4 * H, toque: null,
        f: { zona: 'ok', hogar: 4, frec: 'semanal', antidesperdicio: true }, s: { bloqueo: true, bloqueoTxt: 'Se quedó en el pago: la tarjeta le pedía una verificación que no le llegó' },
        ev: [[4 * H, 'web', 'Abandona el alta en el paso de pago']], conv: [] },
      { id: 'h19', n: 'Óscar Pineda', rol: 'Hogar de 2 personas', emp: '', seg: 'hogar', ciudad: 'Sevilla', prod: 'Caja pequeña · semanal', orig: 'c1', canal: 'wa', etapa: 1, valor: 988, creado: 20 * H, act: 20 * H, toque: null,
        f: { zona: 'fuera', hogar: 2, frec: 'semanal', soloDescuento: true }, s: {},
        ev: [[20 * H, 'web', 'Abandona el alta: su código postal no tiene reparto']], conv: [] },
      { id: 'h20', n: 'Irene Calvo', rol: 'Hogar de 3 personas · Les Corts', emp: '', seg: 'hogar', ciudad: 'Barcelona', prod: 'Caja mediana · semanal', orig: 'c3', canal: 'wa', etapa: 1, valor: 1508, creado: 26 * H, act: 26 * H, toque: null,
        f: { zona: 'ok', hogar: 3, frec: 'semanal' }, s: { bloqueo: true, bloqueoTxt: 'Se quedó al elegir el día de entrega: buscaba el sábado y en su zona se reparte el jueves' },
        ev: [[26 * H, 'web', 'Abandona el alta en el paso de día de entrega']], conv: [] },
      // --- Bajas (cerradas)
      { id: 'h21', n: 'Raúl Méndez', rol: 'Hogar de 1 persona · Lavapiés', emp: '', seg: 'hogar', ciudad: 'Madrid', prod: 'Caja pequeña · semanal', orig: 'c1', canal: 'wa', etapa: 2, valor: 988, fin: 'perdido', creado: 24 * D, act: 15 * D, toque: 15 * D,
        f: { zona: 'ok', hogar: 1, frec: 'semanal', soloDescuento: true }, s: { cajas: 1 },
        conv: [[16 * D, 'a', 'wa', 'Hola Raúl, ¿qué tal la primera caja?'], [15 * D, 'c', 'wa', 'Bien, pero me doy de baja. Solo quería probar con el descuento.']],
        ev: [[15 * D, 'sistema', 'Baja tras la primera caja · motivo: solo quería probar con el descuento']] },
      { id: 'h22', n: 'Paula Serrano', rol: 'Hogar de 3 personas · Patraix', emp: '', seg: 'hogar', ciudad: 'Valencia', prod: 'Caja mediana · semanal', orig: 'c2', canal: 'wa', etapa: 5, valor: 1508, fin: 'perdido', creado: 170 * D, act: 20 * D, toque: 20 * D,
        f: { zona: 'ok', hogar: 3, frec: 'semanal' }, s: { cajas: 21 },
        conv: [[20 * D, 'c', 'wa', 'Nos mudamos a Teruel y allí no llegáis. Ha sido un gusto, de verdad.'], [20 * D - 30, 'a', 'wa', 'Gracias a vosotros, Paula. Si algún día llegamos a Teruel, serás la primera en saberlo.']],
        ev: [[20 * D, 'sistema', 'Baja · motivo: mudanza fuera de la zona de reparto']] },

      // --- Empresas (fruta para la oficina)
      { id: 'e01', n: 'Mónica Ferrer', rol: 'Responsable de Personas', emp: 'Grupo Talaia Ingeniería', seg: 'empresa', tam: 180, ciudad: 'Barcelona', prod: 'Fruta para la oficina', orig: 'c5', canal: 'email', etapa: 1, etapaTxt: 'Pide información', valor: 5400, creado: 8 * D, act: 6 * D, toque: 6 * D,
        f: {}, s: { personasDia: 110 },
        conv: [[8 * D - 30, 'a', 'email', 'Hola Mónica, gracias por escribir. ¿Cuántas personas vienen a la oficina cada día y qué día os iría mejor la entrega?'], [6 * D, 'c', 'email', 'Somos 180 en dos plantas; vienen unas 110 al día. El martes nos iría bien. ¿Me pasáis precio?']] },
      { id: 'e02', n: 'Jorge Llorens', rol: 'Office Manager', emp: 'Nubia Software', seg: 'empresa', tam: 90, ciudad: 'Valencia', prod: 'Fruta para la oficina', orig: 'c5', canal: 'email', etapa: 1, etapaTxt: 'Pide información', valor: 3000, creado: 2 * D, act: 20 * H, toque: 2 * D - 20,
        f: {}, s: { precio: true, visitas: 2 },
        conv: [[2 * D - 20, 'a', 'email', 'Hola Jorge, gracias por tu mensaje. ¿Para cuántas personas sería la fruta?'], [20 * H, 'c', 'email', 'Para unas 60 al día. ¿Cuánto sale por persona y al mes? Lo tengo que presentar el viernes.']] },
      { id: 'e03', n: 'Carlos Ibarra', rol: 'Director de Operaciones', emp: 'Logística Montsant', seg: 'empresa', tam: 320, ciudad: 'Martorell', prod: 'Fruta para 2 centros', orig: 'c5', canal: 'email', etapa: 1, etapaTxt: 'Propuesta enviada', valor: 7200, creado: 20 * D, act: 4 * D, toque: 4 * D,
        f: {}, s: { prop: 9 * D, propVista: 2, oficinas: 2 },
        llamadas: [[4 * D, 240, 'hablo', 'Habló 4 minutos: la propuesta le encaja, pero la tiene que aprobar la dirección financiera y le preocupa la entrega en la nave, que abre a las 6:00.', ['Aprobación: dirección financiera', 'Duda: entrega en la nave a primera hora']]],
        conv: [[18 * D, 'c', 'email', 'Nos interesa para las oficinas y para la nave: unas 200 personas entre las dos.'], [9 * D, 'h', 'email', 'Carlos, te adjunto la propuesta para los dos centros: 600 € al mes, entrega los lunes.']] },
      { id: 'e04', n: 'Ana Beltrán', rol: 'People & Culture', emp: 'Editorial Faro Norte', seg: 'empresa', tam: 140, ciudad: 'Madrid', prod: 'Fruta para la oficina · lunes', orig: 'c5', canal: 'email', etapa: 5, etapaTxt: 'Cliente · 8 meses', valor: 3600, fin: 'ganado', creado: 240 * D, act: 6 * H, toque: 30 * D,
        f: {}, s: { exp: true, expTxt: 'Quiere la fruta también en su oficina nueva de Valencia (60 personas)', expValor: 3000 },
        conv: [[6 * H, 'c', 'email', 'Abrimos oficina en Valencia en noviembre, unas 60 personas. ¿Podéis llevar también allí la fruta los lunes?']] },
      { id: 'e05', n: 'Laia Puig', rol: 'Responsable de Oficina', emp: 'Asesoría Roure', seg: 'empresa', tam: 60, ciudad: 'Girona', prod: 'Fruta para la oficina · martes', orig: 'c5', canal: 'email', etapa: 5, etapaTxt: 'Cliente · 1 año', valor: 2400, fin: 'ganado', creado: 400 * D, act: 12 * D, toque: 40 * D, f: {}, s: {}, conv: [] },
      { id: 'e06', n: 'Rebeca Soto', rol: 'Directora de Operaciones', emp: 'Gimnasios Forma Urbana', seg: 'empresa', tam: 85, ciudad: 'Madrid', prod: 'Fruta para 3 centros', orig: 'c5', canal: 'email', etapa: 1, etapaTxt: 'Perdida', valor: 4800, fin: 'perdido', creado: 45 * D, act: 25 * D, toque: 25 * D, f: {}, s: {},
        conv: [[25 * D, 'c', 'email', 'Al final nos quedamos con otro proveedor, más barato. Gracias igualmente.']],
        ev: [[25 * D, 'sistema', 'Perdida · motivo: otro proveedor más barato']] },
      { id: 'e07', n: 'Hugo Rivas', rol: 'Socio fundador', emp: 'Estudio Brisa', seg: 'empresa', tam: 12, ciudad: 'Valencia', prod: 'Fruta para la oficina', orig: 'c5', canal: 'email', etapa: 1, etapaTxt: 'Pide información', valor: 1200, creado: 3 * D, act: 3 * D, toque: 3 * D - 10, f: {}, s: {},
        conv: [[3 * D - 10, 'a', 'email', 'Hola Hugo, gracias por escribir. ¿Para cuántas personas sería?']] },
      { id: 'e08', n: 'Teresa Gómez', rol: 'Responsable de Bienestar', emp: 'Consultora Aldea Digital', seg: 'empresa', tam: 220, ciudad: 'Madrid', prod: 'Fruta para la oficina · 2 días', orig: 'c5', canal: 'email', etapa: 1, etapaTxt: 'Llamada agendada', valor: 6000, creado: 2 * D, act: 1 * D, toque: 20 * H,
        f: {}, s: { cita: 20 * H, citaOk: true, personasDia: 150 },
        llamadas: [[1 * D, 210, 'agendo', 'Cogió a la primera. 220 personas en la oficina de Madrid, unas 150 al día; quieren fruta dos días por semana. Agendó la llamada con el equipo de empresas para mañana.', ['Oficina: 150 personas al día, dos entregas por semana']]],
        conv: [[20 * H, 'a', 'email', 'Hola Teresa, te confirmo la llamada de mañana con el equipo de empresas. Te llevamos una propuesta para dos entregas por semana.']] }
    ]
  };
})();

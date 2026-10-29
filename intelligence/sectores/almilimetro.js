/* Cuenta: Al Milímetro (reformas integrales de Sonia, arquitecta, en Madrid capital y el noroeste).
 * Recorrido, puntuación y campañas de su sistema (29-oct-2026). Los contactos y las cifras de campaña
 * son DE EJEMPLO hasta que se conecte su CRM: nombres inventados, ninguna obra real. */
(function () {
  const H = 60, D = 1440;
  const haContestado = function (c) { return (c.conv || []).some(function (m) { return (m.de || m[1]) === 'c'; }); };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.almilimetro = {
    id: 'almilimetro',
    nombre: 'Al Milímetro',
    t: {
      contacto: 'contacto', contactos: 'contactos', Contactos: 'Contactos', Contacto: 'Contacto',
      venta: 'obra firmada', ventas: 'obras firmadas', Ventas: 'Obras firmadas', producto: 'reforma',
      paginaVisitas: 'la página de reformas', cita: 'visita técnica', Cita: 'Visita técnica', laCita: 'la visita técnica',
      propuesta: 'el presupuesto', Propuesta: 'Presupuesto', comercial: 'Sonia', Comercial: 'Sonia',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'firman la obra', objetivoPaso: 'agendar la visita técnica',
      casoExito: 'una reforma parecida', valorAlto: 30000, oportunidades: 'contactos',
      atencion: 'contactos que requieren atención', laVenta: 'la obra firmada', Producto: 'Reforma', clientes: 'clientes',
      propuestas: 'presupuestos', verbo: 'firmar la obra', clientesReales: 'obras de verdad', empleados: 'm²',
      pasoHumano: 'resolver sus dudas de partidas y plazos y cerrar la fecha de inicio',
      txtPrecio: 'preguntó cuánto costaría'
    },
    // Etapas del panel: nuevo → contactado → visita → presupuesto → seguimiento → firmado (o perdido)
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'solicitud', txt: 'Nuevo' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'visita', txt: 'Visita técnica' },
      { id: 'presupuesto', txt: 'Presupuesto enviado' },
      { id: 'seguimiento', txt: 'Seguimiento' },
      { id: 'obra', txt: 'Obra firmada' }
    ],
    ventaEtapa: 'obra',
    ticket: 27500, // [C] ticket medio de 25.000-30.000 € dicho por Sonia
    referencia: { contactado: 0.85, visita: 0.55, presupuesto: 0.9, seguimiento: 0.85, obra: 0.4 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'contactos que piden presupuesto y no reciben respuesta el mismo día' },
      visita: { txt: 'Visita técnica', exp: 'contactos que contestan y no tienen la visita técnica en la agenda' },
      presupuesto: { txt: 'Presupuesto en 7 días', exp: 'visitas hechas cuyo presupuesto pasa de los 7 días' },
      seguimiento: { txt: 'Seguimiento del presupuesto', exp: 'presupuestos enviados sin seguimiento a los 2, 7, 14 y 21 días' },
      obra: { txt: 'Firma', exp: 'presupuestos en seguimiento que no terminan en obra' }
    },
    mesDatos: { respuestaAntes: 1440, respuestaAhora: 1, agendadas: 16 },
    // Origen = el ?a= de la landing (pared, chalet, precio, portal); sin ?a= cuenta como web.
    campanas: [
      { id: 'pared', canal: 'Meta', nombre: 'A · Sin extras ocultos (detrás de la pared)', inversion: 210, ticket: 32000,
        embudo: { anuncio: 9800, solicitud: 21, contactado: 18, visita: 6, presupuesto: 5, seguimiento: 3, obra: 1 } },
      { id: 'chalet', canal: 'Meta', nombre: 'B · Tu chalet, de principio a fin', inversion: 180, ticket: 160000,
        embudo: { anuncio: 6200, solicitud: 9, contactado: 8, visita: 3, presupuesto: 2, seguimiento: 1, obra: 0 } },
      { id: 'precio', canal: 'Meta', nombre: 'C · ¿Cuánto cuesta reformar tu casa?', inversion: 150, ticket: 30000,
        embudo: { anuncio: 7400, solicitud: 26, contactado: 20, visita: 4, presupuesto: 3, seguimiento: 2, obra: 0 } },
      { id: 'portal', canal: 'Meta', nombre: 'D · Sin portales', inversion: 60, ticket: 30000,
        embudo: { anuncio: 2600, solicitud: 6, contactado: 5, visita: 2, presupuesto: 2, seguimiento: 1, obra: 0 } },
      { id: 'web', canal: 'Web', nombre: 'Web, Instagram y recomendaciones', inversion: 0, ticket: 27500,
        embudo: { anuncio: 900, solicitud: 5, contactado: 5, visita: 3, presupuesto: 3, seguimiento: 2, obra: 1 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'pctA', 'cualificados', 'entrevistas', 'cpvisita', 'ventas', 'cpv', 'ingresos'],
    kpiNombres: { interesados: 'Peticiones de presupuesto', cualificados: 'Contactados', cpv: 'Coste por obra firmada', entrevistas: 'Visitas técnicas', ventas: 'Obras firmadas', ingresos: 'Obra firmada' },
    kpiEtapas: { interesados: 'solicitud', cualificados: 'contactado', entrevistas: 'visita' },
    // La métrica principal acordada: visitas técnicas y lo que cuesta cada una.
    kpiCustom: function (m, cfg, M, est) {
      const cs = ((est && est.contactos) || []).filter(function (c) { return c.id !== 'demo'; });
      const a = cs.filter(function (c) { return c.x && c.x.fit >= 70; }).length;
      const pago = cfg.campanas.filter(function (c) { return c.inversion > 0; });
      const visPago = pago.reduce(function (s, c) { return s + c.embudo.visita; }, 0);
      return {
        cpvisita: { l: 'Coste por visita técnica', v: M.euros(m.inversion / Math.max(1, visPago)), em: visPago + ' visitas de los anuncios', clase: 'bien' },
        pctA: { l: 'Contactos A', v: M.pct(a / Math.max(1, cs.length)), em: a + ' de ' + cs.length + ' (70 puntos o más)' }
      };
    },

    // Puntuación A/B/C (propuesta del 29-oct, a confirmar con Sonia): A ≥ 70 · B 45-69 · C < 45
    reglas: {
      fitBase: 10,
      fit: [
        [function (c) { return c.f && c.f.zonaPrio; }, 20, 'en una de sus 14 zonas prioritarias', 'Zona prioritaria'],
        [function (c) { return c.f && c.f.tipo === 'chalet'; }, 25, 'chalet o casa entera', 'Chalet o casa entera'],
        [function (c) { return c.f && c.f.tipo === 'piso'; }, 20, 'piso entero', 'Piso entero'],
        [function (c) { return c.f && c.f.tipo === 'cb'; }, 10, 'cocina y baño, o dos baños', 'Cocina y baño'],
        [function (c) { return c.valor >= 30000; }, 15, 'presupuesto de 30.000 € o más', 'Presupuesto ≥ 30.000 €'],
        [function (c) { return c.valor >= 15000 && c.valor < 30000; }, 5, 'presupuesto de 15.000 a 30.000 €'],
        [function (c) { return c.f && c.f.cuando === 3; }, 20, 'quiere empezar en menos de 3 meses', 'Empieza en < 3 meses'],
        [function (c) { return c.f && c.f.cuando === 6; }, 10, 'quiere empezar en 3-6 meses'],
        [function (c) { return c.f && c.f.propia; }, 10, 'la vivienda es suya o la está comprando'],
        [function (c) { return c.f && c.f.soloPrecio; }, -14, 'solo está mirando precios']
      ],
      intencion: [
        [function (c) { return c.s.visitaQ; }, 14, 'pidió la visita técnica'],
        [function (c) { return c.s.fotos; }, 10, 'mandó fotos o el plano'],
        [function (c) { return c.s.fechaQ; }, 8, 'preguntó cuándo podría empezar']
      ]
    },

    preguntas: [
      { q: '¿A quién tengo que llamar hoy?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa <= 2 && c.x && c.x.fit >= 70; }, orden: 'prio',
        intro: function (l) { return l.length + ' contactos A sin visita técnica. El aviso te llegó al móvil; lo ideal es llamarles hoy.'; },
        vista: 'tabla' },
      { q: '¿Qué presupuestos llevan más de 7 días sin respuesta?', h: 'lista', obj: ['ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return c.s.prop != null && c.s.prop >= 7 * D && !c.fin; }, orden: 'toque', suma: true,
        intro: function (l, T, M) { return l.length + ' presupuestos enviados hace más de una semana. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en obra. El seguimiento de los días 7, 14 y 21 sale solo; si alguien contesta, te avisa.'; },
        vista: 'tabla' },
      { q: '¿Quién contestó y todavía no tiene la visita?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa <= 2 && haContestado(c) && !c.s.luego && !c.s.cita; }, orden: 'prio',
        intro: function (l) { return l.length + ' contactos ya han contestado y no tienen la visita técnica en la agenda.'; },
        vista: 'tabla' },
      { q: '¿Qué anuncio trae visitas técnicas más baratas?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Quién dijo que haría la obra más adelante?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' contactos dijeron «más adelante». Reciben un email cada 2 semanas y a los 3 meses se les vuelve a preguntar.'; },
        vista: 'tabla' }
    ],

    historias: {
      presupuesto: {
        titulo: 'Una pareja pide presupuesto para reformar su piso en Chamberí',
        contacto: { id: 'demo', n: 'Laura Benítez', rol: 'Propietaria', seg: 'particular', ciudad: 'Chamberí', prod: 'Reforma integral de piso de 95 m²', orig: 'pared', canal: 'wa', etapa: 1, valor: 45000, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una petición desde el anuncio A («detrás de la pared»)', feed: 'Nueva petición · piso entero en Chamberí', cambio: {} },
          { dur: 6, min: 1, txt: 'El formulario la puntúa: zona prioritaria, piso entero, 30.000-60.000 €, empieza en menos de 3 meses', feed: 'Contacto A · 85 puntos', cambio: { f: { zonaPrio: true, tipo: 'piso', cuando: 3, propia: true } } },
          { dur: 6, min: 1, txt: 'Sale el primer WhatsApp desde el número del negocio', feed: 'WhatsApp enviado en 40 segundos', cambio: { conv: ['a', 'wa', 'Hola Laura, soy Sonia, arquitecta de Al Milímetro. He recibido tu petición para reformar tu piso en Chamberí. Para darte una cifra más ajustada, ¿te viene bien que hablemos 10 minutos hoy o mañana?'] } },
          { dur: 0, min: 1, txt: 'Aviso a Sonia: contacto A, llámale hoy', feed: 'Aviso enviado al WhatsApp de Sonia', humano: { titulo: 'Laura es un contacto A', texto: 'Piso de 95 m² en Chamberí · 30.000-60.000 € · quiere empezar en menos de 3 meses. Llámale hoy.' } },
          { dur: 7, min: 9, txt: 'Laura contesta con fotos', feed: 'Respuesta recibida · fotos del piso', cambio: { etapa: 2, s: { fotos: true, visitaQ: true }, conv: ['c', 'wa', 'Hola Sonia, te mando fotos. Mañana por la tarde me viene bien.'] } },
          { dur: 6, min: 30, txt: 'Sonia la llama y agenda la visita técnica', feed: 'Visita técnica agendada · jueves 10:00', cambio: { etapa: 3, s: { cita: 2 * D, citaOk: true } } }
        ]
      }
    },
    historiaDefecto: 'presupuesto',

    contactos: [
      // --- A: llamar hoy
      { id: 'm01', n: 'Elena Robles', rol: 'Propietaria', seg: 'particular', ciudad: 'Majadahonda', prod: 'Reforma integral de chalet de 220 m²', orig: 'chalet', canal: 'wa', etapa: 1, valor: 170000, creado: 40, act: 35, toque: 39,
        f: { zonaPrio: true, tipo: 'chalet', cuando: 3, propia: true }, s: { visitas: 3 },
        conv: [[39, 'a', 'wa', 'Hola Elena, soy Sonia, arquitecta de Al Milímetro. He recibido tu petición para reformar tu chalet en Majadahonda. ¿Te viene bien que hablemos 10 minutos hoy o mañana?']] },
      { id: 'm02', n: 'Jorge Castaño', rol: 'Propietario', seg: 'particular', ciudad: 'Prosperidad', prod: 'Reforma integral de piso de 85 m²', orig: 'pared', canal: 'wa', etapa: 2, valor: 42000, creado: 5 * H, act: 2 * H, toque: 5 * H - 1,
        f: { zonaPrio: true, tipo: 'piso', cuando: 3, propia: true }, s: { fotos: true, visitaQ: true, urg: true, urgTxt: 'acaba de comprar el piso y quiere entrar en primavera' },
        conv: [[5 * H - 1, 'a', 'wa', 'Hola Jorge, soy Sonia, arquitecta de Al Milímetro. He recibido tu petición para reformar tu piso en Prosperidad. ¿Te viene bien que hablemos 10 minutos hoy o mañana?'], [2 * H, 'c', 'wa', 'Hola Sonia, te mando fotos y el plano. ¿Podrías venir esta semana?']] },
      { id: 'm03', n: 'Marta Llorente', rol: 'Propietaria', seg: 'particular', ciudad: 'Retiro', prod: 'Reforma integral de piso de 110 m²', orig: 'precio', canal: 'wa', etapa: 3, valor: 55000, creado: 3 * D, act: 6 * H, toque: D,
        f: { zonaPrio: true, tipo: 'piso', cuando: 3, propia: true }, s: { cita: 20 * H, citaOk: true, fotos: true },
        conv: [[3 * D, 'a', 'wa', 'Hola Marta, soy Sonia, arquitecta de Al Milímetro. ¿Te viene bien que hablemos 10 minutos hoy o mañana?'], [3 * D - 50, 'c', 'wa', 'Sí, llámame a partir de las 17:00.'], [D, 'a', 'wa', '¡Perfecto, Marta! Nos vemos el jueves a las 10:00 en tu casa de Retiro.']] },
      // --- Presupuestos en seguimiento
      { id: 'm04', n: 'Andrés Quintana', rol: 'Propietario', seg: 'particular', ciudad: 'Boadilla del Monte', prod: 'Reforma de planta baja de chalet', orig: 'chalet', canal: 'wa', etapa: 4, valor: 68000, creado: 20 * D, act: D, toque: 7 * D,
        f: { zonaPrio: true, tipo: 'chalet', cuando: 6, propia: true }, s: { prop: 8 * D, propVista: 2, precio: true },
        conv: [[8 * D, 'h', 'wa', 'Andrés, te mando el presupuesto por partidas de la planta baja.'], [7 * D, 'a', 'wa', 'Si estás comparando con otros presupuestos, te paso las 3 cosas que yo miraría.']],
        ev: [[D, 'web', 'Abre el presupuesto por segunda vez']] },
      { id: 'm05', n: 'Beatriz Peña', rol: 'Propietaria', seg: 'particular', ciudad: 'Hortaleza', prod: 'Cocina y baño de la misma vivienda', orig: 'pared', canal: 'wa', etapa: 4, valor: 21000, creado: 16 * D, act: 2 * D, toque: 2 * D,
        f: { zonaPrio: true, tipo: 'cb', cuando: 3, propia: true }, s: { prop: 2 * D, propVista: 1 },
        conv: [[2 * D, 'a', 'wa', 'Beatriz, ¿has podido ver el presupuesto? Si quieres, lo repasamos en 10 minutos.']] },
      { id: 'm06', n: 'Ramón Ferrer', rol: 'Propietario', seg: 'particular', ciudad: 'Las Tablas', prod: 'Reforma integral de piso de 100 m²', orig: 'portal', canal: 'email', etapa: 5, valor: 47000, creado: 30 * D, act: 15 * D, toque: 14 * D,
        f: { zonaPrio: true, tipo: 'piso', cuando: 6, propia: true }, s: { prop: 15 * D, propVista: 3 },
        conv: [[14 * D, 'a', 'wa', '¿Hay algo del presupuesto (el plazo, alguna partida, la forma de pago) que podamos ajustar para que te encaje?']] },
      // --- B: acompañar
      { id: 'm07', n: 'Nuria Saavedra', rol: 'Propietaria', seg: 'particular', ciudad: 'Chamberí', prod: 'Dos baños', orig: 'precio', canal: 'wa', etapa: 1, valor: 18000, creado: 26 * H, act: 26 * H, toque: 2 * H,
        f: { zonaPrio: true, tipo: 'cb', cuando: 6, propia: true }, s: { intentos: 2 },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Nuria, soy Sonia, arquitecta de Al Milímetro. ¿Te viene bien que hablemos 10 minutos hoy o mañana?'], [2 * H, 'a', 'wa', 'Nuria, ¿pudiste ver mi mensaje de ayer? Cuando te venga bien, lo hablamos en 10 minutos.']] },
      { id: 'm08', n: 'Tomás Herrero', rol: 'Propietario', seg: 'particular', ciudad: 'Moncloa-Aravaca', prod: 'Reforma integral de piso de 75 m²', orig: 'pared', canal: 'wa', etapa: 2, valor: 33000, creado: 6 * D, act: 4 * D, toque: 4 * D,
        f: { zonaPrio: true, tipo: 'piso', cuando: 6 }, s: { precio: true, visitaQ: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Tomás, soy Sonia, arquitecta de Al Milímetro.'], [4 * D, 'c', 'wa', 'Me interesa. ¿Cuándo podrías venir a verlo?']] },
      { id: 'm09', n: 'Carmen Viñas', rol: 'Propietaria', seg: 'particular', ciudad: 'Torrelodones', prod: 'Reforma integral de chalet', orig: 'web', canal: 'wa', etapa: 3, valor: 120000, creado: 9 * D, act: 3 * D, toque: 3 * D,
        f: { zonaPrio: true, tipo: 'chalet', cuando: 6, propia: true }, s: { noshow: true },
        conv: [[4 * D, 'a', 'wa', '¡Perfecto, Carmen! Nos vemos el lunes a las 11:00 en tu casa de Torrelodones.']],
        ev: [[3 * D, 'sistema', 'Visita técnica sin confirmar la víspera']] },
      // --- C: más adelante
      { id: 'm10', n: 'Gonzalo Arias', rol: 'Propietario', seg: 'particular', ciudad: 'Mirasierra', prod: 'Reforma integral de piso de 120 m²', orig: 'precio', canal: 'email', etapa: 2, valor: 40000, creado: 25 * D, act: 20 * D, toque: 11 * D,
        f: { zonaPrio: true, tipo: 'piso', cuando: 12, propia: true, soloPrecio: true }, s: { luego: 'marzo', luegoTxt: 'quiere hacer la obra cuando venda el piso actual' },
        conv: [[20 * D, 'c', 'wa', 'Ahora no es el momento, escríbeme en primavera.']] },
      { id: 'm11', n: 'Alicia Montero', rol: 'Propietaria', seg: 'particular', ciudad: 'Barrio de Salamanca', prod: 'Reforma integral de piso de 90 m²', orig: 'precio', canal: 'email', etapa: 1, valor: 15000, creado: 12 * D, act: 12 * D, toque: 5 * D,
        f: { zonaPrio: true, tipo: 'piso', cuando: 12, soloPrecio: true }, s: { intentos: 3 },
        conv: [[12 * D, 'a', 'wa', 'Hola Alicia, soy Sonia, arquitecta de Al Milímetro.']] },
      // --- Cerrados
      { id: 'm12', n: 'Pablo Garrido', rol: 'Propietario', seg: 'particular', ciudad: 'Peña Grande', prod: 'Reforma integral de piso de 80 m²', orig: 'pared', canal: 'wa', etapa: 6, valor: 36000, creado: 45 * D, act: 3 * D, toque: 3 * D, fin: 'ganado',
        f: { zonaPrio: true, tipo: 'piso', cuando: 3, propia: true }, s: {},
        conv: [[3 * D, 'c', 'wa', 'Firmado. ¿Cuándo empezamos?']] },
      { id: 'm13', n: 'Inés Calvo', rol: 'Propietaria', seg: 'particular', ciudad: 'Villaviciosa de Odón', prod: 'Reforma de cocina y baño', orig: 'web', canal: 'wa', etapa: 4, valor: 19000, creado: 50 * D, act: 25 * D, toque: 21 * D, fin: 'perdido',
        f: { tipo: 'cb', propia: true }, s: { prop: 28 * D },
        conv: [[21 * D, 'a', 'wa', 'Inés, no te escribo más para no agobiarte. Si más adelante retomas la idea, aquí estoy.']] }
    ]
  };
})();

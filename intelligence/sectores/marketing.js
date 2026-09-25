/* Sector: Agencia de marketing (gestión de campañas, SEO y captación).
 * Agencia ficticia de unas 25 personas que vende sus servicios a pymes y
 * capta sus propios clientes nuevos. Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const eur = function (v) { return String(Math.round(v || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.marketing = {
    id: 'marketing',
    nombre: 'Agencia de marketing',
    t: {
      contacto: 'oportunidad', contactos: 'oportunidades', Contactos: 'Oportunidades', Contacto: 'Oportunidad',
      venta: 'cliente nuevo', ventas: 'clientes nuevos', Ventas: 'Clientes nuevos', producto: 'servicio',
      paginaVisitas: 'la página de servicios y tarifas', txtPrecio: 'ha mirado tarifas', cita: 'reunión', Cita: 'Reunión', laCita: 'la reunión',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'el director de cuentas', Comercial: 'Director de cuentas',
      cs: 'el responsable de cuenta', CS: 'Responsable de cuenta',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'acaban firmando', objetivoPaso: 'agendar la reunión',
      casoExito: 'un caso de una empresa de su sector', valorAlto: 12000, oportunidades: 'oportunidades',
      laVenta: 'la firma', Producto: 'Servicio', clientes: 'clientes', propuestas: 'propuestas', verbo: 'firmar',
      clientesReales: 'clientes firmados', empleados: 'empleados', nuevos: 'nuevas',
      pasoHumano: 'revisar su cuenta de anuncios con él y proponer un plan con cifras'
    },
    // Recorrido: Anuncio → Oportunidad → Contactada → Cualificada → Reunión → Propuesta → Cliente
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'lead', txt: 'Oportunidad' },
      { id: 'contactado', txt: 'Contactada' },
      { id: 'cualificado', txt: 'Cualificada' },
      { id: 'reunion', txt: 'Reunión' },
      { id: 'propuesta', txt: 'Propuesta' },
      { id: 'cliente', txt: 'Cliente' }
    ],
    ventaEtapa: 'cliente',
    ticket: 14400,
    // Conversión razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, cualificado: 0.6, reunion: 0.55, propuesta: 0.7, cliente: 0.4 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'empresas que piden información a la agencia y nadie les contesta a tiempo' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      reunion: { txt: 'Paso a reunión', exp: 'oportunidades cualificadas a las que nadie cierra la reunión' },
      propuesta: { txt: 'Propuesta', exp: 'reuniones que no terminan en propuesta' },
      cliente: { txt: 'Cierre', exp: 'propuestas enviadas que nadie vuelve a trabajar' }
    },
    mesDatos: { respuestaAntes: 780, respuestaAhora: 2, agendadas: 50 },
    campanas: [
      { id: 'c1', canal: 'LinkedIn', nombre: 'Gerentes de pymes', inversion: 3800, ticket: 15600,
        embudo: { anuncio: 2400, lead: 46, contactado: 27, cualificado: 16, reunion: 9, propuesta: 6, cliente: 2 } },
      { id: 'c2', canal: 'Google', nombre: 'Búsqueda · agencia de marketing', inversion: 4200, ticket: 13200,
        embudo: { anuncio: 1800, lead: 72, contactado: 38, cualificado: 21, reunion: 11, propuesta: 7, cliente: 3 } },
      { id: 'c3', canal: 'Meta', nombre: 'Auditoría gratuita de tu cuenta de anuncios', inversion: 2600, ticket: 12000,
        embudo: { anuncio: 21000, lead: 118, contactado: 58, cualificado: 28, reunion: 14, propuesta: 8, cliente: 3 } },
      { id: 'c4', canal: 'Webinar', nombre: 'Webinar: captar clientes con anuncios', inversion: 900, ticket: 9600,
        embudo: { anuncio: 700, lead: 64, contactado: 36, cualificado: 15, reunion: 6, propuesta: 3, cliente: 1 } },
      { id: 'c5', canal: 'Referidos', nombre: 'Clientes que recomiendan', inversion: 0, ticket: 18000,
        embudo: { anuncio: 30, lead: 19, contactado: 18, cualificado: 14, reunion: 10, propuesta: 7, cliente: 3 } }
    ],
    kpis: ['interesados', 'cualificados', 'entrevistas', 'show', 'propuestas', 'cierre', 'pipeline', 'ingresos', 'ticketMedio', 'respuesta'],
    kpiNombres: { interesados: 'Oportunidades nuevas', cualificados: 'Cualificadas', entrevistas: 'Reuniones', ingresos: 'Facturación anual firmada' },
    kpiEtapas: { interesados: 'lead', cualificados: 'cualificado', entrevistas: 'reunion' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      const pipe = cs.filter(function (c) { return !c.fin && c.etapa >= 4; });
      const riesgo = pipe.filter(function (c) { return c.x && c.x.riesgo >= 45; });
      return {
        propuestas: { l: 'Propuestas enviadas', v: M.num(m.tot.propuesta), em: M.pct(m.tot.propuesta / m.tot.reunion) + ' de las reuniones' },
        cierre: { l: 'Tasa de cierre', v: M.pct(m.tot.cliente / m.tot.propuesta), em: M.pl(m.tot.cliente, 'cliente nuevo', 'clientes nuevos') + ' de ' + M.pl(m.tot.propuesta, 'propuesta', 'propuestas') },
        pipeline: { l: 'Pipeline abierto', v: M.euros(pipe.reduce(function (a, c) { return a + c.valor; }, 0)), em: M.euros(riesgo.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en riesgo', clase: 'mal' },
        ticketMedio: { l: 'Cuota anual media', v: M.euros(m.ingresos / Math.max(1, m.tot.cliente)), em: 'Últimos 30 días' }
      };
    },

    reglas: {
      fitBase: 18,
      fit: [
        [function (c) { return c.f && c.f.inversion >= 3000; }, 20, function (c) { return 'invierte ' + eur(c.f.inversion) + ' al mes en anuncios'; }, 'Invierte 3.000 €/mes o más en anuncios'],
        [function (c) { return c.tam >= 10 && c.tam <= 200; }, 18, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 10 a 200 empleados'],
        [function (c) { return c.tam > 0 && c.tam < 10; }, -10, 'negocio muy pequeño para el servicio', 'Menos de 10 empleados'],
        [function (c) { return /director|ceo|gerente|fundador|head|socio|propietari|responsable de marketing/i.test(c.rol || ''); }, 16, function (c) { return 'decide (' + c.rol + ')'; }, 'Su cargo decide la contratación'],
        [function (c) { return c.f && c.f.sectorOk; }, 12, function (c) { return 'sector donde ya hay casos (' + c.f.sectorOk + ')'; }, 'Sector con casos parecidos'],
        [function (c) { return c.f && c.f.cambia; }, 10, 'trabaja con otra agencia y no está contento', 'Quiere cambiar de agencia'],
        [function (c) { return c.f && c.f.pptoBajo; }, -18, 'presupuesto de agencia muy bajo', 'Presupuesto muy bajo'],
        [function (c) { return c.f && c.f.soloRedes; }, -16, 'solo busca que le lleven las redes', 'Solo quiere que le lleven las redes']
      ],
      intencion: [
        [function (c) { return (c.s.visitas || 0) >= 2 && c.s.precio; }, 10, 'vuelve a mirar tarifas'],
        [function (c) { return c.s.auditoria; }, 8, 'ha pedido la auditoría gratuita'],
        [function (c) { return c.s.caso; }, 8, 'ha descargado un caso de éxito']
      ]
    },

    preguntas: [
      { q: '¿Qué oportunidades debería trabajar hoy el director de cuentas?', h: 'equipo', obj: ['ventas', 'todo'] },
      { q: '¿Qué oportunidades invierten más en anuncios?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && c.f && c.f.inversion >= 3000; }, orden: 'valor', suma: true,
        intro: function (l, T, M) {
          const tot = l.reduce(function (a, c) { return a + c.f.inversion; }, 0);
          return M.pl(l.length, 'oportunidad abierta invierte', 'oportunidades abiertas invierten') + ' 3.000 € al mes o más en anuncios: entre ' + (l.length === 1 ? 'ella' : 'todas') + ' mueven **' + M.euros(tot) + ' al mes**. Son las cuentas donde una buena gestión se nota antes y la cuota de la agencia se justifica sola.';
        },
        cols: ['nombre', ['Inversión/mes', function (c) { return eur(c.f.inversion); }], 'valor', 'accion'], vista: 'tabla' },
      { q: '¿Qué propuestas están enfriándose?', h: 'lista', obj: ['seguimiento', 'ventas', 'todo'],
        filtro: function (c) { return c.s.tProp != null && !c.fin && c.x.k.toque > 2 * 1440; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return M.pl(l.length, 'propuesta lleva', 'propuestas llevan') + ' más de 2 días sin seguimiento. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' al año. Las de más valor las llama el director de cuentas; el resto las retoma el agente con la duda más habitual.'; },
        cols: ['nombre', ['Abierta', function (c) { return (c.s.propVista || 0) + ((c.s.propVista || 0) === 1 ? ' vez' : ' veces'); }], 'valor', 'accion'], vista: 'tabla' },
      { q: '¿Quién está descontento con su agencia actual?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && c.f && c.f.cambia; }, orden: 'prob',
        intro: function (l, T, M) { return M.pl(l.length, 'oportunidad trabaja', 'oportunidades trabajan') + ' hoy con otra agencia y ' + (l.length === 1 ? 'ha dicho' : 'han dicho') + ' que no está contenta. Son las que antes deciden: ya saben lo que es pagar a una agencia y lo que quieren que cambie.'; },
        cols: ['nombre', ['Invierte/mes', function (c) { return c.f.inversion ? eur(c.f.inversion) : '—'; }], 'valor', 'accion'], vista: 'tabla' }
    ],

    historias: {
      auditoria: {
        titulo: 'Una clínica pide la auditoría gratuita y acaba con reunión',
        contacto: { id: 'demo', n: 'Nuria Castell', rol: 'Directora de Marketing', emp: 'Clínicas Dermaestética Castell', seg: 'empresa', ciudad: '—', prod: 'Gestión de campañas en Meta y Google', orig: 'c3', canal: 'wa', etapa: 1, valor: 18000, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Nuria pide la auditoría gratuita de su cuenta de anuncios', feed: 'Oportunidad nueva · auditoría gratuita (Meta)', cambio: { s: { auditoria: true } } },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: 6 clínicas, 45 personas y 6.000 € al mes en anuncios', feed: 'Ficha completada · 45 empleados · 6.000 €/mes en anuncios', cambio: { tam: 45, ciudad: 'Barcelona', f: { sectorOk: 'clínicas', inversion: 6000 } } },
          { dur: 6, min: 1, txt: 'El agente le escribe por WhatsApp en el minuto uno', feed: 'WhatsApp enviado en 50 segundos', cambio: { conv: ['a', 'wa', 'Hola Nuria, soy Carla, de la agencia. Ya tengo tu petición de auditoría. Antes de mirar la cuenta: ¿qué es lo que más te preocupa ahora mismo de tus anuncios?'] }, toque: true },
          { dur: 7, min: 6, txt: 'Nuria contesta: ya tiene agencia y no está contenta', feed: 'Respuesta recibida · quiere cambiar de agencia', cambio: { etapa: 2, f: { cambia: true }, conv: ['c', 'wa', 'Llevamos un año con otra agencia y el coste por paciente no para de subir. Nadie nos explica por qué. Me estoy planteando cambiar.'] }, act: true },
          { dur: 6, min: 5, txt: 'Nuria vuelve a la web y mira tarifas y un caso de clínicas', feed: 'Visita tarifas 2 veces · descarga un caso de clínicas', cambio: { s: { visitas: 2, precio: true, caso: true } }, act: true },
          { dur: 7, min: 1, txt: 'El agente cualifica con una sola pregunta', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Es muy habitual cuando nadie revisa la cuenta cada semana. Una pregunta para preparar bien la auditoría: ¿para cuándo querrías tomar la decisión y qué presupuesto de agencia manejáis?'] }, toque: true },
          { dur: 7, min: 4, txt: 'Nuria da plazo y presupuesto', feed: 'Cualificada · plazo y presupuesto', cambio: { s: { urg: true, urgTxt: 'quiere decidir antes de que acabe el contrato actual, en noviembre', ppto: 'si', pptoTxt: 'tiene unos 1.500 € al mes para la agencia' }, conv: ['c', 'wa', 'El contrato actual acaba en noviembre, así que quiero decidirlo este mes. Tenemos unos 1.500 al mes para la agencia, aparte de la inversión.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la reunión para revisar la auditoría', feed: 'Reunión agendada · martes 11:00', cambio: { etapa: 4, s: { cita: 2 * D, citaOk: true }, conv: ['a', 'wa', 'Perfecto. Te dejo el martes a las 11:00 con Javier, director de cuentas: 30 minutos para enseñarte la auditoría con tu cuenta delante. Te llega la invitación al correo.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso al director de cuentas: Nuria está lista para hablar', feed: 'Aviso enviado al director de cuentas', humano: { titulo: 'Nuria está lista para hablar', texto: 'Directora de Marketing · 6 clínicas · 6.000 € al mes en anuncios · descontenta con su agencia (el coste por paciente sube) · contrato actual acaba en noviembre · 1.500 € al mes para agencia. Reunión el martes a las 11:00 para revisar la auditoría.' } }
        ]
      }
    },
    historiaDefecto: 'auditoria',

    contactos: [
      // --- Calientes
      { id: 'm01', n: 'Óscar Villalba', rol: 'Director de Marketing', emp: 'Tiendas Nómada', seg: 'empresa', tam: 60, ciudad: 'Madrid', prod: 'Gestión de campañas en Meta y Google', orig: 'c2', canal: 'wa', etapa: 3, valor: 21600, creado: 2 * D, act: 25, toque: 3 * H,
        f: { sectorOk: 'e-commerce', inversion: 9000, cambia: true }, s: { visitas: 3, precio: true, urg: true, urgTxt: 'quiere tenerlo antes del Black Friday' },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Óscar, soy Carla, de la agencia. ¿Qué te gustaría mejorar en vuestras campañas?'], [2 * D - 50, 'c', 'wa', 'El ROAS de Meta se nos ha caído a la mitad desde verano. La agencia que tenemos no da explicaciones.'], [3 * H, 'a', 'wa', 'Lo vemos mucho en tiendas online. ¿Te va bien 30 minutos con Javier esta semana para revisar la cuenta?'], [25, 'c', 'wa', 'Sí, pero necesito tenerlo resuelto antes del Black Friday. ¿Cuánto cobráis al mes más o menos?']] },
      { id: 'm02', n: 'Patricia Llorens', rol: 'CEO', emp: 'Clínicas Dentales Llorens', seg: 'empresa', tam: 90, ciudad: 'Valencia', prod: 'Estrategia de captación + campañas', orig: 'c5', canal: 'email', etapa: 5, valor: 24000, creado: 18 * D, act: 2 * H, toque: 3 * D,
        f: { sectorOk: 'clínicas', inversion: 7000 }, s: { prop: 3 * D, propVista: 5, ppto: 'si' },
        conv: [[3 * D, 'h', 'email', 'Te envío la propuesta: estrategia de captación, campañas en Meta y Google y el informe mensual por clínica.'], [2 * H, 'c', 'email', 'La he visto con mi socio. Nos gusta, pero queremos entender cómo medís el coste por paciente de cada clínica. ¿Lo hablamos?']] },
      { id: 'm03', n: 'Beatriz Olmo', rol: 'Directora General', emp: 'Grupo Olmo Veterinarios', seg: 'empresa', tam: 110, ciudad: 'Zaragoza', prod: 'Gestión de campañas en Meta y Google', orig: 'c3', canal: 'wa', etapa: 3, valor: 18000, creado: 3 * D, act: 3 * H, toque: 5 * H,
        f: { sectorOk: 'clínicas', inversion: 7000, cambia: true }, s: { auditoria: true, precio: true, visitas: 2, ppto: 'si', pptoTxt: 'tiene 1.500 € al mes aprobados para agencia', urg: true, urgTxt: 'quiere empezar en noviembre' },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Beatriz, soy Carla. Ya estamos con tu auditoría. ¿Qué es lo que más te preocupa de la cuenta?'], [3 * D - 30, 'c', 'wa', 'Que pagamos mucho por cada cita y no sabemos qué campaña funciona. Nuestra agencia nos manda un PDF al mes y poco más.'], [5 * H, 'a', 'wa', 'Te he dejado la auditoría en el correo. Hay tres campañas que se comen el 60 % del presupuesto sin traer citas.'], [3 * H, 'c', 'wa', 'Me ha abierto los ojos. Tenemos 1.500 al mes aprobados para agencia y quiero empezar en noviembre. ¿Cuándo hablamos?']] },
      { id: 'm04', n: 'Adrián Gil', rol: 'Gerente', emp: 'Gil Climatización', seg: 'empresa', tam: 35, ciudad: 'Murcia', prod: 'Campañas en Google', orig: 'c2', canal: 'tel', etapa: 1, valor: 12000, creado: 9, act: 9, toque: null, f: { inversion: 3500 }, s: { visitas: 1 }, conv: [] },
      { id: 'm05', n: 'Sergio Molina', rol: 'Director de Marketing', emp: 'Gimnasios Forza', seg: 'empresa', tam: 70, ciudad: 'Sevilla', prod: 'Auditoría gratuita de anuncios', orig: 'c3', canal: 'wa', etapa: 1, valor: 14400, creado: 38, act: 36, toque: null, f: { inversion: 4000 }, s: { auditoria: true, visitas: 1 }, conv: [] },
      // --- Propuestas enfriándose
      { id: 'm06', n: 'Silvia Robles', rol: 'Directora Comercial', emp: 'Academia Robles Idiomas', seg: 'empresa', tam: 40, ciudad: 'Salamanca', prod: 'Estrategia de captación + campañas', orig: 'c1', canal: 'email', etapa: 5, valor: 14400, creado: 26 * D, act: 6 * D, toque: 7 * D,
        f: { sectorOk: 'formación', inversion: 3000 }, s: { prop: 8 * D, propVista: 2 },
        conv: [[8 * D, 'h', 'email', 'Te comparto la propuesta con el plan para la campaña de matrículas de enero.'], [7 * D, 'c', 'email', 'Gracias, la reviso con dirección y te digo algo.']] },
      { id: 'm07', n: 'Tomás Echevarría', rol: 'Director General', emp: 'Echevarría Muebles', seg: 'empresa', tam: 120, ciudad: 'Vitoria', prod: 'SEO + campañas en Google', orig: 'c1', canal: 'email', etapa: 5, valor: 26400, creado: 30 * D, act: 11 * D, toque: 11 * D,
        f: { sectorOk: 'e-commerce', inversion: 5000 }, s: { prop: 11 * D, propVista: 0 }, conv: [[11 * D, 'h', 'email', 'Te envío la propuesta de SEO y Google Ads que comentamos. Cualquier duda, me dices.']] },
      { id: 'm08', n: 'Lucía Serra', rol: 'Fundadora', emp: 'Serra Cosmética Natural', seg: 'empresa', tam: 6, ciudad: 'Palma', prod: 'Campañas en Meta', orig: 'c3', canal: 'wa', etapa: 5, valor: 6000, creado: 16 * D, act: 3 * D, toque: 5 * D,
        f: { sectorOk: 'e-commerce' }, s: { prop: 5 * D, propVista: 3 },
        conv: [[5 * D, 'h', 'wa', 'Lucía, te acabo de mandar la propuesta al correo.'], [5 * D - 45, 'c', 'wa', 'Recibida, gracias. La miro este finde.']] },
      // --- Reuniones
      { id: 'm09', n: 'Diego Carrasco', rol: 'Head of Growth', emp: 'Aldaba Finanzas', seg: 'empresa', tam: 55, ciudad: 'Madrid', prod: 'Gestión de campañas en Meta y Google', orig: 'c1', canal: 'wa', etapa: 4, valor: 19200, creado: 6 * D, act: 5 * H, toque: 5 * H,
        f: { inversion: 8000 }, s: { cita: 18 * H, citaOk: false, visitas: 2 },
        conv: [[6 * D, 'a', 'wa', 'Hola Diego, ¿qué te gustaría mejorar en la captación?'], [6 * D - 25, 'c', 'wa', 'Bajar el coste por registro en Meta. Estamos muy por encima de lo que nos sale rentable.'], [5 * H, 'a', 'wa', 'Te recuerdo la reunión de mañana a las 10:00 con Javier. ¿Te sigue encajando?']] },
      { id: 'm10', n: 'Marina Pons', rol: 'Directora de Marketing', emp: 'Hoteles Pons', seg: 'empresa', tam: 150, ciudad: 'Tarragona', prod: 'Estrategia de captación + campañas', orig: 'c2', canal: 'wa', etapa: 4, valor: 21600, creado: 12 * D, act: 2 * D, toque: 2 * D,
        f: { sectorOk: 'hostelería', inversion: 6000 }, s: { noshow: true, visitas: 2 },
        conv: [[4 * D, 'a', 'wa', 'Te espero mañana a las 12:00 con Javier para ver la estrategia de reservas directas.'], [3 * D, 'c', 'wa', 'Perfecto, allí estaré.']], ev: [[2 * D, 'sistema', 'No se conecta a la reunión']] },
      { id: 'm11', n: 'Enrique Soto', rol: 'Gerente', emp: 'Soto Inmobiliaria', seg: 'empresa', tam: 22, ciudad: 'Málaga', prod: 'Campañas en Meta', orig: 'c4', canal: 'email', etapa: 4, valor: 9600, creado: 9 * D, act: 1 * D, toque: 1 * D,
        f: { sectorOk: 'inmobiliario' }, s: { cita: 3 * D, citaOk: true }, conv: [[1 * D, 'h', 'email', 'Confirmada la reunión del lunes a las 9:30.']] },
      // --- Contestaron y se quedaron sin seguimiento
      { id: 'm12', n: 'Carlos Ferrán', rol: 'Director de Ventas', emp: 'Autos Ferrán', seg: 'empresa', tam: 80, ciudad: 'Lleida', prod: 'Campañas en Meta y Google', orig: 'c1', canal: 'wa', etapa: 3, valor: 16800, creado: 12 * D, act: 6 * D, toque: 6 * D,
        f: { sectorOk: 'automoción', inversion: 4500, cambia: true }, s: { visitas: 2 },
        conv: [[12 * D, 'a', 'wa', 'Hola Carlos, ¿qué os gustaría mejorar en vuestras campañas?'], [11 * D, 'c', 'wa', 'Nos llegan contactos de coches que no compran nunca. La agencia actual solo mira clics.'], [6 * D, 'h', 'wa', 'Te llamo esta semana y lo vemos.']] },
      { id: 'm13', n: 'Julia Méndez', rol: 'Responsable de Marketing', emp: 'Ópticas Méndez', seg: 'empresa', tam: 28, ciudad: 'Oviedo', prod: 'Auditoría gratuita de anuncios', orig: 'c3', canal: 'wa', etapa: 2, valor: 12000, creado: 1 * D, act: 5 * H, toque: 20 * H,
        f: { inversion: 2000 }, s: { auditoria: true },
        conv: [[20 * H, 'a', 'wa', 'Hola Julia, soy Carla. ¿Qué te gustaría que miráramos en la auditoría?'], [5 * H, 'c', 'wa', 'Sobre todo Google. ¿La auditoría incluye también la parte de la ficha de Google de las tiendas?']] },
      { id: 'm14', n: 'Gonzalo Ruiz', rol: 'Director de Marketing', emp: 'Ruiz Distribución', seg: 'empresa', tam: 95, ciudad: 'Valladolid', prod: 'SEO + campañas en Google', orig: 'c2', canal: 'email', etapa: 2, valor: 15600, creado: 5 * D, act: 3 * D, toque: 3 * D,
        f: {}, s: { emails: 2 },
        conv: [[5 * D, 'a', 'email', 'Hola Gonzalo, ¿qué te gustaría mejorar en el posicionamiento de la web?'], [3 * D, 'c', 'email', 'Tenemos la web en la segunda página para casi todo. Me interesa, pero ahora ando liado.']] },
      { id: 'm15', n: 'Marcos Aranda', rol: 'Responsable de Marketing', emp: 'Aranda Reformas', seg: 'empresa', tam: 15, ciudad: 'Granada', prod: 'Campañas en Meta', orig: 'c4', canal: 'wa', etapa: 2, valor: 7200, creado: 2 * D, act: 30, toque: 2 * H,
        f: { inversion: 1500, sectorOk: 'reformas' }, s: {},
        conv: [[2 * D, 'a', 'wa', 'Hola Marcos, gracias por venir al webinar. ¿Qué os gustaría conseguir con los anuncios?'], [2 * H, 'a', 'wa', '¿Te cuento cómo lo hicimos con otra empresa de reformas?'], [30, 'c', 'wa', 'Sí, cuéntame.']] },
      // --- Más adelante
      { id: 'm16', n: 'Ramón Iturbe', rol: 'Director General', emp: 'Bodegas Iturbe', seg: 'empresa', tam: 45, ciudad: 'Logroño', prod: 'Estrategia de captación + campañas', orig: 'c1', canal: 'email', etapa: 4, valor: 16800, creado: 40 * D, act: 25 * D, toque: 25 * D,
        f: { inversion: 3000 }, s: { luego: 'enero', luegoTxt: 'lo retomaría en enero, con el presupuesto de 2027 cerrado' },
        conv: [[25 * D, 'c', 'email', 'Nos encaja, pero hasta enero no cerramos el presupuesto de marketing. Lo retomamos entonces.']] },
      { id: 'm17', n: 'Elena Barrios', rol: 'CEO', emp: 'Barrios Moda', seg: 'empresa', tam: 30, ciudad: 'Alicante', prod: 'Campañas en Meta', orig: 'c3', canal: 'wa', etapa: 3, valor: 12000, creado: 20 * D, act: 15 * D, toque: 15 * D,
        f: { sectorOk: 'e-commerce' }, s: { luego: 'febrero', luegoTxt: 'lo vería después de rebajas, cuando pase la campaña de Navidad' },
        conv: [[15 * D, 'c', 'wa', 'Ahora mismo no podemos tocar nada con Navidad encima. Después de rebajas lo vemos.']] },
      // --- En cadencia, sin respuesta todavía
      { id: 'm18', n: 'Noelia Vargas', rol: 'Socia', emp: 'Vargas Abogados', seg: 'empresa', tam: 18, ciudad: 'Madrid', prod: 'SEO', orig: 'c2', canal: 'wa', etapa: 1, valor: 9600, creado: 2 * D, act: 20 * H, toque: 2 * D - 1, f: {}, s: { intentos: 1, visitas: 2 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Noelia, soy Carla, de la agencia. ¿Qué te gustaría mejorar en la web del despacho?']] },
      { id: 'm19', n: 'Pablo Esteve', rol: 'Gerente', emp: 'Esteve Seguros', seg: 'empresa', tam: 25, ciudad: 'Castellón', prod: 'Campañas en Google', orig: 'c4', canal: 'email', etapa: 1, valor: 9600, creado: 4 * D, act: 4 * D, toque: 3 * D, f: {}, s: { intentos: 2 },
        conv: [[3 * D, 'a', 'email', 'Hola Pablo, te dejo la grabación del webinar y una pregunta: ¿cuánto os cuesta hoy cada cliente que entra por internet?']] },
      { id: 'm20', n: 'Irene Salas', rol: 'Directora', emp: 'Salas Arquitectura', seg: 'empresa', tam: 14, ciudad: 'Pamplona', prod: 'Estrategia de captación', orig: 'c1', canal: 'email', etapa: 1, valor: 9600, creado: 16 * D, act: 16 * D, toque: 9 * D, f: {}, s: { intentos: 3 },
        conv: [[16 * D, 'a', 'email', 'Hola Irene, te escribo por tu interés en la estrategia de captación…']] },
      // --- Bajo encaje
      { id: 'm21', n: 'Marisa Cano', rol: 'Propietaria', emp: 'Panadería Cano', seg: 'empresa', tam: 4, ciudad: 'Cuenca', prod: 'Redes sociales', orig: 'c3', canal: 'wa', etapa: 2, valor: 6000, creado: 3 * D, act: 2 * D, toque: 2 * D,
        f: { soloRedes: true, pptoBajo: true }, s: { auditoria: true },
        conv: [[2 * D, 'c', 'wa', 'Hola, lo que quiero es que alguien me suba fotos a Instagram un par de veces por semana. ¿Cuánto sería? Tengo unos 100 € al mes.']] },
      { id: 'm22', n: 'Javi Moreno', rol: 'Autónomo', emp: 'Moreno Fotografía', seg: 'particular', tam: 1, ciudad: 'Cádiz', prod: 'Campañas en Meta', orig: 'c4', canal: 'wa', etapa: 2, valor: 6000, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { pptoBajo: true, soloRedes: true }, s: {},
        conv: [[4 * D, 'c', 'wa', '¿Me podéis llevar el Instagram? Algo sencillo, que no tengo mucho presupuesto.']] },
      // --- Clientes y cerradas
      { id: 'm23', n: 'Alfonso Ribas', rol: 'Director General', emp: 'Ribas Electrodomésticos', seg: 'empresa', tam: 65, ciudad: 'Girona', prod: 'Campañas en Meta', orig: 'c5', canal: 'email', etapa: 6, valor: 14400, creado: 70 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { sectorOk: 'e-commerce', inversion: 6000 }, s: { exp: true, expTxt: 'Quiere sumar Google Shopping y SEO a las campañas de Meta que ya le lleváis', expValor: 9600 },
        conv: [[2 * D, 'c', 'email', 'Las campañas de Meta van muy bien. ¿Podríais llevarnos también Google Shopping y el SEO de la tienda?']] },
      { id: 'm24', n: 'Cristina León', rol: 'Fundadora', emp: 'León Fisioterapia', seg: 'empresa', tam: 20, ciudad: 'Burgos', prod: 'Campañas en Meta y Google', orig: 'c3', canal: 'wa', etapa: 6, valor: 12000, creado: 50 * D, act: 9 * D, toque: 9 * D, fin: 'ganado', f: { sectorOk: 'clínicas' }, s: {}, conv: [] },
      { id: 'm25', n: 'Hugo Pardo', rol: 'Gerente', emp: 'Pardo Joyeros', seg: 'empresa', tam: 16, ciudad: 'Córdoba', prod: 'Campañas en Meta', orig: 'c2', canal: 'email', etapa: 5, valor: 10800, creado: 55 * D, act: 30 * D, toque: 26 * D, fin: 'perdido', f: {}, s: { prop: 35 * D, propVista: 1 },
        conv: [[30 * D, 'c', 'email', 'Al final lo vamos a hacer con un freelance, que nos sale más barato. Gracias igualmente.']] }
    ]
  };
})();

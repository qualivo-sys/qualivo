/* Sector: Lean Finance, consultora financiera, contable y fiscal para pymes y startups. Preparado el 17-nov para la reunión
 * del 18-nov. Servicios tomados de leanfinance.es: Consultora ENISA (préstamo participativo «sin avales ni dilución»), CFO externo,
 * Asesoría fiscal y contable y Consultoría financiera personalizada (valoración, estrategia, preparación de ronda).
 * Sus precios no son públicos: TODOS los importes son DE EJEMPLO (expediente ENISA 3.500 €; CFO externo 1.500 €/mes, 9.000 € en
 * seis meses; asesoría 250 €/mes, 3.000 € al año; consultoría de valoración o ronda 6.000 €). Inversiones, resultados, personas,
 * empresas y mensajes también son DE EJEMPLO. Nunca se promete que ENISA se conceda: lo decide ENISA. */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };
  const f = function (c, k) { return !!(c.f && c.f[k]); };

  // Huecos reales en la semana para las historias del modo demo (minutos que ya han pasado en la historia al agendar)
  const hE = Q.hueco(10), minAntesE = 13;
  const hC = Q.hueco(12), minAntesC = 16;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.leanfinance = {
    id: 'leanfinance',
    nombre: 'Lean Finance · Consultora financiera',
    t: {
      contacto: 'empresa', contactos: 'empresas', Contactos: 'Empresas', Contacto: 'Empresa', nuevos: 'nuevas',
      venta: 'encargo', ventas: 'encargos', Ventas: 'Encargos', producto: 'servicio', Producto: 'Servicio',
      paginaVisitas: 'la página de ENISA', cita: 'llamada de diagnóstico', Cita: 'Llamada de diagnóstico', citas: 'llamadas de diagnóstico', Citas: 'Llamadas de diagnóstico', laCita: 'la llamada de diagnóstico',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'el equipo de Lean Finance', Comercial: 'Equipo de Lean Finance',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'firman', objetivoPaso: 'agendar la llamada de diagnóstico',
      casoExito: 'el testimonio de una empresa parecida', valorAlto: 6000, oportunidades: 'empresas',
      atencion: 'empresas que requieren atención', laVenta: 'el encargo', clientes: 'clientes',
      propuestas: 'propuestas', verbo: 'firmar', clientesReales: 'encargos firmados', empleados: 'empleados',
      pasoHumano: 'hacer la llamada de diagnóstico y cerrar el encargo',
      nombreAgenteVoz: 'el asistente virtual de Lean Finance'
    },
    // Recorrido: Anuncio → Test ENISA o pide información → Contactada → Cualificada → Llamada de diagnóstico → Encargo firmado → Cliente
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'solicitud', txt: 'Test ENISA o pide información' },
      { id: 'contactado', txt: 'Contactada' },
      { id: 'cualificado', txt: 'Cualificada' },
      { id: 'diagnostico', txt: 'Llamada de diagnóstico' },
      { id: 'encargo', txt: 'Encargo firmado' },
      { id: 'cliente', txt: 'Cliente', sinFuga: true }
    ],
    ventaEtapa: 'encargo',
    ticket: 3500,
    referencia: { contactado: 0.9, cualificado: 0.5, diagnostico: 0.7, encargo: 0.5 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'empresas que hacen el test o piden información y nadie las llama en horas' },
      cualificado: { txt: 'Cualificación', exp: 'solicitudes que nadie revisa: no se sabe si son elegibles ni qué necesitan de verdad' },
      diagnostico: { txt: 'Seguimiento', exp: 'empresas con encaje a las que nadie cierra la llamada de diagnóstico' },
      encargo: { txt: 'Cierre', exp: 'llamadas hechas que se quedan en «lo veo con mi socio» sin fecha' }
    },
    mesDatos: { respuestaAntes: 1260, respuestaAhora: 2, agendadas: 55 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'ENISA para startups · Financiación sin avales ni dilución', inversion: 1900, ticket: 3500,
        embudo: { anuncio: 21000, solicitud: 64, contactado: 52, cualificado: 21, diagnostico: 12, encargo: 5, cliente: 5 } },
      { id: 'c2', canal: 'Google', nombre: 'ENISA · búsquedas de préstamo ENISA', inversion: 1500, ticket: 3500,
        embudo: { anuncio: 5200, solicitud: 41, contactado: 35, cualificado: 18, diagnostico: 13, encargo: 8, cliente: 8 } },
      { id: 'c3', canal: 'Meta', nombre: 'CFO externo para pymes en crecimiento', inversion: 1100, ticket: 9000,
        embudo: { anuncio: 14000, solicitud: 23, contactado: 17, cualificado: 10, diagnostico: 6, encargo: 2, cliente: 2 } },
      { id: 'c4', canal: 'Google', nombre: 'Asesoría fiscal y contable para startups y pymes', inversion: 700, ticket: 3000,
        embudo: { anuncio: 4800, solicitud: 19, contactado: 16, cualificado: 9, diagnostico: 5, encargo: 3, cliente: 3 } },
      { id: 'c5', canal: 'Meta', nombre: 'Retargeting · guías descargables y newsletter', inversion: 450, ticket: 3500,
        embudo: { anuncio: 9500, solicitud: 27, contactado: 18, cualificado: 6, diagnostico: 3, encargo: 1, cliente: 1 } },
      { id: 'c6', canal: 'Web', nombre: 'Web, reseñas de Google y recomendación', inversion: 0, ticket: 4500,
        embudo: { anuncio: 2600, solicitud: 18, contactado: 17, cualificado: 11, diagnostico: 8, encargo: 5, cliente: 5 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Solicitudes', cualificados: 'Empresas con encaje', entrevistas: 'Llamadas de diagnóstico', ventas: 'Encargos firmados', cpv: 'Coste por encargo', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'solicitud', cualificados: 'cualificado', entrevistas: 'diagnostico' },

    reglas: {
      fitBase: 26,
      fit: [
        [function (c) { return f(c, 'constituida'); }, 8, 'sociedad constituida', 'Sociedad constituida'],
        [function (c) { return f(c, 'innovador'); }, 14, 'proyecto innovador', 'Proyecto innovador'],
        [function (c) { return f(c, 'fondos'); }, 12, 'fondos propios a la altura de lo que pide', 'Fondos propios suficientes'],
        [function (c) { return f(c, 'cuentas'); }, 8, 'cuentas depositadas', 'Cuentas depositadas'],
        [function (c) { return tieneRol(c, /gerente|ceo|director|dueñ|socio|socia|fundador|fundadora/i); }, 12, function (c) { return 'decide como ' + c.rol.toLowerCase(); }, 'Su puesto decide'],
        [function (c) { return c.seg === 'empresa' && c.tam >= 15; }, 10, function (c) { return 'pyme de ' + c.tam + ' empleados'; }, 'Pyme de 15 empleados o más'],
        [function (c) { return c.valor >= 6000; }, 6, 'CFO externo o consultoría'],
        [function (c) { return f(c, 'noInnovador') && !c.s.cruzada; }, -12, 'proyecto poco innovador para ENISA'],
        [function (c) { return f(c, 'sinCuentas'); }, -8, 'todavía sin cuentas depositadas'],
        [function (c) { return f(c, 'sinSociedad'); }, -24, 'todavía sin sociedad constituida']
      ],
      intencion: [
        [function (c) { return c.s.test; }, 12, 'hizo el test de elegibilidad de ENISA'],
        [function (c) { return !!c.s.importe; }, 6, function (c) { return 'necesita ' + c.s.importe; }],
        [function (c) { return c.s.ronda; }, 10, 'prepara una ronda o ampliación de capital'],
        [function (c) { return c.s.cruzada; }, 12, function (c) { return c.s.cruzadaTxt || 'necesita otro servicio (venta cruzada)'; }],
        [function (c) { return c.s.recurso; }, 4, 'descargó una guía o se suscribió a la newsletter']
      ]
    },

    preguntas: [
      { q: '¿Quién hizo el test de ENISA y nadie le ha llamado?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.s.test && c.etapa <= 2; }, orden: 'prob',
        intro: function (l) { return (l.length === 1 ? '1 empresa hizo' : l.length + ' empresas hicieron') + ' el test de ENISA y todavía no ha' + (l.length === 1 ? '' : 'n') + ' hablado con nadie. Es la parte de la inversión que hoy se enfría.'; }, vista: 'tabla' },
      { q: '¿Qué empresas tienen más probabilidad de firmar?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Qué anuncio trae encargos firmados, no solo formularios?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Quién dijo «más adelante» y cuándo?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return (l.length === 1 ? '1 empresa dijo' : l.length + ' empresas dijeron') + ' que lo retomaría' + (l.length === 1 ? '' : 'n') + ' más adelante, cada una con su fecha (por ejemplo, cuando deposite las cuentas). Ninguna es un no.'; }, vista: 'tabla' },
      { q: '¿Quién entró por ENISA y necesita CFO o asesoría?', h: 'lista', obj: ['expansion', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.cruzada || (c.fin === 'ganado' && !!c.s.exp); }, orden: 'valor',
        intro: function (l) { return (l.length === 1 ? '1 empresa ha dado' : l.length + ' empresas han dado') + ' señales de necesitar otro servicio: CFO externo, asesoría o preparar una ronda.'; }, vista: 'tabla' }
    ],

    historias: {
      enisa: {
        titulo: 'Un fundador hace el test de ENISA a las 22:10 y, en vez de esperar a que alguien lo revise, tiene la llamada de diagnóstico agendada antes de dormir',
        contacto: { id: 'demo', n: 'Álvaro Méndez', rol: 'CEO y cofundador', emp: 'Nubbia Labs', seg: 'empresa', ciudad: '—', prod: 'ENISA', orig: 'c1', canal: 'wa', etapa: 1, valor: 3500, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Álvaro hace el test de elegibilidad de ENISA desde un anuncio de Meta, a las 22:10', feed: 'Nuevo test de ENISA · Nubbia Labs', cambio: { s: { test: true } } },
          { dur: 6, min: 1, txt: 'El test clasifica la solicitud: sociedad constituida, proyecto innovador, fondos propios y cuentas depositadas', feed: 'Test completado · encaje A · pide 150.000 €', cambio: { tam: 9, ciudad: 'Valencia', f: { constituida: true, innovador: true, fondos: true, cuentas: true }, s: { importe: '150.000 €' } } },
          { dur: 6, min: 1, txt: 'En el minuto uno le llega un WhatsApp, con su nombre y una sola pregunta', feed: 'WhatsApp enviado en 49 segundos', cambio: { conv: ['a', 'wa', 'Hola Álvaro, soy el asistente virtual de Lean Finance. Hemos recibido el test de Nubbia Labs y, por lo que nos cuentas, cumplís lo básico. Para orientarte bien: ¿para cuándo necesitaríais la financiación?'] }, toque: true },
          { dur: 7, min: 6, txt: 'Álvaro contesta: la quiere antes de verano y está cerrando una ronda pequeña', feed: 'Respuesta recibida · intención al alza', cambio: { etapa: 2, s: { ronda: true, urg: true, urgTxt: 'quiere la financiación antes de verano' }, conv: ['c', 'wa', 'Antes de verano. Estamos cerrando una ronda pequeña con business angels y queremos completarla con ENISA, sin diluir más.'] }, act: true },
          { dur: 7, min: 1, txt: 'Una pregunta más para preparar la llamada, sin interrogatorio', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Tiene sentido: ENISA se suele combinar con rondas así. ¿Tenéis ya plan de negocio y previsiones a tres años, o habría que prepararlos?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Álvaro da el dato que importa y pregunta el precio', feed: 'Tiene previsiones en Excel · pregunta el precio', cambio: { s: { precio: true }, conv: ['c', 'wa', 'Tenemos un Excel con previsiones, pero no sé si sirve para ENISA. ¿Cuánto cuesta que lo llevéis vosotros?'] }, act: true },
          { dur: 6, min: 1, txt: 'Se le agenda la llamada de diagnóstico con el equipo', feed: 'Llamada de diagnóstico agendada · ' + hE.txt + ' 10:00', vista: 'agenda', toque: true,
            cambio: { etapa: 4, s: { cita: hE.min - minAntesE, citaOk: true }, conv: ['a', 'wa', 'El precio depende del expediente y te lo cuenta el equipo en la llamada. Te dejo una llamada de diagnóstico de 20 minutos con el equipo de Lean Finance el ' + hE.txt + ' a las 10:00. Si puedes, ten a mano ese Excel.'] } },
          { dur: 7, min: Math.max(60, hE.min - minAntesE), txt: 'El ' + hE.txt + ', el equipo hace la llamada de diagnóstico con toda la ficha delante', feed: 'Llamada de diagnóstico hecha · encaja para ENISA', persona: true, toque: true,
            cambio: { conv: ['h', 'wa', 'Álvaro, gracias por la llamada. Como te contaba, te envío la propuesta para preparar el expediente de ENISA y la lista de documentos que necesitamos.'] } },
          { dur: 7, min: D, txt: 'Álvaro firma el encargo del expediente', feed: 'Encargo firmado · expediente ENISA', persona: true, act: true,
            cambio: { etapa: 5, conv: ['c', 'wa', 'Firmado. Os mando las cuentas y el Excel esta tarde.'] } },
          { dur: 0, min: 5, txt: 'Aviso al equipo para preparar y presentar el expediente', feed: 'Aviso enviado al equipo · preparar expediente ENISA', humano: { titulo: 'Nubbia Labs ha firmado: a preparar el expediente', texto: 'S.L. de 9 personas · proyecto innovador · fondos propios y cuentas depositadas · pide 150.000 € · ronda con business angels en curso · lo quiere antes de verano · trae previsiones en Excel. Siguiente paso: plan de negocio y presentación del expediente. La concesión la decide ENISA.' } }
        ]
      },
      cfo: {
        titulo: 'Una pyme pide ENISA, todavía no es elegible y el sistema detecta que lo que necesita es un CFO externo',
        contacto: { id: 'demo', n: 'Laura Sanz', rol: 'Gerente y socia', emp: 'Envases Ribera', seg: 'empresa', ciudad: '—', prod: 'ENISA', orig: 'c2', canal: 'wa', etapa: 1, valor: 3500, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Laura hace el test de ENISA desde un anuncio de Google', feed: 'Nuevo test de ENISA · Envases Ribera', cambio: { s: { test: true } } },
          { dur: 6, min: 1, txt: 'El test marca dos frenos: proyecto poco innovador y fondos propios por debajo de lo que pide', feed: 'Test completado · ENISA hoy difícil (C) · pide 300.000 €', cambio: { tam: 28, ciudad: 'Logroño', f: { constituida: true, cuentas: true, noInnovador: true }, s: { importe: '300.000 €' } } },
          { dur: 7, min: 1, txt: 'El asistente le escribe en el minuto uno, sin descartarla', feed: 'WhatsApp enviado en 55 segundos', cambio: { conv: ['a', 'wa', 'Hola Laura, soy el asistente virtual de Lean Finance. Gracias por el test. Te soy sincero: con lo que indicas, hoy ENISA sería difícil, porque pide un proyecto innovador y fondos propios a la altura del préstamo. Antes de descartar nada: ¿para qué necesitáis la financiación?'] }, toque: true },
          { dur: 7, min: 8, txt: 'Laura contesta: crecen, pero van justos de caja y no saben dónde se va el margen', feed: 'Respuesta recibida · caja justa y margen sin controlar', cambio: { etapa: 2, conv: ['c', 'wa', 'Para una línea nueva de envasado. Facturamos unos 4 millones y crecemos, pero vamos justos de caja y no sé bien dónde se nos va el margen.'] }, act: true },
          { dur: 7, min: 1, txt: 'Una pregunta para entender quién lleva hoy las finanzas', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Entendido. ¿Quién lleva hoy las finanzas: una gestoría, alguien de dentro o tú misma?'] }, toque: true },
          { dur: 8, min: 4, txt: 'Laura da la señal: impuestos en la gestoría y el resto en un Excel', feed: 'Señal de venta cruzada · necesita CFO externo', cambio: { prod: 'CFO externo', valor: 9000, s: { cruzada: true, cruzadaTxt: 'entró por ENISA y necesita un CFO externo', urg: true, urgTxt: 'va justa de caja con una línea nueva en marcha' }, conv: ['c', 'wa', 'La gestoría hace los impuestos y yo lo demás con un Excel. Y al banco le cuesta entender nuestros números.'] }, act: true },
          { dur: 7, min: 1, txt: 'El sistema cambia de servicio y le propone hablar de CFO externo', feed: 'Llamada de diagnóstico agendada · CFO externo · ' + hC.txt + ' 12:00', vista: 'agenda', toque: true,
            cambio: { etapa: 4, s: { cita: hC.min - minAntesC, citaOk: true }, conv: ['a', 'wa', 'Lo que cuentas es justo lo que resuelve un CFO externo: previsión de tesorería, margen por línea y unos números que el banco entienda. Y si más adelante encajáis en ENISA, se prepara desde ahí. Te dejo una llamada de diagnóstico con el equipo el ' + hC.txt + ' a las 12:00.'] } },
          { dur: 6, min: 3, txt: 'Laura confirma y pregunta el precio', feed: 'Llamada confirmada · pregunta el precio', cambio: { s: { precio: true }, conv: ['c', 'wa', 'Me va bien. ¿Cuánto cuesta un CFO externo?'] }, act: true },
          { dur: 7, min: 1, txt: 'El asistente no inventa precios: lo deja para la llamada', feed: 'Respuesta enviada · el precio se lo cuenta el equipo', cambio: { conv: ['a', 'wa', 'Depende de las horas y de lo que necesitéis, así que te lo cuenta el equipo en la llamada, con números concretos. ¡Hablamos el ' + hC.txt + '!'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso al equipo de CFO externo con la ficha completa', feed: 'Aviso enviado al equipo de Lean Finance', humano: { titulo: 'Laura necesita un CFO externo (ENISA, más adelante)', texto: 'Envases Ribera · 28 empleados · unos 4 M € de facturación · entró por ENISA y hoy no encaja: proyecto poco innovador y fondos propios por debajo de lo que pide · caja justa con una línea nueva · finanzas en gestoría y Excel · el banco no entiende sus números. Llamada de diagnóstico el ' + hC.txt + ' a las 12:00. Pregunta el precio: se lo da el equipo.' } }
        ]
      }
    },
    historiaDefecto: 'enisa',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'l01', n: 'Marta Iglesias', rol: 'CEO y cofundadora', emp: 'Klimb Analytics', seg: 'empresa', tam: 7, ciudad: 'Madrid', prod: 'ENISA', orig: 'c1', canal: 'wa', etapa: 3, valor: 3500, creado: 2 * D, act: 25, toque: 40,
        f: { constituida: true, innovador: true, fondos: true, cuentas: true }, s: { test: true, importe: '200.000 €', ronda: true, visitas: 3, precio: true, urg: true, urgTxt: 'quiere presentar el expediente antes de fin de año', resp: true },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Marta, soy el asistente virtual de Lean Finance. ¿Para cuándo necesitaríais la financiación?'], [2 * D - 40, 'c', 'wa', 'Cuanto antes. Cerramos ronda en diciembre y queremos sumar ENISA.'], [45, 'c', 'wa', '¿Podemos hablar esta semana? Quiero presentarlo antes de fin de año.']],
        ev: [[25, 'web', 'Vuelve a la página de ENISA']] },
      { id: 'l02', n: 'Jordi Puig', rol: 'Fundador', emp: 'Vetia Health', seg: 'empresa', tam: 12, ciudad: 'Barcelona', prod: 'ENISA', orig: 'c2', canal: 'email', etapa: 4, valor: 3500, creado: 9 * D, act: 5 * H, toque: 5 * D,
        f: { constituida: true, innovador: true, fondos: true, cuentas: true }, s: { test: true, importe: '300.000 €', prop: 5 * D, propVista: 3, visitas: 2 },
        conv: [[9 * D, 'c', 'email', 'Hemos hecho el test de ENISA. Somos una medtech con 12 personas y queremos financiar el marcado CE.'], [5 * D, 'h', 'email', 'Te envío la propuesta para preparar el expediente, como hablamos en la llamada.']],
        ev: [[5 * H, 'web', 'Abre la propuesta por tercera vez']] },
      { id: 'l03', n: 'Raúl Domínguez', rol: 'Gerente', emp: 'Mecanizados Domínguez', seg: 'empresa', tam: 45, ciudad: 'Bilbao', prod: 'CFO externo', orig: 'c3', canal: 'wa', etapa: 3, valor: 9000, creado: 26 * H, act: 17, toque: 20,
        f: { constituida: true, cuentas: true }, s: { visitas: 3, precio: true },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Raúl, soy el asistente virtual de Lean Finance. ¿Qué te gustaría tener más claro en las finanzas de la empresa?'], [25 * H, 'c', 'wa', 'Crecemos, pero no sé si ganamos dinero en cada pedido.'], [17, 'c', 'wa', '¿Cómo funciona lo del CFO externo? ¿Cuántas horas al mes?']] },
      { id: 'l04', n: 'Paula Navarro', rol: 'CEO', emp: 'Doce Grados', seg: 'empresa', tam: 5, ciudad: 'Valencia', prod: 'ENISA', orig: 'c1', canal: 'wa', etapa: 1, valor: 3500, creado: 12, act: 12, toque: null,
        f: { constituida: true, innovador: true }, s: { test: true, importe: '75.000 €' }, conv: [] },
      { id: 'l05', n: 'Sergio Lozano', rol: 'CEO', emp: 'Fintrail', seg: 'empresa', tam: 16, ciudad: 'Madrid', prod: 'Consultoría financiera · ronda', orig: 'c6', canal: 'tel', etapa: 1, valor: 6000, creado: 34, act: 34, toque: null,
        f: { constituida: true, innovador: true, cuentas: true }, s: { ronda: true }, conv: [] },
      { id: 'l06', n: 'Nuria Castell', rol: 'Cofundadora', emp: 'Brotes Kids', seg: 'empresa', tam: 6, ciudad: 'Girona', prod: 'ENISA', orig: 'c1', canal: 'email', etapa: 4, valor: 3500, creado: 11 * D, act: 3 * D, toque: 3 * D,
        f: { constituida: true, innovador: true, cuentas: true }, s: { test: true, importe: '100.000 €', noshow: true, precio: true, visitas: 3 },
        conv: [[11 * D, 'a', 'email', 'Hola Nuria, te escribo por el test de ENISA de Brotes Kids.'], [10 * D, 'c', 'email', 'Nos interesa para lanzar la versión para colegios.'], [4 * D, 'a', 'email', 'Te espera el equipo mañana a las 17:00 por videollamada.']],
        ev: [[3 * D, 'sistema', 'No se presenta a la llamada de diagnóstico']] },
      { id: 'l07', n: 'Iván Ortega', rol: 'Gerente', emp: 'Climatec Levante', seg: 'empresa', tam: 22, ciudad: 'Alicante', prod: 'Asesoría fiscal y contable', orig: 'c4', canal: 'wa', etapa: 2, valor: 3000, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { constituida: true, cuentas: true }, s: { visitas: 2, precio: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Iván, ¿buscáis cambiar de asesoría o es para una empresa nueva?'], [4 * D, 'c', 'wa', 'Cambiar. La actual solo nos presenta impuestos. ¿Precio?'], [4 * D - 5, 'a', 'wa', 'Depende del volumen de facturas y te lo cuenta el equipo. ¿Lo vemos en 15 minutos?']] },
      // --- Dijeron «más adelante»
      { id: 'l08', n: 'Alba Ferrer', rol: 'CEO', emp: 'Rutana Mobility', seg: 'empresa', tam: 8, ciudad: 'Barcelona', prod: 'ENISA', orig: 'c2', canal: 'wa', etapa: 3, valor: 3500, creado: 40 * D, act: 32 * D, toque: 32 * D,
        f: { constituida: true, innovador: true, sinCuentas: true }, s: { test: true, importe: '120.000 €', luego: 'julio', luegoTxt: 'lo retoma cuando deposite las cuentas de este año' },
        conv: [[32 * D, 'c', 'wa', 'Somos de este año y aún no tenemos cuentas depositadas. Lo retomamos en julio, cuando las presentemos.']] },
      { id: 'l09', n: 'Héctor Gil', rol: 'Socio fundador', emp: 'Gil & Ramos Arquitectura', seg: 'empresa', tam: 14, ciudad: 'Sevilla', prod: 'CFO externo', orig: 'c3', canal: 'email', etapa: 3, valor: 9000, creado: 30 * D, act: 28 * D, toque: 28 * D,
        f: { constituida: true, cuentas: true }, s: { luego: 'enero', luegoTxt: 'después del cierre del año, con el presupuesto nuevo' },
        conv: [[28 * D, 'c', 'email', 'Ahora estamos con el cierre. En enero, sin falta.']] },
      // --- Sin seguimiento después de contestar
      { id: 'l10', n: 'Óscar Benítez', rol: 'CEO', emp: 'Pliego Software', seg: 'empresa', tam: 10, ciudad: 'Málaga', prod: 'ENISA', orig: 'c5', canal: 'wa', etapa: 3, valor: 3500, creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: { constituida: true, innovador: true, fondos: true }, s: { test: true, importe: '150.000 €', visitas: 2 },
        conv: [[8 * D, 'a', 'wa', 'Hola Óscar, ¿para cuándo necesitaríais la financiación?'], [7 * D, 'c', 'wa', 'Para el primer trimestre. Queremos contratar dos desarrolladores.'], [5 * D, 'h', 'wa', 'Te llamo esta semana y lo vemos.']] },
      { id: 'l16', n: 'Víctor Salas', rol: 'Gerente', emp: 'Panificadora Salas', seg: 'empresa', tam: 40, ciudad: 'Valladolid', prod: 'CFO externo (entró por ENISA)', orig: 'c2', canal: 'wa', etapa: 3, valor: 9000, creado: 6 * D, act: 3 * D, toque: 3 * D,
        f: { constituida: true, cuentas: true, noInnovador: true }, s: { test: true, importe: '250.000 €', cruzada: true, cruzadaTxt: 'entró por ENISA y necesita un CFO externo' },
        conv: [[6 * D, 'a', 'wa', 'Hola Víctor, con lo que indicas, hoy ENISA sería difícil. ¿Para qué necesitáis la financiación?'], [3 * D, 'c', 'wa', 'Si no es ENISA, ¿qué podemos hacer? Nos falta orden en los números.']] },
      { id: 'l11', n: 'Lidia Romero', rol: 'Diseñadora autónoma', seg: 'particular', ciudad: 'Zaragoza', prod: 'ENISA', orig: 'c5', canal: 'wa', etapa: 2, valor: 3500, creado: 10 * D, act: 7 * D, toque: 7 * D,
        f: { sinSociedad: true }, s: { recurso: true },
        conv: [[10 * D, 'c', 'wa', '¿ENISA vale para autónomos?'], [7 * D, 'h', 'wa', 'Pide sociedad constituida. Te paso la guía.']] },
      // --- Nuevas o sin respuesta
      { id: 'l12', n: 'Gonzalo Prieto', rol: 'Fundador', emp: 'Hidroponia Urbana', seg: 'empresa', tam: 4, ciudad: 'Murcia', prod: 'ENISA', orig: 'c2', canal: 'wa', etapa: 1, valor: 3500, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { constituida: true, innovador: true }, s: { test: true, intentos: 1 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Gonzalo, soy el asistente virtual de Lean Finance. ¿Tienes un minuto para tu test de ENISA?']] },
      { id: 'l13', n: 'Sara Molina', rol: 'Estudiante de máster', seg: 'particular', ciudad: 'Granada', prod: 'ENISA', orig: 'c5', canal: 'wa', etapa: 1, valor: 3500, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { sinSociedad: true }, s: { recurso: true, intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Sara, ¿tenéis ya la sociedad constituida?']] },
      // --- Ya clientes
      { id: 'l14', n: 'Pedro Almagro', rol: 'CEO', emp: 'Sensia Agro', seg: 'empresa', tam: 18, ciudad: 'Lleida', prod: 'ENISA', orig: 'c1', canal: 'wa', etapa: 5, valor: 3500, creado: 60 * D, act: 8 * D, toque: 8 * D, fin: 'ganado',
        f: { constituida: true, innovador: true, fondos: true, cuentas: true }, s: { exp: true, expTxt: 'Con el expediente ya presentado, pregunta por un CFO externo' },
        conv: [[8 * D, 'c', 'wa', 'Ahora que crecemos, ¿nos podríais llevar también las finanzas?']] },
      { id: 'l15', n: 'Carla Montero', rol: 'Directora general', emp: 'Montero Logística', seg: 'empresa', tam: 35, ciudad: 'Valencia', prod: 'Asesoría fiscal y contable', orig: 'c6', canal: 'email', etapa: 5, valor: 3000, creado: 90 * D, act: 10 * D, toque: 10 * D, fin: 'ganado',
        f: { constituida: true, cuentas: true }, s: { exp: true, expTxt: 'Quiere preparar una ronda y pide una valoración de la empresa' },
        conv: [[10 * D, 'c', 'email', 'Estamos pensando en abrir capital. ¿Nos ayudaríais con la valoración?']] }
    ]
  };
})();

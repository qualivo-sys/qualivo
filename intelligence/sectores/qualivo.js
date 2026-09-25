/* Qualivo usando su propio sistema: «Intelligence System · Qualivo».
 * Recorrido, preguntas del formulario, agentes y reglas de puntuación son los
 * reales (api/meta-leadform.js, api/_scoring.js, api/_tratos.js, api/_agente.js).
 * Los contactos y las cifras son INVENTADOS: el repositorio es público y aquí no
 * entra nada del CRM real. */
(function () {
  const H = 60, D = 1440;
  const INV = { nada: 'Nada todavía', menos500: 'Menos de 500 €', '500_2000': 'Entre 500 y 2.000 €', '2000_5000': 'Entre 2.000 y 5.000 €', mas5000: 'Más de 5.000 €' };
  const FUGA = { anuncios: 'en los anuncios y la captación', web: 'en la web y los formularios', respuesta: 'en el tiempo de respuesta', seguimiento: 'en el seguimiento y los presupuestos', nose: '«no lo sé, eso es lo que quiero averiguar»' };
  const nivel = function (c) {
    // Réplica de _scoring.js: tipología (lo que es) y comportamiento (lo que hace), de 0 a 10
    const x = c.x; if (!x) return '';
    const t = x.fit >= 60, k = x.comp >= 50;
    if (c.s.intentos >= 3 && !window.QV.motor.contesto(c)) return 'D';
    return t && k ? 'A' : t ? 'B' : k ? 'C' : 'D';
  };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.qualivo = {
    id: 'qualivo',
    nombre: 'Qualivo',
    t: {
      contacto: 'oportunidad', contactos: 'oportunidades', Contactos: 'Oportunidades', Contacto: 'Oportunidad',
      venta: 'cliente', ventas: 'clientes', Ventas: 'Clientes (piloto o sistema)', producto: 'servicio',
      paginaVisitas: 'la web de Qualivo', txtPrecio: 'preguntó por el precio', cita: 'diagnóstico', Cita: 'Diagnóstico', laCita: 'el diagnóstico',
      propuesta: 'el plan por escrito', Propuesta: 'Plan por escrito', comercial: 'Maikel', Comercial: 'Maikel',
      cs: 'Maikel', CS: 'Maikel', agenteVoz: 'Raquel (agente de voz)', llamadaVoz: 'Llamada de Raquel',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'pasan a piloto', objetivoPaso: 'agendar el diagnóstico',
      casoExito: 'el caso más parecido', valorAlto: 3000, oportunidades: 'oportunidades',
      laVenta: 'el piloto', Producto: 'Servicio', clientes: 'clientes', propuestas: 'planes', verbo: 'pasar a piloto',
      clientesReales: 'clientes de verdad', empleados: 'empleados', nuevos: 'nuevas', pasoHumano: 'hacer el diagnóstico y enseñarle dónde se le escapa el negocio',
      notaTitulo: 'Qué cambiaría esta semana en las campañas', notaBoton: 'Redactar la nota de campañas',
      notaIntro: 'Esto es lo que cambiaría esta semana en nuestras campañas, cruzando cada una con lo que pasa después.',
      preguntaNota: '¿Qué cambiaríamos esta semana en las campañas?', notaAsunto: 'Asunto: Campañas de Qualivo · qué cambiar', notaCorreo: 'Nota de campañas',
      anunciosIntro: 'Las campañas de Qualivo, unidas con lo que pasa después: quién contesta, quién habla con Raquel, quién coge el diagnóstico y quién pasa a piloto. Se optimiza a cliente, no a formulario.'
    },
    // Recorrido real: formulario → cadencia (WhatsApp, Raquel, correo) → conversación → diagnóstico → plan → piloto
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'formulario', txt: 'Formulario' },
      { id: 'contactado', txt: 'Contesta' },
      { id: 'diagnostico', txt: 'Diagnóstico agendado' },
      { id: 'asiste', txt: 'Diagnóstico hecho' },
      { id: 'plan', txt: 'Plan enviado' },
      { id: 'cliente', txt: 'Piloto o cliente' }
    ],
    ventaEtapa: 'cliente',
    ticket: 4800,
    referencia: { contactado: 0.6, diagnostico: 0.45, asiste: 0.8, plan: 0.9, cliente: 0.3 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'gente que rellena el formulario y no contesta ni al WhatsApp ni a Raquel' },
      diagnostico: { txt: 'Paso a diagnóstico', exp: 'conversaciones que no llegan a coger hora' },
      asiste: { txt: 'Plantones', exp: 'diagnósticos agendados a los que no se presentan' },
      plan: { txt: 'Plan por escrito', exp: 'diagnósticos hechos sin plan enviado en 48 horas' },
      cliente: { txt: 'Paso a piloto', exp: 'planes enviados que no pasan a piloto' }
    },
    remedioFuga: {
      contactado: 'WhatsApp del agente en el minuto uno con la frase del formulario, llamada de Raquel si no contesta y correo como último intento. Luego reenganche con contexto, sin plantillas.',
      asiste: 'Recordatorio el mismo día con el enlace y, si se reservó con antelación, otro la víspera pidiendo confirmación. Al que no viene, dos huecos nuevos por WhatsApp.'
    },
    mesDatos: { respuestaAntes: 95, respuestaAhora: 1, agendadas: 29 },
    campanas: [
      { id: 'q1', canal: 'Meta', nombre: 'Formulario · diagnóstico gratuito', inversion: 1400, ticket: 4800, embudo: { anuncio: 3900, formulario: 96, contactado: 44, diagnostico: 14, asiste: 10, plan: 9, cliente: 2 } },
      { id: 'q2', canal: 'Meta', nombre: 'Radiografía de 90 segundos', inversion: 600, ticket: 4800, embudo: { anuncio: 2100, formulario: 58, contactado: 19, diagnostico: 4, asiste: 3, plan: 3, cliente: 0 } },
      { id: 'q3', canal: 'Web', nombre: 'Prueba tu agente (qualivo.io/prueba)', inversion: 0, ticket: 4800, embudo: { anuncio: 900, formulario: 24, contactado: 15, diagnostico: 6, asiste: 5, plan: 5, cliente: 1 } },
      { id: 'q4', canal: 'LinkedIn', nombre: 'Contenido y referidos', inversion: 0, ticket: 6000, embudo: { anuncio: 400, formulario: 11, contactado: 9, diagnostico: 5, asiste: 5, plan: 4, cliente: 2 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'niveles'],
    kpiNombres: { interesados: 'Formularios', cualificados: 'Contestan', entrevistas: 'Diagnósticos hechos', ventas: 'Pilotos y clientes', cpv: 'Coste por cliente', ingresos: 'Facturación firmada' },
    kpiEtapas: { interesados: 'formulario', cualificados: 'contactado', entrevistas: 'asiste' },
    kpiCustom: function (m, cfg, Mo, est) {
      const cs = ((est && est.contactos) || []).filter(function (c) { return !c.fin; });
      const n = { A: 0, B: 0, C: 0, D: 0 };
      cs.forEach(function (c) { const v = nivel(c); if (v) n[v]++; });
      return { niveles: { l: 'Niveles A · B · C · D', v: n.A + ' · ' + n.B + ' · ' + n.C + ' · ' + n.D, em: 'A: aviso a Maikel al momento', clase: 'bien' } };
    },

    // Tipología de _scoring.js (inversión declarada, peticiones al mes, sector), en 0-100
    reglas: {
      fitBase: 16,
      fit: [
        [function (c) { return /2000_5000|mas5000/.test(c.f.inv || ''); }, 32, function (c) { return 'invierte ' + INV[c.f.inv].toLowerCase(); }, 'Invierte más de 2.000 € al mes'],
        [function (c) { return c.f.inv === '500_2000'; }, 24, 'invierte entre 500 y 2.000 €', 'Invierte de 500 a 2.000 €'],
        [function (c) { return c.f.inv === 'menos500'; }, 8, 'invierte menos de 500 €', 'Invierte menos de 500 €'],
        [function (c) { return c.f.inv === 'nada'; }, -10, 'todavía no invierte', 'No invierte todavía'],
        [function (c) { return c.f.vol >= 50; }, 20, function (c) { return c.f.vol + ' peticiones al mes'; }, 'Más de 50 peticiones al mes'],
        [function (c) { return c.f.vol >= 20 && c.f.vol < 50; }, 14, function (c) { return c.f.vol + ' peticiones al mes'; }, '20 a 50 peticiones al mes'],
        [function (c) { return c.f.vol > 0 && c.f.vol < 5; }, -8, 'menos de 5 peticiones al mes', 'Menos de 5 peticiones al mes'],
        [function (c) { return /clinica|formacion|reformas|asesoria/.test(c.f.sector || ''); }, 14, function (c) { return 'sector con casos (' + { clinica: 'clínica', formacion: 'formación', reformas: 'reformas', asesoria: 'asesoría' }[c.f.sector] + ')'; }, 'Clínica, formación, reformas o asesoría'],
        [function (c) { return c.f.sector && !/clinica|formacion|reformas|asesoria/.test(c.f.sector); }, -6, 'sector fuera de las verticales', 'Sector fuera de las verticales']
      ],
      // Comportamiento de _scoring.js: habló con Raquel, cogió cita…
      comportamiento: [
        [function (c) { return c.s.raquel; }, 18, 'habló con Raquel']
      ],
      intencion: [
        [function (c) { return c.f.fuga && c.f.fuga !== 'nose'; }, 8, function (c) { return 'dice que se le escapa ' + FUGA[c.f.fuga]; }],
        [function (c) { return c.s.raquel; }, 10, 'la llamada con Raquel fue bien']
      ]
    },

    preguntas: [
      { q: '¿Qué oportunidades son nivel A ahora mismo?', h: 'lista', obj: ['ventas', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && nivel(c) === 'A'; }, orden: 'prob',
        intro: function (l, T, Mo) { return Mo.pl(l.length, 'oportunidad es', 'oportunidades son') + ' nivel A: tipología de 6 o más y comportamiento de 5 o más. Son las que llegan a Maikel al momento.'; },
        cols: ['nombre', ['Inversión', function (c) { return INV[c.f.inv] || '—'; }], 'accion'], vista: 'tabla' },
      { q: '¿Quién contestó y se quedó ahí?', h: 'lista', obj: ['seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && window.QV.motor.contesto(c) > 0 && c.x.k.toque > 1440 && !c.s.tCita && !c.s.luego; }, orden: 'prob',
        intro: function (l, T, Mo) { return Mo.pl(l.length, 'oportunidad contestó', 'oportunidades contestaron') + ' y la conversación se paró. El reenganche les escribe en su contexto: al día, a los 3 días y a los 5, y después se descarta.'; },
        cols: ['nombre', 'sinSeg', 'accion'], vista: 'tabla' },
      { q: '¿Qué planes por escrito están sin respuesta?', h: 'lista', obj: ['ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return c.s.tProp != null && !c.fin; }, orden: 'valor', suma: true,
        intro: function (l, T, Mo) { return Mo.pl(l.length, 'plan enviado', 'planes enviados') + ' sin respuesta, por ' + Mo.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '. Es la parte donde ya se hizo todo el trabajo.'; },
        cols: ['nombre', ['Abierto', function (c) { return (c.s.propVista || 0) + ' veces'; }], 'valor', 'accion'], vista: 'tabla' },
      { q: '¿Dónde dicen que se les escapa el negocio?', h: 'lista', obj: ['captacion', 'todo'],
        filtro: function (c) { return !!c.f.fuga && !c.fin; }, orden: 'prio',
        intro: function (l, T, Mo) {
          const n = {}; l.forEach(function (c) { n[c.f.fuga] = (n[c.f.fuga] || 0) + 1; });
          const top = Object.keys(n).sort(function (a, b) { return n[b] - n[a]; });
          return 'Lo que contestan en el formulario: ' + top.map(function (k) { return n[k] + ' ' + FUGA[k]; }).join(', ') + '. Es el material para los anuncios y para abrir cada diagnóstico.';
        },
        cols: ['nombre', ['Dónde se le escapa', function (c) { return FUGA[c.f.fuga]; }], 'prio'], vista: 'tabla' }
    ],

    historias: {
      formulario: {
        titulo: 'Un formulario de Meta a las diez de la noche',
        contacto: { id: 'demo', n: 'Andrea Molina', rol: 'Gerente', emp: 'Clínica Fisio Levante', seg: 'lead', ciudad: '—', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'wa', etapa: 1, valor: 4800, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra un formulario de Meta: diagnóstico gratuito', feed: 'Formulario recibido · diagnóstico gratuito', cambio: {} },
          { dur: 6, min: 1, txt: 'Llegan sus respuestas: invierte 500-2.000 €, 35 peticiones al mes, se le escapa en el seguimiento', feed: 'Tipología calculada · clínica · 35 peticiones', cambio: { ciudad: 'Valencia', f: { inv: '500_2000', vol: 35, sector: 'clinica', fuga: 'seguimiento' } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp le escribe con su frase del formulario', feed: 'WhatsApp enviado en 1 minuto', cambio: { conv: ['a', 'wa', 'Hola Andrea, soy Maikel, de Qualivo. Me dices que se te escapa en el seguimiento y los presupuestos. ¿Es más lo que tardáis en contestar o los presupuestos que nadie persigue?'] }, toque: true },
          { dur: 7, min: 40, txt: 'No contesta: al día siguiente, dentro de su franja, llama Raquel', feed: 'Llamada de Raquel · 3 min 40 s', cambio: { s: { raquel: true }, conv: ['v', 'voz', 'Raquel: Andrea confirma unas 35 peticiones al mes y que los presupuestos se quedan sin seguimiento. Le interesa ver el diagnóstico.'] }, toque: true },
          { dur: 7, min: 3, txt: 'Andrea contesta al WhatsApp después de la llamada', feed: 'Respuesta recibida · nivel A', cambio: { etapa: 2, s: { urg: true, urgTxt: 'quiere arreglarlo antes de la campaña de enero' }, conv: ['c', 'wa', 'Lo de los presupuestos. Mandamos muchos y no sé qué pasa con ellos. Me gustaría arreglarlo antes de la campaña de enero.'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente propone dos huecos concretos', feed: 'Dos huecos propuestos', cambio: { conv: ['a', 'wa', 'Tiene arreglo y se ve rápido en tus números. ¿Te va mejor el jueves a las 10:00 o el viernes a las 12:30? Son 15 minutos.'] }, toque: true },
          { dur: 6, min: 2, txt: 'Andrea elige hora y el agente reserva', feed: 'Diagnóstico reservado · jueves 10:00', cambio: { etapa: 3, s: { cita: 1500, citaOk: true }, conv: ['c', 'wa', 'El jueves a las 10:00.'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso a Maikel: nivel A con diagnóstico reservado', feed: 'Aviso enviado a Maikel', humano: { titulo: 'Andrea es nivel A: diagnóstico el jueves a las 10:00', texto: 'Clínica · 500-2.000 € al mes · 35 peticiones · se le escapa en los presupuestos sin seguimiento · habló con Raquel · quiere arreglarlo antes de enero. Caso para citar: Nuria Roure.' } }
        ]
      }
    },
    historiaDefecto: 'formulario',

    contactos: [
      { id: 'q01', n: 'Ramón Ferrer', rol: 'Gerente', emp: 'Reformas Integrales Turia', seg: 'lead', ciudad: 'Valencia', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'wa', etapa: 2, valor: 6000, creado: 2 * D, act: 25, toque: 3 * H,
        f: { inv: '2000_5000', vol: 60, sector: 'reformas', fuga: 'seguimiento' }, s: { raquel: true, precio: true },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Ramón, soy Maikel, de Qualivo. Me dices que se te escapa en los presupuestos. ¿Cuántos mandáis al mes, más o menos?'], [1 * D, 'v', 'voz', 'Raquel: unos 60 presupuestos al mes, sin seguimiento ordenado. Pide hablar con Maikel.'], [3 * H, 'a', 'wa', '¿Te va mejor mañana a las 10:00 o el jueves a las 16:30?'], [25, 'c', 'wa', 'Mañana. Y dime más o menos qué cuesta, que quiero tenerlo claro antes.']] },
      { id: 'q02', n: 'Sonia Gil', rol: 'Directora', emp: 'Academia Idiomas Norte', seg: 'lead', ciudad: 'Bilbao', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'wa', etapa: 3, valor: 4800, creado: 3 * D, act: 5 * H, toque: 5 * H,
        f: { inv: '500_2000', vol: 40, sector: 'formacion', fuga: 'respuesta' }, s: { cita: 20 * H, citaOk: false },
        conv: [[3 * D, 'a', 'wa', 'Hola Sonia, soy Maikel. Dices que se os va en lo que tardáis en contestar. ¿Quién contesta ahora las peticiones?'], [2 * D, 'c', 'wa', 'Yo cuando puedo, que es tarde.'], [5 * H, 'a', 'wa', 'Te dejo el diagnóstico mañana a las 11:00. Te llega la invitación al correo.']] },
      { id: 'q03', n: 'Luis Parra', rol: 'Socio', emp: 'Asesoría Parra & Vidal', seg: 'lead', ciudad: 'Madrid', prod: 'Diagnóstico gratuito', orig: 'q4', canal: 'email', etapa: 5, valor: 6000, creado: 20 * D, act: 2 * D, toque: 4 * D,
        f: { inv: '500_2000', vol: 25, sector: 'asesoria', fuga: 'seguimiento' }, s: { prop: 4 * D, propVista: 3 },
        conv: [[4 * D, 'h', 'email', 'Luis, te mando el plan por escrito con las tres fugas por orden de impacto.'], [2 * D, 'c', 'email', 'Gracias, muy claro. Lo comento con mi socio esta semana.']] },
      { id: 'q04', n: 'Marta Soler', rol: 'Gerente', emp: 'Centro Estético Brisa', seg: 'lead', ciudad: 'Alicante', prod: 'Radiografía', orig: 'q2', canal: 'wa', etapa: 1, valor: 4800, creado: 14, act: 14, toque: null, f: { inv: '500_2000', vol: 30, sector: 'clinica', fuga: 'nose' }, s: {}, conv: [] },
      { id: 'q05', n: 'Jordi Casals', rol: 'Director Comercial', emp: 'Instalaciones Casals', seg: 'lead', ciudad: 'Girona', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'tel', etapa: 1, valor: 6000, creado: 50, act: 50, toque: null, f: { inv: '2000_5000', vol: 45, sector: 'reformas', fuga: 'respuesta' }, s: {}, conv: [] },
      { id: 'q06', n: 'Elena Crespo', rol: 'Directora', emp: 'Clínica Dental Crespo', seg: 'lead', ciudad: 'Murcia', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'wa', etapa: 3, valor: 4800, creado: 8 * D, act: 3 * D, toque: 3 * D,
        f: { inv: '500_2000', vol: 50, sector: 'clinica', fuga: 'seguimiento' }, s: { noshow: true },
        conv: [[5 * D, 'a', 'wa', 'Elena, te espero mañana a las 12:00. Te dejo el enlace aquí.'], [5 * D - 20, 'c', 'wa', 'Perfecto.']], ev: [[3 * D, 'sistema', 'No se conecta al diagnóstico']] },
      { id: 'q07', n: 'Pablo Rivas', rol: 'Fundador', emp: 'Formación Rivas Online', seg: 'lead', ciudad: 'Sevilla', prod: 'Prueba tu agente', orig: 'q3', canal: 'wa', etapa: 2, valor: 4800, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { inv: '2000_5000', vol: 80, sector: 'formacion', fuga: 'respuesta' }, s: { raquel: true },
        conv: [[5 * D, 'v', 'voz', 'Prueba tu agente: la agente de su academia le atendió como cliente. Resultado: le gustó mucho.'], [5 * D - 30, 'c', 'wa', 'Impresionante la prueba. Quiero algo así para mis alumnos.'], [4 * D, 'a', 'wa', '¿Te va bien que lo veamos 15 minutos esta semana?']] },
      { id: 'q08', n: 'Nerea Ibáñez', rol: 'Gerente', emp: 'Fisioterapia Nerea', seg: 'lead', ciudad: 'Logroño', prod: 'Radiografía', orig: 'q2', canal: 'wa', etapa: 1, valor: 3600, creado: 3 * D, act: 3 * D, toque: 2 * D, f: { inv: 'menos500', vol: 12, sector: 'clinica', fuga: 'anuncios' }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Nerea, soy Maikel. Dices que se te escapa en los anuncios. ¿Qué campañas tienes ahora?']] },
      { id: 'q09', n: 'Carlos Rey', rol: 'Propietario', emp: 'Pintura Decorativa Rey', seg: 'lead', ciudad: 'León', prod: 'Radiografía', orig: 'q2', canal: 'wa', etapa: 1, valor: 3600, creado: 16 * D, act: 16 * D, toque: 10 * D, f: { inv: 'nada', vol: 3, sector: 'reformas', fuga: 'anuncios' }, s: { intentos: 3 },
        conv: [[16 * D, 'a', 'wa', 'Hola Carlos, soy Maikel, de Qualivo. ¿Qué te gustaría arreglar primero?']] },
      { id: 'q10', n: 'Beatriz Lago', rol: 'Directora de Marketing', emp: 'Escuela de Negocios Atlántica', seg: 'lead', ciudad: 'A Coruña', prod: 'Diagnóstico gratuito', orig: 'q4', canal: 'email', etapa: 4, valor: 7200, creado: 12 * D, act: 2 * D, toque: 2 * D,
        f: { inv: 'mas5000', vol: 150, sector: 'formacion', fuga: 'seguimiento' }, s: { },
        conv: [[3 * D, 'h', 'email', 'Beatriz, gracias por el rato de ayer. Te preparo el plan por escrito para el jueves.'], [2 * D, 'c', 'email', 'Genial. Si puede incluir cómo lo medimos por curso, mejor.']] },
      { id: 'q11', n: 'Hugo Marín', rol: 'Gerente', emp: 'Carpintería Marín', seg: 'lead', ciudad: 'Teruel', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'wa', etapa: 2, valor: 3600, creado: 25 * D, act: 20 * D, toque: 20 * D, f: { inv: 'menos500', vol: 10, sector: 'reformas', fuga: 'seguimiento' }, s: { luego: 'enero', luegoTxt: 'lo retomaría en enero, cuando baje el trabajo' },
        conv: [[20 * D, 'c', 'wa', 'Ahora estamos a tope de obras. En enero lo miramos con calma.']] },
      { id: 'q12', n: 'Isabel Nieto', rol: 'Directora', emp: 'Centro de Formación Nieto', seg: 'lead', ciudad: 'Toledo', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'wa', etapa: 2, valor: 4800, creado: 7 * D, act: 5 * D, toque: 5 * D, f: { inv: '500_2000', vol: 30, sector: 'formacion', fuga: 'respuesta' }, s: {},
        conv: [[7 * D, 'a', 'wa', 'Hola Isabel, soy Maikel. ¿Quién contesta hoy a los que piden información?'], [6 * D, 'c', 'wa', 'Una chica de secretaría, cuando puede.'], [5 * D, 'a', 'wa', '¿Lo vemos 15 minutos? Tengo jueves a las 10:00 o viernes a las 12:30.']] },
      { id: 'q13', n: 'Óscar Lozano', rol: 'Gerente', emp: 'Tienda de Bicis Lozano', seg: 'lead', ciudad: 'Huesca', prod: 'Radiografía', orig: 'q2', canal: 'wa', etapa: 1, valor: 1800, creado: 4 * D, act: 4 * D, toque: 3 * D, f: { inv: 'menos500', vol: 4, sector: 'comercio', fuga: 'anuncios' }, s: { intentos: 2 }, conv: [[4 * D, 'a', 'wa', 'Hola Óscar, soy Maikel. ¿Qué te gustaría mejorar primero?']] },
      { id: 'q14', n: 'Teresa Vidal', rol: 'Socia', emp: 'Gestoría Vidal', seg: 'lead', ciudad: 'Tarragona', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'email', etapa: 1, valor: 4800, creado: 2 * D, act: 20 * H, toque: 2 * D - 2, f: { inv: '500_2000', vol: 20, sector: 'asesoria', fuga: 'nose' }, s: { intentos: 1, emails: 2, visitas: 2 },
        conv: [[2 * D - 2, 'a', 'email', 'Hola Teresa, soy Maikel. Dices que no sabes dónde se te escapa: casi nadie lo tiene medido. ¿Lo vemos 15 minutos?']] },
      { id: 'q15', n: 'Adrián Soto', rol: 'Director', emp: 'Clínica Capilar Soto', seg: 'lead', ciudad: 'Madrid', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'wa', etapa: 5, valor: 6000, creado: 30 * D, act: 9 * D, toque: 9 * D,
        f: { inv: 'mas5000', vol: 90, sector: 'clinica', fuga: 'seguimiento' }, s: { prop: 10 * D, propVista: 1 },
        conv: [[10 * D, 'h', 'email', 'Adrián, aquí tienes el plan por escrito. La primera fuga es la de los presupuestos.'], [9 * D, 'c', 'wa', 'Recibido, lo leo.']] },
      { id: 'q16', n: 'Rocío Pérez', rol: 'Coordinadora', emp: 'Autoescuela Pérez', seg: 'lead', ciudad: 'Córdoba', prod: 'Prueba tu agente', orig: 'q3', canal: 'wa', etapa: 3, valor: 3600, creado: 4 * D, act: 1 * D, toque: 1 * D, f: { inv: '500_2000', vol: 40, sector: 'formacion', fuga: 'respuesta' }, s: { cita: 3 * D, citaOk: true, raquel: true },
        conv: [[1 * D + 30, 'c', 'wa', '¿Podemos verlo el lunes a primera hora?'], [1 * D, 'a', 'wa', 'Confirmado el diagnóstico del lunes a las 9:30. Te llega la invitación al correo.']] },
      { id: 'q17', n: 'Guillermo Sanz', rol: 'Estudiante de marketing', emp: '', seg: 'lead', ciudad: 'Madrid', prod: 'Radiografía', orig: 'q2', canal: 'email', etapa: 2, valor: 0, creado: 6 * D, act: 5 * D, toque: 5 * D, f: { inv: 'nada', vol: 0, sector: 'otro', fuga: 'nose' }, s: {},
        conv: [[5 * D, 'c', 'email', 'Hola, es para un trabajo de clase. ¿Me podéis contar cómo funciona el scoring?']] },
      // --- Clientes y pilotos
      { id: 'q18', n: 'Laia Beltrán', rol: 'Directora', emp: 'Centre Mèdic Beltrán', seg: 'cliente', ciudad: 'Barcelona', prod: 'Sistema', orig: 'q4', canal: 'email', etapa: 6, valor: 9600, creado: 200 * D, act: 3 * D, toque: 7 * D, fin: 'ganado', f: { inv: '2000_5000', vol: 70, sector: 'clinica' },
        s: { exp: true, expTxt: 'Quiere el mismo sistema en su segunda clínica', expValor: 6000 }, conv: [] },
      { id: 'q19', n: 'Marcos León', rol: 'Gerente', emp: 'Reformas León', seg: 'cliente', ciudad: 'Sabadell', prod: 'Piloto · visitas en 24 h', orig: 'q1', canal: 'wa', etapa: 6, valor: 4800, creado: 60 * D, act: 2 * D, toque: 5 * D, fin: 'ganado', f: { inv: '500_2000', vol: 40, sector: 'reformas' }, s: {}, conv: [] },
      { id: 'q20', n: 'Alba Moreno', rol: 'Directora', emp: 'Academia Moreno', seg: 'lead', ciudad: 'Granada', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'wa', etapa: 5, valor: 4800, creado: 40 * D, act: 30 * D, toque: 25 * D, fin: 'perdido', f: { inv: 'menos500', vol: 15, sector: 'formacion' }, s: { prop: 30 * D, propVista: 1 }, conv: [] },
      { id: 'q21', n: 'Iñaki Otxoa', rol: 'Director Comercial', emp: 'Ventanas Otxoa', seg: 'lead', ciudad: 'Pamplona', prod: 'Diagnóstico gratuito', orig: 'q1', canal: 'wa', etapa: 2, valor: 6000, creado: 3 * H, act: 70, toque: 2 * H,
        f: { inv: '2000_5000', vol: 55, sector: 'reformas', fuga: 'seguimiento' }, s: { cita: 20 * H, citaOk: true },
        conv: [[3 * H - 1, 'a', 'wa', 'Hola Iñaki, soy Maikel. Me dices que se te escapa en el seguimiento. ¿Es más contestar tarde o los presupuestos que nadie persigue?'], [2 * H, 'c', 'wa', 'Los presupuestos. Mandamos unos 55 al mes y cerramos pocos.'], [2 * H - 1, 'a', 'wa', 'Eso tiene arreglo. ¿Te va mejor mañana a las 10:00 o el jueves a las 16:30?'], [70, 'c', 'wa', 'Mañana a las 10:00 me va bien.'], [69, 'a', 'wa', 'Hecho: mañana a las 10:00. Te llega la invitación al correo.']] },
      { id: 'q22', n: 'Silvia Ortega', rol: 'Gerente', emp: 'Psicología Ortega', seg: 'lead', ciudad: 'Valladolid', prod: 'Radiografía', orig: 'q2', canal: 'wa', etapa: 2, valor: 3600, creado: 9 * D, act: 6 * D, toque: 6 * D, f: { inv: 'menos500', vol: 20, sector: 'clinica', fuga: 'web' }, s: {},
        conv: [[9 * D, 'a', 'wa', 'Hola Silvia, soy Maikel. Dices que se te escapa en la web. ¿Qué pasa con los que rellenan el formulario?'], [8 * D, 'c', 'wa', 'Que llegan pocos y no sé si los contestamos a tiempo.'], [6 * D, 'a', 'wa', '¿Lo vemos 15 minutos y te lo enseño con tus números?']] }
    ]
  };
})();

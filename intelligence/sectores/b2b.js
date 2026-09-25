/* Sector: Servicios B2B / Consultoría.
 * Empresa ficticia que vende servicios profesionales a otras empresas.
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.b2b = {
    id: 'b2b',
    nombre: 'Servicios B2B',
    t: {
      contacto: 'oportunidad', contactos: 'oportunidades', Contactos: 'Oportunidades', Contacto: 'Oportunidad',
      venta: 'contrato', ventas: 'contratos', Ventas: 'Contratos', producto: 'servicio',
      paginaVisitas: 'la página de servicios y precios', txtPrecio: 'ha mirado precios', cita: 'reunión', Cita: 'Reunión', laCita: 'la reunión',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'el equipo comercial', Comercial: 'Equipo comercial',
      cs: 'la responsable de cuenta', CS: 'Responsable de cuenta',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'firman', objetivoPaso: 'agendar la reunión',
      casoExito: 'un caso de una empresa de su sector', valorAlto: 9000, oportunidades: 'oportunidades',
      laVenta: 'la firma', Producto: 'Servicio', clientes: 'clientes', propuestas: 'propuestas', verbo: 'firmar',
      clientesReales: 'contratos firmados', empleados: 'empleados', nuevos: 'nuevas', pasoHumano: 'entender su caso y proponer el siguiente paso'
    },
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'lead', txt: 'Oportunidad' },
      { id: 'contactado', txt: 'Contactada' },
      { id: 'cualificado', txt: 'Cualificada' },
      { id: 'reunion', txt: 'Reunión' },
      { id: 'propuesta', txt: 'Propuesta' },
      { id: 'seguimiento', txt: 'Seguimiento' },
      { id: 'ganado', txt: 'Ganada' }
    ],
    ventaEtapa: 'ganado',
    ticket: 12000,
    referencia: { contactado: 0.85, cualificado: 0.6, reunion: 0.6, propuesta: 0.65, seguimiento: 0.95, ganado: 0.45 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'oportunidades que llegan y nadie contesta a tiempo' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      reunion: { txt: 'Paso a reunión', exp: 'oportunidades cualificadas a las que nadie cierra la reunión' },
      propuesta: { txt: 'Propuesta', exp: 'reuniones que no terminan en propuesta' },
      seguimiento: { txt: 'Seguimiento de propuestas', exp: 'propuestas enviadas que se quedan sin respuesta' },
      ganado: { txt: 'Cierre', exp: 'propuestas en seguimiento que no se firman' }
    },
    mesDatos: { respuestaAntes: 1320, respuestaAhora: 2, agendadas: 63 },
    campanas: [
      { id: 'c1', canal: 'LinkedIn', nombre: 'Directores comerciales', inversion: 5200, ticket: 14500,
        embudo: { anuncio: 1900, lead: 58, contactado: 41, cualificado: 26, reunion: 14, propuesta: 8, seguimiento: 7, ganado: 3 } },
      { id: 'c2', canal: 'Google', nombre: 'Búsqueda · consultoría comercial', inversion: 3900, ticket: 9800,
        embudo: { anuncio: 1400, lead: 64, contactado: 38, cualificado: 20, reunion: 10, propuesta: 6, seguimiento: 5, ganado: 2 } },
      { id: 'c3', canal: 'Webinar', nombre: 'Webinar mensual', inversion: 1200, ticket: 12000,
        embudo: { anuncio: 620, lead: 85, contactado: 40, cualificado: 18, reunion: 8, propuesta: 4, seguimiento: 4, ganado: 1 } },
      { id: 'c4', canal: 'Referidos', nombre: 'Clientes que recomiendan', inversion: 0, ticket: 16000,
        embudo: { anuncio: 40, lead: 22, contactado: 21, cualificado: 16, reunion: 12, propuesta: 8, seguimiento: 7, ganado: 4 } },
      { id: 'c5', canal: 'Correo', nombre: 'Prospección directa', inversion: 900, ticket: 11000,
        embudo: { anuncio: 800, lead: 34, contactado: 20, cualificado: 10, reunion: 5, propuesta: 3, seguimiento: 3, ganado: 1 } }
    ],
    kpis: ['interesados', 'cualificados', 'entrevistas', 'show', 'propuestas', 'cierre', 'pipeline', 'ingresos', 'ticketMedio', 'respuesta'],
    kpiNombres: { interesados: 'Oportunidades nuevas', cualificados: 'Cualificadas', entrevistas: 'Reuniones', ingresos: 'Facturación firmada' },
    kpiEtapas: { interesados: 'lead', cualificados: 'cualificado', entrevistas: 'reunion' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      const pipe = cs.filter(function (c) { return !c.fin && c.etapa >= 4; });
      const riesgo = pipe.filter(function (c) { return c.x && c.x.riesgo >= 45; });
      return {
        propuestas: { l: 'Propuestas enviadas', v: M.num(m.tot.propuesta), em: M.pct(m.tot.propuesta / m.tot.reunion) + ' de las reuniones' },
        cierre: { l: 'Tasa de cierre', v: M.pct(m.tot.ganado / m.tot.propuesta), em: m.tot.ganado + ' contratos de ' + m.tot.propuesta + ' propuestas' },
        pipeline: { l: 'Pipeline abierto', v: M.euros(pipe.reduce(function (a, c) { return a + c.valor; }, 0)), em: M.euros(riesgo.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en riesgo', clase: 'mal' },
        ticketMedio: { l: 'Contrato medio', v: M.euros(m.ingresos / Math.max(1, m.tot.ganado)), em: 'Últimos 30 días' }
      };
    },

    reglas: {
      fitBase: 18,
      fit: [
        [function (c) { return c.tam >= 20 && c.tam <= 500; }, 24, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 20 a 500 empleados'],
        [function (c) { return c.tam > 500; }, 12, function (c) { return 'empresa grande (' + c.tam + ' empleados)'; }, 'Más de 500 empleados'],
        [function (c) { return c.tam > 0 && c.tam < 10; }, -12, 'empresa muy pequeña para el servicio', 'Menos de 10 empleados'],
        [function (c) { return /director|ceo|gerente|fundador|head|socio|vp/i.test(c.rol || ''); }, 18, function (c) { return 'decide (' + c.rol + ')'; }, 'Su cargo decide la compra'],
        [function (c) { return c.f && c.f.sectorOk; }, 14, function (c) { return 'sector donde ya hay casos (' + c.f.sectorOk + ')'; }, 'Sector con casos parecidos'],
        [function (c) { return c.f && c.f.problema; }, 10, function (c) { return 'problema claro: ' + c.f.problema; }, 'Tiene un problema concreto'],
        [function (c) { return c.f && c.f.competidor; }, -30, 'es de la competencia', 'Es competencia'],
        [function (c) { return c.f && c.f.estudiante; }, -26, 'busca información para un trabajo de clase', 'Estudiante']
      ],
      intencion: [
        [function (c) { return (c.s.visitas || 0) >= 2 && c.s.precio; }, 10, 'vuelve a mirar precios'],
        [function (c) { return c.s.caso; }, 8, 'ha descargado un caso de éxito']
      ]
    },

    preguntas: [
      { q: '¿Qué oportunidades debería trabajar Ventas hoy?', h: 'equipo', obj: ['ventas', 'todo'] },
      { q: '¿Qué propuestas están enfriándose?', h: 'lista', obj: ['seguimiento', 'ventas', 'todo'],
        filtro: function (c) { return c.s.tProp != null && !c.fin && c.x.k.toque > 2 * 1440; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' propuestas llevan más de 2 días sin seguimiento. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '. Las de más valor las llama una persona; el resto las retoma el agente con la duda más habitual.'; },
        cols: ['nombre', ['Abierta', function (c) { return (c.s.propVista || 0) + ' veces'; }], 'valor', 'accion'], vista: 'tabla' },
      { q: '¿Qué cuentas tienen intención alta?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && c.x.int >= 50; }, orden: 'prob',
        intro: function (l, T, M) { return (l.length === 1 ? 'Una cuenta muestra' : l.length + ' cuentas muestran') + ' intención alta ahora mismo' + (l.length > 3 ? '. Estas son las primeras.' : '.') + (l.length < 3 ? ' Justo detrás, las que más se acercan.' : ''); }, vista: 'cards', max: 3 },
      { q: '¿Cuánto pipeline está en riesgo?', h: 'lista', obj: ['ventas', 'retencion', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa >= 4 && c.x.riesgo >= 45; }, orden: 'valor', suma: true,
        intro: function (l, T, M) {
          const pipe = QV.estado.contactos.filter(function (c) { return !c.fin && c.etapa >= 4; }).reduce(function (a, c) { return a + c.valor; }, 0);
          const r = l.reduce(function (a, c) { return a + c.valor; }, 0);
          return '**' + M.euros(r) + '** de ' + M.euros(pipe) + ' de pipeline abierto está en riesgo (' + Math.round(r / Math.max(1, pipe) * 100) + ' %). Son ' + l.length + ' oportunidades con reunión o propuesta que se están enfriando.';
        },
        cols: ['nombre', 'valor', ['Motivo', function (c) { return (c.x.riesgoM[0] || {}).txt || ''; }], 'accion'], vista: 'tabla' }
    ],

    historias: {
      reunion: {
        titulo: 'Una directora de marketing entra y acaba con reunión',
        contacto: { id: 'demo', n: 'Laura García', rol: 'Directora de Marketing', emp: 'Agencia Contraste', seg: 'empresa', ciudad: '—', prod: 'Consultoría de sistema comercial', orig: 'c1', canal: 'wa', etapa: 1, valor: 14500, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una oportunidad nueva desde LinkedIn', feed: 'Oportunidad nueva · formulario de LinkedIn', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa el perfil: agencia de 38 personas', feed: 'Perfil completado · agencia · 38 empleados', cambio: { tam: 38, ciudad: 'Madrid', f: { sectorOk: 'agencias', problema: 'seguimiento de oportunidades' } } },
          { dur: 6, min: 7, txt: 'Laura visita precios dos veces y descarga un caso', feed: 'Visita precios 2 veces · descarga un caso', cambio: { s: { visitas: 2, precio: true, caso: true } }, act: true },
          { dur: 6, min: 1, txt: 'El agente detecta la oportunidad y escribe por WhatsApp', feed: 'WhatsApp enviado · intención al alza', cambio: { conv: ['a', 'wa', 'Hola Laura, soy Marta, del equipo. He visto que te interesa el caso de la agencia de Valencia. ¿Qué te gustaría resolver ahora mismo?'] }, toque: true },
          { dur: 7, min: 4, txt: 'Laura contesta', feed: 'Respuesta recibida', cambio: { etapa: 2, conv: ['c', 'wa', 'Estamos buscando algo para automatizar el seguimiento de leads. Se nos quedan muchos sin contestar.'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente hace una pregunta de cualificación', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Tiene arreglo. Para no hacerte perder el tiempo: ¿cuántas peticiones os entran al mes y para cuándo querrías tenerlo funcionando?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Laura da volumen, plazo y presupuesto', feed: 'Cualificada · presupuesto y plazo', cambio: { s: { urg: true, urgTxt: 'lo quiere funcionando antes de enero', ppto: 'si', pptoTxt: 'tiene presupuesto aprobado para este trimestre' }, conv: ['c', 'wa', 'Unas 300 al mes. Lo queremos antes de enero y tenemos presupuesto aprobado para este trimestre.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la reunión', feed: 'Reunión agendada · jueves 10:30', cambio: { etapa: 4, s: { cita: 1600, citaOk: true }, conv: ['a', 'wa', 'Perfecto. Te dejo el jueves a las 10:30 con Pablo, socio del equipo, 30 minutos. Te llega la invitación al correo.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso al equipo comercial: Laura está lista para hablar', feed: 'Aviso enviado al equipo comercial', humano: { titulo: 'Laura está lista para hablar', texto: 'Directora de Marketing · agencia de 38 personas · 300 peticiones al mes · quiere automatizar el seguimiento antes de enero · presupuesto aprobado. Reunión el jueves a las 10:30.' } }
        ]
      }
    },
    historiaDefecto: 'reunion',

    contactos: [
      // --- Calientes
      { id: 'b01', n: 'Ricardo Soler', rol: 'Director Comercial', emp: 'Distribuciones Levante Pro', seg: 'empresa', tam: 120, ciudad: 'Valencia', prod: 'Consultoría de sistema comercial', orig: 'c1', canal: 'wa', etapa: 3, valor: 18500, creado: 2 * D, act: 31, toque: 3 * H,
        f: { sectorOk: 'distribución', problema: 'no saben qué comercial sigue qué oportunidad' }, s: { visitas: 3, precio: true, urg: true, urgTxt: 'quiere arrancar en noviembre', caso: true },
        conv: [[2 * D, 'a', 'wa', 'Hola Ricardo, soy Marta. ¿Qué te gustaría resolver en el equipo comercial?'], [2 * D - 40, 'c', 'wa', 'Que cada comercial sepa qué tiene que seguir cada día. Ahora va cada uno a su aire.'], [3 * H, 'a', 'wa', 'Lo vemos a menudo. ¿Te va bien 30 minutos esta semana con Pablo?'], [31, 'c', 'wa', 'Sí. Y si puede ser, que me digáis precio aproximado, que quiero arrancar en noviembre.']] },
      { id: 'b02', n: 'Beatriz Montero', rol: 'CEO', emp: 'Grupo Montero Seguros', seg: 'empresa', tam: 85, ciudad: 'Madrid', prod: 'Implantación de CRM y seguimiento', orig: 'c4', canal: 'email', etapa: 5, valor: 22000, creado: 20 * D, act: 2 * H, toque: 3 * D,
        f: { sectorOk: 'seguros', problema: 'presupuestos sin seguimiento' }, s: { prop: 4 * D, propVista: 4, ppto: 'si' },
        conv: [[5 * D, 'h', 'email', 'Te envío la propuesta con las dos fases y el calendario.'], [2 * H, 'c', 'email', 'La hemos visto con el comité. Tenemos dudas con la fase 2, ¿podemos hablarlo?']] },
      { id: 'b03', n: 'Alberto Cuesta', rol: 'Gerente', emp: 'Cuesta Ingeniería', seg: 'empresa', tam: 45, ciudad: 'Bilbao', prod: 'Consultoría de sistema comercial', orig: 'c2', canal: 'wa', etapa: 1, valor: 9800, creado: 14, act: 14, toque: null, f: { problema: 'tardan días en contestar' }, s: { visitas: 1 }, conv: [] },
      // --- Propuestas enfriándose
      { id: 'b04', n: 'Mercedes Lara', rol: 'Directora de Operaciones', emp: 'Clínicas Lara', seg: 'empresa', tam: 150, ciudad: 'Sevilla', prod: 'Implantación de CRM y seguimiento', orig: 'c1', canal: 'email', etapa: 6, valor: 16000, creado: 30 * D, act: 6 * D, toque: 8 * D,
        f: { sectorOk: 'salud' }, s: { prop: 9 * D, propVista: 2 },
        conv: [[9 * D, 'h', 'email', 'Te comparto la propuesta revisada con lo que hablamos.'], [8 * D, 'c', 'email', 'Gracias, la miro con dirección y te digo.']] },
      { id: 'b05', n: 'Jorge Ibarra', rol: 'Director General', emp: 'Transportes Ibarra', seg: 'empresa', tam: 260, ciudad: 'Zaragoza', prod: 'Consultoría de sistema comercial', orig: 'c4', canal: 'email', etapa: 5, valor: 24000, creado: 25 * D, act: 12 * D, toque: 12 * D,
        f: { sectorOk: 'logística', problema: 'demasiadas oportunidades perdidas' }, s: { prop: 12 * D, propVista: 0 }, conv: [[12 * D, 'h', 'email', 'Te envío la propuesta. Cualquier duda me dices.']] },
      { id: 'b06', n: 'Sonia Ferrer', rol: 'Directora de Marketing', emp: 'Academia Ferrer', seg: 'empresa', tam: 30, ciudad: 'Valencia', prod: 'Auditoría comercial', orig: 'c3', canal: 'wa', etapa: 5, valor: 6500, creado: 15 * D, act: 3 * D, toque: 5 * D,
        f: { sectorOk: 'formación' }, s: { prop: 5 * D, propVista: 3 },
        conv: [[5 * D, 'h', 'wa', 'Sonia, te acabo de mandar la propuesta al correo.'], [5 * D - 60, 'c', 'wa', 'Recibida, gracias.']] },
      { id: 'b07', n: 'Ángel Pizarro', rol: 'Socio Director', emp: 'Pizarro Abogados', seg: 'empresa', tam: 40, ciudad: 'Madrid', prod: 'Auditoría comercial', orig: 'c2', canal: 'email', etapa: 6, valor: 7200, creado: 22 * D, act: 1 * D, toque: 3 * D, f: { sectorOk: 'despachos' }, s: { prop: 7 * D, propVista: 5, precio: true },
        conv: [[3 * D, 'h', 'email', '¿Pudiste ver la propuesta? Te puedo ajustar el alcance si hace falta.'], [1 * D, 'c', 'email', 'Sí. ¿Qué pasaría si empezamos solo por la auditoría y dejamos la implantación para después?']] },
      // --- Reuniones
      { id: 'b08', n: 'Clara Vidal', rol: 'Head of Sales', emp: 'SaaS Cumbre', seg: 'empresa', tam: 70, ciudad: 'Barcelona', prod: 'Consultoría de sistema comercial', orig: 'c1', canal: 'wa', etapa: 4, valor: 14500, creado: 6 * D, act: 5 * H, toque: 5 * H, f: { sectorOk: 'software', problema: 'no saben qué demos acaban en venta' }, s: { cita: 20 * H, citaOk: false, visitas: 2 },
        conv: [[6 * D, 'a', 'wa', 'Hola Clara, ¿qué te gustaría resolver?'], [6 * D - 30, 'c', 'wa', 'Saber qué demos acaban en venta y cuáles no.'], [5 * H, 'a', 'wa', 'Te confirmo la reunión de mañana a las 10:00 con Pablo.']] },
      { id: 'b09', n: 'Esteban Muñoz', rol: 'Director Comercial', emp: 'Ferretería Industrial Muñoz', seg: 'empresa', tam: 60, ciudad: 'Murcia', prod: 'Consultoría de sistema comercial', orig: 'c2', canal: 'wa', etapa: 4, valor: 11000, creado: 10 * D, act: 2 * D, toque: 2 * D, f: { sectorOk: 'distribución' }, s: { noshow: true, visitas: 2 },
        conv: [[4 * D, 'a', 'wa', 'Te espero mañana a las 12:00 con Pablo.'], [3 * D, 'c', 'wa', 'Perfecto.']], ev: [[2 * D, 'sistema', 'No se conecta a la reunión']] },
      { id: 'b10', n: 'Rosa Quintana', rol: 'Gerente', emp: 'Hoteles Quintana', seg: 'empresa', tam: 110, ciudad: 'Santander', prod: 'Implantación de CRM y seguimiento', orig: 'c4', canal: 'email', etapa: 4, valor: 17000, creado: 8 * D, act: 1 * D, toque: 1 * D, f: { sectorOk: 'hostelería' }, s: { cita: 4 * D, citaOk: true }, conv: [[1 * D, 'h', 'email', 'Confirmada la reunión del lunes a las 9:30.']] },
      // --- Sin seguimiento después de contestar
      { id: 'b11', n: 'Luis Carmona', rol: 'Director de Ventas', emp: 'Grupo Carmona Automoción', seg: 'empresa', tam: 340, ciudad: 'Córdoba', prod: 'Consultoría de sistema comercial', orig: 'c1', canal: 'wa', etapa: 3, valor: 21000, creado: 12 * D, act: 7 * D, toque: 7 * D, f: { sectorOk: 'automoción', problema: 'leads de concesionarios sin seguimiento' }, s: { visitas: 2 },
        conv: [[12 * D, 'a', 'wa', 'Hola Luis, ¿qué os gustaría resolver?'], [11 * D, 'c', 'wa', 'Los contactos que llegan a los concesionarios se pierden. Me interesa.'], [7 * D, 'h', 'wa', 'Te llamo esta semana.']] },
      { id: 'b12', n: 'Nieves Bravo', rol: 'Directora de Expansión', emp: 'Franquicias Bravo', seg: 'empresa', tam: 55, ciudad: 'Málaga', prod: 'Auditoría comercial', orig: 'c3', canal: 'wa', etapa: 3, valor: 6500, creado: 9 * D, act: 5 * D, toque: 5 * D, f: {}, s: {},
        conv: [[9 * D, 'a', 'wa', 'Hola Nieves, ¿qué te llevó al webinar?'], [8 * D, 'c', 'wa', 'Queremos ordenar cómo atendemos a los franquiciados interesados.'], [5 * D, 'a', 'wa', '¿Lo vemos 20 minutos?']] },
      { id: 'b13', n: 'Pedro Galindo', rol: 'CEO', emp: 'Galindo Reformas', seg: 'empresa', tam: 25, ciudad: 'Granada', prod: 'Consultoría de sistema comercial', orig: 'c2', canal: 'wa', etapa: 2, valor: 9800, creado: 6 * D, act: 4 * D, toque: 4 * D, f: { sectorOk: 'reformas', problema: 'presupuestos sin respuesta' }, s: { precio: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Pedro, ¿qué te gustaría resolver?'], [4 * D, 'c', 'wa', 'Mandamos muchos presupuestos y no sabemos qué pasa con ellos. ¿Qué cuesta?']] },
      // --- Más adelante
      { id: 'b14', n: 'Carmen Aguirre', rol: 'Directora General', emp: 'Aguirre Formación', seg: 'empresa', tam: 35, ciudad: 'Pamplona', prod: 'Consultoría de sistema comercial', orig: 'c3', canal: 'email', etapa: 4, valor: 12000, creado: 40 * D, act: 30 * D, toque: 30 * D, f: { sectorOk: 'formación' }, s: { luego: 'enero', luegoTxt: 'lo retomaría en enero, con el presupuesto nuevo' },
        conv: [[30 * D, 'c', 'email', 'Nos encaja, pero hasta enero no tenemos presupuesto. Lo retomamos entonces.']] },
      { id: 'b15', n: 'Víctor Maestre', rol: 'Socio', emp: 'Maestre Asesores', seg: 'empresa', tam: 18, ciudad: 'Alicante', prod: 'Auditoría comercial', orig: 'c5', canal: 'wa', etapa: 3, valor: 5200, creado: 50 * D, act: 45 * D, toque: 45 * D, f: { sectorOk: 'asesorías' }, s: { luego: 'julio', luegoTxt: 'lo verían después de la campaña de renta' },
        conv: [[45 * D, 'c', 'wa', 'Ahora estamos a tope. Después de la campaña de renta lo vemos.']] },
      // --- Nuevas y en cadencia
      { id: 'b16', n: 'Inés Rovira', rol: 'Directora Comercial', emp: 'Laboratorios Rovira', seg: 'empresa', tam: 210, ciudad: 'Barcelona', prod: 'Implantación de CRM y seguimiento', orig: 'c1', canal: 'tel', etapa: 1, valor: 19000, creado: 42, act: 40, toque: null, f: { sectorOk: 'salud' }, s: {}, conv: [] },
      { id: 'b17', n: 'Marcos Peral', rol: 'Responsable de Marketing', emp: 'Peral Maquinaria', seg: 'empresa', tam: 65, ciudad: 'Valladolid', prod: 'Auditoría comercial', orig: 'c2', canal: 'wa', etapa: 1, valor: 6500, creado: 2 * D, act: 20 * H, toque: 2 * D - 1, f: {}, s: { intentos: 1, visitas: 2 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Marcos, ¿qué te gustaría mejorar en el proceso comercial?']] },
      { id: 'b18', n: 'Olga Serrano', rol: 'Técnica de Marketing', emp: 'Serrano Textil', seg: 'empresa', tam: 90, ciudad: 'Alcoy', prod: 'Auditoría comercial', orig: 'c3', canal: 'email', etapa: 1, valor: 6500, creado: 4 * D, act: 4 * D, toque: 3 * D, f: {}, s: { intentos: 2 }, conv: [[3 * D, 'a', 'email', 'Hola Olga, te dejo la grabación del webinar y una pregunta: ¿qué es lo que más os cuesta hoy?']] },
      { id: 'b19', n: 'Andrés Molina', rol: 'Director de Operaciones', emp: 'Molina Packaging', seg: 'empresa', tam: 140, ciudad: 'Burgos', prod: 'Consultoría de sistema comercial', orig: 'c5', canal: 'email', etapa: 1, valor: 11000, creado: 18 * D, act: 18 * D, toque: 10 * D, f: {}, s: { intentos: 3 }, conv: [[18 * D, 'a', 'email', 'Hola Andrés, te escribo porque…']] },
      { id: 'b20', n: 'Julia Paredes', rol: 'Directora de Marketing', emp: 'Paredes Cosmética', seg: 'empresa', tam: 48, ciudad: 'Madrid', prod: 'Auditoría comercial', orig: 'c2', canal: 'wa', etapa: 2, valor: 6500, creado: 3 * D, act: 40, toque: 3 * H,
        f: {}, s: { visitas: 1 }, conv: [[3 * D, 'a', 'wa', 'Hola Julia, ¿qué te gustaría resolver?'], [3 * H, 'a', 'wa', '¿Te cuento cómo lo hicimos con otra marca de cosmética?'], [40, 'c', 'wa', 'Sí, cuéntame.']] },
      // --- Bajo encaje
      { id: 'b21', n: 'Raquel Díaz', rol: 'Estudiante de ADE', emp: '', seg: 'particular', tam: 0, ciudad: 'Madrid', prod: 'Webinar', orig: 'c3', canal: 'email', etapa: 2, valor: 0, creado: 5 * D, act: 4 * D, toque: 4 * D, f: { estudiante: true }, s: {}, conv: [[4 * D, 'c', 'email', '¿Me podéis pasar las diapositivas para un trabajo de clase?']] },
      { id: 'b22', n: 'Toni Ruiz', rol: 'Consultor', emp: 'Ruiz Growth Partners', seg: 'empresa', tam: 4, ciudad: 'Valencia', prod: 'Consultoría de sistema comercial', orig: 'c2', canal: 'wa', etapa: 2, valor: 9800, creado: 3 * D, act: 2 * D, toque: 2 * D, f: { competidor: true }, s: { precio: true }, conv: [[2 * D, 'c', 'wa', '¿Me pasas vuestras tarifas y cómo trabajáis?']] },
      // --- Ganadas / perdidas
      { id: 'b23', n: 'Fernando Salas', rol: 'Director General', emp: 'Salas Energía', seg: 'empresa', tam: 180, ciudad: 'Oviedo', prod: 'Implantación de CRM y seguimiento', orig: 'c4', canal: 'email', etapa: 7, valor: 21000, creado: 60 * D, act: 3 * D, toque: 3 * D, fin: 'ganado', f: {}, s: { exp: true, expTxt: 'Quiere extender el sistema a la delegación de Galicia', expValor: 9000 },
        conv: [[3 * D, 'c', 'email', 'Esto está funcionando. ¿Podemos llevarlo también a la delegación de Galicia?']] },
      { id: 'b24', n: 'Lidia Campos', rol: 'CEO', emp: 'Campos Eventos', seg: 'empresa', tam: 28, ciudad: 'Sevilla', prod: 'Auditoría comercial', orig: 'c3', canal: 'wa', etapa: 7, valor: 6500, creado: 45 * D, act: 10 * D, toque: 10 * D, fin: 'ganado', f: {}, s: {}, conv: [] },
      { id: 'b25', n: 'Héctor Blanco', rol: 'Director Comercial', emp: 'Blanco Distribución', seg: 'empresa', tam: 75, ciudad: 'Vigo', prod: 'Consultoría de sistema comercial', orig: 'c1', canal: 'email', etapa: 5, valor: 14500, creado: 50 * D, act: 30 * D, toque: 25 * D, fin: 'perdido', f: {}, s: { prop: 35 * D, propVista: 1 }, conv: [] },
      { id: 'b26', n: 'Eva Martorell', rol: 'Directora de Personas', emp: 'Martorell Retail', seg: 'empresa', tam: 400, ciudad: 'Girona', prod: 'Auditoría comercial', orig: 'c5', canal: 'email', etapa: 2, valor: 8000, creado: 7 * D, act: 2 * D, toque: 6 * D, f: {}, s: { emails: 3, visitas: 2 }, conv: [[6 * D, 'a', 'email', 'Hola Eva, ¿quién lleva el área comercial en Martorell?'], [2 * D, 'c', 'email', 'Lo lleva Jordi, te pongo en copia. Os interesa hablar.']] }
    ]
  };
})();

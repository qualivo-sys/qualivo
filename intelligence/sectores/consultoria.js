/* Sector: Consultoría de alto valor.
 * Consultora boutique de sostenibilidad y ESG para el sector inmobiliario
 * (certificaciones BREEAM, LEED y WELL, due diligence ESG, taxonomía y CSRD).
 * Proyectos grandes, ciclos largos y clientes que repiten.
 * Todos los nombres, personas y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };
  const TIPOS = { promotora: 'promotora', gestora: 'gestora de fondos', socimi: 'SOCIMI' };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.consultoria = {
    id: 'consultoria',
    nombre: 'Consultoría de alto valor',
    t: {
      contacto: 'oportunidad', contactos: 'oportunidades', Contactos: 'Oportunidades', Contacto: 'Oportunidad',
      venta: 'proyecto', ventas: 'proyectos', Ventas: 'Proyectos', producto: 'servicio',
      paginaVisitas: 'la página de servicios', txtPrecio: 'ha preguntado por honorarios', cita: 'reunión', Cita: 'Reunión', laCita: 'la reunión',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'la socia', Comercial: 'Socia',
      cs: 'la responsable de proyecto', CS: 'Responsable de proyecto',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'firman', objetivoPaso: 'agendar la reunión con la socia',
      casoExito: 'un caso de un edificio parecido', valorAlto: 20000, oportunidades: 'oportunidades',
      laVenta: 'la firma', Producto: 'Servicio', clientes: 'clientes', propuestas: 'propuestas', verbo: 'firmar',
      clientesReales: 'proyectos firmados', empleados: 'activos en cartera', nuevos: 'nuevas',
      pasoHumano: 'entender el activo y los plazos, y proponer el alcance',
      senales: { expansion: 'Cliente que puede repetir' },
      anunciosIntro: 'La captación la lleváis vosotras: recomendaciones, el LinkedIn de la fundadora, los eventos y la búsqueda en Google. El sistema une cada canal con lo que pasa después (quién encaja, quién se queda sin respuesta, quién firma) para invertir en lo que trae proyectos, no solo tarjetas.',
      notaTitulo: 'Qué cambiaría este mes en los canales', notaBoton: 'Redactar la nota de canales',
      notaIntro: 'Esto es lo que cambiaría este mes en la captación, cruzando cada canal con lo que pasa después.',
      preguntaNota: '¿Qué cambiaríamos este mes en LinkedIn, eventos y Google?', notaAsunto: 'Asunto: Canales de captación · qué cambiar', notaCorreo: 'Nota de canales'
    },
    recorrido: [
      { id: 'anuncio', txt: 'Origen', sinFuga: true },
      { id: 'lead', txt: 'Oportunidad' },
      { id: 'contactado', txt: 'Contactada' },
      { id: 'cualificado', txt: 'Cualificada' },
      { id: 'reunion', txt: 'Reunión' },
      { id: 'propuesta', txt: 'Propuesta' },
      { id: 'seguimiento', txt: 'Seguimiento' },
      { id: 'ganado', txt: 'Ganada' }
    ],
    ventaEtapa: 'ganado',
    ticket: 22000,
    referencia: { contactado: 0.85, cualificado: 0.6, reunion: 0.6, propuesta: 0.65, seguimiento: 0.95, ganado: 0.45 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'oportunidades que llegan y nadie contesta a tiempo' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones en las que nadie pregunta qué activo es y para cuándo' },
      reunion: { txt: 'Paso a reunión', exp: 'oportunidades cualificadas a las que nadie cierra la reunión con la socia' },
      propuesta: { txt: 'Propuesta', exp: 'reuniones que no terminan en propuesta' },
      seguimiento: { txt: 'Seguimiento de propuestas', exp: 'propuestas enviadas que se quedan sin respuesta' },
      ganado: { txt: 'Cierre', exp: 'propuestas en seguimiento que no se firman' }
    },
    remedioFuga: {
      seguimiento: 'Cada propuesta sale con fecha de seguimiento: el sistema mira si la han abierto, el agente retoma las pequeñas con la duda más habitual y la socia recibe aviso de las grandes, con el contexto, antes de que se enfríen.'
    },
    mesDatos: { respuestaAntes: 1740, respuestaAhora: 2, agendadas: 27 },
    campanas: [
      { id: 'c1', canal: 'Recomendación', nombre: 'Clientes y arquitectos que recomiendan', inversion: 0, ticket: 32000,
        embudo: { anuncio: 14, lead: 9, contactado: 9, cualificado: 8, reunion: 6, propuesta: 5, seguimiento: 4, ganado: 2 } },
      { id: 'c2', canal: 'LinkedIn', nombre: 'Contenido de la fundadora y anuncios a promotoras', inversion: 2500, ticket: 24000,
        embudo: { anuncio: 1600, lead: 22, contactado: 17, cualificado: 10, reunion: 6, propuesta: 4, seguimiento: 3, ganado: 1 } },
      { id: 'c3', canal: 'Eventos', nombre: 'MIPIM y SIMA', inversion: 6000, ticket: 26000,
        embudo: { anuncio: 210, lead: 38, contactado: 24, cualificado: 11, reunion: 5, propuesta: 3, seguimiento: 1, ganado: 0 } },
      { id: 'c4', canal: 'Google', nombre: 'Búsqueda · certificación BREEAM', inversion: 1800, ticket: 21000,
        embudo: { anuncio: 900, lead: 16, contactado: 12, cualificado: 7, reunion: 4, propuesta: 3, seguimiento: 1, ganado: 1 } },
      { id: 'c5', canal: 'Correo', nombre: 'Prospección a promotoras y gestoras', inversion: 600, ticket: 15000,
        embudo: { anuncio: 420, lead: 11, contactado: 7, cualificado: 4, reunion: 2, propuesta: 1, seguimiento: 1, ganado: 0 } }
    ],
    kpis: ['interesados', 'cualificados', 'entrevistas', 'propuestas', 'cierre', 'pipeline', 'ingresos', 'ticketMedio', 'repiten', 'respuesta'],
    kpiNombres: { interesados: 'Oportunidades nuevas', cualificados: 'Cualificadas', entrevistas: 'Reuniones', ingresos: 'Honorarios firmados' },
    kpiEtapas: { interesados: 'lead', cualificados: 'cualificado', entrevistas: 'reunion' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      const pipe = cs.filter(function (c) { return !c.fin && c.etapa >= 4; });
      const riesgo = pipe.filter(function (c) { return c.x && c.x.riesgo >= 45; });
      const rep = cs.filter(function (c) { return c.fin === 'ganado' && c.s.exp; });
      return {
        propuestas: { l: 'Propuestas enviadas', v: M.num(m.tot.propuesta), em: M.pct(m.tot.propuesta / m.tot.reunion) + ' de las reuniones' },
        cierre: { l: 'Tasa de cierre', v: M.pct(m.tot.ganado / m.tot.propuesta), em: m.tot.ganado + ' proyectos de ' + m.tot.propuesta + ' propuestas' },
        pipeline: { l: 'Pipeline abierto', v: M.euros(pipe.reduce(function (a, c) { return a + c.valor; }, 0)), em: M.euros(riesgo.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en riesgo', clase: 'mal' },
        ticketMedio: { l: 'Proyecto medio', v: M.euros(m.ingresos / Math.max(1, m.tot.ganado)), em: 'Últimos 30 días' },
        repiten: { l: 'Clientes que pueden repetir', v: M.euros(rep.reduce(function (a, c) { return a + (c.s.expValor || 0); }, 0)), em: M.pl(rep.length, 'cliente', 'clientes') + ' sin que nadie les escriba', clase: 'mal' }
      };
    },

    reglas: {
      fitBase: 20,
      fit: [
        [function (c) { return c.f && !!TIPOS[c.f.tipo]; }, 22, function (c) { return 'es ' + TIPOS[c.f.tipo]; }, 'Promotora, gestora de fondos o SOCIMI'],
        [function (c) { return c.f && c.f.tipo === 'family office'; }, 14, 'family office con patrimonio inmobiliario', 'Family office con inmuebles'],
        [function (c) { return c.f && c.f.tipo === 'arquitectura'; }, 8, 'estudio de arquitectura que prescribe la certificación', 'Estudio de arquitectura (prescribe)'],
        [function (c) { return c.tam >= 5; }, 14, function (c) { return 'cartera de ' + c.tam + ' activos'; }, 'Cartera de 5 activos o más'],
        [function (c) { return tieneRol(c, /director|asset|ceo|socio|socia|fundador|consejer/i); }, 18, function (c) { return 'decide el encargo (' + c.rol + ')'; }, 'Su cargo decide el encargo'],
        [function (c) { return c.f && c.f.licencia; }, 12, function (c) { return c.f.licencia; }, 'Proyecto con licencia u obra con fecha'],
        [function (c) { return c.f && c.f.competidor; }, -34, 'es otra consultora del sector', 'Es competencia'],
        [function (c) { return c.f && c.f.estudiante; }, -30, 'busca información para un trabajo de máster', 'Estudiante']
      ],
      intencion: [
        [function (c) { return (c.s.visitas || 0) >= 2 && c.s.precio; }, 10, 'vuelve a mirar servicios y honorarios'],
        [function (c) { return c.s.caso; }, 8, 'ha descargado un caso de un edificio parecido']
      ]
    },

    preguntas: [
      { q: '¿A qué cuentas nuevas deberíamos escribir esta semana?', h: 'prospeccion', obj: ['captacion', 'seguimiento', 'ventas', 'todo'],
        intro: 'Hay **6 cuentas** que hoy no están en el CRM y tienen un motivo para hablar con vosotros ahora: una licencia concedida, una compra de edificio o la obligación de reportar CSRD. Suman unos **138.000 €** en proyectos posibles. No es mandar mil correos: es escribir a quien tiene el problema esta semana.',
        cuentas: [
          { cuenta: 'Residencial Arganzuela', tipo: 'promotora', senal: 'Licencia concedida para 96 viviendas en Madrid hace 9 días', canal: 'Correo', valor: 28000 },
          { cuenta: 'Iberia Real Estate Partners', tipo: 'fondo', senal: 'Ha comprado un edificio de oficinas de 12.000 m² en Barcelona', canal: 'LinkedIn', valor: 32000 },
          { cuenta: 'Levante Logística', tipo: 'industrial', senal: 'Nave de 40.000 m² en obra; su inquilino exige BREEAM', canal: 'Correo', valor: 24000 },
          { cuenta: 'Gestora Atalaya', tipo: 'gestora', senal: 'Reporta CSRD por primera vez el año que viene', canal: 'Correo', valor: 18000 },
          { cuenta: 'Hoteles Mirador', tipo: 'hotelero', senal: 'Anuncia la reforma integral de dos hoteles en Málaga', canal: 'LinkedIn', valor: 22000 },
          { cuenta: 'Centro Comercial Vía Norte', tipo: 'retail', senal: 'El BREEAM En Uso caduca en febrero', canal: 'Correo', valor: 14000 }
        ],
        ejemplo: 'Asunto: las 96 viviendas de Arganzuela\n\nHola Andrea:\n\nHe visto que os han concedido la licencia de Arganzuela. Enhorabuena. En promociones de este tamaño, el fondo comprador suele pedir BREEAM y conviene decidirlo antes del proyecto de ejecución, no después.\n\nHicimos lo mismo con una promoción de 84 viviendas en Getafe. Si te sirve, te cuento en 20 minutos qué implicaría en la vuestra.\n\nCarlota',
        cierre: 'Si contestan, entran en el mismo seguimiento que el resto: el agente cualifica, la socia solo entra en la reunión y ninguna propuesta se queda sin siguiente paso.' },
      { q: '¿Qué oportunidades debería trabajar hoy la socia?', h: 'equipo', obj: ['ventas', 'seguimiento', 'todo'] },
      { q: '¿Qué propuestas están enfriándose?', h: 'lista', obj: ['seguimiento', 'ventas', 'todo'],
        filtro: function (c) { return c.s.tProp != null && !c.fin && c.x.k.toque > 2 * 1440; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' propuestas llevan más de 2 días sin seguimiento. Suman **' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '**. Las de más de 20.000 € las llama la socia; el resto las retoma el agente con la duda más habitual.'; },
        cols: ['nombre', ['Abierta', function (c) { return (c.s.propVista || 0) + (c.s.propVista === 1 ? ' vez' : ' veces'); }], 'valor', 'accion'], vista: 'tabla' },
      { q: '¿Cuánto pipeline está en riesgo?', h: 'lista', obj: ['ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa >= 4 && c.x.riesgo >= 45; }, orden: 'valor', suma: true,
        intro: function (l, T, M) {
          const pipe = QV.estado.contactos.filter(function (c) { return !c.fin && c.etapa >= 4; }).reduce(function (a, c) { return a + c.valor; }, 0);
          const r = l.reduce(function (a, c) { return a + c.valor; }, 0);
          return '**' + M.euros(r) + '** de ' + M.euros(pipe) + ' de pipeline abierto está en riesgo (' + Math.round(r / Math.max(1, pipe) * 100) + ' %). Son ' + l.length + ' oportunidades con reunión o propuesta que se están enfriando.';
        },
        cols: ['nombre', 'valor', ['Motivo', function (c) { return (c.x.riesgoM[0] || {}).txt || ''; }], 'accion'], vista: 'tabla' },
      { q: '¿Qué clientes podrían necesitar un nuevo proyecto?', h: 'lista', obj: ['expansion', 'retencion', 'ventas', 'todo'],
        filtro: function (c) { return c.fin === 'ganado' && !!c.s.exp; }, orden: 'prio',
        intro: function (l, T, M) { return (l.length === 1 ? 'Un cliente tiene' : l.length + ' clientes tienen') + ' un proyecto nuevo a la vista por unos **' + M.euros(l.reduce(function (a, c) { return a + (c.s.expValor || 0); }, 0)) + '**: recertificaciones y activos nuevos del mismo fondo. Nadie les ha escrito todavía. Es el proyecto más fácil de ganar: ya os conocen y ya confían en vosotras.'; },
        cols: ['nombre', ['Qué viene', function (c) { return c.s.expTxt || ''; }], ['Valor estimado', function (c) { return QV.motor.euros(c.s.expValor || 0); }], 'accion'], vista: 'tabla',
        cierre: 'La responsable de proyecto recibe el aviso con el historial del primer proyecto y el motivo. Una llamada suya ahora vale más que una propuesta en frío dentro de tres meses.' },
      { q: '¿Qué oportunidades tienen intención alta?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && c.x.int >= 50; }, orden: 'prob',
        intro: function (l, T, M) { return (l.length === 1 ? 'Una oportunidad muestra' : l.length + ' oportunidades muestran') + ' intención alta ahora mismo' + (l.length > 3 ? '. Estas son las primeras.' : '.'); }, vista: 'cards', max: 3 }
    ],

    historias: {
      breeam: {
        titulo: 'BREEAM para 120 viviendas en Valdebebas',
        contacto: { id: 'demo', n: 'Elisa Robledo', rol: 'Directora Técnica', emp: 'Promociones Encinar del Norte', seg: 'empresa', ciudad: '—', prod: 'Certificación BREEAM', orig: 'c2', canal: 'wa', etapa: 1, valor: 36000, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una oportunidad nueva desde LinkedIn', feed: 'Oportunidad nueva · formulario de LinkedIn · Certificación BREEAM', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa el perfil: promotora con 7 promociones en marcha', feed: 'Perfil completado · promotora · 7 promociones en Madrid', cambio: { tam: 7, ciudad: 'Madrid', f: { tipo: 'promotora' } } },
          { dur: 6, min: 6, txt: 'Elisa mira la página de servicios dos veces y descarga un caso', feed: 'Visita servicios 2 veces · descarga el caso de una promoción BREEAM', cambio: { s: { visitas: 2, precio: true, caso: true } }, act: true },
          { dur: 6, min: 1, txt: 'El agente detecta el interés y escribe por WhatsApp', feed: 'WhatsApp enviado · intención al alza', cambio: { conv: ['a', 'wa', 'Hola Elisa, soy Sofía, del equipo. He visto que te has descargado el caso de la promoción certificada BREEAM. ¿Es para un proyecto concreto?'] }, toque: true },
          { dur: 7, min: 5, txt: 'Elisa contesta', feed: 'Respuesta recibida', cambio: { etapa: 2, conv: ['c', 'wa', 'Sí, una promoción de 120 viviendas en Valdebebas. El comprador nos exige BREEAM y queremos saber plazos y honorarios.'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente hace una sola pregunta de cualificación', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Tiene todo el sentido. Una pregunta para no haceros perder el tiempo: ¿en qué fase está el proyecto y para cuándo esperáis la licencia? En BREEAM conviene entrar antes de cerrar el proyecto de ejecución.'] }, toque: true },
          { dur: 7, min: 4, txt: 'Elisa da plazos y presupuesto', feed: 'Cualificada · licencia en diciembre · presupuesto aprobado', cambio: { f: { licencia: 'licencia prevista en diciembre, obra en marzo' }, s: { urg: true, urgTxt: 'licencia prevista en diciembre y obra en marzo', ppto: 'si', pptoTxt: 'la certificación ya está presupuestada en la promoción' }, conv: ['c', 'wa', 'Tenemos el proyecto básico terminado. Esperamos la licencia en diciembre y empezar obra en marzo. La certificación ya está presupuestada en la promoción.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la reunión con la socia', feed: 'Reunión agendada · jueves 10:00 con la socia', cambio: { etapa: 4, s: { cita: 1600, citaOk: true }, conv: ['a', 'wa', 'Perfecto, vais bien de tiempo. Te dejo el jueves a las 10:00 con Carlota, socia y evaluadora BREEAM, 45 minutos. Te llega la invitación al correo.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a la socia: Elisa está lista para hablar', feed: 'Aviso enviado a la socia', humano: { titulo: 'Elisa está lista para hablar', texto: 'Directora Técnica · promotora con 7 promociones · 120 viviendas en Valdebebas · el comprador exige BREEAM · proyecto básico terminado, licencia prevista en diciembre y obra en marzo · certificación ya presupuestada. Reunión el jueves a las 10:00.' } }
        ]
      }
    },
    historiaDefecto: 'breeam',

    contactos: [
      // --- Calientes
      { id: 'k01', n: 'Natalia Ferrán', rol: 'Directora Técnica', emp: 'Promociones Alameda Norte', seg: 'empresa', tam: 9, ciudad: 'Madrid', prod: 'Certificación BREEAM', orig: 'c2', canal: 'wa', etapa: 3, valor: 38000, creado: 3 * D, act: 25, toque: 4 * H,
        f: { tipo: 'promotora', licencia: 'licencia concedida, obra en enero' }, s: { visitas: 3, precio: true, caso: true, urg: true, urgTxt: 'la obra arranca en enero y el fondo comprador exige BREEAM Excelente' },
        conv: [[3 * D, 'a', 'wa', 'Hola Natalia, soy Sofía, del equipo. He visto que te has descargado el caso de la promoción certificada BREEAM. ¿Es para un proyecto concreto?'], [3 * D - 50, 'c', 'wa', 'Sí, una promoción de 84 viviendas en Getafe. El fondo que nos la compra pide BREEAM Excelente.'], [4 * H, 'a', 'wa', 'Encaja con lo que hacemos. ¿Te va bien una reunión de 45 minutos con Carlota, la socia, esta semana?'], [25, 'c', 'wa', 'Sí, martes o miércoles. Y si me podéis adelantar honorarios aproximados mejor, que la obra arranca en enero.']] },
      { id: 'k02', n: 'Álvaro Nieto', rol: 'Asset Manager', emp: 'Lindero Real Estate Partners', seg: 'empresa', tam: 22, ciudad: 'Madrid', prod: 'Due diligence ESG de activo', orig: 'c1', canal: 'email', etapa: 5, valor: 19000, creado: 18 * D, act: 3 * H, toque: 1 * D,
        f: { tipo: 'gestora' }, s: { prop: 3 * D, propVista: 4, ppto: 'si', pptoTxt: 'el fondo tiene partida para la due diligence', urg: true, urgTxt: 'la compra del edificio se firma el 30 de octubre' },
        conv: [[18 * D, 'a', 'email', 'Hola Álvaro, soy Sofía, del equipo. Nos pasa tu contacto un cliente común. ¿Para qué activo necesitáis la due diligence ESG?'], [17 * D, 'c', 'email', 'Un edificio de oficinas de 9.000 m² en Madrid que estamos comprando. Firmamos el 30 de octubre.'], [3 * D, 'h', 'email', 'Te envío la propuesta con el alcance y el calendario para llegar a la firma.'], [1 * D, 'h', 'email', '¿Pudiste verla con el equipo?'], [3 * H, 'c', 'email', 'Sí. ¿Podéis incluir el análisis de riesgo climático físico? Lo pide el comité de inversión.']] },
      { id: 'k03', n: 'Marina Esteve', rol: 'Directora de Sostenibilidad', emp: 'Mirador Living SOCIMI', seg: 'empresa', tam: 14, ciudad: 'Barcelona', prod: 'Certificación LEED', orig: 'c4', canal: 'wa', etapa: 1, valor: 42000, creado: 18, act: 18, toque: null,
        f: { tipo: 'socimi' }, s: { visitas: 2 }, conv: [] },
      // --- Propuestas enfriándose
      { id: 'k04', n: 'Federico Lasheras', rol: 'CEO', emp: 'Grupo Lasheras Patrimonio', seg: 'empresa', tam: 18, ciudad: 'Madrid', prod: 'Estrategia ESG de cartera', orig: 'c3', canal: 'email', etapa: 5, valor: 42000, creado: 34 * D, act: 12 * D, toque: 12 * D,
        f: { tipo: 'family office' }, s: { prop: 12 * D, propVista: 0 },
        conv: [[20 * D, 'h', 'email', 'Federico, encantada de saludarte en SIMA. Como te comenté, podemos ordenar la estrategia ESG de los 18 activos en un solo plan.'], [19 * D, 'c', 'email', 'Nos interesa. Mandadnos una propuesta y la vemos en el consejo.'], [12 * D, 'h', 'email', 'Te envío la propuesta de estrategia ESG de cartera. Cualquier duda me dices.']] },
      { id: 'k05', n: 'Lucía Olmedo', rol: 'Directora Técnica', emp: 'Promotora Ribera del Tajo', seg: 'empresa', tam: 6, ciudad: 'Toledo', prod: 'Certificación BREEAM', orig: 'c2', canal: 'email', etapa: 6, valor: 28000, creado: 30 * D, act: 2 * D, toque: 8 * D,
        f: { tipo: 'promotora', licencia: 'obra en marcha desde septiembre' }, s: { prop: 8 * D, propVista: 3 },
        conv: [[8 * D, 'h', 'email', 'Lucía, te comparto la propuesta revisada con las dos fases: diseño y post-construcción.'], [7 * D, 'c', 'email', 'Gracias. La vemos con el comité de inversión y te digo algo.']] },
      { id: 'k06', n: 'Hugo Cardona', rol: 'Asset Manager', emp: 'Norte Logístico Capital', seg: 'empresa', tam: 11, ciudad: 'Zaragoza', prod: 'Taxonomía UE y reporting CSRD', orig: 'c1', canal: 'email', etapa: 5, valor: 24000, creado: 26 * D, act: 4 * D, toque: 6 * D,
        f: { tipo: 'gestora' }, s: { prop: 6 * D, propVista: 2 },
        conv: [[6 * D, 'h', 'email', 'Hugo, te mando la propuesta para el alineamiento con la taxonomía y el primer informe CSRD.'], [6 * D - 2 * H, 'c', 'email', 'Recibida, gracias. La vemos con el comité.']] },
      { id: 'k07', n: 'Beatriz Ocaña', rol: 'Directora de Sostenibilidad', emp: 'Hábitat Levante Promociones', seg: 'empresa', tam: 7, ciudad: 'Valencia', prod: 'Certificado WELL', orig: 'c4', canal: 'wa', etapa: 6, valor: 18000, creado: 21 * D, act: 20 * H, toque: 5 * D,
        f: { tipo: 'promotora' }, s: { prop: 5 * D, propVista: 5, precio: true, visitas: 2 },
        conv: [[5 * D, 'h', 'wa', 'Beatriz, te acabo de mandar la propuesta de WELL al correo.'], [20 * H, 'c', 'wa', 'La he visto varias veces. ¿Se podría hacer WELL solo en las zonas comunes y bajar honorarios?']] },
      { id: 'k08', n: 'Tomás Ugarte', rol: 'Director Técnico', emp: 'Ugarte Promociones', seg: 'empresa', tam: 5, ciudad: 'Bilbao', prod: 'Due diligence ESG de activo', orig: 'c5', canal: 'email', etapa: 5, valor: 11000, creado: 15 * D, act: 4 * D, toque: 4 * D,
        f: { tipo: 'promotora' }, s: { prop: 4 * D, propVista: 1 },
        conv: [[15 * D, 'a', 'email', 'Hola Tomás, te escribo porque ayudamos a promotoras a preparar sus activos para la venta a fondos con criterios ESG.'], [14 * D, 'c', 'email', 'Nos puede interesar para un edificio de oficinas en Abando que queremos vender el año que viene.'], [4 * D, 'h', 'email', 'Te adjunto la propuesta de due diligence ESG del edificio.']] },
      // --- Reuniones
      { id: 'k09', n: 'Elena Sarasola', rol: 'Directora de Sostenibilidad', emp: 'Cantábrica Rentas SOCIMI', seg: 'empresa', tam: 16, ciudad: 'Santander', prod: 'Taxonomía UE y reporting CSRD', orig: 'c2', canal: 'wa', etapa: 4, valor: 30000, creado: 7 * D, act: 5 * H, toque: 5 * H,
        f: { tipo: 'socimi' }, s: { cita: 20 * H, citaOk: false, visitas: 2 },
        conv: [[7 * D, 'a', 'wa', 'Hola Elena, soy Sofía, del equipo. ¿Qué os gustaría resolver con la CSRD?'], [7 * D - 40, 'c', 'wa', 'Tenemos que reportar el año que viene y no sabemos qué parte de la cartera se alinea con la taxonomía.'], [5 * H, 'a', 'wa', 'Te recuerdo la reunión de mañana con Carlota. ¿Te sigue viniendo bien la hora?']] },
      { id: 'k10', n: 'Ramón Quiroga', rol: 'CEO', emp: 'Quiroga Desarrollos', seg: 'empresa', tam: 8, ciudad: 'A Coruña', prod: 'Certificación BREEAM', orig: 'c1', canal: 'email', etapa: 4, valor: 26000, creado: 9 * D, act: 1 * D, toque: 1 * D,
        f: { tipo: 'promotora', licencia: 'licencia solicitada, obra prevista en primavera' }, s: { cita: 3 * D, citaOk: true },
        conv: [[9 * D, 'c', 'email', 'Nos ha pasado vuestro contacto el estudio de arquitectura. Tenemos un edificio de oficinas en A Grela y queremos certificarlo.'], [1 * D, 'h', 'email', 'Confirmada la reunión con Carlota. Si podéis, traed los planos del proyecto básico.']] },
      { id: 'k11', n: 'Daniel Pozuelo', rol: 'Director Técnico', emp: 'Cuatro Vientos Residencial', seg: 'empresa', tam: 6, ciudad: 'Madrid', prod: 'Certificación LEED', orig: 'c3', canal: 'wa', etapa: 4, valor: 32000, creado: 12 * D, act: 2 * D, toque: 2 * D,
        f: { tipo: 'promotora' }, s: { noshow: true, visitas: 2 },
        conv: [[5 * D, 'a', 'wa', 'Hola Daniel, te confirmo la reunión con Carlota, la socia, para ver el LEED del edificio. Te llega el enlace al correo.'], [5 * D - 30, 'c', 'wa', 'Perfecto, allí estaré.']], ev: [[2 * D, 'sistema', 'No se conecta a la reunión']] },
      // --- Contestaron y nadie siguió
      { id: 'k12', n: 'Jaime Ortuño', rol: 'Socio', emp: 'Ortuño Arquitectos', seg: 'empresa', tam: 0, ciudad: 'Madrid', prod: 'Certificación BREEAM', orig: 'c3', canal: 'email', etapa: 3, valor: 22000, creado: 16 * D, act: 9 * D, toque: 9 * D,
        f: { tipo: 'arquitectura' }, s: { visitas: 1 },
        conv: [[16 * D, 'a', 'email', 'Hola Jaime, encantadas de conocerte en SIMA. ¿Tenéis algún proyecto en el que haga falta certificación?'], [15 * D, 'c', 'email', 'Sí, un cliente con un edificio de oficinas en Méndez Álvaro va a necesitar BREEAM. Hablamos.'], [9 * D, 'h', 'email', 'Te llamo esta semana y lo vemos.']] },
      { id: 'k13', n: 'Silvia Marcos', rol: 'Directora de Sostenibilidad', emp: 'Solana Rental Housing', seg: 'empresa', tam: 12, ciudad: 'Madrid', prod: 'Taxonomía UE y reporting CSRD', orig: 'c2', canal: 'wa', etapa: 2, valor: 19000, creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: { tipo: 'gestora' }, s: {},
        conv: [[8 * D, 'a', 'wa', 'Hola Silvia, soy Sofía, del equipo. ¿Qué os gustaría resolver en sostenibilidad?'], [7 * D, 'c', 'wa', 'Tenemos que reportar CSRD el año que viene y no sabemos por dónde empezar.'], [5 * D, 'a', 'wa', '¿Lo vemos 20 minutos con la socia?']] },
      { id: 'k14', n: 'Óscar Benavente', rol: 'Director General', emp: 'Benavente Promociones', seg: 'empresa', tam: 4, ciudad: 'Valladolid', prod: 'Certificación BREEAM', orig: 'c4', canal: 'wa', etapa: 2, valor: 21000, creado: 6 * D, act: 4 * D, toque: 6 * D,
        f: { tipo: 'promotora' }, s: { precio: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Óscar, soy Sofía, del equipo. ¿Para qué promoción buscáis la certificación?'], [4 * D, 'c', 'wa', 'Una promoción de 60 viviendas en Arroyo. ¿Cuánto cuesta un BREEAM más o menos?']] },
      // --- Más adelante
      { id: 'k15', n: 'Rocío Galán', rol: 'Directora Técnica', emp: 'Azahar Promociones', seg: 'empresa', tam: 5, ciudad: 'Sevilla', prod: 'Certificación BREEAM', orig: 'c2', canal: 'email', etapa: 3, valor: 26000, creado: 40 * D, act: 28 * D, toque: 28 * D,
        f: { tipo: 'promotora' }, s: { luego: 'diciembre', luegoTxt: 'lo contratarían cuando tengan la licencia, previsiblemente en diciembre' },
        conv: [[28 * D, 'c', 'email', 'Nos encaja, pero hasta que no tengamos la licencia no podemos contratar nada. Calculamos que en diciembre.']] },
      { id: 'k16', n: 'Andrés Villalba', rol: 'Director de Inversiones', emp: 'Arce Value Partners', seg: 'empresa', tam: 24, ciudad: 'Madrid', prod: 'Estrategia ESG de cartera', orig: 'c3', canal: 'email', etapa: 4, valor: 48000, creado: 55 * D, act: 35 * D, toque: 35 * D,
        f: { tipo: 'gestora' }, s: { luego: 'enero', luegoTxt: 'lo retomaría después del cierre del fondo, en enero' },
        conv: [[35 * D, 'c', 'email', 'Nos interesa mucho, pero hasta el cierre del fondo en enero no vamos a decidir nada. Escríbeme entonces.']] },
      // --- Nuevas y en cadencia
      { id: 'k17', n: 'Pilar Esquivel', rol: 'Técnica de Proyectos', emp: 'Hábitat Sur Alquiler', seg: 'empresa', tam: 8, ciudad: 'Málaga', prod: 'Certificado WELL', orig: 'c2', canal: 'wa', etapa: 1, valor: 17000, creado: 2 * D, act: 22 * H, toque: 2 * D - 1,
        f: { tipo: 'gestora' }, s: { intentos: 1, visitas: 2 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Pilar, soy Sofía, del equipo. He visto que te interesa WELL. ¿Es para un edificio concreto?']] },
      { id: 'k18', n: 'Iván Sotomayor', rol: 'Director Técnico', emp: 'Promociones Sotomayor', seg: 'empresa', tam: 5, ciudad: 'Murcia', prod: 'Certificación BREEAM', orig: 'c5', canal: 'email', etapa: 1, valor: 20000, creado: 4 * D, act: 4 * D, toque: 3 * D,
        f: { tipo: 'promotora' }, s: { intentos: 2 },
        conv: [[3 * D, 'a', 'email', 'Hola Iván, te dejo el caso de una promoción de Murcia que certificamos BREEAM Muy Bueno y una pregunta: ¿tenéis alguna promoción que lo vaya a necesitar?']] },
      { id: 'k19', n: 'Nuria Pastrana', rol: 'Asset Manager', emp: 'Gestora Meseta Oficinas', seg: 'empresa', tam: 10, ciudad: 'Madrid', prod: 'Certificación LEED', orig: 'c3', canal: 'tel', etapa: 1, valor: 36000, creado: 45, act: 44, toque: null,
        f: { tipo: 'gestora' }, s: {}, conv: [] },
      // --- Bajo encaje
      { id: 'k21', n: 'Claudia Ruano', rol: 'Estudiante de máster en sostenibilidad', emp: '', seg: 'particular', tam: 0, ciudad: 'Madrid', prod: 'Certificación BREEAM', orig: 'c2', canal: 'email', etapa: 2, valor: 0, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { estudiante: true }, s: {},
        conv: [[4 * D, 'c', 'email', 'Hola, estoy haciendo el TFM sobre BREEAM en vivienda. ¿Podríais pasarme algún informe de ejemplo?']] },
      { id: 'k22', n: 'Rubén Aldana', rol: 'Consultor ESG', emp: 'Aldana Consultores Verdes', seg: 'empresa', tam: 0, ciudad: 'Valencia', prod: 'Certificación LEED', orig: 'c4', canal: 'wa', etapa: 2, valor: 20000, creado: 3 * D, act: 2 * D, toque: 2 * D,
        f: { competidor: true }, s: { precio: true },
        conv: [[2 * D, 'c', 'wa', '¿Me pasáis vuestras tarifas de BREEAM y LEED y cómo organizáis los equipos?']] },
      // --- Clientes: ganadas y perdidas
      { id: 'k23', n: 'Marta Cienfuegos', rol: 'Directora de Activos', emp: 'Albor Oficinas SOCIMI', seg: 'empresa', tam: 12, ciudad: 'Madrid', prod: 'Certificación BREEAM', orig: 'c1', canal: 'email', etapa: 7, valor: 34000, creado: 400 * D, act: 6 * D, toque: 45 * D, fin: 'ganado',
        f: { tipo: 'socimi' }, s: { exp: true, expTxt: 'El BREEAM En Uso de su edificio de Arturo Soria caduca en febrero y hay que recertificarlo', expValor: 14000 },
        conv: [[45 * D, 'h', 'email', 'Os adjunto el certificado final del edificio de Alcobendas. Ha sido un placer trabajar con vosotros.']], ev: [[6 * D, 'sistema', 'Aviso: el certificado BREEAM En Uso de Arturo Soria caduca en febrero']] },
      { id: 'k24', n: 'Ignacio Beltrán', rol: 'Asset Manager', emp: 'Sotavento Gestión Residencial', seg: 'empresa', tam: 15, ciudad: 'Madrid', prod: 'Due diligence ESG de activo', orig: 'c1', canal: 'email', etapa: 7, valor: 15000, creado: 120 * D, act: 9 * D, toque: 60 * D, fin: 'ganado',
        f: { tipo: 'gestora' }, s: { exp: true, expTxt: 'El mismo fondo está comprando un segundo edificio en Valencia y necesitará la due diligence ESG antes de diciembre', expValor: 16000 },
        conv: [[60 * D, 'h', 'email', 'Te dejo el informe final de la due diligence ESG. Quedamos a vuestra disposición.'], [9 * D, 'c', 'email', 'Por cierto, estamos cerrando la compra de otro edificio en Valencia. Os tendré en cuenta.']] },
      { id: 'k25', n: 'Teresa Mendizábal', rol: 'Directora de Sostenibilidad', emp: 'Urgull Promociones', seg: 'empresa', tam: 9, ciudad: 'San Sebastián', prod: 'Certificación LEED', orig: 'c2', canal: 'email', etapa: 7, valor: 38000, creado: 90 * D, act: 20 * D, toque: 20 * D, fin: 'ganado', f: { tipo: 'promotora' }, s: {}, conv: [] },
      { id: 'k26', n: 'Víctor Salcedo', rol: 'Director Técnico', emp: 'Salcedo Residencial', seg: 'empresa', tam: 4, ciudad: 'Málaga', prod: 'Certificación BREEAM', orig: 'c3', canal: 'email', etapa: 5, valor: 27000, creado: 70 * D, act: 40 * D, toque: 38 * D, fin: 'perdido',
        f: { tipo: 'promotora' }, s: { prop: 40 * D, propVista: 1 }, conv: [] }
    ]
  };
})();

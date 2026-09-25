/* Sector: Personalizado (empresa de servicios genérica, para clientes de cualquier sector).
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.otro = {
    id: 'otro',
    nombre: 'Personalizado',
    t: {
      contacto: 'contacto', contactos: 'contactos', Contactos: 'Contactos', Contacto: 'Contacto',
      venta: 'venta', ventas: 'ventas', Ventas: 'Ventas', producto: 'servicio',
      paginaVisitas: 'la página del servicio', cita: 'reunión', Cita: 'Reunión', laCita: 'la reunión',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'el equipo comercial', Comercial: 'Equipo comercial',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'acaban comprando', objetivoPaso: 'agendar la reunión',
      casoExito: 'un caso de éxito de un cliente parecido', valorAlto: 6000, oportunidades: 'contactos',
      atencion: 'contactos que requieren atención', laVenta: 'la venta', Producto: 'Servicio', clientes: 'clientes',
      propuestas: 'propuestas', verbo: 'comprar', clientesReales: 'clientes de verdad', empleados: 'empleados',
      pasoHumano: 'resolver sus dudas de precio y plazos y cerrar la propuesta'
    },
    // Recorrido: Anuncio → Contacto → Conversación → Cualificado → Reunión → Propuesta → Cliente
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'contacto', txt: 'Contacto' },
      { id: 'conversacion', txt: 'Conversación' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'reunion', txt: 'Reunión' },
      { id: 'propuesta', txt: 'Propuesta' },
      { id: 'cliente', txt: 'Cliente' }
    ],
    ventaEtapa: 'cliente',
    ticket: 4800,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { conversacion: 0.8, cualificado: 0.55, reunion: 0.5, propuesta: 0.7, cliente: 0.4 },
    nombresFuga: {
      conversacion: { txt: 'Respuesta', exp: 'contactos que escriben y nunca llegan a hablar con nadie' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      reunion: { txt: 'Seguimiento', exp: 'contactos cualificados a los que nadie cierra la reunión' },
      propuesta: { txt: 'Propuesta', exp: 'reuniones que no terminan en una propuesta' },
      cliente: { txt: 'Cierre', exp: 'propuestas enviadas que nadie vuelve a trabajar' }
    },
    mesDatos: { respuestaAntes: 196, respuestaAhora: 1, agendadas: 97 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Consultoría inicial gratuita', inversion: 2600, ticket: 3200,
        embudo: { anuncio: 16000, contacto: 230, conversacion: 120, cualificado: 62, reunion: 26, propuesta: 17, cliente: 6 } },
      { id: 'c2', canal: 'Google', nombre: 'Servicio mensual para empresas', inversion: 3100, ticket: 6400,
        embudo: { anuncio: 5400, contacto: 170, conversacion: 96, cualificado: 56, reunion: 26, propuesta: 18, cliente: 7 } },
      { id: 'c3', canal: 'LinkedIn', nombre: 'Proyectos a medida', inversion: 2200, ticket: 9800,
        embudo: { anuncio: 3900, contacto: 80, conversacion: 46, cualificado: 28, reunion: 14, propuesta: 10, cliente: 4 } },
      { id: 'c4', canal: 'Meta', nombre: 'Plan básico para autónomos', inversion: 1400, ticket: 1800,
        embudo: { anuncio: 9100, contacto: 75, conversacion: 38, cualificado: 16, reunion: 6, propuesta: 3, cliente: 1 } },
      { id: 'c5', canal: 'Web', nombre: 'Web y recomendaciones (orgánico)', inversion: 0, ticket: 5000,
        embudo: { anuncio: 2400, contacto: 45, conversacion: 30, cualificado: 18, reunion: 8, propuesta: 6, cliente: 3 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Contactos', cualificados: 'Contactos cualificados', entrevistas: 'Reuniones', ventas: 'Ventas', cpv: 'Coste por venta', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'contacto', cualificados: 'cualificado', entrevistas: 'reunion' },

    reglas: {
      fitBase: 28,
      fit: [
        [function (c) { return c.seg === 'empresa' && c.tam >= 20; }, 20, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 20 empleados o más'],
        [function (c) { return c.seg === 'empresa' && c.tam >= 5 && c.tam < 20; }, 14, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 5 a 19 empleados'],
        [function (c) { return tieneRol(c, /director|gerente|ceo|fundador|socio|propietari|responsable/i); }, 12, function (c) { return 'decide la compra (' + c.rol + ')'; }, 'Su puesto decide la compra'],
        [function (c) { return c.f && c.f.pptoOk; }, 16, 'presupuesto acorde al servicio'],
        [function (c) { return c.f && c.f.necesidad; }, 12, 'necesidad clara y concreta'],
        [function (c) { return c.valor >= 6000; }, 8, 'servicio de ticket alto'],
        [function (c) { return c.f && c.f.soloPrecio; }, -16, 'solo compara precios'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca algo gratis'],
        [function (c) { return c.f && c.f.competencia; }, -30, 'trabaja para la competencia']
      ],
      intencion: [
        [function (c) { return c.s.reunionQ; }, 12, 'pidió una reunión'],
        [function (c) { return c.s.plazoQ; }, 10, 'preguntó cuándo podríais empezar'],
        [function (c) { return c.s.referencias; }, 8, 'pidió referencias de clientes']
      ]
    },

    preguntas: [
      { q: '¿Qué contactos tienen más probabilidad de comprar?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Qué propuestas se están enfriando?', h: 'lista', obj: ['ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return c.s.prop != null && !c.fin; }, orden: 'toque', suma: true,
        intro: function (l, T, M) { return l.length + ' propuestas enviadas siguen sin respuesta. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ': el trabajo ya está hecho, falta que alguien las trabaje.'; },
        vista: 'tabla' },
      { q: '¿Quién dijo que lo retomaría más adelante?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' contactos dijeron que lo retomarían más adelante. Ninguno es un no: el agente de reactivación les escribe en la fecha que ellos mismos dieron.'; },
        vista: 'tabla' },
      { q: '¿Qué empresas grandes están abiertas ahora?', h: 'lista', obj: ['ventas', 'expansion', 'todo'],
        filtro: function (c) { return c.seg === 'empresa' && c.tam >= 20 && !c.fin; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' empresas de más de 20 empleados tienen una conversación abierta. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en ventas posibles.'; },
        vista: 'tabla' }
    ],

    historias: {
      reunion: {
        titulo: 'Una empresa pide información desde Google',
        contacto: { id: 'demo', n: 'Sofía Herrero', rol: 'Directora de Operaciones', emp: 'Distribuciones Altamira', seg: 'empresa', ciudad: '—', prod: 'Servicio mensual para empresas', orig: 'c2', canal: 'wa', etapa: 1, valor: 7200, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde Google', feed: 'Nueva solicitud · Servicio mensual para empresas', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: empresa, tamaño y sector', feed: 'Ficha completada · 45 empleados · distribución', cambio: { tam: 45, ciudad: 'Zaragoza' } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 55 segundos', cambio: { conv: ['a', 'wa', 'Hola Sofía, soy Andrea, del equipo comercial. He visto que os interesa el servicio mensual. ¿Qué os gustaría resolver primero?'] }, toque: true },
          { dur: 6, min: 9, txt: 'Sofía vuelve a la página del servicio y mira los casos', feed: 'Visita la página del servicio (3 veces)', cambio: { s: { visitas: 3 } }, act: true },
          { dur: 7, min: 3, txt: 'Sofía contesta con una necesidad concreta', feed: 'Respuesta recibida · necesidad clara', cambio: { etapa: 2, f: { necesidad: true }, s: { urg: true, urgTxt: 'quiere tenerlo en marcha antes de fin de trimestre', plazoQ: true }, conv: ['c', 'wa', 'Tenemos todo en hojas de cálculo y no llegamos. Queremos tenerlo en marcha antes de fin de trimestre. ¿Cuándo podríais empezar?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente cualifica con una sola pregunta', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Podemos arrancar en dos semanas. Para prepararte opciones: ¿tenéis un presupuesto mensual en mente y quién más decide?'] }, toque: true },
          { dur: 7, min: 4, txt: 'Sofía confirma presupuesto y pide reunión', feed: 'Presupuesto confirmado · pide reunión', cambio: { f: { pptoOk: true }, s: { precio: true, reunionQ: true, ppto: 'si', pptoTxt: 'tiene unos 600 € al mes aprobados' }, conv: ['c', 'wa', 'Tenemos unos 600 al mes aprobados y decido yo con el gerente. ¿Cuánto costaría? ¿Lo vemos esta semana?'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la reunión con el equipo comercial', feed: 'Reunión agendada · miércoles 12:00', cambio: { etapa: 4, s: { cita: 1600, citaOk: true }, conv: ['a', 'wa', 'Hecho: miércoles a las 12:00, 30 minutos con Pablo, del equipo comercial. Te llega la invitación al correo con un resumen de lo que hemos hablado.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Sofía está lista para hablar', feed: 'Aviso enviado al equipo comercial', humano: { titulo: 'Sofía está lista para hablar', texto: '45 empleados · todo en hojas de cálculo · 600 € al mes aprobados · quiere arrancar antes de fin de trimestre y decide con el gerente. Reunión el miércoles a las 12:00.' } }
        ]
      }
    },
    historiaDefecto: 'reunion',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'o01', n: 'Ricardo Mena', rol: 'Gerente', emp: 'Talleres Mena Hermanos', seg: 'empresa', tam: 38, ciudad: 'Valladolid', prod: 'Servicio mensual para empresas', orig: 'c2', canal: 'wa', etapa: 3, valor: 7800, creado: 2 * D, act: 20, toque: 55,
        f: { necesidad: true, pptoOk: true }, s: { visitas: 3, precio: true, reunionQ: true, urg: true, urgTxt: 'quiere arrancar antes de fin de mes' },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Ricardo, soy Andrea, del equipo comercial. ¿Qué os gustaría resolver primero?'], [2 * D - 45, 'c', 'wa', 'Tenemos el día a día muy desordenado, lo estamos mirando.'], [55, 'a', 'wa', '¿Para cuándo lo necesitaríais en marcha?'], [20, 'c', 'wa', 'Cuanto antes, antes de fin de mes. ¿Cuánto sería al mes? ¿Podemos hablar mañana?']] },
      { id: 'o02', n: 'Paula Serrano', rol: 'Directora General', emp: 'Grupo Serrano Eventos', seg: 'empresa', tam: 60, ciudad: 'Madrid', prod: 'Proyecto a medida', orig: 'c3', canal: 'wa', etapa: 3, valor: 11500, creado: 4 * D, act: 90, toque: 4 * H,
        f: { necesidad: true }, s: { visitas: 4, precio: true, plazoQ: true, referencias: true },
        conv: [[4 * D - 2, 'a', 'wa', 'Hola Paula, ¿el proyecto es para toda la empresa o para un área?'], [4 * D - 60, 'c', 'wa', 'Para operaciones, somos 60 personas.'], [4 * H, 'a', 'wa', 'Te paso dos casos de empresas parecidas.'], [90, 'c', 'wa', 'Me encajan. ¿Qué plazos manejáis y qué inversión sería? ¿Me pasas algún cliente con el que hablar?']] },
      { id: 'o03', n: 'Jaime Ortiz', rol: 'Socio fundador', emp: 'Ortiz & Llorente Asesores', seg: 'empresa', tam: 14, ciudad: 'Bilbao', prod: 'Servicio mensual para empresas', orig: 'c2', canal: 'email', etapa: 5, valor: 5400, creado: 14 * D, act: 5 * H, toque: 5 * D,
        f: { necesidad: true, pptoOk: true }, s: { prop: 5 * D, propVista: 3, visitas: 2 },
        conv: [[14 * D, 'a', 'email', 'Hola Jaime, te escribo por el servicio mensual.'], [13 * D, 'c', 'email', 'Nos interesa, ¿podemos verlo en una reunión?'], [5 * D, 'h', 'email', 'Como hablamos en la reunión, te envío la propuesta.']],
        ev: [[5 * H, 'web', 'Abre la propuesta por tercera vez']] },
      { id: 'o04', n: 'Ángela Robles', rol: 'Responsable de Administración', emp: 'Clínica Veterinaria Robles', seg: 'empresa', tam: 12, ciudad: 'Murcia', prod: 'Servicio mensual para empresas', orig: 'c2', canal: 'tel', etapa: 1, valor: 4800, creado: 8, act: 8, toque: null,
        f: { necesidad: true, pptoOk: true }, s: { visitas: 1 }, conv: [] },
      { id: 'o05', n: 'Samuel Prieto', rol: 'Autónomo', seg: 'particular', ciudad: 'Sevilla', prod: 'Plan básico para autónomos', orig: 'c4', canal: 'wa', etapa: 1, valor: 1800, creado: 35, act: 30, toque: null,
        f: {}, s: { visitas: 2 }, conv: [] },
      { id: 'o06', n: 'Nuria Pascual', rol: 'Directora de Marketing', emp: 'Cosmética Brisa Natural', seg: 'empresa', tam: 25, ciudad: 'Valencia', prod: 'Proyecto a medida', orig: 'c3', canal: 'wa', etapa: 4, valor: 9800, creado: 6 * D, act: 5 * H, toque: 20 * H,
        f: { necesidad: true }, s: { cita: 19 * H, citaOk: false, visitas: 2 },
        conv: [[6 * D, 'a', 'wa', 'Hola Nuria, ¿qué te gustaría conseguir con el proyecto?'], [6 * D - 30, 'c', 'wa', 'Ordenar cómo trabajamos con distribuidores.'], [20 * H, 'a', 'wa', 'Te dejo la reunión mañana a las 10:00 con Pablo. ¿Te va bien?']] },
      { id: 'o07', n: 'Héctor Galindo', rol: 'Gerente', emp: 'Frutas Galindo', seg: 'empresa', tam: 30, ciudad: 'Lleida', prod: 'Servicio mensual para empresas', orig: 'c2', canal: 'wa', etapa: 4, valor: 6600, creado: 10 * D, act: 3 * D, toque: 3 * D,
        f: { necesidad: true, pptoOk: true }, s: { noshow: true, precio: true, visitas: 2 },
        conv: [[10 * D, 'a', 'wa', 'Hola Héctor, ¿qué os gustaría mejorar primero?'], [9 * D, 'c', 'wa', 'La parte de pedidos, que la llevamos a mano.'], [4 * D, 'a', 'wa', 'Te espero mañana a las 16:00 con Pablo.']],
        ev: [[3 * D, 'sistema', 'No se presenta a la reunión']] },
      { id: 'o08', n: 'Irene Campos', rol: 'Fotógrafa autónoma', seg: 'particular', ciudad: 'Granada', prod: 'Plan básico para autónomos', orig: 'c4', canal: 'wa', etapa: 4, valor: 1800, creado: 5 * D, act: D, toque: D,
        f: { necesidad: true }, s: { noshow: true, visitas: 1 },
        conv: [[5 * D, 'a', 'wa', 'Hola Irene, ¿lo quieres para organizar tus clientes?'], [5 * D - 20, 'c', 'wa', 'Sí, y la facturación.'], [2 * D, 'a', 'wa', 'Te espero mañana a las 13:00 por videollamada.']],
        ev: [[D, 'sistema', 'No se presenta a la reunión']] },
      // --- Dijeron «más adelante»
      { id: 'o09', n: 'Tomás Beltrán', rol: 'Director Financiero', emp: 'Industrias Beltrán', seg: 'empresa', tam: 85, ciudad: 'Castellón', prod: 'Proyecto a medida', orig: 'c3', canal: 'email', etapa: 3, valor: 12000, creado: 40 * D, act: 30 * D, toque: 30 * D,
        f: { necesidad: true }, s: { luego: 'enero', luegoTxt: 'lo meterá en el presupuesto del año que viene y lo retoma en enero', precio: true },
        conv: [[40 * D, 'a', 'email', 'Hola Tomás, te escribo por el proyecto que nos comentaste.'], [30 * D, 'c', 'email', 'Nos encaja, pero este año ya no hay partida. Lo metemos en el presupuesto del año que viene; escríbeme en enero.']] },
      { id: 'o10', n: 'Carolina Fuentes', rol: 'Propietaria', emp: 'Estudio de Yoga Aire', seg: 'empresa', tam: 4, ciudad: 'Málaga', prod: 'Plan básico para autónomos', orig: 'c4', canal: 'wa', etapa: 2, valor: 1800, creado: 20 * D, act: 18 * D, toque: 18 * D,
        f: {}, s: { luego: 'septiembre', luegoTxt: 'lo haría a la vuelta del verano, con la nueva temporada' },
        conv: [[20 * D, 'a', 'wa', 'Hola Carolina, ¿lo quieres para las reservas o para la facturación?'], [18 * D, 'c', 'wa', 'Para las dos, pero ahora no me da la vida. A la vuelta del verano, con la nueva temporada.']] },
      // --- Sin seguimiento después de contestar
      { id: 'o11', n: 'Emilio Carrasco', rol: 'Director de Operaciones', emp: 'Logística Carrasco', seg: 'empresa', tam: 70, ciudad: 'Guadalajara', prod: 'Servicio mensual para empresas', orig: 'c2', canal: 'wa', etapa: 3, valor: 8400, creado: 9 * D, act: 7 * D, toque: 6 * D,
        f: { necesidad: true }, s: { reunionQ: true, visitas: 2 },
        conv: [[9 * D, 'a', 'wa', 'Hola Emilio, ¿qué os gustaría resolver primero?'], [7 * D, 'c', 'wa', 'El seguimiento de rutas. ¿Podemos tener una reunión la semana que viene?'], [6 * D, 'h', 'wa', 'Claro, te escribo para cuadrarla.']] },
      { id: 'o12', n: 'Rebeca Soler', rol: 'Coordinadora', emp: 'Academia Soler', seg: 'empresa', tam: 9, ciudad: 'Alicante', prod: 'Servicio mensual para empresas', orig: 'c1', canal: 'wa', etapa: 2, valor: 3600, creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: {}, s: { precio: true },
        conv: [[8 * D, 'a', 'wa', 'Hola Rebeca, ¿para cuántas personas sería?'], [7 * D, 'c', 'wa', 'Somos nueve. ¿Precio?'], [5 * D, 'h', 'wa', 'Lo miro y te digo.']] },
      { id: 'o13', n: 'David Morales', rol: 'Gerente', emp: 'Morales Instalaciones', seg: 'empresa', tam: 18, ciudad: 'Toledo', prod: 'Consultoría inicial + servicio mensual', orig: 'c1', canal: 'email', etapa: 5, valor: 4200, creado: 20 * D, act: 10 * D, toque: 9 * D,
        f: { necesidad: true }, s: { prop: 9 * D, visitas: 1 },
        conv: [[20 * D, 'a', 'email', 'Hola David, te escribo por la consultoría inicial.'], [18 * D, 'c', 'email', 'Perfecto, ¿el jueves a las 11?'], [9 * D, 'h', 'email', 'Te envío la propuesta tras la consultoría.']] },
      // --- Nuevos o en cadencia sin respuesta
      { id: 'o14', n: 'Lorena Vidal', rol: 'Responsable de Compras', emp: 'Hoteles Mar Serena', seg: 'empresa', tam: 120, ciudad: 'Palma', prod: 'Proyecto a medida', orig: 'c3', canal: 'email', etapa: 1, valor: 10500, creado: 5 * H, act: 2 * H, toque: 5 * H - 1,
        f: {}, s: { visitas: 3, emails: 2, intentos: 1 },
        conv: [[5 * H - 1, 'a', 'email', 'Hola Lorena, te escribo por el proyecto para vuestros hoteles.']] },
      { id: 'o15', n: 'Adrián Molina', rol: 'Autónomo', seg: 'particular', ciudad: 'Córdoba', prod: 'Plan básico para autónomos', orig: 'c4', canal: 'wa', etapa: 1, valor: 1800, creado: 28 * H, act: 28 * H, toque: 28 * H - 1,
        f: {}, s: { intentos: 1 },
        conv: [[28 * H - 1, 'a', 'wa', 'Hola Adrián, ¿el plan lo quieres para tu negocio?']] },
      { id: 'o16', n: 'Celia Navarro', rol: 'Administrativa', emp: 'Suministros Navarro', seg: 'empresa', tam: 8, ciudad: 'Huesca', prod: 'Servicio mensual para empresas', orig: 'c1', canal: 'wa', etapa: 1, valor: 3600, creado: 20 * D, act: 20 * D, toque: 14 * D, f: {}, s: { intentos: 3 },
        conv: [[20 * D, 'a', 'wa', 'Hola Celia, ¿qué os gustaría mejorar primero?']] },
      { id: 'o17', n: 'Pedro Luque', rol: 'Autónomo', seg: 'particular', ciudad: 'Jaén', prod: 'Plan básico para autónomos', orig: 'c4', canal: 'email', etapa: 1, valor: 1800, creado: 12 * D, act: 12 * D, toque: 8 * D, f: {}, s: { intentos: 3 },
        conv: [[12 * D, 'a', 'email', 'Hola Pedro, te escribo por el plan para autónomos.']] },
      // --- Encaje bajo o fuera
      { id: 'o18', n: 'Martín Rey', rol: 'Estudiante', seg: 'particular', ciudad: 'Salamanca', prod: 'Consultoría inicial gratuita', orig: 'c1', canal: 'wa', etapa: 2, valor: 1500, creado: 3 * D, act: 2 * D, toque: 2 * D,
        f: { gratis: true }, s: { ppto: 'no' },
        conv: [[3 * D, 'a', 'wa', 'Hola Martín, ¿para qué negocio sería?'], [2 * D, 'c', 'wa', 'No tengo negocio, es para un trabajo de clase. ¿Me podéis pasar información gratis?']] },
      { id: 'o19', n: 'Verónica Pardo', rol: 'Consultora', emp: 'Pardo Consulting', seg: 'empresa', tam: 3, ciudad: 'Madrid', prod: 'Servicio mensual para empresas', orig: 'c2', canal: 'wa', etapa: 2, valor: 3600, creado: 4 * D, act: 3 * D, toque: 3 * D,
        f: { competencia: true, soloPrecio: true }, s: { precio: true },
        conv: [[4 * D, 'a', 'wa', 'Hola Verónica, ¿qué os gustaría resolver?'], [3 * D, 'c', 'wa', 'Ofrecemos algo parecido y quería ver vuestras tarifas y cómo lo hacéis.']] },
      // --- Reuniones en marcha
      { id: 'o20', n: 'Gloria Sanz', rol: 'Directora de RR. HH.', emp: 'Grupo Sanz Alimentación', seg: 'empresa', tam: 150, ciudad: 'Burgos', prod: 'Proyecto a medida', orig: 'c5', canal: 'wa', etapa: 4, valor: 11000, creado: 5 * D, act: 6 * H, toque: 6 * H,
        f: {}, s: { cita: 2 * D, citaOk: true, visitas: 2 },
        conv: [[5 * D, 'a', 'wa', 'Hola Gloria, ¿qué os gustaría conseguir con el proyecto?'], [5 * D - 50, 'c', 'wa', 'Unificar cómo trabajan las tres plantas.'], [6 * H, 'c', 'wa', '¿Lo vemos el viernes?'], [6 * H - 10, 'a', 'wa', 'Confirmada la reunión del viernes a las 9:30 con Pablo.']] },
      // --- Ya clientes
      { id: 'o21', n: 'Alberto Rincón', rol: 'CEO', emp: 'Rincón Reformas y Servicios', seg: 'empresa', tam: 40, ciudad: 'Zaragoza', prod: 'Servicio mensual para empresas', orig: 'c2', canal: 'email', etapa: 6, valor: 7200, creado: 90 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { necesidad: true }, s: { exp: true, expTxt: 'Quiere ampliar el servicio a su segunda oficina' },
        conv: [[2 * D, 'c', 'email', 'Está funcionando muy bien. ¿Podemos ampliarlo a la oficina de Huesca?']] },
      { id: 'o22', n: 'Lucía Garrido', rol: 'Gerente', emp: 'Panadería Garrido', seg: 'empresa', tam: 11, ciudad: 'Soria', prod: 'Servicio mensual para empresas', orig: 'c1', canal: 'wa', etapa: 6, valor: 3600, creado: 45 * D, act: 7 * D, toque: 7 * D, fin: 'ganado', f: {}, s: {}, conv: [] },
      { id: 'o23', n: 'Jorge Benítez', rol: 'Director de Operaciones', emp: 'Transportes Benítez', seg: 'empresa', tam: 55, ciudad: 'Badajoz', prod: 'Proyecto a medida', orig: 'c3', canal: 'email', etapa: 5, valor: 9600, creado: 50 * D, act: 30 * D, toque: 25 * D, fin: 'perdido', f: {}, s: { prop: 32 * D }, conv: [] }
    ]
  };
})();

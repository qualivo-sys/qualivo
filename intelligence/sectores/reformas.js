/* Sector: Reformas (reformas integrales, cocinas, baños y comunidades de propietarios).
 * Todos los nombres, empresas y direcciones son inventados. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };
  const haContestado = function (c) { return (c.conv || []).some(function (m) { return (m.de || m[1]) === 'c'; }); };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.reformas = {
    id: 'reformas',
    nombre: 'Reformas',
    t: {
      contacto: 'cliente', contactos: 'clientes', Contactos: 'Clientes', Contacto: 'Cliente',
      venta: 'obra aceptada', ventas: 'obras aceptadas', Ventas: 'Obras aceptadas', producto: 'reforma',
      paginaVisitas: 'la galería de reformas', cita: 'visita técnica', Cita: 'Visita técnica', laCita: 'la visita técnica',
      propuesta: 'el presupuesto', Propuesta: 'Presupuesto', comercial: 'el jefe de obra', Comercial: 'Jefe de obra',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'aceptan el presupuesto', objetivoPaso: 'agendar la visita técnica',
      casoExito: 'el antes y el después de una reforma parecida', valorAlto: 20000, oportunidades: 'clientes',
      atencion: 'clientes que requieren atención', laVenta: 'la obra aceptada', Producto: 'Reforma', clientes: 'clientes',
      propuestas: 'presupuestos', verbo: 'aceptar el presupuesto', clientesReales: 'obras de verdad', empleados: 'viviendas',
      pasoHumano: 'resolver sus dudas técnicas y de plazos y cerrar la fecha de inicio',
      txtPrecio: 'preguntó cuánto costaría'
    },
    // Recorrido: Anuncio → Pide presupuesto → Contactado → Visita técnica → Presupuesto enviado → Seguimiento → Obra aceptada
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'solicitud', txt: 'Pide presupuesto' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'visita', txt: 'Visita técnica' },
      { id: 'presupuesto', txt: 'Presupuesto enviado' },
      { id: 'seguimiento', txt: 'Seguimiento' },
      { id: 'obra', txt: 'Obra aceptada' }
    ],
    ventaEtapa: 'obra',
    ticket: 16500,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, visita: 0.6, presupuesto: 0.85, seguimiento: 0.8, obra: 0.45 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'clientes que piden presupuesto y tardan un día en recibir respuesta' },
      visita: { txt: 'Visita técnica', exp: 'clientes que contestan y a los que nadie les agenda la visita técnica' },
      presupuesto: { txt: 'Presupuesto', exp: 'visitas técnicas cuyo presupuesto tarda semanas en llegar' },
      seguimiento: { txt: 'Seguimiento del presupuesto', exp: 'presupuestos enviados a los que nadie vuelve a llamar' },
      obra: { txt: 'Cierre', exp: 'presupuestos en seguimiento que no terminan en obra' }
    },
    mesDatos: { respuestaAntes: 1110, respuestaAhora: 2, agendadas: 168 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Reforma integral de pisos', inversion: 4200, ticket: 28000,
        embudo: { anuncio: 18500, solicitud: 190, contactado: 138, visita: 50, presupuesto: 40, seguimiento: 26, obra: 6 } },
      { id: 'c2', canal: 'Google', nombre: 'Reforma de baño en 5 días', inversion: 3100, ticket: 7800,
        embudo: { anuncio: 5200, solicitud: 150, contactado: 112, visita: 42, presupuesto: 33, seguimiento: 20, obra: 5 } },
      { id: 'c3', canal: 'Google', nombre: 'Cocinas llave en mano', inversion: 2300, ticket: 14500,
        embudo: { anuncio: 4100, solicitud: 95, contactado: 68, visita: 24, presupuesto: 19, seguimiento: 12, obra: 3 } },
      { id: 'c4', canal: 'Meta', nombre: 'Rehabilitación de fachadas para comunidades', inversion: 1400, ticket: 42000,
        embudo: { anuncio: 7600, solicitud: 45, contactado: 32, visita: 12, presupuesto: 9, seguimiento: 6, obra: 1 } },
      { id: 'c5', canal: 'Web', nombre: 'Web y recomendaciones (orgánico)', inversion: 0, ticket: 16000,
        embudo: { anuncio: 2300, solicitud: 40, contactado: 30, visita: 14, presupuesto: 11, seguimiento: 8, obra: 4 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Solicitudes de presupuesto', cualificados: 'Clientes contactados', entrevistas: 'Visitas técnicas', ventas: 'Obras aceptadas', cpv: 'Coste por obra aceptada', ingresos: 'Obra contratada' },
    kpiEtapas: { interesados: 'solicitud', cualificados: 'contactado', entrevistas: 'visita' },

    reglas: {
      fitBase: 24,
      fit: [
        [function (c) { return c.f && c.f.propietario; }, 14, 'es el propietario del inmueble'],
        [function (c) { return c.f && c.f.pptoOk; }, 16, 'presupuesto acorde a la obra'],
        [function (c) { return c.valor >= 20000; }, 12, 'reforma integral o de importe alto'],
        [function (c) { return c.seg === 'comunidad' && c.tam >= 12; }, 12, function (c) { return 'comunidad de ' + c.tam + ' viviendas'; }, 'Comunidad de 12 viviendas o más'],
        [function (c) { return c.seg === 'comunidad' && tieneRol(c, /presidente|administrador/i); }, 8, function (c) { return 'decide la obra (' + c.rol + ')'; }, 'Quien escribe decide la obra'],
        [function (c) { return c.f && c.f.zona; }, 10, 'dentro de vuestra zona de servicio'],
        [function (c) { return c.f && c.f.fecha; }, 10, 'tiene fecha para empezar'],
        [function (c) { return c.f && c.f.inquilino; }, -22, 'no es el propietario'],
        [function (c) { return c.f && c.f.fuera; }, -24, 'fuera de vuestra zona de servicio'],
        [function (c) { return c.f && c.f.soloPrecio; }, -14, 'solo compara precios'],
        [function (c) { return c.f && c.f.pequena; }, -14, 'trabajo demasiado pequeño para una obra']
      ],
      intencion: [
        [function (c) { return c.s.visitaQ; }, 14, 'pidió la visita técnica'],
        [function (c) { return c.s.fotos; }, 10, 'envió fotos y medidas'],
        [function (c) { return c.s.fechaQ; }, 8, 'preguntó cuándo podríais empezar']
      ]
    },

    preguntas: [
      { q: '¿Qué clientes tienen más probabilidad de aceptar el presupuesto?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Qué presupuestos enviados nadie ha vuelto a llamar?', h: 'lista', obj: ['ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return c.s.prop != null && !c.fin; }, orden: 'toque', suma: true,
        intro: function (l, T, M) { return l.length + ' presupuestos enviados siguen sin respuesta. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en obra: la visita y las mediciones ya están hechas, falta una llamada.'; },
        vista: 'tabla' },
      { q: '¿Quién pidió la visita técnica y todavía no la tiene?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa <= 2 && haContestado(c) && !c.s.luego && !c.s.cita; }, orden: 'prio',
        intro: function (l) { return l.length + ' clientes ya han contestado y no tienen la visita técnica en la agenda. Es la fuga más cara de una empresa de reformas: la meta es agendarla en menos de 24 horas.'; },
        vista: 'tabla' },
      { q: '¿Quién dijo que haría la obra más adelante?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' clientes dijeron que harían la obra más adelante. Ninguno es un no: el agente de reactivación les escribe en la fecha que ellos mismos dieron.'; },
        vista: 'tabla' },
      { q: '¿Qué campaña está trayendo obras de verdad?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] }
    ],

    historias: {
      presupuesto: {
        titulo: 'Una familia pide presupuesto para cocina y baño',
        contacto: { id: 'demo', n: 'Nerea Olmedo', rol: 'Propietaria', seg: 'particular', ciudad: '—', prod: 'Reforma de cocina y baño', orig: 'c3', canal: 'wa', etapa: 1, valor: 21500, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una petición de presupuesto desde Google', feed: 'Nueva solicitud · Reforma de cocina y baño', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: piso en propiedad, dentro de la zona', feed: 'Ficha completada · piso de 1985 en propiedad · zona de servicio', cambio: { ciudad: 'Getafe', f: { propietario: true, zona: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 49 segundos', cambio: { conv: ['a', 'wa', 'Hola Nerea, soy Carla, de la empresa de reformas. He visto que quieres reformar la cocina y el baño. ¿Me mandas un par de fotos y me dices para cuándo te gustaría tenerlo?'] }, toque: true },
          { dur: 6, min: 7, txt: 'Nerea mira cocinas parecidas en la galería', feed: 'Visita la galería de reformas (3 veces)', cambio: { s: { visitas: 3 } }, act: true },
          { dur: 7, min: 4, txt: 'Nerea contesta con fotos y plazo', feed: 'Respuesta recibida · fotos y medidas', cambio: { etapa: 2, s: { fotos: true, fechaQ: true, urg: true, urgTxt: 'quiere tenerlo antes de Navidad' }, conv: ['c', 'wa', 'Te mando fotos. La cocina es de 9 metros y el baño pequeño. Nos gustaría tenerlo antes de Navidad, ¿llegaríais?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente hace una sola pregunta de cualificación', feed: 'Pregunta de cualificación enviada', cambio: { conv: ['a', 'wa', 'Con esas medidas, si empezamos en noviembre llegamos. Para afinar: ¿tenéis un presupuesto aproximado en mente? Así el jefe de obra lleva opciones a la visita.'] }, toque: true },
          { dur: 7, min: 3, txt: 'Nerea confirma presupuesto y pide la visita', feed: 'Presupuesto confirmado · pide visita técnica', cambio: { f: { pptoOk: true, fecha: true }, s: { precio: true, visitaQ: true, ppto: 'si', pptoTxt: 'cuenta con unos 20.000 € para cocina y baño' }, conv: ['c', 'wa', 'Contábamos con unos 20.000 para las dos cosas. ¿Cuánto costaría más o menos? ¿Podéis venir a verlo?'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la visita técnica en menos de 24 horas', feed: 'Visita técnica agendada · mañana 10:00', cambio: { etapa: 3, s: { cita: 1150, citaOk: true }, conv: ['a', 'wa', 'Encaja bien. Mañana a las 10:00 pasa Rubén, el jefe de obra, a medir y te da una horquilla allí mismo. Te llega la confirmación por aquí.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Nerea espera la visita técnica', feed: 'Aviso enviado al jefe de obra', humano: { titulo: 'Nerea espera la visita técnica', texto: 'Cocina de 9 m² y baño pequeño · piso de 1985 en propiedad · unos 20.000 € · quiere terminar antes de Navidad. Visita técnica mañana a las 10:00: llevar muestras y fechas de inicio.' } }
        ]
      }
    },
    historiaDefecto: 'presupuesto',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'r01', n: 'Pilar Esteban', rol: 'Propietaria', seg: 'particular', ciudad: 'Madrid', prod: 'Reforma integral de piso de 90 m²', orig: 'c1', canal: 'wa', etapa: 2, valor: 38000, creado: 26 * H, act: 25, toque: 70,
        f: { propietario: true, zona: true, pptoOk: true }, s: { visitas: 4, precio: true, fotos: true, visitaQ: true, urg: true, urgTxt: 'acaba de comprar el piso y quiere entrar a vivir en febrero' },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Pilar, soy Carla, de la empresa de reformas. ¿Es una reforma integral o solo algunas estancias?'], [26 * H - 60, 'c', 'wa', 'Integral. Acabamos de comprar el piso.'], [70, 'a', 'wa', '¡Enhorabuena! ¿Me mandas el plano o unas fotos?'], [25, 'c', 'wa', 'Te mando el plano y fotos. Queremos entrar en febrero. ¿Cuánto puede salir y cuándo podéis venir a verlo?']],
        ev: [[30, 'web', 'Mira reformas integrales en la galería']] },
      { id: 'r02', n: 'Julián Albero', rol: 'Administrador de fincas', emp: 'Comunidad Av. de los Olmos 14', seg: 'comunidad', tam: 24, ciudad: 'Alcorcón', prod: 'Rehabilitación de fachada', orig: 'c4', canal: 'wa', etapa: 2, valor: 45000, creado: 2 * D, act: 70, toque: 5 * H,
        f: { zona: true, fecha: true }, s: { visitas: 3, precio: true, fotos: true, urg: true, urgTxt: 'la inspección técnica les obliga a reparar la fachada antes de marzo' },
        conv: [[2 * D - 2, 'a', 'wa', 'Hola Julián, soy Carla. ¿La fachada es por la inspección técnica del edificio?'], [2 * D - 90, 'c', 'wa', 'Sí, nos ha salido desfavorable. Hay que reparar antes de marzo.'], [5 * H, 'a', 'wa', '¿Me pasas el informe de la inspección?'], [70, 'c', 'wa', 'Te lo adjunto. La junta es el día 15 y necesito llevar al menos una cifra aproximada.']] },
      { id: 'r03', n: 'Alfonso Crespo', rol: 'Propietario', seg: 'particular', ciudad: 'Pozuelo de Alarcón', prod: 'Reforma integral de chalet (planta baja)', orig: 'c1', canal: 'wa', etapa: 4, valor: 24500, creado: 18 * D, act: 5 * H, toque: 5 * D,
        f: { propietario: true, pptoOk: true, zona: true }, s: { prop: 5 * D, propVista: 3, visitas: 3, precio: true },
        conv: [[18 * D, 'a', 'wa', 'Hola Alfonso, ¿qué parte del chalet queréis reformar?'], [17 * D, 'c', 'wa', 'Toda la planta baja: cocina, salón y un baño.'], [9 * D, 'h', 'wa', 'Gracias por enseñarnos la casa. Esta semana tienes el presupuesto.'], [5 * D, 'h', 'wa', 'Te envío el presupuesto detallado por partidas.']],
        ev: [[5 * H, 'web', 'Abre el presupuesto por tercera vez']] },
      { id: 'r04', n: 'Rosa Medina', rol: 'Propietaria', seg: 'particular', ciudad: 'Leganés', prod: 'Reforma de baño completo', orig: 'c2', canal: 'email', etapa: 4, valor: 8200, creado: 15 * D, act: 9 * D, toque: 8 * D,
        f: { propietario: true, zona: true }, s: { prop: 8 * D, visitas: 1 },
        conv: [[15 * D, 'a', 'email', 'Hola Rosa, te escribo por la reforma del baño.'], [14 * D, 'c', 'email', 'Perfecto, ¿podéis venir el jueves por la tarde?'], [8 * D, 'h', 'email', 'Adjunto el presupuesto de la reforma del baño.']] },
      { id: 'r05', n: 'Eduardo Vázquez', rol: 'Propietario', seg: 'particular', ciudad: 'Madrid', prod: 'Cocina llave en mano', orig: 'c3', canal: 'wa', etapa: 4, valor: 14200, creado: 12 * D, act: D, toque: 4 * D,
        f: { propietario: true, zona: true, pptoOk: true }, s: { prop: 4 * D, propVista: 2, visitas: 2, precio: true },
        conv: [[12 * D, 'a', 'wa', 'Hola Eduardo, ¿la cocina la queréis abrir al salón?'], [11 * D, 'c', 'wa', 'Sí, si se puede tirar el tabique.'], [4 * D, 'h', 'wa', 'Te paso el presupuesto con la cocina abierta y la isla.']],
        ev: [[D, 'web', 'Abre el presupuesto por segunda vez']] },
      { id: 'r06', n: 'Iván Moreno', rol: 'Propietario', seg: 'particular', ciudad: 'Getafe', prod: 'Reforma de baño en 5 días', orig: 'c2', canal: 'tel', etapa: 1, valor: 7800, creado: 4, act: 4, toque: null,
        f: { propietario: true, zona: true, pptoOk: true, fecha: true }, s: { visitas: 1 }, conv: [] },
      { id: 'r07', n: 'Cristina Ramos', rol: 'Propietaria', seg: 'particular', ciudad: 'Madrid', prod: 'Cocina llave en mano', orig: 'c3', canal: 'wa', etapa: 1, valor: 16000, creado: 30, act: 28, toque: null,
        f: { zona: true }, s: { visitas: 2 }, conv: [] },
      { id: 'r08', n: 'Manuel Ortega', rol: 'Propietario', seg: 'particular', ciudad: 'Móstoles', prod: 'Reforma de baño y cambio de bañera por plato', orig: 'c2', canal: 'wa', etapa: 3, valor: 6900, creado: 3 * D, act: 5 * H, toque: 20 * H,
        f: { propietario: true, zona: true }, s: { cita: 18 * H, citaOk: false, fotos: true },
        conv: [[3 * D, 'a', 'wa', 'Hola Manuel, ¿es para cambiar la bañera por un plato de ducha?'], [3 * D - 25, 'c', 'wa', 'Sí, por mi madre, que ya no puede entrar en la bañera.'], [20 * H, 'a', 'wa', 'Te dejo la visita técnica mañana a las 9:30. ¿Te va bien?']] },
      { id: 'r09', n: 'Silvia Navas', rol: 'Propietaria', seg: 'particular', ciudad: 'Fuenlabrada', prod: 'Reforma integral de piso de 70 m²', orig: 'c1', canal: 'wa', etapa: 3, valor: 29000, creado: 9 * D, act: 3 * D, toque: 3 * D,
        f: { propietario: true, zona: true, pptoOk: true }, s: { noshow: true, precio: true, visitas: 2 },
        conv: [[9 * D, 'a', 'wa', 'Hola Silvia, ¿el piso está vacío o vivís en él?'], [9 * D - 40, 'c', 'wa', 'Vacío, era de mi abuela. Queremos reformarlo para alquilarlo.'], [4 * D, 'a', 'wa', 'Te confirmo la visita técnica mañana a las 12:00.']],
        ev: [[3 * D, 'sistema', 'No está en el piso a la hora de la visita técnica']] },
      { id: 'r10', n: 'Fernando Lara', rol: 'Propietario', seg: 'particular', ciudad: 'Madrid', prod: 'Cocina llave en mano', orig: 'c3', canal: 'wa', etapa: 3, valor: 12800, creado: 6 * D, act: D, toque: D,
        f: { propietario: true }, s: { noshow: true, visitas: 1 },
        conv: [[6 * D, 'a', 'wa', 'Hola Fernando, ¿qué te gustaría cambiar de la cocina?'], [6 * D - 30, 'c', 'wa', 'Todo: muebles, encimera y suelo.'], [2 * D, 'a', 'wa', 'Mañana a las 18:00 pasa el jefe de obra a medir.']],
        ev: [[D, 'sistema', 'No está en casa a la hora de la visita técnica']] },
      // --- Dijeron «más adelante»
      { id: 'r11', n: 'Lorena Bravo', rol: 'Propietaria', seg: 'particular', ciudad: 'Alcalá de Henares', prod: 'Reforma de baño completo', orig: 'c2', canal: 'wa', etapa: 2, valor: 8400, creado: 20 * D, act: 18 * D, toque: 18 * D,
        f: { propietario: true, zona: true }, s: { luego: 'enero', luegoTxt: 'prefiere hacer la obra después de Reyes', precio: true },
        conv: [[20 * D, 'a', 'wa', 'Hola Lorena, ¿para cuándo te gustaría hacer la reforma del baño?'], [18 * D, 'c', 'wa', 'Con las fiestas encima, mejor después de Reyes. Escríbeme en enero.']] },
      { id: 'r12', n: 'Gregorio Pineda', rol: 'Propietario', seg: 'particular', ciudad: 'Las Rozas', prod: 'Reforma integral de chalet', orig: 'c5', canal: 'email', etapa: 3, valor: 41000, creado: 35 * D, act: 28 * D, toque: 28 * D,
        f: { propietario: true, zona: true }, s: { luego: 'junio', luegoTxt: 'quiere hacer la obra en verano, cuando se vayan al pueblo' },
        conv: [[35 * D, 'a', 'email', 'Hola Gregorio, te escribo por la reforma del chalet.'], [28 * D, 'c', 'email', 'Gracias. La haremos en verano, cuando nos vayamos al pueblo. Hablamos en junio.']] },
      // --- Contestaron y nadie les agenda la visita
      { id: 'r13', n: 'Beatriz Salinas', rol: 'Propietaria', seg: 'particular', ciudad: 'Madrid', prod: 'Reforma integral de piso de 110 m²', orig: 'c1', canal: 'wa', etapa: 2, valor: 36500, creado: 9 * D, act: 7 * D, toque: 6 * D,
        f: { propietario: true, zona: true, pptoOk: true }, s: { visitaQ: true, fotos: true, visitas: 2 },
        conv: [[9 * D, 'a', 'wa', 'Hola Beatriz, ¿qué estancias queréis reformar?'], [7 * D, 'c', 'wa', 'Todo el piso. Os he mandado fotos. ¿Cuándo podéis venir a verlo?'], [6 * D, 'h', 'wa', 'Te llamo mañana y cuadramos la visita.']] },
      { id: 'r14', n: 'Joaquín Rubio', rol: 'Propietario', seg: 'particular', ciudad: 'Getafe', prod: 'Reforma de baño en 5 días', orig: 'c2', canal: 'wa', etapa: 2, valor: 7200, creado: 9 * D, act: 6 * D, toque: 6 * D,
        f: { zona: true }, s: { precio: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Joaquín, ¿el baño es de plato o de bañera?'], [8 * D, 'c', 'wa', 'Bañera. ¿Cuánto cuesta más o menos?'], [6 * D, 'h', 'wa', 'Depende de lo que haya detrás del alicatado. Lo vemos.']] },
      // --- Nuevos o en cadencia sin respuesta
      { id: 'r15', n: 'Marina Castro', rol: 'Propietaria', seg: 'particular', ciudad: 'Boadilla del Monte', prod: 'Cocina llave en mano', orig: 'c3', canal: 'wa', etapa: 1, valor: 15500, creado: 5 * H, act: 2 * H, toque: 5 * H - 1,
        f: { zona: true }, s: { visitas: 3, intentos: 1 },
        conv: [[5 * H - 1, 'a', 'wa', 'Hola Marina, soy Carla. ¿Me mandas una foto de la cocina y te digo cómo lo haríamos?']] },
      { id: 'r16', n: 'Rafael Soto', rol: 'Propietario', seg: 'particular', ciudad: 'Madrid', prod: 'Reforma integral de piso de 80 m²', orig: 'c1', canal: 'wa', etapa: 1, valor: 31000, creado: 30 * H, act: 30 * H, toque: 30 * H - 1,
        f: { propietario: true }, s: { intentos: 1 },
        conv: [[30 * H - 1, 'a', 'wa', 'Hola Rafael, ¿la reforma sería de todo el piso?']] },
      { id: 'r17', n: 'Luis Guerrero', rol: 'Propietario', seg: 'particular', ciudad: 'Parla', prod: 'Reforma de baño en 5 días', orig: 'c2', canal: 'wa', etapa: 1, valor: 6500, creado: 21 * D, act: 21 * D, toque: 15 * D, f: {}, s: { intentos: 3 },
        conv: [[21 * D, 'a', 'wa', 'Hola Luis, ¿el baño sería para cambiar la bañera por plato?']] },
      { id: 'r18', n: 'Amparo Gil', rol: 'Propietaria', seg: 'particular', ciudad: 'Madrid', prod: 'Cocina llave en mano', orig: 'c3', canal: 'email', etapa: 1, valor: 13000, creado: 14 * D, act: 14 * D, toque: 9 * D, f: { zona: true }, s: { intentos: 3 },
        conv: [[14 * D, 'a', 'email', 'Hola Amparo, te escribo por la reforma de la cocina.']] },
      // --- Encaje bajo o fuera
      { id: 'r19', n: 'Kevin Ruano', rol: 'Inquilino', seg: 'particular', ciudad: 'Madrid', prod: 'Reforma de baño en 5 días', orig: 'c2', canal: 'wa', etapa: 2, valor: 6000, creado: 3 * D, act: 2 * D, toque: 2 * D,
        f: { inquilino: true, pequena: true }, s: { precio: true },
        conv: [[3 * D, 'a', 'wa', 'Hola Kevin, ¿qué te gustaría reformar del baño?'], [2 * D, 'c', 'wa', 'Solo cambiar el grifo y una mampara. Vivo de alquiler, ¿cuánto sería?']] },
      { id: 'r20', n: 'Aurora Jiménez', rol: 'Propietaria', seg: 'particular', ciudad: 'Toledo', prod: 'Reforma integral de piso de 60 m²', orig: 'c1', canal: 'wa', etapa: 2, valor: 22000, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { propietario: true, fuera: true, soloPrecio: true }, s: { ppto: 'no' },
        conv: [[5 * D, 'a', 'wa', 'Hola Aurora, ¿dónde está el piso?'], [4 * D, 'c', 'wa', 'En Toledo. Solo quiero comparar precios, ya tengo otros tres presupuestos.']] },
      // --- Visitas en marcha
      { id: 'r21', n: 'Óscar Ferrándiz', rol: 'Presidente de la comunidad', emp: 'Comunidad Calle Río Tajo 8', seg: 'comunidad', tam: 16, ciudad: 'Leganés', prod: 'Rehabilitación de fachada y portal', orig: 'c4', canal: 'wa', etapa: 3, valor: 39000, creado: 6 * D, act: 6 * H, toque: 6 * H,
        f: { zona: true }, s: { cita: 3 * D, citaOk: true, fotos: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Óscar, ¿la obra es de fachada, portal o las dos cosas?'], [6 * D - 45, 'c', 'wa', 'Las dos. La comunidad ya lo ha aprobado.'], [6 * H, 'c', 'wa', '¿El lunes podéis pasar a verlo?'], [6 * H - 10, 'a', 'wa', 'Confirmada la visita técnica del lunes a las 10:00. Te mando la confirmación por aquí.']] },
      // --- Ya cerrados
      { id: 'r22', n: 'Mercedes Aguado', rol: 'Propietaria', seg: 'particular', ciudad: 'Madrid', prod: 'Cocina llave en mano', orig: 'c3', canal: 'wa', etapa: 6, valor: 15800, creado: 70 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { propietario: true }, s: { exp: true, expTxt: 'Está encantada con la cocina y pide presupuesto para los dos baños' },
        conv: [[2 * D, 'c', 'wa', 'La cocina ha quedado preciosa. ¿Nos podéis hacer presupuesto para los dos baños?']] },
      { id: 'r23', n: 'Antonio Palacios', rol: 'Propietario', seg: 'particular', ciudad: 'Getafe', prod: 'Reforma de baño en 5 días', orig: 'c2', canal: 'wa', etapa: 6, valor: 7600, creado: 40 * D, act: 8 * D, toque: 8 * D, fin: 'ganado', f: { propietario: true }, s: {}, conv: [] },
      { id: 'r24', n: 'Teresa Vidal', rol: 'Propietaria', seg: 'particular', ciudad: 'Madrid', prod: 'Reforma integral de piso de 75 m²', orig: 'c1', canal: 'wa', etapa: 4, valor: 27500, creado: 50 * D, act: 30 * D, toque: 25 * D, fin: 'perdido', f: { propietario: true }, s: { prop: 32 * D }, conv: [] }
    ]
  };

})();

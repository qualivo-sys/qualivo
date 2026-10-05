/* Sector: Marketplace de retiros (yoga, meditación, silencio, sanación emocional).
 * Un marketplace que cobra por reserva (depósito o comisión) y vive del SEO y de
 * una base de datos grande de gente que pidió información o viajó y no volvió.
 * Aquí no hay anuncios: las «campañas» son fuentes (base de datos, orgánico,
 * asistente de retiros, newsletter, carrito abandonado). La venta es la reserva
 * pagada; antes hay una plaza guardada 48 h sin compromiso.
 * Todos los nombres, retiros, casos e importes son inventados. */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  const hr = Q.hueco(12);

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.retiros = {
    id: 'retiros',
    nombre: 'Marketplace de retiros',
    t: {
      contacto: 'persona', contactos: 'personas', Contactos: 'Personas', Contacto: 'Persona',
      venta: 'reserva', ventas: 'reservas', Ventas: 'Reservas', producto: 'retiro', Producto: 'Retiro',
      paginaVisitas: 'la ficha del retiro', txtPrecio: 'ha mirado el precio', cita: 'plaza guardada', Cita: 'Plaza guardada', laCita: 'la plaza guardada',
      propuesta: 'el retiro recomendado', Propuesta: 'Retiro recomendado', comercial: 'el equipo', Comercial: 'Equipo',
      cliente: 'viajero', unCliente: 'un viajero', clientes: 'viajeros', convierten: 'reservan',
      objetivoPaso: 'guardarle plaza en el retiro que encaja', casoExito: 'la opinión de alguien que hizo ese retiro', valorAlto: 400,
      oportunidades: 'personas', atencion: 'personas que requieren atención', laVenta: 'la reserva',
      verbo: 'reservar', clientesReales: 'reservas de verdad', pasoHumano: 'hablar con el organizador y cerrar la plaza',
      nombreAgenteVoz: 'Noa',
      senales: { nueva: 'Petición nueva', noshow: 'Plaza guardada que caduca', revision: 'Le toca el siguiente retiro' },
      anunciosIntro: 'Aquí no hay anuncios. Cada fila es una fuente: la base de datos que ya tenéis, el tráfico orgánico, el asistente de retiros, la newsletter y los carritos abandonados. El sistema une cada fuente con lo que pasa después: quién contesta, quién guarda plaza y quién paga.'
    },
    // Fuente → Pide información → Contestada → Retiro recomendado → Plaza guardada 48 h → Reserva pagada → Vuelve
    recorrido: [
      { id: 'anuncio', txt: 'Fuente', sinFuga: true },
      { id: 'info', txt: 'Pide información' },
      { id: 'contactado', txt: 'Contestada' },
      { id: 'cualificado', txt: 'Retiro recomendado' },
      { id: 'cita', txt: 'Plaza guardada' },
      { id: 'alta', txt: 'Reserva pagada' },
      { id: 'fiel', txt: 'Vuelve a reservar', sinFuga: true }
    ],
    ventaEtapa: 'alta',
    ticket: 60,
    referencia: { contactado: 0.95, cualificado: 0.8, cita: 0.65, alta: 0.8 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'peticiones por correo o WhatsApp que se contestan al día siguiente, cuando ya han reservado en otro sitio' },
      cualificado: { txt: 'Recomendación', exp: 'conversaciones que no pasan de «¿tenéis algo en noviembre?» porque nadie les propone un retiro concreto' },
      cita: { txt: 'Plaza', exp: 'personas con el retiro elegido a las que nadie les guarda la plaza' },
      alta: { txt: 'Pago', exp: 'plazas guardadas que caducan sin que nadie pregunte qué pasó' }
    },
    mesDatos: { respuestaAntes: 1380, respuestaAhora: 1, agendadas: 345 },
    campanas: [
      { id: 'c1', canal: 'Base de datos', nombre: 'Reactivación · pidieron información este año y no reservaron', inversion: 0, ticket: 60,
        embudo: { anuncio: 4200, info: 310, contactado: 290, cualificado: 180, cita: 96, alta: 61, fiel: 20 } },
      { id: 'c2', canal: 'Base de datos', nombre: 'Viajaron hace 10-14 meses · les toca el siguiente', inversion: 0, ticket: 60,
        embudo: { anuncio: 1900, info: 170, contactado: 165, cualificado: 120, cita: 74, alta: 52, fiel: 52 } },
      { id: 'c3', canal: 'Orgánico', nombre: 'Google · fichas de retiro', inversion: 0, ticket: 60,
        embudo: { anuncio: 38000, info: 240, contactado: 232, cualificado: 150, cita: 70, alta: 44, fiel: 9 } },
      { id: 'c4', canal: 'Web', nombre: 'Asistente de retiros (menos de 1 minuto)', inversion: 0, ticket: 60,
        embudo: { anuncio: 1900, info: 160, contactado: 150, cualificado: 110, cita: 52, alta: 33, fiel: 6 } },
      { id: 'c5', canal: 'Web', nombre: 'Carrito abandonado · vio la ficha y no pagó', inversion: 0, ticket: 60,
        embudo: { anuncio: 520, info: 140, contactado: 135, cualificado: 120, cita: 70, alta: 48, fiel: 11 } }
    ],
    kpis: ['interesados', 'respuesta', 'cualificados', 'entrevistas', 'ventas', 'ingresos'],
    kpiNombres: { interesados: 'Personas que escriben', cualificados: 'Con retiro recomendado', entrevistas: 'Plazas guardadas', ventas: 'Reservas pagadas', ingresos: 'Ingresos por reservas' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'cita' },
    agenda: { horas: [9, 20], pausa: [14, 16], ocupacion: 0.55, etapa: 'cita',
      tipos: ['Plaza guardada · 48 h', 'Llamada con el organizador', 'Plaza guardada · regalo', 'Llamada · duda de fechas', 'Plaza guardada · grupo'] },
    historiaGenerica: false,

    reglas: {
      fitBase: 22,
      fit: [
        [function (c) { return !!c.f.temaClaro; }, 16, function (c) { return 'sabe qué busca: ' + c.f.temaTxt; }, 'Tema claro'],
        [function (c) { return !!c.f.fechas; }, 18, function (c) { return 'tiene fechas: ' + c.f.fechas; }, 'Fechas concretas'],
        [function (c) { return !!c.f.yaViajo; }, 20, 'ya hizo un retiro con nosotros', 'Ya viajó antes'],
        [function (c) { return !!c.f.presupuesto; }, 10, function (c) { return 'presupuesto de ' + c.f.presupuesto; }, 'Presupuesto dicho'],
        [function (c) { return c.f.zona === 'cataluna'; }, 8, 'busca cerca de Barcelona', 'Cataluña'],
        [function (c) { return !!c.f.regalo; }, 6, 'es para regalar', 'Regalo'],
        [function (c) { return !!c.f.soloInfo; }, -22, 'solo quería información', 'Solo mirando'],
        [function (c) { return !!c.f.curioso; }, -18, 'pregunta por temas que casi nunca acaban en reserva']
      ],
      intencion: [
        [function (c) { return c.s.incluye; }, 10, 'preguntó qué incluye'],
        [function (c) { return c.s.fechas; }, 12, 'preguntó por fechas concretas'],
        [function (c) { return c.s.plaza; }, 14, 'pidió que le guardaran plaza']
      ]
    },

    nba: function (c, k, x, T, M) {
      if (c.s.caduca && !c.fin) return { id: 'caduca', accion: 'Recordar la plaza antes de que caduque', quien: 'Agente de reservas', tipo: 'agente', estado: 'listo', por: 'Tiene plaza guardada en «' + c.prod + '» y caduca ' + c.s.caduca + '. Un mensaje con el enlace de pago y la duda más habitual (qué incluye) la convierte sin que nadie llame.' };
      return M.nbaGenerica(c, k, x, T);
    },
    vozDijo: function (c) { return c.f.temaTxt ? ['Busca: ' + c.f.temaTxt] : []; },
    vozMotivo: function (c) { return 'Pide información sobre ' + (c.f.temaTxt || c.prod.toLowerCase()) + '.'; },

    preguntas: [
      { q: '¿Quién pidió información este año y no reservó?', h: 'lista', obj: ['retencion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.orig === 'c1'; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas de la base de datos pidieron información este año y no llegaron a reservar. Ya os conocen: es la fruta más baja.'; },
        vista: 'tabla' },
      { q: '¿A quién le toca el siguiente retiro?', h: 'lista', obj: ['retencion', 'expansion', 'todo'],
        filtro: function (c) { return c.s.revision || c.orig === 'c2'; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas hicieron un retiro hace más de diez meses. Quien repite reserva sin preguntar el precio.'; },
        vista: 'tabla' },
      { q: '¿Qué plazas guardadas caducan sin pagar?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && (c.s.caduca || c.s.noshow); }, orden: 'prob',
        intro: function (l) { return l.length + ' plazas guardadas están a punto de caducar. Un recordatorio con el enlace de pago recupera la mitad.'; },
        vista: 'tabla' },
      { q: '¿Quién escribió el fin de semana y sigue sin respuesta?', h: 'lista', obj: ['seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa <= 2; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas tienen la primera respuesta del asistente pero nadie ha retomado la conversación.'; },
        vista: 'tabla' }
    ],

    historias: {
      reactivacion: {
        titulo: 'Pidió información en marzo, no reservó, y en octubre el sistema le escribe con el retiro que encaja',
        contacto: { id: 'demo', n: 'Sonia Ferrer', rol: 'Pidió información en marzo · yoga cerca de Barcelona', seg: 'viajero', ciudad: 'Sabadell', prod: 'Yoga y silencio en el Empordà · 3 noches', orig: 'c1', canal: 'wa', etapa: 1, valor: 60, creado: 0, act: 0, f: { temaClaro: true, temaTxt: 'yoga y desconexión', zona: 'cataluna' }, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'La base de datos: en marzo pidió información de un retiro de yoga y no había plaza en sus fechas', feed: 'Base de datos · pidió información el 12 de marzo · sin reserva', cambio: {} },
          { dur: 6, min: 1, txt: 'El sistema cruza lo que pidió con los retiros de noviembre y encuentra uno que encaja', feed: 'Retiro que encaja · Empordà · 14-17 de noviembre · 4 plazas', cambio: { f: { fechas: 'noviembre' } } },
          { dur: 7, min: 1, txt: 'Le escribe por WhatsApp con el retiro concreto, no con una newsletter', feed: 'WhatsApp enviado · reactivación', toque: true, cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Sonia, soy Noa, de Inspyria. En marzo miraste el retiro de yoga entre viñedos y no quedaba plaza para tus fechas. Del 14 al 17 de noviembre hay uno parecido en el Empordà: yoga por la mañana, silencio por la tarde, 3 noches. Quedan 4 plazas. ¿Te cuento qué incluye?'] } },
          { dur: 6, min: 9, txt: 'Sonia contesta y pregunta qué incluye y el precio', feed: 'Respuesta recibida · pregunta qué incluye', act: true, cambio: { etapa: 3, s: { incluye: true, precio: true }, conv: ['c', 'wa', 'Anda, sí, me quedé con ganas. ¿Qué incluye y cuánto es?'] } },
          { dur: 7, min: 2, txt: 'El asistente responde con la ficha y le ofrece guardar plaza 48 h sin compromiso', feed: 'Retiro recomendado · plaza ofrecida', toque: true,
            cambio: { etapa: 4, conv: ['a', 'wa', 'Incluye alojamiento en habitación doble, las tres comidas vegetarianas, dos clases de yoga al día y la caminata de silencio del sábado. Son 480 € por persona. Te puedo guardar plaza 48 horas sin compromiso y te paso la opinión de alguien que lo hizo en mayo. ¿Te la guardo?'] } },
          { dur: 7, min: 3, txt: 'Sonia pide la plaza: queda guardada hasta el ' + hr.txt, feed: 'Plaza guardada · caduca el ' + hr.txt, act: true,
            cambio: { etapa: 5, s: { plaza: true, cita: hr.min, citaOk: true }, conv: ['c', 'wa', 'Sí, guárdamela. Lo hablo con mi pareja esta noche.'] } },
          { dur: 6, min: 1, txt: 'Al organizador le llega la petición con el contexto; a Sonia, el enlace de pago', feed: 'Organizador avisado · enlace de pago enviado', toque: true,
            cambio: { conv: ['a', 'wa', 'Hecha. Tienes la plaza hasta el ' + hr.txt + ' a las 12:00. Aquí tienes el enlace para confirmarla cuando lo habléis, y la opinión de Marta, que fue en mayo. Si prefieres hablar con Laia, la organizadora, te paso con ella.'] } },
          { dur: 0, min: 1, txt: 'Resumen para el equipo: de la base de datos a plaza guardada sin que nadie escribiera a mano', feed: 'Resumen enviado al equipo', humano: { titulo: 'Sonia: plaza guardada hasta el ' + hr.txt, texto: 'Pidió información en marzo (yoga, cerca de Barcelona) y no reservó. Reactivada con el retiro del Empordà del 14 al 17 de noviembre. Preguntó qué incluye y el precio. Plaza guardada 48 h; lo decide con su pareja. Si el ' + hr.txt + ' no ha pagado, le sale el recordatorio con el enlace.' } }
        ]
      },
      solicitud: {
        titulo: 'Usa el asistente de retiros un domingo a las 22:40 y acaba con la plaza guardada',
        contacto: { id: 'demo', n: 'Marc Vidal', rol: 'Asistente de retiros · meditación · primera vez', seg: 'viajero', ciudad: 'Girona', prod: 'Meditación y respiración · fin de semana en el Montseny', orig: 'c4', canal: 'wa', etapa: 1, valor: 60, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Domingo 22:40: alguien usa el asistente de retiros de la web', feed: 'Asistente de retiros · domingo 22:40', cambio: {} },
          { dur: 6, min: 1, txt: 'El asistente completa la ficha: meditación, primera vez, un fin de semana, cerca de Girona', feed: 'Ficha completa · meditación · primera vez · fin de semana', cambio: { f: { temaClaro: true, temaTxt: 'meditación, primera vez', fechas: 'un fin de semana de octubre', zona: 'cataluna' } } },
          { dur: 6, min: 1, txt: 'Respuesta por WhatsApp en el minuto uno, con un retiro concreto', feed: 'WhatsApp enviado en 50 segundos', toque: true, cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Marc, soy Noa, de Inspyria. Para una primera vez con meditación y un fin de semana cerca de Girona, el que mejor encaja es el del Montseny del 24 al 26: respiración, meditación guiada y mucho bosque. Sin experiencia previa. ¿Quieres que te cuente cómo es el día a día?'] } },
          { dur: 6, min: 6, txt: 'Marc pregunta si de verdad vale para principiantes', feed: 'Respuesta · duda de principiante', act: true, cambio: { etapa: 3, s: { incluye: true }, conv: ['c', 'wa', 'Nunca he hecho nada parecido. ¿Seguro que no es para gente con experiencia?'] } },
          { dur: 7, min: 2, txt: 'El asistente responde con la opinión de alguien que fue por primera vez y ofrece plaza', feed: 'Retiro recomendado · plaza ofrecida', toque: true, cambio: { etapa: 4, conv: ['a', 'wa', 'La mitad de los que van es su primera vez. Te paso lo que escribió Jordi, que fue en abril sin haber meditado nunca. Quedan 3 plazas; te la guardo 48 horas si quieres pensarlo.'] } },
          { dur: 6, min: 4, txt: 'Marc pide la plaza', feed: 'Plaza guardada · domingo 22:53', act: true, cambio: { etapa: 5, s: { plaza: true, cita: hr.min, citaOk: true }, conv: ['c', 'wa', 'Vale, guárdamela.'] } }
        ]
      }
    },
    historiaDefecto: 'reactivacion',

    contactos: [
      { id: 'r01', n: 'Carla Puig', rol: 'Pidió información en febrero · silencio', seg: 'viajero', ciudad: 'Barcelona', prod: 'Retiro de silencio · 5 días · Montserrat', orig: 'c1', canal: 'wa', etapa: 3, valor: 60, creado: 20 * H, act: 40, toque: 19 * H,
        f: { temaClaro: true, temaTxt: 'silencio y desconexión', fechas: 'noviembre', zona: 'cataluna' }, s: { precio: true, incluye: true, visitas: 3 },
        conv: [[20 * H - 1, 'a', 'wa', 'Hola Carla, en febrero miraste el retiro de silencio y no reservaste. Del 20 al 25 de noviembre hay uno en Montserrat. ¿Te cuento qué incluye?'], [19 * H, 'c', 'wa', 'Sí, cuéntame. ¿Es en silencio total?'], [40, 'c', 'wa', '¿Y cuánto cuesta con la habitación individual?']] },
      { id: 'r02', n: 'Jordi Mas', rol: 'Carrito abandonado · yoga', seg: 'viajero', ciudad: 'Terrassa', prod: 'Yoga entre viñedos · fin de semana', orig: 'c5', canal: 'wa', etapa: 1, valor: 60, creado: 15, act: 15, toque: null,
        f: { temaClaro: true, temaTxt: 'yoga', zona: 'cataluna' }, s: { visitas: 2 }, conv: [] },
      { id: 'r03', n: 'Laura Benet', rol: 'Hizo un retiro en noviembre pasado', seg: 'viajero', ciudad: 'Girona', prod: 'Sanando las heridas de la infancia · 4 días', orig: 'c2', canal: 'wa', etapa: 2, valor: 60, creado: 3 * D, act: 2 * D, toque: 2 * D,
        f: { temaClaro: true, temaTxt: 'sanación emocional', yaViajo: true, zona: 'cataluna' }, s: { revision: true, revisionTxt: 'Hizo el retiro de sanación hace 11 meses · la edición de noviembre abre plazas' },
        conv: [[3 * D, 'a', 'wa', 'Hola Laura, hace casi un año hiciste el retiro de sanación. La edición de noviembre abre plazas esta semana y quería que lo supieras antes que nadie.'], [2 * D, 'c', 'wa', 'Qué ilusión, me cambió el año. Dime fechas.']] },
      { id: 'r04', n: 'Pau Roca', rol: 'Plaza guardada que caduca', seg: 'viajero', ciudad: 'Madrid', prod: 'Vipassana · 10 días · Ávila', orig: 'c3', canal: 'wa', etapa: 4, valor: 60, creado: 3 * D, act: 30 * H, toque: 30 * H,
        f: { temaClaro: true, temaTxt: 'meditación vipassana', fechas: 'enero', presupuesto: '600 €' }, s: { plaza: true, cita: 14 * H, citaOk: true, caduca: 'mañana a las 12:00' },
        conv: [[3 * D, 'a', 'wa', 'Hola Pau, te guardo la plaza del Vipassana de enero 48 horas.'], [30 * H, 'c', 'wa', 'Perfecto, lo pago en cuanto cobre.']] },
      { id: 'r05', n: 'Nuria Soler', rol: 'Regalo para su madre', seg: 'viajero', ciudad: 'Barcelona', prod: 'Vale regalo · retiro de yoga', orig: 'c3', canal: 'wa', etapa: 3, valor: 60, creado: 2 * D, act: 26 * H, toque: 26 * H,
        f: { temaClaro: true, temaTxt: 'regalo de yoga para su madre', regalo: true, zona: 'cataluna' }, s: { incluye: true },
        conv: [[2 * D, 'a', 'wa', 'Hola Nuria, para regalar lo más fácil es el vale: ella elige retiro y fechas. ¿Te cuento cómo funciona?'], [26 * H, 'c', 'wa', '¿El vale caduca?']] },
      { id: 'r06', n: 'Álex Torres', rol: 'Pregunta por tantra', seg: 'viajero', ciudad: 'Valencia', prod: 'Tantra · fin de semana', orig: 'c3', canal: 'wa', etapa: 2, valor: 60, creado: 5 * D, act: 5 * D, toque: 4 * D,
        f: { curioso: true }, s: { intentos: 2 }, conv: [[5 * D, 'a', 'wa', 'Hola Álex, ¿buscas fechas concretas o estás mirando?'], [5 * D - 10, 'c', 'wa', 'Solo mirando de momento.']] },
      { id: 'r07', n: 'Marta Esteve', rol: 'Pidió información en mayo · ayuno', seg: 'viajero', ciudad: 'Lleida', prod: 'Ayuno terapéutico · 7 días', orig: 'c1', canal: 'wa', etapa: 4, valor: 60, creado: 9 * D, act: 6 * D, toque: 3 * D,
        f: { temaClaro: true, temaTxt: 'ayuno y descanso', fechas: 'diciembre', presupuesto: '800 €' }, s: { plaza: true, cita: -6 * D, citaOk: true, noshow: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Marta, en mayo preguntaste por el ayuno de 7 días. En diciembre hay edición.'], [8 * D, 'c', 'wa', 'Guárdame plaza, por favor.'], [3 * D, 'a', 'wa', 'Marta, la plaza caducó ayer. ¿Te la vuelvo a guardar o cambió algo?']],
        ev: [[6 * D, 'sistema', 'Plaza guardada caducada sin pago']] },
      { id: 'r08', n: 'Helena Ros', rol: 'Newsletter · meditación', seg: 'viajero', ciudad: 'Barcelona', prod: 'Meditación y respiración · fin de semana', orig: 'c4', canal: 'wa', etapa: 1, valor: 60, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { temaClaro: true, temaTxt: 'meditación', zona: 'cataluna' }, s: { intentos: 2 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Helena, soy Noa, de Inspyria. Dijiste meditación y un fin de semana. ¿Te cuento el del Montseny?']] },
      { id: 'r09', n: 'David Camps', rol: 'Pidió información en abril · luego', seg: 'viajero', ciudad: 'Tarragona', prod: 'Yoga y senderismo · Pirineo', orig: 'c1', canal: 'wa', etapa: 3, valor: 60, creado: 25 * D, act: 20 * D, toque: 20 * D,
        f: { temaClaro: true, temaTxt: 'yoga y montaña', zona: 'cataluna' }, s: { luego: 'primavera', luegoTxt: 'lo haría en primavera, cuando tenga vacaciones' },
        conv: [[25 * D, 'a', 'wa', 'Hola David, ¿sigues con ganas de yoga y montaña?'], [20 * D, 'c', 'wa', 'Sí, pero lo dejo para primavera, cuando tenga vacaciones.']] },
      { id: 'r10', n: 'Anna Vila', rol: 'Pide fechas y no contesta', seg: 'viajero', ciudad: 'Barcelona', prod: 'Retiro de silencio · 3 días', orig: 'c3', canal: 'wa', etapa: 3, valor: 60, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { temaClaro: true, temaTxt: 'silencio', zona: 'cataluna' }, s: { fechas: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Anna, el retiro de silencio tiene fechas el 7 y el 21 de noviembre.'], [4 * D, 'c', 'wa', '¿El del 21 tiene plaza?']] },
      { id: 'r11', n: 'Sergio Lara', rol: 'Reservó hace 2 semanas', seg: 'viajero', ciudad: 'Zaragoza', prod: 'Meditación y respiración · fin de semana', orig: 'c4', canal: 'wa', etapa: 6, valor: 60, creado: 30 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { temaClaro: true, temaTxt: 'meditación' }, s: {}, conv: [] },
      { id: 'r12', n: 'Rosa Ferrán', rol: 'Busca algo gratis', seg: 'viajero', ciudad: 'Sevilla', prod: 'Retiro de yoga', orig: 'c3', canal: 'wa', etapa: 1, valor: 60, creado: 8 * D, act: 8 * D, toque: 5 * D, fin: 'perdido',
        f: { soloInfo: true }, s: { intentos: 3 }, conv: [] },
      { id: 'r13', n: 'Ingrid Bosch', rol: 'Hizo un retiro en septiembre pasado', seg: 'viajero', ciudad: 'Barcelona', prod: 'Yoga y silencio en el Empordà · 3 noches', orig: 'c2', canal: 'wa', etapa: 6, valor: 60, creado: 380 * D, act: 5 * D, toque: 5 * D, fin: 'ganado',
        f: { temaClaro: true, temaTxt: 'yoga', yaViajo: true, zona: 'cataluna' }, s: { revision: true, revisionTxt: 'Hizo el retiro del Empordà hace 13 meses · la edición de noviembre tiene plazas' }, conv: [] },
      { id: 'r14', n: 'Tomás Gil', rol: 'Pregunta por teléfono', seg: 'viajero', ciudad: 'Bilbao', prod: 'Vipassana · 10 días · Ávila', orig: 'c3', canal: 'tel', etapa: 2, valor: 60, creado: 30 * H, act: 26 * H, toque: 26 * H,
        f: { temaClaro: true, temaTxt: 'meditación vipassana', fechas: 'enero' }, s: { incluye: true },
        conv: [[30 * H, 'a', 'wa', 'Hola Tomás, soy Noa. ¿Prefieres que te llame alguien del equipo?'], [26 * H, 'c', 'wa', 'Sí, mejor por teléfono, por la tarde.']] }
    ]
  };
})();

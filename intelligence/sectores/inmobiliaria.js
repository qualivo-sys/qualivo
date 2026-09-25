/* Sector: Inmobiliaria (compraventa, alquiler y obra nueva).
 * Todos los nombres, promociones y direcciones son inventados. */
(function () {
  const H = 60, D = 1440;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.inmobiliaria = {
    id: 'inmobiliaria',
    nombre: 'Inmobiliaria',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'operación', ventas: 'operaciones', Ventas: 'Operaciones', producto: 'inmueble',
      paginaVisitas: 'la ficha del inmueble', cita: 'visita', Cita: 'Visita', laCita: 'la visita',
      propuesta: 'la oferta', Propuesta: 'Oferta', comercial: 'el agente inmobiliario', Comercial: 'Agente inmobiliario',
      cliente: 'comprador', unCliente: 'un comprador', convierten: 'acaban comprando', objetivoPaso: 'agendar la visita',
      casoExito: 'la historia de una familia que compró en la misma zona', valorAlto: 12000, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la firma', Producto: 'Inmueble', clientes: 'compradores',
      propuestas: 'ofertas', verbo: 'comprar', clientesReales: 'operaciones de verdad', empleados: 'personas',
      pasoHumano: 'resolver sus dudas de precio y financiación y cerrar la oferta',
      txtPrecio: 'preguntó por el precio y los gastos',
      cs: 'el agente de captación', CS: 'Agente de captación'
    },
    // Recorrido: Anuncio → Solicitud → Contactado → Cualificado → Visita → Oferta → Arras / Firma
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'solicitud', txt: 'Solicitud' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'visita', txt: 'Visita' },
      { id: 'oferta', txt: 'Oferta' },
      { id: 'firma', txt: 'Arras / Firma' }
    ],
    ventaEtapa: 'firma',
    ticket: 8900,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, cualificado: 0.6, visita: 0.5, oferta: 0.38, firma: 0.6 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'solicitudes de los portales que nadie contesta a tiempo' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones en las que nadie pregunta por financiación, zona y plazos' },
      visita: { txt: 'Agenda de visitas', exp: 'interesados cualificados a los que nadie les cierra la visita' },
      oferta: { txt: 'Seguimiento tras la visita', exp: 'visitas que acaban en «ya os diremos» y nadie vuelve a llamar' },
      firma: { txt: 'Negociación y arras', exp: 'ofertas que no llegan a arras' }
    },
    mesDatos: { respuestaAntes: 214, respuestaAhora: 1, agendadas: 221 },
    campanas: [
      { id: 'c1', canal: 'Idealista', nombre: 'Pisos en venta · Valencia ciudad', inversion: 1900, ticket: 8400,
        embudo: { anuncio: 14200, solicitud: 380, contactado: 262, cualificado: 150, visita: 72, oferta: 12, firma: 8 } },
      { id: 'c2', canal: 'Fotocasa', nombre: 'Obra nueva · Residencial Las Moreras', inversion: 1200, ticket: 11500,
        embudo: { anuncio: 8600, solicitud: 170, contactado: 118, cualificado: 74, visita: 38, oferta: 7, firma: 4 } },
      { id: 'c3', canal: 'Meta', nombre: 'Áticos y bajos con terraza', inversion: 1600, ticket: 9200,
        embudo: { anuncio: 21000, solicitud: 210, contactado: 142, cualificado: 76, visita: 34, oferta: 6, firma: 3 } },
      { id: 'c4', canal: 'Idealista', nombre: 'Alquiler de larga estancia', inversion: 700, ticket: 1100,
        embudo: { anuncio: 9800, solicitud: 140, contactado: 100, cualificado: 44, visita: 22, oferta: 4, firma: 3 } },
      { id: 'c5', canal: 'Web', nombre: 'Web y valoraciones (orgánico)', inversion: 0, ticket: 9000,
        embudo: { anuncio: 3100, solicitud: 60, contactado: 44, cualificado: 28, visita: 16, oferta: 4, firma: 3 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Solicitudes', cualificados: 'Interesados cualificados', entrevistas: 'Visitas', ventas: 'Operaciones', cpv: 'Coste por operación', ingresos: 'Honorarios' },
    kpiEtapas: { interesados: 'solicitud', cualificados: 'cualificado', entrevistas: 'visita' },

    reglas: {
      fitBase: 26,
      fit: [
        [function (c) { return c.f && c.f.hipoteca === 'pre'; }, 26, 'hipoteca preaprobada'],
        [function (c) { return c.f && c.f.contado; }, 26, 'compra al contado, sin hipoteca'],
        [function (c) { return c.f && c.f.hipoteca === 'estudio'; }, 10, 'hipoteca en estudio con su banco'],
        [function (c) { return c.f && c.f.pptoOk; }, 14, 'presupuesto acorde al precio del inmueble'],
        [function (c) { return c.f && c.f.vendido; }, 16, 'ya ha vendido su vivienda actual'],
        [function (c) { return c.f && c.f.zona; }, 12, 'busca en una zona donde tenéis cartera'],
        [function (c) { return c.seg === 'inversor'; }, 8, 'inversor con más de una operación al año'],
        [function (c) { return c.f && c.f.sinFin; }, -24, 'sin ahorro ni financiación'],
        [function (c) { return c.f && c.f.pptoBajo; }, -18, 'presupuesto muy por debajo del inmueble'],
        [function (c) { return c.f && c.f.fuera; }, -20, 'busca fuera de vuestra zona']
      ],
      intencion: [
        [function (c) { return c.s.visitaQ; }, 14, 'pidió visita'],
        [function (c) { return c.s.hipotecaQ; }, 10, 'preguntó por hipoteca y financiación'],
        [function (c) { return c.s.pisoVender; }, 6, 'tiene un piso que vender']
      ]
    },

    preguntas: [
      { q: '¿Qué interesados tienen más probabilidad de comprar?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Qué ofertas se están enfriando?', h: 'lista', obj: ['ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return c.s.prop != null && !c.fin; }, orden: 'toque', suma: true,
        intro: function (l, T, M) { return l.length + ' ofertas enviadas siguen sin respuesta. Suman ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en honorarios: el trabajo ya está hecho, falta la llamada.'; },
        vista: 'tabla' },
      { q: '¿Quién tiene un piso que vender además de comprar?', h: 'lista', obj: ['ventas', 'expansion', 'todo'],
        filtro: function (c) { return !!c.s.pisoVender && c.fin !== 'perdido'; }, orden: 'valor',
        intro: function (l) { return l.length + ' interesados tienen una vivienda que vender. Son dobles operaciones: si les ayudáis a vender, os compran a vosotros.'; },
        vista: 'tabla' },
      { q: '¿Quién dijo que compraría más adelante?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que lo retomarían más adelante. Ninguno es un no: el agente de reactivación les escribe en la fecha que ellos mismos dieron.'; },
        vista: 'tabla' },
      { q: '¿Qué portal está trayendo operaciones?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] }
    ],

    historias: {
      visita: {
        titulo: 'Una pareja pide visita desde Idealista',
        contacto: { id: 'demo', n: 'Irene Castaño', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: '—', prod: 'Piso 3 hab. con terraza en Benimaclet · 265.000 €', orig: 'c1', canal: 'wa', etapa: 1, valor: 7950, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde Idealista', feed: 'Nueva solicitud · Piso en Benimaclet', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha con lo que dejó en el portal', feed: 'Ficha completada · busca en Benimaclet · 2 adultos y un bebé', cambio: { ciudad: 'Valencia', f: { zona: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 52 segundos', cambio: { conv: ['a', 'wa', 'Hola Irene, soy Sonia, de la inmobiliaria. Te escribo por el piso de Benimaclet. ¿Lo buscáis para vivir vosotros? ¿Para cuándo os haría falta?'] }, toque: true },
          { dur: 6, min: 8, txt: 'Irene vuelve a la ficha y mira el plano dos veces', feed: 'Visita la ficha del inmueble (3 veces)', cambio: { s: { visitas: 3 } }, act: true },
          { dur: 7, min: 3, txt: 'Irene contesta y pregunta por la hipoteca', feed: 'Respuesta recibida · pregunta financiación', cambio: { etapa: 2, s: { hipotecaQ: true, urg: true, urgTxt: 'tiene que dejar su alquiler en diciembre' }, conv: ['c', 'wa', 'Sí, para vivir. Nos acaban de decir que en diciembre tenemos que dejar el alquiler. ¿Trabajáis con algún banco para la hipoteca?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente cualifica con una sola pregunta', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Sí, os ponemos en contacto con un asesor hipotecario sin coste. ¿Tenéis ya la preaprobación o el ahorro para la entrada?'] }, toque: true },
          { dur: 7, min: 4, txt: 'Irene confirma financiación y pide visita', feed: 'Hipoteca preaprobada · pide visita', cambio: { f: { hipoteca: 'pre', pptoOk: true }, s: { visitaQ: true, precio: true, ppto: 'si', pptoTxt: 'hipoteca preaprobada hasta 240.000 € y la entrada ahorrada' }, conv: ['c', 'wa', 'Tenemos la preaprobación hasta 240.000 y la entrada ahorrada. ¿Podemos verlo esta semana? ¿Los gastos de comunidad cuánto son?'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la visita', feed: 'Visita agendada · jueves 18:30', cambio: { etapa: 4, s: { cita: 1800, citaOk: true }, conv: ['a', 'wa', 'Hecho: jueves a las 18:30 en el portal, con Álex, el agente del piso. La comunidad son 65 € al mes. Te llega la ubicación y la ficha completa por aquí.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Irene está lista para visitar', feed: 'Aviso enviado al agente inmobiliario', humano: { titulo: 'Irene está lista para visitar', texto: 'Compra para vivir · hipoteca preaprobada hasta 240.000 € y entrada ahorrada · tiene que dejar el alquiler en diciembre. Visita el jueves a las 18:30: preparar margen de negociación.' } }
        ]
      }
    },
    historiaDefecto: 'visita',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'i01', n: 'Lucía Beltrán', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 3 hab. en Ruzafa · 289.000 €', orig: 'c1', canal: 'wa', etapa: 3, valor: 8670, creado: 2 * D, act: 18, toque: 40,
        f: { hipoteca: 'pre', pptoOk: true, zona: true }, s: { visitas: 4, precio: true, visitaQ: true, hipotecaQ: true, urg: true, urgTxt: 'tiene que dejar su alquiler el 30 de noviembre' },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Lucía, soy Sonia, de la inmobiliaria. ¿El piso de Ruzafa lo buscáis para vivir?'], [2 * D - 40, 'c', 'wa', 'Sí, para vivir. Lo estamos mirando con calma.'], [45, 'a', 'wa', '¿Tenéis ya la hipoteca vista con algún banco?'], [18, 'c', 'wa', 'Preaprobada. Nos echan del alquiler a final de noviembre, ¿podemos verlo mañana? ¿Y el IBI cuánto es?']],
        ev: [[25, 'web', 'Vuelve a la ficha del inmueble · mira el plano']] },
      { id: 'i02', n: 'Andrés Pastor', rol: 'Inversor particular', seg: 'inversor', ciudad: 'Valencia', prod: 'Edificio de 4 viviendas en Benimaclet · 590.000 €', orig: 'c5', canal: 'wa', etapa: 3, valor: 17700, creado: 3 * D, act: 50, toque: 3 * H,
        f: { contado: true, zona: true }, s: { visitas: 3, precio: true, visitaQ: true, ppto: 'si', pptoTxt: 'compra al contado, sin depender del banco' },
        conv: [[3 * D - 2, 'a', 'wa', 'Hola Andrés, soy Sonia. ¿El edificio lo quieres para alquilar o para reformar y vender?'], [3 * D - 90, 'c', 'wa', 'Para alquilar. Ya tengo dos en la zona.'], [3 * H, 'a', 'wa', 'Te paso la rentabilidad con los alquileres actuales.'], [50, 'c', 'wa', 'Lo he visto. Pago al contado. ¿Cuándo puedo entrar a verlo y hay margen en el precio?']] },
      { id: 'i03', n: 'Marta Solís', rol: 'Cambio de vivienda', seg: 'compra', ciudad: 'Valencia', prod: 'Ático con terraza en Campanar · 340.000 €', orig: 'c3', canal: 'wa', etapa: 5, valor: 10200, creado: 16 * D, act: 6 * H, toque: 4 * D,
        f: { hipoteca: 'pre', vendido: true, pptoOk: true }, s: { prop: 4 * D, propVista: 3, visitas: 5, precio: true },
        conv: [[16 * D, 'a', 'wa', 'Hola Marta, ¿el ático lo buscáis para vivir?'], [15 * D, 'c', 'wa', 'Sí, acabamos de vender nuestro piso y tenemos que salir en enero.'], [6 * D, 'h', 'wa', 'Gracias por venir a verlo. Os preparo la propuesta de oferta por escrito.'], [4 * D, 'h', 'wa', 'Te envío la oferta con las condiciones que hablamos.']],
        ev: [[6 * H, 'web', 'Abre la oferta por tercera vez']] },
      { id: 'i04', n: 'Rubén Carrasco', rol: 'Compra primera vivienda', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 2 hab. en Patraix · 189.000 €', orig: 'c1', canal: 'tel', etapa: 1, valor: 5670, creado: 6, act: 6, toque: null,
        f: { zona: true, hipoteca: 'pre', pptoOk: true }, s: { visitas: 1 }, conv: [] },
      { id: 'i05', n: 'Elena Montero', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Paterna', prod: 'Adosado en Residencial Las Moreras · 395.000 €', orig: 'c2', canal: 'wa', etapa: 1, valor: 11850, creado: 24, act: 20, toque: null,
        f: { hipoteca: 'estudio', pptoOk: true }, s: { visitas: 2 }, conv: [] },
      { id: 'i06', n: 'Tomás Riera', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 4 hab. en Benicalap · 245.000 €', orig: 'c1', canal: 'wa', etapa: 4, valor: 7350, creado: 5 * D, act: 4 * H, toque: 22 * H,
        f: { hipoteca: 'estudio', zona: true }, s: { cita: 20 * H, citaOk: false, visitas: 2, hipotecaQ: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Tomás, soy Sonia. ¿Buscáis 4 habitaciones por la familia?'], [5 * D - 30, 'c', 'wa', 'Sí, somos cinco. ¿Se puede ver?'], [22 * H, 'a', 'wa', 'Te dejo la visita mañana a las 17:00. ¿Te va bien?']] },
      { id: 'i07', n: 'Javier Domínguez', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 3 hab. en Ruzafa · 289.000 €', orig: 'c1', canal: 'wa', etapa: 4, valor: 8670, creado: 9 * D, act: 2 * D, toque: 2 * D,
        f: { hipoteca: 'pre', zona: true, pptoOk: true }, s: { noshow: true, visitas: 3, precio: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Javier, ¿el piso de Ruzafa sería para vivir?'], [8 * D, 'c', 'wa', 'Sí, con mi pareja. Tenemos la hipoteca preaprobada.'], [3 * D, 'a', 'wa', 'Te espero mañana a las 13:00 en el portal.']],
        ev: [[2 * D, 'sistema', 'No se presenta a la visita']] },
      { id: 'i08', n: 'Patricia León', rol: 'Alquiler larga estancia', seg: 'alquiler', ciudad: 'Valencia', prod: 'Alquiler piso 2 hab. en El Carmen · 1.150 €/mes', orig: 'c4', canal: 'wa', etapa: 4, valor: 1150, creado: 7 * D, act: D, toque: D,
        f: { pptoOk: true, zona: true }, s: { noshow: true, visitas: 2 },
        conv: [[7 * D, 'a', 'wa', 'Hola Patricia, ¿el alquiler lo buscas para ti sola?'], [7 * D - 20, 'c', 'wa', 'Sí, por trabajo. Tengo contrato indefinido.'], [2 * D, 'a', 'wa', 'Te espero mañana a las 19:00.']],
        ev: [[D, 'sistema', 'No se presenta a la visita']] },
      // --- Dijeron «más adelante»
      { id: 'i09', n: 'Sara Robles', rol: 'Compra primera vivienda', seg: 'compra', ciudad: 'Burjassot', prod: 'Piso 2 hab. en Burjassot · 165.000 €', orig: 'c3', canal: 'wa', etapa: 3, valor: 4950, creado: 30 * D, act: 25 * D, toque: 25 * D,
        f: { hipoteca: 'estudio' }, s: { luego: 'enero', luegoTxt: 'quiere esperar a tener la nómina fija en enero para pedir la hipoteca', precio: true },
        conv: [[30 * D, 'a', 'wa', 'Hola Sara, ¿el piso de Burjassot sería para ti?'], [25 * D, 'c', 'wa', 'Me encanta, pero hasta enero no me hacen fija y el banco no me da la hipoteca antes.']] },
      { id: 'i10', n: 'Ignacio Ferrer', rol: 'Cambio de vivienda', seg: 'compra', ciudad: 'Paterna', prod: 'Adosado en Residencial Las Moreras · 395.000 €', orig: 'c2', canal: 'email', etapa: 3, valor: 11850, creado: 40 * D, act: 33 * D, toque: 33 * D,
        f: { hipoteca: 'estudio', zona: true }, s: { pisoVender: true, luego: 'primavera', luegoTxt: 'compraría en primavera, cuando venda su piso de Mislata' },
        conv: [[40 * D, 'a', 'email', 'Hola Ignacio, te envío los planos y las calidades del adosado.'], [33 * D, 'c', 'email', 'Gracias. Primero tenemos que vender nuestro piso de Mislata; lo retomamos en primavera.']] },
      // --- Sin seguimiento después de contestar
      { id: 'i11', n: 'Clara Mateu', rol: 'Cambio de vivienda', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 4 hab. en Benimaclet · 310.000 €', orig: 'c1', canal: 'wa', etapa: 3, valor: 9300, creado: 10 * D, act: 6 * D, toque: 6 * D,
        f: { hipoteca: 'pre', zona: true }, s: { pisoVender: true, visitas: 2, hipotecaQ: true },
        conv: [[10 * D, 'a', 'wa', 'Hola Clara, soy Sonia. ¿Buscáis más espacio?'], [9 * D, 'c', 'wa', 'Sí, y tenemos que vender el nuestro de Orriols. ¿Nos ayudáis con las dos cosas?'], [6 * D, 'h', 'wa', 'Claro, te llamo esta semana y lo vemos.']] },
      { id: 'i12', n: 'Héctor Lozano', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 3 hab. en Ruzafa · 289.000 €', orig: 'c1', canal: 'wa', etapa: 2, valor: 8670, creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: { hipoteca: 'estudio' }, s: { precio: true },
        conv: [[8 * D, 'a', 'wa', 'Hola Héctor, ¿el piso lo buscas para vivir?'], [7 * D, 'c', 'wa', 'Sí. ¿El precio es negociable?'], [5 * D, 'h', 'wa', 'Lo consulto con la propiedad y te digo.']] },
      { id: 'i13', n: 'Nuria Salvador', rol: 'Cambio de vivienda', seg: 'compra', ciudad: 'Valencia', prod: 'Ático con terraza en Campanar · 340.000 €', orig: 'c3', canal: 'email', etapa: 5, valor: 10200, creado: 20 * D, act: 9 * D, toque: 9 * D,
        f: { hipoteca: 'estudio', pptoOk: true }, s: { prop: 9 * D, visitas: 2 },
        conv: [[20 * D, 'a', 'email', 'Hola Nuria, te escribo por el ático de Campanar.'], [18 * D, 'c', 'email', 'Nos gustaría verlo el sábado.'], [9 * D, 'h', 'email', 'Os envío la oferta por escrito tras la visita.']] },
      { id: 'i14', n: 'Gonzalo Aranda', rol: 'Inversor particular', seg: 'inversor', ciudad: 'Valencia', prod: 'Local + vivienda en Cabanyal · 470.000 €', orig: 'c5', canal: 'email', etapa: 5, valor: 14100, creado: 25 * D, act: 2 * D, toque: 7 * D,
        f: { contado: true, zona: true }, s: { prop: 7 * D, propVista: 2, visitas: 3 },
        conv: [[25 * D, 'a', 'email', 'Hola Gonzalo, te envío el dosier del local y la vivienda.'], [22 * D, 'c', 'email', 'Me interesa. ¿Cuándo puedo verlo?'], [7 * D, 'h', 'email', 'Tras la visita, te envío la oferta con el precio que nos trasladaste.']],
        ev: [[2 * D, 'web', 'Abre la oferta por segunda vez']] },
      // --- Nuevos o en cadencia sin respuesta
      { id: 'i15', n: 'Raquel Soler', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 3 hab. en Patraix · 219.000 €', orig: 'c3', canal: 'wa', etapa: 1, valor: 6570, creado: 4 * H, act: 2 * H, toque: 4 * H - 1,
        f: { zona: true }, s: { visitas: 3, intentos: 1 },
        conv: [[4 * H - 1, 'a', 'wa', 'Hola Raquel, soy Sonia. ¿El piso de Patraix lo buscas para vivir?']] },
      { id: 'i16', n: 'Diego Almela', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Paterna', prod: 'Adosado en Residencial Las Moreras · 395.000 €', orig: 'c2', canal: 'wa', etapa: 1, valor: 11850, creado: 26 * H, act: 26 * H, toque: 26 * H - 1,
        f: { hipoteca: 'estudio' }, s: { intentos: 1 },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Diego, ¿buscáis vivienda en Paterna para vivir?']] },
      { id: 'i17', n: 'Alberto Cuenca', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 2 hab. en Patraix · 189.000 €', orig: 'c1', canal: 'wa', etapa: 1, valor: 5670, creado: 22 * D, act: 22 * D, toque: 16 * D, f: {}, s: { intentos: 3 },
        conv: [[22 * D, 'a', 'wa', 'Hola Alberto, ¿el piso lo buscas para vivir?']] },
      { id: 'i19', n: 'Marcos Gil', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 3 hab. en Benicalap · 245.000 €', orig: 'c1', canal: 'wa', etapa: 2, valor: 7350, creado: 2 * D, act: 3 * H, toque: 2 * D - 1,
        f: { zona: true }, s: { visitas: 1 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Marcos, soy Sonia. ¿El piso lo buscáis para vivir?'], [3 * H, 'c', 'wa', 'Hola, sí. ¿Tiene ascensor y plaza de garaje?']] },
      // --- Encaje bajo o fuera
      { id: 'i20', n: 'Óscar Peña', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Madrid', prod: 'Ático con terraza en Campanar · 340.000 €', orig: 'c3', canal: 'wa', etapa: 2, valor: 10200, creado: 4 * D, act: 3 * D, toque: 3 * D,
        f: { sinFin: true, fuera: true }, s: { precio: true },
        conv: [[4 * D, 'a', 'wa', 'Hola Óscar, ¿el ático lo buscas para vivir?'], [3 * D, 'c', 'wa', 'Estaba mirando por curiosidad. ¿Aceptan alquiler con opción a compra sin entrada?']] },
      { id: 'i21', n: 'Beatriz Nogales', rol: 'Compra primera vivienda', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 3 hab. en Ruzafa · 289.000 €', orig: 'c1', canal: 'wa', etapa: 2, valor: 8670, creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { pptoBajo: true, sinFin: true }, s: { ppto: 'no' },
        conv: [[6 * D, 'a', 'wa', 'Hola Beatriz, ¿el piso de Ruzafa lo buscas para vivir?'], [5 * D, 'c', 'wa', 'Sí, pero mi presupuesto es de 150.000 como mucho.']] },
      // --- Visitas en marcha
      { id: 'i22', n: 'Laura Esteve', rol: 'Compra vivienda habitual', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 3 hab. en Patraix · 219.000 €', orig: 'c5', canal: 'wa', etapa: 4, valor: 6570, creado: 4 * D, act: 5 * H, toque: 5 * H,
        f: { hipoteca: 'pre', zona: true }, s: { cita: 50 * H, citaOk: true, visitas: 2 },
        conv: [[4 * D, 'a', 'wa', 'Hola Laura, ¿el piso de Patraix lo buscáis para vivir?'], [4 * D - 30, 'c', 'wa', 'Sí, para mudarnos en primavera.'], [5 * H, 'c', 'wa', '¿Podemos ir el sábado por la mañana?'], [5 * H - 10, 'a', 'wa', 'Confirmada la visita del sábado a las 11:00. Te mando la ubicación.']] },
      // --- Ya cerrados
      { id: 'i23', n: 'Francisco Ribes', rol: 'Cambio de vivienda', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 4 hab. en Benimaclet · 310.000 €', orig: 'c1', canal: 'wa', etapa: 6, valor: 9300, creado: 60 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { hipoteca: 'pre' }, s: { exp: true, expTxt: 'Ha firmado las arras y ahora quiere vender con vosotros su piso de Orriols', pisoVender: true },
        conv: [[2 * D, 'c', 'wa', 'Ya con las arras firmadas: ¿nos ayudáis a vender el piso de Orriols? Nos corre algo de prisa.']] },
      { id: 'i24', n: 'Eva Martí', rol: 'Compra primera vivienda', seg: 'compra', ciudad: 'Valencia', prod: 'Piso 2 hab. en Patraix · 189.000 €', orig: 'c3', canal: 'wa', etapa: 6, valor: 5670, creado: 45 * D, act: 6 * D, toque: 6 * D, fin: 'ganado', f: { hipoteca: 'pre' }, s: {}, conv: [] },
      { id: 'i25', n: 'Roberto Sanchis', rol: 'Inversor particular', seg: 'inversor', ciudad: 'Valencia', prod: 'Local + vivienda en Cabanyal · 470.000 €', orig: 'c5', canal: 'email', etapa: 4, valor: 14100, creado: 35 * D, act: 20 * D, toque: 15 * D, fin: 'perdido', f: { contado: true }, s: { intentos: 3 }, conv: [] }
    ]
  };
})();

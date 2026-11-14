/* Sector: academia de maquillaje profesional (presencial en Murcia y online para España y Latinoamérica). Preparado el 30-oct para la reunión con
 * C.A Makeup Academy. Cursos tomados de su respuesta automática de WhatsApp; volúmenes según su formulario (20-49 solicitudes/mes, <500 €/mes en anuncios,
 * ticket 1.000-4.999 €). Personas, mensajes y cifras de ejemplo. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };

  const Q = window.QV.voz;
  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.camakeup = {
    id: 'camakeup',
    nombre: 'Academia de maquillaje',
    t: {
      contacto: 'interesada', contactos: 'interesadas', Contactos: 'Interesadas', Contacto: 'Interesada',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso',
      paginaVisitas: 'la página del curso', cita: 'llamada de asesoramiento', Cita: 'Llamada de asesoramiento', laCita: 'la llamada de asesoramiento',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'Carolina', Comercial: 'Carolina',
      cliente: 'alumna', unCliente: 'una alumna', convierten: 'se matriculan', objetivoPaso: 'agendar la llamada de asesoramiento',
      casoExito: 'el trabajo de una alumna que ya vive del maquillaje', valorAlto: 5000, oportunidades: 'interesadas',
      atencion: 'interesadas que requieren atención', laVenta: 'la matrícula', Producto: 'Curso', clientes: 'alumnas',
      propuestas: 'plazas reservadas', verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'empleados',
      pasoHumano: 'resolver sus dudas de precio y fechas y cerrar la matrícula'
    },
    // Recorrido: Anuncio → Solicita información → Contactado → Cualificado → Entrevista → Matrícula → Alumno
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'info', txt: 'Solicita información' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'entrevista', txt: 'Asesoramiento' },
      { id: 'matricula', txt: 'Matrícula' },
      { id: 'alumno', txt: 'Alumno', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 1800,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, cualificado: 0.6, entrevista: 0.45, matricula: 0.42 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'interesados que piden información y nunca llegan a hablar con nadie' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      entrevista: { txt: 'Seguimiento', exp: 'interesadas que piden la masterclass o información y no llegan a hablar con Carolina' },
      matricula: { txt: 'Cierre y no-show', exp: 'llamadas de asesoramiento que no terminan en matrícula: «me lo pienso», el precio o la fecha' }
    },
    mesDatos: { respuestaAntes: 540, respuestaAhora: 2, agendadas: 12 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Masterclass gratis · «Profesional en 90 días»', inversion: 220, ticket: 1800,
        embudo: { anuncio: 21000, info: 14, contactado: 9, cualificado: 5, entrevista: 3, matricula: 1, alumno: 1 } },
      { id: 'c2', canal: 'Meta', nombre: 'Formulario · Carrera de Maquillaje presencial (Murcia)', inversion: 160, ticket: 1800,
        embudo: { anuncio: 14000, info: 9, contactado: 7, cualificado: 4, entrevista: 3, matricula: 1, alumno: 1 } },
      { id: 'c3', canal: 'Meta', nombre: 'Carrera online · España y Latinoamérica', inversion: 70, ticket: 900,
        embudo: { anuncio: 16000, info: 6, contactado: 3, cualificado: 2, entrevista: 1, matricula: 0, alumno: 0 } },
      { id: 'c4', canal: 'Instagram', nombre: 'Instagram y WhatsApp (orgánico)', inversion: 0, ticket: 1800,
        embudo: { anuncio: 9000, info: 7, contactado: 6, cualificado: 4, entrevista: 3, matricula: 1, alumno: 1 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Interesadas', cualificados: 'Interesadas cualificadas', entrevistas: 'Llamadas de asesoramiento', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'entrevista' },

    reglas: {
      fitBase: 55,
      fit: [
        [function (c) { return /murcia|cartagena|lorca|alicante|elche|molina/i.test(c.ciudad || ''); }, 12, 'vive cerca de la academia (presencial)'],
        [function (c) { return /profesional|vivir|trabaj|maquilladora/i.test(c.rol || ''); }, 10, 'quiere dedicarse al maquillaje'],
        [function (c) { return c.valor >= 1000; }, 8, 'carrera completa'],
        [function (c) { return /automaquillaje|para mí/i.test(c.rol || ''); }, -10, 'lo quiere para ella, no como profesión'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca algo gratuito']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 14, 'quiere empezar en la próxima fecha'],
        [function (c) { return c.s.temario; }, 8, 'vio la masterclass entera'],
        [function (c) { return c.s.financia; }, 10, 'preguntó por pago a plazos']
      ]
    },

    preguntas: [
      { q: '¿Qué alumnas tienen más probabilidad de matricularse?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Quién vio la masterclass y no ha hablado con nadie?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.orig === 'c1' && c.etapa <= 2; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesadas pidieron la masterclass y todavía no han hablado contigo. Es la parte de la inversión que hoy se pierde.'; }, vista: 'tabla' },
      { q: '¿Quién dijo «más adelante» y cuándo?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesadas dijeron que lo retomarían más adelante, cada una con su fecha. Ninguna es un no.'; }, vista: 'tabla' },
      { q: '¿Qué anuncio trae matrículas, no solo contactos?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
    ],

    historias: {
      mc: {
        titulo: 'Lucía pide la masterclass a las 22:30 y, en vez de un menú de 10 números, le contestan como una persona y agenda la llamada con Carolina',
        contacto: { id: 'demo', n: 'Lucía Martínez', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Murcia', prod: 'Masterclass gratis · «Profesional en 90 días»', orig: 'c1', canal: 'wa', etapa: 1, valor: 1800, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Lucía deja sus datos para ver la masterclass, a las 22:30', feed: 'Nueva solicitud · Masterclass «Profesional en 90 días»', cambio: {} },
          { dur: 6, min: 1, txt: 'En el minuto uno le escribe el asistente, con su nombre y sin menús de números', feed: 'WhatsApp enviado en 40 segundos', cambio: { conv: ['a', 'wa', 'Hola Lucía, soy Lola, de la academia de Carolina Alvarado. Te dejo la masterclass aquí. Una pregunta para orientarte bien: ¿te gustaría dedicarte al maquillaje o es para ti?'] }, toque: true },
          { dur: 6, min: 4, txt: 'Lucía contesta: quiere dedicarse, es de Murcia y prefiere presencial', feed: 'Respuesta: profesional · presencial · Murcia', cambio: { conv: ['c', 'wa', 'Quiero dedicarme. Soy de Murcia, ¿la carrera presencial cuándo empieza?'], s: { conv: true } }, act: true },
          { dur: 6, min: 30, txt: 'Ve la masterclass entera y pregunta si se puede pagar a plazos', feed: 'Masterclass vista al 100 % · pregunta por plazos', cambio: { s: { temario: true, financia: true }, conv: ['c', 'wa', '¿Se puede pagar a plazos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El asistente le propone dos horas para la llamada de asesoramiento con Carolina', feed: 'Llamada de asesoramiento agendada · mañana 11:00', vista: 'agenda', toque: true,
            cambio: { etapa: 4, conv: ['a', 'wa', 'Sí, hay pago a plazos. Lo mejor es que te lo cuente Carolina en una llamada de 15 minutos, con las fechas y el plan de pago. ¿Mañana a las 11:00 o a las 17:00?'], s: { cita: 840, citaOk: true, urg: true, urgTxt: 'quiere empezar en la próxima fecha' } } },
          { dur: 0, min: 1, txt: 'Aviso a Carolina con la ficha', feed: 'Aviso enviado a Carolina', humano: { titulo: 'Lucía, mañana a las 11:00', texto: 'Murcia · quiere dedicarse · Carrera presencial · vio la masterclass entera · pregunta por pago a plazos. Llámala con las fechas de la próxima edición y el plan de pago.' } }
        ]
      }
    },
    historiaDefecto: 'mc',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'm01', n: 'Andrea López', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Murcia', prod: 'Formulario · Carrera de Maquillaje presencial (Murcia)', orig: 'c2', canal: 'wa', etapa: 3, valor: 1800, creado: 3 * D, act: 23, toque: 40,
        f: { exp: 4 }, s: { visitas: 4, precio: true, financia: true, conv: true, urg: true, urgTxt: 'quiere empezar en la próxima edición', resp: true },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Andrea, soy Lola, de la academia de Carolina Alvarado. ¿Quieres dedicarte al maquillaje o es para ti?'], [3 * D - 40, 'c', 'wa', 'Dedicarme. Hago maquillajes a amigas y quiero hacerlo bien.'], [45, 'c', 'wa', '¿Cuándo empieza la próxima y cuánto cuesta? ¿Se puede a plazos?'], [40, 'a', 'wa', 'Te lo cuenta Carolina en 15 minutos con el plan de pago. ¿Te llama hoy?']],
        ev: [[23, 'web', 'Vuelve a ver la masterclass']] },
      { id: 'm02', n: 'Daniela Rojas', rol: 'Maquilladora, quiere profesionalizarse', seg: 'particular', ciudad: 'Cartagena', prod: 'Masterclass gratis · «Profesional en 90 días»', orig: 'c1', canal: 'wa', etapa: 3, valor: 1800, creado: 26 * H, act: 17, toque: 20,
        f: { exp: 5 }, s: { visitas: 3, precio: true, conv: true, temario: true },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Daniela, ¿ya maquillas o empiezas de cero?'], [25 * H, 'c', 'wa', 'Ya maquillo novias, pero quiero el certificado de la Asociación.'], [17, 'c', 'wa', '¿El certificado lo dais vosotras? ¿Cuánto cuesta el perfeccionamiento?']] },
      { id: 'm03', n: 'Sara Gómez', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Molina de Segura', prod: 'Formulario · Carrera de Maquillaje presencial (Murcia)', orig: 'c2', canal: 'wa', etapa: 4, valor: 1800, creado: 6 * D, act: 3 * H, toque: 20 * H,
        f: { exp: 4 }, s: { cita: 22 * H, citaOk: false, precio: true, financia: true, visitas: 2 },
        conv: [[6 * D, 'a', 'wa', 'Hola Sara, ¿presencial u online?'], [6 * D - 30, 'c', 'wa', 'Presencial, vivo al lado.'], [2 * D, 'a', 'wa', 'Te dejo la llamada con Carolina mañana a las 17:00. ¿Te va bien?'], [2 * D - 20, 'c', 'wa', 'Perfecto. ¿Y los fines de semana hay clases?']] },
      { id: 'm04', n: 'Valentina Pérez', rol: 'Vive en Colombia', seg: 'particular', ciudad: 'Medellín', prod: 'Carrera online · España y Latinoamérica', orig: 'c3', canal: 'wa', etapa: 1, valor: 900, creado: 12, act: 12, toque: null,
        f: { exp: 3 }, s: { visitas: 1 }, conv: [] },
      { id: 'm05', n: 'Marta Ruiz', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Lorca', prod: 'Masterclass gratis · «Profesional en 90 días»', orig: 'c1', canal: 'tel', etapa: 1, valor: 1800, creado: 34, act: 34, toque: null,
        f: { exp: 4 }, s: { visitas: 2 }, conv: [] },
      { id: 'm06', n: 'Paula Sánchez', rol: 'Estudia estética', seg: 'particular', ciudad: 'Murcia', prod: 'Formulario · Carrera de Maquillaje presencial (Murcia)', orig: 'c2', canal: 'wa', etapa: 4, valor: 1800, creado: 11 * D, act: 3 * D, toque: 3 * D,
        f: { exp: 4 }, s: { noshow: true, precio: true, visitas: 3 },
        conv: [[11 * D, 'a', 'wa', 'Hola Paula, ¿qué te gustaría hacer con el maquillaje?'], [10 * D, 'c', 'wa', 'Trabajar en bodas y eventos. Termino estética en junio.'], [4 * D, 'a', 'wa', 'Te espera Carolina mañana a las 18:00 por videollamada.']],
        ev: [[3 * D, 'sistema', 'No se presenta a la llamada de asesoramiento']] },
      { id: 'm07', n: 'Claudia Fernández', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Alicante', prod: 'Masterclass gratis · «Profesional en 90 días»', orig: 'c1', canal: 'wa', etapa: 4, valor: 1800, creado: 12 * D, act: 6 * D, toque: 6 * D,
        f: { exp: 4 }, s: { visitas: 2, precio: true, financia: true },
        conv: [[12 * D, 'a', 'wa', 'Hola Claudia, ¿te vendría bien presencial en Murcia?'], [11 * D, 'c', 'wa', 'Sí, puedo ir los fines de semana.'], [6 * D, 'h', 'wa', 'Te paso el plan de pago y las fechas, como hablamos.'], [6 * D - 30, 'c', 'wa', 'Gracias, lo hablo con mi pareja y te digo.']] },
      { id: 'm08', n: 'Lorena Castillo', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Murcia', prod: 'Instagram y WhatsApp (orgánico)', orig: 'c4', canal: 'wa', etapa: 2, valor: 1800, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { exp: 3 }, s: { visitas: 2, precio: true },
        conv: [[5 * D, 'c', 'wa', 'Hola, ¿precio de la carrera Allface?'], [4 * D, 'a', 'wa', 'Hola Lorena, depende de la modalidad y del plan de pago. ¿Te cuenta Carolina en 15 minutos?']] },
      // --- Dijeron «más adelante»
      { id: 'm09', n: 'Noelia Díaz', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Murcia', prod: 'Formulario · Carrera de Maquillaje presencial (Murcia)', orig: 'c2', canal: 'wa', etapa: 3, valor: 1800, creado: 24 * D, act: 20 * D, toque: 20 * D,
        f: { exp: 3 }, s: { luego: 'enero', luegoTxt: 'empezaría en enero, cuando cobre la extra', precio: true },
        conv: [[20 * D, 'c', 'wa', 'Me encanta, pero hasta enero no puedo. Cuando cobre la extra.']] },
      { id: 'm10', n: 'Camila Torres', rol: 'Vive en México', seg: 'particular', ciudad: 'Guadalajara', prod: 'Carrera online · España y Latinoamérica', orig: 'c3', canal: 'wa', etapa: 2, valor: 900, creado: 30 * D, act: 28 * D, toque: 28 * D,
        f: { exp: 3 }, s: { luego: 'febrero', luegoTxt: 'lo haría en febrero, cuando termine el semestre' },
        conv: [[28 * D, 'c', 'wa', 'La online me interesa, pero en febrero cuando termine el semestre.']] },
      // --- Sin seguimiento después de contestar
      { id: 'm11', n: 'Irene Navarro', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Elche', prod: 'Masterclass gratis · «Profesional en 90 días»', orig: 'c1', canal: 'wa', etapa: 3, valor: 1800, creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: { exp: 4 }, s: { visitas: 2, conv: true },
        conv: [[8 * D, 'a', 'wa', 'Hola Irene, ¿qué te pareció la masterclass?'], [7 * D, 'c', 'wa', 'Muy bien. ¿Hay alojamiento cerca si voy desde Elche?'], [5 * D, 'h', 'wa', 'Lo miro y te digo.']] },
      { id: 'm12', n: 'Rocío Moreno', rol: 'Automaquillaje, para mí', seg: 'particular', ciudad: 'Murcia', prod: 'Instagram y WhatsApp (orgánico)', orig: 'c4', canal: 'wa', etapa: 2, valor: 120, creado: 10 * D, act: 7 * D, toque: 7 * D,
        f: { exp: 2 }, s: { precio: true },
        conv: [[10 * D, 'c', 'wa', 'Hola, ¿el curso de automaquillaje cuánto es?'], [7 * D, 'h', 'wa', 'Te paso la info ahora.']] },
      // --- Nuevas o sin respuesta
      { id: 'm13', n: 'Silvia Romero', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Murcia', prod: 'Masterclass gratis · «Profesional en 90 días»', orig: 'c1', canal: 'wa', etapa: 1, valor: 1800, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { exp: 2 }, s: { intentos: 1 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Silvia, soy Lola, de la academia de Carolina Alvarado. ¿Pudiste ver la masterclass?']] },
      { id: 'm14', n: 'Ana Belén Gil', rol: 'Busca algo gratis', seg: 'particular', ciudad: 'Valencia', prod: 'Masterclass gratis · «Profesional en 90 días»', orig: 'c1', canal: 'wa', etapa: 1, valor: 1800, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { gratis: true }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Ana Belén, ¿te gustaría dedicarte al maquillaje o es para ti?']] },
      // --- Ya alumnas
      { id: 'm15', n: 'Laura Ortiz', rol: 'Quiere dedicarse al maquillaje', seg: 'particular', ciudad: 'Murcia', prod: 'Formulario · Carrera de Maquillaje presencial (Murcia)', orig: 'c2', canal: 'wa', etapa: 5, valor: 1800, creado: 25 * D, act: 8 * D, toque: 8 * D, fin: 'ganado', f: { exp: 4 }, s: { exp: true, expTxt: 'Pregunta por el curso de extensiones de pestañas al acabar' }, conv: [[8 * D, 'c', 'wa', 'Me está encantando. ¿Al acabar puedo hacer el de pestañas?']] },
      { id: 'm16', n: 'Beatriz Molina', rol: 'Maquilladora, quiere profesionalizarse', seg: 'particular', ciudad: 'Cartagena', prod: 'Instagram y WhatsApp (orgánico)', orig: 'c4', canal: 'wa', etapa: 5, valor: 1800, creado: 28 * D, act: 10 * D, toque: 10 * D, fin: 'ganado', f: { exp: 4 }, s: {}, conv: [] }
    ]
  };
})();

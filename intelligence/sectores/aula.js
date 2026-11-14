/* Sector: Aula Inmobiliaria (formación inmobiliaria online: Agente Inmobiliario, AICAT, Perito, Administración de Fincas,
 * Mediación y asesoramiento en subastas; sin FUNDAE, que Aula no quiere trabajar). Cursos y precios de aulainmobiliaria.com; ~70 solicitudes al mes
 * según la propia escuela. Personas, conversaciones, inversión y embudo son de ejemplo. */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.aula = {
    id: 'aula',
    nombre: 'Formación inmobiliaria',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso',
      paginaVisitas: 'la página del curso', cita: 'llamada con la asesora', Cita: 'Llamada con la asesora', laCita: 'la llamada',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'la asesora', Comercial: 'Asesora',
      cliente: 'alumno', unCliente: 'un alumno', convierten: 'se matriculan', objetivoPaso: 'matricularse o hablar con la asesora',
      casoExito: 'una opinión de un antiguo alumno', valorAlto: 1000, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la matrícula', Producto: 'Curso', clientes: 'alumnos',
      propuestas: 'propuestas', verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'comerciales',
      pasoHumano: 'resolver la última duda y cerrar la matrícula'
    },
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'info', txt: 'Pide información' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'entrevista', txt: 'Llamada o pago iniciado' },
      { id: 'matricula', txt: 'Matrícula' },
      { id: 'alumno', txt: 'Alumno', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 390,
    referencia: { contactado: 0.9, cualificado: 0.65, entrevista: 0.55, matricula: 0.6 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'interesados que escriben fuera de horario y nadie les contesta a tiempo' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que se quedan en «¿cuánto cuesta?»' },
      entrevista: { txt: 'Seguimiento', exp: 'los «me lo pienso» a los que nadie vuelve a escribir' },
      matricula: { txt: 'Cierre', exp: 'pagos empezados que no se terminan' }
    },
    mesDatos: { respuestaAntes: 410, respuestaAhora: 1, agendadas: 27 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Curso de Agente Inmobiliario', inversion: 900, ticket: 390,
        embudo: { anuncio: 14200, info: 30, contactado: 26, cualificado: 17, entrevista: 10, matricula: 6, alumno: 6 } },
      { id: 'c2', canal: 'Meta', nombre: 'Curso AICAT (Cataluña)', inversion: 350, ticket: 390,
        embudo: { anuncio: 5100, info: 9, contactado: 8, cualificado: 6, entrevista: 3, matricula: 2, alumno: 2 } },
      { id: 'c3', canal: 'Meta', nombre: 'Perito Judicial Inmobiliario', inversion: 450, ticket: 390,
        embudo: { anuncio: 7400, info: 11, contactado: 9, cualificado: 6, entrevista: 3, matricula: 2, alumno: 2 } },
      { id: 'c4', canal: 'Meta', nombre: 'Administración de Fincas y Mediación', inversion: 300, ticket: 390,
        embudo: { anuncio: 4800, info: 7, contactado: 6, cualificado: 4, entrevista: 2, matricula: 1, alumno: 1 } },
      { id: 'c5', canal: 'Google', nombre: 'Búsqueda «curso agente inmobiliario»', inversion: 600, ticket: 450,
        embudo: { anuncio: 3900, info: 9, contactado: 8, cualificado: 6, entrevista: 4, matricula: 3, alumno: 3 } },
      { id: 'c6', canal: 'Meta', nombre: 'Retargeting · vio un curso y no se matriculó', inversion: 250, ticket: 390,
        embudo: { anuncio: 2100, info: 4, contactado: 4, cualificado: 3, entrevista: 2, matricula: 1, alumno: 1 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Solicitudes', cualificados: 'Cualificados', entrevistas: 'Llamadas o pagos iniciados', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'entrevista' },

    reglas: {
      fitBase: 24,
      fit: [
        [function (c) { return c.seg === 'empresa' && c.tam >= 3; }, 26, function (c) { return 'agencia con ' + c.tam + ' comerciales'; }, 'Agencia con 3 comerciales o más'],
        [function (c) { return c.f && c.f.ejercer; }, 20, 'quiere ejercer como agente', 'Quiere ejercer como agente'],
        [function (c) { return c.f && c.f.sector; }, 16, 'ya trabaja en el sector', 'Ya trabaja en el sector'],
        [function (c) { return c.f && c.f.aicat; }, 12, 'necesita el título para el registro AICAT', 'Necesita el AICAT'],
        [function (c) { return c.valor >= 580; }, 8, 'pack o varias matrículas'],
        [function (c) { return c.f && c.f.curioso; }, -14, 'solo curiosidad, sin plan de ejercer'],
        [function (c) { return c.f && c.f.fuera; }, -24, 'fuera de España: el título no le sirve para ejercer allí'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca formación gratuita']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 14, 'preguntó cuándo puede empezar'],
        [function (c) { return c.s.temario; }, 8, 'descargó el temario'],
        [function (c) { return c.s.financia; }, 12, 'preguntó por el pago a plazos con Aplazame'],
        [function (c) { return c.s.carrito; }, 18, 'empezó la matrícula y no la terminó']
      ]
    },

    preguntas: [
      { q: '¿Quién tiene más probabilidad de matricularse esta semana?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Quién empezó la matrícula y no la terminó?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !!c.s.carrito && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados empezaron a pagar y no terminaron. El agente les escribe en menos de una hora con el enlace a plazos.'; },
        vista: 'tabla' },
      { q: '¿Quién dijo «me lo pienso» o «más adelante»?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que lo retomarían. Ninguno es un no: el agente les escribe en la fecha que ellos dieron.'; },
        vista: 'tabla' },
      { q: '¿Qué interesados llevan demasiado tiempo sin respuesta?', h: 'sinSeguimiento', obj: ['seguimiento', 'todo'] },
      { q: '¿Qué campaña trae matrículas y cuál solo solicitudes?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Quién está interesado en el curso de Perito Judicial?', h: 'lista', obj: ['ventas', 'expansion', 'todo'],
        filtro: function (c) { return /Perito/.test(c.prod || '') && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados abiertos en Perito Judicial, el segundo curso que más vendéis. Ordenados por probabilidad de matrícula.'; },
        vista: 'tabla' }
    ],

    historias: {
      alumno: {
        titulo: 'Laura pide información a las 21:40, con la oficina cerrada',
        contacto: { id: 'demo', n: 'Laura Puig', rol: 'Administrativa en una inmobiliaria', seg: 'particular', ciudad: '—', prod: 'Curso de Agente Inmobiliario', orig: 'c1', canal: 'wa', etapa: 1, valor: 390, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Martes 21:40: entra una solicitud desde un anuncio de Instagram', feed: 'Nueva solicitud · Curso de Agente Inmobiliario', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · Sabadell · ya trabaja en una inmobiliaria', cambio: { ciudad: 'Sabadell', f: { sector: true, ejercer: true, aicat: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno, aunque la oficina esté cerrada', feed: 'WhatsApp enviado en 52 segundos', cambio: { conv: ['a', 'wa', 'Hola Laura, soy Marta, la asistente de Aula Inmobiliaria 😊 Te escribo por el curso de Agente Inmobiliario. ¿Lo buscas para empezar a ejercer o para lo que ya haces en la inmobiliaria?'] }, toque: true },
          { dur: 6, min: 6, txt: 'Laura mira el temario y la página de precio', feed: 'Visita la página del curso (2 veces) · descarga el temario', cambio: { s: { visitas: 2, temario: true } }, act: true },
          { dur: 7, min: 2, txt: 'Laura contesta y pregunta por el AICAT y los plazos', feed: 'Respuesta recibida · pregunta AICAT y pago a plazos', cambio: { etapa: 2, s: { precio: true, financia: true }, conv: ['c', 'wa', 'Trabajo de administrativa en una inmobiliaria en Sabadell y quiero ejercer de agente. ¿Me vale para el AICAT? ¿Se puede pagar a plazos?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente responde con vuestras condiciones reales y cualifica', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Sí: para ejercer en Cataluña tienes el Curso AICAT Homologado, 390 € o desde 79,65 €/mes con Aplazame. ¿Quieres empezar ya o más adelante?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Laura quiere empezar ya, pero tiene una duda de su caso', feed: 'Intención alta · quiere empezar ya', cambio: { s: { urg: true, urgTxt: 'quiere empezar ya', conv: true }, conv: ['c', 'wa', 'Ya mismo. Pero tengo dudas de si me convalidan algo por llevar dos años en la inmobiliaria.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente le reserva una llamada con la asesora', feed: 'Llamada agendada · mañana 10:00 con Silvia', cambio: { etapa: 4, s: { cita: 740, citaOk: true }, conv: ['a', 'wa', 'Eso mejor te lo confirma Silvia, nuestra asesora. Te llama mañana a las 10:00. Y si lo prefieres, aquí puedes matricularte ya a plazos: aulainmobiliaria.com'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a la asesora: Laura está lista', feed: 'Aviso enviado a la asesora', humano: { titulo: 'Laura está lista para matricularse', texto: 'Sabadell · administrativa en una inmobiliaria desde hace 2 años · quiere ejercer y necesita el AICAT · prefiere pagar con Aplazame · pregunta si le convalidan algo. Llamada mañana a las 10:00.' } }
        ]
      },
      perito: {
        titulo: 'Un tasador quiere hacerse perito judicial',
        contacto: { id: 'demo', n: 'Jordi Ferrer', rol: 'Tasador inmobiliario', seg: 'particular', ciudad: '—', prod: 'Perito Judicial Inmobiliario', orig: 'c3', canal: 'wa', etapa: 1, valor: 390, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud del anuncio «Ya vendes pisos. ¿Y si también cobras por tasarlos?»', feed: 'Nueva solicitud · Perito Judicial Inmobiliario', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · Valencia · ya hace tasaciones', cambio: { ciudad: 'Valencia', f: { sector: true } } },
          { dur: 6, min: 1, txt: 'El agente contesta en el minuto uno', feed: 'WhatsApp enviado en 44 segundos', cambio: { conv: ['a', 'wa', 'Hola Jordi, soy Marta, de Aula Inmobiliaria. Te escribo por el curso de Perito Judicial Inmobiliario. ¿Ya haces tasaciones o empiezas de cero?'] }, toque: true },
          { dur: 7, min: 4, txt: 'Jordi contesta', feed: 'Respuesta recibida · quiere entrar en las listas de peritos', cambio: { etapa: 2, s: { conv: true, urg: true, urgTxt: 'quiere entrar en las listas de peritos este año' }, conv: ['c', 'wa', 'Hago tasaciones para una agencia y quiero entrar en las listas de peritos del juzgado este año. ¿Cuándo podría empezar?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente responde y propone el siguiente paso', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, s: { precio: true }, conv: ['a', 'wa', 'Puedes empezar hoy mismo: es 100% online, 180 horas y 390 € (o a plazos con Aplazame). ¿Te matriculas ya o prefieres que te llame Olga y te cuente cómo funcionan las listas?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Jordi pide hablar con una persona', feed: 'Pide hablar con alguien · aviso por WhatsApp a Olga', cambio: { etapa: 4, s: { cita: 60, citaOk: true }, conv: ['c', 'wa', 'Prefiero que me llame, tengo un par de dudas.'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso por WhatsApp a Olga: llamar ahora', feed: 'Aviso enviado a Olga', humano: { titulo: 'Jordi quiere hablar contigo', texto: 'Valencia · tasador en una agencia · quiere entrar en las listas de peritos este año · le encaja Perito Judicial (390 € o a plazos). Pide que le llames ahora.' } }
        ]
      },
      voz: {
        titulo: 'No contesta al WhatsApp y le llama el agente de voz',
        contacto: { id: 'demo', n: 'Sergio Martín', rol: 'Comercial de seguros', seg: 'particular', ciudad: '—', prod: 'Curso de Agente Inmobiliario', orig: 'c5', canal: 'wa', etapa: 1, valor: 390, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud desde Google', feed: 'Nueva solicitud · búsqueda «curso agente inmobiliario»', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 50 segundos', cambio: { conv: ['a', 'wa', 'Hola Sergio, soy Marta, de Aula Inmobiliaria. ¿Te llamamos dos minutos y te cuento cómo es el curso?'] }, toque: true },
          { dur: 5, min: 9, txt: 'Diez minutos sin respuesta: la cadencia pasa a voz', feed: 'Sin respuesta al WhatsApp · llamada programada', cambio: { s: { intentos: 1 } } },
          { dur: 16, min: 1, txt: 'El agente de voz le llama y cualifica en la llamada', feed: 'Llamada del agente de voz · 4 min · quiere matricularse', act: true,
            llamada: { dur: 240, res: 'agendo', resumen: 'Cogió a la primera. Es comercial de seguros en Madrid y quiere pasarse al sector inmobiliario. Pregunta si el curso vale para ejercer y si se puede pagar a plazos. Pide la llamada con la asesora el ' + Q.hueco(17).txt + ' a las 17:00.', dijo: ['Quiere cambiar de sector este año', 'Pregunta si vale para ejercer', 'Prefiere pagar a plazos'],
              trans: [['v', 'Hola Sergio, soy Marta, de Aula Inmobiliaria. Te llamo por el curso de agente inmobiliario. ¿Tienes un minuto?'], ['c', 'Sí, dime.'], ['v', '¿Lo buscas para empezar a trabajar en el sector?'], ['c', 'Sí, vengo de seguros y quiero cambiar. ¿El título vale para ejercer? ¿Y se puede pagar a plazos?'], ['v', 'Es un curso homologado y sí, desde 79,65 € al mes. ¿Te llama Silvia, nuestra asesora, el ' + Q.hueco(17).txt + ' a las 17:00 y te lo explica todo?'], ['c', 'Perfecto.']] },
            cambio: { etapa: 3, ciudad: 'Madrid', f: { ejercer: true }, s: { precio: true, financia: true, conv: true, urg: true, urgTxt: 'quiere cambiar de sector este año' } } },
          { dur: 7, min: 4, txt: 'La llamada aparece en la Agenda, confirmada por WhatsApp', feed: 'Llamada agendada por el agente de voz · ' + Q.hueco(17).txt + ' 17:00', vista: 'agenda', toque: true,
            cambio: { etapa: 4, s: { cita: Q.hueco(17).min - 16, citaOk: true }, conv: ['a', 'wa', 'Sergio, te confirmo la llamada con Silvia el ' + Q.hueco(17).txt + ' a las 17:00. Te dejo aquí el temario del curso.'] } },
          { dur: 0, min: 1, txt: 'Aviso a la asesora', feed: 'Aviso enviado a la asesora', humano: { titulo: 'Sergio está listo para hablar', texto: 'Madrid · comercial de seguros · quiere ejercer de agente este año · prefiere Aplazame. Llamada el ' + Q.hueco(17).txt + ' a las 17:00, agendada por el agente de voz.' } }
        ]
      }
    },
    historiaDefecto: 'alumno',

    contactos: [
      // --- Caliente ahora
      { id: 'a01', n: 'Marc Soler', rol: 'Comercial de una inmobiliaria', seg: 'particular', ciudad: 'Terrassa', prod: 'Curso AICAT (Cataluña)', orig: 'c2', canal: 'wa', etapa: 4, valor: 390, creado: 26 * H, act: 25, toque: 30,
        f: { sector: true, ejercer: true, aicat: true }, s: { carrito: true, financia: true, visitas: 4, precio: true },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Marc, soy Marta, de Aula Inmobiliaria. ¿El AICAT lo necesitas para inscribirte en el registro?'], [25 * H, 'c', 'wa', 'Sí, mi jefe me lo pide para este año.'], [40, 'c', 'wa', 'He empezado a pagar con Aplazame pero no me ha dejado terminar.'], [30, 'a', 'wa', 'Te paso el enlace otra vez; si prefieres, Silvia te llama en 5 minutos y lo terminas con ella.']],
        ev: [[25, 'web', 'Pago con Aplazame empezado y no terminado']] },
      { id: 'a02', n: 'Isabel Romero', rol: 'Administrativa en una inmobiliaria', seg: 'particular', ciudad: 'Sevilla', prod: 'Curso de Agente Inmobiliario', orig: 'c1', canal: 'wa', etapa: 3, valor: 390, creado: 3 * D, act: 2 * H, toque: 3 * H,
        f: { sector: true, ejercer: true }, s: { visitas: 3, urg: true, urgTxt: 'quiere empezar antes de diciembre', financia: true },
        conv: [[3 * D, 'a', 'wa', 'Hola Isabel, ¿lo buscas para empezar a ejercer?'], [3 * D - 30, 'c', 'wa', 'Sí, quiero empezar antes de diciembre. ¿Cuánto sería al mes?'], [3 * H, 'a', 'wa', 'Desde 79,65 €/mes con Aplazame. ¿Te llama Olga hoy y lo dejáis hecho?'], [2 * H, 'c', 'wa', 'Sí, a partir de las 16:00.']] },
      { id: 'a03', n: 'David Ortega', rol: 'Tasador', seg: 'particular', ciudad: 'Madrid', prod: 'Pack Agente + Perito Judicial', orig: 'c3', canal: 'wa', etapa: 3, valor: 580, creado: 2 * D, act: 50, toque: 70,
        f: { sector: true }, s: { visitas: 3, precio: true, conv: true },
        conv: [[2 * D, 'a', 'wa', 'Hola David, ¿el curso de perito lo quieres para hacer tasaciones judiciales?'], [2 * D - 40, 'c', 'wa', 'Sí, ya hago tasaciones y quiero entrar en las listas de peritos.'], [70, 'a', 'wa', 'Te encaja el pack con Agente Inmobiliario. ¿Quieres empezar este mes?'], [50, 'c', 'wa', '¿Cuándo podría empezar si me matriculo hoy?']] },
      { id: 'a04', n: 'Lucía Navarro', rol: 'Recepcionista', seg: 'particular', ciudad: 'Valencia', prod: 'Curso de Agente Inmobiliario', orig: 'c1', canal: 'wa', etapa: 1, valor: 390, creado: 9, act: 9, toque: null,
        f: { ejercer: true }, s: { visitas: 1 }, conv: [] },
      { id: 'a05', n: 'Pablo Gil', rol: 'Agente inmobiliario', seg: 'particular', ciudad: 'Zaragoza', prod: 'Administración de Fincas', orig: 'c4', canal: 'wa', etapa: 2, valor: 390, creado: 20 * H, act: 3 * H, toque: 19 * H,
        f: { sector: true }, s: { visitas: 2, precio: true },
        conv: [[20 * H - 1, 'a', 'wa', 'Hola Pablo, ¿quieres sumar la administración de fincas a lo que ya haces?'], [3 * H, 'c', 'wa', 'Sí. ¿Cuántas horas tiene y se puede pagar a plazos?']] },
      // --- Me lo pienso / más adelante
      { id: 'a06', n: 'Ana Ruiz', rol: 'Dependienta', seg: 'particular', ciudad: 'Málaga', prod: 'Curso de Agente Inmobiliario', orig: 'c1', canal: 'wa', etapa: 3, valor: 390, creado: 18 * D, act: 15 * D, toque: 15 * D,
        f: { ejercer: true }, s: { luego: 'enero', luegoTxt: 'empezaría en enero, cuando cobre la extra', precio: true },
        conv: [[18 * D, 'a', 'wa', 'Hola Ana, ¿quieres empezar ya o más adelante?'], [15 * D, 'c', 'wa', 'Me encanta, pero empezaría en enero, cuando cobre la extra.']] },
      { id: 'a07', n: 'Joan Vidal', rol: 'Comercial', seg: 'particular', ciudad: 'Girona', prod: 'Curso AICAT (Cataluña)', orig: 'c2', canal: 'wa', etapa: 3, valor: 390, creado: 12 * D, act: 9 * D, toque: 9 * D,
        f: { aicat: true, ejercer: true }, s: { luego: 'noviembre', luegoTxt: 'se lo piensa y lo hablará en casa', financia: true },
        conv: [[12 * D, 'a', 'wa', 'Hola Joan, el AICAT es 390 € o desde 79,65 €/mes.'], [9 * D, 'c', 'wa', 'Me lo pienso y lo hablo en casa. Os digo en noviembre.']] },
      { id: 'a08', n: 'Rosa Martínez', rol: 'Agente inmobiliaria', seg: 'particular', ciudad: 'Barcelona', prod: 'Mediación en Conflictos Inmobiliarios', orig: 'c4', canal: 'email', etapa: 3, valor: 390, creado: 30 * D, act: 24 * D, toque: 24 * D,
        f: { sector: true }, s: { luego: 'enero', luegoTxt: 'lo retomará en enero' },
        conv: [[24 * D, 'c', 'email', 'Me interesa, pero lo retomo en enero.']] },
      // --- Sin seguimiento después de contestar
      { id: 'a09', n: 'Carlos Pérez', rol: 'Agente inmobiliario', seg: 'particular', ciudad: 'Alicante', prod: 'Perito Judicial Inmobiliario', orig: 'c3', canal: 'wa', etapa: 3, valor: 390, creado: 7 * D, act: 5 * D, toque: 5 * D,
        f: { sector: true }, s: { visitas: 2, conv: true },
        conv: [[7 * D, 'a', 'wa', 'Hola Carlos, ¿quieres hacer tasaciones periciales?'], [6 * D, 'c', 'wa', 'Sí. ¿Me sirve para entrar en las listas del juzgado?'], [5 * D, 'h', 'wa', 'Te lo confirmo mañana.']] },
      { id: 'a10', n: 'Elena Sanz', rol: 'Comercial inmobiliaria', seg: 'particular', ciudad: 'Madrid', prod: 'Curso de Agente Inmobiliario', orig: 'c5', canal: 'wa', etapa: 2, valor: 390, creado: 6 * D, act: 4 * D, toque: 4 * D,
        f: { sector: true, ejercer: true }, s: { precio: true, financia: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Elena, ¿buscas el curso para ejercer?'], [4 * D, 'c', 'wa', 'Sí, ¿cuánto sería al mes con Aplazame?']] },
      { id: 'a11', n: 'Manuel Torres', rol: 'Comercial', seg: 'particular', ciudad: 'Murcia', prod: 'Perito Judicial Inmobiliario', orig: 'c6', canal: 'wa', etapa: 2, valor: 390, creado: 9 * D, act: 7 * D, toque: 7 * D,
        f: { sector: true }, s: { visitas: 3, precio: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Manuel, vi que miraste el curso de Perito. ¿Te cuento cómo es?'], [7 * D, 'c', 'wa', 'Sí. ¿Me sirve para entrar en las listas del juzgado?']] },
      // --- Nuevos o sin respuesta
      { id: 'a12', n: 'Sara Molina', rol: 'Teleoperadora', seg: 'particular', ciudad: 'Córdoba', prod: 'Curso de Agente Inmobiliario', orig: 'c1', canal: 'wa', etapa: 1, valor: 390, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { ejercer: true }, s: { intentos: 1 }, conv: [[2 * D - 1, 'a', 'wa', 'Hola Sara, soy Marta, de Aula Inmobiliaria. ¿Lo buscas para empezar a ejercer?']] },
      { id: 'a13', n: 'Raúl Iglesias', rol: 'Agente inmobiliario', seg: 'particular', ciudad: 'Bilbao', prod: 'Mediación en Conflictos Inmobiliarios', orig: 'c4', canal: 'wa', etapa: 1, valor: 390, creado: 4 * H, act: 3 * H, toque: 4 * H - 1,
        f: { sector: true }, s: { visitas: 2, intentos: 1 }, conv: [[4 * H - 1, 'a', 'wa', 'Hola Raúl, ¿quieres sumar la mediación a tu trabajo?']] },
      { id: 'a14', n: 'Marta Blanco', rol: 'Administrativa', seg: 'particular', ciudad: 'Tarragona', prod: 'Curso AICAT (Cataluña)', orig: 'c2', canal: 'wa', etapa: 1, valor: 390, creado: 40, act: 35, toque: null,
        f: { aicat: true }, s: { visitas: 2 }, conv: [] },
      { id: 'a15', n: 'Jorge Castro', rol: 'Autónomo', seg: 'particular', ciudad: 'Vigo', prod: 'Curso de Agente Inmobiliario', orig: 'c5', canal: 'wa', etapa: 1, valor: 390, creado: 20 * D, act: 20 * D, toque: 14 * D, f: { curioso: true }, s: { intentos: 3 },
        conv: [[20 * D, 'a', 'wa', 'Hola Jorge, ¿buscas el curso para ejercer?']] },
      // --- Llamadas y cualificados en marcha
      { id: 'a16', n: 'Nuria Pons', rol: 'Comercial', seg: 'particular', ciudad: 'Sabadell', prod: 'Curso AICAT (Cataluña)', orig: 'c2', canal: 'wa', etapa: 4, valor: 390, creado: 3 * D, act: 5 * H, toque: 5 * H,
        f: { aicat: true, sector: true }, s: { cita: 20 * H, citaOk: true },
        conv: [[3 * D, 'a', 'wa', 'Hola Nuria, ¿el AICAT es para inscribirte en el registro?'], [3 * D - 20, 'c', 'wa', 'Sí.'], [5 * H, 'a', 'wa', 'Confirmada la llamada con Silvia mañana a las 11:00.']] },
      { id: 'a17', n: 'Álvaro León', rol: 'Arquitecto técnico', seg: 'particular', ciudad: 'Valladolid', prod: 'Perito Judicial Inmobiliario', orig: 'c3', canal: 'wa', etapa: 4, valor: 390, creado: 8 * D, act: 3 * D, toque: 3 * D,
        f: { sector: true }, s: { noshow: true, visitas: 2 },
        conv: [[8 * D, 'a', 'wa', 'Hola Álvaro, ¿quieres trabajar como perito?'], [7 * D, 'c', 'wa', 'Sí, para complementar lo que hago.'], [4 * D, 'a', 'wa', 'Te llama Silvia mañana a las 17:00.']],
        ev: [[3 * D, 'sistema', 'No coge la llamada con la asesora']] },
      // --- Encaje bajo
      { id: 'a18', n: 'Valentina Díaz', rol: 'Estudiante', seg: 'particular', ciudad: 'Bogotá', prod: 'Curso de Agente Inmobiliario', orig: 'c1', canal: 'wa', etapa: 2, valor: 390, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { fuera: true }, s: { precio: true }, conv: [[4 * D, 'c', 'wa', 'Hola, soy de Colombia, ¿me sirve para trabajar aquí?']] },
      { id: 'a19', n: 'Iván Cano', rol: 'Desempleado', seg: 'particular', ciudad: 'Huelva', prod: 'Curso de Agente Inmobiliario', orig: 'c1', canal: 'wa', etapa: 2, valor: 390, creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { gratis: true }, s: { ppto: 'no' }, conv: [[5 * D, 'c', 'wa', '¿Hay alguna versión gratuita?']] },
      // --- Matriculados
      { id: 'a20', n: 'Teresa Gómez', rol: 'Comercial', seg: 'particular', ciudad: 'Granada', prod: 'Curso de Agente Inmobiliario', orig: 'c1', canal: 'wa', etapa: 5, valor: 390, creado: 10 * D, act: 2 * D, toque: 2 * D, fin: 'ganado', f: { ejercer: true }, s: {}, conv: [] },
      { id: 'a21', n: 'Josep Roca', rol: 'Agente inmobiliario', seg: 'particular', ciudad: 'Lleida', prod: 'Curso AICAT (Cataluña)', orig: 'c2', canal: 'wa', etapa: 5, valor: 390, creado: 14 * D, act: 6 * D, toque: 6 * D, fin: 'ganado', f: { aicat: true }, s: {}, conv: [] },
      { id: 'a22', n: 'Beatriz Lara', rol: 'Agente inmobiliaria', seg: 'particular', ciudad: 'Palma', prod: 'Perito Judicial Inmobiliario', orig: 'c3', canal: 'wa', etapa: 6, valor: 390, creado: 40 * D, act: 9 * D, toque: 9 * D, fin: 'ganado',
        f: { sector: true }, s: { exp: true, expTxt: 'Pregunta por el curso de Agente Inmobiliario después de terminar Perito' }, conv: [] }
    ]
  };
})();

/* Sector: Centro de FP (ciclos de grado medio y superior, alumnos y familias).
 * Todos los nombres, cifras y precios son inventados: datos de ejemplo. */
(function () {
  const H = 60, D = 1440;

  const Q = window.QV.voz;
  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.fp = {
    id: 'fp',
    nombre: 'Centro de FP',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'ciclo',
      paginaVisitas: 'la página del ciclo', cita: 'visita al centro', Cita: 'Visita al centro', laCita: 'la visita al centro',
      propuesta: 'la reserva de plaza', Propuesta: 'Reserva de plaza', comercial: 'admisiones', Comercial: 'Admisiones',
      cliente: 'alumno', unCliente: 'un alumno', convierten: 'se matriculan', objetivoPaso: 'agendar la visita al centro',
      casoExito: 'el testimonio de un antiguo alumno que ya trabaja', valorAlto: 4500, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la matrícula', Producto: 'Ciclo', clientes: 'alumnos',
      propuestas: 'reservas de plaza', verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'empleados',
      pasoHumano: 'resolver las dudas de acceso, horario y precio y cerrar la matrícula'
    },
    // Recorrido: Anuncio → Pide información → Contactado → Cualificado → Visita al centro → Matrícula → Alumno
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'info', txt: 'Pide información' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'entrevista', txt: 'Visita al centro' },
      { id: 'matricula', txt: 'Matrícula' },
      { id: 'alumno', txt: 'Alumno', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 4200,
    referencia: { contactado: 0.85, cualificado: 0.6, entrevista: 0.5, matricula: 0.45 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'alumnos y familias que piden información y nunca llegan a hablar con nadie' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones en las que nadie comprueba el acceso, el turno o quién decide' },
      entrevista: { txt: 'Seguimiento', exp: 'cualificados a los que nadie cierra la visita al centro' },
      matricula: { txt: 'Visita y no-show', exp: 'visitas que no vienen o no terminan en matrícula' }
    },
    mesDatos: { respuestaAntes: 310, respuestaAhora: 2, agendadas: 118 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Grado Superior · Educación Infantil', inversion: 1400, ticket: 4600,
        embudo: { anuncio: 7800, info: 186, contactado: 104, cualificado: 66, entrevista: 31, matricula: 12, alumno: 11 } },
      { id: 'c2', canal: 'Meta', nombre: 'Grado Medio · Cuidados Auxiliares de Enfermería', inversion: 1200, ticket: 4200,
        embudo: { anuncio: 8400, info: 214, contactado: 112, cualificado: 61, entrevista: 27, matricula: 10, alumno: 9 } },
      { id: 'c3', canal: 'Instagram', nombre: 'Estética y Peluquería (medio y superior)', inversion: 900, ticket: 4000,
        embudo: { anuncio: 6900, info: 168, contactado: 86, cualificado: 44, entrevista: 19, matricula: 7, alumno: 6 } },
      { id: 'c4', canal: 'Google', nombre: 'Grado Medio · Gestión Administrativa', inversion: 600, ticket: 3800,
        embudo: { anuncio: 2100, info: 62, contactado: 44, cualificado: 29, entrevista: 13, matricula: 5, alumno: 5 } },
      { id: 'c5', canal: 'Google', nombre: 'Grado Medio · Sistemas Microinformáticos y Redes', inversion: 700, ticket: 4000,
        embudo: { anuncio: 2400, info: 71, contactado: 47, cualificado: 30, entrevista: 14, matricula: 6, alumno: 5 } },
      { id: 'c6', canal: 'Web', nombre: 'Web, jornadas de puertas abiertas y recomendación', inversion: 0, ticket: 4200,
        embudo: { anuncio: 3200, info: 88, contactado: 66, cualificado: 45, entrevista: 24, matricula: 12, alumno: 11 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Solicitudes de información', cualificados: 'Interesados cualificados', entrevistas: 'Visitas al centro', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación del curso' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'entrevista' },

    reglas: {
      fitBase: 24,
      fit: [
        [function (c) { return c.f && c.f.acceso; }, 22, function (c) { return 'cumple el acceso (' + c.f.estudios + ')'; }, 'Cumple el requisito de acceso al ciclo'],
        [function (c) { return c.f && c.f.sinAcceso; }, -18, 'le falta el título de acceso: necesita prueba de acceso'],
        [function (c) { return c.f && c.f.cerca; }, 12, 'vive cerca del centro'],
        [function (c) { return c.seg === 'familia'; }, 12, 'escribe la familia, que es quien decide y paga', 'Escribe la familia'],
        [function (c) { return c.f && c.f.turnoOk; }, 10, 'le encaja el turno que queda con plazas'],
        [function (c) { return c.f && c.f.trabaja; }, 6, 'trabaja y busca turno de tarde o semipresencial'],
        [function (c) { return c.f && c.f.lejos; }, -24, 'vive lejos y no puede venir a clase presencial'],
        [function (c) { return c.f && c.f.publica; }, -20, 'busca plaza en la FP pública gratuita'],
        [function (c) { return c.f && c.f.otroCiclo; }, -10, 'pide un ciclo que el centro no imparte']
      ],
      intencion: [
        [function (c) { return c.s.plazas; }, 14, 'preguntó si quedan plazas'],
        [function (c) { return c.s.visita; }, 12, 'pidió visitar el centro'],
        [function (c) { return c.s.practicas; }, 8, 'preguntó por las prácticas en empresa'],
        [function (c) { return c.s.financia; }, 10, 'preguntó por el pago mensual']
      ]
    },

    preguntas: [
      { q: '¿Qué alumnos tienen más probabilidad de matricularse?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Quién dijo que se matricularía el curso que viene?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que lo harían más adelante. Ninguno es un no: el agente de reactivación les escribe cuando abre la preinscripción o en la fecha que ellos mismos dieron.'; },
        vista: 'tabla' },
      { q: '¿Qué interesados llevan demasiado tiempo sin seguimiento?', h: 'sinSeguimiento', obj: ['seguimiento', 'todo'] },
      { q: '¿Qué ciclo y qué campaña están trayendo matrículas?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Qué interesados han pedido visitar el centro y aún no tienen día?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return !!c.s.visita && !(c.s.cita) && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados han pedido ver el centro y nadie les ha dado día. Es el paso que más matrículas cierra: quien visita las aulas y los talleres decide mucho antes.'; },
        vista: 'tabla' }
    ],

    historias: {
      alumno: {
        titulo: 'Una alumna pide información de Educación Infantil',
        contacto: { id: 'demo', n: 'Andrea Gómez', rol: 'Terminó Bachillerato', seg: 'particular', ciudad: '—', prod: 'Grado Superior en Educación Infantil', orig: 'c1', canal: 'wa', etapa: 1, valor: 4600, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde un anuncio de Meta', feed: 'Nueva solicitud · Grado Superior en Educación Infantil', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · Bachillerato terminado · vive en Madrid', cambio: { ciudad: 'Madrid', f: { estudios: 'Bachillerato', acceso: true, cerca: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 52 segundos', cambio: { conv: ['a', 'wa', 'Hola Andrea, soy Sara, de admisiones. Te escribo por el Grado Superior en Educación Infantil. ¿Lo quieres para empezar ya este curso o para el que viene?'] }, toque: true },
          { dur: 6, min: 8, txt: 'Andrea vuelve a la página del ciclo y mira las prácticas', feed: 'Visita la página del ciclo (3 veces) · sección de prácticas', cambio: { s: { visitas: 3, practicas: true } }, act: true },
          { dur: 7, min: 2, txt: 'Andrea contesta y pregunta por plazas y turno', feed: 'Respuesta recibida · pregunta plazas y turno', cambio: { etapa: 2, s: { plazas: true }, conv: ['c', 'wa', 'Hola! Para este curso si puede ser. ¿Quedan plazas? Por las mañanas trabajo en una academia, ¿hay turno de tarde?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente responde y cualifica', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, f: { trabaja: true, turnoOk: true }, conv: ['a', 'wa', 'Sí, quedan pocas plazas en el turno de tarde, de 15:00 a 21:00, y con Bachillerato tienes el acceso directo. ¿Te va bien venir a ver el centro y el aula de prácticas con Beatriz, la jefa de estudios?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Andrea acepta y pregunta por el pago', feed: 'Intención alta · pregunta por pago mensual', cambio: { s: { visita: true, urg: true, urgTxt: 'quiere empezar este curso y quedan pocas plazas', financia: true }, conv: ['c', 'wa', 'Vale! ¿Mañana por la tarde podría ser? Y otra cosa, ¿se puede pagar por meses?'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la visita al centro', feed: 'Visita agendada · mañana 17:30', cambio: { etapa: 4, s: { cita: 1290, citaOk: true }, conv: ['a', 'wa', 'Sí, se puede pagar en mensualidades. Te espero mañana a las 17:30 con Beatriz. Trae el título o el certificado de notas de Bachillerato y así dejas la plaza reservada si te convence.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Andrea está lista para la visita', feed: 'Aviso enviado a admisiones', humano: { titulo: 'Andrea está lista para la visita', texto: 'Educación Infantil · Bachillerato (acceso directo) · trabaja por las mañanas: turno de tarde · quiere empezar este curso · pregunta por pago mensual. Visita mañana a las 17:30 con Beatriz.' } }
        ]
      },
      familia: {
        titulo: 'Una madre pregunta por un Grado Medio para su hijo',
        contacto: { id: 'demo', n: 'Pilar Navas', rol: 'Madre de un alumno de 4.º de ESO', seg: 'familia', ciudad: '—', prod: 'Grado Medio en Sistemas Microinformáticos y Redes', orig: 'c5', canal: 'wa', etapa: 1, valor: 4000, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde Google', feed: 'Nueva solicitud · Grado Medio en Sistemas Microinformáticos y Redes', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: quién escribe y para quién', feed: 'Ficha completada · escribe la madre · su hijo tiene 16 años', cambio: { ciudad: 'Madrid', f: { estudios: 'ESO', acceso: true, cerca: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 55 segundos', cambio: { conv: ['a', 'wa', 'Hola Pilar, soy Sara, de admisiones. Te escribo por el Grado Medio en Sistemas Microinformáticos y Redes. ¿Es para tu hijo? ¿Ha terminado ya la ESO?'] }, toque: true },
          { dur: 7, min: 6, txt: 'Pilar contesta con sus dudas', feed: 'Respuesta recibida · dudas de la familia', cambio: { etapa: 2, s: { practicas: true }, conv: ['c', 'wa', 'Sí, es para mi hijo, la ESO la sacó en junio. Le gustan mucho los ordenadores pero no sé si esto tiene salida. ¿Hacen prácticas en empresas?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente responde y cualifica', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, f: { turnoOk: true }, conv: ['a', 'wa', 'Sí: el segundo año hace prácticas en una empresa del sector, y con el título puede trabajar o seguir a un Grado Superior. Con la ESO tiene acceso directo y quedan plazas de mañana. ¿Os viene bien venir los dos a ver el taller de informática?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Pilar quiere venir con su hijo y pregunta el precio', feed: 'Intención alta · pide visita y precio', cambio: { s: { visita: true, plazas: true, precio: true, urg: true, urgTxt: 'su hijo está sin matricular este curso' }, conv: ['c', 'wa', 'Sí, mejor que lo vea él. ¿Cuánto es al año? Ahora mismo está sin matricular en ningún sitio.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente agenda la visita al centro', feed: 'Visita agendada · jueves 18:00', cambio: { etapa: 4, s: { cita: 2 * D + 120, citaOk: true }, conv: ['a', 'wa', 'El precio y las formas de pago te los explica Beatriz en la visita, con todo por escrito. Os espero el jueves a las 18:00. Te llega la confirmación con la dirección.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: la familia de Pilar viene el jueves', feed: 'Aviso enviado a admisiones', humano: { titulo: 'La familia de Pilar viene el jueves', texto: 'Sistemas Microinformáticos · hijo de 16 años con la ESO (acceso directo) · sin matricular este curso · a la madre le preocupa la salida laboral y las prácticas · pregunta el precio. Visita el jueves a las 18:00 con su hijo.' } }
        ]
      },
      voz: {
        titulo: 'No contesta al WhatsApp y le llama el agente de voz',
        contacto: { id: 'demo', n: 'Lucía Prieto', rol: 'Trabaja en un supermercado', seg: 'particular', ciudad: '—', prod: 'Grado Medio en Cuidados Auxiliares de Enfermería', orig: 'c2', canal: 'wa', etapa: 1, valor: 4200, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde un anuncio de Meta', feed: 'Nueva solicitud · Cuidados Auxiliares de Enfermería', cambio: {} },
          { dur: 5, min: 1, txt: 'El agente completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · ESO terminada · trabaja', cambio: { ciudad: 'Getafe', f: { estudios: 'ESO', acceso: true, trabaja: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 49 segundos', cambio: { conv: ['a', 'wa', 'Hola Lucía, soy Sara, de admisiones. Te escribo por el Grado Medio en Cuidados Auxiliares de Enfermería. ¿Te va bien que te llamemos dos minutos y te cuento horarios y plazas?'] }, toque: true },
          { dur: 5, min: 9, txt: 'Diez minutos sin respuesta: la cadencia pasa a voz', feed: 'Sin respuesta al WhatsApp · llamada programada', cambio: { s: { intentos: 1 } } },
          { dur: 16, min: 1, txt: 'El agente de voz le llama y cualifica en la llamada', feed: 'Llamada del agente de voz · 4 min · agendó la visita', act: true,
            llamada: { dur: 250, res: 'agendo', resumen: 'Cogió a la segunda: estaba en el trabajo. Tiene la ESO y trabaja de mañanas en un supermercado; quiere trabajar en un hospital. Necesita turno de tarde. Agendó la visita del ' + Q.hueco(17).txt + ' a las 17:00.', dijo: ['Quiere trabajar en un hospital', 'Trabaja de mañanas: necesita turno de tarde', 'Pregunta por las prácticas en hospital'],
              trans: [['v', 'Hola Lucía, soy Sara, de admisiones. Te llamo por el ciclo de auxiliar de enfermería que pediste. ¿Tienes un minuto?'], ['c', 'Sí, perdona, estaba trabajando y no había visto el mensaje.'], ['v', 'Sin problema. ¿Tienes la ESO terminada?'], ['c', 'Sí. Trabajo por las mañanas en un súper y quiero trabajar en un hospital. ¿Hay clases por la tarde?'], ['v', 'Sí, hay turno de tarde y las prácticas son en centros sanitarios. ¿Vienes a ver el centro y el aula de prácticas el ' + Q.hueco(17).txt + ' a las 17:00?'], ['c', 'Vale, apúntame.']] },
            cambio: { etapa: 3, f: { turnoOk: true }, s: { practicas: true, plazas: true, urg: true, urgTxt: 'quiere cambiar de trabajo y empezar este curso' } } },
          { dur: 7, min: 4, txt: 'La visita aparece en la Agenda, confirmada por WhatsApp', feed: 'Visita agendada por el agente de voz · ' + Q.hueco(17).txt + ' 17:00', vista: 'agenda', toque: true,
            cambio: { etapa: 4, s: { cita: Q.hueco(17).min - 16, citaOk: true }, conv: ['a', 'wa', 'Lucía, te confirmo la visita al centro el ' + Q.hueco(17).txt + ' a las 17:00. Trae el título de la ESO y, si te convence, dejas la plaza reservada en el turno de tarde.'] } },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Lucía está lista para la visita', feed: 'Aviso enviado a admisiones', humano: { titulo: 'Lucía está lista para la visita', texto: 'Auxiliar de Enfermería · ESO (acceso directo) · trabaja de mañanas: turno de tarde · quiere trabajar en un hospital. Visita el ' + Q.hueco(17).txt + ' a las 17:00, agendada por el agente de voz.' } }
        ]
      }
    },
    historiaDefecto: 'alumno',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'p01', n: 'Carmen Ortiz', rol: 'Madre de una alumna de 17 años', seg: 'familia', ciudad: 'Madrid', prod: 'Grado Medio en Cuidados Auxiliares de Enfermería', orig: 'c2', canal: 'wa', etapa: 3, valor: 4200, creado: 2 * D, act: 25, toque: 40,
        f: { estudios: 'ESO', acceso: true, cerca: true }, s: { visitas: 3, plazas: true, precio: true, visita: true, urg: true, urgTxt: 'su hija está sin plaza en la pública y el curso ya ha empezado', resp: true },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Carmen, soy Sara, de admisiones. ¿El ciclo es para tu hija? ¿Tiene ya la ESO?'], [2 * D - 40, 'c', 'wa', 'Sí, la sacó en junio. Se quedó sin plaza en la pública.'], [D, 'a', 'wa', 'Con la ESO tiene acceso directo y aún quedan plazas de mañana. ¿Queréis venir a ver el aula de prácticas?'], [45, 'c', 'wa', 'Sí, cuanto antes, que el curso ya ha empezado. ¿Cuánto es al año y se puede pagar por meses?'], [40, 'a', 'wa', 'Sí, en mensualidades. ¿Os viene bien hoy a las 18:00 con Beatriz, la jefa de estudios?']],
        ev: [[25, 'web', 'Visita la página de precios y becas']] },
      { id: 'p02', n: 'Daniel Ruiz', rol: 'Terminó Bachillerato', seg: 'particular', ciudad: 'Leganés', prod: 'Grado Superior en Educación Infantil', orig: 'c1', canal: 'wa', etapa: 3, valor: 4600, creado: 26 * H, act: 17, toque: 20,
        f: { estudios: 'Bachillerato', acceso: true, trabaja: true }, s: { visitas: 3, plazas: true, practicas: true },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Daniel, soy Sara, de admisiones. ¿Buscas empezar Educación Infantil este curso?'], [25 * H, 'c', 'wa', 'Sí, trabajo de monitor de comedor y quiero sacarme el título.'], [60, 'a', 'wa', 'Genial, con Bachillerato tienes acceso directo. ¿Mañana o tarde?'], [17, 'c', 'wa', 'Tarde. ¿Quedan plazas? ¿Y las prácticas son en escuelas infantiles?']] },
      { id: 'p03', n: 'Rosa Medina', rol: 'Madre de un alumno de 16 años', seg: 'familia', ciudad: 'Madrid', prod: 'Grado Medio en Sistemas Microinformáticos y Redes', orig: 'c5', canal: 'wa', etapa: 4, valor: 4000, creado: 5 * D, act: 3 * H, toque: 20 * H,
        f: { estudios: 'ESO', acceso: true, cerca: true }, s: { cita: 22 * H, citaOk: false, visita: true, precio: true, financia: true, visitas: 2 },
        conv: [[5 * D, 'a', 'wa', 'Hola Rosa, soy Sara, de admisiones. ¿El ciclo es para tu hijo?'], [5 * D - 30, 'c', 'wa', 'Sí, terminó 4.º y no quiere hacer Bachillerato.'], [2 * D, 'a', 'wa', 'Os espero mañana a las 18:00 para ver el taller de informática. ¿Os va bien?'], [2 * D - 20, 'c', 'wa', 'Sí. ¿Se puede pagar por meses?'], [20 * H, 'a', 'wa', 'Sí, en mensualidades. Nos vemos mañana.']] },
      { id: 'p04', n: 'Irene Campos', rol: 'Estudiante de 2.º de Bachillerato', seg: 'particular', ciudad: 'Alcorcón', prod: 'Grado Superior en Estética Integral y Bienestar', orig: 'c3', canal: 'wa', etapa: 1, valor: 4000, creado: 12, act: 12, toque: null,
        f: { estudios: 'Bachillerato (en curso)' }, s: { visitas: 1 }, conv: [] },
      { id: 'p05', n: 'Javier Lozano', rol: 'Padre de una alumna de 16 años', seg: 'familia', ciudad: 'Madrid', prod: 'Grado Medio en Peluquería y Cosmética Capilar', orig: 'c3', canal: 'tel', etapa: 1, valor: 4000, creado: 34, act: 34, toque: null,
        f: { estudios: 'ESO', acceso: true, cerca: true }, s: { plazas: true }, conv: [] },
      { id: 'p06', n: 'Nadia El Amrani', rol: 'Trabaja en una tienda', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Cuidados Auxiliares de Enfermería', orig: 'c2', canal: 'wa', etapa: 2, valor: 4200, creado: 4 * D, act: 3 * D, toque: 3 * D,
        f: { estudios: 'ESO', acceso: true, trabaja: true }, s: { visitas: 2, precio: true },
        conv: [[4 * D, 'a', 'wa', 'Hola Nadia, soy Sara, de admisiones. ¿Buscas el ciclo para empezar este curso?'], [3 * D, 'c', 'wa', 'Sí, pero trabajo por las mañanas. ¿Cuánto cuesta?'], [3 * D - 5, 'a', 'wa', 'Hay turno de tarde. El precio depende de la modalidad: ¿te cuento las dos?']] },
      { id: 'p07', n: 'Marcos Gil', rol: 'Terminó Grado Medio de Gestión Administrativa', seg: 'particular', ciudad: 'Getafe', prod: 'Grado Superior en Administración y Finanzas', orig: 'c4', canal: 'wa', etapa: 3, valor: 4200, creado: 9 * D, act: 6 * D, toque: 6 * D,
        f: { estudios: 'Grado Medio', acceso: true }, s: { visitas: 2, plazas: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Marcos, ¿quieres seguir al Grado Superior este curso?'], [8 * D, 'c', 'wa', 'Sí, con el Grado Medio tengo acceso, ¿verdad?'], [6 * D, 'a', 'wa', 'Sí, acceso directo. Te paso horarios y lo vemos.'], [6 * D - 30, 'c', 'wa', 'Vale, lo hablo en casa.']] },
      { id: 'p08', n: 'Sofía Herrero', rol: 'Alumna', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Superior en Educación Infantil', orig: 'c6', canal: 'wa', etapa: 6, valor: 4600, creado: 40 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { estudios: 'Bachillerato', acceso: true }, s: { exp: true, expTxt: 'Su hermana ha pedido información del mismo ciclo para el curso que viene', visitas: 2 },
        conv: [[2 * D, 'c', 'wa', 'Hola Sara, mi hermana termina Bachillerato este año y también quiere hacer Infantil aquí. ¿Le podéis escribir?']] },
      { id: 'p09', n: 'Hugo Martín', rol: 'Terminó la ESO', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Sistemas Microinformáticos y Redes', orig: 'c5', canal: 'wa', etapa: 4, valor: 4000, creado: 11 * D, act: 3 * D, toque: 3 * D,
        f: { estudios: 'ESO', acceso: true, cerca: true }, s: { noshow: true, visita: true, visitas: 3 },
        conv: [[11 * D, 'a', 'wa', 'Hola Hugo, soy Sara, de admisiones. ¿Qué te gustaría hacer cuando termines el ciclo?'], [10 * D, 'c', 'wa', 'Trabajar montando redes o en soporte.'], [4 * D, 'a', 'wa', 'Te espero mañana a las 17:00 para ver el taller.']],
        ev: [[3 * D, 'sistema', 'No se presenta a la visita al centro']] },
      // --- Dijeron «el curso que viene»
      { id: 'p10', n: 'Marta Soler', rol: 'Estudiante de 4.º de ESO', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Peluquería y Cosmética Capilar', orig: 'c3', canal: 'wa', etapa: 3, valor: 4000, creado: 24 * D, act: 20 * D, toque: 20 * D,
        f: { estudios: 'ESO (en curso)' }, s: { luego: 'marzo', luegoTxt: 'se matricularía para septiembre; pide que le escriban cuando abra la reserva de plaza', practicas: true },
        conv: [[24 * D, 'a', 'wa', 'Hola Marta, ¿buscas empezar este curso?'], [20 * D, 'c', 'wa', 'No, todavía estoy en 4.º. Escribidme cuando se pueda reservar plaza para septiembre.']] },
      { id: 'p11', n: 'Elena Vidal', rol: 'Madre de una alumna de 4.º de ESO', seg: 'familia', ciudad: 'Pozuelo', prod: 'Grado Medio en Cuidados Auxiliares de Enfermería', orig: 'c2', canal: 'email', etapa: 3, valor: 4200, creado: 30 * D, act: 28 * D, toque: 28 * D,
        f: { estudios: 'ESO (en curso)', cerca: true }, s: { luego: 'febrero', luegoTxt: 'quiere venir a la jornada de puertas abiertas de febrero' },
        conv: [[30 * D, 'a', 'email', 'Hola Elena, te escribo por el ciclo de auxiliar de enfermería para tu hija.'], [28 * D, 'c', 'email', 'Gracias. Termina la ESO este año; nos gustaría venir a la jornada de puertas abiertas de febrero.']] },
      { id: 'p12', n: 'Álex Romero', rol: 'Estudiante de 2.º de Bachillerato', seg: 'particular', ciudad: 'Móstoles', prod: 'Grado Superior en Educación Infantil', orig: 'c1', canal: 'wa', etapa: 2, valor: 4600, creado: 15 * D, act: 13 * D, toque: 13 * D,
        f: { estudios: 'Bachillerato (en curso)' }, s: { luego: 'junio', luegoTxt: 'decidirá en junio, cuando sepa la nota de la EvAU' },
        conv: [[15 * D, 'a', 'wa', 'Hola Álex, ¿buscas Educación Infantil para este curso?'], [13 * D, 'c', 'wa', 'No, estoy en 2.º. Depende de la nota de la EvAU, decido en junio.']] },
      // --- Sin seguimiento después de contestar
      { id: 'p13', n: 'Laura Benítez', rol: 'Terminó Bachillerato', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Superior en Educación Infantil', orig: 'c1', canal: 'wa', etapa: 3, valor: 4600, creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: { estudios: 'Bachillerato', acceso: true, cerca: true }, s: { visitas: 2, plazas: true, visita: true },
        conv: [[8 * D, 'a', 'wa', 'Hola Laura, soy Sara, de admisiones. ¿Qué te llevó a mirar Educación Infantil?'], [7 * D, 'c', 'wa', 'Siempre he querido trabajar en una escuela infantil. ¿Puedo ir a ver el centro esta semana?'], [5 * D, 'h', 'wa', 'Te digo día en cuanto lo mire.']] },
      { id: 'p14', n: 'Antonio Vega', rol: 'Padre de un alumno de 17 años', seg: 'familia', ciudad: 'Madrid', prod: 'Grado Medio en Gestión Administrativa', orig: 'c4', canal: 'wa', etapa: 2, valor: 3800, creado: 10 * D, act: 7 * D, toque: 7 * D,
        f: { estudios: 'ESO', acceso: true, cerca: true }, s: { precio: true, plazas: true },
        conv: [[10 * D, 'a', 'wa', 'Hola Antonio, ¿el ciclo es para tu hijo?'], [9 * D, 'c', 'wa', 'Sí, repitió 1.º de Bachillerato y prefiere algo práctico. ¿Precio y si quedan plazas?'], [7 * D, 'h', 'wa', 'Lo miro y te digo.']] },
      { id: 'p15', n: 'Paula Serrano', rol: 'Trabaja en hostelería', seg: 'particular', ciudad: 'Fuenlabrada', prod: 'Grado Superior en Estética Integral y Bienestar', orig: 'c3', canal: 'wa', etapa: 3, valor: 4000, creado: 7 * D, act: 4 * D, toque: 4 * D,
        f: { estudios: 'Grado Medio', acceso: true, trabaja: true }, s: { visitas: 2, practicas: true },
        conv: [[7 * D, 'a', 'wa', 'Hola Paula, ¿buscas el ciclo para este curso?'], [6 * D, 'c', 'wa', 'Sí, tengo el Grado Medio de Estética y quiero el Superior.'], [4 * D, 'a', 'wa', 'Te envío el horario de tarde y las prácticas.']] },
      // --- Nuevos o en cadencia sin respuesta
      { id: 'p16', n: 'Nerea Castro', rol: 'Terminó la ESO', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Cuidados Auxiliares de Enfermería', orig: 'c2', canal: 'wa', etapa: 1, valor: 4200, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { estudios: 'ESO', acceso: true }, s: { intentos: 1 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Nerea, soy Sara, de admisiones. ¿Buscas empezar el ciclo este curso?']] },
      { id: 'p17', n: 'Kevin Muñoz', rol: 'Estudiante de 3.º de ESO', seg: 'particular', ciudad: 'Parla', prod: 'Grado Medio en Sistemas Microinformáticos y Redes', orig: 'c5', canal: 'wa', etapa: 1, valor: 4000, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { estudios: 'Sin ESO', sinAcceso: true }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Kevin, ¿has terminado ya la ESO?']] },
      { id: 'p18', n: 'Cristina León', rol: 'Madre de una alumna de 16 años', seg: 'familia', ciudad: 'Madrid', prod: 'Grado Medio en Peluquería y Cosmética Capilar', orig: 'c3', canal: 'email', etapa: 1, valor: 4000, creado: 4 * D, act: 30 * H, toque: 4 * D - 2,
        f: { estudios: 'ESO', acceso: true, cerca: true }, s: { visitas: 3, intentos: 2, emails: 2 },
        conv: [[4 * D - 2, 'a', 'email', 'Hola Cristina, te escribo por el ciclo de peluquería para tu hija.']] },
      { id: 'p19', n: 'Iván Torres', rol: 'Terminó Bachillerato', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Superior en Educación Infantil', orig: 'c1', canal: 'tel', etapa: 1, valor: 4600, creado: 5 * H, act: 5 * H, toque: 5 * H - 2,
        f: { estudios: 'Bachillerato', acceso: true }, s: { intentos: 1 },
        conv: [[5 * H - 2, 'a', 'wa', 'Hola Iván, soy Sara, de admisiones. ¿Te llamo en 5 minutos o prefieres por aquí?']] },
      { id: 'p20', n: 'Yolanda Prieto', rol: 'Madre de un alumno de 16 años', seg: 'familia', ciudad: 'Madrid', prod: 'Grado Medio en Sistemas Microinformáticos y Redes', orig: 'c5', canal: 'wa', etapa: 1, valor: 4000, creado: 55, act: 50, toque: null,
        f: { estudios: 'ESO', acceso: true }, s: { visitas: 2 }, conv: [] },
      { id: 'p21', n: 'Raúl Ibáñez', rol: 'Trabaja en un almacén', seg: 'particular', ciudad: 'Toledo', prod: 'Grado Medio en Cuidados Auxiliares de Enfermería', orig: 'c2', canal: 'wa', etapa: 1, valor: 4200, creado: 25 * D, act: 25 * D, toque: 18 * D,
        f: { estudios: 'ESO', lejos: true }, s: { intentos: 3 },
        conv: [[25 * D, 'a', 'wa', 'Hola Raúl, ¿buscas el ciclo para este curso?']] },
      { id: 'p22', n: 'Claudia Reyes', rol: 'Terminó la ESO', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Gestión Administrativa', orig: 'c4', canal: 'email', etapa: 1, valor: 3800, creado: 3 * H, act: 2 * H, toque: 3 * H - 1,
        f: { estudios: 'ESO', acceso: true }, s: { visitas: 2 },
        conv: [[3 * H - 1, 'a', 'email', 'Hola Claudia, te escribo por el Grado Medio en Gestión Administrativa.']] },
      // --- Visitas y cualificados en marcha
      { id: 'p23', n: 'Alba Moreno', rol: 'Terminó Bachillerato', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Superior en Educación Infantil', orig: 'c6', canal: 'wa', etapa: 4, valor: 4600, creado: 5 * D, act: 6 * H, toque: 6 * H,
        f: { estudios: 'Bachillerato', acceso: true, cerca: true }, s: { cita: 50 * H, citaOk: true, visita: true, visitas: 2 },
        conv: [[5 * D, 'a', 'wa', 'Hola Alba, ¿qué te gustaría hacer al terminar el ciclo?'], [5 * D - 60, 'c', 'wa', 'Trabajar en una escuela infantil.'], [6 * H, 'a', 'wa', 'Confirmada la visita del viernes a las 12:00.'], [6 * H - 10, 'c', 'wa', 'Perfecto, voy con mi madre.']] },
      { id: 'p24', n: 'Manuel Ortega', rol: 'Padre de un alumno de 16 años', seg: 'familia', ciudad: 'Madrid', prod: 'Grado Medio en Sistemas Microinformáticos y Redes', orig: 'c5', canal: 'wa', etapa: 3, valor: 4000, creado: 3 * D, act: 20 * H, toque: 20 * H,
        f: { estudios: 'ESO', acceso: true, cerca: true, turnoOk: true }, s: { visitas: 1, practicas: true },
        conv: [[3 * D, 'a', 'wa', 'Hola Manuel, ¿el ciclo es para tu hijo?'], [3 * D - 40, 'c', 'wa', 'Sí. Le interesa, pero quiero saber qué salidas tiene.'], [20 * H, 'a', 'wa', '¿Os viene bien venir a ver el taller esta semana y lo habláis con la jefa de estudios?']] },
      { id: 'p25', n: 'Sara Delgado', rol: 'Terminó Grado Medio de Peluquería', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Superior en Estética Integral y Bienestar', orig: 'c3', canal: 'wa', etapa: 4, valor: 4000, creado: 7 * D, act: 2 * H, toque: 2 * H,
        f: { estudios: 'Grado Medio', acceso: true }, s: { cita: 3 * D, citaOk: true, visita: true, visitas: 2 },
        conv: [[7 * D, 'a', 'wa', 'Hola Sara, ¿buscas seguir al Grado Superior este curso?'], [6 * D, 'c', 'wa', 'Sí, de tarde si puede ser.'], [2 * H, 'a', 'wa', 'Visita confirmada el lunes a las 17:30.']] },
      { id: 'p26', n: 'Adrián Cano', rol: 'Terminó la ESO', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Gestión Administrativa', orig: 'c4', canal: 'wa', etapa: 2, valor: 3800, creado: 2 * D, act: 30, toque: 90,
        f: { estudios: 'ESO', acceso: true }, s: { visitas: 1 },
        conv: [[2 * D, 'a', 'wa', 'Hola Adrián, ¿buscas el ciclo para este curso?'], [90, 'a', 'wa', '¿Te cuento cómo son las prácticas en empresa?'], [30, 'c', 'wa', 'Sí, ¿cuántas horas son al día?']] },
      // --- Encaje bajo o fuera
      { id: 'p27', n: 'Lorena Díaz', rol: 'Terminó la ESO', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Cuidados Auxiliares de Enfermería', orig: 'c2', canal: 'wa', etapa: 2, valor: 4200, creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { estudios: 'ESO', acceso: true, publica: true }, s: { ppto: 'no' },
        conv: [[6 * D, 'a', 'wa', 'Hola Lorena, ¿buscas el ciclo para este curso?'], [5 * D, 'c', 'wa', 'Pensaba que esto era el instituto público, buscaba algo gratis.']] },
      { id: 'p28', n: 'Pablo Navarro', rol: 'Estudiante de 2.º de ESO', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Sistemas Microinformáticos y Redes', orig: 'c5', canal: 'wa', etapa: 1, valor: 4000, creado: 9 * D, act: 9 * D, toque: 7 * D,
        f: { estudios: 'Sin ESO', sinAcceso: true }, s: { intentos: 3 },
        conv: [[9 * D, 'a', 'wa', 'Hola Pablo, ¿has terminado ya la ESO?']] },
      { id: 'p29', n: 'Valeria Ríos', rol: 'Vive fuera de España', seg: 'particular', ciudad: 'Bogotá', prod: 'Grado Superior en Educación Infantil', orig: 'c1', canal: 'wa', etapa: 2, valor: 4600, creado: 4 * D, act: 3 * D, toque: 3 * D,
        f: { estudios: 'Bachillerato (sin homologar)', lejos: true }, s: { precio: true },
        conv: [[4 * D, 'a', 'wa', 'Hola Valeria, ¿buscas empezar este curso?'], [3 * D, 'c', 'wa', 'Hola, estoy en Colombia, ¿se puede hacer online?']] },
      // --- Ya matriculados / alumnos
      { id: 'p30', n: 'Eva Marín', rol: 'Alumna', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Cuidados Auxiliares de Enfermería', orig: 'c2', canal: 'wa', etapa: 5, valor: 4200, creado: 20 * D, act: 2 * D, toque: 2 * D, fin: 'ganado', f: { estudios: 'ESO', acceso: true }, s: {}, conv: [] },
      { id: 'p31', n: 'Rubén Cortés', rol: 'Alumno', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Sistemas Microinformáticos y Redes', orig: 'c6', canal: 'wa', etapa: 5, valor: 4000, creado: 16 * D, act: 5 * D, toque: 5 * D, fin: 'ganado', f: { estudios: 'ESO', acceso: true }, s: {}, conv: [] },
      { id: 'p32', n: 'Teresa Gallego', rol: 'Madre de una alumna', seg: 'familia', ciudad: 'Madrid', prod: 'Grado Superior en Educación Infantil', orig: 'c1', canal: 'email', etapa: 6, valor: 4600, creado: 70 * D, act: 9 * D, toque: 9 * D, fin: 'ganado', f: { estudios: 'Bachillerato', acceso: true }, s: {}, conv: [] },
      { id: 'p33', n: 'Diego Salas', rol: 'Terminó la ESO', seg: 'particular', ciudad: 'Madrid', prod: 'Grado Medio en Peluquería y Cosmética Capilar', orig: 'c3', canal: 'wa', etapa: 1, valor: 4000, creado: 22 * D, act: 22 * D, toque: 15 * D, fin: 'perdido', f: { estudios: 'ESO', acceso: true }, s: { intentos: 3 }, conv: [] }
    ]
  };
})();

/* Sector: Academia de inglés y apoyo escolar (niños y adultos, muy estacional). 29-sep, para Academia Boston. Personas inventadas.
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };

  const Q = window.QV.voz;
  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.academia = {
    id: 'academia',
    nombre: 'Academia de inglés y apoyo escolar',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso',
      paginaVisitas: 'la web de la academia', cita: 'prueba de nivel', Cita: 'Prueba de nivel', laCita: 'la prueba de nivel',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'la academia', Comercial: 'Academia',
      cliente: 'alumno', unCliente: 'un alumno', convierten: 'se apuntan', objetivoPaso: 'agendar la prueba de nivel',
      casoExito: 'el testimonio de una familia de la academia', valorAlto: 900, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la matrícula', Producto: 'Curso', clientes: 'alumnos',
      propuestas: 'bonos familiares', verbo: 'apuntarse', clientesReales: 'matrículas de verdad', empleados: 'empleados',
      pasoHumano: 'resolver sus dudas de precio y fechas y cerrar la matrícula'
    },
    // Recorrido: Anuncio → Solicita información → Contactado → Cualificado → Entrevista → Matrícula → Alumno
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'info', txt: 'Solicita información' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'entrevista', txt: 'Prueba de nivel' },
      { id: 'matricula', txt: 'Matrícula' },
      { id: 'alumno', txt: 'Alumno', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 800,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, cualificado: 0.6, entrevista: 0.45, matricula: 0.42 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'interesados que piden información y nunca llegan a hablar con nadie' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      entrevista: { txt: 'Seguimiento', exp: 'familias que piden precio y a las que nadie vuelve a escribir' },
      matricula: { txt: 'Cierre y no-show', exp: 'pruebas de nivel que no terminan en matrícula' }
    },
    mesDatos: { respuestaAntes: 420, respuestaAhora: 1, agendadas: 12 },
    campanas: [
      { id: 'c1', canal: 'Google', nombre: 'Inglés para niños · búsqueda local', inversion: 380, ticket: 450,
        embudo: { anuncio: 2600, info: 7, contactado: 5, cualificado: 4, entrevista: 3, matricula: 2, alumno: 2 } },
      { id: 'c2', canal: 'Google', nombre: 'Inglés adultos y exámenes', inversion: 260, ticket: 1000,
        embudo: { anuncio: 1500, info: 4, contactado: 3, cualificado: 2, entrevista: 2, matricula: 1, alumno: 1 } },
      { id: 'c3', canal: 'Meta', nombre: 'Apoyo escolar · vuelta al cole', inversion: 360, ticket: 600,
        embudo: { anuncio: 9800, info: 6, contactado: 4, cualificado: 3, entrevista: 2, matricula: 1, alumno: 1 } },
      { id: 'c4', canal: 'Instagram', nombre: 'Mensajes directos de Instagram', inversion: 0, ticket: 800,
        embudo: { anuncio: 3200, info: 5, contactado: 2, cualificado: 2, entrevista: 1, matricula: 1, alumno: 1 } },
      { id: 'c6', canal: 'Web', nombre: 'Web y boca a boca', inversion: 0, ticket: 800,
        embudo: { anuncio: 700, info: 4, contactado: 4, cualificado: 3, entrevista: 2, matricula: 2, alumno: 2 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Interesados', cualificados: 'Interesados cualificados', entrevistas: 'Pruebas de nivel', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'entrevista' },

    reglas: {
      fitBase: 55,
      fit: [
        [function (c) { return /madre|padre|familia/i.test(c.rol || ''); }, 12, 'familia que busca clases para su hijo o hija'],
        [function (c) { return /adulto|examen|cambio|quiere ser|recién/i.test(c.rol || ''); }, 10, 'adulto con un objetivo concreto'],
        [function (c) { return c.valor >= 800; }, 8, 'curso completo'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca algo gratuito']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 14, 'preguntó por la próxima convocatoria'],
        [function (c) { return c.s.temario; }, 8, 'descargó el temario'],
        [function (c) { return c.s.financia; }, 10, 'preguntó por pago a plazos']
      ]
    },

    preguntas: [
      { q: '¿Qué alumnos tienen más probabilidad de matricularse?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Quién dijo que empezaría en la próxima convocatoria?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que lo retomarían más adelante. Ninguno es un no: el agente de reactivación les escribe en la fecha que ellos mismos dieron.'; },
        vista: 'tabla' },
      { q: '¿Qué interesados llevan demasiado tiempo sin seguimiento?', h: 'sinSeguimiento', obj: ['seguimiento', 'todo'] },
      { q: '¿Qué campaña está generando matrículas?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
    ],

    historias: {
      instagram: {
        titulo: 'Una madre escribe por Instagram un domingo por la noche',
        contacto: { id: 'demo', n: 'Ainhoa Ruiz', rol: 'Madre de alumno', seg: 'particular', ciudad: 'Vitoria-Gasteiz', prod: 'Inglés para niños (7-9 años)', orig: 'c4', canal: 'ig', etapa: 1, valor: 800, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 6, min: 0, txt: 'Domingo, 22:40: Ainhoa escribe por Instagram', feed: 'Mensaje nuevo por Instagram · fuera de horario', cambio: { conv: ['c', 'ig', 'Hola! Tenéis plazas de inglés para un niño de 8 años? Qué horarios hay?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente contesta en el minuto uno, con el tono de la academia', feed: 'Respuesta por Instagram en 45 segundos', cambio: { etapa: 2, conv: ['a', 'ig', '¡Hola Ainhoa! Sí, nos quedan plazas en el grupo de 7-9 años, lunes y miércoles a las 17:30 o martes y jueves a las 18:30. ¿Tu hijo ha dado inglés antes o empezaría desde cero?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Ainhoa contesta y pregunta el precio', feed: 'Respuesta recibida · pregunta precio', cambio: { s: { precio: true }, conv: ['c', 'ig', 'Ha dado en el cole pero va flojito. Cuánto cuesta?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente da el precio, propone la prueba de nivel y pasa a WhatsApp', feed: 'Propone prueba de nivel · pide WhatsApp', cambio: { etapa: 3, conv: ['a', 'ig', 'Depende del grupo en el que encaje, así que primero le hacemos una prueba de nivel cortita y con eso te digo el grupo y el precio exacto. ¿Me dejas un móvil y mañana te escribo por WhatsApp con las horas?'] }, toque: true },
          { dur: 6, min: 2, txt: 'Deja su móvil: la conversación sigue por WhatsApp', feed: 'Contacto completado · pasa a WhatsApp', cambio: { canal: 'wa', conv: ['c', 'ig', 'Sí, 6XX XXX XXX. Gracias!'] }, act: true },
          { dur: 7, min: 600, txt: 'Lunes, 9:00: WhatsApp con dos horas para la prueba', feed: 'WhatsApp enviado en horario de oficina', cambio: { conv: ['a', 'wa', 'Buenos días Ainhoa, soy Izaskun, de la academia. Para la prueba de nivel de tu hijo tengo el martes a las 17:00 o el miércoles a las 18:00. ¿Qué os va mejor?'] }, toque: true },
          { dur: 7, min: 20, txt: 'Ainhoa elige hora y queda la prueba de nivel', feed: 'Prueba de nivel agendada · martes 17:00', cambio: { etapa: 4, s: { cita: 1800, citaOk: true }, conv: ['c', 'wa', 'El martes a las 17:00 perfecto.'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso a la academia: familia lista para la prueba', feed: 'Aviso enviado a la academia', humano: { titulo: 'Ainhoa trae a su hijo a la prueba de nivel', texto: 'Niño de 8 años, ha dado inglés en el cole pero va flojo · grupo 7-9 años · le encaja lunes y miércoles o martes y jueves · prueba el martes a las 17:00. Escribió por Instagram un domingo a las 22:40.' } }
        ]
      }
    },
    historiaDefecto: 'instagram',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'f04', n: 'Sergio Blanco', rol: 'Padre de alumno', seg: 'particular', ciudad: 'Valencia', prod: 'Apoyo escolar · vuelta al cole', orig: 'c4', canal: 'wa', etapa: 1, valor: 800, creado: 12, act: 12, toque: null,
        f: { exp: 4 }, s: { visitas: 1 }, conv: [] },
      { id: 'f17', n: 'Beatriz Lozano', rol: 'Adulto que quiere mejorar su inglés', seg: 'particular', ciudad: 'Zaragoza', prod: 'Inglés adultos y exámenes', orig: 'c5', canal: 'wa', etapa: 3, valor: 800, creado: 7 * D, act: 4 * D, toque: 4 * D,
        f: { exp: 4 }, s: { visitas: 2, emails: 3 },
        conv: [[7 * D, 'a', 'wa', 'Hola Beatriz, ¿buscas la certificación para este año?'], [6 * D, 'c', 'wa', 'Sí, antes de marzo si puede ser.'], [4 * D, 'a', 'wa', 'Te envío el calendario de las próximas fechas.']] },
      { id: 'f20', n: 'Óscar Delgado', rol: 'Madre de alumna', seg: 'particular', ciudad: 'Granada', prod: 'Apoyo escolar · vuelta al cole', orig: 'c4', canal: 'wa', etapa: 1, valor: 800, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { estudiante: true, gratis: true }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Óscar, ¿el curso es para tu trabajo actual?']] },
      { id: 'f22', n: 'Pablo Reyes', rol: 'Adulto que prepara un examen', seg: 'particular', ciudad: 'Vigo', prod: 'Inglés adultos y exámenes', orig: 'c5', canal: 'ig', etapa: 1, valor: 800, creado: 5 * H, act: 5 * H, toque: 5 * H - 2,
        f: { exp: 3 }, s: { intentos: 1 },
        conv: [[5 * H - 2, 'a', 'wa', 'Hola Pablo, soy Lucía, de admisiones. ¿Te llamo en 5 minutos o prefieres por aquí?']] },
      { id: 'f25', n: 'Rocío Aguilar', rol: 'Madre de alumno', seg: 'particular', ciudad: 'Córdoba', prod: 'Apoyo escolar · vuelta al cole', orig: 'c4', canal: 'wa', etapa: 1, valor: 800, creado: 18 * D, act: 18 * D, toque: 12 * D, f: { exp: 1, gratis: true }, s: { intentos: 3 },
        conv: [[18 * D, 'a', 'wa', 'Hola Rocío, ¿el curso lo quieres para tu puesto actual?']] },
      { id: 'f32', n: 'Gonzalo Peña', rol: 'Padre de alumno', seg: 'particular', ciudad: 'Huelva', prod: 'Apoyo escolar · vuelta al cole', orig: 'c4', canal: 'wa', etapa: 2, valor: 800, creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { exp: 1, gratis: true }, s: { ppto: 'no' },
        conv: [[6 * D, 'a', 'wa', 'Hola Gonzalo, ¿el curso lo quieres para tu negocio?'], [5 * D, 'c', 'wa', 'Buscaba algo gratuito, la verdad.']] },
      { id: 'f33', n: 'Clara Benítez', rol: 'Adulto que quiere mejorar su inglés', seg: 'particular', ciudad: 'León', prod: 'Inglés adultos y exámenes', orig: 'c5', canal: 'email', etapa: 1, valor: 800, creado: 9 * D, act: 9 * D, toque: 7 * D, f: { estudiante: true }, s: { intentos: 3 },
        conv: [[9 * D, 'a', 'email', 'Hola Clara, te escribo por la certificación.']] },
      // --- Ya matriculados / alumnos
      { id: 'f36', n: 'Ramón Cortés', rol: 'Madre de alumna', seg: 'particular', ciudad: 'Tarragona', prod: 'Inglés adultos y exámenes', orig: 'c5', canal: 'wa', etapa: 5, valor: 800, creado: 16 * D, act: 5 * D, toque: 5 * D, fin: 'ganado', f: { exp: 10 }, s: {}, conv: [] },
      { id: 'f40', n: 'Luis Román', rol: 'Adulto que prepara un examen', seg: 'particular', ciudad: 'Albacete', prod: 'Apoyo escolar · vuelta al cole', orig: 'c4', canal: 'wa', etapa: 1, valor: 800, creado: 12 * D, act: 12 * D, toque: 8 * D, f: { exp: 2 }, s: { intentos: 3 },
        conv: [[12 * D, 'a', 'wa', 'Hola Luis, ¿el curso es para tu trabajo actual?']] }
    ]
  };
})();

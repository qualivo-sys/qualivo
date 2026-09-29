/* Sector: Escuela de música (clases para niños y adultos). Derivado del de formación el 29-sep.
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };

  const Q = window.QV.voz;
  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.musica = {
    id: 'musica',
    nombre: 'Escuela de música',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso',
      paginaVisitas: 'la página de las clases', cita: 'clase de prueba', Cita: 'Clase de prueba', laCita: 'la clase de prueba',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'la coordinadora de la escuela', Comercial: 'Coordinadora',
      cliente: 'alumno', unCliente: 'un alumno', convierten: 'se apuntan', objetivoPaso: 'agendar la clase de prueba',
      casoExito: 'el testimonio de una familia de la escuela', valorAlto: 900, oportunidades: 'interesados',
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
      { id: 'entrevista', txt: 'Clase de prueba' },
      { id: 'matricula', txt: 'Matrícula' },
      { id: 'alumno', txt: 'Alumno', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 560,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, cualificado: 0.6, entrevista: 0.45, matricula: 0.42 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'interesados que piden información y nunca llegan a hablar con nadie' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      entrevista: { txt: 'Seguimiento', exp: 'familias que piden precio y a las que nadie vuelve a escribir' },
      matricula: { txt: 'Cierre y no-show', exp: 'clases de prueba que no terminan en inscripción' }
    },
    mesDatos: { respuestaAntes: 300, respuestaAhora: 2, agendadas: 24 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Clases de guitarra (niños y adultos)', inversion: 220, ticket: 560,
        embudo: { anuncio: 5200, info: 34, contactado: 22, cualificado: 16, entrevista: 9, matricula: 5, alumno: 5 } },
      { id: 'c2', canal: 'Google', nombre: 'Clases de piano', inversion: 150, ticket: 620,
        embudo: { anuncio: 1300, info: 18, contactado: 12, cualificado: 9, entrevista: 5, matricula: 3, alumno: 3 } },
      { id: 'c3', canal: 'Meta', nombre: 'Canto y técnica vocal', inversion: 120, ticket: 580,
        embudo: { anuncio: 3100, info: 15, contactado: 9, cualificado: 6, entrevista: 3, matricula: 2, alumno: 2 } },
      { id: 'c4', canal: 'Meta', nombre: 'Música para peques (3-6 años)', inversion: 160, ticket: 450,
        embudo: { anuncio: 4400, info: 26, contactado: 15, cualificado: 11, entrevista: 6, matricula: 3, alumno: 3 } },
      { id: 'c5', canal: 'Meta', nombre: 'Batería', inversion: 90, ticket: 560,
        embudo: { anuncio: 2100, info: 9, contactado: 6, cualificado: 4, entrevista: 2, matricula: 1, alumno: 1 } },
      { id: 'c6', canal: 'Web', nombre: 'Web y boca a boca', inversion: 0, ticket: 560,
        embudo: { anuncio: 900, info: 14, contactado: 12, cualificado: 10, entrevista: 7, matricula: 5, alumno: 5 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Interesados', cualificados: 'Interesados cualificados', entrevistas: 'Clases de prueba', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'entrevista' },

    reglas: {
      fitBase: 22,
      fit: [
        [function (c) { return c.seg === 'empresa' && c.tam >= 50; }, 30, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 50 empleados o más'],
        [function (c) { return c.seg === 'empresa' && c.tam >= 10 && c.tam < 50; }, 16, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 10 a 49 empleados'],
        [function (c) { return c.seg === 'empresa' && tieneRol(c, /forma|rrhh|personas|talento|people|director|gerente|ceo/i); }, 14, function (c) { return 'decide la formación (' + c.rol + ')'; }, 'Su puesto decide la formación'],
        [function (c) { return c.seg === 'particular' && (c.f && c.f.exp >= 3); }, 22, function (c) { return c.f.exp + ' años de experiencia en el área'; }, 'Particular con 3 años o más en el área'],
        [function (c) { return c.seg === 'particular' && (c.f && c.f.exp > 0 && c.f.exp < 3); }, 10, function (c) { return 'perfil junior en el área'; }],
        [function (c) { return c.f && c.f.empresaPaga; }, 14, 'su empresa le paga la formación'],
        [function (c) { return c.valor >= 3000; }, 8, 'programa de ticket alto'],
        [function (c) { return c.f && c.f.estudiante; }, -14, 'todavía estudiando, sin experiencia'],
        [function (c) { return c.f && c.f.fuera; }, -26, 'fuera de España, sin bonificación posible'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca formación gratuita']
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
      familia: {
        titulo: 'Una madre pide precio de clases de guitarra para su hijo',
        contacto: { id: 'demo', n: 'Laura Gil', rol: 'Madre de alumno', seg: 'particular', ciudad: '—', prod: 'Clases de guitarra (niños y adultos)', orig: 'c1', canal: 'wa', etapa: 1, valor: 560, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde un anuncio de Instagram', feed: 'Nueva solicitud · Clases de guitarra', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 52 segundos', cambio: { conv: ['a', 'wa', 'Hola Laura, soy Sara, de la escuela. Te escribo por las clases de guitarra. ¿Son para ti o para alguien de casa? Y si es para un peque, ¿qué edad tiene?'] }, toque: true },
          { dur: 7, min: 6, txt: 'Laura contesta y pregunta el precio', feed: 'Respuesta recibida · pregunta precio y horario', cambio: { etapa: 2, s: { precio: true }, conv: ['c', 'wa', 'Para mi hijo, tiene 9 años y nunca ha tocado. ¿Cuánto cuesta y qué horarios tenéis por la tarde?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente responde con precio y horarios, y propone la clase de prueba', feed: 'Precio y horarios enviados · propone clase de prueba', cambio: { etapa: 3, conv: ['a', 'wa', 'Son 60 € al mes, una clase a la semana de una hora, en grupos de 4 niños de su edad. Por la tarde tenemos martes y jueves a las 17:30. La primera clase es de prueba y gratis: ¿os viene bien el jueves?'] }, toque: true },
          { dur: 6, min: 30, txt: 'Laura no contesta: se ha enfriado', feed: 'Sin respuesta en 24 h · el seguimiento se activa', cambio: { s: { intentos: 1 } } },
          { dur: 7, min: 1, txt: 'El seguimiento la recupera al día siguiente', feed: 'Seguimiento del día 1 enviado', cambio: { conv: ['a', 'wa', 'Laura, ayer te dejé los horarios de guitarra. Si el jueves no os cuadra, el martes a las 17:30 también hay plaza en el grupo de 9 años. ¿Os lo reservo?'] }, toque: true },
          { dur: 7, min: 4, txt: 'Laura contesta y reserva la clase de prueba', feed: 'Respuesta recibida · reserva el martes', cambio: { etapa: 4, s: { cita: 2880, citaOk: true, urg: true, urgTxt: 'quiere empezar ya este trimestre' }, conv: ['c', 'wa', 'Perdona, se me pasó. Mejor el martes. ¿Hay que traer guitarra?'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente confirma y resuelve la duda', feed: 'Clase de prueba agendada · martes 17:30', cambio: { conv: ['a', 'wa', 'Reservado: martes a las 17:30. Para la de prueba no hace falta, tenemos guitarras en la escuela. Os mando un recordatorio el lunes.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: una familia viene a la clase de prueba', feed: 'Aviso enviado a la coordinadora', humano: { titulo: 'Laura trae a su hijo a la clase de prueba', texto: 'Hijo de 9 años, sin experiencia · guitarra · le va bien por la tarde · martes a las 17:30. Recuperada por el seguimiento del día 1.' } }
        ]
      }
    },
    historiaDefecto: 'familia',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'f04', n: 'Sergio Blanco', rol: 'Padre de alumno', seg: 'particular', ciudad: 'Valencia', prod: 'Clases de piano', orig: 'c4', canal: 'wa', etapa: 1, valor: 620, creado: 12, act: 12, toque: null,
        f: { exp: 4 }, s: { visitas: 1 }, conv: [] },
      { id: 'f17', n: 'Beatriz Lozano', rol: 'Adulto que quiere aprender', seg: 'particular', ciudad: 'Zaragoza', prod: 'Canto y técnica vocal', orig: 'c5', canal: 'wa', etapa: 3, valor: 580, creado: 7 * D, act: 4 * D, toque: 4 * D,
        f: { exp: 4 }, s: { visitas: 2, emails: 3 },
        conv: [[7 * D, 'a', 'wa', 'Hola Beatriz, ¿buscas la certificación para este año?'], [6 * D, 'c', 'wa', 'Sí, antes de marzo si puede ser.'], [4 * D, 'a', 'wa', 'Te envío el calendario de las próximas fechas.']] },
      { id: 'f20', n: 'Óscar Delgado', rol: 'Madre de alumna', seg: 'particular', ciudad: 'Granada', prod: 'Clases de piano', orig: 'c4', canal: 'wa', etapa: 1, valor: 450, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { estudiante: true, gratis: true }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Óscar, ¿el curso es para tu trabajo actual?']] },
      { id: 'f22', n: 'Pablo Reyes', rol: 'Quiere retomar el instrumento', seg: 'particular', ciudad: 'Vigo', prod: 'Canto y técnica vocal', orig: 'c5', canal: 'tel', etapa: 1, valor: 560, creado: 5 * H, act: 5 * H, toque: 5 * H - 2,
        f: { exp: 3 }, s: { intentos: 1 },
        conv: [[5 * H - 2, 'a', 'wa', 'Hola Pablo, soy Lucía, de admisiones. ¿Te llamo en 5 minutos o prefieres por aquí?']] },
      { id: 'f25', n: 'Rocío Aguilar', rol: 'Madre de alumno', seg: 'particular', ciudad: 'Córdoba', prod: 'Clases de piano', orig: 'c4', canal: 'wa', etapa: 1, valor: 560, creado: 18 * D, act: 18 * D, toque: 12 * D, f: { exp: 1, gratis: true }, s: { intentos: 3 },
        conv: [[18 * D, 'a', 'wa', 'Hola Rocío, ¿el curso lo quieres para tu puesto actual?']] },
      { id: 'f32', n: 'Gonzalo Peña', rol: 'Padre de alumno', seg: 'particular', ciudad: 'Huelva', prod: 'Clases de piano', orig: 'c4', canal: 'wa', etapa: 2, valor: 620, creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { exp: 1, gratis: true }, s: { ppto: 'no' },
        conv: [[6 * D, 'a', 'wa', 'Hola Gonzalo, ¿el curso lo quieres para tu negocio?'], [5 * D, 'c', 'wa', 'Buscaba algo gratuito, la verdad.']] },
      { id: 'f33', n: 'Clara Benítez', rol: 'Adulto que quiere aprender', seg: 'particular', ciudad: 'León', prod: 'Canto y técnica vocal', orig: 'c5', canal: 'email', etapa: 1, valor: 580, creado: 9 * D, act: 9 * D, toque: 7 * D, f: { estudiante: true }, s: { intentos: 3 },
        conv: [[9 * D, 'a', 'email', 'Hola Clara, te escribo por la certificación.']] },
      // --- Ya matriculados / alumnos
      { id: 'f36', n: 'Ramón Cortés', rol: 'Madre de alumna', seg: 'particular', ciudad: 'Tarragona', prod: 'Canto y técnica vocal', orig: 'c5', canal: 'wa', etapa: 5, valor: 450, creado: 16 * D, act: 5 * D, toque: 5 * D, fin: 'ganado', f: { exp: 10 }, s: {}, conv: [] },
      { id: 'f40', n: 'Luis Román', rol: 'Quiere retomar el instrumento', seg: 'particular', ciudad: 'Albacete', prod: 'Clases de piano', orig: 'c4', canal: 'wa', etapa: 1, valor: 560, creado: 12 * D, act: 12 * D, toque: 8 * D, f: { exp: 2 }, s: { intentos: 3 },
        conv: [[12 * D, 'a', 'wa', 'Hola Luis, ¿el curso es para tu trabajo actual?']] }
    ]
  };
})();

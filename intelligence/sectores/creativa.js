/* Sector: Escuela creativa (programas anuales de dirección de arte, copy, contenido y eventos). Derivado de aviacion.js el 30-oct para la demo de una escuela creativa; volúmenes de ejemplo.
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };

  const Q = window.QV.voz;
  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.creativa = {
    id: 'creativa',
    nombre: 'Escuela creativa',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso',
      paginaVisitas: 'la página del curso', cita: 'reunión informativa', Cita: 'Reunión informativa', laCita: 'la reunión informativa',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'el equipo de admisiones', Comercial: 'Admisiones',
      cliente: 'alumno', unCliente: 'un alumno', convierten: 'se matriculan', objetivoPaso: 'reservar la reunión informativa',
      casoExito: 'el book de un antiguo alumno que ya trabaja en agencia', valorAlto: 5000, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'la matrícula', Producto: 'Curso', clientes: 'alumnos',
      propuestas: 'plazas reservadas', verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'empleados',
      pasoHumano: 'resolver sus dudas de precio y fechas y cerrar la matrícula'
    },
    // Recorrido: Anuncio → Solicita información → Contactado → Cualificado → Entrevista → Matrícula → Alumno
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'info', txt: 'Solicita información' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'entrevista', txt: 'Reunión informativa' },
      { id: 'matricula', txt: 'Matrícula' },
      { id: 'alumno', txt: 'Alumno', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 6000,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, cualificado: 0.6, entrevista: 0.45, matricula: 0.42 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'interesados que piden información y nunca llegan a hablar con nadie' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      entrevista: { txt: 'Seguimiento', exp: 'interesados que piden información y no llegan a la reunión informativa' },
      matricula: { txt: 'Cierre y no-show', exp: 'reuniones y entrevistas que no terminan en matrícula: «me lo pienso» y transferencias sin hacer' }
    },
    mesDatos: { respuestaAntes: 960, respuestaAhora: 2, agendadas: 36 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Programa Events & Experiences · vídeo', inversion: 1800, ticket: 6000,
        embudo: { anuncio: 61000, info: 22, contactado: 15, cualificado: 10, entrevista: 7, matricula: 2, alumno: 2 } },
      { id: 'c2', canal: 'Meta', nombre: 'Programa Art Direction · vídeo', inversion: 1000, ticket: 6000,
        embudo: { anuncio: 34000, info: 14, contactado: 11, cualificado: 8, entrevista: 6, matricula: 2, alumno: 2 } },
      { id: 'c3', canal: 'Meta', nombre: 'Programa Copywriting · vídeo', inversion: 900, ticket: 6000,
        embudo: { anuncio: 30000, info: 11, contactado: 8, cualificado: 6, entrevista: 5, matricula: 1, alumno: 1 } },
      { id: 'c4', canal: 'Meta', nombre: 'Programa Creative Content · vídeo', inversion: 500, ticket: 6000,
        embudo: { anuncio: 17000, info: 7, contactado: 5, cualificado: 4, entrevista: 3, matricula: 1, alumno: 1 } },
      { id: 'c5', canal: 'Meta', nombre: 'Cursos de IA generativa', inversion: 700, ticket: 1500,
        embudo: { anuncio: 26000, info: 16, contactado: 10, cualificado: 5, entrevista: 3, matricula: 1, alumno: 1 } },
      { id: 'c6', canal: 'Meta', nombre: 'Audience Network (todas las campañas)', inversion: 500, ticket: 6000,
        embudo: { anuncio: 90000, info: 10, contactado: 4, cualificado: 1, entrevista: 1, matricula: 0, alumno: 0 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv'],
    kpiNombres: { interesados: 'Interesados', cualificados: 'Interesados cualificados', entrevistas: 'Reuniones informativas', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'entrevista' },

    reglas: {
      fitBase: 55,
      fit: [
        [function (c) { return /marketing|creativ|diseñ/i.test(c.rol || ''); }, 12, 'ya trabaja cerca del sector creativo'],
        [function (c) { return /adulto|examen|cambio|quiere ser|recién/i.test(c.rol || ''); }, 10, 'adulto con un objetivo concreto'],
        [function (c) { return c.valor >= 3000; }, 8, 'programa anual'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca algo gratuito']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 14, 'quiere empezar en la próxima convocatoria (enero)'],
        [function (c) { return c.s.temario; }, 8, 'descargó el folleto'],
        [function (c) { return c.s.financia; }, 10, 'preguntó por financiación o becas']
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
      art: {
        titulo: 'Laura pide información de Art Direction a las 21:12 y reserva la reunión informativa sin esperar al día siguiente',
        contacto: { id: 'demo', n: 'Laura Puig', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'wa', etapa: 1, valor: 6000, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud desde el vídeo de Art Direction en Instagram, a las 21:12', feed: 'Nueva solicitud · Programa Art Direction', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 38 segundos', cambio: { conv: ['a', 'wa', 'Hola Laura, soy Nora, de admisiones. Hemos recibido tu solicitud de Art Direction. ¿Te lo planteas para enero, marzo o más adelante?'] }, toque: true },
          { dur: 6, min: 3, txt: 'Laura contesta: enero, trabaja en marketing y le cuadra el horario de 17 a 21 h', feed: 'Respuesta: enero · horario compatible', cambio: { conv: ['c', 'wa', 'Enero. Trabajo en marketing y salgo a las 16:00, así que el horario me cuadra.'], s: { conv: true } }, act: true },
          { dur: 6, min: 2, txt: 'Pregunta por becas y financiación; mira la página del plan de financiación', feed: 'Visita: Plan de financiación · Becas 2026/27', cambio: { s: { financia: true, visitas: 3 } }, act: true },
          { dur: 7, min: 1, txt: 'Reserva la reunión informativa en el mismo chat', feed: 'Reunión informativa reservada · ' + Q.hueco(18).txt + ' 18:00', vista: 'agenda', toque: true,
            cambio: { etapa: 4, conv: ['a', 'wa', 'Hecho, Laura: reunión informativa con Carla, de admisiones, el ' + Q.hueco(18).txt + ' a las 18:00. Te aviso la víspera y una hora antes.'], s: { cita: Q.hueco(18).min, citaOk: true, urg: true, urgTxt: 'quiere empezar en enero' } } },
          { dur: 0, min: 1, txt: 'Aviso a admisiones con la ficha', feed: 'Aviso enviado a admisiones', humano: { titulo: 'Laura viene a la reunión informativa', texto: '27 años · trabaja en marketing · Art Direction · enero · horario compatible · financiación y pregunta por becas. Reunión el ' + Q.hueco(18).txt + ' a las 18:00, reservada en el chat.' } }
        ]
      }
    },
    historiaDefecto: 'art',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'b01', n: 'Marc Soler', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'wa', etapa: 1, valor: 6000, creado: 40, act: 40, toque: null,
        f: { exp: 4 }, s: { visitas: 2, conv: true }, conv: [] },
      { id: 'b02', n: 'Júlia Ferrer', rol: 'Cambio de profesión', seg: 'particular', ciudad: 'Sabadell', prod: 'Programa Copywriting · vídeo', orig: 'c3', canal: 'wa', etapa: 4, valor: 6000, creado: 6 * D, act: 2 * D, toque: 2 * D,
        f: { exp: 4 }, s: { visitas: 3, financia: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Júlia, ¿te lo planteas para enero o más adelante?'], [6 * D - 30, 'c', 'wa', 'Enero, quiero dejar la consultora.'], [2 * D, 'a', 'wa', 'Te confirmo la reunión informativa el jueves a las 18:00.']] },
      { id: 'b03', n: 'Pau Martí', rol: 'Organiza eventos', seg: 'particular', ciudad: 'Girona', prod: 'Programa Events & Experiences · vídeo', orig: 'c1', canal: 'wa', etapa: 5, valor: 6000, creado: 14 * D, act: 4 * D, toque: 4 * D,
        f: { exp: 4 }, s: { visitas: 4, financia: true },
        conv: [[5 * D, 'c', 'wa', 'Me ha encantado la entrevista. Me lo pienso y os digo.'], [4 * D, 'a', 'wa', 'Genial, Pau. ¿Te mando el plan de financiación para que lo veas con calma?']] },
      { id: 'b04', n: 'Clara Vidal', rol: 'Estudiante de diseño', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Creative Content · vídeo', orig: 'c4', canal: 'wa', etapa: 2, valor: 6000, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { exp: 2, estudiante: true }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Clara, ¿te lo planteas para enero o para octubre?']] },
      { id: 'b05', n: 'Sergi Roca', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Terrassa', prod: 'Programa Copywriting · vídeo', orig: 'c3', canal: 'tel', etapa: 4, valor: 6000, creado: 2 * D, act: D, toque: D,
        f: { exp: 4 }, s: { financia: true }, conv: [] },
      { id: 'b06', n: 'Nuria Pons', rol: 'Cambio de profesión', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Events & Experiences · vídeo', orig: 'c1', canal: 'wa', etapa: 1, valor: 6000, creado: 9 * D, act: 9 * D, toque: 7 * D, f: { exp: 2 }, s: { intentos: 3, luego: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Nuria, ¿para qué convocatoria lo miras?'], [9 * D - 50, 'c', 'wa', 'Para octubre del año que viene, este año no puedo.']] },
      { id: 'b07', n: 'Àlex Serra', rol: 'Busca algo gratuito', seg: 'particular', ciudad: 'Lleida', prod: 'Cursos de IA generativa', orig: 'c5', canal: 'wa', etapa: 2, valor: 1500, creado: 5 * D, act: 5 * D, toque: 5 * D,
        f: { exp: 1, gratis: true }, s: { ppto: 'no' },
        conv: [[5 * D, 'c', 'wa', 'Pensaba que el workshop era gratis.']] },
      { id: 'b08', n: 'Irene Gil', rol: 'Recién graduada', seg: 'particular', ciudad: 'Valencia', prod: 'Audience Network (todas las campañas)', orig: 'c6', canal: 'email', etapa: 1, valor: 6000, creado: 11 * D, act: 11 * D, toque: 9 * D, f: { exp: 1 }, s: { intentos: 3 },
        conv: [[11 * D, 'a', 'email', 'Hola Irene, gracias por tu solicitud.']] },
      { id: 'b09', n: 'David Mas', rol: 'Trabaja en una agencia', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'wa', etapa: 5, valor: 6000, creado: 20 * D, act: 6 * D, toque: 6 * D, f: { exp: 4 }, s: { financia: true },
        conv: [[6 * D, 'a', 'wa', 'David, ¡estás admitido! Aquí tienes el enlace de matrícula.']] },
      // --- Ya matriculados
      { id: 'b10', n: 'Laia Costa', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'wa', etapa: 5, valor: 6000, creado: 25 * D, act: 8 * D, toque: 8 * D, fin: 'ganado', f: { exp: 4 }, s: {}, conv: [] },
      { id: 'b11', n: 'Jordi Puig', rol: 'Organiza eventos', seg: 'particular', ciudad: 'Badalona', prod: 'Programa Events & Experiences · vídeo', orig: 'c1', canal: 'wa', etapa: 5, valor: 6000, creado: 28 * D, act: 10 * D, toque: 10 * D, fin: 'ganado', f: { exp: 4 }, s: {}, conv: [] }
    ]
  };
})();

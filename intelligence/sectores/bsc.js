/* Sector: Barcelona School of Creativity, versión sin agentes (30-oct). Lo pidió Anna en la reunión: nada de conversaciones automáticas con los leads;
 * el sistema puntúa, ordena y avisa, y llama siempre una persona. Ticket y techo de alumnos según lo que contó (≈12.000 €, ≤40 alumnos/año); el resto, de ejemplo.
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };

  const Q = window.QV.voz;
  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.bsc = {
    id: 'bsc',
    nombre: 'Barcelona School of Creativity',
    sinAgentes: true,
    persona: 'Anna',
    vozAuto: false,
    vistasOcultas: ['agentes'],
    remedioFuga: { contactado: 'Llamar el mismo día a quien entra, empezando por los de más encaje. La lista de la mañana ya viene ordenada.', cualificado: 'En la primera llamada, cuatro preguntas: programa, convocatoria, horario y cómo lo pagaría.', entrevista: 'Proponer la entrevista en la misma llamada y recordarla la víspera.', matricula: 'Llamar a quien dijo «me lo pienso» en la fecha que dio, con su ficha delante.' },
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso',
      paginaVisitas: 'la página del curso', cita: 'entrevista', Cita: 'Entrevista', laCita: 'la entrevista',
      propuesta: 'la matrícula', Propuesta: 'Matrícula', comercial: 'Anna', Comercial: 'Anna',
      cliente: 'alumno', unCliente: 'un alumno', convierten: 'se matriculan', objetivoPaso: 'cerrar la entrevista',
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
      { id: 'entrevista', txt: 'Entrevista' },
      { id: 'matricula', txt: 'Matrícula' },
      { id: 'alumno', txt: 'Alumno', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 12000,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, cualificado: 0.6, entrevista: 0.45, matricula: 0.42 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'interesados que piden información y nunca llegan a hablar con nadie' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      entrevista: { txt: 'Seguimiento', exp: 'interesados que hablan con vosotros y no llegan a la entrevista' },
      matricula: { txt: 'Cierre', exp: 'entrevistas que no terminan en matrícula: «me lo pienso», y matrículas que llegan meses después' }
    },
    mesDatos: { respuestaAntes: 1560, respuestaTxt: 'Objetivo: el mismo día', agendadas: 22 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Programa Events & Experiences · vídeo', inversion: 1800, ticket: 12000,
        embudo: { anuncio: 61000, info: 22, contactado: 14, cualificado: 9, entrevista: 5, matricula: 1, alumno: 1 } },
      { id: 'c2', canal: 'Meta', nombre: 'Programa Art Direction · vídeo', inversion: 1000, ticket: 12000,
        embudo: { anuncio: 34000, info: 14, contactado: 11, cualificado: 8, entrevista: 5, matricula: 1, alumno: 1 } },
      { id: 'c3', canal: 'Meta', nombre: 'Programa Copywriting · vídeo', inversion: 900, ticket: 12000,
        embudo: { anuncio: 30000, info: 11, contactado: 8, cualificado: 6, entrevista: 4, matricula: 1, alumno: 1 } },
      { id: 'c4', canal: 'Meta', nombre: 'Programa Creative Content · vídeo', inversion: 500, ticket: 12000,
        embudo: { anuncio: 17000, info: 7, contactado: 5, cualificado: 4, entrevista: 2, matricula: 0, alumno: 0 } },
      { id: 'c5', canal: 'Meta', nombre: 'Cursos de IA generativa', inversion: 700, ticket: 1500,
        embudo: { anuncio: 26000, info: 16, contactado: 9, cualificado: 4, entrevista: 2, matricula: 1, alumno: 1 } },
      { id: 'c6', canal: 'Meta', nombre: 'Audience Network (todas las campañas)', inversion: 500, ticket: 12000,
        embudo: { anuncio: 90000, info: 10, contactado: 3, cualificado: 1, entrevista: 0, matricula: 0, alumno: 0 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Interesados', cualificados: 'Interesados cualificados', entrevistas: 'Entrevistas', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
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
      { q: '¿A quién llamo hoy y por qué?', h: 'trabajar', obj: ['conversion', 'ventas', 'seguimiento', 'todo'] },
      { q: '¿Quién dijo que empezaría en enero?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && (/enero/i.test(c.s.luego || '') || /enero/.test(c.s.urgTxt || '') || (c.conv || []).some(function (m) { return m.de === 'c' && /enero/i.test(m.texto || ''); })); }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados hablaron de enero. Es la lista para la campaña de enero: cada uno con lo que dijo y cuándo.'; },
        vista: 'tabla' },
      { q: '¿Quién dijo «más adelante» y cuándo hay que volver a llamarle?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados dijeron que lo retomarían más adelante, cada uno con su fecha. Ninguno es un no: te salen en la lista el día que toca.'; },
        vista: 'tabla' },
      { q: '¿Qué anuncio trae entrevistas y matrículas, no solo solicitudes?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Quién contestó y lleva días sin que nadie le llame?', h: 'sinSeguimiento', obj: ['seguimiento', 'todo'] }
    ],

    nba: function (c, k, x, T, Mo) {
      const r = Mo.nbaGenerica(c, k, x, T);
      if (['agente', 'voz', 'auto'].indexOf(r.tipo) < 0) return r;
      if (r.estado === 'cerrado' && r.id !== 'cerrar') return r;
      if (r.id === 'esperar') return Object.assign({}, r, { accion: 'Volver a llamar en ' + c.s.luego, quien: 'Anna', tipo: 'humano', estado: 'esperando', por: 'Dijo que ' + (c.s.luegoTxt || 'lo retomaría más adelante') + '. Te sale en la lista unos días antes, con lo que dijo.' });
      const aMano = { wa: 'Llamar hoy', 'wa-seguir': 'Contestarle hoy', voz: 'Llamar hoy', reenganche: 'Llamar para retomarlo', reprogramar: 'Llamar y proponer otra hora', recordatorio: 'Recordarle la entrevista', propuesta: 'Llamar por la matrícula', caso: 'Mandarle trabajos de alumnos', cerrar: 'Contestar y cerrar', desbloquear: 'Llamar y resolver la duda' }[r.id] || 'Llamar hoy';
      const motivo = String(r.por).split(/\.\s/)[0].replace(/\.$/, '').replace(/[Ll]a respuesta en el minuto uno[^.]*/, 'Cuanto antes se le llama, más fácil es hablar con él');
      return Object.assign({}, r, { accion: aMano, quien: 'Anna', tipo: 'humano', estado: 'humano', por: motivo + '. Lo haces tú, con su ficha delante.' });
    },

    historias: {
      art: {
        titulo: 'Laura pide información de Art Direction a las 21:12 y a las 9:00 es la primera de la lista de Anna, con el porqué',
        contacto: { id: 'demo', n: 'Laura Puig', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'tel', etapa: 1, valor: 12000, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud desde el vídeo de Art Direction en Instagram, a las 21:12', feed: 'Nueva solicitud · Programa Art Direction · anuncio del 23-oct', cambio: {} },
          { dur: 6, min: 1, txt: 'El sistema la puntúa sola, sin escribirle nada: trabaja en marketing, programa concreto, quiere empezar en enero', feed: 'Encaje alto · intención: enero', cambio: { f: { exp: 5 }, s: { conv: true, urg: true, urgTxt: 'quiere empezar en enero' } }, act: true },
          { dur: 6, min: 50, txt: 'A las 22:05 vuelve a la web y mira el plan de financiación y las becas', feed: 'Visita: Plan de financiación · Becas 2026/27', cambio: { s: { financia: true, visitas: 3 } }, act: true },
          { dur: 7, min: 3, txt: 'Por la mañana sube la primera en la lista de llamadas de Anna', feed: 'Primera en la lista de hoy', cambio: { etapa: 2 } },
          { dur: 0, min: 1, txt: 'Aviso a Anna: llámala la primera, y esto es lo que hay que contarle', feed: 'Aviso a Anna', humano: { titulo: 'Llama primero a Laura', texto: '27 años · trabaja en marketing · Art Direction · quiere empezar en enero · anoche miró la financiación y las becas. Vino del vídeo de Art Direction del 23-oct. Háblale de becas y propón la entrevista esta semana.' } }
        ]
      }
    },
    historiaDefecto: 'art',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'b01', n: 'Júlia Ferrer', rol: 'Cambio de profesión', seg: 'particular', ciudad: 'Sabadell', prod: 'Programa Copywriting · vídeo', orig: 'c3', canal: 'wa', etapa: 3, valor: 12000, creado: 3 * D, act: 23, toque: 40,
        f: { exp: 4 }, s: { visitas: 4, precio: true, financia: true, conv: true, urg: true, urgTxt: 'quiere empezar en enero y pregunta si quedan plazas', resp: true },
        conv: [[3 * D - 1, 'h', 'wa', 'Hola Júlia, soy Anna, de la escuela. ¿Te lo planteas para enero o más adelante?'], [3 * D - 40, 'c', 'wa', 'Enero. Quiero dejar la consultora y dedicarme a escribir.'], [2 * D, 'h', 'wa', '¡Genial! ¿Te cuadra el horario de lunes a jueves de 17 a 21 h?'], [45, 'c', 'wa', 'Sí. ¿Quedan plazas para enero? ¿Y cómo funciona la financiación?'], [40, 'h', 'wa', 'Te lo cuento yo en una llamada de 15 minutos. ¿Te llamo hoy?']],
        ev: [[23, 'web', 'Visita la página del plan de financiación']] },
      { id: 'b02', n: 'Marc Soler', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'wa', etapa: 3, valor: 12000, creado: 26 * H, act: 17, toque: 20,
        f: { exp: 5 }, s: { visitas: 3, precio: true, conv: true, emails: 2 },
        conv: [[26 * H - 1, 'h', 'wa', 'Hola Marc, soy Anna, de la escuela. ¿Art Direction lo quieres para enero?'], [25 * H, 'c', 'wa', 'Sí, llevo años haciendo contenido y quiero dar el salto a dirección de arte.'], [60, 'h', 'wa', 'Te encaja: sales con book para entrar en agencia. ¿Te llamo y lo hablamos?'], [17, 'c', 'wa', '¿Cuánto cuesta en total? ¿Hay beca?']] },
      { id: 'b03', n: 'Pau Martí', rol: 'Organiza eventos', seg: 'particular', ciudad: 'Girona', prod: 'Programa Events & Experiences · vídeo', orig: 'c1', canal: 'email', etapa: 4, valor: 12000, creado: 9 * D, act: 5 * H, toque: 5 * D,
        f: { exp: 5 }, s: { prop: 5 * D, propVista: 3, visitas: 2, financia: true },
        conv: [[9 * D, 'h', 'email', 'Hola Pau, te escribo por el programa de Events & Experiences.'], [8 * D, 'c', 'email', 'Me interesa para enero. ¿Me mandáis la información de matrícula?'], [5 * D, 'h', 'email', 'Te envío la matrícula con el plan de financiación al 0 %.']],
        ev: [[5 * H, 'web', 'Abre el email de matrícula por tercera vez']] },
      { id: 'b04', n: 'Clara Vidal', rol: 'Estudiante de diseño', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Creative Content · vídeo', orig: 'c4', canal: 'wa', etapa: 1, valor: 12000, creado: 12, act: 12, toque: null,
        f: { exp: 3 }, s: { visitas: 1 }, conv: [] },
      { id: 'b05', n: 'Ona Serra', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'wa', etapa: 4, valor: 12000, creado: 6 * D, act: 3 * H, toque: 20 * H,
        f: { exp: 4 }, s: { cita: 22 * H, citaOk: false, precio: true, financia: true, visitas: 2 },
        conv: [[6 * D, 'h', 'wa', 'Hola Ona, soy Anna, de la escuela. ¿Te planteas Art Direction para enero?'], [6 * D - 30, 'c', 'wa', 'Sí, quiero pasar del contenido a la dirección de arte.'], [2 * D, 'h', 'wa', 'Te dejo la entrevista mañana a las 18:00. ¿Te va bien?'], [2 * D - 20, 'c', 'wa', 'Perfecto. ¿Y hay becas?'], [20 * H, 'h', 'wa', 'Sí, becas 2026/27 y financiación desde 200 €/mes. Te lo cuento mañana.']] },
      { id: 'b06', n: 'Bernat Riera', rol: 'Diseñador gráfico', seg: 'particular', ciudad: 'Mataró', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'tel', etapa: 1, valor: 12000, creado: 34, act: 34, toque: null,
        f: { exp: 6 }, s: { visitas: 2 }, conv: [] },
      { id: 'b07', n: 'Marta Soler', rol: 'Community manager', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Creative Content · vídeo', orig: 'c4', canal: 'wa', etapa: 2, valor: 12000, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { exp: 5 }, s: { visitas: 2, precio: true },
        conv: [[5 * D, 'h', 'wa', 'Hola Marta, ¿Creative Content lo quieres para enero o para marzo?'], [4 * D, 'c', 'wa', 'Enero si lo puedo pagar. ¿Precio?'], [4 * D - 5, 'h', 'wa', 'Hay financiación al 0 % desde 200 €/mes. ¿Te lo explico en una llamada de 15 minutos?']] },
      { id: 'b08', n: 'Oriol Bosch', rol: 'Trabaja en una productora', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Events & Experiences · vídeo', orig: 'c1', canal: 'wa', etapa: 4, valor: 12000, creado: 12 * D, act: 6 * D, toque: 6 * D,
        f: { exp: 5 }, s: { visitas: 2, precio: true, financia: true },
        conv: [[12 * D, 'h', 'wa', 'Hola Oriol, ¿qué te gustaría hacer después del programa?'], [11 * D, 'c', 'wa', 'Dirigir experiencias de marca. Hice la entrevista ayer.'], [6 * D, 'h', 'wa', '¡Estás admitido! Te paso la matrícula y la financiación.'], [6 * D - 30, 'c', 'wa', 'Gracias, me lo pienso este finde.']] },
      { id: 'b09', n: 'Anna Vila', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Terrassa', prod: 'Programa Copywriting · vídeo', orig: 'c3', canal: 'wa', etapa: 5, valor: 12000, creado: 40 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { exp: 5 }, s: { exp: true, expTxt: 'Pregunta por el curso de IA generativa para el segundo trimestre', visitas: 2 },
        conv: [[2 * D, 'c', 'wa', 'El programa me encanta. ¿Podría hacer también el intensivo de IA en primavera?']] },
      { id: 'b10', n: 'Sergi Roca', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Terrassa', prod: 'Programa Copywriting · vídeo', orig: 'c3', canal: 'wa', etapa: 4, valor: 12000, creado: 11 * D, act: 3 * D, toque: 3 * D,
        f: { exp: 5 }, s: { noshow: true, precio: true, visitas: 3 },
        conv: [[11 * D, 'h', 'wa', 'Hola Sergi, soy Anna, de la escuela. ¿Qué te gustaría conseguir con Copywriting?'], [10 * D, 'c', 'wa', 'Entrar en una agencia como copy. Me cuadra empezar en enero.'], [4 * D, 'h', 'wa', 'Te espero mañana a las 18:00 para la entrevista.']],
        ev: [[3 * D, 'sistema', 'No se presenta a la entrevista']] },
      // --- Dijeron «más adelante»
      { id: 'b11', n: 'Nuria Pons', rol: 'Cambio de profesión', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Events & Experiences · vídeo', orig: 'c1', canal: 'wa', etapa: 3, valor: 12000, creado: 24 * D, act: 20 * D, toque: 20 * D,
        f: { exp: 3 }, s: { luego: 'marzo', luegoTxt: 'empezaría en la convocatoria de marzo', precio: true },
        conv: [[24 * D, 'h', 'wa', 'Hola Nuria, ¿buscas empezar en enero?'], [20 * D, 'c', 'wa', 'Me encanta, pero hasta febrero no dejo el trabajo. Empezaría en marzo.']] },
      { id: 'b12', n: 'Jan Ribas', rol: 'Estudiante de publicidad', seg: 'particular', ciudad: 'Vic', prod: 'Programa Copywriting · vídeo', orig: 'c3', canal: 'wa', etapa: 2, valor: 12000, creado: 30 * D, act: 28 * D, toque: 28 * D,
        f: { exp: 2, estudiante: true }, s: { luego: 'octubre', luegoTxt: 'lo haría en octubre, cuando acabe la carrera' },
        conv: [[30 * D, 'h', 'wa', 'Hola Jan, ¿Copywriting lo quieres para enero?'], [28 * D, 'c', 'wa', 'Acabo la carrera en junio. Lo haría en octubre.']] },
      { id: 'b13', n: 'Elena Font', rol: 'Arquitecta', seg: 'particular', ciudad: 'Barcelona', prod: 'Cursos de IA generativa', orig: 'c5', canal: 'email', etapa: 3, valor: 1500, creado: 45 * D, act: 35 * D, toque: 35 * D,
        f: { exp: 6 }, s: { luego: 'noviembre', luegoTxt: 'lo retomaría en noviembre, cuando salgan las fechas del próximo trimestre' },
        conv: [[40 * D, 'h', 'email', 'Te comparto las fechas del curso de IA para arquitectura.'], [35 * D, 'c', 'email', 'Gracias. Lo retomo en noviembre, cuando tengáis las fechas del próximo trimestre.']] },
      // --- Sin seguimiento después de contestar
      { id: 'b14', n: 'Laia Costa', rol: 'Trabaja en una agencia', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'wa', etapa: 3, valor: 12000, creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: { exp: 6 }, s: { visitas: 2, conv: true },
        conv: [[8 * D, 'h', 'wa', 'Hola Laia, soy Anna, de la escuela. ¿Qué te llevó a mirar Art Direction?'], [7 * D, 'c', 'wa', 'Trabajo de junior en una agencia y quiero crecer. ¿Cuándo es la próxima convocatoria?'], [5 * D, 'h', 'wa', 'Te lo confirmo esta semana.']] },
      { id: 'b15', n: 'Gerard Prat', rol: 'Fotógrafo', seg: 'particular', ciudad: 'Reus', prod: 'Programa Creative Content · vídeo', orig: 'c4', canal: 'wa', etapa: 2, valor: 12000, creado: 10 * D, act: 7 * D, toque: 7 * D,
        f: { exp: 5 }, s: { precio: true },
        conv: [[10 * D, 'h', 'wa', 'Hola Gerard, ¿Creative Content sería para ti?'], [9 * D, 'c', 'wa', 'Sí. Vivo en Reus: ¿hay algo online o es todo presencial?'], [7 * D, 'h', 'wa', 'Lo miro y te digo.']] },
      // --- Nuevos o en cadencia sin respuesta
      { id: 'b16', n: 'Silvia Camps', rol: 'Recién graduada', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Events & Experiences · vídeo', orig: 'c1', canal: 'wa', etapa: 1, valor: 12000, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { exp: 2 }, s: { intentos: 1 },
        conv: [[2 * D - 1, 'h', 'wa', 'Hola Silvia, soy Anna, de la escuela. ¿Te lo planteas para enero?']] },
      { id: 'b17', n: 'Àlex Serra', rol: 'Busca algo gratuito', seg: 'particular', ciudad: 'Lleida', prod: 'Cursos de IA generativa', orig: 'c5', canal: 'wa', etapa: 1, valor: 1500, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { estudiante: true, gratis: true }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'h', 'wa', 'Hola Àlex, ¿el curso de IA es para tu trabajo actual?']] },
      { id: 'b18', n: 'Irene Gil', rol: 'Recién graduada', seg: 'particular', ciudad: 'Valencia', prod: 'Audience Network (todas las campañas)', orig: 'c6', canal: 'email', etapa: 1, valor: 12000, creado: 11 * D, act: 11 * D, toque: 9 * D, f: { exp: 1 }, s: { intentos: 3 },
        conv: [[11 * D, 'h', 'email', 'Hola Irene, gracias por tu solicitud.']] },
      // --- Del año pasado: dijeron «el año que viene» (lista para la campaña de enero)
      { id: 'b21', n: 'Carla Montes', rol: 'Trabaja en marketing', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'wa', etapa: 4, valor: 12000, creado: 330 * D, act: 300 * D, toque: 300 * D,
        f: { exp: 5 }, s: { luego: 'enero', luegoTxt: 'hizo la entrevista el año pasado y quería empezar «en enero, cuando cambie de trabajo»', precio: true, financia: true },
        conv: [[300 * D, 'c', 'wa', 'Me encantó la entrevista. Este año no puedo; en enero, cuando cambie de trabajo, seguro.']] },
      { id: 'b22', n: 'Roger Vidal', rol: 'Diseñador gráfico', seg: 'particular', ciudad: 'Sant Cugat', prod: 'Programa Copywriting · vídeo', orig: 'c3', canal: 'wa', etapa: 3, valor: 12000, creado: 280 * D, act: 250 * D, toque: 250 * D,
        f: { exp: 6 }, s: { luego: 'enero', luegoTxt: 'quería hacer Copywriting en la convocatoria de enero' },
        conv: [[250 * D, 'c', 'wa', 'Lo dejo para la convocatoria de enero, que ahora tengo mucho lío en el estudio.']] },
      // --- Ya matriculados
      { id: 'b19', n: 'Jordi Puig', rol: 'Organiza eventos', seg: 'particular', ciudad: 'Badalona', prod: 'Programa Events & Experiences · vídeo', orig: 'c1', canal: 'wa', etapa: 5, valor: 12000, creado: 28 * D, act: 10 * D, toque: 10 * D, fin: 'ganado', f: { exp: 4 }, s: {}, conv: [] },
      { id: 'b20', n: 'David Mas', rol: 'Trabaja en una agencia', seg: 'particular', ciudad: 'Barcelona', prod: 'Programa Art Direction · vídeo', orig: 'c2', canal: 'wa', etapa: 5, valor: 12000, creado: 25 * D, act: 8 * D, toque: 8 * D, fin: 'ganado', f: { exp: 4 }, s: {}, conv: [] }
    ]
  };
})();

/* Sector: Escuela de aviación (TCP, azafata de tierra, despachador de vuelo). Derivado el 29-sep; proporciones parecidas a las de EAC, personas inventadas.
 * Todos los nombres y empresas son inventados. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };

  const Q = window.QV.voz;
  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.aviacion = {
    id: 'aviacion',
    nombre: 'Escuela de aviación',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso',
      paginaVisitas: 'la página del curso', cita: 'entrevista', Cita: 'Entrevista', laCita: 'la entrevista',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'el equipo de admisiones', Comercial: 'Admisiones',
      cliente: 'alumno', unCliente: 'un alumno', convierten: 'se matriculan', objetivoPaso: 'agendar la entrevista',
      casoExito: 'el testimonio de un antiguo alumno que ya vuela', valorAlto: 5000, oportunidades: 'interesados',
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
    ticket: 4400,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.85, cualificado: 0.6, entrevista: 0.45, matricula: 0.42 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'interesados que piden información y nunca llegan a hablar con nadie' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de la primera pregunta' },
      entrevista: { txt: 'Seguimiento', exp: 'interesados que piden información y a los que nadie cierra la entrevista' },
      matricula: { txt: 'Cierre y no-show', exp: 'entrevistas que no terminan en matrícula' }
    },
    mesDatos: { respuestaAntes: 190, respuestaAhora: 2, agendadas: 68 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Tripulante de Cabina (TCP) · formulario', inversion: 1500, ticket: 4400,
        embudo: { anuncio: 52000, info: 205, contactado: 150, cualificado: 88, entrevista: 24, matricula: 4, alumno: 4 } },
      { id: 'c2', canal: 'Meta', nombre: 'Tripulante de Cabina (TCP) · landing', inversion: 900, ticket: 4400,
        embudo: { anuncio: 26000, info: 95, contactado: 74, cualificado: 48, entrevista: 14, matricula: 2, alumno: 2 } },
      { id: 'c3', canal: 'Google', nombre: 'Tripulante de Cabina (TCP) · búsqueda', inversion: 700, ticket: 4400,
        embudo: { anuncio: 6100, info: 72, contactado: 58, cualificado: 40, entrevista: 12, matricula: 2, alumno: 2 } },
      { id: 'c4', canal: 'TikTok', nombre: 'Azafata de Tierra', inversion: 600, ticket: 3600,
        embudo: { anuncio: 64000, info: 110, contactado: 70, cualificado: 34, entrevista: 9, matricula: 1, alumno: 1 } },
      { id: 'c5', canal: 'Meta', nombre: 'Despachador de Vuelo', inversion: 600, ticket: 5600,
        embudo: { anuncio: 15000, info: 77, contactado: 58, cualificado: 36, entrevista: 9, matricula: 1, alumno: 1 } },
      { id: 'c6', canal: 'Web', nombre: 'Web y orgánico', inversion: 0, ticket: 4400,
        embudo: { anuncio: 7000, info: 40, contactado: 34, cualificado: 22, entrevista: 6, matricula: 1, alumno: 1 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Interesados', cualificados: 'Interesados cualificados', entrevistas: 'Entrevistas', ventas: 'Matrículas', cpv: 'Coste por matrícula', ingresos: 'Facturación' },
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
      tcp: {
        titulo: 'Una chica pide información del curso de TCP y el agente de voz cierra la entrevista',
        contacto: { id: 'demo', n: 'Andrea Molina', rol: 'Quiere ser TCP', seg: 'particular', ciudad: '—', prod: 'Tripulante de Cabina (TCP) · formulario', orig: 'c1', canal: 'wa', etapa: 1, valor: 4400, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde el anuncio de TCP en Instagram', feed: 'Nueva solicitud · Tripulante de Cabina (TCP)', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 41 segundos', cambio: { conv: ['a', 'wa', 'Hola Andrea, soy Laia, de admisiones de la escuela. Te escribo por el curso de Tripulante de Cabina. ¿Tienes pensado empezar en la próxima convocatoria o más adelante?'] }, toque: true },
          { dur: 6, min: 12, txt: 'Andrea mira la página del curso dos veces, pero no contesta', feed: 'Visita la página del curso (2 veces)', cambio: { s: { visitas: 2 } }, act: true },
          { dur: 5, min: 20, txt: 'Veinte minutos sin respuesta: la cadencia pasa a voz', feed: 'Sin respuesta al WhatsApp · llamada programada', cambio: { s: { intentos: 1 } } },
          { dur: 16, min: 1, txt: 'El agente de voz le llama y resuelve sus dudas', feed: 'Llamada del agente de voz · 4 min · agendó la entrevista', act: true,
            llamada: { dur: 240, res: 'agendo', resumen: 'Cogió a la primera: estaba en clase y no había visto el WhatsApp. Tiene 21 años, quiere volar desde siempre y dudaba entre dos escuelas. Preguntó por las prácticas y por el pago a plazos. Agendó la entrevista del ' + Q.hueco(17).txt + ' a las 17:00.', dijo: ['Quiere empezar en la próxima convocatoria', 'Duda entre dos escuelas', 'Pregunta por prácticas y pago a plazos'],
              trans: [['v', 'Hola Andrea, soy Laia, de admisiones. Te llamo por el curso de Tripulante de Cabina que pediste. ¿Tienes un minuto?'], ['c', 'Sí, perdona, estaba en clase y no había visto el WhatsApp.'], ['v', 'Sin problema. ¿Lo quieres para empezar en la próxima convocatoria?'], ['c', 'Sí, pero estoy mirando otra escuela también. ¿Cómo son las prácticas?'], ['v', 'Te lo explica con detalle la directora en una entrevista de veinte minutos, con las salidas y el pago a plazos. ¿Te va bien el ' + Q.hueco(17).txt + ' a las cinco?'], ['c', 'Vale, perfecto.']] },
            cambio: { etapa: 4, s: { cita: Q.hueco(17).min - 16, citaOk: true, precio: true, urg: true, urgTxt: 'quiere empezar en la próxima convocatoria' } } },
          { dur: 7, min: 2, txt: 'La entrevista aparece en la agenda, confirmada por WhatsApp', feed: 'Entrevista agendada por el agente de voz · ' + Q.hueco(17).txt + ' 17:00', vista: 'agenda', toque: true,
            cambio: { conv: ['a', 'wa', 'Andrea, te confirmo la entrevista con la directora el ' + Q.hueco(17).txt + ' a las 17:00. Te mando un recordatorio el día antes.'] } },
          { dur: 0, min: 1, txt: 'Aviso a admisiones: Andrea está lista para la entrevista', feed: 'Aviso enviado a admisiones', humano: { titulo: 'Andrea viene a la entrevista', texto: '21 años · TCP · próxima convocatoria · duda entre dos escuelas · pregunta por prácticas y pago a plazos. Entrevista el ' + Q.hueco(17).txt + ' a las 17:00, cerrada por el agente de voz.' } }
        ]
      }
    },
    historiaDefecto: 'tcp',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'f04', n: 'Sergio Blanco', rol: 'Quiere ser TCP', seg: 'particular', ciudad: 'Valencia', prod: 'Azafata de Tierra', orig: 'c4', canal: 'wa', etapa: 1, valor: 4400, creado: 12, act: 12, toque: null,
        f: { exp: 4 }, s: { visitas: 1 }, conv: [] },
      { id: 'f17', n: 'Beatriz Lozano', rol: 'Cambio de profesión', seg: 'particular', ciudad: 'Zaragoza', prod: 'Despachador de Vuelo', orig: 'c5', canal: 'wa', etapa: 3, valor: 4400, creado: 7 * D, act: 4 * D, toque: 4 * D,
        f: { exp: 4 }, s: { visitas: 2, emails: 3 },
        conv: [[7 * D, 'a', 'wa', 'Hola Beatriz, ¿buscas la certificación para este año?'], [6 * D, 'c', 'wa', 'Sí, antes de marzo si puede ser.'], [4 * D, 'a', 'wa', 'Te envío el calendario de las próximas fechas.']] },
      { id: 'f20', n: 'Óscar Delgado', rol: 'Madre de interesada', seg: 'particular', ciudad: 'Granada', prod: 'Azafata de Tierra', orig: 'c4', canal: 'wa', etapa: 1, valor: 4400, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { estudiante: true, gratis: true }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Óscar, ¿el curso es para tu trabajo actual?']] },
      { id: 'f22', n: 'Pablo Reyes', rol: 'Recién graduada', seg: 'particular', ciudad: 'Vigo', prod: 'Despachador de Vuelo', orig: 'c5', canal: 'tel', etapa: 1, valor: 4400, creado: 5 * H, act: 5 * H, toque: 5 * H - 2,
        f: { exp: 3 }, s: { intentos: 1 },
        conv: [[5 * H - 2, 'a', 'wa', 'Hola Pablo, soy Lucía, de admisiones. ¿Te llamo en 5 minutos o prefieres por aquí?']] },
      { id: 'f25', n: 'Rocío Aguilar', rol: 'Madre de interesada', seg: 'particular', ciudad: 'Córdoba', prod: 'Azafata de Tierra', orig: 'c4', canal: 'wa', etapa: 1, valor: 4400, creado: 18 * D, act: 18 * D, toque: 12 * D, f: { exp: 1, gratis: true }, s: { intentos: 3 },
        conv: [[18 * D, 'a', 'wa', 'Hola Rocío, ¿el curso lo quieres para tu puesto actual?']] },
      { id: 'f32', n: 'Gonzalo Peña', rol: 'Quiere ser TCP', seg: 'particular', ciudad: 'Huelva', prod: 'Azafata de Tierra', orig: 'c4', canal: 'wa', etapa: 2, valor: 4400, creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { exp: 1, gratis: true }, s: { ppto: 'no' },
        conv: [[6 * D, 'a', 'wa', 'Hola Gonzalo, ¿el curso lo quieres para tu negocio?'], [5 * D, 'c', 'wa', 'Buscaba algo gratuito, la verdad.']] },
      { id: 'f33', n: 'Clara Benítez', rol: 'Cambio de profesión', seg: 'particular', ciudad: 'León', prod: 'Despachador de Vuelo', orig: 'c5', canal: 'email', etapa: 1, valor: 4400, creado: 9 * D, act: 9 * D, toque: 7 * D, f: { estudiante: true }, s: { intentos: 3 },
        conv: [[9 * D, 'a', 'email', 'Hola Clara, te escribo por la certificación.']] },
      // --- Ya matriculados / alumnos
      { id: 'f36', n: 'Ramón Cortés', rol: 'Madre de interesada', seg: 'particular', ciudad: 'Tarragona', prod: 'Despachador de Vuelo', orig: 'c5', canal: 'wa', etapa: 5, valor: 4400, creado: 16 * D, act: 5 * D, toque: 5 * D, fin: 'ganado', f: { exp: 10 }, s: {}, conv: [] },
      { id: 'f40', n: 'Luis Román', rol: 'Recién graduada', seg: 'particular', ciudad: 'Albacete', prod: 'Azafata de Tierra', orig: 'c4', canal: 'wa', etapa: 1, valor: 4400, creado: 12 * D, act: 12 * D, toque: 8 * D, f: { exp: 2 }, s: { intentos: 3 },
        conv: [[12 * D, 'a', 'wa', 'Hola Luis, ¿el curso es para tu trabajo actual?']] }
    ]
  };
})();

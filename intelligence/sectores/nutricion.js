/* Sector: Nutrición y psicoterapia. Una consulta con dos puertas:
 *  - programa individual (Ganbaru 90 días, Hormonas en Armonía, Equilibrio Intestinal,
 *    Inmunidad, Dolor crónico, RESET, Sana tu Mente), con valoración previa de 30 min;
 *  - grupo pequeño o academia (4 semanas, una sesión en grupo a la semana y menús),
 *    para quien no necesita o no puede asumir el uno a uno.
 * El asistente nunca da consejo de salud: lo clínico pasa a la terapeuta.
 * Todos los nombres, casos e importes son inventados. */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  const linea = function (c) { return (c.f && c.f.linea) || ''; };
  const hv = Q.hueco(18), hg = Q.hueco(10);
  const GRUPO = 'Grupo de 4 semanas';

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.nutricion = {
    id: 'nutricion',
    nombre: 'Nutrición y psicoterapia',
    t: {
      contacto: 'persona', contactos: 'personas', Contactos: 'Personas', Contacto: 'Persona',
      venta: 'inicio de programa', ventas: 'inicios de programa', Ventas: 'Inicios de programa', producto: 'programa', Producto: 'Programa',
      paginaVisitas: 'la web', cita: 'valoración', Cita: 'Valoración', laCita: 'la valoración',
      propuesta: 'el programa recomendado', Propuesta: 'Programa recomendado', comercial: 'la terapeuta', Comercial: 'Terapeuta',
      cliente: 'paciente', unCliente: 'un paciente', clientes: 'pacientes', convierten: 'empiezan programa',
      objetivoPaso: 'reservar la valoración', casoExito: 'la experiencia de una paciente con un caso parecido', valorAlto: 500,
      oportunidades: 'personas', atencion: 'personas que requieren atención', laVenta: 'el inicio del programa',
      verbo: 'empezar', clientesReales: 'pacientes de verdad', pasoHumano: 'resolver sus dudas y recomendarle el programa',
      nombreAgenteVoz: 'Clara'
    },
    // Anuncio → Pide información → Contactado → Hace el test → Valoración → Empieza programa → Sigue (mantenimiento o grupo)
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'info', txt: 'Pide información' },
      { id: 'contactado', txt: 'Contestada' },
      { id: 'cualificado', txt: 'Test hecho' },
      { id: 'cita', txt: 'Valoración' },
      { id: 'alta', txt: 'Empieza programa o grupo' },
      { id: 'fiel', txt: 'Sigue con nosotras', sinFuga: true }
    ],
    ventaEtapa: 'alta',
    ticket: 590,
    referencia: { contactado: 0.9, cualificado: 0.7, cita: 0.6, alta: 0.6 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'personas que escriben y nadie les contesta a tiempo porque estás en consulta' },
      cualificado: { txt: 'Filtro', exp: 'conversaciones que no pasan de «¿cuánto cuesta?» o «solo quería información»' },
      cita: { txt: 'Valoración', exp: 'personas con ganas a las que nadie cierra la valoración' },
      alta: { txt: 'Después de la valoración', exp: 'valoraciones gratis que no acaban en programa ni en grupo' }
    },
    mesDatos: { respuestaAntes: 410, respuestaAhora: 1, agendadas: 63 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Reel · No es falta de fuerza de voluntad', inversion: 620, ticket: 590,
        embudo: { anuncio: 9800, info: 46, contactado: 41, cualificado: 30, cita: 17, alta: 7, fiel: 5 } },
      { id: 'c2', canal: 'Meta', nombre: 'Historia · Intestino y energía', inversion: 380, ticket: 520,
        embudo: { anuncio: 7200, info: 24, contactado: 21, cualificado: 14, cita: 8, alta: 3, fiel: 2 } },
      { id: 'c3', canal: 'Google', nombre: 'Nutricionista ansiedad por comer · Madrid', inversion: 340, ticket: 590,
        embudo: { anuncio: 1300, info: 18, contactado: 16, cualificado: 13, cita: 9, alta: 5, fiel: 4 } },
      { id: 'c4', canal: 'Instagram', nombre: 'Orgánico @comidayemociones y pódcast', inversion: 0, ticket: 590,
        embudo: { anuncio: 5600, info: 22, contactado: 17, cualificado: 12, cita: 7, alta: 4, fiel: 3 } },
      { id: 'c5', canal: 'Meta', nombre: 'Grupo de noviembre · 4 semanas', inversion: 180, ticket: 120,
        embudo: { anuncio: 4100, info: 15, contactado: 14, cualificado: 12, cita: 10, alta: 8, fiel: 4 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Personas que escriben', cualificados: 'Test hecho', entrevistas: 'Valoraciones', ventas: 'Empiezan programa o grupo', cpv: 'Coste por paciente', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'cita' },
    agenda: { horas: [9, 20], pausa: [14, 16], ocupacion: 0.75, etapa: 'cita',
      tipos: ['Valoración · 30 min', 'Sesión Ganbaru', 'Sesión de seguimiento', 'Valoración · online', 'Grupo · 4 semanas', 'Sesión Hormonas en Armonía'] },
    historiaGenerica: false,

    reglas: {
      fitBase: 24,
      fit: [
        [function (c) { return !!c.f.motivoClaro; }, 18, function (c) { return 'sabe lo que le pasa: ' + c.f.motivoTxt; }, 'Motivo de consulta claro'],
        [function (c) { return c.f.tiempo === 'anos'; }, 12, 'lleva más de un año con el problema', 'Más de un año con el problema'],
        [function (c) { return c.f.modo === 'individual'; }, 16, 'quiere acompañamiento uno a uno', 'Prefiere uno a uno'],
        [function (c) { return c.f.modo === 'grupo'; }, 8, 'prefiere empezar en grupo', 'Prefiere grupo'],
        [function (c) { return c.f.zona === 'madrid' || c.f.zona === 'online'; }, 10, function (c) { return c.f.zona === 'madrid' ? 'vive en Madrid' : 'lo haría online'; }, 'Madrid u online'],
        [function (c) { return !!c.f.probado; }, 8, 'ya ha probado dietas o terapia por separado', 'Ha probado antes por separado'],
        [function (c) { return !!c.f.soloInfo; }, -24, 'solo quería información', 'Solo mirando'],
        [function (c) { return !!c.f.dietaGratis; }, -22, 'busca una dieta gratis']
      ],
      intencion: [
        [function (c) { return c.s.programa; }, 12, 'preguntó cómo es el programa'],
        [function (c) { return c.s.online; }, 8, 'preguntó si se puede hacer online'],
        [function (c) { return c.s.fechas; }, 10, 'preguntó cuándo empieza el grupo']
      ]
    },

    nba: function (c, k, x, T, M) {
      const r = M.nbaGenerica(c, k, x, T);
      if (linea(c) === 'grupo' && r.quien === T.Comercial) return Object.assign({}, r, { accion: r.accion.replace('a la terapeuta', 'al grupo, sin pasar por la agenda'), quien: 'Asistente', por: r.por });
      return r;
    },
    vozDijo: function (c) { return c.f.motivoTxt ? ['Motivo: ' + c.f.motivoTxt] : []; },
    vozMotivo: function (c) { return 'Consulta por ' + (c.f.motivoTxt || c.prod.toLowerCase()) + '.'; },

    preguntas: [
      { q: '¿Quién hizo la valoración y no empezó ningún programa?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return c.etapa === 4 && !c.fin && c.s.cita != null && c.s.cita < 0; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas hicieron la valoración y todavía no han empezado. Es donde hoy se pierde más: ya te conocen y ya les recomendaste un programa.'; },
        vista: 'tabla' },
      { q: '¿Quién encaja mejor en el grupo que en consulta?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && (c.f.modo === 'grupo' || c.f.soloInfo); }, orden: 'prob',
        intro: function (l) { return l.length + ' personas pueden ir al grupo de noviembre sin ocupar tu agenda de valoraciones.'; },
        vista: 'tabla' },
      { q: '¿Quién escribió fuera de horario y sigue sin respuesta humana?', h: 'lista', obj: ['seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa <= 2; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas tienen la primera respuesta del asistente pero nadie ha retomado la conversación.'; },
        vista: 'tabla' }
    ],

    historias: {
      consulta: {
        titulo: 'Escribe a las 23:22 tras el reel, hace el test y reserva valoración',
        contacto: { id: 'demo', n: 'Marta Ríos', rol: 'Come por ansiedad desde hace más de un año', seg: 'paciente', ciudad: '—', prod: 'Ganbaru · 90 días', orig: 'c1', canal: 'wa', etapa: 1, valor: 590, creado: 0, act: 0, f: { linea: 'programa' }, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una persona desde el reel «No es falta de fuerza de voluntad»', feed: 'Nueva persona · reel de Instagram · 23:22', cambio: {} },
          { dur: 6, min: 1, txt: 'El test completa la ficha: come por ansiedad, más de un año, prefiere uno a uno', feed: 'Test hecho · ansiedad · más de 1 año · uno a uno', cambio: { ciudad: 'Madrid', f: { motivoClaro: true, motivoTxt: 'come por ansiedad', tiempo: 'anos', modo: 'individual', zona: 'madrid', probado: true } } },
          { dur: 6, min: 1, txt: 'El asistente contesta en el minuto uno, aunque sean las 23:23', feed: 'WhatsApp enviado en 48 segundos', cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Marta, soy el asistente de la consulta. Has hecho el test: dices que comes por ansiedad desde hace más de un año. Aquí no juzgamos a nadie. ¿Te pasa sobre todo por la noche?'] }, toque: true },
          { dur: 6, min: 4, txt: 'Marta contesta y pregunta si se puede online', feed: 'Respuesta recibida · pregunta por online', cambio: { etapa: 3, s: { online: true, programa: true }, conv: ['c', 'wa', 'Sí, por la noche sobre todo. He probado mil dietas. ¿Se puede hacer online? Viajo mucho.'] }, act: true },
          { dur: 7, min: 2, txt: 'El asistente le recomienda Ganbaru y le ofrece valoración', feed: 'Programa recomendado · Ganbaru 90 días', toque: true,
            cambio: { conv: ['a', 'wa', 'Sí, todo se puede hacer online. Lo que cuentas encaja con Ganbaru, que trabaja la comida y la parte emocional a la vez. El primer paso es una valoración de 30 minutos con la terapeuta. ¿Te va bien el ' + hv.txt + ' a las 18:00 por videollamada?'] } },
          { dur: 7, min: 3, txt: 'Marta reserva: la valoración aparece en tu agenda', feed: 'Valoración agendada · ' + hv.txt + ' 18:00 · online', vista: 'agenda', act: true,
            cambio: { etapa: 4, s: { cita: hv.min - 18, citaOk: true }, conv: ['c', 'wa', 'Perfecto, el ' + hv.txt + ' a las 18:00.'] } },
          { dur: 0, min: 1, txt: 'Resumen para la terapeuta antes de la sesión', feed: 'Resumen enviado a la terapeuta', humano: { titulo: 'Marta: valoración el ' + hv.txt + ' a las 18:00', texto: 'Come por ansiedad, sobre todo por la noche, desde hace más de un año. Ha probado muchas dietas. Viaja: online. Programa recomendado: Ganbaru. Vino del reel «No es falta de fuerza de voluntad».' } }
        ]
      },
      grupo: {
        titulo: 'Solo quería información y acaba en el grupo, sin pasar por tu agenda',
        contacto: { id: 'demo', n: 'Lucía Prieto', rol: 'Hinchazón y cansancio', seg: 'paciente', ciudad: '—', prod: GRUPO, orig: 'c2', canal: 'wa', etapa: 1, valor: 120, creado: 0, act: 0, f: { linea: 'grupo' }, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una persona desde la historia de intestino y energía', feed: 'Nueva persona · historia de Instagram', cambio: {} },
          { dur: 6, min: 1, txt: 'El test: hinchazón y cansancio, prefiere empezar en grupo', feed: 'Test hecho · intestino · prefiere grupo', cambio: { ciudad: 'Getafe', f: { motivoClaro: true, motivoTxt: 'hinchazón y cansancio', modo: 'grupo', zona: 'madrid' } } },
          { dur: 6, min: 1, txt: 'El asistente le ofrece el grupo de noviembre', feed: 'WhatsApp enviado en 52 segundos', toque: true, cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Lucía, soy el asistente de la consulta. El grupo de noviembre son 4 semanas, una sesión en grupo a la semana y los menús. ¿Te guardo plaza sin compromiso hasta el viernes?'] } },
          { dur: 6, min: 5, txt: 'Lucía pregunta cuándo empieza', feed: 'Respuesta · pregunta fechas', act: true, cambio: { etapa: 3, s: { fechas: true }, conv: ['c', 'wa', '¿Cuándo empieza? Sí, guárdamela.'] } },
          { dur: 7, min: 1, txt: 'Plaza reservada: tu agenda de valoraciones sigue libre', feed: 'Plaza reservada en el grupo · recordatorio el jueves', toque: true, cambio: { etapa: 5, conv: ['a', 'wa', 'Empieza el 20 de noviembre a las 19:00, online. Te la guardo hasta el viernes y el jueves te escribo para confirmar.'] } }
        ]
      }
    },
    historiaDefecto: 'consulta',

    contactos: [
      { id: 'n01', n: 'Carmen López', rol: 'Ansiedad y atracones', seg: 'paciente', ciudad: 'Madrid', prod: 'Ganbaru · 90 días', orig: 'c1', canal: 'wa', etapa: 3, valor: 590, creado: 20 * H, act: 25, toque: 19 * H,
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'atracones por ansiedad', tiempo: 'anos', modo: 'individual', zona: 'madrid', probado: true }, s: { precio: true, programa: true, visitas: 3 },
        conv: [[20 * H - 1, 'a', 'wa', 'Hola Carmen, soy el asistente de la consulta. ¿Te pasa sobre todo por la noche?'], [19 * H, 'c', 'wa', 'Sí, sobre todo cuando llego a casa. Llevo años así.'], [25, 'c', 'wa', '¿Cuánto cuesta el programa de 90 días?']] },
      { id: 'n02', n: 'Elena Pardo', rol: 'Cansancio y digestiones pesadas', seg: 'paciente', ciudad: 'Madrid', prod: 'Equilibrio Intestinal', orig: 'c2', canal: 'wa', etapa: 1, valor: 520, creado: 12, act: 12, toque: null,
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'hinchazón y cansancio', zona: 'madrid' }, s: { visitas: 1 }, conv: [] },
      { id: 'n03', n: 'Sonia Torres', rol: 'Ciclo irregular y estrés', seg: 'paciente', ciudad: 'Alcobendas', prod: 'Hormonas en Armonía', orig: 'c3', canal: 'wa', etapa: 4, valor: 560, creado: 3 * D, act: 4 * H, toque: 4 * H,
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'ciclo irregular y estrés', tiempo: 'anos', modo: 'individual', zona: 'madrid' }, s: { cita: 8 * H, citaOk: true },
        conv: [[3 * D, 'a', 'wa', 'Hola Sonia, ¿desde cuándo tienes el ciclo irregular?'], [3 * D - 30, 'c', 'wa', 'Desde hace dos años, y con mucho estrés en el trabajo.'], [4 * H, 'a', 'wa', 'Te confirmo la valoración de hoy a las 18:00.'], [4 * H - 5, 'c', 'wa', 'Perfecto, allí estaré.']] },
      { id: 'n04', n: 'Patricia Gil', rol: 'Quiere perder peso', seg: 'paciente', ciudad: 'Madrid', prod: 'Ganbaru · 90 días', orig: 'c1', canal: 'wa', etapa: 4, valor: 590, creado: 9 * D, act: 6 * D, toque: 3 * D,
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'perder peso y que dure', tiempo: 'anos', modo: 'individual', zona: 'madrid', probado: true }, s: { cita: -6 * D, citaOk: true, programa: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Patricia, ¿has probado antes alguna dieta?'], [8 * D, 'c', 'wa', 'Todas. Pierdo y lo recupero.'], [6 * D, 'a', 'wa', 'Gracias por venir a la valoración. Te dejo el resumen del programa Ganbaru.'], [3 * D, 'a', 'wa', 'Patricia, ¿cómo te quedaste después de la sesión? ¿Alguna duda con el programa?']],
        ev: [[6 * D, 'sistema', 'Valoración hecha · programa recomendado: Ganbaru']] },
      { id: 'n05', n: 'Raquel Moreno', rol: 'Dolor crónico', seg: 'paciente', ciudad: 'Toledo', prod: 'Dolor crónico y fibromialgia', orig: 'c4', canal: 'wa', etapa: 4, valor: 590, creado: 12 * D, act: 9 * D, toque: 5 * D,
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'fibromialgia', tiempo: 'anos', modo: 'individual', zona: 'online', probado: true }, s: { cita: -9 * D, citaOk: true, precio: true },
        conv: [[12 * D, 'a', 'wa', 'Hola Raquel, ¿desde cuándo tienes el dolor?'], [11 * D, 'c', 'wa', 'Diagnosticada hace cuatro años. Escucho tu pódcast.'], [5 * D, 'a', 'wa', 'Raquel, ¿pudiste pensar lo del programa?']],
        ev: [[9 * D, 'sistema', 'Valoración online hecha · no ha empezado programa']] },
      { id: 'n06', n: 'Lucía Martín', rol: 'Hinchazón', seg: 'paciente', ciudad: 'Getafe', prod: GRUPO, orig: 'c5', canal: 'wa', etapa: 3, valor: 120, creado: 2 * D, act: 30 * H, toque: 30 * H,
        f: { linea: 'grupo', motivoClaro: true, motivoTxt: 'hinchazón', modo: 'grupo', zona: 'madrid' }, s: { fechas: true },
        conv: [[2 * D, 'a', 'wa', 'Hola Lucía, el grupo de noviembre son 4 semanas. ¿Te guardo plaza?'], [30 * H, 'c', 'wa', '¿Cuándo empieza exactamente?']] },
      { id: 'n07', n: 'Ana Ruiz', rol: 'Solo quería información', seg: 'paciente', ciudad: 'Valencia', prod: GRUPO, orig: 'c1', canal: 'wa', etapa: 2, valor: 120, creado: 3 * D, act: 3 * D, toque: 3 * D,
        f: { linea: 'grupo', soloInfo: true, zona: 'online' }, s: {},
        conv: [[3 * D, 'a', 'wa', 'Hola Ana, ¿qué te gustaría trabajar?'], [3 * D - 20, 'c', 'wa', 'Solo quería información, de momento.']] },
      { id: 'n08', n: 'Isabel Navarro', rol: 'Ánimo bajo y comer emocional', seg: 'paciente', ciudad: 'Madrid', prod: 'Sana tu Mente', orig: 'c4', canal: 'wa', etapa: 1, valor: 590, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'ánimo bajo y comer emocional', zona: 'madrid' }, s: { intentos: 2 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Isabel, soy el asistente de la consulta. ¿Te cuento cómo trabajamos la comida y el ánimo a la vez?']] },
      { id: 'n09', n: 'Beatriz Sanz', rol: 'Defensas bajas', seg: 'paciente', ciudad: 'Madrid', prod: 'Inmunidad Fuerte', orig: 'c3', canal: 'wa', etapa: 3, valor: 560, creado: 25 * D, act: 20 * D, toque: 20 * D,
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'resfriados y defensas bajas', zona: 'madrid' }, s: { luego: 'enero', luegoTxt: 'lo retomaría en enero, después de las fiestas' },
        conv: [[25 * D, 'a', 'wa', 'Hola Beatriz, ¿desde cuándo te pasa?'], [20 * D, 'c', 'wa', 'Me interesa, pero lo retomo en enero, después de las fiestas.']] },
      { id: 'n10', n: 'Marina Vega', rol: 'Estrés y sueño', seg: 'paciente', ciudad: 'Madrid', prod: 'RESET · Mente y cuerpo', orig: 'c1', canal: 'wa', etapa: 4, valor: 560, creado: 5 * D, act: 2 * D, toque: 2 * D,
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'estrés y mal sueño', modo: 'individual', zona: 'madrid' }, s: { noshow: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Marina, ¿cómo duermes estos días?'], [4 * D, 'c', 'wa', 'Fatal. Reservo la valoración.']],
        ev: [[2 * D - 30, 'sistema', 'No se presenta a la valoración']] },
      { id: 'n11', n: 'Laura Domínguez', rol: 'Ansiedad con la comida', seg: 'paciente', ciudad: 'Madrid', prod: 'Ganbaru · 90 días', orig: 'c1', canal: 'wa', etapa: 6, valor: 590, creado: 70 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'ansiedad con la comida', zona: 'madrid' }, s: { revision: true, revisionTxt: 'Día 45 del programa · toca la pregunta de mitad de programa' }, conv: [] },
      { id: 'n12', n: 'Rocío Blanco', rol: 'Busca una dieta', seg: 'paciente', ciudad: 'Sevilla', prod: GRUPO, orig: 'c1', canal: 'wa', etapa: 1, valor: 120, creado: 8 * D, act: 8 * D, toque: 5 * D, fin: 'perdido',
        f: { linea: 'grupo', dietaGratis: true, zona: 'online' }, s: { intentos: 3 }, conv: [] },
      { id: 'n13', n: 'Pilar Herrero', rol: 'Digestiones y migrañas', seg: 'paciente', ciudad: 'Madrid', prod: 'Equilibrio Intestinal', orig: 'c3', canal: 'tel', etapa: 2, valor: 520, creado: 30 * H, act: 26 * H, toque: 26 * H,
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'digestiones y migrañas', tiempo: 'anos', zona: 'madrid' }, s: { programa: true },
        conv: [[30 * H, 'a', 'wa', 'Hola Pilar, soy el asistente. ¿Prefieres que te llame la terapeuta?'], [26 * H, 'c', 'wa', 'Sí, mejor por teléfono, a partir de las 17:00.']] },
      { id: 'n14', n: 'Cristina Ramos', rol: 'Quiere perder peso', seg: 'paciente', ciudad: 'Madrid', prod: 'Ganbaru · 90 días', orig: 'c3', canal: 'wa', etapa: 6, valor: 590, creado: 40 * D, act: 5 * D, toque: 5 * D, fin: 'ganado',
        f: { linea: 'programa', motivoClaro: true, motivoTxt: 'perder peso', zona: 'madrid' }, s: {}, conv: [] }
    ]
  };
})();

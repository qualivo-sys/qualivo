/* Sector: Hiágora, escuela de ventas y consultoría comercial (Málaga, presencial y online). Preparado el 16-nov para la primera
 * llamada con José Antonio Padilla (director). Programas tomados de hiagora.com: Aprender a Vender Valor (12 h, 1 empresa por sector),
 * Máster en Dirección Comercial, Consultoría (Check Comercial → Top Business de 3 a 12 meses), In Company (8 h) y Vendedor Digital
 * en la Era de la IA (550 €, único precio público). Su web capta con «descarga el dossier» (solo email) y teléfono; no hay WhatsApp.
 * Inversiones, tickets (salvo el de IA), personas, empresas y mensajes son DE EJEMPLO. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.hiagora = {
    id: 'hiagora',
    nombre: 'Hiágora · Escuela de Ventas',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'contrato', ventas: 'contratos', Ventas: 'Contratos', producto: 'programa',
      paginaVisitas: 'la página del programa', cita: 'visita sin compromiso', Cita: 'Visita sin compromiso', citas: 'visitas sin compromiso', Citas: 'Visitas sin compromiso', laCita: 'la visita sin compromiso',
      propuesta: 'la propuesta', Propuesta: 'Propuesta', comercial: 'José Antonio', Comercial: 'José Antonio',
      cliente: 'cliente', unCliente: 'un cliente', convierten: 'contratan', objetivoPaso: 'agendar la visita sin compromiso',
      casoExito: 'el caso de Dulces Costa del Sol (ticket medio +10-15 %)', valorAlto: 6000, oportunidades: 'interesados',
      atencion: 'interesados que requieren atención', laVenta: 'el contrato', Producto: 'Programa', clientes: 'clientes',
      propuestas: 'propuestas de consultoría', verbo: 'contratar', clientesReales: 'contratos de verdad', empleados: 'empleados',
      pasoHumano: 'hacer la visita sin compromiso y cerrar la propuesta'
    },
    // Recorrido: Anuncio → Pide información o dossier → Contactado → Cualificado → Visita sin compromiso → Contrato → Cliente
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'info', txt: 'Pide información o dossier' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'entrevista', txt: 'Visita sin compromiso' },
      { id: 'matricula', txt: 'Contrato' },
      { id: 'alumno', txt: 'Cliente', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 2400,
    referencia: { contactado: 0.85, cualificado: 0.55, entrevista: 0.45, matricula: 0.4 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'empresas que descargan el dossier o piden información y nadie las llama' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no llegan a saber cuántos comerciales tienen ni qué les pasa' },
      entrevista: { txt: 'Seguimiento', exp: 'empresas interesadas a las que nadie cierra la visita sin compromiso' },
      matricula: { txt: 'Cierre', exp: 'visitas y propuestas que se quedan en «lo hablo con mi socio» sin fecha' }
    },
    mesDatos: { respuestaAntes: 1320, respuestaAhora: 2, agendadas: 39 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Aprender a Vender Valor · «Vende por valor, no por precio»', inversion: 720, ticket: 750,
        embudo: { anuncio: 18000, info: 46, contactado: 31, cualificado: 17, entrevista: 9, matricula: 5, alumno: 5 } },
      { id: 'c2', canal: 'Meta', nombre: 'Consultoría · descarga el dossier del Check Comercial', inversion: 640, ticket: 6000,
        embudo: { anuncio: 12500, info: 38, contactado: 21, cualificado: 11, entrevista: 5, matricula: 2, alumno: 2 } },
      { id: 'c3', canal: 'Meta', nombre: 'Vendedor Digital en la Era de la IA', inversion: 420, ticket: 550,
        embudo: { anuncio: 15000, info: 41, contactado: 27, cualificado: 15, entrevista: 7, matricula: 6, alumno: 6 } },
      { id: 'c4', canal: 'LinkedIn', nombre: 'Máster en Dirección Comercial · directivos', inversion: 520, ticket: 2400,
        embudo: { anuncio: 6400, info: 14, contactado: 11, cualificado: 7, entrevista: 4, matricula: 1, alumno: 1 } },
      { id: 'c5', canal: 'Web', nombre: 'Web, teléfono y recomendación', inversion: 0, ticket: 3000,
        embudo: { anuncio: 3100, info: 22, contactado: 19, cualificado: 13, entrevista: 8, matricula: 4, alumno: 4 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Interesados', cualificados: 'Empresas cualificadas', entrevistas: 'Visitas sin compromiso', ventas: 'Contratos', cpv: 'Coste por contrato', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'entrevista' },

    reglas: {
      fitBase: 26,
      fit: [
        [function (c) { return c.seg === 'empresa' && c.tam >= 20; }, 24, function (c) { return 'empresa de ' + c.tam + ' empleados'; }, 'Empresa de 20 empleados o más'],
        [function (c) { return c.seg === 'empresa' && c.tam >= 5 && c.tam < 20; }, 14, function (c) { return 'pyme de ' + c.tam + ' empleados'; }, 'Pyme de 5 a 19 empleados'],
        [function (c) { return c.f && c.f.comerciales >= 3; }, 16, function (c) { return c.f.comerciales + ' comerciales en el equipo'; }, 'Tiene equipo comercial (3 o más)'],
        [function (c) { return tieneRol(c, /gerente|ceo|director|dueñ|socio|fundador/i); }, 14, function (c) { return 'decide (' + c.rol + ')'; }, 'Su puesto decide'],
        [function (c) { return /málaga|marbella|fuengirola|torremolinos|benalmádena|estepona|antequera|vélez|rincón/i.test(c.ciudad || ''); }, 6, 'cerca de la escuela (presencial)'],
        [function (c) { return c.valor >= 5000; }, 8, 'consultoría o in-company'],
        [function (c) { return c.f && c.f.estudiante; }, -18, 'estudiante, sin empresa detrás'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca formación gratuita']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 14, 'preguntó por la próxima edición'],
        [function (c) { return c.s.temario; }, 8, 'descargó el dossier'],
        [function (c) { return c.s.fundaeQ; }, 10, 'preguntó si se puede bonificar']
      ]
    },

    preguntas: [
      { q: '¿Quién descargó el dossier y nadie le ha llamado?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.s.temario && c.etapa <= 2; }, orden: 'prob',
        intro: function (l) { return l.length + ' empresas descargaron el dossier y todavía no han hablado con nadie. Es la parte de la inversión que hoy se pierde.'; }, vista: 'tabla' },
      { q: '¿Qué empresas tienen más probabilidad de contratar?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Qué anuncio trae contratos, no solo descargas?', h: 'campanas', obj: ['captacion', 'ventas', 'todo'] },
      { q: '¿Quién dijo «más adelante» y cuándo?', h: 'lista', obj: ['seguimiento', 'retencion', 'todo'],
        filtro: function (c) { return !!c.s.luego && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' empresas dijeron que lo retomarían más adelante, cada una con su fecha. Ninguna es un no.'; }, vista: 'tabla' },
      { q: '¿Qué antiguos alumnos podrían pasar a consultoría o in-company?', h: 'lista', obj: ['expansion', 'retencion', 'todo'],
        filtro: function (c) { return c.fin === 'ganado' && !!c.s.exp; }, orden: 'valor',
        intro: function (l) { return l.length + ' clientes del curso han dado señales de querer más: formar al equipo o revisar el plan comercial.'; }, vista: 'tabla' }
    ],

    historias: {
      consultoria: {
        titulo: 'Un gerente descarga el dossier de consultoría a las 21:40 y, en vez de quedarse en un email, tiene la visita agendada antes de dormir',
        contacto: { id: 'demo', n: 'Ricardo Núñez', rol: 'Gerente', emp: 'Distribuciones Axarquía', seg: 'empresa', ciudad: '—', prod: 'Consultoría · Check Comercial', orig: 'c2', canal: 'wa', etapa: 1, valor: 6000, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Ricardo descarga el dossier de consultoría desde un anuncio de Meta, a las 21:40', feed: 'Nuevo dossier descargado · Consultoría', cambio: { s: { temario: true } } },
          { dur: 6, min: 1, txt: 'Se completa la ficha: empresa de 34 empleados y 6 comerciales, en Vélez-Málaga', feed: 'Ficha completada · 34 empleados · 6 comerciales', cambio: { tam: 34, ciudad: 'Vélez-Málaga', f: { comerciales: 6 } } },
          { dur: 6, min: 1, txt: 'En el minuto uno le llega un WhatsApp, con su nombre y una sola pregunta', feed: 'WhatsApp enviado en 52 segundos', cambio: { conv: ['a', 'wa', 'Hola Ricardo, soy Elena, de Hiágora. Te acaba de llegar el dossier del Check Comercial. Para orientarte bien: ¿qué os preocupa más ahora mismo, captar clientes nuevos o cerrar más de los que ya os llegan?'] }, toque: true },
          { dur: 7, min: 6, txt: 'Ricardo contesta: el equipo no cierra y la facturación lleva dos años plana', feed: 'Respuesta recibida · intención al alza', cambio: { etapa: 2, s: { urg: true, urgTxt: 'facturación plana dos años; quiere actuar antes de enero' }, conv: ['c', 'wa', 'Cerrar. Tengo 6 comerciales, mucha visita y poca venta. Llevamos dos años igual y quiero cambiarlo antes de enero.'] }, act: true },
          { dur: 7, min: 1, txt: 'Una pregunta más para cualificar, sin interrogatorio', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Te entiendo, es de lo más habitual. ¿Tenéis algún sistema para ver en qué fase está cada cliente, o cada comercial lo lleva a su manera?'] }, toque: true },
          { dur: 7, min: 3, txt: 'Ricardo da el dato que importa: cada comercial lleva su Excel', feed: 'Diagnóstico: sin proceso común · pide hablar esta semana', cambio: { s: { precio: true, fundaeQ: true }, conv: ['c', 'wa', 'Cada uno con su Excel, y yo no veo nada. ¿Esto se puede bonificar? ¿Podemos hablarlo esta semana?'] }, act: true },
          { dur: 6, min: 1, txt: 'Se le agenda la visita sin compromiso con José Antonio', feed: 'Visita sin compromiso agendada · jueves 10:00', vista: 'agenda', toque: true,
            cambio: { etapa: 4, s: { cita: 2160, citaOk: true }, conv: ['a', 'wa', 'Sí, hay opciones de bonificación y te las cuenta él. Te dejo la visita sin compromiso con José Antonio Padilla, director de la escuela: jueves a las 10:00, en vuestra oficina o por videollamada. ¿Cuál prefieres?'] } },
          { dur: 0, min: 1, txt: 'Aviso a José Antonio con la ficha completa', feed: 'Aviso enviado a José Antonio', humano: { titulo: 'Ricardo está listo para la visita', texto: 'Distribuciones Axarquía · 34 empleados · 6 comerciales · facturación plana dos años · cada comercial con su Excel · quiere actuar antes de enero · pregunta por bonificación. Visita el jueves a las 10:00.' } }
        ]
      },
      curso: {
        titulo: 'Una directora comercial pide el curso para su equipo y se reserva la plaza de su sector antes que la competencia',
        contacto: { id: 'demo', n: 'Inés Calvo', rol: 'Directora comercial', emp: 'Climatización Guadalhorce', seg: 'empresa', ciudad: '—', prod: 'Aprender a Vender Valor', orig: 'c1', canal: 'wa', etapa: 1, valor: 2250, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Inés pide información de Aprender a Vender Valor desde un anuncio de Meta', feed: 'Nueva solicitud · Aprender a Vender Valor', cambio: {} },
          { dur: 6, min: 1, txt: 'Le llega un WhatsApp en el minuto uno', feed: 'WhatsApp enviado en 47 segundos', cambio: { conv: ['a', 'wa', 'Hola Inés, soy Elena, de Hiágora. Te escribo por Aprender a Vender Valor. ¿Sería para ti o para tu equipo? Te lo pregunto porque admitimos una sola empresa por sector en cada edición.'] }, toque: true },
          { dur: 7, min: 9, txt: 'Inés contesta: para ella y dos comerciales', feed: 'Respuesta: 3 plazas · climatización', cambio: { etapa: 2, tam: 22, ciudad: 'Cártama', f: { comerciales: 4 }, s: { conv: true }, conv: ['c', 'wa', 'Para mí y dos comerciales. Somos de climatización. ¿Cuándo es la próxima?'] }, act: true },
          { dur: 7, min: 1, txt: 'Se le confirma que su sector está libre en la próxima edición', feed: 'Plaza del sector disponible · se ofrece reservar', cambio: { etapa: 3, conv: ['a', 'wa', 'Climatización está libre en la próxima edición, tres martes por la tarde. ¿Os reservo el sector mientras lo confirmas? Lo mantenemos 48 horas.'] }, toque: true },
          { dur: 6, min: 4, txt: 'Inés reserva y pregunta por la bonificación', feed: 'Sector reservado · pide bonificación', cambio: { etapa: 4, s: { fundaeQ: true, precio: true, urg: true, urgTxt: 'quiere asegurar la plaza de su sector' }, conv: ['c', 'wa', 'Resérvalo. ¿Se puede bonificar?'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso a José Antonio: cerrar la inscripción', feed: 'Aviso enviado a José Antonio', humano: { titulo: 'Inés quiere 3 plazas', texto: 'Climatización Guadalhorce · 22 empleados · 4 comerciales · 3 plazas en Aprender a Vender Valor · sector reservado 48 h · pregunta por bonificación. Llamada corta para cerrar la inscripción.' } }
        ]
      }
    },
    historiaDefecto: 'consultoria',

    contactos: [
      // --- Lo que está caliente ahora mismo
      { id: 'h01', n: 'Alfonso Ruiz', rol: 'Gerente', emp: 'Recambios Costa Sol', seg: 'empresa', tam: 48, ciudad: 'Málaga', prod: 'Consultoría · Check Comercial', orig: 'c2', canal: 'wa', etapa: 3, valor: 9000, creado: 3 * D, act: 23, toque: 40,
        f: { comerciales: 7 }, s: { temario: true, fundaeQ: true, visitas: 4, precio: true, urg: true, urgTxt: 'quiere el plan comercial cerrado antes de enero', resp: true },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Alfonso, soy Elena, de Hiágora. ¿Qué os preocupa más: captar o cerrar?'], [3 * D - 50, 'c', 'wa', 'Cerrar. Siete comerciales y cada uno a su aire.'], [45, 'c', 'wa', 'Quiero tener el plan cerrado antes de enero. ¿Cuándo podéis venir?']],
        ev: [[23, 'web', 'Vuelve a la página de consultoría']] },
      { id: 'h02', n: 'Marisa Peña', rol: 'Directora comercial', emp: 'Grupo Inmobiliario Bahía', seg: 'empresa', tam: 30, ciudad: 'Marbella', prod: 'Formación In Company', orig: 'c5', canal: 'email', etapa: 4, valor: 4800, creado: 9 * D, act: 5 * H, toque: 5 * D,
        f: { comerciales: 12 }, s: { prop: 5 * D, propVista: 3, visitas: 2 },
        conv: [[9 * D, 'c', 'email', 'Nos ha recomendado Trasteros Plus. Queremos una jornada para 12 comerciales.'], [5 * D, 'h', 'email', 'Te envío la propuesta in-company con dos fechas posibles.']],
        ev: [[5 * H, 'web', 'Abre la propuesta por tercera vez']] },
      { id: 'h03', n: 'Javier Montes', rol: 'Comercial senior', emp: 'Ferretería Industrial Málaga', seg: 'empresa', tam: 15, ciudad: 'Málaga', prod: 'Vendedor Digital en la Era de la IA', orig: 'c3', canal: 'wa', etapa: 3, valor: 550, creado: 26 * H, act: 17, toque: 20,
        f: { comerciales: 3 }, s: { visitas: 3, precio: true, conv: true },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Javier, ¿el curso de IA sería para ti o para el equipo?'], [25 * H, 'c', 'wa', 'Para mí, y si me gusta se apuntan los otros dos.'], [17, 'c', 'wa', '¿Hay plazas presenciales para la próxima?']] },
      { id: 'h04', n: 'Carmen Ortega', rol: 'Dueña', emp: 'Clínica Estética Ortega', seg: 'empresa', tam: 9, ciudad: 'Fuengirola', prod: 'Aprender a Vender Valor', orig: 'c1', canal: 'wa', etapa: 1, valor: 750, creado: 12, act: 12, toque: null,
        f: { comerciales: 2 }, s: { visitas: 1 }, conv: [] },
      { id: 'h05', n: 'Rafael Gil', rol: 'CEO', emp: 'Logística Antequera', seg: 'empresa', tam: 85, ciudad: 'Antequera', prod: 'Consultoría · Check Comercial', orig: 'c2', canal: 'tel', etapa: 1, valor: 12000, creado: 34, act: 34, toque: null,
        f: { comerciales: 9 }, s: { temario: true }, conv: [] },
      { id: 'h06', n: 'Lucía Benítez', rol: 'Directora general', emp: 'Bodegas Serranía', seg: 'empresa', tam: 26, ciudad: 'Ronda', prod: 'Máster en Dirección Comercial', orig: 'c4', canal: 'email', etapa: 4, valor: 2400, creado: 11 * D, act: 3 * D, toque: 3 * D,
        f: { comerciales: 4 }, s: { noshow: true, precio: true, visitas: 3 },
        conv: [[11 * D, 'a', 'email', 'Hola Lucía, te escribo por el Máster en Dirección Comercial.'], [10 * D, 'c', 'email', 'Me interesa para mí, quiero profesionalizar la venta a distribuidores.'], [4 * D, 'a', 'email', 'Te espera José Antonio mañana a las 17:00 por videollamada.']],
        ev: [[3 * D, 'sistema', 'No se presenta a la visita sin compromiso']] },
      { id: 'h07', n: 'Pablo Serrano', rol: 'Gerente', emp: 'Reformas Torremolinos', seg: 'empresa', tam: 18, ciudad: 'Torremolinos', prod: 'Aprender a Vender Valor', orig: 'c1', canal: 'wa', etapa: 2, valor: 1500, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { comerciales: 2 }, s: { visitas: 2, precio: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Pablo, ¿sería para ti o para tu equipo?'], [4 * D, 'c', 'wa', 'Para mí y mi socio. ¿Precio?'], [4 * D - 5, 'a', 'wa', 'Depende de cuántas plazas y de la bonificación. ¿Lo vemos 10 minutos?']] },
      // --- Dijeron «más adelante»
      { id: 'h08', n: 'Elena Morales', rol: 'Directora comercial', emp: 'Seguros Axarquía', seg: 'empresa', tam: 40, ciudad: 'Vélez-Málaga', prod: 'Formación In Company', orig: 'c5', canal: 'email', etapa: 3, valor: 4800, creado: 45 * D, act: 35 * D, toque: 35 * D,
        f: { comerciales: 14 }, s: { luego: 'enero', luegoTxt: 'lo retoma en enero, con el presupuesto de formación del año' },
        conv: [[35 * D, 'c', 'email', 'Gracias. Lo retomamos en enero, cuando tengamos el presupuesto de formación.']] },
      { id: 'h09', n: 'Tomás Herrera', rol: 'Socio fundador', emp: 'Asesoría Herrera & Vela', seg: 'empresa', tam: 12, ciudad: 'Málaga', prod: 'Consultoría · Check Comercial', orig: 'c2', canal: 'wa', etapa: 3, valor: 6000, creado: 30 * D, act: 28 * D, toque: 28 * D,
        f: { comerciales: 3 }, s: { temario: true, luego: 'febrero', luegoTxt: 'después del cierre fiscal de enero' },
        conv: [[28 * D, 'c', 'wa', 'Ahora estamos con los cierres. En febrero, sin falta.']] },
      // --- Sin seguimiento después de contestar
      { id: 'h10', n: 'Sonia Prieto', rol: 'Gerente', emp: 'Mobiliario Oficina Sur', seg: 'empresa', tam: 21, ciudad: 'Málaga', prod: 'Consultoría · Check Comercial', orig: 'c2', canal: 'wa', etapa: 3, valor: 6000, creado: 8 * D, act: 5 * D, toque: 5 * D,
        f: { comerciales: 5 }, s: { temario: true, visitas: 2, conv: true },
        conv: [[8 * D, 'a', 'wa', 'Hola Sonia, ¿qué os preocupa más ahora mismo?'], [7 * D, 'c', 'wa', 'Que vendemos por precio y se nos come el margen.'], [5 * D, 'h', 'wa', 'Te llamo esta semana y lo vemos.']] },
      { id: 'h11', n: 'Diego Romero', rol: 'Comercial', emp: 'Autónomo', seg: 'particular', ciudad: 'Málaga', prod: 'Vendedor Digital en la Era de la IA', orig: 'c3', canal: 'wa', etapa: 2, valor: 550, creado: 10 * D, act: 7 * D, toque: 7 * D,
        f: {}, s: { precio: true },
        conv: [[10 * D, 'c', 'wa', '¿El de IA se puede hacer online?'], [7 * D, 'h', 'wa', 'Sí, te paso la info.']] },
      // --- Nuevos o sin respuesta
      { id: 'h12', n: 'Andrés Cano', rol: 'Gerente', emp: 'Talleres Cano', seg: 'empresa', tam: 11, ciudad: 'Estepona', prod: 'Consultoría · Check Comercial', orig: 'c2', canal: 'wa', etapa: 1, valor: 6000, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { comerciales: 2 }, s: { temario: true, intentos: 1 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Andrés, soy Elena, de Hiágora. ¿Pudiste ver el dossier?']] },
      { id: 'h13', n: 'Nerea Vidal', rol: 'Estudiante de ADE', seg: 'particular', ciudad: 'Málaga', prod: 'Vendedor Digital en la Era de la IA', orig: 'c3', canal: 'wa', etapa: 1, valor: 550, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { estudiante: true, gratis: true }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Nerea, ¿sería para ti o para tu empresa?']] },
      // --- Ya clientes
      { id: 'h14', n: 'Antonio Lara', rol: 'Gerente', emp: 'Dulcería Lara', seg: 'empresa', tam: 35, ciudad: 'Málaga', prod: 'Aprender a Vender Valor', orig: 'c1', canal: 'wa', etapa: 5, valor: 2250, creado: 60 * D, act: 8 * D, toque: 8 * D, fin: 'ganado',
        f: { comerciales: 5 }, s: { exp: true, expTxt: 'Pregunta por formar al resto del equipo in-company' },
        conv: [[8 * D, 'c', 'wa', 'El curso nos ha venido muy bien. ¿Podríais darlo en la empresa para los otros cinco?']] },
      { id: 'h15', n: 'Gloria Fuentes', rol: 'Directora general', emp: 'Viveros del Sol', seg: 'empresa', tam: 28, ciudad: 'Coín', prod: 'Consultoría · Check Comercial', orig: 'c5', canal: 'email', etapa: 5, valor: 9000, creado: 90 * D, act: 10 * D, toque: 10 * D, fin: 'ganado',
        f: { comerciales: 4 }, s: { exp: true, expTxt: 'Quiere pasar del Check Comercial al acompañamiento de 6 meses' },
        conv: [[10 * D, 'c', 'email', 'El diagnóstico nos ha abierto los ojos. ¿Cómo sería seguir con vosotros seis meses?']] }
    ]
  };
})();

/* Sector: Formación marítima homologada (centro de formación para la gente de mar y para empresas del sector).
 * Dos compradores: (a) la persona que necesita renovar o sacar un certificado para embarcar o por
 * caducidad (urgencia), y (b) la empresa (flota, náutica, puerto) que forma a su tripulación o equipo.
 * Aquí casi no hay anuncios: las «campañas» son fuentes (web y Google, teléfono, referencias,
 * WhatsApp, un anuncio de prueba y la base de datos antigua para reactivar caducidades).
 * Todos los nombres, empresas, cursos, fechas e importes son inventados: datos de ejemplo.
 * El nombre del centro nunca va aquí: llega por el parámetro de URL «empresa». */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };
  const Q = window.QV.voz;
  const hc = Q.hueco(9);

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.maritima = {
    id: 'maritima',
    nombre: 'Formación marítima',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso', Producto: 'Curso',
      paginaVisitas: 'la ficha del curso', cita: 'convocatoria', Cita: 'Convocatoria', laCita: 'la convocatoria',
      propuesta: 'el presupuesto', Propuesta: 'Presupuesto', comercial: 'el asesor de formación', Comercial: 'Asesor de formación',
      cliente: 'alumno', unCliente: 'un alumno', clientes: 'alumnos', convierten: 'se matriculan',
      objetivoPaso: 'reservarle plaza en la próxima convocatoria', casoExito: 'el testimonio de un alumno que hizo el mismo curso', valorAlto: 1500,
      oportunidades: 'interesados', atencion: 'interesados que requieren atención', laVenta: 'la matrícula', propuestas: 'presupuestos',
      verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'trabajadores',
      pasoHumano: 'confirmar fechas y validez del certificado y cerrar la plaza',
      nombreAgenteVoz: 'Inés',
      senales: { nueva: 'Petición nueva', noshow: 'Plaza en riesgo', propuesta: 'Presupuesto sin respuesta', revision: 'Certificado a punto de caducar', expansion: 'La empresa quiere formar a más gente' },
      anunciosIntro: 'Aquí casi no hay anuncios. Cada fila es una fuente: la web y Google, el teléfono, las referencias, el WhatsApp, un anuncio de prueba y la base de datos antigua. El sistema une cada fuente con lo que pasa después: quién recibe respuesta, quién reserva plaza y quién se matricula y paga.',
      notaTitulo: 'Qué cambiaría este mes en las fuentes', notaBoton: 'Redactar la nota de fuentes',
      notaIntro: 'Esto es lo que cambiaría este mes en la captación, cruzando cada fuente con lo que pasa después.',
      preguntaNota: '¿Qué cambiaríamos este mes en las fuentes de captación?', notaAsunto: 'Asunto: Fuentes de captación · qué cambiar', notaCorreo: 'Nota de fuentes'
    },
    // Fuente → Petición de información → Respuesta → Cualificado → Reserva de plaza → Asistencia → Matrícula y pago
    recorrido: [
      { id: 'anuncio', txt: 'Fuente', sinFuga: true },
      { id: 'info', txt: 'Petición de información' },
      { id: 'contactado', txt: 'Respuesta' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'plaza', txt: 'Reserva de plaza' },
      { id: 'asistencia', txt: 'Asistencia' },
      { id: 'matricula', txt: 'Matrícula y pago' }
    ],
    ventaEtapa: 'matricula',
    ticket: 280,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.9, cualificado: 0.72, plaza: 0.62, asistencia: 0.9, matricula: 0.92 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'peticiones que llegan fuera de horario o en fin de semana y se contestan al día siguiente, cuando ya han reservado en otro sitio' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones en las que nadie pregunta para cuándo lo necesita ni qué certificado le piden' },
      plaza: { txt: 'Reserva de plaza y presupuestos', exp: 'cualificados a los que nadie cierra la plaza y empresas que piden presupuesto y no vuelven' },
      asistencia: { txt: 'Asistencia', exp: 'plazas reservadas que no se confirman o no se presentan a la convocatoria' },
      matricula: { txt: 'Matrícula y pago', exp: 'plazas reservadas que no terminan en matrícula pagada' }
    },
    remedioFuga: {
      contactado: 'Respuesta en el minuto uno a cualquier hora, también de noche y en fin de semana: el agente contesta con el curso que encaja y la próxima convocatoria, y deja el hilo preparado para el asesor por la mañana.'
    },
    mesDatos: { respuestaAntes: 640, respuestaAhora: 1, agendadas: 89 },
    campanas: [
      { id: 'c1', canal: 'Web y Google', nombre: 'Búsquedas de cursos y renovaciones de certificado', inversion: 0, ticket: 280,
        embudo: { anuncio: 5200, info: 96, contactado: 60, cualificado: 40, plaza: 22, asistencia: 17, matricula: 13 } },
      { id: 'c2', canal: 'Teléfono', nombre: 'Llamadas entrantes al centro', inversion: 0, ticket: 300,
        embudo: { anuncio: 120, info: 58, contactado: 52, cualificado: 40, plaza: 25, asistencia: 21, matricula: 17 } },
      { id: 'c3', canal: 'Referencias', nombre: 'Flotas, náuticas y capitanes que recomiendan', inversion: 0, ticket: 2600,
        embudo: { anuncio: 36, info: 32, contactado: 30, cualificado: 24, plaza: 14, asistencia: 11, matricula: 9 } },
      { id: 'c4', canal: 'WhatsApp', nombre: 'Mensajes directos al WhatsApp del centro', inversion: 0, ticket: 260,
        embudo: { anuncio: 240, info: 84, contactado: 38, cualificado: 22, plaza: 10, asistencia: 7, matricula: 5 } },
      { id: 'c5', canal: 'Meta', nombre: 'Anuncio de prueba · renovación de certificados', inversion: 150, ticket: 250,
        embudo: { anuncio: 6400, info: 20, contactado: 11, cualificado: 6, plaza: 3, asistencia: 2, matricula: 1 } },
      { id: 'c6', canal: 'Base de datos', nombre: 'Base antigua · alumnos con el certificado a punto de caducar', inversion: 0, ticket: 270,
        embudo: { anuncio: 380, info: 44, contactado: 37, cualificado: 26, plaza: 15, asistencia: 12, matricula: 10 } }
    ],
    kpis: ['interesados', 'respuesta', 'cualificados', 'plazas', 'entrevistas', 'show', 'ventas', 'ingresos', 'caducan', 'roas'],
    kpiNombres: { interesados: 'Peticiones de información', cualificados: 'Interesados cualificados', entrevistas: 'Asisten a la convocatoria', ventas: 'Matrículas', ingresos: 'Facturación del mes' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'asistencia' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      return {
        plazas: { l: 'Plazas reservadas', v: M.num(m.tot.plaza), em: M.pct(m.tot.plaza / Math.max(1, m.tot.cualificado)) + ' de los cualificados' },
        caducan: { l: 'Certificados que caducan pronto', v: M.num(cs.filter(function (c) { return c.s.revision || (c.f && c.f.caduca && !c.fin); }).length), em: 'a recuperar con un aviso a tiempo', clase: 'bien' }
      };
    },
    agenda: { horas: [8, 20], pausa: [14, 16], ocupacion: 0.5, etapa: 'plaza', sabado: true,
      tipos: ['Convocatoria · renovación', 'Convocatoria · empresa', 'Convocatoria · curso completo', 'Llamada con el asesor', 'Convocatoria · grupo'] },
    veredictoAnuncio: function (f, Mo) {
      const e = f.c.embudo;
      if (f.c.inversion > 0) {
        return { id: 'prueba', txt: 'En prueba', tono: 't-amber', por: 'Solo ' + Mo.num(e.info) + ' peticiones y ' + Mo.pl(e.matricula, 'matrícula', 'matrículas') + ': son pocos datos para decidir. Dejadlo correr y mirad cuántas peticiones llegan a matrícula, no solo al formulario.' };
      }
      return { id: 'organico', txt: 'Sin inversión', tono: 't-gris', por: 'No tiene coste de anuncio. De los que reciben respuesta, acaba matriculado el ' + Mo.pct(f.post) + '.' };
    },
    notaAnuncios: function (a, T, Mo) {
      const lin = [];
      const fi = function (id) { return a.filas.filter(function (f) { return f.c.id === id; })[0]; };
      const p = fi('c5'), w = fi('c1'), b = fi('c6'), r = fi('c3'), m = fi('c4');
      if (p) lin.push('Anuncio de prueba en Meta: ' + p.entra + ' peticiones a ' + Mo.euros(p.cpl) + ' cada una y ' + Mo.pl(p.ventas, 'matrícula', 'matrículas') + '. Todavía son pocos datos para escalar: dejadlo correr y juzgadlo por las matrículas, no por el formulario.');
      if (w) lin.push('Web y Google trae más peticiones (' + w.entra + ') que ninguna otra fuente, pero solo el ' + Mo.pct(w.c.embudo.contactado / w.c.embudo.info) + ' recibe respuesta. Antes de pagar más tráfico, hay que arreglar la respuesta fuera de horario.');
      if (m) lin.push('El WhatsApp es la fuente que peor convierte: de ' + m.entra + ' peticiones, ' + Mo.pl(m.ventas, 'matrícula', 'matrículas') + '. Se contesta tarde, no es que el canal sea malo.');
      if (b) lin.push('La base antigua trajo ' + Mo.pl(b.ventas, 'matrícula', 'matrículas') + ' sin gastar en anuncios: avisar a cada alumno antes de que le caduque el certificado es la matrícula más barata. Repetidlo todos los meses.');
      if (r) lin.push('Las referencias son pocas pero grandes: cada matrícula es de empresa, ' + Mo.euros(r.c.ticket) + ' de media. Merece la pena pedir recomendación a cada empresa que repite.');
      return lin;
    },
    bannerAnuncios: false, // con un solo anuncio de prueba no hay comparación que enseñar
    timelineSinOrigen: true,
    textoAlta: function (c) {
      const cp = (window.QV_SECTORES.maritima.campanas || []).filter(function (x) { return x.id === c.orig; })[0];
      return 'Petición de información · ' + c.prod + (cp ? ' · desde ' + cp.canal : '');
    },

    reglas: {
      fitBase: 26,
      fit: [
        [function (c) { return c.f && c.f.embarque; }, 22, function (c) { return 'tiene embarque a la vista: ' + c.f.embarque; }, 'Embarque a la vista'],
        [function (c) { return c.f && c.f.caduca; }, 18, function (c) { return 'su certificado caduca ' + c.f.caduca; }, 'Certificado a punto de caducar'],
        [function (c) { return c.f && c.f.titulo; }, 10, 'ya tiene la titulación previa que pide el curso', 'Cumple los requisitos previos'],
        [function (c) { return c.f && c.f.cerca; }, 8, 'vive cerca del centro'],
        [function (c) { return c.f && c.f.empresaPaga; }, 10, 'su armador o su empresa le paga el curso', 'Lo paga su empresa'],
        [function (c) { return c.seg === 'empresa' && c.tam >= 30; }, 28, function (c) { return 'empresa de ' + c.tam + ' trabajadores'; }, 'Empresa de 30 trabajadores o más'],
        [function (c) { return c.seg === 'empresa' && c.tam >= 8 && c.tam < 30; }, 16, function (c) { return 'empresa de ' + c.tam + ' trabajadores'; }, 'Empresa de 8 a 29 trabajadores'],
        [function (c) { return c.seg === 'empresa' && tieneRol(c, /armador|flota|gerente|director|responsable|jefe|capit|recursos|rr\. ?hh|personas|seguridad|calidad/i); }, 14, function (c) { return 'decide la formación (' + c.rol + ')'; }, 'Su puesto decide la formación'],
        [function (c) { return c.f && c.f.dotacion >= 6; }, 12, function (c) { return 'forma a ' + c.f.dotacion + ' personas a la vez'; }, 'Grupo de 6 personas o más'],
        [function (c) { return c.f && c.f.bonifica; }, 8, 'puede bonificar la formación'],
        [function (c) { return c.valor >= 1500; }, 6, 'formación de grupo, ticket alto'],
        [function (c) { return c.f && c.f.curioso; }, -22, 'curiosidad: no trabaja ni va a trabajar en el mar', 'Sin vínculo con el sector'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca formación gratuita o subvencionada por empleo'],
        [function (c) { return c.f && c.f.lejos; }, -16, function (c) { return 'vive lejos (' + c.f.lejos + ')'; }, 'Vive lejos del centro'],
        [function (c) { return c.f && c.f.otroCurso; }, -12, 'pide un curso que el centro no imparte']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 14, 'preguntó por la próxima convocatoria'],
        [function (c) { return c.s.valido; }, 12, 'preguntó si el certificado le vale para embarcar'],
        [function (c) { return c.s.docs; }, 10, 'preguntó qué documentación tiene que traer'],
        [function (c) { return c.s.pidePpto; }, 14, 'pidió presupuesto para el grupo'],
        [function (c) { return c.s.fuera && !c.fin; }, 14, 'escribió fuera de horario: quien escribe de noche lo necesita ya'],
        [function (c) { return c.etapa === 5 && !c.fin; }, 22, 'ya asistió y solo falta formalizar la matrícula']
      ],
      riesgo: [
        [function (c, k) { return c.s.fuera && !c.fin && !c.conv.length; }, 46, function (c, k) { return 'lleva ' + QV.motor.duracion(k.creado) + ' sin primera respuesta (escribió fuera de horario)'; }]
      ]
    },

    nba: function (c, k, x, T, M) {
      if (c.fin === 'ganado' && c.s.revision && !c.s.exp) {
        return { id: 'recordatorio', accion: 'Aviso de caducidad con las próximas convocatorias', quien: 'Automatización', tipo: 'auto', estado: 'esperando',
          por: (c.s.revisionTxt || 'Su certificado caduca pronto') + '. Sale un mensaje con las dos próximas convocatorias antes de la fecha de caducidad y el enlace para reservar plaza, sin que nadie tenga que llamar.' };
      }
      if (c.s.fuera && !c.fin && !c.conv.length) {
        return { id: 'wa', accion: 'Respuesta inmediata por ' + (c.canal === 'email' ? 'correo' : 'WhatsApp'), quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Escribió fuera de horario (' + M.hace(k.creado) + ') y nadie le ha contestado. El agente le responde ya con el curso que encaja y la próxima convocatoria, y deja el hilo listo para el asesor por la mañana: quien necesita el certificado no espera al siguiente día.' };
      }
      if (c.seg === 'empresa' && c.s.pidePpto && c.s.tProp == null && !c.fin && M.contesto(c) > 0 && c.valor >= T.valorAlto) {
        return { id: 'comercial', accion: 'Avisar al asesor de formación', quien: T.Comercial, tipo: 'humano', estado: 'humano',
          por: 'Pide presupuesto para un grupo (' + M.euros(c.valor) + ') y ya está en conversación. El agente no da precios ni condiciones: pasa el hilo al asesor con todo resumido, para que el presupuesto salga hoy.' };
      }
      if (c.etapa === 5 && !c.fin) {
        return { id: 'cobro', accion: 'Recordar la matrícula y el pago', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Asistió a la convocatoria y la matrícula sigue sin formalizar. Un mensaje con el enlace de pago y lo que falta del expediente lo cierra sin llamar; si no responde, el asesor lo ve en la señal.' };
      }
      return M.nbaGenerica(c, k, x, T);
    },
    vozDijo: function (c) { return c.f && c.f.embarque ? ['Embarque: ' + c.f.embarque] : []; },
    vozMotivo: function (c) { return 'Pide información de «' + c.prod + '».'; },

    preguntas: [
      { q: '¿A quién le caduca el certificado en las próximas semanas?', h: 'lista', obj: ['retencion', 'seguimiento', 'todo'],
        filtro: function (c) { return !!c.s.revision || !!(c.f && c.f.caduca && !c.fin); }, orden: 'prob',
        intro: function (l) { return l.length + ' personas tienen el certificado a punto de caducar. Quien necesita renovar lo hace sí o sí: gana quien le avisa a tiempo con una convocatoria concreta.'; },
        vista: 'tabla' },
      { q: '¿Qué empresas pidieron presupuesto y no han vuelto?', h: 'lista', obj: ['ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return c.seg === 'empresa' && c.s.tProp != null && !c.fin; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' empresas tienen un presupuesto enviado y sin respuesta, por ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '. Las grandes las llama el asesor con el contexto delante; el resto, el agente con la duda más habitual.'; },
        vista: 'tabla' },
      { q: '¿Quién escribió fuera de horario y sigue sin respuesta?', h: 'lista', obj: ['seguimiento', 'captacion', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.fuera; }, orden: 'prob',
        intro: function (l) { return l.length + ' peticiones llegaron de noche o en fin de semana y no tienen primera respuesta. Quien necesita el certificado para embarcar no espera a la mañana: escribe al siguiente centro.'; },
        vista: 'tabla' },
      { q: '¿Qué plazas reservadas están en riesgo de no matricularse?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa >= 4 && (c.s.noshow || !c.s.citaOk); }, orden: 'prob',
        intro: function (l) { return l.length + ' plazas reservadas no están confirmadas o ya fallaron una vez. El recordatorio con el enlace de pago sale solo; a quien no vino, el agente le propone otra convocatoria.'; },
        vista: 'tabla' },
      { q: '¿Qué interesados tienen más probabilidad de matricularse?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Qué fuente está trayendo matrículas?', h: 'campanas', obj: ['captacion', 'todo'] }
    ],

    historias: {
      persona: {
        titulo: 'Un marinero pide renovar de madrugada',
        contacto: { id: 'demo', n: 'Iván Barreiro', rol: 'Marinero · embarca en dos semanas', seg: 'persona', ciudad: '—', prod: 'Formación básica en seguridad · renovación', orig: 'c1', canal: 'wa', etapa: 1, valor: 250, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Sábado, 00:40: entra una petición nueva desde la web', feed: 'Nueva petición · Formación básica en seguridad (renovación)', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · embarca en dos semanas · le caduca el certificado', cambio: { ciudad: 'Vigo', f: { embarque: 'en dos semanas', caduca: 'antes de embarcar', titulo: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno, de madrugada', feed: 'WhatsApp enviado en 44 segundos', cambio: { conv: ['a', 'wa', 'Hola Iván, soy Inés, del centro de formación. Te escribo por la renovación de la formación básica en seguridad. ¿Para cuándo necesitas tenerlo, para embarcar?'] }, toque: true },
          { dur: 6, min: 9, txt: 'Iván mira la ficha del curso dos veces más', feed: 'Visita la ficha del curso (3 veces)', cambio: { s: { visitas: 3 } }, act: true },
          { dur: 7, min: 2, txt: 'Iván contesta: embarca en dos semanas y pregunta por la próxima convocatoria', feed: 'Respuesta recibida · pregunta la próxima convocatoria', cambio: { etapa: 2, s: { conv: true, valido: true, urg: true, urgTxt: 'embarca en dos semanas y le caduca el certificado' }, conv: ['c', 'wa', 'Embarco en dos semanas y el certificado me caduca antes. ¿Cuándo es la próxima convocatoria y me vale para embarcar?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente responde con la convocatoria que llega a tiempo y cualifica', feed: 'Convocatoria propuesta', cambio: { etapa: 3, conv: ['a', 'wa', 'Hay convocatoria el ' + hc.txt + ' por la mañana: llegas con margen a tu embarque y el certificado es el homologado. ¿Te reservo plaza? Solo necesito saber si tienes el certificado médico en vigor.'] }, toque: true },
          { dur: 7, min: 4, txt: 'Iván confirma que lo tiene todo y pide la plaza', feed: 'Intención alta · pide la plaza', cambio: { s: { docs: true }, conv: ['c', 'wa', 'Sí, el médico lo tengo hecho. Resérvame plaza, por favor.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente reserva la plaza y le manda el enlace de matrícula y pago', feed: 'Plaza reservada · convocatoria del ' + hc.txt, cambio: { etapa: 4, s: { cita: hc.min, citaOk: true }, conv: ['a', 'wa', 'Hecho: plaza reservada el ' + hc.txt + ' a las 9:00. Aquí tienes el enlace para formalizar la matrícula y el pago. El día antes te mando el recordatorio con la hora y qué traer.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: la plaza de Iván está reservada', feed: 'Aviso enviado al asesor de formación', humano: { titulo: 'Iván tiene plaza reservada para el ' + hc.txt, texto: 'Marinero · embarca en dos semanas · le caduca el certificado · renovación de seguridad básica · tiene el certificado médico en vigor. Escribió de madrugada y se le contestó en 44 segundos. Falta que formalice la matrícula y el pago.' } }
        ]
      },
      empresa: {
        titulo: 'Una empresa pide presupuesto',
        contacto: { id: 'demo', n: 'Lorena Pazos', rol: 'Responsable de Flota', emp: 'Pesquera Mar de Fondo', seg: 'empresa', tam: 42, ciudad: '—', prod: 'Formación a la tripulación (in-company)', orig: 'c3', canal: 'wa', etapa: 1, valor: 4800, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una petición de una empresa por recomendación de un capitán', feed: 'Nueva petición · formación a la tripulación (in-company)', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: empresa, tamaño, a quién forma', feed: 'Ficha completada · 42 trabajadores · 14 tripulantes a formar', cambio: { tam: 42, ciudad: 'A Coruña', f: { dotacion: 14, bonifica: true } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 52 segundos', cambio: { conv: ['a', 'wa', 'Hola Lorena, soy Inés, del centro de formación. Me dice el capitán que queréis formar a vuestra tripulación. ¿A cuántas personas y para cuándo lo necesitáis?'] }, toque: true },
          { dur: 6, min: 8, txt: 'Lorena mira la página de formación para empresas', feed: 'Visita la ficha del curso · formación para empresas', cambio: { s: { visitas: 2 } }, act: true },
          { dur: 7, min: 3, txt: 'Lorena contesta: 14 tripulantes, antes de la veda, y pide presupuesto', feed: 'Respuesta recibida · pide presupuesto para el grupo', cambio: { etapa: 2, s: { pidePpto: true, conv: true, urg: true, urgTxt: 'quiere tener formada a la dotación antes de la próxima campaña' }, conv: ['c', 'wa', 'Son 14 tripulantes y queremos tenerlos formados antes de que empiece la campaña. ¿Me pasáis presupuesto? ¿Se puede bonificar?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente cualifica con una sola pregunta', feed: 'Pregunta de cualificación enviada', cambio: { etapa: 3, conv: ['a', 'wa', 'Se puede bonificar y la gestión la hacemos nosotros. Para dejarte el presupuesto exacto, ¿lo preferís en vuestras instalaciones o en el centro, en grupos de siete?'] }, toque: true },
          { dur: 7, min: 4, txt: 'Lorena elige formato y fechas', feed: 'Presupuesto confirmado · pide el presupuesto esta semana', cambio: { s: { precio: true, ppto: 'si', pptoTxt: 'tiene crédito para formar a la dotación y quiere el presupuesto esta semana' }, conv: ['c', 'wa', 'En el centro, en dos grupos de siete. Y necesitamos el presupuesto esta semana para aprobarlo.'] }, act: true },
          { dur: 6, min: 1, txt: 'El agente reserva las plazas y avisa al asesor', feed: 'Dos convocatorias preparadas · plazas reservadas', cambio: { etapa: 4, s: { cita: hc.min, citaOk: true }, conv: ['a', 'wa', 'Perfecto: dejo reservadas dos convocatorias de siete personas, la primera el ' + hc.txt + '. Te llama Javier, nuestro asesor de formación para empresas, y os envía el presupuesto cerrado con la bonificación.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Lorena está lista para recibir el presupuesto', feed: 'Aviso enviado al asesor de formación', humano: { titulo: 'Lorena está lista para recibir el presupuesto', texto: '14 tripulantes · en el centro, dos grupos de siete · bonificable · quiere el presupuesto esta semana para aprobarlo · tiene que estar formada antes de la campaña. Dos convocatorias reservadas, la primera el ' + hc.txt + '.' } }
        ]
      }
    },
    historiaDefecto: 'persona',

    contactos: [
      // --- Lo que está caliente ahora mismo (urgencia de personas)
      { id: 'm01', n: 'Rubén Cabaleiro', rol: 'Marinero · embarca en 9 días', seg: 'persona', ciudad: 'Vigo', prod: 'Formación básica en seguridad · renovación', orig: 'c1', canal: 'wa', etapa: 3, valor: 250, creado: 3 * D, act: 18, toque: 25,
        f: { embarque: 'en 9 días', caduca: 'antes de embarcar', titulo: true, cerca: true }, s: { visitas: 4, conv: true, valido: true, urg: true, urgTxt: 'embarca en 9 días y le caduca el certificado' },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Rubén, soy Inés, del centro de formación. ¿La renovación es para embarcar?'], [3 * D - 40, 'c', 'wa', 'Sí, embarco en 9 días y el certificado se me queda corto.'], [2 * D, 'a', 'wa', 'Tienes la convocatoria de la semana que viene. ¿Te viene bien por la mañana?'], [30, 'c', 'wa', '¿Hay plaza todavía? ¿Y me vale el certificado para embarcar?'], [25, 'a', 'wa', 'Hay plaza. Te llama el asesor para dejarlo cerrado hoy.']],
        ev: [[18, 'web', 'Visita la ficha del curso']] },
      { id: 'm02', n: 'Noelia Casal', rol: 'Oficial · certificado caduca en 3 semanas', seg: 'persona', ciudad: 'Gijón', prod: 'Formación sanitaria a bordo', orig: 'c4', canal: 'wa', etapa: 4, valor: 400, creado: 5 * D, act: 6 * H, toque: 20 * H,
        f: { caduca: 'en 3 semanas', titulo: true, empresaPaga: true }, s: { cita: 2 * D, citaOk: false, valido: true, docs: true, visitas: 2 },
        conv: [[5 * D, 'a', 'wa', 'Hola Noelia, ¿es la renovación de la sanitaria?'], [5 * D - 30, 'c', 'wa', 'Sí, me caduca en tres semanas. Lo paga la empresa.'], [3 * D, 'a', 'wa', 'Te reservo la convocatoria del jueves de la semana que viene. ¿La confirmo?'], [3 * D - 20, 'c', 'wa', 'Sí, resérvala.'], [20 * H, 'a', 'wa', 'Plaza reservada. Te dejo el enlace para formalizar la matrícula.']] },
      { id: 'm03', n: 'Aitor Mendizabal', rol: 'Escribió de madrugada · embarca pronto', seg: 'persona', ciudad: 'Bilbao', prod: 'Contraincendios y supervivencia en la mar', orig: 'c1', canal: 'wa', etapa: 1, valor: 320, creado: 10 * H, act: 10 * H, toque: null,
        f: { embarque: 'en menos de dos semanas', titulo: true }, s: { fuera: true, visitas: 2, urg: true, urgTxt: 'embarca en menos de dos semanas' }, conv: [] },
      { id: 'm04', n: 'Jesús Vilariño', rol: 'Maquinista · llamó al centro', seg: 'persona', ciudad: 'A Coruña', prod: 'Formación básica en seguridad · renovación', orig: 'c2', canal: 'tel', etapa: 2, valor: 250, creado: 2 * D, act: 30 * H, toque: 30 * H,
        f: { caduca: 'en 3 semanas', titulo: true, cerca: true }, s: { conv: true, visitas: 1 },
        conv: [[2 * D, 'a', 'wa', 'Hola Jesús, soy Inés. Me dejaste el teléfono por la renovación. ¿Te cuento las próximas convocatorias?'], [30 * H, 'c', 'wa', 'Sí, mándame las fechas, me caduca dentro de poco.']] },
      { id: 'm05', n: 'Sandra Amor', rol: 'Marinera · caduca el certificado', seg: 'persona', ciudad: 'Cádiz', prod: 'Contraincendios y supervivencia en la mar', orig: 'c4', canal: 'wa', etapa: 3, valor: 320, creado: 6 * D, act: 3 * D, toque: 3 * D,
        f: { caduca: 'en 5 semanas', titulo: true }, s: { visitas: 2, conv: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Sandra, ¿es renovación o curso completo?'], [5 * D, 'c', 'wa', 'Renovación. ¿Cuándo es la siguiente convocatoria?'], [3 * D, 'h', 'wa', 'Te lo confirmo esta semana.']] },
      { id: 'm06', n: 'Héctor Bouza', rol: 'Pide información ahora mismo', seg: 'persona', ciudad: 'Vigo', prod: 'Operador de radiocomunicaciones (certificado)', orig: 'c1', canal: 'wa', etapa: 1, valor: 300, creado: 14, act: 14, toque: null,
        f: { titulo: true, cerca: true }, s: { visitas: 1 }, conv: [] },
      // --- Peticiones sin respuesta fuera de horario
      { id: 'm07', n: 'Gabriel Otero', rol: 'Escribió el sábado · sin respuesta', seg: 'persona', ciudad: 'Avilés', prod: 'Formación sanitaria a bordo', orig: 'c4', canal: 'wa', etapa: 1, valor: 400, creado: 38 * H, act: 38 * H, toque: null,
        f: { caduca: 'en 4 semanas', titulo: true }, s: { fuera: true, visitas: 2 }, conv: [] },
      { id: 'm08', n: 'Marcos Seoane', rol: 'Jefe de Máquinas · escribió de noche', seg: 'persona', ciudad: 'Pasaia', prod: 'Formación básica en seguridad · renovación', orig: 'c1', canal: 'email', etapa: 1, valor: 250, creado: 12 * H, act: 12 * H, toque: null,
        f: { embarque: 'a final de mes', caduca: 'antes de embarcar', titulo: true }, s: { fuera: true, visitas: 3, emails: 1 }, conv: [] },
      { id: 'm09', n: 'Tamara Quintela', rol: 'Gerente', emp: 'Náutica Cala Honda', seg: 'empresa', tam: 14, ciudad: 'Cartagena', prod: 'Formación al equipo (in-company)', orig: 'c1', canal: 'email', etapa: 1, valor: 2400, creado: 11 * H, act: 11 * H, toque: null,
        f: { dotacion: 8, bonifica: true }, s: { fuera: true, visitas: 2, pidePpto: true }, conv: [] },
      { id: 'm10', n: 'Cristian Lago', rol: 'Pide información fuera de horario', seg: 'persona', ciudad: 'Huelva', prod: 'Patrón de embarcaciones de recreo', orig: 'c5', canal: 'wa', etapa: 1, valor: 450, creado: 9 * H, act: 9 * H, toque: null,
        f: { cerca: false }, s: { fuera: true, visitas: 1 }, conv: [] },
      // --- Empresas que piden presupuesto y no vuelven
      { id: 'm11', n: 'Joaquín Ferreiro', rol: 'Armador', emp: 'Pesqueros Bajamar', seg: 'empresa', tam: 85, ciudad: 'Vigo', prod: 'Formación a la tripulación (in-company)', orig: 'c3', canal: 'email', etapa: 4, valor: 9200, creado: 12 * D, act: 5 * H, toque: 5 * D,
        f: { dotacion: 28, bonifica: true }, s: { prop: 5 * D, propVista: 3, visitas: 3, pidePpto: true },
        conv: [[12 * D, 'a', 'email', 'Hola Joaquín, te escribo por la formación a vuestra tripulación.'], [11 * D, 'c', 'email', 'Somos unos 28 tripulantes entre tres barcos. ¿Nos enviáis presupuesto?'], [5 * D, 'h', 'email', 'Te envío el presupuesto con las convocatorias por barco y la bonificación.']],
        ev: [[5 * H, 'web', 'Abre el presupuesto por tercera vez']] },
      { id: 'm12', n: 'Elisa Brea', rol: 'Responsable de Flota', emp: 'Transportes Marítimos Estrecho Sur', seg: 'empresa', tam: 120, ciudad: 'Algeciras', prod: 'Formación a la tripulación (in-company)', orig: 'c3', canal: 'email', etapa: 4, valor: 7400, creado: 15 * D, act: 6 * D, toque: 6 * D,
        f: { dotacion: 20, bonifica: true }, s: { prop: 6 * D, propVista: 0, pidePpto: true },
        conv: [[15 * D, 'a', 'email', 'Hola Elisa, te escribo por la formación para vuestras dotaciones.'], [14 * D, 'c', 'email', 'Necesitamos formar a unas 20 personas antes de verano. Pasadnos presupuesto.'], [6 * D, 'h', 'email', 'Os adjunto el presupuesto.']] },
      { id: 'm13', n: 'Raúl Varela', rol: 'Jefe de Operaciones', emp: 'Servicios Portuarios Bahía Azul', seg: 'empresa', tam: 60, ciudad: 'Tarragona', prod: 'Formación al equipo (in-company)', orig: 'c3', canal: 'wa', etapa: 4, valor: 5200, creado: 18 * D, act: 9 * D, toque: 9 * D,
        f: { dotacion: 12, bonifica: true }, s: { prop: 9 * D, propVista: 1, pidePpto: true },
        conv: [[18 * D, 'a', 'wa', 'Hola Raúl, ¿para cuántas personas del puerto sería?'], [17 * D, 'c', 'wa', 'Unas 12, de operaciones. Mandadme presupuesto.'], [9 * D, 'h', 'wa', 'Te lo he enviado por correo, dime qué te parece.']] },
      { id: 'm14', n: 'Ismael Trujillo', rol: 'Director de Flota', emp: 'Charter Vela Latina', seg: 'empresa', tam: 22, ciudad: 'Palma', prod: 'Formación a la tripulación (in-company)', orig: 'c1', canal: 'email', etapa: 4, valor: 3200, creado: 7 * D, act: 3 * D, toque: 3 * D,
        f: { dotacion: 9 }, s: { prop: 3 * D, propVista: 2, pidePpto: true, visitas: 2 },
        conv: [[7 * D, 'a', 'email', 'Hola Ismael, te escribo por la formación de vuestras tripulaciones.'], [6 * D, 'c', 'email', 'Seríamos nueve entre dos veleros. ¿Presupuesto?'], [3 * D, 'h', 'email', 'Aquí tienes el presupuesto con dos fechas posibles.']] },
      { id: 'm15', n: 'Paula Miranda', rol: 'Responsable de Recursos Humanos', emp: 'Remolques Dársena Norte', seg: 'empresa', tam: 48, ciudad: 'Gijón', prod: 'Formación al equipo (in-company)', orig: 'c3', canal: 'email', etapa: 4, valor: 4400, creado: 22 * D, act: 12 * D, toque: 12 * D,
        f: { dotacion: 10, bonifica: true }, s: { prop: 12 * D, propVista: 1, pidePpto: true },
        conv: [[22 * D, 'a', 'email', 'Hola Paula, te escribo por la formación del equipo.'], [20 * D, 'c', 'email', 'Somos diez personas, queremos presupuesto de renovación de seguridad.'], [12 * D, 'h', 'email', 'Te envío el presupuesto de la renovación.']] },
      // --- Plazas reservadas que no se matriculan
      { id: 'm16', n: 'Adrián Lorenzo', rol: 'Plaza reservada hace 4 días · sin pago', seg: 'persona', ciudad: 'Vigo', prod: 'Contraincendios y supervivencia en la mar', orig: 'c2', canal: 'tel', etapa: 4, valor: 320, creado: 6 * D, act: 4 * D, toque: 4 * D,
        f: { embarque: 'el mes que viene', titulo: true, cerca: true }, s: { cita: 5 * D, citaOk: false, valido: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Adrián, soy Inés. Te dejo aquí lo que hablamos por teléfono.'], [4 * D, 'a', 'wa', 'Tienes la plaza reservada para la convocatoria. Aquí tienes el enlace para formalizar la matrícula.']] },
      { id: 'm17', n: 'Lorena Ibarra', rol: 'No se presentó a la convocatoria', seg: 'persona', ciudad: 'Bilbao', prod: 'Formación sanitaria a bordo', orig: 'c1', canal: 'wa', etapa: 4, valor: 400, creado: 10 * D, act: 3 * D, toque: 2 * D,
        f: { caduca: 'en 6 semanas', titulo: true }, s: { noshow: true, valido: true },
        conv: [[10 * D, 'a', 'wa', 'Hola Lorena, ¿es la renovación de la sanitaria?'], [9 * D, 'c', 'wa', 'Sí, apúntame a la del lunes.'], [2 * D, 'a', 'wa', 'Lorena, hoy no has podido venir. ¿Te propongo la siguiente convocatoria?']],
        ev: [[3 * D, 'sistema', 'No se presenta a la convocatoria']] },
      { id: 'm18', n: 'Manuel Pardal', rol: 'Cocinero de a bordo · asistió, sin pago', seg: 'persona', ciudad: 'Vigo', prod: 'Formación básica en seguridad · renovación', orig: 'c4', canal: 'wa', etapa: 5, valor: 250, creado: 9 * D, act: 3 * D, toque: 3 * D,
        f: { embarque: 'ya embarcado', titulo: true }, s: { docs: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Manuel, soy Inés. ¿Qué convocatoria te encaja?'], [8 * D, 'c', 'wa', 'La del lunes. Pago el día que vaya.'], [3 * D, 'h', 'wa', 'Gracias por venir. Te paso el enlace para cerrar la matrícula y el pago.']],
        ev: [[3 * D, 'sistema', 'Asiste a la convocatoria · matrícula sin formalizar']] },
      { id: 'm19', n: 'Dani Marín', rol: 'Plaza reservada · sin confirmar', seg: 'persona', ciudad: 'Málaga', prod: 'Patrón de embarcaciones de recreo', orig: 'c5', canal: 'wa', etapa: 4, valor: 450, creado: 4 * D, act: 30 * H, toque: 30 * H,
        f: {}, s: { cita: 26 * H, citaOk: false, visitas: 2 },
        conv: [[4 * D, 'a', 'wa', 'Hola Dani, ¿buscas el título para navegar por tu cuenta?'], [4 * D - 30, 'c', 'wa', 'Sí, quiero sacármelo este otoño.'], [30 * H, 'a', 'wa', 'Te dejo la plaza reservada para la convocatoria. ¿Me confirmas que vienes?']] },
      { id: 'm20', n: 'Alba Rouco', rol: 'Plaza reservada · convocatoria confirmada', seg: 'persona', ciudad: 'A Coruña', prod: 'Operador de radiocomunicaciones (certificado)', orig: 'c2', canal: 'tel', etapa: 4, valor: 300, creado: 5 * D, act: 5 * H, toque: 5 * H,
        f: { titulo: true, cerca: true }, s: { cita: 3 * D, citaOk: true, docs: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Alba, te dejo por escrito lo que hablamos por teléfono.'], [5 * H, 'a', 'wa', 'Confirmada tu plaza para el lunes. Trae el DNI y la foto.'], [5 * H - 10, 'c', 'wa', 'Perfecto, allí estaré.']] },
      // --- Caducidades próximas: base antigua
      { id: 'm21', n: 'Ana Belén Roca', rol: 'Hizo el curso hace casi 5 años', seg: 'persona', ciudad: 'Vigo', prod: 'Formación básica en seguridad · renovación', orig: 'c6', canal: 'wa', etapa: 6, valor: 250, creado: 1700 * D, act: 20 * D, toque: 20 * D, fin: 'ganado',
        f: { caduca: 'en 5 semanas', titulo: true, cerca: true }, s: { revision: true, revisionTxt: 'Su certificado de seguridad básica caduca en 5 semanas' }, conv: [] },
      { id: 'm22', n: 'Sergio Cabo', rol: 'Hizo el curso hace casi 5 años', seg: 'persona', ciudad: 'Cádiz', prod: 'Contraincendios y supervivencia en la mar', orig: 'c6', canal: 'wa', etapa: 6, valor: 320, creado: 1750 * D, act: 25 * D, toque: 25 * D, fin: 'ganado',
        f: { caduca: 'en 6 semanas', titulo: true }, s: { revision: true, revisionTxt: 'Su certificado de contraincendios caduca en 6 semanas' }, conv: [] },
      { id: 'm23', n: 'Verónica Lema', rol: 'Respondió al aviso de caducidad', seg: 'persona', ciudad: 'Gijón', prod: 'Formación sanitaria a bordo', orig: 'c6', canal: 'wa', etapa: 2, valor: 400, creado: 2 * D, act: 20 * H, toque: 2 * D,
        f: { caduca: 'en 4 semanas', titulo: true, empresaPaga: true }, s: { conv: true, visitas: 2 },
        conv: [[2 * D, 'a', 'wa', 'Hola Verónica, hace casi cinco años hiciste con nosotros la formación sanitaria y te caduca en unas semanas. ¿Te cuento las próximas convocatorias?'], [20 * H, 'c', 'wa', 'Uy, no me acordaba. ¿Cuándo hay fechas?']] },
      { id: 'm24', n: 'Pablo Rey', rol: 'Hizo el curso hace casi 5 años', seg: 'persona', ciudad: 'Pasaia', prod: 'Formación básica en seguridad · renovación', orig: 'c6', canal: 'wa', etapa: 6, valor: 250, creado: 1720 * D, act: 30 * D, toque: 30 * D, fin: 'ganado',
        f: { caduca: 'en 7 semanas', titulo: true }, s: { revision: true, revisionTxt: 'Su certificado de seguridad básica caduca en 7 semanas' }, conv: [] },
      { id: 'm25', n: 'Mónica Sierra', rol: 'Le caduca y aún no ha contestado', seg: 'persona', ciudad: 'Cartagena', prod: 'Formación sanitaria a bordo', orig: 'c6', canal: 'email', etapa: 1, valor: 400, creado: 6 * D, act: 6 * D, toque: 6 * D - 1,
        f: { caduca: 'en 5 semanas', titulo: true }, s: { intentos: 2, emails: 1 },
        conv: [[6 * D - 1, 'a', 'email', 'Hola Mónica, te escribo porque tu certificado de formación sanitaria caduca en unas semanas.']] },
      // --- Dijeron «más adelante»
      { id: 'm26', n: 'Ricardo Souto', rol: 'Marinero · lo hará tras la campaña', seg: 'persona', ciudad: 'Vigo', prod: 'Contraincendios y supervivencia en la mar', orig: 'c4', canal: 'wa', etapa: 3, valor: 320, creado: 24 * D, act: 20 * D, toque: 20 * D,
        f: { caduca: 'en 4 meses', titulo: true }, s: { luego: 'enero', luegoTxt: 'lo haría en enero, cuando acabe la campaña' },
        conv: [[24 * D, 'a', 'wa', 'Hola Ricardo, ¿para cuándo necesitas el curso?'], [20 * D, 'c', 'wa', 'Estoy embarcado hasta que acabe la campaña. Lo hago en enero.']] },
      { id: 'm27', n: 'Beatriz Carro', rol: 'Gerente', emp: 'Astilleros Ría Vieja', seg: 'empresa', tam: 35, ciudad: 'Avilés', prod: 'Formación al equipo (in-company)', orig: 'c3', canal: 'email', etapa: 3, valor: 3800, creado: 40 * D, act: 30 * D, toque: 30 * D,
        f: { dotacion: 10, bonifica: true }, s: { luego: 'noviembre', luegoTxt: 'lo retomaría en noviembre, cuando cierre el plan de formación del año que viene' },
        conv: [[35 * D, 'h', 'email', 'Te comparto dos opciones de calendario para el equipo.'], [30 * D, 'c', 'email', 'Gracias. Lo retomamos en noviembre con el plan de formación del año que viene.']] },
      { id: 'm28', n: 'Óscar Neira', rol: 'Quiere sacarse el título de patrón', seg: 'persona', ciudad: 'Palma', prod: 'Patrón de embarcaciones de recreo', orig: 'c5', canal: 'wa', etapa: 2, valor: 450, creado: 30 * D, act: 28 * D, toque: 28 * D,
        f: { titulo: false }, s: { luego: 'primavera', luegoTxt: 'lo haría en primavera, cuando tenga el barco' },
        conv: [[30 * D, 'a', 'wa', 'Hola Óscar, ¿quieres el título para un barco que ya tienes?'], [28 * D, 'c', 'wa', 'Aún no lo tengo. Lo haría en primavera, cuando lo compre.']] },
      // --- Bajo encaje o fuera
      { id: 'm29', n: 'Irene Salgado', rol: 'Estudiante curiosa', seg: 'persona', ciudad: 'Valencia', prod: 'Formación básica en seguridad · renovación', orig: 'c5', canal: 'wa', etapa: 2, valor: 250, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { curioso: true, lejos: 'Valencia' }, s: { visitas: 1 },
        conv: [[5 * D, 'a', 'wa', 'Hola Irene, ¿es para embarcar?'], [4 * D, 'c', 'wa', 'No, es por curiosidad, me gusta el mar. ¿Es muy caro?']] },
      { id: 'm30', n: 'Julio Arca', rol: 'Busca algo gratis', seg: 'persona', ciudad: 'Las Palmas', prod: 'Formación sanitaria a bordo', orig: 'c1', canal: 'wa', etapa: 1, valor: 400, creado: 8 * D, act: 8 * D, toque: 5 * D, fin: 'perdido',
        f: { gratis: true, lejos: 'Las Palmas' }, s: { intentos: 3 }, conv: [] },
      { id: 'm31', n: 'Natalia Pedre', rol: 'Pide un curso que no hay', seg: 'persona', ciudad: 'Málaga', prod: 'Piloto de drones', orig: 'c5', canal: 'wa', etapa: 2, valor: 450, creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { otroCurso: true }, s: { ppto: 'no' },
        conv: [[6 * D, 'a', 'wa', 'Hola Natalia, ¿qué te gustaría sacarte?'], [5 * D, 'c', 'wa', 'Piloto de drones, ¿lo tenéis?']] },
      // --- Alumnos y empresas que repiten
      { id: 'm32', n: 'Eugenia Lamas', rol: 'Responsable de Seguridad', emp: 'Consignaciones Marea Alta', seg: 'empresa', tam: 70, ciudad: 'Algeciras', prod: 'Formación a la tripulación (in-company)', orig: 'c3', canal: 'email', etapa: 6, valor: 6800, creado: 50 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { dotacion: 18, bonifica: true }, s: { exp: true, expTxt: 'Han preguntado por formar también a la dotación del segundo barco', visitas: 2 },
        conv: [[2 * D, 'c', 'email', 'El primer grupo ha ido muy bien. ¿Podríamos formar a la dotación del segundo barco el mes que viene?']] },
      { id: 'm33', n: 'Francisco Dopico', rol: 'Capitán', seg: 'persona', ciudad: 'Vigo', prod: 'Contraincendios y supervivencia en la mar', orig: 'c2', canal: 'tel', etapa: 6, valor: 320, creado: 16 * D, act: 5 * D, toque: 5 * D, fin: 'ganado', f: { titulo: true }, s: {}, conv: [] },
      { id: 'm34', n: 'Teresa Louro', rol: 'Gerente', emp: 'Náutica del Puerto Viejo', seg: 'empresa', tam: 16, ciudad: 'Palma', prod: 'Formación al equipo (in-company)', orig: 'c3', canal: 'email', etapa: 6, valor: 2800, creado: 60 * D, act: 9 * D, toque: 9 * D, fin: 'ganado',
        f: { dotacion: 8 }, s: {}, conv: [] },
      // --- Convocatorias y cualificados en marcha
      { id: 'm35', n: 'Álex Penas', rol: 'Oficial · convocatoria confirmada', seg: 'persona', ciudad: 'Vigo', prod: 'Formación sanitaria a bordo', orig: 'c2', canal: 'tel', etapa: 4, valor: 400, creado: 6 * D, act: 6 * H, toque: 6 * H,
        f: { caduca: 'en 4 semanas', titulo: true, cerca: true, empresaPaga: true }, s: { cita: 50 * H, citaOk: true, docs: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Álex, te dejo por escrito la convocatoria de la que hablamos.'], [6 * H, 'a', 'wa', 'Confirmada tu plaza para el viernes a las 9:00.'], [6 * H - 10, 'c', 'wa', 'Perfecto, nos vemos allí.']] },
      { id: 'm36', n: 'Silvia Outeiro', rol: 'Armadora', emp: 'Pesquera Mar de Fondo', seg: 'empresa', tam: 42, ciudad: 'A Coruña', prod: 'Formación a la tripulación (in-company)', orig: 'c3', canal: 'wa', etapa: 3, valor: 4800, creado: 3 * D, act: 5 * H, toque: 20 * H,
        f: { dotacion: 14, bonifica: true }, s: { pidePpto: true, conv: true, visitas: 2 },
        conv: [[3 * D, 'a', 'wa', 'Hola Silvia, ¿para cuántas personas sería la formación?'], [3 * D - 40, 'c', 'wa', 'Para 14 tripulantes, antes de la campaña.'], [20 * H, 'a', 'wa', 'Perfecto. ¿Preferís formarlos en el centro o en vuestras instalaciones?'], [5 * H, 'c', 'wa', 'En el centro, mejor. ¿Qué fechas tenéis?']] },
      { id: 'm37', n: 'Iñaki Garmendia', rol: 'Quiere el título de patrón', seg: 'persona', ciudad: 'Bilbao', prod: 'Patrón de embarcaciones de recreo', orig: 'c1', canal: 'wa', etapa: 2, valor: 450, creado: 2 * D, act: 40, toque: 90,
        f: { titulo: true }, s: { visitas: 1 },
        conv: [[2 * D, 'a', 'wa', 'Hola Iñaki, ¿buscas el título para navegar por tu cuenta?'], [90, 'a', 'wa', '¿Te cuento cómo es el curso?'], [40, 'c', 'wa', 'Sí, ¿cuántas horas de prácticas son?']] },
      { id: 'm38', n: 'Carlota Mouriño', rol: 'Escribió ayer · en cadencia', seg: 'persona', ciudad: 'Cartagena', prod: 'Formación básica en seguridad · renovación', orig: 'c5', canal: 'wa', etapa: 1, valor: 250, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { caduca: 'en 2 meses' }, s: { intentos: 1 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Carlota, soy Inés. ¿La renovación es para embarcar pronto?']] }
    ]
  };
})();

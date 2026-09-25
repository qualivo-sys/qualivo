/* Sector: Osteopatía y escuela. Un centro con tres líneas:
 *  - clínica de osteopatía (adultos, embarazo y posparto, bebés),
 *  - osteopatía canina (con valoración previa del veterinario),
 *  - escuela de osteopatía canina (12 meses: online + 4 talleres presenciales,
 *    entrevista de admisión y plazas limitadas).
 * Todos los nombres, perros y casos son inventados. */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  const linea = function (c) { return (c.f && c.f.linea) || ''; };
  const hc = Q.hueco(17), he = Q.hueco(18);
  const ESCUELA = 'Formación en osteopatía canina (12 meses)';

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.osteopatia = {
    id: 'osteopatia',
    nombre: 'Osteopatía y escuela',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'alta', ventas: 'altas', Ventas: 'Altas', producto: 'servicio', Producto: 'Servicio',
      paginaVisitas: 'la web', cita: 'cita', Cita: 'Cita', laCita: 'la cita',
      propuesta: 'el presupuesto', Propuesta: 'Presupuesto', comercial: 'recepción', Comercial: 'Recepción',
      cliente: 'paciente', unCliente: 'un paciente', clientes: 'pacientes y alumnos', convierten: 'reservan',
      objetivoPaso: 'reservar la primera cita', casoExito: 'la opinión de un paciente con un caso parecido', valorAlto: 1500,
      oportunidades: 'interesados', atencion: 'interesados que requieren atención', laVenta: 'la primera sesión o la matrícula',
      verbo: 'reservar', clientesReales: 'pacientes y alumnos de verdad', pasoHumano: 'resolver sus dudas y cerrar la reserva',
      nombreAgenteVoz: 'Sara'
    },
    // Anuncio → Pide información → Contactado → Cualificado → Cita o entrevista → Primera sesión o matrícula → Bono o alumno activo
    recorrido: [
      { id: 'anuncio', txt: 'Anuncio', sinFuga: true },
      { id: 'info', txt: 'Pide información' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'cualificado', txt: 'Cualificado' },
      { id: 'cita', txt: 'Cita o entrevista' },
      { id: 'alta', txt: 'Primera sesión o matrícula' },
      { id: 'fiel', txt: 'Bono o alumno activo', sinFuga: true }
    ],
    ventaEtapa: 'alta',
    ticket: 240,
    referencia: { contactado: 0.88, cualificado: 0.68, cita: 0.62, alta: 0.78 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'interesados que piden información y nadie les contesta a tiempo' },
      cualificado: { txt: 'Cualificación', exp: 'conversaciones que no pasan de «¿cuánto cuesta?»' },
      cita: { txt: 'Reserva', exp: 'interesados con ganas a los que nadie cierra la cita' },
      alta: { txt: 'Plantones', exp: 'citas y entrevistas a las que no se presentan' }
    },
    mesDatos: { respuestaAntes: 185, respuestaAhora: 2, agendadas: 262 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Osteopatía en el embarazo y posparto', inversion: 650, ticket: 260,
        embudo: { anuncio: 2400, info: 96, contactado: 80, cualificado: 58, cita: 44, alta: 33, fiel: 22 } },
      { id: 'c2', canal: 'Google', nombre: 'Osteópata en Barcelona', inversion: 900, ticket: 220,
        embudo: { anuncio: 1850, info: 118, contactado: 99, cualificado: 76, cita: 60, alta: 46, fiel: 30 } },
      { id: 'c3', canal: 'Meta', nombre: 'Osteopatía canina: perros mayores y artrosis', inversion: 520, ticket: 240,
        embudo: { anuncio: 2900, info: 84, contactado: 64, cualificado: 43, cita: 31, alta: 23, fiel: 14 } },
      { id: 'c4', canal: 'Meta', nombre: 'Formación en osteopatía canina · enero', inversion: 1400, ticket: 2950,
        embudo: { anuncio: 5200, info: 146, contactado: 101, cualificado: 52, cita: 27, alta: 10, fiel: 10 } },
      { id: 'c5', canal: 'Instagram', nombre: 'Clase abierta online de osteopatía canina', inversion: 380, ticket: 2950,
        embudo: { anuncio: 3600, info: 112, contactado: 66, cualificado: 27, cita: 12, alta: 3, fiel: 3 } },
      { id: 'c6', canal: 'Web', nombre: 'Web y reservas online (orgánico)', inversion: 0, ticket: 220,
        embudo: { anuncio: 1400, info: 64, contactado: 60, cualificado: 52, cita: 45, alta: 38, fiel: 26 } }
    ],
    kpis: ['interesados', 'cpl', 'respuesta', 'cualificados', 'entrevistas', 'show', 'ventas', 'cpv', 'ingresos', 'roas'],
    kpiNombres: { interesados: 'Interesados', cualificados: 'Cualificados', entrevistas: 'Citas y entrevistas', ventas: 'Altas (pacientes y alumnos)', cpv: 'Coste por alta', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'cita' },
    agenda: { horas: [10, 20], pausa: [13, 16], ocupacion: 0.6, etapa: 'cita',
      tipos: ['Osteopatía · adulto', 'Osteopatía · embarazo', 'Osteopatía · bebé', 'Osteopatía canina', 'Entrevista de admisión', 'Osteopatía · adulto'] },
    historiaGenerica: false,

    reglas: {
      fitBase: 22,
      fit: [
        [function (c) { return linea(c) !== 'escuela' && c.f.zona === 'bcn'; }, 24, 'vive en Barcelona, a mano del centro', 'Vive en Barcelona (clínica)'],
        [function (c) { return linea(c) !== 'escuela' && c.f.zona === 'cerca'; }, 14, function (c) { return 'vive en ' + c.ciudad + ', cerca del centro'; }, 'Vive en el área metropolitana'],
        [function (c) { return linea(c) !== 'escuela' && c.f.zona === 'lejos'; }, -28, function (c) { return 'vive en ' + c.ciudad + ', lejos del centro'; }, 'Vive lejos del centro'],
        [function (c) { return linea(c) === 'clinica' && (c.f.motivo === 'embarazo' || c.f.motivo === 'bebe'); }, 18, 'embarazo, posparto o bebé: la especialidad del centro', 'Embarazo, posparto o bebé'],
        [function (c) { return linea(c) === 'clinica' && c.f.motivo === 'dolor'; }, 10, function (c) { return c.f.motivoTxt + ', que se trata bien con osteopatía'; }, 'Dolor que se trata con osteopatía'],
        [function (c) { return !!c.f.derivado; }, 14, function (c) { return c.f.derivadoTxt; }, 'Viene recomendado por un profesional'],
        [function (c) { return linea(c) === 'canina' && c.f.vetOk; }, 16, 'ya tiene la valoración de su veterinario', 'Perro con valoración veterinaria'],
        [function (c) { return linea(c) === 'canina' && !c.f.vetOk; }, -6, 'aún le falta la valoración del veterinario'],
        [function (c) { return linea(c) === 'escuela' && ['vet', 'fisio', 'osteo'].indexOf(c.f.perfil) >= 0; }, 30, function (c) { return 'es ' + c.rol.toLowerCase(); }, 'Veterinario, fisio u osteópata (escuela)'],
        [function (c) { return linea(c) === 'escuela' && ['auxvet', 'adiestrador'].indexOf(c.f.perfil) >= 0; }, 18, function (c) { return 'trabaja con perros (' + c.rol.toLowerCase() + ')'; }, 'Trabaja con perros (escuela)'],
        [function (c) { return linea(c) === 'escuela' && c.f.perfil === 'estudiante'; }, 6, 'estudiante'],
        [function (c) { return linea(c) === 'escuela' && c.f.talleres; }, 12, 'puede venir a los 4 talleres presenciales', 'Puede venir a los talleres'],
        [function (c) { return linea(c) === 'escuela' && c.f.zona === 'bcn'; }, 6, 'vive en Barcelona, donde son los talleres'],
        [function (c) { return !!c.f.gratis; }, -26, 'busca formación gratuita']
      ],
      intencion: [
        [function (c) { return c.s.bono; }, 12, 'preguntó por el bono de sesiones'],
        [function (c) { return c.s.fechas; }, 14, 'preguntó por la promoción de enero'],
        [function (c) { return c.s.plazas; }, 10, 'preguntó si quedan plazas'],
        [function (c) { return c.s.financia; }, 10, 'preguntó por el pago en cuotas']
      ]
    },

    // En la escuela, quien entra en juego es la dirección, no recepción
    nba: function (c, k, x, T, M) {
      const r = M.nbaGenerica(c, k, x, T);
      if (linea(c) !== 'escuela' || r.quien !== T.Comercial) return r;
      return Object.assign({}, r, { accion: r.accion.replace('a recepción', 'a la dirección de la escuela'), quien: 'Dirección de la escuela', por: r.por.replace(/a recepción/g, 'a la dirección de la escuela') });
    },
    vozDijo: function (c) {
      if (linea(c) === 'escuela') return ['Perfil: ' + c.rol.toLowerCase()];
      if (linea(c) === 'canina') return c.f.perro ? ['Perro: ' + c.f.perro] : [];
      return c.f.motivoTxt ? ['Motivo: ' + c.f.motivoTxt] : [];
    },
    vozMotivo: function (c) {
      if (linea(c) === 'escuela') return c.rol + '; quiere hacer la formación de 12 meses.';
      if (linea(c) === 'canina') return 'Llama por ' + (c.f.perro || 'su perro') + '.';
      return 'Consulta por ' + (c.f.motivoTxt || c.prod.toLowerCase()) + '.';
    },

    preguntas: [
      { q: '¿Quién puede entrar en la promoción de enero de la escuela?', h: 'lista', obj: ['conversion', 'ventas', 'todo'],
        filtro: function (c) { return linea(c) === 'escuela' && !c.fin && c.x.fit >= 50; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados en la escuela encajan para la promoción de enero. Las plazas son limitadas: primero, los que ya tienen la entrevista de admisión o la están pidiendo.'; },
        vista: 'tabla' },
      { q: '¿Qué embarazadas y bebés están pendientes de cita?', h: 'lista', obj: ['seguimiento', 'todo'],
        filtro: function (c) { return linea(c) === 'clinica' && (c.f.motivo === 'embarazo' || c.f.motivo === 'bebe') && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' embarazadas, mamás en posparto o bebés están en marcha. Aquí el tiempo cuenta: las semanas de embarazo avanzan.'; },
        vista: 'tabla' },
      { q: '¿Qué perros tienen el ok del veterinario y aún no han reservado?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return linea(c) === 'canina' && c.f.vetOk && c.s.tCita == null && !c.fin; }, orden: 'prob',
        intro: function (l) { return l.length + ' perros ya tienen la valoración de su veterinario y todavía no tienen cita. Es la reserva más fácil de cerrar.'; },
        vista: 'tabla' }
    ],

    historias: {
      clinica: {
        titulo: 'Una embarazada no contesta al WhatsApp y le llama el agente de voz',
        contacto: { id: 'demo', n: 'Laia Puig', rol: 'Embarazada de 31 semanas', seg: 'paciente', ciudad: '—', prod: 'Osteopatía en el embarazo', orig: 'c1', canal: 'wa', etapa: 1, valor: 260, creado: 0, act: 0, f: { linea: 'clinica', motivo: 'embarazo' }, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud nueva desde un anuncio de Meta', feed: 'Nueva solicitud · Osteopatía en el embarazo', cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: 31 semanas, dolor lumbar, vive en Gràcia', feed: 'Ficha completada · 31 semanas · recomendada por su matrona', cambio: { ciudad: 'Barcelona', f: { zona: 'bcn', motivoTxt: 'dolor lumbar en el embarazo', derivado: true, derivadoTxt: 'se lo recomendó su matrona' } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 51 segundos', cambio: { conv: ['a', 'wa', 'Hola Laia, soy Sara, del centro de osteopatía. En el embarazo el dolor lumbar es muy habitual y se trata bien. ¿Te va bien que te llamemos dos minutos para buscarte hueco esta semana?'] }, toque: true },
          { dur: 5, min: 9, txt: 'Diez minutos sin respuesta: la cadencia pasa a voz', feed: 'Sin respuesta al WhatsApp · llamada programada', cambio: { s: { intentos: 1 } } },
          { dur: 17, min: 1, txt: 'El agente de voz le llama y cualifica en la llamada', feed: 'Llamada del agente de voz · 4 min · agendó la primera sesión', act: true,
            llamada: { dur: 226, res: 'agendo', resumen: 'Cogió a la primera: estaba trabajando y no había visto el WhatsApp. 31 semanas, dolor lumbar desde hace diez días que no la deja dormir. Agendó la primera sesión del ' + hc.txt + ' a las 17:00.', dijo: ['Urgencia: no duerme bien por el dolor', 'Viene recomendada por su matrona', 'Pregunta qué tiene que traer'],
              trans: [['v', 'Hola Laia, soy Sara, del centro de osteopatía. Te llamo por el formulario que nos dejaste. ¿Tienes un minuto?'], ['c', 'Sí, perdona, estaba trabajando y no había visto el WhatsApp.'], ['v', '¿De cuántas semanas estás y desde cuándo tienes el dolor?'], ['c', 'De 31. Desde hace diez días, y por la noche casi no duermo.'], ['v', 'Te puedo dar el ' + hc.txt + ' a las 17:00. La primera sesión dura una hora. ¿Te va bien?'], ['c', 'Sí, perfecto. ¿Tengo que traer algo?'], ['v', 'Ropa cómoda y el último informe de la matrona, si lo tienes. Te lo mando todo por WhatsApp.']] },
            cambio: { etapa: 3, s: { urg: true, urgTxt: 'el dolor no la deja dormir' } } },
          { dur: 7, min: 4, txt: 'La cita aparece en la Agenda, confirmada por WhatsApp', feed: 'Cita agendada por el agente de voz · ' + hc.txt + ' 17:00', vista: 'agenda', toque: true,
            cambio: { etapa: 4, s: { cita: hc.min - 17, citaOk: true }, conv: ['a', 'wa', 'Laia, te confirmo: ' + hc.txt + ' a las 17:00, primera sesión de osteopatía en el embarazo (60 min), en el centro. Trae ropa cómoda y el informe de la matrona. El día antes te mando un recordatorio.'] } },
          { dur: 7, min: 1, txt: 'Recordatorio programado para el día antes', feed: 'Recordatorio de cita programado · con la ubicación y qué traer' }
        ]
      },
      escuela: {
        titulo: 'Un fisioterapeuta pide información de la escuela',
        contacto: { id: 'demo', n: 'Àlex Vidal', rol: 'Fisioterapeuta', seg: 'alumno', ciudad: '—', prod: ESCUELA, orig: 'c5', canal: 'wa', etapa: 1, valor: 2950, creado: 0, act: 0, f: { linea: 'escuela' }, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una solicitud desde la clase abierta de Instagram', feed: 'Nueva solicitud · ' + ESCUELA, cambio: {} },
          { dur: 6, min: 1, txt: 'El agente completa la ficha: fisioterapeuta en Barcelona', feed: 'Ficha completada · fisioterapeuta · Barcelona', cambio: { ciudad: 'Barcelona', f: { perfil: 'fisio', zona: 'bcn' } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp contesta en el minuto uno', feed: 'WhatsApp enviado en 44 segundos', cambio: { conv: ['a', 'wa', 'Hola Àlex, soy Sara, de la escuela de osteopatía canina. ¿Ya trabajas con perros o sería empezar de cero con ellos?'] }, toque: true },
          { dur: 6, min: 6, txt: 'Àlex contesta: prefiere que le llamen', feed: 'Respuesta recibida · pide una llamada', cambio: { etapa: 2, conv: ['c', 'wa', 'Soy fisio y quiero especializarme en perros. ¿Me podéis llamar? Estoy entre pacientes y no puedo escribir.'] }, act: true },
          { dur: 17, min: 2, txt: 'El agente de voz le llama al momento', feed: 'Llamada del agente de voz · 5 min · agendó la entrevista de admisión', act: true,
            llamada: { dur: 305, res: 'agendo', resumen: 'Fisioterapeuta en Barcelona; quiere especializarse en perros. Preguntó por fechas, precio y plazas. Puede venir a los cuatro talleres. Agendó la entrevista de admisión del ' + he.txt + ' a las 18:00.', dijo: ['Perfil: fisioterapeuta', 'Pregunta si quedan plazas para enero', 'Pagaría en cuotas'],
              trans: [['v', 'Hola Àlex, soy Sara, de la escuela. Me pediste que te llamáramos. ¿Te pillo bien?'], ['c', 'Sí, tengo cinco minutos. ¿Cuándo empieza y cuánto cuesta?'], ['v', 'La próxima promoción empieza en enero: 12 meses online, con cuatro talleres prácticos en Barcelona. Se puede pagar en cuotas.'], ['c', '¿Quedan plazas? He visto que los grupos son pequeños.'], ['v', 'Quedan pocas. Para entrar hay una entrevista de admisión de 20 minutos. ¿Te va bien el ' + he.txt + ' a las 18:00?'], ['c', 'Perfecto, apúntame.']] },
            cambio: { etapa: 3, f: { talleres: true }, s: { fechas: true, precio: true, plazas: true, financia: true } } },
          { dur: 7, min: 3, txt: 'La entrevista aparece en la Agenda, confirmada por WhatsApp', feed: 'Entrevista de admisión agendada · ' + he.txt + ' 18:00', vista: 'agenda', toque: true,
            cambio: { etapa: 4, s: { cita: he.min - 25, citaOk: true }, conv: ['a', 'wa', 'Àlex, te confirmo la entrevista de admisión el ' + he.txt + ' a las 18:00. Te dejo el programa, las fechas de los cuatro talleres y las opciones de pago en cuotas.'] } },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Àlex está listo para la entrevista', feed: 'Aviso enviado a la dirección de la escuela', humano: { titulo: 'Àlex está listo para la entrevista de admisión', texto: 'Fisioterapeuta en Barcelona · quiere especializarse en perros · promoción de enero · puede venir a los 4 talleres · pagaría en cuotas. Entrevista el ' + he.txt + ' a las 18:00, con el resumen de la llamada.' } }
        ]
      }
    },
    historiaDefecto: 'clinica',

    contactos: [
      // --- Clínica: lo caliente
      { id: 'o01', n: 'Laura Bosch', rol: 'Embarazada de 29 semanas', seg: 'paciente', ciudad: 'Barcelona', prod: 'Osteopatía en el embarazo', orig: 'c1', canal: 'wa', etapa: 3, valor: 260, creado: 26 * H, act: 30, toque: 24 * H,
        f: { linea: 'clinica', zona: 'bcn', motivo: 'embarazo', motivoTxt: 'ciática en el embarazo', derivado: true, derivadoTxt: 'se lo recomendó su matrona' },
        s: { urg: true, urgTxt: 'la ciática casi no la deja caminar', precio: true, bono: true, visitas: 3 },
        conv: [[26 * H - 1, 'a', 'wa', 'Hola Laura, soy Sara, del centro de osteopatía. ¿De cuántas semanas estás y qué molestias tienes?'], [25 * H, 'c', 'wa', 'De 29. Tengo ciática, me baja por la pierna y casi no puedo caminar.'], [24 * H, 'a', 'wa', 'Lo tratamos mucho en el embarazo. ¿Te va mejor el lunes o el martes por la tarde?'], [30, 'c', 'wa', '¿Cuánto cuesta la sesión? ¿Hay bono? La matrona me dice que vaya ya.']] },
      { id: 'o02', n: 'Marc Soler', rol: 'Corredor, lesión de rodilla', seg: 'paciente', ciudad: 'Barcelona', prod: 'Osteopatía deportiva', orig: 'c2', canal: 'tel', etapa: 1, valor: 240, creado: 14, act: 14, toque: null,
        f: { linea: 'clinica', zona: 'bcn', motivo: 'dolor', motivoTxt: 'dolor de rodilla al correr' }, s: { visitas: 1 }, conv: [] },
      { id: 'o03', n: 'Núria Ferrer', rol: 'Madre de un bebé de 2 meses', seg: 'paciente', ciudad: "L'Hospitalet", prod: 'Osteopatía para bebés', orig: 'c1', canal: 'wa', etapa: 4, valor: 180, creado: 3 * D, act: 5 * H, toque: 5 * H,
        f: { linea: 'clinica', zona: 'cerca', motivo: 'bebe', motivoTxt: 'cólicos y tortícolis del bebé', derivado: true, derivadoTxt: 'se lo recomendó su pediatra' },
        s: { cita: 20 * H, citaOk: false, visitas: 2 },
        conv: [[3 * D, 'a', 'wa', 'Hola Núria, soy Sara. ¿Qué le pasa al peque?'], [3 * D - 40, 'c', 'wa', 'Tiene cólicos y siempre gira la cabeza hacia el mismo lado. La pediatra me dijo que probara.'], [5 * H, 'a', 'wa', 'Te dejo la cita de Pol para mañana. ¿Me confirmas que os va bien?']] },
      { id: 'o04', n: 'Jordi Camps', rol: 'Oficinista, cervicales', seg: 'paciente', ciudad: 'Barcelona', prod: 'Osteopatía estructural', orig: 'c2', canal: 'wa', etapa: 2, valor: 240, creado: 6 * D, act: 5 * D, toque: 4 * D,
        f: { linea: 'clinica', zona: 'bcn', motivo: 'dolor', motivoTxt: 'dolor cervical y de cabeza' }, s: { precio: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Jordi, soy Sara, del centro de osteopatía. ¿Qué molestias tienes?'], [5 * D, 'c', 'wa', 'Cervicales y dolor de cabeza casi cada día. ¿Precio?'], [4 * D, 'a', 'wa', 'La primera sesión son 65 € y dura una hora. ¿Te busco hueco esta semana?']] },
      { id: 'o05', n: 'Montse Vidal', rol: 'Lumbalgia crónica', seg: 'paciente', ciudad: 'Sabadell', prod: 'Osteopatía estructural', orig: 'c6', canal: 'wa', etapa: 4, valor: 240, creado: 9 * D, act: 3 * D, toque: 3 * D,
        f: { linea: 'clinica', zona: 'cerca', motivo: 'dolor', motivoTxt: 'lumbalgia crónica' }, s: { noshow: true, visitas: 2 },
        conv: [[9 * D, 'a', 'wa', 'Hola Montse, soy Sara. ¿Desde cuándo tienes la lumbalgia?'], [8 * D, 'c', 'wa', 'Desde hace años. He probado de todo.'], [4 * D, 'a', 'wa', 'Te espero mañana a las 11:00. Trae ropa cómoda.']],
        ev: [[3 * D - 60, 'sistema', 'No se presenta a la primera sesión']] },
      { id: 'o06', n: 'Pau Roca', rol: 'Bruxismo y dolor de mandíbula', seg: 'paciente', ciudad: 'Barcelona', prod: 'Osteopatía craneosacral', orig: 'c6', canal: 'wa', etapa: 4, valor: 240, creado: 5 * D, act: 6 * H, toque: 6 * H,
        f: { linea: 'clinica', zona: 'bcn', motivo: 'dolor', motivoTxt: 'bruxismo y dolor de mandíbula', derivado: true, derivadoTxt: 'se lo recomendó su dentista' }, s: { cita: 50 * H, citaOk: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Pau, ¿el dolor de mandíbula es más por la mañana?'], [5 * D - 60, 'c', 'wa', 'Sí, me levanto con la mandíbula cargada. Me lo ha dicho el dentista.'], [6 * H, 'a', 'wa', 'Cita confirmada. Te espero en el centro.'], [6 * H - 10, 'c', 'wa', 'Perfecto, gracias.']] },
      { id: 'o07', n: 'Clara Martí', rol: 'Embarazada de 34 semanas', seg: 'paciente', ciudad: 'Badalona', prod: 'Osteopatía en el embarazo', orig: 'c1', canal: 'wa', etapa: 1, valor: 260, creado: 2 * D, act: 2 * D, toque: 2 * D - 1,
        f: { linea: 'clinica', zona: 'cerca', motivo: 'embarazo', motivoTxt: 'preparar el parto' }, s: { intentos: 2 },
        conv: [[2 * D - 1, 'a', 'wa', 'Hola Clara, soy Sara, del centro de osteopatía. ¿Quieres que te llamemos para preparar el parto?']] },
      { id: 'o08', n: 'Sergio Pons', rol: 'Hernia discal', seg: 'paciente', ciudad: 'Madrid', prod: 'Osteopatía estructural', orig: 'c2', canal: 'wa', etapa: 2, valor: 240, creado: 4 * D, act: 3 * D, toque: 3 * D,
        f: { linea: 'clinica', zona: 'lejos', motivo: 'dolor', motivoTxt: 'hernia discal' },
        conv: [[4 * D, 'a', 'wa', 'Hola Sergio, soy Sara. ¿Qué te ha dicho el traumatólogo?'], [3 * D, 'c', 'wa', 'Vivo en Madrid, pero voy a Barcelona alguna vez al mes. ¿Tenéis consulta allí?']] },
      { id: 'o09', n: 'Anna Serra', rol: 'Posparto', seg: 'paciente', ciudad: 'Barcelona', prod: 'Osteopatía en el posparto', orig: 'c1', canal: 'wa', etapa: 3, valor: 260, creado: 20 * D, act: 16 * D, toque: 16 * D,
        f: { linea: 'clinica', zona: 'bcn', motivo: 'embarazo', motivoTxt: 'recuperación del posparto' }, s: { luego: 'noviembre', luegoTxt: 'lo retomaría en noviembre, cuando el bebé tenga tres meses' },
        conv: [[20 * D, 'a', 'wa', 'Hola Anna, ¿cómo va el posparto?'], [16 * D, 'c', 'wa', 'Me interesa mucho, pero ahora no llego. Lo retomaría en noviembre, cuando el bebé tenga tres meses.']] },
      { id: 'o10', n: 'Elena Casas', rol: 'Dolor de espalda', seg: 'paciente', ciudad: 'Barcelona', prod: 'Bono de 4 sesiones', orig: 'c6', canal: 'wa', etapa: 6, valor: 240, creado: 60 * D, act: 20 * D, toque: 20 * D, fin: 'ganado',
        f: { linea: 'clinica', zona: 'bcn', motivo: 'dolor', motivoTxt: 'dolor de espalda' }, s: { revision: true, revisionTxt: 'Le quedan 2 sesiones del bono y lleva 3 semanas sin venir' }, conv: [] },
      { id: 'o11', n: 'Ramon Puig', rol: 'Jubilado, artrosis de cadera', seg: 'paciente', ciudad: 'Terrassa', prod: 'Osteopatía estructural', orig: 'c2', canal: 'email', etapa: 1, valor: 240, creado: 9 * D, act: 9 * D, toque: 6 * D, fin: 'perdido',
        f: { linea: 'clinica', zona: 'cerca', motivo: 'dolor', motivoTxt: 'artrosis de cadera' }, s: { intentos: 3 },
        llamadas: [[8 * D, 70, 'nointeresa', 'Cogió y dijo que ya le operan de la cadera en noviembre. Se despide con amabilidad y no se le vuelve a llamar.', ['Motivo: operación de cadera en noviembre']]], conv: [] },
      { id: 'o12', n: 'Marta Gil', rol: 'Migrañas', seg: 'paciente', ciudad: 'Barcelona', prod: 'Osteopatía craneosacral', orig: 'c2', canal: 'wa', etapa: 2, valor: 240, creado: 95, act: 20, toque: 90,
        f: { linea: 'clinica', zona: 'bcn', motivo: 'dolor', motivoTxt: 'migrañas' }, s: { urg: true, urgTxt: 'tiene migraña hoy y pregunta por esta tarde', visitas: 2 },
        conv: [[94, 'a', 'wa', 'Hola Marta, soy Sara. ¿Cada cuánto tienes las migrañas?'], [20, 'c', 'wa', 'Casi cada semana y hoy tengo una. ¿Tenéis algo esta tarde?']] },
      { id: 'o13', n: 'Irene Soto', rol: 'Madre de un bebé de 5 semanas', seg: 'paciente', ciudad: 'Barcelona', prod: 'Osteopatía para bebés', orig: 'c1', canal: 'wa', etapa: 5, valor: 180, creado: 12 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { linea: 'clinica', zona: 'bcn', motivo: 'bebe', motivoTxt: 'plagiocefalia' }, conv: [] },
      { id: 'o14', n: 'David Font', rol: 'Tendinitis de hombro (pádel)', seg: 'paciente', ciudad: 'Sant Cugat', prod: 'Osteopatía deportiva', orig: 'c2', canal: 'tel', etapa: 3, valor: 240, creado: 3 * D, act: 21 * H, toque: 22 * H,
        f: { linea: 'clinica', zona: 'cerca', motivo: 'dolor', motivoTxt: 'tendinitis de hombro' }, s: { precio: true, urg: true, urgTxt: 'tiene un torneo de pádel a mediados de octubre' },
        llamadas: [[22 * H + 6, 245, 'hablo', 'Habló 4 minutos. Tendinitis de hombro por el pádel; quiere saber si con 2 o 3 sesiones llega al torneo de octubre. Pidió los horarios de tarde por WhatsApp.', ['Urgencia: torneo de pádel a mediados de octubre', 'Solo puede por las tardes', 'Objeción: ya probó fisioterapia sin mejora']]],
        conv: [[22 * H, 'a', 'wa', 'David, como hablamos: tardes libres el martes a las 18:00 y el jueves a las 19:00. ¿Cuál te va mejor?'], [21 * H, 'c', 'wa', 'Lo miro con el trabajo y te digo.']] },
      { id: 'o15', n: 'Rosa Pérez', rol: 'Dolor de espalda', seg: 'paciente', ciudad: 'Barcelona', prod: 'Osteopatía estructural', orig: 'c2', canal: 'wa', etapa: 1, valor: 240, creado: 3 * H, act: 3 * H, toque: 3 * H - 1,
        f: { linea: 'clinica', zona: 'bcn', motivo: 'dolor', motivoTxt: 'dolor de espalda al levantarse' }, s: { intentos: 1 },
        conv: [[3 * H - 1, 'a', 'wa', 'Hola Rosa, soy Sara, del centro de osteopatía. ¿Te llamamos dos minutos para buscarte hueco?']] },
      { id: 'o16', n: 'Joan Mir', rol: 'Contractura cervical', seg: 'paciente', ciudad: 'Barcelona', prod: 'Osteopatía estructural', orig: 'c6', canal: 'tel', etapa: 1, valor: 240, creado: 2 * D, act: 20 * H, toque: 20 * H,
        f: { linea: 'clinica', zona: 'bcn', motivo: 'dolor', motivoTxt: 'contractura cervical' }, s: { intentos: 2 },
        llamadas: [[2 * D - 10, 0, 'nocontesta', 'No cogió. Se deja un mensaje de voz de 15 segundos y la cadencia sigue por WhatsApp.', []], [20 * H, 70, 'luego', 'Cogió en el trabajo y pidió que le llamaran después de las 18:00. Rellamada programada para hoy a las 18:15.', ['Cuándo: mejor después de las 18:00', 'Motivo: contractura cervical']]],
        conv: [] },
      // --- Osteopatía canina
      { id: 'o17', n: 'Sílvia Mas', rol: 'Nala (labrador, 11 años)', seg: 'perro', ciudad: 'Barcelona', prod: 'Osteopatía canina · Nala, artrosis', orig: 'c3', canal: 'wa', etapa: 3, valor: 240, creado: 2 * D, act: 3 * H, toque: 3 * H - 5,
        f: { linea: 'canina', zona: 'bcn', perro: 'Nala, labrador de 11 años con artrosis', vetOk: true }, s: { visitas: 2, precio: true, urg: true, urgTxt: 'Nala cojea desde hace una semana' },
        conv: [[2 * D, 'a', 'wa', 'Hola Sílvia, soy Sara, del centro. ¿Qué le pasa a Nala?'], [2 * D - 30, 'c', 'wa', 'Tiene artrosis y desde hace una semana cojea de la pata de atrás.'], [3 * H + 5, 'a', 'wa', '¿Su veterinario os ha dado el visto bueno para la osteopatía? Lo necesitamos antes de la primera sesión.'], [3 * H, 'c', 'wa', 'Sí, la veterinaria nos ha dado el ok. ¿Cuánto cuesta y cuánto dura?']] },
      { id: 'o18', n: 'Toni Ribas', rol: 'Rocky (bulldog francés, 4 años)', seg: 'perro', ciudad: 'Mataró', prod: 'Osteopatía canina · Rocky, tras cirugía', orig: 'c3', canal: 'tel', etapa: 1, valor: 240, creado: 40, act: 40, toque: null,
        f: { linea: 'canina', zona: 'cerca', perro: 'Rocky, bulldog francés operado de columna' }, conv: [] },
      { id: 'o19', n: 'Carla Pujol', rol: 'Kira (border collie, agility)', seg: 'perro', ciudad: 'Castelldefels', prod: 'Osteopatía canina · Kira, deportiva', orig: 'c3', canal: 'wa', etapa: 4, valor: 240, creado: 6 * D, act: 1 * D, toque: 1 * D,
        f: { linea: 'canina', zona: 'cerca', perro: 'Kira, border collie que compite en agility', vetOk: true }, s: { cita: 26 * H, citaOk: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Carla, ¿Kira compite ahora mismo?'], [6 * D - 20, 'c', 'wa', 'Sí, en agility, y la noto rígida después de las pruebas.'], [1 * D, 'a', 'wa', 'Cita confirmada para Kira. Traed su manta, así está más tranquila.']] },
      { id: 'o20', n: 'Oriol Vila', rol: 'Thor (pastor alemán, 9 años)', seg: 'perro', ciudad: 'Barcelona', prod: 'Osteopatía canina · Thor, displasia', orig: 'c3', canal: 'wa', etapa: 2, valor: 240, creado: 8 * D, act: 7 * D, toque: 6 * D,
        f: { linea: 'canina', zona: 'bcn', perro: 'Thor, pastor alemán de 9 años con displasia' },
        conv: [[8 * D, 'a', 'wa', 'Hola Oriol, soy Sara. ¿Qué le notas a Thor?'], [7 * D, 'c', 'wa', 'Le cuesta levantarse. ¿Hace falta que lo vea antes el veterinario?'], [6 * D, 'a', 'wa', 'Sí, necesitamos su valoración antes. Si quieres, te paso un modelo de informe para llevarle.']] },
      { id: 'o21', n: 'Lucía Rey', rol: 'Coco (caniche, 13 años)', seg: 'perro', ciudad: 'Barcelona', prod: 'Osteopatía canina · Coco, perro mayor', orig: 'c3', canal: 'wa', etapa: 1, valor: 240, creado: 3 * D, act: 3 * D, toque: 3 * D - 1,
        f: { linea: 'canina', zona: 'bcn', perro: 'Coco, caniche de 13 años' }, s: { intentos: 2 },
        conv: [[3 * D - 1, 'a', 'wa', 'Hola Lucía, soy Sara, del centro. ¿Qué le pasa a Coco?']] },
      { id: 'o22', n: 'Pere Navarro', rol: 'Luna (galga adoptada)', seg: 'perro', ciudad: 'Sabadell', prod: 'Bono canino de 3 sesiones', orig: 'c3', canal: 'wa', etapa: 6, valor: 190, creado: 45 * D, act: 10 * D, toque: 10 * D, fin: 'ganado',
        f: { linea: 'canina', zona: 'cerca', perro: 'Luna, galga adoptada', vetOk: true }, conv: [] },
      { id: 'o23', n: 'María López', rol: 'Bruno (golden, 7 años)', seg: 'perro', ciudad: 'Madrid', prod: 'Osteopatía canina · Bruno', orig: 'c3', canal: 'wa', etapa: 2, valor: 240, creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { linea: 'canina', zona: 'lejos', perro: 'Bruno, golden de 7 años' },
        conv: [[5 * D, 'a', 'wa', 'Hola María, ¿qué le pasa a Bruno?'], [4 * D, 'c', 'wa', 'Estamos en Madrid. ¿Venís a domicilio?']] },
      // --- Escuela de osteopatía canina
      { id: 'o24', n: 'Albert Rius', rol: 'Fisioterapeuta', seg: 'alumno', ciudad: 'Barcelona', prod: ESCUELA, orig: 'c4', canal: 'wa', etapa: 3, valor: 2950, creado: 4 * D, act: 55, toque: 5 * H,
        f: { linea: 'escuela', zona: 'bcn', perfil: 'fisio', talleres: true }, s: { fechas: true, precio: true, financia: true, plazas: true, visitas: 4 },
        conv: [[4 * D, 'a', 'wa', 'Hola Albert, soy Sara, de la escuela. ¿Ya trabajas con perros?'], [4 * D - 60, 'c', 'wa', 'Todavía no, soy fisio de personas y quiero dar el salto.'], [5 * H, 'a', 'wa', 'Te paso el programa: 12 meses online con cuatro talleres en Barcelona.'], [55, 'c', 'wa', 'Me encaja. ¿Quedan plazas para enero? ¿Se puede pagar en cuotas?']] },
      { id: 'o25', n: 'Judit Pla', rol: 'Veterinaria', seg: 'alumno', ciudad: 'Valencia', prod: ESCUELA, orig: 'c4', canal: 'email', etapa: 4, valor: 2950, creado: 10 * D, act: 1 * D, toque: 1 * D,
        f: { linea: 'escuela', zona: 'lejos', perfil: 'vet', talleres: true }, s: { cita: 3 * D, citaOk: true, fechas: true },
        llamadas: [[3 * D, 380, 'agendo', 'Habló 6 minutos. Veterinaria en una clínica de Valencia; quiere añadir terapia manual a su consulta. Viajaría a Barcelona para los talleres. Agendó la entrevista de admisión por videollamada.', ['Perfil: veterinaria clínica', 'Viajaría a Barcelona para los 4 talleres', 'Pregunta si hay prácticas con casos reales']]],
        conv: [[10 * D, 'a', 'email', 'Hola Judit, te escribo por la formación en osteopatía canina.'], [9 * D, 'c', 'email', 'Me interesa para mi clínica. ¿Me llamáis y lo vemos?'], [1 * D, 'a', 'email', 'Te confirmo la entrevista de admisión por videollamada. Te adjunto el calendario de talleres.']] },
      { id: 'o26', n: 'Hugo Martín', rol: 'Auxiliar de veterinaria', seg: 'alumno', ciudad: 'Zaragoza', prod: ESCUELA, orig: 'c5', canal: 'wa', etapa: 2, valor: 2950, creado: 5 * D, act: 4 * D, toque: 3 * D,
        f: { linea: 'escuela', zona: 'lejos', perfil: 'auxvet' }, s: { precio: true, financia: true },
        conv: [[5 * D, 'a', 'wa', 'Hola Hugo, soy Sara, de la escuela. ¿Qué te gustó de la clase abierta?'], [4 * D, 'c', 'wa', 'Todo. ¿Hay financiación? Es mucho de golpe.'], [3 * D, 'a', 'wa', 'Sí, se puede pagar en cuotas. ¿Te cuento cómo en una llamada de 10 minutos?']] },
      { id: 'o27', n: 'Paula Esteve', rol: 'Adiestradora canina', seg: 'alumno', ciudad: 'Tarragona', prod: ESCUELA, orig: 'c5', canal: 'wa', etapa: 1, valor: 2950, creado: 50, act: 50, toque: null,
        f: { linea: 'escuela', zona: 'cerca', perfil: 'adiestrador' }, s: { visitas: 1 }, conv: [] },
      { id: 'o28', n: 'Laia Font', rol: 'Amante de los perros', seg: 'alumno', ciudad: 'Barcelona', prod: ESCUELA, orig: 'c5', canal: 'wa', etapa: 2, valor: 2950, creado: 7 * D, act: 6 * D, toque: 6 * D,
        f: { linea: 'escuela', zona: 'bcn', perfil: 'amante', gratis: true }, s: { ppto: 'no' },
        conv: [[7 * D, 'a', 'wa', 'Hola Laia, ¿buscas la formación para trabajar con perros?'], [6 * D, 'c', 'wa', 'Es más por curiosidad. ¿Hay algún curso gratis?']] },
      { id: 'o29', n: 'Xavier Costa', rol: 'Osteópata', seg: 'alumno', ciudad: 'Barcelona', prod: ESCUELA, orig: 'c4', canal: 'wa', etapa: 3, valor: 2950, creado: 25 * D, act: 21 * D, toque: 21 * D,
        f: { linea: 'escuela', zona: 'bcn', perfil: 'osteo' }, s: { luego: 'la promoción siguiente', luegoTxt: 'entraría en la promoción siguiente: este año no puede con los talleres' },
        conv: [[25 * D, 'a', 'wa', 'Hola Xavier, ¿ya tratas animales en tu consulta?'], [21 * D, 'c', 'wa', 'Todavía no. Me encanta, pero este año no puedo con los talleres. Entraría en la promoción siguiente.']] },
      { id: 'o30', n: 'Irene Blanco', rol: 'Veterinaria', seg: 'alumno', ciudad: 'Lleida', prod: ESCUELA, orig: 'c4', canal: 'wa', etapa: 4, valor: 2950, creado: 12 * D, act: 4 * D, toque: 4 * D,
        f: { linea: 'escuela', zona: 'lejos', perfil: 'vet', talleres: true }, s: { noshow: true, fechas: true },
        conv: [[12 * D, 'a', 'wa', 'Hola Irene, soy Sara, de la escuela. ¿Trabajas en clínica?'], [11 * D, 'c', 'wa', 'Sí, en Lleida. Quiero empezar en enero.'], [5 * D, 'a', 'wa', 'Te espero mañana en la entrevista de admisión, por videollamada.']],
        ev: [[4 * D, 'sistema', 'No se presenta a la entrevista de admisión']] },
      { id: 'o31', n: 'Sara Domènech', rol: 'Fisioterapeuta', seg: 'alumno', ciudad: 'Barcelona', prod: ESCUELA, orig: 'c4', canal: 'wa', etapa: 5, valor: 2950, creado: 30 * D, act: 3 * D, toque: 3 * D, fin: 'ganado',
        f: { linea: 'escuela', zona: 'bcn', perfil: 'fisio', talleres: true }, conv: [] },
      { id: 'o32', n: 'Andrés Molina', rol: 'Estudiante de veterinaria', seg: 'alumno', ciudad: 'Murcia', prod: ESCUELA, orig: 'c5', canal: 'wa', etapa: 1, valor: 2950, creado: 4 * D, act: 4 * D, toque: 4 * D - 1,
        f: { linea: 'escuela', zona: 'lejos', perfil: 'estudiante' }, s: { intentos: 2 },
        conv: [[4 * D - 1, 'a', 'wa', 'Hola Andrés, soy Sara, de la escuela. ¿Te llamamos y te cuento cómo es la formación?']] },
      { id: 'o33', n: 'Carmen Ruiz', rol: 'Auxiliar de veterinaria', seg: 'alumno', ciudad: 'Bilbao', prod: ESCUELA, orig: 'c4', canal: 'email', etapa: 1, valor: 2950, creado: 22 * D, act: 22 * D, toque: 15 * D, fin: 'perdido',
        f: { linea: 'escuela', zona: 'lejos', perfil: 'auxvet' }, s: { intentos: 3 }, conv: [] },
      { id: 'o34', n: 'Nil Serra', rol: 'Fisioterapeuta', seg: 'alumno', ciudad: 'Girona', prod: ESCUELA, orig: 'c4', canal: 'wa', etapa: 2, valor: 2950, creado: 30 * H, act: 150, toque: 29 * H,
        f: { linea: 'escuela', zona: 'cerca', perfil: 'fisio', talleres: true }, s: { visitas: 3, fechas: true },
        conv: [[30 * H - 1, 'a', 'wa', 'Hola Nil, soy Sara, de la escuela. ¿Te interesa la promoción de enero?'], [150, 'c', 'wa', 'Sí. ¿Qué titulación da al acabar? ¿Me sirve para trabajar por mi cuenta?']] },
      { id: 'o35', n: 'Beatriz Ortega', rol: 'Veterinaria', seg: 'alumno', ciudad: 'Madrid', prod: ESCUELA, orig: 'c4', canal: 'email', etapa: 1, valor: 2950, creado: 2 * D, act: 30 * H, toque: 2 * D - 2,
        f: { linea: 'escuela', zona: 'lejos', perfil: 'vet' }, s: { visitas: 3, intentos: 1 },
        conv: [[2 * D - 2, 'a', 'email', 'Hola Beatriz, te escribo por la formación en osteopatía canina de 12 meses.']] },
      { id: 'o36', n: 'Guillem Prat', rol: 'Amante de los perros', seg: 'alumno', ciudad: 'Barcelona', prod: ESCUELA, orig: 'c5', canal: 'wa', etapa: 1, valor: 2950, creado: 16 * D, act: 16 * D, toque: 10 * D,
        f: { linea: 'escuela', zona: 'bcn', perfil: 'amante' }, s: { intentos: 3 },
        conv: [[16 * D, 'a', 'wa', 'Hola Guillem, ¿te quedaste con alguna duda de la clase abierta?']] }
    ]
  };
})();

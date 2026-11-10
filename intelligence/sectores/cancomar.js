/* Sector: CANCOMAR (Cantábrica Consultores Marítimos), centro de formación marítima homologado en Avilés.
 * Cuenta de cliente oculta: se abre por enlace (?sector=cancomar) y no sale en la pantalla de inicio.
 * Preparado el 10-nov a partir de maritima.js. Los nombres de los cursos y las fechas de convocatoria
 * son los publicados en su web (consulta del 10-nov-2026). Las etapas son las propuestas en la reunión:
 * Petición nueva · Contactado · Esperando fecha / lista de espera · Plaza reservada · Matriculado y pagado ·
 * Renovación en 5 años. Todo lo demás (personas, empresas, equipo de admisiones, importes, volúmenes,
 * embudo y mensajes) son DATOS DE EJEMPLO inventados: no son cifras ni personas de CANCOMAR. */
(function () {
  const H = 60, D = 1440;
  const tieneRol = function (c, re) { return re.test(c.rol || ''); };
  const Q = window.QV.voz;
  const hc = Q.hueco(9);

  // Cursos de su catálogo público.
  const FB = 'Actualización Formación Básica en Seguridad Marítima', FBI = 'Formación Básica en Seguridad Marítima',
    LCI = 'Actualización Avanzado Lucha Contra Incendios', SAN = 'Actualización Formación Sanitaria Específica Inicial',
    GOC = 'Actualización Operador General SMSSM / GMDSS', ROC = 'Actualización Operador Restringido del SMSSM',
    PAS = 'Actualización Buques de Pasaje', PPAS = 'Pack Trabaja en Buques de Pasaje', PLP = 'Patrón Local de Pesca',
    MPU = 'Marinero de Puente', PMP = 'Pack Marinero en la Pesca', MMP = 'Manipulación de Mercancías Peligrosas',
    EMP = 'Formación a la carta para la tripulación';
  // Importes de ejemplo (no son sus precios).
  const P = {}; P[FB] = 190; P[FBI] = 420; P[LCI] = 240; P[SAN] = 210; P[GOC] = 260; P[ROC] = 180; P[PAS] = 150;
  P[PPAS] = 380; P[PLP] = 1200; P[MPU] = 650; P[PMP] = 520; P[MMP] = 300;

  // Convocatorias publicadas en su web. Si la fecha ya ha pasado, se usa un hueco relativo.
  const conv = function (iso, hora, txt) {
    const d = new Date(iso + 'T' + (hora < 10 ? '0' : '') + hora + ':00:00');
    const min = Math.round((d.getTime() - Date.now()) / 60000);
    return min > D ? { txt: txt, min: min } : { txt: hc.txt, min: hc.min };
  };
  const cFB = conv('2026-11-30', 9, '30 de noviembre y 1 de diciembre');
  const cPLP = conv('2027-01-11', 9, '11 de enero');
  const MIN_HISTORIA = 1 + 1 + 9 + 2 + 1 + 4 + 1;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.cancomar = {
    id: 'cancomar',
    nombre: 'CANCOMAR',
    t: {
      contacto: 'interesado', contactos: 'interesados', Contactos: 'Interesados', Contacto: 'Interesado',
      venta: 'matrícula', ventas: 'matrículas', Ventas: 'Matrículas', producto: 'curso', Producto: 'Curso',
      paginaVisitas: 'la ficha del curso', cita: 'convocatoria', Cita: 'Convocatoria', laCita: 'la convocatoria',
      propuesta: 'la propuesta de formación', Propuesta: 'Propuesta de formación', propuestas: 'propuestas de formación',
      comercial: 'Begoña', Comercial: 'Begoña',
      cliente: 'alumno', unCliente: 'un alumno', clientes: 'alumnos', convierten: 'se matriculan',
      objetivoPaso: 'reservarle plaza en la próxima convocatoria', casoExito: 'el testimonio de un alumno que renovó a tiempo', valorAlto: 1000,
      oportunidades: 'interesados', atencion: 'interesados que requieren atención', laVenta: 'la matrícula',
      verbo: 'matricularse', clientesReales: 'matrículas de verdad', empleados: 'tripulantes',
      pasoHumano: 'confirmar fechas y validez del certificado y cerrar la plaza',
      nombreAgenteVoz: 'Noa',
      senales: { nueva: 'Petición nueva', noshow: 'Plaza en riesgo', propuesta: 'Propuesta sin respuesta', revision: 'Renovación a 5 años', expansion: 'La empresa quiere formar a más gente' },
      anunciosIntro: 'Hoy casi todo entra sin anuncios. Cada fila es una fuente: la web, el teléfono, el WhatsApp, las empresas, los avisos de renovación a la base, las listas de espera y un anuncio de prueba de la fase 3. El sistema une cada fuente con lo que pasa después: quién recibe respuesta, quién reserva plaza y quién se matricula y paga.',
      notaTitulo: 'Qué cambiaría este mes en las fuentes', notaBoton: 'Redactar la nota de fuentes',
      notaIntro: 'Esto es lo que cambiaría este mes en la captación, cruzando cada fuente con lo que pasa después.',
      preguntaNota: '¿Qué cambiaríamos este mes en las fuentes de captación?', notaAsunto: 'Asunto: Fuentes de captación · qué cambiar', notaCorreo: 'Nota de fuentes'
    },
    // Fuente → Petición nueva → Contactado → Esperando fecha / lista de espera → Plaza reservada → Matriculado y pagado → Renovación en 5 años
    recorrido: [
      { id: 'anuncio', txt: 'Fuente', sinFuga: true },
      { id: 'peticion', txt: 'Petición nueva' },
      { id: 'contactado', txt: 'Contactado' },
      { id: 'espera', txt: 'Esperando fecha / lista de espera' },
      { id: 'plaza', txt: 'Plaza reservada' },
      { id: 'matricula', txt: 'Matriculado y pagado' },
      { id: 'renovacion', txt: 'Renovación en 5 años', sinFuga: true }
    ],
    ventaEtapa: 'matricula',
    ticket: 230,
    // Qué conversión es razonable en cada paso cuando el seguimiento está bien hecho (referencia de ejemplo).
    referencia: { contactado: 0.92, espera: 0.75, plaza: 0.68, matricula: 0.9 },
    nombresFuga: {
      contactado: { txt: 'Respuesta', exp: 'peticiones que llegan de noche, en fin de semana o desde el barco y se contestan al día siguiente, cuando ya han reservado en otro centro' },
      espera: { txt: 'Fecha o lista de espera', exp: 'contactados a los que nadie les da una fecha ni los apunta a la lista de espera de su curso' },
      plaza: { txt: 'Reserva de plaza', exp: 'personas en lista de espera a las que nadie avisa cuando abre la convocatoria' },
      matricula: { txt: 'Matrícula y pago', exp: 'plazas reservadas que no terminan en matrícula pagada' }
    },
    remedioFuga: {
      contactado: 'Respuesta en el minuto uno, también de noche y en fin de semana, con una plantilla que ha aprobado admisiones: el curso, la próxima convocatoria y la lista de espera si no hay fecha. A primera hora, Begoña o Nerea encuentran el hilo y el borrador de la respuesta, listos para aprobar.',
      espera: 'Cada petición sin fecha entra en la lista de espera de su curso. Nadie se queda en «ya te avisaremos» sin que conste en ningún sitio.',
      plaza: 'Al abrir convocatoria, se avisa primero a la lista de espera de ese curso, por orden de llegada. El anuncio solo llena lo que queda.'
    },
    mesDatos: { respuestaAntes: 610, respuestaAhora: 2, agendadas: 140 },
    campanas: [
      { id: 'c1', canal: 'Web y Google', nombre: 'Formulario de la web y búsquedas de cursos y actualizaciones STCW', inversion: 0, ticket: 220,
        embudo: { anuncio: 4800, peticion: 70, contactado: 46, espera: 34, plaza: 22, matricula: 18, renovacion: 18 } },
      { id: 'c2', canal: 'Teléfono', nombre: 'Llamadas al centro', inversion: 0, ticket: 240,
        embudo: { anuncio: 140, peticion: 62, contactado: 55, espera: 40, plaza: 27, matricula: 23, renovacion: 23 } },
      { id: 'c3', canal: 'WhatsApp', nombre: 'Mensajes al WhatsApp del centro (muchos desde el barco)', inversion: 0, ticket: 210,
        embudo: { anuncio: 260, peticion: 88, contactado: 44, espera: 30, plaza: 16, matricula: 12, renovacion: 12 } },
      { id: 'c4', canal: 'Empresas', nombre: 'Armadores, navieras y empresas portuarias', inversion: 0, ticket: 2400,
        embudo: { anuncio: 30, peticion: 26, contactado: 24, espera: 18, plaza: 12, matricula: 10, renovacion: 10 } },
      { id: 'c5', canal: 'Base de datos', nombre: 'Avisos de renovación a 5 años a antiguos alumnos', inversion: 0, ticket: 200,
        embudo: { anuncio: 420, peticion: 52, contactado: 47, espera: 36, plaza: 26, matricula: 22, renovacion: 22 } },
      { id: 'c6', canal: 'Lista de espera', nombre: 'Aviso de convocatoria a la lista de espera de cada curso', inversion: 0, ticket: 600,
        embudo: { anuncio: 64, peticion: 30, contactado: 29, espera: 25, plaza: 18, matricula: 15, renovacion: 15 } },
      { id: 'c7', canal: 'Meta', nombre: 'Prueba de fase 3 · «¿Tu certificado caduca en 2027?»', inversion: 150, ticket: 190,
        embudo: { anuncio: 7200, peticion: 22, contactado: 13, espera: 8, plaza: 4, matricula: 3, renovacion: 3 } }
    ],
    kpis: ['interesados', 'respuesta', 'fuera', 'cualificados', 'listaEspera', 'plazas', 'ventas', 'ingresos', 'caducan'],
    kpiNombres: { interesados: 'Peticiones nuevas', cualificados: 'Con fecha o en lista de espera', ventas: 'Matriculados y pagados', ingresos: 'Facturación del mes' },
    kpiEtapas: { interesados: 'peticion', cualificados: 'espera', entrevistas: 'plaza' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      return {
        fuera: { l: 'Fuera de horario sin respuesta', v: M.num(cs.filter(function (c) { return c.s.fuera && !c.fin && !c.conv.length; }).length), em: 'de noche, en fin de semana o desde el barco', clase: 'mal' },
        listaEspera: { l: 'En lista de espera', v: M.num(cs.filter(function (c) { return c.s.espera && !c.fin; }).length), em: 'se avisan primero al abrir convocatoria' },
        plazas: { l: 'Plazas reservadas', v: M.num(m.tot.plaza), em: M.pct(m.tot.plaza / Math.max(1, m.tot.espera)) + ' de los que tienen fecha o están en espera' },
        caducan: { l: 'Renovaciones a 5 años próximas', v: M.num(cs.filter(function (c) { return c.s.revision || (c.f && c.f.caduca && !c.fin); }).length), em: 'a avisar meses antes de que caduquen', clase: 'bien' }
      };
    },
    agenda: { horas: [8, 20], pausa: [14, 16], ocupacion: 0.5, etapa: 'plaza', sabado: true,
      tipos: ['Convocatoria · actualización STCW', 'Convocatoria · empresa', 'Convocatoria · curso completo', 'Llamada de admisiones', 'Convocatoria · fin de semana'] },
    veredictoAnuncio: function (f, Mo) {
      const e = f.c.embudo;
      if (f.c.inversion > 0) {
        return { id: 'prueba', txt: 'En prueba', tono: 't-amber', por: 'Solo ' + Mo.num(e.peticion) + ' peticiones y ' + Mo.pl(e.matricula, 'matrícula', 'matrículas') + ': son pocos datos para decidir. Es la fase 3; primero va la respuesta y la base de datos.' };
      }
      if (f.c.id === 'c5' || f.c.id === 'c6') return { id: 'base', txt: 'Vuestra base', tono: 't-teal', por: 'Sin coste de anuncio. De los que reciben respuesta, acaba matriculado el ' + Mo.pct(f.post) + '. Es la fuente más barata: repetidla cada mes.' };
      return { id: 'organico', txt: 'Sin inversión', tono: 't-gris', por: 'No tiene coste de anuncio. De los que reciben respuesta, acaba matriculado el ' + Mo.pct(f.post) + '.' };
    },
    notaAnuncios: function (a, T, Mo) {
      const lin = [];
      const fi = function (id) { return a.filas.filter(function (f) { return f.c.id === id; })[0]; };
      const w = fi('c1'), wa = fi('c3'), b = fi('c5'), le = fi('c6'), e = fi('c4'), p = fi('c7');
      if (wa) lin.push('El WhatsApp trae más peticiones (' + wa.entra + ') que ninguna otra fuente, pero solo la mitad recibe respuesta: llegan de noche o desde el barco. No es el canal, es la hora. La plantilla aprobada de fuera de horario lo tapa.');
      if (w) lin.push('La web trae ' + w.entra + ' peticiones y ' + Mo.pl(w.ventas, 'matrícula', 'matrículas') + '. Antes de pagar tráfico, que nadie se quede sin respuesta.');
      if (b) lin.push('Los avisos de renovación a 5 años trajeron ' + Mo.pl(b.ventas, 'matrícula', 'matrículas') + ' sin gastar en anuncios. Quien tiene que renovar lo hace sí o sí: gana el centro que le avisa a tiempo.');
      if (le) lin.push('Las listas de espera llenaron ' + Mo.pl(le.ventas, 'plaza', 'plazas') + ' en cursos con fecha nueva. Al abrir convocatoria, avisad primero a la lista; el anuncio llena lo que quede.');
      if (e) lin.push('Las empresas son pocas pero grandes: ' + Mo.euros(e.c.ticket) + ' de media por matrícula. A cada una, una persona y una propuesta el mismo día.');
      if (p) lin.push('El anuncio de prueba de renovación lleva ' + p.entra + ' peticiones a ' + Mo.euros(p.cpl) + ' cada una. Juzgadlo por plazas reservadas, no por formularios.');
      return lin;
    },
    bannerAnuncios: false,
    timelineSinOrigen: true,
    textoAlta: function (c) {
      const cp = (window.QV_SECTORES.cancomar.campanas || []).filter(function (x) { return x.id === c.orig; })[0];
      return 'Petición nueva · ' + c.prod + (cp ? ' · desde ' + cp.canal : '');
    },

    reglas: {
      fitBase: 26,
      fit: [
        [function (c) { return c.f && c.f.embarque; }, 22, function (c) { return 'tiene embarque a la vista: ' + c.f.embarque; }, 'Embarque a la vista'],
        [function (c) { return c.f && c.f.caduca; }, 18, function (c) { return 'su certificado caduca ' + c.f.caduca; }, 'Certificado a punto de caducar'],
        [function (c) { return c.f && c.f.titulo; }, 10, 'ya tiene la titulación previa que pide el curso', 'Cumple los requisitos previos'],
        [function (c) { return c.f && c.f.cerca; }, 8, 'puede venir a Avilés', 'Puede venir a Avilés'],
        [function (c) { return c.f && c.f.empresaPaga; }, 10, 'su armador o su empresa le paga el curso', 'Lo paga su empresa'],
        [function (c) { return c.seg === 'empresa' && c.tam >= 30; }, 28, function (c) { return 'empresa de ' + c.tam + ' trabajadores'; }, 'Empresa de 30 trabajadores o más'],
        [function (c) { return c.seg === 'empresa' && c.tam >= 8 && c.tam < 30; }, 16, function (c) { return 'empresa de ' + c.tam + ' trabajadores'; }, 'Empresa de 8 a 29 trabajadores'],
        [function (c) { return c.seg === 'empresa' && tieneRol(c, /armador|flota|gerente|director|responsable|jefe|capit|patr|recursos|rr\. ?hh|personas|seguridad|formaci/i); }, 14, function (c) { return 'decide la formación (' + c.rol + ')'; }, 'Su puesto decide la formación'],
        [function (c) { return c.f && c.f.dotacion >= 6; }, 12, function (c) { return 'forma a ' + c.f.dotacion + ' personas a la vez'; }, 'Grupo de 6 personas o más'],
        [function (c) { return c.valor >= 1000; }, 6, 'titulación o formación de grupo, ticket alto'],
        [function (c) { return c.f && c.f.curioso; }, -22, 'curiosidad: no trabaja ni va a trabajar en el mar', 'Sin vínculo con el sector'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'busca formación gratuita'],
        [function (c) { return c.f && c.f.lejos; }, -14, function (c) { return 'vive lejos (' + c.f.lejos + ')'; }, 'Vive lejos de Avilés'],
        [function (c) { return c.f && c.f.otroCurso; }, -12, 'pide un curso que el centro no imparte'],
        [function (c) { return c.f && c.f.sinRequisitos; }, -10, 'todavía no cumple los requisitos del curso']
      ],
      intencion: [
        [function (c) { return c.s.conv; }, 14, 'preguntó por la próxima convocatoria'],
        [function (c) { return c.s.valido; }, 12, 'preguntó si el certificado le vale para embarcar'],
        [function (c) { return c.s.docs; }, 10, 'preguntó qué documentación tiene que traer'],
        [function (c) { return c.s.pidePpto; }, 14, 'pidió propuesta para la tripulación'],
        [function (c) { return c.s.espera && !c.fin; }, 10, function (c) { return 'se apuntó a la lista de espera de ' + c.s.espera; }],
        [function (c) { return c.s.abre && !c.fin; }, 12, 'su curso ya tiene convocatoria abierta'],
        [function (c) { return c.s.fuera && !c.fin; }, 14, 'escribió fuera de horario: quien escribe de noche lo necesita ya'],
        [function (c) { return c.etapa === 4 && !c.fin; }, 18, 'tiene plaza reservada y solo falta la matrícula y el pago']
      ],
      riesgo: [
        [function (c, k) { return c.s.fuera && !c.fin && !c.conv.length; }, 46, function (c, k) { return 'lleva ' + QV.motor.duracion(k.creado) + ' sin primera respuesta (escribió fuera de horario)'; }]
      ]
    },

    nba: function (c, k, x, T, M) {
      if (c.fin === 'ganado' && c.s.revision && !c.s.exp) {
        return { id: 'recordatorio', accion: 'Aviso de renovación con las próximas convocatorias', quien: 'Automatización', tipo: 'auto', estado: 'esperando',
          por: (c.s.revisionTxt || 'Le toca renovar') + '. Sale un WhatsApp con las dos próximas fechas de actualización en Avilés y el enlace para reservar plaza. El texto lo aprobó admisiones una vez; nadie tiene que acordarse.' };
      }
      if (c.s.fuera && !c.fin && !c.conv.length) {
        return { id: 'wa', accion: 'Respuesta con la plantilla aprobada de fuera de horario', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Escribió fuera de horario (' + M.hace(k.creado) + ') y nadie le ha contestado. Sale la plantilla que aprobó admisiones con el curso y la próxima convocatoria, y a primera hora Begoña encuentra el hilo y el borrador para seguir.' + (c.f && c.f.embarcado ? ' Está embarcado: solo WhatsApp, sin llamadas.' : '') };
      }
      if (c.s.espera && c.s.abre && !c.fin && c.etapa <= 3) {
        return { id: 'convocatoria', accion: 'Avisar de la convocatoria abierta, antes que al anuncio', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Está en la lista de espera de ' + c.s.espera + ' y ya hay fecha (' + (c.s.abreTxt || 'convocatoria abierta') + '). La lista se avisa primero, por orden de llegada; Nerea revisa el mensaje antes de que salga.' };
      }
      if (c.s.espera && !c.fin && c.etapa <= 3) {
        return { id: 'esperar', accion: 'En lista de espera de ' + c.s.espera, quien: 'Automatización', tipo: 'auto', estado: 'esperando',
          por: 'Su curso todavía no tiene fecha. Está en la lista con lo que dijo; en cuanto se abra convocatoria, recibe el aviso de los primeros. Mientras, nadie le molesta.' };
      }
      if (c.seg === 'empresa' && c.s.pidePpto && c.s.tProp == null && !c.fin && M.contesto(c) > 0) {
        return { id: 'comercial', accion: 'Pasar a Begoña para la propuesta', quien: 'Begoña', tipo: 'humano', estado: 'humano',
          por: 'Pide propuesta para la tripulación (' + M.euros(c.valor) + ', importe de ejemplo) y ya está en conversación. El sistema no da precios ni condiciones: pasa el hilo resumido, con quién tiene qué certificado y cuándo caduca.' };
      }
      if (c.etapa === 4 && !c.fin && !c.s.noshow) {
        return { id: 'cobro', accion: 'Recordar la matrícula y el pago', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Tiene plaza reservada y la matrícula sigue sin pagar. Un mensaje con el enlace de pago y lo que falta del expediente lo cierra sin llamar; si no responde, Nerea lo ve en la señal.' };
      }
      return M.nbaGenerica(c, k, x, T);
    },
    vozDijo: function (c) { return c.f && c.f.embarque ? ['Embarque: ' + c.f.embarque] : []; },
    vozMotivo: function (c) { return 'Pide información de «' + c.prod + '».'; },

    preguntas: [
      { q: '¿Quién escribió fuera de horario y sigue sin respuesta?', h: 'lista', obj: ['seguimiento', 'captacion', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.fuera; }, orden: 'prob',
        intro: function (l) { return l.length + ' peticiones llegaron de noche, en fin de semana o desde el barco y no tienen primera respuesta. Quien necesita el certificado para embarcar no espera a la mañana: escribe al siguiente centro.'; },
        vista: 'tabla' },
      { q: '¿A quién le toca renovar en los próximos meses?', h: 'lista', obj: ['retencion', 'seguimiento', 'todo'],
        filtro: function (c) { return !!c.s.revision || !!(c.f && c.f.caduca && !c.fin); }, orden: 'prob',
        intro: function (l) { return l.length + ' personas tienen un certificado que caduca pronto (se renuevan cada 5 años). Quien tiene que renovar lo hace sí o sí: gana quien le avisa a tiempo con una fecha concreta.'; },
        vista: 'tabla' },
      { q: '¿Quién está en lista de espera y de qué curso?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.espera; }, orden: 'prob',
        intro: function (l) { return l.length + ' interesados esperan fecha para su curso. Los de Patrón Local de Pesca ya tienen convocatoria el 11 de enero: se avisan antes de anunciarla.'; },
        vista: 'tabla' },
      { q: '¿Qué plazas reservadas siguen sin matrícula pagada?', h: 'lista', obj: ['conversion', 'ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.etapa === 4; }, orden: 'prob',
        intro: function (l) { return l.length + ' plazas reservadas no tienen la matrícula pagada. El recordatorio con el enlace de pago sale solo; a quien no vino, se le propone la siguiente convocatoria.'; },
        vista: 'tabla' },
      { q: '¿Qué empresas pidieron propuesta y no han vuelto?', h: 'lista', obj: ['ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return c.seg === 'empresa' && !c.fin && (c.s.tProp != null || c.s.pidePpto); }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' empresas tienen una propuesta pedida o enviada y sin cerrar, por ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' (importes de ejemplo). Las lleva siempre una persona, con el contexto delante.'; },
        vista: 'tabla' },
      { q: '¿Qué interesados tienen más probabilidad de matricularse?', h: 'probables', obj: ['conversion', 'ventas', 'todo'] },
      { q: '¿Qué fuente llena las convocatorias?', h: 'campanas', obj: ['captacion', 'todo'] }
    ],

    historias: {
      noche: {
        titulo: 'Un marinero escribe desde el barco a las 23:40 para renovar la Formación Básica',
        contacto: { id: 'demo', n: 'Andrés Granda', rol: 'Marinero · embarcado', seg: 'persona', ciudad: '—', prod: FB, orig: 'c3', canal: 'wa', etapa: 1, valor: P[FB], creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Martes, 23:40: entra un WhatsApp desde el barco, con poca cobertura', feed: 'Petición nueva · ' + FB + ' · fuera de horario', cambio: { s: { fuera: true } } },
          { dur: 6, min: 1, txt: 'El sistema completa la ficha con lo que escribe y lo que ya había en la base', feed: 'Ficha completada · hizo la Formación Básica hace casi 5 años · le caduca antes de su próximo embarque', cambio: { ciudad: 'Avilés', f: { caduca: 'antes del próximo embarque', titulo: true, cerca: true, embarcado: true } } },
          { dur: 7, min: 1, txt: 'Sale en el minuto uno la plantilla de fuera de horario que aprobó admisiones', feed: 'WhatsApp enviado en 52 segundos · plantilla aprobada', toque: true,
            cambio: { conv: ['a', 'wa', 'Hola Andrés, gracias por escribir a CANCOMAR 👋 Para renovar la Formación Básica, la próxima actualización es el ' + cFB.txt + ', en Avilés. Mañana a primera hora te escribe una persona de admisiones para dejártelo cerrado. ¿Para cuándo lo necesitas?'] } },
          { dur: 6, min: 9, txt: 'Andrés mira la ficha del curso con la cobertura que tiene', feed: 'Visita la ficha del curso (2 veces)', cambio: { s: { visitas: 2 } }, act: true },
          { dur: 7, min: 2, txt: 'Contesta: desembarca antes de esa fecha y quiere la plaza', feed: 'Respuesta recibida · quiere la convocatoria del ' + cFB.txt, cambio: { etapa: 2, s: { conv: true, valido: true, urg: true, urgTxt: 'le caduca antes del próximo embarque' }, conv: ['c', 'wa', 'Desembarco el 25, me cuadra. ¿Qué tengo que llevar? Aquí casi no tengo cobertura, mejor por aquí que por teléfono.'] }, act: true },
          { dur: 7, min: 1, txt: 'El sistema prepara la respuesta y la deja para que admisiones la apruebe por la mañana', feed: 'Borrador preparado para Begoña · marcado «embarcado», sin llamadas', toque: true,
            cambio: { etapa: 3, s: { docs: true }, conv: ['a', 'wa', 'Apuntado, Andrés. Te guardamos la fecha y mañana te confirmamos la plaza y qué llevar. Seguimos por WhatsApp, sin llamadas.'] } },
          { dur: 7, min: 4, txt: 'A las 8:30, Begoña aprueba el mensaje y reserva la plaza', feed: 'Plaza reservada · convocatoria del ' + cFB.txt, vista: 'agenda', toque: true,
            cambio: { etapa: 4, s: { cita: cFB.min - MIN_HISTORIA, citaOk: true }, conv: ['h', 'wa', 'Buenos días, Andrés. Soy Begoña, de admisiones. Tienes la plaza reservada para el ' + cFB.txt + ' en Avilés. Te dejo el enlace para la matrícula y el pago, y la lista de lo que tienes que traer.'] } },
          { dur: 0, min: 1, txt: 'Queda programado el aviso de su próxima renovación, dentro de 5 años', feed: 'Aviso de renovación a 5 años programado', humano: { titulo: 'Andrés tiene plaza para el ' + cFB.txt, texto: 'Marinero · escribió desde el barco a las 23:40 y recibió respuesta en 52 segundos · Actualización de Formación Básica · prefiere WhatsApp, sin llamadas. Falta la matrícula y el pago. Al terminar, queda el aviso de renovación a 5 años.' } }
        ]
      },
      espera: {
        titulo: 'Se abre la convocatoria de Patrón Local de Pesca y se avisa primero a la lista de espera',
        contacto: { id: 'demo', n: 'Diego Menéndez', rol: 'Marinero de pesca · quiere ser patrón', seg: 'persona', ciudad: 'Luarca', prod: PLP, orig: 'c6', canal: 'wa', etapa: 3, valor: P[PLP], creado: 0, act: 0, f: { titulo: true, cerca: true }, s: { espera: PLP }, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Diego lleva semanas en la lista de espera de Patrón Local de Pesca', feed: 'En lista de espera · ' + PLP, cambio: {} },
          { dur: 6, min: 1, txt: 'Admisiones publica la convocatoria: del 11 de enero al 18 de febrero, en Avilés', feed: 'Convocatoria abierta · ' + PLP + ' · ' + cPLP.txt, cambio: { s: { abre: true, abreTxt: 'empieza el ' + cPLP.txt } } },
          { dur: 7, min: 1, txt: 'El aviso sale primero a la lista de espera, por orden de llegada, antes que el anuncio', feed: 'Aviso a la lista de espera · 14 personas · Diego, de los primeros', toque: true,
            cambio: { conv: ['a', 'wa', 'Hola Diego, te escribimos de CANCOMAR. Estabas en la lista de espera de Patrón Local de Pesca: ya hay fecha. Empieza el ' + cPLP.txt + ' en Avilés. Te avisamos antes de anunciarlo. ¿Te guardamos plaza?'] } },
          { dur: 7, min: 6, txt: 'Diego contesta enseguida y pregunta por los requisitos', feed: 'Respuesta · pregunta requisitos y horario', cambio: { s: { conv: true, docs: true, urg: true, urgTxt: 'quiere empezar en enero' }, conv: ['c', 'wa', '¡Por fin! Sí, guárdamela. ¿Qué papeles necesito y es de mañana o de tarde?'] }, act: true },
          { dur: 7, min: 1, txt: 'Los requisitos los confirma una persona: aviso a Nerea', feed: 'Pregunta de requisitos · aviso a Nerea', toque: true,
            cambio: { etapa: 4, s: { cita: cPLP.min, citaOk: true }, conv: ['a', 'wa', 'Te guardamos la plaza. Los requisitos y el horario te los confirma Nerea, de admisiones, para que te lo diga con precisión.'] } },
          { dur: 0, min: 1, txt: 'Aviso a Nerea con la ficha completa', feed: 'Aviso enviado a Nerea', humano: { titulo: 'Diego quiere plaza en Patrón Local de Pesca', texto: 'Luarca · marinero de pesca · estaba en la lista de espera · plaza guardada para el ' + cPLP.txt + '. Pregunta qué documentación necesita y el horario. Siguiente paso: matrícula y pago.' } }
        ]
      },
      empresa: {
        titulo: 'Un armador quiere saber cuándo le caduca a cada tripulante la Formación Básica',
        contacto: { id: 'demo', n: 'Lorena Pazos', rol: 'Responsable de Flota', emp: 'Pesquera Mar de Fondo', seg: 'empresa', tam: 38, ciudad: '—', prod: EMP, orig: 'c4', canal: 'wa', etapa: 1, valor: 3200, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Entra una petición desde la página de empresas', feed: 'Petición nueva · ' + EMP, cambio: {} },
          { dur: 6, min: 1, txt: 'La ficha se completa con lo que contestó en el formulario', feed: 'Ficha completada · pesca · 12 tripulantes · este trimestre', cambio: { tam: 38, ciudad: 'Avilés', f: { dotacion: 12, cerca: true } } },
          { dur: 7, min: 1, txt: 'El sistema contesta en el minuto uno y le pregunta qué tiene cada tripulante', feed: 'WhatsApp enviado en 47 segundos', toque: true,
            cambio: { conv: ['a', 'wa', 'Hola Lorena, gracias por escribir a CANCOMAR. Para preparar la propuesta, ¿nos dices qué certificados tiene en vigor cada tripulante y cuándo os viene bien formarlos? Te llama Begoña, de admisiones, para cerrarlo.'] } },
          { dur: 7, min: 8, txt: 'Lorena contesta: 12 tripulantes y varias Formaciones Básicas que caducan en 2027', feed: 'Respuesta · pide propuesta · actualizaciones que caducan en 2027', cambio: { etapa: 2, s: { pidePpto: true, conv: true, urg: true, urgTxt: 'quiere a la tripulación renovada antes de la próxima campaña' }, conv: ['c', 'wa', 'Somos 12. A la mitad les caduca la Formación Básica en 2027 y a dos el Avanzado de Lucha Contra Incendios. Queremos hacerlo sin parar el barco.'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso a Begoña: la propuesta la lleva una persona', feed: 'Aviso enviado a Begoña', humano: { titulo: 'Lorena pide propuesta para 12 tripulantes', texto: 'Pesquera · 12 tripulantes · 6 Actualizaciones de Formación Básica y 2 de Lucha Contra Incendios que caducan en 2027 · quiere formarlos sin parar el barco. El sistema no ha dado precios: la propuesta es tuya.' } }
        ]
      }
    },
    historiaDefecto: 'noche',

    contactos: [
      // --- Fuera de horario y sin respuesta
      { id: 'k01', n: 'Rubén Fernández', rol: 'Marinero · escribió desde el barco a las 02:10', seg: 'persona', ciudad: 'Gijón', prod: FB, orig: 'c3', canal: 'wa', etapa: 1, valor: P[FB], creado: 8 * H, act: 8 * H, toque: null,
        f: { embarque: 'en 12 días', caduca: 'antes de embarcar', titulo: true, cerca: true, embarcado: true }, s: { fuera: true, visitas: 2, urg: true, urgTxt: 'embarca en 12 días y le caduca la Formación Básica' }, conv: [] },
      { id: 'k02', n: 'Iker Etxebarria', rol: 'Engrasador · escribió el domingo', seg: 'persona', ciudad: 'Bermeo', prod: LCI, orig: 'c1', canal: 'wa', etapa: 1, valor: P[LCI], creado: 30 * H, act: 30 * H, toque: null,
        f: { caduca: 'en 6 semanas', titulo: true, lejos: 'Bizkaia' }, s: { fuera: true, visitas: 3 }, conv: [] },
      { id: 'k03', n: 'Noelia Suárez', rol: 'Camarera de buque de pasaje · escribió de noche', seg: 'persona', ciudad: 'Santander', prod: PAS, orig: 'c3', canal: 'wa', etapa: 1, valor: P[PAS], creado: 11 * H, act: 11 * H, toque: null,
        f: { caduca: 'en 5 semanas', titulo: true, empresaPaga: true }, s: { fuera: true, visitas: 1 }, conv: [] },
      { id: 'k04', n: 'Tomás Alonso', rol: 'Oficial · correo de madrugada', seg: 'persona', ciudad: 'Oviedo', prod: GOC, orig: 'c1', canal: 'email', etapa: 1, valor: P[GOC], creado: 9 * H, act: 9 * H, toque: null,
        f: { caduca: 'en 2 meses', titulo: true, cerca: true }, s: { fuera: true, visitas: 2, emails: 1 }, conv: [] },
      { id: 'k05', n: 'Hugo Valdés', rol: 'Pide información ahora mismo', seg: 'persona', ciudad: 'Avilés', prod: SAN, orig: 'c7', canal: 'wa', etapa: 1, valor: P[SAN], creado: 12, act: 12, toque: null,
        f: { titulo: true, cerca: true, caduca: 'este mes' }, s: { visitas: 1 }, conv: [] },
      // --- Contactados y con fecha a la vista
      { id: 'k06', n: 'Marcos Tuñón', rol: 'Marinero · embarca en 9 días', seg: 'persona', ciudad: 'Cudillero', prod: FB, orig: 'c2', canal: 'wa', etapa: 2, valor: P[FB], creado: 2 * D, act: 25, toque: 40,
        f: { embarque: 'en 9 días', caduca: 'antes de embarcar', titulo: true, cerca: true }, s: { visitas: 3, conv: true, valido: true, urg: true, urgTxt: 'embarca en 9 días' },
        conv: [[2 * D, 'h', 'wa', 'Hola Marcos, soy Nerea, de admisiones. Te escribo por lo que hablamos por teléfono.'], [2 * D - 30, 'c', 'wa', 'Embarco en 9 días y la Formación Básica se me queda corta.'], [40, 'a', 'wa', 'Tienes la actualización del 30 de noviembre y 1 de diciembre en Avilés. ¿Te reservamos plaza?'], [25, 'c', 'wa', '¿Me vale para embarcar si la hago esos días?']] },
      { id: 'k07', n: 'Lucía Fano', rol: 'Quiere entrar en la pesca', seg: 'persona', ciudad: 'Avilés', prod: MPU, orig: 'c1', canal: 'wa', etapa: 2, valor: P[MPU], creado: 4 * D, act: 3 * D, toque: 3 * D,
        f: { cerca: true }, s: { visitas: 2, conv: true },
        conv: [[4 * D, 'a', 'wa', 'Hola Lucía, gracias por escribir a CANCOMAR. ¿Quieres empezar a trabajar en la mar?'], [3 * D, 'c', 'wa', 'Sí, me interesa Marinero de Puente. ¿Cuándo hay curso?']] },
      { id: 'k08', n: 'Carmen Villa', rol: 'Cocinera de a bordo · le caduca la sanitaria', seg: 'persona', ciudad: 'Gijón', prod: SAN, orig: 'c5', canal: 'wa', etapa: 2, valor: P[SAN], creado: 3 * D, act: 20 * H, toque: 3 * D,
        f: { caduca: 'en 4 semanas', titulo: true, cerca: true }, s: { conv: true, visitas: 2 },
        conv: [[3 * D, 'a', 'wa', 'Hola Carmen, hace casi cinco años hiciste con nosotros la Formación Sanitaria y te caduca en unas semanas. La próxima actualización es el 24 de noviembre en Avilés. ¿Te guardamos plaza?'], [20 * H, 'c', 'wa', 'Uy, no me acordaba. ¿Hay plaza todavía?']] },
      { id: 'k09', n: 'Javier Riestra', rol: 'Mecánico naval · llamó al centro', seg: 'persona', ciudad: 'Avilés', prod: LCI, orig: 'c2', canal: 'tel', etapa: 2, valor: P[LCI], creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { caduca: 'en 3 semanas', titulo: true, cerca: true }, s: { conv: true },
        conv: [[5 * D, 'h', 'wa', 'Hola Javier, soy Nerea. Te dejo por escrito lo que hablamos por teléfono: la actualización de Lucha Contra Incendios es el 1 de diciembre.'], [4 * D, 'c', 'wa', 'Vale, me lo miro con la empresa y te digo.']] },
      // --- Esperando fecha / lista de espera
      { id: 'k10', n: 'Diego Menéndez', rol: 'Marinero de pesca · quiere ser patrón', seg: 'persona', ciudad: 'Luarca', prod: PLP, orig: 'c6', canal: 'wa', etapa: 3, valor: P[PLP], creado: 40 * D, act: 6 * D, toque: 30 * D,
        f: { titulo: true, cerca: true }, s: { espera: PLP, abre: true, abreTxt: 'empieza el 11 de enero', conv: true },
        conv: [[40 * D, 'h', 'wa', 'Hola Diego, te apunto a la lista de espera de Patrón Local de Pesca. Te avisamos en cuanto haya fecha.'], [6 * D, 'c', 'wa', '¿Se sabe algo ya del curso de patrón?']] },
      { id: 'k11', n: 'Sergio Llaneza', rol: 'Marinero · lista de espera de patrón', seg: 'persona', ciudad: 'Avilés', prod: PLP, orig: 'c1', canal: 'wa', etapa: 3, valor: P[PLP], creado: 55 * D, act: 50 * D, toque: 50 * D,
        f: { titulo: true, cerca: true }, s: { espera: PLP, abre: true, abreTxt: 'empieza el 11 de enero' },
        conv: [[55 * D, 'c', 'wa', '¿Cuándo sale el próximo de Patrón Local de Pesca?'], [50 * D, 'h', 'wa', 'Todavía no hay fecha. Te apuntamos a la lista y te avisamos de los primeros.']] },
      { id: 'k12', n: 'Pelayo Cueto', rol: 'Pescador · lista de espera de patrón', seg: 'persona', ciudad: 'Llanes', prod: PLP, orig: 'c3', canal: 'wa', etapa: 3, valor: P[PLP], creado: 28 * D, act: 28 * D, toque: 28 * D,
        f: { titulo: true }, s: { espera: PLP, abre: true, abreTxt: 'empieza el 11 de enero' },
        conv: [[28 * D, 'c', 'wa', 'Quiero sacarme el de patrón local. Apuntadme para la próxima.']] },
      { id: 'k13', n: 'Alba Rodríguez', rol: 'Quiere Marinero de Puente', seg: 'persona', ciudad: 'Oviedo', prod: MPU, orig: 'c1', canal: 'wa', etapa: 3, valor: P[MPU], creado: 20 * D, act: 15 * D, toque: 15 * D,
        f: { cerca: true }, s: { espera: MPU },
        conv: [[20 * D, 'c', 'wa', '¿Tenéis fechas de Marinero de Puente?'], [15 * D, 'h', 'wa', 'Aún no hay fecha. Te dejamos en la lista de espera y te avisamos.']] },
      { id: 'k14', n: 'Óscar Prendes', rol: 'Quiere el Pack Marinero en la Pesca', seg: 'persona', ciudad: 'Avilés', prod: PMP, orig: 'c2', canal: 'tel', etapa: 3, valor: P[PMP], creado: 18 * D, act: 18 * D, toque: 18 * D,
        f: { cerca: true }, s: { espera: PMP, luego: 'enero', luegoTxt: 'lo haría en enero, cuando acabe el contrato en tierra' },
        conv: [[18 * D, 'h', 'wa', 'Hola Óscar, te apunto a la lista del Pack Marinero en la Pesca. Me dices que mejor a partir de enero.']] },
      { id: 'k15', n: 'Elena Pardo', rol: 'Operadora · fin de semana', seg: 'persona', ciudad: 'Santander', prod: ROC, orig: 'c7', canal: 'wa', etapa: 3, valor: P[ROC], creado: 9 * D, act: 9 * D, toque: 9 * D,
        f: { caduca: 'en 3 meses', titulo: true }, s: { espera: ROC },
        conv: [[9 * D, 'a', 'wa', 'Hola Elena, la actualización de Operador Restringido es en fin de semana. Te avisamos con la próxima fecha.']] },
      // --- Plaza reservada sin matrícula pagada
      { id: 'k16', n: 'Adrián Menéndez', rol: 'Plaza reservada hace 4 días · sin pago', seg: 'persona', ciudad: 'Avilés', prod: FB, orig: 'c2', canal: 'tel', etapa: 4, valor: P[FB], creado: 6 * D, act: 4 * D, toque: 4 * D,
        f: { embarque: 'en diciembre', titulo: true, cerca: true }, s: { cita: hc.min, citaOk: false, valido: true },
        conv: [[6 * D, 'h', 'wa', 'Hola Adrián, soy Begoña. Te dejo aquí lo que hablamos por teléfono.'], [4 * D, 'h', 'wa', 'Tienes la plaza reservada. Aquí tienes el enlace para la matrícula y el pago.']] },
      { id: 'k17', n: 'Jorge Solís', rol: 'Plaza reservada · empresa paga', seg: 'persona', ciudad: 'Gijón', prod: SAN, orig: 'c5', canal: 'wa', etapa: 4, valor: P[SAN], creado: 8 * D, act: 2 * D, toque: 2 * D,
        f: { caduca: 'en 3 semanas', titulo: true, empresaPaga: true, cerca: true }, s: { cita: 26 * H, citaOk: false, docs: true },
        conv: [[8 * D, 'a', 'wa', 'Hola Jorge, te caduca la Formación Sanitaria. La próxima actualización es el 24 de noviembre.'], [7 * D, 'c', 'wa', 'Resérvamela. La paga la empresa, ¿a quién le paso la factura?'], [2 * D, 'h', 'wa', 'Te la mandamos a la empresa. Solo falta que nos confirmes los datos de facturación.']] },
      { id: 'k18', n: 'Iván Cuesta', rol: 'No vino a la convocatoria', seg: 'persona', ciudad: 'Avilés', prod: LCI, orig: 'c1', canal: 'wa', etapa: 4, valor: P[LCI], creado: 12 * D, act: 3 * D, toque: 2 * D,
        f: { caduca: 'en 5 semanas', titulo: true, cerca: true }, s: { noshow: true, valido: true },
        conv: [[12 * D, 'a', 'wa', 'Hola Iván, ¿es la actualización de Lucha Contra Incendios?'], [11 * D, 'c', 'wa', 'Sí, apúntame a la próxima.'], [2 * D, 'a', 'wa', 'Iván, ayer no pudiste venir. ¿Te guardamos plaza en la siguiente convocatoria?']],
        ev: [[3 * D, 'sistema', 'No se presenta a la convocatoria']] },
      { id: 'k19', n: 'Beatriz Lavandera', rol: 'Plaza confirmada', seg: 'persona', ciudad: 'Oviedo', prod: GOC, orig: 'c2', canal: 'tel', etapa: 4, valor: P[GOC], creado: 5 * D, act: 5 * H, toque: 5 * H,
        f: { titulo: true, cerca: true }, s: { cita: 3 * D, citaOk: true, docs: true },
        conv: [[5 * D, 'h', 'wa', 'Hola Beatriz, te dejo por escrito la convocatoria de Operador General del 19 y 20 de diciembre.'], [5 * H, 'h', 'wa', 'Confirmada tu plaza. Trae el DNI y el certificado anterior.'], [5 * H - 10, 'c', 'wa', 'Perfecto, allí estaré.']] },
      // --- Empresas
      { id: 'k20', n: 'Ramón Otero', rol: 'Armador', emp: 'Pesqueros Bajamar', seg: 'empresa', tam: 64, ciudad: 'Avilés', prod: EMP, orig: 'c4', canal: 'email', etapa: 3, valor: 5200, creado: 12 * D, act: 5 * H, toque: 5 * D,
        f: { dotacion: 22, cerca: true }, s: { prop: 5 * D, propVista: 3, visitas: 3, pidePpto: true },
        conv: [[12 * D, 'h', 'email', 'Hola Ramón, te escribo por la formación de vuestra tripulación.'], [11 * D, 'c', 'email', 'Somos 22 tripulantes en tres barcos. Necesitamos actualizar Formación Básica y Lucha Contra Incendios.'], [5 * D, 'h', 'email', 'Te envío la propuesta con las fechas por barco.']],
        ev: [[5 * H, 'web', 'Abre la propuesta por tercera vez']] },
      { id: 'k21', n: 'Marta Iglesias', rol: 'Responsable de Recursos Humanos', emp: 'Naviera Faro Azul', seg: 'empresa', tam: 120, ciudad: 'Santander', prod: PPAS, orig: 'c4', canal: 'email', etapa: 3, valor: 4600, creado: 15 * D, act: 7 * D, toque: 7 * D,
        f: { dotacion: 14 }, s: { prop: 7 * D, propVista: 0, pidePpto: true },
        conv: [[15 * D, 'h', 'email', 'Hola Marta, te escribo por la formación de las tripulaciones de pasaje.'], [14 * D, 'c', 'email', 'Tenemos 14 incorporaciones antes de verano. Pasadnos propuesta del Pack Buques de Pasaje.'], [7 * D, 'h', 'email', 'Os adjunto la propuesta.']] },
      { id: 'k22', n: 'Luis Caso', rol: 'Jefe de Operaciones', emp: 'Terminal Muelle Norte', seg: 'empresa', tam: 45, ciudad: 'San Esteban de Pravia', prod: MMP, orig: 'c4', canal: 'wa', etapa: 2, valor: 2700, creado: 3 * D, act: 6 * H, toque: 20 * H,
        f: { dotacion: 9, cerca: true }, s: { pidePpto: true, conv: true, visitas: 2 },
        conv: [[3 * D, 'a', 'wa', 'Hola Luis, gracias por escribir a CANCOMAR. ¿Para cuántas personas sería?'], [3 * D - 40, 'c', 'wa', 'Nueve operadores de muelle. Mercancías peligrosas.'], [6 * H, 'c', 'wa', '¿Lo podéis hacer en nuestras instalaciones?']] },
      { id: 'k23', n: 'Ana Prieto', rol: 'Gerente', emp: 'Náutica Cala Honda', seg: 'empresa', tam: 12, ciudad: 'Gijón', prod: EMP, orig: 'c1', canal: 'email', etapa: 1, valor: 1500, creado: 13 * H, act: 13 * H, toque: null,
        f: { dotacion: 6, cerca: true }, s: { fuera: true, visitas: 2, pidePpto: true }, conv: [] },
      // --- Renovación en 5 años (antiguos alumnos)
      { id: 'k24', n: 'José Ramón Vega', rol: 'Hizo la Formación Básica en 2021', seg: 'persona', ciudad: 'Avilés', prod: FB, orig: 'c5', canal: 'wa', etapa: 6, valor: P[FB], creado: 1780 * D, act: 20 * D, toque: 20 * D, fin: 'ganado',
        f: { caduca: 'en 3 meses', titulo: true, cerca: true }, s: { revision: true, revisionTxt: 'Su Formación Básica caduca en 3 meses (la hizo hace casi 5 años)' }, conv: [] },
      { id: 'k25', n: 'Rosa Fernández', rol: 'Hizo Lucha Contra Incendios en 2022', seg: 'persona', ciudad: 'Gijón', prod: LCI, orig: 'c5', canal: 'wa', etapa: 6, valor: P[LCI], creado: 1700 * D, act: 25 * D, toque: 25 * D, fin: 'ganado',
        f: { caduca: 'en 4 meses', titulo: true, cerca: true }, s: { revision: true, revisionTxt: 'Su Avanzado de Lucha Contra Incendios caduca en 4 meses' }, conv: [] },
      { id: 'k26', n: 'Manuel Arias', rol: 'Hizo Operador General en 2022', seg: 'persona', ciudad: 'Burela', prod: GOC, orig: 'c5', canal: 'wa', etapa: 6, valor: P[GOC], creado: 1690 * D, act: 30 * D, toque: 30 * D, fin: 'ganado',
        f: { caduca: 'en 5 meses', titulo: true }, s: { revision: true, revisionTxt: 'Su certificado de Operador General SMSSM caduca en 5 meses' }, conv: [] },
      { id: 'k27', n: 'Patricia Blanco', rol: 'Matriculada · renueva en 2031', seg: 'persona', ciudad: 'Avilés', prod: FB, orig: 'c2', canal: 'wa', etapa: 6, valor: P[FB], creado: 14 * D, act: 10 * D, toque: 10 * D, fin: 'ganado',
        f: { titulo: true, cerca: true }, s: {}, conv: [[10 * D, 'h', 'wa', 'Gracias por venir, Patricia. Te avisaremos antes de tu próxima renovación, en 2031.']] },
      { id: 'k28', n: 'Mónica Rubio', rol: 'Le caduca y aún no ha contestado', seg: 'persona', ciudad: 'Oviedo', prod: SAN, orig: 'c5', canal: 'email', etapa: 1, valor: P[SAN], creado: 6 * D, act: 6 * D, toque: 6 * D - 1,
        f: { caduca: 'en 5 semanas', titulo: true, cerca: true }, s: { intentos: 2, emails: 1 },
        conv: [[6 * D - 1, 'a', 'email', 'Hola Mónica, te escribimos porque tu Formación Sanitaria caduca en unas semanas. La próxima actualización es el 24 de noviembre en Avilés.']] },
      // --- Matriculados y pagados
      { id: 'k29', n: 'Francisco Iglesias', rol: 'Patrón', seg: 'persona', ciudad: 'Cudillero', prod: FB, orig: 'c2', canal: 'tel', etapa: 5, valor: P[FB], creado: 16 * D, act: 5 * D, toque: 5 * D, fin: 'ganado', f: { titulo: true, cerca: true }, s: {}, conv: [] },
      { id: 'k30', n: 'Eugenia Lamas', rol: 'Responsable de Seguridad', emp: 'Remolques Dársena Norte', seg: 'empresa', tam: 52, ciudad: 'Gijón', prod: EMP, orig: 'c4', canal: 'email', etapa: 5, valor: 3800, creado: 50 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { dotacion: 12, cerca: true }, s: { exp: true, expTxt: 'Pregunta por formar también a la tripulación del segundo remolcador', visitas: 2 },
        conv: [[2 * D, 'c', 'email', 'El primer grupo ha ido muy bien. ¿Podríamos formar a la tripulación del segundo remolcador en enero?']] },
      { id: 'k31', n: 'Daniel Quirós', rol: 'Marinero', seg: 'persona', ciudad: 'Avilés', prod: SAN, orig: 'c3', canal: 'wa', etapa: 5, valor: P[SAN], creado: 20 * D, act: 9 * D, toque: 9 * D, fin: 'ganado', f: { titulo: true, cerca: true }, s: {}, conv: [] },
      // --- Encaje bajo
      { id: 'k32', n: 'Irene Salgado', rol: 'Curiosidad', seg: 'persona', ciudad: 'Madrid', prod: FBI, orig: 'c1', canal: 'wa', etapa: 2, valor: P[FBI], creado: 5 * D, act: 4 * D, toque: 4 * D,
        f: { curioso: true, lejos: 'Madrid' }, s: { visitas: 1 },
        conv: [[5 * D, 'a', 'wa', 'Hola Irene, gracias por escribir a CANCOMAR. ¿Es para embarcar?'], [4 * D, 'c', 'wa', 'No, es por curiosidad. ¿Es muy caro?']] },
      { id: 'k33', n: 'Julio Arca', rol: 'Busca algo gratis', seg: 'persona', ciudad: 'Vigo', prod: FBI, orig: 'c1', canal: 'wa', etapa: 1, valor: P[FBI], creado: 8 * D, act: 8 * D, toque: 5 * D, fin: 'perdido',
        f: { gratis: true, lejos: 'Vigo' }, s: { intentos: 3 }, conv: [] },
      { id: 'k34', n: 'Natalia Pedre', rol: 'Pide un curso que no hay', seg: 'persona', ciudad: 'León', prod: 'Piloto de drones', orig: 'c1', canal: 'wa', etapa: 2, valor: 400, creado: 6 * D, act: 5 * D, toque: 5 * D,
        f: { otroCurso: true, lejos: 'León' }, s: { ppto: 'no' },
        conv: [[6 * D, 'a', 'wa', 'Hola Natalia, ¿qué curso necesitas?'], [5 * D, 'c', 'wa', 'Piloto de drones, ¿lo tenéis?']] }
    ]
  };
})();

/* Sector: Formación del sueño que vende por lanzamientos (una especialista en sueño con un programa online).
 * Todo el lanzamiento gira alrededor de un webinar en directo y gratuito: «Las tres claves para superar el insomnio».
 * Embudo del negocio: anuncios, test de sueño, newsletter u orgánico → inscripción al webinar → calentamiento
 * (correos, WhatsApp, comunidad de WhatsApp y recordatorios a 24 h, 2 h y 30 min) → asiste al directo o ve
 * el replay → carrito abierto unos días: la persona pide la llamada de admisión → llamada de admisión con una
 * closer del equipo (siempre una persona) → plaza en el programa «Por Fin Duermo» (método de 6 pasos, sin
 * fármacos, menos de 10 semanas; 1.795 €, con pago fraccionado). Después del cierre, reapertura del carrito
 * con bonus para la lista de «ahora no».
 * El «ahora» de la demo: el webinar fue hace un par de días y el carrito está abierto (día 3 de 7).
 * Las «campañas» son los orígenes del contacto: anuncios de Meta, Google, Instagram, el test de sueño de la web,
 * la newsletter diaria y la lista de lanzamientos anteriores.
 * Reglas de voz: los mensajes automáticos solo salen entre las 8:00 y las 21:30, la llamada de admisión
 * la hace siempre una persona, nada promete resultados médicos ni curas y no se habla de ningún cliente real.
 * Todas las personas, las fechas y las cifras son inventadas: datos de ejemplo.
 * El nombre del negocio nunca va aquí: llega por el parámetro de URL «empresa». */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  const hc = Q.hueco(17);

  // El webinar fue hace algo más de dos días y el carrito se abrió al terminar: hoy es el día 3 de 7 y cierra dentro de 4 días.
  // La reapertura con bonus llega 3 días después del cierre.
  const DIAS_CIERRE = 4;
  const DIAS_REAPERTURA = DIAS_CIERRE + 3;
  const sumaDias = function (ahora, n) { return new Date(ahora + n * D * 60000); };
  // «hoy», «mañana» o «el viernes 17»
  const cuando = function (ahora, n) {
    if (n === 0) return 'hoy';
    if (n === 1) return 'mañana';
    const d = sumaDias(ahora, n);
    return 'el ' + d.toLocaleDateString('es-ES', { weekday: 'long' }) + ' ' + d.getDate();
  };
  // Los mensajes automáticos solo salen de 8:00 a 21:30. Fuera de esa franja, «mañana a partir de las 8:00».
  const envio = function (ahora) {
    const d = new Date(ahora), m = d.getHours() * 60 + d.getMinutes();
    return m >= 8 * 60 && m <= 21 * 60 + 30 ? 'hoy' : (m < 8 * 60 ? 'hoy a partir de las 8:00' : 'mañana a partir de las 8:00');
  };
  const ultimoEsContacto = function (c, M) { const u = M.ultimoMsg(c); return !!u && u.de === 'c'; };

  const PROG = 'Programa Por Fin Duermo';
  const WEB = '«Las tres claves para superar el insomnio»';
  const WEBINAR = 'Webinar ' + WEB;

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.sueno = {
    id: 'sueno',
    nombre: 'Formación del sueño · lanzamientos',
    t: {
      contacto: 'contacto', contactos: 'contactos', Contactos: 'Contactos', Contacto: 'Contacto',
      venta: 'plaza', ventas: 'plazas', Ventas: 'Plazas', producto: 'programa', Producto: 'Programa',
      paginaVisitas: 'la página del programa', cita: 'llamada de admisión', Cita: 'Llamada de admisión', laCita: 'la llamada de admisión',
      propuesta: 'el plan de pago', Propuesta: 'Plan de pago', propuestas: 'planes de pago', comercial: 'la closer', Comercial: 'Closer',
      cliente: 'alumna', unCliente: 'una alumna', clientes: 'alumnas', convierten: 'entran en el programa',
      objetivoPaso: 'agendarle la llamada de admisión', casoExito: 'el caso de una alumna con una situación parecida', valorAlto: 1500,
      oportunidades: 'contactos', atencion: 'contactos que requieren atención', laVenta: 'la plaza',
      verbo: 'apuntarse', clientesReales: 'plazas de verdad', empleados: 'personas en el equipo',
      pasoHumano: 'hacer la llamada de admisión y cerrar la plaza',
      nombreAgenteVoz: 'Raquel', agenteVoz: 'Raquel (agente de voz)', llamadaVoz: 'Llamada de Raquel',
      senales: { nueva: 'Inscrita nueva', noshow: 'Llamada en riesgo', propuesta: 'Plan de pago sin respuesta', revision: 'Pidió esperar a la reapertura', expansion: 'Quiere traer a alguien', reactivar: 'Lista de la reapertura' },
      anunciosIntro: 'Datos de ejemplo. Cada fila es un origen de las inscritas al webinar ' + WEB + ': los vídeos de Meta, Google, Instagram, el test de sueño de la web, la newsletter diaria y la lista de lanzamientos anteriores. El sistema une cada origen con lo que pasa después: quién se conecta en directo o ve el replay, quién pide la llamada de admisión, quién viene a la llamada y quién entra en el programa.',
      notaTitulo: 'Qué cambiaría en el origen de los contactos', notaBoton: 'Redactar la nota del lanzamiento',
      notaIntro: 'Datos de ejemplo. Esto es lo que cambiaría de aquí al cierre del carrito del webinar ' + WEB + ', cruzando cada origen con lo que pasa después.',
      preguntaNota: '¿Qué cambiaríamos en el origen de los contactos antes del cierre?', notaAsunto: 'Asunto: Webinar ' + WEB + ' · qué cambiar antes del cierre', notaCorreo: 'Nota del lanzamiento'
    },
    // Origen → Inscrita al webinar → Calentamiento → Asiste al webinar (o ve el replay) → Pide la llamada (carrito) → Llamada de admisión → Plaza
    recorrido: [
      { id: 'anuncio', txt: 'Origen', sinFuga: true },
      { id: 'info', txt: 'Inscrita al webinar' },
      { id: 'contactado', txt: 'Calentamiento' },
      { id: 'cualificado', txt: 'Asiste al webinar (o ve el replay)' },
      { id: 'solicitud', txt: 'Pide la llamada (carrito)' },
      { id: 'llamada', txt: 'Llamada de admisión' },
      { id: 'alta', txt: 'Plaza en Por Fin Duermo' }
    ],
    ventaEtapa: 'alta',
    ticket: 1795,
    // Qué conversión es razonable en cada fase cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.7, cualificado: 0.5, solicitud: 0.3, llamada: 0.85, alta: 0.35 },
    nombresFuga: {
      contactado: { txt: 'Calentamiento', exp: 'inscritas al webinar que no abren los correos, no contestan al primer WhatsApp y no entran en la comunidad' },
      cualificado: { txt: 'Asiste al webinar', exp: 'inscritas al webinar ' + WEB + ' que no se conectan en directo ni ven el replay, porque los recordatorios no les dicen nada suyo' },
      solicitud: { txt: 'Pide la llamada', exp: 'asistentes al webinar que no piden la llamada de admisión porque nadie les resolvió su duda (las pastillas, la menopausia, el precio) con el carrito abierto' },
      llamada: { txt: 'Llamada de admisión', exp: 'peticiones que se quedan sin hora agendada y llamadas reservadas a las que la persona no se presenta' },
      alta: { txt: 'Plaza', exp: 'llamadas hechas que no terminan en plaza: el plan de pago se queda sin respuesta y el cierre cambia mucho de una closer a otra' }
    },
    remedioFuga: {
      contactado: 'Un WhatsApp en el minuto uno con el enlace a la comunidad y una pregunta sobre su sueño; a quien no entra, un segundo aviso al día siguiente. Los mensajes automáticos salen entre las 8:00 y las 21:30.',
      cualificado: 'Recordatorios a 24 h, 2 h y 30 min del webinar, por WhatsApp y en la comunidad, con lo que la persona contó al inscribirse. A quien no se conecta, el replay a la mañana siguiente con una pregunta sobre su sueño. Siempre entre las 8:00 y las 21:30.',
      llamada: 'Un mensaje en cuanto alguien pide la llamada con dos huecos concretos, la confirmación y el recordatorio el día antes, y otro mensaje a quien no vino con dos huecos nuevos. Los mensajes automáticos salen entre las 8:00 y las 21:30; la llamada de admisión la hace siempre una persona.',
      solicitud: 'Un mensaje después del webinar con la duda concreta que la persona escribió en el chat (las pastillas, la menopausia, si es online) y el enlace para pedir la llamada de admisión. Sale entre las 8:00 y las 21:30; si pregunta por condiciones, el hilo pasa a la closer.',
      alta: 'Revisar a diario los planes de pago abiertos y sin respuesta: la closer llama a los de más valor y el resto recibe un mensaje con la duda más habitual (el pago fraccionado). Y comparar las llamadas de las dos closers: con el mismo tipo de llamada, una cierra el doble que la otra.'
    },
    mesDatos: { respuestaAntes: 250, respuestaAhora: 2, agendadas: 144, enDirecto: 0.12, cierreClosers: [0.36, 0.17] },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Vídeos «No puedo dormir» y «¿Estás tomando pastillas?»', inversion: 5200, ticket: 1795,
        embudo: { anuncio: 380000, info: 2350, contactado: 1360, cualificado: 360, solicitud: 52, llamada: 35, alta: 8 } },
      { id: 'c2', canal: 'Google', nombre: 'Búsquedas de insomnio hacia el webinar', inversion: 1400, ticket: 1795,
        embudo: { anuncio: 21000, info: 380, contactado: 250, cualificado: 95, solicitud: 17, llamada: 12, alta: 4 } },
      { id: 'c3', canal: 'Instagram', nombre: 'Reels y stories hacia el webinar', inversion: 0, ticket: 1795,
        embudo: { anuncio: 64000, info: 520, contactado: 330, cualificado: 95, solicitud: 15, llamada: 10, alta: 3 } },
      { id: 'c4', canal: 'Web', nombre: 'Test de sueño gratuito de la web', inversion: 0, ticket: 1795,
        embudo: { anuncio: 3100, info: 460, contactado: 300, cualificado: 100, solicitud: 20, llamada: 14, alta: 4 } },
      { id: 'c5', canal: 'Newsletter', nombre: 'Newsletter diaria', inversion: 0, ticket: 1795,
        embudo: { anuncio: 14500, info: 610, contactado: 420, cualificado: 140, solicitud: 25, llamada: 18, alta: 6 } },
      { id: 'c6', canal: 'Lista antigua', nombre: 'Lista de lanzamientos anteriores', inversion: 0, ticket: 1795,
        embudo: { anuncio: 4200, info: 300, contactado: 210, cualificado: 75, solicitud: 16, llamada: 12, alta: 5 } }
    ],
    kpis: ['interesados', 'cualificados', 'solicitudes', 'entrevistas', 'show', 'ventas', 'carrito', 'respuesta', 'noahora', 'ingresos'],
    kpiNombres: { interesados: 'Inscritas al webinar', cualificados: 'Asisten o ven el replay', entrevistas: 'Llamadas hechas', ventas: 'Plazas vendidas', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'llamada' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      const ahora = est ? est.ahora : Date.now();
      const md = cfg.mesDatos || {};
      const cc = md.cierreClosers || [0, 0];
      const noAhora = cs.filter(function (c) { return c.s.luego && !c.fin; }).length;
      return {
        cualificados: { l: 'Asisten o ven el replay', v: M.num(m.tot.cualificado), em: 'En directo, solo el ' + M.pct(md.enDirecto || 0) + ' de las inscritas', clase: 'mal' },
        solicitudes: { l: 'Piden la llamada', v: M.num(m.tot.solicitud), em: M.pct(m.tot.solicitud / Math.max(1, m.tot.cualificado)) + ' de quienes ven el webinar' },
        entrevistas: { l: 'Llamadas hechas', v: M.num(m.tot.llamada), em: 'Cierre por closer: ' + M.pct(cc[0]) + ' y ' + M.pct(cc[1]), clase: 'mal' },
        show: { l: 'Vienen a la llamada', v: M.pct(m.tot.llamada / Math.max(1, md.agendadas)), em: (md.agendadas - m.tot.llamada) + ' no vinieron', clase: 'mal' },
        carrito: { l: 'Carrito abierto', v: 'Día 3 de 7', em: 'Cierra ' + cuando(ahora, DIAS_CIERRE) + ' · después, reapertura con bonus' },
        respuesta: { l: 'Respuesta (carrito)', v: M.duracionLarga(md.respuestaAntes), em: 'Con agente: ' + md.respuestaAhora + ' min', clase: 'mal' },
        noahora: { l: 'Lista de la reapertura', v: M.num(noAhora), em: 'a escribir cuando se reabra con bonus' }
      };
    },
    agenda: { horas: [9, 20], pausa: [14, 16], ocupacion: 0.45, etapa: 'llamada', sabado: false,
      tipos: ['Llamada de admisión', 'Llamada de admisión · pago fraccionado', 'Llamada de admisión · recomendada', 'Llamada de admisión · lista anterior', 'Llamada de admisión · test de sueño'] },
    veredictoAnuncio: function (f, Mo) {
      const e = f.c.embudo;
      if (f.c.inversion > 0) {
        const asis = (e.cualificado || 0) / Math.max(1, e.info || 0);
        if (asis < 0.25) {
          return { id: 'despues', txt: 'No es el anuncio', tono: 't-amber', por: Mo.num(e.info) + ' inscritas al webinar, pero solo el ' + Mo.pct(asis) + ' se conecta o ve el replay. El vídeo trae a la gente; se pierde entre la inscripción y el directo. Antes de tocar el anuncio, arreglad los recordatorios.' };
        }
        return { id: 'prueba', txt: 'Seguir mirando', tono: 't-amber', por: Mo.num(e.info) + ' inscritas al webinar y ' + Mo.pl(e.alta, 'plaza', 'plazas') + ' con el carrito a mitad. Juzgadlo por las plazas que llegan a la llamada de admisión, no por las inscritas.' };
      }
      return { id: 'organico', txt: 'Sin inversión', tono: 't-gris', por: 'No tiene coste de anuncio. De quienes ven el webinar, acaba entrando en el programa el ' + Mo.pct((e.alta || 0) / Math.max(1, e.cualificado || 0)) + '.' };
    },
    notaAnuncios: function (a, T, Mo) {
      const lin = [];
      const fi = function (id) { return a.filas.filter(function (f) { return f.c.id === id; })[0]; };
      const p = fi('c1'), g = fi('c2'), ts = fi('c4'), nw = fi('c5'), b = fi('c6');
      if (p) lin.push('Vídeos de Meta: ' + p.entra + ' inscritas al webinar a ' + Mo.euros(p.cpl) + ' cada una y ' + Mo.pl(p.ventas, 'plaza', 'plazas') + ' hasta ahora. El vídeo no es el problema: muchas inscritas no se conectan al directo ni abren el replay. Juzgadlo cuando cierre el carrito, por las plazas y no por las inscritas.');
      if (g) lin.push('Google trae menos inscritas (' + g.entra + '), pero buscan una solución y ven más el webinar: ' + Mo.pl(g.ventas, 'plaza', 'plazas') + ' con ' + Mo.euros(g.c.inversion) + '. Merece la pena mirar si hay margen para subir.');
      if (ts) lin.push('Quien hace el test de sueño ya ha puesto nombre a lo que le pasa: ' + Mo.pl(ts.ventas, 'plaza', 'plazas') + ' de ' + ts.entra + ' inscritas. Conviene que cada resultado del test lleve la invitación al webinar ' + WEB + '.');
      if (nw) lin.push('La newsletter diaria trae ' + Mo.pl(nw.ventas, 'plaza', 'plazas') + ' sin gastar en anuncios: quien la lee cada día llega al webinar confiando. Ahí los recordatorios de 2 h y 30 min son los que más rinden.');
      if (b) lin.push('La lista de lanzamientos anteriores trajo ' + Mo.pl(b.ventas, 'plaza', 'plazas') + ' sin gastar en anuncios. Las de «ahora no» de este webinar van a esa lista: escribirles en la reapertura con el bonus es lo más barato que hay.');
      return lin;
    },
    bannerAnuncios: false, // el veredicto ya se da por origen; el aviso del «anuncio barato» no aplica con el carrito a mitad
    timelineSinOrigen: true,
    textoAlta: function (c) {
      const cp = (window.QV_SECTORES.sueno.campanas || []).filter(function (x) { return x.id === c.orig; })[0];
      return (c.orig === 'c4' ? 'Hace el test de sueño y se inscribe al webinar' : 'Se inscribe al webinar ' + WEB) + (cp ? ' · desde ' + cp.canal : '');
    },

    reglas: {
      fitBase: 24,
      fit: [
        [function (c) { return c.f && c.f.insomnio; }, 20, 'lleva más de un año durmiendo mal', 'Duerme mal desde hace más de un año'],
        [function (c) { return c.f && c.f.afecta; }, 10, 'el cansancio le afecta en el trabajo y en casa', 'Le afecta en el día a día'],
        [function (c) { return c.f && c.f.probado; }, 12, 'ya ha probado otras cosas sin resultado', 'Ha probado de todo'],
        [function (c) { return c.f && c.f.motivo; }, 12, function (c) { return 'sabe qué le quita el sueño: ' + c.f.motivo; }, 'Sabe qué le quita el sueño'],
        [function (c) { return c.f && c.f.lista; }, 14, 'estuvo en un lanzamiento anterior', 'Estuvo en un lanzamiento anterior'],
        [function (c) { return c.f && c.f.referida; }, 10, 'llega recomendada por una alumna', 'Llega recomendada'],
        [function (c) { return c.f && c.f.comunidad; }, 8, 'entró en la comunidad de WhatsApp', 'Está en la comunidad de WhatsApp'],
        [function (c) { return c.f && c.f.plazoOk; }, 6, 'el pago fraccionado le encaja', 'Le encaja el pago fraccionado'],
        [function (c) { return c.f && c.f.sinProblema; }, -22, 'duerme bien: solo tenía curiosidad', 'Sin problema de sueño'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'solo busca consejos gratuitos'],
        [function (c) { return c.f && c.f.otroCaso; }, -18, 'lo que cuenta conviene que lo valore antes su médico', 'Caso para su médico'],
        [function (c) { return c.f && c.f.sinTiempo; }, -10, 'dice que no tiene tiempo estas semanas']
      ],
      intencion: [
        [function (c) { return c.s.incluye; }, 8, 'preguntó qué incluye el programa'],
        [function (c) { return c.s.plazos; }, 12, 'preguntó por el pago fraccionado'],
        [function (c) { return c.s.comunidad; }, 10, 'entró en la comunidad de WhatsApp'],
        [function (c) { return c.s.directo && !c.fin; }, 14, 'asistió al webinar en directo'],
        [function (c) { return c.s.replay && !c.s.directo && !c.fin; }, 10, 'vio el replay del webinar'],
        [function (c) { return c.s.solicitud && !c.fin; }, 18, 'pidió la llamada de admisión'],
        [function (c) { return c.s.test; }, 10, 'hizo el test de sueño']
      ],
      riesgo: [
        [function (c) { return c.s.sinLlamada && !c.fin; }, 50, function (c) { return 'pidió la llamada y sigue sin hora desde hace ' + QV.motor.duracion(c.s.solMin); }]
      ]
    },

    nba: function (c, k, x, T, M) {
      const ahora = k.ahora;
      const cierre = cuando(ahora, DIAS_CIERRE);
      if (c.fin === 'ganado' && c.s.exp) {
        return { id: 'ofrecer', accion: 'Pasarle el replay del webinar para quien quiere traer', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: (c.s.expTxt || 'Es alumna y quiere traer a alguien') + '. El mensaje sale ' + envio(ahora) + ' (los automáticos, de 8:00 a 21:30): el replay del webinar ' + WEB + ' y la opción de pedir la llamada de admisión antes de que cierre el carrito ' + cierre + '. Si pregunta por condiciones, el hilo pasa a la closer.' };
      }
      if (c.fin) return M.nbaGenerica(c, k, x, T);
      if (c.s.noshow) {
        return { id: 'reprogramar', accion: 'Reprogramar la llamada de admisión', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Reservó la llamada y no vino, pero la petición era real. Mensaje ' + envio(ahora) + ' con dos huecos: ' + cuando(ahora, 1) + ' y ' + cuando(ahora, 2) + '. Si no contesta, un último mensaje ' + cuando(ahora, 3) + ' y se la deja tranquila hasta el cierre del carrito (' + cierre + ').' };
      }
      if (c.s.sinLlamada) {
        return { id: 'agendar', accion: 'Proponerle dos huecos para la llamada de admisión', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Pidió la llamada hace ' + M.duracion(c.s.solMin) + ' y sigue sin hora. Mensaje ' + envio(ahora) + ' con dos huecos concretos (' + cuando(ahora, 1) + ' y ' + cuando(ahora, 2) + '); si los dos días se llenan, las closers abren más huecos antes del cierre (' + cierre + ').' };
      }
      if (c.s.luego) {
        const aviso = cuando(ahora, DIAS_REAPERTURA);
        return { id: 'postlanzamiento', accion: 'Dejarla en la lista de la reapertura y escribirle ' + aviso, quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'vigilando',
          por: 'Dijo que ' + (c.s.luegoTxt || 'lo decide más adelante') + '. No se le insiste mientras el carrito está abierto: ' + aviso + ', cuando se reabre el carrito con el bonus, recibe un mensaje con lo que contó.' };
      }
      if (c.s.precio && ultimoEsContacto(c, M)) {
        const ult = M.ultimoMsg(c);
        return { id: 'precio', accion: 'Contestarle qué incluye el programa y ofrecerle la llamada', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Preguntó el precio ' + M.hace((ahora - ult.t) / M.MIN) + ' y sigue sin respuesta. Durante el carrito cada consulta que espera se enfría. Respuesta ' + envio(ahora) + ' con lo que incluye el programa, que es online y que el pago se puede fraccionar; el importe y las cuotas se los explica la closer en la llamada de admisión.' };
      }
      if ((c.s.directo || c.s.replay) && c.etapa === 3) {
        return { id: 'directo', accion: 'Mensaje tras el webinar con su duda y el enlace a la llamada', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: (c.s.directo ? 'Asistió al webinar en directo' : 'Vio el replay del webinar') + ' y no ha pedido la llamada' + (c.s.visitas >= 3 ? ' (ha vuelto ' + c.s.visitas + ' veces a la página del programa)' : '') + '. Mensaje ' + envio(ahora) + ' con la pregunta que dejó en el chat y el enlace para pedir la llamada de admisión. El carrito cierra ' + cierre + '.' };
      }
      if (c.s.noAsiste && !c.s.directo && !c.s.replay) {
        return { id: 'replay', accion: 'Mandarle el replay del webinar con una pregunta suya', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Se inscribió al webinar, no se conectó en directo y no ha abierto el replay. Mensaje ' + envio(ahora) + ' con el replay de ' + WEB + ' y una pregunta sobre lo que le quita el sueño; si contesta, se le ofrece la llamada de admisión antes del cierre (' + cierre + ').' };
      }
      if (c.s.tProp != null && k.toque > 2880 && c.valor >= T.valorAlto) {
        return { id: 'propuesta', accion: 'Llamada de la closer para resolver el plan de pago', quien: T.Comercial, tipo: 'humano', estado: 'humano',
          por: (c.s.propVista ? 'Ha abierto el plan de pago ' + c.s.propVista + (c.s.propVista === 1 ? ' vez' : ' veces') : 'El plan de pago sigue sin abrir') + ' y nadie le ha escrito en ' + M.duracion(k.toque) + '. Las dudas con las cuotas se resuelven hablando: la closer la llama ' + cuando(ahora, 1) + ' por la mañana, antes del cierre (' + cierre + ').' };
      }
      if (c.etapa === 5 && c.s.tCita != null && k.cita > 0 && c.s.citaOk) {
        // id «esperar»: la llamada está confirmada, no hay nada urgente; solo se prepara a la closer
        return { id: 'esperar', accion: 'Preparar la llamada de admisión', quien: T.Comercial, tipo: 'humano', estado: 'humano',
          por: 'Llamada ' + M.dentroDe(k.cita) + ', ya confirmada. La ficha, lo que contó al inscribirse y lo que preguntó en el webinar están resumidos para que la closer llegue sabiendo en qué punto está. Se habla del método, nunca de resultados médicos.' };
      }
      return M.nbaGenerica(c, k, x, T);
    },
    vozDijo: function (c) { return c.f && c.f.motivo ? ['Lo que le quita el sueño: ' + c.f.motivo] : []; },
    vozMotivo: function (c) { return 'Se inscribió al webinar ' + WEB + ' y quiere saber más del programa.'; },

    preguntas: [
      { q: '¿Quién preguntó el precio y sigue sin respuesta?', h: 'lista', obj: ['seguimiento', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.precio && QV.motor.ultimoMsg(c) && QV.motor.ultimoMsg(c).de === 'c'; }, orden: 'prob',
        intro: function (l) { return l.length + ' contactos preguntaron el precio del programa y nadie les ha contestado todavía. Con el carrito abierto, cada consulta que espera se enfría: la respuesta sale hoy dentro del horario de 8:00 a 21:30, con lo que incluye el programa y la llamada de admisión para ver el importe y las cuotas.'; },
        vista: 'tabla' },
      { q: '¿Quién vio el webinar y no ha pedido la llamada?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && !!(c.s.directo || c.s.replay) && c.etapa === 3; }, orden: 'prob',
        intro: function (l) { return l.length + ' contactos vieron el webinar ' + WEB + ' (en directo o en replay) y todavía no han pedido la llamada de admisión. Es el grupo con más intención del carrito: un mensaje con su duda concreta, antes del cierre.'; },
        vista: 'tabla' },
      { q: '¿Quién se inscribió al webinar y no vino?', h: 'lista', obj: ['conversion', 'captacion', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.noAsiste && !c.s.directo && !c.s.replay; }, orden: 'prob',
        intro: function (l) { return l.length + ' inscritas no se conectaron al webinar en directo y no han abierto el replay. Reciben el replay con una pregunta sobre su sueño, dentro del horario de 8:00 a 21:30.'; },
        vista: 'tabla' },
      { q: '¿Quién pidió la llamada de admisión y sigue sin hora?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.sinLlamada; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' personas pidieron la llamada de admisión hace horas o días y siguen sin hora, por ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en plazas. Se les proponen dos huecos concretos y, si hace falta, las closers abren más antes del cierre.'; },
        vista: 'tabla' },
      { q: '¿Quién reservó la llamada y no vino?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.noshow; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas reservaron la llamada de admisión y no se presentaron. Siguen teniendo interés: un mensaje con dos huecos nuevos, sin llamarlas en frío.'; },
        vista: 'tabla' },
      { q: '¿Qué planes de pago siguen sin respuesta?', h: 'lista', obj: ['ventas', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && c.s.tProp != null; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' planes de pago enviados después de la llamada siguen sin respuesta, por ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + '. La closer llama a cada una antes del cierre: las dudas con las cuotas se resuelven hablando.'; },
        vista: 'tabla' },
      { q: '¿Qué alumnas quieren traer a alguien y nadie les ha contestado?', h: 'lista', obj: ['expansion', 'ventas', 'todo'],
        filtro: function (c) { return c.fin === 'ganado' && !!c.s.exp; }, orden: 'prob',
        intro: function (l) { return l.length + ' alumnas han escrito que alguien de su familia también duerme mal y nadie les ha contestado. Es el contacto que llega con más confianza: el replay del webinar y la opción de pedir la llamada.'; },
        vista: 'tabla' },
      { q: '¿Quién dijo «ahora no» y entra en la reapertura?', h: 'lista', obj: ['retencion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.luego; }, orden: 'prob',
        intro: function (l) { return l.length + ' contactos han dicho que ahora no. No es un no: pasan a la lista de la reapertura y reciben un mensaje cuando se reabre el carrito con el bonus, con lo que contaron.'; },
        vista: 'tabla' },
      { q: '¿Qué debería hacer hoy cada closer?', h: 'equipo', obj: ['todo', 'ventas'] },
      { q: '¿Qué origen está trayendo plazas?', h: 'campanas', obj: ['captacion', 'todo'] }
    ],

    historias: {
      webinar: {
        titulo: 'Del vídeo «No puedo dormir» al webinar y la llamada',
        contacto: { id: 'demo', n: 'Montse Ribas', rol: 'Administrativa · 54 años', seg: 'particular', ciudad: '—', prod: PROG, orig: 'c1', canal: 'wa', etapa: 1, valor: 1795, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Por la tarde, Montse ve el vídeo «No puedo dormir» y se inscribe al webinar ' + WEB, feed: 'Nueva inscrita · webinar ' + WEB + ' · desde Meta', cambio: {} },
          { dur: 6, min: 1, txt: 'El sistema completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · 7 años durmiendo mal · se despierta a las 4:00', cambio: { ciudad: 'Tarragona', f: { insomnio: true, afecta: true, motivo: 'se despierta a las 4:00 y ya no vuelve a dormirse' } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp le escribe en el minuto uno, dentro del horario', feed: 'WhatsApp enviado en 48 segundos', cambio: { conv: ['a', 'wa', 'Hola Montse, soy Raquel, del equipo de la doctora. Ya tienes tu plaza para el webinar ' + WEB + '. ¿Quieres entrar también en la comunidad de WhatsApp? Ahí avisamos antes de empezar.'] }, toque: true },
          { dur: 7, min: 6, txt: 'Montse contesta y entra en la comunidad de WhatsApp', feed: 'Respuesta recibida · entra en la comunidad', cambio: { etapa: 2, f: { comunidad: true }, s: { comunidad: true }, conv: ['c', 'wa', 'Sí, méteme. Llevo siete años durmiendo fatal: me despierto a las cuatro y ya no hay manera.'] }, act: true },
          { dur: 7, min: 3, txt: 'Recibe los recordatorios de 24 h, 2 h y 30 min, con lo que contó al inscribirse', feed: 'Recordatorios enviados · 24 h · 2 h · 30 min', cambio: { conv: ['a', 'wa', 'Montse, en 30 minutos empieza el webinar. Una de las tres claves va justo de los despertares de madrugada, lo que nos contaste. Te dejo el enlace.'] }, toque: true },
          { dur: 7, min: 1, txt: 'Se conecta al webinar en directo y pregunta por las pastillas', feed: 'Asiste al webinar en directo · pregunta en el chat', cambio: { etapa: 3, s: { directo: true, visitas: 3, incluye: true }, conv: ['c', 'wa', 'Vi el webinar de las tres claves y me he visto reflejada. Llevo cinco años con pastillas para dormir, ¿el programa me sirve igual?'] }, act: true },
          { dur: 8, min: 2, txt: 'El agente responde sin prometer nada y le ofrece la llamada de admisión', feed: 'Mensaje tras el webinar · enlace a la llamada', cambio: { conv: ['a', 'wa', 'Muchas alumnas llegan tomando medicación. El programa no te pide que dejes nada por tu cuenta: cualquier cambio con la medicación lo hablas con tu médico. Si quieres, pide la llamada de admisión y vemos si encaja con tu caso. El carrito está abierto unos días.'] }, toque: true },
          { dur: 6, min: 8, txt: 'Montse pide la llamada de admisión y elige hueco', feed: 'Pide la llamada · llamada de admisión reservada', cambio: { etapa: 5, s: { solicitud: true, plazos: true, cita: hc.min, citaOk: true }, conv: ['c', 'wa', 'Vale, la pido. ¿Se puede pagar en varias veces?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente confirma la llamada y le explica el pago fraccionado', feed: 'Llamada confirmada para el ' + hc.txt + ' a las 17:00', cambio: { conv: ['a', 'wa', 'Sí, se puede pagar de forma fraccionada y en la llamada te lo explican. Te dejo la llamada de admisión el ' + hc.txt + ' a las 17:00. El día antes te mando un recordatorio.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Montse tiene la llamada de admisión reservada', feed: 'Aviso enviado a la closer', humano: { titulo: 'Montse tiene la llamada de admisión el ' + hc.txt + ' a las 17:00', texto: 'Duerme mal desde hace siete años y se despierta a las 4:00. Entró en la comunidad, recibió los tres recordatorios y vio el webinar ' + WEB + ' en directo. Toma pastillas desde hace cinco años: nada de promesas médicas. Preguntó por el pago fraccionado. La llamada la hace la closer.' } }
        ]
      },
      reapertura: {
        titulo: 'De «ahora no» a la reapertura',
        contacto: { id: 'demo', n: 'Rosa Lloret', rol: 'Estaba en la lista de un lanzamiento anterior', seg: 'particular', ciudad: '—', prod: PROG, orig: 'c6', canal: 'wa', etapa: 1, valor: 1795, creado: 0, act: 0, f: { lista: true }, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Rosa vio el webinar ' + WEB + ' y dijo «ahora no»: está en la lista de la reapertura', feed: 'Lista de la reapertura · vio el webinar', cambio: { s: { replay: true } } },
          { dur: 6, min: 1, txt: 'El sistema recupera su ficha: lo que contó al inscribirse', feed: 'Ficha recuperada · la menopausia la despierta cada noche', cambio: { ciudad: 'Girona', f: { insomnio: true, afecta: true, motivo: 'desde la menopausia se despierta varias veces cada noche' } } },
          { dur: 7, min: 1, txt: 'Se reabre el carrito con bonus: el agente le escribe con lo que contó, dentro del horario', feed: 'WhatsApp enviado · reapertura con bonus', cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Rosa, soy Raquel, del equipo de la doctora. Después del webinar nos dijiste que lo dejabas para más adelante. Se reabre el carrito unos días y quien entra ahora tiene un bonus. ¿Te cuento?'] }, toque: true },
          { dur: 7, min: 12, txt: 'Rosa contesta con sus dudas: la menopausia y si es online', feed: 'Respuesta recibida · dudas: menopausia y formato', cambio: { etapa: 3, s: { visitas: 2, incluye: true }, conv: ['c', 'wa', 'Sí, cuéntame. Lo mío es por la menopausia, ¿también funciona? ¿Y es todo online?'] }, act: true },
          { dur: 8, min: 2, txt: 'El agente le contesta sin prometer resultados y le ofrece la llamada', feed: 'Mensaje enviado · enlace a la llamada de admisión', cambio: { conv: ['a', 'wa', 'Es todo online: lo haces desde casa, a tu ritmo, con sesiones en directo. Muchas alumnas llegan en la menopausia; en la llamada de admisión vemos tu caso y si el programa encaja, sin compromiso.'] }, toque: true },
          { dur: 6, min: 9, txt: 'Rosa pide la llamada de admisión', feed: 'Pide la llamada · llamada de admisión reservada', cambio: { etapa: 5, s: { solicitud: true, plazos: true, cita: hc.min, citaOk: true }, conv: ['c', 'wa', 'Vale, quiero la llamada. ¿Se puede fraccionar el pago?'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Rosa tiene la llamada de admisión', feed: 'Aviso enviado a la closer', humano: { titulo: 'Rosa tiene la llamada de admisión el ' + hc.txt + ' a las 17:00', texto: 'Vio el webinar ' + WEB + ', dijo «ahora no» y vuelve con la reapertura y el bonus. Desde la menopausia se despierta varias veces cada noche. Preguntó si es online y por fraccionar el pago. Nada de promesas médicas. La llamada la hace la closer.' } }
        ]
      }
    },
    historiaDefecto: 'webinar',
    historiaGenerica: false,

    contactos: [
      // --- Preguntan el precio y nadie les ha contestado
      { id: 's01', n: 'Pilar Navarro', rol: 'Profesora · 52 años', seg: 'particular', ciudad: 'Valencia', prod: PROG, orig: 'c1', canal: 'wa', etapa: 3, valor: 1795, creado: 6 * D, act: 3 * H, toque: 2 * D + 6 * H,
        f: { insomnio: true, afecta: true, probado: true, motivo: 'se despierta a las 3:00 y no vuelve a dormirse', plazoOk: true }, s: { precio: true, plazos: true, directo: true, visitas: 3 },
        conv: [[6 * D - 1, 'a', 'wa', 'Hola Pilar, soy Raquel, del equipo de la doctora. Ya tienes tu plaza para el webinar ' + WEB + '. ¿Qué te cuesta más: dormirte o no despertarte de madrugada?'], [6 * D - 45, 'c', 'wa', 'Me despierto a las tres y ya no hay manera. Así llevo seis años.'], [2 * D + 6 * H, 'a', 'wa', 'Pilar, en 30 minutos empieza el webinar. Una de las tres claves va justo de los despertares de madrugada. Te dejo el enlace.'], [3 * H, 'c', 'wa', 'Vi el webinar de las tres claves y me he visto reflejada. ¿Cuánto cuesta el programa? ¿Se puede pagar en varias veces?']],
        ev: [[2 * H, 'web', 'Vuelve a la página del programa']] },
      { id: 's02', n: 'Jordi Puig', rol: 'Autónomo · 47 años', seg: 'particular', ciudad: 'Barcelona', prod: PROG, orig: 'c2', canal: 'wa', etapa: 2, valor: 1795, creado: 9 * D, act: 20 * H, toque: 3 * D,
        f: { insomnio: true, afecta: true, motivo: 'no consigue dormirse antes de las dos' }, s: { precio: true, visitas: 2 },
        conv: [[9 * D, 'a', 'wa', 'Hola Jordi, soy Raquel, del equipo de la doctora. ¿Qué te cuesta más: dormirte o mantener el sueño?'], [9 * D - 90, 'c', 'wa', 'Dormirme. Me meto en la cama a las doce y a las dos sigo despierto.'], [3 * D, 'a', 'wa', 'Mañana es el webinar ' + WEB + '. Si no puedes conectarte, te mando el replay.'], [20 * H, 'c', 'wa', 'No pude conectarme al webinar. ¿Es todo online? ¿Y cuánto cuesta el programa? No lo veo en la página.']] },
      // --- Vieron el webinar y no han pedido la llamada
      { id: 's03', n: 'Marisa Campos', rol: 'Enfermera · turnos de noche · 49 años', seg: 'particular', ciudad: 'Sevilla', prod: PROG, orig: 'c3', canal: 'wa', etapa: 3, valor: 1795, creado: 12 * D, act: 20 * H, toque: 25 * H,
        f: { insomnio: true, afecta: true, motivo: 'los turnos le han desordenado el sueño' }, s: { directo: true, incluye: true, visitas: 2 },
        conv: [[12 * D, 'a', 'wa', 'Hola Marisa, soy Raquel, del equipo de la doctora. ¿Qué te trajo al webinar?'], [12 * D - 60, 'c', 'wa', 'Trabajo a turnos y hace años que no duermo seguido.'], [25 * H, 'a', 'wa', 'Gracias por venir al webinar. En el chat preguntaste si el método sirve con turnos: eso se mira en la llamada de admisión, con tu caso delante. Si quieres, te paso el enlace.']] },
      { id: 's04', n: 'Begoña Arrieta', rol: 'Funcionaria · 55 años', seg: 'particular', ciudad: 'Bilbao', prod: PROG, orig: 'c1', canal: 'wa', etapa: 3, valor: 1795, creado: 15 * D, act: 6 * H, toque: 3 * D,
        f: { insomnio: true, probado: true, afecta: true, comunidad: true, motivo: 'lleva ocho años tomando pastillas para dormir', plazoOk: true }, s: { directo: true, comunidad: true, visitas: 4 },
        conv: [[15 * D, 'a', 'wa', 'Hola Begoña, soy Raquel, del equipo de la doctora. ¿Desde cuándo duermes mal?'], [15 * D - 30, 'c', 'wa', 'Desde hace ocho años, y tomo pastillas casi todas las noches. Llevo años con ellas.'], [3 * D, 'a', 'wa', 'Mañana es el webinar ' + WEB + '. Te aviso 24 h, 2 h y 30 minutos antes.']],
        ev: [[6 * H, 'web', 'Visita la página del programa (4 veces en 7 días)']] },
      { id: 's05', n: 'Ana Belén Ruiz', rol: 'Dependienta · 51 años', seg: 'particular', ciudad: 'Alicante', prod: PROG, orig: 'c1', canal: 'wa', etapa: 3, valor: 1795, creado: 5 * D, act: 5 * H, toque: 30 * H,
        f: { insomnio: true, motivo: 'desde la menopausia se despierta varias veces cada noche' }, s: { replay: true, visitas: 3 },
        conv: [[5 * D, 'a', 'wa', 'Hola Ana Belén, soy Raquel, del equipo de la doctora. ¿Qué es lo que más te cuesta por la noche?'], [5 * D - 20, 'c', 'wa', 'Es por la menopausia. Desde entonces me despierto tres o cuatro veces cada noche.'], [30 * H, 'a', 'wa', 'Ana Belén, te dejo el replay del webinar ' + WEB + ', por si no pudiste conectarte.'], [5 * H, 'c', 'wa', 'Vi el replay del webinar de las tres claves. Me ha gustado mucho.']] },
      // --- Pidieron la llamada de admisión y siguen sin hora
      { id: 's06', n: 'Lourdes Sanz', rol: 'Abogada · 46 años', seg: 'particular', ciudad: 'Zaragoza', prod: PROG, orig: 'c5', canal: 'wa', etapa: 4, valor: 1795, creado: 11 * D, act: 26 * H, toque: 26 * H,
        f: { insomnio: true, afecta: true, probado: true, motivo: 'la cabeza no para cuando se mete en la cama', plazoOk: true }, s: { solicitud: true, sinLlamada: true, solMin: 26 * H, directo: true, visitas: 2 },
        conv: [[11 * D, 'a', 'wa', 'Hola Lourdes, soy Raquel, del equipo de la doctora. Te inscribiste al webinar desde la newsletter: ¿qué te quita el sueño?'], [11 * D - 40, 'c', 'wa', 'La cabeza. Me meto en la cama y empiezo a darle vueltas a todo.'], [26 * H, 'a', 'wa', 'He recibido tu petición de llamada, gracias. ¿Qué día te va bien para la llamada de admisión?']],
        ev: [[26 * H, 'sistema', 'Pide la llamada de admisión']] },
      { id: 's07', n: 'Teresa Vidal', rol: 'Jubilada · 63 años', seg: 'particular', ciudad: 'Palma', prod: PROG, orig: 'c4', canal: 'wa', etapa: 4, valor: 1795, creado: 8 * D, act: 36 * H, toque: 36 * H,
        f: { insomnio: true, probado: true, referida: true, motivo: 'duerme cuatro horas desde que se jubiló' }, s: { solicitud: true, sinLlamada: true, solMin: 36 * H, plazos: true, test: true, directo: true },
        conv: [[8 * D, 'a', 'wa', 'Hola Teresa, soy Raquel, del equipo de la doctora. He visto el resultado de tu test de sueño y ya tienes tu plaza en el webinar. ¿Cuánto tiempo llevas así?'], [8 * D - 30, 'c', 'wa', 'Desde que me jubilé, hace dos años. Me lo recomendó una amiga que hizo el programa.'], [36 * H, 'a', 'wa', 'Recibida tu petición. Te propongo dos huecos para la llamada de admisión, dime cuál te encaja.']] },
      // --- Reservaron la llamada y no vinieron
      { id: 's08', n: 'Inés Gallardo', rol: 'Administrativa · 44 años', seg: 'particular', ciudad: 'Granada', prod: PROG, orig: 'c1', canal: 'wa', etapa: 5, valor: 1795, creado: 10 * D, act: 5 * H, toque: 4 * H,
        f: { insomnio: true, motivo: 'tarda más de una hora en dormirse', plazoOk: true }, s: { solicitud: true, noshow: true, plazos: true, directo: true },
        conv: [[10 * D, 'a', 'wa', 'Hola Inés, soy Raquel, del equipo de la doctora. ¿Qué te cuesta más por la noche?'], [10 * D - 50, 'c', 'wa', 'Tardo más de una hora en dormirme casi todas las noches.'], [D + 20 * H, 'a', 'wa', 'Gracias por venir al webinar, Inés. Te dejo reservada la llamada de admisión.'], [4 * H, 'a', 'wa', 'Inés, hoy no has podido conectarte a la llamada. ¿Te propongo otro hueco?']],
        ev: [[5 * H, 'sistema', 'No se presenta a la llamada de admisión']] },
      { id: 's09', n: 'Rosario Blanco', rol: 'Estaba en la lista de un lanzamiento anterior', seg: 'particular', ciudad: 'Santander', prod: PROG, orig: 'c6', canal: 'wa', etapa: 5, valor: 1795, creado: 14 * D, act: 30 * H, toque: 28 * H,
        f: { insomnio: true, probado: true, lista: true, motivo: 'lleva años con pastillas y quiere dormir sin depender de ellas', plazoOk: true }, s: { solicitud: true, noshow: true, plazos: true, directo: true },
        conv: [[14 * D, 'a', 'wa', 'Hola Rosario, soy Raquel, del equipo de la doctora. Estabas en la lista del lanzamiento anterior: hay nuevo webinar, ' + WEB + '. ¿Sigues durmiendo igual?'], [14 * D - 70, 'c', 'wa', 'Igual o peor. Ahora sí que quiero hacerlo.'], [28 * H, 'a', 'wa', 'Rosario, no te conectaste a la llamada de admisión. ¿Quieres que te dé otro hueco?']],
        ev: [[30 * H, 'sistema', 'No se presenta a la llamada de admisión']] },
      // --- Alumnas que quieren traer a alguien y nadie les ha contestado
      { id: 's10', n: 'Alicia Moreno', rol: 'Alumna · quiere traer a su marido', seg: 'particular', ciudad: 'Valencia', prod: PROG, orig: 'c6', canal: 'wa', etapa: 6, valor: 1795, creado: 6 * D, act: 2 * D, toque: 5 * D, fin: 'ganado',
        f: { insomnio: true, probado: true }, s: { exp: true, expTxt: 'Es alumna y escribió hace dos días que su marido también duerme mal; nadie le ha contestado', visitas: 2 },
        conv: [[6 * D, 'a', 'wa', 'Hola Alicia, soy Raquel, del equipo de la doctora. ¿Qué tal llevas el programa?'], [2 * D, 'c', 'wa', 'Muy contenta, he cambiado muchas cosas de mis noches. Mi marido también duerme fatal, ¿puede ver él el webinar?']] },
      { id: 's11', n: 'Carmen Soler', rol: 'Alumna · quiere traer a su hermana', seg: 'particular', ciudad: 'Las Palmas', prod: PROG, orig: 'c5', canal: 'wa', etapa: 6, valor: 1795, creado: 4 * D, act: 4 * H, toque: 4 * D, fin: 'ganado',
        f: { insomnio: true }, s: { exp: true, expTxt: 'Es alumna y escribió hace unas horas que su hermana también duerme mal', incluye: true },
        conv: [[4 * D, 'a', 'wa', 'Hola Carmen, soy Raquel, del equipo de la doctora. Te dejo el acceso a las sesiones en directo de esta semana.'], [4 * H, 'c', 'wa', 'Gracias. Mi hermana está como estaba yo, ¿puede ver el replay del webinar de las tres claves?']] },
      // --- Dijo «ahora no»: pasa a la lista de la reapertura
      { id: 's12', n: 'Laura Gil', rol: 'Diseñadora · 41 años', seg: 'particular', ciudad: 'San Sebastián', prod: PROG, orig: 'c1', canal: 'wa', etapa: 3, valor: 1795, creado: 8 * D, act: 4 * H, toque: 25 * H,
        f: { insomnio: true, afecta: true, probado: true, motivo: 'duerme mal desde que nació su segundo hijo', plazoOk: true }, s: { directo: true, plazos: true, luego: 'tras la mudanza', luegoTxt: 'lo decide cuando termine la mudanza de este mes', incluye: true, visitas: 2 },
        conv: [[8 * D, 'a', 'wa', 'Hola Laura, soy Raquel, del equipo de la doctora. ¿Desde cuándo duermes mal?'], [8 * D - 40, 'c', 'wa', 'Desde que nació mi segundo hijo, hace cuatro años.'], [25 * H, 'a', 'wa', 'Gracias por conectarte al webinar. ¿Te quedó alguna duda del programa?'], [4 * H, 'c', 'wa', 'Me encaja mucho, y poder fraccionar el pago me ayuda, pero estoy de mudanza este mes. Os digo algo cuando acabe.']] },
      // --- Plan de pago enviado tras la llamada y sin respuesta
      { id: 's13', n: 'Gloria Herrera', rol: 'Farmacéutica · 58 años', seg: 'particular', ciudad: 'Madrid', prod: PROG, orig: 'c2', canal: 'wa', etapa: 5, valor: 1795, creado: 18 * D, act: 5 * H, toque: 49 * H,
        f: { insomnio: true, probado: true, motivo: 'ha probado melatonina, infusiones y aplicaciones sin notar cambios', plazoOk: true }, s: { solicitud: true, plazos: true, prop: 49 * H, propVista: 3, incluye: true, directo: true },
        conv: [[18 * D, 'a', 'wa', 'Hola Gloria, soy Raquel, del equipo de la doctora. ¿Qué has probado hasta ahora para dormir?'], [18 * D - 30, 'c', 'wa', 'He probado de todo: melatonina, infusiones, aplicaciones…'], [49 * H, 'h', 'wa', 'Gloria, gracias por la llamada de hoy. Te envío el plan de pago fraccionado. Cualquier duda, me dices.']],
        ev: [[5 * H, 'web', 'Abre el plan de pago por tercera vez']] },
      { id: 's41', n: 'Josefa Prieto', rol: 'Cuidadora · 57 años', seg: 'particular', ciudad: 'Córdoba', prod: PROG, orig: 'c1', canal: 'wa', etapa: 5, valor: 1795, creado: 13 * D, act: 50 * H, toque: 50 * H,
        f: { insomnio: true, probado: true, motivo: 'lleva cuatro años con pastillas', plazoOk: true }, s: { solicitud: true, plazos: true, prop: 50 * H, propVista: 0, directo: true },
        conv: [[13 * D, 'a', 'wa', 'Hola Josefa, soy Raquel, del equipo de la doctora. ¿Qué te gustaría cambiar de tus noches?'], [13 * D - 35, 'c', 'wa', 'Llevo cuatro años con pastillas y no quiero seguir así.'], [50 * H, 'h', 'wa', 'Josefa, gracias por la llamada. Te dejo el plan de pago fraccionado que comentamos. Cualquier duda, me dices.']] },
      // --- Llamada de admisión agendada
      { id: 's14', n: 'Eva Martín', rol: 'Maestra · 50 años', seg: 'particular', ciudad: 'Murcia', prod: PROG, orig: 'c4', canal: 'wa', etapa: 5, valor: 1795, creado: 7 * D, act: 6 * H, toque: 6 * H,
        f: { insomnio: true, motivo: 'se despierta a las 4:00 casi todos los días', plazoOk: true }, s: { solicitud: true, cita: 20 * H, citaOk: true, plazos: true, test: true, directo: true },
        conv: [[7 * D, 'a', 'wa', 'Hola Eva, soy Raquel, del equipo de la doctora. He visto tu test de sueño y ya tienes tu plaza en el webinar. ¿A qué hora te sueles despertar?'], [7 * D - 50, 'c', 'wa', 'A las cuatro, casi todos los días.'], [6 * H, 'a', 'wa', 'Tienes reservada la llamada de admisión para mañana. Te mando el recordatorio la víspera.']] },
      { id: 's15', n: 'Rocío Peña', rol: 'Recomendada por una alumna', seg: 'particular', ciudad: 'Cádiz', prod: PROG, orig: 'c5', canal: 'wa', etapa: 5, valor: 1795, creado: 9 * D, act: 5 * H, toque: 5 * H,
        f: { insomnio: true, afecta: true, referida: true, motivo: 'el cansancio le pasa factura en el trabajo' }, s: { solicitud: true, cita: hc.min, citaOk: true, replay: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Rocío, soy Raquel, del equipo de la doctora. Me dice una alumna que te lo recomendó. ¿Cómo duermes últimamente?'], [9 * D - 40, 'c', 'wa', 'Mal, y lo noto mucho en el trabajo. Cuéntame cómo funciona.'], [5 * H, 'a', 'wa', 'Confirmada la llamada de admisión para el ' + hc.txt + ' a las 17:00.']] },
      // --- Plazas ya cerradas
      { id: 's16', n: 'Mercedes Ibáñez', rol: 'Pagó la primera cuota ayer', seg: 'particular', ciudad: 'Valencia', prod: PROG, orig: 'c1', canal: 'wa', etapa: 6, valor: 1795, creado: 20 * D, act: 26 * H, toque: 26 * H, fin: 'ganado',
        f: { insomnio: true, probado: true }, s: {}, conv: [] },
      { id: 's17', n: 'Silvia Torres', rol: 'Pagó el programa completo ayer', seg: 'particular', ciudad: 'Vigo', prod: PROG, orig: 'c2', canal: 'wa', etapa: 6, valor: 1795, creado: 16 * D, act: 20 * H, toque: 20 * H, fin: 'ganado',
        f: { insomnio: true, comunidad: true }, s: {}, conv: [] },
      { id: 's18', n: 'Lucía Romero', rol: 'Plaza reservada · recomendada', seg: 'particular', ciudad: 'Pamplona', prod: PROG, orig: 'c4', canal: 'wa', etapa: 6, valor: 1795, creado: 12 * D, act: 30 * H, toque: 30 * H, fin: 'ganado',
        f: { insomnio: true, referida: true }, s: {}, conv: [] },
      { id: 's19', n: 'Pedro Lozano', rol: 'Estaba en la lista anterior y entró después del webinar', seg: 'particular', ciudad: 'Málaga', prod: PROG, orig: 'c6', canal: 'wa', etapa: 6, valor: 1795, creado: 22 * D, act: D, toque: D, fin: 'ganado',
        f: { insomnio: true, lista: true }, s: {}, conv: [] },
      // --- Se inscriben ahora: reciben el replay
      { id: 's20', n: 'Judit Casas', rol: 'Acaba de inscribirse para ver el replay', seg: 'particular', ciudad: 'Tarragona', prod: WEBINAR, orig: 'c1', canal: 'wa', etapa: 1, valor: 1795, creado: 12, act: 12, toque: null,
        f: { insomnio: true }, s: { visitas: 1 }, conv: [] },
      { id: 's21', n: 'Sergio Molina', rol: 'Se inscribió desde un reel', seg: 'particular', ciudad: 'Córdoba', prod: WEBINAR, orig: 'c3', canal: 'wa', etapa: 1, valor: 1795, creado: 2 * H, act: 2 * H, toque: 100,
        f: { insomnio: true }, s: {}, conv: [[100, 'a', 'wa', 'Hola Sergio, soy Raquel, del equipo de la doctora. Ya tienes en tu correo el replay del webinar ' + WEB + '. ¿Qué te cuesta más: dormirte o no despertarte?']] },
      { id: 's22', n: 'Patricia León', rol: 'Hizo el test de sueño', seg: 'particular', ciudad: 'Castellón', prod: WEBINAR, orig: 'c4', canal: 'wa', etapa: 1, valor: 1795, creado: 30 * H, act: 30 * H, toque: 30 * H - 2,
        f: { afecta: true }, s: { intentos: 1, test: true }, conv: [[30 * H - 2, 'a', 'wa', 'Hola Patricia, soy Raquel, del equipo de la doctora. Ya tienes el resultado de tu test de sueño en el correo, con el replay del webinar. ¿Lo has podido ver?']] },
      // --- Se inscribieron al webinar y no vinieron
      { id: 's23', n: 'Cristina Vega', rol: 'Se inscribió al webinar y no vino', seg: 'particular', ciudad: 'Girona', prod: WEBINAR, orig: 'c1', canal: 'wa', etapa: 1, valor: 1795, creado: 5 * D, act: 5 * D, toque: 20 * H,
        f: { insomnio: true }, s: { intentos: 2, noAsiste: true }, conv: [[5 * D - 2, 'a', 'wa', 'Hola Cristina, soy Raquel, del equipo de la doctora. Ya tienes tu plaza para el webinar ' + WEB + '. Te aviso 24 h, 2 h y 30 minutos antes.'], [2 * D + 6 * H, 'a', 'wa', 'Cristina, en 30 minutos empieza el webinar. Te dejo el enlace.'], [20 * H, 'a', 'wa', 'Cristina, no pudiste conectarte al webinar. Te dejo el replay: estará disponible unos días.']] },
      { id: 's24', n: 'Amparo Ríos', rol: 'No abre los correos', seg: 'particular', ciudad: 'Toledo', prod: WEBINAR, orig: 'c1', canal: 'email', etapa: 1, valor: 1795, creado: 6 * D, act: 6 * D, toque: 20 * H,
        f: { insomnio: true, afecta: true }, s: { intentos: 3, emails: 0, noAsiste: true }, conv: [[6 * D, 'a', 'email', 'Hola Amparo, ya tienes tu plaza para el webinar gratuito ' + WEB + '.'], [20 * H, 'a', 'email', 'Amparo, te dejo el replay del webinar ' + WEB + ', por si no pudiste conectarte.']] },
      { id: 's25', n: 'Maite Calvo', rol: 'Abre todos los correos · no entró en la comunidad', seg: 'particular', ciudad: 'Burgos', prod: WEBINAR, orig: 'c5', canal: 'email', etapa: 2, valor: 1795, creado: 5 * D, act: 5 * H, toque: 20 * H,
        f: { insomnio: true, motivo: 'se despierta con cualquier ruido' }, s: { emails: 6, visitas: 2, incluye: true, noAsiste: true },
        conv: [[5 * D, 'a', 'email', 'Hola Maite, ya tienes tu plaza para el webinar ' + WEB + '. ¿Qué te cuesta más por la noche?'], [4 * D, 'c', 'email', 'Me despierto con cualquier ruido y luego me cuesta mucho volver a dormirme.'], [20 * H, 'a', 'email', 'Te dejo el replay del webinar, por si no pudiste conectarte.']] },
      // --- Calentamiento y comunidad de WhatsApp
      { id: 's26', n: 'Nieves Pardo', rol: 'Está en la comunidad de WhatsApp', seg: 'particular', ciudad: 'Valladolid', prod: WEBINAR, orig: 'c3', canal: 'wa', etapa: 2, valor: 1795, creado: 4 * D, act: 90, toque: 4 * H,
        f: { insomnio: true, comunidad: true, motivo: 'duerme a ratos desde hace tres años' }, s: { comunidad: true, visitas: 1 },
        conv: [[4 * D, 'a', 'wa', 'Hola Nieves, soy Raquel, del equipo de la doctora. ¿Quieres entrar en la comunidad de WhatsApp del webinar?'], [4 * D - 20, 'c', 'wa', 'Sí, méteme.'], [4 * H, 'a', 'wa', 'Te dejo el replay del webinar ' + WEB + '. ¿Cómo lo llevas?'], [90, 'c', 'wa', 'Lo estoy viendo ahora. Me veo reflejada en todo.']] },
      { id: 's27', n: 'Daniela Fuentes', rol: 'Vio el replay del webinar', seg: 'particular', ciudad: 'Oviedo', prod: PROG, orig: 'c1', canal: 'wa', etapa: 3, valor: 1795, creado: 6 * D, act: 8 * H, toque: 8 * H,
        f: { insomnio: true, comunidad: true }, s: { comunidad: true, replay: true, visitas: 1 },
        conv: [[6 * D, 'a', 'wa', 'Hola Daniela, soy Raquel, del equipo de la doctora. ¿Desde cuándo duermes mal?'], [6 * D - 25, 'c', 'wa', 'Desde hace un par de años, sobre todo cuando tengo estrés.'], [8 * H, 'a', 'wa', 'Has visto el replay del webinar entero, ¡bien hecho! Si quieres, puedes pedir la llamada de admisión mientras el carrito está abierto.']] },
      { id: 's28', n: 'Isabel Domínguez', rol: 'Recomendada por una alumna', seg: 'particular', ciudad: 'Logroño', prod: PROG, orig: 'c4', canal: 'wa', etapa: 2, valor: 1795, creado: 2 * D, act: 8 * H, toque: 8 * H,
        f: { insomnio: true, referida: true, motivo: 'se despierta agotada aunque se acueste pronto' }, s: { visitas: 2, incluye: true, test: true },
        conv: [[2 * D, 'a', 'wa', 'Hola Isabel, soy Raquel, del equipo de la doctora. Me dice una alumna que te interesa el programa.'], [2 * D - 60, 'c', 'wa', 'Sí, me habló muy bien. ¿Qué incluye exactamente?'], [8 * H, 'a', 'wa', 'Te cuento: es un programa online, con un método de 6 pasos, sin fármacos y de menos de 10 semanas, con sesiones en directo. Antes hay una llamada de admisión para ver si encaja con tu caso. ¿Qué día te va bien?']] },
      { id: 's29', n: 'Javier Rubio', rol: 'Escribió por mensaje directo', seg: 'particular', ciudad: 'Almería', prod: WEBINAR, orig: 'c3', canal: 'wa', etapa: 2, valor: 1795, creado: 3 * D, act: 30 * H, toque: 32 * H,
        f: { insomnio: true }, s: { visitas: 1 },
        conv: [[3 * D, 'a', 'wa', 'Hola Javier, soy Raquel, del equipo de la doctora. Ya tienes tu plaza para el webinar ' + WEB + '.'], [32 * H, 'a', 'wa', '¿Pudiste ver el webinar?'], [30 * H, 'c', 'wa', 'Todavía no, esta semana veo el replay.']] },
      // --- «Ahora no»: pasan a la lista de la reapertura
      { id: 's30', n: 'Elena Castro', rol: 'Comercial de seguros · 48 años', seg: 'particular', ciudad: 'Salamanca', prod: PROG, orig: 'c1', canal: 'wa', etapa: 2, valor: 1795, creado: 10 * D, act: 6 * D, toque: 6 * D,
        f: { insomnio: true, afecta: true }, s: { luego: 'enero', luegoTxt: 'lo haría en enero, cuando pasen las fiestas' },
        conv: [[10 * D, 'a', 'wa', 'Hola Elena, soy Raquel, del equipo de la doctora. ¿Qué te cuesta más por la noche?'], [6 * D, 'c', 'wa', 'Ahora mismo voy a tope con el trabajo. Lo miro en enero, cuando pasen las fiestas.']] },
      { id: 's31', n: 'Lidia Marín', rol: 'Estaba en la lista de lanzamientos anteriores', seg: 'particular', ciudad: 'Zamora', prod: PROG, orig: 'c6', canal: 'wa', etapa: 3, valor: 1795, creado: 9 * D, act: 30 * H, toque: 36 * H,
        f: { insomnio: true, probado: true, lista: true }, s: { directo: true, luego: 'reapertura', luegoTxt: 'esperará a la reapertura por un viaje de trabajo' },
        conv: [[9 * D, 'a', 'wa', 'Hola Lidia, soy Raquel, del equipo de la doctora. Estabas en la lista del lanzamiento anterior: hay nuevo webinar, ' + WEB + '. ¿Te apuntas?'], [36 * H, 'a', 'wa', 'Gracias por venir al webinar, Lidia. ¿Te quedó alguna duda?'], [30 * H, 'c', 'wa', 'Me gustó mucho, pero estas semanas estoy de viaje por trabajo. Mejor más adelante.']] },
      { id: 's32', n: 'Francisca Méndez', rol: 'Ha probado de todo · 60 años', seg: 'particular', ciudad: 'Jaén', prod: PROG, orig: 'c5', canal: 'email', etapa: 2, valor: 1795, creado: 12 * D, act: 7 * D, toque: 7 * D,
        f: { insomnio: true, probado: true, motivo: 'ha probado de todo y ya no sabe qué hacer' }, s: { luego: 'enero', luegoTxt: 'lo retomaría después de Navidad' },
        conv: [[12 * D, 'a', 'email', 'Hola Francisca, ya tienes tu plaza para el webinar gratuito ' + WEB + '.'], [7 * D, 'c', 'email', 'Gracias. He probado de todo y me interesa, pero hasta después de Navidad no puedo.']] },
      { id: 's33', n: 'Gemma Ramos', rol: 'Fisioterapeuta · 45 años', seg: 'particular', ciudad: 'León', prod: PROG, orig: 'c6', canal: 'wa', etapa: 3, valor: 1795, creado: 11 * D, act: 26 * H, toque: 30 * H,
        f: { insomnio: true, lista: true }, s: { directo: true, ppto: 'no', luego: 'reapertura', luegoTxt: 'no tiene presupuesto este mes y lo mirará en la reapertura' },
        conv: [[11 * D, 'a', 'wa', 'Hola Gemma, soy Raquel, del equipo de la doctora. Hay nuevo webinar: ' + WEB + '.'], [30 * H, 'a', 'wa', '¿Qué tal el webinar, Gemma?'], [26 * H, 'c', 'wa', 'Muy bien, pero este mes no me lo puedo permitir. Si hay otra oportunidad, me lo planteo.']] },
      // --- Bajo encaje o fuera
      { id: 's34', n: 'Marta Benítez', rol: 'Estudiante · duerme bien', seg: 'particular', ciudad: 'Valencia', prod: WEBINAR, orig: 'c3', canal: 'wa', etapa: 1, valor: 1795, creado: 7 * D, act: 6 * D, toque: 6 * D,
        f: { sinProblema: true }, s: { visitas: 1 },
        conv: [[7 * D, 'a', 'wa', 'Hola Marta, soy Raquel, del equipo de la doctora. ¿Qué te cuesta más por la noche?'], [6 * D, 'c', 'wa', 'La verdad es que duermo bien. Me apunté al webinar por curiosidad.']] },
      { id: 's35', n: 'Sandra Iglesias', rol: 'Solo busca consejos gratis', seg: 'particular', ciudad: 'Huelva', prod: WEBINAR, orig: 'c1', canal: 'wa', etapa: 1, valor: 1795, creado: 9 * D, act: 9 * D, toque: 6 * D, fin: 'perdido',
        f: { gratis: true }, s: { intentos: 3 }, conv: [] },
      { id: 's36', n: 'Antonio Cano', rol: 'Ronca y nota pausas al respirar', seg: 'particular', ciudad: 'Madrid', prod: WEBINAR, orig: 'c2', canal: 'wa', etapa: 2, valor: 1795, creado: 8 * D, act: 7 * D, toque: 7 * D - 30,
        f: { otroCaso: true }, s: {},
        conv: [[8 * D, 'a', 'wa', 'Hola Antonio, soy Raquel, del equipo de la doctora. ¿Qué te cuesta más por la noche?'], [7 * D, 'c', 'wa', 'Mi mujer dice que ronco mucho y que a veces dejo de respirar. ¿Esto me serviría?'], [7 * D - 30, 'a', 'wa', 'Gracias por contarlo, Antonio. Eso que describes conviene que lo valore primero tu médico. Cuando lo hayas hablado con él, aquí estamos.']] },
      // --- Lista anterior, newsletter y recomendadas con la llamada en marcha
      { id: 's37', n: 'Olga Prat', rol: 'Lista anterior · llamada agendada', seg: 'particular', ciudad: 'Pontevedra', prod: PROG, orig: 'c6', canal: 'wa', etapa: 5, valor: 1795, creado: 14 * D, act: 6 * H, toque: 6 * H,
        f: { insomnio: true, probado: true, lista: true, motivo: 'no ha dormido una noche seguida en dos años' }, s: { solicitud: true, cita: hc.min, citaOk: true, plazos: true, directo: true },
        conv: [[14 * D, 'a', 'wa', 'Hola Olga, soy Raquel, del equipo de la doctora. Hay nuevo webinar en directo, ' + WEB + '. ¿Te apetece verlo esta vez?'], [D + 20 * H, 'a', 'wa', 'Gracias por conectarte al webinar. Viendo lo que nos contaste, creo que el programa te puede interesar. ¿Te cuento cómo funciona?'], [D + 19 * H, 'c', 'wa', 'Sí, cuéntame.'], [6 * H, 'a', 'wa', 'Tienes reservada la llamada de admisión para el ' + hc.txt + '. Te mando un recordatorio la víspera.']] },
      { id: 's38', n: 'Concha Aguilar', rol: 'Lee la newsletter cada día', seg: 'particular', ciudad: 'Albacete', prod: WEBINAR, orig: 'c5', canal: 'email', etapa: 2, valor: 1795, creado: 3 * D, act: 3 * H, toque: 3 * D,
        f: { insomnio: true }, s: { emails: 4, visitas: 2 },
        conv: [[3 * D, 'a', 'email', 'Hola Concha, mañana es el webinar gratuito ' + WEB + '. Te dejo el enlace para inscribirte.']] },
      { id: 's39', n: 'Julia Esteban', rol: 'Recomendada · pidió la llamada', seg: 'particular', ciudad: 'Murcia', prod: PROG, orig: 'c5', canal: 'wa', etapa: 5, valor: 1795, creado: 6 * D, act: 5 * H, toque: 5 * H,
        f: { insomnio: true, afecta: true, referida: true, motivo: 'se despierta varias veces por la noche' }, s: { solicitud: true, cita: 26 * H, citaOk: true, directo: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Julia, soy Raquel, del equipo de la doctora. Me dice una alumna que os conocéis. Ya tienes tu plaza para el webinar.'], [5 * H, 'a', 'wa', 'Tienes la llamada de admisión mañana. Te mando el recordatorio la víspera.']] },
      { id: 's40', n: 'Candela Reyes', rol: 'Entró en la comunidad desde Instagram', seg: 'particular', ciudad: 'Cáceres', prod: WEBINAR, orig: 'c3', canal: 'wa', etapa: 2, valor: 1795, creado: D, act: 3 * H, toque: 3 * H,
        f: { insomnio: true, comunidad: true, motivo: 'no desconecta del móvil hasta muy tarde' }, s: { comunidad: true },
        conv: [[D, 'a', 'wa', 'Hola Candela, soy Raquel, del equipo de la doctora. ¿Quieres entrar en la comunidad de WhatsApp?'], [20 * H, 'c', 'wa', 'Sí, me apunto, gracias.'], [3 * H, 'a', 'wa', 'Ya estás dentro. Te he dejado el replay del webinar ' + WEB + ' en el correo.']] }
    ]
  };
})();

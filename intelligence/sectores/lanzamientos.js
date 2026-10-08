/* Sector: Infoproductora que vende por lanzamientos (formación en comunicación y visibilidad en prensa
 * para marcas de bienestar, belleza y estilo de vida).
 * Embudo real del negocio: audioclase gratuita (lead magnet) → correos y WhatsApp → directo o reto previo
 * → carrito abierto una semana → solicitud + llamada de admisión para el programa de 3 meses (ticket alto,
 * pago fraccionado). Un producto de ticket bajo (Pitch noticiable) hace de puerta de entrada.
 * El recorrido son las fases del lanzamiento: lista → calentamiento → directo o reto → solicitud → llamada → plaza.
 * Las «campañas» son los orígenes del contacto: anuncio, audioclase en la web, Instagram, referencias,
 * lista antigua y compradores del Pitch noticiable.
 * Reglas de voz: los mensajes automáticos solo salen entre las 8:00 y las 21:30, la llamada de admisión
 * la hace siempre una persona, nada promete resultados y no se habla de ningún cliente real.
 * Todos los nombres, el negocio, el programa, las fechas y las cifras son inventados: datos de ejemplo.
 * El nombre del negocio nunca va aquí: llega por el parámetro de URL «empresa». */
(function () {
  const H = 60, D = 1440;
  const Q = window.QV.voz;
  const hc = Q.hueco(17);

  // El carrito lleva abierto 2 días: hoy es el día 3 de 7 y cierra dentro de 4 días.
  const DIAS_CIERRE = 4;
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

  window.QV_SECTORES = window.QV_SECTORES || {};
  window.QV_SECTORES.lanzamientos = {
    id: 'lanzamientos',
    nombre: 'Infoproductora · lanzamientos',
    t: {
      contacto: 'contacto', contactos: 'contactos', Contactos: 'Contactos', Contacto: 'Contacto',
      venta: 'plaza', ventas: 'plazas', Ventas: 'Plazas', producto: 'programa', Producto: 'Programa',
      paginaVisitas: 'la página del programa', cita: 'llamada de admisión', Cita: 'Llamada de admisión', laCita: 'la llamada de admisión',
      propuesta: 'el plan de pago', Propuesta: 'Plan de pago', propuestas: 'planes de pago', comercial: 'la mentora', Comercial: 'Mentora',
      cliente: 'alumna', unCliente: 'una alumna', clientes: 'alumnas', convierten: 'se apuntan',
      objetivoPaso: 'agendarle la llamada de admisión', casoExito: 'el caso de una alumna con una marca parecida', valorAlto: 1500,
      oportunidades: 'contactos', atencion: 'contactos que requieren atención', laVenta: 'la plaza', propuestas: 'planes de pago',
      verbo: 'apuntarse', clientesReales: 'plazas de verdad', empleados: 'personas en el equipo',
      pasoHumano: 'hacer la llamada de admisión y cerrar la plaza',
      nombreAgenteVoz: 'Vera',
      senales: { nueva: 'Contacto nuevo', noshow: 'Llamada en riesgo', propuesta: 'Plan de pago sin respuesta', revision: 'Pidió esperar al próximo lanzamiento', expansion: 'Listo para el programa', reactivar: 'Lista de «no ahora»' },
      anunciosIntro: 'Datos de ejemplo. Cada fila es un origen: el anuncio de la audioclase, la audioclase en la web, Instagram, las recomendaciones, la lista de lanzamientos anteriores y quienes compraron el Pitch noticiable. El sistema une cada origen con lo que pasa después: quién asiste al directo, quién envía la solicitud, quién viene a la llamada y quién se apunta al programa.',
      notaTitulo: 'Qué cambiaría en el origen de los contactos', notaBoton: 'Redactar la nota del lanzamiento',
      notaIntro: 'Datos de ejemplo. Esto es lo que cambiaría de aquí al cierre del carrito, cruzando cada origen con lo que pasa después.',
      preguntaNota: '¿Qué cambiaríamos en el origen de los contactos antes del cierre?', notaAsunto: 'Asunto: Lanzamiento · qué cambiar antes del cierre', notaCorreo: 'Nota del lanzamiento'
    },
    // Lista → Calentamiento → Directo o reto → Solicitud (carrito abierto) → Llamada de admisión → Plaza en el programa
    recorrido: [
      { id: 'anuncio', txt: 'Origen', sinFuga: true },
      { id: 'info', txt: 'En la lista (audioclase)' },
      { id: 'contactado', txt: 'Calentamiento' },
      { id: 'cualificado', txt: 'Directo o reto' },
      { id: 'solicitud', txt: 'Solicitud (carrito)' },
      { id: 'llamada', txt: 'Llamada de admisión' },
      { id: 'alta', txt: 'Plaza en el programa' }
    ],
    ventaEtapa: 'alta',
    ticket: 1950,
    // Qué conversión es razonable en cada fase cuando el seguimiento está bien hecho.
    referencia: { contactado: 0.88, cualificado: 0.42, solicitud: 0.4, llamada: 0.85, alta: 0.38 },
    nombresFuga: {
      contactado: { txt: 'Calentamiento', exp: 'inscritos en la audioclase que no abren los correos ni contestan al primer WhatsApp' },
      cualificado: { txt: 'Directo o reto', exp: 'inscritos calentados a los que nadie recuerda el directo con una frase suya, y que no llegan' },
      solicitud: { txt: 'Solicitud', exp: 'asistentes al directo que no piden plaza porque nadie les resolvió su duda mientras el carrito estaba abierto' },
      llamada: { txt: 'Llamada de admisión', exp: 'solicitudes que se quedan sin llamada agendada y llamadas reservadas a las que la persona no se presenta' },
      alta: { txt: 'Plaza', exp: 'llamadas hechas que no terminan en plaza porque el plan de pago se queda sin respuesta' }
    },
    remedioFuga: {
      llamada: 'Un mensaje en cuanto llega la solicitud con dos huecos concretos para la llamada, la confirmación y el recordatorio el día antes, y otro mensaje a quien no vino con dos huecos nuevos. Los mensajes automáticos salen entre las 8:00 y las 21:30; la llamada de admisión la hace siempre una persona.',
      solicitud: 'Un mensaje después del directo con la duda concreta que la persona escribió en el chat y el enlace a la solicitud. Sale entre las 8:00 y las 21:30; si pregunta por condiciones, el hilo pasa a la mentora.',
      alta: 'Revisar a diario los planes de pago abiertos y sin respuesta: la mentora llama a los de más valor y el resto recibe un mensaje con la duda más habitual (las cuotas).'
    },
    mesDatos: { respuestaAntes: 250, respuestaAhora: 2, agendadas: 96 },
    campanas: [
      { id: 'c1', canal: 'Meta', nombre: 'Anuncio de la audioclase gratuita', inversion: 1850, ticket: 1950,
        embudo: { anuncio: 52000, info: 410, contactado: 330, cualificado: 118, solicitud: 34, llamada: 21, alta: 5 } },
      { id: 'c2', canal: 'Instagram', nombre: 'Reels y stories hacia la audioclase', inversion: 0, ticket: 1950,
        embudo: { anuncio: 18500, info: 190, contactado: 160, cualificado: 70, solicitud: 24, llamada: 17, alta: 4 } },
      { id: 'c3', canal: 'Web', nombre: 'Audioclase en la web y en el blog', inversion: 0, ticket: 1950,
        embudo: { anuncio: 6200, info: 110, contactado: 96, cualificado: 38, solicitud: 11, llamada: 7, alta: 2 } },
      { id: 'c4', canal: 'Referencias', nombre: 'Alumnas que recomiendan el programa', inversion: 0, ticket: 1950,
        embudo: { anuncio: 60, info: 44, contactado: 42, cualificado: 24, solicitud: 15, llamada: 12, alta: 5 } },
      { id: 'c5', canal: 'Lista antigua', nombre: 'Lista de lanzamientos anteriores', inversion: 0, ticket: 1950,
        embudo: { anuncio: 1300, info: 96, contactado: 70, cualificado: 25, solicitud: 9, llamada: 6, alta: 2 } },
      { id: 'c6', canal: 'Producto de entrada', nombre: 'Compradores del Pitch noticiable', inversion: 0, ticket: 1950,
        embudo: { anuncio: 380, info: 62, contactado: 55, cualificado: 20, solicitud: 12, llamada: 8, alta: 3 } }
    ],
    kpis: ['interesados', 'cualificados', 'solicitudes', 'entrevistas', 'show', 'ventas', 'carrito', 'respuesta', 'noahora', 'ingresos'],
    kpiNombres: { interesados: 'Inscritas', cualificados: 'Asisten al directo', entrevistas: 'Llamadas hechas', ventas: 'Plazas vendidas', ingresos: 'Facturación' },
    kpiEtapas: { interesados: 'info', cualificados: 'cualificado', entrevistas: 'llamada' },
    kpiCustom: function (m, cfg, M, est) {
      const cs = (est && est.contactos) || [];
      const ahora = est ? est.ahora : Date.now();
      const md = cfg.mesDatos || {};
      const noAhora = cs.filter(function (c) { return c.s.luego && !c.fin; }).length;
      return {
        solicitudes: { l: 'Solicitudes', v: M.num(m.tot.solicitud), em: M.pct(m.tot.solicitud / Math.max(1, m.tot.cualificado)) + ' de quienes asisten' },
        show: { l: 'Vienen a la llamada', v: M.pct(m.tot.llamada / Math.max(1, md.agendadas)), em: (md.agendadas - m.tot.llamada) + ' no vinieron', clase: 'mal' },
        carrito: { l: 'Carrito abierto', v: 'Día 3 de 7', em: 'Cierra ' + cuando(ahora, DIAS_CIERRE) },
        respuesta: { l: 'Respuesta (carrito)', v: M.duracionLarga(md.respuestaAntes), em: 'Con agente: ' + md.respuestaAhora + ' min', clase: 'mal' },
        noahora: { l: 'Lista «no ahora»', v: M.num(noAhora), em: 'a escribir tras el cierre' }
      };
    },
    agenda: { horas: [9, 20], pausa: [14, 16], ocupacion: 0.45, etapa: 'llamada', sabado: false,
      tipos: ['Llamada de admisión', 'Llamada de admisión · plan de pago', 'Llamada de admisión · recomendada', 'Llamada · compradora del pitch', 'Llamada de admisión · marca con equipo'] },
    veredictoAnuncio: function (f, Mo) {
      const e = f.c.embudo;
      if (f.c.inversion > 0) {
        return { id: 'prueba', txt: 'Seguir mirando', tono: 't-amber', por: Mo.num(e.info) + ' inscritas y ' + Mo.pl(e.alta, 'plaza', 'plazas') + ' con el carrito a mitad. Todavía no se puede decidir: juzgad el anuncio por las plazas que llegan a la llamada, no por las inscritas a la audioclase.' };
      }
      return { id: 'organico', txt: 'Sin inversión', tono: 't-gris', por: 'No tiene coste de anuncio. De quienes asisten al directo o reto, acaba apuntándose el ' + Mo.pct(f.post) + '.' };
    },
    notaAnuncios: function (a, T, Mo) {
      const lin = [];
      const fi = function (id) { return a.filas.filter(function (f) { return f.c.id === id; })[0]; };
      const p = fi('c1'), ig = fi('c2'), r = fi('c4'), b = fi('c5'), e = fi('c6');
      if (p) lin.push('Anuncio de la audioclase: ' + p.entra + ' inscritas a ' + Mo.euros(p.cpl) + ' cada una y ' + Mo.pl(p.ventas, 'plaza', 'plazas') + ' hasta ahora. Todavía es pronto: miradlo cuando cierre el carrito y juzgadlo por las plazas, no por las inscritas.');
      if (ig) lin.push('Instagram trae ' + ig.entra + ' inscritas sin gastar en anuncios, y las que llegan por ahí asisten más al directo. Merece la pena repetir los reels que llevaron a la audioclase.');
      if (r) lin.push('Las recomendaciones son pocas pero las que mejor acaban: ' + Mo.pl(r.ventas, 'plaza', 'plazas') + ' de ' + r.entra + ' inscritas. Pedid recomendación a cada alumna nada más empezar el programa.');
      if (e) lin.push('Quien compra el Pitch noticiable ya ha pagado algo y confía: ' + Mo.pl(e.ventas, 'plaza', 'plazas') + ' de ' + e.entra + ' compras. Hoy hay compradoras a las que nadie les ha hablado del programa.');
      if (b) lin.push('La lista antigua trajo ' + Mo.pl(b.ventas, 'plaza', 'plazas') + ' sin gastar en anuncios. Los «no ahora» de este lanzamiento van a esa lista: escribirles a los pocos días del cierre es lo más barato que hay.');
      return lin;
    },
    bannerAnuncios: false, // con un solo anuncio no hay comparación que enseñar
    timelineSinOrigen: true,
    textoAlta: function (c) {
      const cp = (window.QV_SECTORES.lanzamientos.campanas || []).filter(function (x) { return x.id === c.orig; })[0];
      return (c.orig === 'c6' ? 'Compra el Pitch noticiable' : 'Se apunta a la audioclase') + (cp ? ' · desde ' + cp.canal : '');
    },

    reglas: {
      fitBase: 24,
      fit: [
        [function (c) { return c.f && c.f.marca; }, 20, 'tiene una marca con algo que vender', 'Tiene marca propia'],
        [function (c) { return c.f && c.f.sector; }, 10, 'su marca es de bienestar, belleza o estilo de vida', 'Marca de bienestar, belleza o estilo de vida'],
        [function (c) { return c.f && c.f.factura; }, 12, 'ya factura con su marca', 'Ya factura'],
        [function (c) { return c.f && c.f.prensa; }, 12, function (c) { return 'sabe qué quiere contar: ' + c.f.prensa; }, 'Sabe qué quiere contar a la prensa'],
        [function (c) { return c.f && c.f.pitch; }, 14, 'ya compró el Pitch noticiable', 'Ya compró el Pitch noticiable'],
        [function (c) { return c.f && c.f.referida; }, 10, 'llega recomendada por una alumna', 'Llega recomendada'],
        [function (c) { return c.f && c.f.reto; }, 8, 'hizo el reto previo', 'Hizo el reto previo'],
        [function (c) { return c.f && c.f.plazoOk; }, 6, 'el pago en cuotas le encaja', 'Le encaja pagar en cuotas'],
        [function (c) { return c.f && c.f.sinMarca; }, -22, 'todavía no tiene marca ni nada que vender', 'Sin marca todavía'],
        [function (c) { return c.f && c.f.gratis; }, -22, 'solo busca contenido gratuito'],
        [function (c) { return c.f && c.f.otroSector; }, -18, 'su negocio no es de bienestar, belleza o estilo de vida', 'Otro sector'],
        [function (c) { return c.f && c.f.sinTiempo; }, -10, 'dice que no tiene tiempo estos meses']
      ],
      intencion: [
        [function (c) { return c.s.incluye; }, 8, 'preguntó qué incluye el programa'],
        [function (c) { return c.s.plazos; }, 12, 'preguntó por pagar en cuotas'],
        [function (c) { return c.s.reto; }, 10, 'completó el reto previo'],
        [function (c) { return c.s.directo && !c.fin; }, 14, 'asistió al directo'],
        [function (c) { return c.s.solicitud && !c.fin; }, 18, 'envió la solicitud'],
        [function (c) { return c.s.pitch; }, 10, 'compró el Pitch noticiable']
      ],
      riesgo: [
        [function (c) { return c.s.sinLlamada && !c.fin; }, 50, function (c) { return 'solicitud sin llamada agendada desde hace ' + QV.motor.duracion(c.s.solMin); }]
      ]
    },

    nba: function (c, k, x, T, M) {
      const ahora = k.ahora;
      const nombre = c.n.split(' ')[0];
      const cierre = cuando(ahora, DIAS_CIERRE);
      if (c.fin === 'ganado' && c.s.exp) {
        return { id: 'ofrecer', accion: 'Ofrecerle el programa con una llamada de admisión', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: (c.s.expTxt || 'Compró el Pitch noticiable') + '. El mensaje sale ' + envio(ahora) + ' (los automáticos, de 8:00 a 21:30): lo que ya ha trabajado con el pitch y la opción de reservar una llamada de admisión antes de que cierre el carrito ' + cierre + '. Si pregunta por condiciones, el hilo pasa a la mentora.' };
      }
      if (c.fin) return M.nbaGenerica(c, k, x, T);
      if (c.s.noshow) {
        return { id: 'reprogramar', accion: 'Reprogramar la llamada de admisión', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Reservó la llamada y no vino, pero la solicitud era real. Mensaje ' + envio(ahora) + ' con dos huecos: ' + cuando(ahora, 1) + ' y ' + cuando(ahora, 2) + '. Si no contesta, un último mensaje ' + cuando(ahora, 3) + ' y se la deja tranquila hasta el cierre del carrito (' + cierre + ').' };
      }
      if (c.s.sinLlamada) {
        return { id: 'agendar', accion: 'Proponerle dos huecos para la llamada de admisión', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Envió la solicitud hace ' + M.duracion(c.s.solMin) + ' y sigue sin llamada agendada. Mensaje ' + envio(ahora) + ' con dos huecos concretos (' + cuando(ahora, 1) + ' y ' + cuando(ahora, 2) + '); si los dos días se llenan, la mentora abre más huecos antes del cierre (' + cierre + ').' };
      }
      if (c.s.luego) {
        const aviso = cuando(ahora, DIAS_CIERRE + 1);
        return { id: 'postlanzamiento', accion: 'Dejarla en la lista de «no ahora» y escribirle ' + aviso, quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'vigilando',
          por: 'Dijo que ' + (c.s.luegoTxt || 'lo decide después del lanzamiento') + '. No se le insiste mientras el carrito está abierto: ' + aviso + ' (el día después del cierre) recibe un mensaje con lo que contó y la fecha de la próxima edición.' };
      }
      if (c.s.precio && ultimoEsContacto(c, M)) {
        const ult = M.ultimoMsg(c);
        return { id: 'precio', accion: 'Contestarle el precio y el pago en cuotas', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Preguntó el precio ' + M.hace((ahora - ult.t) / M.MIN) + ' y sigue sin respuesta. Durante el carrito cada consulta que espera se enfría. Respuesta ' + envio(ahora) + ' con lo que incluye el programa y las tres cuotas; si pide algo distinto, pasa a la mentora.' };
      }
      if (c.s.directo && c.etapa === 3) {
        return { id: 'directo', accion: 'Mensaje tras el directo con su duda y la solicitud', quien: 'Agente de WhatsApp', tipo: 'agente', estado: 'trabajando',
          por: 'Asistió al directo y no ha pedido plaza' + (c.s.visitas >= 3 ? ' (ha vuelto ' + c.s.visitas + ' veces a la página del programa)' : '') + '. Mensaje ' + envio(ahora) + ' con la pregunta que dejó en el chat y el enlace a la solicitud. El carrito cierra ' + cierre + '.' };
      }
      if (c.s.tProp != null && k.toque > 2880 && c.valor >= T.valorAlto) {
        return { id: 'propuesta', accion: 'Llamada de la mentora para resolver el plan de pago', quien: T.Comercial, tipo: 'humano', estado: 'humano',
          por: (c.s.propVista ? 'Ha abierto el plan de pago ' + c.s.propVista + (c.s.propVista === 1 ? ' vez' : ' veces') : 'El plan de pago sigue sin abrir') + ' y nadie le ha escrito en ' + M.duracion(k.toque) + '. Las dudas con las cuotas se resuelven hablando: la mentora la llama ' + cuando(ahora, 1) + ' por la mañana, antes del cierre (' + cierre + ').' };
      }
      if (c.etapa === 5 && c.s.tCita != null && k.cita > 0 && c.s.citaOk) {
        // id «esperar»: la llamada está confirmada, no hay nada urgente; solo se prepara a la mentora
        return { id: 'esperar', accion: 'Preparar la llamada de admisión', quien: T.Comercial, tipo: 'humano', estado: 'humano',
          por: 'Llamada ' + M.dentroDe(k.cita) + ', ya confirmada. La ficha, lo que escribió y lo que preguntó en el directo están resumidos para que la mentora llegue sabiendo en qué punto está.' };
      }
      return M.nbaGenerica(c, k, x, T);
    },
    vozDijo: function (c) { return c.f && c.f.prensa ? ['Quiere contar: ' + c.f.prensa] : []; },
    vozMotivo: function (c) { return 'Se apuntó a la audioclase y quiere saber más del programa.'; },

    preguntas: [
      { q: '¿Quién pidió el precio y sigue sin respuesta?', h: 'lista', obj: ['seguimiento', 'ventas', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.precio && QV.motor.ultimoMsg(c) && QV.motor.ultimoMsg(c).de === 'c'; }, orden: 'prob',
        intro: function (l) { return l.length + ' contactos preguntaron el precio del programa y nadie les ha contestado todavía. Con el carrito abierto, cada consulta que espera se enfría: la respuesta sale hoy dentro del horario de 8:00 a 21:30.'; },
        vista: 'tabla' },
      { q: '¿Quién asistió al directo y no ha pedido plaza?', h: 'lista', obj: ['conversion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.directo && c.etapa === 3; }, orden: 'prob',
        intro: function (l) { return l.length + ' contactos vieron el directo y todavía no han enviado la solicitud. Es el grupo con más intención del carrito: un mensaje con su duda concreta, antes del cierre.'; },
        vista: 'tabla' },
      { q: '¿Qué solicitudes siguen sin llamada agendada?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.sinLlamada; }, orden: 'valor', suma: true,
        intro: function (l, T, M) { return l.length + ' solicitudes llevan horas o días sin una llamada de admisión agendada, por ' + M.euros(l.reduce(function (a, c) { return a + c.valor; }, 0)) + ' en plazas. Se les proponen dos huecos concretos y, si hace falta, la mentora abre más antes del cierre.'; },
        vista: 'tabla' },
      { q: '¿Quién reservó la llamada y no vino?', h: 'lista', obj: ['seguimiento', 'conversion', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.noshow; }, orden: 'prob',
        intro: function (l) { return l.length + ' personas reservaron la llamada de admisión y no se presentaron. Siguen teniendo interés: un mensaje con dos huecos nuevos, sin llamarlas en frío.'; },
        vista: 'tabla' },
      { q: '¿A quién que compró el Pitch noticiable no se le ha ofrecido el programa?', h: 'lista', obj: ['expansion', 'ventas', 'todo'],
        filtro: function (c) { return c.fin === 'ganado' && !!c.s.exp; }, orden: 'prob',
        intro: function (l) { return l.length + ' compradoras del Pitch noticiable no han recibido ninguna propuesta del programa. Ya han pagado algo y han trabajado con el material: es el contacto más cercano al programa.'; },
        vista: 'tabla' },
      { q: '¿Quién ha dicho «no ahora» y cuándo le escribo?', h: 'lista', obj: ['retencion', 'seguimiento', 'todo'],
        filtro: function (c) { return !c.fin && !!c.s.luego; }, orden: 'prob',
        intro: function (l) { return l.length + ' contactos han dicho que ahora no. No es un no: pasan a la lista de «no ahora» y reciben un mensaje el día después del cierre, con lo que contaron y la fecha de la próxima edición.'; },
        vista: 'tabla' },
      { q: '¿Qué debería hacer hoy la mentora?', h: 'equipo', obj: ['todo', 'ventas'] },
      { q: '¿Qué origen está trayendo plazas?', h: 'campanas', obj: ['captacion', 'todo'] }
    ],

    historias: {
      audioclase: {
        titulo: 'De la audioclase a la llamada',
        contacto: { id: 'demo', n: 'Lucía Armengol', rol: 'Fundadora · cosmética para el cabello', seg: 'marca', ciudad: '—', prod: 'Programa Voz en Portada · 3 meses', orig: 'c2', canal: 'wa', etapa: 1, valor: 1950, creado: 0, act: 0, f: {}, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'A media mañana, Lucía se apunta a la audioclase gratuita desde un reel', feed: 'Nueva inscrita · audioclase gratuita · desde Instagram', cambio: {} },
          { dur: 6, min: 1, txt: 'El sistema completa la ficha con lo que dejó en el formulario', feed: 'Ficha completada · marca de cosmética para el cabello · quiere salir en revistas', cambio: { ciudad: 'Málaga', f: { marca: true, sector: true, prensa: 'el lanzamiento de su segunda línea' } } },
          { dur: 6, min: 1, txt: 'El agente de WhatsApp le escribe en el minuto uno, dentro del horario', feed: 'WhatsApp enviado en 48 segundos', cambio: { conv: ['a', 'wa', 'Hola Lucía, soy Vera, la asistente de Noemí. Ya tienes la audioclase en tu correo. Cuéntame, ¿qué marca llevas y qué te gustaría contar a la prensa?'] }, toque: true },
          { dur: 7, min: 6, txt: 'Lucía contesta y se apunta al reto de tres días', feed: 'Respuesta recibida · se apunta al reto previo', cambio: { etapa: 2, f: { reto: true }, conv: ['c', 'wa', 'Hola! Tengo una marca de cosmética para el cabello y saco una segunda línea en noviembre. Me apunto al reto.'] }, act: true },
          { dur: 6, min: 3, txt: 'Completa los tres días del reto y vuelve a mirar la página del programa', feed: 'Reto completado · visita la página del programa (3 veces)', cambio: { etapa: 3, s: { reto: true, visitas: 3, incluye: true } }, act: true },
          { dur: 7, min: 1, txt: 'Asiste al directo y pregunta si el programa vale para una marca pequeña', feed: 'Asiste al directo · pregunta en el chat', cambio: { s: { directo: true }, conv: ['c', 'wa', 'Estuve en el directo. ¿El programa sirve si mi marca es pequeña y estoy yo sola?'] }, act: true },
          { dur: 7, min: 2, txt: 'El agente responde con la duda y le envía la solicitud, con el carrito abierto', feed: 'Mensaje tras el directo · enlace a la solicitud', cambio: { conv: ['a', 'wa', 'Sí, la mayoría de las alumnas son marcas de una o dos personas. Si quieres, rellena la solicitud (son cinco preguntas) y Noemí te cuenta en una llamada de admisión si el programa encaja contigo. El carrito está abierto hasta el cierre.'] }, toque: true },
          { dur: 6, min: 8, txt: 'Lucía envía la solicitud y elige hueco para la llamada de admisión', feed: 'Solicitud enviada · llamada de admisión reservada', cambio: { etapa: 5, s: { solicitud: true, plazos: true, cita: hc.min, citaOk: true }, conv: ['c', 'wa', 'Hecho, ya envié la solicitud. ¿Puedo pagarlo en cuotas?'] }, act: true },
          { dur: 7, min: 1, txt: 'El agente confirma la llamada y le explica el pago fraccionado', feed: 'Llamada confirmada para el ' + hc.txt + ' a las 17:00', cambio: { conv: ['a', 'wa', 'Sí, se puede pagar en tres cuotas y Noemí te lo explica en la llamada. Te dejo la llamada de admisión el ' + hc.txt + ' a las 17:00. El día antes te mando un recordatorio.'] }, toque: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: Lucía tiene la llamada de admisión reservada', feed: 'Aviso enviado a la mentora', humano: { titulo: 'Lucía tiene la llamada de admisión el ' + hc.txt + ' a las 17:00', texto: 'Fundadora de una marca de cosmética para el cabello (segunda línea en noviembre). Hizo el reto, vio el directo y preguntó si el programa vale para una marca pequeña. Envió la solicitud y preguntó por pagar en cuotas. Todo está resumido para la llamada: la hace la mentora.' } }
        ]
      },
      pitch: {
        titulo: 'Del pitch al programa',
        contacto: { id: 'demo', n: 'Berta Salgueiro', rol: 'Compró el Pitch noticiable · marca de velas', seg: 'marca', ciudad: '—', prod: 'Pitch noticiable', orig: 'c6', canal: 'wa', etapa: 1, valor: 1950, creado: 0, act: 0, f: { pitch: true }, s: {}, conv: [] },
        pasos: [
          { dur: 5, min: 0, txt: 'Berta compra el Pitch noticiable, el producto de entrada', feed: 'Compra · Pitch noticiable', cambio: { s: { pitch: true } } },
          { dur: 6, min: 1, txt: 'El sistema completa la ficha: marca de velas aromáticas con tienda online', feed: 'Ficha completada · velas aromáticas · tienda online', cambio: { ciudad: 'Zaragoza', f: { marca: true, sector: true, factura: true, prensa: 'una edición limitada de otoño' } } },
          { dur: 6, min: 1, txt: 'El agente le da la bienvenida y le pide su primer pitch', feed: 'WhatsApp enviado · bienvenida al pitch', cambio: { etapa: 2, conv: ['a', 'wa', 'Hola Berta, soy Vera, la asistente de Noemí. Ya tienes el Pitch noticiable en tu correo. Cuando tengas tu primer borrador, envíamelo y se lo paso a Noemí.'] }, toque: true },
          { dur: 7, min: 20, txt: 'Berta envía su borrador y pregunta si se puede ir más allá', feed: 'Respuesta recibida · borrador del pitch', cambio: { s: { visitas: 2 }, conv: ['c', 'wa', 'Aquí va mi primer pitch para la edición de otoño. ¿Hay algo para seguir trabajando esto con más calma?'] }, act: true },
          { dur: 7, min: 2, txt: 'El sistema detecta que está lista para el programa y se lo ofrece, sin presión', feed: 'Señal · lista para el programa · oferta enviada', cambio: { etapa: 3, s: { exp: true, incluye: true, expTxt: 'Compró el Pitch noticiable y pregunta cómo seguir' }, conv: ['a', 'wa', 'Sí: el programa de tres meses es justo el siguiente paso. Si quieres, rellena la solicitud y Noemí te cuenta en una llamada de admisión si encaja con tu marca. El carrito sigue abierto unos días.'] }, toque: true },
          { dur: 6, min: 6, txt: 'Berta envía la solicitud y reserva la llamada', feed: 'Solicitud enviada · llamada de admisión reservada', cambio: { etapa: 5, s: { solicitud: true, plazos: true, cita: hc.min, citaOk: true }, conv: ['c', 'wa', 'Ya la envié. ¿Se puede pagar a plazos?'] }, act: true },
          { dur: 0, min: 1, txt: 'Aviso a una persona: la compradora del pitch tiene la llamada de admisión', feed: 'Aviso enviado a la mentora', humano: { titulo: 'Berta tiene la llamada de admisión el ' + hc.txt + ' a las 17:00', texto: 'Compró el Pitch noticiable, envió su borrador y preguntó cómo seguir. Marca de velas aromáticas con tienda online; prepara una edición limitada de otoño. Preguntó por pagar a plazos. Llamada reservada: la hace la mentora.' } }
        ]
      }
    },
    historiaDefecto: 'audioclase',
    historiaGenerica: false,

    contactos: [
      // --- Piden el precio y nadie les ha contestado
      { id: 'l01', n: 'Carmen Beltrán', rol: 'Fundadora · cosmética natural', emp: 'Raíz de Luna', seg: 'marca', ciudad: 'Valencia', prod: 'Programa Voz en Portada · 3 meses', orig: 'c1', canal: 'wa', etapa: 3, valor: 1950, creado: 6 * D, act: 3 * H, toque: D + 5 * H,
        f: { marca: true, sector: true, factura: true, prensa: 'la salida de su línea para el cabello', plazoOk: true }, s: { precio: true, plazos: true, directo: true, visitas: 3 },
        conv: [[6 * D - 1, 'a', 'wa', 'Hola Carmen, soy Vera, la asistente de Noemí. Vi que te apuntaste a la audioclase. ¿Qué marca llevas?'], [6 * D - 45, 'c', 'wa', 'Hola! Tengo una marca de cosmética natural, Raíz de Luna. Quiero salir en revistas pero no sé por dónde empezar.'], [D + 5 * H, 'a', 'wa', 'Qué bien. Esta noche es el directo «Tu historia en cinco líneas»: ahí Noemí explica cómo se prepara una historia que le interese a una periodista. Te dejo el enlace.'], [3 * H, 'c', 'wa', 'Vi el directo y me encantó. ¿Cuánto cuesta el programa? ¿Se puede pagar en cuotas?']],
        ev: [[2 * H, 'web', 'Vuelve a la página del programa']] },
      { id: 'l02', n: 'Paula Esquivel', rol: 'Esteticista · cabina propia', emp: 'Estudio Alba', seg: 'marca', ciudad: 'Madrid', prod: 'Programa Voz en Portada · 3 meses', orig: 'c2', canal: 'wa', etapa: 2, valor: 1950, creado: 9 * D, act: 20 * H, toque: 3 * D,
        f: { marca: true, sector: true, factura: true, prensa: 'abrir un segundo local' }, s: { precio: true, visitas: 2 },
        conv: [[9 * D, 'a', 'wa', 'Hola Paula, soy Vera, la asistente de Noemí. ¿Qué tratamientos ofreces en tu cabina?'], [9 * D - 90, 'c', 'wa', 'Faciales y cuidado de la piel. Estoy abriendo un segundo local.'], [3 * D, 'a', 'wa', 'Esta semana hay directo y reto previo. Si no puedes en directo, te mando la repetición.'], [20 * H, 'c', 'wa', 'No pude ir al directo. ¿Cuánto cuesta el programa? No lo veo claro en la página.']] },
      // --- Asistieron al directo y no han pedido plaza
      { id: 'l03', n: 'Silvia Montoya', rol: 'Fundadora · ropa de yoga', emp: 'Aire y Trama', seg: 'marca', ciudad: 'Sevilla', prod: 'Programa Voz en Portada · 3 meses', orig: 'c3', canal: 'wa', etapa: 3, valor: 1950, creado: 12 * D, act: 20 * H, toque: 25 * H,
        f: { marca: true, sector: true, prensa: 'dar a conocer su marca fuera de Andalucía' }, s: { directo: true, incluye: true, visitas: 2 },
        conv: [[12 * D, 'a', 'wa', 'Hola Silvia, soy Vera, la asistente de Noemí. ¿Qué marca llevas?'], [12 * D - 60, 'c', 'wa', 'Ropa de yoga hecha en Sevilla, Aire y Trama.'], [25 * H, 'a', 'wa', 'Gracias por venir al directo. Escribiste que no sabes cómo contar tu marca sin sonar a anuncio: justo de eso va el programa. Si quieres, te cuento cómo es.']] },
      { id: 'l04', n: 'Beatriz Hontanar', rol: 'Asesora de nutrición · marca personal', seg: 'marca', ciudad: 'Bilbao', prod: 'Programa Voz en Portada · 3 meses', orig: 'c2', canal: 'wa', etapa: 3, valor: 1950, creado: 15 * D, act: 6 * H, toque: 30 * H,
        f: { marca: true, sector: true, factura: true, prensa: 'publicar su libro de recetas', plazoOk: true }, s: { directo: true, reto: true, visitas: 4 },
        conv: [[15 * D, 'a', 'wa', 'Hola Beatriz, soy Vera, la asistente de Noemí. Veo que vienes de Instagram. ¿Qué haces tú?'], [15 * D - 30, 'c', 'wa', 'Asesoro en nutrición y estoy sacando un libro de recetas.'], [30 * H, 'a', 'wa', 'Mañana empieza el último día del reto. ¿Te animas?']],
        ev: [[6 * H, 'web', 'Visita la página del programa (4 veces en 7 días)']] },
      { id: 'l05', n: 'Yolanda Cerro', rol: 'Fundadora · aceites esenciales', emp: 'Brisa Verde', seg: 'marca', ciudad: 'Alicante', prod: 'Programa Voz en Portada · 3 meses', orig: 'c1', canal: 'wa', etapa: 3, valor: 1950, creado: 5 * D, act: 5 * H, toque: 2 * D,
        f: { marca: true, sector: true, prensa: 'salir en una revista de bienestar' }, s: { directo: true, visitas: 3 },
        conv: [[5 * D, 'a', 'wa', 'Hola Yolanda, soy Vera, la asistente de Noemí. ¿Qué te gustaría contar de Brisa Verde?'], [5 * D - 20, 'c', 'wa', 'Que hacemos aceites esenciales en pequeñas tandas. Me gustaría salir en alguna revista.']] },
      // --- Solicitud enviada y sin llamada agendada
      { id: 'l06', n: 'Lorena Quirós', rol: 'Dueña de un salón de belleza', emp: 'Casa Quirós', seg: 'marca', ciudad: 'Zaragoza', prod: 'Programa Voz en Portada · 3 meses', orig: 'c1', canal: 'wa', etapa: 4, valor: 1950, creado: 11 * D, act: 26 * H, toque: 26 * H,
        f: { marca: true, sector: true, factura: true, prensa: 'presentar su línea de tratamientos', plazoOk: true }, s: { solicitud: true, sinLlamada: true, solMin: 26 * H, visitas: 2 },
        conv: [[11 * D, 'a', 'wa', 'Hola Lorena, soy Vera, la asistente de Noemí. ¿Qué servicios tienes en el salón?'], [11 * D - 40, 'c', 'wa', 'Peluquería y tratamientos faciales. Quiero crear mi propia línea.'], [26 * H, 'a', 'wa', 'He recibido tu solicitud, gracias. ¿Qué día te va bien para la llamada de admisión?']],
        ev: [[26 * H, 'sistema', 'Envía la solicitud del programa']] },
      { id: 'l07', n: 'Marta Olivares', rol: 'Fundadora · cuidado de la piel', emp: 'Glow Taller', seg: 'marca', ciudad: 'Barcelona', prod: 'Programa Voz en Portada · 3 meses', orig: 'c4', canal: 'wa', etapa: 4, valor: 1950, creado: 8 * D, act: 2 * D, toque: 2 * D,
        f: { marca: true, sector: true, factura: true, referida: true, prensa: 'la salida de su segundo producto' }, s: { solicitud: true, sinLlamada: true, solMin: 2 * D, plazos: true },
        conv: [[8 * D, 'a', 'wa', 'Hola Marta, soy Vera, la asistente de Noemí. Me dice una alumna que os conocéis. ¿Qué te cuenta de la audioclase?'], [8 * D - 30, 'c', 'wa', 'Sí, me habló del programa. Mándame lo que tengas.'], [2 * D, 'a', 'wa', 'Recibida tu solicitud. Te propongo dos huecos para la llamada de admisión, dime cuál te encaja.']] },
      // --- Reservaron la llamada y no vinieron
      { id: 'l08', n: 'Irene Zabala', rol: 'Terapeuta · aromaterapia', seg: 'marca', ciudad: 'Granada', prod: 'Programa Voz en Portada · 3 meses', orig: 'c1', canal: 'wa', etapa: 5, valor: 1950, creado: 10 * D, act: 5 * H, toque: 4 * H,
        f: { marca: true, sector: true, prensa: 'dar a conocer su método', plazoOk: true }, s: { solicitud: true, noshow: true, plazos: true },
        conv: [[10 * D, 'a', 'wa', 'Hola Irene, soy Vera, la asistente de Noemí. ¿Qué haces con la aromaterapia?'], [10 * D - 50, 'c', 'wa', 'Hago sesiones y tengo una pequeña línea de aceites. Quiero que me conozca más gente.'], [3 * D, 'a', 'wa', 'Te dejo reservada la llamada de admisión para esta mañana.'], [4 * H, 'a', 'wa', 'Irene, hoy no has podido conectarte. ¿Te propongo otro hueco?']],
        ev: [[5 * H, 'sistema', 'No se presenta a la llamada de admisión']] },
      { id: 'l09', n: 'Cristina Pastor', rol: 'Diseñadora de joyería', emp: 'Orfebre Norte', seg: 'marca', ciudad: 'Santander', prod: 'Programa Voz en Portada · 3 meses', orig: 'c5', canal: 'wa', etapa: 5, valor: 1950, creado: 14 * D, act: 30 * H, toque: 28 * H,
        f: { marca: true, sector: true, factura: true, prensa: 'su colección de otoño', plazoOk: true }, s: { solicitud: true, noshow: true, plazos: true },
        conv: [[14 * D, 'a', 'wa', 'Hola Cristina, soy Vera, la asistente de Noemí. Hace tiempo que estás en nuestra lista. ¿Sigue en pie lo de dar a conocer tu joyería?'], [14 * D - 70, 'c', 'wa', 'Sí, ahora sí que me interesa.'], [28 * H, 'a', 'wa', 'Cristina, ayer no te conectaste a la llamada. ¿Quieres que te dé otro hueco?']],
        ev: [[30 * H, 'sistema', 'No se presenta a la llamada de admisión']] },
      // --- Compraron el Pitch noticiable y no se les ha ofrecido el programa
      { id: 'l10', n: 'Natalia Ferrer', rol: 'Compró el Pitch noticiable · velas aromáticas', emp: 'Cera y Hogar', seg: 'marca', ciudad: 'Valencia', prod: 'Pitch noticiable', orig: 'c6', canal: 'wa', etapa: 2, valor: 1950, creado: 6 * D, act: 2 * D, toque: 5 * D, fin: 'ganado',
        f: { marca: true, sector: true, factura: true, pitch: true, prensa: 'una edición limitada de Navidad' }, s: { exp: true, expTxt: 'Compró el Pitch noticiable hace 6 días y nadie le ha hablado del programa', pitch: true, visitas: 2 },
        conv: [[6 * D, 'a', 'wa', 'Hola Natalia, soy Vera, la asistente de Noemí. Ya tienes el Pitch noticiable en tu correo. ¿Quieres que le echemos un ojo a tu primer borrador?'], [2 * D, 'c', 'wa', 'Gracias, lo estoy mirando. Muy práctico.']] },
      { id: 'l11', n: 'Gloria Santana', rol: 'Compró el Pitch noticiable · té e infusiones', seg: 'marca', ciudad: 'Las Palmas', prod: 'Pitch noticiable', orig: 'c6', canal: 'wa', etapa: 2, valor: 1950, creado: 4 * D, act: 4 * H, toque: 4 * D, fin: 'ganado',
        f: { marca: true, sector: true, pitch: true, prensa: 'el aniversario de su marca' }, s: { exp: true, expTxt: 'Compró el Pitch noticiable hace 4 días, escribió ayer y no se le ha ofrecido el programa', pitch: true, incluye: true },
        conv: [[4 * D, 'a', 'wa', 'Hola Gloria, soy Vera, la asistente de Noemí. Ya tienes el Pitch noticiable en tu correo.'], [4 * H, 'c', 'wa', 'Ya lo leí entero. ¿Noemí da algo más para trabajar el pitch con ella?']] },
      // --- Dijo que decide después del lanzamiento
      { id: 'l12', n: 'Leire Murguía', rol: 'Cofundadora · infusiones', emp: 'Hebras del Norte', seg: 'marca', ciudad: 'San Sebastián', prod: 'Programa Voz en Portada · 3 meses', orig: 'c1', canal: 'wa', etapa: 3, valor: 1950, creado: 8 * D, act: 4 * H, toque: 25 * H,
        f: { marca: true, sector: true, factura: true, prensa: 'el nuevo envase', plazoOk: true }, s: { directo: true, plazos: true, luego: 'tras el cierre', luegoTxt: 'decide cuando cierre su propio lanzamiento de noviembre', incluye: true, visitas: 2 },
        conv: [[8 * D, 'a', 'wa', 'Hola Leire, soy Vera, la asistente de Noemí. ¿Cómo se llama vuestra marca?'], [8 * D - 40, 'c', 'wa', 'Hebras del Norte. Somos dos socias.'], [25 * H, 'a', 'wa', 'Gracias por conectarte al directo. ¿Te quedó alguna duda del programa?'], [4 * H, 'c', 'wa', 'Me encanta, y poder pagarlo en cuotas me ayuda, pero hasta que no cierre nuestro lanzamiento de noviembre no puedo decidir. Os digo algo después.']] },
      // --- Plan de pago enviado tras la llamada y sin respuesta
      { id: 'l13', n: 'Teresa Garrido', rol: 'Fundadora · perfumería de nicho', emp: 'Aroma Mínimo', seg: 'marca', ciudad: 'Madrid', prod: 'Programa Voz en Portada · 3 meses', orig: 'c2', canal: 'wa', etapa: 5, valor: 1950, creado: 18 * D, act: 5 * H, toque: 3 * D,
        f: { marca: true, sector: true, factura: true, prensa: 'dar visibilidad a su perfume más vendido', plazoOk: true }, s: { solicitud: true, plazos: true, prop: 3 * D, propVista: 3, incluye: true },
        conv: [[18 * D, 'a', 'wa', 'Hola Teresa, soy Vera, la asistente de Noemí. ¿Qué marca llevas?'], [18 * D - 30, 'c', 'wa', 'Aroma Mínimo, perfumería de nicho.'], [3 * D, 'h', 'wa', 'Teresa, gracias por la llamada de hoy. Te envío el plan de pago en tres cuotas. Cualquier duda, me dices.']],
        ev: [[5 * H, 'web', 'Abre el plan de pago por tercera vez']] },
      // --- Llamada de admisión agendada
      { id: 'l14', n: 'Eva Cantero', rol: 'Entrenadora personal · marca propia', seg: 'marca', ciudad: 'Murcia', prod: 'Programa Voz en Portada · 3 meses', orig: 'c2', canal: 'wa', etapa: 5, valor: 1950, creado: 7 * D, act: 6 * H, toque: 6 * H,
        f: { marca: true, sector: true, prensa: 'lanzar su método online', plazoOk: true }, s: { solicitud: true, cita: 20 * H, citaOk: true, plazos: true },
        conv: [[7 * D, 'a', 'wa', 'Hola Eva, soy Vera, la asistente de Noemí. ¿Qué método tienes?'], [7 * D - 50, 'c', 'wa', 'Entrenamiento de fuerza para mujeres, quiero lanzarlo online.'], [6 * H, 'a', 'wa', 'Tienes reservada la llamada de admisión para mañana. Te mando el recordatorio la víspera.']] },
      { id: 'l15', n: 'Rocío Valdés', rol: 'Fundadora · maquillaje vegano', emp: 'Pigmento Libre', seg: 'marca', ciudad: 'Cádiz', prod: 'Programa Voz en Portada · 3 meses', orig: 'c4', canal: 'wa', etapa: 5, valor: 1950, creado: 9 * D, act: 5 * H, toque: 5 * H,
        f: { marca: true, sector: true, factura: true, referida: true, prensa: 'la campaña de su nueva paleta' }, s: { solicitud: true, cita: hc.min, citaOk: true },
        conv: [[9 * D, 'a', 'wa', 'Hola Rocío, soy Vera, la asistente de Noemí. Me dice una alumna que te lo recomendó. ¿Qué marca llevas?'], [9 * D - 40, 'c', 'wa', 'Pigmento Libre, maquillaje vegano. Cuéntame cómo funciona.'], [5 * H, 'a', 'wa', 'Confirmada la llamada de admisión para el ' + hc.txt + ' a las 17:00.']] },
      // --- Plazas ya cerradas
      { id: 'l16', n: 'Nuria Calderón', rol: 'Pagó la primera cuota hace 2 días', emp: 'Salvia y Miel', seg: 'marca', ciudad: 'Valencia', prod: 'Programa Voz en Portada · 3 meses', orig: 'c1', canal: 'wa', etapa: 6, valor: 1950, creado: 20 * D, act: 2 * D, toque: 2 * D, fin: 'ganado',
        f: { marca: true, sector: true, factura: true }, s: {}, conv: [] },
      { id: 'l17', n: 'Alicia Portela', rol: 'Pagó la primera cuota ayer', seg: 'marca', ciudad: 'Vigo', prod: 'Programa Voz en Portada · 3 meses', orig: 'c2', canal: 'wa', etapa: 6, valor: 1950, creado: 16 * D, act: 20 * H, toque: 20 * H, fin: 'ganado',
        f: { marca: true, sector: true, reto: true }, s: {}, conv: [] },
      { id: 'l18', n: 'Sonia Arrieta', rol: 'Plaza reservada · recomendada', seg: 'marca', ciudad: 'Pamplona', prod: 'Programa Voz en Portada · 3 meses', orig: 'c4', canal: 'wa', etapa: 6, valor: 1950, creado: 12 * D, act: 4 * D, toque: 4 * D, fin: 'ganado',
        f: { marca: true, sector: true, referida: true }, s: {}, conv: [] },
      { id: 'l19', n: 'Claudia Meneses', rol: 'Compró el pitch y luego el programa', seg: 'marca', ciudad: 'Málaga', prod: 'Programa Voz en Portada · 3 meses', orig: 'c6', canal: 'wa', etapa: 6, valor: 1950, creado: 22 * D, act: D, toque: D, fin: 'ganado',
        f: { marca: true, sector: true, pitch: true }, s: {}, conv: [] },
      // --- Acaban de apuntarse a la audioclase
      { id: 'l20', n: 'Judith Lasa', rol: 'Acaba de apuntarse a la audioclase', seg: 'marca', ciudad: 'Tarragona', prod: 'Audioclase gratuita', orig: 'c1', canal: 'wa', etapa: 1, valor: 1950, creado: 12, act: 12, toque: null,
        f: { marca: true, sector: true }, s: { visitas: 1 }, conv: [] },
      { id: 'l21', n: 'Pilar Gamero', rol: 'Se apuntó desde un reel', seg: 'marca', ciudad: 'Córdoba', prod: 'Audioclase gratuita', orig: 'c2', canal: 'wa', etapa: 1, valor: 1950, creado: 2 * H, act: 2 * H, toque: 100,
        f: { marca: true, sector: true }, s: {}, conv: [[100, 'a', 'wa', 'Hola Pilar, soy Vera, la asistente de Noemí. Ya tienes la audioclase en tu correo. ¿Qué marca llevas?']] },
      { id: 'l22', n: 'Estela Roig', rol: 'Escribió desde la web', seg: 'marca', ciudad: 'Castellón', prod: 'Audioclase gratuita', orig: 'c3', canal: 'wa', etapa: 1, valor: 1950, creado: 30 * H, act: 30 * H, toque: 30 * H - 2,
        f: { sector: true }, s: { intentos: 1 }, conv: [[30 * H - 2, 'a', 'wa', 'Hola Estela, soy Vera, la asistente de Noemí. ¿Qué marca llevas o qué te gustaría contar en prensa?']] },
      { id: 'l23', n: 'Mireia Serra', rol: 'Se apuntó con el anuncio', seg: 'marca', ciudad: 'Girona', prod: 'Audioclase gratuita', orig: 'c1', canal: 'wa', etapa: 1, valor: 1950, creado: 2 * D, act: 2 * D, toque: 2 * D - 2,
        f: { marca: true }, s: { intentos: 2 }, conv: [[2 * D - 2, 'a', 'wa', 'Hola Mireia, soy Vera, la asistente de Noemí. Ya tienes la audioclase en tu correo. ¿La has podido escuchar?']] },
      { id: 'l24', n: 'Ángela Cuesta', rol: 'No abre los correos', seg: 'marca', ciudad: 'Toledo', prod: 'Audioclase gratuita', orig: 'c1', canal: 'email', etapa: 1, valor: 1950, creado: 6 * D, act: 6 * D, toque: 4 * D,
        f: { marca: true, sector: true }, s: { intentos: 3, emails: 0 }, conv: [[6 * D, 'a', 'email', 'Hola Ángela, ya tienes la audioclase. Cuando la escuches, cuéntame qué marca llevas.'], [4 * D, 'a', 'email', 'Ángela, te recuerdo que el directo es esta semana.']] },
      // --- Calentamiento y reto previo
      { id: 'l25', n: 'Marisa Ledesma', rol: 'Abre todos los correos', seg: 'marca', ciudad: 'Burgos', prod: 'Programa Voz en Portada · 3 meses', orig: 'c3', canal: 'email', etapa: 2, valor: 1950, creado: 5 * D, act: 5 * H, toque: 2 * D,
        f: { marca: true, sector: true, prensa: 'dar a conocer su taller de jabones' }, s: { emails: 6, visitas: 2, incluye: true },
        conv: [[5 * D, 'a', 'email', 'Hola Marisa, ya tienes la audioclase. ¿Qué marca llevas?'], [4 * D, 'c', 'email', 'Hago jabones artesanos y los vendo en mercadillos. Me gustaría crecer.'], [2 * D, 'a', 'email', 'Te dejo el enlace al reto de tres días de esta semana.']] },
      { id: 'l26', n: 'Verónica Castaño', rol: 'Reto previo · día 2 de 3', seg: 'marca', ciudad: 'Valladolid', prod: 'Programa Voz en Portada · 3 meses', orig: 'c2', canal: 'wa', etapa: 2, valor: 1950, creado: 4 * D, act: 90, toque: 4 * H,
        f: { marca: true, sector: true, reto: true, prensa: 'lanzar una línea de ropa deportiva' }, s: { reto: true, visitas: 1 },
        conv: [[4 * D, 'a', 'wa', 'Hola Verónica, soy Vera, la asistente de Noemí. ¿Te apuntas al reto de tres días?'], [4 * D - 20, 'c', 'wa', 'Sí, me apunto.'], [4 * H, 'a', 'wa', 'Hoy toca el día dos: tu historia en cinco líneas. ¿Cómo lo llevas?'], [90, 'c', 'wa', 'Lo estoy haciendo ahora, me está costando resumirlo.']] },
      { id: 'l27', n: 'Daniela Peña', rol: 'Reto previo · completado', seg: 'marca', ciudad: 'Oviedo', prod: 'Programa Voz en Portada · 3 meses', orig: 'c1', canal: 'wa', etapa: 3, valor: 1950, creado: 6 * D, act: 8 * H, toque: 8 * H,
        f: { marca: true, sector: true, reto: true }, s: { reto: true, visitas: 1 },
        conv: [[6 * D, 'a', 'wa', 'Hola Daniela, soy Vera, la asistente de Noemí. ¿Qué marca llevas?'], [6 * D - 25, 'c', 'wa', 'Una tienda de cosmética coreana online.'], [8 * H, 'a', 'wa', 'Has completado el reto, ¡enhorabuena! Esta noche es el directo.']] },
      { id: 'l28', n: 'Inma Salvatierra', rol: 'Recomendada por una alumna', seg: 'marca', ciudad: 'Logroño', prod: 'Programa Voz en Portada · 3 meses', orig: 'c4', canal: 'wa', etapa: 2, valor: 1950, creado: 2 * D, act: 8 * H, toque: 8 * H,
        f: { marca: true, sector: true, referida: true, prensa: 'abrir tienda física' }, s: { visitas: 2, incluye: true },
        conv: [[2 * D, 'a', 'wa', 'Hola Inma, soy Vera, la asistente de Noemí. Me dice una alumna que te interesa lo del programa.'], [2 * D - 60, 'c', 'wa', 'Sí, me habló muy bien. ¿Qué incluye exactamente?'], [8 * H, 'a', 'wa', 'Te cuento: tres meses con sesiones en directo, revisión de tus pitches y una llamada de admisión previa para ver si encaja. ¿Qué día te va bien para la llamada?']] },
      { id: 'l29', n: 'Berta Ortuño', rol: 'Escribió por mensaje directo', seg: 'marca', ciudad: 'Almería', prod: 'Audioclase gratuita', orig: 'c2', canal: 'wa', etapa: 2, valor: 1950, creado: 3 * D, act: 2 * D, toque: 2 * D,
        f: { marca: true, sector: true }, s: { visitas: 1 },
        conv: [[3 * D, 'a', 'wa', 'Hola Berta, soy Vera, la asistente de Noemí. ¿Escuchaste la audioclase?'], [2 * D, 'c', 'wa', 'Todavía no, esta semana la escucho.']] },
      // --- «No ahora»: pasan a la lista del post-lanzamiento
      { id: 'l30', n: 'Alba Cifuentes', rol: 'Dueña de una tienda de ropa', emp: 'La Costura Fina', seg: 'marca', ciudad: 'Salamanca', prod: 'Programa Voz en Portada · 3 meses', orig: 'c1', canal: 'wa', etapa: 2, valor: 1950, creado: 10 * D, act: 6 * D, toque: 6 * D,
        f: { marca: true, sector: true }, s: { luego: 'enero', luegoTxt: 'lo haría en enero, cuando pase la campaña de Navidad' },
        conv: [[10 * D, 'a', 'wa', 'Hola Alba, soy Vera, la asistente de Noemí. ¿Qué te gustaría contar de La Costura Fina?'], [6 * D, 'c', 'wa', 'Estoy en plena campaña de Navidad. Lo miro en enero, cuando pase.']] },
      { id: 'l31', n: 'Lidia Montalbán', rol: 'Estaba en la lista de lanzamientos anteriores', seg: 'marca', ciudad: 'Zamora', prod: 'Programa Voz en Portada · 3 meses', orig: 'c5', canal: 'wa', etapa: 3, valor: 1950, creado: 9 * D, act: 5 * D, toque: 5 * D,
        f: { marca: true, sector: true, factura: true }, s: { directo: true, luego: 'próxima edición', luegoTxt: 'esperará a la próxima edición por una mudanza' },
        conv: [[9 * D, 'a', 'wa', 'Hola Lidia, soy Vera, la asistente de Noemí. Hace tiempo que estás en la lista. ¿Sigue en pie lo de dar a conocer tu marca?'], [5 * D, 'c', 'wa', 'Sí, pero ahora tengo mudanza. Mejor en la próxima edición.']] },
      { id: 'l32', n: 'Fátima Bernal', rol: 'Fundadora · cosmética para pieles sensibles', seg: 'marca', ciudad: 'Jaén', prod: 'Programa Voz en Portada · 3 meses', orig: 'c3', canal: 'email', etapa: 2, valor: 1950, creado: 12 * D, act: 7 * D, toque: 7 * D,
        f: { marca: true, sector: true, prensa: 'dar a conocer su crema para pieles sensibles' }, s: { luego: 'enero', luegoTxt: 'lo retomaría después de Navidad' },
        conv: [[12 * D, 'a', 'email', 'Hola Fátima, ya tienes la audioclase.'], [7 * D, 'c', 'email', 'Gracias, me interesa pero hasta después de Navidad no puedo.']] },
      { id: 'l33', n: 'Gemma Ruano', rol: 'Fundadora · joyería minimalista', seg: 'marca', ciudad: 'León', prod: 'Programa Voz en Portada · 3 meses', orig: 'c5', canal: 'wa', etapa: 3, valor: 1950, creado: 11 * D, act: 4 * D, toque: 4 * D,
        f: { marca: true, sector: true }, s: { directo: true, ppto: 'no', luego: 'próxima edición', luegoTxt: 'no tiene presupuesto este mes y lo mirará en la próxima edición' },
        conv: [[11 * D, 'a', 'wa', 'Hola Gemma, soy Vera, la asistente de Noemí. ¿Qué tal el directo?'], [4 * D, 'c', 'wa', 'Muy bien, pero este mes no tengo presupuesto. En la próxima edición me lo planteo.']] },
      // --- Bajo encaje o fuera
      { id: 'l34', n: 'Rebeca Mora', rol: 'Estudiante de comunicación', seg: 'marca', ciudad: 'Valencia', prod: 'Audioclase gratuita', orig: 'c3', canal: 'wa', etapa: 1, valor: 1950, creado: 7 * D, act: 6 * D, toque: 6 * D,
        f: { sinMarca: true }, s: { visitas: 1 },
        conv: [[7 * D, 'a', 'wa', 'Hola Rebeca, soy Vera, la asistente de Noemí. ¿Qué marca llevas?'], [6 * D, 'c', 'wa', 'Todavía no tengo marca, estoy estudiando. Me interesaba aprender.']] },
      { id: 'l35', n: 'Sandra Peiró', rol: 'Solo busca contenido gratis', seg: 'marca', ciudad: 'Huelva', prod: 'Audioclase gratuita', orig: 'c1', canal: 'wa', etapa: 1, valor: 1950, creado: 9 * D, act: 9 * D, toque: 6 * D, fin: 'perdido',
        f: { gratis: true, sector: true }, s: { intentos: 3 }, conv: [] },
      { id: 'l36', n: 'Mario Cuevas', rol: 'Consultor financiero', seg: 'marca', ciudad: 'Madrid', prod: 'Audioclase gratuita', orig: 'c3', canal: 'email', etapa: 2, valor: 1950, creado: 8 * D, act: 7 * D, toque: 7 * D,
        f: { otroSector: true }, s: { ppto: 'no' },
        conv: [[8 * D, 'a', 'email', 'Hola Mario, ya tienes la audioclase. ¿Qué te gustaría contar en prensa?'], [7 * D, 'c', 'email', 'Soy asesor financiero, no tengo marca de bienestar. Era curiosidad.']] },
      // --- Compradoras del pitch con la oferta ya hecha
      { id: 'l37', n: 'Olga Soria', rol: 'Compró el pitch · llamada agendada', emp: 'Lúpulo y Luna', seg: 'marca', ciudad: 'Pontevedra', prod: 'Programa Voz en Portada · 3 meses', orig: 'c6', canal: 'wa', etapa: 5, valor: 1950, creado: 14 * D, act: 6 * H, toque: 6 * H,
        f: { marca: true, sector: true, factura: true, pitch: true, prensa: 'su línea de cosmética con cerveza' }, s: { pitch: true, solicitud: true, cita: hc.min, citaOk: true, plazos: true },
        conv: [[14 * D, 'a', 'wa', 'Hola Olga, soy Vera, la asistente de Noemí. Ya tienes el Pitch noticiable.'], [3 * D, 'a', 'wa', 'Viendo tu borrador, creo que el programa te puede interesar. ¿Te cuento cómo funciona?'], [3 * D - 30, 'c', 'wa', 'Sí, cuéntame.'], [6 * H, 'a', 'wa', 'Tienes reservada la llamada de admisión para el ' + hc.txt + '. Te mando un recordatorio la víspera.']] },
      { id: 'l38', n: 'Pepa Lorente', rol: 'Lista de un lanzamiento anterior', seg: 'marca', ciudad: 'Albacete', prod: 'Programa Voz en Portada · 3 meses', orig: 'c5', canal: 'email', etapa: 2, valor: 1950, creado: 3 * D, act: 3 * H, toque: 3 * D,
        f: { marca: true, sector: true }, s: { emails: 4, visitas: 2 },
        conv: [[3 * D, 'a', 'email', 'Hola Pepa, vuelve el lanzamiento del programa. Te dejo la audioclase por si quieres escucharla.']] },
      { id: 'l39', n: 'Julia Escudero', rol: 'Recomendada · solicitud enviada', emp: 'Tintes del Valle', seg: 'marca', ciudad: 'Murcia', prod: 'Programa Voz en Portada · 3 meses', orig: 'c4', canal: 'wa', etapa: 5, valor: 1950, creado: 6 * D, act: 5 * H, toque: 5 * H,
        f: { marca: true, sector: true, factura: true, referida: true, prensa: 'dar a conocer sus tintes vegetales' }, s: { solicitud: true, cita: 26 * H, citaOk: true },
        conv: [[6 * D, 'a', 'wa', 'Hola Julia, soy Vera, la asistente de Noemí. Me dice una alumna que os conocéis.'], [5 * H, 'a', 'wa', 'Tienes la llamada de admisión mañana. Te mando el recordatorio la víspera.']] },
      { id: 'l40', n: 'Candela Ríos', rol: 'Se apuntó al reto desde Instagram', seg: 'marca', ciudad: 'Cáceres', prod: 'Audioclase gratuita', orig: 'c2', canal: 'wa', etapa: 2, valor: 1950, creado: D, act: 3 * H, toque: 20 * H,
        f: { marca: true, sector: true, prensa: 'dar a conocer su marca de bolsos' }, s: { reto: true },
        conv: [[D, 'a', 'wa', 'Hola Candela, soy Vera, la asistente de Noemí. ¿Te apuntas al reto de tres días?'], [20 * H, 'c', 'wa', 'Sí, me apunto, gracias.'], [3 * H, 'a', 'wa', 'Ya tienes el primer día del reto en tu correo.']] }
    ]
  };
})();

// Textos de la cadencia de activación. La lógica vive en activacion.js; aquí
// solo hay copy, para poder cambiarlo sin tocar el reloj.
// Reglas del prompt maestro: una idea por mensaje, una sola pregunta, nada de
// vender por WhatsApp y nunca insistir después de un no.

const AGENDA = 'https://api.leadconnectorhq.com/widget/booking/zBlsw8BEKA2zah81YlOl';
const F = '-apple-system,Segoe UI,Roboto,sans-serif';

// El widget de GHL acepta los datos por la URL. Si ya los conocemos, mandarle
// el enlace pelado obliga a reescribir nombre, correo y telefono justo en el
// momento de mas intencion, que es donde mas caro sale perder a alguien.
//
// Solo se usa en los correos, donde el enlace viaja escondido en un boton. En
// WhatsApp el enlace se ve entero, y una URL larguisima con el correo del
// contacto dentro delata la maquina justo en un mensaje que pretende sonar a
// persona. Ahi va limpio: si le da pereza rellenar, siempre puede contestar
// «el jueves por la manana» y lo agendamos nosotros.
function agenda(datos) {
  const d = datos || {};
  const q = [];
  if (d.nombre) q.push('first_name=' + encodeURIComponent(d.nombre));
  if (d.email) q.push('email=' + encodeURIComponent(d.email));
  if (d.telefono) q.push('phone=' + encodeURIComponent(d.telefono));
  return q.length ? AGENDA + '?' + q.join('&') : AGENDA;
}

function nombreCorto(nombre) {
  const n = String(nombre || '').trim().split(/\s+/)[0];
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
}

// Una pregunta, elegida por lo que sabemos del lead. Nunca varias a la vez.
function pregunta(datos) {
  // Si él mismo ha dicho dónde cree que se le escapa, se pregunta por ahí.
  const f = String(datos.fuga || '').toLowerCase();
  if (/anuncios|captaci/.test(f)) return '¿sabes qué campaña te trajo tu último cliente? El último cliente, no el último lead.';
  if (/web|formular/.test(f)) return 'de los que entran en la web, ¿cuántos acaban dejándote los datos?';
  if (/respuesta/.test(f)) return 'cuando te entra un contacto nuevo, ¿cuánto se tarda de media en contestarle?';
  if (/seguimiento|presupuest/.test(f)) return '¿cuántos presupuestos del mes pasado siguen hoy sin respuesta?';

  const inv = String(datos.inversion || '').toLowerCase();
  if (/nada todav/.test(inv)) return 'cuando te entra un contacto nuevo, ¿cuánto se tarda de media en contestarle?';
  if (/más de 5|5\.000/.test(inv)) return '¿sabes qué campaña te trajo tu último cliente? El último cliente, no el último lead.';
  const sec = String(datos.sector || '').toLowerCase();
  if (/reforma|construc|instalac/.test(sec)) return '¿cuántos presupuestos del mes pasado siguen hoy sin respuesta?';
  if (/formaci|academia/.test(sec)) return 'de los que piden información, ¿cuántos acaban entrando en una llamada?';
  return '¿cuántos presupuestos u oportunidades tienes ahora mismo abiertos sin siguiente paso?';
}

// Primer WhatsApp, genérico (Maikel, 19-sep-2026): el mismo texto para todos,
// sin citar lo que escribió ni preguntar nada concreto. Es el texto de la
// plantilla qualivo_apertura aprobada por Meta, con el nombre de pila. Lo
// concreto lo pregunta el agente cuando contesta (api/_agente.js).
function whatsapp1(datos) {
  const n = nombreCorto(datos.nombre);
  return (n ? 'Hola ' + n + ', soy' : 'Hola, soy') + ' Maikel, de Qualivo. Acabas de pedir el diagnóstico de crecimiento y he leído lo que me has contado de tu empresa.\n\n' +
    'Antes de llamarte quiero preguntarte una cosa concreta sobre tu caso. ¿Te va bien que lo veamos por aquí un momento?';
}

// El primer WhatsApp de un lead que nunca nos ha escrito sale por una plantilla
// aprobada por Meta, que es fija y no admite personalización (18-sep-2026).
// En cuanto contesta se abre la ventana de 24 h y entonces sí va el mensaje de
// verdad: lo que escribió él, y la pregunta que abre la conversación.
// 19-sep-2026, Maikel: la versión que citaba su frase del formulario entre
// comillas y soltaba la pregunta calculada «queda muy robotizada». Ahora es un
// mensaje general, humano, que agradece, dice que se ha leído lo suyo y deja la
// puerta abierta sin interrogar. Lo concreto se pregunta en la llamada.
function whatsappTrasApertura(datos) {
  const n = nombreCorto(datos.nombre);
  return (n ? 'Gracias, ' + n + '. ' : 'Gracias. ') +
    'Lo he leído y me hago una idea de por dónde va. Te preparo la llamada con eso. ' +
    'Si te apetece contarme algo más por aquí, adelante; si no, lo vemos en los quince minutos.';
}

function whatsapp2(datos) {
  const n = nombreCorto(datos.nombre);
  return (n ? n + ', te' : 'Te') + ' he llamado hace un rato y no he podido localizarte.\n\n' +
    'Si te va mejor por aquí, dime y lo vemos por escrito. Y si prefieres coger hueco tú: ' + AGENDA;
}

function whatsapp3(datos) {
  const n = nombreCorto(datos.nombre);
  return (n ? n + ', última' : 'Última') + ' por mi parte, que no quiero ser pesado.\n\n' +
    'Si sigue interesándote ver dónde se te está escapando el negocio, el hueco de quince minutos está aquí: ' + AGENDA + '\n\n' +
    'Y si no es el momento, sin problema.';
}

function envoltura(cuerpo) {
  return '<div style="font-family:' + F + ';font-size:16px;line-height:1.6;color:#101319;max-width:560px">' +
    cuerpo +
    '<p style="font-size:13px;color:#7A7C82;line-height:1.5;margin-top:28px;border-top:1px solid #E6E6E6;padding-top:14px">' +
    'Maikel Echevarría · Qualivo · La Seu d\'Urgell<br>' +
    'Si no quieres que te escriba más, respóndeme «baja» y listo.</p></div>';
}

function boton(texto, datos) {
  return '<p style="margin:26px 0"><a href="' + agenda(datos) + '" style="display:inline-block;background:#101319;color:#fff;' +
    'text-decoration:none;font-weight:700;padding:14px 24px;border-radius:10px">' + texto + '</a></p>';
}

// Correo del minuto cero. No va en la cadencia del reloj: lo manda el
// formulario, a la vez que el primer WhatsApp.
//
// Existe porque hasta ahora lo unico que recibia un lead el dia que entraba
// era un WhatsApp. Si el numero estaba mal, si tenia bloqueado WhatsApp
// Business o si el mensaje caia fuera de la ventana de 24 h, se quedaba en
// silencio hasta el dia 2 sin ninguna confirmacion de que su peticion habia
// llegado. Es la unica via por la que un lead pagado se evapora sin rastro.
//
// No repite la pregunta del WhatsApp a proposito: dos preguntas a la vez por
// dos canales distintos es ruido, y ya hay una esperando respuesta.
function emailBienvenida(datos) {
  const n = nombreCorto(datos && datos.nombre);
  return {
    asunto: n ? n + ', recibido: tu diagnóstico de quince minutos' : 'Recibido: tu diagnóstico de quince minutos',
    html: envoltura(
      '<p>' + (n ? n + ', h' : 'H') + 'e recibido tu solicitud. Soy Maikel, de Qualivo.</p>' +
      // El WhatsApp no sale de madrugada. Prometer «en unos minutos» a alguien
      // que ha entrado a las 23:00 es quedar mal en el primer contacto.
      '<p>' + (datos && datos.waAhora === false
        ? 'Mañana por la mañana te escribo por WhatsApp con una pregunta'
        : 'Te escribo por WhatsApp en unos minutos con una pregunta') +
      ', para llegar a la llamada sabiendo algo de ti y no gastar los quince minutos en presentaciones.</p>' +
      '<p>Si prefieres ir al grano y coger hueco tú mismo, aquí lo tienes:</p>' +
      boton('Elegir mi hora', datos) +
      '<p style="color:#5A5E66">Son quince minutos. Repasamos los ocho puntos por donde se escapa el negocio entre el anuncio y el cierre, con tus números delante. ' +
      'Te mando el plan por escrito en 24 horas, lo hagas con nosotros o no.</p>')
  };
}

const EMAILS = [
  {
    etiqueta: 'act-email1',
    dias: 2,
    asunto: function (d) { return (nombreCorto(d.nombre) ? nombreCorto(d.nombre) + ', ' : '') + 'qué miramos en esos quince minutos'; },
    html: function (d) {
      const n = nombreCorto(d.nombre);
      return envoltura(
        '<p>' + (n ? n + ', p' : 'P') + 'ediste el diagnóstico y todavía no hemos hablado. Te cuento en un minuto qué es exactamente, para que decidas con la información delante.</p>' +
        '<p>Son quince minutos en los que repasamos los ocho puntos por donde se escapa el negocio entre el anuncio y el cierre:</p>' +
        '<p style="color:#3D4148">Anuncios · la web · formularios · el lead · tiempo de respuesta · seguimientos · presupuestos · el cierre.</p>' +
        '<p>La fuga casi nunca está en un solo sitio, y casi nunca está donde uno cree. De ahí sale un plan por escrito con qué arreglar primero. Es tuyo, lo hagas con nosotros o no.</p>' +
        boton('Coger mis quince minutos', d));
    }
  },
  {
    etiqueta: 'act-email2',
    dias: 6,
    asunto: function () { return 'Más negocio sin comprar más demanda'; },
    html: function (d) {
      const n = nombreCorto(d.nombre);
      return envoltura(
        '<p>' + (n ? 'Hola ' + n + '. Te' : 'Te') + ' dejo un caso, porque explica mejor que yo lo que hacemos.</p>' +
        '<p>Nuria Roure ya tenía tráfico y ya tenía leads. No cambiamos las campañas ni compramos más demanda: ordenamos lo que pasaba <em>después</em> de que el lead entrara. ' +
        'Resultado: <strong>6,45 veces lo invertido, sin captar un lead más</strong>.</p>' +
        '<p>En una academia de formación fue al revés: la fuga estaba antes, en cómo se medía y se captaba. Ahí salieron <strong>1.160 leads y 21 matrículas en cuatro meses</strong>, ' +
        'y las entrevistas de venta pasaron de 83 a 168 al mes.</p>' +
        '<p>Los dos empezaron igual: encontrando dónde se perdía el rendimiento antes de tocar nada.</p>' +
        boton('Ver dónde está la fuga en tu caso', d));
    }
  },
  {
    etiqueta: 'act-email3',
    dias: 9,
    asunto: function () { return 'Cierro esto por mi parte'; },
    html: function (d) {
      const n = nombreCorto(d.nombre);
      return envoltura(
        '<p>' + (n ? n + ', t' : 'T') + 'e escribí porque pediste el diagnóstico y no hemos llegado a hablar. Cierro el tema por mi parte, que no quiero ser de esos que insisten.</p>' +
        '<p>Si en algún momento te pica la duda de por dónde se te está yendo el dinero entre el anuncio y el cierre, el hueco sigue estando ahí y sigue siendo de quince minutos.</p>' +
        boton('Cogerlo cuando quieras', d) +
        '<p style="color:#5A5E66">Y si lo que pasa es que no es el momento, también me vale saberlo. Responde a este correo y lo dejo apuntado.</p>');
    }
  }
];

module.exports = { AGENDA, agenda, emailBienvenida, nombreCorto, pregunta, whatsapp1, whatsappTrasApertura, whatsapp2, whatsapp3, EMAILS };

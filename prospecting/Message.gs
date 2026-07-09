/**
 * Message.gs · genera el mensaje de contacto personalizado (email + LinkedIn)
 * a partir de la señal detectada (la oferta de empleo).
 */

/** Copy por categoría de señal: dolor detectado + propuesta de Qualivo. */
var COPY = {
  leadgen: {
    pain: 'generar leads de forma constante',
    propuesta: 'montamos un motor de captación (ads + landing + cualificación) que os llena la agenda de oportunidades, sin depender de una sola persona'
  },
  sales: {
    pain: 'hacer prospección y agendar más reuniones',
    propuesta: 'montamos la prospección outbound (email + LinkedIn) y os pasamos reuniones ya cualificadas directamente al calendario'
  },
  crm: {
    pain: 'poner orden en el CRM y que no se enfríe ningún lead',
    propuesta: 'implantamos y automatizamos vuestro CRM (GoHighLevel / HubSpot) con seguimiento automático de cada oportunidad'
  },
  automation: {
    pain: 'automatizar procesos que hoy os comen horas',
    propuesta: 'automatizamos vuestros flujos de captación, seguimiento y reporting con integraciones a medida'
  },
  marketing: {
    pain: 'que el marketing genere pipeline y no solo tráfico',
    propuesta: 'montamos el embudo completo (captación, nurturing y reporting) conectado a ventas'
  },
  general: {
    pain: 'captar y convertir más clientes',
    propuesta: 'montamos vuestro sistema de captación y automatización de principio a fin'
  }
};

/**
 * Construye el mensaje. `p` = {company, contactName, jobTitle, category}.
 * Devuelve {subject, body, linkedin}.
 */
function buildMessage(p) {
  var name = firstName(p.contactName) || 'hola';
  var greet = firstName(p.contactName) ? ('Hola ' + name + ',') : 'Hola,';
  var company = p.company || 'vuestra empresa';
  var offer = shortenOffer(p.jobTitle);
  var copy = COPY[p.category] || COPY.general;
  var cta = QUALIVO.calendarLink
    ? ('¿Te viene bien una llamada de 15 min esta semana? Aquí mi agenda: ' + QUALIVO.calendarLink)
    : '¿Te viene bien una llamada de 15 min esta semana para verlo?';
  var signoff = firmaQualivo();

  var subject = 'Vi que en ' + company + ' buscáis ' + offer;

  var body = [
    greet,
    '',
    'He visto que en ' + company + ' estáis buscando ' + (offer ? ('“' + offer + '”') : 'perfil para ' + copy.pain) +
      ' — normalmente eso significa que queréis ' + copy.pain + '.',
    '',
    'En ' + QUALIVO.name + ' hacemos justo eso como servicio: ' + copy.propuesta + '. ' +
      'Sin proceso de selección de meses ni contratar y formar: en pocas semanas tenéis el sistema funcionando.',
    '',
    cta,
    '',
    signoff
  ].join('\n');

  var linkedin = 'Hola ' + name + ', vi que en ' + company + ' buscáis ' + offer +
    '. En ' + QUALIVO.name + ' montamos eso como servicio (' + copy.pain +
    ') sin tener que contratar. ¿Te cuento en 15 min?';

  return { subject: subject, body: body, linkedin: linkedin };
}

/** Firma del remitente. */
function firmaQualivo() {
  var lines = ['Un saludo,'];
  lines.push(QUALIVO.senderName || QUALIVO.name);
  if (QUALIVO.senderName) lines.push(QUALIVO.name);
  if (QUALIVO.website) lines.push(QUALIVO.website);
  return lines.join('\n');
}

/** Acorta títulos largos de oferta para el asunto/cuerpo. */
function shortenOffer(title) {
  if (!title) return '';
  var t = String(title).split(/[|·\-–—(]/)[0].trim(); // corta en separadores
  if (t.length > 60) t = t.slice(0, 57).trim() + '…';
  return t;
}

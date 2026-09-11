// Textos de la cadencia de activación. La lógica vive en activacion.js; aquí
// solo hay copy, para poder cambiarlo sin tocar el reloj.
// Reglas del prompt maestro: una idea por mensaje, una sola pregunta, nada de
// vender por WhatsApp y nunca insistir después de un no.

const AGENDA = 'https://api.leadconnectorhq.com/widget/booking/zBlsw8BEKA2zah81YlOl';
const F = '-apple-system,Segoe UI,Roboto,sans-serif';

function nombreCorto(nombre) {
  const n = String(nombre || '').trim().split(/\s+/)[0];
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
}

// Una pregunta, elegida por lo que sabemos del lead. Nunca varias a la vez.
function pregunta(datos) {
  const inv = String(datos.inversion || '').toLowerCase();
  if (/nada todav/.test(inv)) return 'cuando te entra un contacto nuevo, ¿cuánto se tarda de media en contestarle?';
  if (/más de 5|5\.000/.test(inv)) return '¿sabes qué campaña te trajo tu último cliente? El último cliente, no el último lead.';
  const sec = String(datos.sector || '').toLowerCase();
  if (/reforma|construc|instalac/.test(sec)) return '¿cuántos presupuestos del mes pasado siguen hoy sin respuesta?';
  if (/formaci|academia/.test(sec)) return 'de los que piden información, ¿cuántos acaban entrando en una llamada?';
  return '¿cuántos presupuestos u oportunidades tienes ahora mismo abiertos sin siguiente paso?';
}

function whatsapp1(datos) {
  const n = nombreCorto(datos.nombre);
  const hola = n ? 'Hola ' + n + ', ' : 'Hola, ';
  if (datos.origen === 'leadform') {
    return hola + 'soy Maikel, de Qualivo. Has dejado tus datos en el anuncio del diagnóstico.\n\n' +
      'Antes de llamarte te pregunto una cosa: ' + pregunta(datos);
  }
  if (datos.hipotesis) {
    return hola + 'soy Maikel, de Qualivo. Acabas de pedir el diagnóstico en la web y me ha llamado la atención lo que has escrito:\n\n' +
      '«' + String(datos.hipotesis).slice(0, 220) + '»\n\n' +
      'Una pregunta antes de que hablemos: ' + pregunta(datos);
  }
  return hola + 'soy Maikel, de Qualivo. Acabas de pedir el diagnóstico en la web.\n\n' +
    'Antes de que hablemos te pregunto una cosa: ' + pregunta(datos);
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

function boton(texto) {
  return '<p style="margin:26px 0"><a href="' + AGENDA + '" style="display:inline-block;background:#101319;color:#fff;' +
    'text-decoration:none;font-weight:700;padding:14px 24px;border-radius:10px">' + texto + '</a></p>';
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
        boton('Coger mis quince minutos'));
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
        boton('Ver dónde está la fuga en tu caso'));
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
        boton('Cogerlo cuando quieras') +
        '<p style="color:#5A5E66">Y si lo que pasa es que no es el momento, también me vale saberlo. Responde a este correo y lo dejo apuntado.</p>');
    }
  }
];

module.exports = { AGENDA, nombreCorto, pregunta, whatsapp1, whatsapp2, whatsapp3, EMAILS };

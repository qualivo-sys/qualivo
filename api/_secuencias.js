// Secuencias de correo por rama del recorrido. Cada una se dispara con una
// etiqueta y se apaga sola cuando llega a su último paso.
//
// La de activación (días 2, 6 y 9 para quien no contesta) vive en _mensajes.js
// porque va entrelazada con el WhatsApp y la llamada. Aquí están las demás:
// no se presentó, después del diagnóstico, fuera de alcance y el toque al mes.
//
// Regla de todas: un correo por contacto y día, y cualquier respuesta las para.
// Los recordatorios de la cita los manda GHL desde el calendario; aquí no se
// duplican, porque recibir el mismo aviso dos veces es la forma más tonta de
// parecer un robot.

const AGENDA = 'https://api.leadconnectorhq.com/widget/booking/zBlsw8BEKA2zah81YlOl';
const F = '-apple-system,Segoe UI,Roboto,sans-serif';

function nom(d) {
  const n = String(d.firstName || d.contactName || d.name || '').trim().split(/\s+/)[0];
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
}

function envoltura(cuerpo) {
  return '<div style="font-family:' + F + ';font-size:16px;line-height:1.6;color:#101319;max-width:560px">' + cuerpo +
    '<p style="font-size:13px;color:#7A7C82;line-height:1.5;margin-top:28px;border-top:1px solid #E6E6E6;padding-top:14px">' +
    'Maikel Echevarría · Qualivo · La Seu d\'Urgell<br>' +
    'Si no quieres que te escriba más, respóndeme «baja» y listo.</p></div>';
}

function boton(texto, url) {
  return '<p style="margin:26px 0"><a href="' + (url || AGENDA) + '" style="display:inline-block;background:#101319;color:#fff;' +
    'text-decoration:none;font-weight:700;padding:14px 24px;border-radius:10px">' + texto + '</a></p>';
}

const SECUENCIAS = [
  {
    // Cogió hueco y no apareció. No se le persigue: se le pone fácil volver.
    id: 'noshow',
    disparador: 'act-noshow',
    final: 'act-noshow-fin',
    pasos: [
      {
        etiqueta: 'noshow-1', dias: 0,
        asunto: function (d) { return (nom(d) ? nom(d) + ', ' : '') + 'te he esperado'; },
        html: function (d) {
          return envoltura('<p>' + (nom(d) ? nom(d) + ', h' : 'H') + 'abíamos quedado hoy y no has podido entrar. Sin problema, pasa continuamente.</p>' +
            '<p>Si sigue interesándote, coge otro hueco cuando quieras. Son quince minutos y el calendario está abierto.</p>' +
            boton('Coger otro hueco'));
        }
      },
      {
        etiqueta: 'noshow-2', dias: 2,
        asunto: function () { return 'Lo que iba a mirar en tu caso'; },
        html: function (d) {
          return envoltura('<p>' + (nom(d) ? nom(d) + ', t' : 'T') + 'e dejo por escrito lo que iba a repasar contigo, por si te sirve aunque no lleguemos a hablar.</p>' +
            '<p>Los ocho puntos por donde se escapa el negocio entre el anuncio y el cierre: anuncios, la web, formularios, el lead, el tiempo de respuesta, los seguimientos, los presupuestos y el cierre.</p>' +
            '<p>La pregunta que más cosas destapa suele ser la más tonta: <strong>¿cuántos presupuestos del mes pasado siguen hoy sin respuesta?</strong> Si no sabes el número, ahí ya hay algo.</p>' +
            boton('Si quieres, lo vemos en quince minutos'));
        }
      },
      {
        etiqueta: 'noshow-3', dias: 6,
        asunto: function () { return 'Cierro esto por mi parte'; },
        html: function (d) {
          return envoltura('<p>' + (nom(d) ? nom(d) + ', n' : 'N') + 'o te escribo más por este tema. El hueco sigue ahí si en algún momento te viene bien.</p>' +
            boton('Cogerlo cuando quieras'));
        }
      }
    ]
  },
  {
    // Ya ha tenido el diagnóstico. Aquí se entrega y se decide el piloto.
    id: 'postdiag',
    disparador: 'act-post-diag',
    final: 'act-post-diag-fin',
    pasos: [
      {
        etiqueta: 'post-1', dias: 1,
        asunto: function (d) { return (nom(d) ? nom(d) + ', ' : '') + 'tu plan, por escrito'; },
        html: function (d) {
          return envoltura('<p>' + (nom(d) ? nom(d) + ', g' : 'G') + 'racias por los quince minutos. Te mando lo que hablamos por escrito, para que lo tengas aunque no hagas nada con ello.</p>' +
            '<p>Va lo mismo que te dije en la llamada: dónde se está escapando el negocio, qué arreglaría primero y qué número tendría que moverse para saber si ha funcionado.</p>' +
            '<p>Si quieres que lo montemos, el piloto es de treinta días sobre ese proceso concreto. El número se acuerda antes de empezar, se mide el día 1 y se vuelve a medir el día 30. Si no mejora, no lo pagas.</p>' +
            '<p>Y si prefieres hacerlo por tu cuenta, el plan es tuyo igual.</p>');
        }
      },
      {
        etiqueta: 'post-2', dias: 4,
        asunto: function () { return '¿Lo montamos o lo dejamos?'; },
        html: function (d) {
          return envoltura('<p>' + (nom(d) ? nom(d) + ', t' : 'T') + 'e escribo corto.</p>' +
            '<p>Con el plan delante solo hay tres respuestas posibles y las tres me valen: lo montamos, lo dejamos para más adelante, o no es para vosotros.</p>' +
            '<p>Dime cuál es y dejo de escribirte. Si es la primera, te paso el alcance y el número que propondría medir.</p>');
        }
      },
      {
        etiqueta: 'post-3', dias: 9,
        asunto: function () { return 'Lo dejo aquí'; },
        html: function (d) {
          return envoltura('<p>' + (nom(d) ? nom(d) + ', s' : 'S') + 'upongo que no es el momento, así que lo dejo aquí y no te persigo más.</p>' +
            '<p>El plan que te pasé sigue siendo válido durante bastante tiempo: las fugas no se arreglan solas, pero tampoco se mueven de sitio.</p>' +
            '<p>Si dentro de unos meses queréis retomarlo, escríbeme y seguimos por donde lo dejamos.</p>');
        }
      }
    ]
  },
  {
    // No encaja todavía. Un correo, honesto, y fuera. Nada de nurture eterno.
    id: 'fuera',
    disparador: 'act-fuera',
    final: 'act-fuera-fin',
    pasos: [
      {
        etiqueta: 'fuera-1', dias: 0,
        asunto: function () { return 'Sinceramente: todavía no'; },
        html: function (d) {
          return envoltura('<p>' + (nom(d) ? 'Hola ' + nom(d) + '. G' : 'G') + 'racias por pedir el diagnóstico. Te contesto con franqueza: por lo que me cuentas, ahora mismo te costaría más tiempo del que te devolvería.</p>' +
            '<p>Lo que hacemos tiene sentido cuando ya entran oportunidades y hay algo montado detrás: web o campañas, un CRM, alguien que vende. Antes de eso no hay fuga que tapar, hay sistema que construir, y eso es otro trabajo.</p>' +
            '<p>Tres cosas que sí puedes mirar hoy sin nosotros y sin gastar nada:</p>' +
            '<p style="color:#3D4148">1. Cuánto tardas en contestar a un contacto nuevo. Si pasa de una hora, ahí ya pierdes.<br>' +
            '2. Cuántos presupuestos del mes pasado siguen sin respuesta.<br>' +
            '3. De qué canal salió tu último cliente. El último cliente, no el último lead.</p>' +
            '<p>Cuando eso cambie, escríbeme y lo miramos.</p>');
        }
      }
    ]
  },
  {
    // Dijo «ahora no». Un solo toque al mes, y lo decide una persona después.
    id: 'tibio',
    disparador: 'act-tibio',
    final: 'act-tibio-fin',
    pasos: [
      {
        etiqueta: 'tibio-1', dias: 30,
        asunto: function () { return 'Ha pasado un mes'; },
        html: function (d) {
          return envoltura('<p>' + (nom(d) ? nom(d) + ', h' : 'H') + 'ace un mes me dijiste que no era el momento. Te escribo una sola vez por si ahora lo es.</p>' +
            '<p>Nada ha cambiado por mi parte: quince minutos, los ocho puntos, un plan por escrito. Si sigue sin ser el momento, ignora este correo y no vuelvo a escribirte.</p>' +
            boton('Coger quince minutos'));
        }
      }
    ]
  }
];

module.exports = { SECUENCIAS, AGENDA, nom, envoltura, boton };

// Secuencia de correos posterior al diagnóstico de crecimiento. Cinco correos
// (días 2, 5, 9, 14 y 21) con la dimensión del cuello de botella en cada uno.
// Solo texto: se revisa aquí sin tocar la lógica de envío (api/secuencia.js).

const R = require('./_radiografia');

const F = '-apple-system,Segoe UI,Roboto,sans-serif';
const ORDEN = ['seguimiento', 'conversion', 'captacion', 'control', 'dependencia'];

// Por qué la segunda dimensión suele sostener a la primera (pares más frecuentes).
const PAREJA = {
  captacion: 'Cuando no llega suficiente gente, lo poco que llega se atiende con prisa y sin proceso, y ahí aparece la segunda grieta. Arreglar la captación sin arreglar esto es llenar un cubo con un agujero pequeño: se nota menos, pero se pierde igual.',
  conversion: 'Cuando se contesta tarde o se cierra poco, casi siempre es porque no hay a quién tocarle contestar ni cómo. Eso es la segunda grieta. Mejorar la velocidad sin arreglarla dura hasta el primer mes con mucho trabajo.',
  seguimiento: 'Cuando nadie persigue los presupuestos, casi nunca es pereza: es que no está apuntado en ningún sitio a quién había que llamar. Esa es la segunda grieta. Un calendario de seguimiento sin un sitio donde apuntar se olvida en dos semanas.',
  dependencia: 'Cuando todo pasa por ti, lo primero que se resiente es lo que no grita: el seguimiento y los números. Esa es la segunda grieta. Soltar tareas sin un mínimo de control es soltar sin saber qué pasa después.',
  control: 'Cuando no sabes qué canal trae ventas, tampoco sabes cuántos presupuestos se quedaron sin respuesta ni cuánto tardáis en contestar. Esa es la segunda grieta. Empezar a apuntar arregla las dos a la vez.'
};

// Cómo ponerle un número a la fuga cuando no hay calculadora para esa dimensión.
const CUENTA = {
  captacion: 'Cuenta cuántas personas interesadas te llegaron el mes pasado y cuántas necesitas para llegar a fin de mes tranquilo. La diferencia, multiplicada por lo que te deja un cliente, es lo que te cuesta cada mes no tener una fuente que puedas abrir.',
  dependencia: 'Apunta durante una semana cuántas cosas esperaron a que tuvieras un hueco: presupuestos, respuestas, decisiones. Multiplica por lo que vale una de esas cosas y por cuatro semanas. Ese es el precio de tu techo de horas.',
  control: 'Suma lo que gastaste en captar el trimestre pasado. Si no sabes qué parte trajo clientes y qué parte no, la mitad de esa cifra es una hipótesis razonable de lo que estás pagando a ciegas.'
};

function nombreCorto(contacto) {
  const n = String(contacto.firstName || contacto.contactName || contacto.name || '').trim().split(' ')[0];
  return n || 'Hola';
}

function envoltorio(cuerpo, bajaUrl) {
  return '<div style="background:#F7F8F9;padding:24px 14px"><div style="max-width:560px;margin:0 auto;background:#fff;' +
    'border-radius:14px;padding:30px 28px;font-family:' + F + ';color:#3D4148;font-size:16px;line-height:1.65">' +
    cuerpo +
    '<p style="margin:26px 0 0;font-size:14px;color:#8A8B90">Maikel Echevarría<br>Qualivo · qualivo.io</p>' +
    '</div><p style="max-width:560px;margin:14px auto 0;font-size:12.5px;line-height:1.6;color:#8A8B90;text-align:center">' +
    'Recibes esto porque hiciste el diagnóstico de crecimiento en qualivo.io. ' +
    '<a href="' + bajaUrl + '" style="color:#8A8B90">No quiero más correos</a></p></div>';
}

function p(t) { return '<p style="margin:0 0 16px">' + t + '</p>'; }
function boton(href, texto) {
  return '<p style="margin:22px 0 6px"><a href="' + href + '" style="display:inline-block;background:#27BDB1;color:#04231F;' +
    'text-decoration:none;font-weight:800;font-size:15px;padding:12px 20px;border-radius:10px">' + texto + '</a></p>';
}

// Devuelve { asunto, html } para un paso (2, 5, 9, 14, 21) y un contacto.
function correo(paso, contacto, cuello, segunda, bajaUrl) {
  const n = nombreCorto(contacto);
  const dim = R.NOMBRE[cuello].toLowerCase();
  const seg = segunda && R.NOMBRE[segunda] ? R.NOMBRE[segunda].toLowerCase() : null;
  const diag = 'https://qualivo.io/diagnostico/?origen=secuencia&cuello=' + cuello;

  if (paso === 2) return {
    asunto: '¿Ha acertado?',
    html: envoltorio(
      p(n + ', hace dos días te dije que tu crecimiento se está rompiendo en <strong>' + dim + '</strong>.') +
      p('Te dejé una forma de comprobarlo en una semana. Por si no la tienes a mano:') +
      p('<em>' + R.COMPROBAR[cuello] + '</em>') +
      p('No hace falta que me contestes. Pero si lo has mirado y no cuadra, dímelo respondiendo a este correo: prefiero corregir el diagnóstico a que te quedes con uno falso.'),
      bajaUrl)
  };

  if (paso === 5) return {
    asunto: seg ? 'La que no esperabas: ' + seg : 'La que no esperabas',
    html: envoltorio(
      p(n + ', la mayoría acierta con su primer cuello de botella. Con el segundo, no.') +
      (seg ? p('El tuyo era <strong>' + seg + '</strong>. Y suele ir de la mano de ' + dim + ' en empresas como la tuya:') : p('En empresas donde se rompe ' + dim + ', casi siempre hay una segunda grieta que la sostiene:')) +
      p(PAREJA[cuello]) +
      p('Si arreglas una sin mirar la otra, dura poco. No es para desanimar: es para que el esfuerzo de estos treinta días no se deshaga en los siguientes.'),
      bajaUrl)
  };

  if (paso === 9) return {
    asunto: 'El primer movimiento, sin adornos',
    html: envoltorio(
      p(n + ', el primer movimiento de tu plan era este:') +
      p('<strong>' + R.MOVIMIENTOS[cuello][0] + '</strong>') +
      p('Te cuento lo que pasa cuando alguien lo hace, porque siempre es lo mismo. Los dos primeros días parece una tontería. El tercero aparece algo que no sabías: un presupuesto sin respuesta, un cliente que vino de donde no pensabas, una llamada que llevaba una semana esperando. Y esa cosa, sola, ya vale más que el rato invertido.') +
      p('Lo que no pasa nunca es que alguien lo haga y no encuentre nada. Si lo has hecho, contéstame con lo que apareció. Si no, este correo es el recordatorio.'),
      bajaUrl)
  };

  if (paso === 14) {
    const eco = (cuello === 'seguimiento' || cuello === 'conversion');
    return {
      asunto: 'Cuánto te está costando no arreglarlo',
      html: envoltorio(
        p(n + ', llevas dos semanas sabiendo que tu crecimiento se rompe en <strong>' + dim + '</strong>. La pregunta que sigue es cuánto cuesta cada mes que pasa sin tocarlo.') +
        (eco
          ? p('Para esto hay calculadora: pide tus números (cuántos presupuestos, cuántos se quedan sin respuesta, lo que te deja un cliente) y enseña la fórmula. Sin promedios del sector: solo tus datos.') +
            boton('https://qualivo.io/calculadora-de-fugas/?origen=secuencia&fuga=' + (cuello === 'seguimiento' ? 'presupuestos' : 'velocidad'), 'Ponerle un número →')
          : p('Para ' + dim + ' no hay calculadora honesta, pero sí una cuenta a mano:') + p('<em>' + CUENTA[cuello] + '</em>')) +
        p('Si quieres que lo miremos juntos con tus números, eso es la radiografía de crecimiento. No es una llamada de ventas: es la misma pregunta que ya te has hecho, con datos delante.') +
        boton(diag, 'Decidir qué arreglar primero →'),
        bajaUrl)
    };
  }

  if (paso === 21) return {
    asunto: 'Una cosa antes de dejarte en paz',
    html: envoltorio(
      p(n + ', tres líneas y no te escribo más sobre esto:') +
      '<ul style="margin:0 0 16px;padding-left:20px"><li>Dónde se rompe: <strong>' + dim + '</strong>.</li>' +
      '<li>Qué hacer primero: ' + R.MOVIMIENTOS[cuello][0] + '</li>' +
      '<li>Cómo saber si acierta: ' + R.COMPROBAR[cuello] + '</li></ul>' +
      p('Si dentro de un mes sigues en el mismo sitio, contéstame a este correo con una sola palabra: <strong>' + dim + '</strong>. Te digo por dónde empezaría yo en tu caso.'),
      bajaUrl)
  };

  return null;
}

module.exports = { correo, ORDEN };

// Correos posteriores a la radiografía (recorrido Radiografía → reunión, §1-§2).
// Regla madre: no se pide reunión; se le pone número a la fuga.
//   Día 1 · solo si no dejó WhatsApp: la misma pregunta con número que iría por WhatsApp.
//   Día 3 · «el error más común en <cuello>»: caso de la casa con número + acción de hoy.
//   Día 7 · «cómo lo arreglamos en <caso>»: qué se hizo, en qué orden, qué número cambió,
//           y oferta del análisis por escrito. Después, etiqueta sec-tibio (toque a 30 días).
// Si contesta (etiqueta «respondio»), se para todo. Solo texto: la lógica vive en secuencia.js.

const R = require('./_radiografia');

const F = '-apple-system,Segoe UI,Roboto,sans-serif';
const ORDEN = ['seguimiento', 'conversion', 'captacion', 'control', 'dependencia'];

const PREGUNTA = {
  captacion: '¿cuántas oportunidades nuevas os entraron el mes pasado?',
  conversion: 'cuando entra un formulario o un WhatsApp, ¿cuánto tarda en contestarse de media?',
  seguimiento: '¿cuántos presupuestos del mes pasado siguen sin respuesta?',
  dependencia: 'si mañana entraran 30 oportunidades, ¿cuántas se atenderían sin pasar por ti?',
  control: '¿de qué canal salió el último cliente que firmó? El último cliente, no el último lead.'
};

// Caso de la casa por cuello. Cifras: casos publicados en qualivo.io/casos (Nuria, BelloVinilo,
// EAC) y registro del cerebro del 9-sep (Eleva, Equipzilla). Ventas afina en ventas/radiografia/.
const CASO = {
  seguimiento: {
    nombre: 'Nuria Roure', url: 'https://qualivo.io/casos/nuria-roure/',
    numero: '6,45 veces lo invertido: 2.000 € en el sistema, 12.900 € en ventas atribuibles, con el mismo tráfico',
    error: 'tener presupuestos y contactos abiertos y seguirlos «cuando se puede». Nadie sabe cuáles merecen prioridad ni qué pasó con cada uno.',
    pasos: [
      'Primero, información: un cuestionario que dice qué necesita cada persona antes de hablar con ella.',
      'Después, prioridad: puntuación de cada oportunidad para saber a quién llamar primero.',
      'Luego, seguimiento reestructurado y automatizado para que ninguna oportunidad buena se quede sin trabajar.',
      'Por último, trazabilidad de cada llamada. El número que cambió: 2.000 € invertidos, 12.900 € en ventas.'
    ]
  },
  captacion: {
    nombre: 'BelloVinilo', url: 'https://qualivo.io/casos/bellovinilo/',
    numero: '8,3 veces lo invertido: 3.600 € de inversión, 30.000 € en ventas',
    error: 'lanzar acciones sueltas (un anuncio, una web, un mes de redes) sin un sistema detrás que convierta visitas en contactos y contactos en presupuestos.',
    pasos: [
      'Primero, entender público, servicios y proceso comercial antes de gastar un euro.',
      'Después, la entrada: landing y embudos hechos para ese público, no genéricos.',
      'Luego, publicidad para demanda cualificada, con CRM y seguimiento para que los contactos no se pierdan.',
      'Por último, medición de punta a punta. El número que cambió: 3.600 € invertidos, 30.000 € en ventas.'
    ]
  },
  dependencia: {
    nombre: 'Escola Aeronàutica de Catalunya', url: 'https://qualivo.io/casos/eac/',
    numero: '10,2 veces lo invertido en publicidad: 559 leads, 68 entrevistas y 10 matrículas en un mes de referencia, todo medido',
    error: 'que el proceso dependa de que alguien se acuerde: quién llamó a quién, qué anuncio trajo a cada alumno, en qué paso se quedó cada uno.',
    pasos: [
      'Primero, un panel que junta anuncios y CRM y se actualiza solo cada día.',
      'Después, campañas separadas por curso, cada una con su público y su mensaje.',
      'Luego, el embudo medido paso a paso: lead, entrevista, matrícula, atribuido por canal.',
      'Por último, presupuesto ajustado por fases sin romper el aprendizaje. El número que cambió: 10,2 veces la inversión.'
    ]
  },
  conversion: {
    nombre: 'Eleva Academy', url: null,
    numero: 'un 61 % menos de coste por lead',
    error: 'contestar tarde y a todos por igual: el que pregunta a las 10 recibe respuesta a las 18, y el que estaba listo para comprar ya habló con otro.',
    pasos: [
      'Primero, un formulario que pregunta lo importante antes de la llamada: experiencia, motivación, disponibilidad.',
      'Después, respuesta inmediata por WhatsApp que resuelve dudas y detecta urgencia sin vender.',
      'Luego, llamada humana solo a quien está preparado, en minutos y no en días.',
      'Por último, anuncios y landing separados por intención. El número que cambió: 61 % menos de coste por lead.'
    ]
  },
  control: {
    nombre: 'Equipzilla', url: null,
    numero: 'un retorno publicitario que pasó de 0,1 a 7,6',
    error: 'invertir en varios canales sin saber cuál trae clientes (no leads: clientes). Se recorta a ciegas y a veces se apaga justo lo que vendía.',
    pasos: [
      'Primero, conectar anuncios, CRM y ventas para que cada cliente firmado tenga un origen.',
      'Después, apagar lo que traía leads pero no traía clientes.',
      'Luego, mover ese presupuesto a lo que sí cerraba y seguir a cada oportunidad por WhatsApp sin depender de memoria.',
      'Por último, un cuadro que se mira cada semana. El número que cambió: retorno de 0,1 a 7,6.'
    ]
  }
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
    'Recibes esto porque hiciste la radiografía de crecimiento en qualivo.io. ' +
    '<a href="' + bajaUrl + '" style="color:#8A8B90">No quiero más correos</a></p></div>';
}

function p(t) { return '<p style="margin:0 0 16px">' + t + '</p>'; }

// Devuelve { asunto, html } para un paso (1, 3, 7) y un contacto. `puntos` = puntuación del cuello (0-100).
function correo(paso, contacto, cuello, segunda, bajaUrl, puntos) {
  const n = nombreCorto(contacto);
  const dim = R.NOMBRE[cuello].toLowerCase();
  const caso = CASO[cuello];
  const pts = Number.isInteger(puntos) ? puntos + ' de 100' : 'la más floja de las cinco';

  if (paso === 1) return {
    asunto: 'tu radiografía: ' + dim,
    html: envoltorio(
      p('Hola ' + n + ', soy Maikel. Vi que en la radiografía te salió <strong>' + dim + '</strong> como cuello de botella, ' + pts + '.') +
      p('Una pregunta rápida: <strong>' + PREGUNTA[cuello] + '</strong>') +
      p('Si me dices el número, te digo en dos líneas cuánto es eso al año. Con responder a este correo vale.'),
      bajaUrl)
  };

  if (paso === 3) return {
    asunto: 'el error más común en ' + dim,
    html: envoltorio(
      p(n + ', el error más común cuando se rompe ' + dim + ' es ' + caso.error) +
      p('En ' + (caso.url ? '<a href="' + caso.url + '" style="color:#0E7C74">' + caso.nombre + '</a>' : caso.nombre) + ' era exactamente eso. Se arregló sin invertir más en captación y el resultado fue ' + caso.numero + '.') +
      p('Lo que puedes hacer hoy sin nosotros: <strong>' + R.MOVIMIENTOS[cuello][0] + '</strong>') +
      p('Si quieres, te digo cuánto es en tu caso: responde con el número. ' + PREGUNTA[cuello].charAt(0).toUpperCase() + PREGUNTA[cuello].slice(1)),
      bajaUrl)
  };

  if (paso === 7) return {
    asunto: 'cómo lo arreglamos en ' + caso.nombre,
    html: envoltorio(
      p(n + ', te cuento en cuatro líneas cómo se arregló ' + dim + ' en ' + caso.nombre + ':') +
      '<ol style="margin:0 0 16px;padding-left:20px">' + caso.pasos.map(function (x) { return '<li style="margin:0 0 8px">' + x + '</li>'; }).join('') + '</ol>' +
      p('Te hago el análisis por escrito de dónde se te escapa y qué arreglar primero. Sin llamada, sin compromiso. ¿Te lo mando? Responde «sí» a este correo.'),
      bajaUrl)
  };

  return null;
}

module.exports = { correo, ORDEN, PREGUNTA, CASO };

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

// Caso de la casa por cuello. Solo casos publicados en qualivo.io/casos (anónimos) y solo cifras
// que pasaron la auditoría del 27-oct-2026 (content/casos/2026-10-27-auditoria-cifras.md):
// nada de retornos ni ventas sin el dato del cliente por escrito. Ventas afina en ventas/radiografia/.
const OFICIOS = {
  nombre: 'una academia de oficios', url: 'https://qualivo.io/casos/academia-oficios/',
  numero: 'que cada contacto entrara solo en el CRM, en segundos, y un 53 % menos de coste por lead (de 6,86 € a 3,21 €, julio-agosto de 2026, datos de Meta)',
  pasos: [
    'Primero, conectar los formularios de Meta con el CRM: cada contacto entra en segundos, con su oportunidad creada, sin pasarlo a mano.',
    'Después, preguntas filtro en el formulario, para que la información llegue antes de la llamada y no dependa de quien atiende.',
    'Luego, una oportunidad por contacto en el CRM, para ver en qué paso está cada uno.',
    'Por último, creatividades nuevas hasta dar con la que trae a quien de verdad quiere el curso. El número que cambió: de 6,86 € a 3,21 € por lead (julio-agosto de 2026, datos de Meta).'
  ]
};

const CASO = {
  seguimiento: {
    nombre: 'una consulta de salud', url: 'https://qualivo.io/casos/salud-servicios-online/',
    numero: 'saber qué oportunidades merecían atención y trabajarlas en orden, sin que ninguna buena se quedara sin seguimiento',
    error: 'tener presupuestos y contactos abiertos y seguirlos «cuando se puede». Nadie sabe cuáles merecen prioridad ni qué pasó con cada uno.',
    pasos: [
      'Primero, información: un cuestionario que dice qué necesita cada persona antes de hablar con ella.',
      'Después, prioridad: puntuación de cada oportunidad para saber a quién llamar primero.',
      'Luego, seguimiento reestructurado y automatizado para que ninguna oportunidad buena se quede sin trabajar.',
      'Por último, trazabilidad de cada llamada, para saber qué pasó con cada oportunidad.'
    ]
  },
  captacion: {
    nombre: 'una empresa de reformas B2B', url: 'https://qualivo.io/casos/reformas-b2b/',
    numero: 'un sistema comercial completo, construido desde cero, de la captación al seguimiento',
    error: 'lanzar acciones sueltas (un anuncio, una web, un mes de redes) sin un sistema detrás que convierta visitas en contactos y contactos en presupuestos.',
    pasos: [
      'Primero, entender público, servicios y proceso comercial antes de gastar un euro.',
      'Después, la entrada: landing y embudos hechos para ese público, no genéricos.',
      'Luego, publicidad para demanda cualificada, con CRM y seguimiento para que los contactos no se pierdan.',
      'Por último, medición de punta a punta, para saber qué canal trae ventas.'
    ]
  },
  dependencia: Object.assign({}, OFICIOS, {
    error: 'que el proceso dependa de que alguien se acuerde: quién llamó a quién, qué anuncio trajo a cada alumno, en qué paso se quedó cada uno.'
  }),
  conversion: Object.assign({}, OFICIOS, {
    error: 'contestar tarde y a todos por igual: el que pregunta a las 10 recibe respuesta a las 18, y el que estaba listo para comprar ya habló con otro.'
  }),
  control: {
    nombre: 'un centro de formación profesional', url: 'https://qualivo.io/casos/formacion-profesional/',
    numero: 'ver cada mes, por curso y por canal, cuántos leads llegan a entrevista y a matrícula',
    error: 'invertir en varios canales sin saber cuál trae clientes (no leads: clientes). Se recorta a ciegas y a veces se apaga justo lo que vendía.',
    pasos: [
      'Primero, un panel que junta anuncios y CRM y se actualiza solo cada día.',
      'Después, campañas separadas por curso, cada una con su público y su mensaje.',
      'Luego, el embudo medido paso a paso: lead, entrevista, matrícula, por canal.',
      'Por último, presupuesto ajustado por fases, sin romper el aprendizaje, hacia los cursos y canales que acababan en matrícula.'
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
      p('En ' + (caso.url ? '<a href="' + caso.url + '" style="color:#0E7C74">' + caso.nombre + '</a>' : caso.nombre) + ' era exactamente eso. Lo que cambió: ' + caso.numero + '.') +
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

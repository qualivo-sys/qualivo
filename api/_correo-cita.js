// Correos de la cita, versión 2 (29-sep-2026). Borrador pendiente del ok de Maikel.
//
// Tres correos al lead, con el mismo aspecto que los de nurturing
// (content/nurturing/correo): confirmación nada más reservar, víspera y
// mismo día. Dicen qué vamos a ver en la reunión, piden los cuatro números
// del simulador (inversión, contactos al mes, cuántos se presentan, ticket) y
// se personalizan con lo que contestó en el formulario (etiquetas sector-,
// fuga- y vol- del contacto) cuando lo hay.
//
// Este módulo solo construye asunto y HTML; no envía nada. Lo usan
// api/_cita.js y api/_recordatorios.js, y solo si allí CORREO_CITA_V2 = true.
// Las vistas previas están en content/correos/*-v2.html y se regeneran con:
//   node herramientas/correos-cita-v2.js
//
// Casos: solo las cifras aprobadas (Nuria Roure 6,45 veces lo invertido; una
// academia de formación 1.160 leads y 21 matrículas en cuatro meses; Antic
// Barcelona 113 —el 113 es parte del nombre—: visitas agendadas en menos de 24 horas). No se inventa ninguna.

const F = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const TINTA = '#101319';
const GRIS = '#7A7C82';
const TEAL = '#27BDB1';
const TEAL_TXT = '#0E7C74';
const CAJA = '#EFECFB';
const CAJA_LINEA = '#DCD8EE';

// ---------------------------------------------------------------------------
// Lo que sabemos del lead (etiquetas que ponen los formularios).
// ---------------------------------------------------------------------------
function etiqueta(c, prefijo) {
  const t = ((c && c.tags) || []).map(String).filter(function (x) { return x.indexOf(prefijo) === 0; })
    .sort(function (a, b) { return a.length - b.length; })[0];
  return t ? t.slice(prefijo.length) : '';
}

function nombrePila(v) {
  const limpio = String(v || '').replace(/^\s*(arq|dra|dr|sra|sr|ing|lic|prof|don|doña)(\.\s*|\s+)/i, '').trim();
  const p = limpio.split(/\s+/)[0] || '';
  return p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : '';
}

function sectorDe(v) {
  const s = String(v || '').toLowerCase();
  if (/formaci|academ|escuela|curso/.test(s)) return 'formacion';
  if (/clinic|clínic|salud|estet|dental|fisio|bienestar/.test(s)) return 'clinica';
  if (/reform|constru|instala/.test(s)) return 'reformas';
  return 'otro';
}

function fugaDe(v) {
  const f = String(v || '').toLowerCase();
  if (!f) return '';
  if (/anuncio|captaci/.test(f)) return 'anuncios';
  if (/web|formulario/.test(f)) return 'web';
  if (/respuesta|tiempo/.test(f)) return 'respuesta';
  if (/seguimiento|presup/.test(f)) return 'seguimiento';
  if (/no-lo-s|no lo s/.test(f)) return 'nolose';
  return '';
}

// «20-50» → «entre 20 y 50», «mas-de-50» → «más de 50». Si no se entiende, nada:
// mejor no citarlo que citarlo mal.
function volumenDe(v) {
  const s = String(v || '').toLowerCase().replace(/-(al|a|por)-mes.*$/, '');
  let m = s.match(/^(\d+)-(\d+)$/);
  if (m) return 'entre ' + m[1] + ' y ' + m[2];
  m = s.match(/^mas-de-(\d+)$/);
  if (m) return 'más de ' + m[1];
  m = s.match(/^menos-de-(\d+)$/);
  if (m) return 'menos de ' + m[1];
  m = s.match(/^(\d+)$/);
  if (m) return m[1];
  return '';
}

// c: contacto de GHL. Devuelve { nombre, empresa, sector, fuga, volumen }.
function datosDe(c) {
  c = c || {};
  return {
    nombre: nombrePila(c.firstName || c.contactName || c.name || ''),
    empresa: String(c.companyName || '').trim(),
    sector: sectorDe(etiqueta(c, 'sector-')),
    fuga: fugaDe(etiqueta(c, 'fuga-')),
    volumen: volumenDe(etiqueta(c, 'vol-'))
  };
}

// ---------------------------------------------------------------------------
// Palabras por sector (las mismas que el simulador del embudo).
// ---------------------------------------------------------------------------
const SECTOR = {
  formacion: {
    persona: 'persona', contactos: 'solicitudes de información', piden: 'pide información',
    n2: 'Cuántas solicitudes de información te entran al mes.',
    n3: 'Cuántas personas vienen a la entrevista o a la clase de prueba.',
    n4: 'Cuánto deja de media un alumno.', ventas: 'matrículas',
    duda: 'quien dice «ya te digo» hasta que se matricula o te dice que no',
    caso: 'En una academia de formación salieron 1.160 leads y 21 matrículas en cuatro meses.'
  },
  clinica: {
    persona: 'paciente', contactos: 'consultas de pacientes nuevos', piden: 'pide cita',
    n2: 'Cuántas consultas de pacientes nuevos te entran al mes.',
    n3: 'Cuántos pacientes vienen a la primera visita.',
    n4: 'Cuánto vale de media un tratamiento.', ventas: 'tratamientos aceptados',
    duda: 'el paciente que se lleva el presupuesto a casa y dice «me lo pienso»',
    caso: 'Con Nuria Roure, en su clínica, el resultado fue 6,45 veces lo invertido.'
  },
  reformas: {
    persona: 'cliente', contactos: 'peticiones de presupuesto', piden: 'pide presupuesto',
    n2: 'Cuántas peticiones de presupuesto te entran al mes.',
    n3: 'Cuántas visitas llegáis a hacer.',
    n4: 'Cuánto vale de media una obra.', ventas: 'obras firmadas',
    duda: 'quien recibe el presupuesto y se lo piensa',
    caso: 'Con Antic Barcelona 113, carpintería a medida, las visitas se agendan en menos de 24 horas desde que el cliente pide presupuesto.'
  },
  otro: {
    persona: 'persona', contactos: 'contactos nuevos', piden: 'pide información',
    n2: 'Cuántos contactos nuevos te entran al mes.',
    n3: 'Cuántos llegan a la cita o la reunión.',
    n4: 'Cuánto vale de media una venta.', ventas: 'ventas',
    duda: 'quien se lo piensa',
    caso: ''
  }
};
function sector(d) { return SECTOR[(d && d.sector) || 'otro'] || SECTOR.otro; }

// Lo que contestó en «¿dónde crees que se te escapa?», dicho con sus palabras.
const FUGA_DICHA = {
  anuncios: 'se te escapa en los anuncios y la captación',
  web: 'se te escapa en la web y los formularios',
  respuesta: 'se te escapa en el tiempo de respuesta',
  seguimiento: 'se te escapa en el seguimiento y los presupuestos',
  nolose: 'todavía no sabes dónde se te escapa (es lo más habitual: casi nadie lo tiene medido)'
};

// La etapa que enseñaremos funcionando: la más floja según su respuesta. En la
// reunión manda el simulador; esto es lo que se promete en el correo.
function etapa(d) {
  const s = sector(d);
  switch (d && d.fuga) {
    case 'respuesta': return 'Cómo se contesta en minutos a cada ' + s.persona + ' que ' + s.piden + ', también de noche y en fin de semana, por WhatsApp y por teléfono.';
    case 'seguimiento': return 'Cómo se sigue a ' + s.duda + ', sin que nadie de tu equipo tenga que acordarse.';
    case 'anuncios': return 'Cómo se ve qué anuncio te trae ' + s.ventas + ' y cuál solo curiosos, desde el clic hasta la venta.';
    case 'web': return 'Qué pasa entre que alguien entra en tu web y te deja sus datos, y cómo se contesta en minutos a quien sí lo hace.';
    default: return 'La etapa donde tus números digan que se pierde más, y cómo funcionaría ahí en tu caso.';
  }
}

// ---------------------------------------------------------------------------
// Piezas de HTML (tablas y estilos en línea, como los correos de nurturing).
// ---------------------------------------------------------------------------
function esc(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function p(html, extra) {
  return '<p style="margin:0 0 16px;font-family:' + F + ';font-size:16px;line-height:1.65;color:' + TINTA + ';' + (extra || '') + '">' + html + '</p>';
}
function boton(texto, url) {
  return '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;"><tr><td bgcolor="' + TINTA + '" style="background-color:' + TINTA + ';border-radius:10px;">' +
    '<a href="' + esc(url) + '" style="display:inline-block;padding:14px 24px;font-family:' + F + ';font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;">' + esc(texto) + '</a>' +
    '</td></tr></table>';
}
// filas: [[etiqueta, texto], ...]
function caja(titulo, filas) {
  const td = 'valign="top" bgcolor="' + CAJA + '" style="background-color:' + CAJA + ';padding:9px 0;font-family:' + F + ';font-size:15px;line-height:1.45;color:' + TINTA + ';';
  const cuerpo = filas.map(function (f, i) {
    const borde = i ? 'border-top:1px solid ' + CAJA_LINEA + ';' : '';
    return '<tr><td ' + td + borde + 'width:34px;font-weight:800;color:' + TEAL_TXT + ';">' + esc(f[0]) + '</td>' +
      '<td ' + td + borde + '">' + f[1] + '</td></tr>';
  }).join('');
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="' + CAJA + '" style="background-color:' + CAJA + ';border-radius:12px;margin:4px 0 20px;"><tr><td bgcolor="' + CAJA + '" style="background-color:' + CAJA + ';padding:16px 20px;">' +
    '<div style="font-family:' + F + ';font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:' + TEAL_TXT + ';margin-bottom:8px;">' + esc(titulo) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + cuerpo + '</table></td></tr></table>';
}
function firma() {
  return '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 0;"><tr><td valign="middle" style="padding-right:12px;">' +
    '<img src="https://qualivo.io/assets/img/maikel-echevarria.jpg" width="44" height="44" alt="Maikel" style="display:block;width:44px;height:44px;border-radius:50%;border:0;"></td>' +
    '<td valign="middle" style="font-family:' + F + ';font-size:14px;line-height:1.4;color:' + TINTA + ';"><b>Maikel Echevarría</b><br>' +
    '<span style="color:' + GRIS + ';">Fundador de Qualivo · <a href="https://qualivo.io" style="color:' + GRIS + ';">qualivo.io</a></span></td></tr></table>';
}
function pie(texto) {
  return '<p style="margin:24px 0 0;font-family:' + F + ';font-size:12px;line-height:1.5;color:' + GRIS + ';">' + texto + '</p>';
}
function documento(titulo, preencabezado, cuerpo) {
  return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(titulo) + '</title></head>\n' +
    '<body bgcolor="#F4F5F7" style="margin:0;padding:0;background-color:#F4F5F7;">\n' +
    '<div style="display:none;max-height:0;overflow:hidden;">' + esc(preencabezado) + '</div>\n' +
    '<table bgcolor="#F4F5F7" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F5F7;"><tr><td align="center" style="padding:24px 12px;">\n' +
    '<table bgcolor="#FFFFFF" role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background-color:#FFFFFF;border-radius:14px;border-top:4px solid ' + TEAL + ';">\n' +
    '<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:30px 32px 30px;">\n' + cuerpo + '\n</td></tr></table></td></tr></table></body></html>';
}

// ---------------------------------------------------------------------------
// Bloques comunes.
// ---------------------------------------------------------------------------
function saludo(d) { return p(d && d.nombre ? 'Hola ' + esc(d.nombre) + ':' : 'Hola:'); }

function loQueDijiste(d) {
  if (!d || !FUGA_DICHA[d.fuga]) return '';
  const s = sector(d);
  const vol = d.volumen ? ', y que os entran ' + esc(d.volumen) + ' ' + s.contactos + ' al mes' : '';
  return p('En el formulario me dijiste que ' + FUGA_DICHA[d.fuga] + vol + '. Lo miramos con eso delante.');
}

function queVeremos(d) {
  return caja('Lo que vamos a ver', [
    ['1', '<b>Tus números, en el simulador.</b> Con lo que inviertes, lo que te entra y lo que vendes hoy, calculamos cuánto más podrías facturar y cuánto te costaría. Con tus números, no con una media.'],
    ['2', '<b>Tu etapa más floja, funcionando.</b> ' + esc(etapa(d))],
    ['3', '<b>Un objetivo a 90 días.</b> Un número concreto que mover. Te lo dejo por escrito ese mismo día, lo hagas con nosotros o no.']
  ]);
}

function cuatroNumeros(d) {
  const s = sector(d);
  const vol = d && d.volumen ? ' <span style="color:' + GRIS + ';">(en el formulario pusiste ' + esc(d.volumen) + ')</span>' : '';
  return caja('Si puedes, ten a mano estos cuatro números', [
    ['1', 'Cuánto inviertes al mes en anuncios.'],
    ['2', esc(s.n2.replace(/\.$/, '')) + vol + '.'],
    ['3', esc(s.n3)],
    ['4', esc(s.n4)]
  ]) + p('Aproximados valen. Y si no los tienes, también sirve: los sacamos juntos.', 'color:#5A5E66;');
}

function entrar(cita) {
  return cita && /^https?:/.test(cita.enlace || '')
    ? boton('Entrar a la videollamada', cita.enlace)
    : p('El enlace de la videollamada está en la invitación del calendario que te ha llegado a este correo.');
}

// cita: { dia: 'jueves, 1 de octubre', hora: '10:00', cuando: 'hoy'|'mañana'|'', enlace, porTelefono }
// porTelefono: la cerró Raquel por teléfono (etiqueta voz-completada) y puede esperar una llamada.
function cuandoTexto(cita) {
  if (!cita) return '';
  return (cita.cuando ? cita.cuando + ', ' : 'el ') + (cita.dia || '') + ' a las ' + (cita.hora || '');
}

// ---------------------------------------------------------------------------
// Los tres correos.
// ---------------------------------------------------------------------------

// Nada más reservar.
function confirmacion(d, cita) {
  d = d || {}; cita = cita || {};
  const s = sector(d);
  const asunto = (d.nombre ? d.nombre + ', confirmado: ' : 'Confirmado: ') + (cita.cuando || cita.dia || '') + ' a las ' + (cita.hora || '');
  const cuerpo =
    saludo(d) +
    p('Confirmado: hablamos <b>' + esc(cuandoTexto(cita)) + '</b>, por videollamada. Son unos 30 minutos, conmigo.') +
    entrar(cita) +
    loQueDijiste(d) +
    queVeremos(d) +
    cuatroNumeros(d) +
    (s.caso ? p('Por si quieres saber con quién hablas: ' + esc(s.caso)) : '') +
    p('Si te surge algo, contesta a este correo o escríbeme por WhatsApp y lo movemos.') +
    firma();
  return { asunto: asunto, html: documento(asunto, 'Qué vamos a ver y los cuatro números que conviene tener a mano.', cuerpo) };
}

// La víspera (18:30), solo si reservó con dos o más días de antelación.
function vispera(d, cita) {
  d = d || {}; cita = cita || {};
  const asunto = 'Mañana a las ' + (cita.hora || '') + ' · lo que vamos a ver';
  const cuerpo =
    saludo(d) +
    p('Mañana a las <b>' + esc(cita.hora || '') + '</b> tenemos la videollamada (unos 30 minutos).') +
    queVeremos(d) +
    cuatroNumeros(d) +
    p('<b>¿Sigue en pie?</b> Contéstame «sí» a este correo o por WhatsApp. Y si te ha surgido algo, dímelo y buscamos otra hora.') +
    firma();
  return { asunto: asunto, html: documento(asunto, '¿Sigue en pie? Contesta con un «sí» y te espero.', cuerpo) };
}

// El mismo día, a las 9:00.
function dia(d, cita) {
  d = d || {}; cita = cita || {};
  const asunto = 'Hoy a las ' + (cita.hora || '') + ' · enlace de la videollamada';
  const cuerpo =
    saludo(d) +
    p('Hoy a las <b>' + esc(cita.hora || '') + '</b> nos vemos por videollamada.') +
    entrar(cita) +
    p('Si puedes, entra desde el ordenador: vamos a compartir pantalla y meter tus números en el simulador.', 'color:#5A5E66;') +
    queVeremos(d) +
    (cita.porTelefono ? p('Si prefieres por teléfono, te llamo yo al móvil a esa hora.') : '') +
    p('Si algo se complica, contesta a este correo y lo movemos, sin problema.') +
    firma() +
    pie('Te escribo porque tenemos una cita reservada para hoy.');
  return { asunto: asunto, html: documento(asunto, 'El enlace y lo que vamos a ver, en un vistazo.', cuerpo) };
}

module.exports = { datosDe: datosDe, confirmacion: confirmacion, vispera: vispera, dia: dia, etapa: etapa, SECTOR: SECTOR, FUGA_DICHA: FUGA_DICHA, volumenDe: volumenDe, fugaDe: fugaDe, sectorDe: sectorDe };

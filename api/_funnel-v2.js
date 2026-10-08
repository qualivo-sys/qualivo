// Funnel v2 (8-oct-2026) · formularios nativos nuevos con cuatro preguntas de
// negocio: solicitudes al mes, ticket, quién decide y cuándo (+ dolor opcional
// y una pregunta abierta). Diseño: Notion «Paid · Funnel v2», secciones 4, 13-16.
//
// MODO SOMBRA. Este módulo solo LEE las respuestas y devuelve etiquetas. No
// cambia ningún mensaje, ninguna cadencia ni ninguna llamada: el lead sigue por
// el mismo recorrido que los formularios actuales. Quién es «encaja» y quién
// «todavía no» se anota para compararlo después con lo que pasó de verdad; no
// descarta a nadie (revisión de la sección 15: los umbrales no tienen historia
// de ticket y habrían dejado fuera al único piloto).
//
// Los formularios viejos no se tocan: se reconocen los nuevos porque traen la
// pregunta de «quién decide» y la de solicitudes/pacientes; ninguno de los
// actuales las tiene. Apagado de urgencia: FUNNEL_V2=0.

// Claves que Paid debe dar a las preguntas al crear los formularios (la
// detección también funciona por el texto de la pregunta si Meta la convierte
// en otro slug).
const CLAVES = {
  volumen: ['solicitudes', 'pacientes', 'peticiones'],
  ticket: ['ticket', 'paga_de_media', 'vale_de_media', 'cuanto_paga', 'cuanto_vale', 'tratamiento', 'alumno'],
  decisor: ['decid', 'decis'],
  momento: ['momento', 'cuando', 'resolverlo'],
  dolor: ['dolor', 'que_te_pasa', 'te_cuesta', 'pasa_ahora'],
  abierta: ['cuentanos', 'cuéntanos', 'en_una_frase', 'abierta']
};

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9+<>]+/g, '_').replace(/^_+|_+$/g, '');
}

function campo(campos, trozos) {
  for (const c of campos || []) {
    const n = norm(c.name);
    if (trozos.some(function (t) { return n.indexOf(norm(t)) !== -1; })) {
      return String(((c.values || [])[0]) || '').trim();
    }
  }
  return '';
}

// Tramos de solicitudes al mes → 1..5 (punto medio en la tabla).
const PUNTO_VOLUMEN = { 1: 10, 2: 35, 3: 75, 4: 175, 5: 300 };
function tramoVolumen(v) {
  const s = norm(v);
  if (!s) return 0;
  if (/mas.*250|250_?\+|>250/.test(s)) return 5;
  if (/100.*250/.test(s)) return 4;
  if (/50.*99/.test(s)) return 3;
  if (/20.*49/.test(s)) return 2;
  if (/menos.*20|<_?20|^0.*19/.test(s)) return 1;
  return 0;
}

// Tramos de ticket (valor medio de un alumno o tratamiento) → 1..4.
const PUNTO_TICKET = { 1: 200, 2: 650, 3: 2000, 4: 4000 };
function tramoTicket(v) {
  const s = norm(v);
  if (!s) return 0;
  if (/mas.*3_?000|3_?000_?\+|>3_?000/.test(s)) return 4;
  if (/1_?000.*3_?000/.test(s)) return 3;
  if (/300.*1_?000/.test(s)) return 2;
  if (/menos.*300|<_?300/.test(s)) return 1;
  return 0;
}

function decisor(v) {
  const s = norm(v);
  if (!s) return '';
  if (/otra|otro/.test(s)) return 'otro';
  if (/socio|gerente/.test(s)) return 'socio';
  if (/^yo/.test(s)) return 'yo';
  return '';
}

function momento(v) {
  const s = norm(v);
  if (!s) return '';
  if (/adelante|mirando/.test(s)) return 'luego';
  if (/1.*3|meses/.test(s)) return '1-3';
  if (/este_mes|este/.test(s)) return 'mes';
  return '';
}

function dolor(v) {
  const s = norm(v);
  if (!s) return '';
  if (/no_lo_se|nose/.test(s)) return 'nose';
  if (/no_compran|compran|perdi|seguimiento/.test(s)) return 'seguimiento';
  if (/no_entran|suficientes|captacion/.test(s)) return 'captacion';
  if (/perfil|adecuad|calidad/.test(s)) return 'calidad';
  return '';
}

// Regla de Paid (sección 4.3): B si ≥ 50 solicitudes, o 20-49 con ticket ≥ 1.000 €;
// medio si 20-49 con ticket < 1.000 €; C si < 20.
function reglaPaid(vol, tic) {
  if (!vol) return '';
  if (vol >= 3) return 'b';
  if (vol === 2) return tic >= 3 ? 'b' : (tic ? 'medio' : '');
  return 'c';
}

// Regla de dinero en juego (sección 13.2.2 de Growth, umbrales PROVISIONALES):
// solicitudes × ticket con el punto medio de cada tramo.
function reglaDinero(vol, tic) {
  if (!vol || !tic) return '';
  const v = PUNTO_VOLUMEN[vol] * PUNTO_TICKET[tic];
  if (v >= 40000) return 'b';
  if (v >= 15000) return 'medio';
  return 'c';
}

// ¿Es un lead de los formularios nuevos?
function esV2(campos) {
  if (process.env.FUNNEL_V2 === '0') return false;
  const nombres = (campos || []).map(function (c) { return norm(c.name); });
  const hay = function (trozos) { return nombres.some(function (n) { return trozos.some(function (t) { return n.indexOf(norm(t)) !== -1; }); }); };
  return hay(CLAVES.decisor) && hay(CLAVES.volumen);
}

// Devuelve { etiquetas, nota, volumenLegado } o null si no es un formulario nuevo.
function desdeCampos(campos) {
  if (!esV2(campos)) return null;
  const vol = tramoVolumen(campo(campos, CLAVES.volumen));
  const tic = tramoTicket(campo(campos, CLAVES.ticket));
  const dec = decisor(campo(campos, CLAVES.decisor));
  const mom = momento(campo(campos, CLAVES.momento));
  const dol = dolor(campo(campos, CLAVES.dolor));
  const abierta = campo(campos, CLAVES.abierta);
  const paid = reglaPaid(vol, tic);
  const dinero = reglaDinero(vol, tic);

  // El scoring y el agente actuales leen las etiquetas vol-* con los tramos de
  // los formularios viejos (5-15, 20-50, 50-100, mas-de-100). Se traduce para
  // que el lead nuevo reciba el mismo trato que uno de los actuales. El tramo
  // exacto queda aparte en vol2-*.
  const LEGADO = { 1: '5-15', 2: '20-50', 3: '50-100', 4: 'mas-de-100', 5: 'mas-de-100' };
  const etiquetas = ['funnel-v2'];
  if (vol) { etiquetas.push('vol-' + LEGADO[vol], 'vol2-' + vol); }
  if (tic) etiquetas.push('ticket-' + tic);
  if (dec) etiquetas.push('decisor-' + dec);
  if (mom) etiquetas.push('momento-' + mom);
  if (dol) etiquetas.push('dolor-' + dol);
  if (paid) etiquetas.push('fit-paid-' + paid);
  if (dinero) etiquetas.push('fit-dinero-' + dinero);
  // Caso inequívoco (sección 16): menos de 20 solicitudes y ticket menor de
  // 1.000 €, o «más adelante, solo estoy mirando». Solo se ANOTA; no se envía
  // ningún «todavía no» hasta que Ops lo integre en la cadencia y Maikel lo apruebe.
  if ((vol === 1 && tic && tic <= 2) || mom === 'luego') etiquetas.push('todavia-no-candidato');
  if (dec === 'otro') etiquetas.push('pedir-decisor');
  if (abierta) etiquetas.push('cuentanos-si');

  const nota = ['Formulario del funnel v2 (modo sombra: solo etiquetas, la cadencia no cambia)', '',
    vol ? 'Solicitudes al mes: tramo ' + vol + ' de 5' : '',
    tic ? 'Ticket medio: tramo ' + tic + ' de 4' : '',
    dec ? 'Quién decide: ' + dec : '',
    mom ? 'Cuándo quiere resolverlo: ' + mom : '',
    dol ? 'Dolor declarado: ' + dol : '',
    paid ? 'Clasificación (regla de Paid): ' + paid.toUpperCase() : '',
    dinero ? 'Clasificación (dinero en juego, provisional): ' + dinero.toUpperCase() : '',
    abierta ? 'Con sus palabras: ' + abierta.slice(0, 400) : ''].filter(Boolean).join('\n');

  return { etiquetas: etiquetas, nota: nota, tramos: { vol: vol, tic: tic } };
}

module.exports = { desdeCampos: desdeCampos, esV2: esV2, tramoVolumen: tramoVolumen, tramoTicket: tramoTicket, reglaPaid: reglaPaid, reglaDinero: reglaDinero };

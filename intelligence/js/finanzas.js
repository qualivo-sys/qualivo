/* Finanzas (29-sep): solo en el modo real (/intelligence/?sector=qualivo&modo=real).
 * Lee /api/intelligence-datos?accion=finanzas, que a su vez lee la pestaña «FINANZAS · panel»
 * del Sheet financiero (la genera dashboard/finanzas.py). Ninguna cifra vive en este archivo:
 * todo llega con la sesión de Maikel. Responde a una pregunta: cuánto aire hay. */
(function () {
  'use strict';
  const QV = window.QV;
  const esc = function (s) { return QV.esc(s); };
  const API = '/api/intelligence-datos';
  let datos = null, error = '', cargando = false;

  function eur(v) {
    if (v == null || isNaN(v)) return '—';
    return (v < 0 ? '−' : '') + String(Math.round(Math.abs(v))).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
  }
  function cargar(fresco) {
    if (cargando) return;
    cargando = true; error = '';
    fetch(API + '?accion=finanzas' + (fresco ? '&fresco=1' : ''), { credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; }); })
      .then(function (d) { datos = d; })
      .catch(function (e) { error = e.message || String(e); })
      .then(function () { cargando = false; if (QV.estado.vista === 'finanzas') QV.pintarTodo(); });
  }

  function kpi(l, v, em, cls) {
    return '<div class="kpi"><span title="' + esc(l) + '">' + esc(l) + '</span><strong>' + v + '</strong><em class="' + (cls || '') + '">' + esc(em || '') + '</em></div>';
  }
  function tabla(titulo, sub, cab, filas) {
    if (!filas.length) return '';
    return '<div class="tarjeta fin-bloque"><h3>' + esc(titulo) + (sub ? '<span class="sub">' + esc(sub) + '</span>' : '') + '</h3>' +
      '<div class="tabla-caja" style="margin-top:10px;border:0"><table class="tabla"><thead><tr>' +
      cab.map(function (c) { return '<th' + (c.num ? ' class="num"' : '') + '>' + esc(c.t) + '</th>'; }).join('') +
      '</tr></thead><tbody>' + filas.join('') + '</tbody></table></div></div>';
  }
  function fila(celdas, total) {
    return '<tr' + (total ? ' class="fin-total"' : '') + '>' + celdas.map(function (c) { return '<td' + (c.num ? ' class="num"' : '') + '>' + c.h + '</td>'; }).join('') + '</tr>';
  }

  function vista() {
    const cab = '<div class="titulo-vista"><div><p class="pregunta-guia">¿Cuánto aire tengo?</p><h1>Finanzas</h1>' +
      '<p>' + (datos && datos.generado ? 'De la hoja de finanzas, actualizada el ' + esc(datos.generado) + '. ' : '') +
      '<button type="button" class="btn btn-mini" data-fin-recargar>Volver a leer la hoja</button></p></div></div>';
    if (!(QV.estado.cfg && QV.estado.cfg.real)) return cab + '<div class="tarjeta"><p class="gris">Las finanzas solo se ven con tus datos reales.</p></div>';
    if (!datos && !error) { cargar(false); return cab + '<div class="tarjeta"><p class="gris">Leyendo la hoja de finanzas…</p></div>'; }
    if (error && !datos) return cab + '<div class="tarjeta"><p class="gris">No se ha podido leer la hoja: ' + esc(error) + '</p></div>';

    const r = datos.resumen, F = datos.filas;
    const de = function (b) { return F.filter(function (f) { return f.bloque === b; }); };
    const esTotal = function (f) { return /^TOTAL/i.test(f.concepto) || f.estado === 'total'; };
    const neto = r.netoMes;

    const kpis = '<div class="kpis fin-kpis">' +
      kpi('En el banco', eur(r.cajaTotal), eur(r.disponible) + ' disponible') +
      kpi('Huchas (no tocar)', eur(r.reservado), eur(r.impuestos) + ' son de impuestos') +
      kpi('Entra al mes (recurrente)', eur(r.mrr), 'lo que facturan los clientes fijos') +
      kpi('Sale al mes', eur(r.salidaMes), eur(r.deudaMes) + ' son cuotas de deuda') +
      kpi('Resultado del mes', eur(neto), neto == null ? '' : neto >= 0 ? 'el mes se sostiene solo' : 'falta cada mes', neto == null ? '' : neto >= 0 ? 'bien' : 'mal') +
      '</div>';

    const frase = r.mesesMargen != null
      ? 'Con lo disponible y sin tocar las huchas, al ritmo de ahora hay <b>' + String(r.mesesMargen).replace('.', ',') + (r.mesesMargen === 1 ? ' mes' : ' meses') + '</b> de margen. Cada cliente nuevo de 800-1.000 €/mes los alarga.'
      : (neto != null && neto >= 0 ? 'Lo recurrente ya cubre lo que sale cada mes.' : '');
    const aire = '<div class="tarjeta fin-aire"><h3>' + QV.ico('euro') + 'Cuánto aire hay</h3><p>' + frase +
      (r.cobrosPendientes ? ' Pendiente de cobrar: <b>' + eur(r.cobrosPendientes) + '</b>.' : '') +
      (r.deudaTotal ? ' Deuda total: <b>' + eur(r.deudaTotal) + '</b>.' : '') + '</p></div>';

    const mrr = tabla('Clientes que pagan cada mes', 'MRR', [{ t: 'Cliente' }, { t: 'Al mes', num: true }, { t: 'Estado' }],
      de('MRR').map(function (f) { return fila([{ h: esc(f.concepto) }, { h: eur(f.importe), num: true }, { h: esc(f.estado + (f.nota ? ' · ' + f.nota : '')) }], esTotal(f)); }));
    const cobros = tabla('Pendiente de cobrar', '', [{ t: 'Qué' }, { t: 'Importe', num: true }, { t: 'Estado' }],
      de('COBROS').map(function (f) { return fila([{ h: esc(f.concepto) }, { h: eur(f.importe), num: true }, { h: esc(f.estado) }]); }));
    const gastos = tabla('Gastos fijos del mes', eur(r.gastosMes), [{ t: 'Concepto' }, { t: 'Al mes', num: true }],
      de('GASTOS').map(function (f) { return fila([{ h: esc(f.concepto) }, { h: eur(f.importe), num: true }]); }));
    const pagos = tabla('Salidas del mes', 'gastos + cuotas', [{ t: 'Concepto' }, { t: 'Al mes', num: true }, { t: 'Tipo' }],
      de('PAGOS').map(function (f) { return fila([{ h: esc(f.concepto) }, { h: eur(f.importe), num: true }, { h: esc(f.estado) }], esTotal(f)); }));
    const deudas = tabla('Deudas', 'plan de liquidación', [{ t: 'Deuda' }, { t: 'Pendiente', num: true }, { t: 'Cuota' }, { t: 'Vence' }],
      de('DEUDAS').map(function (f) { return fila([{ h: esc(f.concepto) }, { h: eur(f.importe), num: true }, { h: esc(f.estado) }, { h: esc(f.nota) }], esTotal(f)); }));
    const prestamo = tabla('Si pides un préstamo', 'escenarios', [{ t: 'Importe' }, { t: 'Cuota al mes', num: true }, { t: 'Lectura' }, { t: 'Coste' }],
      de('PRESTAMO').map(function (f) { return fila([{ h: esc(f.concepto) }, { h: eur(f.importe), num: true }, { h: esc(f.estado) }, { h: esc(f.nota) }]); }));
    const caja = tabla('Dónde está el dinero', '', [{ t: 'Cuenta' }, { t: 'Saldo', num: true }, { t: '' }],
      de('CAJA').map(function (f) { return fila([{ h: esc(f.concepto) }, { h: eur(f.importe), num: true }, { h: esc(f.estado) }], esTotal(f)); }));

    return cab + kpis + aire +
      '<div class="fin-rejilla">' + mrr + cobros + '</div>' +
      '<div class="fin-rejilla">' + pagos + deudas + '</div>' +
      '<div class="fin-rejilla">' + caja + prestamo + '</div>' +
      '<div class="fin-rejilla">' + gastos + '</div>' +
      '<p class="gris fin-pie">Los datos salen de la hoja de finanzas y se leen al abrir esta vista (se guardan 5 minutos). Para cambiar una cifra, cámbiala en la hoja.</p>';
  }

  document.addEventListener('click', function (e) {
    const b = e.target.closest && e.target.closest('[data-fin-recargar]');
    if (!b) return;
    e.preventDefault();
    datos = null; error = '';
    cargar(true);
    QV.pintarTodo();
  });

  QV.VISTA_FN.finanzas = vista;
})();

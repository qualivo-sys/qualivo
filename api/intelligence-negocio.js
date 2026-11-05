// Panel de negocio Qualivo · módulo de Qualivo Intelligence (qualivo.io/intelligence/negocio/).
// Encargo de Maikel (CEO) del 5-nov vía Chief of Staff; producto: Growth.
//
//   POST /api/intelligence-negocio?accion=entrar   { usuario, clave } → cookie de sesión
//   POST /api/intelligence-negocio?accion=salir                       → borra la cookie
//   GET  /api/intelligence-negocio?accion=yo                          → usuario y permisos
//   GET  /api/intelligence-negocio?seccion=resumen|paid|leads|outbound|crm|clientes|redes|finanzas
//        (&periodo=mes|mes_anterior|7d|30d|hoy|personalizado&desde=&hasta=&fresco=1)
//   POST /api/intelligence-negocio?accion=dato     { tipo, nombre, … } → guarda un dato manual
//   POST /api/intelligence-negocio?accion=ghl      { tipo, contacto, … } → una acción en GHL
//
// Reglas:
//   - Sin sesión, 401. Siempre Cache-Control: no-store. Todo se lee en el momento, con caché
//     corta en memoria; en el repositorio no hay ni un dato.
//   - Variables en Vercel: NEGOCIO_USUARIOS (usuario:contraseña;…), META_ADS_TOKEN o
//     META_LEADFORM_TOKEN, GHL_API_KEY, GHL_LOCATION_ID, SMARTLEAD_API_KEY o SMARTLEAD_KEY,
//     GOOGLE_SA_JSON (editor de la hoja «Facturación»).
//   - Escritura en GHL: solo desde los botones, de una en una, con GHL_PANEL_API_KEY y
//     NEGOCIO_ACCIONES=1, solo para los usuarios de NEGOCIO_ACCIONES_USUARIOS (por defecto
//     maikel). Cada acción deja nota «[Panel]» en el contacto y fila en «PANEL · registro».

const S = require('./_negocio-sesion.js');
const C = require('./_negocio-comun.js');
const M = require('./_negocio-meta.js');
const G = require('./_negocio-ghl.js');
const SL = require('./_negocio-smartlead.js');
const H = require('./_negocio-hoja.js');
const A = require('./_negocio-atribucion.js');

async function cuerpo(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  return {};
}
function err(e) { return String((e && e.message) || e).slice(0, 220); }

// Cada bloque por separado: si una fuente falla, el resto se ve igual.
async function seguro(fn) { try { return await fn(); } catch (e) { return { error: err(e) }; } }

async function seccion(nombre, q, usuario) {
  const fresco = String(q.fresco || '') === '1';
  const per = C.periodo(q);
  if (nombre === 'paid') {
    const [p, lg, emb] = await Promise.all([M.paid(per, fresco), seguro(function () { return G.leadsRango(per.desde, per.hasta, fresco); }), seguro(function () { return A.embudoPaid(per, fresco); })]);
    return Object.assign({}, p, { leadsGHL: lg, embudo: emb });
  }
  if (nombre === 'leads') {
    const l = await G.leads(q, fresco);
    const wa = await seguro(function () { return G.whatsappLeads(l.filas, 14, fresco); });
    return Object.assign({}, l, { whatsapp: wa.error ? {} : wa, errorWhatsapp: wa.error || null });
  }
  if (nombre === 'crm') {
    const [crm, opciones] = await Promise.all([G.crm(fresco), G.opcionesRC()]);
    return Object.assign({}, crm, { opcionesRC: opciones, acciones: { activas: G.accionesActivas(), puedes: S.puedeActuar(usuario) } });
  }
  if (nombre === 'outbound') return SL.outbound(per, fresco);
  if (nombre === 'redes') return M.instagram(String(q.cuenta || ''), fresco);
  if (nombre === 'clientes') {
    const manual = await seguro(function () { return H.clientesManual(); });
    const lista = Array.isArray(manual) ? manual : [];
    const meta = await M.clientes(lista.map(function (c) { return { cliente: c.cliente, ids: c.ids }; }), fresco);
    return { manual: lista, errorManual: manual && manual.error, sinCuenta: !H.hayCuenta(), meta: meta };
  }
  if (nombre === 'finanzas') {
    const hoy = C.diaMadrid(Date.now());
    const [fin, registro] = await Promise.all([
      H.finanzas(fresco, function () { return M.gastoMes(hoy, fresco); }),
      H.hayCuenta() ? H.leerRegistro() : []
    ]);
    return Object.assign({}, fin, { registro: registro });
  }
  if (nombre === 'resumen') {
    const mes = C.periodo({ periodo: 'mes' }), d7 = C.periodo({ periodo: '7d' });
    const hoyIso = C.diaMadrid(Date.now());
    const [paidMes, paid7, crm, ob, leads, rc, nuevos, hoy, fin, rcM] = await Promise.all([
      seguro(function () { return M.paid(mes, fresco); }),
      seguro(function () { return M.paid(d7, fresco); }),
      seguro(function () { return G.crm(fresco); }),
      seguro(function () { return SL.outbound(C.periodo({ periodo: '30d' }), fresco); }),
      seguro(async function () { const l = await G.leads({}, fresco); l.whatsapp = await G.whatsappLeads(l.filas, 7, fresco).catch(function () { return null; }); return l; }),
      seguro(function () { return G.rc(fresco); }),
      seguro(function () { return G.clientesNuevos(fresco); }),
      seguro(function () { return G.hoy(fresco); }),
      H.hayCuenta() ? seguro(function () { return H.finanzas(fresco, function () { return M.gastoMes(hoyIso, fresco); }); }) : { sinCuenta: true },
      seguro(function () { return G.rcMeta(fresco); })
    ]);
    const obj = objetivos();
    const kpis = {
      rcMes: rc.error ? null : rc.mes, rcSemana: rc.error ? null : rc.semana, objetivoRC: obj.rc,
      clientesNuevos: nuevos.error ? null : nuevos.n, objetivoClientes: obj.clientes,
      gastoMetaMes: paidMes.error ? null : paidMes.total.gasto, topeMeta: obj.topeMeta,
      cpl7: paid7.error ? null : paid7.total.cpl, cplObjetivo: obj.cpl, cplAlerta: obj.cplAlerta,
      rcMeta: rcM.error ? null : rcM.mes,
      costeRC: !paidMes.error && !rcM.error && rcM.mes >= obj.rcMinimo ? paidMes.total.gasto / rcM.mes : null,
      costeRCObjetivo: obj.costeRC, costeRCMax: obj.costeRCMax, rcMinimo: obj.rcMinimo,
      mrr: fin && fin.kpis ? fin.kpis.mrr : null,
      caja: fin && fin.kpis ? fin.kpis.banco : null, sinHoja: !!(fin && fin.sinCuenta)
    };
    const opcionesRC = await G.opcionesRC();
    return {
      kpis: kpis, paid: paidMes, crm: crm, outbound: ob, leads: leads, hoy: hoy,
      acciones: { activas: G.accionesActivas(), puedes: S.puedeActuar(usuario) }, opcionesRC: opcionesRC, embudos: crm.embudos || [],
      errores: { rc: rc.error, clientes: nuevos.error, hoy: hoy.error, finanzas: fin && fin.error },
      alertas: alertas({ paid7: paid7, paidMes: paidMes, crm: crm, ob: ob, rc: rc, hoy: hoy, fin: fin, rcMeta: rcM, leads: leads }, obj),
      generado: Date.now()
    };
  }
  throw Object.assign(new Error('Sección desconocida.'), { status: 404 });
}

// Objetivos y umbrales: en variables de Vercel (plan de Growth), no en el código.
function objetivos() {
  const n = function (k, def) { const v = Number(process.env[k]); return isFinite(v) && v > 0 ? v : def; };
  return {
    // Cifras de Paid (5-nov): CPL objetivo ≤ 50 €, alerta si la media de 7 días pasa de 60 €;
    // coste por RC de Meta: objetivo ≤ 170 €, máximo 330 €, solo con 2 RC o más en el mes.
    cpl: n('PANEL_CPL_OBJETIVO', 50),
    cplAlerta: n('PANEL_CPL_ALERTA', 60),
    costeRC: n('PANEL_COSTE_RC_OBJETIVO', 170),
    costeRCMax: n('PANEL_COSTE_RC_MAX', 330),
    rcMinimo: n('PANEL_RC_MINIMO_COSTE', 2),
    topeMeta: n('PANEL_TOPE_META', 1000),
    rc: n('PANEL_OBJETIVO_RC', 20),
    clientes: n('PANEL_OBJETIVO_CLIENTES', 2),
    rcSemana: n('PANEL_RC_SEMANA_MIN', 4),
    rebote: n('NEGOCIO_REBOTE_MAX', 0.03)
  };
}

// Alertas v1 (reglas exactas del plan de Growth, 5-nov), máximo 7 y por impacto.
// Cada una: qué ha pasado → evidencia → causa probable → impacto → acción → responsable → fecha.
function alertas(d, obj) {
  const out = [];
  const hoy = C.diaMadrid(Date.now());
  const n2 = function (n) { return n == null ? '—' : (Math.round(n * 100) / 100).toLocaleString('es-ES'); };
  const eur = function (n) { return n2(n) + ' €'; };
  const add = function (a) { out.push(Object.assign({ fecha: hoy }, a)); };
  // 1. CPL alto (7 días)
  if (d.paid7 && !d.paid7.error && d.paid7.total.cpl != null && d.paid7.total.cpl > obj.cplAlerta) {
    add({ peso: 80, nivel: 'alta', que: 'CPL de Meta por encima del límite', evidencia: 'CPL de 7 días: ' + eur(d.paid7.total.cpl) + ' (alerta a partir de ' + eur(obj.cplAlerta) + ', objetivo ' + eur(obj.cpl) + '), ' + d.paid7.total.leads + ' leads con ' + eur(d.paid7.total.gasto), causa: 'Anuncios cansados o público que no convierte', impacto: 'Menos leads por el mismo presupuesto', accion: 'Revisar en Paid los anuncios con más gasto y peor CPL', responsable: 'Paid', ir: 'paid' });
  }
  // 2. Anuncio que gasta sin leads (7 días, gasto ≥ 2× CPL objetivo)
  if (d.paid7 && !d.paid7.error) {
    (d.paid7.anuncios || []).filter(function (a) { return a.leads === 0 && a.gasto >= 2 * obj.cpl; }).slice(0, 2).forEach(function (a) {
      add({ peso: 75, nivel: 'alta', que: 'Anuncio que gasta sin traer leads', evidencia: '«' + a.anuncio + '»: ' + eur(a.gasto) + ' en 7 días y 0 leads (' + a.estado + ')', causa: 'Creatividad o formulario que no convierte', impacto: eur(a.gasto) + ' sin retorno', accion: 'Pausarlo o cambiar la creatividad', responsable: 'Paid', ir: 'paid' });
    });
  }
  // 3. Tope de Meta (≥ 85 % del tope mensual)
  if (d.paidMes && !d.paidMes.error && d.paidMes.total.gasto >= 0.85 * obj.topeMeta) {
    add({ peso: 70, nivel: d.paidMes.total.gasto >= obj.topeMeta ? 'alta' : 'media', que: 'Meta cerca del tope del mes', evidencia: eur(d.paidMes.total.gasto) + ' gastados de ' + eur(obj.topeMeta) + ' (' + Math.round(d.paidMes.total.gasto / obj.topeMeta * 100) + ' %)', causa: 'Ritmo de gasto por encima del plan', impacto: 'Se pasa del presupuesto del mes', accion: 'Bajar presupuestos diarios o decidir subir el tope', responsable: 'Paid / Maikel', ir: 'paid' });
  }
  // Coste por RC de Meta (Paid): mes en curso, con 2 RC o más
  if (d.paidMes && !d.paidMes.error && d.rcMeta && !d.rcMeta.error && d.rcMeta.mes >= obj.rcMinimo) {
    const coste = d.paidMes.total.gasto / d.rcMeta.mes;
    if (coste > obj.costeRCMax) add({ peso: 82, nivel: 'alta', que: 'Cada RC de Meta cuesta más de lo que cubre el primer pago', evidencia: eur(coste) + ' por RC (' + eur(d.paidMes.total.gasto) + ' / ' + d.rcMeta.mes + ' RC); máximo ' + eur(obj.costeRCMax) + ', objetivo ' + eur(obj.costeRC), causa: 'Leads que no llegan a reunión con encaje', impacto: 'Captar un cliente por Meta deja de ser rentable', accion: 'Revisar con Paid los anuncios y el filtro del formulario', responsable: 'Paid', ir: 'paid' });
  }
  // Lead sin contactar (Growth): lead de los últimos 7 días, más de 2 horas después del alta, sin
  // primer WhatsApp o con el primero fallido (estado real del mensaje, no la etiqueta)
  if (d.leads && !d.leads.error && d.leads.whatsapp) {
    const ahora = Date.now();
    const sin = d.leads.filas.filter(function (f) { const w = d.leads.whatsapp[f.id]; return w && f.alta && ahora - f.alta > 2 * 3600000 && /sin whatsapp|fallido/i.test(w.estado); });
    if (sin.length) add({ peso: 86, nivel: 'alta', que: sin.length === 1 ? '1 lead sin contactar' : sin.length + ' leads sin contactar', evidencia: sin.slice(0, 5).map(function (f) { return f.empresa + ' (' + f.nivel + ', ' + d.leads.whatsapp[f.id].estado.toLowerCase() + ')'; }).join(' · '), causa: 'El primer WhatsApp no salió o falló', impacto: 'Lead que se enfría en las primeras horas', accion: 'Escribirle o llamarle hoy y revisar la pasarela de WhatsApp', responsable: 'Maikel', ir: 'leads' });
  }
  // 4. Ofertas paradas (Oferta, Negociación o Segunda reunión > 14 días)
  if (d.crm && !d.crm.error) {
    const of = (d.crm.avanzadas || []).filter(function (o) { return o.parada && /oferta|propuesta|negociaci|segunda reuni/i.test(o.etapa); });
    if (of.length) add({ peso: 90, nivel: 'alta', que: of.length === 1 ? '1 oferta parada más de ' + d.crm.diasParada + ' días' : of.length + ' ofertas paradas más de ' + d.crm.diasParada + ' días', evidencia: of.slice(0, 4).map(function (o) { return o.nombre + ' (' + o.etapa + ', ' + o.dias + ' d)'; }).join(' · '), causa: 'Sin siguiente paso fijado', impacto: 'Ventas que se enfrían', accion: 'Llamar hoy y mover de etapa o cerrar como perdida', responsable: 'Maikel', ir: 'crm' });
  }
  // 5. Reunión sin resultado (cita pasada > 24 h)
  if (d.hoy && !d.hoy.error && (d.hoy.sinResultado || []).length) {
    const s = d.hoy.sinResultado;
    add({ peso: 85, nivel: 'alta', que: s.length === 1 ? '1 reunión sin resultado marcado' : s.length + ' reuniones sin resultado marcado', evidencia: s.slice(0, 4).map(function (r) { return r.nombre + ' (' + r.dia.slice(8) + '/' + r.dia.slice(5, 7) + ')'; }).join(' · '), causa: 'No se apuntó cómo fue', impacto: 'El recuento de RC y el embudo quedan cojos', accion: 'Marcar el resultado y, si fue cualificada, marcar RC', responsable: 'Maikel', ir: 'crm' });
  }
  // 6. Facturas sin cobrar (pendientes y vencidas)
  if (d.fin && d.fin.facturas) {
    const pend = d.fin.facturas.filas.filter(function (f) { return /pendiente|por cobrar|vencid|retras|impag/i.test(f.estado) && !/cobrad|pagad/i.test(f.estado) && (/vencid|retras|impag/i.test(f.estado) || hoy.slice(8) > '15'); });
    if (pend.length) add({ peso: 78, nivel: 'alta', que: pend.length === 1 ? '1 factura del mes sin cobrar' : pend.length + ' facturas del mes sin cobrar', evidencia: pend.slice(0, 4).map(function (f) { return f.cliente + ' (' + eur(f.total) + ', ' + f.estado + ')'; }).join(' · '), causa: 'Cobro pendiente del cliente', impacto: 'Caja del mes', accion: 'Reclamar el cobro', responsable: 'CFO', ir: 'finanzas' });
  }
  // 7. Ritmo de reuniones (RC de la semana < 4 el viernes o después)
  const dow = new Date(hoy + 'T12:00:00Z').getUTCDay();
  if (d.rc && !d.rc.error && (dow === 5 || dow === 6 || dow === 0) && d.rc.semana < obj.rcSemana) {
    add({ peso: 88, nivel: 'alta', que: 'Pocas reuniones cualificadas esta semana', evidencia: d.rc.semana + ' RC esta semana (mínimo ' + obj.rcSemana + '); ' + d.rc.mes + ' en el mes de ' + obj.rc, causa: 'Poca agenda desde captación y outbound', impacto: 'No llegar al objetivo del mes', accion: 'Reactivar la base y empujar outbound la semana que viene', responsable: 'CoS', ir: 'resumen' });
  }
  // Fase 2: rebote de Smartlead > 3 % en una campaña activa
  if (d.ob && !d.ob.error && !d.ob.sinClave) {
    (d.ob.campanas || []).filter(function (c) { return c.estado === 'Activa' && c.cliente === 'Qualivo' && c.enviados > 200 && c.tasaRebote > obj.rebote; }).slice(0, 2).forEach(function (c) {
      add({ peso: 60, nivel: 'media', que: 'Rebote alto en «' + c.campana + '»', evidencia: n2(c.tasaRebote * 100) + ' % sobre ' + c.enviados + ' enviados (máximo ' + n2(obj.rebote * 100) + ' %)', causa: 'Lista con correos sin verificar', impacto: 'Reputación de los buzones', accion: 'Pausar la campaña y verificar la lista', responsable: 'Outbound', ir: 'outbound' });
    });
  }
  return out.sort(function (a, b) { return b.peso - a.peso; }).slice(0, 7);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  const q = req.query || {};
  const accion = String(q.accion || '');

  if (!S.configurada()) return res.status(503).json({ error: 'El panel no tiene usuarios configurados (NEGOCIO_USUARIOS en Vercel).' });

  if (req.method === 'POST' && accion === 'entrar') {
    const ip = S.ipDe(req);
    if (S.bloqueada(ip)) return res.status(429).json({ error: 'Demasiados intentos. Prueba dentro de 15 minutos.' });
    const b = await cuerpo(req);
    const u = S.comprobar(b.usuario, b.clave);
    if (!u) { S.fallo(ip); return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' }); }
    res.setHeader('Set-Cookie', S.cookieSesion(u));
    return res.status(200).json({ ok: true, usuario: u });
  }
  if (req.method === 'POST' && accion === 'salir') {
    res.setHeader('Set-Cookie', S.cookieBorrar());
    return res.status(200).json({ ok: true });
  }

  const usuario = S.usuario(req);
  if (!usuario) return res.status(401).json({ error: 'Sin sesión.' });

  // Las escrituras exigen JSON y mismo origen (además de SameSite=Strict).
  if (req.method === 'POST') {
    const ct = String((req.headers && req.headers['content-type']) || '');
    const origen = String((req.headers && (req.headers.origin || req.headers.referer)) || '');
    const host = String((req.headers && req.headers.host) || '');
    if (ct.indexOf('application/json') < 0 || (origen && host && origen.replace(/^https?:\/\//, '').split('/')[0] !== host)) return res.status(403).json({ error: 'Petición no permitida.' });
  }

  try {
    if (req.method === 'GET' && accion === 'yo') {
      return res.status(200).json({ usuario: usuario, puedeActuar: S.puedeActuar(usuario), accionesActivas: G.accionesActivas(), hoja: H.hayCuenta() });
    }
    if (req.method === 'POST' && accion === 'dato') {
      if (!H.hayCuenta()) return res.status(503).json({ error: 'Falta GOOGLE_SA_JSON en Vercel: no hay dónde guardar.' });
      const b = await cuerpo(req);
      await H.guardarManual(b, usuario);
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'POST' && accion === 'ghl') {
      if (!S.puedeActuar(usuario)) return res.status(403).json({ error: 'Tu usuario no puede hacer acciones en GHL.' });
      const b = await cuerpo(req);
      let r, fallo = null;
      try { r = await G.accion(b, usuario); } catch (e) { fallo = e; }
      // Registro de quién hizo qué (también si falló)
      if (H.hayCuenta()) {
        try { await H.registrar({ usuario: usuario, accion: String(b.tipo || ''), contacto: b.contacto, oportunidad: b.oportunidad, resumen: r ? r.resumen : err(fallo), resultado: r ? 'ok' : 'error' }); }
        catch (e) { if (r) r.avisoRegistro = 'Hecho en GHL, pero no se pudo apuntar en el registro: ' + err(e); }
      }
      if (fallo) return res.status(fallo.status || 502).json({ error: err(fallo) });
      return res.status(200).json(r);
    }
    if (req.method === 'GET' && q.seccion) {
      return res.status(200).json(await seccion(String(q.seccion), q, usuario));
    }
    return res.status(404).json({ error: 'No encontrado.' });
  } catch (e) {
    return res.status(e.status || 502).json({ error: err(e) });
  }
};

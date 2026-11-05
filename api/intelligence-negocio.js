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
  if (nombre === 'paid') return M.paid(per, fresco);
  if (nombre === 'leads') return G.leads(q, fresco);
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
    const mes = C.periodo({ periodo: 'mes' });
    const [paid, crm, ob, leads] = await Promise.all([
      seguro(function () { return M.paid(per.clave === 'mes' ? mes : per, fresco); }),
      seguro(function () { return G.crm(fresco); }),
      seguro(function () { return SL.outbound(C.periodo({ periodo: '30d' }), fresco); }),
      seguro(function () { return G.leads({}, fresco); })
    ]);
    return { paid: paid, crm: crm, outbound: ob, leads: leads, alertas: alertas(paid, crm, ob, leads), generado: Date.now() };
  }
  throw Object.assign(new Error('Sección desconocida.'), { status: 404 });
}

// Alertas del resumen: qué ha pasado → evidencia → acción → responsable.
// Umbrales en variables de entorno para que Growth los ajuste sin tocar código.
function alertas(paid, crm, ob, leads) {
  const out = [];
  const CPL_MAX = Number(process.env.NEGOCIO_CPL_MAX || 60);
  const REBOTE_MAX = Number(process.env.NEGOCIO_REBOTE_MAX || 0.03);
  const fmt = function (n) { return n == null ? '—' : (Math.round(n * 100) / 100).toLocaleString('es-ES'); };
  if (paid && !paid.error && paid.total) {
    const t = paid.total;
    if (t.cpl != null && t.cpl > CPL_MAX) out.push({ nivel: 'alta', que: 'El coste por lead de Meta está por encima del objetivo', evidencia: 'CPL de ' + fmt(t.cpl) + ' € en ' + paid.periodo.etiqueta.toLowerCase() + ' (objetivo: ' + CPL_MAX + ' €) con ' + t.leads + ' leads', accion: 'Revisar los anuncios con más gasto y menos leads en Paid y pausar o cambiar creatividad', responsable: 'Paid' });
    if (t.gasto > 50 && !t.leads) out.push({ nivel: 'alta', que: 'Meta gasta sin traer leads', evidencia: fmt(t.gasto) + ' € gastados y 0 leads en ' + paid.periodo.etiqueta.toLowerCase(), accion: 'Comprobar el formulario, el píxel y los anuncios activos', responsable: 'Paid' });
    const hoy = C.diaMadrid(Date.now());
    const ayer = (paid.dias || []).filter(function (d) { return d.dia === C.sumarDias(hoy, -1); })[0];
    if (ayer && ayer.gasto === 0 && (paid.anuncios || []).some(function (a) { return a.estado === 'Activo'; })) out.push({ nivel: 'media', que: 'Ayer Meta no gastó nada', evidencia: 'Gasto 0 € el ' + ayer.dia + ' con anuncios activos', accion: 'Mirar si la tarjeta falló o la cuenta está limitada', responsable: 'Paid' });
  }
  if (crm && !crm.error) {
    const av = (crm.avanzadas || []).filter(function (o) { return o.parada; });
    if (av.length) out.push({ nivel: 'alta', que: av.length + ' oportunidades avanzadas llevan más de ' + crm.diasParada + ' días sin moverse', evidencia: av.slice(0, 4).map(function (o) { return o.nombre + ' (' + o.etapa + ', ' + o.dias + ' d)'; }).join(' · '), accion: 'Llamar o escribir hoy y mover de etapa o cerrar como perdida', responsable: 'Maikel' });
    if (crm.paradas > 20) out.push({ nivel: 'media', que: 'El CRM acumula oportunidades paradas', evidencia: crm.paradas + ' de ' + crm.abiertas + ' abiertas llevan más de ' + crm.diasParada + ' días en la misma etapa', accion: 'Limpieza semanal: cerrar las muertas y reactivar las tibias', responsable: 'Growth' });
  }
  if (ob && !ob.error && !ob.sinClave) {
    (ob.campanas || []).filter(function (c) { return c.estado === 'Activa' && c.cliente === 'Qualivo' && c.enviados > 200 && c.tasaRebote > REBOTE_MAX; }).slice(0, 3).forEach(function (c) {
      out.push({ nivel: 'alta', que: 'Rebote alto en «' + c.campana + '»', evidencia: fmt(c.tasaRebote * 100) + ' % de rebote sobre ' + c.enviados + ' enviados (máximo ' + fmt(REBOTE_MAX * 100) + ' %)', accion: 'Pausar la campaña y verificar la lista antes de seguir enviando', responsable: 'Outbound' });
    });
    const d = (ob.dias || []).filter(function (x) { return x.dia < C.diaMadrid(Date.now()); }).slice(-3);
    const laborables = d.filter(function (x) { const w = new Date(x.dia + 'T12:00:00Z').getUTCDay(); return w > 0 && w < 6; });
    if (laborables.length && laborables.every(function (x) { return x.enviados === 0; })) out.push({ nivel: 'alta', que: 'Outbound no está enviando', evidencia: '0 correos en los últimos días laborables', accion: 'Revisar buzones y campañas activas en Smartlead', responsable: 'Outbound' });
  }
  if (leads && !leads.error && leads.filas) {
    const hace7 = C.sumarDias(C.diaMadrid(Date.now()), -7);
    const ab = leads.filas.filter(function (f) { return f.fecha >= hace7 && (f.nivel === 'A' || f.nivel === 'B') && /sin oportunidad|nuevo lead/i.test(f.estado); });
    if (ab.length) out.push({ nivel: 'media', que: ab.length === 1 ? '1 lead A o B de esta semana sigue sin tratar' : ab.length + ' leads A o B de esta semana siguen sin tratar', evidencia: ab.slice(0, 5).map(function (f) { return f.empresa + ' (' + f.nivel + ')'; }).join(' · '), accion: 'Llamarlos antes de 24 horas', responsable: 'Maikel' });
  }
  return out;
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

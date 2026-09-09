// Recibe el resultado del diagnóstico «¿Dónde se está rompiendo tu crecimiento?» y crea
// o actualiza el contacto en GoHighLevel con sus cinco dimensiones, el cuello de botella
// principal, el síntoma concreto y su perfil. Mismas credenciales que /api/lead.
//
// Modo anónimo (enlace de outbound `?l=<id de contacto en GoHighLevel>`): el navegador
// manda el resultado sin formulario; se etiqueta el contacto (radiografia-anonima,
// cuello-*, nivel-*), se anota y se suma la puntuación de señal. Sin correo ni oportunidad.
// Recorrido completo en sistema/radiografia-recorrido.md (rama del cerebro).

const R = require('./_radiografia');
const META = require('./_meta');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Pipeline «Qualivo Pipeline» de GoHighLevel: cada lead del diagnóstico entra como
// oportunidad en «Nuevo Lead»; los prioritarios, directamente en «Contactado».
const PIPELINE_ID = '980j4DzvOwp7aDmkk2ZA';
const STAGE_NUEVO = 'fa70d288-c614-40ad-9e67-df04f4da3443';
const STAGE_CONTACTADO = 'd08bc03a-1b25-4732-9b5f-3cb7295bfd94';
const RESERVA = 'https://api.leadconnectorhq.com/widget/booking/zBlsw8BEKA2zah81YlOl';
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';
const CAMPO_SENAL = 'Señal · puntuación';   // campo numérico del contacto (se crea si no existe)
const ICP1_SECTOR = 'Servicios profesionales (asesoría, consultoría, abogados)'; // ICP 1: despachos y servicios profesionales
let campoSenalId = null;
let etapasCache = { t: 0, porNombre: {} };

const DIMS = ['captacion', 'conversion', 'seguimiento', 'dependencia', 'control'];
const SINTOMAS = ['demanda', 'predecible', 'visibilidad', 'velocidad', 'cierre', 'presupuestos',
  'perdidos', 'dueno', 'sin-registro', 'origen', 'sin-revision'];
const NIVELES = ['critico', 'relevante', 'leve'];
const EMPLEADOS = ['', 'Solo yo', '2 a 5', '6 a 20', 'Más de 20'];
const VALORES = ['', 'Menos de 500 €', '500 a 2.000 €', '2.000 a 10.000 €', 'Más de 10.000 €', 'No lo sé'];
const ROLES = ['', 'Dueño o socio', 'Dirijo ventas o marketing', 'Otro'];
const SECTORES = ['', 'Servicios profesionales (asesoría, consultoría, abogados)', 'Reformas, construcción o instalaciones',
  'Salud, clínica o bienestar', 'Formación o academia', 'Industria, taller o fabricación',
  'Agencia o estudio (marketing, diseño, software)', 'Comercio o tienda', 'Hostelería o turismo', 'Otro'];

const NOMBRE_SINTOMA = {
  'demanda': 'No llegan suficientes oportunidades', 'predecible': 'No puede generar oportunidades a voluntad',
  'visibilidad': 'No le encuentran', 'velocidad': 'Contesta tarde', 'cierre': 'Cierra pocos presupuestos',
  'presupuestos': 'No persigue los presupuestos', 'perdidos': 'Los «ahora no» se pierden',
  'dueno': 'Todo pasa por el dueño', 'sin-registro': 'Lo pendiente no está escrito',
  'origen': 'No sabe qué canal trae ventas', 'sin-revision': 'No revisa los números'
};

const SECTOR_SLUG = {
  'Servicios profesionales (asesoría, consultoría, abogados)': 'servicios-profesionales',
  'Reformas, construcción o instalaciones': 'reformas-construccion',
  'Salud, clínica o bienestar': 'salud',
  'Formación o academia': 'formacion',
  'Industria, taller o fabricación': 'industria',
  'Agencia o estudio (marketing, diseño, software)': 'agencia',
  'Comercio o tienda': 'comercio',
  'Hostelería o turismo': 'hosteleria',
  'Otro': 'otro'
};

// Un lead es prioritario cuando el cuello de botella es crítico, la empresa cae dentro
// del ICP y el valor de cliente justifica la conversación. Se avisa al momento.
function esPrioritario(b) {
  return b.nivel === 'critico' && b.rol !== 'Otro' &&
    (b.empleados === '2 a 5' || b.empleados === '6 a 20') &&
    (b.valor_cliente === '2.000 a 10.000 €' || b.valor_cliente === 'Más de 10.000 €');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    console.error('[dx] Faltan GHL_API_KEY o GHL_LOCATION_ID en el entorno');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim();
  const email = String(b.email || '').trim();
  const cuello = String(b.cuello || '');
  const segunda = String(b.segunda || '');
  const sintoma = String(b.sintoma || '');
  const nivel = String(b.nivel || '');
  const total = Number.isInteger(b.total) ? b.total : null;
  const maximo = Number.isInteger(b.maximo) ? b.maximo : null;
  const completo = b.completo === true;
  const dims = b.dims || {};
  const empleados = String(b.empleados || '');
  const valorCliente = String(b.valor_cliente || '');
  const sector = String(b.sector || '');
  const rol = String(b.rol || '');
  let telefono = String(b.telefono || '').replace(/[^\d+]/g, '');
  if (telefono && /^\d{9}$/.test(telefono)) telefono = '+34' + telefono;
  const telefonoOk = !telefono || /^\+\d{9,15}$/.test(telefono);
  const leadId = /^[A-Za-z0-9]{10,40}$/.test(String(b.l || '')) ? String(b.l) : '';
  const anonimo = b.anonimo === true;
  const utm = (b.utm && typeof b.utm === 'object') ? b.utm : {};
  // Identificador del evento que también dispara el píxel del navegador (deduplicación en Meta)
  const eventoId = /^[a-z0-9-]{8,48}$/.test(String(b.evento_id || '')) ? String(b.evento_id) : '';
  const utmOk = Object.keys(utm).every(function (k) { return /^(utm_(source|medium|campaign|content|term)|ref)$/.test(k) && typeof utm[k] === 'string' && utm[k].length <= 80; });

  const dimsOk = DIMS.every(function (e) {
    return dims[e] === null || (Number.isInteger(dims[e]) && dims[e] >= 0 && dims[e] <= 100);
  }) && Number.isInteger(dims[cuello]);

  const identidadOk = anonimo ? !!leadId : (nombre && EMAIL_RE.test(email) && b.rgpd === true);
  if (!identidadOk ||
      !DIMS.includes(cuello) || (segunda && !DIMS.includes(segunda)) || !NIVELES.includes(nivel) ||
      (sintoma && !SINTOMAS.includes(sintoma)) || !dimsOk ||
      total === null || maximo === null || total < 0 || maximo < 0 ||
      total > 33 || maximo > 33 || total > maximo ||
      !EMPLEADOS.includes(empleados) || !VALORES.includes(valorCliente) || !SECTORES.includes(sector) ||
      !ROLES.includes(rol) || !utmOk || !telefonoOk) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  const prioritario = esPrioritario({ nivel, empleados, valor_cliente: valorCliente, rol });

  const ghlHeaders = {
    Authorization: 'Bearer ' + apiKey,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };

  const hoy = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const icp1 = sector === ICP1_SECTOR;

  // ── Modo anónimo: resultado sobre un contacto que ya existe (outbound) ──
  if (anonimo) {
    try {
      const cr = await fetch(GHL_BASE + '/contacts/' + leadId, { headers: ghlHeaders });
      if (!cr.ok) return res.status(404).json({ ok: false, error: 'contacto_desconocido' });
      const contacto = (await cr.json()).contact || {};
      if (contacto.locationId && contacto.locationId !== locationId) return res.status(404).json({ ok: false, error: 'contacto_desconocido' });
      const tagsA = ['radiografia-anonima', 'cuello-' + cuello, 'nivel-' + nivel, 'dx-' + hoy];
      if (segunda) tagsA.push('segunda-' + segunda);
      if (sintoma) tagsA.push('sintoma-' + sintoma);
      if (utm.utm_source) tagsA.push('utm-' + String(utm.utm_source).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30));
      const yaTenia = (contacto.tags || []).map(String);
      await limpiarResultadoAnterior(leadId, yaTenia, tagsA, ghlHeaders).catch(function () {});
      const tg = await fetch(GHL_BASE + '/contacts/' + leadId + '/tags', { method: 'POST', headers: ghlHeaders, body: JSON.stringify({ tags: tagsA }) });
      if (!tg.ok) throw new Error('tags ' + tg.status);
      const notaA = ['Radiografía (sin formulario, enlace de outbound) · ' + new Date().toISOString(),
        'Cuello de botella: ' + R.NOMBRE[cuello] + ' (' + nivel + ')' + (segunda ? ' · segunda: ' + R.NOMBRE[segunda] : ''),
        DIMS.map(function (e) { return R.NOMBRE[e] + ' ' + (dims[e] === null ? '—' : dims[e] + '/100'); }).join(' · '),
        rol || empleados || valorCliente ? 'Perfil: ' + [rol, empleados, valorCliente].filter(Boolean).join(' · ') : ''].filter(Boolean).join('\n');
      await fetch(GHL_BASE + '/contacts/' + leadId + '/notes', { method: 'POST', headers: ghlHeaders, body: JSON.stringify({ body: notaA }) });
      // Puntuación de señal: +40 por radiografía (una vez), +10 si ICP 1
      const primera = !yaTenia.includes('radiografia-anonima') && !yaTenia.includes('diagnostico-crecimiento');
      const esIcp1 = yaTenia.some(function (t) { return /^icp-?0?1$/.test(t); });
      if (primera) await sumarSenal(leadId, 40 + (esIcp1 ? 10 : 0), locationId, ghlHeaders).catch(function (err) { console.error('[dx] señal no sumada', err); });
      return res.status(200).json({ ok: true, anonimo: true });
    } catch (err) {
      console.error('[dx] Modo anónimo falló:', err);
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
  }

  const tags = ['qualivo-landing', 'diagnostico-crecimiento', 'cuello-' + cuello, 'nivel-' + nivel];
  if (icp1) tags.push('icp-1');
  if (segunda) tags.push('segunda-' + segunda);
  if (sintoma) tags.push('sintoma-' + sintoma);
  if (sector) tags.push('sector-' + SECTOR_SLUG[sector]);
  if (rol) tags.push('rol-' + (rol === 'Dueño o socio' ? 'dueno' : rol === 'Otro' ? 'otro' : 'directivo'));
  if (utm.utm_source) tags.push('utm-' + String(utm.utm_source).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30));
  if (telefono) tags.push('con-whatsapp');
  tags.push('dx-' + new Date().toISOString().slice(0, 10).replace(/-/g, ''));
  if (completo) tags.push('diagnostico-completo');
  if (prioritario) tags.push('prioridad-alta');

  try {
    const upsertRes = await fetch(GHL_BASE + '/contacts/upsert', {
      method: 'POST',
      headers: ghlHeaders,
      body: JSON.stringify({
        locationId: locationId,
        name: nombre,
        email: email,
        phone: telefono || undefined,
        source: 'qualivo.io — dónde se rompe tu crecimiento',
        tags: tags
      })
    });
    if (!upsertRes.ok) {
      console.error('[dx] GHL upsert falló', upsertRes.status, (await upsertRes.text()).slice(0, 500));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;
    // ¿Ya había hecho la radiografía otro día? (etiqueta dx-AAAAMMDD anterior a hoy)
    const yaHizo = (((upsert || {}).contact || {}).tags || []).some(function (t) { return /^dx-\d{8}$/.test(String(t)) && String(t) !== 'dx-' + hoy; });
    if (contactId) await limpiarResultadoAnterior(contactId, ((upsert || {}).contact || {}).tags, tags, ghlHeaders).catch(function () {});

    if (contactId) {
      const detalle = DIMS.map(function (e) {
        const p = dims[e];
        if (p === null || p === undefined) return '· ' + R.NOMBRE[e] + ': sin contestar';
        return '· ' + R.NOMBRE[e] + ': ' + p + '/100 (' + R.etiqueta(p).toUpperCase() + ')';
      }).join('\n');

      const nota = [
        'Diagnóstico «¿Dónde se está rompiendo tu crecimiento?» — qualivo.io',
        '',
        'CUELLO DE BOTELLA: ' + R.NOMBRE[cuello] + ' (' + nivel + ')',
        'Síntoma concreto: ' + (NOMBRE_SINTOMA[sintoma] || sintoma || '—'),
        segunda ? 'Segunda más floja: ' + R.NOMBRE[segunda] : '',
        'Puntos: ' + total + '/' + maximo,
        completo ? 'Diagnóstico completo (11 preguntas)' : 'Diagnóstico parcial: se fue antes de terminar',
        prioritario ? '>>> LEAD PRIORITARIO: contactar en 24 h <<<' : '',
        '',
        'Perfil:',
        '· Papel: ' + (rol || 'no indicado'),
        '· WhatsApp: ' + (telefono || 'no dejado'),
        '· Personas en la empresa: ' + empleados,
        '· Valor de un cliente al año: ' + valorCliente,
        '· Sector: ' + (sector || 'no indicado'),
        '',
        'Puntuación por dimensión:',
        detalle,
        '',
        Object.keys(utm).length ? 'Origen: ' + Object.keys(utm).map(function (k) { return k + '=' + utm[k]; }).join(' · ') : 'Origen: directo o sin UTM',
        '',
        'Consentimiento RGPD: sí · ' + new Date().toISOString()
      ].filter(Boolean).join('\n');

      const noteRes = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: nota })
      });
      if (!noteRes.ok) {
        console.error('[dx] Nota no creada', noteRes.status, (await noteRes.text()).slice(0, 300));
      }
    }

    if (contactId) {
      await crearOportunidad({ contactId, locationId, nombre, cuello, nivel, prioritario, valorCliente, ghlHeaders })
        .catch(function (err) { console.error('[dx] Oportunidad no creada:', err); });
      // Puntuación de señal: +40 por la radiografía (una vez), +10 si ICP 1
      if (!yaHizo) {
        await sumarSenal(contactId, 40 + (icp1 ? 10 : 0), locationId, ghlHeaders)
          .catch(function (err) { console.error('[dx] Señal no sumada:', err); });
      }
      if (leadId && leadId !== contactId) {
        // El contacto del outbound es otro registro: se enlaza y se le quita la etiqueta anónima
        await fetch(GHL_BASE + '/contacts/' + leadId + '/tags', { method: 'DELETE', headers: ghlHeaders, body: JSON.stringify({ tags: ['radiografia-anonima'] }) }).catch(function () {});
        await fetch(GHL_BASE + '/contacts/' + leadId + '/notes', { method: 'POST', headers: ghlHeaders, body: JSON.stringify({ body: 'Pidió el plan de 30 días con otro correo (' + email + '). Contacto: ' + contactId }) }).catch(function () {});
      } else if (leadId) {
        await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', { method: 'DELETE', headers: ghlHeaders, body: JSON.stringify({ tags: ['radiografia-anonima'] }) }).catch(function () {});
      }
      if (telefono) {
        await crearTareaWhatsApp({ contactId, nombre, telefono, cuello, prioritario, ghlHeaders, puntos: dims[cuello] })
          .catch(function (err) { console.error('[dx] Tarea de WhatsApp no creada:', err); });
      }
    }

    await avisar({
      nombre, email, cuello, segunda, sintoma, nivel, total, maximo, completo, dims,
      empleados, valorCliente, sector, rol, utm, telefono, prioritario, contactId, locationId
    }).catch(function (err) {
      console.error('[dx] Aviso interno falló:', err);
    });

    // La radiografía prometida en el formulario. Si falla, el lead ya está
    // guardado: no se devuelve error al navegador por esto.
    // Se devuelve el resultado del envío (sin datos sensibles) para poder diagnosticar
    // desde fuera si Resend acepta el remitente configurado.
    const radiografia = await enviarRadiografia({ nombre, email, cuello, dims, completo, contactId })
      .then(function () { return 'enviada'; })
      .catch(function (err) {
        console.error('[dx] Radiografía no enviada:', err);
        return 'error: ' + String(err && err.message || err).slice(0, 160);
      });

    // Registro contado en Meta aunque no haya consentimiento de cookies (Conversions API).
    const ck = META.cookiesMeta(req);
    const meta = await META.enviarLead({
      email, telefono, nombre, eventoId, cuello, nivel,
      ip: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
      ua: String(req.headers['user-agent'] || '').slice(0, 300) || undefined,
      fbp: ck.fbp, fbc: ck.fbc,
      url: 'https://qualivo.io/donde-se-rompe-tu-crecimiento/'
    }).catch(function (err) {
      console.error('[dx] Evento Meta no enviado:', err);
      return 'error';
    });

    return res.status(200).json({ ok: true, radiografia: radiografia, meta: meta });
  } catch (err) {
    console.error('[dx] Error inesperado:', err);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};

// Pregunta con número por cuello (recorrido Radiografía → reunión, §2). La reunión
// no se pide: se le pone número a la fuga y la reunión es donde se pone el número.
const PREGUNTA_DIA1 = {
  captacion: '¿cuántas oportunidades nuevas os entraron el mes pasado?',
  conversion: 'cuando entra un formulario o un WhatsApp, ¿cuánto tarda en contestarse de media?',
  seguimiento: '¿cuántos presupuestos del mes pasado siguen sin respuesta?',
  dependencia: 'si mañana entraran 30 oportunidades, ¿cuántas se atenderían sin pasar por ti?',
  control: '¿de qué canal salió el último cliente que firmó? El último cliente, no el último lead.'
};

function mensajeWhatsApp(nombre, cuello, puntos) {
  const p = Number.isInteger(puntos) ? puntos + ' de 100' : 'la más floja de las cinco';
  return 'Hola ' + nombre.split(' ')[0] + ', soy Maikel. Vi que en la radiografía te salió ' + R.NOMBRE[cuello].toLowerCase() +
    ' como cuello de botella, ' + p + '. Una pregunta rápida: ' + PREGUNTA_DIA1[cuello] +
    ' Si me dices el número, te digo en dos líneas cuánto es eso al año.';
}

// Quita del contacto las etiquetas de un resultado anterior que ya no coinciden
// (cuello-*, nivel-*, segunda-*, sintoma-*): la radiografía más reciente manda.
async function limpiarResultadoAnterior(contactId, tagsActuales, nuevas, ghlHeaders) {
  const viejas = (tagsActuales || []).map(String).filter(function (t) {
    return /^(cuello|nivel|segunda|sintoma)-/.test(t) && !nuevas.includes(t);
  });
  if (!viejas.length) return;
  await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', { method: 'DELETE', headers: ghlHeaders, body: JSON.stringify({ tags: viejas }) });
}

// Etapas del pipeline por nombre (Radiografía completada, Tibio…), con caché de 10 minutos.
async function etapaPorNombre(patron, ghlHeaders, locationId) {
  if (Date.now() - etapasCache.t > 600000) {
    const r = await fetch(GHL_BASE + '/opportunities/pipelines?locationId=' + locationId, { headers: ghlHeaders });
    if (r.ok) {
      const d = await r.json();
      const pl = (d.pipelines || []).filter(function (x) { return x.id === PIPELINE_ID; })[0];
      const m = {};
      ((pl && pl.stages) || []).forEach(function (st) { m[String(st.name).toLowerCase()] = st.id; });
      etapasCache = { t: Date.now(), porNombre: m };
    }
  }
  const k = Object.keys(etapasCache.porNombre).filter(function (n) { return patron.test(n); })[0];
  return k ? etapasCache.porNombre[k] : null;
}

// Puntuación de señal (0-100) en un campo numérico del contacto: se suma, no se pisa.
async function sumarSenal(contactId, puntos, locationId, ghlHeaders) {
  if (!campoSenalId) {
    const r = await fetch(GHL_BASE + '/locations/' + locationId + '/customFields?model=contact', { headers: ghlHeaders });
    if (!r.ok) throw new Error('customFields ' + r.status);
    const f = ((await r.json()).customFields || []).filter(function (x) { return x.name === CAMPO_SENAL; })[0];
    if (f) campoSenalId = f.id;
    else {
      const c = await fetch(GHL_BASE + '/locations/' + locationId + '/customFields', {
        method: 'POST', headers: ghlHeaders,
        body: JSON.stringify({ name: CAMPO_SENAL, dataType: 'NUMERICAL', model: 'contact', placeholder: '0-100' })
      });
      if (!c.ok) throw new Error('crear campo ' + c.status + ': ' + (await c.text()).slice(0, 200));
      campoSenalId = ((await c.json()).customField || {}).id;
    }
  }
  const cr = await fetch(GHL_BASE + '/contacts/' + contactId, { headers: ghlHeaders });
  const contacto = cr.ok ? ((await cr.json()).contact || {}) : {};
  const actual = (contacto.customFields || []).filter(function (x) { return x.id === campoSenalId; })[0];
  const valor = Math.min(100, (Number(actual && (actual.value || actual.fieldValue)) || 0) + puntos);
  const u = await fetch(GHL_BASE + '/contacts/' + contactId, {
    method: 'PUT', headers: ghlHeaders,
    body: JSON.stringify({ customFields: [{ id: campoSenalId, field_value: valor }] })
  });
  if (!u.ok) throw new Error('PUT contacto ' + u.status + ': ' + (await u.text()).slice(0, 200));
  return valor;
}

// Tarea en GoHighLevel para escribir por WhatsApp al lead que dejó el número.
// Aparece en la app con el mensaje ya redactado; vence en dos horas (prioritario) o mañana.
async function crearTareaWhatsApp(t) {
  const vence = new Date(Date.now() + (t.prioritario ? 2 : 24) * 3600 * 1000).toISOString();
  const r = await fetch(GHL_BASE + '/contacts/' + t.contactId + '/tasks', {
    method: 'POST',
    headers: t.ghlHeaders,
    body: JSON.stringify({
      title: (t.prioritario ? '🔴 ' : '') + 'WhatsApp día 1 · ' + t.nombre + ' · ' + R.NOMBRE[t.cuello],
      body: 'https://wa.me/' + t.telefono.replace('+', '') + '?text=' + encodeURIComponent(mensajeWhatsApp(t.nombre, t.cuello, t.puntos)) +
        '\n\nMensaje: ' + mensajeWhatsApp(t.nombre, t.cuello, t.puntos) +
        '\n\nSi contesta con el número: reacción con una frase y puente (20 min con sus números o plan por escrito). Si contesta, etiqueta «respondio» para parar los correos.',
      dueDate: vence,
      completed: false,
      assignedTo: USUARIO_MAIKEL
    })
  });
  if (!r.ok) throw new Error('GHL tasks respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}

async function crearOportunidad(o) {
  const etapa = await etapaPorNombre(/radiograf/, o.ghlHeaders, o.locationId).catch(function () { return null; });
  const r = await fetch(GHL_BASE + '/opportunities/', {
    method: 'POST',
    headers: o.ghlHeaders,
    body: JSON.stringify({
      pipelineId: PIPELINE_ID,
      locationId: o.locationId,
      contactId: o.contactId,
      name: o.nombre + ' · se rompe en ' + R.NOMBRE[o.cuello] + ' (' + o.nivel + ')',
      pipelineStageId: etapa || (o.prioritario ? STAGE_CONTACTADO : STAGE_NUEVO),
      status: 'open',
      source: 'Diagnóstico de crecimiento'
    })
  });
  if (!r.ok) throw new Error('GHL opportunities respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

async function avisar(lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.LEAD_NOTIFY_TO || 'maikel@qualivo.io';
  const from = process.env.LEAD_NOTIFY_FROM || 'Qualivo Landing <onboarding@resend.dev>';

  const fila = function (k, v) {
    return '<tr><td style="padding:6px 14px 6px 0;color:#5A5E66;white-space:nowrap">' + k +
      '</td><td style="padding:6px 0;color:#101319">' + esc(v) + '</td></tr>';
  };
  const dim = function (e) {
    const p = lead.dims[e];
    return fila(R.NOMBRE[e], p === null || p === undefined ? 'sin contestar' : p + '/100');
  };
  const ghlUrl = 'https://app.gohighlevel.com/v2/location/' + lead.locationId +
    '/contacts/detail/' + lead.contactId;

  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">' +
    (lead.prioritario
      ? '<p style="background:#E8590C;color:#fff;padding:10px 14px;border-radius:8px;font-weight:700;margin:0 0 16px">LEAD PRIORITARIO · contactar en 24 h</p>'
      : '') +
    '<h2 style="margin:0 0 4px">Diagnóstico de crecimiento completado en qualivo.io</h2>' +
    '<p style="margin:0 0 4px;color:#E8590C;font-weight:700">Cuello de botella: ' +
      esc(R.NOMBRE[lead.cuello]) + ' — ' + esc(NOMBRE_SINTOMA[lead.sintoma] || lead.sintoma || '') + '</p>' +
    '<p style="margin:0 0 16px;color:#5A5E66">Nivel ' + esc(lead.nivel) + ' · ' + lead.total + '/' + lead.maximo +
      (lead.segunda ? ' · segunda: ' + esc(R.NOMBRE[lead.segunda]) : '') +
      (lead.completo ? '' : ' · diagnóstico parcial') + '</p>' +
    '<table style="border-collapse:collapse;font-size:15px">' +
    fila('Nombre', lead.nombre) +
    fila('Email', lead.email) +
    (lead.telefono ? '<tr><td style="padding:6px 14px 6px 0;color:#5A5E66">WhatsApp</td><td style="padding:6px 0"><a href="https://wa.me/' + lead.telefono.replace('+', '') +
      '?text=' + encodeURIComponent(mensajeWhatsApp(lead.nombre, lead.cuello, lead.dims[lead.cuello])) +
      '" style="font-weight:700">Escribirle por WhatsApp (' + esc(lead.telefono) + ') →</a></td></tr>' : '') +
    fila('Sector', lead.sector || 'no indicado') +
    fila('Papel', lead.rol || 'no indicado') +
    fila('Origen', Object.keys(lead.utm).length ? Object.keys(lead.utm).map(function (k) { return k + '=' + lead.utm[k]; }).join(' · ') : 'directo') +
    fila('Personas', lead.empleados) +
    fila('Valor cliente/año', lead.valorCliente) +
    DIMS.map(dim).join('') +
    '</table>' +
    (lead.contactId
      ? '<p style="margin:18px 0 0"><a href="' + ghlUrl + '">Ver contacto en GoHighLevel →</a></p>'
      : '') +
    '</div>';

  const asunto = (lead.prioritario ? '🔴 PRIORITARIO · ' : '📊 ') +
    lead.nombre + ' · se rompe en ' + R.NOMBRE[lead.cuello];

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: from, to: to, subject: asunto, html: html, reply_to: lead.email })
  });
  if (!r.ok) throw new Error('Resend respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}


// ── Radiografía ampliada para el usuario ──────────────────────────────────
async function enviarRadiografia(d) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const from = process.env.RADIOGRAFIA_FROM || process.env.LEAD_NOTIFY_FROM ||
    'Maikel de Qualivo <onboarding@resend.dev>';

  const nombreCorto = esc(d.nombre.split(' ')[0]);
  const dims = {};
  DIMS.forEach(function (e) { dims[e] = Number.isInteger(d.dims[e]) ? d.dims[e] : 100; });
  const segunda = R.segundaPeor(dims, d.cuello);
  const F = '-apple-system,Segoe UI,Roboto,sans-serif';

  const bloque = function (e) {
    const p = d.dims[e];
    const sin = !Number.isInteger(p);
    return '<tr><td style="padding:20px 0;border-bottom:1px solid #E8E6E1">' +
      '<table style="width:100%"><tr>' +
      '<td style="font:700 17px ' + F + ';color:#101319">' +
        R.NOMBRE[e] + ' <span style="font-weight:500;color:#8A8B90">· ' + R.PREGUNTA[e] + '</span></td>' +
      '<td align="right" style="font:800 14px ' + F + ';color:' + (sin ? '#8A8B90' : R.color(p)) + '">' +
        (sin ? 'Sin contestar' : R.etiqueta(p) + ' · ' + p + '/100') + '</td>' +
      '</tr></table>' +
      '<p style="margin:10px 0 0;font:400 15.5px/1.65 ' + F + ';color:#3D4148">' +
        (sin ? 'No llegaste a esta parte. Si vuelves y la contestas, la radiografía la incluye.' : R.EXPLICA[e][R.estado(p)]) + '</p></td></tr>';
  };

  const pasos = R.MOVIMIENTOS[d.cuello].map(function (m, i) {
    return '<tr><td style="padding:0 0 16px"><table><tr>' +
      '<td valign="top" style="width:30px"><div style="width:24px;height:24px;border-radius:50%;' +
      'background:#101319;color:#fff;font:800 13px ' + F + ';text-align:center;' +
      'line-height:24px">' + (i + 1) + '</div></td>' +
      '<td style="font:400 15.5px/1.6 ' + F + ';color:#3D4148">' + m + '</td></tr></table></td></tr>';
  }).join('');

  const html =
  '<div style="background:#F7F8F9;padding:28px 14px">' +
  '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;padding:34px 30px;font-family:' + F + '">' +
    '<p style="margin:0 0 6px;font:800 12px ' + F + ';letter-spacing:.14em;text-transform:uppercase;color:#0E7C74">Tu radiografía de crecimiento</p>' +
    '<h1 style="margin:0 0 18px;font:800 27px/1.2 ' + F + ';color:#101319;letter-spacing:-.02em">' +
      nombreCorto + ', tu crecimiento se está rompiendo en ' + R.NOMBRE[d.cuello].toLowerCase() + '.</h1>' +
    (d.completo ? '' :
      '<p style="margin:0 0 18px;padding:12px 16px;background:#FDF4E0;border-radius:10px;font:600 14.5px/1.6 ' + F + ';color:#8A6206">' +
      'Contestaste solo una parte del diagnóstico, así que esto sale de lo que dio tiempo a ver. Si vuelves y terminas, la foto será más fiel.</p>') +

    '<h2 style="margin:26px 0 4px;font:800 19px ' + F + ';color:#101319">Las cinco partes de tu sistema, una a una</h2>' +
    '<table style="width:100%;border-collapse:collapse">' + R.DIMS.map(bloque).join('') + '</table>' +

    '<div style="margin:28px 0 0;padding:22px 24px;background:#F7F8F9;border-radius:14px">' +
      '<p style="margin:0 0 6px;font:800 12px ' + F + ';letter-spacing:.14em;text-transform:uppercase;color:#0E7C74">La que no esperabas</p>' +
      '<p style="margin:0;font:400 16px/1.65 ' + F + ';color:#3D4148">' +
        'Casi todo el mundo acierta con su primer cuello de botella. Con el segundo no. El tuyo es <strong>' +
        R.NOMBRE[segunda].toLowerCase() + '</strong>, y suele ser el que sostiene al primero: arreglar uno sin mirar el otro dura poco.</p>' +
    '</div>' +

    '<h2 style="margin:30px 0 10px;font:800 19px ' + F + ';color:#101319">Cómo saber si esto acierta</h2>' +
    '<p style="margin:0;font:400 16px/1.65 ' + F + ';color:#3D4148">' + R.COMPROBAR[d.cuello] + '</p>' +

    '<h2 style="margin:30px 0 14px;font:800 19px ' + F + ';color:#101319">Los próximos treinta días: tres movimientos, en orden</h2>' +
    '<table style="width:100%;border-collapse:collapse">' + pasos + '</table>' +

    '<div style="margin:30px 0 0;padding:24px;background:#101319;border-radius:14px">' +
      '<p style="margin:0 0 8px;font:800 19px ' + F + ';color:#fff">Ya sabes dónde está el cuello de botella.</p>' +
      '<p style="margin:0 0 18px;font:400 15.5px/1.65 ' + F + ';color:#B9BDC4">' +
        'La siguiente pregunta es qué deberías arreglar primero y cuánto te está costando no hacerlo. Eso lo miramos en veinte minutos, con tus números delante. Sin presentación comercial.</p>' +
      '<a href="' + RESERVA + '?cuello=' + d.cuello + '" style="display:inline-block;background:#27BDB1;color:#04231F;text-decoration:none;font:800 15px ' + F + ';padding:13px 22px;border-radius:10px">Reservar 20 minutos con Maikel →</a>' +
    '</div>' +

    '<p style="margin:26px 0 0;font:400 14px/1.6 ' + F + ';color:#8A8B90">' +
      'Si algo de esto no te cuadra, contéstame a este correo y lo miramos. Lo leo yo.<br>Maikel</p>' +
  '</div>' +
  '<p style="max-width:600px;margin:16px auto 0;font:400 12.5px/1.6 ' + F + ';color:#8A8B90;text-align:center">' +
    'Recibes esto porque hiciste el diagnóstico en qualivo.io. <a href="https://qualivo.io/privacidad/" style="color:#8A8B90">Privacidad</a></p>' +
  '</div>';

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: from,
      to: d.email,
      subject: 'Tu plan de 30 días: tu crecimiento se rompe en ' + R.NOMBRE[d.cuello].toLowerCase(),
      html: html,
      reply_to: process.env.LEAD_NOTIFY_TO || 'maikel@qualivo.io',
      tags: [{ name: 'paso', value: 'plan' }, { name: 'contacto', value: String(d.contactId || 'sin-id') }]
    })
  });
  if (!r.ok) throw new Error('Resend respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}

module.exports.sumarSenal = sumarSenal;

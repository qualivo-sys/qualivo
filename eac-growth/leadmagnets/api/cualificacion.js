// EAC · formulario de cualificación de las landings (sustituye a los formularios de GHL)
//
// Por qué existe (5-nov): los formularios de GHL no se pueden editar por API y les faltan
// preguntas. Este formulario hace las 6 preguntas acordadas con EAC (documento «Proceso de
// captación y cualificación», apartados 2 y 3) y aplica la regla de «fuera de perfil» ANTES
// de pedir el teléfono: quien no cumple no llega a dejar sus datos y no entra en el CRM.
//
// Aquí se vuelve a comprobar todo en el servidor (el navegador no es de fiar) y:
//   · se da de alta o se actualiza el contacto con los mismos campos que usa el resto del embudo
//   · si no tiene trato, se crea y se reparte 50/50 entre las dos comerciales
//   · si ya tenía un trato abierto de hace más de 24 h, es alguien que VUELVE a pedir
//     información: se mueve a «Lead caliente» y se crea una tarea a quien lo tenga
// Credenciales: GHL_TOKEN y GHL_LOCATION_ID en las variables de entorno de Vercel.

const GHL = 'https://services.leadconnectorhq.com';
const PIPELINE = 'szo4sahi0aXi67KORRTq';
const ETAPA = {
  nuevo:     '72ea293e-1775-49f4-95c6-ea57d7c4137b',
  caliente:  'b3133d94-3dbb-46ac-9e16-4b864f73cdbf',
  atofd:     'ff726731-38ae-4921-9655-c0979a207f39',
  cita:      'ae35371f-69d3-4800-9103-f3c91b5ce8a9',
  entrevist: '28dc9aa1-d98d-4aa2-b04f-a7dbdb63d04e',
};
const COMERCIALES = ['4H97wrlc0PgsWwXH2Yqc', 'xq8XqZkg4MH2SH6HcW9m']; // Cursos EAC, Ludmila

// Campos personalizados de EAC y valores EXACTOS que admite cada desplegable
const CF = {
  edad:     'EZSZYk0BSbEGOSkEqYxY',
  espanol:  'kqwVtdfPG3vDE2ZvNyiW',
  ingles:   'tjraLJd7lSNhpzEuLCDa',
  nadar:    'kSymyDwvTLaGXrhnOMhD',
  cuando:   'WqqQlj5PcehW0b4cE7u1',
  punto:    'YKMq7SBDywgKuExGLd3c',
  programa: 'nNHjlcQ0uABOGPQDwfI6',
  fuente_plataforma: 'w4iNpw1LrivCyb0vvKsZ',
  utm_source:   'yLWQ5KU1cTUHm6kyygbL',
  utm_medium:   'hXRB6IFVOJKYApaXGNEW',
  utm_campaign: '1hboX9nGPzF6cQuk4opF',
  utm_content:  'zUM4I8S9ZowLWMki13s9',
  utm_term:     'kpkhY2up9lJfaoTIXV7L',
  landing_url:  '97NNEbiisZgjEzDxzv4P',
  click_id:     'vCwr7TZT0lNRvGJS63eQ',
};
const OPCIONES = {
  edad:    ['Menor de 18', '18-21', '22-30', '31-40', 'Mayor de 40'],
  espanol: ['Nativo', 'Alto, lo hablo con fluidez', 'Intermedio', 'Básico o no lo hablo'],
  ingles:  ['A1-A2', 'B1', 'B2', 'C1 o superior', 'No estoy seguro'],
  nadar:   ['Sí', 'No, pero puedo aprender', 'No'],
  cuando:  ['Lo antes posible', 'En 1-3 meses', 'En 3-6 meses', 'Solo busco info'],
  punto:   ['Quiero matricularme', 'Comparando escuelas', 'Consultando requisitos', 'Solo explorando'],
};
const CURSOS = {
  TCP: { programa: 'TCP / Auxiliar de vuelo', etiqueta: 'lead-tcp',               etapa: ETAPA.nuevo, prefijo: 'TCP' },
  AT:  { programa: 'Azafata de Tierra',       etiqueta: 'lead-azafata-tierra',    etapa: ETAPA.atofd, prefijo: 'AT' },
  FD:  { programa: 'Flight Dispatcher',       etiqueta: 'lead-flight-dispatcher', etapa: ETAPA.atofd, prefijo: 'FD' },
};

// Regla de «fuera de perfil». La misma lista vive en cualificacion.html: si se cambia, en los dos.
// El límite de 40 años es del curso de TCP (lo piden las aerolíneas); no se aplica a tierra ni despacho.
export function motivosFuera(r, curso) {
  const m = [];
  if (r.edad === 'Menor de 18') m.push('menor de 18');
  if (r.edad === 'Mayor de 40' && curso === 'TCP') m.push('mayor de 40');
  if (r.espanol === 'Básico o no lo hablo') m.push('español básico');
  if (r.cuando === 'Solo busco info') m.push('solo busca info');
  if (r.punto === 'Solo explorando') m.push('solo explorando');
  return m;
}

function telefono(s) {
  let d = String(s || '').replace(/[​-‏‪-‮⁦-⁩﻿]/g, '').trim();
  const mas = d.startsWith('+') || d.startsWith('00');
  d = d.replace(/\D/g, '').replace(/^00/, '');
  if (!mas && d.length === 9 && /^[6789]/.test(d)) d = '34' + d;   // móvil o fijo español sin prefijo
  return d.length >= 10 && d.length <= 15 ? '+' + d : null;
}

function utms(origen) {
  const out = {};
  try {
    const u = new URL(origen);
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      const v = u.searchParams.get(k); if (v) out[k] = v.slice(0, 200);
    }
    const cid = u.searchParams.get('fbclid') || u.searchParams.get('gclid') || u.searchParams.get('ttclid');
    if (cid) out.click_id = cid.slice(0, 300);
    out.landing = (u.origin + u.pathname).slice(0, 300);
    out.slug = u.pathname.split('/').filter(Boolean).pop() || 'home';
  } catch {}
  return out;
}

const PLATAFORMA = { meta: 'Meta', facebook: 'Meta', fb: 'Meta', ig: 'Meta', instagram: 'Meta',
                     google: 'Google Ads', tiktok: 'TikTok', email: 'Email' };

async function gh(path, { method = 'GET', body } = {}) {
  const r = await fetch(GHL + path, {
    method,
    headers: { Authorization: 'Bearer ' + process.env.GHL_TOKEN, Version: '2021-07-28',
               'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = { raw: t }; }
  if (!r.ok) throw new Error(method + ' ' + path.split('?')[0] + ' → ' + r.status + ' ' + t.slice(0, 200));
  return j;
}

// Reparto 50/50 sin estado: se asigna a quien menos tratos nuevos haya recibido en 7 días.
async function elegirComercial(loc) {
  try {
    const r = await gh(`/opportunities/search?location_id=${loc}&pipeline_id=${PIPELINE}&limit=100`);
    const desde = Date.now() - 7 * 86400000, n = Object.fromEntries(COMERCIALES.map(c => [c, 0]));
    for (const o of r.opportunities || []) {
      if (new Date(o.createdAt || 0).getTime() >= desde && o.assignedTo in n) n[o.assignedTo]++;
    }
    return COMERCIALES.slice().sort((a, b) => n[a] - n[b])[0];
  } catch {
    return COMERCIALES[Math.floor(Math.random() * COMERCIALES.length)];
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  b = b || {};
  if (b.empresa) return res.status(200).json({ ok: true });              // honeypot: bot

  const curso = CURSOS[b.curso] ? b.curso : 'TCP';
  const r = {};
  for (const k of Object.keys(OPCIONES)) {
    if (k === 'nadar' && curso !== 'TCP') continue;                       // natación solo para TCP
    if (!OPCIONES[k].includes(b.respuestas?.[k])) return res.status(400).json({ ok: false, error: 'respuesta_' + k });
    r[k] = b.respuestas[k];
  }
  const fuera = motivosFuera(r, curso);
  if (fuera.length) return res.status(200).json({ ok: true, fuera: true });   // no entra: no se guarda nada

  const nombre = String(b.nombre || '').trim().slice(0, 120);
  const email = String(b.email || '').trim().slice(0, 160);
  const tel = telefono(b.telefono);
  if (!nombre || !tel || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || b.consent !== true) {
    return res.status(400).json({ ok: false, error: 'datos' });
  }

  const u = utms(b.origen);
  const c = CURSOS[curso];
  const partes = nombre.split(/\s+/);
  const customFields = [
    ...Object.entries(r).map(([k, v]) => ({ id: CF[k], value: v })),
    { id: CF.programa, value: c.programa },
    { id: CF.fuente_plataforma, value: u.utm_source ? (PLATAFORMA[u.utm_source.toLowerCase()] || u.utm_source) : 'Web' },
    { id: CF.utm_source, value: u.utm_source }, { id: CF.utm_medium, value: u.utm_medium },
    { id: CF.utm_campaign, value: u.utm_campaign }, { id: CF.utm_content, value: u.utm_content },
    { id: CF.utm_term, value: u.utm_term }, { id: CF.landing_url, value: u.landing },
    { id: CF.click_id, value: u.click_id },
  ].filter(f => f.value);
  const contacto = {
    locationId: process.env.GHL_LOCATION_ID,
    firstName: partes[0], lastName: partes.slice(1).join(' ') || undefined, name: nombre,
    email, phone: tel,
    source: 'Web · formulario de cualificación' + (u.slug ? ' · ' + u.slug : ''),
    tags: ['form-web-v4', c.etiqueta, u.utm_source ? 'lead paid' : 'organico-web']
      .concat(u.slug ? ['landing-' + u.slug.slice(0, 40)] : []),
    customFields,
  };

  // Prueba sin escribir nada (solo con la clave de prueba configurada en Vercel)
  if (req.headers['x-eac-prueba'] && req.headers['x-eac-prueba'] === process.env.PRUEBA_KEY) {
    return res.status(200).json({ ok: true, prueba: true, contacto });
  }
  if (!process.env.GHL_TOKEN || !process.env.GHL_LOCATION_ID) {
    return res.status(200).json({ ok: true, mode: 'preview' });
  }

  try {
    const up = await gh('/contacts/upsert', { method: 'POST', body: contacto });
    const id = up.contact?.id;
    if (!id) throw new Error('upsert sin id');
    const ops = (await gh(`/opportunities/search?location_id=${contacto.locationId}&contact_id=${id}`)).opportunities || [];
    const abierta = ops.find(o => o.status === 'open' && o.pipelineId === PIPELINE);

    if (!abierta) {
      await gh('/opportunities/', { method: 'POST', body: {
        pipelineId: PIPELINE, locationId: contacto.locationId, contactId: id, status: 'open',
        pipelineStageId: c.etapa, name: c.prefijo + ' · ' + nombre,
        assignedTo: await elegirComercial(contacto.locationId),
      } });
      return res.status(200).json({ ok: true, nuevo: true });
    }

    // Ya estaba: si el trato es de hace más de 24 h, vuelve a pedir información
    const antiguo = Date.now() - new Date(abierta.createdAt || 0).getTime() > 24 * 3600000;
    const intocable = [ETAPA.caliente, ETAPA.cita, ETAPA.entrevist].includes(abierta.pipelineStageId);
    if (antiguo && !intocable) {
      await gh('/opportunities/' + abierta.id, { method: 'PUT', body: { pipelineId: PIPELINE, pipelineStageId: ETAPA.caliente } });
      await gh(`/contacts/${id}/tasks`, { method: 'POST', body: {
        title: 'VUELVE A PEDIR INFO · ' + nombre,
        body: 'Ha vuelto a rellenar el formulario de la web (' + (u.slug || 'landing') + '). Estaba en otra etapa; se ha movido a Lead caliente. Llamar hoy.',
        dueDate: new Date(Date.now() + 2 * 3600000).toISOString(), completed: false,
        assignedTo: abierta.assignedTo || COMERCIALES[1],
      } });
      await gh(`/contacts/${id}/tags`, { method: 'POST', body: { tags: ['vuelve-a-pedir-info'] } });
    }
    return res.status(200).json({ ok: true, nuevo: false });
  } catch (e) {
    console.error('cualificacion', e.message);
    return res.status(200).json({ ok: false, error: 'crm' });
  }
}

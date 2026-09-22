// Salud de las piezas externas, vista desde Vercel (22-sep-2026): sirve para
// saber por qué el agente no contesta sin tener que adivinar. Protegido con
// el mismo token que la agenda (?k=). No enseña ninguna clave: solo si existe,
// su forma y qué contesta el proveedor.
module.exports = async function handler(req, res) {
  const k = (req.query && req.query.k) || '';
  if (!process.env.AGENDA_SECRET || k !== process.env.AGENDA_SECRET) return res.status(401).json({ ok: false });
  const forma = function (v) { v = String(v || ''); return v ? v.slice(0, 7) + '…' + v.slice(-4) + ' (' + v.length + ')' : 'NO ESTÁ'; };
  const out = {
    anthropic: { clave: forma(process.env.ANTHROPIC_API_KEY), workspace: !!process.env.ANTHROPIC_WORKSPACE_ID, modelo: process.env.ANTHROPIC_MODEL || 'claude-opus-5' },
    vapi: { clave: forma(process.env.VAPI_API_KEY), asistente: !!process.env.VAPI_ASSISTANT_ID, numero: process.env.VAPI_PHONE_NUMBER_ID || '(por defecto)' },
    resend: { clave: forma(process.env.RESEND_API_KEY), from: process.env.RADIOGRAFIA_FROM || '(por defecto)' },
    ghl: { clave: forma(process.env.GHL_API_KEY), location: !!process.env.GHL_LOCATION_ID },
    gateway: { pausa: process.env.GATEWAY_PAUSA !== '0' }
  };
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
          process.env.ANTHROPIC_WORKSPACE_ID ? { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID } : {}),
        body: JSON.stringify({ model: out.anthropic.modelo, max_tokens: 5, messages: [{ role: 'user', content: 'di hola' }] })
      });
      out.anthropic.estado = r.status;
      const t = await r.text();
      out.anthropic.respuesta = r.ok ? 'OK' : t.slice(0, 300);
    } catch (e) { out.anthropic.estado = 'error'; out.anthropic.respuesta = String(e && e.message).slice(0, 200); }
  }
  return res.status(200).json(out);
};

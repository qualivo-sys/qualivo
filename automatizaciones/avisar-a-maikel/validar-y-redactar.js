// Payload: { urgencia: 'rojo'|'normal', titulo, texto, enlace?, agente }
// Lo llama cualquier agente de Qualivo que necesite a Maikel. Devuelve error legible si falta algo.
const entrada = $input.first().json;
const b = entrada.body || entrada;
const limpiar = (s, max) => String(s ?? '').replace(/\s+\n/g, '\n').trim().slice(0, max);

const urgencia = String(b.urgencia || 'normal').toLowerCase() === 'rojo' ? 'rojo' : 'normal';
const titulo = limpiar(b.titulo, 120);
const texto = limpiar(b.texto, 1500);
const agente = limpiar(b.agente, 80);
const enlace = /^https?:\/\/\S+$/.test(String(b.enlace || '').trim()) ? String(b.enlace).trim() : '';

const faltan = [!titulo && 'titulo', !texto && 'texto', !agente && 'agente'].filter(Boolean);
if (faltan.length) {
  return [{ json: { valido: false, error: `Faltan campos: ${faltan.join(', ')}` } }];
}

const marca = urgencia === 'rojo' ? '🔴 URGENTE' : '🟡 Aviso';
const whatsapp =
  `${marca} · ${titulo}\n\n${texto}\n\n` +
  (enlace ? `👉 ${enlace}\n\n` : '') +
  `— ${agente}`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const asunto = `[${urgencia === 'rojo' ? 'URGENTE' : 'Aviso'}] ${titulo} · ${agente}`;
const html =
  `<p style="font-size:15px"><b>${marca}</b> · ${esc(titulo)}</p>` +
  `<p style="white-space:pre-line">${esc(texto)}</p>` +
  (enlace ? `<p><a href="${esc(enlace)}">${esc(enlace)}</a></p>` : '') +
  `<p style="color:#888">— ${esc(agente)} · enviado por el webhook «Avisar a Maikel»</p>`;

return [{ json: { valido: true, urgencia, titulo, agente, enlace, whatsapp, asunto, html } }];

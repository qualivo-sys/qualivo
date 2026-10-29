// Payload: { cliente, fecha_firma: 'AAAA-MM-DD', contacto?, servicio?, variante?: 'corta'|'larga' }
// Convierte el playbook de alta (playbooks/alta-clientes) en tareas fechadas desde el día 0.
const entrada = $input.first().json;
const b = entrada.body || entrada;
const cliente = String(b.cliente || '').trim();
const firma = String(b.fecha_firma || '').trim();
if (!cliente || !/^\d{4}-\d{2}-\d{2}$/.test(firma)) {
  throw new Error('Faltan campos: cliente y fecha_firma (AAAA-MM-DD).');
}
const larga = String(b.variante || 'corta').toLowerCase() === 'larga';
const extra = larga ? 7 : 0; // la variante larga alarga la construcción una semana

const dia = (n) => {
  const d = new Date(firma + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  const s = d.getUTCDay(); // fines de semana al lunes siguiente
  if (s === 6) d.setUTCDate(d.getUTCDate() + 2);
  if (s === 0) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

// [día, fase, quién, tarea]  · M Maikel · V Ventas · CFO · A Automatización · G Growth · CoS
const PLAN = [
  [0, 'Día 0', 'CFO', 'Factura de la entrada → Maikel la envía'],
  [0, 'Día 0', 'M', 'Proponer reunión de arranque (máx. D+2) e invitar a todos los que deciden'],
  [1, 'Arranque', 'M', 'Preparar la reunión: decidir antes de entrar · preguntas · salir con'],
  [2, 'Arranque', 'M', 'Reunión de arranque: accesos con responsable y fecha, cifras de partida, avisos y reunión semanal'],
  [3, 'Arranque', 'CoS', 'Acta y lista de tareas por email (borrador para Maikel)'],
  [3, 'Semana 1', 'G', 'Cliente ideal y zonas con sus cambios → pedir «me vale»'],
  [4, 'Semana 1', 'A', 'Pedir a Meta las plantillas de WhatsApp (recordatorio, último seguimiento, pago a medias)'],
  [5, 'Semana 1', 'A', 'CRM: etapas, origen (UTM) y campos'],
  [6, 'Semana 1', 'A', 'Preguntas del formulario, descarte y mensajes automáticos → aprobar en la reunión'],
  [6, 'Semana 1', 'G', 'Primeros borradores de anuncios'],
  [7, 'Semana 1', 'M', 'Revisar accesos pendientes del cliente y reclamar los vencidos'],
  [9 + extra, 'Semana 2', 'G', 'Landing con sus zonas, casos y opiniones → revisión en el móvil'],
  [9 + extra, 'Semana 2', 'G', 'Anuncios definitivos (3 mensajes) → OK en la reunión'],
  [10 + extra, 'Semana 2', 'A', 'Secuencias de seguimiento (WhatsApp + email) → revisar el tono'],
  [10 + extra, 'Semana 2', 'A', 'Reserva de cita: confirmación y recordatorio de la víspera'],
  [11 + extra, 'Semana 2', 'A', 'Avisos al cliente cuando un lead pide una persona → probar que le llegan'],
  [12 + extra, 'Semana 2', 'A', 'QA interno del recorrido completo con un lead de prueba'],
  [13 + extra, 'Semana 2', 'M', 'OK del cliente para lanzar y método de pago de la cuenta publicitaria'],
  [14 + extra, 'Semana 3', 'G', 'Encender anuncios con el presupuesto de prueba (OK de Maikel)'],
  [14 + extra, 'Semana 3', 'A', 'Activar el panel con datos reales'],
  [16 + extra, 'Semana 3', 'A', 'Revisar uno a uno los primeros contactos: puntuación y mensajes'],
  [18 + extra, 'Semana 3', 'M', 'Pedir por email la confirmación de puesta en marcha (las 3 condiciones)'],
  [18 + extra, 'Semana 3', 'CFO', 'Factura del segundo pago al llegar la confirmación'],
  [22 + extra, 'Semana 4', 'G', 'Informe de las 2 primeras semanas: solicitudes, encajan, citas/ventas y coste de cada una'],
  [23 + extra, 'Semana 4', 'M', 'Primera revisión con datos: decidir la inversión de las semanas siguientes'],
  [24 + extra, 'Semana 4', 'CoS', 'Actualizar el Client OS: resultado, aprendizajes y decisiones; pasar a operación normal'],
];
const QUIEN = { M: 'Maikel', V: 'Ventas', CFO: 'CFO', A: 'Automatización', G: 'Growth', CoS: 'Chief of Staff' };
const tareas = PLAN.map(([n, fase, q, t]) => ({
  content: `[${fase}] ${t}`,
  due_date: dia(n),
  labels: [QUIEN[q].toLowerCase().replace(/\s+/g, '-')],
}));

const ACCESOS = ['Meta Business Manager y cuenta publicitaria', 'Facebook / Instagram', 'Google Ads', 'GA4 y GTM',
  'Search Console', 'Web / CMS', 'Hosting o servidor y DNS', 'WhatsApp Business / Cloud API', 'Email',
  'Pagos / confirmación de venta', 'Cifras históricas agregadas (ventas, inversión y leads)'];

const p = (txt) => ({ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: txt } }] } });
const h = (txt) => ({ object: 'block', type: 'heading_2', heading_2: { rich_text: [{ type: 'text', text: { content: txt } }] } });
const todo = (txt) => ({ object: 'block', type: 'to_do', to_do: { rich_text: [{ type: 'text', text: { content: txt } }], checked: false } });
const bloques = [
  { object: 'block', type: 'callout', callout: { icon: { emoji: '🔒' }, rich_text: [{ type: 'text', text: { content: 'Página interna. No se comparte con el cliente. Creada por la automatización de alta (A1). Estructura completa en «Plantilla · [Cliente] · Client OS (interna)».' } }] } },
  p(`Cliente: ${cliente}${b.contacto ? ' · contacto: ' + b.contacto : ''}`),
  p(`Servicio: ${b.servicio || 'pendiente'} · Firma: ${firma} · Variante: ${larga ? 'larga (5 semanas)' : 'corta (4 semanas)'}`),
  p(`Puesta en marcha prevista: ${dia(18 + extra)} · Primera revisión con datos: ${dia(23 + extra)}`),
  h('🔑 Accesos (ninguno antes de contrato + Anexo I firmados)'),
  ...ACCESOS.map(todo),
  h('✅ Puesta en marcha (el cliente la confirma por email)'),
  todo('CRM recibe contactos de todos los canales'), todo('WhatsApp responde solo'), todo('Avisos al cliente llegando'),
  h('🗓️ Reunión de arranque'), p('Decidir antes de entrar · Preguntas por prioridad · Salir de la reunión con'),
  h('🧠 Decisiones'), p('Fecha · Decisión · Motivo · Responsable'),
  h('⚠️ Riesgos'), p('Riesgo · Impacto · Mitigación'),
];

return [{ json: { cliente, firma, proyecto: `Cliente · ${cliente}`, tareas, bloques,
  puesta_en_marcha: dia(18 + extra), revision: dia(23 + extra) } }];

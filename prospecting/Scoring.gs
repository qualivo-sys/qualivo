/**
 * Scoring.gs · detección de la señal en una oferta y puntuación del prospecto.
 */

/**
 * Categoría de una palabra clave (para el tono del mensaje y el peso del score).
 * Cualquier keyword no listada cae en 'general'.
 */
var SIGNAL_MAP = {
  leadgen: ['lead', 'leads', 'generacion de leads', 'lead generation', 'captacion',
    'demand generation', 'prospeccion', 'prospecting'],
  sales: ['sdr', 'bdr', 'sales development', 'inside sales', 'appointment setter',
    'closer', 'teleoperador', 'telemarketing', 'comercial', 'ventas'],
  crm: ['crm', 'hubspot', 'salesforce', 'gohighlevel', 'pipedrive', 'zoho'],
  automation: ['automatizacion', 'automation', 'revops', 'revenue operations',
    'sales operations', 'marketing operations', 'make', 'zapier', 'n8n'],
  marketing: ['growth', 'growth marketing', 'marketing automation', 'email marketing',
    'performance marketing', 'paid media', 'marketing digital', 'funnel',
    'embudo', 'nurturing', 'outbound']
};

/** Peso por categoría (una vacante de RevOps/automatización pesa más). */
var CATEGORY_WEIGHT = {
  automation: 30, crm: 28, leadgen: 26, sales: 22, marketing: 20, general: 16
};

/** Categoría a la que pertenece una keyword. */
function categoryOf(keyword) {
  var k = normalizeText(keyword);
  for (var cat in SIGNAL_MAP) {
    if (SIGNAL_MAP[cat].indexOf(k) >= 0) return cat;
  }
  return 'general';
}

/**
 * ¿El título de una oferta es una señal para Qualivo? Devuelve
 * {keyword, category} de la primera coincidencia, o null.
 */
function roleSignal(title) {
  var t = normalizeText(title);
  if (!t) return null;
  for (var i = 0; i < ROLE_KEYWORDS.length; i++) {
    var kw = normalizeText(ROLE_KEYWORDS[i]);
    // \b para no casar "crm" dentro de otra palabra; keyword multi-palabra: substring.
    var hit = kw.indexOf(' ') >= 0
      ? (t.indexOf(kw) >= 0)
      : new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(t);
    if (hit) return { keyword: ROLE_KEYWORDS[i], category: categoryOf(ROLE_KEYWORDS[i]) };
  }
  return null;
}

/**
 * Puntúa un prospecto (0-100) a partir de las ofertas relevantes detectadas,
 * el tamaño de la empresa y si tenemos email del decisor.
 * @param {Object} ctx - {matchedJobs:[{signal,category}], employees, hasEmail, hasContact}
 * @returns {Object} {score, priority}
 */
function scoreProspect(ctx) {
  var score = 0;

  // 1) Señal principal: categoría de la mejor oferta.
  var topCat = 'general';
  var topWeight = 0;
  (ctx.matchedJobs || []).forEach(function (j) {
    var w = CATEGORY_WEIGHT[j.category] || CATEGORY_WEIGHT.general;
    if (w > topWeight) { topWeight = w; topCat = j.category; }
  });
  score += topWeight;

  // 2) Varias ofertas relevantes = dolor más grande / presupuesto activo.
  var n = (ctx.matchedJobs || []).length;
  score += Math.min(n - 1, 3) * 8; // +8 por cada oferta extra, hasta +24

  // 3) Tamaño de empresa: sweet spot 11-200 empleados.
  var emp = parseInt(ctx.employees, 10) || 0;
  if (emp >= 11 && emp <= 200) score += 15;
  else if (emp > 200 && emp <= 500) score += 8;
  else if (emp > 0 && emp < 11) score += 4;

  // 4) Alcanzabilidad: decisor identificado y email disponible.
  if (ctx.hasContact) score += 8;
  if (ctx.hasEmail) score += 12;

  score = Math.max(0, Math.min(100, Math.round(score)));

  var priority = score >= 70 ? 'Alta' : (score >= 50 ? 'Media' : 'Baja');
  return { score: score, priority: priority };
}

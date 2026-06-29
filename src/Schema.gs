/**
 * Schema.gs
 * Define las estructuras normalizadas que devuelven los conectores y las
 * funciones para derivar métricas (CTR, CPL, CPC, CPM, CVR) de forma central,
 * para que todas las plataformas calculen igual.
 */

/**
 * Estructura de una plataforma de paid media:
 * {
 *   platform: 'Meta'|'Google'|'TikTok',
 *   spend: number,
 *   impressions: number,
 *   clicks: number,
 *   leads: number,            // leads o conversiones según plataforma
 *   campaigns: [ { name, spend, impressions, clicks, leads } ]
 * }
 */
function emptyPlatform(platform) {
  return { platform: platform, spend: 0, impressions: 0, clicks: 0, leads: 0, campaigns: [], error: null };
}

/** Calcula métricas derivadas a partir de los totales crudos. */
function deriveMetrics(row) {
  var spend = row.spend || 0;
  var impr = row.impressions || 0;
  var clicks = row.clicks || 0;
  var leads = row.leads || 0;
  return {
    spend: round(spend, 2),
    impressions: Math.round(impr),
    clicks: Math.round(clicks),
    leads: round(leads, 2),
    ctr: round(safeDiv(clicks, impr) * 100, 2),       // %
    cpc: round(safeDiv(spend, clicks), 2),            // €
    cpm: round(safeDiv(spend, impr) * 1000, 2),       // €
    cpl: round(safeDiv(spend, leads), 2),             // € (CPL/CPA)
    cvr: round(safeDiv(leads, clicks) * 100, 2)       // %
  };
}

/** Suma una lista de plataformas en un total "blended". */
function sumPlatforms(platforms) {
  var t = { spend: 0, impressions: 0, clicks: 0, leads: 0 };
  platforms.forEach(function (p) {
    t.spend += p.spend || 0;
    t.impressions += p.impressions || 0;
    t.clicks += p.clicks || 0;
    t.leads += p.leads || 0;
  });
  return t;
}

/**
 * Estructura del dataset CRM normalizado:
 * {
 *   source: 'HubSpot'|'GHL',
 *   totalCreated: number,
 *   byStage: { 'Nuevo Lead': n, ... },     // sólo abiertas
 *   byStatus: [ { status, count, pct } ],   // distribución completa
 *   bySource: [ { source, count, pct } ],   // atribución de fuente
 *   enrollment: {
 *      won, wonPrevMonth, interviewed,
 *      openActive, lost, abandoned,
 *      contractValue, revenue
 *   }
 * }
 */
function emptyCrm(source) {
  return {
    source: source,
    totalCreated: 0,
    byStage: {},
    byStatus: [],
    bySource: [],
    enrollment: {
      won: 0,          // matrículas cerradas (ganadas) en el mes
      wonNew: 0,       // de ellas, creadas también en el mes
      wonCarry: 0,     // de ellas, creadas en meses anteriores (arrastre)
      wonPrevMonth: 0, interviewed: 0,
      openActive: 0, lost: 0, abandoned: 0,
      contractValue: 0, revenue: 0
    },
    leads: [], // [{ date, name, email, phone, source, url, status }]
    error: null
  };
}

/** Añade porcentajes a una lista [{key, count}] sobre el total. */
function withPercentages(list, total) {
  var t = total || list.reduce(function (s, x) { return s + (x.count || 0); }, 0);
  return list.map(function (x) {
    return { key: x.key, count: x.count, pct: round(safeDiv(x.count, t) * 100, 1) };
  });
}

/**
 * Combina conectores en el dataset mensual completo que consume el dashboard.
 */
function buildMonthlyDataset(monthKey, platforms, crm) {
  var derived = platforms.map(function (p) {
    var d = deriveMetrics(p);
    d.platform = p.platform;
    d.campaigns = (p.campaigns || []).map(function (c) {
      var cd = deriveMetrics(c);
      cd.name = c.name;
      return cd;
    }).sort(function (a, b) { return b.spend - a.spend; });
    d.error = p.error || null;
    return d;
  });

  var totalRaw = sumPlatforms(platforms);
  var total = deriveMetrics(totalRaw);

  return {
    month: monthKey,
    label: monthLabel(monthKey),
    generatedAt: Utilities.formatDate(new Date(), CLIENT.timezone, 'yyyy-MM-dd HH:mm'),
    budget: CLIENT.monthlyBudget,
    budgetSpentPct: round(safeDiv(total.spend, CLIENT.monthlyBudget) * 100, 0),
    total: total,
    platforms: derived,
    crm: crm || emptyCrm('—')
  };
}

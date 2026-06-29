/**
 * MetaAds.gs
 * Conector Meta Marketing API (Facebook/Instagram Ads).
 *
 * Credenciales (Script Properties):
 *   META_ACCESS_TOKEN   - token de acceso (System User token recomendado)
 *   META_AD_ACCOUNT_ID  - id de la cuenta SIN el prefijo act_ (p.ej. 1234567890)
 *   META_API_VERSION    - opcional, por defecto v21.0
 *
 * Permisos del token: ads_read.
 * Doc: https://developers.facebook.com/docs/marketing-api/insights
 */
function fetchMeta(monthKey) {
  var out = emptyPlatform('Meta');
  if (!hasCreds('Meta')) { out.error = 'sin credenciales'; return out; }

  try {
    var token = getProp('META_ACCESS_TOKEN');
    var acct = getProp('META_AD_ACCOUNT_ID').replace(/^act_/, '');
    var ver = getProp('META_API_VERSION', 'v21.0');
    var range = monthRange(monthKey);

    var base = 'https://graph.facebook.com/' + ver + '/act_' + acct + '/insights';
    var params = {
      level: 'campaign',
      time_range: JSON.stringify({ since: range.since, until: range.until }),
      time_increment: 'all_days',
      fields: 'campaign_name,spend,impressions,clicks,actions',
      limit: '500',
      access_token: token
    };

    var url = base + '?' + toQuery(params);
    var totals = { spend: 0, impressions: 0, clicks: 0, leads: 0 };

    while (url) {
      var json = httpJson(url);
      (json.data || []).forEach(function (row) {
        var leads = extractMetaLeads(row.actions);
        var camp = {
          name: row.campaign_name || '(sin nombre)',
          spend: toNumber(row.spend),
          impressions: toNumber(row.impressions),
          clicks: toNumber(row.clicks),
          leads: leads
        };
        out.campaigns.push(camp);
        totals.spend += camp.spend;
        totals.impressions += camp.impressions;
        totals.clicks += camp.clicks;
        totals.leads += camp.leads;
      });
      url = (json.paging && json.paging.next) ? json.paging.next : null;
    }

    out.spend = totals.spend;
    out.impressions = totals.impressions;
    out.clicks = totals.clicks;
    out.leads = totals.leads;
  } catch (e) {
    out.error = String(e);
    logInfo('Meta error', e);
  }
  return out;
}

/** Suma las acciones de tipo lead del array de actions de Meta. */
function extractMetaLeads(actions) {
  if (!actions || !actions.length) return 0;
  var LEAD_TYPES = {
    'lead': true,
    'leadgen_grouped': true,
    'onsite_conversion.lead_grouped': true,
    'offsite_conversion.fb_pixel_lead': true
  };
  var total = 0;
  actions.forEach(function (a) {
    if (LEAD_TYPES[a.action_type]) total += toNumber(a.value);
  });
  return total;
}

/** Serializa un objeto a query string url-encoded. */
function toQuery(obj) {
  return Object.keys(obj).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
  }).join('&');
}

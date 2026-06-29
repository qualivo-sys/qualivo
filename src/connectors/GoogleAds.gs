/**
 * GoogleAds.gs
 * Conector Google Ads API (REST, searchStream + GAQL).
 *
 * Credenciales (Script Properties):
 *   GOOGLE_ADS_DEVELOPER_TOKEN
 *   GOOGLE_ADS_CLIENT_ID
 *   GOOGLE_ADS_CLIENT_SECRET
 *   GOOGLE_ADS_REFRESH_TOKEN      - OAuth refresh token con scope adwords
 *   GOOGLE_ADS_CUSTOMER_ID        - id de cliente SIN guiones (p.ej. 1234567890)
 *   GOOGLE_ADS_LOGIN_CUSTOMER_ID  - opcional, MCC sin guiones
 *
 * Doc: https://developers.google.com/google-ads/api/rest/overview
 */
function fetchGoogleAds(monthKey) {
  var out = emptyPlatform('Google');
  if (!hasCreds('Google')) { out.error = 'sin credenciales'; return out; }

  try {
    var range = monthRange(monthKey);
    var customerId = getProp('GOOGLE_ADS_CUSTOMER_ID').replace(/-/g, '');
    var accessToken = getGoogleAdsAccessToken();

    var query =
      'SELECT campaign.name, metrics.cost_micros, metrics.impressions, ' +
      'metrics.clicks, metrics.conversions ' +
      'FROM campaign ' +
      'WHERE segments.date BETWEEN "' + range.since + '" AND "' + range.until + '" ' +
      'AND metrics.impressions > 0';

    var url = 'https://googleads.googleapis.com/v18/customers/' + customerId + '/googleAds:searchStream';
    var headers = {
      'Authorization': 'Bearer ' + accessToken,
      'developer-token': getProp('GOOGLE_ADS_DEVELOPER_TOKEN'),
      'Content-Type': 'application/json'
    };
    var loginCid = getProp('GOOGLE_ADS_LOGIN_CUSTOMER_ID');
    if (loginCid) headers['login-customer-id'] = loginCid.replace(/-/g, '');

    var json = httpJson(url, {
      method: 'post',
      headers: headers,
      payload: JSON.stringify({ query: query })
    });

    // searchStream devuelve un array de batches, cada uno con .results
    var byCampaign = {};
    (json || []).forEach(function (batch) {
      (batch.results || []).forEach(function (r) {
        var name = (r.campaign && r.campaign.name) || '(sin nombre)';
        var m = r.metrics || {};
        var c = byCampaign[name] || { name: name, spend: 0, impressions: 0, clicks: 0, leads: 0 };
        c.spend += toNumber(m.costMicros) / 1e6;
        c.impressions += toNumber(m.impressions);
        c.clicks += toNumber(m.clicks);
        c.leads += toNumber(m.conversions);
        byCampaign[name] = c;
      });
    });

    Object.keys(byCampaign).forEach(function (name) {
      var c = byCampaign[name];
      out.campaigns.push(c);
      out.spend += c.spend;
      out.impressions += c.impressions;
      out.clicks += c.clicks;
      out.leads += c.leads;
    });
  } catch (e) {
    out.error = String(e);
    logInfo('Google Ads error', e);
  }
  return out;
}

/** Intercambia el refresh token por un access token de OAuth. */
function getGoogleAdsAccessToken() {
  var json = httpJson('https://oauth2.googleapis.com/token', {
    method: 'post',
    payload: {
      client_id: getProp('GOOGLE_ADS_CLIENT_ID'),
      client_secret: getProp('GOOGLE_ADS_CLIENT_SECRET'),
      refresh_token: getProp('GOOGLE_ADS_REFRESH_TOKEN'),
      grant_type: 'refresh_token'
    }
  });
  if (!json.access_token) throw new Error('No se pudo obtener access_token de Google: ' + JSON.stringify(json));
  return json.access_token;
}

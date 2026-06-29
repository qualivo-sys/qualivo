/**
 * TikTokAds.gs
 * Conector TikTok Marketing API (reporting integrado).
 *
 * Credenciales (Script Properties):
 *   TIKTOK_ACCESS_TOKEN
 *   TIKTOK_ADVERTISER_ID
 *
 * Doc: https://business-api.tiktok.com/portal/docs?id=1740302848100353
 */
function fetchTikTok(monthKey) {
  var out = emptyPlatform('TikTok');
  if (!hasCreds('TikTok')) { out.error = 'sin credenciales'; return out; }

  try {
    var range = monthRange(monthKey);
    var token = getProp('TIKTOK_ACCESS_TOKEN');
    var advId = getProp('TIKTOK_ADVERTISER_ID');

    var base = 'https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/';
    var page = 1;
    var totals = { spend: 0, impressions: 0, clicks: 0, leads: 0 };

    while (true) {
      var params = {
        advertiser_id: advId,
        report_type: 'BASIC',
        data_level: 'AUCTION_CAMPAIGN',
        dimensions: JSON.stringify(['campaign_id']),
        metrics: JSON.stringify(['campaign_name', 'spend', 'impressions', 'clicks', 'conversion']),
        start_date: range.since,
        end_date: range.until,
        page: String(page),
        page_size: '100'
      };
      var url = base + '?' + toQuery(params);
      var json = httpJson(url, { headers: { 'Access-Token': token } });

      if (json.code && json.code !== 0) {
        throw new Error('TikTok API code ' + json.code + ': ' + json.message);
      }
      var data = (json.data && json.data.list) || [];
      data.forEach(function (row) {
        var m = row.metrics || {};
        var camp = {
          name: m.campaign_name || '(sin nombre)',
          spend: toNumber(m.spend),
          impressions: toNumber(m.impressions),
          clicks: toNumber(m.clicks),
          leads: toNumber(m.conversion)
        };
        out.campaigns.push(camp);
        totals.spend += camp.spend;
        totals.impressions += camp.impressions;
        totals.clicks += camp.clicks;
        totals.leads += camp.leads;
      });

      var pageInfo = (json.data && json.data.page_info) || {};
      var totalPages = pageInfo.total_page || 1;
      if (page >= totalPages) break;
      page++;
    }

    out.spend = totals.spend;
    out.impressions = totals.impressions;
    out.clicks = totals.clicks;
    out.leads = totals.leads;
  } catch (e) {
    out.error = String(e);
    logInfo('TikTok error', e);
  }
  return out;
}

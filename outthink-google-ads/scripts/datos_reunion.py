import json, urllib.request, urllib.parse, datetime
from pathlib import Path
C = json.loads(Path("gads_creds.json").read_text()); CID="9188115388"
d = urllib.parse.urlencode({"client_id":C["client_id"],"client_secret":C["client_secret"],"refresh_token":C["refresh_token"],"grant_type":"refresh_token"}).encode()
tok = json.load(urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token",data=d)))["access_token"]
H={"Authorization":f"Bearer {tok}","developer-token":C["developer_token"],"Content-Type":"application/json"}
def q(s):
    r=urllib.request.Request(f"https://googleads.googleapis.com/v25/customers/{CID}/googleAds:search",data=json.dumps({"query":s}).encode(),headers=H)
    return json.load(urllib.request.urlopen(r)).get("results",[])
def eur(m): return round(int(m or 0)/1e6,2)
out={}
out["campanas"]=[{"n":r["campaign"]["name"],"st":r["campaign"]["status"],"impr":int(r["metrics"].get("impressions",0)),
  "clics":int(r["metrics"].get("clicks",0)),"coste":eur(r["metrics"].get("costMicros")),"conv":float(r["metrics"].get("conversions",0))}
  for r in q("SELECT campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date BETWEEN '2026-08-31' AND '2026-09-24' AND campaign.status != 'REMOVED'")]
out["dias"]=[{"f":r["segments"]["date"],"impr":int(r["metrics"].get("impressions",0)),"clics":int(r["metrics"].get("clicks",0)),
  "coste":eur(r["metrics"].get("costMicros")),"conv":float(r["metrics"].get("conversions",0))}
  for r in q("SELECT segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM customer WHERE segments.date BETWEEN '2026-08-31' AND '2026-09-24'")]
out["is"]=[{"f":r["segments"]["date"],"is":r["metrics"].get("searchImpressionShare"),"pres":r["metrics"].get("searchBudgetLostImpressionShare"),
  "rank":r["metrics"].get("searchRankLostImpressionShare")}
  for r in q("SELECT segments.date, metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share FROM campaign WHERE segments.date BETWEEN '2026-09-12' AND '2026-09-20' AND campaign.name='OT26_Search'")]
out["disp"]=[{"f":r["segments"]["date"],"d":r["segments"]["device"],"clics":int(r["metrics"].get("clicks",0)),
  "coste":eur(r["metrics"].get("costMicros")),"conv":float(r["metrics"].get("conversions",0))}
  for r in q("SELECT segments.date, segments.device, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date BETWEEN '2026-08-31' AND '2026-09-24' AND campaign.name='OT26_Search'")]
out["grupos"]=[{"n":r["adGroup"]["name"],"st":r["adGroup"]["status"],"clics":int(r["metrics"].get("clicks",0)),
  "coste":eur(r["metrics"].get("costMicros")),"conv":float(r["metrics"].get("conversions",0))}
  for r in q("SELECT ad_group.name, ad_group.status, metrics.clicks, metrics.cost_micros, metrics.conversions FROM ad_group WHERE segments.date BETWEEN '2026-08-31' AND '2026-09-24' AND ad_group.status != 'REMOVED' AND campaign.name='OT26_Search'")]
Path("datos_reunion.json").write_text(json.dumps(out,ensure_ascii=False))
print("ok", {k:len(v) for k,v in out.items()})

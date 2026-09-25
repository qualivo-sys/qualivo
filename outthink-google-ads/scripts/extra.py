import json, urllib.request, urllib.parse
from pathlib import Path
C = json.loads(Path("gads_creds.json").read_text()); CID="9188115388"
d = urllib.parse.urlencode({"client_id":C["client_id"],"client_secret":C["client_secret"],"refresh_token":C["refresh_token"],"grant_type":"refresh_token"}).encode()
tok = json.load(urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token",data=d)))["access_token"]
H={"Authorization":f"Bearer {tok}","developer-token":C["developer_token"],"Content-Type":"application/json"}
def q(s):
    r=urllib.request.Request(f"https://googleads.googleapis.com/v25/customers/{CID}/googleAds:search",data=json.dumps({"query":s}).encode(),headers=H)
    return json.load(urllib.request.urlopen(r)).get("results",[])
def eur(m): return round(int(m or 0)/1e6,2)
R="BETWEEN '2026-08-31' AND '2026-09-25'"
print("== TOP KEYWORDS por registros ==")
rows=[(r["adGroupCriterion"]["keyword"]["text"], r["adGroupCriterion"]["keyword"]["matchType"], int(r["metrics"].get("clicks",0)), eur(r["metrics"].get("costMicros")), float(r["metrics"].get("conversions",0))) for r in q(f"SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, metrics.clicks, metrics.cost_micros, metrics.conversions FROM keyword_view WHERE segments.date {R}")]
for k in sorted(rows,key=lambda x:(-x[4],-x[3]))[:14]:
    print(f'  {k[0][:42]:42} {k[1]:6} clics={k[2]:>4} coste={k[3]:>8} reg={k[4]:.0f} CPL={round(k[3]/k[4],2) if k[4] else "—"}')
print("\n== TOP TÉRMINOS DE BÚSQUEDA con registro ==")
st=[(r["searchTermView"]["searchTerm"], int(r["metrics"].get("clicks",0)), eur(r["metrics"].get("costMicros")), float(r["metrics"].get("conversions",0))) for r in q(f"SELECT search_term_view.search_term, metrics.clicks, metrics.cost_micros, metrics.conversions FROM search_term_view WHERE segments.date {R}")]
for s in sorted(st,key=lambda x:-x[3])[:12]:
    if s[3]: print(f'  {s[0][:50]:50} clics={s[1]:>3} coste={s[2]:>7} reg={s[3]:.0f}')
print(f"\n  términos totales con clic: {len([x for x in st if x[1]])} · con registro: {len([x for x in st if x[3]])}")
print("\n== NEGATIVAS ==")
print("  campaña:", len(q("SELECT campaign_criterion.keyword.text FROM campaign_criterion WHERE campaign.name='OT26_Search' AND campaign_criterion.type='KEYWORD' AND campaign_criterion.negative=TRUE")))
print("  países excluidos:", len(q("SELECT campaign_criterion.location.geo_target_constant FROM campaign_criterion WHERE campaign.name='OT26_Search' AND campaign_criterion.type='LOCATION' AND campaign_criterion.negative=TRUE")))
print("\n== LISTAS DE REMARKETING ==")
for r in q("SELECT user_list.name, user_list.size_for_display, user_list.size_for_search FROM user_list"):
    u=r["userList"]; print(f'  {u["name"]:24} display={u.get("sizeForDisplay")} search={u.get("sizeForSearch")}')
print("\n== IS media de Search ==")
for r in q(f"SELECT metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share, metrics.average_cpc, metrics.ctr FROM campaign WHERE segments.date {R} AND campaign.name='OT26_Search'"):
    m=r["metrics"]; print(f'  IS={float(m.get("searchImpressionShare",0))*100:.1f} % · perdida presupuesto={float(m.get("searchBudgetLostImpressionShare",0))*100:.1f} % · perdida rango={float(m.get("searchRankLostImpressionShare",0))*100:.1f} % · CPC={eur(m.get("averageCpc"))} · CTR={float(m.get("ctr",0))*100:.2f} %')

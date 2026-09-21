import json, sys, urllib.request, urllib.parse, urllib.error
from pathlib import Path
C = json.loads(Path("gads_creds.json").read_text()); CID="9188115388"
d = urllib.parse.urlencode({"client_id":C["client_id"],"client_secret":C["client_secret"],"refresh_token":C["refresh_token"],"grant_type":"refresh_token"}).encode()
tok = json.load(urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token",data=d)))["access_token"]
H={"Authorization":f"Bearer {tok}","developer-token":C["developer_token"],"Content-Type":"application/json"}
API=f"https://googleads.googleapis.com/v25/customers/{CID}"
camps=json.loads(Path("camps.json").read_text())
FIN="2026-09-23 23:59:59"
ops=[{"update":{"resourceName":c["resourceName"],"endDateTime":FIN},"updateMask":"endDateTime"} for c in camps]
body={"operations":ops,"validateOnly": "--apply" not in sys.argv}
try:
    r=urllib.request.Request(f"{API}/campaigns:mutate",data=json.dumps(body).encode(),headers=H)
    res=json.load(urllib.request.urlopen(r))
    print(("APLICADO" if "--apply" in sys.argv else "VALIDADO OK"), len(res.get("results",[]) or ops), "campañas ->", FIN)
except urllib.error.HTTPError as e:
    print("ERROR:", e.read().decode()[:900])

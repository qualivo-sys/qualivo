import json, sys, urllib.request, urllib.parse, urllib.error
from pathlib import Path
C = json.loads(Path("gads_creds.json").read_text()); CID="9188115388"
d = urllib.parse.urlencode({"client_id":C["client_id"],"client_secret":C["client_secret"],"refresh_token":C["refresh_token"],"grant_type":"refresh_token"}).encode()
tok = json.load(urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token",data=d)))["access_token"]
H={"Authorization":f"Bearer {tok}","developer-token":C["developer_token"],"Content-Type":"application/json"}
API=f"https://googleads.googleapis.com/v25/customers/{CID}"
VO = "--apply" not in sys.argv
CAMP=f"customers/{CID}/campaigns/24182552133"
MOBILE=f"customers/{CID}/campaignCriteria/24182552133~30001"
def mutate(path, ops):
    try:
        r=urllib.request.Request(f"{API}/{path}",data=json.dumps({"operations":ops,"validateOnly":VO}).encode(),headers=H)
        res=json.load(urllib.request.urlopen(r)); return True, res
    except urllib.error.HTTPError as e:
        return False, e.read().decode()[:700]

# 1) tope de CPC 3,00 -> 4,50 € (estrategia Maximizar clics / TARGET_SPEND)
ok,res = mutate("campaigns:mutate", [{"update":{"resourceName":CAMP,"targetSpend":{"cpcBidCeilingMicros":"4500000"}},
                                      "updateMask":"targetSpend.cpcBidCeilingMicros"}])
print("Tope de CPC 3,00 -> 4,50 €:", "OK" if ok else "FALLO"); print("" if ok else res)

# 2) modificador de móvil -70 % -> -40 % (bidModifier 0,3 -> 0,6)
ok2,res2 = mutate("campaignCriteria:mutate", [{"update":{"resourceName":MOBILE,"bidModifier":0.6},
                                               "updateMask":"bidModifier"}])
print("Móvil -70 % -> -40 % (bidModifier 0,6):", "OK" if ok2 else "FALLO"); print("" if ok2 else res2)
print("\nMODO:", "VALIDACIÓN (no se ha tocado nada)" if VO else "APLICADO")

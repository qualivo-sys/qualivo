#!/usr/bin/env python3
"""Sube los assets de imagen de OutThink 2026 a la cuenta (inertes hasta usarse en un anuncio)."""
import base64
import json
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE = Path(__file__).parent
IMGDIR = BASE / "creativos/exports/descargable"
import os
CREDS = json.loads(Path(os.environ["GADS_CREDS_FILE"]).read_text())
CID = "9188115388"
API = "v25"

# Creatividades que usan las campañas según el plan (ad groups A/B/C y RMK)
CONCEPTS_3R = ["P1", "P2", "P3", "P5", "R1", "R2", "R3", "R5", "R6", "R7"]
SINGLES = [("C4", "SQ"), ("C5", "VT")]


def tok():
    data = urllib.parse.urlencode({
        "client_id": CREDS["client_id"], "client_secret": CREDS["client_secret"],
        "refresh_token": CREDS["refresh_token"], "grant_type": "refresh_token"}).encode()
    with urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", data=data)) as r:
        return json.load(r)["access_token"]


def make_op(name, path):
    return {"create": {
        "name": name,
        "imageAsset": {"data": base64.b64encode(path.read_bytes()).decode()},
    }}


files = []
for c in CONCEPTS_3R:
    for ratio in ["HZ", "SQ", "VT"]:
        files.append((f"OT26_{c}_{ratio}", IMGDIR / f"OT26_{c}_{ratio}_v1.png"))
for c, ratio in SINGLES:
    files.append((f"OT26_{c}_{ratio}", IMGDIR / f"OT26_{c}_{ratio}_v1.png"))
files.append(("OT26_Logo", BASE / "logo_270.png"))

for _, p in files:
    assert p.exists(), p

token = tok()
mapping = {}
BATCH = 8
for i in range(0, len(files), BATCH):
    chunk = files[i:i + BATCH]
    ops = [make_op(n, p) for n, p in chunk]
    req = urllib.request.Request(
        f"https://googleads.googleapis.com/{API}/customers/{CID}/assets:mutate",
        data=json.dumps({"operations": ops}).encode(),
        headers={"Authorization": f"Bearer {token}", "developer-token": CREDS["developer_token"],
                 "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            body = json.load(resp)
    except urllib.error.HTTPError as e:
        print("ERROR", e.code, e.read().decode()[:2000])
        raise SystemExit(1)
    for (name, _), res in zip(chunk, body["results"]):
        mapping[name] = res["resourceName"]
        print(name, "->", res["resourceName"])

(BASE / "asset_map.json").write_text(json.dumps(mapping, indent=2))
print(f"\n{len(mapping)} assets subidos. Mapa guardado en asset_map.json")

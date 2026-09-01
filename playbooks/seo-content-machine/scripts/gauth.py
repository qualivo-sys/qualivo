#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Token de service account de Google firmando el JWT con openssl (evita la librería cryptography).

Uso: define GOOGLE_SA_JSON en el entorno apuntando al JSON del service account.
Comparte el Sheet con el client_email del SA (Editor) y añádelo en Search Console.

    from gauth import get_token, api
    t = get_token(["https://www.googleapis.com/auth/spreadsheets"])
    data = api("GET", url, t)
"""
import json, base64, time, subprocess, tempfile, os, urllib.request, urllib.parse, urllib.error

SA = os.environ.get("GOOGLE_SA_JSON")  # ruta al JSON del service account


def _b64(b):
    return base64.urlsafe_b64encode(b).rstrip(b'=')


def get_token(scopes):
    if not SA or not os.path.exists(SA):
        raise RuntimeError("Define GOOGLE_SA_JSON con la ruta al JSON del service account.")
    sa = json.load(open(SA))
    now = int(time.time())
    header = {"alg": "RS256", "typ": "JWT"}
    claim = {"iss": sa["client_email"], "scope": " ".join(scopes),
             "aud": sa["token_uri"], "iat": now, "exp": now + 3600}
    signing_input = _b64(json.dumps(header).encode()) + b"." + _b64(json.dumps(claim).encode())
    with tempfile.NamedTemporaryFile('w', suffix='.pem', delete=False) as f:
        f.write(sa["private_key"]); keyfile = f.name
    p = subprocess.run(["openssl", "dgst", "-sha256", "-sign", keyfile],
                       input=signing_input, capture_output=True)
    os.unlink(keyfile)
    if p.returncode != 0:
        raise RuntimeError("openssl: " + p.stderr.decode())
    jwt = signing_input + b"." + _b64(p.stdout)
    data = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt.decode()}).encode()
    req = urllib.request.Request(sa["token_uri"], data=data)
    return json.loads(urllib.request.urlopen(req, timeout=30).read())["access_token"]


def api(method, url, token, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method,
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"})
    try:
        return json.loads(urllib.request.urlopen(req, timeout=60).read() or b'{}')
    except urllib.error.HTTPError as e:
        return {"_error": e.code, "_body": e.read().decode()[:500]}


if __name__ == "__main__":
    SHEET = os.environ.get("SHEET_ID", "")
    t = get_token(["https://www.googleapis.com/auth/spreadsheets",
                   "https://www.googleapis.com/auth/webmasters.readonly"])
    print("TOKEN OK:", t[:12], "…")
    if SHEET:
        meta = api("GET", "https://sheets.googleapis.com/v4/spreadsheets/%s?fields=properties.title,sheets.properties" % SHEET, t)
        if meta.get("_error"):
            print("SHEETS ERROR:", meta)
        else:
            print("SHEET:", meta["properties"]["title"])
            print("Pestañas:", [s["properties"]["title"] for s in meta.get("sheets", [])])
    sites = api("GET", "https://www.googleapis.com/webmasters/v3/sites", t)
    if sites.get("_error"):
        print("GSC ERROR:", sites)
    else:
        print("GSC sites:", [s.get("siteUrl") for s in sites.get("siteEntry", [])])

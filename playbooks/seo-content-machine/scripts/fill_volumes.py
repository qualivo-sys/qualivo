#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rellena la columna de volumen (F) del maestro para TODAS las URLs.

Estrategia en cascada:
  1. Match contra el agregado de DinoRank cacheado (similitud de tokens Jaccard).
  2. Si no hay match fuerte, llamada directa a DinoRank por la keyword de esa URL.
  3. Match relajado como último recurso.

Requiere que dino_enrich.py se haya ejecutado antes (deja el cache DINO_CACHE).
Entorno: DINORANK_API_KEY, SHEET_ID, DINO_CACHE, DINORANK_COUNTRY, DINORANK_LANGUAGE.
"""
import gauth, json, urllib.request, urllib.parse, unicodedata, re, time, os

K = os.environ["DINORANK_API_KEY"]
SHEET = os.environ["SHEET_ID"]
CACHE = os.environ.get("DINO_CACHE", "/tmp/dino_agg.json")
COUNTRY = os.environ.get("DINORANK_COUNTRY", "es")
LANG = os.environ.get("DINORANK_LANGUAGE", "es")
MAX_DIRECT = int(os.environ.get("MAX_DIRECT_CALLS", "75"))

agg = {k: tuple(v) for k, v in json.load(open(CACHE)).items()}


def norm(s):
    s = unicodedata.normalize("NFKD", s.lower()).encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s)).strip()


STOP = {"de", "la", "el", "los", "las", "en", "un", "una", "para", "por", "con", "mi",
        "del", "y", "a", "como", "que", "tu", "tus"}


def toks(s):
    return set(w for w in norm(s).split() if w not in STOP)


cand = [(k, v[0], v[1], toks(k)) for k, v in agg.items() if toks(k)]


def best_match(target):
    tt = toks(target)
    if not tt:
        return None
    best = None; bs = 0
    for k, vol, comp, kt in cand:
        if not kt:
            continue
        j = len(tt & kt) / len(tt | kt)
        if j > bs:
            bs = j; best = (k, vol, comp)
    return (best, bs)


def dino_direct(target):
    body = json.dumps({"keyword": target, "country": COUNTRY, "language": LANG}).encode()
    req = urllib.request.Request("https://api.dinorank.com/api/v1/keyword-research", data=body,
        headers={"X-API-Key": K, "Content-Type": "application/json"})
    try:
        d = json.loads(urllib.request.urlopen(req, timeout=90).read())
    except Exception:
        return None
    tt = toks(target); exact = None; bestj = None; bjs = 0
    for v in d.get("data", {}).get("data", {}).get("keywords", {}).values():
        if not isinstance(v, dict) or "keyword" not in v:
            continue
        try: vol = int(v.get("vol") or 0)
        except: vol = 0
        kt = toks(v["keyword"])
        if kt == tt:
            exact = (v["keyword"], vol, float(v.get("competencia") or 0))
        if kt:
            j = len(tt & kt) / len(tt | kt)
            if j > bjs:
                bjs = j; bestj = (v["keyword"], vol, float(v.get("competencia") or 0))
    if exact:
        return exact
    if bestj and bjs >= 0.5:
        return bestj
    return None


t = gauth.get_token(["https://www.googleapis.com/auth/spreadsheets"])
rng = "Keywords & Contenido!A1:K200"
vals = gauth.api("GET", "https://sheets.googleapis.com/v4/spreadsheets/%s/values/%s" % (
    SHEET, urllib.parse.quote(rng)), t).get("values", [])
updates = []; direct = 0; filled = 0
for i, row in enumerate(vals[1:], start=2):
    if len(row) < 4:
        continue
    url = row[3]; slug = url.rstrip("/").split("/")[-1] or "index"
    target = slug.replace("-", " ")
    m = best_match(target); chosen = None
    if m and m[0] and m[1] >= 0.62:
        chosen = m[0]
    if not chosen and direct < MAX_DIRECT:
        d = dino_direct(target); direct += 1; time.sleep(0.4)
        if d:
            chosen = d
    if not chosen and m and m[0] and m[1] >= 0.45:
        chosen = m[0]  # relajado
    if chosen:
        kw, vol, comp = chosen
        updates.append({"range": "Keywords & Contenido!F%d" % i, "values": [[vol]]})
        note = row[10] if len(row) > 10 else ""
        updates.append({"range": "Keywords & Contenido!K%d" % i,
                        "values": [["kw: %s · comp %.2f%s" % (kw, comp, (" · " + note) if note and 'sin datos' not in note else "")]]})
        filled += 1
if updates:
    gauth.api("POST", "https://sheets.googleapis.com/v4/spreadsheets/%s/values:batchUpdate" % SHEET, t,
              {"valueInputOption": "RAW", "data": updates})
print("Filas con volumen:", filled, "de", len(vals) - 1, "| llamadas directas DinoRank:", direct)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Keyword research con DinoRank + oportunidades de contenido.

- Lanza varias semillas contra /api/v1/keyword-research y agrega el máximo volumen por keyword.
- Cachea el agregado en disco (DINO_CACHE) para no repetir llamadas de API.
- Filtra al nicho, escribe la pestaña "Keyword Research", rellena volúmenes en el maestro
  y calcula "Oportunidades" (huecos con volumen >= umbral y sin artículo propio).

Entorno requerido: DINORANK_API_KEY, SHEET_ID, PUBLIC_DIR, BASE_URL.
Opcionales: DINORANK_COUNTRY (es), DINORANK_LANGUAGE (es), NAIL_TERMS, SEEDS (coma-separadas).
"""
import gauth, json, urllib.request, urllib.parse, unicodedata, glob, os, re, time

K = os.environ["DINORANK_API_KEY"]
SHEET = os.environ["SHEET_ID"]
PUB = os.environ.get("PUBLIC_DIR", "./public")
BASE = os.environ.get("BASE_URL", "").rstrip("/")
COUNTRY = os.environ.get("DINORANK_COUNTRY", "es")
LANG = os.environ.get("DINORANK_LANGUAGE", "es")
CACHE = os.environ.get("DINO_CACHE", "/tmp/dino_agg.json")

# Semillas y términos de nicho: personalízalos por proyecto (o pásalos por entorno).
SEEDS = [s.strip() for s in os.environ.get("SEEDS", "").split(",") if s.strip()] or [
    "curso de uñas", "uñas acrilicas", "uñas de gel", "manicura profesional",
    "cuanto gana manicurista", "nail art", "montar negocio de uñas", "aprender a hacer uñas"]
NICHE = [w.strip() for w in os.environ.get("NAIL_TERMS", "").split(",") if w.strip()] or [
    "uña", "uñas", "manicur", "nail", "acril", "acríl", "pedicur", "gel",
    "esmalt", "acrygel", "acrigel", "cuticul", "semiperman"]
OPP_MIN_VOL = int(os.environ.get("OPP_MIN_VOL", "70"))


def norm(s):
    s = unicodedata.normalize("NFKD", s.lower()).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def nostop(s):
    return " ".join(w for w in norm(s).split()
                    if w not in {"de", "la", "el", "los", "las", "en", "un", "una", "para", "por", "con", "mi", "del"})


def dino_kr(seed):
    body = json.dumps({"keyword": seed, "country": COUNTRY, "language": LANG}).encode()
    req = urllib.request.Request("https://api.dinorank.com/api/v1/keyword-research", data=body,
        headers={"X-API-Key": K, "Content-Type": "application/json"})
    try:
        d = json.loads(urllib.request.urlopen(req, timeout=90).read())
    except Exception as e:
        print("  seed", seed, "ERROR", e); return {}
    out = {}
    for v in d.get("data", {}).get("data", {}).get("keywords", {}).values():
        if not isinstance(v, dict) or "keyword" not in v:
            continue
        try: vol = int(v.get("vol") or 0)
        except: vol = 0
        try: comp = float(v.get("competencia") or 0)
        except: comp = 0.0
        kw = v["keyword"]
        if kw not in out or vol > out[kw][0]:
            out[kw] = (vol, comp)
    return out


if os.path.exists(CACHE):
    agg = {k: tuple(v) for k, v in json.load(open(CACHE)).items()}
    print("cache cargada:", len(agg), "keywords")
else:
    agg = {}
    for s in SEEDS:
        r = dino_kr(s)
        for kw, (vol, comp) in r.items():
            if kw not in agg or vol > agg[kw][0]:
                agg[kw] = (vol, comp)
        print("  semilla:", s, "→", len(r), "kw (acum", len(agg), ")"); time.sleep(1)
    json.dump(agg, open(CACHE, "w"))

nail = {kw: v for kw, v in agg.items() if any(w in kw.lower() for w in NICHE)}
print("TOTAL agregadas:", len(agg), "| nicho:", len(nail))

# Nuestros artículos (target keywords) a partir de los .html publicados.
ours = {}
for p in glob.glob(PUB + "/*.html"):
    n = os.path.basename(p)[:-5]
    if n in ("blog", "calculadora"):
        continue
    target = n.replace("-", " ")
    ours[nostop(target)] = "/" + ("" if n == "index" else n)


def have(kw):
    nk = nostop(kw)
    for okey in ours:
        if nk == okey or (len(nk) > 8 and (nk in okey or okey in nk)):
            return ours[okey]
    return ""


t = gauth.get_token(["https://www.googleapis.com/auth/spreadsheets"])


def ensure_tab(name):
    m = gauth.api("GET", "https://sheets.googleapis.com/v4/spreadsheets/%s?fields=sheets.properties.title" % SHEET, t)
    titles = [s["properties"]["title"] for s in m.get("sheets", [])]
    if name not in titles:
        gauth.api("POST", "https://sheets.googleapis.com/v4/spreadsheets/%s:batchUpdate" % SHEET, t,
                  {"requests": [{"addSheet": {"properties": {"title": name}}}]})
        print("  pestaña creada:", name)


def write(tab, data):
    ensure_tab(tab)
    rng = urllib.parse.quote(tab + "!A1")
    u = "https://sheets.googleapis.com/v4/spreadsheets/%s/values/%s?valueInputOption=RAW" % (SHEET, rng)
    print("  ", tab, "→", "OK" if not gauth.api("PUT", u, t, {"values": data}).get("_error") else "ERR")


# --- Pestaña Keyword Research (DinoRank) ---
kr_rows = [["Keyword", "Volumen/mes", "Competencia", "¿Tenemos artículo?", "URL nuestra", "Acción"]]
for kw, (vol, comp) in sorted(nail.items(), key=lambda x: -x[1][0])[:300]:
    url = have(kw)
    accion = "✅ Cubierta" if url else ("🎯 Crear artículo" if vol >= 50 else "considerar")
    kr_rows.append([kw, vol, round(comp, 2), "Sí" if url else "No", url, accion])
write("Keyword Research", kr_rows)

# --- Rellenar volumen en el maestro (col F) ---
meta = gauth.api("GET", "https://sheets.googleapis.com/v4/spreadsheets/%s/values/%s" % (
    SHEET, urllib.parse.quote("Keywords & Contenido!A1:K200")), t)
vals = meta.get("values", [])
dnorm = {}
for kw, (vol, comp) in nail.items():
    dnorm.setdefault(nostop(kw), vol)
    if vol > dnorm[nostop(kw)]:
        dnorm[nostop(kw)] = vol
updates = []
for i, row in enumerate(vals[1:], start=2):
    if len(row) < 4:
        continue
    url = row[3]
    slug = url.rstrip("/").split("/")[-1] or "index"
    target = slug.replace("-", " ")
    nk = nostop(target)
    vol = dnorm.get(nk)
    if vol is None:
        for dk, dv in dnorm.items():
            if len(nk) > 8 and (nk in dk or dk in nk):
                vol = dv; break
    if vol:
        updates.append({"range": "Keywords & Contenido!F%d" % i, "values": [[vol]]})
if updates:
    gauth.api("POST", "https://sheets.googleapis.com/v4/spreadsheets/%s/values:batchUpdate" % SHEET, t,
              {"valueInputOption": "RAW", "data": updates})
print("Volúmenes rellenados en maestro:", len(updates))

# --- Oportunidades: alto volumen SIN artículo ---
opp = [["Keyword oportunidad", "Volumen/mes", "Competencia", "Intención", "Prioridad", "Estado"]]
gaps = [(kw, vol, comp) for kw, (vol, comp) in nail.items() if not have(kw) and vol >= OPP_MIN_VOL]
for kw, vol, comp in sorted(gaps, key=lambda x: -x[1])[:40]:
    pr = "🔴" if vol >= 250 else ("🟠" if vol >= 110 else "🟢")
    opp.append([kw, vol, round(comp, 2), "Comercial" if "curso" in kw else "Informacional", pr, "Pendiente"])
write("Oportunidades", opp)
print("Oportunidades (gaps con vol>=%d):" % OPP_MIN_VOL, len(gaps))

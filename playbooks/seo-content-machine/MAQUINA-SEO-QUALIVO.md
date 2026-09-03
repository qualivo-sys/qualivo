# 🚀 Máquina de SEO + Contenidos + Captación — Guía completa (autocontenida)

> **Documento único para replicar el sistema en cualquier proyecto de cliente.**
> No necesita acceso a ningún repo: contiene el playbook, el brief para el agente, los scripts
> completos y el plan de embudo. Descárgalo, créate una carpeta y pega los scripts tal cual.
>
> Sistema original construido para **Eleva Academy** por **Qualivo**.

---

## ¿Qué monta este sistema?

1. **Máquina de contenidos SEO** — decenas de artículos con marca, schema, interlinking y sitemap.
2. **Lead magnets interactivos** — calculadoras / tests que capturan al CRM.
3. **Google Sheet de mando** — keywords · volumen (DinoRank) · posición (Search Console) · estado.
4. **Investigación de keywords** — DinoRank API + huecos de contenido priorizados.
5. **Embudo captación → nurturing → scoring** — plan a 60 días con hitos semanales.

---

## 📁 Estructura recomendada de la carpeta

Créala en el repo/proyecto del cliente y pega dentro los scripts de la sección "SCRIPTS":

```
seo-content-machine/
├── .env                 (rellenar con .env.example de abajo — NUNCA commitear)
├── scripts/
│   ├── gauth.py
│   ├── build_sheet.py
│   ├── dino_enrich.py
│   └── fill_volumes.py
└── public/              (aquí van los .html de los artículos publicados)
```

Ejecución típica (con el `.env` cargado como variables de entorno):

```bash
python scripts/gauth.py        # verifica acceso a Sheet + Search Console
python scripts/dino_enrich.py  # keyword research + oportunidades
python scripts/build_sheet.py  # crea el Sheet de mando y cruza con Search Console
python scripts/fill_volumes.py # rellena volúmenes por URL
```

---

## 🧭 Cómo se replica (resumen)

| Paso | Qué haces | Herramienta |
|------|-----------|-------------|
| 1 | Crear la carpeta y rellenar `.env` | — |
| 2 | Definir marca (CSS) y 5-10 pilares de contenido | Diseño + keyword research |
| 3 | Investigar keywords y volúmenes | `dino_enrich.py` |
| 4 | Generar artículos desde plantilla | generador de artículos (ver más abajo) |
| 5 | Desplegar + sitemap + robots que permita IA (GEO) | Vercel / hosting |
| 6 | Montar lead magnets que capturan al CRM | serverless `lead.js` (ver más abajo) |
| 7 | Crear el Google Sheet de mando y conectarlo | `build_sheet.py` |
| 8 | Rellenar volúmenes y posiciones | `fill_volumes.py` |
| 9 | Montar embudo email + scoring en el CRM | plan de 60 días (final del doc) |
| 10 | Reporte semanal/mensual | Sheet + GA4 |

---

## 🏗️ Arquitectura

```
                       ┌─────────────────────────┐
   Keyword research    │  DinoRank API            │  volúmenes, competencia,
   (dino_enrich.py) ──▶│  (X-API-Key)             │  huecos de contenido
                       └─────────────────────────┘
                                    │
                                    ▼
   ┌───────────────────────────────────────────────────────┐
   │  Google Sheet de mando  (build_sheet.py)               │
   │   · Keywords & Contenido  (maestro: kw|vol|url|pos)    │
   │   · GSC en vivo           (Search Console API)         │
   │   · Oportunidades         (huecos ≥ volumen objetivo)  │
   │   · Visibilidad IA (LLM)  (prompts de citación)        │
   └───────────────────────────────────────────────────────┘
        ▲                                    ▲
        │ posiciones/clics/impresiones       │ artículos publicados
        │                                    │
   ┌────┴───────────────┐        ┌───────────┴──────────────┐
   │ Search Console API │        │  Sitio de contenidos      │
   │ sc-domain:dominio  │        │  · N artículos con marca  │
   │ (gauth.py + JWT)   │        │  · schema Article/FAQ     │
   └────────────────────┘        │  · interlinking + sitemap │
                                 │  · robots permite IA (GEO)│
                                 │  · lead magnets → CRM     │
                                 └───────────┬───────────────┘
                                             │ leads
                                             ▼
                                 ┌──────────────────────────┐
                                 │  CRM (GoHighLevel)        │
                                 │  · secuencia de emails    │
                                 │  · lead scoring           │
                                 │  · handoff a comercial    │
                                 └──────────────────────────┘
```

---

## 🔐 Credenciales necesarias (preparar ANTES)

- [ ] **Service account de Google** con JSON descargado → variable `GOOGLE_SA_JSON`.
- [ ] **Google Sheet** creado y **compartido con el email del service account** (Editor) → `SHEET_ID`.
- [ ] Ese mismo email **añadido en Search Console** de `sc-domain:DOMINIO`.
- [ ] API key de **DinoRank** → `DINORANK_API_KEY`. Docs: `https://api.dinorank.com/docs/docs.html`.
- [ ] Acceso al **CRM (GoHighLevel)**: token + `locationId` (van en el hosting, no en el repo).
- [ ] Acceso al **hosting** (Vercel u otro) y al **DNS** del dominio.

> ⚠️ **Seguridad:** nunca commitees claves, tokens ni el JSON del service account. Todo por `.env`
> (git-ignored). Los scripts leen credenciales solo de variables de entorno. Si un secreto se
> expone en un chat/PR, **rótalo** de inmediato.

---

## 🤖 BRIEF PARA LANZAR EL AGENTE (copiar/pegar)

Abre una sesión de Claude Code en el repo del cliente y pega esto (rellena lo de `<< >>`):

```
Eres un agente de Qualivo. Vas a montar la "Máquina de SEO + Contenidos + Captación"
para el cliente << NOMBRE_CLIENTE >> (nicho: << NICHO >>, dominio: << DOMINIO >>).

Sigue esta guía (el .md que te paso). Reglas:
- Trabaja en la rama << RAMA_FEATURE >>. Commitea con mensajes claros. No abras PR salvo que lo pida.
- NUNCA commitees claves, tokens ni el JSON del service account. Todo por variables de entorno / .env
  (git-ignored). Si un secreto queda expuesto, avísame para rotarlo.

Fases (confírmame al final de cada una):
1. MARCA Y PILARES — define el CSS de marca del cliente; propón 5-10 pilares hub-and-spoke.
2. KEYWORD RESEARCH — ejecuta dino_enrich.py con SEEDS/NAIL_TERMS del nicho; dame las oportunidades.
3. CONTENIDO — crea un generador de artículos (plantilla con header de marca, índice TOC, recap,
   CTA a lead magnet y schema Article/FAQPage); genera >=10 artículos + índice de blog + interlinking.
4. PUBLICACIÓN Y GEO — despliega (cleanUrls, sin SSO); sitemap.xml + robots.txt que PERMITA bots de IA
   (GPTBot, ClaudeBot, Google-Extended); si hay Cloudflare, CNAME en DNS-only; envía sitemap a Search Console.
5. CAPTACIÓN — 1-3 lead magnets interactivos que capturen al CRM (serverless tipo lead.js).
6. GOOGLE SHEET — crea el Sheet, compártelo con el service account, define SHEET_ID; ejecuta
   build_sheet.py y luego fill_volumes.py.
7. EMBUDO Y PLAN — adapta el plan de 60 días; define secuencia de emails, lead scoring y reporting.

Empieza confirmándome el .env que necesitas (usa el .env.example de la guía) y la fase 1.
```

**Qué NO hace el agente solo (decisiones humanas):** elegir el ángulo comercial y la oferta,
aprobar el tono/marca, conectar y pagar herramientas, y rotar/gestionar secretos.

---

## ⚙️ .env.example

```bash
# ─── Máquina SEO Qualivo · variables de entorno ───
# Copia a `.env` y rellena. NUNCA commitees el .env con valores reales.

# Google service account (JSON descargado de Google Cloud).
# Comparte el Sheet con este email (Editor) y añádelo en Search Console.
GOOGLE_SA_JSON=/ruta/al/service-account.json

# ID del Google Sheet de mando (lo que va entre /d/ y /edit en la URL).
SHEET_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Dominio del proyecto (sin https). Search Console usa sc-domain:DOMINIO.
SITE_DOMAIN=ejemplo.com

# URL base pública del blog/contenido (con https, sin barra final).
BASE_URL=https://blog.ejemplo.com

# Carpeta local con los .html publicados (para cruzar con GSC/DinoRank).
PUBLIC_DIR=./public

# DinoRank
DINORANK_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
DINORANK_COUNTRY=es
DINORANK_LANGUAGE=es

# GoHighLevel (para el serverless de captación, se configuran en el hosting)
GHL_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GHL_LOCATION_ID=xxxxxxxxxxxxxxxxxxxx
```

---

## 📝 Notas de implementación (aprendizajes de Eleva)

- **Auth de Google sin `cryptography`:** `gauth.py` firma el JWT del service account con `openssl`,
  útil en entornos donde no puedes instalar librerías nativas.
- **DinoRank:** endpoint principal `POST /api/v1/keyword-research` con `{keyword,country,language}`;
  devuelve `data.data.keywords{}` con `vol` y `competencia`. Otros: tfidf, tracking, visibility,
  canibalizaciones, llms (requiere project_id), auditoria, seolocal.
- **Search Console:** usa `sc-domain:DOMINIO` (cubre subdominios como `blog.dominio`). Endpoint
  `searchAnalytics/query` para posiciones; `sitemaps` (PUT) para enviar el sitemap por API.
- **GEO (posicionamiento en IA):** robots.txt debe **permitir** GPTBot, ClaudeBot y Google-Extended.
  Si el dominio pasa por Cloudflare, pon el CNAME del blog en **DNS-only (nube gris)** para que se
  sirva *tu* robots.txt y no el gestionado de Cloudflare (que bloquea esos bots).
- **Contenido:** patrón hub-and-spoke (pilares + satélites enlazados). Plantilla de artículo con
  header de marca, índice (TOC) cuando hay ≥3 secciones, recap final, CTA a lead magnet y schema
  `Article`/`FAQPage`/`WebApplication`.
- **Insight clave:** cruza siempre intención comercial con volumen real. En Eleva, las keywords de
  *diseño/inspiración* tenían 10-20× más volumen que las de curso (p. ej. "diseños de uñas con gel"
  18.100/mes vs. keywords de curso ~1.000/mes).

---

## 💧 Lead magnet → CRM (patrón del serverless)

Serverless (p. ej. en Vercel `/api/lead.js`) que crea el contacto en **GoHighLevel**:

- API v2 `services.leadconnectorhq.com`, cabecera `Version: 2021-07-28`, requiere `User-Agent`.
- `POST /contacts/` con `source`, `tag` y campos personalizados (`detalle`, `origen`).
- Tolera duplicados (GHL puede rechazar por teléfono/email repetido — captúralo y sigue).
- `GHL_TOKEN` y `GHL_LOCATION_ID` van en variables de entorno del hosting, **nunca en el repo**.

Tipos que funcionaron: calculadora de ingresos, calculadora de precios, test "¿qué producto/curso
necesitas?". Siempre **interactivo + aporta valor + captura al CRM**.

---

# 📦 SCRIPTS (pegar tal cual en `scripts/`)

### `scripts/gauth.py`

```python
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
```

### `scripts/dino_enrich.py`

```python
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
```

### `scripts/build_sheet.py`

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Crea y rellena el Google Sheet de mando de la máquina SEO.

Pestañas: "Keywords & Contenido" (maestro), "GSC en vivo", "Oportunidades", "Visibilidad IA (LLM)".
Lee los artículos publicados en PUBLIC_DIR, los cruza con Search Console (últimos 90d) y escribe todo.

Entorno requerido: SHEET_ID, PUBLIC_DIR, BASE_URL, SITE_DOMAIN, GOOGLE_SA_JSON.
"""
import gauth, glob, os, re, datetime, urllib.parse

SHEET = os.environ["SHEET_ID"]
PUB = os.environ.get("PUBLIC_DIR", "./public")
BASE = os.environ.get("BASE_URL", "").rstrip("/")
DOMAIN = os.environ["SITE_DOMAIN"]

t = gauth.get_token(["https://www.googleapis.com/auth/spreadsheets",
                     "https://www.googleapis.com/auth/webmasters.readonly"])


# ---------- 1) Leer nuestro contenido ----------
def grab(html, tag):
    m = re.search(r"<%s[^>]*>(.*?)</%s>" % (tag, tag), html, re.S)
    return re.sub("<[^>]+>", "", m.group(1)).strip() if m else ""


arts = []
for p in sorted(glob.glob(PUB + "/*.html")):
    name = os.path.basename(p)[:-5]
    html = open(p, encoding="utf-8").read()
    h1 = grab(html, "h1") or name
    m = re.search(r'class="eyebrow"[^>]*>(.*?)</span>', html, re.S)
    eb = re.sub("<[^>]+>", "", m.group(1)).strip() if m else ""
    url = BASE + "/" if name == "index" else BASE + "/" + name
    arts.append({"slug": name, "h1": h1, "cat": eb.split("·")[0].strip() or "—", "url": url})

# ---------- 2) GSC (90d) por página y por query ----------
site = "sc-domain:" + DOMAIN
gu = "https://www.googleapis.com/webmasters/v3/sites/%s/searchAnalytics/query" % urllib.parse.quote(site, safe="")
end = datetime.date.today().isoformat()
start = (datetime.date.today() - datetime.timedelta(days=90)).isoformat()
pg = gauth.api("POST", gu, t, {"startDate": start, "endDate": end, "dimensions": ["page"], "rowLimit": 1000})
qy = gauth.api("POST", gu, t, {"startDate": start, "endDate": end, "dimensions": ["query"], "rowLimit": 1000})
page_map = {r["keys"][0].rstrip("/"): r for r in pg.get("rows", [])}
queries = qy.get("rows", [])


def cat_intent(c):
    c = c.lower()
    if "local" in c or "formaci" in c or "titula" in c:
        return "Comercial"
    if "negocio" in c:
        return "Comercial/Info"
    if "tendencia" in c or "temporada" in c:
        return "Informacional"
    return "Informacional"


# ---------- 3) Filas del maestro ----------
header = ["Keyword / Tema", "Categoría", "Intención", "URL del artículo", "Estado",
          "Volumen (DinoRank)", "Pos. media (GSC 90d)", "Clics (90d)", "Impresiones (90d)", "Prioridad", "Notas"]
rows = [header]
for a in sorted(arts, key=lambda x: x["cat"]):
    g = page_map.get(a["url"].rstrip("/"))
    pos = round(g["position"], 1) if g else ""
    clk = g["clicks"] if g else ""
    imp = g["impressions"] if g else ""
    rows.append([a["h1"], a["cat"], cat_intent(a["cat"]), a["url"], "Publicado", "", pos, clk, imp,
                 "🟢 Normal", "" if g else "sin datos GSC aún (recién publicado)"])

# ---------- 4) GSC en vivo (top consultas) ----------
gsc_rows = [["Consulta (Search Console)", "Clics", "Impresiones", "CTR %", "Pos. media"]]
for r in sorted(queries, key=lambda x: -x["impressions"])[:100]:
    gsc_rows.append([r["keys"][0], r["clicks"], r["impressions"], round(r["ctr"] * 100, 1), round(r["position"], 1)])
if len(gsc_rows) == 1:
    gsc_rows.append(["(sin datos todavía — el dominio es nuevo)", "", "", "", ""])

# ---------- 5) Oportunidades (placeholder; dino_enrich.py la rellena con datos reales) ----------
opp = [["Keyword oportunidad", "Categoría", "Intención", "Por qué / origen", "Prioridad", "Estado"]]

# ---------- 6) Visibilidad IA (LLM) ----------
llm = [["Prompt de prueba (ChatGPT/Perplexity/Gemini)", "¿Nos cita? (sí/no)", "Fecha check", "Notas"]]

# ---------- Crear/renombrar pestañas ----------
meta = gauth.api("GET", "https://sheets.googleapis.com/v4/spreadsheets/%s?fields=sheets.properties" % SHEET, t)
existing = {s["properties"]["title"]: s["properties"]["sheetId"] for s in meta["sheets"]}
first_id = list(existing.values())[0]
want = ["Keywords & Contenido", "GSC en vivo", "Oportunidades", "Visibilidad IA (LLM)"]
reqs = [{"updateSheetProperties": {"properties": {"sheetId": first_id, "title": want[0]}, "fields": "title"}}]
for name in want[1:]:
    if name not in existing:
        reqs.append({"addSheet": {"properties": {"title": name}}})
res = gauth.api("POST", "https://sheets.googleapis.com/v4/spreadsheets/%s:batchUpdate" % SHEET, t, {"requests": reqs})
ids = {want[0]: first_id}
for rep in res.get("replies", []):
    if "addSheet" in rep:
        ids[rep["addSheet"]["properties"]["title"]] = rep["addSheet"]["properties"]["sheetId"]
meta2 = gauth.api("GET", "https://sheets.googleapis.com/v4/spreadsheets/%s?fields=sheets.properties" % SHEET, t)
for s in meta2["sheets"]:
    ids[s["properties"]["title"]] = s["properties"]["sheetId"]


# ---------- Escribir valores ----------
def write(tab, data):
    rng = "%s!A1" % tab.replace("'", "")
    u = "https://sheets.googleapis.com/v4/spreadsheets/%s/values/%s?valueInputOption=RAW" % (SHEET, urllib.parse.quote(rng))
    r = gauth.api("PUT", u, t, {"values": data})
    print("  ", tab, "→", "OK" if not r.get("_error") else r)


write("Keywords & Contenido", rows)
write("GSC en vivo", gsc_rows)
write("Oportunidades", opp)
write("Visibilidad IA (LLM)", llm)

# ---------- Formato (cabecera negrita + congelar fila 1) ----------
fmt = []
for name, sid in ids.items():
    if name not in want:
        continue
    fmt.append({"repeatCell": {"range": {"sheetId": sid, "startRowIndex": 0, "endRowIndex": 1},
        "cell": {"userEnteredFormat": {"textFormat": {"bold": True}, "backgroundColor": {"red": 0.99, "green": 0.89, "blue": 0.93}}},
        "fields": "userEnteredFormat.textFormat,userEnteredFormat.backgroundColor"}})
    fmt.append({"updateSheetProperties": {"properties": {"sheetId": sid, "gridProperties": {"frozenRowCount": 1}}, "fields": "gridProperties.frozenRowCount"}})
gauth.api("POST", "https://sheets.googleapis.com/v4/spreadsheets/%s:batchUpdate" % SHEET, t, {"requests": fmt})
print("Listo. Artículos:", len(arts), "| consultas GSC:", len(queries))
```

### `scripts/fill_volumes.py`

```python
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
```

---

# 📅 PLAN DE EMBUDO A 60 DÍAS (plantilla)

Adapta volúmenes, metas y nombres a cada proyecto.

## Punto de partida (rellenar)

| Métrica | Hoy | Meta 60 días |
|---|---|---|
| Artículos publicados | `<<N>>` | `<<N+50>>` |
| Tráfico orgánico | base | +150% visitas/mes |
| Leads / mes al CRM | — | 40–60 |
| Secuencia de email | 0 | activa (5 pasos) |
| Lead scoring | 0 | vivo en el CRM |

## Los 5 frentes

- **SEO & Contenido** · 8–10 artículos/semana, optimización por posición, GEO (citación en LLMs).
- **Captación** · CTAs en artículos top, pop-up/banner, WhatsApp, A/B de titulares.
- **Lead Nurturing** · secuencia de emails → llamada, ramas por segmento, reactivación de fríos.
- **Lead Scoring** · frío/templado/caliente, avisos al comercial, handoff automático.
- **Analítica** · GA4 + Search Console + Sheet, informes mensuales, coste por lead.

## MES 1 — Cimientos y captación

- **Sem 1 · CRM y medición al día cero:** sitemap enviado e indexación revisada; lead magnets
  capturando al CRM (verificado) con origen/UTM; definir etapas del pipeline; listar señales de
  scoring; GA4 + Search Console + Sheet sincronizados.
- **Sem 2 · Secuencia de bienvenida viva:** 8 artículos nuevos + interlinking a lead magnets; CTA en
  los 20 artículos con más tráfico + pop-up; **workflow de 5 emails** (valor · caso éxito ·
  objeciones · oferta · llamada); puntuar apertura y clic; medir apertura/clic de la secuencia.
- **Sem 3 · Scoring en marcha:** 8 artículos + 2 pilares reforzados; WhatsApp como canal + A/B de
  titular; ramas de nurturing por lead magnet; **modelo de puntos activo** (frío/templado/caliente) +
  aviso al equipo; reparto de leads por score y origen.
- **Sem 4 · Cierre de mes y ajuste:** 8 artículos + revisión de canibalizaciones; doblar CTA donde
  hay impresiones y 0 clics; reescribir el email de peor apertura; recalibrar umbrales de scoring;
  **Informe Mes 1**.

## MES 2 — Nurturing, scoring y escala

- **Sem 5 · Nutrición por segmento:** 10 artículos (huecos ≥ volumen objetivo); lead magnet nuevo
  (PDF descargable); 2 secuencias segmentadas + reactivación de fríos (>30 días); puntos por visita a
  precios/producto; conversión por segmento.
- **Sem 6 · GEO y autoridad:** 10 artículos + schema FAQ ampliado; chequeo de citación en LLMs;
  retargeting básico; toque de WhatsApp a la secuencia de calientes; score negativo por inactividad;
  seguimiento de menciones en IA.
- **Sem 7 · Optimización por conversión:** actualizar 10 artículos con mejor potencial + enlaces a
  páginas comerciales; optimizar el lead magnet que más convierte y rehacer el peor; email de
  urgencia; handoff automático de calientes al comercial; coste por lead y por llamada.
- **Sem 8 · Balance de 60 días:** 10 artículos → meta cumplida; documentar el embudo que mejor
  convierte; congelar la secuencia ganadora; modelo de scoring validado contra ventas; **Informe 60
  días** + plan del trimestre siguiente.

## Ritmo de trabajo

8–10 artículos/semana · Sheet SEO al día · check-in semanal (20 min) · informe mensual · aviso de
lead caliente en tiempo real al comercial.

---

*Guía Qualivo — Máquina de SEO + Contenidos + Captación. Adáptala a cada cliente. No commitees
secretos: todo por `.env`.*

#!/usr/bin/env python3
"""Detecta leads INPROGRESS que no pueden avanzar porque el buzon que abrio su
hilo ya no esta enganchado a la campana.

Smartlead manda cada seguimiento desde el mismo buzon que mando el correo 1,
para mantener el hilo. Si ese buzon se desengancha de la campana, el lead se
queda INPROGRESS para siempre y no genera ningun error: la campana sigue
ACTIVE, el lead sigue vivo, y simplemente no sale nada. Eso paso el 6-oct-2026
al desenganchar los buzones de SURBL: 36 leads bloqueados sin un solo aviso.

Esta comprobacion es la que faltaba. Uso:
    python3 atascados.py "$(cat .smartlead_key)" [--json salida.json]

Salida con codigo 1 si hay algun lead bloqueado, para poder encadenarlo.
"""
import collections
import datetime
import json
import subprocess
import sys

API = "https://server.smartlead.ai/api/v1"
UA = ["-H", "User-Agent: Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36"]


def get(url):
    r = subprocess.run(["curl", "-s", *UA, url], capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        return None


def paginar_leads(key, cid):
    """/leads pagina de 100 en 100. Sin limite devuelve solo la primera pagina."""
    off, todos = 0, []
    while off <= 5000:
        p = get(f"{API}/campaigns/{cid}/leads?api_key={key}&offset={off}&limit=100") or {}
        ds = p.get("data") or []
        if not ds:
            break
        todos += ds
        off += 100
    return todos


def huecos(key, cid):
    """delayInDays por paso. huecos[n] = dias de espera tras el paso n."""
    seq = get(f"{API}/campaigns/{cid}/sequences?api_key={key}") or []
    out = []
    for s in seq:
        d = s.get("seq_delay_details")
        out.append(d.get("delayInDays") if isinstance(d, dict) else None)
    return out


def revisar(key, hoy=None):
    hoy = hoy or datetime.date.today()
    campanas = [c for c in (get(f"{API}/campaigns?api_key={key}") or []) if c.get("status") == "ACTIVE"]
    bloqueados, resumen = [], collections.Counter()
    for c in campanas:
        cid = c["id"]
        mb = get(f"{API}/campaigns/{cid}/email-accounts?api_key={key}")
        enganchados = {str(e.get("from_email", "")).lower() for e in mb} if isinstance(mb, list) else set()
        gaps = huecos(key, cid)
        for d in paginar_leads(key, cid):
            if (d.get("status") or "") != "INPROGRESS":
                continue
            lead = d.get("lead") or {}
            mh = get(f"{API}/campaigns/{cid}/leads/{lead.get('id')}/message-history?api_key={key}") or {}
            envs = [m for m in (mh.get("history") or []) if m.get("type") == "SENT"]
            if not envs:
                resumen["sin arrancar"] += 1
                continue
            emisor = str(envs[-1].get("from") or "").lower()
            if emisor in enganchados:
                resumen["al dia"] += 1
                continue
            # el emisor no esta: mirar si ademas ya tenia un paso vencido
            n = len(envs)
            gap = gaps[n] if n < len(gaps) and gaps[n] else None
            ultimo = datetime.date.fromisoformat(str(envs[-1].get("time"))[:10])
            vencido = gap is not None and (ultimo + datetime.timedelta(days=gap)) < hoy
            resumen["BLOQUEADO" if vencido else "emisor fuera, aun no vencido"] += 1
            bloqueados.append({
                "campana_id": cid,
                "campana": c.get("name"),
                "email": lead.get("email"),
                "empresa": lead.get("company_name"),
                "emisor_desenganchado": emisor,
                "pasos_enviados": n,
                "ultimo_envio": str(ultimo),
                "paso_debido": str(ultimo + datetime.timedelta(days=gap)) if gap else None,
                "vencido": vencido,
                "custom_fields": lead.get("custom_fields") or {},
            })
    return bloqueados, resumen


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    key = sys.argv[1]
    bloqueados, resumen = revisar(key)
    for k, v in sorted(resumen.items(), key=str):
        print(f"  {v:4}  {k}")
    vencidos = [b for b in bloqueados if b["vencido"]]
    print(f"\nleads que no pueden avanzar: {len(bloqueados)} (de ellos con paso ya vencido: {len(vencidos)})")
    porcampana = collections.Counter(b["campana"] for b in bloqueados)
    for nombre, n in porcampana.most_common():
        print(f"  {n:3}  {nombre}")
    if "--json" in sys.argv:
        destino = sys.argv[sys.argv.index("--json") + 1]
        json.dump(bloqueados, open(destino, "w"), ensure_ascii=False, indent=1)
        print(f"detalle en {destino}")
    return 1 if bloqueados else 0


if __name__ == "__main__":
    sys.exit(main())

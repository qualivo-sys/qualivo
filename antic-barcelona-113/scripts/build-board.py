#!/usr/bin/env python3
"""Genera landing/creatividades.html a partir de landing/ads/creativos.js."""
import re, json, os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(BASE, 'landing/ads/creativos.js'), encoding='utf-8').read()
body = src[src.index('['):src.rindex(']') + 1]
body = re.sub(r'(\w+):', r'"\1":', body)
body = body.replace("'", '"')
body = re.sub(r',(\s*[}\]])', r'\1', body)
data = json.loads(body)

def em(t):
    return re.sub(r'\*(.+?)\*', r'<em>\1</em>', t)

conceptos = []
for c in data:
    if c['concepto'] not in conceptos:
        conceptos.append(c['concepto'])

bloques = []
for con in conceptos:
    cards = []
    for c in [x for x in data if x['concepto'] == con]:
        ia = '<span class="tag tag--ia">Ambientación IA</span>' if c.get('ia') else ''
        cards.append(f'''
      <article class="cr">
        <div class="cr__img"><img src="/ads/png/AB113_{c['id']}_4x5.jpg" alt="Creatividad {c['id']}" loading="lazy"></div>
        <div class="cr__meta">
          <div class="cr__hd"><b>{c['id']}</b><span>{c['exec']}</span>{ia}</div>
          <p class="cr__h">{em(c['headline'])}</p>
          <p class="cr__s">{c['sub']}</p>
          <dl>
            <dt>Layout</dt><dd>{c['layout']}</dd>
            <dt>Primero se ve</dt><dd>{c['primero']}</dd>
            <dt>A los 2 s</dt><dd>{c['dosSeg']}</dd>
            <dt>CTA</dt><dd>{c['cta']}</dd>
          </dl>
          <p class="dl">Descargar:
            <a href="/ads/png/AB113_{c['id']}_4x5.jpg" download>4:5</a>
            <a href="/ads/png/AB113_{c['id']}_1x1.jpg" download>1:1</a>
            <a href="/ads/png/AB113_{c['id']}_9x16.jpg" download>9:16</a>
          </p>
        </div>
      </article>''')
    bloques.append(f'''
    <section class="blk" data-rv>
      <div class="blk__hd"><span class="eyebrow">{con}</span><hr class="rule"></div>
      <div class="crs">{''.join(cards)}</div>
    </section>''')

n_piezas = len(data) * 3
zip_mb = round(os.path.getsize(os.path.join(BASE, 'landing/descargas/creatividades-antic-barcelona-113.zip')) / 1048576) \
    if os.path.exists(os.path.join(BASE, 'landing/descargas/creatividades-antic-barcelona-113.zip')) else 9

html = f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#14100D">
<meta name="robots" content="noindex">
<title>Creatividades Meta — Antic Barcelona 113</title>
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/main.css">
<link rel="icon" href="/assets/photos/logo-antic-barcelona-113.png">
<style>
  body{{background:var(--ink-900);color:var(--text-inverse)}}
  .hd{{padding-block:clamp(96px,13vh,150px) clamp(30px,4vw,50px)}}
  .hd h1{{font-family:var(--font-editorial);font-weight:400;font-size:clamp(2.2rem,5.4vw,4rem);line-height:1.02;color:var(--paper-000);margin-block:14px 16px}}
  .hd h1 em{{font-style:italic;color:var(--oak-400)}}
  .blk{{padding-block:clamp(34px,4.6vw,64px)}}
  .blk__hd{{display:flex;align-items:center;gap:20px;margin-bottom:clamp(22px,3vw,36px)}}
  .blk__hd .rule{{flex:1;background:var(--border-inverse)}}
  .blk__hd .eyebrow{{color:var(--oak-400)}}
  .crs{{display:grid;gap:clamp(20px,2.6vw,34px);grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr))}}
  .cr{{display:grid;grid-template-columns:1fr;gap:18px;align-items:start;border:1px solid var(--border-inverse);padding:18px;background:rgba(255,255,255,.02)}}
  @media(min-width:640px){{.cr{{grid-template-columns:220px 1fr}}}}
  .cr__img{{overflow:hidden;background:var(--ink-800)}}
  .cr__img img{{width:100%;height:auto;display:block}}
  .cr__hd{{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}}
  .cr__hd b{{font-family:var(--font-label);font-size:12px;font-weight:700;letter-spacing:.12em;background:var(--oak-600);color:var(--paper-000);padding:4px 9px;border-radius:3px}}
  .cr__hd span{{font-family:var(--font-label);font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--text-inverse-muted)}}
  .tag--ia{{border:1px solid var(--border-inverse);padding:3px 8px;border-radius:999px;font-size:9.5px!important}}
  .cr__h{{font-family:var(--font-editorial);font-size:1.5rem;line-height:1.14;color:var(--paper-000);margin-bottom:5px}}
  .cr__h em{{font-style:italic;color:var(--oak-400)}}
  .cr__s{{font-size:14px;color:var(--text-inverse-muted);margin-bottom:16px}}
  .cr dl{{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0 0 16px;font-size:13px}}
  .cr dt{{font-family:var(--font-label);font-size:9.5px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--ink-400);align-self:center}}
  .cr dd{{margin:0;color:var(--paper-200)}}
  .dl{{font-family:var(--font-label);font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-400)}}
  .dl a{{color:var(--oak-400);margin-left:9px;text-decoration:underline;text-underline-offset:3px}}
  .dl a:hover{{color:var(--paper-000)}}
</style>
</head>
<body>
<div class="grain" aria-hidden="true"></div>
<header class="topbar stuck">
  <a class="topbar__logo" href="/"><img src="/assets/photos/logo-antic-barcelona-113.png" alt="Antic Barcelona 113"></a>
  <a class="btn btn--ghost" href="/" style="border-color:var(--border-inverse);color:var(--paper-100)">← Ver la landing</a>
</header>

<main class="wrap">
  <div class="hd">
    <span class="eyebrow eyebrow--inv">Campaña Meta Ads · {len(data)} creatividades × 3 formatos</span>
    <h1>Cinco ángulos para averiguar <em>cuál compra.</em></h1>
    <p class="lead" style="color:var(--text-inverse-muted)">Cada concepto ataca una motivación distinta. Salen los {len(data)} a la vez, con el mismo presupuesto, y a las tres semanas los datos dicen cuál se queda. Todos están en 4:5 (feed), 1:1 (feed cuadrado) y 9:16 (Reels y Stories).</p>
    <p style="margin-top:28px"><a class="btn btn--inv" href="/descargas/creatividades-antic-barcelona-113.zip" download>Descargar las {n_piezas} creatividades (ZIP, {zip_mb} MB) <span class="arw">↓</span></a></p>
    <p class="note" style="margin-top:26px;background:rgba(255,255,255,.03);border-color:var(--oak-500);color:var(--text-inverse-muted)"><strong style="color:var(--paper-100)">Sobre las imágenes marcadas como “Ambientación IA”:</strong> la pieza es real y sale del taller de Terrassa; lo recreado digitalmente es el entorno. Nunca se presentan como proyectos entregados. Las fotos de proyectos reales van en la landing, no en el anuncio.</p>
  </div>
  {''.join(bloques)}
  <div style="padding-block:clamp(40px,6vw,90px);border-top:1px solid var(--border-inverse);margin-top:40px">
    <p class="eyebrow eyebrow--inv" style="margin-bottom:12px">Siguiente paso</p>
    <p class="lead" style="color:var(--text-inverse-muted)">Los copys completos de cada anuncio (texto principal, titular y descripción) están en el documento de estrategia, apartado 03.</p>
  </div>
</main>
<script src="/assets/js/main.js"></script>
</body>
</html>'''
open(os.path.join(BASE, 'landing/creatividades.html'), 'w', encoding='utf-8').write(html)
print(f'creatividades.html: {len(data)} piezas, {n_piezas} archivos')

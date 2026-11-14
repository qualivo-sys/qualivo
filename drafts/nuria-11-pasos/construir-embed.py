# Genera embeds/nuria-11-pasos.js a partir de landing-11-pasos-GHL.html.
# En Kliking solo va el cargador (ver cargador-kliking.html); los cambios se publican en qualivo.io.
import json, re, pathlib
base = pathlib.Path(__file__).parent
html = (base / 'landing-11-pasos-GHL.html').read_text()
scripts = re.findall(r'<script>(.*?)</script>', html, re.S)
config, logica = scripts[0], scripts[-1]
estilo = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
cuerpo = re.search(r'(<div id="n11">.*)<script>', html, re.S).group(1).strip()
js = ('/* A 11 Pasos del Sueño · landing (generado; no editar a mano) */\n(function(){\n'
      + config.strip() + '\n'
      + 'var st=document.createElement("style");st.textContent=' + json.dumps(estilo) + ';document.head.appendChild(st);\n'
      + 'var host=document.getElementById("n11-host")||(function(){var d=document.createElement("div");(document.currentScript&&document.currentScript.parentNode||document.body).insertBefore(d,document.currentScript||null);return d;})();\n'
      + 'host.innerHTML=' + json.dumps(cuerpo) + ';\n'
      + logica.strip() + '\n})();\n')
(base.parent.parent / 'embeds' / 'nuria-11-pasos.js').write_text(js)
print('ok', len(js))

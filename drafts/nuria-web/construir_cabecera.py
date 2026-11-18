# Cabecera y pie únicos para TODO nuriaroure.com (Elementor › Creador de temas › Cabecera / Pie de página),
# con el diseño de la portada nueva. CSS aislado bajo #nrq para no romper las páginas antiguas.
# Genera: cabecera.html, pie.html y el menú común (MENU) que también usan portada, Sobre mí y Meditación.
import re, os
D = os.path.dirname(os.path.abspath(__file__))
w = open(os.path.join(D, 'home-widget-original.html'), encoding='utf-8').read()
css = w[w.find('<style>') + 7:w.find('</style>')]

MENU = [
    ('Test de sueño', 'https://nr.nuriaroure.com/test-patrones?utm_source=web&utm_medium=nav&utm_campaign=test', True),
    ('El programa', 'https://nr.nuriaroure.com/3-claves-para-dormir-mejor-a?utm_source=web&utm_medium=nav&utm_campaign=programa', True),
    ('Meditación', 'https://nuriaroure.com/meditacion-gratuita/', False),
    ('Sobre mí', 'https://nuriaroure.com/sobre-mi/', False),
    ('Prensa', 'https://nuriaroure.com/sala-de-prensa/', False),
    ('Blog', 'https://nuriaroure.com/blog/', False),
    ('Contacto', 'https://nuriaroure.com/contacto/', False),
]
def menu_html():
    li = []
    for i, (t, u, fuera) in enumerate(MENU):
        cls = ' class="is-cta"' if i == 0 else ''
        tgt = ' target="_blank" rel="noopener"' if fuera else ''
        li.append('        <li><a href="%s"%s%s>%s</a></li>' % (u, tgt, cls, t))
    return '<ul class="nav-links" id="nrMenu">\n' + '\n'.join(li) + '\n      </ul>'

def bloques(b):
    out = []; i = 0
    while i < len(b):
        j = b.find('{', i)
        if j < 0: break
        sel = re.sub(r'/\*.*?\*/', '', b[i:j], flags=re.S).strip()
        if sel.startswith('@media'):
            d = 1; k = j + 1
            while d:
                d += {'{': 1, '}': -1}.get(b[k], 0); k += 1
            out.append(('m', sel, b[j + 1:k - 1])); i = k
        else:
            k = b.find('}', j); out.append(('r', sel, b[j + 1:k])); i = k + 1
    return out
CLAVES = ('nr-bar', '.nav', 'sticky', '.foot')
def pref(sel): return ','.join('#nrq ' + s.strip() for s in sel.split(','))
def filtra(b):
    o = []
    for t, s, c in bloques(b):
        if t == 'r' and any(k in s for k in CLAVES): o.append(pref(s) + '{' + c.strip() + '}')
        elif t == 'm':
            sub = filtra(c)
            if sub: o.append(s + '{' + ''.join(sub) + '}')
    return o
raiz = re.search(r':root\{(.*?)\}', css, re.S).group(1)
CSS = ('<link href="https://nuriaroure.com/wp-content/cache/perfmatters/nuriaroure.com/fonts/81f329322587.google-fonts.min.css" rel="stylesheet">\n<style>\n'
       '#nrq{' + raiz.strip() + ';font-family:"Montserrat",system-ui,sans-serif;color:var(--navy);-webkit-font-smoothing:antialiased;line-height:1.55}\n'
       '#nrq *,#nrq *::before,#nrq *::after{box-sizing:border-box}#nrq a{color:inherit}#nrq svg{display:inline-block}#nrq p{margin:0}\n'
       '#nrq .wrap{max-width:1240px;margin:0 auto;padding:0 32px}@media (max-width:560px){#nrq .wrap{padding:0 20px}}\n'
       '#nrq ul{margin:0}\n' + '\n'.join(filtra(css)) +
       '\n#nrq .nav-links a.is-here{color:var(--coral-dark)}\n</style>\n')

cuerpo = w[w.find('</style>') + 8:]
arriba = cuerpo[cuerpo.find('<div class="sticky-top">'):cuerpo.find('<section class="hero">')]
arriba = re.sub(r'<ul class="nav-links" id="nrMenu">.*?</ul>', menu_html(), arriba, flags=re.S)
arriba = arriba.replace('utm_source=home&utm_medium=organic', 'utm_source=web&utm_medium=bar')
pie = cuerpo[cuerpo.find('<footer class="foot">'):cuerpo.find('</footer>') + 9]
s1 = cuerpo.find('<script>\n  // Menú en móvil')
js = cuerpo[s1:cuerpo.find('</script>', s1) + 9].replace("document.querySelector('.nr .nav')", "document.querySelector('#nrq .nav')").replace("document.querySelector('.sticky-top')", "document.querySelector('#nrq .sticky-top')")
# marca la página actual en el menú
js_aqui = "<script>(function(){var p=location.pathname.replace(/\\/$/,'');document.querySelectorAll('#nrq .nav-links a').forEach(function(a){try{var q=new URL(a.href).pathname.replace(/\\/$/,'');if(q&&q===p&&a.host===location.host)a.classList.add('is-here')}catch(e){}})})();</script>\n"

cab = '<!-- Qualivo · cabecera única de nuriaroure.com (pegar en un widget HTML de la plantilla Cabecera) -->\n' + CSS + '<div id="nrq">\n' + arriba.rstrip() + '\n</div>\n' + js + '\n' + js_aqui
open(os.path.join(D, 'cabecera.html'), 'w', encoding='utf-8').write(cab)
pie_html = '<!-- Qualivo · pie único de nuriaroure.com (pegar en un widget HTML de la plantilla Pie de página) -->\n' + CSS + '<div id="nrq">\n' + pie + '\n</div>\n'
open(os.path.join(D, 'pie.html'), 'w', encoding='utf-8').write(pie_html)
open(os.path.join(D, 'menu-comun.html'), 'w', encoding='utf-8').write(menu_html() + '\n')
print('ok', len(cab), len(pie_html))

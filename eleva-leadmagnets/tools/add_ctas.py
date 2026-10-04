#!/usr/bin/env python3
"""Añade CTAs medibles a todos los artículos del blog (acción 8 del plan):
 - CTA intermedio tras el 2.º <h2>: calculadora de ingresos con utm_source=blog&utm_campaign=<slug>.
 - Sustituye el bloque .coursecard final por un CTA doble (calculadora + WhatsApp) con la misma UTM.
Idempotente: si el artículo ya tiene .blogcta no lo toca. Se salta index/blog/calculadora."""
import os, re, glob
PUB = os.path.join(os.path.dirname(__file__), '..', 'public')
WA = "https://wa.me/34722792501?text=Hola!%20Quiero%20info%20sobre%20la%20formaci%C3%B3n%20de%20u%C3%B1as%20%F0%9F%92%85"
SKIP = {'index.html', 'blog.html', 'calculadora.html'}
def mid(slug):
    return (f'\n  <aside class="blogcta mid"><div class="t">💅 ¿Cuánto podrías ganar haciendo uñas?</div>'
            f'<p>Calcúlalo en 30 segundos según tus clientas y precios. Gratis y sin registro previo.</p>'
            f'<a class="ctabtn" href="/calculadora?utm_source=blog&utm_medium=cta-mid&utm_campaign={slug}">Calcular mis ingresos →</a></aside>\n')
def end(slug):
    return (f'<aside class="blogcta end"><div class="t">¿Te ves dedicándote a esto?</div>'
            f'<p>En Nail Boss Academy (Eleva Nails) aprendes técnica profesional y negocio: precios, captación y cómo abrir tu propio centro. Kit incluido, titulación adaptada al Certificado de Profesionalidad y bolsa de trabajo.</p>'
            f'<div class="row"><a class="ctabtn" href="/calculadora?utm_source=blog&utm_medium=cta-end&utm_campaign={slug}">Ver cuánto puedo ganar →</a>'
            f'<a class="ctawa" href="{WA}&utm_source=blog&utm_campaign={slug}" rel="nofollow">Hablar por WhatsApp</a></div></aside>')
done = 0
for path in sorted(glob.glob(os.path.join(PUB, '*.html'))):
    name = os.path.basename(path)
    if name in SKIP: continue
    html = open(path, encoding='utf-8').read()
    if 'class="blogcta' in html: continue
    slug = name[:-5]
    # 1) CTA final: sustituye el coursecard
    new = re.sub(r'<div class="coursecard">.*?</div>', end(slug), html, count=1, flags=re.S)
    # 2) CTA intermedio tras el 2.º <h2> (al final de su bloque = justo antes del 3.º <h2>, si existe; si no, no se añade)
    h2 = [m.start() for m in re.finditer(r'<h2[ >]', new)]
    if len(h2) >= 3:
        new = new[:h2[2]] + mid(slug) + new[h2[2]:]
    if new != html:
        open(path, 'w', encoding='utf-8').write(new); done += 1
print('artículos actualizados:', done)

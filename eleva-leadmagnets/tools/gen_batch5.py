#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tanda 5: más DISEÑOS/GEL — keywords de alto volumen aún sin cubrir (1k-6k)."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import gen_articles as g
OUT = os.path.join(os.path.dirname(__file__), '..', 'public')
GEN = g.CTA_GEN
def S(h, b): return (h, b)
def ideas(title, items):
    return S(title, "<ul>" + "".join("<li>%s</li>" % x for x in items) + "</ul>")

B5 = [
 {"grp":"Diseños (galería)","slug":"unas-francesas-modernas","eyebrow":"Diseños","vol":6600,
  "title":"Uñas francesas modernas: 15 diseños originales 2026 | Eleva Nails",
  "desc":"Uñas francesas modernas y originales: reinventa la francesa clásica con color, líneas y efectos. Galería de ideas y trucos de Eleva Nails.",
  "h1":"Uñas francesas modernas","lead":"La francesa ya no es solo la punta blanca: color, líneas finas y efectos la han convertido en el diseño más versátil y pedido.",
  "callout":"<b>Tip:</b> el secreto de una francesa perfecta es una línea limpia y fina. Con pincel de línea y una buena base sale a la primera.",
  "sections":[
    ideas("Francesas de color",["Punta de color (rojo, negro, pastel)","Doble línea (micro-french)","Francesa difuminada (aura)","Puntas metálicas o cromadas"]),
    ideas("Francesas con giro moderno",["Francesa invertida (en la lúnula)","Líneas diagonales o en pico","Francesa con detalle mínimo","Punta glitter o glass"]),
    S("Cómo bordarlas","<p>Requiere pulso y una buena base. Domínalas con formación: mira <a href='/unas-francesa-paso-a-paso'>la francesa paso a paso</a> y <a href='/unas-francesas-elegantes'>francesas elegantes</a>.</p>")],
  "related":[("/unas-francesas-elegantes","francesas elegantes"),("/unas-francesa-paso-a-paso","paso a paso"),("/disenos-unas-gel","diseños en gel")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-francesas-cortas","eyebrow":"Diseños","vol":2900,
  "title":"Uñas francesas cortas: diseños elegantes y prácticos | Eleva Nails",
  "desc":"Uñas francesas en uñas cortas: elegantes, discretas y perfectas para el día a día. Ideas y trucos para que luzcan en poco largo. Eleva Nails.",
  "h1":"Uñas francesas cortas","lead":"La francesa en corto es el look más pedido para quien quiere elegancia sin uñas largas: discreta, limpia y va con todo.",
  "callout":"<b>Tip:</b> en uña corta, una punta fina estiliza; una gruesa acorta visualmente. Menos es más.",
  "sections":[
    ideas("Ideas en corto",["Baby french (punta finísima)","Francesa nude sobre natural","Punta de color suave","Micro-detalle dorado en la base"]),
    ideas("Por qué funciona tan bien",["Aguanta el día a día sin engancharse","Favorece cualquier dedo","Rápida de mantener","Elegante en el trabajo"]),
    S("Consíguela","<p>La clave es la simetría de la línea. <a href='/unas-cortas-bonitas'>Más ideas en corto</a> y <a href='/unas-francesa-paso-a-paso'>cómo hacer la francesa</a>.</p>")],
  "related":[("/unas-cortas-bonitas","uñas cortas"),("/unas-francesas-elegantes","francesas elegantes"),("/unas-francesa-paso-a-paso","paso a paso")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-rojas-decoradas","eyebrow":"Diseños","vol":2900,
  "title":"Uñas rojas decoradas: 15 diseños que enamoran | Eleva Nails",
  "desc":"Uñas rojas decoradas: del rojo clásico a diseños con dorado, pedrería y francesa roja. Ideas elegantes y llamativas. Galería de Eleva Nails.",
  "h1":"Uñas rojas decoradas","lead":"El rojo es atemporal y favorece a todas. Decorado con el detalle justo, pasa de clásico a espectacular.",
  "callout":"<b>Tip:</b> el rojo canta si el borde queda perfecto. Sella bien para que no se despinte en los laterales.",
  "sections":[
    ideas("Rojos elegantes",["Rojo cereza liso y brillante","Rojo con francesa invertida","Rojo con detalle dorado","Rojo vino (otoño)"]),
    ideas("Rojos llamativos",["Rojo con pedrería","Corazones (San Valentín)","Rojo + negro (contraste)","Rojo cromado"]),
    S("Cómo lograrlo","<p>Un buen rojo necesita 2 capas y sellado impecable. <a href='/unas-rojas-elegantes'>Más rojos elegantes</a> e ideas de <a href='/disenos-unas-gel'>diseños en gel</a>.</p>")],
  "related":[("/unas-rojas-elegantes","rojas elegantes"),("/disenos-unas-gel","diseños en gel"),("/unas-navidad","uñas de Navidad")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"decoracion-unas-gel","eyebrow":"Diseños","vol":1600,
  "title":"Decoración de uñas de gel: ideas y técnicas fáciles | Eleva Nails",
  "desc":"Decoración de uñas de gel: técnicas y adornos para decorar (líneas, foil, pedrería, efectos) con acabado profesional. Guía de Eleva Nails.",
  "h1":"Decoración de uñas de gel","lead":"El gel es el mejor lienzo para decorar: aguanta, brilla y admite de todo. Estas son las técnicas de decoración que más se piden.",
  "callout":"<b>Tip:</b> decora siempre sobre gel sin sellar o con la capa pegajosa según la técnica; luego sella todo junto.",
  "sections":[
    ideas("Técnicas fáciles y resultonas",["Líneas finas con pincel","Foil (efecto metalizado)","Piedras y perlas","Stickers y stamping"]),
    ideas("Efectos que enamoran",["Cromado / espejo","Ojo de gato (imán)","Encapsulado (flores, glitter)","Aura / degradado"]),
    S("Aprende a decorar","<p>Con base sólida y técnica dominas cualquier decoración. Empieza por <a href='/nail-art-principiantes'>nail art para principiantes</a> y <a href='/unas-efecto-espejo'>el efecto espejo</a>.</p>")],
  "related":[("/nail-art-principiantes","nail art"),("/unas-ojo-de-gato","ojo de gato"),("/disenos-unas-gel","diseños en gel")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-gel-cortas","eyebrow":"Diseños","vol":1600,
  "title":"Uñas de gel cortas: diseños bonitos y cómodos | Eleva Nails",
  "desc":"Uñas de gel cortas: diseños elegantes y prácticos para uñas cortas, con color, francesa y detalles. Ideas y trucos de Eleva Nails.",
  "h1":"Uñas de gel cortas","lead":"El gel en corto es comodísimo y elegante: resistente, natural y perfecto para el día a día. Estas ideas lucen sin necesidad de largo.",
  "callout":"<b>Tip:</b> en corto, tonos nude y líneas finas estilizan; los diseños recargados quitan protagonismo a la mano.",
  "sections":[
    ideas("Ideas en gel corto",["Nude lechoso","Baby french","Un color liso vibrante","Micro-detalle (punto, línea)"]),
    ideas("Por qué elegir gel corto",["No se engancha","Aspecto natural","Fácil de mantener","Va con todo"]),
    S("Consíguelas","<p>Base bien nivelada y color parejo. Mira <a href='/como-hacer-unas-de-gel'>cómo hacer uñas de gel</a> y más <a href='/disenos-unas-cortas'>diseños cortos</a>.</p>")],
  "related":[("/disenos-unas-cortas","diseños cortos"),("/como-hacer-unas-de-gel","hacer gel"),("/unas-cortas-bonitas","uñas cortas")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-gel-verano","eyebrow":"Temporada","vol":1300,
  "title":"Uñas de gel de verano: colores y diseños 2026 | Eleva Nails",
  "desc":"Uñas de gel de verano: neones, pasteles, frutas y diseños frescos que arrasan en la temporada. Galería e ideas de Eleva Nails.",
  "h1":"Uñas de gel de verano","lead":"Llega el calor y con él los colores vivos. El verano dispara las reservas: ten lista una carta de diseños frescos.",
  "callout":"<b>Temporada:</b> neón, pastel, blanco roto y detalles marinos mandan en verano.",
  "sections":[
    ideas("Colores del verano",["Neón (coral, verde lima)","Pasteles (lavanda, menta)","Blanco roto","Turquesa / azul mar"]),
    ideas("Diseños frescos",["Frutas y flores","Aura veraniega","Cromado suave","Detalles marinos"]),
    S("Aprovecha el pico","<p>Publica ideas antes de que empiece la temporada. <a href='/unas-verano'>Más uñas de verano</a> y <a href='/instagram-para-manicuristas'>cómo captar por Instagram</a>.</p>")],
  "related":[("/unas-verano","uñas de verano"),("/disenos-unas-gel","diseños en gel"),("/unas-otono-invierno","otoño-invierno")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-gel-elegantes","eyebrow":"Diseños","vol":1300,
  "title":"Uñas de gel elegantes: 15 diseños sofisticados | Eleva Nails",
  "desc":"Uñas de gel elegantes: nude, francesa fina, tonos neutros y detalles sutiles para un look sofisticado. Galería de Eleva Nails.",
  "h1":"Uñas de gel elegantes","lead":"La elegancia está en el detalle justo: tonos neutros, líneas limpias y acabados impecables. Estos diseños de gel nunca fallan.",
  "callout":"<b>Tip:</b> lo elegante exige limpieza total: cutícula perfecta y borde sellado marcan la diferencia.",
  "sections":[
    ideas("Diseños elegantes",["Nude lechoso","Francesa fina","Efecto glass","Tono topo / greige","Detalle dorado mínimo"]),
    ideas("Para ocasiones especiales",["Boda: baby boomer","Trabajo: nude corto","Noche: cromado sutil"]),
    S("El acabado profesional","<p>La clave es la preparación y el sellado. <a href='/unas-nude-elegantes'>Más nude elegantes</a> y <a href='/cuidado-unas-sanas'>uñas sanas</a>.</p>")],
  "related":[("/unas-nude-elegantes","nude elegantes"),("/unas-francesas-elegantes","francesas"),("/disenos-unas-gel","diseños gel")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-gel-bonitas-sencillas","eyebrow":"Diseños","vol":1900,
  "title":"Uñas de gel bonitas y sencillas: ideas fáciles | Eleva Nails",
  "desc":"Uñas de gel bonitas y sencillas: diseños fáciles y elegantes que lucen sin complicarte. Ideas rápidas y trucos de Eleva Nails.",
  "h1":"Uñas de gel bonitas y sencillas","lead":"No hace falta un diseño recargado para lucir uñas preciosas. Lo sencillo, bien hecho, es lo que más se repite.",
  "callout":"<b>Tip:</b> un color liso perfecto impacta más que un diseño complicado mal ejecutado. La limpieza manda.",
  "sections":[
    ideas("Sencillas y bonitas",["Un color liso bien puesto","Nude con punto dorado","Micro-french","Línea fina de color","Aura de un solo tono"]),
    ideas("Trucos para que luzcan",["Cutícula limpia","Capa fina y pareja","Borde bien sellado","Brillo top de calidad"]),
    S("Empieza por lo simple","<p>Lo básico bien hecho es la mejor carta de presentación. <a href='/disenos-unas-sencillos'>Más diseños sencillos</a> y <a href='/como-hacer-unas-de-gel'>cómo hacer gel</a>.</p>")],
  "related":[("/disenos-unas-sencillos","diseños sencillos"),("/unas-minimalistas","minimalistas"),("/como-hacer-unas-de-gel","hacer gel")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-acrilicas-cortas","eyebrow":"Diseños","vol":1900,
  "title":"Uñas acrílicas cortas: diseños resistentes y bonitos | Eleva Nails",
  "desc":"Uñas acrílicas cortas: la resistencia del acrílico en un largo cómodo, con diseños elegantes y prácticos. Ideas y trucos de Eleva Nails.",
  "h1":"Uñas acrílicas cortas","lead":"El acrílico no es solo para largos imposibles: en corto da una resistencia enorme con aspecto natural. Ideal para quien trabaja con las manos.",
  "callout":"<b>Tip:</b> en acrílico corto, un apex bien colocado evita roturas aunque el largo sea mínimo.",
  "sections":[
    ideas("Diseños en corto",["Nude natural","Francesa clásica","Un color liso","Detalle mínimo dorado"]),
    ideas("Ventajas del acrílico corto",["Muy resistente","Aspecto natural","Cómodo para trabajar","Base perfecta para color"]),
    S("Cómo se hacen","<p>La técnica de esculpido es la misma, con menos largo. <a href='/curso-unas-acrilicas'>El curso de acrílico</a> y <a href='/unas-acrilicas-paso-a-paso'>el paso a paso</a>.</p>")],
  "related":[("/curso-unas-acrilicas","curso acrílico"),("/unas-acrilicas-paso-a-paso","paso a paso"),("/disenos-unas-acrilicas","diseños acrílico")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"modelos-unas-gel","eyebrow":"Diseños","vol":2266,
  "title":"Modelos de uñas de gel: 20 ideas para inspirarte | Eleva Nails",
  "desc":"Modelos de uñas de gel para todos los gustos: elegantes, coloridos, de temporada y por ocasión. Galería completa de Eleva Nails.",
  "h1":"Modelos de uñas de gel","lead":"¿Buscas inspiración? Aquí tienes una carta amplia de modelos de uñas de gel organizados por estilo para que encuentres el tuyo.",
  "callout":"<b>Tip:</b> guarda 3-4 modelos que encajen con tu estilo de vida; es más útil que mil ideas que no vas a llevar.",
  "sections":[
    ideas("Modelos elegantes",["Nude, francesa fina, glass, greige"]),
    ideas("Modelos con color",["Rojo, cromado, ojo de gato, degradado"]),
    ideas("Modelos por temporada",["Verano fresco, otoño tierra, Navidad, boda"]),
    S("De la idea a la uña","<p>Cualquier modelo se logra con base sólida y técnica. Empieza por <a href='/disenos-unas-gel'>los diseños de gel</a> o aprende <a href='/como-hacer-unas-de-gel'>a hacerlas</a>.</p>")],
  "related":[("/disenos-unas-gel","diseños gel"),("/unas-gel-elegantes","gel elegantes"),("/como-hacer-unas-de-gel","hacer gel")],"course":GEN},
]

for a in B5:
    a.setdefault('recap', None)
    open(os.path.join(OUT, a['slug']+'.html'), 'w', encoding='utf-8').write(g.build(a))
print("Tanda 5:", len(B5), "artículos")

# portada
cards = ""
for a in B5:
    kicker=a['eyebrow'].split('·')[0].strip()
    desc=a['lead'][:88].rsplit(' ',1)[0]+"…"
    cards += '    <a class="bcard" href="/%s"><span class="bk">%s</span><h3>%s</h3><p>%s</p></a>\n' % (a['slug'],kicker,a['h1'],desc)
block = "  <h2>Más diseños e inspiración</h2>\n  <div class=\"bloglist\">\n"+cards+"  </div>\n"
bp=os.path.join(OUT,'blog.html'); html=open(bp,encoding='utf-8').read()
if 'Más diseños e inspiración' not in html:
    html=html.replace('  <p class="foot">', block+'  <p class="foot">',1)
    open(bp,'w',encoding='utf-8').write(html); print("Portada actualizada")

# sitemap: añadir las nuevas URLs
sp=os.path.join(OUT,'sitemap.xml'); sm=open(sp,encoding='utf-8').read()
import datetime
today=datetime.date.today().isoformat()
add=""
for a in B5:
    loc="https://blog.elevanails.es/"+a['slug']
    if loc not in sm:
        add+="  <url><loc>%s</loc><lastmod>%s</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n"%(loc,today)
if add:
    sm=sm.replace("</urlset>", add+"</urlset>")
    open(sp,'w',encoding='utf-8').write(sm); print("Sitemap: +", add.count("<url>"), "URLs")

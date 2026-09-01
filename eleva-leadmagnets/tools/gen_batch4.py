#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tanda 4: ola de DISEÑOS (galerías) — las keywords de mayor volumen (5k-18k)."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import gen_articles as g
OUT = os.path.join(os.path.dirname(__file__), '..', 'public')
GEN = g.CTA_GEN
def S(h, b): return (h, b)
def ideas(title, items):
    return S(title, "<ul>" + "".join("<li>%s</li>" % x for x in items) + "</ul>")

B4 = [
 {"grp":"Diseños (galería)","slug":"disenos-unas-gel","eyebrow":"Diseños","vol":18100,
  "title":"Diseños de uñas de gel: 18 ideas que arrasan en 2026 | Eleva Nails",
  "desc":"Los mejores diseños de uñas de gel: ideas elegantes, sencillas y de tendencia para inspirarte, con trucos para conseguirlas. Galería de Eleva Nails.",
  "h1":"Diseños de uñas de gel que arrasan","lead":"El gel es el lienzo perfecto: aguanta, brilla y admite cualquier diseño. Aquí tienes las ideas de uñas de gel que más se piden, de lo minimalista a lo espectacular.",
  "callout":"<b>Tip:</b> los diseños de gel duran más si nivelas bien la base y sellas el borde. Elige 2-3 que encajen con tu estilo.",
  "sections":[
    ideas("Diseños elegantes y minimalistas",["Nude lechoso con detalle dorado","Francesa fina (baby french)","Efecto glass o cristal","Líneas finas negras sobre nude","Aura nails (degradado suave)"]),
    ideas("Diseños con color y tendencia",["Cromado / efecto espejo","Ojo de gato (cat eye)","Rojo cereza brillante","Degradado ombré","Detalles 3D y pedrería"]),
    ideas("Diseños según la ocasión",["Boda: baby boomer y nude","Verano: neón y frutas","Navidad: rojo y dorado","Trabajo: cortas y sobrias"]),
    S("Cómo conseguirlos","<p>La clave es una buena base, capas finas y sellado. Con formación dominas todos estos diseños. <a href='/nail-art-principiantes'>Empieza por el nail art</a> o mira <a href='/como-hacer-unas-de-gel'>cómo hacer uñas de gel</a>.</p>")],
  "related":[("/disenos-unas-acrilicas","diseños en acrílico"),("/unas-francesas-elegantes","francesas elegantes"),("/como-hacer-unas-de-gel","hacer uñas de gel")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"disenos-unas-acrilicas","eyebrow":"Diseños","vol":8100,
  "title":"Diseños de uñas acrílicas: 18 ideas de tendencia | Eleva Nails",
  "desc":"Diseños de uñas acrílicas para inspirarte: largas, cortas, elegantes y llamativas, con ideas de nail art y tendencias 2026. Galería de Eleva Nails.",
  "h1":"Diseños de uñas acrílicas","lead":"El acrílico permite largos y formas imposibles: es el favorito para diseños que llaman la atención. Estas son las ideas de uñas acrílicas más pedidas.",
  "callout":"<b>Tip:</b> en acrílico la estructura manda. Un buen apex hace que el diseño luzca y dure sin romperse.",
  "sections":[
    ideas("Formas y largos que triunfan",["Coffin (bailarina) largas","Almendra elegante","Stiletto atrevidas","Cuadradas medianas"]),
    ideas("Diseños elegantes",["Nude con francesa invertida","Efecto mármol","Cromado suave","Encapsulado de flores"]),
    ideas("Diseños llamativos",["Nail art colorido","Pedrería y 3D","Animal print","Degradados vivos"]),
    S("Cómo lograrlos","<p>Requieren técnica de esculpido y limado. <a href='/curso-unas-acrilicas'>El curso de acrílico</a> te lleva de cero a estos diseños; repasa también <a href='/unas-acrilicas-paso-a-paso'>el paso a paso</a>.</p>")],
  "related":[("/disenos-unas-gel","diseños en gel"),("/unas-coffin-bailarina","forma coffin"),("/curso-unas-acrilicas","curso de acrílico")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-francesas-elegantes","eyebrow":"Diseños","vol":9900,
  "title":"Uñas francesas elegantes: 15 diseños modernos | Eleva Nails",
  "desc":"Uñas francesas elegantes y modernas: variantes de la francesa clásica (color, baby french, invertida) para un look sofisticado. Galería de Eleva Nails.",
  "h1":"Uñas francesas elegantes","lead":"La francesa es sinónimo de elegancia y nunca pasa de moda. Estas variantes modernas la llevan a otro nivel manteniendo la sofisticación.",
  "callout":"<b>Tip:</b> la elegancia está en la línea. Cuanto más fina y limpia, más sofisticado el resultado.",
  "sections":[
    ideas("Francesas modernas",["Baby french (línea finísima)","French de color (pastel o rojo)","French invertida (en la base)","Doble french","French con línea metálica"]),
    ideas("Elegantes para eventos",["French nude con brillo","Micro-francesa minimalista","French con detalle dorado","Baby boomer (degradado)"]),
    S("Cómo hacer la línea perfecta","<p>Con pincel fino o tips de guía y práctica. <a href='/unas-francesa-paso-a-paso'>La francesa paso a paso</a> te lo explica.</p>")],
  "related":[("/unas-francesa-paso-a-paso","francesa paso a paso"),("/baby-boomer-unas","baby boomer"),("/disenos-unas-gel","diseños en gel")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-rojas-elegantes","eyebrow":"Diseños","vol":5400,
  "title":"Uñas rojas elegantes y decoradas: 15 ideas | Eleva Nails",
  "desc":"Uñas rojas elegantes y decoradas: el color que nunca falla, en diseños sofisticados, mate, con brillo o detalles. Inspiración de Eleva Nails.",
  "h1":"Uñas rojas elegantes","lead":"El rojo es puro poder y elegancia. Estas ideas de uñas rojas van del clásico atemporal al diseño decorado más actual.",
  "callout":"<b>Tip:</b> un rojo bien pigmentado en 2 capas finas queda más limpio y elegante que una capa gruesa.",
  "sections":[
    ideas("Rojos elegantes",["Rojo clásico brillante","Rojo mate","French roja","Rojo con línea dorada"]),
    ideas("Rojos decorados",["Rojo con pedrería","Rojo y negro","Corazones (San Valentín)","Rojo con cromado"]),
    S("El acabado importa","<p>Un buen sellado hace que el rojo dure sin astillarse. <a href='/semipermanente-que-dure'>Trucos para que dure</a>.</p>")],
  "related":[("/disenos-unas-gel","diseños en gel"),("/unas-francesas-elegantes","francesas elegantes"),("/disenos-unas-2026","tendencias 2026")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-nude-elegantes","eyebrow":"Diseños","vol":2900,
  "title":"Uñas nude elegantes: 15 diseños sofisticados | Eleva Nails",
  "desc":"Uñas nude elegantes: el tono que favorece a todas, en diseños minimalistas y sofisticados. Ideas y trucos de Eleva Nails.",
  "h1":"Uñas nude elegantes","lead":"El nude es el rey de la elegancia discreta: alarga los dedos y combina con todo. Estas ideas lo llevan de básico a sofisticado.",
  "callout":"<b>Tip:</b> elige el nude según tu tono de piel para un efecto 'segunda piel' favorecedor.",
  "sections":[
    ideas("Nude minimalista",["Nude lechoso liso","Micro-french nude","Nude con línea fina","Efecto glass nude"]),
    ideas("Nude con detalle",["Nude + dorado","Nude + pedrería discreta","Aura nude","Nude mate"]),
    S("Consejo pro","<p>El nude marca cualquier imperfección: preparación y nivelado impecables. <a href='/rubber-base-que-es'>Nivela con rubber base</a>.</p>")],
  "related":[("/unas-francesas-elegantes","francesas elegantes"),("/disenos-unas-gel","diseños en gel"),("/unas-cortas-bonitas","uñas cortas")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"disenos-unas-sencillos","eyebrow":"Diseños","vol":2400,
  "title":"Diseños de uñas sencillos y bonitos (fáciles) | Eleva Nails",
  "desc":"Diseños de uñas sencillos y bonitos, fáciles de hacer en casa o en cabina: minimalistas, rápidos y siempre favorecedores. Galería de Eleva Nails.",
  "h1":"Diseños de uñas sencillos y bonitos","lead":"No hace falta un diseño recargado para lucir uñas preciosas. Estas ideas sencillas son rápidas, elegantes y quedan bien siempre.",
  "callout":"<b>Tip:</b> menos es más. Un detalle bien hecho sobre una base limpia supera a un diseño sobrecargado.",
  "sections":[
    ideas("Ideas fáciles",["Un solo dedo decorado","Punto dorado en la base","Línea fina diagonal","Media luna","Puntas de color"]),
    ideas("Minimalistas de tendencia",["Nude + línea negra","Micro-french","Corazón mini","Efecto lechoso"]),
    S("Perfectos para empezar","<p>Ideales para practicar nail art. <a href='/nail-art-principiantes'>Nail art para principiantes</a>.</p>")],
  "related":[("/nail-art-principiantes","nail art"),("/unas-cortas-bonitas","uñas cortas"),("/unas-nude-elegantes","nude elegantes")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-negras-elegantes","eyebrow":"Diseños","vol":1600,
  "title":"Uñas negras elegantes: 12 diseños con estilo | Eleva Nails",
  "desc":"Uñas negras elegantes: el negro más sofisticado en diseños mate, con brillo, cromado o detalles. Inspiración de Eleva Nails.",
  "h1":"Uñas negras elegantes","lead":"El negro es atrevido y elegantísimo si se hace bien. Estas ideas demuestran que el negro puede ser de lo más sofisticado.",
  "callout":"<b>Tip:</b> el negro exige un esmaltado impecable; cualquier fallo se nota. Capas finas y buen sellado.",
  "sections":[
    ideas("Negros elegantes",["Negro mate","Negro brillante clásico","French negra","Negro + cromado"]),
    ideas("Con detalle",["Negro y dorado","Negro con líneas nude","Negro con pedrería","Efecto galaxia"]),
    S("Acabado perfecto","<p>Sella bien para que no se astille. <a href='/errores-comunes-manicura'>Evita los errores típicos</a>.</p>")],
  "related":[("/unas-rojas-elegantes","uñas rojas"),("/disenos-unas-gel","diseños en gel"),("/disenos-unas-2026","tendencias")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"disenos-unas-cortas","eyebrow":"Diseños","vol":1900,
  "title":"Diseños de uñas cortas: 15 ideas favorecedoras | Eleva Nails",
  "desc":"Diseños de uñas cortas bonitos y elegantes: minimalistas, con color o nail art, perfectos para el día a día. Galería de Eleva Nails.",
  "h1":"Diseños de uñas cortas","lead":"Las uñas cortas están más de moda que nunca. Estos diseños demuestran que en corto también se puede lucir muchísimo.",
  "callout":"<b>Tip:</b> en uñas cortas, los diseños pequeños y las líneas verticales estilizan.",
  "sections":[
    ideas("Cortas elegantes",["Nude lechoso","Micro-french","Rojo clásico","Efecto glass"]),
    ideas("Cortas con arte",["Mini nail art","Un dedo decorado","Puntos y líneas","Color block"]),
    S("Por qué elegir corto","<p>Cómodas y resistentes. <a href='/unas-cortas-bonitas'>Más sobre uñas cortas bonitas</a>.</p>")],
  "related":[("/unas-cortas-bonitas","uñas cortas"),("/disenos-unas-sencillos","diseños sencillos"),("/formas-de-unas","formas de uñas")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-otono-invierno","eyebrow":"Temporada","vol":1300,
  "title":"Uñas de otoño e invierno: colores y diseños 2026 | Eleva Nails",
  "desc":"Diseños de uñas de otoño e invierno: tonos tierra, vinos, chocolates y efectos acogedores que más se piden en la temporada fría. Eleva Nails.",
  "h1":"Uñas de otoño e invierno","lead":"Con el frío llegan los tonos cálidos y profundos. Prepara una carta de diseños de temporada y aprovecha el pico de reservas.",
  "callout":"<b>Temporada:</b> tierra, vino, chocolate y verdes oscuros mandan en otoño-invierno.",
  "sections":[
    ideas("Colores de temporada",["Marrón chocolate","Vino / burdeos","Verde oscuro","Mostaza"]),
    ideas("Diseños acogedores",["Efecto suéter (knit)","Cromado cálido","French en tonos tierra","Detalles dorados"]),
    S("Aprovecha la temporada","<p>Sube ideas en redes antes de la temporada. <a href='/instagram-para-manicuristas'>Instagram para captar</a>.</p>")],
  "related":[("/unas-navidad","uñas de Navidad"),("/unas-verano","uñas de verano"),("/disenos-unas-2026","tendencias")],"course":GEN},

 {"grp":"Diseños (galería)","slug":"unas-minimalistas","eyebrow":"Diseños","vol":1000,
  "title":"Uñas minimalistas: diseños limpios y elegantes | Eleva Nails",
  "desc":"Uñas minimalistas: la elegancia de lo simple en diseños limpios, líneas finas y nude. Ideas y trucos de Eleva Nails.",
  "h1":"Uñas minimalistas","lead":"El minimalismo es tendencia y atemporal: líneas finas, nude y detalles diminutos que dicen mucho con poco.",
  "callout":"<b>Tip:</b> el minimalismo no perdona errores; la limpieza del trabajo lo es todo.",
  "sections":[
    ideas("Ideas minimalistas",["Línea fina negra","Punto único","Micro-french","Negativo (negative space)","Nude con detalle metálico"]),
    S("La base perfecta","<p>Preparación y nivelado impecables. <a href='/rubber-base-que-es'>Rubber base</a> para una superficie lisa.</p>")],
  "related":[("/unas-nude-elegantes","nude elegantes"),("/disenos-unas-sencillos","diseños sencillos"),("/nail-art-principiantes","nail art")],"course":GEN},
]

for a in B4:
    a.setdefault('recap', None)
    open(os.path.join(OUT, a['slug']+'.html'), 'w', encoding='utf-8').write(g.build(a))
print("Tanda 4 (diseños):", len(B4), "artículos")

# añadir a la portada
cards = ""
for a in B4:
    href="/"+a['slug']; kicker=a['eyebrow'].split('·')[0].strip()
    desc=a['lead'][:88].rsplit(' ',1)[0]+"…"
    cards += '    <a class="bcard" href="%s"><span class="bk">%s</span><h3>%s</h3><p>%s</p></a>\n' % (href,kicker,a['h1'],desc)
block = "  <h2>Diseños e inspiración</h2>\n  <div class=\"bloglist\">\n"+cards+"  </div>\n"
bp=os.path.join(OUT,'blog.html'); html=open(bp,encoding='utf-8').read()
if 'Diseños e inspiración' not in html:
    html=html.replace('  <p class="foot">', block+'  <p class="foot">',1)
    open(bp,'w',encoding='utf-8').write(html); print("Portada actualizada")

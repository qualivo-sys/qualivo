#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera artículos SEO de Eleva Nails (marca Nail Boss) desde una plantilla + la portada del blog."""
import os, json

OUT = os.path.join(os.path.dirname(__file__), '..', 'public')
WA = ('<a href="https://wa.me/34722792501?text=Hola!%20Quiero%20info%20sobre%20la%20formaci%C3%B3n%20de%20u%C3%B1as%20%F0%9F%92%85" '
      'class="wa-fab" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">'
      '<path fill="#fff" d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.47 1.64 6.36L3 29l6.82-1.6A13 13 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm6.45 17.8c-.27.76-1.58 1.45-2.18 1.54-.56.08-1.27.12-2.04-.13a18.6 18.6 0 01-1.85-.68C13.6 20.3 11.5 17.8 11.34 17.6c-.16-.2-1.3-1.73-1.3-3.3 0-1.58.83-2.36 1.12-2.68.29-.32.63-.4.84-.4l.6.01c.19 0 .45-.07.7.54.27.63.92 2.24.99 2.4.08.16.13.35.03.56-.1.2-.16.33-.31.5-.16.18-.33.4-.47.54-.16.16-.33.33-.14.65.19.32.84 1.38 1.8 2.23 1.24 1.1 2.28 1.44 2.6 1.6.32.16.51.13.7-.08.19-.2.8-.93 1.01-1.25.2-.32.41-.27.7-.16.28.1 1.78.84 2.09.99.3.15.5.22.58.35.07.12.07.72-.2 1.49z"/></svg></a>')
HEADER = ('<header class="top"><div class="in"><a href="https://elevanails.es" class="brandlogo">'
          '<img src="/logo.png" alt="Nail Boss · Eleva Nails"></a>'
          '<a class="f" href="https://elevanails.es">Ver la formación</a></div></header>')
COURSE = ('<div class="coursecard"><h3>{ct}</h3><p>{cp}</p>'
          '<a href="https://elevanails.es">Descubre Nail Boss Academy →</a></div>')

def esc(s): return s

def faq_schema(faq):
    if not faq: return ''
    items = ",".join(['{"@type":"Question","name":%s,"acceptedAnswer":{"@type":"Answer","text":%s}}' %
                      (json.dumps(q, ensure_ascii=False), json.dumps(a, ensure_ascii=False)) for q, a in faq])
    return ('<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[' + items + ']}</script>')

def build(a):
    secs = "".join('<h2>%s</h2>%s' % (h, body) for h, body in a['sections'])
    faq = ''
    if a.get('faq'):
        qas = "".join('<div class="qa"><b>%s</b>%s</div>' % (q, ans) for q, ans in a['faq'])
        faq = '<div class="faq"><h2>Preguntas frecuentes</h2>%s</div>' % qas
    more = ''
    if a.get('related'):
        links = " · ".join('<a href="%s">%s</a>' % (u, t) for u, t in a['related'])
        more = '<div class="more">👉 Sigue: %s</div>' % links
    art_schema = ('<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article",'
                  '"headline":%s,"author":{"@type":"Organization","name":"Eleva Nails"},'
                  '"publisher":{"@type":"Organization","name":"Eleva Nails","url":"https://elevanails.es"},'
                  '"inLanguage":"es-ES"}</script>' % json.dumps(a['h1'], ensure_ascii=False))
    return """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{h1}">
<meta property="og:type" content="article">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://elevanails.es/blog/{slug}/">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💅</text></svg>">
<link rel="stylesheet" href="/brand.css">
{art_schema}
{faq_schema}
</head>
<body>
{header}
<div class="wrap">
  <span class="eyebrow">{eyebrow}</span>
  <h1>{h1}</h1>
  <p class="lead">{lead}</p>
  {callout}
  {secs}
  {course}
  {more}
  {faq}
  <p class="foot"><a href="/blog">← Volver al blog</a><br>© Eleva Nails · Formación profesional de manicura</p>
</div>
{wa}
</body>
</html>""".format(title=a['title'], desc=a['desc'], h1=a['h1'], slug=a['slug'],
                  art_schema=art_schema, faq_schema=faq_schema(a.get('faq')),
                  header=HEADER, eyebrow=a['eyebrow'], lead=a['lead'],
                  callout=('<div class="callout">%s</div>' % a['callout']) if a.get('callout') else '',
                  secs=secs, course=COURSE.format(ct=a['course'][0], cp=a['course'][1]),
                  more=more, faq=faq, wa=WA)

# CTA de curso reutilizable
CTA_GEN = ("¿Te ves dedicándote a esto?",
           "En Eleva Nails aprendes técnica profesional Y negocio: captación, precios y apertura de tu centro. "
           "Online + prácticas presenciales y titulación adaptada al Certificado de Profesionalidad.")
CTA_NEG = ("Aprende técnica Y negocio",
           "En Eleva Nails no solo aprendes a hacer uñas perfectas: aprendes a captar clientas, poner precios y montar tu negocio.")

ARTICLES = [
 {"slug":"montar-negocio-unas","eyebrow":"Guía pilar · Negocio",
  "title":"Cómo montar un negocio de uñas (en casa o local) 2026 | Eleva Nails",
  "desc":"Guía para montar tu negocio de uñas: inversión, alta de autónoma, licencia, precios, captación de clientas y errores a evitar. Empieza en casa o en local.",
  "h1":"Cómo montar un negocio de uñas",
  "lead":"Montar tu propio negocio de uñas es más accesible de lo que crees: puedes empezar en casa con poca inversión y crecer hasta tu propio centro. Aquí tienes la hoja de ruta completa.",
  "callout":"<b>Resumen:</b> necesitas formación, un kit profesional, darte de alta de autónoma, definir precios y un plan para captar clientas. Se puede arrancar desde casa con una inversión baja.",
  "sections":[
    ("¿En casa o en local?","<p>Empezar <b>en casa</b> (o a domicilio) reduce el riesgo: menos gastos fijos y validas la demanda. Cuando tengas agenda llena, das el salto a un <b>local</b>. Muchas de las mejores profesionales empezaron en su salón de casa.</p>"),
    ("La inversión inicial","<p>Kit profesional (torno, lámpara, geles/acrílicos), formación, y —si abres local— mobiliario y licencia. En casa, la inversión es baja; en local, sube por alquiler y reforma. <a href='/kit-unas-principiantes'>Ver qué material necesitas</a>.</p>"),
    ("Trámites: alta de autónoma","<p>Para facturar legalmente necesitas darte de <b>alta de autónoma</b> en Hacienda y Seguridad Social. Si abres local, además la licencia de actividad. <a href='/autonoma-manicurista'>Cómo hacerte autónoma paso a paso</a>.</p>"),
    ("Precios y rentabilidad","<p>Define precios que cubran material y te paguen un buen beneficio por hora. <a href='/cuanto-cobrar-por-unas'>Calcula cuánto cobrar</a> por cada servicio.</p>"),
    ("Captar clientas","<p>El negocio vive de las clientas: redes sociales, boca a boca y fidelización. <a href='/conseguir-clientas-unas'>El plan para conseguir clientas</a>.</p>"),
  ],
  "faq":[("¿Cuánto cuesta montar un negocio de uñas?","En casa, con formación y kit puedes arrancar con una inversión baja; en local sube por alquiler, reforma y licencia."),
         ("¿Necesito ser autónoma?","Sí, para facturar legalmente necesitas darte de alta como autónoma."),
         ("¿Puedo empezar sin local?","Sí, muchas empiezan en casa o a domicilio y dan el salto a local cuando tienen agenda.")],
  "related":[("/como-ser-manicurista","cómo ser manicurista"),("/conseguir-clientas-unas","conseguir clientas"),("/","cuánto se gana")],
  "course":CTA_NEG},

 {"slug":"curso-unas-online","eyebrow":"Formación",
  "title":"Curso de uñas online: cómo elegir bien (2026) | Eleva Nails",
  "desc":"Todo sobre los cursos de uñas online: ventajas, qué debe incluir, si dan titulación y prácticas, y cómo evitar los que te dejan sola. Guía de Eleva Nails.",
  "h1":"Curso de uñas online: cómo elegir bien",
  "lead":"Un curso de uñas online te da flexibilidad para formarte a tu ritmo, pero no todos son iguales. Aquí tienes qué mirar para elegir uno que de verdad te prepare para trabajar.",
  "callout":"<b>Clave:</b> un buen curso online no es solo vídeos: debe incluir <b>corrección de tus prácticas</b>, soporte, titulación y, idealmente, <b>prácticas presenciales</b>.",
  "sections":[
    ("Ventajas del online","<p>Estudias a tu ritmo, desde casa y compaginando con trabajo o familia. Repites las lecciones las veces que necesites.</p>"),
    ("Qué debe incluir un buen curso online","<ul><li>Corrección personalizada de tus prácticas.</li><li>Titulación (idealmente adaptada al Certificado de Profesionalidad).</li><li>Kit profesional para practicar.</li><li>Prácticas presenciales para consolidar.</li><li>Soporte y comunidad.</li></ul>"),
    ("Online vs presencial","<p>La modalidad <b>mixta</b> (online + prácticas) suele ser la más completa. <a href='/curso-unas-online-vs-presencial'>Comparativa completa</a>.</p>"),
  ],
  "faq":[("¿Un curso de uñas online sirve para trabajar?","Sí, si incluye prácticas y titulación. La técnica se consolida practicando sobre modelo."),
         ("¿Dan título los cursos online?","Los buenos sí, adaptado al Certificado de Profesionalidad.")],
  "related":[("/que-curso-de-unas-necesitas","qué curso necesitas"),("/curso-unas-online-vs-presencial","online vs presencial"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"curso-unas-online-vs-presencial","eyebrow":"Formación",
  "title":"Curso de uñas: ¿online o presencial? Comparativa 2026 | Eleva Nails",
  "desc":"Online, presencial o mixto: ventajas y desventajas de cada modalidad para formarte en uñas, y cuál te conviene según tu situación. Guía de Eleva Nails.",
  "h1":"Curso de uñas: ¿online o presencial?",
  "lead":"¿Mejor formarte online o presencial? Depende de tu tiempo, tu forma de aprender y tu objetivo. Te ayudamos a decidir con una comparativa clara.",
  "callout":"<b>Spoiler:</b> la modalidad <b>mixta</b> (online + prácticas presenciales) suele ganar: teoría flexible + práctica real supervisada.",
  "sections":[
    ("Online","<p><b>A favor:</b> flexible, a tu ritmo, más económico. <b>En contra:</b> necesita disciplina y buenas prácticas guiadas.</p>"),
    ("Presencial","<p><b>A favor:</b> corrección en directo, ritmo intensivo. <b>En contra:</b> horarios fijos y desplazamiento.</p>"),
    ("Mixto (lo mejor de ambas)","<p>Teoría online cuando puedes + prácticas presenciales para coger velocidad y acabado. Es lo que hacemos en Eleva Nails.</p>"),
  ],
  "related":[("/curso-unas-online","curso online"),("/que-curso-de-unas-necesitas","qué curso necesitas"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"curso-unas-acrilicas","eyebrow":"Formación · Técnica",
  "title":"Curso de uñas acrílicas: qué aprenderás y para qué sirve | Eleva Nails",
  "desc":"Qué se aprende en un curso de uñas acrílicas, para qué sirve, si sale rentable y cómo elegir una formación con prácticas y titulación. Eleva Nails.",
  "h1":"Curso de uñas acrílicas",
  "lead":"El acrílico es una de las técnicas más demandadas y mejor pagadas. Formarte bien en acrílico te diferencia y te permite cobrar más por servicio.",
  "callout":"<b>Por qué el acrílico:</b> es resistente, versátil y muy pedido. Dominarlo sube tu ticket medio frente a la manicura básica.",
  "sections":[
    ("Qué aprenderás","<ul><li>Preparación de la uña y bioseguridad.</li><li>Esculpido con molde y tip.</li><li>Estructura, arquitectura y limado.</li><li>Acabados y nail art.</li></ul>"),
    ("¿Sale rentable?","<p>Sí: el acrílico se cobra más que una manicura simple. <a href='/cuanto-cobrar-por-unas'>Calcula tu precio y beneficio</a>.</p>"),
    ("Practica sobre modelo","<p>La clave del acrílico es la práctica guiada. Busca una formación con prácticas presenciales y corrección.</p>"),
  ],
  "related":[("/unas-acrilicas-paso-a-paso","acrílicas paso a paso"),("/curso-unas-gel","curso de gel"),("/que-curso-de-unas-necesitas","qué curso necesitas")],
  "course":CTA_GEN},

 {"slug":"curso-unas-gel","eyebrow":"Formación · Técnica",
  "title":"Curso de uñas de gel: qué incluye y cómo elegirlo | Eleva Nails",
  "desc":"Qué aprenderás en un curso de uñas de gel, diferencias con el acrílico y cómo elegir una formación con prácticas y titulación. Guía de Eleva Nails.",
  "h1":"Curso de uñas de gel",
  "lead":"El gel es una técnica versátil y muy demandada, ideal tanto para nivelación como para esculpido. Formarte bien te abre puertas en cualquier salón.",
  "callout":"<b>Gel vs acrílico:</b> ambos son esculpido; el gel es más flexible y de olor más suave, el acrílico más resistente. Un buen curso te enseña los dos.",
  "sections":[
    ("Qué aprenderás","<ul><li>Nivelación y refuerzo con gel.</li><li>Esculpido en gel.</li><li>Semipermanente y acabados.</li><li>Bioseguridad y cuidado de la uña.</li></ul>"),
    ("Cómo hacer uñas de gel","<p>Te lo explicamos paso a paso en <a href='/como-hacer-unas-de-gel'>esta guía</a>.</p>"),
  ],
  "related":[("/como-hacer-unas-de-gel","gel paso a paso"),("/curso-unas-acrilicas","curso de acrílico"),("/que-curso-de-unas-necesitas","qué curso necesitas")],
  "course":CTA_GEN},

 {"slug":"curso-unas-certificado","eyebrow":"Formación · Titulación",
  "title":"Curso de uñas con certificado y titulación oficial | Eleva Nails",
  "desc":"Qué titulación obtienes con un curso de uñas, qué es el Certificado de Profesionalidad y por qué importa para trabajar. Guía clara de Eleva Nails.",
  "h1":"Curso de uñas con certificado",
  "lead":"¿Necesitas un título para trabajar de manicurista? Legalmente no, pero una titulación te abre más puertas y te da credibilidad. Te explicamos las opciones.",
  "callout":"<b>Importante:</b> la formación de Eleva Nails está adaptada al <b>Certificado de Profesionalidad</b> de cuidados estéticos de manos y pies.",
  "sections":[
    ("¿Hace falta título?","<p>Legalmente no se exige, pero la formación con titulación marca la diferencia al buscar empleo o generar confianza. <a href='/requisitos-manicurista-espana'>Ver requisitos</a>.</p>"),
    ("El Certificado de Profesionalidad","<p>Es la acreditación oficial del sector. Una formación adaptada a él te prepara para las pruebas y para trabajar en cualquier centro.</p>"),
  ],
  "related":[("/requisitos-manicurista-espana","requisitos"),("/como-ser-manicurista","cómo ser manicurista"),("/que-curso-de-unas-necesitas","qué curso necesitas")],
  "course":CTA_GEN},

 {"slug":"curso-unas-gratis-sepe","eyebrow":"Formación",
  "title":"Curso de uñas gratis o subvencionado (SEPE): ¿existe? | Eleva Nails",
  "desc":"¿Hay cursos de uñas gratis o subvencionados por el SEPE? Qué opciones reales existen, qué cubren y qué mirar antes de apuntarte. Guía de Eleva Nails.",
  "h1":"Curso de uñas gratis o subvencionado (SEPE)",
  "lead":"Mucha gente busca cursos de uñas gratis o subvencionados. Te contamos qué opciones reales existen y en qué fijarte para no perder el tiempo.",
  "callout":"<b>Ojo:</b> \"gratis\" no siempre significa completo. Revisa si incluye prácticas, kit y titulación, que es lo que de verdad te prepara para trabajar.",
  "sections":[
    ("Opciones subvencionadas","<p>Existen cursos para desempleados (SEPE/SEPECAM según comunidad) y formación bonificada para trabajadores. La oferta y plazas varían por región y convocatoria.</p>"),
    ("Qué mirar antes de apuntarte","<ul><li>¿Incluye prácticas reales?</li><li>¿Da titulación?</li><li>¿Aporta kit de material?</li><li>¿Hay soporte y salidas laborales?</li></ul>"),
    ("La alternativa completa","<p>Si buscas formación seria con prácticas, kit y titulación, valora una formación profesional especializada.</p>"),
  ],
  "related":[("/curso-unas-certificado","curso con certificado"),("/que-curso-de-unas-necesitas","qué curso necesitas"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"mejores-cursos-de-unas","eyebrow":"Formación",
  "title":"Cómo elegir el mejor curso de uñas (checklist 2026) | Eleva Nails",
  "desc":"Cómo elegir el mejor curso de uñas: checklist con lo que debe incluir (prácticas, titulación, kit, negocio, opiniones) para no equivocarte. Eleva Nails.",
  "h1":"Cómo elegir el mejor curso de uñas",
  "lead":"Hay muchísimos cursos de uñas y no todos valen. En vez de un ranking sesgado, te damos un checklist objetivo para que elijas bien tú misma.",
  "callout":"<b>Regla de oro:</b> el mejor curso no es el más barato ni el más caro, es el que te prepara para <b>trabajar y ganar dinero</b>.",
  "sections":[
    ("Checklist para elegir","<ul><li>Prácticas reales sobre modelo.</li><li>Titulación adaptada al Certificado de Profesionalidad.</li><li>Kit profesional incluido.</li><li>Parte de negocio (precios, captación).</li><li>Opiniones reales de alumnas.</li><li>Soporte y bolsa de trabajo.</li></ul>"),
    ("Señales de alarma","<p>Solo vídeos sin corrección, sin prácticas, sin titulación o con opiniones dudosas. Huye de las promesas mágicas.</p>"),
  ],
  "related":[("/que-curso-de-unas-necesitas","test: qué curso necesitas"),("/curso-unas-online","curso online"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"autonoma-manicurista","eyebrow":"Negocio",
  "title":"Cómo hacerte autónoma manicurista paso a paso (2026) | Eleva Nails",
  "desc":"Cómo darte de alta de autónoma para trabajar de manicurista: pasos, cuota, epígrafe y qué necesitas si trabajas en casa o a domicilio. Guía de Eleva Nails.",
  "h1":"Cómo hacerte autónoma manicurista",
  "lead":"Si vas a trabajar por tu cuenta, necesitas darte de alta como autónoma. Suena a lío, pero es más sencillo de lo que parece. Te lo explicamos claro.",
  "callout":"<b>Dos altas:</b> Hacienda (censo/epígrafe) y Seguridad Social (RETA). Hay tarifa plana para nuevos autónomos que abarata los primeros meses.",
  "sections":[
    ("Los pasos básicos","<ol class='steps'><li>Alta en Hacienda (modelo 036/037, epígrafe de actividad).</li><li>Alta en la Seguridad Social (RETA).</li><li>Si abres local: licencia de actividad.</li></ol>"),
    ("La cuota y la tarifa plana","<p>Los nuevos autónomos suelen tener una <b>tarifa plana</b> reducida los primeros meses. La cuota luego depende de tus ingresos reales.</p>"),
    ("¿Y si trabajo en casa?","<p>Igual necesitas el alta para facturar legalmente. Empezar en casa reduce gastos mientras creas tu cartera. <a href='/montar-negocio-unas'>Cómo montar tu negocio</a>.</p>"),
  ],
  "related":[("/montar-negocio-unas","montar tu negocio"),("/cuanto-cobrar-por-unas","cuánto cobrar"),("/conseguir-clientas-unas","conseguir clientas")],
  "course":CTA_NEG},

 {"slug":"kit-unas-principiantes","eyebrow":"Técnica · Material",
  "title":"Kit de uñas para empezar: material imprescindible (2026) | Eleva Nails",
  "desc":"Qué material necesitas para empezar a hacer uñas: lista del kit imprescindible para principiantes (torno, lámpara, geles, acrílico) y en qué invertir primero.",
  "h1":"Kit de uñas para empezar",
  "lead":"¿Por dónde empezar con el material? Aquí tienes la lista del kit imprescindible para principiantes, sin gastar de más en cosas que no necesitas aún.",
  "callout":"<b>Consejo:</b> invierte primero en lo que más usas y en calidad de lámpara y torno. El resto se amplía con el tiempo.",
  "sections":[
    ("El kit imprescindible","<ul><li>Lámpara UV/LED.</li><li>Torno (para principiantes, con control de velocidad).</li><li>Geles y/o acrílico + líquido.</li><li>Limas, buffer, pinceles y tips/moldes.</li><li>Productos de preparación e higiene.</li></ul>"),
    ("En qué no escatimar","<p>Lámpara y torno de calidad marcan la diferencia en acabado y durabilidad. Lo barato sale caro.</p>"),
    ("Kit incluido en la formación","<p>En Eleva Nails el kit profesional va incluido, así empiezas a practicar desde el primer día.</p>"),
  ],
  "related":[("/unas-acrilicas-paso-a-paso","acrílicas paso a paso"),("/como-hacer-unas-de-gel","gel paso a paso"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"unas-acrilicas-paso-a-paso","eyebrow":"Técnica",
  "title":"Uñas acrílicas paso a paso para principiantes (2026) | Eleva Nails",
  "desc":"Cómo hacer uñas acrílicas paso a paso: preparación, esculpido, estructura, limado y acabado. Guía para principiantes de Eleva Nails.",
  "h1":"Uñas acrílicas paso a paso",
  "lead":"El acrílico intimida al principio, pero con el orden correcto se domina. Aquí tienes el proceso paso a paso para entender la técnica (y practicarla bien).",
  "callout":"<b>Aviso:</b> esta guía es orientativa. La técnica del acrílico se aprende con <b>práctica guiada</b> sobre modelo, no solo leyendo.",
  "sections":[
    ("1. Preparación","<p>Higiene, empuje de cutícula, limado suave de la superficie y deshidratante + primer para que agarre.</p>"),
    ("2. Esculpido","<p>Coloca molde o tip, prepara la bolita (líquido + polvo) y trabaja zona a zona: base, estructura y borde libre.</p>"),
    ("3. Estructura y limado","<p>Define el arco y el apex, y lima para dar forma y simetría. Aquí está el 80% del resultado profesional.</p>"),
    ("4. Acabado","<p>Sella, aplica color o nail art y dales brillo. Cuida la piel de alrededor.</p>"),
  ],
  "related":[("/curso-unas-acrilicas","curso de acrílico"),("/kit-unas-principiantes","kit para empezar"),("/como-ser-manicurista","cómo ser manicurista")],
  "course":CTA_GEN},

 {"slug":"como-hacer-unas-de-gel","eyebrow":"Técnica",
  "title":"Cómo hacer uñas de gel paso a paso (2026) | Eleva Nails",
  "desc":"Cómo hacer uñas de gel paso a paso: preparación, nivelación o esculpido, curado y acabado. Guía para principiantes de Eleva Nails.",
  "h1":"Cómo hacer uñas de gel",
  "lead":"El gel es ideal para empezar: más fácil de manejar que el acrílico y con acabados preciosos. Te contamos el proceso paso a paso.",
  "callout":"<b>Recuerda:</b> cada capa de gel necesita <b>curado en lámpara</b> UV/LED. Trabaja en capas finas para un acabado limpio.",
  "sections":[
    ("1. Preparación","<p>Higiene, cutícula, limado suave y deshidratante + primer.</p>"),
    ("2. Nivelación o esculpido","<p>Aplica base y trabaja la estructura con gel constructor, en capas finas y curando cada una.</p>"),
    ("3. Color y acabado","<p>Color o nail art, sella con top y retira pegajosidad. Hidrata la cutícula.</p>"),
  ],
  "related":[("/curso-unas-gel","curso de gel"),("/kit-unas-principiantes","kit para empezar"),("/unas-acrilicas-paso-a-paso","acrílicas paso a paso")],
  "course":CTA_GEN},

 {"slug":"nivelacion-unas-torno","eyebrow":"Técnica",
  "title":"Nivelación de uñas y torno para principiantes (2026) | Eleva Nails",
  "desc":"Qué es la nivelación de uñas, para qué sirve y cómo usar el torno de forma segura siendo principiante. Guía práctica de Eleva Nails.",
  "h1":"Nivelación de uñas y torno para principiantes",
  "lead":"La nivelación mejora el aspecto y la durabilidad del esmaltado, y el torno te ahorra tiempo. Te explicamos ambos con seguridad para empezar.",
  "callout":"<b>Seguridad primero:</b> el torno mal usado daña la uña. Empieza a baja velocidad y con brocas suaves.",
  "sections":[
    ("Qué es la nivelación","<p>Es crear una base uniforme sobre la uña natural para que el esmaltado quede recto, dure más y no se despegue.</p>"),
    ("El torno para principiantes","<p>Úsalo a baja velocidad, con la broca adecuada y sin presionar. Sirve para retirar producto, preparar y perfilar, no para 'excavar'.</p>"),
  ],
  "related":[("/como-hacer-unas-de-gel","gel paso a paso"),("/kit-unas-principiantes","kit para empezar"),("/curso-unas-gel","curso de gel")],
  "course":CTA_GEN},

 {"slug":"salidas-laborales-unas","eyebrow":"Profesión",
  "title":"Salidas laborales de la manicura y estética (2026) | Eleva Nails",
  "desc":"Qué salidas laborales tiene formarte en uñas: salones, centros de estética, autónoma, tu propio negocio, formadora. El sector beauty crece cada año.",
  "h1":"Salidas laborales de la manicura",
  "lead":"Formarte en uñas abre más puertas de las que parece. El sector belleza crece cada año y la demanda de profesionales bien formadas es alta.",
  "callout":"<b>Dato:</b> el sector beauty es de los que más crece, con centros buscando técnicas cualificadas constantemente.",
  "sections":[
    ("Por cuenta ajena","<p>Salones de uñas, centros de estética, spas y peluquerías con servicio de manicura. Incorporación rápida si tienes buena formación.</p>"),
    ("Por tu cuenta","<p>Autónoma a domicilio, tu propio salón en casa o local, o marca personal en redes. <a href='/montar-negocio-unas'>Cómo montar tu negocio</a>.</p>"),
    ("Otras salidas","<p>Formadora, creación de contenido, venta de productos y servicios especializados (nail art, eventos, novias).</p>"),
  ],
  "related":[("/","cuánto se gana"),("/como-ser-manicurista","cómo ser manicurista"),("/montar-negocio-unas","montar tu negocio")],
  "course":CTA_GEN},
]

# Landings locales (alta intención). Contenido diferenciado por ciudad.
CIUDADES = [
 ("madrid","Madrid","en la capital, con gran demanda de profesionales y salones en constante búsqueda de técnicas cualificadas"),
 ("barcelona","Barcelona","en una de las ciudades con más movimiento del sector beauty de España"),
 ("valencia","Valencia","una ciudad con un sector de la estética en pleno crecimiento"),
 ("sevilla","Sevilla","referente del sur, con fuerte demanda de manicura y estética"),
]
for slug_c, city, ctx in CIUDADES:
    ARTICLES.append({
      "slug":"curso-unas-"+slug_c,"eyebrow":"Formación · "+city,
      "title":f"Curso de uñas en {city}: formación profesional (2026) | Eleva Nails",
      "desc":f"Curso de uñas profesional para {city}: online + prácticas presenciales, titulación adaptada al Certificado de Profesionalidad y kit incluido. Fórmate con Eleva Nails.",
      "h1":f"Curso de uñas en {city}",
      "lead":f"¿Quieres formarte como manicurista profesional {ctx}? Con Eleva Nails estudias online a tu ritmo y consolidas con prácticas presenciales, con titulación y kit incluido.",
      "callout":f"<b>Para {city}:</b> formación mixta (online + prácticas), titulación adaptada al Certificado de Profesionalidad y bolsa de trabajo activa.",
      "sections":[
        ("Cómo es la formación","<p>Online a tu ritmo + prácticas presenciales para coger velocidad y acabado. Incluye kit profesional y soporte.</p>"),
        (f"Salidas en {city}","<p>Trabaja en salones y centros, o monta tu propio negocio de uñas. <a href='/salidas-laborales-unas'>Ver salidas laborales</a>.</p>"),
        ("¿Cuánto se gana?","<p>Por cuenta ajena 900-1.500 €/mes; como autónoma hasta 2.500-3.000 €. <a href='/'>Calcula tu caso</a>.</p>"),
      ],
      "related":[("/como-ser-manicurista","cómo ser manicurista"),("/","cuánto se gana"),("/que-curso-de-unas-necesitas","qué curso necesitas")],
      "course":CTA_GEN})

for a in ARTICLES:
    open(os.path.join(OUT, a['slug']+'.html'), 'w', encoding='utf-8').write(build(a))

print("Generados:", len(ARTICLES), "artículos")
print("\n".join(" - /"+a['slug'] for a in ARTICLES))

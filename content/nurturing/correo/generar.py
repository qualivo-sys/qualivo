# Genera los correos de nurturing de formación (v2) en HTML apto para correo
# (tablas, estilos en línea, bgcolor + background-color) y una página de vista
# previa con los seis. Uso: python3 generar.py
import os, html
D = os.path.dirname(os.path.abspath(__file__))
TINTA, TEAL, TEAL_OSC, GRIS, FONDO, LILA = '#101319', '#27BDB1', '#0E7C74', '#7A7C82', '#F4F5F7', '#EFECFB'
F = "font-family:Montserrat,Arial,Helvetica,sans-serif;"

def p(t, extra=''):
    return f'<p style="margin:0 0 16px;{F}font-size:16px;line-height:1.65;color:{TINTA};{extra}">{t}</p>'

def enlace(texto, url):
    return (f'<p style="margin:4px 0 20px;{F}font-size:16px;line-height:1.5;">'
            f'<a href="{url}" style="color:{TEAL_OSC};font-weight:700;text-decoration:underline;">{texto} →</a></p>')

def caja(filas, titulo=''):
    t = f'<div style="{F}font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:{TEAL_OSC};margin-bottom:8px;">{titulo}</div>' if titulo else ''
    rows = ''.join(
        f'<tr><td valign="top" bgcolor="{LILA}" style="background-color:{LILA};padding:9px 0;{"border-top:1px solid #DCD8EE;" if i else ""}{F}font-size:15px;line-height:1.45;color:{TINTA};width:110px;font-weight:800;color:{TEAL_OSC};">{a}</td>'
        f'<td valign="top" bgcolor="{LILA}" style="background-color:{LILA};padding:9px 0;{"border-top:1px solid #DCD8EE;" if i else ""}{F}font-size:15px;line-height:1.45;color:{TINTA};">{b}</td></tr>'
        for i, (a, b) in enumerate(filas))
    return (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="{LILA}" style="background-color:{LILA};border-radius:12px;margin:4px 0 20px;">'
            f'<tr><td bgcolor="{LILA}" style="background-color:{LILA};padding:16px 20px;">{t}'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows}</table></td></tr></table>')

def cifras(items):
    celdas = ''.join(
        f'<td align="center" bgcolor="{TINTA}" style="background-color:{TINTA};padding:16px 6px;">'
        f'<div style="{F}font-weight:900;font-size:24px;line-height:1.1;color:{TEAL};">{n}</div>'
        f'<div style="{F}font-size:12px;line-height:1.3;color:#C9CED6;margin-top:4px;">{l}</div></td>'
        for n, l in items)
    return (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="{TINTA}" style="background-color:{TINTA};border-radius:12px;margin:4px 0 20px;"><tr>{celdas}</tr></table>')

FIRMA = (f'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 0;"><tr>'
         f'<td valign="middle" style="padding-right:12px;"><img src="https://qualivo.io/assets/img/maikel-echevarria.jpg" width="44" height="44" alt="Maikel" style="display:block;width:44px;height:44px;border-radius:50%;border:0;"></td>'
         f'<td valign="middle" style="{F}font-size:14px;line-height:1.4;color:{TINTA};"><b>Maikel Echevarría</b><br><span style="color:{GRIS};">Fundador de Qualivo · <a href="https://qualivo.io" style="color:{GRIS};">qualivo.io</a></span></td>'
         f'</tr></table>')
BAJA = f'<p style="margin:24px 0 0;{F}font-size:12px;line-height:1.5;color:{GRIS};">Si prefieres que no te escriba más, respóndeme «baja» y listo.</p>'

def correo(asunto, preheader, cuerpo, baja=True):
    return f'''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(asunto)}</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet"></head>
<body bgcolor="{FONDO}" style="margin:0;padding:0;background-color:{FONDO};">
<div style="display:none;max-height:0;overflow:hidden;">{html.escape(preheader)}</div>
<table bgcolor="{FONDO}" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:{FONDO};"><tr><td align="center" style="padding:24px 12px;">
<table bgcolor="#FFFFFF" role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background-color:#FFFFFF;border-radius:14px;border-top:4px solid {TEAL};">
<tr><td bgcolor="#FFFFFF" style="background-color:#FFFFFF;padding:30px 32px 30px;">
{cuerpo}
{FIRMA}
{BAJA if baja else ''}
</td></tr></table></td></tr></table></body></html>'''

CORREOS = [
 dict(n=0, dia='Día 0', cuando='15 min tras entrar', asunto='lo que vamos a mirar en {{empresa}}',
  pre='Qué hacemos en los 15 minutos y un dato que ayuda mucho.',
  cuerpo=p('Hola {{nombre}}:') +
   p('Soy Maikel, de Qualivo. Gracias por pedir el diagnóstico. Te acabo de escribir por WhatsApp para buscar un hueco; te dejo aquí lo que vamos a hacer, para que sepas qué esperar.') +
   caja([('15 min','Dibujamos vuestro recorrido, desde que alguien pide información hasta que se matricula.'),
         ('Después','Vemos dónde se están quedando alumnos por el camino.'),
         ('Y al final','Si tiene sentido, te enseño cómo lo resolveríamos. Si no lo tiene, te lo digo igual.')], 'Lo que vamos a hacer') +
   p('Una cosa que ayuda mucho: si puedes, ven con un dato, <b>cuántas solicitudes os llegaron el mes pasado</b>. Con eso ya sale una cifra.') +
   enlace('Si prefieres elegir tú la hora', 'https://qualivo.io/llamada/?utm_source=nurturing&utm_medium=email&utm_campaign=formacion-0')),
 dict(n=1, dia='Día 2', cuando='', asunto='lo que pasa en la primera hora',
  pre='Una sola idea, por si te sirve aunque no hablemos.',
  cuerpo=p('Hola {{nombre}}:') +
   p('Te escribo una sola idea, por si te sirve aunque no hablemos.') +
   p('Un estudio de Harvard Business Review sobre más de 2.000 empresas vio que quien responde a una solicitud <b>en la primera hora</b> tiene casi siete veces más probabilidades de cualificarla que quien tarda algo más.') +
   p('En formación se nota todavía más: quien pide información de un curso suele pedirla en dos o tres sitios a la vez, y se queda con el primero que le contesta con sentido.') +
   caja([('Mañana','Mira las diez últimas solicitudes y apunta cuánto tardó alguien en contestar a cada una.'),
         ('Si ves…','alguna que pasó la noche o el fin de semana sin respuesta, ahí hay matrículas.')], 'Una prueba de cinco minutos') +
   p('Si quieres, te digo cómo lo arreglaríamos en {{empresa}} sin contratar a nadie. Basta con que respondas a este correo.')),
 dict(n=2, dia='Día 5', cuando='', asunto='559 interesados, 10 matrículas y qué cambió',
  pre='Una escuela de formación que no sabía qué anuncio acababa en matrícula.',
  cuerpo=p('Hola {{nombre}}:') +
   p('Te cuento un caso de formación, por si se parece al vuestro.') +
   p('Una escuela aeronáutica de Cataluña invertía en Meta, Google y TikTok para tres cursos muy distintos. Tenían interesados de sobra, pero no sabían qué anuncio acababa en matrícula y cuál solo traía curiosos.') +
   p('Unimos cada anuncio con lo que pasaba después: interesado, entrevista, matrícula. En un mes:') +
   cifras([('559','interesados'),('68','entrevistas'),('10','matrículas'),('44.000 €','atribuidos')]) +
   p('Unas diez veces lo invertido. Lo más útil no fue el número, fue poder apagar lo que no vendía.') +
   enlace('El caso completo, si te apetece', 'https://qualivo.io/casos/eac/?utm_source=nurturing&utm_medium=email&utm_campaign=formacion-2')),
 dict(n=3, dia='Día 8', cuando='', asunto='¿cuánto se os queda por el camino?',
  pre='Una calculadora de tres minutos, sin correo ni teléfono.',
  cuerpo=p('Hola {{nombre}}:') +
   p('Casi nadie sabe cuánto pierde entre que alguien pide información y se matricula. Lo he convertido en una calculadora de tres minutos.') +
   caja([('9','preguntas: cuántas solicitudes, cuánto tardáis en contestar, qué pasa con el que dice «me lo pienso».'),
         ('1','cifra al mes, con el cálculo a la vista.'),
         ('0','datos personales: no te pide correo ni teléfono.')]) +
   enlace('Calcular lo que se os queda por el camino', 'https://qualivo.io/intelligence/diagnostico/?sector=formacion&utm_source=nurturing&utm_medium=email&utm_campaign=formacion-3') +
   p('Si la cifra te sorprende, contéstame con ella y te digo por dónde empezaría.')),
 dict(n=4, dia='Día 12', cuando='', asunto='23:04, 23:05, 9:00',
  pre='Cómo funciona por dentro, en tres horas del reloj.',
  cuerpo=p('Hola {{nombre}}:') +
   caja([('23:04','Un alumno pide información.'),
         ('23:05','Ya tiene respuesta, con su nombre y sobre el curso que preguntó.'),
         ('9:00','Le llamamos. Y admisiones solo entra cuando está listo para hablar, con la conversación resumida.')]) +
   p('Esto no sustituye a tu equipo ni a tu agencia. Hace lo repetitivo (contestar al momento, recordar, volver a escribir al que se lo piensa) y les pasa a ellos lo que vende.') +
   enlace('Verlo funcionar en 16 segundos', '{{enlace_video}}') +
   p('Si quieres verlo con los datos de {{empresa}}, son 15 minutos: responde a este correo y te propongo hora.')),
 dict(n=5, dia='Día 20', cuando='', asunto='¿lo dejamos aquí?',
  pre='Con una palabra me vale.',
  cuerpo=p('Hola {{nombre}}:') +
   p('No quiero llenarte la bandeja, así que te pregunto directamente: ¿mejorar cómo respondéis y seguís a los interesados es algo que queréis mover en los próximos meses, o ahora mismo no toca?') +
   p('Con una palabra me vale:') +
   caja([('«Ahora»','Te propongo dos huecos para vernos esta semana.'),
         ('«Más adelante»','Dime cuándo y te escribo entonces, no antes.'),
         ('«No»','Te borro de mi lista y tan amigos.')]), baja=False),
]
for c in CORREOS:
    open(os.path.join(D, f"formacion-{c['n']}.html"), 'w').write(correo(c['asunto'], c['pre'], c['cuerpo'], c.get('baja', True)))

# Vista previa: los seis correos en columna, con su día y asunto.
tarjetas = ''
for c in CORREOS:
    cuerpo = c['cuerpo'] + FIRMA + (BAJA if c.get('baja', True) else '')
    tarjetas += f'''<section class="it"><div class="meta"><span class="dia">{c['dia']}</span><span class="n">Correo {c['n']}</span></div>
<div class="bandeja"><div class="de"><b>Maikel Echevarría</b> &lt;maikel@qualivo.io&gt;</div><div class="as">{html.escape(c['asunto'])}</div><div class="pre">{html.escape(c['pre'])}</div></div>
<div class="mail">{cuerpo}</div></section>'''
open(os.path.join(D, 'vista-previa.html'), 'w').write(f'''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nurturing formación</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800;900&display=swap" rel="stylesheet">
<style>body{{margin:0;background:{FONDO};font-family:Montserrat,Arial,sans-serif;color:{TINTA}}}
header{{background:#08090C;color:#fff;padding:40px 24px 32px;text-align:center}}header h1{{margin:0;font-weight:900;font-size:30px;letter-spacing:-.02em}}header p{{margin:10px 0 0;color:#B7C0CC;font-size:15px}}
.linea{{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:18px}}.linea span{{background:rgba(39,189,177,.15);color:#7CE8DD;border-radius:999px;padding:6px 12px;font-size:13px;font-weight:700}}
main{{max-width:600px;margin:0 auto;padding:28px 16px 60px}}.it{{margin-bottom:34px}}.meta{{display:flex;gap:10px;align-items:center;margin-bottom:10px}}
.dia{{background:{TEAL};color:#04231F;font-weight:800;font-size:13px;border-radius:999px;padding:5px 12px}}.n{{font-size:13px;color:{GRIS};font-weight:700}}
.bandeja{{background:#fff;border-radius:14px 14px 0 0;padding:14px 20px;border-bottom:1px solid #ECEDF0;font-size:14px}}.de{{color:{GRIS}}}.as{{font-weight:800;font-size:16px;margin:4px 0 2px}}.pre{{color:{GRIS};font-size:13px}}
.mail{{background:#fff;border-radius:0 0 14px 14px;padding:26px 28px;border-top:4px solid {TEAL}}}</style></head><body>
<header><h1>Nurturing por correo · formación</h1><p>Seis correos desde que entra el contacto. Se para si contesta, reserva o pide la baja.</p>
<div class="linea"><span>Día 0</span><span>Día 2</span><span>Día 5</span><span>Día 8</span><span>Día 12</span><span>Día 20</span></div></header>
<main>{tarjetas}</main></body></html>''')
print('ok', len(CORREOS))

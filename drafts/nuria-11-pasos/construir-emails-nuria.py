# Rehace los 6 emails Black Friday con la plantilla habitual de Nuria (la del email de bienvenida de 11 Pasos):
# misma cabecera, firma con foto y pie legal; cambia solo el cuerpo.
import re, sys
BASE = sys.argv[1]
s = open(BASE, encoding='utf-8').read()
ini = s.rfind('<p', 0, s.find('Holaaaaa')); fin = s.rfind('<p', 0, s.find('Un abrazo'))
cab, pie = s[:ini], s[fin:]
F = 'font-family: Roboto, arial, helvetica, sans-serif'
def p(t, centro=False): return f'<p style="color: rgb(51, 51, 51);text-align: {"center" if centro else "left"};line-height: 1.5;margin: 0 0 16px;font-size: 16px;{F};"><span style="font-size: 16px; {F}">{t}</span></p>'
def nota(t): return f'<p style="color: rgb(120, 120, 120);text-align: center;line-height: 1.5;margin: 0 0 20px;font-size: 14px;{F};">{t}</p>'
def boton(txt, url): return f'<p style="text-align: center;margin: 8px 0 8px;{F};"><a target="_blank" rel="noopener noreferrer nofollow" href="{url}" style="display:inline-block;background:#708b9d;color:#ffffff;text-decoration:none;border-radius:8px;padding:14px 28px;font-size:17px;font-weight:bold;{F};"><span style="color:#ffffff !important;font-weight:bold;text-decoration:none !important;">{txt}</span></a></p>'
VIP = '{{trigger_link.FZUT5ixuYOyyABMAPWtP}}'
L = 'https://nr.nuriaroure.com/black-friday-11-pasos?utm_source=email&amp;utm_medium=kliking&amp;utm_campaign=blackfriday11&amp;utm_content='
H = '<strong>¡Hola {{contact.first_name}}!</strong>'
E = {
'emails-vip/1-lun-16-nov.html': ('Una lista VIP para conocer mi propuesta antes que nadie.', [p(H),
  p('Estos días te van a llegar ofertas de todas partes. Descuentos, prisas, «solo hoy»… Y casi todas te empujan a decidir rápido.'),
  p('Este año quiero hacerlo distinto.'),
  p('He creado una <strong>lista VIP en Telegram</strong> para las personas que me leéis desde hace tiempo.'),
  p('El <strong>domingo 22 de noviembre</strong> compartiré allí, antes que nadie, lo que he preparado para este Black Friday. Unos días antes de que se abra al resto.'),
  p('Si quieres estar dentro, solo tienes que entrar desde aquí 👇'),
  boton('QUIERO ENTRAR EN LA LISTA VIP', VIP), nota('Es un canal de Telegram. Entrar es gratis y te lleva un minuto.'),
  p('¿Nos vemos dentro?')]),
'emails-vip/2-jue-19-nov.html': ('El domingo desvelo mi propuesta en la lista VIP.', [p(H),
  p('Te escribo rápido.'),
  p('Este <strong>domingo, 22 de noviembre</strong>, desvelo en la lista VIP lo que he preparado para este Black Friday.'),
  p('Lo verán primero solo las personas que estén dentro. Y te adelanto una cosa: quien se apunte ese mismo domingo tendrá un regalo que después ya no estará.'),
  p('<strong>Antes de pulsar el botón, descárgate la app de Telegram</strong> (es gratis). Si no la tienes, el enlace no se abre. Descárgala aquí: <a href="https://apps.apple.com/es/app/telegram-messenger/id686449807" style="color:#708b9d;font-weight:bold;">iPhone</a> · <a href="https://play.google.com/store/apps/details?id=org.telegram.messenger" style="color:#708b9d;font-weight:bold;">Android</a> · <a href="https://desktop.telegram.org/" style="color:#708b9d;font-weight:bold;">ordenador</a>.'),
  p('Si todavía no estás, puedes entrar aquí 👇'),
  boton('ENTRAR EN LA LISTA VIP', VIP), nota('Es un canal de Telegram. Entrar es gratis y te lleva un minuto.'),
  p('Si ya estás dentro, no tienes que hacer nada: nos vemos el domingo.')]),
'emails-vip/3-sab-21-nov.html': ('Mañana, domingo, comparto la propuesta en la lista VIP.', [p(H),
  p('Mañana es el día.'),
  p('Mañana, <strong>domingo</strong>, comparto en la lista VIP la propuesta de este año. Y solo durante el domingo tendrá un regalo extra.'),
  p('<strong>Antes de pulsar el botón, descárgate la app de Telegram</strong> (es gratis). Si no la tienes, el enlace no se abre. Descárgala aquí: <a href="https://apps.apple.com/es/app/telegram-messenger/id686449807" style="color:#708b9d;font-weight:bold;">iPhone</a> · <a href="https://play.google.com/store/apps/details?id=org.telegram.messenger" style="color:#708b9d;font-weight:bold;">Android</a> · <a href="https://desktop.telegram.org/" style="color:#708b9d;font-weight:bold;">ordenador</a>.'),
  p('Si quieres verla antes que nadie, este es el momento de entrar 👇'),
  boton('ENTRAR AHORA', VIP), nota('Es un canal de Telegram. Entrar es gratis y te lleva un minuto.'),
  p('Si ya estás dentro, no tienes que hacer nada: nos vemos mañana.')]),
'emails-oferta/4-dom-22-nov.html': ('Lo que te prometí: A 11 Pasos del Sueño, con regalo solo hoy.', [p(H),
  p('Te prometí que hoy lo verías antes que nadie. Aquí está.'),
  p('Este Black Friday abro <strong>A 11 Pasos del Sueño</strong>: un programa de 11 días en el que cada día descubres un hábito de sueño con evidencia científica y lo pones en práctica, acompañada por mí.'),
  p('Empezamos el <strong>5 de diciembre</strong>. Tendremos 3 directos por Zoom para resolver tus dudas, un grupo de Telegram para acompañarte cada día y las grabaciones disponibles durante 1 año.'),
  p('El precio de Black Friday es de <strong>175 €</strong>.'),
  p('Y <strong>solo hoy, domingo, hasta las 23:59</strong>, si te inscribes te llevas además mis <strong>3 meditaciones guiadas de regalo</strong> para acompañar tus noches.'),
  boton('QUIERO EMPEZAR LOS 11 PASOS', L+'vip22'),
  p('¿Nos vemos el 5 de diciembre?')]),
'emails-oferta/5-vie-27-nov.html': ('Un hábito de sueño cada día, durante 11 días, acompañada.', [p(H),
  p('Hoy es Black Friday. Y en lugar de un descuento más, te propongo algo que te puede servir de verdad: 11 días para cuidar tu sueño, paso a paso.'),
  p('Se llama <strong>A 11 Pasos del Sueño</strong>. Cada día, un vídeo corto con un hábito y cómo ponerlo en práctica. Tres directos conmigo por Zoom para resolver tus dudas. Un grupo de Telegram para acompañarte. Y las grabaciones durante 1 año, por si algún día no puedes conectarte.'),
  p('Muchas veces dejamos los hábitos por el camino. Lo que marca la diferencia es la constancia y tener a alguien que te acompañe cada día. Para eso estoy.'),
  p('Empezamos el <strong>5 de diciembre</strong>. Hasta el lunes 30 lo tienes a <strong>175 €</strong>. Después, 185 €.'),
  boton('QUIERO EMPEZAR LOS 11 PASOS', L+'bf27')]),
'emails-oferta/6-lun-30-nov.html': ('Último día a 175 €.', [p(H),
  p('Te escribo rápido: <strong>hoy es el último día</strong> para inscribirte en A 11 Pasos del Sueño por <strong>175 €</strong>. A partir de mañana, el precio sube a 185 €.'),
  p('Empezamos el sábado 5 de diciembre. 11 días, un hábito cada día, 3 directos conmigo por Zoom y las grabaciones durante 1 año.'),
  p('Si llevas tiempo queriendo ordenar tus noches, este es un buen momento para empezar.'),
  boton('INSCRIBIRME HOY', L+'ultimo30'),
  p('Si ya te has inscrito, gracias: nos vemos el 5 de diciembre.')]),
}
for f, (pre, cuerpo) in E.items():
    h = cab + ''.join(cuerpo) + pie
    h = re.sub(r'(<body[^>]*>)', r'\1<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' + pre + '</div>', h, count=1)
    open(f, 'w', encoding='utf-8').write(h)
    print(f, len(h))

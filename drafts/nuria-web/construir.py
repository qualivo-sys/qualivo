# Construye páginas de nuriaroure.com con el diseño de la portada nueva (menú, barra del test y pie iguales).
# Base: el bloque HTML de la portada (home-widget-original.html). Salida: sobre-mi.html (para pegar en un
# widget HTML de Elementor, plantilla «Lienzo de Elementor», igual que la portada).
import re, os
D = os.path.dirname(os.path.abspath(__file__))
w = open(os.path.join(D, 'home-widget-original.html'), encoding='utf-8').read()
FUENTES = '<link href="https://nuriaroure.com/wp-content/cache/perfmatters/nuriaroure.com/fonts/81f329322587.google-fonts.min.css" rel="stylesheet">\n'
estilo = w[:w.find('</style>') + 8]
cuerpo = w[w.find('</style>') + 8:]
arriba = cuerpo[cuerpo.find('<div class="nr">'):cuerpo.find('<section class="hero">')]
pie = cuerpo[cuerpo.find('<footer class="foot">'):cuerpo.find('</footer>') + 9]
s1 = cuerpo.find('<script>\n  // Menú en móvil')
scripts = cuerpo[s1:cuerpo.find('</script>', s1) + 9]
import importlib.util as _iu
_sp = _iu.spec_from_file_location('cab', os.path.join(D, 'construir_cabecera.py')); _cab = _iu.module_from_spec(_sp); _sp.loader.exec_module(_cab)
arriba = re.sub(r'<ul class="nav-links" id="nrMenu">.*?</ul>', _cab.menu_html(), arriba, flags=re.S)
prensa = cuerpo[cuerpo.find('<div class="wrap prensa-wrap" id="prensa">'):cuerpo.find('<section class="programa">')]
prensa = prensa[:prensa.rfind('</section>')]
# quitar el lazy-load de perfmatters (fuera de WordPress no funciona)
def sin_lazy(h): return re.sub(r'src="data:image/svg\+xml[^"]*"([^>]*?)data-src="([^"]+)"', r'src="\2"\1', h).replace(' perfmatters-lazy', '')
FL = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
TEST = 'https://nr.nuriaroure.com/test-patrones?utm_source=sobre-mi&utm_medium=organic&utm_campaign=test'
PROG = 'https://nr.nuriaroure.com/3-claves-para-dormir-mejor-a?utm_source=sobre-mi&utm_medium=organic&utm_campaign=programa'
AMAZON = 'https://amzn.to/3zEjguY'
EBOOK = 'https://nuriaroure.com/regalo/'

extra = """<style>
  .sm-hero{padding:90px 0 70px}
  .sm-hero .lead{font-size:19px;color:var(--muted);max-width:560px;margin:0 0 26px}
  .sm-sec{padding:90px 0}
  .sm-sec.alt{background:var(--beige-2)}
  .sm-head{text-align:center;max-width:720px;margin:0 auto 44px}
  .sm-head p{color:var(--muted);font-size:17px;margin:0}
  .sm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1140px;margin:0 auto}
  .sm-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:26px}
  .sm-card b{display:block;font-family:'Oswald',sans-serif;font-weight:600;font-size:19px;color:var(--navy);margin-bottom:8px;letter-spacing:.01em}
  .sm-card span{color:var(--muted);font-size:15px;line-height:1.6}
  .sm-text{max-width:760px;margin:0 auto;font-size:17.5px}
  .sm-text p{margin:0 0 18px}
  .sm-quote{font-family:'Oswald',sans-serif;font-weight:500;font-size:clamp(24px,3vw,34px);line-height:1.25;color:var(--navy);text-align:center;max-width:760px;margin:0 auto 40px}
  .sm-quote em{color:var(--coral-dark);font-style:normal}
  .sm-books{display:grid;grid-template-columns:.8fr 1.2fr;gap:56px;align-items:center;max-width:1040px;margin:0 auto}
  .sm-books img{border-radius:12px;box-shadow:0 30px 60px -25px rgba(40,50,73,.3)}
  .sm-books ul{list-style:none;padding:0;margin:0 0 28px}
  .sm-books li{padding:12px 0;border-bottom:1px solid var(--line);font-size:16.5px}
  .sm-books li b{font-family:'Oswald',sans-serif;font-weight:600;font-size:19px;color:var(--navy)}
  .sm-cta{background:var(--navy);color:#fff;padding:90px 0;text-align:center}
  .sm-cta h2{color:#fff}
  .sm-cta p{color:rgba(255,255,255,.78);font-size:17px;max-width:620px;margin:0 auto 30px}
  .sm-cta .btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
  .sm-cta .btn-ghost{color:#fff;border:1.5px solid rgba(255,255,255,.5)}
  .sm-cta .btn.btn-ghost:hover{background:#fff;color:var(--navy)}
  .nav-links a.is-here{color:var(--coral-dark)}
  .sm-sec .prensa-wrap{margin-top:0;padding-top:0;border-top:0}
  @media (max-width:880px){
    .sm-hero{padding:50px 0 40px}.sm-sec,.sm-cta{padding:60px 0}
    .sm-grid{grid-template-columns:1fr}.sm-books{grid-template-columns:1fr;gap:30px}
    .sm-books img{max-width:280px;margin:0 auto}
  }
</style>
"""

contenido = f"""
  <section class="sm-hero">
    <div class="wrap bio-grid">
      <div class="bio-photo">
        <span class="tag">Dra. Nuria Roure</span>
        <img width="640" height="853" src="https://nuriaroure.com/wp-content/uploads/2026/05/nuria-portrait-suit.webp" alt="Dra. Nuria Roure, psicóloga experta en sueño">
      </div>
      <div>
        <span class="eyebrow">Sobre mí</span>
        <h1>¡Hola! Soy la <em>Dra. Nuria Roure</em></h1>
        <p class="lead">Una apasionada de la vida, de la salud y del bienestar. Si quieres vivir mejor, empieza por dormir mejor.</p>
        <p>Doctora en Psicología y experta en sueño, con más de <b>25 años</b> acompañando a personas que no descansan. Mi deseo es poner la <b>ciencia al servicio de las personas</b>.</p>
        <div class="bio-creds">
          <span>Doctora en Psicología · cum laude</span>
          <span>Somnologist · ESRS</span>
          <span>Profesora universitaria</span>
        </div>
        <div class="bio-ctas">
          <a class="btn" href="{TEST}" target="_blank" rel="noopener">Hacer el test de sueño gratis {FL}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="sm-sec alt">
    <div class="wrap">
      <div class="sm-head">
        <span class="eyebrow">Trayectoria</span>
        <h2>Ciencia y <em>experiencia</em> al servicio de tu descanso</h2>
        <p>Formación, investigación y años de consulta para ayudarte a dormir mejor.</p>
      </div>
      <div class="sm-grid">
        <div class="sm-card"><b>Doctora en Psicología</b><span>Licenciada en Psicología y doctorada en medicina del sueño. Mi tesis doctoral fue calificada <i>cum laude</i>.</span></div>
        <div class="sm-card"><b>Somnologist · ESRS</b><span>Primera psicóloga en España acreditada como especialista Somnologist por la European Sleep Research Society.</span></div>
        <div class="sm-card"><b>Sociedad Española de Sueño</b><span>Miembro de la SES desde hace más de 15 años y del Colegio Oficial de Psicólogos de Cataluña.</span></div>
        <div class="sm-card"><b>Profesora universitaria</b><span>Docente del máster en Psicología General Sanitaria de la Universidad de Lleida.</span></div>
        <div class="sm-card"><b>Investigación</b><span>Artículos en revistas científicas como <i>Annals of the American Thoracic Society</i>, <i>PLoS One</i>, <i>Archivos de Bronconeumología</i> y <i>Sleep Medicine</i>.</span></div>
        <div class="sm-card"><b>Divulgación</b><span>Cursos, conferencias y talleres para explicar por qué dormir bien es clave para la salud.</span></div>
      </div>
    </div>
  </section>

  <section class="sm-sec">
    <div class="wrap">
      <p class="sm-quote">«El sueño es nuestro <em>taller de reparación</em>: necesitamos que sea de calidad para recuperar lo que gastamos durante el día.»</p>
      <div class="sm-text">
        <span class="eyebrow">Cómo trabajo</span>
        <p>Llevo años estudiando todos los avances sobre los trastornos del sueño para estar siempre al día de las técnicas que pueden ayudar a mis pacientes: niños, adolescentes, adultos y personas mayores.</p>
        <p>Mi trabajo es <b>acompañarte en el cambio</b>: revisar tus hábitos de día y de noche y darte pautas y estrategias con evidencia científica para que tu sueño sea más reparador.</p>
        <p>Porque cuando duermes mejor, lo notas en todo: en tu energía, en tu estado de ánimo, en tu trabajo y en tus relaciones.</p>
        <div class="bio-ctas" style="margin-top:28px">
          <a class="btn" href="{PROG}" target="_blank" rel="noopener">Conocer mi programa {FL}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="sm-sec alt">
    <div class="wrap sm-books">
      <img src="https://nuriaroure.com/wp-content/uploads/2022/01/foto-Por-fin-duermo.jpg" alt="Libro Por Fin Duermo, de la Dra. Nuria Roure" loading="lazy">
      <div>
        <span class="eyebrow">Mis libros</span>
        <h2>Autora de <em>Por Fin Duermo</em></h2>
        <ul>
          <li><b>Por Fin Duermo</b> · bestseller n.º 1 en Amazon, ya en su 9.ª edición.</li>
          <li><b>Los hábitos del sueño</b></li>
          <li><b>Dormir no es gratis</b></li>
        </ul>
        <div class="bio-ctas">
          <a class="btn" href="{AMAZON}" target="_blank" rel="noopener">Comprar Por Fin Duermo en Amazon {FL}</a>
          <a class="btn btn-ghost" href="{EBOOK}" target="_blank" rel="noopener">Descargar el ebook gratis {FL}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="sm-sec">
    {prensa}
  </section>

  <section class="sm-cta">
    <div class="wrap">
      <h2>¿Por dónde empezamos?</h2>
      <p>Haz el test gratuito y descubre qué te está quitando el sueño. En 3 minutos tienes tu resultado y una guía en tu correo.</p>
      <div class="btns">
        <a class="btn" href="{TEST}" target="_blank" rel="noopener">Hacer el test gratis {FL}</a>
        <a class="btn btn-ghost" href="{PROG}" target="_blank" rel="noopener">Ver el programa {FL}</a>
      </div>
    </div>
  </section>

"""

def pagina(titulo, desc, contenido, aqui):
    a = arriba.replace('href="https://nuriaroure.com/' + aqui + '/">', 'href="https://nuriaroure.com/' + aqui + '/" class="is-here">') if aqui else arriba
    h = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8" />\n<title>' + titulo + '</title>\n<meta name="description" content="' + desc + '">\n'
         '<meta name="viewport" content="width=device-width,initial-scale=1">\n' + FUENTES + estilo + extra + '</head>\n<body>\n\n' + a + contenido + '  ' + pie + '\n</div>\n' + scripts + '\n</body>\n</html>\n')
    return sin_lazy(h)

open(os.path.join(D, 'sobre-mi.html'), 'w', encoding='utf-8').write(pagina(
    'Sobre mí · Dra. Nuria Roure, psicóloga experta en sueño',
    'Doctora en Psicología y experta en sueño. Primera psicóloga en España acreditada como Somnologist por la ESRS. Autora de Por Fin Duermo.',
    contenido, 'sobre-mi'))
print('ok')

# ---------- Meditación gratuita (formulario de Kliking «Descargar Meditación ORG», el mismo que la página actual) ----------
FORM = 'CVUL41Kzr7vhuPmjV8JU'
TEST_M = 'https://nr.nuriaroure.com/test-patrones?utm_source=meditacion&utm_medium=organic&utm_campaign=test'
extra_m = """<style>
  .md-hero{padding:80px 0 70px}
  .md-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;max-width:1140px;margin:0 auto}
  .md-hero .lead{font-size:19px;color:var(--muted);margin:0 0 24px;max-width:540px}
  .md-list{list-style:none;padding:0;margin:0 0 26px}
  .md-list li{position:relative;padding:8px 0 8px 32px;font-size:16.5px}
  .md-list li::before{content:"";position:absolute;left:0;top:13px;width:18px;height:18px;border-radius:50%;background:var(--coral) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23283249' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12l5 5L20 7'/%3E%3C/svg%3E") center/11px no-repeat}
  .md-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:30px 26px 18px;box-shadow:0 30px 60px -30px rgba(40,50,73,.35)}
  .md-card h3{font-family:'Oswald',sans-serif;font-weight:600;font-size:24px;margin:0 0 6px;color:var(--navy)}
  .md-card p{color:var(--muted);font-size:15px;margin:0 0 14px}
  .md-card iframe{width:100%;min-height:567px;border:0;display:block}
  .md-free{display:inline-block;background:var(--navy);color:var(--coral);font-family:'Oswald',sans-serif;font-weight:600;font-size:12px;letter-spacing:.2em;text-transform:uppercase;padding:6px 12px;border-radius:999px;margin-bottom:14px}
  .md-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1040px;margin:0 auto}
  .md-steps div{background:#fff;border:1px solid var(--line);border-radius:14px;padding:24px}
  .md-steps b{display:block;font-family:'Oswald',sans-serif;font-size:34px;color:var(--coral-dark);line-height:1;margin-bottom:10px}
  .md-steps span{color:var(--muted);font-size:15.5px}
  @media (max-width:880px){.md-hero{padding:40px 0}.md-grid{grid-template-columns:1fr;gap:30px}.md-steps{grid-template-columns:1fr}}
</style>
"""
contenido_m = f"""
  <section class="md-hero">
    <div class="wrap md-grid">
      <div>
        <span class="eyebrow">Meditación gratuita</span>
        <h1>Dormir una noche <em>del tirón</em></h1>
        <p class="lead">Una meditación guiada por la Dra. Nuria Roure para ayudarte a soltar el día, calmar la mente y preparar a tu cuerpo para dormir.</p>
        <ul class="md-list">
          <li>Guiada paso a paso, con la voz de Nuria.</li>
          <li>Para escucharla en la cama, justo antes de dormir.</li>
          <li>Te llega al momento a tu correo, gratis.</li>
        </ul>
        <div class="bio-creds">
          <span>Doctora en Psicología</span>
          <span>Somnologist · ESRS</span>
          <span>Autora de Por Fin Duermo</span>
        </div>
      </div>
      <div class="md-card" id="meditacion">
        <span class="md-free">100 % gratis</span>
        <h3>Recibe la meditación en tu correo</h3>
        <p>Déjame tus datos y te la envío ahora mismo.</p>
        <iframe src="https://link.kliking.io/widget/form/{FORM}" id="inline-{FORM}" data-layout="{{'id':'INLINE'}}" data-trigger-type="alwaysShow" data-trigger-value="" data-activation-type="alwaysActivated" data-activation-value="" data-deactivation-type="neverDeactivate" data-deactivation-value="" data-form-name="Descargar Meditación ORG" data-height="567" data-layout-iframe-id="inline-{FORM}" data-form-id="{FORM}" title="Descargar Meditación ORG"></iframe>
      </div>
    </div>
  </section>

  <section class="sm-sec alt">
    <div class="wrap">
      <div class="sm-head">
        <span class="eyebrow">Cómo usarla</span>
        <h2>Tres pasos <em>esta misma noche</em></h2>
      </div>
      <div class="md-steps">
        <div><b>1</b><span>Apaga pantallas un rato antes y baja la luz de la habitación.</span></div>
        <div><b>2</b><span>Túmbate, ponte cómoda y dale al play. No hace falta hacer nada más que escuchar.</span></div>
        <div><b>3</b><span>Repítela varias noches seguidas: los hábitos de sueño funcionan con constancia.</span></div>
      </div>
    </div>
  </section>

  <section class="sm-sec">
    <div class="wrap bio-grid">
      <div class="bio-photo">
        <span class="tag">Dra. Nuria Roure</span>
        <img width="640" height="853" src="https://nuriaroure.com/wp-content/uploads/2026/05/nuria-portrait-suit.webp" alt="Dra. Nuria Roure" loading="lazy">
      </div>
      <div>
        <span class="eyebrow">Quién te acompaña</span>
        <h2>Soy la <em>Dra. Nuria Roure</em></h2>
        <p>Psicóloga doctorada en medicina del sueño y primera psicóloga de España acreditada como <b>Somnologist por la European Sleep Research Society</b>.</p>
        <p>Más de 25 años acompañando a personas que no descansan. Autora de <b>Por Fin Duermo</b>, <i>Los hábitos del sueño</i> y <i>Dormir no es gratis</i>, y colaboradora habitual en medios de comunicación.</p>
        <div class="bio-ctas">
          <a class="btn" href="#meditacion">Quiero la meditación gratis {FL}</a>
          <a class="btn btn-ghost" href="https://nuriaroure.com/sobre-mi/">Más sobre mí {FL}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="sm-cta">
    <div class="wrap">
      <h2>¿Quieres saber qué te quita el sueño?</h2>
      <p>Además de la meditación, haz el test gratuito: en 3 minutos tienes tu resultado y una guía en tu correo.</p>
      <div class="btns">
        <a class="btn" href="{TEST_M}" target="_blank" rel="noopener">Hacer el test gratis {FL}</a>
      </div>
    </div>
  </section>

"""
KLIKING_JS = '<script src="https://link.kliking.io/js/form_embed.js"></script>\n'
h = pagina('Meditación gratuita para dormir · Dra. Nuria Roure',
           'Descarga gratis la meditación guiada de la Dra. Nuria Roure para dormir una noche del tirón. Te llega al momento a tu correo.',
           contenido_m, 'meditacion-gratuita')
h = h.replace('</head>', extra_m + '</head>', 1).replace('</body>', KLIKING_JS + '</body>', 1)
open(os.path.join(D, 'meditacion.html'), 'w', encoding='utf-8').write(h)
print('ok meditacion')

# ---------- Portada: el mismo HTML de siempre, solo con el menú común ----------
portada = re.sub(r'<ul class="nav-links" id="nrMenu">.*?</ul>', _cab.menu_html(), w, flags=re.S)
_c = portada.find('// Menú en móvil'); portada = portada[:portada.find('</html>', _c) + 7] + '\n'
CAB_PORTADA = open(os.path.join(D, 'portada-cabeza.html'), encoding='utf-8').read()
portada = CAB_PORTADA + portada
open(os.path.join(D, 'portada-menu-nuevo.html'), 'w', encoding='utf-8').write(portada)
print('ok portada')

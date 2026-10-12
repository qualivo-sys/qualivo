#!/usr/bin/env python3
"""VSL Qualivo · plantilla completa (16:9). Las escenas van atadas a frases del guion, no a segundos.

   python3 vsl_plantilla.py <bruto.mov> <palabras.json> <carpeta_trabajo> [solo_tiempos]

<palabras.json>: transcripción con tiempos por palabra del bruto (faster-whisper, [{w, s, e}]).
Con una grabación nueva: transcribirla, revisar RETOMAS (frases repetidas) y volver a lanzar.
Ver PLANTILLA.md. El bruto no va al repo (es público).
"""
import json, os, subprocess, sys, unicodedata
import imageio_ffmpeg

AQUI = os.path.dirname(os.path.abspath(__file__))
FF = imageio_ffmpeg.get_ffmpeg_exe()
MUSICA = os.path.join(AQUI, '../../../produccion/video-anuncios/musica6/h-urbano-norm.mp3')
REC = os.path.join(AQUI, 'recursos')
FPS = 30

# Tramos del bruto que se tiran: tomas repetidas. Revisar con cada grabación nueva.
RETOMAS = []
# Grabación del 12-oct: 1080p, cámara frontal en espejo (los libros se leen al revés), así que se voltea.
# Encuadres (w, h, x, y) sobre el bruto ya volteado; CARA = centro de la cara.
VOLTEAR = True
# El abierto deja fuera el libro negro del borde izquierdo.
ABIERTO, CERRADO, LADO = (1760, 990, 130, 0), (1440, 810, 170, 40), (1600, 900, 330, 20)
GOLPE = (1300, 731, 240, 30)   # golpe de zoom sobre la cara
CARA = (890, 380)
ZOOM_REG, ZOOM_K = (1760, 990, 130, 0), 1.15
# Correcciones de la transcripción para los subtítulos
ARREGLOS = {'Qualibo': 'Qualivo', 'Qualvo': 'Qualivo', 'Michael': 'Maikel', 'cuestan contacto': 'cuesta un contacto',
            'más lich': 'más leads', '1200 euros': '1.200 euros', 'trayendo las personas': 'atrayendo a las personas',
            'contratarle': 'contratarte', 'lits': 'leads', 'lids': 'leads', 'Michel': 'Maikel'}

def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    return ''.join(c for c in w if c.isalnum() and unicodedata.category(c) != 'Mn')

class Guion:
    """Busca frases en la transcripción y devuelve su tiempo en el bruto."""
    def __init__(self, palabras):
        self.W = [w for w in palabras if not any(a <= w['s'] < b for a, b in RETOMAS)]
        self.N = [norm(w['w']) for w in self.W]
    def idx(self, frase, desde=0):
        f = [norm(x) for x in frase.split()]
        for i in range(len(self.N) - len(f) + 1):
            if self.W[i]['s'] >= desde and self.N[i:i + len(f)] == f: return i, i + len(f) - 1
        raise SystemExit(f'no encuentro «{frase}» desde {desde}')
    def P(self, frase, desde=0): return self.W[self.idx(frase, desde)[0]]['s']
    def Pe(self, frase, desde=0): return self.W[self.idx(frase, desde)[1]]['e']

def silencios(bruto, trabajo):
    f = os.path.join(trabajo, 'silencios.txt')
    if not os.path.exists(f):
        r = subprocess.run([FF, '-i', bruto, '-vn', '-af', 'silencedetect=noise=-35dB:d=0.3', '-f', 'null', '-'], capture_output=True, text=True).stderr
        ini = [float(l.split('silence_start: ')[1].split()[0]) for l in r.splitlines() if 'silence_start' in l]
        fin = [float(l.split('silence_end: ')[1].split()[0]) for l in r.splitlines() if 'silence_end' in l]
        open(f, 'w').write('\n'.join(f'{a:.2f} {b:.2f}' for a, b in zip(ini, fin)))
    return [tuple(map(float, l.split())) for l in open(f) if l.strip()]

def tramos(sil, total):
    """Voz = lo que no es silencio, menos las retomas. Solo se recortan las pausas largas (>= 0,6 s) y se dejan
    en ~0,45 s: recortar cada respiración dejaba el vídeo entrecortado (Maikel, 12-oct)."""
    sil = [(a, b) for a, b in sil if b - a >= 0.6]
    voz, prev = [], 0.0
    for a, b in sil:
        if a > prev: voz.append((max(0, prev - 0.20), a + 0.25))
        prev = b
    voz.append((prev - 0.20, total))
    fus = []
    for a, b in voz:
        if fus and a <= fus[-1][1]: fus[-1] = (fus[-1][0], max(b, fus[-1][1]))
        else: fus.append((a, b))
    out = []
    for a, b in fus:
        for ra, rb in RETOMAS:
            if ra < b and rb > a:
                if a < ra: out.append((a, ra))
                a = max(a, rb)
        if b - a > 0.15: out.append((a, b))
    return [(round(a, 2), round(b, 2)) for a, b in out if b > a]

def construir(palabras, bruto, trabajo):
    g = Guion(palabras); P, Pe = g.P, g.Pe
    dur_bruto = float(subprocess.run([FF, '-i', bruto], capture_output=True, text=True).stderr.split('Duration: ')[1].split(',')[0].split(':')[-1]) \
        + 60 * int(subprocess.run([FF, '-i', bruto], capture_output=True, text=True).stderr.split('Duration: ')[1].split(':')[1])
    fin_voz = g.W[-1]['e']
    tr = tramos(silencios(bruto, trabajo), min(dur_bruto, fin_voz + 3.2))
    ests = []   # escenas (tiempos del bruto; se pasan al montaje al final)
    def E(**k): ests.append(k)
    it = lambda txt, t, ico='ok': {'txt': txt, 't': t, 'ico': ico}
    # Guion del 12-oct (Drive, «BLOQUE 1 — GANCHO»). Sin precio del Sprint: el guion ya no lo dice.
    # B1 · gancho
    E(tipo='clave', html='100 contactos… <i>¿y clientes?</i>', t0=P('de que te sirve'), t1=P('porque eso pasa'))
    E(tipo='tarjeta', t0=P('empresas que estan'), t1=P('pero luego preguntas'), k='Lo que celebran', ej='Ejemplo',
      items=[it('Leads a 3 o 4 €', P('a 3 o 4'), ''), it('«¡Qué barato!»', P('ostras'), 'ok')])
    E(tipo='lista', t0=P('pero luego preguntas'), t1=P('porque una cosa'), titulo='¿Cuántos se convierten <span style="color:#FF8A4C">en clientes?</span>', items=[])
    E(tipo='clave', coral=1, html='Formularios <i>≠ clientes</i>', t0=P('porque una cosa'), t1=P('y esa diferencia'))
    E(tipo='clave', html='Ahí trabajamos <i>en Qualivo</i>', t0=P('y esa diferencia'), t1=P('por cierto'))
    # B2 · problema
    E(tipo='tarjeta', t0=P('y llevo mas'), t1=P('y si algo'), k='Maikel Echevarría',
      items=[it('Más de 10 años en marketing y captación', P('y llevo mas')), it('Cientos de anuncios probados', P('probado cientos'))])
    E(tipo='clave', html='<s>Cuánto inviertes</s> <i>Cómo inviertes</i>', t0=P('y si algo'), t1=P('si tu anuncio'))
    E(tipo='tarjeta', t0=P('si tu anuncio'), t1=P('y ojo'), k='Dónde se va el dinero',
      items=[it('Un anuncio que habla a todo el mundo', P('si tu anuncio'), 'ko'), it('Un mensaje que no conecta', P('si tu mensaje'), 'ko'),
             it('Una página que no convence', P('una pagina que'), 'ko')])
    E(tipo='cadena', unico=1, titulo='Después del <i>formulario</i>', t0=P('que te dejen') - 0.3, t1=P('pero muchas empresas'),
      pasos=[{'txt': 'Datos', 't': P('que te dejen')}, {'txt': 'Responder', 't': P('hay que responder')}, {'txt': 'Cualificar', 't': P('cualificar')},
             {'txt': 'Seguimiento', 't': P('hacer seguimiento')}, {'txt': 'Venta', 't': P('que esa oportunidad')}])
    E(tipo='clave', html='«¿Cuánto cuesta <i>el lead?</i>»', t0=P('pero muchas empresas'), t1=P('y claro'))
    E(tipo='tarjeta', t0=P('y claro'), t1=P('pues no'), k='La respuesta de siempre', items=[it('¿Subimos el presupuesto?', P('el presupuesto'), 'mas')])
    E(tipo='clave', coral=1, html='Primero, entender <i>qué está fallando</i>', t0=P('pues no'), t1=P('y aqui es donde'))
    # B3 · cómo trabajamos
    E(tipo='clave', html='Aquí entra <i>Qualivo</i>', t0=P('y aqui es donde'), t1=P('nosotros no'))
    td = P('disenamos todo')
    E(tipo='cadena', t0=P('nosotros no'), t1=P('y como lo hacemos'), tachado={'txt': 'Poner anuncios y cruzar los dedos', 't': P('nosotros no')},
      pasos=[{'txt': x, 't': td + i * 0.5} for i, x in enumerate(['Negocio', 'Anuncios', 'Página', 'Seguimiento', 'Oportunidades'])])
    E(tipo='tarjeta', t0=P('primero entendemos'), t1=P('porque antes de'), k='Primero, tu negocio',
      items=[it('Quién es tu cliente ideal', P('quien es tu')), it('Qué necesita', P('que necesita')),
             it('Qué le preocupa', P('que le preocupa')), it('Por qué debería elegirte', P('y por que'))])
    E(tipo='clave', html='Estrategia <i>creativa</i>', t0=P('despues viene'), t1=P('probamos diferentes'))
    tc = P('probamos diferentes')
    E(tipo='ads3', t0=tc, t1=P('y aqui no vale'), mejor=1, tm=P('y que termina'),
      ads=[{'tag': 'Mensaje A', 'txt': '¿Pierdes pacientes después de darles precio?', 't': tc},
           {'tag': 'Mensaje B', 'txt': '¿Sabes qué anuncio te trae pacientes de verdad?', 't': tc + 0.7},
           {'tag': 'Mensaje C', 'txt': '¿Tu agenda tiene huecos que ya habías pagado?', 't': tc + 1.4}])
    E(tipo='clave', html='Probar · medir · <i>mejorar</i>', t0=P('hay que probar'), t1=P('despues trabajamos'))
    E(tipo='landing', t0=P('despues trabajamos'), t1=P('por eso conectamos'), h='Implantes en Sevilla', p='Valoración con el doctor en 30 minutos.',
      b1='Te explicamos el tratamiento antes de empezar', b2='Si no es para ti, te lo decimos', c1='¿Qué tratamiento buscas?', c2='¿Cuándo quieres empezar?',
      tf=P('pero si la persona'), dudas=[{'txt': '¿Qué ofreces?', 't': P('que no explica')}])
    E(tipo='cadena', unico=1, titulo='Todo <i>conectado</i>', t0=P('el anuncio', P('por eso conectamos')) - 0.3, t1=P('y por supuesto'),
      pasos=[{'txt': x, 't': P(f, P('por eso conectamos'))} for x, f in [('Anuncio', 'el anuncio'), ('Mensaje', 'el mensaje'), ('Página', 'la pagina'), ('Formulario', 'y el formulario')]])
    E(tipo='tarjeta', t0=P('y por supuesto'), t1=P('y ahora viene'), k='Lo que medimos',
      items=[it('Cuáles son buenos', P('cuales son buenos')), it('Cuáles avanzan', P('cuales avanzan')), it('Qué campañas traen oportunidades', P('y que campanas'))])
    # B4 · seguimiento e Intelligence (pantallas de la demo, datos simulados)
    E(tipo='tarjeta', t0=P('imagina que'), t1=P('hombre pues'), k='Imagina',
      items=[it('Llega alguien interesado', P('conseguimos atraer')), it('Deja sus datos', P('nos deja')), it('Respuesta: al día siguiente', P('y nadie'), 'ko')])
    E(tipo='clave', coral=1, html='Mal <i>empezamos</i>', t0=P('hombre pues'), t1=P('por eso tambien'))
    E(tipo='tarjeta', t0=P('podemos utilizar'), t1=P('pero tranquilo'), k='Para responder, cualificar y seguir',
      items=[it('WhatsApp', P('whatsapp')), it('Automatizaciones', P('automatizaciones')), it('Asistentes de voz con IA', P('asistentes de voz'))])
    E(tipo='clave', html='Tu equipo <i>sigue vendiendo</i>', t0=P('tu equipo'), t1=P('nosotros ayudamos'))
    E(tipo='tarjeta', t0=P('nosotros ayudamos'), t1=P('y para tener'), k='Nosotros ayudamos a que llegue',
      items=[it('A las conversaciones adecuadas', P('conversaciones adecuadas')), it('En el momento adecuado', P('en el momento')), it('Con más información', P('mucha mas informacion'))])
    E(tipo='clave', html='Qualivo <i>Intelligence</i>', t0=P('y para tener'), t1=P('aqui podemos'))
    E(tipo='pantalla', src='recursos/intel-resumen.jpg', t0=P('aqui podemos'), t1=P('y cuando tenemos'),
      focos=[{'t': P('aqui podemos')}, {'t': P('que oportunidades', P('aqui podemos')), 'x': 460, 'y': 860, 'w': 1420, 'h': 840, 'z': 1.55},
             {'t': P('donde se estan'), 'x': 1960, 'y': 860, 'w': 1060, 'h': 240, 'z': 1.8}])
    E(tipo='pantalla', src='recursos/intel-anuncios.jpg', t0=P('y cuando tenemos'), t1=P('de esta manera'),
      focos=[{'t': P('y cuando tenemos')}, {'t': P('podemos analizar'), 'x': 460, 'y': 140, 'w': 2580, 'h': 420, 'z': 1.35}])
    E(tipo='clave', html='<s>Intuición</s> <i>Información</i>', t0=P('de esta manera'), t1=P('y como empezamos'))
    # B5 · cómo empezamos
    E(tipo='clave', html='¿Cómo empezamos <i>a trabajar juntos?</i>', t0=P('y como empezamos'), t1=P('primero analizamos'))
    E(tipo='tarjeta', t0=P('primero analizamos'), t1=P('a partir de ahi'), k='Primero, tu situación',
      items=[it('Cómo captas clientes', P('que estas haciendo')), it('Qué resultados consigues', P('que resultados')), it('Qué pasa después', P('y que ocurre'))])
    E(tipo='tarjeta', t0=P('a partir de ahi'), t1=P('cada negocio'), k='¿Dónde intervenir?',
      items=[it('¿Los anuncios?', P('puede que necesites'), 'q'), it('¿La página?', P('puede que el problema'), 'q'), it('¿Lo que pasa después?', P('o puede que'), 'q')])
    E(tipo='clave', html='Cada negocio <i>es diferente</i>', t0=P('cada negocio'), t1=P('por eso no queremos'))
    E(tipo='clave', coral=1, html='<s>Un montón de herramientas</s>', t0=P('por eso no queremos'), t1=P('queremos disenar'))
    E(tipo='tarjeta', t0=P('queremos disenar'), t1=P('asi que si'), k='Una estrategia para tu empresa',
      items=[it('Diseñarla', P('queremos disenar')), it('Ponerla a funcionar', P('ponerla a')), it('Mejorarla con datos', P('y mejorarla'))])
    # B6 · cierre
    E(tipo='cta', t0=P('reserva una sesion'), t1=P('sin discursos'), titulo='Reserva una sesión con nosotros', pie='Analizamos tu captación contigo',
      items=[it('Cómo atraes clientes', P('como estas atrayendo')), it('Qué pasa después', P('que pasa despues')), it('Dónde puedes mejorar', P('y donde tienes'))])
    E(tipo='tarjeta', t0=P('sin discursos'), t1=P('que si fuera'), k='Sin…',
      items=[it('Discursos raros', P('sin discursos'), 'ko'), it('IA porque sí', P('sin venderte'), 'ko'), it('Prometer ×10 en una semana', P('y sin prometerte'), 'ko')])
    E(tipo='clave', html='Entender tu negocio <i>y ayudarte a crecer</i>', t0=P('lo que si vamos'), t1=P('asi que nada'))
    t_fin = P('haz clic')   # la tarjeta final con el botón entra cuando lo dice
    E(tipo='fin', t0=t_fin, t1=1e9, titulo='Descubre dónde puedes mejorar tu captación', boton='Reserva una sesión de diagnóstico')
    # Variedad (Maikel, 12-oct: «todo muy igual»): cada rótulo entra distinto; los más cortos van a pantalla grande 2 s.
    ESTILO = {'Formularios': 'grande', 'Aquí entra': 'grande', 'Mal ': 'grande', 'Qualivo <i>Intelligence': 'grande', '¿Cómo empezamos': 'grande',
              'Ahí trabajamos': 'barrido', '«¿Cuánto cuesta': 'barrido', 'Estrategia': 'barrido', 'Entender tu': 'barrido',
              'Primero, entender': 'izq', 'Tu equipo': 'izq', 'Cada negocio': 'izq'}
    for s in ests:
        if s['tipo'] != 'clave': continue
        est = next((v for k, v in ESTILO.items() if s['html'].startswith(k)), 'pop')
        if est == 'grande': s['tipo'] = 'grande'; s['t1'] = min(s['t1'], s['t0'] + 2.2)
        else: s['var'] = est
    # Capítulos: rótulo arriba a la izquierda (sin cortina: cortaba y volvía al mismo plano). El 02 sobraba («soy Maikel»).
    for n, txt, f in [('03', 'Cómo trabajamos', 'y aqui es donde'), ('04', 'Seguimiento e Intelligence', 'y ahora viene'),
                      ('05', 'Cómo empezamos', 'y como empezamos'), ('06', 'Tu siguiente paso', 'asi que si')]:
        E(tipo='bloque', n=n, txt=txt, t0=P(f) - 0.25, t1=P(f) + 3.2)
    # Las pantallas completas tapan a Maikel: se quitan 2,5 s después de su último elemento.
    for s in ests:
        if s['tipo'] in ('lista', 'cadena', 'ads3', 'landing', 'pantalla'):
            ts = [x['t'] for k in ('items', 'pasos', 'ads', 'dudas', 'focos') for x in s.get(k, [])] + [s.get(k, s['t0']) for k in ('t0', 'tm', 'tf', 'tb')]
            s['t1'] = min(s['t1'], max(ts) + 2.5)
    nombre = (P('por cierto') + 0.8, P('por cierto') + 5.3)
    # Planos de apoyo de Kling (12-oct), sin pantallas con texto: (desde, hasta, clip, desenfoque, segundo de inicio del clip)
    pc = P('cada negocio')
    ap = [[P('si luego no'), P('porque eso pasa'), 'k-embudo.mp4', 0, 0.3],
          [P('pues acabas'), P('y ojo'), 'k-sofa.mp4', 0, 1.2],
          [P('simplemente cruzar'), P('sino que'), 'k-dedos.mp4', 0, 0.8],
          [P('despues viene'), P('probamos diferentes'), 'k-creativos.mp4', 0, 0],
          [P('y nadie le'), P('hombre pues'), 'k-movil-noche.mp4', 0, 0],
          [P('tu equipo'), P('nosotros ayudamos'), 'k-comercial-llamada.mp4', 0, 0],
          [pc, pc + 1.4, 'k-clinica.mp4', 0, 1.0], [pc + 1.4, pc + 2.8, 'k-taller.mp4', 0, 0.6],
          [P('estariamos todos'), P('lo que si vamos'), 'k-mojitos.mp4', 0, 0]]
    # Hilo de cámara (Maikel, 12-oct: «no vuelvas a la anterior de golpe ni te quedes en medio»):
    # - lo que tapa a Maikel (pantalla completa o plano de Kling) se junta si entre medias solo quedaría <2,5 s de cara;
    # - la cámara solo cambia en un corte de pausa o cuando entra o sale un gráfico, y al volver de un gráfico nunca
    #   vuelve al mismo encuadre de antes; con tarjeta, encuadre de lado durante toda la tarjeta.
    HUECO = 2.5
    TAPA = ('lista', 'cadena', 'ads3', 'ads2', 'landing', 'pantalla', 'grande', 'barras', 'crono', 'feed', 'flujo')
    ocultos = sorted([[x['t0'], x['t1'], x] for x in ests if x['tipo'] in TAPA] + [[x[0], x[1], x] for x in ap], key=lambda e: e[0])
    for e1, e2 in zip(ocultos, ocultos[1:]):
        if 0 < e2[0] - e1[1] < HUECO:
            if isinstance(e1[2], dict): e1[2]['t1'] = e2[0]
            else: e1[2][1] = e2[0]
            e1[1] = e2[0]
    apoyos = [tuple(x) for x in ap]
    # tarjetas: si entre una tarjeta y un gráfico solo quedaría <2,5 s de cara, la tarjeta se estira hasta tocarlo
    tarj = sorted([x for x in ests if x['tipo'] in ('tarjeta', 'cta')], key=lambda x: x['t0'])
    for c in tarj:
        antes = [e[1] for e in ocultos if c['t0'] - HUECO < e[1] <= c['t0']]
        if antes: c['t0'] = max(antes)
        despues = [e[0] for e in ocultos if c['t1'] <= e[0] < c['t1'] + HUECO]
        if despues: c['t1'] = min(despues)
    for c1, c2 in zip(tarj, tarj[1:]):
        if 0 < c2['t0'] - c1['t1'] < HUECO: c1['t1'] = c2['t0']
    def juntar(iv):
        out = []
        for a, b in sorted(iv):
            if out and a - out[-1][1] < HUECO: out[-1][1] = max(out[-1][1], b)
            else: out.append([a, b])
        return out
    OC = juntar([[e[0], e[1]] for e in ocultos])
    CA = juntar([[x['t0'], x['t1']] for x in ests if x['tipo'] in ('tarjeta', 'cta')])
    t_fin_raw = t_fin
    def estado(m):
        if m >= t_fin_raw: return 'H'
        if any(a <= m < b for a, b in OC): return 'H'
        if any(a <= m < b for a, b in CA): return 'C'
        return 'V'
    bordes = sorted({x for iv in OC + CA for x in iv})
    gancho_fin = P('si luego no')   # el zoom del gancho acaba donde entra el primer plano de Kling
    planos, ult_vis, previo, desde = [], 'cerrado', None, 0.0
    for a, b in tr:
        cs = [a] + [x for x in bordes if a < x < b] + [b]
        for pa, pb in zip(cs, cs[1:]):
            if pb - pa < 0.02: continue
            st = estado((pa + pb) / 2)
            if st == 'C': enc = 'lado'
            elif st == 'H': enc = planos[-1][2] if planos else 'abierto'
            elif (pa + pb) / 2 < gancho_fin: enc = 'zoom'
            elif previo != 'V' or (pa - desde > 6 and min([x for x in bordes if x > pa] + [1e9]) - pa > HUECO):
                enc = 'abierto' if ult_vis != 'abierto' else 'cerrado'
            else: enc = ult_vis
            if st == 'V' and (previo != 'V' or enc != ult_vis): desde = pa
            if st == 'V': ult_vis = enc if enc != 'zoom' else 'cerrado'
            previo = st
            planos.append((pa, pb, enc))
    # los gráficos que tapan o piden encuadre de lado entran y salen justo en un cambio de plano (si no, se ve el salto)
    lim = sorted({x for a, b, _ in planos for x in (a, b)})
    for x in ests:
        if x['tipo'] in TAPA + ('tarjeta', 'cta'):
            for k in ('t0', 't1'):
                if x[k] < 1e8:
                    c = min(lim, key=lambda y: abs(y - x[k]))
                    if abs(c - x[k]) < 0.35: x[k] = c
    def T(x):
        o = 0
        for a, b, _ in planos:
            if x < a: return round(o, 3)
            if x <= b: return round(o + x - a, 3)
            o += b - a
        return round(o, 3)
    total = round(sum(b - a for a, b, _ in planos), 2)
    for s in ests:
        for k in ('t0', 't1', 'ta', 'tb', 'tm', 'tf'):
            if k in s: s[k] = min(T(s[k]), total + 1) if s[k] < 1e8 else total + 1
        for lst in ('items', 'pasos', 'ads', 'dudas', 'barras', 'focos'):
            for x in s.get(lst, []): x['t'] = T(x['t'])
        if 'tachado' in s: s['tachado']['t'] = T(s['tachado']['t'])
    # subtítulos: trozos de frase, con las correcciones; fuera durante la tarjeta final
    subs, cur = [], []
    for w in g.W:
        if not any(a <= w['s'] < b for a, b, _ in planos): continue
        cur.append(w)
        if w['w'][-1] in '.?,' and len(cur) >= 4 or len(cur) >= 9 or cur[-1]['e'] - cur[0]['s'] > 3.4:
            subs.append(cur); cur = []
    if cur: subs.append(cur)
    SUBS = []
    for c in subs:
        txt = ' '.join(w['w'] for w in c)
        for a, b in ARREGLOS.items(): txt = txt.replace(a, b)
        t0, t1 = T(c[0]['s']), T(c[-1]['e']) + 0.25
        if t0 < T(t_fin): SUBS.append([t0, min(t1, T(t_fin)), txt])
    for i in range(len(SUBS) - 1): SUBS[i][1] = min(SUBS[i][1], SUBS[i + 1][0])
    TL = {'esc': ests, 'subs': SUBS, 'nombre': [T(nombre[0]), T(nombre[1])]}
    open(os.path.join(AQUI, 'tiempos-plantilla.js'), 'w').write('window.TL=' + json.dumps(TL, ensure_ascii=False) + ';\n')
    return planos, total, apoyos

def zoom_f(d, off, D, k1=ZOOM_K):
    K = f"(1+({k1}-1)*min((t+{off:.3f})/{D:.3f},1))"
    reg = ZOOM_REG; fx, fy = (CARA[0] - reg[2]) / reg[0], CARA[1] / reg[1]
    return (f"{'hflip,' if VOLTEAR else ''}crop={reg[0]}:{reg[1]}:{reg[2]}:{reg[3]},scale=w='trunc(1920*{K}/2)*2':h='trunc(1080*{K}/2)*2':eval=frame:flags=bicubic,"
            f"crop=1920:1080:x='max(0,min(iw-1920,{fx:.4f}*iw-960))':y='max(0,min(ih-1080,{fy:.4f}*ih-432))'")

def base(bruto, trabajo, planos, total, apoyos=()):
    """Imagen por trozos (un ffmpeg por plano, con número exacto de fotogramas) y audio aparte; luego se juntan.
    Hacerlo en un solo grafo con el 4K agotaba la memoria."""
    from concurrent.futures import ThreadPoolExecutor
    zs = [(a, b) for a, b, e in planos if e == 'zoom']; z0 = zs[0][0] if zs else 0; D = (zs[-1][1] - z0) if zs else 1
    tz = os.path.join(trabajo, 'trozos'); os.makedirs(tz, exist_ok=True)
    trabajos, o = [], 0.0
    for a, b, enc in planos:
        cortes = sorted({a, b} | {x for wa, wb, *_ in apoyos for x in (wa, wb) if a < x < b})
        for pa, pb in zip(cortes, cortes[1:]):
            f0, f1 = round(o * FPS), round((o + pb - pa) * FPS); o += pb - pa
            if f1 <= f0: continue
            ap = next((x for x in apoyos if x[0] <= (pa + pb) / 2 < x[1]), None)
            if ap:
                wa, wb, c, blur, off = ap
                ent = ['-stream_loop', '-1', '-ss', f'{off + pa - wa:.3f}', '-i', os.path.join(REC, c)]  # en bucle: los clips de Kling duran 5 s
                vf = 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080' + (f',gblur=sigma={blur}' if blur else '')
            else:
                ent = ['-ss', f'{pa:.3f}', '-i', bruto]
                if enc == 'zoom': vf = zoom_f(pb - pa, pa - z0, D)
                else:
                    w, h, x, y = {'abierto': ABIERTO, 'cerrado': CERRADO, 'lado': LADO, 'golpe': GOLPE}[enc]; vf = f"{'hflip,' if VOLTEAR else ''}crop={w}:{h}:{x}:{y},scale=1920:1080:flags=lanczos"
            trabajos.append((len(trabajos), ent, f'{vf},fps={FPS},setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=1', f1 - f0))
    def hacer(tj):
        i, ent, vf, n = tj
        if os.environ.get('REUSAR') == '1' and os.path.getsize(f'{tz}/t{i:04d}.mp4') > 20000 if os.path.exists(f'{tz}/t{i:04d}.mp4') else False: return
        subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', *ent, '-vf', vf, '-frames:v', str(n), '-an', '-c:v', 'libx264',
                        '-crf', '18', '-preset', 'fast', '-r', str(FPS), f'{tz}/t{i:04d}.mp4'], check=True, stdin=subprocess.DEVNULL)
    with ThreadPoolExecutor(3) as ex: list(ex.map(hacer, trabajos))
    open(f'{tz}/lista.txt', 'w').write(''.join(f"file 't{i:04d}.mp4'\n" for i, *_ in trabajos))
    subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', f'{tz}/lista.txt', '-c', 'copy',
                    f'{trabajo}/imagen.mp4'], check=True, stdin=subprocess.DEVNULL)
    # audio: voz original con limpieza suave y algo más de volumen; música H muy baja
    # el audio va por tramos continuos (un cambio de encuadre sin corte no lleva fundido)
    tramos_a = []
    for a, b, _ in planos:
        if tramos_a and abs(a - tramos_a[-1][1]) < 1e-6: tramos_a[-1][1] = b
        else: tramos_a.append([a, b])
    fil = [f'[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={max(0, b - a - 0.03):.3f}:d=0.03[a{i}];'
           for i, (a, b) in enumerate(tramos_a)]
    fil.append(''.join(f'[a{i}]' for i in range(len(tramos_a))) + f'concat=n={len(tramos_a)}:v=0:a=1[ab];')
    fil.append('[ab]highpass=f=80,afftdn=nf=-30,acompressor=threshold=0.1:ratio=2.5:attack=10:release=200,'
               'aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[voz][vsc];')
    fil.append(f'[1:a]aformat=sample_rates=48000:channel_layouts=stereo,aloop=loop=-1:size=2e9,atrim=0:{total},asetpts=PTS-STARTPTS,'
               f'afade=t=in:d=0.8,afade=t=out:st={total - 2.5}:d=2.5,volume=0.18[m];'
               '[m][vsc]sidechaincompress=threshold=0.03:ratio=5:attack=30:release=600[md];'
               '[voz][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=8,aresample=48000[a]')
    open(f'{trabajo}/filtro_audio.txt', 'w').write(''.join(fil))
    subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', '-vn', '-i', bruto, '-i', MUSICA, '-filter_complex_script', f'{trabajo}/filtro_audio.txt',
                    '-map', '[a]', '-c:a', 'aac', '-b:a', '192k', f'{trabajo}/audio.m4a'], check=True, stdin=subprocess.DEVNULL)
    subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', '-i', f'{trabajo}/imagen.mp4', '-i', f'{trabajo}/audio.m4a', '-c', 'copy',
                    '-shortest', f'{trabajo}/base_full.mp4'], check=True, stdin=subprocess.DEVNULL)

def capas(trabajo, total, partes=3):
    n = int(round(FPS * total)); os.makedirs(f'{trabajo}/capasF', exist_ok=True)
    js = """const { chromium } = require('playwright');
(async () => { const [a, b, dir] = [+process.argv[2], +process.argv[3], process.argv[4]];
  const br = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}); const p = await br.newPage({viewport:{width:1920,height:1080}});
  await p.goto('file://%s/capas_full.html',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
  for (let i = a; i < b; i++) { await p.evaluate(t => window.setT(t), i / %d);
    await p.screenshot({path: dir + '/f' + String(i).padStart(5, '0') + '.png', omitBackground: true}); }
  await br.close(); })();""" % (AQUI, FPS)
    open(f'{trabajo}/grabaF.js', 'w').write(js)
    np = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
    ps = [subprocess.Popen(['node', f'{trabajo}/grabaF.js', str(i * n // partes), str((i + 1) * n // partes), f'{trabajo}/capasF'],
                           env=dict(os.environ, NODE_PATH=np)) for i in range(partes)]
    for p in ps: p.wait()

def final(trabajo, total):
    subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', '-i', f'{trabajo}/base_full.mp4', '-framerate', str(FPS),
                    '-i', f'{trabajo}/capasF/f%05d.png', '-filter_complex', '[0:v][1:v]overlay=0:0[v]', '-map', '[v]', '-map', '0:a',
                    '-c:v', 'libx264', '-crf', '19', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-t', str(total),
                    f'{trabajo}/VSL_Qualivo_plantilla.mp4'], check=True, stdin=subprocess.DEVNULL)
    print('ok', f'{trabajo}/VSL_Qualivo_plantilla.mp4')

if __name__ == '__main__':
    bruto, pal, trabajo = sys.argv[1:4]
    planos, total, apoyos = construir(json.load(open(pal)), bruto, trabajo)
    print('planos', len(planos), 'duración', total)
    if len(sys.argv) > 4: sys.exit()
    if os.environ.get('SIN_CAPAS') != '1': capas(trabajo, total)
    base(bruto, trabajo, planos, total, apoyos); final(trabajo, total)

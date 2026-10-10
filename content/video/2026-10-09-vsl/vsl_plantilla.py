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

# Tramos del bruto que se tiran: tomas repetidas (grabación del 9-oct). Revisar con cada grabación nueva.
RETOMAS = [(12.90, 15.60), (161.50, 163.15)]
# Encuadres sobre el 4K girado (3840x2160)
ABIERTO, CERRADO, LADO = (3200, 1800, 640, 0), (2240, 1260, 1160, 90), (2400, 1350, 1440, 0)
CARA = (2280, 570)
# Correcciones de la transcripción para los subtítulos
ARREGLOS = {'Qualibo': 'Qualivo', 'Qualvo': 'Qualivo', 'Michael': 'Maikel', 'cuestan contacto': 'cuesta un contacto',
            'más lich': 'más leads', '1200 euros': '1.200 euros', 'trayendo las personas': 'atrayendo a las personas',
            'contratarle': 'contratarte'}

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
    """Voz = lo que no es silencio, con un poco de aire; menos las retomas."""
    voz, prev = [], 0.0
    for a, b in sil:
        if a > prev: voz.append((max(0, prev - 0.10), a + 0.14))
        prev = b
    voz.append((prev - 0.10, total))
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
    # B1 · gancho
    E(tipo='clave', html='Miles de € <i>en publicidad</i>', t0=P('miles de euros'), t1=P('y siguen'))
    E(tipo='tarjeta', t0=P('saben cuanto'), t1=P('pero no saben'), k='Lo que sí saben', ej='Datos de ejemplo',
      items=[it('Coste por lead · 12 €', P('saben cuanto'), ''), it('Formularios · 340', P('cuantos formularios'), ''),
             it('Inversión · 4.100 €', P('cuanto dinero'), '')])
    E(tipo='lista', t0=P('pero no saben'), t1=P('y ahi esta'), titulo='¿Cuántos se convierten <span style="color:#FF8A4C">en clientes?</span>', items=[], ej='Datos de ejemplo')
    E(tipo='feed', t0=P('un anuncio que habla'), t1=P('termina trayendo'))
    E(tipo='flujo', t0=P('termina trayendo'), t1=P('soy maikel'))
    E(tipo='clave', coral=1, html='Contactos <i>≠ oportunidades</i>', t0=P('y conseguir muchos'), t1=P('soy maikel'))
    # B2 · problema
    E(tipo='ads2', t0=P('lanzar anuncios'), ta=P('lanzar anuncios'), tb=P('personas adecuadas', 42), t1=P('porque puedes'))
    E(tipo='tarjeta', t0=P('porque puedes'), t1=P('y si solamente'), k='Ejemplo ilustrativo',
      items=[it('Campaña A · 5 € / lead · ¿clientes?', P('cinco euros'), 'q'), it('Campaña B · 20 € / lead · ¿clientes?', P('veinte euros'), 'q')])
    E(tipo='lista', t0=P('y si solamente'), t1=P('ademas muchas'), titulo='¿Cuál genera <span style="color:#27BDB1">mejores clientes?</span>', items=[], ej='Ejemplo ilustrativo')
    E(tipo='lista', t0=P('crean anuncios'), t1=P('despues se preguntan'), titulo='El otro error',
      items=[it('Anuncios genéricos', P('crean anuncios'), 'ko'), it('La misma página para todos', P('envian a todo'), 'ko'),
             it('Formularios que no filtran', P('utilizan formularios'), 'ko')])
    E(tipo='tarjeta', t0=P('y cuando las ventas'), t1=P('pero invertir'), k='La respuesta de siempre',
      items=[it('Más presupuesto', P('mas presupuesto'), 'mas'), it('Más anuncios', P('mas anuncios'), 'mas'), it('Más contactos', P('mas contactos'), 'mas')])
    E(tipo='clave', coral=1, html='Más dinero <i>no arregla el problema</i>', t0=P('pero invertir'), t1=P('por eso en'))
    # B3 · cómo trabajamos
    E(tipo='clave', html='En Qualivo trabajamos <i>de otra manera</i>', t0=P('por eso en'), t1=P('no somos'))
    td = P('disenamos y gestionamos')
    E(tipo='cadena', t0=P('no somos'), t1=P('y todo empieza'), tachado={'txt': 'Una agencia que gestiona anuncios', 't': P('una agencia')},
      pasos=[{'txt': x, 't': td + i * 0.55} for i, x in enumerate(['Estrategia', 'Anuncios', 'Landing', 'Cualificación', 'Seguimiento', 'Venta'])])
    E(tipo='tarjeta', t0=P('y todo empieza'), t1=P('a partir de ahi'), k='Todo empieza entendiendo tu negocio',
      items=[it('Quién es tu cliente ideal', P('quien es tu')), it('Qué problema necesita resolver', P('que problema')),
             it('Qué le preocupa antes de contratarte', P('que le preocupa')), it('Qué mensaje hace que se interese', P('que mensaje'))])
    E(tipo='clave', html='Estrategia <i>publicitaria</i>', t0=P('a partir de ahi'), t1=P('creamos anuncios'))
    tc = P('creamos anuncios')
    E(tipo='ads3', t0=tc, t1=P('pero no nos quedamos'), mejor=1, tm=P('y optimizamos'),
      ads=[{'tag': 'Mensaje A', 'txt': '¿Pierdes pacientes después de darles precio?', 't': tc},
           {'tag': 'Mensaje B', 'txt': '¿Sabes qué anuncio te trae pacientes de verdad?', 't': tc + 0.7},
           {'tag': 'Mensaje C', 'txt': '¿Tu agenda tiene huecos que ya habías pagado?', 't': tc + 1.4}])
    E(tipo='landing', t0=P('pero no nos quedamos'), t1=P('y despues conectamos'), h='Implantes en Sevilla', p='Valoración con el doctor en 30 minutos.',
      b1='Te explicamos el tratamiento antes de empezar', b2='Si no es para ti, te lo decimos', c1='¿Qué tratamiento buscas?', c2='¿Cuándo quieres empezar?',
      tf=P('y los formularios'), dudas=[{'txt': '¿Qué ofreces?', 't': P('no entiende')}, {'txt': '¿Por qué tú?', 't': P('que deberia elegirte')}])
    E(tipo='cadena', unico=1, t0=P('y despues conectamos'), t1=P('podemos utilizar'),
      pasos=[{'txt': 'Solicitud', 't': P('y despues conectamos') + 0.3}, {'txt': 'Atención', 't': P('reciban atencion')},
             {'txt': 'Cualificación', 't': P('se cualifiquen')}, {'txt': 'Seguimiento', 't': P('seguimiento adecuado')}])
    E(tipo='tarjeta', t0=P('podemos utilizar'), t1=P('pero la tecnologia'), k='Solo cuando aportan valor',
      items=[it('WhatsApp', P('whatsapp')), it('Automatizaciones', P('automatizaciones')), it('Asistente de voz con IA', P('asistente de voz'))])
    E(tipo='clave', html='La tecnología <i>no es el objetivo</i>', t0=P('pero la tecnologia'), t1=P('objetivo es conseguir'))
    E(tipo='clave', html='Mejores oportunidades, <i>mejor aprovechadas</i>', t0=P('objetivo es conseguir'), t1=P('y para tener'))
    # B4 · Intelligence (pantallas reales de la demo, datos simulados)
    E(tipo='clave', html='Qualivo <i>Intelligence</i>', t0=P('utilizamos qualibo'), t1=P('aqui podemos'))
    E(tipo='pantalla', src='recursos/intel-resumen.jpg', t0=P('aqui podemos'), t1=P('por ejemplo imagina'),
      focos=[{'t': P('aqui podemos')}, {'t': P('cuales necesitan'), 'x': 460, 'y': 860, 'w': 1420, 'h': 840, 'z': 1.55},
             {'t': P('en que parte'), 'x': 1960, 'y': 860, 'w': 1060, 'h': 240, 'z': 1.8}])
    E(tipo='barras', t0=P('por ejemplo imagina'), t1=P('antes de aumentar'), titulo='Una campaña', ej='Ejemplo',
      barras=[{'txt': 'Solicitudes', 'val': '100', 'pct': 100, 't': P('genera 100')}, {'txt': 'Conversaciones comerciales', 'val': '20', 'pct': 20, 't': P('solamente 20')}])
    E(tipo='lista', t0=P('antes de aumentar'), t1=P('esta informacion'), titulo='Antes de subir el presupuesto',
      items=[it('¿Público equivocado?', P('estamos atrayendo al'), 'q'), it('¿Curiosidad sin intención real?', P('el mensaje genera'), 'q'),
             it('¿Se pierden después del formulario?', P('o estamos perdiendo'), 'q')])
    E(tipo='pantalla', src='recursos/intel-oportunidades.jpg', t0=P('esta informacion'), t1=P('y cuando disponemos'),
      focos=[{'t': P('esta informacion')}, {'t': P('esta informacion') + 0.8, 'x': 2100, 'y': 560, 'w': 940, 'h': 1040, 'z': 1.5}])
    E(tipo='pantalla', src='recursos/intel-anuncios.jpg', t0=P('y cuando disponemos'), t1=P('y como empezamos'),
      focos=[{'t': P('y cuando disponemos')}, {'t': P('y cuando disponemos') + 0.6, 'x': 460, 'y': 140, 'w': 2580, 'h': 420, 'z': 1.35},
             {'t': P('queremos entender que'), 'x': 460, 'y': 620, 'w': 2580, 'h': 760, 'z': 1.4}])
    # B5 · sprint
    E(tipo='clave', html='¿Cómo empezamos <i>a trabajar juntos?</i>', t0=P('y como empezamos'), t1=P('con un sprint'))
    E(tipo='tarjeta', t0=P('con un sprint'), t1=P('primero analizamos'), k='Para empezar', grande='Sprint de 30 días<small>Desde 1.200 € + IVA</small>')
    E(tipo='crono', t0=P('primero analizamos'), t1=P('no te vamos'), titulo='Sprint de 30 días', precio='Desde 1.200 € + IVA',
      pasos=[{'sem': 'SEMANA 1', 'txt': 'Diagnóstico de tu captación', 't': P('primero analizamos')},
             {'sem': 'SEMANA 2', 'txt': 'Primera mejora en marcha', 't': P('despues identificamos')},
             {'sem': 'SEMANA 3', 'txt': 'Medimos lo que ocurre', 't': P('medimos lo que')},
             {'sem': 'SEMANA 4', 'txt': 'Decidimos los siguientes pasos', 't': P('y al finalizar')}])
    E(tipo='clave', coral=1, html='<s>Duplicar tus ventas en 30 días</s>', t0=P('no te vamos'), t1=P('lo que si'))
    E(tipo='tarjeta', t0=P('lo que si'), t1=P('y a partir de ahi podemos'), k='Lo que sí te llevas',
      items=[it('Un diagnóstico', P('un diagnostico')), it('Una mejora implementada', P('una mejora implementada')), it('Datos para decidir mejor', P('y datos para'))])
    # B6 · cierre
    E(tipo='cta', t0=P('reserva una sesion'), t1=P('trabajemos juntos'), titulo='Reserva una sesión de 30 minutos', pie='Te llevas un plan escrito con los siguientes pasos',
      items=[it('Cómo captas clientes', P('como estas captando')), it('Qué pasa después', P('que sucede despues')), it('Dónde puedes mejorar', P('donde tienes'))])
    E(tipo='clave', html='No se trata de conseguir <i>más leads</i>', t0=P('porque no se trata'), t1=P('se trata de atraer'))
    E(tipo='clave', html='Las personas adecuadas, <i>más clientes</i>', t0=P('se trata de atraer'), t1=P('nos vemos dentro'))
    t_fin = Pe('nos vemos dentro') + 0.5
    E(tipo='fin', t0=t_fin, t1=1e9, titulo='Descubre dónde puedes mejorar tu captación', boton='Reserva una sesión de diagnóstico')
    nombre = (P('soy maikel'), P('soy maikel') + 4.5)
    apoyos = [(P('y siguen'), P('saben cuanto'), 'broll-panel.mp4', 7, 0), (P('despues se preguntan'), P('y cuando las ventas'), 'broll-comercial.mp4', 3, 0),
              (P('a partir de ahi'), P('creamos anuncios'), 'broll-panel.mp4', 7, 1.2)]
    # encuadres: «de lado» cuando hay tarjeta; zoom en el gancho; si no, abierto y cerrado alternos
    forz = [(s['t0'], s['t1']) for s in ests if s['tipo'] in ('tarjeta', 'cta')]
    gancho = (tr[0][0], P('saben cuanto'))
    planos, sig, acum = [], 0, 0
    for a, b in tr:
        m = (a + b) / 2
        if gancho[0] <= m < gancho[1]: enc = 'zoom'
        elif any(x <= m < y for x, y in forz): enc = 'lado'
        else:
            if acum > 3.5: sig ^= 1; acum = 0
            enc = ('abierto', 'cerrado')[sig]; acum += b - a
        planos.append((a, b, enc))
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

def zoom_f(d, off, D, k1=1.25):
    K = f"(1+({k1}-1)*min((t+{off:.3f})/{D:.3f},1))"
    reg = (3300, 1856, 540, 0); fx, fy = (CARA[0] - reg[2]) / reg[0], CARA[1] / reg[1]
    return (f"crop={reg[0]}:{reg[1]}:{reg[2]}:{reg[3]},scale=w='trunc(1920*{K}/2)*2':h='trunc(1080*{K}/2)*2':eval=frame:flags=bicubic,"
            f"crop=1920:1080:x='max(0,min(iw-1920,{fx:.4f}*iw-960))':y='max(0,min(ih-1080,{fy:.4f}*ih-432))'")

def base(bruto, trabajo, planos, total, apoyos=()):
    """Vídeo con cortes, encuadres y planos de apoyo ya dentro (como un plano más; superponerlos al final atascaba ffmpeg)."""
    fil, vpz, apz = [], [], []
    zs = [(a, b) for a, b, e in planos if e == 'zoom']; z0 = zs[0][0] if zs else 0; D = (zs[-1][1] - z0) if zs else 1
    ent = ['-i', bruto, '-i', MUSICA]
    for c in sorted({c for _, _, c, _, _ in apoyos}): ent += ['-i', os.path.join(REC, c)]
    idx = {c: 2 + i for i, c in enumerate(sorted({c for _, _, c, _, _ in apoyos}))}
    k = 0
    for i, (a, b, enc) in enumerate(planos):
        d = b - a
        fil.append(f'[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={max(0, d - 0.03):.3f}:d=0.03[a{i}];')
        apz.append(f'[a{i}]')
        cortes = sorted({a, b} | {x for wa, wb, *_ in apoyos for x in (wa, wb) if a < x < b})
        for pa, pb in zip(cortes, cortes[1:]):
            ap = next((x for x in apoyos if x[0] <= (pa + pb) / 2 < x[1]), None)
            if ap:
                wa, wb, c, blur, off = ap
                fil.append(f'[{idx[c]}:v]trim={off + pa - wa:.3f}:{off + pb - wa:.3f},setpts=PTS-STARTPTS,'
                           f'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,gblur=sigma={blur},fps={FPS},setsar=1,format=yuv420p[v{k}];')
            else:
                if enc == 'zoom': v = zoom_f(pb - pa, pa - z0, D)
                else:
                    w, h, x, y = {'abierto': ABIERTO, 'cerrado': CERRADO, 'lado': LADO}[enc]; v = f'crop={w}:{h}:{x}:{y},scale=1920:1080'
                fil.append(f'[0:v]trim={pa}:{pb},setpts=PTS-STARTPTS,{v},fps={FPS},setsar=1,format=yuv420p[v{k}];')
            vpz.append(f'[v{k}]'); k += 1
    fil.append(''.join(vpz) + f'concat=n={len(vpz)}:v=1:a=0[vb];' + ''.join(apz) + f'concat=n={len(apz)}:v=0:a=1[ab];')
    # voz original: limpieza suave y algo más de volumen; música H muy baja
    fil.append('[ab]highpass=f=80,afftdn=nf=-30,acompressor=threshold=0.1:ratio=2.5:attack=10:release=200,'
               'aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[voz][vsc];')
    fil.append(f'[1:a]aformat=sample_rates=48000:channel_layouts=stereo,aloop=loop=-1:size=2e9,atrim=0:{total},asetpts=PTS-STARTPTS,'
               f'afade=t=in:d=0.8,afade=t=out:st={total - 2.5}:d=2.5,volume=0.18[m];'
               '[m][vsc]sidechaincompress=threshold=0.03:ratio=5:attack=30:release=600[md];'
               '[voz][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=8,aresample=48000[a]')
    open(f'{trabajo}/filtro_base.txt', 'w').write(''.join(fil))
    subprocess.run([FF, '-nostdin', '-y', '-loglevel', 'error', *ent, '-filter_complex_script', f'{trabajo}/filtro_base.txt',
                    '-map', '[vb]', '-map', '[a]', '-c:v', 'libx264', '-crf', '18', '-preset', 'fast',
                    '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', f'{trabajo}/base_full.mp4'], check=True, stdin=subprocess.DEVNULL)

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

#!/usr/bin/env python3
"""Locuciones con ElevenLabs (API directa, sin HeyGen ni Higgsfield).

Lee la clave de la variable de entorno ELEVENLABS_API_KEY; nunca se escribe en ningún archivo.
Guarda voz-s1/<anuncio>-<etiqueta>.mp3 y .json (palabras con tiempos, el mismo formato que
faster-whisper), listo para anuncios_s1_build.py y anuncios_clinicas_build.py.

   python3 voz_elevenlabs.py muestras                # arranque de Huecos con las 5 voces candidatas
   python3 voz_elevenlabs.py chue david              # un anuncio entero con una voz (etiqueta de VOCES)
   python3 voz_elevenlabs.py todos david             # los 6 anuncios (formación y clínicas) con esa voz
"""
import base64, json, os, sys, urllib.request

VOCES = {  # biblioteca de ElevenLabs, español de España (peninsular), masculinas
    'david':  'Nh2zY9kknu6z4pZy6FhD',  # David Martín · seguro y natural
    'dani':   '7QQzpAyzlKTVrRzQJmTE',  # Dani · conversacional
    'emilio': 'ZCh4e9eZSUf41K4cmCEL',  # Emilio · cálido y sólido
    'osborne':'W5JElH3dK1UYYAiHH7uh',  # Martin Osborne · íntimo y cálido
    'aaron':  't9LRTh3y1ioN00e9wsNh',  # Aaron Abad · castellano neutro
}
MODELO = 'eleven_v3'
MUESTRA = ('Martes, diez y media. El gabinete, preparado. La primera visita… no viene. No avisó. '
           'No coge el teléfono. Y ese hueco ya lo habías pagado: el anuncio, la llamada, y la hora del profesional. '
           'Casi nunca es mala suerte.')

def guiones():
    import anuncios_s1_build as s1, anuncios_clinicas_build as cl
    g = {k: ' '.join(f) for k, (_, f) in s1.GUIONES.items()}
    g.update({k: ' '.join(f) for k, (_, f) in cl.GUIONES.items()})
    return g

def palabras(al):
    """Alineación por caracteres de ElevenLabs → lista de palabras {w, s, e}."""
    out, w, s, e = [], '', None, None
    for c, a, b in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
        if c.isspace():
            if w: out.append({'w': w, 's': round(s, 3), 'e': round(e, 3)}); w = ''
            continue
        if not w: s = a
        w += c; e = b
    if w: out.append({'w': w, 's': round(s, 3), 'e': round(e, 3)})
    # «Qualivo» se busca como «cualivo» en los inicios de los montadores
    for p in out: p['w'] = p['w'].replace('Qualivo', 'cualivo')
    return out

def tts(texto, voz, destino):
    clave = os.environ['ELEVENLABS_API_KEY']
    cuerpo = json.dumps({'text': texto, 'model_id': MODELO, 'language_code': 'es'}).encode()
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOCES[voz]}/with-timestamps?output_format=mp3_44100_128',
                                 data=cuerpo, headers={'xi-api-key': clave, 'Content-Type': 'application/json'})
    r = json.load(urllib.request.urlopen(req, timeout=300))
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    open(destino + '.mp3', 'wb').write(base64.b64decode(r['audio_base64']))
    json.dump(palabras(r['alignment']), open(destino + '.json', 'w'), ensure_ascii=False)
    print('ok', destino)

if __name__ == '__main__':
    orden, *resto = sys.argv[1:]
    if orden == 'muestras':
        for v in VOCES: tts(MUESTRA, v, f'muestras-voz/{v}')
    elif orden == 'todos':
        g = guiones()
        for k in ('vel', 'pla', 'cur', 'cvel', 'chue', 'cpri'): tts(g[k], resto[0], f'voz-s1/{k}-{resto[0]}')
    else:
        tts(guiones()[orden], resto[0], f'voz-s1/{orden}-{resto[0]}')

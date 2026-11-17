#!/usr/bin/env python3
"""Pieza 02 · montaje mudo. Genera subs-corta-h3.js con los tiempos del guion de Contenido (sin audio).
Los subtítulos reparten cada frase del guion dentro de su escena, a título orientativo, hasta tener la voz de Maikel."""
import json, os, re
A = os.path.dirname(os.path.abspath(__file__))
G = [(6, 17, 'Primero, una campaña para gente interesada en un curso concreto. Aquí, Administración y Finanzas por las tardes. Una sola promesa: estudiar sin dejar tu trabajo.'),
     (17, 29, 'Quien hace clic llega a una página que sigue esa misma conversación: horario, formato y cuándo empieza. Puede resolver sus dudas y pedir información sin buscar nada.'),
     (29, 39, 'El formulario es corto: nombre, teléfono, email y qué horario le va mejor. Solo lo que sirve para preparar la primera conversación.'),
     (39, 55, 'A los pocos minutos le llega un WhatsApp con su nombre y el curso. Si pregunta algo, como si las clases quedan grabadas, le contesta un asistente que se presenta como tal. Y cuando pregunta el precio, no se inventa nada: le escribe una persona del equipo con todo el contexto.'),
     (55, 66, 'En el CRM, la academia ve cada solicitud, en qué punto está y cuál es el siguiente paso. Nadie depende de acordarse.'),
     (66, 78, 'Y un panel te dice de qué campaña viene cada solicitud y cada conversación. Cuando además se conectan las ventas, puedes ver qué campaña trae alumnos.'),
     (78, 87.5, 'Así puedes saber qué está funcionando y dónde mejorar antes de invertir más. Si diriges una academia, ¿qué parte de este recorrido te cuesta más controlar?')]
subs = []
for a, b, txt in G:
    pal = txt.split(); tro = []; cur = []
    for w in pal:
        cur.append(w); s = ' '.join(cur)
        if w[-1] in '.?!:' or (len(s) > 20 and w[-1] == ',') or len(s) > 27: tro.append(s); cur = []
    if cur: tro.append(' '.join(cur))
    tot = sum(len(x) for x in tro); t = a + .2; d = b - a - .5
    for x in tro:
        dt = d * len(x) / tot; subs.append({'s': round(t, 2), 'e': round(t + dt, 2), 'x': x}); t += dt
FIN = 88.0
T = {'a': 0, 'a2': 0, 'e2': 6, 'e3': 39, 'rq': 9999, 'e4': 55, 'e5': 66, 'e6': 999, 'e7': 999, 'c4': 999, 'c': [999, 999, 999], 'sol': 999, 'FIN': FIN,
     'lau': 30, 'ld': 17, 'm2': 17, 'cap': 30, 'f2': 36.5, 'l0': 55, 's3': 999, 's5': 66, 'll': 999, 'g': 0}
open(f'{A}/subs-corta-h3.js', 'w').write('window.T=' + json.dumps(T) + ';window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';')
print(len(subs), 'subtítulos')

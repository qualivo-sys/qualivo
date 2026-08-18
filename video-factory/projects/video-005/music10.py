"""Beat v10 del manifiesto: 122 BPM, groove con gancho.

Secciones (segundos, alineadas con las transiciones del Remotion):
  0.0 - 6.1   HOOK      arranque directo: kick+bass+riff desde el compas 1
  6.1 - 13.2  PROBLEMA  groove completo + arpegio
 13.2 - 22.5  DOLOR     mas oscuro: bajo pesado, riff fuera, pad menor
 22.5 - 37.1  PASOS     corte seco + rebuild, vuelve el riff a media
 37.1 - 47.0  REMATE    pico maximo, riff arriba
 47.0 - 49.9  OUTRO     solo kick+bass, nota final con boom

Uso: python3 music10.py <duracion_total_s>
"""
import sys

import numpy as np

SR = 44100
BPM = 122
BEAT = 60.0 / BPM          # 0.4918 s
BAR = BEAT * 4
DUR = float(sys.argv[1]) if len(sys.argv) > 1 else 49.9
N = int(DUR * SR)
t_global = np.arange(N) / SR

mix = np.zeros(N)

# limites de seccion (s)
S_PROB, S_DOLOR, S_PASOS, S_REMATE, S_OUTRO = 6.1, 13.2, 22.5, 37.1, 47.0


def add(sig, at):
    i0 = int(at * SR)
    if i0 >= N:
        return
    seg = sig[: N - i0]
    mix[i0 : i0 + len(seg)] += seg


def env_exp(n, decay):
    return np.exp(-np.arange(n) / (SR * decay))


def kick(vel=1.0):
    n = int(0.28 * SR)
    tt = np.arange(n) / SR
    f = 120 * np.exp(-tt * 22) + 44
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env_exp(n, 0.11)
    click = np.random.randn(int(0.004 * SR)) * 0.5
    out = body
    out[: len(click)] += click
    return out * 0.95 * vel


def hat(open_=False, vel=1.0):
    n = int((0.24 if open_ else 0.05) * SR)
    noise = np.diff(np.random.randn(n + 1))
    return noise * env_exp(n, 0.09 if open_ else 0.014) * 0.16 * vel


def clap(vel=1.0):
    n = int(0.22 * SR)
    noise = np.random.randn(n)
    e = np.zeros(n)
    for d in (0, 0.011, 0.023):
        i = int(d * SR)
        e[i:] += env_exp(n - i, 0.045)
    # banda media simple
    out = np.convolve(noise * e, np.array([1, -0.7]), mode="same")
    return out * 0.32 * vel


def saw(freq, n, detune=1.004):
    tt = np.arange(n) / SR
    s1 = 2 * ((freq * tt) % 1) - 1
    s2 = 2 * ((freq * detune * tt) % 1) - 1
    return (s1 + s2) * 0.5


def lowpass(sig, alpha):
    out = np.empty_like(sig)
    acc = 0.0
    for i, v in enumerate(sig):
        acc += alpha * (v - acc)
        out[i] = acc
    return out


def bass_note(freq, dur_s, vel=1.0, bite=0.25):
    n = int(dur_s * SR)
    raw = saw(freq, n, 1.002) + 0.6 * np.sin(2 * np.pi * freq / 2 * np.arange(n) / SR)
    # envolvente de filtro: abre al ataque y cierra (pluck)
    a_open, a_close = 0.5, 0.06
    alpha = a_close + (a_open - a_close) * np.exp(-np.arange(n) / (SR * bite))
    out = np.empty(n)
    acc = 0.0
    for i in range(n):
        acc += alpha[i] * (raw[i] - acc)
        out[i] = acc
    env = np.minimum(1, np.arange(n) / (0.004 * SR)) * env_exp(n, dur_s * 0.7)
    return out * env * 0.5 * vel


def pluck(freq, dur_s, vel=1.0):
    n = int(dur_s * SR)
    tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * tt) + 0.45 * np.sin(2 * np.pi * freq * 2 * tt + 0.6)
    s += 0.22 * np.sin(2 * np.pi * freq * 3.01 * tt)
    return s * env_exp(n, 0.09) * 0.30 * vel


def pad_chord(freqs, dur_s, vel=1.0):
    n = int(dur_s * SR)
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        out += saw(f, n, 1.006)
    out = lowpass(out, 0.08)
    a = int(0.4 * SR)
    env = np.concatenate([np.linspace(0, 1, a), np.ones(n - a)]) if n > a else np.linspace(0, 1, n)
    env = env * np.minimum(1, np.linspace(1, 0, n) * 4)
    return out * env * 0.05 * vel


def riser(dur_s, vel=1.0):
    n = int(dur_s * SR)
    noise = np.random.randn(n)
    alpha = np.linspace(0.02, 0.6, n)
    out = np.empty(n)
    acc = 0.0
    for i in range(n):
        acc += alpha[i] * (noise[i] - acc)
        out[i] = acc
    return out * np.linspace(0, 1, n) ** 2 * 0.30 * vel


def boom(vel=1.0):
    n = int(1.1 * SR)
    tt = np.arange(n) / SR
    f = 90 * np.exp(-tt * 9) + 36
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env_exp(n, 0.32) * 1.0 * vel


# --- progresion Am - F - C - G (por compas) ---
BASS_ROOT = {0: 55.0, 1: 43.65, 2: 65.41, 3: 49.0}          # A1 F1 C2 G1
PAD_CHORDS = {
    0: (220.0, 261.63, 329.63),      # Am
    1: (174.61, 220.0, 261.63),      # F
    2: (261.63, 329.63, 392.0),      # C
    3: (196.0, 246.94, 293.66),      # G
}
# riff de 2 compases (semicorcheas: (paso, semitonos sobre la raiz A3=220))
RIFF = [(0, 12), (3, 7), (6, 10), (8, 12), (11, 15), (12, 10), (14, 7)]
A3 = 220.0

n_bars = int(DUR / BAR) + 2

for bar in range(n_bars):
    t0 = bar * BAR
    if t0 >= DUR:
        break
    chord = bar % 4
    root = BASS_ROOT[chord]

    in_dolor = S_DOLOR <= t0 < S_PASOS
    in_pasos = S_PASOS <= t0 < S_REMATE
    in_remate = S_REMATE <= t0 < S_OUTRO
    in_outro = t0 >= S_OUTRO

    # hueco de 1 compas tras el corte de PASOS (silencio dramatico + rebuild)
    bars_into_pasos = (t0 - S_PASOS) / BAR if in_pasos else 99
    pasos_gap = in_pasos and bars_into_pasos < 0.9

    # --- bateria ---
    for b in range(4):
        tb = t0 + b * BEAT
        if tb >= DUR:
            break
        if pasos_gap and b > 0:
            continue
        add(kick(1.0 if not in_dolor else 1.1), tb)
        # offbeat open hat (el "bombo-chas" que empuja)
        if not pasos_gap and not in_outro:
            add(hat(open_=True, vel=0.9 if in_remate else 0.7), tb + BEAT / 2)
        # semicorcheas de hat cerrado con swing y velocity
        if not in_outro and not pasos_gap:
            for s16 in (0.25, 0.75):
                sw = 0.012 if s16 == 0.75 else 0.0
                add(hat(vel=0.5 + 0.2 * ((b + int(s16 * 4)) % 2)), tb + s16 * BEAT + sw)
    # claps en 2 y 4
    if not pasos_gap and not in_outro:
        add(clap(1.05 if in_remate else 0.9), t0 + BEAT)
        add(clap(1.05 if in_remate else 0.9), t0 + 3 * BEAT)
    # fill de caja cada 4 compases
    if bar % 4 == 3 and not in_outro and not pasos_gap:
        for k in range(4):
            add(clap(0.5 + 0.15 * k), t0 + 3 * BEAT + k * BEAT / 4)

    # --- bajo: patron sincopado 1 . . 1 . 1 . . (con octava) ---
    if pasos_gap:
        add(bass_note(root, BEAT * 0.9, vel=1.2, bite=0.5), t0)  # una nota larga en el hueco
    else:
        vel_b = 1.15 if (in_dolor or in_remate) else 1.0
        patt = [(0.0, 1, 0.22), (0.75, 1, 0.2), (1.5, 2, 0.2), (2.0, 1, 0.22),
                (2.75, 1, 0.2), (3.5, 2, 0.22)]
        for step, octv, dur_n in patt:
            add(bass_note(root * octv, dur_n * 1.6, vel=vel_b), t0 + step * BEAT)

    # --- riff / gancho (2 compases) ---
    riff_on = (t0 < S_DOLOR) or in_remate or (in_pasos and bars_into_pasos >= 4)
    if riff_on:
        vel_r = 1.15 if in_remate else 0.85
        if bar % 2 == 0:
            for step, semi in RIFF:
                f = A3 * (2 ** (semi / 12.0))
                tt_n = t0 + step * BEAT / 4
                add(pluck(f, 0.28, vel=vel_r), tt_n)
                add(pluck(f * 2, 0.2, vel=vel_r * 0.4), tt_n)

    # --- pad oscuro en DOLOR y colchon en PASOS ---
    if in_dolor or (in_pasos and not pasos_gap):
        add(pad_chord(PAD_CHORDS[chord], BAR * 1.05, vel=1.3 if in_dolor else 0.8), t0)

# --- transiciones: riser + boom en cada limite de seccion ---
for edge in (S_PROB, S_DOLOR, S_PASOS, S_REMATE):
    add(riser(1.4, vel=0.9), edge - 1.4)
    add(boom(0.9), edge)
# golpe final
add(boom(1.1), S_OUTRO)
add(kick(1.1), DUR - 0.9)
add(boom(1.2), DUR - 0.85)

# --- sidechain pump con el kick (bombeo global) ---
beat_phase = (t_global % BEAT) / BEAT
pump = 1 - 0.42 * np.exp(-beat_phase * 9)
mix *= pump

# --- curva de energia global ---
pts_t = [0, 0.5, S_PROB, S_DOLOR, S_PASOS - 0.5, S_PASOS, S_PASOS + 0.3, S_REMATE, S_OUTRO, DUR - 0.4, DUR]
pts_g = [0.9, 1.0, 1.0, 1.05, 1.05, 0.35, 0.8, 1.15, 0.85, 0.9, 0.0]
mix *= np.interp(t_global, pts_t, pts_g)

# --- master ---
mix = np.tanh(mix * 1.4) * 0.92
peak = np.max(np.abs(mix))
if peak > 0:
    mix = mix / peak * 0.95

data = (mix * 32767).astype(np.int16)
import wave

with wave.open("beat10.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print(f"beat10.wav: {DUR}s @ {BPM}bpm, peak {peak:.3f}")

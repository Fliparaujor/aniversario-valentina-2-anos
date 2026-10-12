"""Gera a trilha e os efeitos sonoros do vídeo (tudo sintetizado, sem samples).

Trilha: valsa em Dó maior, 132 bpm, 3/4. Caixinha de música + glockenspiel tocando
"Parabéns pra você" (melodia em domínio público), baixo dedilhado e chocalho.

Uso: python3 scripts/trilha.py   (grava em public/audio/)
"""
import os
import wave

import numpy as np

SR = 44100
BPM = 132
BEAT = 60 / BPM
DUR = 20.0
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(7)

NOTAS = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def hz(n):
    """'C5', 'F#4' -> Hz"""
    nome, oit = n[:-1], int(n[-1])
    semi = NOTAS[nome[0]] + (1 if "#" in nome else 0)
    midi = 12 * (oit + 1) + semi
    return 440 * 2 ** ((midi - 69) / 12)


def env(n, ataque, tau):
    t = np.arange(n) / SR
    e = np.exp(-t / tau)
    a = int(ataque * SR)
    if a:
        e[:a] *= np.linspace(0, 1, a)
    return e


def caixinha(f, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.32 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.25)
    s += 0.12 * np.sin(2 * np.pi * 4.2 * f * t) * np.exp(-t / 0.08)
    return s * env(n, 0.002, 0.7)


def glock(f, dur=2.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / 0.3)
    s += 0.15 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t / 0.1)
    return s * env(n, 0.001, 0.9)


def pluck(f, dur=0.9, brilho=0.5):
    """Karplus-Strong, soa como cordinha de ukulele."""
    n = int(dur * SR)
    p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.996 * (brilho * buf[i % p] + (1 - brilho) * buf[(i + 1) % p])
    return out * env(n, 0.003, 0.5)


def chocalho(dur=0.07):
    n = int(dur * SR)
    x = rng.uniform(-1, 1, n)
    x = np.diff(x, prepend=0)  # passa-alta simples
    return x * env(n, 0.004, 0.02)


def tum(dur=0.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 90 * np.exp(-t / 0.06) + 50
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.09)


class Mix:
    def __init__(self, dur):
        self.buf = np.zeros(int(dur * SR) + SR * 3)

    def add(self, sinal, t, vol=1.0):
        i = int(t * SR)
        j = min(len(self.buf), i + len(sinal))
        self.buf[i:j] += sinal[: j - i] * vol


def reverb(x, tempo=1.6, mix=0.22):
    n = int(tempo * SR)
    ir = rng.normal(0, 1, n) * np.exp(-np.arange(n) / SR / (tempo / 5))
    ir[0] = 0
    ir /= np.sqrt((ir ** 2).sum())
    m = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m), m)[: len(x)]
    return x * (1 - mix) + wet * mix * 2.2


def salvar(nome, x, pico=0.89):
    x = x / (np.abs(x).max() + 1e-9) * pico
    os.makedirs(OUT, exist_ok=True)
    with wave.open(os.path.join(OUT, nome), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())
    print("ok", nome, round(len(x) / SR, 2), "s")


ACORDES = {
    "C": ["C3", ["E4", "G4", "C5"]],
    "F": ["F2", ["F4", "A4", "C5"]],
    "G": ["G2", ["D4", "G4", "B4"]],
    "G7": ["G2", ["D4", "F4", "B4"]],
}

# (nota, duração em tempos). Começa no 3º tempo do compasso 2 (anacruse).
MELODIA = [
    ("G4", .75), ("G4", .25),
    ("A4", 1), ("G4", 1), ("C5", 1),
    ("B4", 2), ("G4", .75), ("G4", .25),
    ("A4", 1), ("G4", 1), ("D5", 1),
    ("C5", 2), ("G4", .75), ("G4", .25),
    ("G5", 1), ("E5", 1), ("C5", 1),
    ("B4", 1), ("A4", 1), ("F5", .75), ("F5", .25),
    ("E5", 1), ("C5", 1), ("D5", 1),
    ("C5", 3),
]
# um acorde por compasso, a partir do compasso 1 (tempo 0)
HARMONIA = ["C", "C", "C", "G7", "G7", "C", "C", "F", "G7", "C",
            "F", "G7", "C", "C", "C"]


def trilha():
    mx = Mix(DUR)
    # base de valsa: tum no 1, chocalho no 2 e 3, baixo e acordes dedilhados
    for c, nome in enumerate(HARMONIA):
        t0 = c * 3 * BEAT
        if t0 >= DUR - 1.2:
            break
        baixo, acorde = ACORDES[nome]
        mx.add(pluck(hz(baixo), 1.2, 0.45), t0, 0.55)
        mx.add(tum(), t0, 0.35)
        for b in (1, 2):
            for k, n in enumerate(acorde):
                mx.add(pluck(hz(n), 0.5, 0.6), t0 + b * BEAT + k * 0.012, 0.16)
            mx.add(chocalho(), t0 + b * BEAT, 0.10)
    # introdução: arpejo de caixinha subindo
    for k, n in enumerate(["C5", "E5", "G5", "C6", "G5", "E5", "C5", "E5", "G5", "C6", "E6"]):
        mx.add(caixinha(hz(n)), k * BEAT * 0.5, 0.35)
    # melodia
    t = 5 * BEAT
    for n, d in MELODIA:
        mx.add(caixinha(hz(n), 1.8), t, 0.75)
        mx.add(glock(hz(n[:-1] + str(int(n[-1]) + 1))), t, 0.18)
        t += d * BEAT
    # final: "pra vo-cê" uma oitava acima no glock + acorde final com brilho
    for n, d in [("F5", .75), ("F5", .25), ("E5", 1), ("C5", 1), ("D5", 1), ("C5", 3)]:
        mx.add(glock(hz(n[:-1] + "6")), t, 0.45)
        mx.add(caixinha(hz(n)), t, 0.4)
        t += d * BEAT
    for k, n in enumerate(["C5", "E5", "G5", "C6", "E6", "G6", "C7"]):
        mx.add(glock(hz(n), 2.5), t + k * 0.05, 0.3)
    x = reverb(mx.buf)[: int(DUR * SR)]
    fade = int(0.8 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)
    salvar("trilha.wav", x)
    print("melodia termina em", round(t, 2), "s")


def efeitos():
    # boing: mola subindo com vibrato
    n = int(0.5 * SR); tt = np.arange(n) / SR
    f = 160 + 300 * (1 - np.exp(-tt / 0.08)) + 40 * np.sin(2 * np.pi * 16 * tt) * np.exp(-tt / 0.2)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    salvar("boing.wav", s * env(n, 0.003, 0.18), 0.7)
    # pop: bolha estourando
    n = int(0.09 * SR); tt = np.arange(n) / SR
    f = 300 + 900 * np.exp(-tt / 0.015)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.025)
    s[:200] += rng.uniform(-.4, .4, 200)
    salvar("pop.wav", s, 0.6)
    # whoosh: ruído filtrado que abre e fecha
    n = int(0.55 * SR)
    x = rng.uniform(-1, 1, n)
    a = 0.02 + 0.25 * np.sin(np.linspace(0, np.pi, n)) ** 2
    y = np.zeros(n)
    for i in range(1, n):
        y[i] = y[i - 1] + a[i] * (x[i] - y[i - 1])
    salvar("whoosh.wav", y * np.sin(np.linspace(0, np.pi, n)) ** 1.5, 0.55)
    # brilho: arpejo agudo
    mx = Mix(1.5)
    for k, n_ in enumerate(["C6", "E6", "G6", "C7", "E7"]):
        mx.add(glock(hz(n_), 1.2), k * 0.045, 0.5)
    salvar("brilho.wav", mx.buf[: int(1.5 * SR)], 0.6)
    # toc: plaquinha de madeira batendo
    n = int(0.25 * SR); tt = np.arange(n) / SR
    s = (np.sin(2 * np.pi * 520 * tt) + 0.6 * np.sin(2 * np.pi * 1340 * tt)) * env(n, 0.001, 0.035)
    salvar("toc.wav", s, 0.6)


if __name__ == "__main__":
    trilha()
    efeitos()

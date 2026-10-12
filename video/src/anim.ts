import { interpolate, spring } from "remotion";

export const FPS = 30;
// a trilha é uma valsa a 132 bpm: 1 compasso = 3 tempos = 40,9 frames
export const COMPASSO = (3 * 60 * FPS) / 132;
export const compasso = (n: number) => Math.round(n * COMPASSO);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const mola = (frame: number, inicio: number, config: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  spring({ frame: frame - inicio, fps: FPS, config: { damping: 11, stiffness: 160, mass: 0.7, ...config } });

// amassa e estica: devolve [sx, sy] conservando o "volume"
export const squash = (k: number): [number, number] => {
  const sy = Math.max(0.3, 1 + k);
  return [1 / Math.sqrt(sy), sy];
};

// quique amortecido depois de um impacto em `t0`: oscila e morre
export const quique = (frame: number, t0: number, amp = 1, freq = 0.45, tau = 9) => {
  const t = frame - t0;
  if (t < 0) return 0;
  return amp * Math.sin(t * freq) * Math.exp(-t / tau);
};

export const lerp = (frame: number, a: number, b: number, de: number, ate: number, easing?: (t: number) => number) =>
  interpolate(frame, [a, b], [de, ate], { ...clamp, easing });

// queda com gravidade, sobe e desce em parábola entre t0 e t1 a partir de y0 até y1
export const queda = (frame: number, t0: number, t1: number, y0: number, y1: number) => {
  const t = Math.min(1, Math.max(0, (frame - t0) / (t1 - t0)));
  return y0 + (y1 - y0) * t * t;
};

import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Morango } from "../Morango";
import { Xadrez } from "../Xadrez";
import { clamp, lerp, mola, squash } from "../anim";
import { C, display } from "../tema";

// Um morango gigante cai, quica, enche e explode. A explosão vira a transição.
export const IMPACTOS = [12, 30, 42];
export const ESTOURO = 66;

const alturaMorango = (f: number) => {
  const chao = 1000;
  if (f < 12) return interpolate(f, [0, 12], [-450, chao], { ...clamp, easing: (t) => t * t });
  if (f < 30) { const u = (f - 12) / 18; return chao - 300 * 4 * u * (1 - u); }
  if (f < 42) { const u = (f - 30) / 12; return chao - 100 * 4 * u * (1 - u); }
  return chao;
};

const PALAVRAS = [
  { t: "Você", f: 20, rot: -7 },
  { t: "está", f: 26, rot: 5 },
  { t: "convidado!", f: 32, rot: -3 },
];

const Palavra: React.FC<{ p: (typeof PALAVRAS)[number]; f: number; sai: number; tam: number }> = ({ p, f, sai, tam }) => (
  <div
    style={{
      transform: `scale(${mola(f, p.f) * sai}) rotate(${p.rot}deg)`,
      fontFamily: display,
      fontWeight: 800,
      fontSize: tam,
      color: C.berry,
      textShadow: `6px 7px 0 ${C.pink}`,
      lineHeight: 1.05,
    }}
  >
    {p.t}
  </div>
);

export const Abertura: React.FC = () => {
  const f = useCurrentFrame();
  const y = alturaMorango(f);
  // estica na queda, amassa no impacto
  let k = f < 12 ? lerp(f, 4, 12, 0, 0.28) : 0;
  for (const i of IMPACTOS) if (f >= i) k += -0.42 * Math.exp(-(f - i) / 2.6) * (i === 42 ? 0.5 : 1);
  const [sx, sy] = squash(k);
  // antes de estourar: enche e treme
  const enche = lerp(f, 50, ESTOURO, 1, 1.35, (t) => t * t);
  const treme = f > 52 && f < ESTOURO ? Math.sin(f * 2.3) * lerp(f, 52, ESTOURO, 0, 7) : 0;
  const vivo = f < ESTOURO;

  // mancha vermelha em forma de morango que cobre a tela
  const cobre = lerp(f, ESTOURO, ESTOURO + 16, 0, 16, (t) => t * t * (3 - 2 * t));
  const sai = lerp(f, 58, ESTOURO, 1, 0);

  return (
    <AbsoluteFill>
      <Xadrez />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", gap: 36 }}>
          {PALAVRAS.slice(0, 2).map((p) => (
            <Palavra key={p.t} p={p} f={f} sai={sai} tam={120} />
          ))}
        </div>
        <Palavra p={PALAVRAS[2]} f={f} sai={sai} tam={150} />
      </div>
      {vivo && (
        <div
          style={{
            position: "absolute",
            left: 540 - 210,
            top: y - 230,
            width: 420,
            height: 462,
            transformOrigin: "50% 100%",
            transform: `rotate(${treme}deg) scale(${sx * enche}, ${sy * enche})`,
          }}
        >
          <Morango size={420} />
        </div>
      )}
      {/* sombra no chão */}
      {vivo && (
        <div
          style={{
            position: "absolute",
            left: 540 - 150,
            top: 1225,
            width: 300,
            height: 40,
            borderRadius: "50%",
            background: "rgba(90,31,46,.12)",
            transform: `scale(${interpolate(1000 - y, [0, 450], [1, 0.45], clamp) * enche})`,
          }}
        />
      )}
      {/* moranguinhos voando da explosão */}
      {!vivo &&
        Array.from({ length: 18 }).map((_, i) => {
          const t = f - ESTOURO;
          const ang = (i / 18) * Math.PI * 2 + random(`a${i}`) * 0.4;
          const v = 26 + random(`v${i}`) * 16;
          const x = 540 + Math.cos(ang) * v * t;
          const yy = 1000 + Math.sin(ang) * v * t + 0.9 * t * t;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 50,
                top: yy - 55,
                transform: `rotate(${t * (random(`r${i}`) - 0.5) * 40}deg)`,
              }}
            >
              <Morango size={100} />
            </div>
          );
        })}
      {!vivo && (
        <div
          style={{
            position: "absolute",
            left: 540 - 60,
            top: 1000 - 66,
            transform: `scale(${cobre})`,
            transformOrigin: "50% 55%",
          }}
        >
          <svg width={120} height={132} viewBox="0 0 40 44">
            <path d="M20 43 C9 38 2 27 3 18 C4 12 11 9 20 12 C29 9 36 12 37 18 C38 27 31 38 20 43Z" fill={C.berry} />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};

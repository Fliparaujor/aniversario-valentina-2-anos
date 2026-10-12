import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { FESTA } from "../festa";
import { Morango } from "../Morango";
import { Xadrez } from "../Xadrez";
import { lerp, mola, squash } from "../anim";
import { body, C, display } from "../tema";

// Letras do nome caem uma a uma, esticam na queda e amassam ao pousar.
export const LETRA_INICIO = 14;
export const LETRA_PASSO = 4;
const QUEDA = 9;
export const VAI_FAZER = 112;

const Letra: React.FC<{ ch: string; i: number; f: number }> = ({ ch, i, f }) => {
  const t0 = LETRA_INICIO + i * LETRA_PASSO;
  const pouso = t0 + QUEDA;
  const u = Math.min(1, Math.max(0, (f - t0) / QUEDA));
  const y = f < pouso ? -900 * (1 - u * u) : 0;
  let k = f < pouso ? 0.35 * u : -0.38 * Math.exp(-(f - pouso) / 2.8);
  if (f >= pouso + 4) k += 0.08 * Math.sin((f - pouso - 4) * 0.5) * Math.exp(-(f - pouso - 4) / 6);
  const [sx, sy] = squash(k);
  const onda = f > pouso + 14 ? Math.sin((f - pouso) * 0.16 + i * 0.7) * 12 : 0;
  return (
    <span
      style={{
        display: "inline-block",
        opacity: f < t0 ? 0 : 1,
        transformOrigin: "50% 100%",
        transform: `translateY(${y + onda}px) scale(${sx}, ${sy})`,
      }}
    >
      {ch}
    </span>
  );
};

export const Nome: React.FC = () => {
  const f = useCurrentFrame();
  const sub = mola(f, 4, { damping: 14 });
  const letras = [...FESTA.nome];
  return (
    <AbsoluteFill>
      <Xadrez fundo={C.berry} cor="rgba(178,30,49,.45)" vel={-0.5} />
      {/* morangos boiando no fundo */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 80 + random(`nx${i}`) * 920;
        const y0 = 200 + random(`ny${i}`) * 1500;
        const s = mola(f, 20 + i * 5);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 60,
              top: y0 + Math.sin(f * 0.07 + i) * 25,
              transform: `scale(${s * (0.6 + random(`ns${i}`) * 0.6)}) rotate(${Math.sin(f * 0.05 + i) * 18}deg)`,
              opacity: 0.9,
            }}
          >
            <Morango size={120} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: body,
          fontWeight: 800,
          fontSize: 58,
          letterSpacing: "0.12em",
          color: "#FFF",
          opacity: sub,
          transform: `translateY(${(1 - sub) * 40}px)`,
        }}
      >
        ANIVERSÁRIO DA
      </div>
      <div
        style={{
          position: "absolute",
          top: 730,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 168,
          lineHeight: 1,
          whiteSpace: "nowrap",
          color: "#FFF",
          textShadow: `0 14px 0 ${C.berryDeep}`,
          letterSpacing: "-0.02em",
        }}
      >
        {letras.map((ch, i) => (
          <Letra key={i} ch={ch} i={i} f={f} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 34,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 120,
          color: C.seed,
          textShadow: `0 8px 0 ${C.berryDeep}`,
        }}
      >
        {["que vai", "fazer..."].map((w, i) => (
          <span key={w} style={{ display: "inline-block", transform: `scale(${mola(f, VAI_FAZER + i * 8)}) rotate(${i ? 4 : -4}deg)` }}>
            {w}
          </span>
        ))}
      </div>
      {/* tampa de saída: um círculo rosa cresce do centro e entrega pra próxima cena */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 960,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: C.bg,
          transform: `translate(-50%,-50%) scale(${lerp(f, 150, 163, 0, 230, (t) => t * t)})`,
        }}
      />
    </AbsoluteFill>
  );
};

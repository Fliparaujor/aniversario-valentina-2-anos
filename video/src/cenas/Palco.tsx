import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { FESTA } from "../festa";
import { Morango } from "../Morango";
import { Moranguinho, Pose, RIG_H, RIG_W } from "../Moranguinho";
import { Xadrez } from "../Xadrez";
import { clamp, lerp, mola, quique, squash } from "../anim";
import { body, C, display } from "../tema";

// Marcos da cena (frames locais). A cena começa no compasso 8 da trilha.
export const M = {
  pouso: 24,
  selo: 44,
  encolhe: 93,
  placas: [100, 120],
  sobe: 178,
  final: 186,
  chamada: 204,
};

const PISCADAS = [40, 76, 150, 232];

// cortina de toalha xadrez: revela a cena de cima pra baixo com a borda ondulada
const cortina = (f: number) => {
  const h = lerp(f, 0, 16, 0, 2100, (t) => 1 - (1 - t) ** 3);
  let d = `M0 0 L1080 0 L1080 ${h}`;
  for (let x = 1080; x >= 0; x -= 90) d += ` Q${x - 45} ${h + 60} ${x - 90} ${h}`;
  return `path('${d} Z')`;
};

const Placa: React.FC<{ f: number; t0: number; alvo: number; sobe: number; children: React.ReactNode }> = ({ f, t0, alvo, sobe, children }) => {
  const s = mola(f, t0, { damping: 13, stiffness: 120 });
  const fora = mola(f, sobe, { damping: 20, stiffness: 140 });
  const y = -420 + (alvo + 420) * s - fora * (alvo + 700);
  const rot = quique(f, t0 + 6, 7, 0.3, 14) + quique(f, sobe, -4, 0.4, 8);
  if (f < t0) return null;
  return (
    <div style={{ position: "absolute", left: 80, width: 920, top: 0, height: y + 240, transformOrigin: "50% 0", transform: `rotate(${rot}deg)` }}>
      {/* cordinhas */}
      <div style={{ position: "absolute", left: 120, top: 0, width: 5, height: y, background: C.leaf }} />
      <div style={{ position: "absolute", right: 120, top: 0, width: 5, height: y, background: C.leaf }} />
      <div
        style={{
          position: "absolute",
          top: y,
          left: 0,
          right: 0,
          height: 240,
          background: "#FFF",
          border: "14px solid #E8B07A",
          borderRadius: 34,
          boxShadow: "0 14px 0 rgba(90,31,46,.18), inset 0 0 0 6px #FFE3EA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          color: C.ink,
        }}
      >
        {/* pregos */}
        <div style={{ position: "absolute", left: 108, top: 12, width: 28, height: 28, borderRadius: "50%", background: C.berry }} />
        <div style={{ position: "absolute", right: 108, top: 12, width: 28, height: 28, borderRadius: "50%", background: C.berry }} />
        {children}
      </div>
    </div>
  );
};

export const Palco: React.FC = () => {
  const f = useCurrentFrame();

  // ---------- Moranguinho ----------
  // entra pulando de baixo, pousa e amassa
  let y: number;
  if (f < 14) y = interpolate(f, [0, 14], [1500, -140], { ...clamp, easing: (t) => 1 - (1 - t) ** 2 });
  else if (f < M.pouso) y = interpolate(f, [14, M.pouso], [-140, 0], { ...clamp, easing: (t) => t * t });
  else y = 0;
  let k = f < 12 ? 0.16 : 0;
  if (f >= M.pouso) k += -0.2 * Math.exp(-(f - M.pouso) / 3) + 0.05 * Math.sin((f - M.pouso) * 0.6) * Math.exp(-(f - M.pouso) / 6);
  // pulinho de alegria no final
  const hop = f > M.final ? Math.max(0, Math.sin(((f - M.final) / 14) * Math.PI)) * (f < M.final + 14 ? 90 : 0) : 0;
  if (f >= M.final + 14) k += -0.15 * Math.exp(-(f - M.final - 14) / 3);
  const [sx, sy] = squash(k);
  const encolhe = mola(f, M.encolhe, { damping: 15 });
  const escala = 0.62 - 0.17 * encolhe;

  const aceno = (ini: number, fim: number) => lerp(f, ini, ini + 8, 0, 1) * lerp(f, fim - 8, fim, 1, 0);
  const a1 = aceno(30, 95);
  const a2 = aceno(M.final - 4, 280);
  const pose: Pose = {
    bracoDir: -72 * Math.max(a1, a2) + 20 * Math.sin((f - 30) * 0.45) * Math.max(a1, a2) + quique(f, M.pouso, -14, 0.5, 6),
    bracoEsq: 6 * Math.sin(f * 0.18) + a2 * (70 + 18 * Math.sin(f * 0.45 + 1.5)) + quique(f, M.pouso, 12, 0.5, 6),
    cabeca: 3.5 * Math.sin(f * 0.075) + quique(f, M.pouso, 3, 0.45, 8),
    chapeu: quique(f, M.pouso + 3, 9, 0.42, 10) + quique(f, M.final + 17, 7, 0.45, 9) + Math.sin(f * 0.075 - 0.8) * 1.5,
    chapeuY: -Math.abs(quique(f, M.pouso + 3, 34, 0.42, 9)) - Math.abs(quique(f, M.final + 17, 26, 0.45, 8)),
    rosto: PISCADAS.some((p) => f >= p && f < p + 4)
      ? "piscando"
      : (f >= M.selo + 2 && f < M.selo + 20) || (f >= M.final && f < M.final + 22)
      ? "eba"
      : "normal",
  };

  // ---------- selo "Festa da Moranguinho" ----------
  const selo = mola(f, M.selo, { damping: 9 }) * (1 - mola(f, M.encolhe - 6, { damping: 20 }));

  // ---------- final ----------
  const tePop = (i: number) => mola(f, M.final + i * 2, { damping: 9 });
  const chamada = mola(f, M.chamada, { damping: 12 });
  const dia = Math.round(lerp(f, M.placas[0] + 4, M.placas[0] + 22, 1, FESTA.dia, (t) => 1 - (1 - t) ** 2));

  return (
    <AbsoluteFill style={{ clipPath: cortina(f) }}>
      <Xadrez />

      {/* chuva de morangos no final */}
      {f > M.sobe &&
        Array.from({ length: 34 }).map((_, i) => {
          const t = f - M.sobe - random(`d${i}`) * 40;
          if (t < 0) return null;
          const x = random(`x${i}`) * 1080;
          const vel = 14 + random(`v${i}`) * 12;
          const tam = 60 + random(`s${i}`) * 80;
          return (
            <div key={i} style={{ position: "absolute", left: x - tam / 2, top: -150 + t * vel, transform: `rotate(${Math.sin(t * 0.1 + i) * 30}deg)` }}>
              <Morango size={tam} />
            </div>
          );
        })}

      {/* Moranguinho */}
      <div
        style={{
          position: "absolute",
          left: 540 - RIG_W / 2,
          top: 1900 - RIG_H,
          width: RIG_W,
          height: RIG_H,
          transformOrigin: "50% 100%",
          transform: `translateY(${y - hop}px) scale(${escala * sx}, ${escala * sy})`,
        }}
      >
        <Moranguinho pose={pose} />
      </div>

      {/* selo */}
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${selo}) rotate(${-4 + Math.sin(f * 0.1) * 2}deg)`,
        }}
      >
        <div
          style={{
            background: C.leaf,
            color: "#FFF",
            padding: "22px 56px 30px",
            borderRadius: 60,
            boxShadow: `0 12px 0 #3E8436`,
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          <Morango size={88} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: body, fontWeight: 800, fontSize: 34, letterSpacing: "0.14em" }}>FESTA DA</span>
            <span style={{ fontFamily: display, fontWeight: 800, fontSize: 80, whiteSpace: "nowrap" }}>Moranguinho</span>
          </div>
        </div>
      </div>

      {/* plaquinhas com as informações */}
      <Placa f={f} t0={M.placas[1]} alvo={560} sobe={M.sobe + 4}>
        <span style={{ fontFamily: body, fontWeight: 800, fontSize: 64, letterSpacing: "0.08em", color: C.inkSoft }}>ÀS</span>
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 130, color: C.berry }}>{FESTA.hora}</span>
      </Placa>
      <Placa f={f} t0={M.placas[0]} alvo={240} sobe={M.sobe}>
        <span style={{ fontFamily: body, fontWeight: 800, fontSize: 64, letterSpacing: "0.08em", color: C.inkSoft }}>{FESTA.diaSemana}</span>
        <span style={{ fontFamily: display, fontWeight: 800, fontSize: 118, color: C.berry, fontVariantNumeric: "tabular-nums" }}>
          {String(dia).padStart(2, "0")}/{FESTA.mes}
        </span>
      </Placa>

      {/* Te esperamos! */}
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 140,
          lineHeight: 1.05,
          color: C.berry,
          WebkitTextStroke: "16px #FFF",
          paintOrder: "stroke fill",
          textShadow: `0 14px 0 ${C.pink}`,
        }}
      >
        {["Te", "esperamos!"].map((w, wi) => (
          <div key={w}>
            {[...w].map((ch, i) => {
              const s = tePop(wi * 2 + i);
              const onda = f > M.final + 30 ? Math.sin(f * 0.18 + i * 0.7 + wi) * 10 : 0;
              return (
                <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * -260 + onda}px) scale(${s})` }}>
                  {ch}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${chamada})` }}>
        <div
          style={{
            background: C.berry,
            color: "#FFF",
            fontFamily: body,
            fontWeight: 800,
            fontSize: 58,
            padding: "24px 52px",
            borderRadius: 999,
            boxShadow: `0 10px 0 ${C.berryDeep}`,
          }}
        >
          {FESTA.diaSemana.charAt(0) + FESTA.diaSemana.slice(1).toLowerCase()}, {FESTA.dia}/{FESTA.mes} às {FESTA.hora}
        </div>
      </div>
    </AbsoluteFill>
  );
};

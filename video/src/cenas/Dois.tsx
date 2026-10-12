import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Xadrez } from "../Xadrez";
import { lerp, mola, squash } from "../anim";
import { C, display } from "../tema";

// Um "2" gigante desenhado como chantilly saindo do bico, que enche de morango.
export const TRACO_FIM = 30;
export const FOLHA = 38;
export const ANINHOS = 42;

export const Dois: React.FC = () => {
  const f = useCurrentFrame();
  const traco = lerp(f, 2, TRACO_FIM, 5200, 0, (t) => 1 - (1 - t) ** 2);
  const enche = lerp(f, 24, 34, 0, 1);
  const sementes = lerp(f, 30, 38, 0, 1);
  const folha = mola(f, FOLHA, { damping: 8 });
  // o "2" dá um pulinho quando termina de encher
  const k = f > 34 ? -0.12 * Math.sin((f - 34) * 0.55) * Math.exp(-(f - 34) / 7) : 0;
  const [sx, sy] = squash(k);
  const respira = 1 + Math.sin(f * 0.12) * 0.012;

  return (
    <AbsoluteFill>
      <Xadrez />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 62%", transform: `scale(${sx * respira}, ${sy * respira})` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <defs>
            <pattern id="sementes" width="90" height="110" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
              <ellipse cx="22" cy="28" rx="9" ry="14" fill={C.seed} />
              <ellipse cx="67" cy="83" rx="9" ry="14" fill={C.seed} />
            </pattern>
          </defs>
          {/* sombra */}
          <text x="540" y="1270" textAnchor="middle" fontFamily={display} fontWeight={800} fontSize={1150} fill={C.berryDeep} opacity={enche} transform="translate(14 22)">
            2
          </text>
          <text x="540" y="1270" textAnchor="middle" fontFamily={display} fontWeight={800} fontSize={1150} fill={C.berry} fillOpacity={enche} stroke={C.berryDeep} strokeWidth={22} strokeLinejoin="round" strokeDasharray="5200" strokeDashoffset={traco}>
            2
          </text>
          <text x="540" y="1270" textAnchor="middle" fontFamily={display} fontWeight={800} fontSize={1150} fill="url(#sementes)" opacity={sementes}>
            2
          </text>
          {/* brilho */}
          <ellipse cx="420" cy="560" rx="70" ry="28" fill="#FFF" opacity={0.35 * sementes} transform="rotate(-28 420 560)" />
          {/* folhinha brotando no topo */}
          <g transform={`translate(560 400) scale(${folha * 7}) translate(-20 -12)`}>
            <path d="M20 15 L9 10 L15 9.5 L11 4 L20 8.5 L29 4 L25 9.5 L31 10 Z" fill={C.leaf} stroke="#3E8436" strokeWidth={0.6} strokeLinejoin="round" />
            <path d="M20 9 q1 -5 5 -7.5" stroke="#3E8436" strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1430,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 190,
          color: C.berry,
          textShadow: `7px 9px 0 ${C.pink}`,
          lineHeight: 1,
        }}
      >
        {[..."aninhos!"].map((ch, i) => {
          const s = mola(f, ANINHOS + i * 2, { damping: 9 });
          const onda = f > ANINHOS + 20 ? Math.sin(f * 0.2 + i * 0.8) * 10 : 0;
          return (
            <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * 220 + onda}px) scale(${s})` }}>
              {ch}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

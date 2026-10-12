import { AbsoluteFill } from "remotion";
import { FESTA } from "./festa";
import { Morango } from "./Morango";
import { Moranguinho, RIG_H, RIG_W } from "./Moranguinho";
import { Xadrez } from "./Xadrez";
import { body, C, display } from "./tema";

// imagem de prévia do link (og:image), 1200 x 630
export const Previa: React.FC = () => {
  const s = 600 / RIG_H;
  return (
    <AbsoluteFill>
      <Xadrez casa={70} vel={0} />
      <div style={{ position: "absolute", left: 40, top: 30, width: RIG_W, height: RIG_H, transformOrigin: "0 0", transform: `scale(${s})` }}>
        <Moranguinho pose={{ bracoDir: -62, cabeca: -3, chapeu: -2 }} />
      </div>
      <div style={{ position: "absolute", left: 470, right: 40, top: 70, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, alignSelf: "flex-start", background: C.leaf, color: "#fff", borderRadius: 999, padding: "10px 26px", boxShadow: "0 6px 0 #3E8436", fontFamily: body, fontWeight: 800, fontSize: 28, letterSpacing: "0.08em" }}>
          <Morango size={34} /> FESTA DA MORANGUINHO
        </div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 112, lineHeight: 1, color: C.berry, WebkitTextStroke: "12px #fff", paintOrder: "stroke fill", textShadow: `0 10px 0 ${C.pink}` }}>
          {FESTA.nome}
        </div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 72, lineHeight: 1, color: C.ink, WebkitTextStroke: "10px #fff", paintOrder: "stroke fill" }}>
          faz 2 aninhos!
        </div>
        <div style={{ marginTop: 18, alignSelf: "flex-start", background: "#fff", border: "8px solid #E8B07A", borderRadius: 24, padding: "14px 28px", fontFamily: body, fontWeight: 800, fontSize: 40, color: C.ink }}>
          {FESTA.diaSemana.charAt(0) + FESTA.diaSemana.slice(1).toLowerCase()}, {FESTA.dia}/{FESTA.mes} às {FESTA.hora}
        </div>
      </div>
    </AbsoluteFill>
  );
};

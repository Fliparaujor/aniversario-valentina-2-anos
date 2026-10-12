import { Img, staticFile } from "remotion";

// Boneco articulado. Coordenadas no espaço do corpo (corpo-sem-bracos.png = 887 x 1774).
// Os encaixes foram medidos nas camadas: ombros sob as mangas, pescoço na gola.
export type Pose = {
  bracoDir?: number; // graus, horário positivo (negativo levanta o braço pra acenar)
  bracoEsq?: number; // graus, horário positivo levanta o braço esquerdo
  cabeca?: number; // inclinação da cabeça em graus
  chapeu?: number; // rotação extra do chapéu (atraso/quique)
  chapeuY?: number; // pulinho do chapéu em px
  rosto?: "normal" | "piscando" | "eba";
};

const TOPO = 100; // espaço acima do corpo pro chapéu
export const RIG_W = 887;
export const RIG_H = 1774 + TOPO;

const src = (n: string) => staticFile(`moranguinho/${n}.png`);

const camada = (
  arquivo: string,
  w: number,
  h: number,
  left: number,
  top: number,
  origem: [number, number],
  rot: number,
  extra = ""
): React.CSSProperties => ({
  position: "absolute",
  left,
  top: top + TOPO,
  width: w,
  height: h,
  transformOrigin: `${origem[0]}px ${origem[1]}px`,
  transform: `${extra} rotate(${rot}deg)`,
});

export const Moranguinho: React.FC<{ pose?: Pose }> = ({ pose = {} }) => {
  const { bracoDir = 0, bracoEsq = 0, cabeca = 0, chapeu = 0, chapeuY = 0, rosto = "normal" } = pose;
  const arqRosto = rosto === "piscando" ? "cabeca-piscando" : rosto === "eba" ? "cabeca-boca-aberta" : "moranguinho-cabeca";
  // cabeça + chapéu giram juntos em volta do pescoço (500, 590)
  const pescoco = { x: 500, y: 590 + TOPO };
  return (
    <div style={{ position: "relative", width: RIG_W, height: RIG_H }}>
      {/* braço esquerdo (lado esquerdo da tela), ombro em (345, 668) */}
      <Img src={src("braco-esquerdo")} style={camada("", 298.4, 443.1, 102.8, 608, [242.2, 60], 8 + bracoEsq)} />
      {/* braço direito, ombro em (648, 668) */}
      <Img src={src("braco-direito")} style={camada("", 754, 1508, 266.3, -34.1, [381.7, 702.1], bracoDir)} />
      <Img src={src("corpo-sem-bracos")} style={{ position: "absolute", left: 0, top: TOPO, width: 887, height: 1774 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${pescoco.x}px ${pescoco.y}px`,
          transform: `rotate(${cabeca}deg)`,
        }}
      >
        <Img src={src(arqRosto)} style={{ position: "absolute", left: 113, top: 72 + TOPO, width: 716.7, height: 843.8 }} />
        <Img
          src={src("moranguinho-chapeu")}
          style={camada("", 665.25, 1330.5, 159, -83, [332.25, 360], 6 + chapeu, `translateY(${chapeuY}px)`)}
        />
      </div>
    </div>
  );
};

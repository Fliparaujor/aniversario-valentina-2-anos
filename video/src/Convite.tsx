import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Abertura, ESTOURO, IMPACTOS } from "./cenas/Abertura";
import { Dois, FOLHA } from "./cenas/Dois";
import { LETRA_INICIO, LETRA_PASSO, Nome, VAI_FAZER } from "./cenas/Nome";
import { M, Palco } from "./cenas/Palco";
import { compasso } from "./anim";
import { FESTA } from "./festa";

// cortes caem nos compassos da valsa
const T = {
  abertura: 0,
  nome: compasso(2),
  dois: compasso(6),
  palco: compasso(8),
};
export const DURACAO = 600;

const Sfx: React.FC<{ at: number; som: string; vol?: number }> = ({ at, som, vol = 1 }) => (
  <Sequence from={Math.round(at)} durationInFrames={60} layout="none">
    <Audio src={staticFile(`audio/${som}.wav`)} volume={vol} />
  </Sequence>
);

export const Convite: React.FC = () => {
  const letras = [...FESTA.nome].map((_, i) => T.nome + LETRA_INICIO + i * LETRA_PASSO + 9);
  return (
    <AbsoluteFill style={{ background: "#FFF1F4" }}>
      <Sequence from={T.abertura} durationInFrames={T.nome - T.abertura}>
        <Abertura />
      </Sequence>
      <Sequence from={T.nome} durationInFrames={T.dois - T.nome}>
        <Nome />
      </Sequence>
      {/* a cena do 2 continua por baixo enquanto a cortina do palco desce */}
      <Sequence from={T.dois} durationInFrames={T.palco - T.dois + 20}>
        <Dois />
      </Sequence>
      <Sequence from={T.palco} durationInFrames={DURACAO - T.palco}>
        <Palco />
      </Sequence>

      <Audio src={staticFile("audio/trilha.wav")} volume={0.8} />
      {IMPACTOS.map((t, i) => (
        <Sfx key={t} at={t} som="boing" vol={[0.7, 0.45, 0.25][i]} />
      ))}
      {[20, 26, 32].map((t) => (
        <Sfx key={t} at={t} som="pop" vol={0.5} />
      ))}
      <Sfx at={ESTOURO} som="pop" vol={0.9} />
      <Sfx at={ESTOURO} som="whoosh" vol={0.7} />
      {letras.map((t) => (
        <Sfx key={t} at={t} som="pop" vol={0.35} />
      ))}
      <Sfx at={T.nome + VAI_FAZER} som="pop" vol={0.5} />
      <Sfx at={T.nome + VAI_FAZER + 8} som="pop" vol={0.5} />
      <Sfx at={T.nome + 150} som="whoosh" vol={0.6} />
      <Sfx at={T.dois + FOLHA} som="brilho" vol={0.6} />
      <Sfx at={T.palco} som="whoosh" vol={0.6} />
      <Sfx at={T.palco + M.pouso} som="boing" vol={0.7} />
      <Sfx at={T.palco + M.selo} som="brilho" vol={0.6} />
      {M.placas.map((t) => (
        <Sfx key={t} at={T.palco + t + 6} som="toc" vol={0.7} />
      ))}
      <Sfx at={T.palco + M.sobe} som="whoosh" vol={0.6} />
      <Sfx at={T.palco + M.final + 14} som="boing" vol={0.5} />
    </AbsoluteFill>
  );
};

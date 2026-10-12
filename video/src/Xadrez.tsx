import { AbsoluteFill, useCurrentFrame } from "remotion";

// toalha de piquenique em xadrez vichy; desliza devagar pra dar vida ao fundo
export const Xadrez: React.FC<{ cor?: string; fundo?: string; casa?: number; vel?: number }> = ({
  cor = "rgba(247,163,186,.42)",
  fundo = "#FFF1F4",
  casa = 96,
  vel = 0.6,
}) => {
  const f = useCurrentFrame();
  const d = f * vel;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: fundo,
        backgroundImage: `linear-gradient(90deg, ${cor} 50%, transparent 50%), linear-gradient(${cor} 50%, transparent 50%)`,
        backgroundSize: `${casa}px ${casa}px`,
        backgroundPosition: `${d}px ${d}px`,
      }}
    />
  );
};

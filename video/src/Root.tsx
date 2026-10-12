import { Composition, Still } from "remotion";
import { Convite, DURACAO } from "./Convite";
import { Previa } from "./Previa";

export const Root: React.FC = () => (
  <>
    <Composition id="Convite" component={Convite} durationInFrames={DURACAO} fps={30} width={1080} height={1920} />
    <Still id="Previa" component={Previa} width={1200} height={630} />
  </>
);

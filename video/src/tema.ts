import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// fontes ficam em public/fonts (Gluten e Figtree, licença OFL), sem depender da internet no render
export const display = "Gluten";
export const body = "Figtree";
for (const w of ["700", "800"]) loadFont({ family: display, url: staticFile("fonts/gluten.woff2"), weight: w });
for (const w of ["600", "800"]) loadFont({ family: body, url: staticFile("fonts/figtree.woff2"), weight: w });

export const C = {
  bg: "#FFF1F4",
  paper: "#FFFFFF",
  ink: "#5A1F2E",
  inkSoft: "#8A5763",
  berry: "#E2384D",
  berryDeep: "#B21E31",
  pink: "#F7A3BA",
  pinkSoft: "#FDDDE6",
  leaf: "#4E9F45",
  seed: "#FFD95A",
};

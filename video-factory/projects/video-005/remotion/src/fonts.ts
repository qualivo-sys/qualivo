import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontsReady = loadFont({
  family: "Mont",
  url: staticFile("mont.woff2"),
  weight: "100 900",
});

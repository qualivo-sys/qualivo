import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// loadFont usa delayRender internamente: el render espera a que carguen.
loadFont({
  family: "Mont",
  url: staticFile("mont.woff2"),
  weight: "100 900",
});

loadFont({
  family: "Anton",
  url: staticFile("anton.woff2"),
  weight: "400",
});

loadFont({
  family: "Space Grotesk",
  url: staticFile("spacegrotesk.woff2"),
  weight: "700",
});

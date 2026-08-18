import React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Video } from "@remotion/media";
import { FONT, INK, ORANGE } from "../theme";
import { Cue, Subs } from "../Subs";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// VO t2 arranca en el 0.20s de la escena. Cortes a pantalla completa
// sincronizados con la enumeración.
const PLANOS: Array<[string, number, number, number, number]> = [
  // src, frame inicio, frame fin, trimBefore, playbackRate
  // (rate elegido para que el clip nunca se agote y congele dentro del plano)
  ["teclado.mp4", 0, 44, 10, 0.8],
  ["sc-sheets.mp4", 44, 74, 0, 0.8],
  ["sc-buscar.mp4", 74, 100, 0, 0.8],
  ["sc-whatsapp.mp4", 100, 140, 0, 0.8],
  ["teclado.mp4", 140, 225, 0, 0.6],
];

const CUES: Cue[] = [
  {
    t0: 0.22,
    t1: 1.45,
    lines: [
      {
        text: "Porque tu equipo se pasa el día…",
        font: FONT,
        weight: 800,
        size: 56,
      },
    ],
  },
  { t0: 1.47, t1: 2.4, lines: [{ text: "COPIANDO DATOS", size: 96 }] },
  {
    t0: 2.42,
    t1: 3.3,
    lines: [{ text: "BUSCANDO ARCHIVOS", size: 96 }],
  },
  {
    t0: 3.32,
    t1: 4.6,
    lines: [{ text: "PERSIGUIENDO", size: 92 }, { text: "RESPUESTAS", size: 92 }],
  },
  {
    t0: 4.64,
    t1: 6.6,
    lines: [
      { text: "TRABAJO QUE", size: 86 },
      { text: "NO APORTA NADA", color: ORANGE, size: 104 },
    ],
  },
];

export const Problema: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      {PLANOS.map(([src, f0, f1, trim, rate], i) =>
        frame >= f0 && frame < f1 ? (
          <AbsoluteFill key={i}>
            <Video
              src={staticFile(src)}
              trimBefore={trim}
              playbackRate={rate}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                // punch-in en cada corte
                scale: String(
                  interpolate(frame, [f0, f0 + 10, f1], [1.12, 1.02, 1.06], {
                    ...clamp,
                  }),
                ),
              }}
            />
            <AbsoluteFill style={{ background: "rgba(10,10,11,0.42)" }} />
          </AbsoluteFill>
        ) : null,
      )}

      <Subs cues={CUES} y={1080} />
    </AbsoluteFill>
  );
};

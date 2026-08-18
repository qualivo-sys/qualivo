import React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Video } from "@remotion/media";
import { FONT, INK, MUT, ORANGE } from "../theme";
import { Cue, Subs } from "../Subs";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// VO t1 arranca en el 0.30s de la escena (pista maestra)
const CUES: Cue[] = [
  {
    t0: 0.35,
    t1: 1.66,
    lines: [
      {
        text: "¿Sabes qué tiene hoy",
        font: FONT,
        weight: 800,
        size: 62,
      },
      { text: "cualquier empresa?", font: FONT, weight: 800, size: 62 },
    ],
  },
  {
    t0: 1.68,
    t1: 3.14,
    lines: [
      { text: "MÁS HERRAMIENTAS", color: ORANGE, size: 104 },
      { text: "QUE PERSONAS", size: 84 },
    ],
  },
  {
    t0: 3.16,
    t1: 4.9,
    lines: [
      { text: "MENOS CONTROL", size: 112 },
      { text: "QUE NUNCA", color: ORANGE, size: 80 },
    ],
  },
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const faseMovil = frame >= 92; // corte al llegar «menos control»

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      {!faseMovil && (
        <AbsoluteFill>
          <Video
            src={staticFile("k4.mp4")}
            playbackRate={0.9}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: String(
                interpolate(frame, [0, 92], [1.1, 1], { ...clamp }),
              ),
            }}
          />
          <AbsoluteFill style={{ background: "rgba(10,10,11,0.4)" }} />
        </AbsoluteFill>
      )}
      {faseMovil && (
        <AbsoluteFill>
          <Video
            src={staticFile("k6.mp4")}
            playbackRate={0.55}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: String(
                interpolate(frame, [92, 110, 183], [1.14, 1.02, 1.08], {
                  ...clamp,
                }),
              ),
            }}
          />
          <AbsoluteFill style={{ background: "rgba(10,10,11,0.45)" }} />
        </AbsoluteFill>
      )}

      {/* kicker superior discreto */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 200,
          textAlign: "center",
          fontFamily: "'Space Grotesk', monospace",
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: "0.3em",
          color: MUT,
          opacity: interpolate(frame, [4, 14], [0, 1], { ...clamp }),
        }}
      >
        TU EMPRESA · 2026
      </div>

      <Subs cues={CUES} y={1080} />
    </AbsoluteFill>
  );
};

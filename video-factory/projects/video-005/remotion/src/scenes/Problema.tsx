import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { CREAM, FONT, INK, MUT, ORANGE } from "../theme";

const PREGUNTAS: Array<[string, number, number]> = [
  ["¿Qué está funcionando?", 60, -1],
  ["¿Qué está fallando?", 120, 1],
  ["¿Qué no debería hacer una persona?", 180, -1],
];

const TAREAS = "copiar datos · buscar archivos · perseguir respuestas · ";

export const Problema: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      <Audio src={staticFile("t2-problema.mp3")} from={6} />

      {/* metraje real de fondo, ralentizado y oscurecido */}
      <Video
        src={staticFile("teclado.mp4")}
        playbackRate={0.5}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(10,10,11,0.68)" }} />

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 200,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.14em",
          color: MUT,
          opacity: interpolate(frame, [6, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        NO ES QUE FALTE TECNOLOGÍA
      </div>

      {/* preguntas que nadie sabe responder */}
      {PREGUNTAS.map(([txt, f0, dir], i) => (
        <div
          key={txt}
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            top: 400 + i * 300,
            padding: "38px 44px",
            borderRadius: 22,
            background: "rgba(20,20,24,0.85)",
            borderLeft: `12px solid ${ORANGE}`,
            fontWeight: 900,
            fontSize: 58,
            letterSpacing: "-0.02em",
            color: CREAM,
            opacity: interpolate(frame, [f0, f0 + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `${
              dir *
              interpolate(frame, [f0, f0 + 14], [340, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.2, 1.3, 0.4, 1),
              })
            }px 0px`,
          }}
        >
          {txt}
        </div>
      ))}

      {/* cinta de tareas robadas */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 250,
          overflow: "hidden",
          whiteSpace: "nowrap",
          opacity: interpolate(frame, [230, 245], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: "-0.01em",
            color: ORANGE,
            translate: `${-((frame * 6) % 1400)}px 0px`,
          }}
        >
          {TAREAS.repeat(6)}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 160,
          fontWeight: 700,
          fontSize: 38,
          color: MUT,
          opacity: interpolate(frame, [245, 260], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Eso hace tu mejor gente. Todos los días.
      </div>
    </AbsoluteFill>
  );
};

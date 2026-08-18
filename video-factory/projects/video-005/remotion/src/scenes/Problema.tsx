import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio, Video } from "@remotion/media";
import { CREAM, DISPLAY, FONT, INK, MUT, ORANGE, kicker } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const TAREAS: Array<[string, string, number, boolean]> = [
  // texto, pantalla, frame de entrada, pantalla a la derecha
  ["COPIAR DATOS", "sc-sheets.mp4", 38, true],
  ["BUSCAR ARCHIVOS", "sc-buscar.mp4", 64, false],
  ["PERSEGUIR RESPUESTAS", "sc-whatsapp.mp4", 90, true],
];

export const Problema: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      <Audio src={staticFile("v10-t2.mp3")} from={10} />

      <Video
        src={staticFile("teclado.mp4")}
        playbackRate={0.6}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill style={{ background: "rgba(10,10,11,0.78)" }} />

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 210,
          ...kicker,
          color: ORANGE,
          opacity: interpolate(frame, [6, 16], [0, 1], { ...clamp }),
        }}
      >
        EL DÍA A DÍA DE TU EQUIPO
      </div>

      {TAREAS.map(([txt, src, f0, derecha], i) => (
        <div
          key={txt}
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            top: 330 + i * 310,
            display: "flex",
            flexDirection: derecha ? "row" : "row-reverse",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            opacity: interpolate(frame, [f0, f0 + 8], [0, 1], { ...clamp }),
          }}
        >
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 76,
              lineHeight: 1,
              color: CREAM,
              maxWidth: 540,
              translate: `${interpolate(
                frame,
                [f0, f0 + 12],
                [derecha ? -120 : 120, 0],
                { ...clamp, easing: Easing.bezier(0.2, 1.2, 0.4, 1) },
              )}px 0px`,
            }}
          >
            {txt}
          </div>
          <Video
            src={staticFile(src)}
            muted
            style={{
              width: 340,
              height: 240,
              objectFit: "cover",
              objectPosition: "center top",
              borderRadius: 16,
              border: "3px solid rgba(242,238,230,0.22)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.6)",
              rotate: derecha ? "3deg" : "-3deg",
              scale: String(
                interpolate(frame, [f0 + 4, f0 + 16], [0.5, 1], {
                  ...clamp,
                  easing: Easing.bezier(0.2, 1.35, 0.4, 1),
                }),
              ),
            }}
          />
        </div>
      ))}

      {/* remate de la escena */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1400,
          textAlign: "center",
          fontFamily: DISPLAY,
          fontSize: 92,
          lineHeight: 1,
          color: CREAM,
          opacity: interpolate(frame, [126, 134], [0, 1], { ...clamp }),
          scale: String(
            interpolate(frame, [126, 140], [1.9, 1], {
              ...clamp,
              easing: Easing.bezier(0.2, 1, 0.3, 1),
            }),
          ),
        }}
      >
        TRABAJO QUE
        <div style={{ color: ORANGE }}>NO APORTA NADA</div>
      </div>

      {/* cinta en movimiento */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 90,
          overflow: "hidden",
          whiteSpace: "nowrap",
          opacity: interpolate(frame, [30, 44], [0, 0.55], { ...clamp }),
        }}
      >
        <div
          style={{
            display: "inline-block",
            ...kicker,
            fontSize: 26,
            color: MUT,
            translate: `${-((frame * 7) % 1500)}px 0px`,
          }}
        >
          copiar datos · buscar archivos · perseguir respuestas · copiar datos
          · buscar archivos · perseguir respuestas · copiar datos · buscar
          archivos · perseguir respuestas ·
        </div>
      </div>
    </AbsoluteFill>
  );
};

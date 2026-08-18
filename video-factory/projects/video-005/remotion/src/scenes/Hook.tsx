import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { CREAM, FONT, INK, MUT, ORANGE } from "../theme";

const HERRAMIENTAS: Array<[string, number, number, number, number]> = [
  // texto, x, y, ángulo, frame de entrada
  ["CORREO", 90, 330, -6, 14],
  ["CHATS", 620, 420, 4, 26],
  ["CRM", 200, 590, -3, 38],
  ["HOJAS DE CÁLCULO", 120, 760, 5, 50],
  ["PANELES", 640, 700, -5, 62],
  ["TICKETS", 160, 930, 3, 74],
  ["CALENDARIOS", 520, 1000, -4, 86],
  ["INFORMES", 220, 1170, 6, 98],
];

const springIn = (frame: number, from: number) =>
  interpolate(frame, [from, from + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 1.4, 0.4, 1),
  });

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      <Audio src={staticFile("t1-hook.mp3")} from={8} />

      {/* pregunta inicial */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 170,
          fontWeight: 900,
          fontSize: 66,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: CREAM,
          opacity: interpolate(frame, [4, 16], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: `0px ${interpolate(frame, [4, 16], [30, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          })}px`,
        }}
      >
        ¿Sabes qué tiene hoy{"\n"}cualquier empresa?
      </div>

      {/* tormenta de herramientas */}
      {HERRAMIENTAS.map(([txt, x, y, ang, f0]) => (
        <div
          key={txt}
          style={{
            position: "absolute",
            left: x,
            top: y + 180,
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: "-0.02em",
            color: frame > 210 ? "rgba(242,238,230,0.16)" : CREAM,
            rotate: `${ang}deg`,
            opacity: springIn(frame, f0),
            scale: String(springIn(frame, f0)),
            textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          }}
        >
          {txt}
        </div>
      ))}

      {/* MÁS HERRAMIENTAS QUE PERSONAS */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1360,
          textAlign: "center",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          color: ORANGE,
          fontSize: 118,
          lineHeight: 1.02,
          opacity: interpolate(frame, [116, 128], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: String(
            interpolate(frame, [116, 130, 200], [0.4, 1, 1.06], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1.3, 0.4, 1),
            }),
          ),
        }}
      >
        MÁS
        <div style={{ fontSize: 62, color: CREAM }}>HERRAMIENTAS</div>
        <div style={{ fontSize: 44, color: MUT, fontWeight: 700 }}>
          que personas
        </div>
      </div>

      {/* MENOS CONTROL — golpe final */}
      <AbsoluteFill
        style={{
          backgroundColor: INK,
          justifyContent: "center",
          alignItems: "center",
          opacity: interpolate(frame, [212, 218], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 130,
            letterSpacing: "-0.03em",
            color: CREAM,
            textAlign: "center",
            lineHeight: 1.04,
            scale: String(
              interpolate(frame, [214, 226], [1.8, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.2, 1, 0.3, 1),
              }),
            ),
          }}
        >
          MENOS
          <div style={{ color: ORANGE }}>CONTROL</div>
          <div
            style={{
              fontSize: 40,
              color: MUT,
              fontWeight: 700,
              marginTop: 18,
              opacity: interpolate(frame, [232, 244], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            que nunca
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

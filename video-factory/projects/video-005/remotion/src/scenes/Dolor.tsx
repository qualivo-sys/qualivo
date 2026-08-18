import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { CREAM, FONT, INK, MUT, ORANGE, RED } from "../theme";

const FUGAS: Array<[string, string, number]> = [
  ["Contactos sin responder", "SE ENFRÍAN", 118],
  ["Presupuestos sin seguimiento", "SE PIERDEN", 148],
  ["Oportunidades en el CRM", "SE MUEREN", 178],
];

export const Dolor: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [248, 262], [0, 180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      <Audio src={staticFile("r-dolor.mp3")} from={6} />

      {/* HORAS ENTERRADAS */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 260,
          textAlign: "center",
          fontWeight: 900,
          fontSize: 118,
          lineHeight: 1.02,
          letterSpacing: "-0.03em",
          color: CREAM,
          rotate: `${interpolate(frame, [16, 30], [-8, -2], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}deg`,
          scale: String(
            interpolate(frame, [16, 30], [2.4, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1, 0.3, 1),
            }),
          ),
          opacity: interpolate(frame, [16, 24], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        HORAS
        <div style={{ color: ORANGE }}>ENTERRADAS</div>
        <div style={{ fontSize: 40, color: MUT, fontWeight: 700 }}>
          en tareas repetitivas
        </div>
      </div>

      {/* y el negocio que se escapa */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 720,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.14em",
          color: MUT,
          opacity: interpolate(frame, [100, 112], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Y MIENTRAS TANTO, EL NEGOCIO…
      </div>

      {FUGAS.map(([txt, sello, f0], i) => (
        <div
          key={txt}
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            top: 800 + i * 190,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            padding: "34px 38px",
            borderRadius: 20,
            background: "#141418",
            border: "3px solid rgba(242,238,230,0.14)",
            opacity: interpolate(frame, [f0, f0 + 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `0px ${interpolate(frame, [f0, f0 + 12], [90, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1.35, 0.4, 1),
            })}px`,
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 44, color: CREAM }}>
            {txt}
          </span>
          <span
            style={{
              fontWeight: 900,
              fontSize: 30,
              letterSpacing: "0.1em",
              color: RED,
              border: `4px solid ${RED}`,
              borderRadius: 12,
              padding: "10px 16px",
              rotate: "-4deg",
              whiteSpace: "nowrap",
              scale: String(
                interpolate(frame, [f0 + 10, f0 + 20], [2.2, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.2, 1, 0.3, 1),
                }),
              ),
              opacity: interpolate(frame, [f0 + 10, f0 + 16], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {sello}
          </span>
        </div>
      ))}

      {/* TIEMPO PERDIDO = DINERO PERDIDO (volteo) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1480,
          textAlign: "center",
          fontWeight: 900,
          fontSize: 84,
          letterSpacing: "-0.03em",
          opacity: interpolate(frame, [232, 244], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ color: CREAM, display: "inline-block", perspective: 600 }}>
          <span
            style={{
              display: "inline-block",
              rotate: `x ${flip > 90 ? flip - 180 : flip}deg`,
              color: flip > 90 ? ORANGE : CREAM,
            }}
          >
            {flip > 90 ? "DINERO" : "TIEMPO"}
          </span>{" "}
          PERDIDO
        </span>
        <div
          style={{
            fontSize: 44,
            color: MUT,
            fontWeight: 800,
            marginTop: 16,
            scale: String(
              interpolate(frame, [300, 312, 400], [0.6, 1.08, 1.14], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.2, 1.2, 0.4, 1),
              }),
            ),
            opacity: interpolate(frame, [300, 310], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          TODAS LAS SEMANAS.
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { CREAM, DISPLAY, FONT, INK, MUT, ORANGE, kicker } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const NODOS: Array<[string, number, number, boolean]> = [
  ["Captación", 250, 760, false],
  ["Ventas", 760, 700, true],
  ["Operaciones", 220, 960, false],
  ["Personas", 780, 920, false],
  ["Procesos", 330, 1150, true],
  ["Dinero", 730, 1130, false],
];

const CADENA = ["FUGA", "PUESTO", "EMPLEADO DIGITAL"];

export const Pasos: React.FC = () => {
  const frame = useCurrentFrame();
  const fase2 = frame >= 224;

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      <Audio src={staticFile("v10-t4.mp3")} from={12} />

      {/* titular fijo */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 210,
          fontWeight: 800,
          fontSize: 62,
          lineHeight: 1.14,
          letterSpacing: "-0.02em",
          color: CREAM,
          opacity: interpolate(frame, [8, 20], [0, 1], { ...clamp }),
        }}
      >
        La salida no es{" "}
        <span style={{ position: "relative", whiteSpace: "nowrap" }}>
          otra herramienta
          <span
            style={{
              position: "absolute",
              left: 0,
              top: "54%",
              height: 9,
              background: ORANGE,
              borderRadius: 5,
              width: `${interpolate(frame, [42, 58], [0, 100], {
                ...clamp,
                easing: Easing.bezier(0.2, 1, 0.3, 1),
              })}%`,
            }}
          />
        </span>
        .
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 380,
          fontFamily: DISPLAY,
          fontSize: 118,
          color: ORANGE,
          opacity: interpolate(frame, [66, 74], [0, 1], { ...clamp }),
          scale: String(
            interpolate(frame, [66, 80], [0.4, 1], {
              ...clamp,
              easing: Easing.bezier(0.2, 1.35, 0.4, 1),
            }),
          ),
        }}
      >
        SON DOS PASOS.
      </div>

      {/* PASO 1 · levantar el capó */}
      <AbsoluteFill style={{ opacity: fase2 ? 0 : 1 }}>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 620,
            ...kicker,
            color: MUT,
            opacity: interpolate(frame, [94, 106], [0, 1], { ...clamp }),
          }}
        >
          1 · LEVANTAR EL CAPÓ
        </div>
        <svg
          width="1080"
          height="1920"
          style={{ position: "absolute", left: 0, top: 0 }}
        >
          {NODOS.map(([, x1, y1], i) =>
            NODOS.slice(i + 1).map(([, x2, y2], j) => {
              const d = Math.hypot(x1 - x2, y1 - y2);
              if (d > 460) return null;
              return (
                <line
                  key={`${i}-${j}`}
                  x1={x1 + 90}
                  y1={y1 + 34}
                  x2={x2 + 90}
                  y2={y2 + 34}
                  stroke="rgba(242,238,230,0.2)"
                  strokeWidth={3}
                  strokeDasharray={d}
                  strokeDashoffset={interpolate(frame, [112, 150], [d, 0], {
                    ...clamp,
                  })}
                />
              );
            }),
          )}
        </svg>
        {NODOS.map(([txt, x, y, rojo], i) => (
          <div
            key={txt}
            style={{
              position: "absolute",
              left: x,
              top: y,
              padding: "16px 26px",
              borderRadius: 14,
              background: "#141418",
              border: `3px solid ${
                rojo && frame > 168 ? ORANGE : "rgba(242,238,230,0.22)"
              }`,
              color: rojo && frame > 168 ? ORANGE : CREAM,
              fontFamily: "'Space Grotesk', monospace",
              fontWeight: 700,
              fontSize: 34,
              opacity: interpolate(frame, [100 + i * 7, 110 + i * 7], [0, 1], {
                ...clamp,
              }),
              scale: String(
                interpolate(frame, [100 + i * 7, 114 + i * 7], [0.5, 1], {
                  ...clamp,
                  easing: Easing.bezier(0.2, 1.35, 0.4, 1),
                }),
              ),
              boxShadow:
                rojo && frame > 168
                  ? `0 0 ${26 + 12 * Math.sin(frame / 5)}px rgba(232,89,12,0.5)`
                  : "none",
            }}
          >
            {txt}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 1330,
            fontWeight: 800,
            fontSize: 46,
            lineHeight: 1.3,
            color: CREAM,
            opacity: interpolate(frame, [175, 190], [0, 1], { ...clamp }),
          }}
        >
          Dónde se pierde <span style={{ color: ORANGE }}>el tiempo</span>.
          <br />
          Por dónde se escapa <span style={{ color: ORANGE }}>el dinero</span>.
        </div>
      </AbsoluteFill>

      {/* PASO 2 · convertir cada fuga en un puesto */}
      <AbsoluteFill style={{ opacity: fase2 ? 1 : 0 }}>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 620,
            ...kicker,
            color: MUT,
          }}
        >
          2 · CADA FUGA, UN PUESTO
        </div>
        {CADENA.map((txt, i) => {
          const f0 = 238 + i * 30;
          const esUltimo = i === CADENA.length - 1;
          return (
            <React.Fragment key={txt}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 730 + i * 230,
                  textAlign: "center",
                  opacity: interpolate(frame, [f0, f0 + 8], [0, 1], {
                    ...clamp,
                  }),
                  scale: String(
                    interpolate(frame, [f0, f0 + 13], [0.4, 1], {
                      ...clamp,
                      easing: Easing.bezier(0.2, 1.35, 0.4, 1),
                    }),
                  ),
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: DISPLAY,
                    fontSize: esUltimo ? 74 : 60,
                    letterSpacing: "0.03em",
                    padding: "24px 46px",
                    borderRadius: 16,
                    background: esUltimo ? ORANGE : "#141418",
                    color: esUltimo ? INK : CREAM,
                    border: esUltimo
                      ? "none"
                      : "3px solid rgba(242,238,230,0.28)",
                  }}
                >
                  {txt}
                </span>
              </div>
              {i < CADENA.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 858 + i * 230,
                    textAlign: "center",
                    fontSize: 60,
                    color: MUT,
                    opacity: interpolate(frame, [f0 + 16, f0 + 24], [0, 1], {
                      ...clamp,
                    }),
                  }}
                >
                  ↓
                </div>
              )}
            </React.Fragment>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1480,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 44,
            color: MUT,
            opacity: interpolate(frame, [356, 372], [0, 1], { ...clamp }),
          }}
        >
          Cada uno con su{" "}
          <span style={{ color: CREAM }}>responsable humano</span>.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

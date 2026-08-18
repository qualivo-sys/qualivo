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

const NODOS: Array<[string, number, number, boolean]> = [
  ["Captación", 250, 700, false],
  ["Ventas", 760, 640, true],
  ["Operaciones", 220, 900, false],
  ["Personas", 780, 860, false],
  ["Procesos", 330, 1090, true],
  ["Dinero", 730, 1070, false],
];

const CADENA = ["FUGA", "PUESTO", "EMPLEADO DIGITAL"];

export const Pasos: React.FC = () => {
  const frame = useCurrentFrame();
  const fase2 = frame >= 300; // segunda mitad: convertir la fuga en un puesto

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      <Audio src={staticFile("r-pasos.mp3")} from={6} />

      {/* LA SALIDA NO ES OTRA HERRAMIENTA (tachado animado) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 210,
          fontWeight: 900,
          fontSize: 74,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          color: CREAM,
          opacity: interpolate(frame, [6, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
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
              height: 10,
              background: ORANGE,
              borderRadius: 5,
              width: `${interpolate(frame, [40, 58], [0, 100], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
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
          top: 400,
          fontWeight: 900,
          fontSize: 96,
          color: ORANGE,
          letterSpacing: "-0.03em",
          opacity: interpolate(frame, [62, 74], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: String(
            interpolate(frame, [62, 76], [0.5, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.2, 1.35, 0.4, 1),
            }),
          ),
        }}
      >
        SON DOS PASOS.
      </div>

      {/* PASO 1 · el capó */}
      <AbsoluteFill style={{ opacity: fase2 ? 0 : 1 }}>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 570,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.14em",
            color: MUT,
            opacity: interpolate(frame, [96, 108], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
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
                  strokeDashoffset={interpolate(
                    frame,
                    [120, 160],
                    [d, 0],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    },
                  )}
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
              padding: "18px 28px",
              borderRadius: 16,
              background: "#141418",
              border: `4px solid ${
                rojo && frame > 190 ? ORANGE : "rgba(242,238,230,0.25)"
              }`,
              color: rojo && frame > 190 ? ORANGE : CREAM,
              fontWeight: 800,
              fontSize: 36,
              opacity: interpolate(frame, [108 + i * 8, 118 + i * 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              scale: String(
                interpolate(frame, [108 + i * 8, 122 + i * 8], [0.5, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.2, 1.35, 0.4, 1),
                }),
              ),
              boxShadow:
                rojo && frame > 190
                  ? `0 0 ${28 + 14 * Math.sin(frame / 5)}px rgba(232,89,12,0.5)`
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
            top: 1260,
            fontWeight: 800,
            fontSize: 44,
            lineHeight: 1.3,
            color: CREAM,
            opacity: interpolate(frame, [205, 220], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
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
            top: 570,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.14em",
            color: MUT,
          }}
        >
          2 · CONVERTIR CADA FUGA EN UN PUESTO
        </div>
        {CADENA.map((txt, i) => {
          const f0 = 316 + i * 34;
          const esUltimo = i === CADENA.length - 1;
          return (
            <React.Fragment key={txt}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 700 + i * 240,
                  textAlign: "center",
                  opacity: interpolate(frame, [f0, f0 + 10], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  scale: String(
                    interpolate(frame, [f0, f0 + 14], [0.4, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.2, 1.35, 0.4, 1),
                    }),
                  ),
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontWeight: 900,
                    fontSize: esUltimo ? 62 : 50,
                    letterSpacing: "0.04em",
                    padding: "26px 44px",
                    borderRadius: 18,
                    background: esUltimo ? ORANGE : "#141418",
                    color: esUltimo ? INK : CREAM,
                    border: esUltimo
                      ? "none"
                      : "4px solid rgba(242,238,230,0.3)",
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
                    top: 830 + i * 240,
                    textAlign: "center",
                    fontSize: 64,
                    color: MUT,
                    opacity: interpolate(
                      frame,
                      [f0 + 20, f0 + 28],
                      [0, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      },
                    ),
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
            opacity: interpolate(frame, [452, 468], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Cada uno con su{" "}
          <span style={{ color: CREAM }}>responsable humano</span>.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

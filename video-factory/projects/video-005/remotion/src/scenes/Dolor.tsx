import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Video } from "@remotion/media";
import { CREAM, DISPLAY, FONT, INK, MUT, ORANGE, RED, kicker } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FUGAS: Array<[string, string, number]> = [
  ["CONTACTOS SIN RESPONDER", "SE ENFRÍAN", 66],
  ["PRESUPUESTOS SIN SEGUIMIENTO", "SE PIERDEN", 114],
];

export const Dolor: React.FC = () => {
  const frame = useCurrentFrame();
  const faseFugas = frame >= 62;

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>

      {/* FASE A · HORAS ENTERRADAS sobre metraje real (espaldas) */}
      {!faseFugas && (
        <AbsoluteFill>
          <Video
            src={staticFile("k2.mp4")}
            playbackRate={0.85}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: String(
                interpolate(frame, [0, 62], [1, 1.07], { ...clamp }),
              ),
            }}
          />
          <AbsoluteFill style={{ background: "rgba(10,10,11,0.66)" }} />
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 200,
                  lineHeight: 0.95,
                  color: CREAM,
                  rotate: `${interpolate(frame, [12, 26], [-7, -2], {
                    ...clamp,
                  })}deg`,
                  scale: String(
                    interpolate(frame, [12, 26], [2.6, 1], {
                      ...clamp,
                      easing: Easing.bezier(0.2, 1, 0.3, 1),
                    }),
                  ),
                  opacity: interpolate(frame, [12, 20], [0, 1], { ...clamp }),
                }}
              >
                HORAS
                <div style={{ color: ORANGE, fontSize: 148 }}>ENTERRADAS</div>
              </div>
              <div
                style={{
                  ...kicker,
                  fontSize: 34,
                  color: CREAM,
                  marginTop: 34,
                  opacity: interpolate(frame, [38, 48], [0, 1], { ...clamp }),
                }}
              >
                CADA SEMANA
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* FASE B · las fugas de negocio */}
      {faseFugas && (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 260,
              ...kicker,
              color: RED,
              opacity: interpolate(frame, [64, 74], [0, 1], { ...clamp }),
            }}
          >
            Y MIENTRAS, EL NEGOCIO
          </div>

          {FUGAS.map(([txt, sello, f0], i) => (
            <div
              key={txt}
              style={{
                position: "absolute",
                left: 80,
                right: 80,
                top: 380 + i * 380,
                opacity: interpolate(frame, [f0, f0 + 8], [0, 1], {
                  ...clamp,
                }),
                translate: `0px ${interpolate(frame, [f0, f0 + 12], [80, 0], {
                  ...clamp,
                  easing: Easing.bezier(0.2, 1.3, 0.4, 1),
                })}px`,
              }}
            >
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 84,
                  lineHeight: 1.02,
                  color: CREAM,
                  maxWidth: 760,
                }}
              >
                {txt}
              </div>
              <div
                style={{
                  display: "inline-block",
                  marginTop: 22,
                  fontFamily: DISPLAY,
                  fontSize: 52,
                  letterSpacing: "0.06em",
                  color: RED,
                  border: `5px solid ${RED}`,
                  borderRadius: 12,
                  padding: "10px 26px",
                  rotate: "-4deg",
                  scale: String(
                    interpolate(frame, [f0 + 14, f0 + 24], [2.4, 1], {
                      ...clamp,
                      easing: Easing.bezier(0.2, 1, 0.3, 1),
                    }),
                  ),
                  opacity: interpolate(frame, [f0 + 14, f0 + 20], [0, 1], {
                    ...clamp,
                  }),
                }}
              >
                {sello}
              </div>
            </div>
          ))}

          {/* TIEMPO PERDIDO = DINERO PERDIDO */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1250,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 92,
                color: CREAM,
                opacity: interpolate(frame, [195, 203], [0, 1], { ...clamp }),
                scale: String(
                  interpolate(frame, [195, 207], [1.8, 1], {
                    ...clamp,
                    easing: Easing.bezier(0.2, 1, 0.3, 1),
                  }),
                ),
              }}
            >
              TIEMPO PERDIDO
            </div>
            <div
              style={{
                fontFamily: DISPLAY,
                fontSize: 100,
                color: ORANGE,
                marginTop: 8,
                opacity: interpolate(frame, [222, 230], [0, 1], { ...clamp }),
                scale: String(
                  interpolate(frame, [222, 236], [2.2, 1], {
                    ...clamp,
                    easing: Easing.bezier(0.2, 1, 0.3, 1),
                  }),
                ),
              }}
            >
              = DINERO PERDIDO
            </div>
            <div
              style={{
                ...kicker,
                fontSize: 30,
                color: MUT,
                marginTop: 34,
                opacity: interpolate(frame, [258, 270], [0, 1], { ...clamp }),
              }}
            >
              TODAS LAS SEMANAS
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

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

const PANTALLAS: Array<[string, string, number, number, number, number]> = [
  // src, etiqueta, x, y, ángulo, frame de entrada
  ["sc-whatsapp.mp4", "WHATSAPP", 70, 1010, -5, 88],
  ["sc-crm.mp4", "CRM", 550, 1090, 4, 100],
  ["sc-sheets.mp4", "HOJAS", 110, 1370, -3, 112],
  ["sc-correo.mp4", "CORREO", 590, 1450, 5, 124],
];

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const faseSlam = frame >= 62;
  const faseControl = frame >= 138;

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      <Audio src={staticFile("v10-t1.mp3")} from={6} />

      {/* FASE A · pregunta sobre metraje real (portátil) */}
      {!faseSlam && (
        <AbsoluteFill>
          <Video
            src={staticFile("k4.mp4")}
            playbackRate={0.85}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: String(
                interpolate(frame, [0, 62], [1.06, 1], { ...clamp }),
              ),
            }}
          />
          <AbsoluteFill style={{ background: "rgba(10,10,11,0.62)" }} />
          <div
            style={{
              position: "absolute",
              left: 80,
              top: 300,
              ...kicker,
              color: ORANGE,
              opacity: interpolate(frame, [2, 12], [0, 1], { ...clamp }),
            }}
          >
            UNA PREGUNTA
          </div>
          <div
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 370,
              fontWeight: 800,
              fontSize: 78,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: CREAM,
              opacity: interpolate(frame, [6, 18], [0, 1], { ...clamp }),
              translate: `0px ${interpolate(frame, [6, 20], [40, 0], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}px`,
            }}
          >
            ¿Sabes qué tiene hoy cualquier empresa?
          </div>
        </AbsoluteFill>
      )}

      {/* FASE B · MÁS HERRAMIENTAS QUE PERSONAS + ráfaga de pantallas reales */}
      {faseSlam && !faseControl && (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: 70,
              right: 70,
              top: 220,
              fontFamily: DISPLAY,
              fontSize: 210,
              lineHeight: 0.95,
              color: ORANGE,
              scale: String(
                interpolate(frame, [62, 74], [2.2, 1], {
                  ...clamp,
                  easing: Easing.bezier(0.2, 1, 0.3, 1),
                }),
              ),
              opacity: interpolate(frame, [62, 68], [0, 1], { ...clamp }),
            }}
          >
            MÁS
            <div style={{ fontSize: 138, color: CREAM }}>HERRAMIENTAS</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 700,
              fontFamily: DISPLAY,
              fontSize: 96,
              color: MUT,
              opacity: interpolate(frame, [76, 84], [0, 1], { ...clamp }),
              translate: `0px ${interpolate(frame, [76, 88], [50, 0], {
                ...clamp,
                easing: Easing.bezier(0.2, 1.3, 0.4, 1),
              })}px`,
            }}
          >
            QUE PERSONAS
          </div>
          {PANTALLAS.map(([src, tag, x, y, ang, f0]) => (
            <div
              key={src}
              style={{
                position: "absolute",
                left: x,
                top: y,
                rotate: `${ang}deg`,
                opacity: interpolate(frame, [f0, f0 + 6], [0, 1], {
                  ...clamp,
                }),
                scale: String(
                  interpolate(frame, [f0, f0 + 12], [0.4, 1], {
                    ...clamp,
                    easing: Easing.bezier(0.2, 1.35, 0.4, 1),
                  }),
                ),
              }}
            >
              <Video
                src={staticFile(src)}
                muted
                style={{
                  width: 420,
                  height: 300,
                  objectFit: "cover",
                  objectPosition: "center top",
                  borderRadius: 18,
                  border: "3px solid rgba(242,238,230,0.25)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
                }}
              />
              <div
                style={{
                  ...kicker,
                  fontSize: 22,
                  color: MUT,
                  marginTop: 10,
                }}
              >
                {tag}
              </div>
            </div>
          ))}
        </AbsoluteFill>
      )}

      {/* FASE C · MENOS CONTROL sobre metraje del móvil */}
      {faseControl && (
        <AbsoluteFill>
          <Video
            src={staticFile("k6.mp4")}
            trimBefore={30}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: String(
                interpolate(frame, [138, 195], [1, 1.08], { ...clamp }),
              ),
            }}
          />
          <AbsoluteFill style={{ background: "rgba(10,10,11,0.68)" }} />
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 190,
                  lineHeight: 0.95,
                  color: CREAM,
                  scale: String(
                    interpolate(frame, [138, 150], [2.4, 1], {
                      ...clamp,
                      easing: Easing.bezier(0.2, 1, 0.3, 1),
                    }),
                  ),
                  opacity: interpolate(frame, [138, 144], [0, 1], {
                    ...clamp,
                  }),
                }}
              >
                MENOS
                <div style={{ color: ORANGE }}>CONTROL</div>
              </div>
              <div
                style={{
                  ...kicker,
                  fontSize: 34,
                  color: CREAM,
                  marginTop: 30,
                  opacity: interpolate(frame, [160, 170], [0, 1], {
                    ...clamp,
                  }),
                }}
              >
                QUE NUNCA
              </div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

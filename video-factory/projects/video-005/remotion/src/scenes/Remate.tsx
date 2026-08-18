import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  CREAM,
  DISPLAY,
  FONT,
  GREEN,
  INK,
  MUT,
  ORANGE,
  kicker,
} from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Escena de 480f (16s). VO t5a (lo que hizo el agente) sobre la fase de
// montaje; logos solo con música y rótulos; tesis SOLO en pantalla;
// VO t5b = CTA «escríbeme» con @maikel.echevarria en pantalla.
const PISTAS: Array<[string, string[], string]> = [
  ["GUION", ["idea", "guion"], "#E8B84B"],
  ["VÍDEO", ["hook", "problema", "dolor", "pasos"], ORANGE],
  ["VOZ", ["narración"], "#5B8DEF"],
  ["MÚSICA", ["hip jazz"], "#B48EE0"],
];

export const Remate: React.FC = () => {
  const frame = useCurrentFrame();
  const faseLogos = frame >= 150;

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      {/* FASE A · la timeline de este mismo vídeo */}
      <AbsoluteFill style={{ opacity: faseLogos ? 0 : 1 }}>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 340,
            ...kicker,
            color: MUT,
            opacity: interpolate(frame, [4, 12], [0, 1], { ...clamp }),
          }}
        >
          MONTAJE · ESTE-VIDEO.MP4
        </div>
        {PISTAS.map(([et, clips, col], pi) => (
          <div
            key={et}
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 430 + pi * 150,
            }}
          >
            <div
              style={{
                ...kicker,
                fontSize: 22,
                color: "rgba(242,238,230,0.45)",
                marginBottom: 12,
              }}
            >
              {et}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {clips.map((c, ci) => (
                <span
                  key={c}
                  style={{
                    background: col,
                    color: INK,
                    borderRadius: 10,
                    padding: "16px 26px",
                    fontFamily: "'Space Grotesk', monospace",
                    fontWeight: 700,
                    fontSize: 27,
                    opacity: interpolate(
                      frame,
                      [6 + (pi * 4 + ci) * 6, 14 + (pi * 4 + ci) * 6],
                      [0, 1],
                      { ...clamp },
                    ),
                    scale: String(
                      interpolate(
                        frame,
                        [6 + (pi * 4 + ci) * 6, 18 + (pi * 4 + ci) * 6],
                        [0.6, 1],
                        {
                          ...clamp,
                          easing: Easing.bezier(0.2, 1.35, 0.4, 1),
                        },
                      ),
                    ),
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 1130,
            fontWeight: 800,
            fontSize: 62,
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            color: CREAM,
            opacity: interpolate(frame, [26, 40], [0, 1], { ...clamp }),
            translate: `0px ${interpolate(frame, [26, 42], [40, 0], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}px`,
          }}
        >
          Este vídeo lo ha narrado y montado{" "}
          <span style={{ color: ORANGE }}>un empleado digital</span>.
        </div>
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 1390,
            fontWeight: 700,
            fontSize: 40,
            lineHeight: 1.4,
            color: MUT,
            opacity: interpolate(frame, [100, 114], [0, 1], { ...clamp }),
          }}
        >
          Investigó la idea · escribió el guion
          <br />
          generó las imágenes · lo montó
        </div>
      </AbsoluteFill>

      {/* FASE B · logos + tesis (solo pantalla) + CTA */}
      <AbsoluteFill
        style={{
          opacity: faseLogos
            ? interpolate(frame, [150, 160], [0, 1], { ...clamp })
            : 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={staticFile("qualivo.png")}
            style={{
              width: 360,
              scale: String(
                interpolate(frame, [152, 166], [0.6, 1], {
                  ...clamp,
                  easing: Easing.bezier(0.2, 1.3, 0.4, 1),
                }),
              ),
            }}
            alt="Qualivo"
          />
          <div
            style={{
              ...kicker,
              fontSize: 25,
              color: ORANGE,
              marginTop: 16,
              opacity: interpolate(frame, [170, 180], [0, 1], { ...clamp }),
            }}
          >
            ENCUENTRA LA FUGA
          </div>
          <div
            style={{
              margin: "20px auto",
              width: 7,
              borderRadius: 4,
              background: `linear-gradient(${ORANGE}, ${GREEN})`,
              height: interpolate(frame, [190, 206], [0, 76], {
                ...clamp,
                easing: Easing.bezier(0.2, 1, 0.3, 1),
              }),
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              opacity: interpolate(frame, [206, 218], [0, 1], { ...clamp }),
            }}
          >
            <img
              src={staticFile("afm.svg")}
              style={{ width: 84, borderRadius: 18 }}
              alt="Agent for Me"
            />
            <span style={{ fontWeight: 900, fontSize: 52, color: CREAM }}>
              Agent <span style={{ color: GREEN }}>for</span> Me
            </span>
          </div>
          <div
            style={{
              ...kicker,
              fontSize: 25,
              color: GREEN,
              marginTop: 16,
              opacity: interpolate(frame, [228, 238], [0, 1], { ...clamp }),
            }}
          >
            CONSTRUYE AL QUE LA TAPA
          </div>
          <div
            style={{
              marginTop: 60,
              fontFamily: DISPLAY,
              fontSize: 56,
              lineHeight: 1.16,
              color: CREAM,
              opacity: interpolate(frame, [244, 257], [0, 1], { ...clamp }),
              translate: `0px ${interpolate(frame, [244, 259], [40, 0], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}px`,
            }}
          >
            PRIMERO ENTIENDES EL NEGOCIO.
            <div style={{ color: ORANGE, marginTop: 8 }}>
              DESPUÉS DECIDES QUÉ CONSTRUIR.
            </div>
          </div>
          <div
            style={{
              marginTop: 56,
              opacity: interpolate(frame, [290, 304], [0, 1], { ...clamp }),
              scale: String(
                interpolate(frame, [290, 306], [0.7, 1], {
                  ...clamp,
                  easing: Easing.bezier(0.2, 1.3, 0.4, 1),
                }),
              ),
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 38,
                lineHeight: 1.35,
                color: CREAM,
                maxWidth: 860,
                margin: "0 auto",
              }}
            >
              ¿Analizamos qué procesos puede llevar un{" "}
              <span style={{ color: ORANGE }}>empleado digital</span> en tu
              empresa?
            </div>
            <div style={{ ...kicker, fontSize: 26, color: MUT, marginTop: 22 }}>
              SÍGUEME Y ESCRÍBEME
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: DISPLAY,
                fontSize: 66,
                color: ORANGE,
              }}
            >
              @maikel.echevarria
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

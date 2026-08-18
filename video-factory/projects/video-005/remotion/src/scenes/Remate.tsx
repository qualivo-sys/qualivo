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

const PISTAS: Array<[string, string[], string]> = [
  ["VÍDEO", ["hook", "problema", "dolor", "pasos"], ORANGE],
  ["VOZ", ["narración"], "#5B8DEF"],
  ["MÚSICA", ["beat 122"], "#B48EE0"],
];

export const Remate: React.FC = () => {
  const frame = useCurrentFrame();
  const faseLogos = frame >= 142;

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>

      {/* FASE A · la timeline de este mismo vídeo */}
      <AbsoluteFill style={{ opacity: faseLogos ? 0 : 1 }}>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 380,
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
              top: 470 + pi * 160,
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
                    padding: "18px 28px",
                    fontFamily: "'Space Grotesk', monospace",
                    fontWeight: 700,
                    fontSize: 28,
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
            top: 1080,
            fontWeight: 800,
            fontSize: 66,
            lineHeight: 1.16,
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
      </AbsoluteFill>

      {/* FASE B · logos + tesis */}
      <AbsoluteFill
        style={{
          opacity: faseLogos
            ? interpolate(frame, [142, 152], [0, 1], { ...clamp })
            : 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={staticFile("qualivo.png")}
            style={{
              width: 400,
              scale: String(
                interpolate(frame, [144, 158], [0.6, 1], {
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
              fontSize: 26,
              color: ORANGE,
              marginTop: 18,
              opacity: interpolate(frame, [162, 172], [0, 1], { ...clamp }),
            }}
          >
            ENCUENTRA LA FUGA
          </div>
          <div
            style={{
              margin: "24px auto",
              width: 7,
              borderRadius: 4,
              background: `linear-gradient(${ORANGE}, ${GREEN})`,
              height: interpolate(frame, [182, 198], [0, 90], {
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
              gap: 22,
              opacity: interpolate(frame, [198, 210], [0, 1], { ...clamp }),
            }}
          >
            <img
              src={staticFile("afm.svg")}
              style={{ width: 92, borderRadius: 20 }}
              alt="Agent for Me"
            />
            <span style={{ fontWeight: 900, fontSize: 56, color: CREAM }}>
              Agent <span style={{ color: GREEN }}>for</span> Me
            </span>
          </div>
          <div
            style={{
              ...kicker,
              fontSize: 26,
              color: GREEN,
              marginTop: 18,
              opacity: interpolate(frame, [220, 230], [0, 1], { ...clamp }),
            }}
          >
            CONSTRUYE AL QUE LA TAPA
          </div>
          <div
            style={{
              marginTop: 80,
              fontFamily: DISPLAY,
              fontSize: 64,
              lineHeight: 1.14,
              color: CREAM,
              opacity: interpolate(frame, [240, 253], [0, 1], { ...clamp }),
              translate: `0px ${interpolate(frame, [240, 255], [40, 0], {
                ...clamp,
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}px`,
            }}
          >
            PRIMERO ENTIENDES
            <br />
            EL NEGOCIO.
            <div style={{ color: ORANGE, marginTop: 10 }}>
              DESPUÉS DECIDES
              <br />
              QUÉ CONSTRUIR.
            </div>
          </div>
          <div
            style={{
              marginTop: 46,
              fontWeight: 700,
              fontSize: 30,
              color: MUT,
              opacity: interpolate(frame, [300, 314], [0, 1], { ...clamp }),
            }}
          >
            Maikel Echevarría · Building in public
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

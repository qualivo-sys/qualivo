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

const PISTAS: Array<[string, string[], string]> = [
  ["VÍDEO", ["hook", "problema", "dolor", "pasos"], ORANGE],
  ["VOZ", ["narración"], "#5B8DEF"],
  ["MÚSICA", ["beat 104"], "#B48EE0"],
];

export const Remate: React.FC = () => {
  const frame = useCurrentFrame();
  const faseLogos = frame >= 150;

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      <Audio src={staticFile("t5-remate.mp3")} from={10} />

      {/* la timeline del propio vídeo */}
      <AbsoluteFill style={{ opacity: faseLogos ? 0 : 1 }}>
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 420,
            fontFamily: "ui-monospace, monospace",
            fontSize: 30,
            letterSpacing: "0.12em",
            color: MUT,
          }}
        >
          MONTAJE · este-video.mp4
        </div>
        {PISTAS.map(([et, clips, col], pi) => (
          <div
            key={et}
            style={{ position: "absolute", left: 80, right: 80, top: 520 + pi * 170 }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 24,
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
                    padding: "20px 30px",
                    fontWeight: 800,
                    fontSize: 30,
                    opacity: interpolate(
                      frame,
                      [10 + (pi * 4 + ci) * 9, 20 + (pi * 4 + ci) * 9],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    ),
                    scale: String(
                      interpolate(
                        frame,
                        [10 + (pi * 4 + ci) * 9, 24 + (pi * 4 + ci) * 9],
                        [0.6, 1],
                        {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
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
            top: 1120,
            fontWeight: 900,
            fontSize: 64,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: CREAM,
            opacity: interpolate(frame, [55, 70], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Este vídeo lo ha narrado y montado{" "}
          <span style={{ color: ORANGE }}>un empleado digital</span>.
        </div>
      </AbsoluteFill>

      {/* logos + tesis */}
      <AbsoluteFill
        style={{
          opacity: faseLogos
            ? interpolate(frame, [150, 162], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={staticFile("qualivo.png")}
            style={{ width: 380 }}
            alt="Qualivo"
          />
          <div
            style={{
              margin: "26px auto",
              width: 8,
              borderRadius: 4,
              background: `linear-gradient(${ORANGE}, #0FA968)`,
              height: interpolate(frame, [168, 186], [0, 110], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
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
              opacity: interpolate(frame, [184, 196], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <img
              src={staticFile("afm.svg")}
              style={{ width: 96, borderRadius: 22 }}
              alt="Agent for Me"
            />
            <span
              style={{
                fontWeight: 900,
                fontSize: 58,
                color: CREAM,
              }}
            >
              Agent <span style={{ color: "#0FA968" }}>for</span> Me
            </span>
          </div>
          <div
            style={{
              marginTop: 70,
              fontWeight: 900,
              fontSize: 58,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: CREAM,
              opacity: interpolate(frame, [200, 214], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: `0px ${interpolate(frame, [200, 216], [40, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}px`,
            }}
          >
            PRIMERO ENTIENDES EL NEGOCIO.
            <br />
            <span style={{ color: ORANGE }}>
              DESPUÉS DECIDES QUÉ CONSTRUIR.
            </span>
          </div>
          <div
            style={{
              marginTop: 44,
              fontWeight: 700,
              fontSize: 30,
              color: MUT,
              opacity: interpolate(frame, [214, 226], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Maikel Echevarría · Building in public
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

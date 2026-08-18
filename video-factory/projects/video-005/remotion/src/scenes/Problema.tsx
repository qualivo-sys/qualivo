import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Video } from "@remotion/media";
import { FONT, INK, ORANGE } from "../theme";
import { Cue, Subs } from "../Subs";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// VO t2 (9.7s) arranca en el 0.23s de la escena (320f = 10.67s).
// f0-52 teclado · f52-142 pantalla partida (correo/CRM/hojas) ·
// f142+ cortes a pantalla completa sincronizados con la enumeración.

const BANDAS: Array<[string, string, number, boolean, number]> = [
  // src, etiqueta, frame de entrada, desde la izquierda, playbackRate
  ["sc-correo.mp4", "CORREO", 56, true, 0.9],
  ["sc-crm.mp4", "CRM", 76, false, 0.8],
  ["sc-sheets.mp4", "HOJAS DE CÁLCULO", 114, true, 0.6],
];

const PLANOS: Array<[string, number, number, number]> = [
  // src, frame inicio, frame fin, playbackRate
  ["sc-sheets.mp4", 142, 176, 0.6],
  ["sc-buscar.mp4", 176, 210, 0.65],
  ["sc-whatsapp.mp4", 210, 255, 0.42],
  ["teclado.mp4", 255, 320, 0.45],
];

const CUES: Cue[] = [
  {
    t0: 0.25,
    t1: 1.9,
    lines: [
      { text: "Porque tu equipo vive", font: FONT, weight: 800, size: 56 },
      { text: "saltando entre…", font: FONT, weight: 800, size: 56 },
    ],
  },
  { t0: 4.85, t1: 5.92, lines: [{ text: "COPIANDO DATOS", size: 96 }] },
  { t0: 5.95, t1: 7.06, lines: [{ text: "BUSCANDO ARCHIVOS", size: 96 }] },
  {
    t0: 7.1,
    t1: 8.6,
    lines: [{ text: "PERSIGUIENDO", size: 92 }, { text: "RESPUESTAS", size: 92 }],
  },
  {
    t0: 8.68,
    t1: 10.5,
    lines: [
      { text: "TRABAJO QUE", size: 86 },
      { text: "NO APORTA NADA", color: ORANGE, size: 104 },
    ],
  },
];

export const Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const faseBandas = frame >= 52 && frame < 142;

  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      {/* base: teclado (arranque) */}
      {frame < 52 && (
        <AbsoluteFill>
          <Video
            src={staticFile("teclado.mp4")}
            playbackRate={0.45}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: String(
                interpolate(frame, [0, 52], [1.1, 1.02], { ...clamp }),
              ),
            }}
          />
          <AbsoluteFill style={{ background: "rgba(10,10,11,0.42)" }} />
        </AbsoluteFill>
      )}

      {/* pantalla partida en tres bandas: correo / CRM / hojas */}
      {faseBandas && (
        <AbsoluteFill style={{ background: INK }}>
          {BANDAS.map(([src, tag, f0, izq, rate], i) => (
            <div
              key={src}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: i * 640,
                height: 634,
                overflow: "hidden",
                borderBottom: "3px solid rgba(242,238,230,0.12)",
                translate: `${interpolate(
                  frame,
                  [f0, f0 + 12],
                  [izq ? -1080 : 1080, 0],
                  { ...clamp, easing: Easing.bezier(0.2, 1, 0.3, 1) },
                )}px 0px`,
              }}
            >
              <Video
                src={staticFile(src)}
                muted
                playbackRate={rate}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,11,0.35)" }} />
              <div
                style={{
                  position: "absolute",
                  left: 40,
                  bottom: 30,
                  fontFamily: "Anton, sans-serif",
                  fontSize: 64,
                  color: "#F2EEE6",
                  textShadow: "0 4px 0 rgba(0,0,0,0.55), 0 10px 40px rgba(0,0,0,0.8)",
                }}
              >
                {tag}
              </div>
            </div>
          ))}
        </AbsoluteFill>
      )}

      {/* cortes a pantalla completa */}
      {PLANOS.map(([src, f0, f1, rate], i) =>
        frame >= f0 && frame < f1 ? (
          <AbsoluteFill key={i}>
            <Video
              src={staticFile(src)}
              muted
              playbackRate={rate}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                scale: String(
                  interpolate(frame, [f0, f0 + 10, f1], [1.12, 1.02, 1.06], {
                    ...clamp,
                  }),
                ),
              }}
            />
            <AbsoluteFill style={{ background: "rgba(10,10,11,0.42)" }} />
          </AbsoluteFill>
        ) : null,
      )}

      <Subs cues={CUES} y={1080} />
    </AbsoluteFill>
  );
};

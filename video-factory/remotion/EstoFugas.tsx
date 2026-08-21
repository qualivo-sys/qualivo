import React from "react";
import {
  AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo,
  Sequence, staticFile, useCurrentFrame,
} from "remotion";
import { CREAM, DISPLAY, INK, LABEL, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* tramos del montaje */
const A_DUR = 14.10;   // esto-v1: hook + las cuatro cosas que haces
const B_DUR = 5.70;    // facturas: «y a los tres meses estás exactamente igual»
const C_DUR = 23.10;   // voz en off sobre la tubería
export const ESTO_FUGAS_FRAMES = f(A_DUR + B_DUR + C_DUR);

type Enc = { src: string; desde?: number; zoom: [number, number];
             x?: [number, number]; y?: [number, number]; dur: number; mudo?: boolean };

const Plano: React.FC<Enc> = ({ src, desde = 0, zoom, x = [0, 0], y = [0, 0], dur, mudo }) => {
  const frame = useCurrentFrame();
  const t = [0, f(dur)] as [number, number];
  const e = { ...cl, easing: Easing.inOut(Easing.quad) };
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={Math.round(desde * FPS)}
        muted={mudo}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${interpolate(frame, t, zoom, e)}) translate(${interpolate(frame, t, x, e)}%, ${interpolate(frame, t, y, e)}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Velo: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <AbsoluteFill style={{
    background: `linear-gradient(180deg, rgba(6,6,7,${0.72 * k}) 0%, rgba(6,6,7,${0.20 * k}) 32%,
      rgba(6,6,7,${0.24 * k}) 60%, rgba(6,6,7,${0.86 * k}) 100%)`,
  }} />
);

type Linea = { t: string; naranja?: boolean; tam?: number };
const Rotulo: React.FC<{ lineas: Linea[]; y: number; ent?: number; sal?: number }> = ({
  lineas, y, ent = 0, sal,
}) => {
  const frame = useCurrentFrame();
  const out = sal !== undefined ? interpolate(frame, [f(sal), f(sal) + 6], [1, 0], cl) : 1;
  if (frame < f(ent) - 1) return null;
  return (
    <div style={{ position: "absolute", left: 54, right: 54, top: y, textAlign: "center", opacity: out }}>
      {lineas.map((l, i) => {
        const f0 = f(ent) + i * 4;
        const sube = interpolate(frame, [f0, f0 + 10], [104, 0], {
          ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 2 }}>
            <div style={{
              fontFamily: DISPLAY, fontSize: l.tam ?? 72, lineHeight: 1.18,
              color: l.naranja ? ORANGE : CREAM, transform: `translateY(${sube}%)`,
              textShadow: "0 4px 34px rgba(0,0,0,0.8)",
            }}>{l.t}</div>
          </div>
        );
      })}
    </div>
  );
};

/* chip de fuga: entra cuando la voz la nombra y se queda */
const Chip: React.FC<{ texto: string; ent: number; idx: number }> = ({ texto, ent, idx }) => {
  const frame = useCurrentFrame();
  const f0 = f(ent);
  if (frame < f0) return null;
  const pop = interpolate(frame, [f0, f0 + 8], [0.8, 1], {
    ...cl, easing: Easing.bezier(0.2, 1.45, 0.4, 1),
  });
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, top: 1230 + idx * 112,
      display: "flex", justifyContent: "center",
      transform: `scale(${pop})`, opacity: interpolate(frame, [f0, f0 + 5], [0, 1], cl),
    }}>
      <div style={{
        fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: "0.05em",
        color: CREAM, background: "rgba(8,8,9,0.80)",
        border: `2px solid rgba(232,89,12,0.62)`, borderRadius: 13, padding: "16px 28px",
        maxWidth: 900, textAlign: "center",
      }}>
        <span style={{ color: ORANGE, marginRight: 12 }}>●</span>{texto}
      </div>
    </div>
  );
};

/* ---------- tramo C: la tubería ---------- */
const SUB: Enc[] = [
  { src: "cubo-e3.mp4", desde: 0.8, zoom: [1.72, 1.56], y: [18, 14], dur: 4.0, mudo: true },
  { src: "cubo-e2.mp4", desde: 2.6, zoom: [2.60, 2.80], x: [14, 10], y: [1, 4], dur: 3.1, mudo: true },
  { src: "cubo-e2.mp4", desde: 5.4, zoom: [2.20, 2.35], x: [-4, 0], y: [3, 6], dur: 2.3, mudo: true },
  { src: "cubo-e2.mp4", desde: 0.6, zoom: [2.40, 2.55], x: [8, 4], y: [-2, 1], dur: 1.8, mudo: true },
  { src: "cubo-e2.mp4", desde: 7.2, zoom: [2.00, 2.20], x: [-10, -6], y: [2, 5], dur: 2.7, mudo: true },
  { src: "cubo-e2.mp4", desde: 3.6, zoom: [1.15, 1.30], dur: 3.4, mudo: true },
  { src: "cubo-e5.mp4", desde: 1.6, zoom: [1.90, 1.70], y: [6, 3], dur: 2.1, mudo: true },
  { src: "cubo-e5.mp4", desde: 5.4, zoom: [1.30, 1.45], dur: 3.7, mudo: true },
];
const SUB_INI = SUB.reduce<number[]>((a, s, i) => [...a, i ? a[i - 1] + SUB[i - 1].dur : 0], []);

const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const panel = interpolate(frame, [0, f(0.5)], [0, 0.90], cl);
  const op = interpolate(frame, [f(0.35), f(0.9)], [0, 1], cl);
  const sube = interpolate(frame, [f(0.35), f(1.1)], [26, 0], {
    ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: `rgba(7,7,8,${panel})` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", opacity: op, transform: `translateY(${sube}px)` }}>
          <div style={{
            fontFamily: LABEL, fontWeight: 700, fontSize: 25, letterSpacing: "0.24em",
            color: "rgba(242,238,230,0.55)", textTransform: "uppercase", lineHeight: 1.7,
          }}>¿Dónde pierde<br />tu negocio?</div>
          <div style={{ width: 76, height: 4, background: ORANGE, margin: "38px auto 42px" }} />
          <div style={{ fontFamily: DISPLAY, fontSize: 88, color: CREAM, lineHeight: 1.05 }}>ESCRÍBEME</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 128, color: ORANGE, lineHeight: 1.05 }}>FUGAS</div>
          <Img src={staticFile("qualivo.png")} style={{ height: 60, marginTop: 88 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const EstoFugas: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>

    {/* A · lo que haces cuando el negocio se estanca */}
    <Sequence from={0} durationInFrames={f(A_DUR)} name="A · esto es lo que haces">
      <Plano src="esto-v1.mp4" zoom={[1.0, 1.0]} dur={A_DUR} />
      <Velo k={0.85} />
      <Rotulo ent={0.5} sal={4.6} y={1250} lineas={[
        { t: "TU NEGOCIO", tam: 74 },
        { t: "SE HA ESTANCADO", tam: 74, naranja: true },
      ]} />
      <Rotulo ent={5.9} sal={7.3} y={1330} lineas={[{ t: "MÁS PUBLICIDAD", tam: 78, naranja: true }]} />
      <Rotulo ent={8.1} sal={9.6} y={1330} lineas={[{ t: "OTRA PERSONA", tam: 78, naranja: true }]} />
      <Rotulo ent={10.4} sal={11.7} y={1330} lineas={[{ t: "OTRA HERRAMIENTA", tam: 72, naranja: true }]} />
      <Rotulo ent={12.6} sal={14.0} y={1330} lineas={[{ t: "MÁS HORAS", tam: 78, naranja: true }]} />
    </Sequence>

    {/* B · tres meses después */}
    <Sequence from={f(A_DUR)} durationInFrames={f(B_DUR)} name="B · tres meses">
      <Plano src="esto-facturas.mp4" zoom={[1.10, 1.20]} y={[2, 0]} dur={B_DUR} />
      <Velo k={1.25} />
      <Rotulo ent={1.5} y={1210} lineas={[
        { t: "TRES MESES DESPUÉS", tam: 60 },
        { t: "EXACTAMENTE IGUAL", tam: 80, naranja: true },
      ]} />
    </Sequence>

    {/* C · dónde se estaba escapando */}
    <Sequence from={f(A_DUR + B_DUR)} durationInFrames={f(C_DUR)} name="C · la tubería">
      <Audio src={staticFile("vo-fugas.mp3")} />
      {SUB.map((s, i) => (
        <Sequence key={i} from={f(SUB_INI[i])} durationInFrames={f(s.dur)}>
          <Plano {...s} />
          <Velo />
        </Sequence>
      ))}
      <Rotulo ent={0.5} sal={3.7} y={1300} lineas={[{ t: "NO ERA CUÁNTO METES", tam: 70 }]} />
      <Rotulo ent={4.4} sal={6.9} y={1300} lineas={[
        { t: "ERA POR DÓNDE", tam: 70 },
        { t: "SE ESCAPA", tam: 84, naranja: true },
      ]} />
      <Sequence from={f(7.0)} durationInFrames={f(10.0)}>
        <Chip idx={0} ent={0.3} texto="PREGUNTA Y NADIE RESPONDE" />
        <Chip idx={1} ent={2.7} texto="PROPUESTA QUE LLEGA TARDE" />
        <Chip idx={2} ent={4.6} texto="COMERCIAL HACIENDO PAPELEO" />
      </Sequence>
      <Rotulo ent={14.3} sal={17.1} y={190} lineas={[
        { t: "NO APARECEN", tam: 66 },
        { t: "EN NINGUNA FACTURA", tam: 66, naranja: true },
      ]} />
      <Rotulo ent={17.8} sal={19.5} y={1300} lineas={[{ t: "YO LAS ENCUENTRO", tam: 78, naranja: true }]} />
      <Sequence from={f(19.4)}>
        <Cierre />
      </Sequence>
    </Sequence>
  </AbsoluteFill>
);

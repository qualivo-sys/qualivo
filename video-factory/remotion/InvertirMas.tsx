import React from "react";
import {
  AbsoluteFill, Easing, Img, interpolate, OffthreadVideo,
  Sequence, staticFile, useCurrentFrame,
} from "remotion";
import { CREAM, DISPLAY, INK, LABEL, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- plano: recorte + deriva lenta sobre un clip ya generado ---------- */
type Plano = {
  src: string;
  desde: number;              // segundo de entrada del clip origen
  zoom: [number, number];     // escala inicial -> final
  x?: [number, number];       // desplazamiento horizontal en %
  y?: [number, number];
  dur: number;                // duración del plano
};

const Video: React.FC<Plano> = ({ src, desde, zoom, x = [0, 0], y = [0, 0], dur }) => {
  const frame = useCurrentFrame();
  const t = [0, f(dur)] as [number, number];
  const s = interpolate(frame, t, zoom, { ...cl, easing: Easing.inOut(Easing.quad) });
  const tx = interpolate(frame, t, x, { ...cl, easing: Easing.inOut(Easing.quad) });
  const ty = interpolate(frame, t, y, { ...cl, easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={Math.round(desde * FPS)}
        muted
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${s}) translate(${tx}%, ${ty}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- oscurecido para que el texto respire ---------- */
const Velo: React.FC<{ fuerza?: number }> = ({ fuerza = 1 }) => (
  <AbsoluteFill style={{
    background: `linear-gradient(180deg,
      rgba(6,6,7,${0.80 * fuerza}) 0%,
      rgba(6,6,7,${0.30 * fuerza}) 34%,
      rgba(6,6,7,${0.34 * fuerza}) 60%,
      rgba(6,6,7,${0.86 * fuerza}) 100%)`,
  }} />
);

/* ---------- título: cada línea sube desde su propia máscara ---------- */
type Linea = { t: string; naranja?: boolean; tam?: number };

const Titulo: React.FC<{
  lineas: Linea[]; y: number; retardo?: number; salida?: number; centrado?: boolean;
}> = ({ lineas, y, retardo = 0, salida, centrado = true }) => {
  const frame = useCurrentFrame();
  const out = salida !== undefined
    ? interpolate(frame, [f(salida), f(salida) + 7], [1, 0], cl) : 1;
  return (
    <div style={{
      position: "absolute", left: 52, right: 52, top: y,
      textAlign: centrado ? "center" : "left", opacity: out,
    }}>
      {lineas.map((l, i) => {
        const f0 = f(retardo) + i * 5;
        const sube = interpolate(frame, [f0, f0 + 11], [104, 0], {
          ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 2 }}>
            <div style={{
              fontFamily: DISPLAY, fontSize: l.tam ?? 84, lineHeight: 1.18,
              letterSpacing: "0.005em",
              color: l.naranja ? ORANGE : CREAM,
              transform: `translateY(${sube}%)`,
              textShadow: "0 4px 34px rgba(0,0,0,0.75)",
            }}>{l.t}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- barra naranja que crece: marca el ritmo ---------- */
const Barra: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [0, f(dur)], [0, 100], cl);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5 }}>
      <div style={{ width: `${w}%`, height: "100%", background: ORANGE }} />
    </div>
  );
};

/* ---------- círculo que marca una fuga ---------- */
const Marca: React.FC<{ x: number; y: number; r: number; t: number }> = ({ x, y, r, t }) => {
  const frame = useCurrentFrame();
  const f0 = f(t);
  if (frame < f0) return null;
  const g = interpolate(frame, [f0, f0 + 11], [0.35, 1], {
    ...cl, easing: Easing.bezier(0.2, 1.5, 0.4, 1),
  });
  return (
    <div style={{
      position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2,
      border: `5px solid ${ORANGE}`, borderRadius: "50%",
      transform: `scale(${g})`, opacity: interpolate(frame, [f0, f0 + 6], [0, 1], cl),
      boxShadow: "0 0 46px rgba(232,89,12,0.45)",
    }} />
  );
};

/* ================= el reel ================= */

type Beat = { dur: number; plano: Plano; el: React.ReactNode; velo: number };

const B: Beat[] = [];
const add = (dur: number, plano: Omit<Plano, "dur">, el: React.ReactNode, velo = 1) =>
  B.push({ dur, plano: { ...plano, dur }, el, velo });

// 1 · la frase, en boca de otro — cerrado sobre el grifo
add(3.2, { src: "esto-facturas.mp4", desde: 0.2, zoom: [1.14, 1.24], y: [2, 0] },
  <Titulo y={1180} lineas={[
    { t: "«SI QUIERO CRECER,", tam: 78 },
    { t: "TENGO QUE", tam: 78 },
    { t: "INVERTIR MÁS.»", tam: 78, naranja: true },
  ]} />, 1.45);

// 2 · el juicio — cerrado sobre el cubo
add(2.4, { src: "cubo-e1.mp4", desde: 4.2, zoom: [2.5, 2.35], x: [-13, -10], y: [-25, -22] },
  <Titulo y={200} lineas={[
    { t: "PROBABLEMENTE", tam: 66 },
    { t: "LA FRASE QUE MÁS", tam: 66 },
    { t: "DINERO HA COSTADO", tam: 72, naranja: true },
  ]} />);

// 3 · abierto: se ve la instalación entera
add(2.0, { src: "esto-insight.mp4", desde: 4.6, zoom: [1.18, 1.1] },
  <Titulo y={1320} lineas={[
    { t: "EN NEGOCIOS QUE", tam: 68 },
    { t: "YA FUNCIONABAN", tam: 82, naranja: true },
  ]} />, 1.4);

// 4 · muy cerrado sobre una fuga
add(2.4, { src: "cubo-e2.mp4", desde: 2.6, zoom: [2.75, 2.95], x: [15, 11], y: [1, 4] },
  <Titulo y={1180} lineas={[
    { t: "INVERTIR MÁS", tam: 86 },
    { t: "EN UN NEGOCIO", tam: 68 },
    { t: "CON AGUJEROS", tam: 86, naranja: true },
  ]} />);

// 5 · abierto otra vez
add(2.6, { src: "cubo-e2.mp4", desde: 6.8, zoom: [1.12, 1.26] },
  <Titulo y={1210} lineas={[
    { t: "ES ECHAR MÁS AGUA", tam: 66 },
    { t: "EN UN CUBO", tam: 66 },
    { t: "AGUJEREADO", tam: 94, naranja: true },
  ]} />);

// 6 · abren el grifo, cerrado arriba
add(1.8, { src: "cubo-e3.mp4", desde: 1.2, zoom: [1.75, 1.62], x: [6, 4], y: [17, 14] },
  <Titulo y={1330} lineas={[{ t: "ENTRA MÁS, SÍ.", tam: 96 }]} />);

// 7 · el agua saliendo por el lado
add(2.4, { src: "cubo-e3.mp4", desde: 6.6, zoom: [2.6, 2.8], x: [-7, -2], y: [-3, 1] },
  <Titulo y={1200} lineas={[
    { t: "Y SE VA MÁS.", tam: 88 },
    { t: "Y MÁS RÁPIDO.", tam: 88, naranja: true },
  ]} />);

// 8 · las tres fugas marcadas, plano abierto
add(2.6, { src: "esto-facturas.mp4", desde: 5.4, zoom: [1.3, 1.42], y: [5, 2] },
  <>
    <Titulo y={190} lineas={[
      { t: "ESTO ES LO QUE", tam: 62 },
      { t: "NADIE MIRA", tam: 90, naranja: true },
    ]} />
  </>, 1.5);

// 9 · el giro, tubería ya parcheada
add(2.6, { src: "cubo-e5.mp4", desde: 2.2, zoom: [1.55, 1.36], y: [9, 5] },
  <Titulo y={1200} lineas={[
    { t: "ANTES DE METER MÁS", tam: 68 },
    { t: "MIRA POR DÓNDE", tam: 68 },
    { t: "SE ESTÁ ESCAPANDO", tam: 74, naranja: true },
  ]} />);

// 10 · cierre
add(3.0, { src: "esto-cierre.mp4", desde: 5.4, zoom: [1.2, 1.32] }, null, 1.0);

const INICIOS = B.reduce<number[]>((a, b, i) => [...a, i ? a[i - 1] + B[i - 1].dur : 0], []);
export const INVERTIR_FRAMES = f(B.reduce((a, b) => a + b.dur, 0));

const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [f(0.3), f(0.8)], [0, 1], cl);
  const sube = interpolate(frame, [f(0.3), f(1.0)], [26, 0], {
    ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const panel = interpolate(frame, [0, f(0.45)], [0, 0.90], cl);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: `rgba(7,7,8,${panel})` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{
          textAlign: "center", opacity: op, transform: `translateY(${sube}px)`,
          padding: "0 60px",
        }}>
          <div style={{
            fontFamily: LABEL, fontWeight: 700, fontSize: 25, letterSpacing: "0.24em",
            color: "rgba(242,238,230,0.55)", textTransform: "uppercase", lineHeight: 1.7,
          }}>¿Dónde pierde<br />tu negocio?</div>
          <div style={{
            width: 76, height: 4, background: ORANGE, margin: "40px auto 44px",
          }} />
          <div style={{ fontFamily: DISPLAY, fontSize: 92, color: CREAM, lineHeight: 1.05 }}>
            ESCRÍBEME
          </div>
          <div style={{ fontFamily: DISPLAY, fontSize: 132, color: ORANGE, lineHeight: 1.05 }}>
            FUGAS
          </div>
          <Img src={staticFile("qualivo.png")} style={{ height: 62, marginTop: 96 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const InvertirMas: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    {B.map((b, i) => (
      <Sequence key={i} from={f(INICIOS[i])} durationInFrames={f(b.dur)}>
        <Video {...b.plano} />
        <Velo fuerza={b.velo} />
        {b.el}
        {i === B.length - 1 ? <Cierre /> : null}
      </Sequence>
    ))}
    <Barra dur={B.reduce((a, b) => a + b.dur, 0)} />
  </AbsoluteFill>
);

import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo,
  Sequence, staticFile, useCurrentFrame } from "remotion";
import { CREAM, DISPLAY, INK, LABEL, MUT, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) } as const;

/* tramos — el corte de Maikel, reconstruido */
const T = [
  { id: "hook",  dur: 5.2 },
  { id: "r1",    dur: 2.4 },
  { id: "r2",    dur: 2.9 },
  { id: "r3",    dur: 2.0 },
  { id: "fact",  dur: 5.5 },
  { id: "tub",   dur: 2.8 },
  { id: "chips", dur: 6.2 },
  { id: "fact2", dur: 2.2 },
  { id: "capo",  dur: 6.4 },
  { id: "idea",  dur: 2.6 },
  { id: "fin",   dur: 3.0 },
];
const INI: Record<string, number> = {};
{ let t = 0; for (const x of T) { INI[x.id] = t; t += x.dur; } }
export const CORTE40_FRAMES = f(T.reduce((a, b) => a + b.dur, 0));

const Vid: React.FC<{ src: string; desde?: number; mudo?: boolean; dur: number;
  zoom?: [number, number]; x?: [number, number]; y?: [number, number] }> = ({
  src, desde = 0, mudo, dur, zoom = [1, 1], x = [0, 0], y = [0, 0] }) => {
  const frame = useCurrentFrame();
  const t = [0, f(dur)] as [number, number];
  const e = { ...cl, easing: Easing.inOut(Easing.quad) };
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(desde * FPS)} muted={mudo}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${interpolate(frame, t, zoom, e)}) translate(${interpolate(frame, t, x, e)}%, ${interpolate(frame, t, y, e)}%)` }} />
    </AbsoluteFill>
  );
};

const Velo: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(6,6,7,${0.55*k}) 0%,
    rgba(6,6,7,${0.12*k}) 30%, rgba(6,6,7,${0.16*k}) 62%, rgba(6,6,7,${0.8*k}) 100%)` }} />
);

const Rot: React.FC<{ lineas: Array<{ t: string; naranja?: boolean; tam?: number }>;
  y?: number; ent?: number }> = ({ lineas, y = 1440, ent = 0.25 }) => {
  const frame = useCurrentFrame();
  if (frame < f(ent) - 1) return null;
  return (
    <div style={{ position: "absolute", left: 54, right: 54, top: y, textAlign: "center" }}>
      {lineas.map((l, i) => {
        const f0 = f(ent) + i * 4;
        const sube = interpolate(frame, [f0, f0 + 10], [110, 0], suave);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 2 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: l.tam ?? 64, lineHeight: 1.16,
              color: l.naranja ? ORANGE : CREAM, transform: `translateY(${sube}%)`,
              textShadow: "0 5px 36px rgba(0,0,0,0.9)" }}>{l.t}</div>
          </div>
        );
      })}
    </div>
  );
};

const Chip: React.FC<{ texto: string; ent: number; idx: number }> = ({ texto, ent, idx }) => {
  const frame = useCurrentFrame();
  const f0 = f(ent);
  if (frame < f0) return null;
  const pop = interpolate(frame, [f0, f0 + 8], [0.82, 1], { ...cl, easing: Easing.bezier(0.2, 1.45, 0.4, 1) });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1140 + idx * 118,
      display: "flex", justifyContent: "center",
      transform: `scale(${pop})`, opacity: interpolate(frame, [f0, f0 + 5], [0, 1], cl) }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 29, letterSpacing: "0.04em",
        color: CREAM, background: "rgba(8,8,9,0.82)", border: "2px solid rgba(232,89,12,0.62)",
        borderRadius: 12, padding: "15px 26px", maxWidth: 920, textAlign: "center" }}>
        <span style={{ color: ORANGE, marginRight: 11 }}>●</span>{texto}
      </div>
    </div>
  );
};

export const Corte40: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    <Sequence from={f(INI.hook)} durationInFrames={f(5.2)} name="hook">
      <Vid src="esto-hook.mp4" dur={5.2} zoom={[1.02, 1.08]} />
      <Velo /><Rot ent={0.5} lineas={[{ t: "TU NEGOCIO", tam: 68 }, { t: "SE HA ESTANCADO", tam: 68, naranja: true }]} />
    </Sequence>
    <Sequence from={f(INI.r1)} durationInFrames={f(2.4)} name="r1">
      <Vid src="esto-r1.mp4" dur={2.4} zoom={[1.04, 1.09]} />
      <Velo /><Rot ent={0.15} lineas={[{ t: "MÁS PUBLICIDAD", tam: 72, naranja: true }]} />
    </Sequence>
    <Sequence from={f(INI.r2)} durationInFrames={f(2.9)} name="r2">
      <Vid src="esto-r2.mp4" dur={2.9} zoom={[1.04, 1.09]} />
      <Velo /><Rot ent={0.15} lineas={[{ t: "OTRA PERSONA", tam: 72, naranja: true }]} />
    </Sequence>
    <Sequence from={f(INI.r3)} durationInFrames={f(2.0)} name="r3">
      <Vid src="esto-r3.mp4" dur={2.0} zoom={[1.04, 1.09]} />
      <Velo /><Rot ent={0.15} lineas={[{ t: "OTRA HERRAMIENTA", tam: 68, naranja: true }]} />
    </Sequence>
    <Sequence from={f(INI.fact)} durationInFrames={f(5.5)} name="facturas">
      <Vid src="esto-facturas.mp4" desde={0.1} dur={5.5} zoom={[1.06, 1.14]} />
      <Velo k={1.15} /><Rot ent={0.3} lineas={[{ t: "TRES MESES DESPUÉS", tam: 56 }, { t: "EXACTAMENTE IGUAL", tam: 70, naranja: true }]} />
    </Sequence>
    <Sequence from={f(INI.tub)} durationInFrames={f(2.8)} name="tuberia">
      <Audio src={staticFile("vo-tuberia.mp3")} trimBefore={f(3.3)} />
      <Vid src="cubo-e3.mp4" desde={0.9} mudo dur={2.8} zoom={[1.7, 1.56]} y={[17, 14]} />
      <Velo /><Rot ent={0.2} lineas={[{ t: "EL DINERO", tam: 66 }, { t: "SE TE ESCAPA IGUAL", tam: 66, naranja: true }]} />
    </Sequence>
    <Sequence from={f(INI.chips)} durationInFrames={f(6.2)} name="chips">
      <Sequence from={0} durationInFrames={f(3.2)}>
        <Vid src="cubo-e2.mp4" desde={0.6} mudo dur={3.2} zoom={[1.4, 1.55]} x={[6, 3]} />
        <Velo />
      </Sequence>
      <Sequence from={f(3.2)} durationInFrames={f(3.0)}>
        <Vid src="cubo-e2.mp4" desde={6.6} mudo dur={3.0} zoom={[1.9, 2.05]} x={[-8, -5]} y={[2, 4]} />
        <Velo />
      </Sequence>
      <Chip idx={0} ent={0.4} texto="ANUNCIOS QUE LLEVAN MESES SIN REVISAR" />
      <Chip idx={1} ent={1.8} texto="PIDEN INFORMACIÓN Y TARDAS DOS DÍAS" />
      <Chip idx={2} ent={3.4} texto="COMERCIALES QUE NO SABEN A QUIÉN LLAMAR" />
      <Chip idx={3} ent={4.9} texto="VENTAS A LAS QUE NADIE HACE SEGUIMIENTO" />
    </Sequence>
    <Sequence from={f(INI.fact2)} durationInFrames={f(2.2)} name="factura2">
      <Vid src="cubo-e2.mp4" desde={7.4} mudo dur={2.2} zoom={[2.0, 2.2]} x={[-9, -6]} y={[2, 5]} />
      <Velo /><Rot y={1280} ent={0.2} lineas={[{ t: "NO APARECEN", tam: 64 }, { t: "EN NINGUNA FACTURA", tam: 64, naranja: true }]} />
    </Sequence>
    <Sequence from={f(INI.capo)} durationInFrames={f(6.4)} name="capo">
      <AbsoluteFill style={{ backgroundColor: "#0A0A0B" }}>
        <OffthreadVideo src={staticFile("capo.mp4")} muted trimBefore={f(5.7)} playbackRate={1.2}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={f(INI.idea)} durationInFrames={f(2.6)} name="idea">
      <AbsoluteFill style={{ backgroundColor: "#08080A", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", padding: "0 60px" }}>
          <Rot y={0 as any} ent={0} lineas={[]} />
          <div style={{ fontFamily: DISPLAY, fontSize: 82, color: CREAM, lineHeight: 1.1 }}>NO NECESITAS MÁS.</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 96, color: ORANGE, lineHeight: 1.1, marginTop: 8 }}>NECESITAS VER.</div>
        </div>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={f(INI.fin)} durationInFrames={f(3.0)} name="fin">
      <AbsoluteFill style={{ backgroundColor: "#08080A", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 25, letterSpacing: "0.24em",
            color: "rgba(242,238,230,0.55)", textTransform: "uppercase", lineHeight: 1.7 }}>
            ¿Dónde pierde<br />tu negocio?</div>
          <div style={{ width: 76, height: 4, background: ORANGE, margin: "36px auto 40px" }} />
          <div style={{ fontFamily: DISPLAY, fontSize: 86, color: CREAM, lineHeight: 1.05 }}>ESCRÍBEME</div>
          <div style={{ fontFamily: DISPLAY, fontSize: 126, color: ORANGE, lineHeight: 1.05 }}>FUGAS</div>
          <Img src={staticFile("qualivo.png")} style={{ height: 58, marginTop: 84 }} />
        </div>
      </AbsoluteFill>
    </Sequence>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5 }}>
      <div style={{ width: `${(100 * (useCurrentFrame())) / CORTE40_FRAMES}%`, height: "100%", background: ORANGE }} />
    </div>
  </AbsoluteFill>
);

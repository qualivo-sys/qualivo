import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo,
  Sequence, staticFile, useCurrentFrame } from "remotion";
import { CREAM, DISPLAY, LABEL, INK, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) } as const;

/* versión sin voz ni avatar: todo animación generada + tipografía */
const T = [
  { id: "valv",      dur: 6.5 },
  { id: "medidor",   dur: 5.5 },
  { id: "gota",      dur: 4.5 },
  { id: "jerarquia", dur: 6.0 },
  { id: "wow",       dur: 9.0 },
  { id: "prioridad", dur: 5.0 },
  { id: "idea",      dur: 3.2 },
  { id: "fin",       dur: 4.3 },
];
const INI: Record<string, number> = {};
{ let t = 0; for (const x of T) { INI[x.id] = t; t += x.dur; } }
export const CUBOTEXTO_FRAMES = f(T.reduce((a, b) => a + b.dur, 0));

const Vid: React.FC<{ src: string; desde?: number; rate?: number; dur: number;
  zoom?: [number, number] }> = ({ src, desde = 0, rate = 1, dur, zoom = [1, 1] }) => {
  const frame = useCurrentFrame();
  const t = [0, f(dur)] as [number, number];
  const e = { ...cl, easing: Easing.inOut(Easing.quad) };
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} trimBefore={Math.round(desde * FPS)} muted
        playbackRate={rate}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          transform: `scale(${interpolate(frame, t, zoom, e)})` }} />
    </AbsoluteFill>
  );
};

const Velo: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(6,6,7,${0.45*k}) 0%,
    rgba(6,6,7,${0.06*k}) 32%, rgba(6,6,7,${0.1*k}) 60%, rgba(6,6,7,${0.7*k}) 100%)` }} />
);

/* frase kinetic: palabras que entran una a una */
const Frase: React.FC<{ t: string; ent: number; sale?: number; y?: number;
  tam?: number; naranja?: boolean; paso?: number }> = ({ t, ent, sale, y = 1400,
  tam = 60, naranja, paso = 3 }) => {
  const frame = useCurrentFrame();
  if (frame < f(ent) - 1) return null;
  const palabras = t.split(" ");
  const op = sale ? interpolate(frame, [f(sale), f(sale) + 8], [1, 0], cl) : 1;
  return (
    <div style={{ position: "absolute", left: 54, right: 54, top: y, textAlign: "center",
      opacity: op }}>
      <div style={{ display: "inline" }}>
        {palabras.map((p, i) => {
          const f0 = f(ent) + i * paso;
          const o = interpolate(frame, [f0, f0 + 6], [0, 1], cl);
          const s = interpolate(frame, [f0, f0 + 7], [1.25, 1], suave);
          return (
            <span key={i} style={{ fontFamily: DISPLAY, fontSize: tam, lineHeight: 1.22,
              color: naranja ? ORANGE : CREAM, opacity: o, display: "inline-block",
              transform: `scale(${s})`, marginRight: 16,
              textShadow: "0 5px 36px rgba(0,0,0,0.92)" }}>{p}</span>
          );
        })}
      </div>
    </div>
  );
};

const Acumula: React.FC<{ items: Array<{ t: string; ent: number }> }> = ({ items }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1330, textAlign: "center" }}>
      {items.map((it, i) => {
        const f0 = f(it.ent);
        if (frame < f0) return null;
        const o = interpolate(frame, [f0, f0 + 6], [0, 1], cl);
        const s = interpolate(frame, [f0, f0 + 9], [1.4, 1], suave);
        return (
          <div key={i} style={{ fontFamily: DISPLAY, fontSize: 60, lineHeight: 1.3,
            color: CREAM, opacity: o, transform: `scale(${s})`,
            textShadow: "0 5px 36px rgba(0,0,0,0.92)" }}>
            <span style={{ color: ORANGE }}>+</span> {it.t}
          </div>
        );
      })}
    </div>
  );
};

const Contador: React.FC = () => {
  const frame = useCurrentFrame();
  const dia = Math.min(90, Math.round(interpolate(frame, [f(0.9), f(3.6)], [1, 90],
    { ...cl, easing: Easing.in(Easing.quad) })));
  const congelado = dia >= 90;
  const op = interpolate(frame, [f(0.6), f(1.0)], [0, 1], cl);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", opacity: op }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 26, letterSpacing: "0.3em",
        color: "rgba(242,238,230,0.6)", textTransform: "uppercase" }}>día</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 190, lineHeight: 1,
        color: congelado ? ORANGE : CREAM, marginTop: 6,
        textShadow: "0 6px 44px rgba(0,0,0,0.95)",
        transform: congelado ? `scale(${interpolate(frame, [f(3.6), f(3.95)], [1.12, 1], suave)})` : undefined }}>
        {dia}
      </div>
    </div>
  );
};

const Prioridad: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = 5.0;
  const z = interpolate(frame, [0, f(dur)], [1.06, 1.22], { ...cl, easing: Easing.inOut(Easing.quad) });
  const apagado = interpolate(frame, [f(0.3), f(1.3)], [0, 0.68], cl);
  const halo = interpolate(frame, [f(0.9), f(1.6)], [0, 1], suave);
  const pulso = 1 + 0.08 * Math.sin((frame / FPS) * Math.PI * 1.6);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "72% 72%" }}>
        <Img src={staticFile("s7-wow-b.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, opacity: apagado,
          background: "radial-gradient(circle 190px at 72% 72%, rgba(4,4,6,0) 0%, rgba(4,4,6,0.35) 55%, rgba(4,4,6,0.97) 100%)" }} />
        <div style={{ position: "absolute", left: "72%", top: "72%", opacity: halo,
          transform: `translate(-50%, -50%) scale(${pulso})` }}>
          <div style={{ width: 190, height: 190, borderRadius: "50%",
            border: "2px solid rgba(232,89,12,0.85)",
            boxShadow: "0 0 90px 24px rgba(232,89,12,0.28), inset 0 0 60px rgba(232,89,12,0.14)" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CuboTexto: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    <Sequence from={f(INI.valv)} durationInFrames={f(6.5)} name="valvulas">
      <Vid src="s2-valvulas.mp4" dur={6.5} rate={0.78} zoom={[1.0, 1.07]} />
      <Velo k={0.85} />
      <Frase t="TU NEGOCIO SE HA ESTANCADO." ent={0.25} sale={2.5} y={1330} tam={64} paso={2} />
      <Frase t="Y HACES LO DE SIEMPRE:" ent={2.8} y={1180} tam={54} />
      <Acumula items={[{ t: "PUBLICIDAD", ent: 3.7 }, { t: "PERSONAS", ent: 4.5 }, { t: "HERRAMIENTAS", ent: 5.3 }]} />
    </Sequence>

    <Sequence from={f(INI.medidor)} durationInFrames={f(5.5)} name="medidor">
      <Vid src="s3-medidor.mp4" dur={5.5} rate={0.9} zoom={[1.03, 1.0]} />
      <Velo k={0.8} />
      <Contador />
      <Frase t="MÁS RECURSOS." ent={2.9} y={1360} tam={60} />
      <Frase t="MISMO PROBLEMA." ent={3.6} y={1450} tam={60} naranja />
    </Sequence>

    <Sequence from={f(INI.gota)} durationInFrames={f(4.5)} name="gota">
      <Vid src="s4-gota.mp4" dur={4.5} zoom={[1.0, 1.08]} />
      <Frase t="MIENTRAS TANTO, EL DINERO SE ESCAPA." ent={0.4} y={1330} tam={56} />
      <Frase t="Y NO LO VES." ent={2.7} y={1500} tam={62} naranja />
    </Sequence>

    <Sequence from={f(INI.jerarquia)} durationInFrames={f(6.0)} name="jerarquia">
      <Vid src="s5-jerarquia.mp4" dur={6.0} rate={0.83} />
      <Frase t="PIERDES POR VARIOS SITIOS A LA VEZ." ent={0.4} sale={2.9} y={1400} tam={56} />
      <Frase t="Y NO TODAS LAS FUGAS CUESTAN LO MISMO." ent={3.2} y={1400} tam={56} naranja />
    </Sequence>

    <Sequence from={f(INI.wow)} durationInFrames={f(9.0)} name="wow">
      <Sequence from={0} durationInFrames={f(5.0)}>
        <Vid src="s6-wow-a.mp4" dur={5.0} />
      </Sequence>
      <Sequence from={f(5.0)} durationInFrames={f(4.0)}>
        <Vid src="s7-wow-b.mp4" dur={4.0} zoom={[1.02, 1.0]} />
      </Sequence>
      <Frase t="ESTE ES TU NEGOCIO POR DENTRO." ent={0.7} sale={3.4} y={1420} tam={58} />
      <Frase t="CADA LUZ ES UNA FUGA." ent={3.8} sale={6.1} y={1420} tam={58} />
      <Frase t="EL PROBLEMA NO ES ENCONTRARLAS." ent={6.4} y={1420} tam={56} naranja />
    </Sequence>

    <Sequence from={f(INI.prioridad)} durationInFrames={f(5.0)} name="prioridad">
      <Prioridad />
      <Frase t="ES SABER CUÁL TAPAR PRIMERO." ent={1.3} y={1420} tam={58} naranja />
    </Sequence>

    <Sequence from={f(INI.idea)} durationInFrames={f(3.2)} name="idea">
      <AbsoluteFill style={{ backgroundColor: "#08080A", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", padding: "0 60px" }}>
          <FraseCentro />
        </div>
      </AbsoluteFill>
    </Sequence>

    <Sequence from={f(INI.fin)} durationInFrames={f(4.3)} name="fin">
      <AbsoluteFill style={{ backgroundColor: "#08080A", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 66, color: CREAM, lineHeight: 1.2 }}>
            ¿CUÁL TAPARÍAS<br /><span style={{ color: ORANGE }}>PRIMERO?</span></div>
          <div style={{ width: 76, height: 4, background: ORANGE, margin: "40px auto 44px" }} />
          <FinCta />
          <Img src={staticFile("qualivo.png")} style={{ height: 58, marginTop: 78 }} />
        </div>
      </AbsoluteFill>
    </Sequence>

    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5 }}>
      <div style={{ width: `${(100 * (useCurrentFrame())) / CUBOTEXTO_FRAMES}%`, height: "100%", background: ORANGE }} />
    </div>
  </AbsoluteFill>
);

const FraseCentro: React.FC = () => {
  const frame = useCurrentFrame();
  const o1 = interpolate(frame, [f(0.2), f(0.55)], [0, 1], cl);
  const o2 = interpolate(frame, [f(0.9), f(1.25)], [0, 1], cl);
  const s2 = interpolate(frame, [f(0.9), f(1.3)], [1.15, 1], suave);
  return (
    <>
      <div style={{ fontFamily: DISPLAY, fontSize: 82, color: CREAM, lineHeight: 1.1, opacity: o1 }}>NO NECESITAS MÁS.</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 96, color: ORANGE, lineHeight: 1.1, marginTop: 8,
        opacity: o2, transform: `scale(${s2})` }}>NECESITAS VER.</div>
    </>
  );
};

const FinCta: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [f(1.2), f(1.6)], [0, 1], cl);
  return (
    <div style={{ opacity: op }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 25, letterSpacing: "0.24em",
        color: "rgba(242,238,230,0.55)", textTransform: "uppercase", marginBottom: 18 }}>escríbeme</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 126, color: ORANGE, lineHeight: 1.05 }}>FUGAS</div>
    </div>
  );
};

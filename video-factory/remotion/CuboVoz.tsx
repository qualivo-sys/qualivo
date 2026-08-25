import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo,
  Sequence, staticFile, useCurrentFrame } from "remotion";
import { CREAM, DISPLAY, LABEL, INK, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) } as const;

/* narración de Maikel (63,4 s) — cortes sobre sus tiempos de palabra */
const T = [
  { id: "valv",      dur: 9.2 },  // «hacemos lo de siempre: meter más…»
  { id: "medidor",   dur: 4.4 },  // «tres meses después, exactamente igual»
  { id: "gota",      dur: 5.3 },  // «no es lo que metes, es lo que se escapa»
  { id: "campanas",  dur: 4.1 },  // FUGA 01
  { id: "sitios",    dur: 5.1 },  // FUGA 02
  { id: "espera",    dur: 4.6 },  // FUGA 03
  { id: "embudo",    dur: 5.8 },  // FUGA 04 + 05
  { id: "jerarquia", dur: 5.5 },  // «juntas frenan el crecimiento»
  { id: "wow",       dur: 4.9 },  // «nadie las mira todas a la vez»
  { id: "prioridad", dur: 6.3 },  // «qué falla, cuánto cuesta, cuál primero»
  { id: "idea",      dur: 3.9 },  // «no necesitas más, necesitas ver mejor»
  { id: "fin",       dur: 5.9 },  // «¿dónde pierde tu negocio?» + FUGAS
];
const INI: Record<string, number> = {};
{ let t = 0; for (const x of T) { INI[x.id] = t; t += x.dur; } }
export const CUBOVOZ_FRAMES = f(T.reduce((a, b) => a + b.dur, 0));

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

/* etiqueta de expediente: FUGA 0N + descripción */
const Fuga: React.FC<{ n: string; t: string; ent: number }> = ({ n, t, ent }) => {
  const frame = useCurrentFrame();
  const f0 = f(ent);
  if (frame < f0) return null;
  const o = interpolate(frame, [f0, f0 + 7], [0, 1], cl);
  const sube = interpolate(frame, [f0, f0 + 10], [26, 0], suave);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1380, textAlign: "center",
      opacity: o, transform: `translateY(${sube}px)` }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 26, letterSpacing: "0.34em",
        color: ORANGE, textTransform: "uppercase", marginBottom: 14 }}>fuga {n}</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 58, color: CREAM, lineHeight: 1.15,
        padding: "0 70px", textShadow: "0 5px 36px rgba(0,0,0,0.92)" }}>{t}</div>
    </div>
  );
};

const Contador: React.FC = () => {
  const frame = useCurrentFrame();
  const dia = Math.min(90, Math.round(interpolate(frame, [f(0.4), f(2.4)], [1, 90],
    { ...cl, easing: Easing.in(Easing.quad) })));
  const congelado = dia >= 90;
  const op = interpolate(frame, [f(0.2), f(0.6)], [0, 1], cl);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 340, textAlign: "center", opacity: op }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 26, letterSpacing: "0.3em",
        color: "rgba(242,238,230,0.6)", textTransform: "uppercase" }}>día</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 190, lineHeight: 1,
        color: congelado ? ORANGE : CREAM, marginTop: 6,
        textShadow: "0 6px 44px rgba(0,0,0,0.95)",
        transform: congelado ? `scale(${interpolate(frame, [f(2.4), f(2.75)], [1.12, 1], suave)})` : undefined }}>
        {dia}
      </div>
    </div>
  );
};

const Prioridad: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
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

/* chips de la parte de priorización, sincronizados con la voz */
const ChipPrio: React.FC<{ t: string; ent: number; idx: number }> = ({ t, ent, idx }) => {
  const frame = useCurrentFrame();
  const f0 = f(ent);
  if (frame < f0) return null;
  const pop = interpolate(frame, [f0, f0 + 8], [0.85, 1], { ...cl, easing: Easing.bezier(0.2, 1.45, 0.4, 1) });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1200 + idx * 128,
      display: "flex", justifyContent: "center",
      transform: `scale(${pop})`, opacity: interpolate(frame, [f0, f0 + 5], [0, 1], cl) }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 31, letterSpacing: "0.05em",
        color: CREAM, background: "rgba(8,8,9,0.82)", border: "2px solid rgba(232,89,12,0.62)",
        borderRadius: 12, padding: "16px 30px", textAlign: "center" }}>
        <span style={{ color: ORANGE, marginRight: 12 }}>●</span>{t}
      </div>
    </div>
  );
};

export const CuboVoz: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    <Audio src={staticFile("narracion.wav")} />

    <Sequence from={f(INI.valv)} durationInFrames={f(9.2)} name="valvulas">
      <Vid src="k30-valvulas.mp4" dur={9.2} rate={1.05} zoom={[1.0, 1.05]} />
      <Velo k={0.85} />
      <Frase t="TU NEGOCIO SE HA ESTANCADO." ent={0.3} sale={3.6} y={1330} tam={64} paso={2} />
      <Acumula items={[{ t: "PUBLICIDAD", ent: 5.9 }, { t: "PERSONAS", ent: 7.1 }, { t: "HERRAMIENTAS", ent: 8.0 }]} />
    </Sequence>

    <Sequence from={f(INI.medidor)} durationInFrames={f(4.4)} name="medidor">
      <Vid src="s3-medidor.mp4" dur={4.4} rate={1.1} zoom={[1.03, 1.0]} />
      <Velo k={0.8} />
      <Contador />
      <Frase t="EXACTAMENTE IGUAL." ent={2.2} y={1400} tam={62} naranja />
    </Sequence>

    <Sequence from={f(INI.gota)} durationInFrames={f(5.3)} name="gota">
      <Vid src="s4-gota.mp4" dur={5.3} rate={0.95} zoom={[1.0, 1.08]} />
      <Frase t="SE TE ESTÁ ESCAPANDO." ent={3.5} y={1440} tam={62} naranja />
    </Sequence>

    <Sequence from={f(INI.campanas)} durationInFrames={f(4.1)} name="campanas">
      <Vid src="n1-campanas.mp4" dur={4.1} rate={1.2} />
      <Velo k={0.6} />
      <Fuga n="01" t="CAMPAÑAS QUE NADIE MIDE" ent={0.5} />
    </Sequence>

    <Sequence from={f(INI.sitios)} durationInFrames={f(5.1)} name="sitios">
      <Vid src="n2-cincositios.mp4" dur={5.1} rate={0.98} />
      <Velo k={0.6} />
      <Fuga n="02" t="LA INFORMACIÓN, EN CINCO SITIOS" ent={0.5} />
    </Sequence>

    <Sequence from={f(INI.espera)} durationInFrames={f(4.6)} name="espera">
      <Vid src="n3-espera.mp4" dur={4.6} rate={1.09} />
      <Velo k={0.55} />
      <Fuga n="03" t="PRESUPUESTOS ESPERANDO DÍAS" ent={0.5} />
    </Sequence>

    <Sequence from={f(INI.embudo)} durationInFrames={f(5.8)} name="embudo">
      <Vid src="k30-embudo.mp4" desde={1.5} dur={5.8} rate={1.2} />
      <Velo k={0.6} />
      <Fuga n="04" t="TRABAJO A MANO" ent={0.4} />
      <Frase t="Y TODO DEPENDE DE UNA PERSONA." ent={2.3} y={1560} tam={48} naranja />
    </Sequence>

    <Sequence from={f(INI.jerarquia)} durationInFrames={f(5.5)} name="jerarquia">
      <Vid src="s5-jerarquia.mp4" dur={5.5} rate={0.91} />
      <Frase t="POR SEPARADO, PEQUEÑAS." ent={0.4} sale={2.2} y={1400} tam={56} />
      <Frase t="JUNTAS, FRENAN EL CRECIMIENTO." ent={2.5} y={1400} tam={56} naranja />
    </Sequence>

    <Sequence from={f(INI.wow)} durationInFrames={f(4.9)} name="wow">
      <Vid src="s7-wow-b.mp4" dur={4.9} rate={1.02} zoom={[1.02, 1.0]} />
      <Frase t="NADIE LAS MIRA TODAS A LA VEZ." ent={1.6} y={1420} tam={58} />
    </Sequence>

    <Sequence from={f(INI.prioridad)} durationInFrames={f(6.3)} name="prioridad">
      <Prioridad dur={6.3} />
      <ChipPrio idx={0} ent={2.7} t="QUÉ ESTÁ FALLANDO" />
      <ChipPrio idx={1} ent={4.0} t="CUÁNTO TE CUESTA" />
      <ChipPrio idx={2} ent={5.1} t="CUÁL TAPAR PRIMERO" />
    </Sequence>

    <Sequence from={f(INI.idea)} durationInFrames={f(3.9)} name="idea">
      <AbsoluteFill style={{ backgroundColor: "#08080A", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", padding: "0 60px" }}>
          <IdeaCentro />
        </div>
      </AbsoluteFill>
    </Sequence>

    <Sequence from={f(INI.fin)} durationInFrames={f(5.9)} name="fin">
      <AbsoluteFill style={{ backgroundColor: "#08080A", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 64, color: CREAM, lineHeight: 1.2 }}>
            ¿DÓNDE PIERDE<br /><span style={{ color: ORANGE }}>TU NEGOCIO?</span></div>
          <div style={{ width: 76, height: 4, background: ORANGE, margin: "40px auto 44px" }} />
          <FinCta />
          <Img src={staticFile("qualivo.png")} style={{ height: 58, marginTop: 78 }} />
        </div>
      </AbsoluteFill>
    </Sequence>

    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5 }}>
      <div style={{ width: `${(100 * (useCurrentFrame())) / CUBOVOZ_FRAMES}%`, height: "100%", background: ORANGE }} />
    </div>
  </AbsoluteFill>
);

const IdeaCentro: React.FC = () => {
  const frame = useCurrentFrame();
  const o1 = interpolate(frame, [f(0.1), f(0.45)], [0, 1], cl);
  const o2 = interpolate(frame, [f(2.2), f(2.55)], [0, 1], cl);
  const s2 = interpolate(frame, [f(2.2), f(2.6)], [1.15, 1], suave);
  return (
    <>
      <div style={{ fontFamily: DISPLAY, fontSize: 82, color: CREAM, lineHeight: 1.1, opacity: o1 }}>NO NECESITAS MÁS.</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 92, color: ORANGE, lineHeight: 1.1, marginTop: 8,
        opacity: o2, transform: `scale(${s2})` }}>NECESITAS VER MEJOR.</div>
    </>
  );
};

const FinCta: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [f(2.0), f(2.4)], [0, 1], cl);
  return (
    <div style={{ opacity: op }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 25, letterSpacing: "0.24em",
        color: "rgba(242,238,230,0.55)", textTransform: "uppercase", marginBottom: 18 }}>escríbeme</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 126, color: ORANGE, lineHeight: 1.05 }}>FUGAS</div>
    </div>
  );
};

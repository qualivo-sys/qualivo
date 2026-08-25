import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { CREAM, DISPLAY, INK, LABEL, MUT, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) } as const;
export const PEGAMENTO_FRAMES = f(22.5);

const CAJAS = [
  { n: "CORREO",          x: 95,  tono: "#3E6C8E" },
  { n: "HOJA DE CÁLCULO", x: 325, tono: "#7A5E8C" },
  { n: "EL CRM",          x: 555, tono: "#4E7A63" },
  { n: "FACTURACIÓN",     x: 785, tono: "#8C6A45" },
];
const ANCHO = 200;
const Y_CAJA = 880;
const Y_SUELO = 1560;
const centro = (i: number) => CAJAS[i].x + ANCHO / 2;

/* recorridos del que hace de pegamento: de qué caja a qué caja y cuándo */
const VIAJES: Array<{ de: number; a: number; t0: number; dur: number }> = [
  { de: 0, a: 1, t0: 4.6,  dur: 1.9 },
  { de: 1, a: 2, t0: 6.7,  dur: 1.8 },
  { de: 2, a: 0, t0: 8.6,  dur: 1.5 },
  { de: 0, a: 3, t0: 10.2, dur: 1.2 },
  { de: 3, a: 1, t0: 11.5, dur: 1.0 },
  { de: 1, a: 2, t0: 12.6, dur: 0.85 },
  { de: 2, a: 0, t0: 13.5, dur: 0.7 },
  { de: 0, a: 3, t0: 14.3, dur: 0.6 },
  { de: 3, a: 2, t0: 15.0, dur: 0.55 },
];

const Caja: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  const c = CAJAS[i];
  const ent = 0.5 + i * 0.42;
  const op = interpolate(t, [ent, ent + 0.5], [0, 1], cl);
  const sube = interpolate(t, [ent, ent + 0.7], [30, 0], suave);
  return (
    <div style={{
      position: "absolute", left: c.x, top: Y_CAJA, width: ANCHO, opacity: op,
      transform: `translateY(${sube}px)`,
    }}>
      <div style={{
        height: 188, borderRadius: 16, background: "#15171B",
        border: "1px solid rgba(242,238,230,0.15)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 9, background: c.tono }} />
        <div style={{ position: "absolute", left: 18, top: 40, right: 18, height: 12, borderRadius: 5,
          background: "rgba(242,238,230,0.16)" }} />
        <div style={{ position: "absolute", left: 18, top: 66, right: 54, height: 12, borderRadius: 5,
          background: "rgba(242,238,230,0.10)" }} />
        <div style={{ position: "absolute", left: 18, top: 92, right: 78, height: 12, borderRadius: 5,
          background: "rgba(242,238,230,0.10)" }} />
      </div>
      <div style={{
        fontFamily: LABEL, fontWeight: 700, fontSize: 21, letterSpacing: "0.1em",
        color: MUT, textAlign: "center", marginTop: 16, lineHeight: 1.25,
      }}>{c.n}</div>
    </div>
  );
};

/* la figurita que hace de pegamento */
const Figura: React.FC<{ t: number }> = ({ t }) => {
  let x = centro(0), llevando = false, andando = false;
  for (const v of VIAJES) {
    if (t >= v.t0 && t < v.t0 + v.dur) {
      const p = (t - v.t0) / v.dur;
      x = centro(v.de) + (centro(v.a) - centro(v.de)) * p;
      llevando = true; andando = true;
    } else if (t >= v.t0 + v.dur) {
      x = centro(v.a);
    }
  }
  if (t < VIAJES[0].t0 - 0.6) return null;
  const fin = VIAJES[VIAJES.length - 1];
  const desaparece = interpolate(t, [19.2, 19.9], [1, 0], cl);
  const bob = andando ? Math.abs(Math.sin(t * 13)) * 14 : 0;
  return (
    <div style={{ position: "absolute", left: x - 29, top: Y_SUELO - 148 - bob, opacity: desaparece }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: CREAM, margin: "0 auto 8px" }} />
      <div style={{ width: 58, height: 78, borderRadius: 16, background: CREAM }} />
      {llevando ? (
        <div style={{ position: "absolute", left: 60, top: 46, width: 32, height: 32, borderRadius: 8,
          background: ORANGE }} />
      ) : null}
    </div>
  );
};

/* datos que se acumulan sin cruzar y acaban cayendo */
const Caidas: React.FC<{ t: number }> = ({ t }) => {
  const T0 = 15.6;
  if (t < T0) return null;
  const cuantos = Math.min(11, Math.floor((t - T0) * 3.4));
  return (
    <>
      {Array.from({ length: cuantos }).map((_, k) => {
        const i = k % 4;
        const nacido = T0 + k / 3.4;
        const p = Math.min(1, (t - nacido) / 1.15);
        const y = Y_CAJA + 188 + p * (Y_SUELO - Y_CAJA - 210);
        const dx = ((k * 43) % 90) - 45;
        return (
          <div key={k} style={{
            position: "absolute", left: centro(i) + dx - 15, top: y,
            width: 30, height: 30, borderRadius: 8, background: ORANGE,
            opacity: p >= 1 ? 0.45 : 1,
            transform: `rotate(${p * 55}deg)`,
          }} />
        );
      })}
    </>
  );
};

const Texto: React.FC<{ lineas: Array<{ t: string; naranja?: boolean; tam?: number }>;
  y: number; ent: number; sal?: number }> = ({ lineas, y, ent, sal }) => {
  const frame = useCurrentFrame();
  if (frame < f(ent) - 1) return null;
  const out = sal !== undefined ? interpolate(frame, [f(sal), f(sal) + 6], [1, 0], cl) : 1;
  return (
    <div style={{ position: "absolute", left: 56, right: 56, top: y, textAlign: "center", opacity: out }}>
      {lineas.map((l, i) => {
        const f0 = f(ent) + i * 4;
        const sube = interpolate(frame, [f0, f0 + 11], [110, 0], suave);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 2 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: l.tam ?? 66, lineHeight: 1.18,
              color: l.naranja ? ORANGE : CREAM, transform: `translateY(${sube}%)`,
              textShadow: "0 6px 40px rgba(0,0,0,0.9)" }}>{l.t}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Pegamento: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage:
        `linear-gradient(${CREAM} 1px, transparent 1px), linear-gradient(90deg, ${CREAM} 1px, transparent 1px)`,
        backgroundSize: "72px 72px" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: Y_SUELO + 6, height: 2,
        background: "rgba(242,238,230,0.13)" }} />

      {CAJAS.map((_, i) => <Caja key={i} i={i} t={t} />)}
      <Caidas t={t} />
      <Figura t={t} />

      {/* al final se dibujan las conexiones que nunca existieron */}
      {t >= 19.4 ? CAJAS.slice(0, 3).map((c, i) => (
        <div key={i} style={{
          position: "absolute", left: c.x + ANCHO, top: Y_CAJA + 88,
          width: (CAJAS[i + 1].x - c.x - ANCHO) * interpolate(t, [19.4 + i * 0.18, 20.0 + i * 0.18], [0, 1], suave),
          height: 9, borderRadius: 5, background: ORANGE,
        }} />
      )) : null}

      <Texto ent={0.6} sal={4.2} y={250} lineas={[{ t: "CUATRO PROGRAMAS", tam: 62 }, { t: "Y NINGUNO SE HABLA", tam: 62, naranja: true }]} />
      <Texto ent={4.7} sal={9.0} y={270} lineas={[{ t: "ALGUIEN LOS CONECTA", tam: 58 }, { t: "A MANO", tam: 86, naranja: true }]} />
      <Texto ent={9.4} sal={15.2} y={290} lineas={[{ t: "CADA DÍA", tam: 74 }, { t: "MUCHAS VECES AL DÍA", tam: 52 }]} />
      <Texto ent={15.9} sal={19.0} y={250} lineas={[{ t: "CUANDO EL RITMO SUBE", tam: 52 }, { t: "EMPIEZAN A", tam: 58 }, { t: "CAERSE COSAS", tam: 76, naranja: true }]} />

      <Sequence from={f(20.4)}>
        <AbsoluteFill style={{ backgroundColor: "rgba(8,8,10,0.94)", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", padding: "0 56px" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 56, color: CREAM, lineHeight: 1.12 }}>EL PEGAMENTO</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 56, color: CREAM, lineHeight: 1.12 }}>ENTRE TUS PROGRAMAS</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 84, color: ORANGE, lineHeight: 1.12, marginTop: 12 }}>
              TIENE NOMBRE
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 84, color: ORANGE, lineHeight: 1.12 }}>Y NÓMINA</div>
            <div style={{ width: 84, height: 4, background: ORANGE, margin: "44px auto 30px" }} />
            <div style={{ fontFamily: DISPLAY, fontSize: 54, color: CREAM }}>
              Escríbeme <span style={{ color: ORANGE }}>FUGAS</span>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5 }}>
        <div style={{ width: `${interpolate(frame, [0, PEGAMENTO_FRAMES], [0, 100], cl)}%`, height: "100%", background: ORANGE }} />
      </div>
    </AbsoluteFill>
  );
};

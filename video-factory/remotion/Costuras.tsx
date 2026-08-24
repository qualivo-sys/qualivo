import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { CREAM, DISPLAY, INK, LABEL, MUT, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) } as const;

export const COSTURAS_FRAMES = f(23);

const Y_VIA = 1085;
const TRAMOS = [
  { nombre: "LOS ANUNCIOS", sabe: "hasta el clic",            x0: 66,  x1: 306, tono: "#3E6C8E", ent: 0.6 },
  { nombre: "LA WEB",       sabe: "hasta el formulario",      x0: 356, x1: 596, tono: "#7A5E8C", ent: 4.3 },
  { nombre: "EL CRM",       sabe: "desde la primera llamada", x0: 646, x1: 856, tono: "#4E7A63", ent: 8.0 },
  { nombre: "LA FACTURA",   sabe: "solo el final",            x0: 906, x1: 1014, tono: "#8C6A45", ent: 11.5 },
];
const COSTURAS = [331, 621, 881];
const REVELA = 15.0;

/* ventana de herramienta */
const Ventana: React.FC<{ t: number; i: number }> = ({ t, i }) => {
  const frame = useCurrentFrame();
  const tr = TRAMOS[i];
  const op = interpolate(t, [tr.ent, tr.ent + 0.5], [0, 1], cl)
           * interpolate(t, [REVELA - 0.3, REVELA + 0.5], [1, 0], cl);
  if (op <= 0.01) return null;
  const sube = interpolate(t, [tr.ent, tr.ent + 0.7], [26, 0], suave);
  const cx = (tr.x0 + tr.x1) / 2;
  const fila = i % 2;
  return (
    <div style={{
      position: "absolute", left: Math.min(Math.max(cx - 215, 24), 1080 - 454),
      top: 430 + fila * 240, width: 430, opacity: op, transform: `translateY(${sube}px)`,
      background: "#15171B", border: "1px solid rgba(242,238,230,0.14)", borderRadius: 14,
      padding: "22px 24px", boxShadow: "0 24px 70px -34px rgba(0,0,0,0.95)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
        <div style={{ width: 15, height: 15, borderRadius: 5, background: tr.tono }} />
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 24, letterSpacing: "0.12em", color: CREAM }}>
          {tr.nombre}
        </div>
      </div>
      <div style={{ fontFamily: DISPLAY, fontSize: 40, color: MUT, lineHeight: 1.15 }}>
        sabe {tr.sabe}
      </div>
      {/* el trocito de recorrido que ve esta herramienta */}
      <div style={{ marginTop: 18, height: 14, borderRadius: 7, background: "rgba(242,238,230,0.08)", position: "relative" }}>
        <div style={{ position: "absolute", left: `${(i * 24)}%`, width: "26%", top: 0, bottom: 0,
          borderRadius: 6, background: tr.tono }} />
      </div>
    </div>
  );
};

/* gota que cae por una costura */
const Fuga: React.FC<{ x: number; t0: number }> = ({ x, t0 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < t0) return null;
  return (
    <>
      {Array.from({ length: 7 }).map((_, k) => {
        const p = ((t - t0) * 0.55 + k / 7) % 1;
        const y = Y_VIA + 36 + p * 560;
        return (
          <div key={k} style={{
            position: "absolute", left: x - 6, top: y, width: 14, height: 24 + 26 * p,
            borderRadius: 7, background: ORANGE, opacity: (1 - p * 0.55),
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
            <div style={{ fontFamily: DISPLAY, fontSize: l.tam ?? 68, lineHeight: 1.18,
              color: l.naranja ? ORANGE : CREAM, transform: `translateY(${sube}%)`,
              textShadow: "0 6px 40px rgba(0,0,0,0.9)" }}>{l.t}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Costuras: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage:
        `linear-gradient(${CREAM} 1px, transparent 1px), linear-gradient(90deg, ${CREAM} 1px, transparent 1px)`,
        backgroundSize: "72px 72px" }} />

      {/* la vía: de la captación al cobro */}
      <div style={{ position: "absolute", left: 66, right: 66, top: Y_VIA - 54,
        display: "flex", justifyContent: "space-between",
        fontFamily: LABEL, fontWeight: 700, fontSize: 23, letterSpacing: "0.16em", color: "rgba(242,238,230,0.42)" }}>
        <span>CAPTACIÓN</span><span>COBRO</span>
      </div>
      {TRAMOS.map((tr, i) => {
        const ap = interpolate(t, [tr.ent + 0.2, tr.ent + 0.9], [0, 1], suave);
        return (
          <div key={tr.nombre} style={{
            position: "absolute", left: tr.x0, top: Y_VIA,
            width: (tr.x1 - tr.x0) * ap, height: 34, borderRadius: 17, background: tr.tono,
          }} />
        );
      })}
      {/* las costuras se marcan al revelar */}
      {t >= REVELA ? COSTURAS.map((x) => (
        <div key={x} style={{
          position: "absolute", left: x - 30, top: Y_VIA - 15, width: 60, height: 64,
          border: `4px dashed ${ORANGE}`, borderRadius: 10,
          opacity: interpolate(t, [REVELA, REVELA + 0.6], [0, 1], cl),
        }} />
      )) : null}
      {t >= REVELA + 0.6 ? COSTURAS.map((x, k) => (
        <Fuga key={x} x={x} t0={REVELA + 0.7 + k * 0.25} />
      )) : null}

      {TRAMOS.map((_, i) => <Ventana key={i} t={t} i={i} />)}

      <Texto ent={0.4} sal={3.9} y={220} lineas={[{ t: "CADA HERRAMIENTA", tam: 62 }, { t: "VE UN TROZO", tam: 76, naranja: true }]} />
      <Texto ent={15.4} sal={18.4} y={230} lineas={[{ t: "NADIE TIENE", tam: 66 }, { t: "LA FOTO ENTERA", tam: 76, naranja: true }]} />
      <Texto ent={18.8} sal={20.9} y={250} lineas={[{ t: "Y LA FUGA VIVE", tam: 62 }, { t: "EN LAS COSTURAS", tam: 74, naranja: true }]} />

      <Sequence from={f(21.0)}>
        <AbsoluteFill style={{ backgroundColor: "rgba(8,8,10,0.94)", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", padding: "0 60px" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 60, color: CREAM, lineHeight: 1.1 }}>NO FALLA</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 60, color: CREAM, lineHeight: 1.1 }}>NINGUNA HERRAMIENTA</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 92, color: ORANGE, lineHeight: 1.1, marginTop: 10 }}>FALLA EL HUECO</div>
            <div style={{ width: 84, height: 4, background: ORANGE, margin: "46px auto 32px" }} />
            <div style={{ fontFamily: DISPLAY, fontSize: 56, color: CREAM }}>
              Escríbeme <span style={{ color: ORANGE }}>FUGAS</span>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5 }}>
        <div style={{ width: `${interpolate(frame, [0, COSTURAS_FRAMES], [0, 100], cl)}%`, height: "100%", background: ORANGE }} />
      </div>
    </AbsoluteFill>
  );
};

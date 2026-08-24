import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { CREAM, DISPLAY, INK, LABEL, MUT, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) } as const;

export const GRIFOS_FRAMES = f(20);

const CANALES = [
  { n: "BUSCADOR", x: 150, cae: 176 },
  { n: "REDES",    x: 385, cae: 296 },
  { n: "CORREO",   x: 620, cae: 540 },   // el único que entra en el cubo
  { n: "FERIAS",   x: 855, cae: 932 },
];
const BUENO = 2;
const Y_GRIFO = 690;
const Y_SUELO = 1540;
const BOCA = 1380;              // altura de la boca del cubo

/* ---------- grifo dibujado a mano ---------- */
const Grifo: React.FC<{ x: number; nombre: string; apagado: boolean; op: number }> = ({
  x, nombre, apagado, op,
}) => (
  <div style={{ position: "absolute", left: x - 104, top: Y_GRIFO - 178, width: 208, opacity: op }}>
    <div style={{
      fontFamily: LABEL, fontWeight: 700, fontSize: 23, letterSpacing: "0.13em",
      color: apagado ? "rgba(242,238,230,0.30)" : CREAM, textAlign: "center", marginBottom: 18,
      border: `1px solid ${apagado ? "rgba(242,238,230,0.18)" : "rgba(232,89,12,0.55)"}`,
      borderRadius: 9, padding: "10px 0", background: "rgba(10,10,11,0.6)",
    }}>{nombre}</div>
    {/* cuerpo del grifo */}
    <div style={{ position: "relative", height: 96 }}>
      <div style={{ position: "absolute", left: 40, top: 0, width: 128, height: 29, borderRadius: 8,
        background: apagado ? "#4A4B50" : "#C9C3B6" }} />
      <div style={{ position: "absolute", left: 0, top: 5, width: 53, height: 19, borderRadius: 5,
        background: apagado ? "#3E3F44" : "#A9A396" }} />
      <div style={{ position: "absolute", left: 139, top: 24, width: 29, height: 45, borderRadius: 6,
        background: apagado ? "#4A4B50" : "#C9C3B6" }} />
      <div style={{ position: "absolute", left: 83, top: -21, width: 45, height: 21, borderRadius: 7,
        background: apagado ? "#3E3F44" : "#A9A396" }} />
    </div>
  </div>
);

/* ---------- chorro: gotas viajando del grifo al suelo ---------- */
const Chorro: React.FC<{ x0: number; x1: number; activo: number; apagado: boolean; semilla: number }> = ({
  x0, x1, activo, apagado, semilla,
}) => {
  const frame = useCurrentFrame();
  const N = 16;
  const y0 = Y_GRIFO - 58, y1 = Y_SUELO;
  return (
    <>
      {Array.from({ length: N }).map((_, i) => {
        const p = ((frame / FPS) * 0.62 + i / N + semilla * 0.13) % 1;
        const pe = p * p * 0.72 + p * 0.28;          // acelera al caer
        const x = x0 + (x1 - x0) * pe;
        const y = y0 + (y1 - y0) * pe;
        const alto = 20 + 32 * pe;
        return (
          <div key={i} style={{
            position: "absolute", left: x - 5, top: y, width: 13, height: alto, borderRadius: 7,
            background: apagado ? "rgba(150,150,160,0.30)" : "rgba(214,231,240,0.92)",
            opacity: activo * (p > 0.97 ? 0 : 1),
          }} />
        );
      })}
    </>
  );
};

/* ---------- charco fuera del cubo ---------- */
const Charco: React.FC<{ x: number; t: number }> = ({ x, t }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [f(t), f(t) + 20], [0, 200], suave);
  if (frame < f(t)) return null;
  return (
    <div style={{
      position: "absolute", left: x - w / 2, top: Y_SUELO + 14, width: w, height: 19,
      borderRadius: "50%", background: "rgba(150,150,160,0.34)",
    }} />
  );
};

const Cubo: React.FC<{ nivel: number }> = ({ nivel }) => (
  <div style={{ position: "absolute", left: 540 - 190, top: BOCA, width: 380, height: 232 }}>
    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 86% 100%, 14% 100%)",
      background: "#B9B3A6" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${nivel * 100}%`,
      clipPath: "polygon(0 0, 100% 0, 86% 100%, 14% 100%)", background: "linear-gradient(180deg,#7FB3C9,#4E8AA6)" }} />
    <div style={{ position: "absolute", left: -10, right: -10, top: -14, height: 26, borderRadius: 9,
      background: "#D3CDBF" }} />
  </div>
);

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
            <div style={{ fontFamily: DISPLAY, fontSize: l.tam ?? 70, lineHeight: 1.18,
              color: l.naranja ? ORANGE : CREAM, transform: `translateY(${sube}%)`,
              textShadow: "0 6px 40px rgba(0,0,0,0.9)" }}>{l.t}</div>
          </div>
        );
      })}
    </div>
  );
};

export const CuatroGrifos: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const REVELA = 11.2;
  const apagados = t >= REVELA;
  const nivel = interpolate(t, [4.0, 10.5, REVELA, 17.0], [0, 0.16, 0.18, 0.62], cl);

  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage:
        `linear-gradient(${CREAM} 1px, transparent 1px), linear-gradient(90deg, ${CREAM} 1px, transparent 1px)`,
        backgroundSize: "72px 72px" }} />
      {/* suelo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: Y_SUELO + 28, height: 2,
        background: "rgba(242,238,230,0.14)" }} />

      {CANALES.map((c, i) => {
        const ap = apagados && i !== BUENO;
        const entra = interpolate(t, [0.3 + i * 0.28, 1.1 + i * 0.28], [0, 1], suave);
        const agua = interpolate(t, [2.4 + i * 0.2, 3.2 + i * 0.2], [0, 1], cl);
        return (
          <React.Fragment key={c.n}>
            <Grifo x={c.x} nombre={c.n} apagado={ap} op={entra} />
            <Chorro x0={c.x} x1={apagados ? c.cae : c.x} activo={agua} apagado={ap} semilla={i} />
            {apagados && i !== BUENO ? <Charco x={c.cae} t={REVELA + 0.35} /> : null}
          </React.Fragment>
        );
      })}

      <Cubo nivel={nivel} />
      {apagados ? (
        <div style={{ position: "absolute", left: 540 - 234, top: BOCA - 52, width: 468, height: 322,
          border: `4px solid ${ORANGE}`, borderRadius: 18,
          opacity: interpolate(frame, [f(REVELA + 0.4), f(REVELA + 0.9)], [0, 1], cl) }} />
      ) : null}

      <Texto ent={0.6} sal={3.4} y={210} lineas={[{ t: "INVIERTES", tam: 78 }, { t: "EN CUATRO SITIOS", tam: 66 }]} />
      <Texto ent={3.8} sal={7.0} y={230} lineas={[{ t: "¿CUÁL LLENA", tam: 72 }, { t: "EL CUBO?", tam: 92, naranja: true }]} />
      <Texto ent={7.4} sal={10.9} y={250} lineas={[{ t: "NO LO SABES", tam: 92, naranja: true }]} />
      <Texto ent={11.6} sal={14.6} y={200} lineas={[{ t: "PORQUE NADIE MIRA", tam: 58 }, { t: "DÓNDE CAE EL AGUA", tam: 58, naranja: true }]} />
      <Texto ent={15.0} sal={17.6} y={210} lineas={[{ t: "TRES SE ESTÁN", tam: 64 }, { t: "CAYENDO FUERA", tam: 78, naranja: true }]} />

      <Sequence from={f(17.8)}>
        <AbsoluteFill style={{ backgroundColor: "rgba(8,8,10,0.94)", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", padding: "0 60px" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 62, color: CREAM, lineHeight: 1.08 }}>Y EN ENERO</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 62, color: CREAM, lineHeight: 1.08 }}>RENUEVAS</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 104, color: ORANGE, lineHeight: 1.08 }}>LOS CUATRO</div>
            <div style={{ width: 84, height: 4, background: ORANGE, margin: "46px auto 34px" }} />
            <div style={{ fontFamily: DISPLAY, fontSize: 58, color: CREAM }}>
              Escríbeme <span style={{ color: ORANGE }}>FUGAS</span>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5 }}>
        <div style={{ width: `${interpolate(frame, [0, GRIFOS_FRAMES], [0, 100], cl)}%`, height: "100%", background: ORANGE }} />
      </div>
    </AbsoluteFill>
  );
};

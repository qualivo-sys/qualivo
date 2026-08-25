import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { CREAM, DISPLAY, INK, LABEL, MUT, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) } as const;
export const CARPETAS_FRAMES = f(22.5);

const MESES = ["MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO"];
const COSTES = ["EL ANUNCIO", "LA LLAMADA", "LA REUNIÓN", "LA PROPUESTA"];

/* carpeta cerrada con su fecha */
const Carpeta: React.FC<{
  x: number; y: number; w: number; fecha: string; encendida?: boolean; op?: number;
}> = ({ x, y, w, fecha, encendida, op = 1 }) => {
  const h = w * 0.74;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: op }}>
      {/* pestaña */}
      <div style={{
        position: "absolute", left: w * 0.06, top: -h * 0.12, width: w * 0.36, height: h * 0.16,
        borderRadius: "8px 8px 0 0",
        background: encendida ? "#C2591A" : "#2A2E35",
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: 10,
        background: encendida ? "#E8590C" : "#33383F",
        border: `1px solid ${encendida ? "rgba(255,180,120,0.5)" : "rgba(242,238,230,0.12)"}`,
      }} />
      <div style={{
        position: "absolute", left: w * 0.1, bottom: h * 0.16,
        fontFamily: LABEL, fontWeight: 700, fontSize: Math.max(11, w * 0.115),
        letterSpacing: "0.08em", color: encendida ? "#1A1206" : "rgba(242,238,230,0.42)",
      }}>{fecha}</div>
    </div>
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

export const Carpetas: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  /* el documento se escribe y entra en la carpeta */
  const escribe = interpolate(t, [0.4, 2.4], [0, 1], cl);
  const entra = interpolate(t, [2.7, 3.7], [0, 1], suave);
  /* la cámara se aleja y aparece la pared de carpetas */
  const aleja = interpolate(t, [10.0, 12.2], [0, 1], suave);
  const escalaHeroe = 1 - 0.62 * aleja;

  /* el calendario de detrás */
  const mesIdx = interpolate(t, [5.2, 10.0], [0, MESES.length - 1], cl);

  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage:
        `linear-gradient(${CREAM} 1px, transparent 1px), linear-gradient(90deg, ${CREAM} 1px, transparent 1px)`,
        backgroundSize: "72px 72px" }} />

      {/* calendario que corre detrás */}
      {t >= 5.0 && t < 12.4 ? (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 1270, textAlign: "center",
          opacity: interpolate(t, [5.0, 5.5], [0, 1], cl) * interpolate(t, [11.4, 12.4], [1, 0], cl),
          overflow: "hidden", height: 96,
        }}>
          <div style={{ transform: `translateY(${-Math.round(mesIdx) * 96}px)` }}>
            {MESES.map((m) => (
              <div key={m} style={{
                height: 96, fontFamily: DISPLAY, fontSize: 74,
                color: "rgba(242,238,230,0.40)", lineHeight: "96px", letterSpacing: "0.06em",
              }}>{m}</div>
            ))}
          </div>
        </div>
      ) : null}

      {/* pared de carpetas */}
      {aleja > 0.01 ? (
        <div style={{ opacity: aleja }}>
          {Array.from({ length: 16 }).map((_, k) => {
            const col = k % 4, fila = Math.floor(k / 4);
            const w = 190;
            const enc = t >= 15.4 && k % 3 === 1;
            return (
              <Carpeta key={k} x={78 + col * 232} y={620 + fila * 218} w={w}
                fecha={["14 MAR", "2 ABR", "27 ABR", "9 MAY", "21 MAY"][k % 5]}
                encendida={enc}
                op={interpolate(t, [11.0 + k * 0.045, 11.5 + k * 0.045], [0, 1], cl)} />
            );
          })}
        </div>
      ) : null}

      {/* la carpeta protagonista */}
      <div style={{
        position: "absolute", left: "50%", top: 690,
        transform: `translateX(-50%) scale(${escalaHeroe})`,
        opacity: interpolate(t, [11.6, 12.4], [1, 0], cl),
      }}>
        <div style={{ position: "relative", width: 470, height: 348 }}>
          {/* el documento que se escribe y se mete dentro */}
          <div style={{
            position: "absolute", left: 62, top: -190 + entra * 250, width: 346, height: 240,
            background: "#EDE9E1", borderRadius: 8, padding: "26px 24px",
            opacity: 1 - entra * 0.55, transform: `scale(${1 - entra * 0.12})`,
            boxShadow: "0 24px 60px -30px rgba(0,0,0,0.9)",
          }}>
            <div style={{ height: 13, width: "52%", borderRadius: 6, background: "#3A3F47" }} />
            {[0, 1, 2, 3, 4].map((k) => (
              <div key={k} style={{
                height: 9, borderRadius: 5, background: "#9AA0A8", marginTop: 17,
                width: `${Math.max(0, Math.min(1, escribe * 5 - k)) * (88 - k * 7)}%`,
              }} />
            ))}
          </div>
          <Carpeta x={0} y={96} w={470} fecha="14 DE MARZO" />
        </div>
      </div>

      {/* lo que ya habías pagado por ese contacto */}
      {t >= 15.4 && t < 19.0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1500, bottom: 0, display: "flex", alignItems: "flex-start",
          justifyContent: "center", gap: 13, flexWrap: "wrap", padding: "26px 50px",
          background: "linear-gradient(180deg, rgba(8,8,10,0) 0%, rgba(8,8,10,0.92) 26%, rgba(8,8,10,0.92) 100%)" }}>
          {COSTES.map((c, k) => (
            <div key={c} style={{
              fontFamily: LABEL, fontWeight: 700, fontSize: 24, letterSpacing: "0.06em",
              color: CREAM, background: "rgba(10,10,11,0.82)",
              border: `2px solid ${ORANGE}`, borderRadius: 11, padding: "13px 20px",
              opacity: interpolate(t, [15.5 + k * 0.34, 15.9 + k * 0.34], [0, 1], cl),
            }}>{c}</div>
          ))}
        </div>
      ) : null}

      <Texto ent={3.9} sal={5.0} y={250} lineas={[{ t: "ENVIADO", tam: 96, naranja: true }]} />
      <Texto ent={5.6} sal={9.8} y={230} lineas={[{ t: "«ME LO PIENSO", tam: 68 }, { t: "Y TE DIGO»", tam: 68 }]} />
      <Texto ent={12.6} sal={15.0} y={240} lineas={[{ t: "Y NO", tam: 74 }, { t: "ES EL ÚNICO", tam: 88, naranja: true }]} />
      <Texto ent={15.5} sal={18.9} y={250} lineas={[{ t: "CADA UNO", tam: 64 }, { t: "YA TE HABÍA COSTADO", tam: 52, naranja: true }]} />

      <Sequence from={f(19.3)}>
        <AbsoluteFill style={{ backgroundColor: "rgba(8,8,10,0.95)", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center", padding: "0 56px" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 56, color: CREAM, lineHeight: 1.14 }}>NO ES UN CLIENTE</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 56, color: CREAM, lineHeight: 1.14 }}>QUE NO LLEGÓ</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 74, color: ORANGE, lineHeight: 1.14, marginTop: 16 }}>ES UNO QUE LLEGÓ</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 74, color: ORANGE, lineHeight: 1.14 }}>Y SE FUE SOLO</div>
            <div style={{ width: 84, height: 4, background: ORANGE, margin: "44px auto 30px" }} />
            <div style={{ fontFamily: DISPLAY, fontSize: 54, color: CREAM }}>
              Escríbeme <span style={{ color: ORANGE }}>FUGAS</span>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5 }}>
        <div style={{ width: `${interpolate(frame, [0, CARPETAS_FRAMES], [0, 100], cl)}%`, height: "100%", background: ORANGE }} />
      </div>
    </AbsoluteFill>
  );
};

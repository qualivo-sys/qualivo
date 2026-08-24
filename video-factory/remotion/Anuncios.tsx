import React from "react";
import {
  AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame,
} from "remotion";
import { CREAM, DISPLAY, INK, LABEL, MUT, ORANGE } from "./theme";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = { ...cl, easing: Easing.bezier(0.16, 1, 0.3, 1) } as const;

export const ANUNCIOS_FRAMES = f(19.5);

/* ---------- el anuncio genérico: tres iguales con distinto color ---------- */
type Ficha = { tono: string; marca: string; titular: string };
const FICHAS: Ficha[] = [
  { tono: "#3E6C8E", marca: "TU EMPRESA",   titular: "LÍDERES EN EL SECTOR" },
  { tono: "#7A5E8C", marca: "OTRA EMPRESA", titular: "CALIDAD Y CONFIANZA" },
  { tono: "#4E7A63", marca: "UNA TERCERA",  titular: "TU SOCIO DE CONFIANZA" },
];

const Anuncio: React.FC<{
  fi: Ficha; x: number; y: number; esc: number; op: number;
  tapado?: number; marcaVisible?: string;
}> = ({ fi, x, y, esc, op, tapado = 0, marcaVisible }) => (
  <div style={{
    position: "absolute", left: "50%", top: "50%",
    transform: `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${esc})`,
    width: 520, borderRadius: 22, overflow: "hidden", opacity: op,
    background: "#15171B", border: "1px solid rgba(242,238,230,0.12)",
    boxShadow: "0 30px 90px -40px rgba(0,0,0,0.9)",
  }}>
    {/* la foto de siempre */}
    <div style={{
      height: 300, background: `linear-gradient(140deg, ${fi.tono} 0%, #1B1E23 118%)`,
      position: "relative",
    }}>
      <div style={{
        position: "absolute", left: 34, bottom: 34, width: 120, height: 120,
        borderRadius: "50%", background: "rgba(255,255,255,0.13)",
      }} />
      <div style={{
        position: "absolute", right: 40, top: 46, width: 190, height: 12,
        borderRadius: 6, background: "rgba(255,255,255,0.18)",
      }} />
      <div style={{
        position: "absolute", right: 40, top: 74, width: 130, height: 12,
        borderRadius: 6, background: "rgba(255,255,255,0.12)",
      }} />
    </div>
    <div style={{ padding: "26px 30px 30px" }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 38, color: CREAM, lineHeight: 1.08 }}>
        {fi.titular}
      </div>
      <div style={{ height: 10, width: "82%", borderRadius: 5, background: "rgba(242,238,230,0.16)", marginTop: 18 }} />
      <div style={{ height: 10, width: "64%", borderRadius: 5, background: "rgba(242,238,230,0.11)", marginTop: 10 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, position: "relative" }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: fi.tono }} />
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 22, letterSpacing: "0.16em", color: MUT }}>
          {marcaVisible ?? fi.marca}
        </div>
        {tapado > 0 ? (
          <div style={{
            position: "absolute", left: -6, top: -8, height: 52,
            width: `${tapado * 100}%`, maxWidth: 330, background: ORANGE, borderRadius: 8,
          }} />
        ) : null}
      </div>
    </div>
  </div>
);

/* ---------- rótulo ---------- */
const Texto: React.FC<{ lineas: Array<{ t: string; naranja?: boolean; tam?: number }>;
  y: number; ent: number; sal?: number }> = ({ lineas, y, ent, sal }) => {
  const frame = useCurrentFrame();
  if (frame < f(ent) - 1) return null;
  const out = sal !== undefined ? interpolate(frame, [f(sal), f(sal) + 6], [1, 0], cl) : 1;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", opacity: out }}>
      {lineas.map((l, i) => {
        const f0 = f(ent) + i * 4;
        const sube = interpolate(frame, [f0, f0 + 11], [110, 0], suave);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: 2 }}>
            <div style={{
              fontFamily: DISPLAY, fontSize: l.tam ?? 74, lineHeight: 1.18,
              color: l.naranja ? ORANGE : CREAM, transform: `translateY(${sube}%)`,
              textShadow: "0 6px 40px rgba(0,0,0,0.9)",
            }}>{l.t}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Anuncios: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // el anuncio propio entra, se aparta a la izquierda y aparecen los otros dos
  const entra = interpolate(t, [0.2, 1.0], [0, 1], suave);
  const sep = interpolate(t, [6.0, 7.4], [0, 1], suave);
  const escala = interpolate(t, [6.0, 7.4], [1, 0.60], suave);
  const opOtros = interpolate(t, [6.4, 7.6], [0, 1], cl);

  // tapar el logo
  const tapa = interpolate(t, [3.2, 4.0], [0, 1], suave);

  // el intercambio de logos: a partir de 10.4 s cada ficha lleva la marca de otra
  const cambiado = t >= 10.4;
  const marcas = FICHAS.map((x) => x.marca);
  const marcaDe = (i: number) => (cambiado ? marcas[(i + 1) % 3] : marcas[i]);

  const sx = 332 * sep;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage:
        `linear-gradient(${CREAM} 1px, transparent 1px), linear-gradient(90deg, ${CREAM} 1px, transparent 1px)`,
        backgroundSize: "72px 72px" }} />

      {/* el tuyo */}
      <Anuncio fi={FICHAS[0]} x={-sx} y={-250} esc={entra * escala} op={entra}
               tapado={t < 6.0 ? tapa : 0} marcaVisible={t < 6.0 ? FICHAS[0].marca : marcaDe(0)} />
      {/* los otros dos */}
      <Anuncio fi={FICHAS[1]} x={0} y={-250} esc={escala} op={opOtros} marcaVisible={marcaDe(1)} />
      <Anuncio fi={FICHAS[2]} x={sx} y={-250} esc={escala} op={opOtros} marcaVisible={marcaDe(2)} />

      <Texto ent={0.6} sal={3.0} y={1330} lineas={[{ t: "COGE TU ÚLTIMO ANUNCIO", tam: 62 }]} />
      <Texto ent={3.3} sal={5.8} y={1330} lineas={[{ t: "Y TÁPALE EL LOGO", tam: 78, naranja: true }]} />
      <Texto ent={7.6} sal={10.1} y={1330} lineas={[
        { t: "AHORA MÍRALO", tam: 62 },
        { t: "AL LADO DE LOS DEMÁS", tam: 62 },
      ]} />
      <Texto ent={10.6} sal={13.1} y={1300} lineas={[
        { t: "LES HE CAMBIADO", tam: 58 },
        { t: "LOS LOGOS DE SITIO", tam: 58 },
        { t: "¿SE NOTA?", tam: 88, naranja: true },
      ]} />
      <Texto ent={13.6} sal={16.4} y={1270} lineas={[
        { t: "SI PODRÍA SER", tam: 62 },
        { t: "DE CUALQUIERA", tam: 62 },
        { t: "NO PAGAS POR CLIENTES", tam: 56, naranja: true },
      ]} />

      {/* cierre */}
      <Sequence from={f(16.6)}>
        <AbsoluteFill style={{ backgroundColor: "rgba(8,8,10,0.94)", justifyContent: "center", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 84, color: CREAM, lineHeight: 1.05 }}>PAGAS POR</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 118, color: ORANGE, lineHeight: 1.05 }}>ATENCIÓN</div>
            <div style={{ width: 84, height: 4, background: ORANGE, margin: "44px auto 36px" }} />
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 25, letterSpacing: "0.22em",
              color: "rgba(242,238,230,0.6)", textTransform: "uppercase", lineHeight: 1.7 }}>
              La primera fuga del recorrido
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 62, color: CREAM, marginTop: 22 }}>
              Escríbeme <span style={{ color: ORANGE }}>FUGAS</span>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5 }}>
        <div style={{ width: `${interpolate(frame, [0, ANUNCIOS_FRAMES], [0, 100], cl)}%`,
          height: "100%", background: ORANGE }} />
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CREAM, DISPLAY, INK, LABEL, ORANGE, MUT } from "./theme";

export type Lamina = {
  kicker?: string;
  lineas: Array<{ t: string; naranja?: boolean; tam?: number }>;
  pie?: string;
  numero?: string;
  cierre?: boolean;
};

const NO_INTERESADO: Lamina[] = [
  { lineas: [{ t: "«NO", tam: 250 }, { t: "INTERESADO»", tam: 152, naranja: true }],
    pie: "La etiqueta más cara que existe en un CRM" },
  { lineas: [{ t: "Y CASI NUNCA", tam: 96 }, { t: "ES VERDAD", tam: 132, naranja: true }] },
  { lineas: [{ t: "LO QUE HAY", tam: 92 }, { t: "CASI SIEMPRE", tam: 92 }, { t: "ES «AHORA NO»", tam: 104, naranja: true }] },
  { lineas: [{ t: "Y NO ES", tam: 92 }, { t: "LO MISMO", tam: 132, naranja: true }] },
  { lineas: [{ t: "UN «AHORA NO»", tam: 74 }, { t: "CADUCA EN SEMANAS", tam: 74, naranja: true }],
    pie: "Un «no interesado» no caduca nunca: te lo quitas de la lista y ya está." },
  { lineas: [{ t: "ESO", tam: 100 }, { t: "TIENE NOMBRE", tam: 92 }, { t: "ES UNA FUGA", tam: 108, naranja: true }],
    pie: "Dinero que ya entró en tu negocio y se va por un sitio que nadie mira." },
  { cierre: true,
    lineas: [{ t: "¿QUIERES SABER", tam: 68 }, { t: "DÓNDE ESTÁN", tam: 68 }, { t: "LAS TUYAS?", tam: 68 }],
    pie: "FUGAS" },
];

const NO_CONTRATES: Lamina[] = [
  { lineas: [{ t: "NO CONTRATES", tam: 118 }, { t: "A NADIE", tam: 118 }, { t: "TODAVÍA", tam: 152, naranja: true }] },
  { lineas: [{ t: "ANTES COGE", tam: 96 }, { t: "UNA SEMANA", tam: 96 }, { t: "DE LLAMADAS", tam: 110, naranja: true }] },
  { lineas: [{ t: "Y HAZ", tam: 96 }, { t: "DOS MONTONES", tam: 130, naranja: true }],
    pie: "Los que iban a comprar. Los que preguntaban." },
  { lineas: [{ t: "¿NO PUEDES", tam: 96 }, { t: "HACERLOS?", tam: 130, naranja: true }],
    pie: "Entonces no tienes un problema de personal." },
  { lineas: [{ t: "SI CONTRATAS", tam: 88 }, { t: "AHORA, TENDRÁS", tam: 88 }, { t: "DOS PERSONAS", tam: 104, naranja: true }],
    pie: "Atendiendo igual de bien y de mal, por orden de llegada." },
  { lineas: [{ t: "NO ERA", tam: 104 }, { t: "DE MANOS", tam: 104 }, { t: "ERA DE CRITERIO", tam: 116, naranja: true }] },
  { lineas: [{ t: "CONTRATAR", tam: 100 }, { t: "ES LA FORMA", tam: 84 }, { t: "MÁS CARA", tam: 116, naranja: true }],
    pie: "De tapar una decisión que nadie ha tomado." },
  { cierre: true,
    lineas: [{ t: "¿QUIERES SABER", tam: 68 }, { t: "QUÉ MIRARÍA YO", tam: 68 }, { t: "PRIMERO?", tam: 68 }],
    pie: "DIAGNÓSTICO" },
];

export const SETS: Record<string, Lamina[]> = {
  "no-interesado": NO_INTERESADO,
  "no-contrates": NO_CONTRATES,
};

export const Carrusel: React.FC<{ i?: number; set?: string }> = ({ i = 0, set = "no-interesado" }) => {
  const LAMINAS = SETS[set] ?? NO_INTERESADO;
  const L = LAMINAS[i] ?? LAMINAS[0];
  return (
    <AbsoluteFill style={{ backgroundColor: L.cierre ? "#08080A" : INK, padding: 92,
      justifyContent: "center", overflow: "hidden" }}>
      {/* rejilla tenue de fondo */}
      <AbsoluteFill style={{ opacity: 0.055, backgroundImage:
        `linear-gradient(${CREAM} 1px, transparent 1px), linear-gradient(90deg, ${CREAM} 1px, transparent 1px)`,
        backgroundSize: "68px 68px" }} />
      {/* filo naranja */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: ORANGE }} />

      {L.kicker ? (
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 24, letterSpacing: "0.26em",
          color: MUT, textTransform: "uppercase", marginBottom: 34 }}>{L.kicker}</div>
      ) : null}

      <div>
        {L.lineas.map((l, k) => (
          <div key={k} style={{ fontFamily: DISPLAY, fontSize: l.tam ?? 96, lineHeight: 1.0,
            letterSpacing: "-0.005em", color: l.naranja ? ORANGE : CREAM }}>{l.t}</div>
        ))}
      </div>

      {L.pie && !L.cierre ? (
        <>
          <div style={{ width: 92, height: 5, background: ORANGE, margin: "46px 0 28px" }} />
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, lineHeight: 1.45,
            color: "rgba(242,238,230,0.72)", maxWidth: 820 }}>{L.pie}</div>
        </>
      ) : null}

      {L.cierre ? (
        <>
          <div style={{ width: 92, height: 5, background: ORANGE, margin: "46px 0 34px" }} />
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em",
            color: MUT, textTransform: "uppercase" }}>Escríbeme</div>
          <div style={{ fontFamily: DISPLAY, fontSize: L.pie && L.pie.length > 6 ? 128 : 168, color: ORANGE, lineHeight: 1.0,
            marginTop: 8 }}>{L.pie}</div>
        </>
      ) : null}

      <div style={{ position: "absolute", left: 92, bottom: 74, display: "flex",
        alignItems: "center", gap: 20 }}>
        <Img src={staticFile("qualivo.png")} style={{ height: 40, opacity: 0.9 }} />
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 21, letterSpacing: "0.18em",
          color: "rgba(242,238,230,0.34)" }}>{i + 1} / {LAMINAS.length}</div>
      </div>
    </AbsoluteFill>
  );
};

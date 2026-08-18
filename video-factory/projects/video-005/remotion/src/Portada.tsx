import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CREAM, DISPLAY, FONT, INK, MUT, ORANGE, kicker } from "./theme";

// Portada del reel (fotograma fijo 1080×1920)
export const Portada: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: INK, fontFamily: FONT }}>
      <Img
        src={staticFile("portada-bg.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.35) 45%, rgba(10,10,11,0.82) 100%)",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", marginTop: -40 }}>
          <div style={{ ...kicker, fontSize: 36, color: CREAM }}>
            ESTE VÍDEO LO HA HECHO
          </div>
          <div
            style={{
              marginTop: 30,
              fontFamily: DISPLAY,
              fontSize: 168,
              lineHeight: 0.98,
              color: ORANGE,
              textShadow: "0 6px 0 rgba(0,0,0,0.45), 0 18px 60px rgba(0,0,0,0.8)",
            }}
          >
            UN EMPLEADO
            <br />
            DIGITAL
          </div>
          <div
            style={{
              marginTop: 36,
              fontWeight: 700,
              fontSize: 40,
              color: CREAM,
            }}
          >
            De la idea al montaje. Sin personas.
          </div>
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 130,
          textAlign: "center",
        }}
      >
        <div style={{ ...kicker, fontSize: 24, color: MUT }}>SÍGUEME</div>
        <div
          style={{
            marginTop: 10,
            fontFamily: DISPLAY,
            fontSize: 56,
            color: CREAM,
          }}
        >
          @maikel.echevarria
        </div>
      </div>
    </AbsoluteFill>
  );
};

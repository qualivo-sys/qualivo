import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { CREAM, DISPLAY } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type Cue = {
  t0: number; // segundos (locales de la escena)
  t1: number;
  lines: Array<{
    text: string;
    color?: string;
    size?: number;
    font?: string;
    weight?: number;
  }>;
};

// Subtítulos cinéticos estilo v5/v6: entran con golpe (pop + microrrotación),
// salen a corte. Centrados en la zona baja, sombra dura para legibilidad.
export const Subs: React.FC<{ cues: Cue[]; y?: number }> = ({
  cues,
  y = 1150,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <>
      {cues.map((c) => {
        if (t < c.t0 || t >= c.t1) return null;
        const f0 = c.t0 * 30;
        const pop = interpolate(frame, [f0, f0 + 9], [0.55, 1], {
          ...clamp,
          easing: Easing.bezier(0.2, 1.4, 0.4, 1),
        });
        const rot = interpolate(frame, [f0, f0 + 9], [-2.5, 0], { ...clamp });
        return (
          <div
            key={c.t0}
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: y,
              textAlign: "center",
              scale: String(pop),
              rotate: `${rot}deg`,
              opacity: interpolate(frame, [f0, f0 + 3], [0, 1], { ...clamp }),
            }}
          >
            {c.lines.map((l, li) => (
              <div
                key={li}
                style={{
                  fontFamily: l.font ?? DISPLAY,
                  fontWeight: l.weight ?? 400,
                  fontSize: l.size ?? 92,
                  lineHeight: 1.04,
                  color: l.color ?? CREAM,
                  textShadow:
                    "0 4px 0 rgba(0,0,0,0.55), 0 10px 40px rgba(0,0,0,0.8)",
                  letterSpacing: "0.01em",
                }}
              >
                {l.text}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};

import React from "react";
import { Composition } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Hook } from "./scenes/Hook";
import { Problema } from "./scenes/Problema";
import { Dolor } from "./scenes/Dolor";
import { Pasos } from "./scenes/Pasos";
import { Remate } from "./scenes/Remate";
import "./fonts";

const FPS = 30;

// duraciones por escena (frames)
const D_HOOK = 195;
const D_PROBLEMA = 225;
const D_DOLOR = 290;
const D_PASOS = 450;
const D_REMATE = 385;
const T = 12; // duración de cada transición

export const Manifiesto: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D_HOOK} name="Hook">
        <Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence durationInFrames={D_PROBLEMA} name="Problema">
        <Problema />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence durationInFrames={D_DOLOR} name="Dolor">
        <Dolor />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence durationInFrames={D_PASOS} name="Pasos">
        <Pasos />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />
      <TransitionSeries.Sequence durationInFrames={D_REMATE} name="Remate">
        <Remate />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <Composition
      id="Manifiesto"
      component={Manifiesto}
      durationInFrames={D_HOOK + D_PROBLEMA + D_DOLOR + D_PASOS + D_REMATE - 4 * T}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

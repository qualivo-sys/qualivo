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

export const Manifiesto: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={290} name="Hook">
        <Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 12 })}
      />
      <TransitionSeries.Sequence durationInFrames={375} name="Problema">
        <Problema />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: 12 })}
      />
      <TransitionSeries.Sequence durationInFrames={435} name="Dolor">
        <Dolor />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 12 })}
      />
      <TransitionSeries.Sequence durationInFrames={540} name="Pasos">
        <Pasos />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 12 })}
      />
      <TransitionSeries.Sequence durationInFrames={245} name="Remate">
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
      durationInFrames={290 + 375 + 435 + 540 + 245 - 4 * 12}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

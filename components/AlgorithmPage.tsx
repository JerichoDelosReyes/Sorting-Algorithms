"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { recordBubbleSort } from "../lib/bubbleSort";
import { recordMergeSort } from "../lib/mergeSort";
import { recordQuickSort } from "../lib/quickSort";
import { ALGO_INFO } from "../lib/algoInfo";
import { generateRandomArray } from "../lib/arrayUtils";
import { soundEngine } from "../lib/sounds";
import { Algorithm, FrameWithLine } from "../lib/types";
import { useSound } from "./SoundProvider";
import AlgoDescription from "./AlgoDescription";
import CodePanel from "./CodePanel";
import ComplexityCard from "./ComplexityCard";
import ComplexityGraph from "./ComplexityGraph";
import Controls from "./Controls";
import Visualizer from "./Visualizer";

const SPEED_VALUES = [500, 200, 80, 30, 5];

const RECORDERS: Record<Algorithm, (input: number[]) => FrameWithLine[]> = {
  bubble: recordBubbleSort,
  merge: recordMergeSort,
  quick: recordQuickSort
};

interface AlgorithmPageProps {
  algorithmId: Algorithm;
}

export default function AlgorithmPage({ algorithmId }: AlgorithmPageProps) {
  const info = ALGO_INFO[algorithmId];
  const { enabled } = useSound();

  const [arraySize, setArraySize] = useState(40);
  const [array, setArray] = useState<number[]>(() => generateRandomArray(40));
  const [frames, setFrames] = useState<FrameWithLine[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const previousCounts = useRef({ comparisons: 0, swaps: 0 });

  useEffect(() => {
    const nextFrames = RECORDERS[algorithmId](array);
    setFrames(nextFrames);
    setCurrentFrame(0);
    setIsPlaying(false);
    previousCounts.current = { comparisons: 0, swaps: 0 };
  }, [algorithmId, array]);

  useEffect(() => {
    if (!enabled || frames.length === 0) {
      return;
    }
    const frame = frames[Math.min(currentFrame, frames.length - 1)];
    const previous = previousCounts.current;

    if (frame.comparisons > previous.comparisons) {
      const highlightIndex = Number(Object.keys(frame.highlights)[0] ?? 0);
      const maxValue = Math.max(...frame.array, 1);
      soundEngine.playComparison(frame.array[highlightIndex] ?? maxValue, maxValue);
    } else if (frame.swaps > previous.swaps) {
      soundEngine.playSwap();
    }

    previousCounts.current = {
      comparisons: frame.comparisons,
      swaps: frame.swaps
    };
  }, [currentFrame, enabled, frames]);

  useEffect(() => {
    if (!isPlaying || frames.length === 0) {
      return;
    }

    if (currentFrame >= frames.length - 1) {
      setIsPlaying(false);
      if (enabled) {
        soundEngine.playComplete();
      }
      return;
    }

    const delay = SPEED_VALUES[Math.max(0, speed - 1)] ?? SPEED_VALUES[0];
    const timeout = window.setTimeout(() => {
      setCurrentFrame((prev) => Math.min(prev + 1, frames.length - 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [currentFrame, enabled, frames.length, isPlaying, speed]);

  const handleShuffle = useCallback(() => {
    setArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentFrame(0);
  }, []);

  const handlePlayToggle = useCallback(() => {
    if (!isPlaying) {
      soundEngine.init();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const handleStepBack = useCallback(() => {
    if (isPlaying) {
      return;
    }
    setCurrentFrame((prev) => Math.max(prev - 1, 0));
  }, [isPlaying]);

  const handleStepForward = useCallback(() => {
    if (isPlaying) {
      return;
    }
    setCurrentFrame((prev) => Math.min(prev + 1, frames.length - 1));
  }, [frames.length, isPlaying]);

  const handleSizeChange = useCallback((value: number) => {
    setArraySize(value);
    setArray(generateRandomArray(value));
  }, []);

  const headerBadges = useMemo(() => {
    return [
      { label: "Worst", value: info.complexity.worst },
      { label: "Space", value: info.complexity.space },
      { label: algorithmId === "quick" ? "In-place" : info.stable ? "Stable" : "Not Stable", value: true }
    ];
  }, [info, algorithmId]);

  const activeFrame = frames[Math.min(currentFrame, frames.length - 1)];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <header className="border-b border-[var(--color-border)] pb-4 sm:pb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">{info.name}</h1>
        <p className="mt-2 text-xs text-[var(--color-text-secondary)] sm:text-sm">
          {info.shortDescription} | Worst {info.complexity.worst} | Space
          {" "}
          {info.complexity.space}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
          {headerBadges.map((badge) => (
            <span
              key={badge.label}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                badge.label === "Worst"
                  ? "bg-[#FFE5E5] text-[#C91C1C]"
                  : badge.label === "Space"
                    ? "bg-[#FFF4CE] text-[#B47804]"
                    : badge.label === "In-place" || badge.label === "Stable"
                      ? "bg-[#E6F6EA] text-[#1F7A3D]"
                      : "bg-[#FFE5E5] text-[#C91C1C]"
              }`}
            >
              {badge.label === "Stable" || badge.label === "Not Stable" || badge.label === "In-place"
                ? badge.label
                : `${badge.label}: ${badge.value}`}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-4 md:gap-6 lg:grid-cols-[5fr_3fr] xl:grid-cols-[2fr_1fr] lg:items-stretch">
        <div className="flex min-w-0 flex-col rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card backdrop-blur lg:h-[36rem] overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 bg-black/5 flex-shrink-0">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="text-xs font-medium text-[var(--color-text-secondary)] font-mono">Visualizer.canvas</div>
            <div className="w-12"></div> {/* Spacer for centering */}
          </div>
          <div className="flex flex-col flex-1 p-4 sm:p-6 pb-6 min-h-0 overflow-y-auto">
            <Visualizer
              frames={frames}
              currentFrameIndex={currentFrame}
              totalFrames={frames.length}
            />
            <div className="mt-auto pt-4 flex-shrink-0">
              <Controls
                isPlaying={isPlaying}
                onPlayToggle={handlePlayToggle}
                onShuffle={handleShuffle}
                onStepBack={handleStepBack}
                onStepForward={handleStepForward}
                onReset={handleReset}
                canStepBack={currentFrame > 0}
                canStepForward={currentFrame < frames.length - 1}
                arraySize={arraySize}
                onArraySizeChange={handleSizeChange}
                speed={speed}
                onSpeedChange={setSpeed}
                frameIndex={currentFrame}
                totalFrames={frames.length}
              />
            </div>
          </div>
        </div>

        <div className="flex h-[24rem] min-w-0 w-full sm:h-[26rem] lg:h-[36rem]">
          <CodePanel code={info.code} activeLine={activeFrame?.activeLine} fileName={`${info.name.replace(/\s+/g, '')}.ts`} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <ComplexityCard algorithmId={algorithmId} />
        <AlgoDescription algorithmId={algorithmId} />
      </div>

      <div className="mt-8">
        <ComplexityGraph highlightAlgorithm={algorithmId} />
      </div>

      <footer className="mt-12 flex flex-col gap-3 border-t border-[var(--color-border)] pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold hover:bg-[var(--color-surface)] transition-colors text-center"
        >
          Back to Home
        </Link>
        <Link
          href="/compare"
          className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-shadow text-center"
        >
          Compare All Algorithms
        </Link>
      </footer>
    </div>
  );
}

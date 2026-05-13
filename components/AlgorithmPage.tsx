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
      { label: "Space", value: info.complexity.space },
      { label: info.stable ? "Stable" : "Not Stable", value: true }
    ];
  }, [info]);

  const activeFrame = frames[Math.min(currentFrame, frames.length - 1)];

  const badgeStyles: Record<string, string> = {
    Space: "rounded-full border border-[#d4a017]/25 bg-[#d4a017]/16 px-4 py-1.5 text-xs font-semibold text-[#d4a017]",
    Stable: "rounded-full border border-[#2f8f5b]/20 bg-[#2f8f5b]/12 px-4 py-1.5 text-xs font-semibold text-[#2f8f5b]",
    "Not Stable": "rounded-full border border-[#8a8f98]/20 bg-[#8a8f98]/12 px-4 py-1.5 text-xs font-semibold text-[#8a8f98]"
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <header className="border-b border-[var(--color-border)] pb-4 sm:pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 lg:items-center">
          <div className="flex min-w-0 items-start justify-between gap-3 sm:block">
            <h1 className="min-w-0 text-2xl font-semibold font-sans sm:text-4xl">{info.name}</h1>
            <div className="flex shrink-0 items-center gap-2 sm:hidden">
              {headerBadges.map((badge) => (
                <span
                  key={badge.label}
                  className={badgeStyles[badge.label] ?? badgeStyles["Not Stable"]}
                >
                  {badge.label === "Stable" || badge.label === "Not Stable"
                    ? badge.label
                    : `${badge.label}: ${badge.value}`}
                </span>
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-card backdrop-blur sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={handleStepBack}
                disabled={currentFrame <= 0 || isPlaying}
                className="min-h-11 rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
              </button>
              <button
                type="button"
                onClick={handlePlayToggle}
                className="min-h-11 rounded-full bg-[#0a84ff] px-4 py-2 text-white transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                )}
              </button>
              <button
                type="button"
                onClick={handleStepForward}
                disabled={currentFrame >= frames.length - 1 || isPlaying}
                className="min-h-11 rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
              </button>
            </div>
            <div className="h-px w-full bg-[var(--color-border)] sm:hidden"></div>
            <div className="text-center text-xs font-mono text-[var(--color-text-secondary)] sm:border-l sm:border-[var(--color-border)] sm:pl-4 sm:text-left sm:pr-2">
              Frame {Math.min(currentFrame + 1, frames.length)} of {frames.length}
            </div>
          </div>
        </div>

        <div className="mt-3 hidden flex-wrap gap-2 sm:mt-4 sm:flex">
          {headerBadges.map((badge) => (
            <span
              key={badge.label}
              className={badgeStyles[badge.label] ?? badgeStyles["Not Stable"]}
            >
              {badge.label === "Stable" || badge.label === "Not Stable"
                ? badge.label
                : `${badge.label}: ${badge.value}`}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-4 md:gap-6 lg:grid-cols-[5fr_3fr] xl:grid-cols-[2fr_1fr] lg:items-stretch">
        <div className="flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card backdrop-blur lg:h-[36rem]">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-[#FF5F56]"></div>
              <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="h-3 w-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="flex flex-1 justify-center px-3 text-center text-xs font-mono font-medium text-[var(--color-text-secondary)]">
              <span className="truncate">Visualizer.canvas</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:flex-nowrap sm:justify-end">
              <button
                type="button"
                onClick={handleShuffle}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-2 py-2 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-hover)] sm:px-3"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:mr-1" style={{ display: 'inline' }}><polyline points="23 18 13 8 23 8"></polyline><polyline points="1 6 11 16 1 16"></polyline></svg>
                <span className="hidden sm:inline">Shuffle</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-2 py-2 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-hover)] gap-1 sm:px-3"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
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
                onShuffle={handleShuffle}
                onReset={handleReset}
                arraySize={arraySize}
                onArraySizeChange={handleSizeChange}
                speed={speed}
                onSpeedChange={setSpeed}
                showShuffleReset={false}
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
      </div>

      <div className="mt-8">
        <ComplexityGraph highlightAlgorithm={algorithmId} />
      </div>

      <footer className="mt-12 flex flex-col gap-3 border-t border-[var(--color-border)] pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors text-center hover:bg-[var(--color-hover)]"
        >
          Back to Home
        </Link>
        <Link
          href="/compare"
          className="rounded-full bg-[#0a84ff] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-shadow text-center"
        >
          Compare All Algorithms
        </Link>
      </footer>
    </div>
  );
}

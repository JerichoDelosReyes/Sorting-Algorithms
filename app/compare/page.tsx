"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CompareVisualizer from "../../components/CompareVisualizer";
import ComplexityGraph from "../../components/ComplexityGraph";
import { useSound } from "../../components/SoundProvider";
import { recordBubbleSort } from "../../lib/bubbleSort";
import { recordMergeSort } from "../../lib/mergeSort";
import { recordQuickSort } from "../../lib/quickSort";
import { ALGO_INFO } from "../../lib/algoInfo";
import { generateRandomArray } from "../../lib/arrayUtils";
import { soundEngine } from "../../lib/sounds";
import { Algorithm, FrameWithLine } from "../../lib/types";

const SPEED_VALUES = [500, 200, 80, 30, 5];
const ALGORITHMS: Algorithm[] = ["bubble", "merge", "quick"];

export default function ComparePage() {
  const { enabled } = useSound();
  const [arraySize, setArraySize] = useState(40);
  const [baseArray, setBaseArray] = useState<number[]>(() => generateRandomArray(40));
  const [globalFrame, setGlobalFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [isCompletionDismissed, setIsCompletionDismissed] = useState(false);

  const frames = useMemo<Record<Algorithm, FrameWithLine[]>>(() => ({
    bubble: recordBubbleSort(baseArray),
    merge: recordMergeSort(baseArray),
    quick: recordQuickSort(baseArray)
  }), [baseArray]);

  const maxFrames = Math.max(frames.bubble.length, frames.merge.length, frames.quick.length, 1);

  useEffect(() => {
    setGlobalFrame(0);
    setIsPlaying(false);
  }, [baseArray]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (globalFrame >= maxFrames - 1) {
      setIsPlaying(false);
      if (enabled) {
        soundEngine.playComplete();
      }
      return;
    }

    const delay = SPEED_VALUES[Math.max(0, speed - 1)] ?? SPEED_VALUES[0];
    const timeout = window.setTimeout(() => {
      setGlobalFrame((prev) => Math.min(prev + 1, maxFrames - 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [enabled, globalFrame, isPlaying, maxFrames, speed]);

  const handleShuffle = useCallback(() => {
    setIsCompletionDismissed(false);
    setBaseArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleReset = useCallback(() => {
    setIsCompletionDismissed(false);
    setGlobalFrame(0);
    setIsPlaying(false);
  }, []);

  const handlePlayToggle = useCallback(() => {
    if (!isPlaying) {
      soundEngine.init();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const handleSizeChange = useCallback((value: number) => {
    setIsCompletionDismissed(false);
    setArraySize(value);
    setBaseArray(generateRandomArray(value));
  }, []);

  const handleDismissCompletion = useCallback(() => {
    setIsCompletionDismissed(true);
  }, []);

  const handleStepBack = useCallback(() => {
    if (isPlaying) {
      return;
    }
    setGlobalFrame((prev) => Math.max(prev - 1, 0));
  }, [isPlaying]);

  const handleStepForward = useCallback(() => {
    if (isPlaying) {
      return;
    }
    setGlobalFrame((prev) => Math.min(prev + 1, maxFrames - 1));
  }, [isPlaying, maxFrames]);

  const items = useMemo(() => {
    return ALGORITHMS.map((id) => {
      const framesForAlgo = frames[id];
      const frameIndex = Math.min(globalFrame, framesForAlgo.length - 1);
      const frame = framesForAlgo[frameIndex];

      return {
        id,
        name: ALGO_INFO[id].name,
        frames: framesForAlgo,
        frameIndex,
        comparisons: frame?.comparisons ?? 0,
        swaps: frame?.swaps ?? 0,
        totalFrames: framesForAlgo.length,
      };
    });
  }, [frames, globalFrame]);

  const allDone = globalFrame >= maxFrames - 1 && maxFrames > 0;

  const winners = useMemo(() => {
    const comparisonCounts: Record<Algorithm, number> = {
      bubble: frames.bubble.at(-1)?.comparisons ?? 0,
      merge: frames.merge.at(-1)?.comparisons ?? 0,
      quick: frames.quick.at(-1)?.comparisons ?? 0
    };
    const swapCounts: Record<Algorithm, number> = {
      bubble: frames.bubble.at(-1)?.swaps ?? 0,
      merge: frames.merge.at(-1)?.swaps ?? 0,
      quick: frames.quick.at(-1)?.swaps ?? 0
    };
    const frameCounts: Record<Algorithm, number> = {
      bubble: frames.bubble.length,
      merge: frames.merge.length,
      quick: frames.quick.length
    };

    const getWinners = (values: Record<Algorithm, number>) => {
      const minValue = Math.min(...ALGORITHMS.map((id) => values[id]));
      return ALGORITHMS.filter((id) => values[id] === minValue);
    };

    return {
      comparisons: getWinners(comparisonCounts),
      swaps: getWinners(swapCounts),
      speed: getWinners(frameCounts)
    };
  }, [frames]);

  const formatWinners = (ids: Algorithm[]) => ids.map((id) => ALGO_INFO[id].name).join(" & ");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <header className="border-b border-[var(--color-border)] pb-4 sm:pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Algorithm Comparison</h1>
            <p className="mt-2 text-xs text-[var(--color-text-secondary)] sm:text-sm">
              All three algorithms run simultaneously on the same array.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-card backdrop-blur sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-4 flex-shrink-0">
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={handleStepBack}
                disabled={globalFrame <= 0 || isPlaying}
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
                disabled={globalFrame >= maxFrames - 1 || isPlaying}
                className="min-h-11 rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
              </button>
            </div>
            <div className="h-px w-full bg-[var(--color-border)] sm:hidden"></div>
            <div className="text-center text-xs font-mono text-[var(--color-text-secondary)] sm:border-l sm:border-[var(--color-border)] sm:pl-4 sm:text-left sm:pr-2">
              Frame {globalFrame + 1} of {maxFrames}
            </div>
          </div>
        </div>
      </header>

      <div className="mt-4 grid gap-3 sm:mt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-xs sm:text-sm">
            <span className="whitespace-nowrap text-[var(--color-text-secondary)]">Speed</span>
            <input
              type="range"
              min={1}
              max={5}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="flex-1 sm:w-20"
            />
            <span className="w-10 text-right text-[var(--color-text-primary)]">
              {SPEED_VALUES[Math.max(0, speed - 1)]}ms
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-xs sm:text-sm">
            <span className="whitespace-nowrap text-[var(--color-text-secondary)]">Size</span>
            <input
              type="range"
              min={10}
              max={100}
              value={arraySize}
              onChange={(event) => handleSizeChange(Number(event.target.value))}
              className="flex-1 sm:w-20"
            />
            <span className="w-8 text-right text-[var(--color-text-primary)]">{arraySize}</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 lg:w-auto lg:grid-cols-2 lg:justify-self-end">
          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-xs transition-colors hover:bg-[var(--color-hover)] disabled:opacity-50 sm:text-sm"
            disabled={isPlaying}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13 8 23 8"></polyline><polyline points="1 6 11 16 1 16"></polyline></svg>
            Shuffle
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-xs transition-colors hover:bg-[var(--color-hover)] sm:text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
            Reset
          </button>
        </div>
      </div>

      <div className="mt-8">
        <CompareVisualizer items={items} />
      </div>

      <div className="mt-8">
        <ComplexityGraph />
      </div>

      <AnimatePresence>
        {allDone && !isCompletionDismissed ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm shadow-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={handleDismissCompletion}
                className="absolute right-4 top-4 rounded-full p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)]"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-[#E5F0FF] p-3 text-[#0A84FF]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Comparison Complete!</h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Here are the final insights for the array size of {arraySize}.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-5 text-center shadow-sm">
                  <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Fewest Comparisons
                  </div>
                  <span className="mt-3 inline-flex items-center justify-center rounded-full bg-[var(--color-success-soft)] px-4 py-1.5 text-sm font-bold text-[var(--color-success-text)]">
                    {formatWinners(winners.comparisons)}
                  </span>
                </div>
                <div className="flex flex-col items-center rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-5 text-center shadow-sm">
                  <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Fewest Swaps
                  </div>
                  <span className="mt-3 inline-flex items-center justify-center rounded-full bg-[var(--color-success-soft)] px-4 py-1.5 text-sm font-bold text-[var(--color-success-text)]">
                    {formatWinners(winners.swaps)}
                  </span>
                </div>
                <div className="flex flex-col items-center rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-5 text-center shadow-sm">
                  <div className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Finished First
                  </div>
                  <span className="mt-3 inline-flex items-center justify-center rounded-full bg-[var(--color-success-soft)] px-4 py-1.5 text-sm font-bold text-[var(--color-success-text)]">
                    {formatWinners(winners.speed)}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="rounded-full bg-[#0A84FF] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
                >
                  Shuffle & Try Again
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

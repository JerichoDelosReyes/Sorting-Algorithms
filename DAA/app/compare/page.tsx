"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CompareVisualizer from "../../components/CompareVisualizer";
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
  const [baseArray, setBaseArray] = useState<number[]>(() =>
    generateRandomArray(40)
  );
  const [globalFrame, setGlobalFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  const frames = useMemo<Record<Algorithm, FrameWithLine[]>>(() => {
    return {
      bubble: recordBubbleSort(baseArray),
      merge: recordMergeSort(baseArray),
      quick: recordQuickSort(baseArray)
    };
  }, [baseArray]);

  const maxFrames = Math.max(
    frames.bubble.length,
    frames.merge.length,
    frames.quick.length,
    1
  );

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
    setBaseArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleReset = useCallback(() => {
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
    setArraySize(value);
    setBaseArray(generateRandomArray(value));
  }, []);

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
        totalFrames: framesForAlgo.length
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

  const formatWinners = (ids: Algorithm[]) =>
    ids.map((id) => ALGO_INFO[id].name).join(" & ");

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20">
      <header className="border-b border-[var(--color-border)] pb-6">
        <h1 className="text-3xl font-semibold">Algorithm Comparison</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          All three algorithms run simultaneously on the same array.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleShuffle}
          className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm"
          disabled={isPlaying}
        >
          Shuffle
        </button>
        <button
          type="button"
          onClick={handlePlayToggle}
          className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm">
          <span className="text-[var(--color-text-secondary)]">Speed</span>
          <input
            type="range"
            min={1}
            max={5}
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
          <span className="text-[var(--color-text-primary)]">
            {SPEED_VALUES[Math.max(0, speed - 1)]}ms
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm">
          <span className="text-[var(--color-text-secondary)]">Size</span>
          <input
            type="range"
            min={10}
            max={80}
            value={arraySize}
            onChange={(event) => handleSizeChange(Number(event.target.value))}
          />
          <span className="text-[var(--color-text-primary)]">{arraySize}</span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm"
        >
          Reset
        </button>
      </div>

      <div className="mt-8">
        <CompareVisualizer items={items} />
      </div>

      <AnimatePresence>
        {allDone ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card"
          >
            <h3 className="text-lg font-semibold">Results</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="rounded-[16px] bg-white/80 px-4 py-3">
                <div className="text-xs text-[var(--color-text-secondary)]">
                  Fewest Comparisons
                </div>
                <span className="mt-2 inline-flex rounded-full bg-[#E6F6EA] px-3 py-1 text-xs font-semibold text-[#1F7A3D]">
                  {formatWinners(winners.comparisons)}
                </span>
              </div>
              <div className="rounded-[16px] bg-white/80 px-4 py-3">
                <div className="text-xs text-[var(--color-text-secondary)]">
                  Fewest Swaps
                </div>
                <span className="mt-2 inline-flex rounded-full bg-[#E6F6EA] px-3 py-1 text-xs font-semibold text-[#1F7A3D]">
                  {formatWinners(winners.swaps)}
                </span>
              </div>
              <div className="rounded-[16px] bg-white/80 px-4 py-3">
                <div className="text-xs text-[var(--color-text-secondary)]">
                  Finished First
                </div>
                <span className="mt-2 inline-flex rounded-full bg-[#E6F6EA] px-3 py-1 text-xs font-semibold text-[#1F7A3D]">
                  {formatWinners(winners.speed)}
                </span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

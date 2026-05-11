"use client";

import React from "react";

const SPEED_VALUES = [500, 200, 80, 30, 5];

interface ControlsProps {
  isPlaying: boolean;
  onPlayToggle: () => void;
  onShuffle: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  canStepBack: boolean;
  canStepForward: boolean;
  arraySize: number;
  onArraySizeChange: (value: number) => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  frameIndex: number;
  totalFrames: number;
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 11-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

export default function Controls({
  isPlaying,
  onPlayToggle,
  onShuffle,
  onStepBack,
  onStepForward,
  onReset,
  canStepBack,
  canStepForward,
  arraySize,
  onArraySizeChange,
  speed,
  onSpeedChange,
  frameIndex,
  totalFrames
}: ControlsProps) {
  const speedLabel = SPEED_VALUES[Math.max(0, speed - 1)] ?? SPEED_VALUES[0];

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onShuffle}
        className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm"
        disabled={isPlaying}
      >
        <RefreshIcon />
        Shuffle
      </button>

      <button
        type="button"
        onClick={onStepBack}
        className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm"
        disabled={!canStepBack || isPlaying}
      >
        Step Back
      </button>

      <button
        type="button"
        onClick={onPlayToggle}
        className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white shadow-sm"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button
        type="button"
        onClick={onStepForward}
        className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm"
        disabled={!canStepForward || isPlaying}
      >
        Step Forward
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm"
      >
        Reset
      </button>

      <div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm">
        <span className="text-[var(--color-text-secondary)]">Size</span>
        <input
          type="range"
          min={10}
          max={80}
          value={arraySize}
          onChange={(event) => onArraySizeChange(Number(event.target.value))}
        />
        <span className="text-[var(--color-text-primary)]">{arraySize}</span>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm">
        <span className="text-[var(--color-text-secondary)]">Speed</span>
        <input
          type="range"
          min={1}
          max={5}
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
        />
        <span className="text-[var(--color-text-primary)]">{speedLabel}ms</span>
      </div>

      <div className="ml-auto rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-text-secondary)]">
        Frame {Math.min(frameIndex + 1, totalFrames)} of {totalFrames}
      </div>
    </div>
  );
}

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
  onShuffle,
  onReset,
  arraySize,
  onArraySizeChange,
  speed,
  onSpeedChange,
  showShuffleReset = true,
}: Omit<ControlsProps, 'onPlayToggle' | 'onStepBack' | 'onStepForward' | 'canStepBack' | 'canStepForward' | 'frameIndex' | 'totalFrames'> & { showShuffleReset?: boolean }) {
  const speedLabel = SPEED_VALUES[Math.max(0, speed - 1)] ?? SPEED_VALUES[0];

  return (
    <div className="mt-6 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4">
        {showShuffleReset && (
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={onShuffle}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-hover)] disabled:opacity-50 sm:px-5"
              disabled={isPlaying}
            >
              <RefreshIcon />
              <span>Shuffle</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-hover)] sm:px-5"
            >
              Reset Space
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Size</span>
            <input
              type="range"
              min={10}
              max={100}
              value={arraySize}
              onChange={(event) => onArraySizeChange(Number(event.target.value))}
              className="flex-1 accent-[var(--color-accent)]"
            />
            <span className="w-8 text-right text-sm font-mono text-[var(--color-text-primary)]">{arraySize}</span>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Speed</span>
            <input
              type="range"
              min={1}
              max={5}
              value={speed}
              onChange={(event) => onSpeedChange(Number(event.target.value))}
              className="flex-1 accent-[var(--color-accent)]"
            />
            <span className="w-12 text-right text-sm font-mono text-[var(--color-text-primary)]">{speedLabel}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

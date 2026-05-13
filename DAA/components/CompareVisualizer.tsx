"use client";

import React from "react";
import { Algorithm, FrameWithLine } from "../lib/types";
import Visualizer from "./Visualizer";

interface CompareItem {
  id: Algorithm;
  name: string;
  frames: FrameWithLine[];
  frameIndex: number;
  comparisons: number;
  swaps: number;
  totalFrames: number;
}

interface CompareVisualizerProps {
  items: CompareItem[];
}

export default function CompareVisualizer({ items }: CompareVisualizerProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex min-h-[24rem] flex-col rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card backdrop-blur sm:min-h-[26rem] lg:min-h-[28rem]"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <span className="text-xs text-[var(--color-text-secondary)]">
              Frame {Math.min(item.frameIndex + 1, item.totalFrames)} / {item.totalFrames}
            </span>
          </div>

          <div className="mt-4">
            <Visualizer
              frames={item.frames}
              currentFrameIndex={item.frameIndex}
              totalFrames={item.totalFrames}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[12px] bg-white/80 px-3 py-2">
              <div className="text-xs text-[var(--color-text-secondary)]">
                Comparisons
              </div>
              <div className="text-base font-semibold text-[var(--color-text-primary)]">
                {item.comparisons}
              </div>
            </div>
            <div className="rounded-[12px] bg-white/80 px-3 py-2">
              <div className="text-xs text-[var(--color-text-secondary)]">Swaps</div>
              <div className="text-base font-semibold text-[var(--color-text-primary)]">
                {item.swaps}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

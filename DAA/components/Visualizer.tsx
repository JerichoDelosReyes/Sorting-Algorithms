"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { BarColor, FrameWithLine } from "../lib/types";

const COLOR_MAP: Record<BarColor, string> = {
  default: "#D1D1D6",
  comparing: "#0A84FF",
  swapping: "#FF6B35",
  pivot: "#FF9F0A",
  merging: "#BF5AF2",
  sorted: "#30D158"
};

interface VisualizerProps {
  frames: FrameWithLine[];
  currentFrameIndex: number;
  totalFrames: number;
  className?: string;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export default function Visualizer({
  frames,
  currentFrameIndex,
  totalFrames,
  className
}: VisualizerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const frame = useMemo(() => {
    if (frames.length === 0) {
      return null;
    }
    return frames[Math.min(currentFrameIndex, frames.length - 1)];
  }, [frames, currentFrameIndex]);

  const draw = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const { width, height } = containerRef.current.getBoundingClientRect();
    if (width === 0 || height === 0) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    if (!frame || frame.array.length === 0) {
      return;
    }

    const maxValue = Math.max(...frame.array, 1);
    const gap = Math.max(2, Math.floor(width / (frame.array.length * 12)));
    const barWidth = Math.max(
      2,
      (width - gap * (frame.array.length - 1)) / frame.array.length
    );
    const paddedHeight = height - 6;

    frame.array.forEach((value, index) => {
      const barHeight = (value / maxValue) * paddedHeight;
      const x = index * (barWidth + gap);
      const y = height - barHeight;
      const color = COLOR_MAP[frame.highlights[index] ?? "default"];
      drawRoundedRect(context, x, y, barWidth, barHeight, 4, color);
    });
  }, [frame]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => draw());
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [draw]);

  const message = frame?.message ?? "Ready to visualize.";
  const safeTotal = Math.max(totalFrames, 1);
  const progress = Math.min(
    currentFrameIndex / Math.max(safeTotal - 1, 1),
    1
  );

  return (
    <div className={className ?? "w-full"}>
      <div ref={containerRef} className="h-48 w-full sm:h-64 lg:h-72">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      <p className="mt-3 text-xs text-[var(--color-text-secondary)] sm:text-sm">
        {message}
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#E5E5EA]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

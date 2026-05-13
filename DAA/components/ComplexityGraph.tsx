"use client";

import React from "react";
import { Algorithm } from "../lib/types";

interface ComplexityGraphProps {
  highlightAlgorithm?: Algorithm;
}

export default function ComplexityGraph({ highlightAlgorithm }: ComplexityGraphProps) {
  // Calculate values for different complexity classes
  const generatePoints = (maxN: number, complexityFn: (n: number) => number) => {
    const points: Array<[number, number]> = [];
    const step = maxN / 50;
    for (let n = 1; n <= maxN; n += step) {
      points.push([n, complexityFn(n)]);
    }
    return points;
  };

  const maxN = 100;
  const bubblePoints = generatePoints(maxN, (n) => n * n);
  const mergePoints = generatePoints(maxN, (n) => n * Math.log2(n));
  const quickAvgPoints = generatePoints(maxN, (n) => n * Math.log2(n));
  const quickWorstPoints = generatePoints(maxN, (n) => n * n);

  // Get max values for scaling
  const allValues = [
    ...bubblePoints.map((p) => p[1]),
    ...mergePoints.map((p) => p[1]),
    ...quickWorstPoints.map((p) => p[1])
  ];
  const maxValue = Math.max(...allValues);

  // SVG dimensions
  const width = 800;
  const height = 400;
  const padding = 80;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  // Scale functions
  const scaleX = (n: number) => (n / maxN) * plotWidth + padding;
  const scaleY = (value: number) => height - padding - (value / maxValue) * plotHeight;

  // Generate path string
  const generatePathString = (points: Array<[number, number]>): string => {
    return points
      .map((point, index) => {
        const x = scaleX(point[0]);
        const y = scaleY(point[1]);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const bubblePath = generatePathString(bubblePoints);
  const mergePath = generatePathString(mergePoints);
  const quickAvgPath = generatePathString(quickAvgPoints);
  const quickWorstPath = generatePathString(quickWorstPoints);

  const isBubbleHighlighted = highlightAlgorithm === "bubble";
  const isMergeHighlighted = highlightAlgorithm === "merge";
  const isQuickHighlighted = highlightAlgorithm === "quick";

  return (
    <div className="flex min-h-[24rem] flex-col rounded-[20px] border border-[var(--color-border)] bg-white/80 p-6 shadow-card backdrop-blur sm:min-h-[26rem] lg:min-h-[28rem]">
      <h3 className="mb-4 text-lg font-semibold">Time Complexity Comparison</h3>
      <div className="min-h-0 flex-1 overflow-hidden rounded-[12px] bg-white/30">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="block h-full w-full"
        >
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const y = padding + (plotHeight / 5) * i;
            return (
              <g key={`grid-h-${i}`}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#E5E5EA"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </g>
            );
          })}
          {Array.from({ length: 6 }).map((_, i) => {
            const x = padding + (plotWidth / 5) * i;
            return (
              <g key={`grid-v-${i}`}>
                <line
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={height - padding}
                  stroke="#E5E5EA"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#1D1D1F"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#1D1D1F"
            strokeWidth="2"
          />

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 20}
            textAnchor="middle"
            className="text-xs fill-[var(--color-text-secondary)]"
          >
            n (input size)
          </text>
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 15 ${height / 2})`}
            className="text-xs fill-[var(--color-text-secondary)]"
          >
            Operations
          </text>

          {/* Tick marks and labels on x-axis */}
          {Array.from({ length: 6 }).map((_, i) => {
            const n = (maxN / 5) * i;
            const x = scaleX(n);
            return (
              <g key={`tick-x-${i}`}>
                <line x1={x} y1={height - padding} x2={x} y2={height - padding + 5} stroke="#1D1D1F" />
                <text x={x} y={height - padding + 20} textAnchor="middle" className="text-xs fill-[var(--color-text-secondary)]">
                  {Math.round(n)}
                </text>
              </g>
            );
          })}

          {/* Tick marks and labels on y-axis */}
          {Array.from({ length: 6 }).map((_, i) => {
            const value = (maxValue / 5) * i;
            const y = scaleY(value);
            return (
              <g key={`tick-y-${i}`}>
                <line x1={padding - 5} y1={y} x2={padding} y2={y} stroke="#1D1D1F" />
                <text x={padding - 10} y={y + 3} textAnchor="end" className="text-xs fill-[var(--color-text-secondary)]">
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {/* Curve: Bubble Sort O(n²) */}
          <path
            d={bubblePath}
            fill="none"
            stroke="#FF6B35"
            strokeWidth={!highlightAlgorithm || isBubbleHighlighted ? 3 : 2}
            opacity={!highlightAlgorithm || isBubbleHighlighted ? 1 : 0.4}
            className="transition-all"
          />

          {/* Curve: Quick Sort Worst O(n²) dashed */}
          <path
            d={quickWorstPath}
            fill="none"
            stroke="#FF6B35"
            strokeWidth={!highlightAlgorithm || isQuickHighlighted ? 3 : 2}
            strokeDasharray="6,4"
            opacity={!highlightAlgorithm || isQuickHighlighted ? 1 : 0.3}
            className="transition-all"
          />

          {/* Curve: Merge Sort O(n log n) */}
          <path
            d={mergePath}
            fill="none"
            stroke="#BF5AF2"
            strokeWidth={!highlightAlgorithm || isMergeHighlighted ? 3 : 2}
            opacity={!highlightAlgorithm || isMergeHighlighted ? 1 : 0.4}
            className="transition-all"
          />

          {/* Curve: Quick Sort Average O(n log n) */}
          <path
            d={quickAvgPath}
            fill="none"
            stroke="#0A84FF"
            strokeWidth={!highlightAlgorithm || isQuickHighlighted ? 3 : 2}
            opacity={!highlightAlgorithm || isQuickHighlighted ? 1 : 0.4}
            className="transition-all"
          />

          {/* Legend */}
          <g>
            {/* Bubble Sort */}
            <circle cx={width - 200} cy={padding + 20} r="4" fill="#FF6B35" />
            <text x={width - 185} y={padding + 25} className="text-xs fill-[var(--color-text-primary)]">
              Bubble O(n²)
            </text>

            {/* Merge Sort */}
            <circle cx={width - 200} cy={padding + 50} r="4" fill="#BF5AF2" />
            <text x={width - 185} y={padding + 55} className="text-xs fill-[var(--color-text-primary)]">
              Merge O(n log n)
            </text>

            {/* Quick Sort Average */}
            <circle cx={width - 200} cy={padding + 80} r="4" fill="#0A84FF" />
            <text x={width - 185} y={padding + 85} className="text-xs fill-[var(--color-text-primary)]">
              Quick Avg O(n log n)
            </text>

            {/* Quick Sort Worst */}
            <line x1={width - 200} y1={padding + 110} x2={width - 192} y2={padding + 110} stroke="#FF6B35" strokeWidth="2" strokeDasharray="4,2" />
            <text x={width - 185} y={padding + 115} className="text-xs fill-[var(--color-text-primary)]">
              Quick Worst O(n²)
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

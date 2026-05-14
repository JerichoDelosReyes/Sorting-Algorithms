"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Algorithm } from "../lib/types";

interface ComplexityGraphProps {
  highlightAlgorithm?: Algorithm;
}

export default function ComplexityGraph({ highlightAlgorithm }: ComplexityGraphProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [wrapperWidth, setWrapperWidth] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const element = wrapperRef.current;
    const updateSize = () => {
      setWrapperWidth(element.getBoundingClientRect().width);
    };

    updateSize();

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const isMobile = wrapperWidth > 0 && wrapperWidth < 640;

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
  const chart = useMemo(() => {
    const width = 900;
    const height = isMobile ? 500 : 420;
    const left = isMobile ? 54 : 72;
    const right = isMobile ? 20 : 24;
    const top = isMobile ? 24 : 36;
    const bottom = isMobile ? 90 : 74;

    return {
      width,
      height,
      left,
      right,
      top,
      bottom,
      plotWidth: width - left - right,
      plotHeight: height - top - bottom
    };
  }, [isMobile]);

  // Scale functions
  const scaleX = (n: number) => (n / maxN) * chart.plotWidth + chart.left;
  const scaleY = (value: number) => {
    // Add 1 to avoid undefined log(0) at values of zero
    const logValue = Math.log10(value + 1);
    const maxLogValue = Math.log10(maxValue + 1);
    return chart.height - chart.bottom - (logValue / maxLogValue) * chart.plotHeight;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return `${Math.round(value)}`;
  };

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

  const xTickCount = isMobile ? 5 : 6;
  const yTickCount = isMobile ? 5 : 6;

  const legendItems = [
    {
      label: "Bubble O(n²)",
      color: "#D97706",
      dashed: false,
      dimmed: Boolean(highlightAlgorithm && !isBubbleHighlighted)
    },
    {
      label: "Merge O(n log n)",
      color: "#BF5AF2",
      dashed: false,
      dimmed: Boolean(highlightAlgorithm && !isMergeHighlighted)
    },
    {
      label: "Quick Avg O(n log n)",
      color: "#0A84FF",
      dashed: false,
      dimmed: Boolean(highlightAlgorithm && !isQuickHighlighted)
    },
    {
      label: "Quick Worst O(n²)",
      color: "#4B5563",
      dashed: true,
      dimmed: Boolean(highlightAlgorithm && !isQuickHighlighted)
    }
  ];

  return (
    <div className="flex min-h-[24rem] flex-col rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card backdrop-blur sm:min-h-[26rem] lg:min-h-[28rem]">
      <h3 className="mb-4 text-lg font-semibold">Time Complexity Comparison</h3>
      <div ref={wrapperRef} className="min-h-0 flex-1 rounded-[12px] bg-[var(--color-surface-soft)] p-2 sm:p-3">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto w-full"
        >
          {/* Grid lines */}
          {Array.from({ length: yTickCount }).map((_, i) => {
            const y = chart.top + (chart.plotHeight / (yTickCount - 1)) * i;
            return (
              <g key={`grid-h-${i}`}>
                <line
                  x1={chart.left}
                  y1={y}
                  x2={chart.width - chart.right}
                  y2={y}
                  stroke="#E5E5EA"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </g>
            );
          })}
          {Array.from({ length: xTickCount }).map((_, i) => {
            const x = chart.left + (chart.plotWidth / (xTickCount - 1)) * i;
            return (
              <g key={`grid-v-${i}`}>
                <line
                  x1={x}
                  y1={chart.top}
                  x2={x}
                  y2={chart.height - chart.bottom}
                  stroke="#E5E5EA"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={chart.left}
            y1={chart.height - chart.bottom}
            x2={chart.width - chart.right}
            y2={chart.height - chart.bottom}
            stroke="var(--color-chart-axis)"
            strokeWidth="2"
          />
          <line
            x1={chart.left}
            y1={chart.top}
            x2={chart.left}
            y2={chart.height - chart.bottom}
            stroke="var(--color-chart-axis)"
            strokeWidth="2"
          />

          {/* Axis labels */}
          <text
            x={chart.width / 2}
            y={chart.height - 24}
            textAnchor="middle"
            className="text-xs fill-[var(--color-text-secondary)]"
          >
            n (input size)
          </text>
          <text
            x={20}
            y={chart.height / 2}
            textAnchor="middle"
            transform={`rotate(-90 20 ${chart.height / 2})`}
            className="text-xs fill-[var(--color-text-secondary)]"
          >
            Operations
          </text>

          {/* Tick marks and labels on x-axis */}
          {Array.from({ length: xTickCount }).map((_, i) => {
            const n = (maxN / (xTickCount - 1)) * i;
            const x = scaleX(n);
            return (
              <g key={`tick-x-${i}`}>
                <line x1={x} y1={chart.height - chart.bottom} x2={x} y2={chart.height - chart.bottom + 5} stroke="var(--color-chart-axis)" />
                <text x={x} y={chart.height - chart.bottom + 20} textAnchor="middle" className="text-xs fill-[var(--color-text-secondary)]">
                  {Math.round(n)}
                </text>
              </g>
            );
          })}

          {/* Tick marks and labels on y-axis */}
          {Array.from({ length: yTickCount }).map((_, i) => {
            const maxLogValue = Math.log10(maxValue + 1);
            const logValue = (maxLogValue / (yTickCount - 1)) * i;
            const value = Math.max(0, Math.pow(10, logValue) - 1);

            const y = scaleY(value);
            return (
              <g key={`tick-y-${i}`}>
                <line x1={chart.left - 5} y1={y} x2={chart.left} y2={y} stroke="var(--color-chart-axis)" />
                <text x={chart.left - 10} y={y + 3} textAnchor="end" className="text-xs fill-[var(--color-text-secondary)]">
                  {formatNumber(value)}
                </text>
              </g>
            );
          })}

          {/* Curve: Bubble Sort O(n²) */}
          <path
            d={bubblePath}
            fill="none"
            stroke="#D97706"
            strokeWidth={!highlightAlgorithm || isBubbleHighlighted ? 3 : 2}
            opacity={!highlightAlgorithm || isBubbleHighlighted ? 1 : 0.4}
            className="transition-all"
          />

          {/* Curve: Quick Sort Worst O(n²) dashed */}
          <path
            d={quickWorstPath}
            fill="none"
            stroke="#4B5563"
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
        </svg>

        <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-[var(--color-text-primary)] sm:grid-cols-2 lg:grid-cols-4">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2"
              style={{ opacity: item.dimmed ? 0.5 : 1 }}
            >
              {item.dashed ? (
                <span
                  className="h-0 w-4 border-t-2"
                  style={{ borderColor: item.color, borderStyle: "dashed" }}
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

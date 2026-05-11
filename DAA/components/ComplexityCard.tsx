import { ALGO_INFO } from "../lib/algoInfo";
import { Algorithm } from "../lib/types";

interface ComplexityCardProps {
  algorithmId: Algorithm;
}

function getTimeBadgeClasses(value: string): string {
  if (value.includes("n^2")) {
    return "bg-[#FFE5E5] text-[#C91C1C]";
  }
  return "bg-[#E6F6EA] text-[#1F7A3D]";
}

function getSpaceBadgeClasses(): string {
  return "bg-[#E5F0FF] text-[#0A84FF]";
}

export default function ComplexityCard({ algorithmId }: ComplexityCardProps) {
  const info = ALGO_INFO[algorithmId];
  const { complexity, stable } = info;

  return (
    <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card backdrop-blur">
      <h3 className="text-lg font-semibold">Complexity</h3>
      <div className="mt-4 grid gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Best Case</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getTimeBadgeClasses(
              complexity.best
            )}`}
          >
            {complexity.best}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Average Case</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getTimeBadgeClasses(
              complexity.average
            )}`}
          >
            {complexity.average}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Worst Case</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getTimeBadgeClasses(
              complexity.worst
            )}`}
          >
            {complexity.worst}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Space</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getSpaceBadgeClasses()}`}
          >
            {complexity.space}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text-secondary)]">Stability</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              stable ? "bg-[#E6F6EA] text-[#1F7A3D]" : "bg-[#FFE5E5] text-[#C91C1C]"
            }`}
          >
            {stable ? "Stable Algorithm" : "Not Stable"}
          </span>
        </div>
      </div>
    </div>
  );
}

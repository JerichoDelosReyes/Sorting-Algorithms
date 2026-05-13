import Link from "next/link";
import { AlgorithmInfo } from "../lib/types";

interface AlgoCardProps {
  info: AlgorithmInfo;
}

export default function AlgoCard({ info }: AlgoCardProps) {
  return (
    <div className="group flex h-full flex-col rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card backdrop-blur">
      <h3 className="text-xl font-semibold">{info.name}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        {info.shortDescription}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-white px-3 py-1 text-[var(--color-text-primary)]">
          Best {info.complexity.best}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-[var(--color-text-primary)]">
          Worst {info.complexity.worst}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-[var(--color-text-primary)]">
          Space {info.complexity.space}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={`rounded-full px-3 py-1 font-semibold ${
            info.id === "quick"
              ? "bg-[#EEF2F7] text-[#6B7280]"
              : info.stable
                ? "bg-[#E6F6EA] text-[#1F7A3D]"
                : "bg-[#FFE5E5] text-[#C91C1C]"
          }`}
        >
          {info.id === "quick" ? "In-place" : (info.stable ? "Stable" : "Not Stable")}
        </span>
        <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 font-semibold text-[var(--color-text-primary)]">
          {info.complexity.worst}
        </span>
      </div>

      <div className="mt-auto pt-6">
        <Link
          href={info.slug}
          className="block w-full rounded-full bg-[#0A84FF] px-4 py-3 text-center text-sm font-semibold text-white transition-shadow hover:shadow-lg"
        >
          Explore Algorithm
        </Link>
      </div>
    </div>
  );
}

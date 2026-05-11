import Link from "next/link";
import { AlgorithmInfo } from "../lib/types";

interface AlgoCardProps {
  info: AlgorithmInfo;
}

export default function AlgoCard({ info }: AlgoCardProps) {
  return (
    <Link
      href={info.slug}
      className="group flex h-full flex-col rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card backdrop-blur transition-transform hover:-translate-y-1"
    >
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
            info.stable ? "bg-[#E6F6EA] text-[#1F7A3D]" : "bg-[#FFE5E5] text-[#C91C1C]"
          }`}
        >
          {info.stable ? "Stable" : "Not Stable"}
        </span>
        <span className="rounded-full bg-[#1D1D1F] px-3 py-1 font-semibold text-white">
          {info.complexity.worst}
        </span>
      </div>

      <div className="mt-6">
        <span className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white">
          Explore Algorithm
        </span>
      </div>
    </Link>
  );
}

import { ALGO_INFO } from "../lib/algoInfo";
import { Algorithm } from "../lib/types";

interface ComplexityCardProps {
  algorithmId: Algorithm;
}

export default function ComplexityCard({ algorithmId }: ComplexityCardProps) {
  const info = ALGO_INFO[algorithmId];
  const { complexity } = info;

  const worstTone = "rounded-full border border-[#d94b4b]/20 bg-[#d94b4b]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d94b4b]";

  return (
    <div className="flex h-full flex-col lg:flex-row rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8 shadow-card backdrop-blur col-span-1 lg:col-span-2 gap-8 items-center">
      <div className="flex-1">
        <h3 className="text-xl md:text-2xl font-bold mb-3">Complexity Analysis</h3>
        <div className="space-y-4 text-sm md:text-base leading-relaxed text-[var(--color-text-secondary)]">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-primary)]">About SORT</h4>
            <p className="mt-2">
              {info.description}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-primary)]">Use Cases</h4>
            <p className="mt-2">
              {info.useCases}
            </p>
          </div>
          <p>
            The best case is {complexity.best}, average case is {complexity.average}, and worst case is {complexity.worst}. Space complexity requires {complexity.space}. {algorithmId === "quick" ? "It is an In-place algorithm." : (info.stable ? "It is a Stable algorithm." : "It is Not Stable.")}
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-auto flex-col gap-6 items-start lg:items-end mt-6 lg:mt-0">
        <div className="flex flex-col items-start lg:items-end">
          <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-secondary)] uppercase mb-2">Best</span>
          <span className="text-lg md:text-2xl font-mono text-[var(--color-text-primary)] font-bold">
            {complexity.best}
          </span>
        </div>

        <div className="flex flex-col items-start lg:items-end">
          <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-secondary)] uppercase mb-2">Average</span>
          <span className="text-xl md:text-3xl font-mono text-[var(--color-text-primary)] font-bold">
            {complexity.average}
          </span>
        </div>

        <div className="flex flex-col items-start lg:items-end">
          <span className={worstTone}>Worst</span>
          <span className="text-lg md:text-2xl font-mono text-[#d94b4b] font-bold">
            {complexity.worst}
          </span>
        </div>
      </div>
    </div>
  );
}

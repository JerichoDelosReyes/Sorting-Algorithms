import { ALGO_INFO } from "../lib/algoInfo";
import { Algorithm } from "../lib/types";

interface ComplexityCardProps {
  algorithmId: Algorithm;
}

export default function ComplexityCard({ algorithmId }: ComplexityCardProps) {
  const info = ALGO_INFO[algorithmId];
  const { complexity } = info;

  return (
    <div className="flex h-full flex-col lg:flex-row rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8 shadow-card backdrop-blur col-span-1 lg:col-span-2 gap-8 items-center">
      <div className="flex-1">
        <h3 className="text-xl md:text-2xl font-bold mb-3">Complexity Analysis</h3>
        <p className="text-[var(--color-text-secondary)] text-sm md:text-base leading-relaxed">
          {info.shortDescription} The best case is {complexity.best}, average case is {complexity.average}, and worst case is {complexity.worst}. Space complexity requires {complexity.space}. {algorithmId === "quick" ? "It is an In-place algorithm." : (info.stable ? "It is a Stable algorithm." : "It is Not Stable.")}
        </p>
      </div>

      <div className="flex w-full lg:w-auto gap-4 md:gap-8 justify-between lg:justify-end items-center mt-6 lg:mt-0">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold tracking-widest text-[#0A84FF]/60 uppercase mb-2">Best</span>
          <span className="text-lg md:text-2xl font-mono text-[#0A84FF] drop-shadow-[0_0_8px_rgba(10,132,255,0.8)] font-bold">
            {complexity.best}
          </span>
        </div>

        <div className="flex flex-col items-center rounded-xl bg-blue-900/20 shadow-[0_0_15px_rgba(10,132,255,0.2)] border border-[#0A84FF]/30 p-3 md:p-4">
          <span className="text-[10px] font-bold tracking-widest text-[#5AC8FA] uppercase mb-2">Average</span>
          <span className="text-xl md:text-3xl font-mono text-[#5AC8FA] drop-shadow-[0_0_12px_rgba(90,200,250,1)] font-bold">
            {complexity.average}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold tracking-widest text-[#FF6B35]/60 uppercase mb-2">Worst</span>
          <span className="text-lg md:text-2xl font-mono text-[#FF6B35] drop-shadow-[0_0_8px_rgba(255,107,53,0.8)] font-bold">
            {complexity.worst}
          </span>
        </div>
      </div>
    </div>
  );
}

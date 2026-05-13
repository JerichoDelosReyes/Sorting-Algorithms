import { ALGO_INFO } from "../lib/algoInfo";
import { Algorithm } from "../lib/types";

interface AlgoDescriptionProps {
  algorithmId: Algorithm;
}

export default function AlgoDescription({ algorithmId }: AlgoDescriptionProps) {
  const info = ALGO_INFO[algorithmId];

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-card backdrop-blur">
      <h3 className="text-lg font-semibold">About {info.name}</h3>
      <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
        {info.description}
      </p>
      <div className="mt-4">
        <div className="text-sm font-semibold">Use Cases</div>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {info.useCases}
        </p>
      </div>
    </div>
  );
}

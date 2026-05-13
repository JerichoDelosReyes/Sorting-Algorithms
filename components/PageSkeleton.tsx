interface PageSkeletonProps {
  variant: "home" | "algorithm" | "compare";
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`skeleton-block ${className}`} aria-hidden="true" />;
}

function HomeSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20">
      <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 shadow-card md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SkeletonBlock className="mx-auto h-10 w-3/4 rounded-xl md:h-14" />
          <SkeletonBlock className="mx-auto mt-5 h-4 w-full max-w-2xl rounded-lg" />
          <SkeletonBlock className="mx-auto mt-2 h-4 w-4/5 rounded-lg" />
          <div className="mt-10 flex justify-center gap-4">
            <SkeletonBlock className="h-11 w-36 rounded-full" />
            <SkeletonBlock className="h-11 w-36 rounded-full" />
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-card md:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <SkeletonBlock className="h-8 w-2/3 rounded-lg" />
            <SkeletonBlock className="mt-5 h-4 w-full rounded-lg" />
            <SkeletonBlock className="mt-2 h-4 w-11/12 rounded-lg" />
            <SkeletonBlock className="mt-2 h-4 w-10/12 rounded-lg" />
          </div>
          <SkeletonBlock className="h-56 w-full rounded-[16px]" />
        </div>
      </section>

      <section className="mt-16">
        <SkeletonBlock className="mb-8 h-9 w-60 rounded-lg" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonBlock className="h-64 rounded-[20px]" />
          <SkeletonBlock className="h-64 rounded-[20px]" />
          <SkeletonBlock className="h-64 rounded-[20px]" />
        </div>
      </section>
    </div>
  );
}

function AlgorithmSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <header className="border-b border-[var(--color-border)] pb-6">
        <SkeletonBlock className="h-10 w-56 rounded-lg" />
        <div className="mt-4 flex gap-2">
          <SkeletonBlock className="h-8 w-24 rounded-full" />
          <SkeletonBlock className="h-8 w-28 rounded-full" />
        </div>
      </header>

      <div className="mt-8 grid gap-4 md:gap-6 lg:grid-cols-[5fr_3fr] xl:grid-cols-[2fr_1fr]">
        <SkeletonBlock className="h-[36rem] rounded-[20px]" />
        <SkeletonBlock className="h-[24rem] rounded-[20px] sm:h-[26rem] lg:h-[36rem]" />
      </div>

      <div className="mt-8">
        <SkeletonBlock className="h-44 rounded-[20px]" />
      </div>

      <div className="mt-8">
        <SkeletonBlock className="h-80 rounded-[20px]" />
      </div>
    </div>
  );
}

function CompareSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <header className="border-b border-[var(--color-border)] pb-6">
        <SkeletonBlock className="h-10 w-72 rounded-lg" />
        <SkeletonBlock className="mt-3 h-4 w-80 rounded-lg" />
      </header>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="grid gap-3 sm:grid-cols-2">
          <SkeletonBlock className="h-11 rounded-full" />
          <SkeletonBlock className="h-11 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:w-72">
          <SkeletonBlock className="h-11 rounded-full" />
          <SkeletonBlock className="h-11 rounded-full" />
        </div>
      </div>

      <div className="mt-8">
        <SkeletonBlock className="h-[30rem] rounded-[20px]" />
      </div>

      <div className="mt-8">
        <SkeletonBlock className="h-80 rounded-[20px]" />
      </div>
    </div>
  );
}

export default function PageSkeleton({ variant }: PageSkeletonProps) {
  if (variant === "home") {
    return <HomeSkeleton />;
  }

  if (variant === "compare") {
    return <CompareSkeleton />;
  }

  return <AlgorithmSkeleton />;
}
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] py-6 md:py-8">
      <div className="mx-auto flex w-full max-w-6xl px-6 flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <Link href="/" className="font-semibold text-[var(--color-text-primary)]">
            Sort
          </Link>
        </div>
        <div className="text-center md:text-right text-xs text-[var(--color-text-secondary)]">
          <div>COSC 90 Final Project | Cavite State University Imus Campus</div>
          <div className="mt-2 text-[0.75rem] tracking-wide">
            <div className="flex flex-col items-center gap-1 md:flex-row md:gap-3 md:justify-end">
              <span>JUSTINE LAWRENCE B. CORONEL</span>
              <span className="hidden md:inline">|</span>
              <span>JERICHO G. DELOS REYES</span>
              <span className="hidden md:inline">|</span>
              <span>JAZZ THINE MARK K. LEE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
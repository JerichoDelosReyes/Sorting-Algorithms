import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 sm:px-6 md:px-12 md:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <Link href="/" className="font-semibold text-[var(--color-text-primary)]">
            Sort
          </Link>
        </div>
        <div className="text-center text-xs text-[var(--color-text-secondary)]">
          COSC 90 Final Project | Cavite State University Imus Campus
        </div>
      </div>
    </footer>
  );
}
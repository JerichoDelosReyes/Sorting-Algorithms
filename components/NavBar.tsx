"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSound } from "./SoundProvider";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Bubble Sort", href: "/bubble-sort" },
  { label: "Merge Sort", href: "/merge-sort" },
  { label: "Quick Sort", href: "/quick-sort" },
  { label: "Compare", href: "/compare" }
];

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      {muted ? (
        <path d="M16 9l5 6m0-6l-5 6" />
      ) : (
        <>
          <path d="M16 9a5 5 0 010 6" />
          <path d="M19 6a8 8 0 010 12" />
        </>
      )}
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6l-12 12" />
        </>
      ) : (
        <>
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </>
      )}
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  return theme === "dark" ? (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A8.5 8.5 0 1111.2 3a7 7 0 109.8 9.8z" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12H5M19 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [flashTheme, setFlashTheme] = useState<"light" | "dark" | null>(null);
  const { enabled, toggle } = useSound();

  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(currentTheme);
  }, []);

  const updateTheme = (nextTheme: "light" | "dark") => {
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("sort-theme", nextTheme);
    setTheme(nextTheme);
    setFlashTheme(nextTheme);
    window.setTimeout(() => setFlashTheme(null), 450);
  };

  const toggleTheme = () => {
    updateTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className="fixed top-0 left-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]"
      style={{ backdropFilter: "blur(20px)" }}
    >
      {flashTheme ? (
        <div
          className="theme-flash fixed inset-0"
          style={{ background: flashTheme === "dark" ? "rgba(0,0,0,0.88)" : "rgba(255,255,255,0.9)" }}
          aria-hidden="true"
        />
      ) : null}

      <div className="mx-auto relative flex h-16 max-w-6xl items-center px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Sort
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-[var(--color-accent)] text-white shadow-sm"
                  : "text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)]"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <ThemeIcon theme={theme} />
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2 text-sm"
            onClick={toggle}
            aria-label={enabled ? "Disable sound" : "Enable sound"}
          >
            <SpeakerIcon muted={!enabled} />
            <span className="hidden text-xs sm:inline">
              {enabled ? "Sound On" : "Sound Off"}
            </span>
          </button>

          <button
            type="button"
            className="flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-2 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-[var(--color-accent)] text-white shadow-sm"
                    : "text-[var(--color-text-primary)] hover:bg-[var(--color-hover)]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}

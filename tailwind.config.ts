import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        card: "var(--shadow-card)"
      },
      borderRadius: {
        card: "var(--radius-card)",
        pill: "var(--radius-btn)"
      },
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        textPrimary: "var(--color-text-primary)",
        textSecondary: "var(--color-text-secondary)",
        accent: "var(--color-accent)",
        comparing: "var(--color-comparing)",
        swapping: "var(--color-swapping)",
        pivot: "var(--color-pivot)",
        merging: "var(--color-merging)",
        sorted: "var(--color-sorted)",
        defaultBar: "var(--color-default)"
      }
    }
  },
  plugins: []
};

export default config;

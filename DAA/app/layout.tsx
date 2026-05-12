import "./globals.css";

import type { Metadata } from "next";
import NavBar from "../components/NavBar";
import PageTransition from "../components/PageTransition";
import { SoundProvider } from "../components/SoundProvider";

export const metadata: Metadata = {
  title: "Sort",
  description:
    "An interactive comparative study of Bubble Sort, Merge Sort, and Quick Sort."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <SoundProvider>
          <NavBar />
          <PageTransition>{children}</PageTransition>
        </SoundProvider>
      </body>
    </html>
  );
}

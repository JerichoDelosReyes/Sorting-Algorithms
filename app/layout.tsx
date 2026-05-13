import "./globals.css";

import type { Metadata } from "next";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import PageTransition from "../components/PageTransition";
import { SoundProvider } from "../components/SoundProvider";

export const metadata: Metadata = {
  title: "Sort",
  description:
    "An interactive comparative study of Bubble Sort, Merge Sort, and Quick Sort.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key='sort-theme';var stored=localStorage.getItem(key);var theme=stored==='light'||stored==='dark'?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}catch(e){}})();`
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <SoundProvider>
          <NavBar />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </SoundProvider>
      </body>
    </html>
  );
}

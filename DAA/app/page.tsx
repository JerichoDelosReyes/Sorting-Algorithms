"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AlgoCard from "../components/AlgoCard";
import { ALGO_INFO } from "../lib/algoInfo";

const algorithms = [ALGO_INFO.bubble, ALGO_INFO.merge, ALGO_INFO.quick];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function HomePage() {
  const scrollToAlgorithms = () => {
    const element = document.getElementById("algorithms");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <style>{`
        @keyframes breathe {
          0% {
            background: radial-gradient(circle at 50% 50%, #f5f5f7 0%, #eef2ff 65%);
          }
          50% {
            background: radial-gradient(circle at 50% 50%, #f0fdf4 0%, #f5f5f7 65%);
          }
          100% {
            background: radial-gradient(circle at 50% 50%, #f5f5f7 0%, #eef2ff 65%);
          }
        }
        
        .hero-animated {
          animation: breathe 8s ease-in-out infinite;
        }
        
        @keyframes barSort {
          0%, 10% {
            height: 60%;
            transform: translateX(0);
          }
          50% {
            height: 30%;
            transform: translateX(8px);
          }
          100% {
            height: 100%;
            transform: translateX(0);
          }
        }
        
        .bar-animate {
          animation: barSort 3s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto w-full max-w-6xl px-6 pb-20">
        {/* Hero Section */}
        <section className="hero-animated rounded-[28px] border border-[var(--color-border)] px-6 py-20 text-center shadow-card md:py-24">
          <motion.div
            initial="hidden"
            animate="show"
            variants={heroVariants}
          >
            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              Sorting Algorithm Visualizer
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--color-text-secondary)] md:text-lg">
              Explore, visualize, and compare three fundamental sorting algorithms through interactive animations and real-time performance metrics.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={scrollToAlgorithms}
                className="rounded-full bg-[var(--color-accent)] px-8 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
              >
                Start Exploring
              </button>
              <Link
                href="/compare"
                className="rounded-full border border-[var(--color-border)] bg-white px-8 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)]"
              >
                Compare All
              </Link>
            </div>
          </motion.div>
        </section>

        {/* What is a Sorting Algorithm Section */}
        <section className="mt-16 md:mt-24">
          <div className="rounded-[20px] border border-[var(--color-border)] bg-white/50 px-8 py-12 shadow-card backdrop-blur md:px-12 md:py-16">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">What is a Sorting Algorithm?</h2>
                <p className="mt-6 text-[var(--color-text-secondary)]">
                  A sorting algorithm is a set of instructions for arranging data in a chosen order, usually ascending or descending. It is a core technique in computer science that helps software organize and process information efficiently.
                </p>
              </div>
              <div className="flex h-64 items-end justify-center gap-1 rounded-[16px] bg-[var(--color-surface)] p-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bar-animate w-full rounded-t-[4px] bg-gradient-to-t from-[#0A84FF] to-[#5AC8FA]"
                    style={{
                      height: `${20 + i * 13}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Time and Space Complexity Section */}
        <section className="mt-16 md:mt-24">
          <h2 className="mb-8 text-3xl font-bold md:text-4xl">Understanding Complexity</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[20px] border border-[var(--color-border)] bg-white/80 px-8 py-10 shadow-card backdrop-blur">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E5F0FF]">
                <svg
                  className="h-6 w-6 text-[#0A84FF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Time Complexity</h3>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                Time complexity describes how the number of operations grows as the input size increases, expressed in Big O notation. <strong>Best case</strong> is the optimal scenario, <strong>average case</strong> represents typical behavior, and <strong>worst case</strong> shows the slowest possible execution. When choosing an algorithm, we typically focus on worst-case and average-case performance to ensure the algorithm scales well with large datasets.
              </p>
            </div>
            <div className="rounded-[20px] border border-[var(--color-border)] bg-white/80 px-8 py-10 shadow-card backdrop-blur">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E5E5FF]">
                <svg
                  className="h-6 w-6 text-[#BF5AF2]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 9a2 2 0 110-4 2 2 0 010 4zm0 0a7 7 0 1114 0 7 7 0 01-14 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Space Complexity</h3>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                Space complexity measures how much additional memory an algorithm uses relative to the input size. <strong>O(1) space</strong> means the algorithm uses a fixed amount of extra memory regardless of input size, making it memory-efficient. <strong>O(n) space</strong> means the algorithm needs extra memory proportional to the input, which can be costly for large datasets. Trading space for speed is a common optimization strategy in algorithm design.
              </p>
            </div>
          </div>
        </section>

        {/* Algorithm Cards Section */}
        <section id="algorithms" className="mt-16 md:mt-24">
          <h2 className="mb-10 text-3xl font-bold md:text-4xl">Choose an Algorithm</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {algorithms.map((algo) => (
              <motion.div key={algo.id} variants={itemVariants}>
                <AlgoCard info={algo} />
              </motion.div>
            ))}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-3"
            >
              <div className="flex flex-col items-center justify-between gap-6 rounded-[20px] bg-[#1D1D1F] px-8 py-8 text-center text-white shadow-card md:flex-row md:text-left">
                <div>
                  <h3 className="text-xl font-semibold">Compare All Three</h3>
                  <p className="mt-2 text-sm text-white/70">
                    Run all three algorithms on the same array simultaneously and see which one wins in terms of comparisons, swaps, and total time.
                  </p>
                </div>
                <Link
                  href="/compare"
                  className="flex-shrink-0 rounded-full bg-[#0A84FF] px-6 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
                >
                  Go to Compare
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-auto w-full rounded-t-[28px] border-t border-[var(--color-border)] bg-[#1D1D1F] px-4 py-8 text-white sm:px-6 md:px-12 md:py-10">
        <div className="mx-auto grid w-full max-w-6xl gap-6 text-center md:grid-cols-3 md:items-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="text-xl font-semibold">
              Sort
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center md:gap-6">
            <Link href="/" className="text-sm text-white/70 transition-colors hover:text-white">
              Home
            </Link>
            <Link href="/bubble-sort" className="text-sm text-white/70 transition-colors hover:text-white">
              Algorithms
            </Link>
            <Link href="/compare" className="text-sm text-white/70 transition-colors hover:text-white">
              Compare
            </Link>
          </div>
          <div className="text-center text-xs text-white/60 md:text-right">
            COSC 90 Final Project | Cavite State University Imus Campus
          </div>
        </div>
      </footer>
    </div>
  );
}

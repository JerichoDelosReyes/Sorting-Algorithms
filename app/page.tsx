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
    <div className="flex w-full flex-col">
      <style>{`
        @keyframes wave {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .hero-animated {
          background: linear-gradient(
            45deg,
            #f0fdf4 0%,
            #dbeafe 25%,
            #f0fdf4 50%,
            #dbeafe 75%,
            #f0fdf4 100%
          );
          background-size: 200% 200%;
          animation: wave 8s ease-in-out infinite;
        }

        html[data-theme='dark'] .hero-animated {
          background: linear-gradient(
            45deg,
            rgba(10, 132, 255, 0.18) 0%,
            rgba(125, 92, 255, 0.12) 25%,
            rgba(10, 132, 255, 0.1) 50%,
            rgba(125, 92, 255, 0.18) 75%,
            rgba(10, 132, 255, 0.18) 100%
          );
          background-size: 200% 200%;
        }

        html[data-theme='light'] .hero-animated {
          background: linear-gradient(
            45deg,
            #f0fdf4 0%,
            #dbeafe 25%,
            #f0fdf4 50%,
            #dbeafe 75%,
            #f0fdf4 100%
          );
          background-size: 200% 200%;
        }
        
        @keyframes waveAnimation {
          0% {
            height: 30%;
          }
          25% {
            height: 50%;
          }
          50% {
            height: 75%;
          }
          75% {
            height: 50%;
          }
          100% {
            height: 30%;
          }
        }
        
        .bar-animate {
          animation: waveAnimation 2s ease-in-out infinite;
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
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-8 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-hover)]"
              >
                Compare All
              </Link>
            </div>
          </motion.div>
        </section>

        {/* What is a Sorting Algorithm Section */}
        <section className="mt-16 md:mt-24">
          <div className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12 shadow-card md:px-12 md:py-16">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">What is a Sorting Algorithm?</h2>
                <p className="mt-6 text-[var(--color-text-secondary)]">
                  A sorting algorithm is a set of instructions for arranging data in a chosen order, usually ascending or descending. It is a core technique in computer science that helps software organize and process information efficiently.
                </p>
                <p className="mt-4 text-[var(--color-text-secondary)]">
                  <strong>Time Complexity</strong> describes how the number of operations grows as the input size increases, expressed in Big O notation. Best case is the optimal scenario, average case represents typical behavior, and worst case shows the slowest possible execution.
                </p>
                <p className="mt-8 text-[var(--color-text-secondary)]">
                  <strong>Space Complexity</strong> measures how much additional memory an algorithm uses relative to the input size. O(1) space means the algorithm uses a fixed amount of extra memory regardless of input size, making it memory-efficient. When choosing an algorithm, we typically focus on worst-case and average-case performance to ensure the algorithm scales well with large datasets.
                </p>
              </div>
              <div className="flex h-64 items-end justify-center gap-1 rounded-[16px] bg-[var(--color-surface-soft)] p-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bar-animate w-full rounded-t-[4px] bg-[#0A84FF]"
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
              <div className="flex flex-col items-center justify-between gap-6 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-8 text-center shadow-card md:flex-row md:text-left">
                <div>
                  <h3 className="text-xl font-semibold">Compare All Three</h3>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
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
    </div>
  );
}

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
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.2
    }
  }
};

const scrollIndicatorVariants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.8
    }
  },
  bounce: {
    y: [0, 8, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function HomePage() {
  // Scroll handlers
  const scrollToDefinition = () => {
    const element = document.getElementById("definition");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAlgorithms = () => {
    const element = document.getElementById("algorithms");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex w-full flex-col">
      {/* Full Screen Hero Section */}
      <section className="relative -mt-24 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--color-surface)] via-[var(--color-surface)] to-transparent pb-40">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-[#0A84FF] blur-3xl"></div>
          <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-purple-500 blur-3xl"></div>
        </div>
        
        <motion.div
          initial="hidden"
          animate="show"
          variants={heroVariants}
          className="flex flex-col items-center justify-center text-center px-6 pt-32 md:pt-0"
        >
          <motion.h1
            variants={textVariants}
            className="text-6xl font-bold leading-tight md:text-7xl lg:text-8xl"
          >
            Are you ready to
            <span className="block bg-gradient-to-r from-[#0A84FF] to-purple-500 bg-clip-text text-transparent">
              sort?
            </span>
          </motion.h1>
          
          <motion.p
            variants={textVariants}
            className="mx-auto mt-8 max-w-2xl text-lg text-[var(--color-text-secondary)] md:text-xl"
          >
            Discover how different sorting algorithms organize data and compare their performance in real-time.
          </motion.p>

          <motion.div
            variants={textVariants}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={scrollToDefinition}
              className="rounded-full bg-[#0A84FF] px-8 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-lg"
            >
              Learn More
            </button>
            <Link
              href="/compare"
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-8 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-hover)]"
            >
              Compare All
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial="hidden"
          animate={["show", "bounce"]}
          variants={scrollIndicatorVariants}
          className="absolute bottom-20 left-0 right-0 flex cursor-pointer justify-center"
          onClick={scrollToDefinition}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Scroll to explore</span>
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
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-0">
        {/* What is a Sorting Algorithm Section */}
        <section id="definition" className="scroll-mt-20">
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

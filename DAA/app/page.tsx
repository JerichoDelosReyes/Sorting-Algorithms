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

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20">
      <section
        className="rounded-[28px] border border-[var(--color-border)] px-6 py-16 text-center shadow-card"
        style={{
          background: "radial-gradient(circle at top, #ffffff 0%, #f5f5f7 65%)"
        }}
      >
        <h1 className="text-4xl font-semibold md:text-5xl">
          Sorting Algorithm Visualizer
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--color-text-secondary)] md:text-base">
          An interactive comparative study of Bubble Sort, Merge Sort, and Quick
          Sort.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#algorithms"
            className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white"
          >
            Start Exploring
          </a>
          <Link
            href="/compare"
            className="rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)]"
          >
            Compare All
          </Link>
        </div>
      </section>

      <section id="algorithms" className="mt-12">
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
                  Run all three algorithms on the same array simultaneously and
                  see which one wins.
                </p>
              </div>
              <Link
                href="/compare"
                className="rounded-full bg-[#0A84FF] px-6 py-3 text-sm font-semibold text-white"
              >
                Go to Compare
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

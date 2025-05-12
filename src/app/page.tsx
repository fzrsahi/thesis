"use client";

import { motion } from "framer-motion";
import { Montserrat, Orbitron } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { AnimatedBlobs } from "@/components/animations/AnimatedBlobs";
import WordParticleAnimation from "@/components/animations/WordParticleAnimation";

import Navbar from "../components/ui/Navbar";

const montserrat = Montserrat({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Home = () => (
  <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
    <SessionProvider>
      <Navbar />
    </SessionProvider>
    <AnimatedBlobs />
    <section className="relative z-10 flex h-screen w-full flex-col items-center justify-center px-4 text-center">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className={`${orbitron.className} mb-2 text-sm font-bold tracking-[0.3em] text-zinc-400`}
      >
        NEXT GENERATION
      </motion.div>
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.2, duration: 1 }}
        className={`${orbitron.className} text-5xl leading-tight font-extrabold text-white drop-shadow-xl md:text-7xl lg:text-8xl`}
      >
        The{" "}
        <span className="animate-text bg-gradient-to-r from-zinc-400 via-white to-zinc-500 bg-clip-text text-transparent">
          AI Competition Recommendation Tool
        </span>
      </motion.h1>
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.4, duration: 1 }}
        className={`${montserrat.className} mx-auto mt-8 max-w-2xl text-lg text-white/90 md:text-2xl`}
      >
        Designed to enhance your <span className="font-bold text-zinc-300">competitive edge</span>,
        our application leverages <span className="italic">cutting-edge LLM technology</span> to
        help you find the best competitions to participate in.
      </motion.p>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.6, duration: 1 }}
        className="mt-12 flex flex-col justify-center gap-5 sm:flex-row"
      >
        <button
          type="button"
          className="group flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-zinc-800/30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v12m0 0l-4-4m4 4l4-4m-4 4v6"
            />
          </svg>
          GET STARTED
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-800 bg-black/50 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-300 hover:shadow-lg hover:shadow-zinc-800/20"
        >
          ABOUT
        </button>
      </motion.div>
    </section>

    <section className="relative h-screen w-full">
      <div className="absolute inset-0">
        <WordParticleAnimation />
      </div>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`${orbitron.className} mb-8 text-center text-4xl font-bold text-white md:text-5xl`}
        >
          How LLMs Power Our Recommendations
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl rounded-xl border border-zinc-800/50 bg-zinc-900/70 p-8 shadow-2xl shadow-zinc-900/50 backdrop-blur-md"
        >
          <div className={`${montserrat.className} grid gap-8 text-zinc-300 md:grid-cols-2`}>
            <div className="space-y-6">
              <div className="group rounded-lg border border-zinc-800 bg-black/40 p-6 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-800/20">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-white shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Neural Networks</h3>
                <p className="mt-2 text-zinc-400">
                  Our LLM uses deep neural networks with billions of parameters to understand the
                  nuances of competition requirements and match them with your skills and
                  preferences.
                </p>
              </div>

              <div className="group rounded-lg border border-zinc-800 bg-black/40 p-6 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-800/20">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-white shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Contextual Understanding</h3>
                <p className="mt-2 text-zinc-400">
                  Through transformer architecture, our models process information contextually,
                  understanding the relationships between different competition aspects.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group rounded-lg border border-zinc-800 bg-black/40 p-6 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-800/20">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-white shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Vector Embeddings</h3>
                <p className="mt-2 text-zinc-400">
                  We transform text into high-dimensional vector spaces, allowing our system to find
                  semantic similarities between your profile and competition descriptions.
                </p>
              </div>

              <div className="group rounded-lg border border-zinc-800 bg-black/40 p-6 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-800/20">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-white shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Continuous Learning</h3>
                <p className="mt-2 text-zinc-400">
                  Our models continuously improve through feedback loops, learning from successful
                  matches to provide increasingly accurate recommendations over time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  </main>
);

export default Home;

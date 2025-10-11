"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  Users,
  Trophy,
  Cpu,
  Database,
  Network,
  Star,
  Award,
  Rocket,
} from "lucide-react";
import { Montserrat, Orbitron } from "next/font/google";
import { useState, useEffect } from "react";

import { useIsMobile } from "@/client/hooks/useMobile";
import { AnimatedBlobs } from "@/components/animations/AnimatedBlobs";
import WordParticleAnimation from "@/components/animations/WordParticleAnimation";

const montserrat = Montserrat({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startCount = 0;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (end - startCount) + startCount);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const Home = () => {
  const isMobile = useIsMobile();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <AnimatedBlobs />

      {/* Hero Section */}
      <section
        id="home"
        className={`relative z-10 mt-20 flex w-full flex-col items-center justify-center px-4 text-center ${
          isMobile ? "h-[90vh] py-8" : "h-screen"
        }`}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl delay-1000" />
          <div className="absolute top-1/2 right-1/3 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl delay-500" />
        </div>

        {/* Scout & UNG Logo */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1, duration: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3">
            <img src="/images/logo.png" alt="Scout" className="h-20 w-auto md:h-24" />
            <img
              src="/images/image.png"
              alt="Universitas Negeri Gorontalo"
              className="h-20 w-auto md:h-24"
            />
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2, duration: 1 }}
          className={`${orbitron.className} text-3xl leading-tight font-bold text-white md:text-5xl lg:text-6xl`}
          style={isMobile ? { fontSize: "2rem", lineHeight: "2.5rem" } : {}}
        >
          Selamat Datang di <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            <span className="text-blue-300">Scout!</span>
          </span>{" "}
          <br />
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-4"
        >
          <p className={`${montserrat.className} text-sm font-medium text-zinc-400 md:text-base`}>
            <span className="font-semibold text-blue-300">Scout</span> - Platform yang diciptakan
            untuk pencari bakat akademik
          </p>
          <p className={`${montserrat.className} mt-1 text-xs text-zinc-500 md:text-sm`}>
            &ldquo;Scout&rdquo; diambil dari bahasa Inggris yang berarti{" "}
            <span className="font-semibold text-blue-300">pencari bakat</span>
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4, duration: 1 }}
          className={`${montserrat.className} mx-auto mt-6 max-w-2xl text-base text-zinc-300 md:text-lg`}
        >
          Temukan kompetisi yang sesuai dengan bakat akademik Anda.{" "}
          <span className="font-semibold text-blue-300">Scout</span> menggunakan{" "}
          <span className="font-semibold text-blue-300">Large Language Model (LLM)</span> untuk
          analisis yang lebih akurat dan personal.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6, duration: 1 }}
          className={`mt-8 flex flex-col justify-center gap-4 ${isMobile ? "" : "sm:flex-row"}`}
        >
          <motion.a
            href="/my-recomendation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-blue-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center justify-center space-x-2">
              <Rocket className="h-5 w-5" />
              <span>Mulai Rekomendasi!</span>
            </div>
          </motion.a>
        </motion.div>
      </section>

      {/* AI Demo Section */}
      <section id="features" className="relative w-full py-16">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl delay-1000" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className={`${orbitron.className} mb-4 text-2xl font-bold text-white md:text-4xl`}>
              Lihat{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Fitur Chat AI dari Scout bekerja
              </span>
            </h2>
            <p className={`${montserrat.className} mx-auto max-w-2xl text-base text-zinc-400`}>
              Teknologi AI menganalisis profil akademik untuk menghasilkan rekomendasi kompetisi
              yang relevan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-4xl"
          >
            {/* Video Container */}
            <div className="group relative overflow-hidden rounded-2xl border border-zinc-700/30 bg-zinc-800/20 shadow-xl backdrop-blur-sm">
              {/* Video Element */}
              <div className="relative aspect-video overflow-hidden">
                <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                  <source src="/video/output.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Video Info Bar */}
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Analisis AI Real-time</p>
                      <p className="text-xs text-zinc-400">Pencocokan kompetisi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="h-1 w-1 animate-bounce rounded-full bg-blue-400" />
                      <div
                        className="h-1 w-1 animate-bounce rounded-full bg-purple-400"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="h-1 w-1 animate-bounce rounded-full bg-pink-400"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400">Live</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-3 left-3 flex items-center space-x-1 rounded-md bg-black/40 px-2 py-1 backdrop-blur-sm">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                <span className="text-xs text-white">AI Aktif</span>
              </div>

              <div className="absolute top-3 right-3 flex items-center space-x-1 rounded-md bg-black/40 px-2 py-1 backdrop-blur-sm">
                <Brain className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-white">LLM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="about" className="relative w-full py-16">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl delay-1000" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className={`${orbitron.className} mb-4 text-2xl font-bold text-white md:text-4xl`}>
              Platform untuk
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {" "}
                Dosen dan Mahasiswa
              </span>
            </h2>
            <p className={`${montserrat.className} mx-auto max-w-2xl text-base text-zinc-400`}>
              Platform ini diciptakan untuk menemukan kompetisi yang relevan dengan latar belakang
              mahasiswa.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {[
              { icon: Users, number: 12500, label: "Pengguna", suffix: "+" },
              { icon: Trophy, number: 2500, label: "Kompetisi", suffix: "+" },
              { icon: Star, number: 95, label: "Keberhasilan", suffix: "%" },
              { icon: Award, number: 500, label: "Penghargaan", suffix: "+" },
            ].map((stat, _index) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-lg border border-zinc-700/30 bg-zinc-800/20 p-6 backdrop-blur-sm transition-all hover:border-zinc-600/50 hover:bg-zinc-700/20"
              >
                <div className="relative text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                    <stat.icon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="mb-1 text-2xl font-bold text-white md:text-3xl">
                    <AnimatedCounter end={stat.number} />
                    {stat.suffix}
                  </div>
                  <p className="text-xs text-zinc-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section id="technology" className={`relative w-full ${isMobile ? "h-fit py-16" : "py-16"}`}>
        <div className="absolute inset-0">
          <WordParticleAnimation />
        </div>
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-3 md:px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`${orbitron.className} mb-8 text-center text-2xl font-bold text-white md:text-4xl`}
          >
            Didukung oleh{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Teknologi
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto w-full max-w-5xl rounded-xl border border-zinc-700/30 bg-zinc-800/20 p-6 shadow-xl backdrop-blur-md md:p-8"
          >
            <div
              className={`${montserrat.className} grid gap-6 text-zinc-300 md:gap-8 ${
                isMobile ? "grid-cols-1" : "md:grid-cols-2"
              }`}
            >
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="group relative overflow-hidden rounded-lg border border-zinc-700/30 bg-zinc-800/20 p-4 transition-all hover:border-zinc-600/50 hover:bg-zinc-700/20"
                >
                  <div className="relative">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                      <Cpu className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">Jaringan Neural</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      Model AI memahami deskripsi kompetisi dan profil akademik untuk menghasilkan
                      rekomendasi yang akurat.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="group relative overflow-hidden rounded-lg border border-zinc-700/30 bg-zinc-800/20 p-4 transition-all hover:border-zinc-600/50 hover:bg-zinc-700/20"
                >
                  <div className="relative">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                      <Zap className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">Pemahaman Kontekstual</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      Arsitektur transformer memahami konteks mata kuliah dan minat riset untuk
                      rekomendasi yang relevan.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="group relative overflow-hidden rounded-lg border border-zinc-700/30 bg-zinc-800/20 p-4 transition-all hover:border-zinc-600/50 hover:bg-zinc-700/20"
                >
                  <div className="relative">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                      <Database className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">Embedding Vektor</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      Teks profil dan kompetisi diubah ke ruang vektor untuk menemukan kesamaan
                      semantik yang melampaui pencarian kata kunci.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="group relative overflow-hidden rounded-lg border border-zinc-700/30 bg-zinc-800/20 p-4 transition-all hover:border-zinc-600/50 hover:bg-zinc-700/20"
                >
                  <div className="relative">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20">
                      <Network className="h-5 w-5 text-orange-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">
                      Pembelajaran Berkelanjutan
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      Sistem terus membaik dari umpan balik penggunaan untuk meningkatkan kualitas
                      rekomendasi dari waktu ke waktu.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;

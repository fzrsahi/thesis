"use client";

import { motion } from "framer-motion";
import { Brain, Rocket } from "lucide-react";
import { Montserrat, Orbitron } from "next/font/google";
import { useState, useEffect } from "react";

import { useIsMobile } from "@/client/hooks/useMobile";
import { AnimatedBlobs } from "@/components/animations/AnimatedBlobs";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"] });

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Home = () => {
  const isMobile = useIsMobile();
  const [isLight, setIsLight] = useState<boolean>(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("scout-theme") : null;
    if (stored) setIsLight(stored === "light");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("scout-theme", isLight ? "light" : "dark");
    }
  }, [isLight]);

  // Sync with Navbar toggle
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      const theme = customEvent?.detail?.theme;
      if (!theme) return;
      setIsLight(theme === "light");
    };
    window.addEventListener("scout-theme-change", handler as EventListener);
    return () => window.removeEventListener("scout-theme-change", handler as EventListener);
  }, []);

  const colors = {
    mainBg: isLight
      ? "bg-gradient-to-br from-zinc-200 via-stone-200 to-zinc-300"
      : "bg-gradient-to-br from-zinc-900 via-black to-zinc-900",
    textPrimary: isLight ? "text-stone-900" : "text-white",
    textSecondary: isLight ? "text-stone-700" : "text-zinc-400",
    textTertiary: isLight ? "text-stone-600" : "text-zinc-500",
    cardBg: isLight ? "bg-stone-100" : "bg-zinc-800/20",
    cardBorder: isLight ? "border-stone-400" : "border-zinc-700/30",
    cardHoverBg: isLight ? "hover:bg-stone-200" : "hover:bg-zinc-700/20",
    cardHoverBorder: isLight ? "hover:border-stone-500" : "hover:border-zinc-600/50",
  } as const;

  const accentTextClass = isLight ? "text-[#D97742]" : "text-blue-300";
  const highlightGradientClass = isLight
    ? "bg-gradient-to-r from-[#F4B087] via-[#E98A63] to-[#D46B45]"
    : "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400";
  const ctaGradientClass = isLight
    ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A]"
    : "bg-gradient-to-r from-blue-500 to-purple-600";
  const ctaHoverShadowClass = isLight ? "hover:shadow-[#E4986E]/30" : "hover:shadow-blue-500/25";

  return (
    <main className={`relative min-h-screen overflow-hidden ${colors.mainBg}`}>
      <AnimatedBlobs />

      {/* Theme toggle moved to Navbar */}

      {/* Hero Section */}
      <section
        id="home"
        className={`relative z-10 mt-20 flex w-full flex-col items-center justify-center px-4 text-center ${
          isMobile ? "h-[90vh] py-8" : "h-screen"
        }`}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div
            className={`absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl ${
              isLight
                ? "bg-gradient-to-r from-[#F7C8A2]/25 to-[#E9A779]/25"
                : "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            }`}
          />
          <div
            className={`absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full blur-3xl delay-1000 ${
              isLight
                ? "bg-gradient-to-r from-[#F4B087]/25 to-[#E37B59]/25"
                : "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
            }`}
          />
          <div
            className={`absolute top-1/2 right-1/3 h-64 w-64 animate-pulse rounded-full blur-2xl delay-500 ${
              isLight
                ? "bg-gradient-to-r from-[#F2C190]/25 to-[#F6A964]/25"
                : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20"
            }`}
          />
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
            <img
              src="/images/logo.png"
              alt="Scout"
              className={`h-28 w-auto md:h-32 ${isLight ? "invert" : ""}`}
            />
            <img
              src="/images/image.png"
              alt="Universitas Negeri Gorontalo"
              className="h-24 w-auto md:h-28"
            />
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2, duration: 1 }}
          className={`${orbitron.className} text-3xl leading-tight font-bold ${colors.textPrimary} md:text-5xl lg:text-6xl`}
          style={isMobile ? { fontSize: "2rem", lineHeight: "2.5rem" } : {}}
        >
          Selamat Datang di <br />
          <span className={`${highlightGradientClass} bg-clip-text font-semibold text-transparent`}>
            Scout!
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
          <p
            className={`${montserrat.className} text-sm font-medium ${colors.textSecondary} md:text-base`}
          >
            <span className={`font-semibold ${accentTextClass}`}>Scout</span> - Platform yang
            diciptakan untuk pencari bakat akademik
          </p>
          <p className={`${montserrat.className} mt-1 text-xs ${colors.textTertiary} md:text-sm`}>
            &ldquo;Scout&rdquo; diambil dari bahasa Inggris yang berarti{" "}
            <span className={`font-semibold ${accentTextClass}`}>pencari bakat</span>
          </p>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4, duration: 1 }}
          className={`${montserrat.className} mx-auto mt-6 max-w-2xl text-base ${
            isLight ? colors.textSecondary : "text-zinc-300"
          } md:text-lg`}
        >
          Temukan kompetisi yang sesuai dengan bakat akademik Anda.{" "}
          <span className={`font-semibold ${accentTextClass}`}>Scout</span> menggunakan{" "}
          <span className={`font-semibold ${accentTextClass}`}>Large Language Model (LLM)</span>{" "}
          untuk analisis yang lebih akurat dan personal.
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
            className={`group relative overflow-hidden rounded-lg px-6 py-3 text-base font-semibold text-white shadow-lg transition-all ${ctaGradientClass} ${ctaHoverShadowClass}`}
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
          <div
            className={`absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full blur-3xl ${
              isLight
                ? "bg-gradient-to-r from-[#F7C8A2]/20 to-[#E7A876]/20"
                : "bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
            }`}
          />
          <div
            className={`absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full blur-3xl delay-1000 ${
              isLight
                ? "bg-gradient-to-r from-[#F2B88C]/20 to-[#E17D5A]/20"
                : "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            }`}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2
              className={`${orbitron.className} mb-4 text-2xl font-bold ${colors.textPrimary} md:text-4xl`}
            >
              Lihat{" "}
              <span
                className={`bg-clip-text text-transparent ${
                  isLight
                    ? "bg-gradient-to-r from-[#F6A964] to-[#E36C3A]"
                    : "bg-gradient-to-r from-cyan-400 to-blue-400"
                }`}
              >
                Fitur Chat AI dari Scout bekerja
              </span>
            </h2>
            <p
              className={`${montserrat.className} mx-auto max-w-2xl text-base ${colors.textSecondary}`}
            >
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
            <div
              className={`group relative overflow-hidden rounded-2xl border ${colors.cardBorder} ${colors.cardBg} shadow-xl backdrop-blur-sm ${colors.cardHoverBg} ${colors.cardHoverBorder}`}
            >
              {/* Video Element */}
              <div className="relative aspect-video overflow-hidden">
                <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                  <source src="/video/output.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    isLight
                      ? "from-white/70 via-white/10 to-transparent"
                      : "from-black/30 via-transparent to-transparent"
                  }`}
                />
              </div>

              {/* Video Info Bar */}
              <div
                className={`absolute right-0 bottom-0 left-0 bg-gradient-to-t ${
                  isLight
                    ? "from-white/80 via-white/30 to-transparent"
                    : "from-black/40 to-transparent"
                } p-4`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-semibold ${isLight ? "text-zinc-900" : "text-white"}`}
                      >
                        Analisis AI Real-time
                      </p>
                      <p className={`text-xs ${colors.textSecondary}`}>Pencocokan kompetisi</p>
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
                    <span className={`text-xs ${colors.textSecondary}`}>Live</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div
                className={cn(
                  "absolute top-3 left-3 flex items-center space-x-1 rounded-md px-2 py-1 backdrop-blur-sm",
                  isLight ? "border border-stone-300/70 bg-white/80" : "bg-black/20"
                )}
              >
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                <span className={`text-xs ${isLight ? "text-[#2F2A24]" : "text-white"}`}>
                  AI Aktif
                </span>
              </div>

              <div
                className={cn(
                  "absolute top-3 right-3 flex items-center space-x-1 rounded-md px-2 py-1 backdrop-blur-sm",
                  isLight ? "border border-stone-300/70 bg-white/80" : "bg-black/20"
                )}
              >
                <Brain className="h-3 w-3 text-blue-400" />
                <span className={`text-xs ${isLight ? "text-[#2F2A24]" : "text-white"}`}>LLM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`relative z-10 border-t ${isLight ? "border-stone-300/60" : "border-zinc-800"}`}
      >
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className={`${orbitron.className} text-lg font-bold ${colors.textPrimary}`}>
                Scout
              </h3>
              <p className={`${montserrat.className} mt-2 text-sm ${colors.textSecondary}`}>
                Platform rekomendasi kompetisi berbasis LLM. Temukan peluang sesuai bakatmu.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 md:col-span-2 md:grid-cols-3">
              <div>
                <p className={`text-sm font-semibold ${colors.textPrimary}`}>Produk</p>
                <ul
                  className={`${montserrat.className} mt-3 space-y-2 text-sm ${colors.textSecondary}`}
                >
                  <li>
                    <a href="#features" className="hover:underline">
                      Demo AI
                    </a>
                  </li>
                  <li>
                    <a href="/my-recomendation" className="hover:underline">
                      Rekomendasi
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className={`text-sm font-semibold ${colors.textPrimary}`}>Perusahaan</p>
                <ul
                  className={`${montserrat.className} mt-3 space-y-2 text-sm ${colors.textSecondary}`}
                >
                  <li>
                    <a href="#home" className="hover:underline">
                      Beranda
                    </a>
                  </li>
                  <li>
                    <a href="/dashboard" className="hover:underline">
                      Dashboard
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className={`text-sm font-semibold ${colors.textPrimary}`}>Kontak</p>
                <ul
                  className={`${montserrat.className} mt-3 space-y-2 text-sm ${colors.textSecondary}`}
                >
                  <li>
                    <a href="mailto:hello@scout.ai" className="hover:underline">
                      hello@scout.ai
                    </a>
                  </li>
                  <li>
                    <span className="cursor-pointer hover:underline">Kebijakan Privasi</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row ${isLight ? "border-stone-300/60" : "border-zinc-800"}`}
          >
            <p className={`${montserrat.className} text-xs ${colors.textTertiary}`}>
              © {new Date().getFullYear()} Scout. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#features"
                className={`${montserrat.className} text-xs hover:underline ${colors.textSecondary}`}
              >
                Fitur
              </a>
              <span className={`${colors.textTertiary}`}>•</span>
              <a
                href="/my-recomendation"
                className={`${montserrat.className} text-xs hover:underline ${colors.textSecondary}`}
              >
                Mulai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;

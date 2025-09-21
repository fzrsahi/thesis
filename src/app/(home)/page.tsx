"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Users,
  Trophy,
  ArrowRight,
  MessageCircle,
  Cpu,
  Database,
  Network,
  Bot,
  Send,
  ChevronDown,
  Star,
  Award,
  Rocket,
  Lightbulb,
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

// AI Chat Interface Component
const AIChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Saya adalah penasihat kompetisi AI Anda. Tanyakan apa saja tentang menemukan kompetisi sempurna untuk Anda!",
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "Pertanyaan yang bagus! Berdasarkan profil Anda, saya merekomendasikan untuk fokus pada kompetisi yang sesuai dengan keterampilan teknis dan tujuan karir Anda. Apakah Anda ingin saya menganalisis profil Anda dan memberikan rekomendasi spesifik?",
        isAI: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 h-96 w-80 overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Penasihat AI</h3>
                    <p className="text-xs text-zinc-400">Online</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isAI ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        message.isAI
                          ? "bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 text-zinc-200"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-2xl bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-zinc-800/50 p-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Tanyakan apa saja..."
                    className="flex-1 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-2 text-white hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl hover:shadow-blue-500/25"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </motion.button>
    </div>
  );
};

const Home = () => {
  const isMobile = useIsMobile();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <AnimatedBlobs />

      {/* Hero Section */}
      <section
        className={`relative z-10 mt-32 flex w-full flex-col items-center justify-center px-4 text-center ${
          isMobile ? "h-[90vh] py-8" : "h-screen"
        }`}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl delay-1000" />
          <div className="absolute top-1/2 right-1/3 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl delay-500" />
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className={`${orbitron.className} mb-4 text-sm font-bold tracking-[0.3em] text-zinc-400 md:text-base`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Brain className="h-4 w-4 text-blue-400" />
            <span>PENCARIAN KOMPETISI BERBASIS AI</span>
            <Brain className="h-4 w-4 text-purple-400" />
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2, duration: 1 }}
          className={`${orbitron.className} text-4xl leading-tight font-extrabold text-white drop-shadow-xl md:text-6xl lg:text-8xl`}
          style={isMobile ? { fontSize: "2.5rem", lineHeight: "3rem" } : {}}
        >
          Masa Depan{" "}
          <span className="animate-pulse bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Pencarian Kompetisi
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4, duration: 1 }}
          className={`${montserrat.className} mx-auto mt-8 max-w-3xl text-lg text-zinc-300 md:text-xl`}
        >
          Manfaatkan kekuatan <span className="font-bold text-blue-300">AI canggih</span> dan{" "}
          <span className="font-bold text-purple-300">machine learning</span> untuk menemukan
          kompetisi yang sempurna sesuai dengan keterampilan, minat, dan aspirasi karir Anda.
          Teknologi <span className="text-pink-300 italic">LLM generasi terbaru</span> kami
          menganalisis ribuan kompetisi untuk menemukan kecocokan sempurna untuk Anda.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.6, duration: 1 }}
          className={`mt-12 flex flex-col justify-center gap-6 md:gap-8 ${
            isMobile ? "" : "sm:flex-row"
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:shadow-blue-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center space-x-3">
              <Rocket className="h-6 w-6" />
              <span>Mulai Perjalanan Anda</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="group relative overflow-hidden rounded-xl border border-zinc-700/50 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:border-zinc-600/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative flex items-center space-x-3">
              <Lightbulb className="h-6 w-6" />
              <span>Pelajari Lebih Lanjut</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {[
            {
              icon: Brain,
              title: "Analisis AI",
              desc: "Jaringan neural canggih menganalisis profil Anda",
            },
            {
              icon: Target,
              title: "Kecocokan Sempurna",
              desc: "Temukan kompetisi yang sesuai dengan tujuan Anda",
            },
            {
              icon: TrendingUp,
              title: "Tingkat Keberhasilan",
              desc: "95% kepuasan pengguna dengan rekomendasi",
            },
          ].map((feature, _index) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:border-zinc-700/50 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-zinc-400">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* AI Typing Demo Section */}
      <section className="relative w-full py-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl delay-1000" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className={`${orbitron.className} mb-4 text-3xl font-bold text-white md:text-5xl`}>
              Saksikan{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                AI Kami Beraksi
              </span>
            </h2>
            <p className={`${montserrat.className} mx-auto max-w-2xl text-lg text-zinc-400`}>
              Lihat bagaimana AI canggih kami menganalisis profil Anda dan menghasilkan rekomendasi
              kompetisi yang dipersonalisasi secara real-time
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-4xl"
          >
            {/* Video Container */}
            <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 shadow-2xl backdrop-blur-sm">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Video Element */}
              <div className="relative aspect-video overflow-hidden">
                <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                  <source src="/video/output.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Video Info Bar */}
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Analisis AI Sedang Berlangsung
                      </p>
                      <p className="text-xs text-zinc-400">Pencocokan kompetisi real-time</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
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
              <div className="absolute top-4 left-4 flex items-center space-x-2 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                <span className="text-xs text-white">AI Sedang Memproses</span>
              </div>

              <div className="absolute top-4 right-4 flex items-center space-x-2 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm">
                <Brain className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-white">LLM Aktif</span>
              </div>
            </div>

            {/* Feature Cards Below Video */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {[
                {
                  icon: Zap,
                  title: "Analisis Real-time",
                  desc: "Pemrosesan dan pencocokan profil secara instan",
                },
                {
                  icon: Target,
                  title: "Pencocokan Presisi",
                  desc: "AI menemukan kompetisi yang sesuai dengan profil Anda",
                },
                {
                  icon: TrendingUp,
                  title: "Pembelajaran Berkelanjutan",
                  desc: "Algoritma terus berkembang dengan setiap interaksi",
                },
              ].map((feature, _index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + _index * 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 p-6 backdrop-blur-sm transition-all hover:border-zinc-700/50 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm text-zinc-400">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative w-full py-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 animate-pulse rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl delay-1000" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className={`${orbitron.className} mb-4 text-3xl font-bold text-white md:text-5xl`}>
              Dipercaya oleh{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Ribuan
              </span>{" "}
              Pengguna di Seluruh Dunia
            </h2>
            <p className={`${montserrat.className} mx-auto max-w-2xl text-lg text-zinc-400`}>
              Bergabunglah dengan komunitas mahasiswa dan profesional yang terus berkembang yang
              telah menemukan kompetisi sempurna mereka
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {[
              { icon: Users, number: 12500, label: "Pengguna Aktif", suffix: "+" },
              { icon: Trophy, number: 2500, label: "Kompetisi", suffix: "+" },
              { icon: Star, number: 95, label: "Tingkat Keberhasilan", suffix: "%" },
              { icon: Award, number: 500, label: "Penghargaan Dimenangkan", suffix: "+" },
            ].map((stat, _index) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 p-8 backdrop-blur-sm transition-all hover:border-zinc-700/50 hover:shadow-lg hover:shadow-green-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                    <AnimatedCounter end={stat.number} />
                    {stat.suffix}
                  </div>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced LLM Section */}
      <section className={`relative w-full ${isMobile ? "h-fit py-20" : "min-h-screen py-20"}`}>
        <div className="absolute inset-0">
          <WordParticleAnimation />
        </div>
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-3 md:px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`${orbitron.className} mb-8 text-center text-3xl font-bold text-white md:text-6xl`}
          >
            Didukung oleh{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Canggih
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto w-full max-w-6xl rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/70 to-zinc-800/70 p-8 shadow-2xl backdrop-blur-md md:p-12"
          >
            <div
              className={`${montserrat.className} grid gap-8 text-zinc-300 md:gap-12 ${
                isMobile ? "grid-cols-1" : "md:grid-cols-2"
              }`}
            >
              <div className="space-y-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                      <Cpu className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">Jaringan Neural</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      LLM canggih kami menggunakan jaringan neural dalam dengan miliaran parameter
                      untuk memahami nuansa persyaratan kompetisi dan mencocokkannya dengan
                      keterampilan dan preferensi Anda. Model ini terus belajar dan beradaptasi
                      untuk memberikan rekomendasi yang semakin akurat.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">Pemahaman Kontekstual</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      Melalui arsitektur transformer, model kami memproses informasi secara
                      kontekstual, memahami hubungan antara berbagai aspek kompetisi, latar belakang
                      Anda, dan tujuan masa depan untuk memberikan rekomendasi yang dipersonalisasi.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-green-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">Embedding Vektor</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      Kami mengubah teks menjadi ruang vektor berdimensi tinggi, memungkinkan sistem
                      kami untuk menemukan kesamaan semantik antara profil Anda dan deskripsi
                      kompetisi. Ini memungkinkan pencocokan yang presisi melampaui pencarian kata
                      kunci sederhana.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 p-6 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                      <Network className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-white">
                      Pembelajaran Berkelanjutan
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      Model kami terus berkembang melalui loop umpan balik, belajar dari kecocokan
                      yang berhasil untuk memberikan rekomendasi yang semakin akurat dari waktu ke
                      waktu. Setiap interaksi membantu menyempurnakan algoritma untuk saran yang
                      lebih baik di masa depan.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Chat Interface */}
      <AIChatInterface />
    </main>
  );
};

export default Home;

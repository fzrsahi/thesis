"use client";

import { motion } from "framer-motion";

export const AnimatedBlobs = () => (
  <div className="pointer-events-none absolute inset-0 z-0">
    <motion.div
      className="absolute top-20 left-10 h-72 w-72 rounded-full bg-zinc-700 blur-[100px]"
      animate={{ x: [0, 40, -40, 0], y: [0, 30, -30, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute right-10 bottom-20 h-72 w-72 rounded-full bg-zinc-600 blur-[100px]"
      animate={{ x: [0, -40, 40, 0], y: [0, -30, 30, 0] }}
      transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

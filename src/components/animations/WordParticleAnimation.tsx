"use client";

/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { useEffect, useRef } from "react";

interface WordParticleAnimationProps {
  className?: string;
}

const WordParticleAnimation = ({ className = "" }: WordParticleAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const texts = [
      "language",
      "model",
      "processing",
      "tokens",
      "neural",
      "network",
      "attention",
      "transformer",
      "embedding",
      "vector",
      "context",
      "generation",
      "prediction",
      "sequence",
      "learning",
      "AI",
      "GPT",
      "BERT",
      "algorithm",
      "data",
    ];

    const fonts = ["monospace", "Courier New", "Consolas", "Monaco", "Roboto Mono"];
    const color = "rgba(255, 255, 255, alpha)";

    const wordParticles: {
      text: string;
      x: number;
      y: number;
      size: number;
      alpha: number;
      velocity: { x: number; y: number };
      highlighted: boolean;
      highlightProgress: number;
      highlightDirection: number;
      color: string;
      font: string;
    }[] = [];

    for (let i = 0; i < 45; i++) {
      const randomFont = fonts[Math.floor(Math.random() * fonts.length)];

      wordParticles.push({
        text: texts[Math.floor(Math.random() * texts.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 12 + 10,
        alpha: Math.random() * 0.5 + 0.1,
        velocity: {
          x: (Math.random() - 0.5) * 0.4,
          y: (Math.random() - 0.5) * 0.4,
        },
        highlighted: false,
        highlightProgress: 0,
        highlightDirection: 1,
        color: color.replace("alpha", (Math.random() * 0.6 + 0.2).toString()),
        font: randomFont,
      });
    }

    const highlightRandomWord = () => {
      const numToHighlight = Math.floor(Math.random() * 3) + 1;

      for (let h = 0; h < numToHighlight; h++) {
        const randomIndex = Math.floor(Math.random() * wordParticles.length);
        wordParticles[randomIndex].highlighted = true;

        setTimeout(
          () => {
            if (wordParticles[randomIndex]) {
              wordParticles[randomIndex].highlighted = false;
              wordParticles[randomIndex].highlightProgress = 0;
            }
          },
          1500 + Math.random() * 1500
        );
      }
    };

    const highlightInterval = setInterval(highlightRandomWord, 200);

    const connectWords = () => {
      for (let i = 0; i < wordParticles.length; i++) {
        for (let j = i + 1; j < wordParticles.length; j++) {
          const dx = wordParticles[i].x - wordParticles[j].x;
          const dy = wordParticles[i].y - wordParticles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            ctx.beginPath();
            const isHighlighted = wordParticles[i].highlighted || wordParticles[j].highlighted;

            if (isHighlighted) {
              const gradient = ctx.createLinearGradient(
                wordParticles[i].x,
                wordParticles[i].y,
                wordParticles[j].x,
                wordParticles[j].y
              );
              gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
              gradient.addColorStop(1, "rgba(255, 255, 255, 0.4)");
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 1.5;
            } else {
              const opacity = 0.15 * (1 - distance / 180);
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.lineWidth = 0.5;
            }

            ctx.moveTo(wordParticles[i].x, wordParticles[i].y);
            ctx.lineTo(wordParticles[j].x, wordParticles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const particles: { x: number; y: number; size: number; speed: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    const drawParticles = () => {
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fill();

        particle.y -= particle.speed;

        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const glow = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      glow.addColorStop(0, "rgba(0, 0, 0, 0.2)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawParticles();

      wordParticles.forEach((particle) => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x < 0 || particle.x > canvas.width) {
          particle.velocity.x = -particle.velocity.x;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.velocity.y = -particle.velocity.y;
        }

        if (particle.highlighted) {
          particle.highlightProgress += 0.05 * particle.highlightDirection;
          if (particle.highlightProgress >= 1) {
            particle.highlightDirection = -1;
          } else if (particle.highlightProgress <= 0) {
            particle.highlightDirection = 1;
          }
        }

        ctx.font = `${particle.size}px ${particle.font}`;
        ctx.textAlign = "center";

        if (particle.highlighted) {
          const chars = particle.text.split("");
          const highlightIndex = Math.floor(chars.length * particle.highlightProgress);

          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)";

          for (let i = 0; i < chars.length; i++) {
            const charWidth = ctx.measureText(chars[i]).width;
            const totalWidth = ctx.measureText(particle.text).width;
            const startX = particle.x - totalWidth / 2;
            const charX = startX + i * charWidth + charWidth / 2;

            if (i <= highlightIndex) {
              ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha + 0.5})`;
            } else {
              ctx.fillStyle = particle.color;
            }

            ctx.fillText(chars[i], charX, particle.y);
          }

          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = particle.color;
          ctx.fillText(particle.text, particle.x, particle.y);
        }
      });

      connectWords();
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(highlightInterval);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full ${className}`} />;
};

export default WordParticleAnimation;

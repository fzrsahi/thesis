"use client";

import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const TypographyH1 = ({ children, className }: TypographyProps) => (
  <h1
    className={cn(
      "text-3xl font-extrabold text-white drop-shadow-xl md:text-5xl lg:text-6xl",
      className
    )}
  >
    {children}
  </h1>
);

export const TypographyH2 = ({ children, className }: TypographyProps) => (
  <h2 className={cn("text-2xl font-bold text-white md:text-4xl", className)}>{children}</h2>
);

export const TypographyH3 = ({ children, className }: TypographyProps) => (
  <h3 className={cn("text-xl font-bold text-white md:text-2xl", className)}>{children}</h3>
);

export const TypographyH4 = ({ children, className }: TypographyProps) => (
  <h4 className={cn("text-lg font-semibold text-white md:text-xl", className)}>{children}</h4>
);

export const TypographyP = ({ children, className }: TypographyProps) => (
  <p className={cn("leading-relaxed text-zinc-300", className)}>{children}</p>
);

export const TypographyLead = ({ children, className }: TypographyProps) => (
  <p className={cn("text-lg leading-relaxed text-zinc-300 md:text-xl", className)}>{children}</p>
);

export const TypographyLarge = ({ children, className }: TypographyProps) => (
  <div className={cn("text-lg font-semibold text-white", className)}>{children}</div>
);

export const TypographySmall = ({ children, className }: TypographyProps) => (
  <small className={cn("text-sm font-medium text-zinc-400", className)}>{children}</small>
);

export const TypographyMuted = ({ children, className }: TypographyProps) => (
  <p className={cn("text-sm text-zinc-400", className)}>{children}</p>
);

export const TypographyEmphasis = ({ children, className }: TypographyProps) => (
  <span className={cn("font-bold text-zinc-300", className)}>{children}</span>
);

export const TypographyHighlight = ({ children, className }: TypographyProps) => (
  <span className={cn("text-white italic", className)}>{children}</span>
);

export const TypographyGradient = ({ children, className }: TypographyProps) => (
  <span
    className={cn(
      "bg-gradient-to-r from-zinc-400 via-white to-zinc-500 bg-clip-text text-transparent",
      className
    )}
  >
    {children}
  </span>
);

export const TypographyCode = ({ children, className }: TypographyProps) => (
  <code
    className={cn(
      "relative rounded bg-zinc-800 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-zinc-300",
      className
    )}
  >
    {children}
  </code>
);

export const TypographyBlockquote = ({ children, className }: TypographyProps) => (
  <blockquote
    className={cn("mt-6 border-l-2 border-zinc-700 pl-6 text-zinc-300 italic", className)}
  >
    {children}
  </blockquote>
);

export const TypographyList = ({ children, className }: TypographyProps) => (
  <ul className={cn("my-6 ml-6 list-disc text-zinc-300 [&>li]:mt-2", className)}>{children}</ul>
);

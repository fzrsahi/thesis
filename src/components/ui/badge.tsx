import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-black",
  {
    variants: {
      variant: {
        default: "border-transparent bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
        secondary: "border-transparent bg-zinc-700 text-zinc-200 hover:bg-zinc-600",
        destructive: "border-transparent bg-red-900 text-red-200 hover:bg-red-800",
        outline: "border-zinc-700 text-zinc-300 hover:bg-zinc-800",
        success: "border-transparent bg-green-900 text-green-200 hover:bg-green-800",
        warning: "border-transparent bg-yellow-900 text-yellow-200 hover:bg-yellow-800",
        gradient:
          "border-transparent bg-gradient-to-r from-zinc-700 to-zinc-800 text-white hover:from-zinc-600 hover:to-zinc-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);

export { Badge, badgeVariants };

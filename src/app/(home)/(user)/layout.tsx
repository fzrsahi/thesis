"use client";

import React from "react";

import { AnimatedBlobs } from "@/components/animations/AnimatedBlobs";
import { UserSidebar } from "@/components/ui/user-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  return (
    <div className="relative min-h-screen bg-black text-white">
      <AnimatedBlobs />
      <UserSidebar />
      <main
        className={cn("flex-1 transition-all duration-300", isMobile ? "ml-0 p-4" : "ml-72 p-6")}
      >
        <div className="mt-32 mb-24 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

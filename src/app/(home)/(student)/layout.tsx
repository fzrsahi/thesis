"use client";

import React, { useEffect, useState } from "react";

import { useIsMobile } from "@/client/hooks/useMobile";
import Navbar from "@/components/ui/Navbar";
import { UserSidebar, SidebarProvider, useSidebar } from "@/components/ui/user-sidebar";
import { cn } from "@/lib/utils";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const { collapsed } = useSidebar();
  const [isLight, setIsLight] = useState<boolean>(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("scout-theme") : null;
    if (stored) setIsLight(stored === "light");
  }, []);

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
    background: isLight
      ? "bg-gradient-to-br from-zinc-200 via-stone-200 to-zinc-300 text-[#2F2A24]"
      : "bg-black text-white",
    card: isLight
      ? "border border-stone-300/70 bg-white/80 text-[#2F2A24]"
      : "border border-zinc-800/50 bg-zinc-900/30 text-white",
  } as const;

  const getMainClassName = () => {
    if (isMobile) {
      return "ml-0 p-4";
    }
    if (collapsed) {
      return "ml-32 p-6"; // 20 (sidebar width) + 24 (left margin) + 32 (padding) = 76, but we use ml-32 for better spacing
    }
    return "ml-72 p-6"; // 256 (sidebar width) + 24 (left margin) + 32 (padding) = 312, but we use ml-72 for better spacing
  };

  return (
    <>
      <Navbar />
      <div
        className={cn("relative min-h-screen transition-colors duration-300", colors.background)}
      >
        <UserSidebar />
        <main className={cn("flex-1 transition-all duration-300", getMainClassName())}>
          <div
            className={cn(
              "mt-32 mb-24 rounded-xl p-6 backdrop-blur-sm transition-colors duration-300",
              colors.card
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <LayoutContent>{children}</LayoutContent>
  </SidebarProvider>
);

export default Layout;

"use client";

import React from "react";

import Navbar from "@/components/ui/Navbar";
import { UserSidebar, SidebarProvider, useSidebar } from "@/components/ui/user-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const { collapsed } = useSidebar();

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
      <div className="relative min-h-screen bg-black text-white">
        <UserSidebar />
        <main className={cn("flex-1 transition-all duration-300", getMainClassName())}>
          <div className="mt-32 mb-24 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 backdrop-blur-sm">
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

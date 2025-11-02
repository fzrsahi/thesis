"use client";

import { usePathname } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { UserAvatar } from "@/components/layout/user-avatar";
import QueryProvider from "@/components/providers/QueryProvider";
import { DashboardToaster } from "@/components/ui/dashboard-toaster";
import { Sidebar } from "@/components/ui/sidebar";
import { getBreadcrumbItems } from "@/lib/breadcrumb";
import { cn } from "@/lib/utils";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbItems(pathname);
  const isHome = pathname === "/dashboard";
  const { data: session } = useSession();
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isLight={isLight} />
      <main
        className={cn(
          "flex-1 overflow-y-auto transition-colors duration-300",
          isLight
            ? "bg-gradient-to-br from-zinc-200 via-stone-200 to-zinc-300 text-[#2F2A24]"
            : "bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 text-white"
        )}
      >
        <div className="p-6">
          <div className="mb-4">
            <BreadcrumbNav items={breadcrumbItems} isHome={isHome} />
          </div>
          {children}
          <UserAvatar
            user={{
              name: session?.user?.name,
              email: session?.user?.email,
              image: "https://github.com/shadcn.png",
            }}
            isLight={isLight}
            setIsLight={setIsLight}
          />
        </div>
      </main>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <QueryProvider>
      <DashboardContent>{children}</DashboardContent>
      <DashboardToaster />
    </QueryProvider>
  </SessionProvider>
);

export default DashboardLayout;

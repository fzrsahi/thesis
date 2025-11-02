"use client";

import { Settings, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, createContext, useContext, useMemo } from "react";

import { ROLES } from "@/app/shared/const/role";
import { useIsMobile } from "@/client/hooks/useMobile";
import { routes } from "@/constants/auth-routes";
import { Route } from "@/constants/auth-routes.type";
import { cn } from "@/lib/utils";

const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}>({
  collapsed: false,
  setCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const contextValue = useMemo(
    () => ({
      collapsed,
      setCollapsed,
    }),
    [collapsed, setCollapsed]
  );

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
};

export const UserSidebar = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLight, setIsLight] = useState<boolean>(true);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

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
    mobileButton: isLight
      ? "bg-[#2F2A24] text-white hover:shadow-[#E1B690]/30"
      : "bg-black text-white hover:shadow-white/10",
    aside: isLight
      ? "border border-stone-300 bg-zinc-200/90 text-[#2F2A24]"
      : "border border-zinc-800/50 bg-black text-white",
    headerBorder: isLight ? "border-b border-stone-300" : "border-b border-zinc-800/50",
    headerText: isLight ? "text-[#2F2A24]" : "text-white",
    toggleBtn: isLight
      ? "text-[#6B5A4A] hover:bg-[#EED4BC] hover:text-[#2F2A24]"
      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white",
    navContainerThumb: isLight ? "scrollbar-thumb-[#E6B98E]" : "scrollbar-thumb-zinc-700",
    navActive: isLight
      ? "bg-white font-medium text-[#2F2A24] shadow shadow-[#DEAC81]/30"
      : "bg-zinc-900 font-medium text-white",
    navInactive: isLight
      ? "text-[#3A332C] hover:bg-[#F5D5BF] hover:text-[#2F2A24]"
      : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white",
    navIndicator: isLight ? "bg-[#E36C3A]" : "bg-white",
    navIconInactive: isLight
      ? "text-[#886148] group-hover:text-[#2F2A24]"
      : "text-zinc-400 group-hover:text-white",
    tooltip: isLight
      ? "border border-stone-300 bg-zinc-200 text-[#2F2A24]"
      : "border border-zinc-800/50 bg-black text-white",
    footerBorder: isLight ? "border-stone-300" : "border-zinc-800/50",
    footerText: isLight ? "text-[#5C5245]" : "text-zinc-500",
  } as const;

  const navItems = routes
    .filter((r: Route) => r.roles.includes(ROLES.STUDENT))
    .map((item) => ({
      name: item.name,
      href: item.href,
      icon: item.icon,
    }));

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {isMobile && (
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className={cn(
            "fixed top-20 left-4 z-50 rounded-full p-3 transition-all duration-300",
            colors.mobileButton
          )}
        >
          <Menu size={24} />
        </button>
      )}

      <aside
        className={cn(
          "fixed top-24 left-6 z-40 flex h-[calc(100vh-180px)] flex-col rounded-2xl backdrop-blur-lg transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64",
          isMobile && !mobileOpen && "-translate-x-full",
          "shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
          colors.aside
        )}
      >
        <div
          className={cn(
            "flex items-center rounded-t-2xl transition-all duration-300",
            collapsed ? "justify-center p-5" : "p-6",
            colors.headerBorder
          )}
        >
          {!collapsed ? (
            <div className={cn("text-2xl font-bold tracking-wide", colors.headerText)}>
              Menu Mahasiswa
            </div>
          ) : (
            <div className="text-2xl font-bold tracking-wide">
              <span className={colors.headerText}>U</span>
            </div>
          )}

          {!isMobile && (
            <button
              type="button"
              onClick={toggleSidebar}
              className={cn(
                "ml-auto rounded-full p-2 backdrop-blur-sm transition-colors",
                collapsed && "ml-0",
                colors.toggleBtn
              )}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
        </div>

        <nav
          className={cn(
            "scrollbar-thin scrollbar-track-transparent flex-1 space-y-2 overflow-y-auto p-4",
            colors.navContainerThumb,
            collapsed && "p-2"
          )}
        >
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-xl transition-all duration-300",
                  isActive ? colors.navActive : colors.navInactive,
                  collapsed ? "justify-center px-3 py-4" : "px-4 py-3"
                )}
              >
                {isActive && (
                  <div
                    className={cn(
                      "absolute left-0 h-full w-1",
                      colors.navIndicator,
                      collapsed && "left-0"
                    )}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center",
                    "transition-all duration-300",
                    isActive ? (isLight ? "text-[#D97742]" : "text-white") : colors.navIconInactive
                  )}
                >
                  <Icon
                    size={22}
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}
                  />
                </div>

                {!collapsed && (
                  <span
                    className={cn(
                      "relative z-10 text-base font-medium transition-all duration-300",
                      isActive
                        ? colors.headerText
                        : isLight
                          ? "text-[#5C5245] group-hover:text-[#2F2A24]"
                          : "text-zinc-400 group-hover:text-white"
                    )}
                  >
                    {item.name}
                  </span>
                )}

                {collapsed && (
                  <span
                    className={cn(
                      "absolute left-full z-50 ml-2 rounded-lg px-3 py-1.5 text-sm whitespace-nowrap opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100",
                      colors.tooltip
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div
          className={cn(
            "mt-auto rounded-b-2xl border-t p-4",
            collapsed ? "flex justify-center" : "",
            colors.footerBorder
          )}
        >
          <div
            className={cn("text-center text-xs", colors.footerText, collapsed ? "hidden" : "block")}
          >
            © 2025 Scout
          </div>
          {collapsed && (
            <div className={colors.footerText}>
              <Settings size={18} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

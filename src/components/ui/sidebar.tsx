"use client";

import { Settings, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Role } from "@/app/shared/const/role";
import { useIsMobile } from "@/client/hooks/useMobile";
import { adminPaths, routes } from "@/constants/auth-routes";
import { Route } from "@/constants/auth-routes.type";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isLight?: boolean;
}

export const Sidebar = ({ isLight = false }: SidebarProps) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session, status } = useSession();
  const role = session?.user?.role || "user";

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const navItems = routes.filter((item: Route) => item.roles.includes(role as Role));

  const sidebarClasses = isLight
    ? "border-r border-stone-300/70 bg-white/95 text-[#2F2A24] shadow-[5px_0_30px_rgba(214,188,160,0.15)]"
    : "border-r border-zinc-800/50 bg-black text-white shadow-[5px_0_30px_rgba(0,0,0,0.2)]";

  const borderClasses = isLight ? "border-stone-300/70" : "border-zinc-800/50";
  const loadingBgClasses = isLight ? "bg-stone-200" : "bg-zinc-800/60";

  if (status === "loading") {
    return (
      <aside
        className={cn(
          "flex h-screen w-72 flex-col backdrop-blur-lg transition-all duration-300 ease-in-out",
          sidebarClasses
        )}
      >
        <div className={cn("flex items-center border-b p-6", borderClasses)}>
          <div className="text-2xl font-bold tracking-wide">
            <span className={isLight ? "text-[#2F2A24]" : "text-white"}>Scout</span>
          </div>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {adminPaths.map((key) => (
            <div
              key={key}
              className={cn("mb-2 h-10 w-full animate-pulse rounded-xl", loadingBgClasses)}
            />
          ))}
        </nav>
        <div className={cn("mt-auto border-t p-4", borderClasses)}>
          <div className={cn("h-6 w-24 animate-pulse rounded", loadingBgClasses)} />
        </div>
      </aside>
    );
  }

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
            "fixed top-4 left-4 z-50 rounded-full p-3 shadow-lg transition-all duration-300",
            isLight
              ? "bg-white/95 text-[#2F2A24] hover:shadow-stone-300/20"
              : "bg-black text-white hover:shadow-white/10"
          )}
        >
          <Menu size={24} />
        </button>
      )}

      <aside
        className={cn(
          "flex h-screen flex-col backdrop-blur-lg transition-all duration-300 ease-in-out",
          sidebarClasses,
          collapsed ? "w-20" : "w-72",
          isMobile && "fixed z-40",
          isMobile && !mobileOpen && "-translate-x-full"
        )}
      >
        <div
          className={cn(
            "relative flex items-center border-b transition-all duration-300",
            borderClasses,
            collapsed ? "justify-center p-5" : "p-6"
          )}
        >
          {/* Show only icon when collapsed, show icon + text when expanded */}
          <div className={cn("flex w-full items-center", collapsed ? "justify-center" : "gap-2.5")}>
            {collapsed ? (
              // Collapsed: Show only Scout logo, larger and centered
              <div className="h-12 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Scout"
                  width={48}
                  height={48}
                  className={cn("h-12 w-auto", isLight ? "invert" : "")}
                  priority
                />
              </div>
            ) : (
              // Expanded: Show both logos aligned
              <>
                <div className="flex h-11 shrink-0 items-center">
                  <Image
                    src="/images/logo.png"
                    alt="Scout"
                    width={44}
                    height={44}
                    className={cn("h-11 w-auto", isLight ? "invert" : "")}
                    priority
                  />
                </div>
                <div className="flex h-10 shrink-0 items-center">
                  <Image
                    src="/images/image.png"
                    alt="Universitas Negeri Gorontalo"
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                    priority
                  />
                </div>
                <span
                  className={cn(
                    "ml-1 text-xl font-semibold tracking-wide",
                    isLight ? "text-[#2F2A24]" : "text-white"
                  )}
                >
                  Scout
                </span>
              </>
            )}
          </div>

          {!isMobile && (
            <button
              type="button"
              onClick={toggleSidebar}
              className={cn(
                "absolute rounded-full p-1.5 backdrop-blur-sm transition-colors",
                collapsed ? "top-2 right-2" : "top-1/2 right-3 -translate-y-1/2",
                isLight
                  ? "text-[#7A6B5B] hover:bg-stone-200/80 hover:text-[#2F2A24]"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>

        <nav
          className={cn(
            "scrollbar-thin flex-1 space-y-2 overflow-y-auto p-4 transition-colors",
            isLight
              ? "scrollbar-thumb-stone-400 scrollbar-track-transparent"
              : "scrollbar-thumb-zinc-700 scrollbar-track-transparent",
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
                  isActive
                    ? isLight
                      ? "bg-[#F6E5D4]/60 font-medium text-[#D97742]"
                      : "bg-zinc-900 font-medium text-white"
                    : isLight
                      ? "text-[#5C5245] hover:bg-stone-200/60 hover:text-[#2F2A24]"
                      : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white",
                  collapsed ? "justify-center px-3 py-4" : "px-4 py-3"
                )}
              >
                {isActive && (
                  <div
                    className={cn(
                      "absolute left-0 h-full w-1",
                      isLight ? "bg-[#E36C3A]" : "bg-white",
                      collapsed && "right-0 left-auto"
                    )}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center transition-all duration-300",
                    isActive
                      ? isLight
                        ? "text-[#D97742]"
                        : "text-white"
                      : isLight
                        ? "text-[#5C5245] group-hover:text-[#2F2A24]"
                        : "text-zinc-400 group-hover:text-white"
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
                        ? isLight
                          ? "text-[#D97742]"
                          : "text-white"
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
                      "absolute left-full z-50 ml-2 rounded-lg border px-3 py-1.5 text-sm whitespace-nowrap opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100",
                      isLight
                        ? "border-stone-300/70 bg-white/95 text-[#2F2A24]"
                        : "border-zinc-800/50 bg-black text-white"
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
            "mt-auto border-t p-4",
            borderClasses,
            collapsed ? "flex justify-center" : ""
          )}
        >
          <div
            className={cn(
              "text-center text-xs",
              isLight ? "text-[#7A6B5B]" : "text-zinc-500",
              collapsed ? "hidden" : "block"
            )}
          >
            © 2025 Scout
            <p className="mt-1">Version 1.0.0</p>
          </div>
          {collapsed && (
            <div className={isLight ? "text-[#7A6B5B]" : "text-zinc-500"}>
              <Settings size={18} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

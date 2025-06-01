"use client";

import { Settings, ChevronLeft, ChevronRight, Menu, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Role } from "@/app/shared/const/role";
import { useIsMobile } from "@/client/hooks/useMobile";
import { adminPaths, routes } from "@/constants/auth-routes";
import { Route } from "@/constants/auth-routes.type";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
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

  if (status === "loading") {
    return (
      <aside className="flex h-screen w-72 flex-col border-r border-zinc-800/50 bg-black text-white shadow-[5px_0_30px_rgba(0,0,0,0.2)] backdrop-blur-lg transition-all duration-300 ease-in-out">
        <div className="flex items-center border-b border-zinc-800/50 p-6">
          <div className="text-2xl font-bold tracking-wide">
            <span className="text-white">C</span>
          </div>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {adminPaths.map((key) => (
            <div key={key} className="mb-2 h-10 w-full animate-pulse rounded-xl bg-zinc-800/60" />
          ))}
        </nav>
        <div className="mt-auto border-t border-zinc-800/50 p-4">
          <div className="h-6 w-24 animate-pulse rounded bg-zinc-800/60" />
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
          className="fixed top-4 left-4 z-50 rounded-full bg-black p-3 text-white shadow-lg transition-all duration-300 hover:shadow-white/10"
        >
          <Menu size={24} />
        </button>
      )}

      <aside
        className={cn(
          "flex h-screen flex-col border-r border-zinc-800/50 bg-black text-white backdrop-blur-lg transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-72",
          isMobile && "fixed z-40",
          isMobile && !mobileOpen && "-translate-x-full",
          "shadow-[5px_0_30px_rgba(0,0,0,0.2)]"
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-zinc-800/50 transition-all duration-300",
            collapsed ? "justify-center p-5" : "p-6"
          )}
        >
          {!collapsed ? (
            <div className="text-2xl font-bold tracking-wide">
              <LayoutDashboard className="mr-2 inline-block text-white" size={24} /> Chill
              <span className="text-white">LLMs</span>
            </div>
          ) : (
            <div className="text-2xl font-bold tracking-wide">
              <span className="text-white">C</span>
            </div>
          )}

          {!isMobile && (
            <button
              type="button"
              onClick={toggleSidebar}
              className={cn(
                "ml-auto rounded-full p-2 text-zinc-400 backdrop-blur-sm transition-colors hover:bg-zinc-800/50 hover:text-white",
                collapsed && "ml-0"
              )}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
        </div>

        <nav
          className={cn(
            "scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent flex-1 space-y-2 overflow-y-auto p-4",
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
                    ? "bg-zinc-900 font-medium text-white"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white",
                  collapsed ? "justify-center px-3 py-4" : "px-4 py-3"
                )}
              >
                {isActive && (
                  <div
                    className={cn(
                      "absolute left-0 h-full w-1 bg-white",
                      collapsed && "right-0 left-auto"
                    )}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center",
                    isActive ? "text-white" : "text-zinc-400 group-hover:text-white",
                    "transition-all duration-300"
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
                      isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                    )}
                  >
                    {item.name}
                  </span>
                )}

                {collapsed && (
                  <span className="absolute left-full z-50 ml-2 rounded-lg border border-zinc-800/50 bg-black px-3 py-1.5 text-sm whitespace-nowrap opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div
          className={cn(
            "mt-auto border-t border-zinc-800/50 p-4",
            collapsed ? "flex justify-center" : ""
          )}
        >
          <div className={cn("text-center text-xs text-zinc-500", collapsed ? "hidden" : "block")}>
            © 2025 Scout
            <p className="mt-1">Version 1.0.0</p>
          </div>
          {collapsed && (
            <div className="text-zinc-500">
              <Settings size={18} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

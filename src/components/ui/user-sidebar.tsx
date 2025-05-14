"use client";

import { Settings, ChevronLeft, ChevronRight, Menu, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const UserSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const navItems = [
    {
      name: "Profile",
      href: "/user/profile",
      icon: User,
    },
    {
      name: "My Chat",
      href: "/user/my-chat",
      icon: MessageCircle,
    },
  ];

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
          className="fixed top-20 left-4 z-50 rounded-full bg-black p-3 text-white shadow-lg transition-all duration-300 hover:shadow-white/10"
        >
          <Menu size={24} />
        </button>
      )}

      <aside
        className={cn(
          "fixed top-24 left-6 z-40 flex h-[calc(100vh-180px)] flex-col rounded-2xl border border-zinc-800/50 bg-black text-white backdrop-blur-lg transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-64",
          isMobile && !mobileOpen && "-translate-x-full",
          "shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
        )}
      >
        <div
          className={cn(
            "flex items-center rounded-t-2xl border-b border-zinc-800/50 transition-all duration-300",
            collapsed ? "justify-center p-5" : "p-6"
          )}
        >
          {!collapsed ? (
            <div className="text-2xl font-bold tracking-wide">Student Menu</div>
          ) : (
            <div className="text-2xl font-bold tracking-wide">
              <span className="text-white">U</span>
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
                    className={cn("absolute left-0 h-full w-1 bg-white", collapsed && "left-0")}
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
            "mt-auto rounded-b-2xl border-t border-zinc-800/50 p-4",
            collapsed ? "flex justify-center" : ""
          )}
        >
          <div className={cn("text-center text-xs text-zinc-500", collapsed ? "hidden" : "block")}>
            © 2025 ChillLLMs
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Mahasiswa", href: "/student", icon: User },
  { name: "Rekomendasi", href: "/recomendation", icon: BookOpen },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

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
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 bg-zinc-800 text-white p-3 rounded-md shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      <aside
        className={cn(
          "h-screen bg-zinc-900 text-white flex flex-col border-r border-zinc-800 transition-all duration-300 ease-in-out shadow-xl",
          collapsed ? "w-24" : "w-72",
          isMobile && "fixed z-40",
          isMobile && !mobileOpen && "-translate-x-full"
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-zinc-800 transition-all duration-300",
            collapsed ? "justify-center p-5" : "p-7"
          )}
        >
          {!collapsed ? (
            <div className="text-2xl font-bold tracking-wide">
              <LayoutDashboard className="inline-block mr-2" size={24} /> Chill
              <span className="text-white">LLMs</span>
            </div>
          ) : (
            <div className="text-2xl font-bold tracking-wide">
              <span className="text-primary">M</span>
            </div>
          )}

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={cn(
                "ml-auto text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800",
                collapsed && "ml-0"
              )}
            >
              {collapsed ? (
                <ChevronRight size={22} />
              ) : (
                <ChevronLeft size={22} />
              )}
            </button>
          )}
        </div>

        <nav
          className={cn(
            "flex-1 p-5 space-y-3 overflow-y-auto",
            collapsed && "p-3"
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
                  "flex items-center gap-4 rounded-md transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "text-white font-semibold bg-zinc-800/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/30",
                  collapsed ? "justify-center px-3 py-4" : "px-5 py-4"
                )}
              >
                {isActive && (
                  <div
                    className={cn(
                      "absolute h-full w-1.5 bg-white left-0 animate-pulse",
                      collapsed && "left-auto right-0"
                    )}
                  />
                )}

                {isActive && (
                  <div
                    className={cn(
                      "absolute inset-y-0 w-1.5 bg-white",
                      collapsed ? "right-0" : "left-0",
                      "before:absolute before:inset-0 before:bg-white before:animate-[pulse_2s_ease-in-out_infinite]"
                    )}
                  />
                )}

                <Icon
                  size={26}
                  className={cn(
                    "transition-all duration-300 relative z-10",
                    isActive
                      ? "text-white scale-110"
                      : "group-hover:scale-110 group-hover:text-white"
                  )}
                />

                {!collapsed && (
                  <span className="text-base font-medium relative z-10">
                    {item.name}
                  </span>
                )}

                {collapsed && (
                  <span className="absolute left-full ml-2 px-3 py-1.5 bg-zinc-800/90 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 backdrop-blur-sm shadow-lg border border-zinc-700/50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

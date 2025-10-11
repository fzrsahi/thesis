import { UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Home, Sparkles, Brain, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { ROLES } from "@/app/shared/const/role";
import { routes } from "@/constants/auth-routes";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    setScrolled(offset > 50);
  }, []);

  useEffect(() => {
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleAccountSettings = useCallback(() => {
    if (!session) return;

    const userRole = session.user.role;

    // Redirect based on user role
    if (userRole === ROLES.STUDENT) {
      window.location.href = "/student/profile";
    } else if (userRole === ROLES.ADMIN) {
      window.location.href = "/profile";
    } else {
      // For advisor or other roles, redirect to dashboard
      window.location.href = "/dashboard";
    }
  }, [session]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileMenuClick = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const renderUserMenu = () => {
    if (status === "loading") {
      return (
        <div className="flex items-center gap-2">
          <div className="h-10 w-20 animate-pulse rounded-lg bg-zinc-800" />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-800" />
        </div>
      );
    }

    if (!session) {
      return (
        <Link
          href="/auth/login"
          className="group relative overflow-hidden rounded-full border border-zinc-700/50 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 px-6 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-zinc-600/50 hover:from-zinc-700/50 hover:to-zinc-800/50 hover:shadow-lg hover:shadow-blue-500/25"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Login</span>
          </div>
        </Link>
      );
    }

    const userRole = session.user.role;
    const isAdmin = userRole === ROLES.ADMIN;
    const isAdvisor = userRole === ROLES.ADVISOR;
    const isStudent = userRole === ROLES.STUDENT;

    return (
      <div className="flex items-center gap-2">
        {(isAdmin || isAdvisor) && (
          <Link
            href="/dashboard"
            className={`group relative hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all md:flex ${
              pathname === "/dashboard"
                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white backdrop-blur-sm"
                : "text-white hover:bg-zinc-800/50 hover:text-zinc-300"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span>Dashboard</span>
            {pathname === "/dashboard" && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
            )}
          </Link>
        )}

        {isStudent && (
          <Link
            href="/my-recomendation"
            className={`group relative hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all md:flex ${
              routes.some(
                (route) => route.roles.includes(ROLES.STUDENT) && pathname === route.href
              ) || pathname === "/my-recomendation"
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white backdrop-blur-sm"
                : "text-white hover:bg-zinc-800/50 hover:text-zinc-300"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span>Rekomendasi</span>
            {(routes.some(
              (route) => route.roles.includes(ROLES.STUDENT) && pathname === route.href
            ) ||
              pathname === "/my-recomendation") && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
            )}
          </Link>
        )}

        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="group relative flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-gradient-to-r from-zinc-800/50 to-zinc-900/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all hover:border-zinc-600/50 hover:from-zinc-700/50 hover:to-zinc-800/50 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                  <UserCircleIcon className="h-4 w-4 text-white" />
                </div>
                {isAdvisor && <span>Profile</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="mt-3 w-64 rounded-2xl border border-zinc-700/50 bg-black/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="border-b border-zinc-700/50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                    <UserCircleIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{session?.user?.name || "User"}</p>
                    <p className="text-xs text-zinc-400">
                      {session?.user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <DropdownMenuItem
                  onClick={handleAccountSettings}
                  className="group cursor-pointer rounded-lg px-3 py-2 text-white transition-all hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span>ACCOUNT SETTINGS</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-700/50" />
                <DropdownMenuItem
                  className="group cursor-pointer rounded-lg px-3 py-2 text-red-400 transition-all hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10"
                  onClick={() => signOut()}
                >
                  <div className="flex items-center space-x-2">
                    <span>LOG OUT</span>
                    <span className="ml-auto text-xs">{"->"}</span>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  const renderMobileUserMenu = () => {
    if (!session) return null;

    const userRole = session.user.role;
    const isAdmin = userRole === ROLES.ADMIN;
    const isAdvisor = userRole === ROLES.ADVISOR;
    const isStudent = userRole === ROLES.STUDENT;

    return (
      <div className="mt-6 border-t border-zinc-800 pt-6">
        {(isAdmin || isAdvisor) && (
          <Link
            href="/dashboard"
            className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
              pathname === "/dashboard"
                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white backdrop-blur-sm"
                : "text-white hover:bg-zinc-800/50"
            }`}
            onClick={handleMobileMenuClick}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span>Dashboard</span>
            {pathname === "/dashboard" && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
            )}
          </Link>
        )}

        {isStudent && (
          <Link
            href="/my-recomendation"
            className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
              pathname === "/my-recomendation"
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white backdrop-blur-sm"
                : "text-white hover:bg-zinc-800/50"
            }`}
            onClick={handleMobileMenuClick}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span>Rekomendasi</span>
            {pathname === "/my-recomendation" && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
            )}
          </Link>
        )}

        <button
          type="button"
          onClick={() => {
            handleAccountSettings();
            handleMobileMenuClick();
          }}
          className="group relative mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-white transition-all hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span>Account Settings</span>
        </button>
        <button
          type="button"
          onClick={() => signOut()}
          className="group relative mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition-all hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-600 shadow-lg">
            <span className="text-xs font-bold">!</span>
          </div>
          <span>Log Out</span>
          <span className="ml-auto text-xs">{"->"}</span>
        </button>
      </div>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-4 right-0 left-0 z-50 mx-auto w-[90%] rounded-full transition-all duration-300 will-change-transform ${
          scrolled
            ? "border border-zinc-700/50 bg-black/90 px-3 py-2 shadow-2xl shadow-blue-500/10 backdrop-blur-xl sm:px-6"
            : "bg-gradient-to-r from-black/80 to-zinc-900/80 px-3 py-3 backdrop-blur-sm sm:px-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/logo.png"
                    alt="Scout"
                    width={50}
                    height={50}
                    className="mt-2"
                  />
                  <Image
                    src="/images/image.png"
                    alt="Universitas Negeri Gorontalo"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
            </Link>
          </div>

          <ul className="hidden gap-8 text-sm font-medium text-white lg:flex">
            <li>
              <a
                href="#features"
                className="group relative flex items-center gap-2 rounded-lg px-4 py-2 transition-all hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:text-zinc-300"
              >
                <Zap className="h-4 w-4 text-purple-400" />
                <span>Demo AI</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="group relative flex items-center gap-2 rounded-lg px-4 py-2 transition-all hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-red-500/10 hover:text-zinc-300"
              >
                <Sparkles className="h-4 w-4 text-pink-400" />
                <span>Platform</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/5 to-red-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href="#technology"
                className="group relative flex items-center gap-2 rounded-lg px-4 py-2 transition-all hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 hover:text-zinc-300"
              >
                <Brain className="h-4 w-4 text-cyan-400" />
                <span>AI Canggih</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            {renderUserMenu()}

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="group relative ml-2 rounded-full p-2 text-white transition-all hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 lg:hidden"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 mt-20 bg-black/95 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col p-6">
          <ul className="flex flex-col gap-2 text-base font-medium text-white">
            <li>
              <a
                href="#features"
                className="group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10"
                onClick={handleMobileMenuClick}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span>Demo AI</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-red-500/10"
                onClick={handleMobileMenuClick}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-600 shadow-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span>Platform</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/5 to-red-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
            <li>
              <a
                href="#technology"
                className="group relative flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10"
                onClick={handleMobileMenuClick}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span>AI Canggih</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
          </ul>

          {renderMobileUserMenu()}
        </div>
      </div>
    </>
  );
};

export default Navbar;

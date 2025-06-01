import {
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Home } from "lucide-react";
import { Orbitron } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { ROLES } from "@/app/shared/const/role";
import { routes } from "@/constants/auth-routes";

const orbitron = Orbitron({ subsets: ["latin"] });

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
    window.location.href = "/profile";
  }, []);

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
          className="rounded-full border border-zinc-500/50 bg-gradient-to-r from-zinc-700 to-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-zinc-500/30 sm:px-6"
        >
          Login
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
            className={`hidden items-center gap-2 px-4 py-2 text-sm font-medium transition-all md:flex ${
              pathname === "/dashboard"
                ? "rounded-lg bg-zinc-800/50 text-zinc-200"
                : "text-white hover:text-zinc-300"
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
            {pathname === "/dashboard" && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-zinc-400 to-zinc-600" />
            )}
          </Link>
        )}

        {isStudent && (
          <Link
            href="/student/profile"
            className={`relative hidden items-center gap-2 px-4 py-2 text-sm font-medium transition-all md:flex ${
              routes.some(
                (route) => route.roles.includes(ROLES.STUDENT) && pathname === route.href
              ) || pathname === "/dashboard"
                ? "rounded-lg bg-zinc-800/50 text-zinc-200"
                : "text-white hover:text-zinc-300"
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
            {(routes.some(
              (route) => route.roles.includes(ROLES.STUDENT) && pathname === route.href
            ) ||
              pathname === "/dashboard") && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-zinc-400 to-zinc-600" />
            )}
          </Link>
        )}

        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:text-zinc-300"
              >
                <UserCircleIcon className="h-5 w-5" />
                {isAdvisor && <span>Profile</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="mt-3 w-64 rounded-2xl border border-zinc-700 bg-black/90 shadow-lg"
            >
              <div className="border-b border-zinc-700 p-3">
                <p className="font-bold text-white">{session?.user?.name || "FAZRUL SAMI"}</p>
                <p className="text-xs text-zinc-400">
                  {session?.user?.email || "fazrul_s1sisfo@mahasiswa.ung.ac.id"}
                </p>
              </div>
              <div className="p-2">
                <DropdownMenuItem
                  onClick={handleAccountSettings}
                  className="cursor-pointer px-3 py-2 text-white hover:bg-zinc-800"
                >
                  <span>ACCOUNT SETTINGS</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem
                  className="cursor-pointer px-3 py-2 text-white hover:bg-zinc-800"
                  onClick={() => signOut()}
                >
                  <span>LOG OUT</span>
                  <span className="ml-auto text-xs">{"->"}</span>
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
    const isAdvisor = userRole === "advisor";
    const isStudent = userRole === ROLES.STUDENT;

    return (
      <div className="mt-6 border-t border-zinc-800 pt-6">
        {(isAdmin || isAdvisor) && (
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 rounded-lg px-4 py-3 transition-all ${
              pathname === "/dashboard"
                ? "bg-zinc-800/70 text-zinc-200"
                : "text-white hover:bg-zinc-800/50"
            }`}
            onClick={handleMobileMenuClick}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
        )}

        {isStudent && (
          <Link
            href="/my-recomendation"
            className={`flex items-center gap-2 rounded-lg px-4 py-3 transition-all ${
              pathname === "/my-recomendation"
                ? "bg-zinc-800/70 text-zinc-200"
                : "text-white hover:bg-zinc-800/50"
            }`}
            onClick={handleMobileMenuClick}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            <span>Recomendation</span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => {
            handleAccountSettings();
            handleMobileMenuClick();
          }}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-4 py-3 text-white transition-all hover:bg-zinc-800/50"
        >
          <UserCircleIcon className="h-5 w-5" />
          <span>Account Settings</span>
        </button>
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-4 py-3 text-red-500 transition-all hover:bg-zinc-800/50"
        >
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
            ? "border border-zinc-700/50 bg-black/80 px-3 py-2 shadow-lg shadow-zinc-500/10 backdrop-blur-md sm:px-6"
            : "bg-gradient-to-r from-black/70 to-zinc-900/70 px-3 py-3 backdrop-blur-sm sm:px-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="flex items-center gap-3">
                <Image src="/images/logo.png" alt="Scout" width={40} height={40} />
                <span
                  className={`${orbitron.className} animate-text bg-gradient-to-r from-zinc-400 via-white to-zinc-500 bg-clip-text text-lg font-bold text-transparent`}
                >
                  Scout
                </span>
              </div>
            </Link>
          </div>

          <ul className="hidden gap-10 text-sm font-medium text-white lg:flex">
            <li>
              <a
                href="#features"
                className="group relative flex items-center gap-2 px-3 py-2 transition-all hover:text-zinc-300"
              >
                Features
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-zinc-400 to-zinc-600 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="group relative flex items-center gap-2 px-3 py-2 transition-all hover:text-zinc-300"
              >
                About
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-zinc-400 to-zinc-600 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="group relative flex items-center gap-2 px-3 py-2 transition-all hover:text-zinc-300"
              >
                Pricing
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-zinc-400 to-zinc-600 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="group relative flex items-center gap-2 px-3 py-2 transition-all hover:text-zinc-300"
              >
                FAQ
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-zinc-400 to-zinc-600 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            {renderUserMenu()}

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="ml-2 rounded-full p-2 text-white hover:bg-zinc-800/50 lg:hidden"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 mt-20 bg-black/95 backdrop-blur-md transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col p-6">
          <ul className="flex flex-col gap-4 text-base font-medium text-white">
            <li>
              <a
                href="#features"
                className="block rounded-lg px-4 py-3 transition-all hover:bg-zinc-800/50"
                onClick={handleMobileMenuClick}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="block rounded-lg px-4 py-3 transition-all hover:bg-zinc-800/50"
                onClick={handleMobileMenuClick}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="block rounded-lg px-4 py-3 transition-all hover:bg-zinc-800/50"
                onClick={handleMobileMenuClick}
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="block rounded-lg px-4 py-3 transition-all hover:bg-zinc-800/50"
                onClick={handleMobileMenuClick}
              >
                FAQ
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

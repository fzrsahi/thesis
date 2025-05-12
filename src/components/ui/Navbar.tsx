import { UserCircleIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fix: Arrow function should not return assignment.
  const handleAccountSettings = () => {
    window.location.href = "/profile";
  };

  if (status === "loading") {
    return (
      <nav className="fixed top-4 left-0 z-50 mx-auto w-[95%] rounded-full border-b border-zinc-800/50 bg-black/60 px-8 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-600 to-zinc-800 text-xl font-bold text-white shadow-lg shadow-zinc-500/20">
              C
            </div>
            <span className="text-xl font-bold tracking-wider text-white">Chill LLMs</span>
          </div>
          <div className="h-8 w-24 animate-pulse rounded-full bg-zinc-800" />
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-4 right-0 left-0 z-50 mx-auto w-[95%] rounded-full transition-all duration-300 ${
        scrolled
          ? "border border-zinc-700/50 bg-black/80 px-8 py-3 shadow-lg shadow-zinc-500/10 backdrop-blur-md"
          : "bg-gradient-to-r from-black/70 to-zinc-900/70 px-8 py-4 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-600 to-zinc-800 text-xl font-bold text-white transition-all duration-300 ${
              scrolled ? "shadow-lg shadow-zinc-500/30" : "shadow-md shadow-zinc-500/20"
            }`}
          >
            C
          </div>
          <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-xl font-bold tracking-wider text-transparent">
            Chill LLMs
          </span>
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
        {session ? (
          <div className="flex items-center gap-4">
            {session.user.role === "admin" && (
              <>
                <Link
                  href="/chat"
                  className="hidden items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all hover:text-zinc-300 md:flex"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  <span>Chat</span>
                </Link>
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:text-zinc-300"
                      >
                        <UserCircleIcon className="h-5 w-5" />
                        <span>Profile</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="mt-3 w-64 border border-zinc-700 bg-black/90 shadow-lg"
                    >
                      <div className="border-b border-zinc-700 p-3">
                        <p className="font-bold text-white">
                          {session?.user?.name || "FAZRUL SAMI"}
                        </p>
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
              </>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-full border border-zinc-500/50 bg-gradient-to-r from-zinc-700 to-zinc-900 px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-zinc-500/30"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

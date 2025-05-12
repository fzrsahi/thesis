import { UserCircleIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Navbar = () => (
  <nav className="fixed top-0 left-0 z-50 w-full border-b border-zinc-800 bg-black/80 px-8 py-4 backdrop-blur-md">
    <div className="mx-auto flex max-w-7xl items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 text-xl font-bold text-white shadow-lg shadow-zinc-800/30">
          C
        </div>
        <span className="text-xl font-bold tracking-wider text-white">Chill LLMs</span>
      </div>

      {/* Center Menu - Landing Page Links */}
      <ul className="hidden gap-10 text-sm font-medium text-white lg:flex">
        <li>
          <a
            href="#features"
            className="group relative flex items-center gap-2 px-3 py-2 transition-all hover:text-zinc-300"
          >
            Features
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
          </a>
        </li>
        <li>
          <a
            href="#about"
            className="group relative flex items-center gap-2 px-3 py-2 transition-all hover:text-zinc-300"
          >
            About
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
          </a>
        </li>
        <li>
          <a
            href="#pricing"
            className="group relative flex items-center gap-2 px-3 py-2 transition-all hover:text-zinc-300"
          >
            Pricing
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
          </a>
        </li>
        <li>
          <a
            href="#faq"
            className="group relative flex items-center gap-2 px-3 py-2 transition-all hover:text-zinc-300"
          >
            FAQ
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
          </a>
        </li>
      </ul>

      {/* Right Menu - App Navigation & Auth */}
      <div className="flex items-center gap-4">
        <Link
          href="/chat"
          className="hidden items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all hover:text-zinc-300 md:flex"
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
          <span>Chat</span>
        </Link>

        <Link
          href="/profile"
          className="hidden items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all hover:text-zinc-300 md:flex"
        >
          <UserCircleIcon className="h-5 w-5" />
          <span>Profile</span>
        </Link>

        <Link
          href="/auth/login"
          className="rounded-full border border-zinc-700 bg-zinc-900 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-800/30"
        >
          Login
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;

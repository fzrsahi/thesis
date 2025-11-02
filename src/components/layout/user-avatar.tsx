"use client";

import { LogOut, User, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserAvatarProps {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  isLight?: boolean;
  setIsLight?: (value: boolean) => void;
}

export const UserAvatar = ({ user, isLight = false, setIsLight }: UserAvatarProps) => {
  const router = useRouter();

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const handleThemeToggle = () => {
    if (setIsLight) {
      const newTheme = !isLight;
      setIsLight(newTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem("scout-theme", newTheme ? "light" : "dark");
        window.dispatchEvent(
          new CustomEvent("scout-theme-change", { detail: { theme: newTheme ? "light" : "dark" } })
        );
      }
    }
  };

  return (
    <div className="fixed top-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="hover:ring-primary h-8 w-8 cursor-pointer hover:ring-2">
            <AvatarImage src={user?.image} alt={user?.name || "User"} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">{user?.name || "User"}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleThemeToggle}>
            {isLight ? (
              <>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light Mode</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

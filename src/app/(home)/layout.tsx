"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

import QueryProvider from "@/components/providers/QueryProvider";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "@/components/ui/sonner";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <QueryProvider>
      <Navbar />
      <div className="relative min-h-screen bg-black text-white">{children}</div>
      <Toaster />
    </QueryProvider>
  </SessionProvider>
);

export default Layout;

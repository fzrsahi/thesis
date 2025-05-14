"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

import Navbar from "@/components/ui/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <Navbar />
    <div className="relative min-h-screen bg-black text-white">{children}</div>
  </SessionProvider>
);

export default Layout;

"use client";

import { usePathname } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";

import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { UserAvatar } from "@/components/layout/user-avatar";
import QueryProvider from "@/components/providers/QueryProvider";
import { DashboardToaster } from "@/components/ui/dashboard-toaster";
import { Sidebar } from "@/components/ui/sidebar";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbItems(pathname);
  const isHome = pathname === "/dashboard";
  const { data: session } = useSession();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-gray-300 text-zinc-900 overflow-y-auto">
        <div className="p-6">
          <div className="mb-4">
            <BreadcrumbNav items={breadcrumbItems} isHome={isHome} />
          </div>
          {children}
          <UserAvatar
            user={{
              name: session?.user?.name,
              email: session?.user?.email,
              image: "https://github.com/shadcn.png",
            }}
          />
        </div>
      </main>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <QueryProvider>
      <DashboardContent>{children}</DashboardContent>
      <DashboardToaster />
    </QueryProvider>
  </SessionProvider>
);

export default DashboardLayout;

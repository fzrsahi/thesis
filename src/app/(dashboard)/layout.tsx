"use client";

import { usePathname } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";

import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { UserAvatar } from "@/components/layout/user-avatar";
import { Sidebar } from "@/components/ui/sidebar";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbItems(pathname);
  const isHome = pathname === "/dashboard";
  const { data: session } = useSession();

  return (
    <div className="flex">
      <Sidebar />
      <main className="min-h-screen flex-1 bg-gray-100 p-6">
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
      </main>
    </div>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <DashboardContent>{children}</DashboardContent>
  </SessionProvider>
);

export default DashboardLayout;

"use client";

import { usePathname } from "next/navigation";

import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav";
import { UserAvatar } from "@/components/layout/user-avatar";
import { Sidebar } from "@/components/ui/sidebar";
import { getBreadcrumbItems } from "@/lib/breadcrumb";

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  image: "https://github.com/shadcn.png",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const breadcrumbItems = getBreadcrumbItems(pathname);
  const isHome = pathname === "/dashboard";

  return (
    <div className="flex">
      <Sidebar />
      <main className="min-h-screen flex-1 bg-gray-100 p-6">
        <div className="mb-4">
          <BreadcrumbNav items={breadcrumbItems} isHome={isHome} />
        </div>
        {children}
        <UserAvatar user={mockUser} />
      </main>
    </div>
  );
};

export default DashboardLayout;

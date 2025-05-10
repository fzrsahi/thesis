"use client";

import Sidebar from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, ChevronRight } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const getBreadcrumbItems = (path: string) => {
    const paths = path.split("/").filter(Boolean);
    const items = paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      let label;
      switch (path) {
        case "dashboard":
          label = "Dasbor";
          break;
        case "student":
          label = "Mahasiswa";
          break;
        case "recomendation":
          label = "Rekomendasi";
          break;
        case "settings":
          label = "Pengaturan";
          break;
        default:
          label = path
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
      }

      return {
        href,
        label,
        isLast: index === paths.length - 1,
      };
    });

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems(pathname);
  const isHome = pathname === "/dashboard";

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <div className="mb-4">
          {!isHome && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      <Home className="h-4 w-4" />
                      <span>Dasbor</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbItems.map((item) => (
                  <React.Fragment key={item.href}>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      {item.isLast ? (
                        <BreadcrumbPage className="font-medium">
                          {item.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href} className="hover:text-primary">
                            {item.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        {children}
      </main>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AdminLayout;

import { Home, User, BookOpen, Settings } from "lucide-react";

export const routes = [
  { name: "Dashboard", href: "/dashboard", roles: ["advisor", "admin"], icon: Home },
  { name: "Mahasiswa", href: "/student", roles: ["advisor", "admin"], icon: User },
  { name: "Rekomendasi", href: "/recomendation", roles: ["advisor", "admin"], icon: BookOpen },
  { name: "Pengaturan", href: "/settings", roles: ["admin"], icon: Settings },
];

export const adminPaths = routes.filter((r) => r.roles.includes("admin")).map((r) => r.href);
export const advisorPaths = routes.filter((r) => r.roles.includes("advisor")).map((r) => r.href);
export const protectedPaths = routes.map((r) => r.href);

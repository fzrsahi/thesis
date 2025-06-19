import { Home, User, BookOpen, Settings, MessageCircle, Brain } from "lucide-react";

import { ROLES } from "@/app/shared/const/role";

import { Route } from "./auth-routes.type";

export const routes: Route[] = [
  { name: "Dashboard", href: "/dashboard", roles: [ROLES.ADVISOR, ROLES.ADMIN], icon: Home },
  {
    name: "Kompetisi",
    href: "/competition",
    roles: [ROLES.ADVISOR, ROLES.ADMIN],
    icon: BookOpen,
  },
  { name: "Mahasiswa", href: "/student", roles: [ROLES.ADVISOR, ROLES.ADMIN], icon: User },
  {
    name: "Rekomendasi",
    href: "/recomendation",
    roles: [ROLES.ADVISOR, ROLES.ADMIN],
    icon: Brain,
  },
  { name: "Pengaturan", href: "/settings", roles: [ROLES.ADMIN], icon: Settings },
  { name: "Chat", href: "/chat", roles: [ROLES.ADVISOR, ROLES.ADMIN], icon: MessageCircle },
  { name: "Profil", href: "/student/profile", roles: [ROLES.STUDENT], icon: User },
  { name: "Rekomendasi", href: "/my-recomendation", roles: [ROLES.STUDENT], icon: BookOpen },
  { name: "Obrolan", href: "/my-chat", roles: [ROLES.STUDENT], icon: MessageCircle },
];

export const adminPaths = routes
  .filter((r: Route) => r.roles.includes(ROLES.ADMIN))
  .map((r) => r.href);
export const advisorPaths = routes
  .filter((r: Route) => r.roles.includes(ROLES.ADVISOR))
  .map((r) => r.href);
export const studentPaths = routes
  .filter((r: Route) => r.roles.includes(ROLES.STUDENT))
  .map((r) => r.href);
export const protectedPaths = routes.map((r: Route) => r.href);

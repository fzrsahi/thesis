import { Role } from "@/app/shared/const/role";

export type Route = {
  name: string;
  href: string;
  roles: Role[];
  icon: React.ElementType;
};

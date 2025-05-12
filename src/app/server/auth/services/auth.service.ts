import { Role, ROLES } from "@/app/shared/const/role";
import { LoginPayload } from "@/app/shared/validations/schema/loginSchema";

import { findAdminByUserId } from "../../admin/admin.repository";
import { findAdvisorByUserId } from "../../advisor/advisor.repository";
import { findStudentByUserId } from "../../student/student.repository";
import { findUserByEmail } from "../../user/user.repository";
import { compareHash } from "../../utils/bcrypt/bcrypt";

export const validateCredentials = async (credentials: LoginPayload) => {
  const user = await findUserByEmail(credentials.email, {
    id: true,
    email: true,
    password: true,
    name: true,
  });

  if (!user) {
    throw new Error("Email atau password salah");
  }

  const isPasswordValid = await compareHash(credentials.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Email atau password salah");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};

export const getUserRole = async (userId: number): Promise<Role | null> => {
  const [student, advisor, admin] = await Promise.all([
    findStudentByUserId(userId),
    findAdvisorByUserId(userId),
    findAdminByUserId(userId),
  ]);

  if (student) {
    return ROLES.STUDENT;
  }

  if (advisor) {
    return ROLES.ADVISOR;
  }

  if (admin) {
    return ROLES.ADMIN;
  }

  return null;
};

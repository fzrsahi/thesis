import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { AUTH_ERRORS_LOG, AUTH_ERRORS_RESPONSE } from "@/app/server/auth/auth.error";
import { authOptions } from "@/app/server/auth/authOptions";
import { ADVISOR_TYPES, ROLES, Role } from "@/app/shared/const/role";

import { getUserRole } from "./services/auth.service";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  advisorType?: string | null;
  studyProgram?: { id: number; name: string } | null;
}

interface AuthSession {
  user: SessionUser;
  getRoles: () => Role[];
  getRoleIds: () => { [key: string]: string };
  isAdmin: () => boolean;
  isAdvisor: () => boolean;
  isProgramHead: () => boolean;
  isStudyProgramHead: () => boolean;
  getEffectiveStudyProgramId: (queryStudyProgramId?: number) => number | undefined;
}

type AuthenticatedRequest = (req: NextRequest, session: AuthSession) => Promise<NextResponse>;

const createAuthSession = (user: SessionUser): AuthSession => ({
  user,
  getRoles: () => [user.role as Role],
  getRoleIds: () => ({ userId: user.id }),
  isAdmin: () => user.role === ROLES.ADMIN,
  isAdvisor: () => user.role === ROLES.ADVISOR,
  isProgramHead: () => user.advisorType === ADVISOR_TYPES.HEAD_OF_DEPARTMENT,
  isStudyProgramHead: () => user.advisorType === ADVISOR_TYPES.HEAD_OF_STUDY_PROGRAM,
  getEffectiveStudyProgramId: (queryStudyProgramId?: number) => {
    if (user.role === ROLES.ADVISOR) {
      if (user.advisorType === ADVISOR_TYPES.HEAD_OF_DEPARTMENT) {
        // Department head can see all; honor explicit filter if provided
        return queryStudyProgramId;
      }
      if (user.advisorType === ADVISOR_TYPES.HEAD_OF_STUDY_PROGRAM) {
        // Program head restricted to own program
        return user.studyProgram?.id ?? undefined;
      }
    }
    // Admin or others: use explicit filter if provided, otherwise undefined (no restriction)
    return queryStudyProgramId;
  },
});

export const withAuthentication = (handler: AuthenticatedRequest) => async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(AUTH_ERRORS_RESPONSE.MISSING_TOKEN, {
        status: HttpStatusCode.Unauthorized,
      });
    }

    const currentRole = await getUserRole(Number(session.user.id));

    if (!currentRole) {
      return NextResponse.json(AUTH_ERRORS_RESPONSE.ACCOUNT_DELETED, {
        status: HttpStatusCode.Unauthorized,
      });
    }

    if (currentRole !== session.user.role) {
      return NextResponse.json(AUTH_ERRORS_RESPONSE.ROLE_CHANGED, {
        status: HttpStatusCode.Unauthorized,
      });
    }

    const authSession = createAuthSession(session.user as SessionUser);
    return handler(req, authSession);
  } catch (error) {
    if (error instanceof Error) {
      console.error(AUTH_ERRORS_LOG.AUTHENTICATION_ERROR, error);
      return NextResponse.json(AUTH_ERRORS_RESPONSE.AUTHENTICATION_FAILED, {
        status: HttpStatusCode.InternalServerError,
      });
    }
    throw error;
  }
};

export const withAuthorization =
  (requiredRoles: Role[]) =>
  (handler: AuthenticatedRequest) =>
  async (req: NextRequest, session: AuthSession) => {
    const userRoles = session.getRoles();

    const hasRequiredRoles = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRoles) {
      return NextResponse.json(AUTH_ERRORS_RESPONSE.UNAUTHORIZED_ACCESS, {
        status: HttpStatusCode.Forbidden,
      });
    }

    return handler(req, session);
  };

export const withAuth =
  (handler: AuthenticatedRequest, requiredRoles: Role[]) => async (req: NextRequest) =>
    withAuthentication(withAuthorization(requiredRoles)(handler))(req);

import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AUTH_ERRORS_LOG, AUTH_ERRORS_RESPONSE } from "@/app/server/auth/auth.error";
import { Role } from "@/app/shared/const/role";

import { getUserRole } from "./services/auth.service";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthSession {
  user: SessionUser;
  getRoles: () => Role[];
  getRoleIds: () => { [key: string]: string };
}

type AuthenticatedRequest = (req: NextRequest, session: AuthSession) => Promise<NextResponse>;

const createAuthSession = (user: SessionUser): AuthSession => ({
  user,
  getRoles: () => [user.role as Role],
  getRoleIds: () => ({ userId: user.id }),
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

    const authSession = createAuthSession(session.user);
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

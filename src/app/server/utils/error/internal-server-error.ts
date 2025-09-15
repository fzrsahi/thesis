import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

import { customErrorToResponse, isCustomError } from "./custom-error";

type TInternalServerError = {
  errorLogMessage: string;
  errorResponse: { code: string; message: string };
};

export const internalServerError = (
  error: unknown,
  { errorLogMessage, errorResponse }: TInternalServerError
) => {
  if (isCustomError(error)) {
    if (error.status === HttpStatusCode.InternalServerError) {
      console.error(errorLogMessage, error);
    }
    return NextResponse.json(customErrorToResponse(error), {
      status: error.status,
    });
  }

  console.error(errorLogMessage, error);
  return NextResponse.json(errorResponse, {
    status: HttpStatusCode.InternalServerError,
  });
};

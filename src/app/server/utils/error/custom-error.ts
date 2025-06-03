export interface CustomErrorData {
  code: string;
  message: string;
  status: number;
}

export interface CustomError extends CustomErrorData {
  name: "CustomError";
}

export const customError = (code: string, message: string, status: number): CustomError => ({
  name: "CustomError",
  code,
  message,
  status,
});

export const customErrorToResponse = (error: CustomErrorData) => ({
  code: error.code,
  message: error.message,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCustomError = (error: any): error is CustomError =>
  error &&
  error.name === "CustomError" &&
  typeof error.code === "string" &&
  typeof error.message === "string" &&
  typeof error.status === "number";

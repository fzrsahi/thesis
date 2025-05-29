/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ZodType } from "zod";

export type InferZodMap<T> = {
  [K in keyof T]?: ZodType<T[K], any, any>;
};

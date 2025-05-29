import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios";

import { paths } from "@/app/shared/types/api";

type ApiPaths = paths;

type Method = "get" | "post" | "put" | "delete" | "patch";

type RequestParams<T extends keyof ApiPaths, M extends Method> = ApiPaths[T][M] extends {
  parameters: { path: infer P; query: infer Q };
}
  ? { path?: P; query?: Q }
  : ApiPaths[T][M] extends { parameters: { path: infer P } }
    ? { path: P }
    : ApiPaths[T][M] extends { parameters: { query: infer Q } }
      ? { query?: Q }
      : ApiPaths[T][M] extends { parameters: never }
        ? { query?: Record<string, unknown> }
        : { query?: Record<string, unknown> };

type RequestBody<T extends keyof ApiPaths, M extends Method> = ApiPaths[T][M] extends {
  requestBody: {
    content:
      | {
          "application/json": infer R;
        }
      | {
          "multipart/form-data": infer R;
        };
  };
}
  ? R
  : undefined;

type ResponseData<T extends keyof ApiPaths, M extends Method> = ApiPaths[T][M] extends {
  responses: { 200: { content: { "application/json": infer R } } };
}
  ? R
  : never;

class ApiClient {
  private readonly client: AxiosInstance;

  constructor(private getToken?: () => string | undefined) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL!;
    const apiUrl = `${baseURL}/api`;
    this.client = axios.create({
      baseURL: apiUrl,
    });

    this.client.interceptors.request.use((config) => {
      const token = this.getToken?.();
      const newConfig = { ...config };
      if (token) {
        newConfig.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
      }

      if (config.data instanceof FormData) {
        newConfig.headers = {
          ...newConfig.headers,
          "Content-Type": "multipart/form-data",
        } as AxiosRequestHeaders;
      } else {
        newConfig.headers = {
          ...newConfig.headers,
          "Content-Type": "application/json",
        } as AxiosRequestHeaders;
      }

      return newConfig;
    });
  }

  async request<T extends keyof ApiPaths, M extends Method>(
    method: M,
    path: T,
    params?: RequestParams<T, M> | undefined,
    body?: RequestBody<T, M> | FormData,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T, M>> {
    const url =
      params && "path" in params
        ? this.resolvePath(path, params.path as Record<string, string | number>)
        : path;

    const queryParams = params && "query" in params ? params.query : undefined;

    const response = await this.client.request({
      url,
      method,
      params: queryParams,
      data: body,
      ...config,
    });

    return response.data;
  }

  // eslint-disable-next-line class-methods-use-this
  private resolvePath(path: string, pathParams?: Record<string, string | number>): string {
    if (!pathParams) return path;
    return Object.keys(pathParams).reduce((resolvedPath, key) => {
      const value = pathParams[key];
      return resolvedPath.replace(`{${key}}`, encodeURIComponent(String(value)));
    }, path);
  }
}

export default new ApiClient();

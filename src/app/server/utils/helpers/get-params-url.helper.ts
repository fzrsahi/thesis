export type QueryParamSpec = Record<string, "string" | "number">;

export const getQueryParams = <TSpec extends QueryParamSpec>(
  url: URL,
  spec: TSpec
): { [K in keyof TSpec]?: TSpec[K] extends "number" ? number : string } => {
  const result: Record<string, unknown> = {};

  Object.entries(spec).forEach(([key, type]) => {
    const raw = url.searchParams.get(key);
    if (raw == null || raw === "") return;

    if (type === "number") {
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) {
        result[key] = parsed;
      }
    } else {
      result[key] = raw;
    }
  });

  return result as unknown as { [K in keyof TSpec]?: TSpec[K] extends "number" ? number : string };
};

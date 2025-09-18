"use client";

import dynamic from "next/dynamic";
import ErrorPage from "next/error";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

const isDev =
  process.env.NEXT_PUBLIC_ENV_NAME === "development" ||
  process.env.NEXT_PUBLIC_ENV_NAME === "local";

const SwaggerUi = () => {
  if (!isDev) return <ErrorPage statusCode={404} />;
  const apiUrl = "/api-docs/api";
  return <SwaggerUI url={apiUrl} />;
};

export default SwaggerUi;

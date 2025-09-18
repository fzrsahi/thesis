import pino, { Logger, LoggerOptions, TransportMultiOptions } from "pino";

const level = process.env.LOG_LEVEL || "info";
const isLocal = process.env.NEXT_PUBLIC_ENV_NAME === "local";

let rootLogger: Logger;

if (isLocal) {
  const transport: TransportMultiOptions = {
    targets: [{ target: "pino-pretty" }],
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss.l",
      ignore: "pid,hostname",
    },
  };

  rootLogger = pino(
    {
      level,
      base: undefined,
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    pino.transport ? pino.transport(transport) : undefined
  );
} else {
  const options: LoggerOptions = {
    level,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
  };
  rootLogger = pino(options);
}

export type LoggerBindings = {
  module?: string;
  method?: string;
  [key: string]: unknown;
};

export const getLogger = (bindings?: LoggerBindings): Logger =>
  bindings ? rootLogger.child(bindings) : rootLogger;

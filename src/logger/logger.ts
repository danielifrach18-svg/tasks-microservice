import { format } from "date-fns";
import winston from "winston";
import { cfg } from "../config/config";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => format(new Date(), cfg.TIMESTAMP_FORMAT),
    }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

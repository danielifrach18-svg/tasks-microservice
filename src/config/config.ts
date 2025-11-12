import "dotenv/config";
import * as os from "os";
import path from "path";

export const cfg = {
  SERVER_PORT: Number(process.env.SERVER_PORT ?? 3000),
  TASK_SIMULATED_DURATION: Number(process.env.TASK_SIMULATED_DURATION ?? 500),
  TASK_SIMULATED_ERROR_PERCENTAGE: Number(
    process.env.TASK_SIMULATED_ERROR_PERCENTAGE ?? 20
  ),
  TASK_ERROR_RETRY_DELAY: Number(process.env.TASK_ERROR_RETRY_DELAY ?? 1000),
  WORKER_TIMEOUT: Number(process.env.WORKER_TIMEOUT ?? 5000),
  TASK_MAX_RETRIES: Number(process.env.TASK_MAX_RETRIES ?? 3),
  MAX_WORKERS: os.cpus().length,
  TIMESTAMP_FORMAT: "yyyy-MM-dd HH:mm:ss.SSS",
  LOG_FILE_PATH: path.join(process.cwd(), "logs", "shared-logs.txt"),
};

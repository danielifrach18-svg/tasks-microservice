import * as fs from "fs";
import { format } from "date-fns";
import * as path from "path";
import { Mutex } from "async-mutex";
import { cfg } from "../config/config";

const LOG_FILE_PATH = cfg.LOG_FILE_PATH;
const mutex = new Mutex();

if (!fs.existsSync(path.dirname(LOG_FILE_PATH))) {
  fs.mkdirSync(path.dirname(LOG_FILE_PATH));
}

export class LogManager {
  public static async appendLog(
    workerId: string,
    taskId: string,
    message: string
  ): Promise<void> {
    const timestamp = format(new Date(), cfg.TIMESTAMP_FORMAT);
    const logEntry = `${timestamp} | Worker: ${workerId} | Task: ${taskId} | Message: "${message}"\n`;

    await mutex.runExclusive(async () => {
      await fs.promises.appendFile(LOG_FILE_PATH, logEntry, "utf8");
    });
  }
}

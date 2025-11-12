import { cfg } from "../config/config";
import { LogManager } from "../core/logManager";
import { Task } from "../interfaces/task.interface";
import { randomUUID } from "crypto";
import { UpdateStatsCallback } from "./stats";
import { logger } from "../logger/logger";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Worker {
  public readonly id = randomUUID().slice(0, 8);
  public lastActive = Date.now();
  public busy = false;

  isIdle() {
    return !this.busy;
  }

  async process(task: Task, updateStats: UpdateStatsCallback): Promise<void> {
    this.busy = true;
    this.lastActive = Date.now();

    logger.info(
      `Worker ${this.id} starting task ${task.id} Retries: ${task.retries}`
    );

    while (task.retries <= cfg.TASK_MAX_RETRIES) {
      const startTime = Date.now();
      let isAttemptSuccess = false;
      let isFinal = false;

      try {
        await LogManager.appendLog(this.id, task.id, task.message);
        await sleep(cfg.TASK_SIMULATED_DURATION);

        if (Math.random() * 100 < cfg.TASK_SIMULATED_ERROR_PERCENTAGE) {
          throw new Error("Simulated failure");
        }

        isAttemptSuccess = true;
        isFinal = true;
        task.status = "SUCCEEDED";
        break;
      } catch (error) {
        isAttemptSuccess = false;

        if (task.retries < cfg.TASK_MAX_RETRIES) {
          task.status = "IN_PROGRESS";
          task.retries++;
          await sleep(cfg.TASK_ERROR_RETRY_DELAY);
        } else {
          isFinal = true;
          task.status = "FAILED";
          logger.error(
            `Task ${task.id} failed after ${cfg.TASK_MAX_RETRIES} attempts`
          );
          break;
        }
      } finally {
        const duration = Date.now() - startTime;
        task.attempts.push({ duration, succeeded: isAttemptSuccess });
        updateStats(isAttemptSuccess, duration, isFinal, task.retries);
      }
    }

    this.busy = false;
    this.lastActive = Date.now();
  }
}

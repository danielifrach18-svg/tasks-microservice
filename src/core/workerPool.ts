import { TaskQueue } from "./queue";
import { Worker } from "./worker";
import { cfg } from "../config/config";
import { UpdateStatsCallback } from "./stats";
import { logger } from "../logger/logger";

export class WorkerPool {
  private workers = new Map<string, Worker>();

  constructor(
    private queue: TaskQueue,
    private updateStatsCallback: UpdateStatsCallback
  ) {
    this.queue.on("taskEnqueued", () => this.ensure());
  }

  ensure() {
    if (this.queue.length() === 0) return;

    const idleWorker = [...this.workers.values()].find((w) => w.isIdle());

    if (idleWorker) {
      this.loop(idleWorker);
    } else if (this.workers.size < cfg.MAX_WORKERS) {
      this.spawn();
    }
  }

  private spawn() {
    const worker = new Worker();
    this.workers.set(worker.id, worker);
    logger.info(
      `New worker ${worker.id} Total workers: ${this.workers.size}/${cfg.MAX_WORKERS}`
    );
    this.loop(worker);
  }

  private async loop(worker: Worker) {
    const step = async () => {
      const task = this.queue.dequeue();
      if (task) {
        await worker.process(task, this.updateStatsCallback);
        return setImmediate(step);
      }

      setTimeout(() => {
        if (
          worker.isIdle() &&
          Date.now() - worker.lastActive >= cfg.WORKER_TIMEOUT
        ) {
          logger.info(`Cleaning up idle worker ${worker.id}`);
          this.workers.delete(worker.id);
        } else {
          step();
        }
      }, cfg.WORKER_TIMEOUT);
    };
    step();
  }

  public idleCount(): number {
    return [...this.workers.values()].filter((w) => w.isIdle()).length;
  }

  public hotCount(): number {
    return [...this.workers.values()].filter((w) => !w.isIdle()).length;
  }
}

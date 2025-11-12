import { TaskStats } from "../interfaces/task.interface";

export type UpdateStatsCallback = (
  isAttemptSuccess: boolean,
  duration: number,
  isFinalAttempt: boolean,
  retriesUsed: number
) => void;

export class Stats {
  private totalAttempts: number = 0;
  private totalProcessingTime: number = 0;
  public tasksProcessed: number = 0;
  public totalRetries: number = 0;
  public succeeded: number = 0;
  public failed: number = 0;

  public getStats(
    queueLength: number,
    idleWorkers: number,
    hotWorkers: number
  ): TaskStats {
    const averageProcessingTime =
      this.totalAttempts > 0
        ? this.totalProcessingTime / this.totalAttempts
        : 0;

    return {
      tasksProcessed: this.tasksProcessed,
      totalRetries: this.totalRetries,
      succeeded: this.succeeded,
      failed: this.failed,
      averageProcessingTime: Math.round(averageProcessingTime * 100) / 100,
      queueLength,
      idleWorkersCount: idleWorkers,
      hotWorkersCount: hotWorkers,
    };
  }

  public update(
    isAttemptSuccess: boolean,
    duration: number,
    isFinalAttempt: boolean,
    retriesUsed: number
  ): void {
    this.totalAttempts++;
    this.totalProcessingTime += duration;

    if (isFinalAttempt) {
      this.tasksProcessed++;
      this.totalRetries += retriesUsed;
      if (isAttemptSuccess) {
        this.succeeded++;
      } else {
        this.failed++;
      }
    }
  }
}

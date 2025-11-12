import { randomUUID } from "crypto";
import { Task, TaskPayload, TaskStats } from "../interfaces/task.interface";
import { TaskQueue } from "../core/queue";
import { WorkerPool } from "../core/workerPool";
import { Stats } from "../core/stats";

export class TaskService {
  private static instance: TaskService;

  private taskQueue: TaskQueue;
  private stats: Stats;
  private workerPool: WorkerPool;

  private constructor() {
    this.taskQueue = new TaskQueue();
    this.stats = new Stats();
    this.workerPool = new WorkerPool(
      this.taskQueue,
      this.stats.update.bind(this.stats)
    );
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  public createTask(payload: TaskPayload): string {
    const newTask: Task = {
      id: randomUUID(),
      message: payload.message,
      status: "PENDING",
      retries: 0,
      creationTime: Date.now(),
      attempts: [],
    };
    this.taskQueue.enqueue(newTask);
    return newTask.id;
  }

  public getStatistics(): TaskStats {
    return this.stats.getStats(
      this.taskQueue.length(),
      this.workerPool.idleCount(),
      this.workerPool.hotCount()
    );
  }
}

export const taskService = TaskService.getInstance();

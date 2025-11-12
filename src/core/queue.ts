import { EventEmitter } from "events";
import { Task } from "../interfaces/task.interface";

export class TaskQueue extends EventEmitter {
  private queue: Task[] = [];

  public enqueue(task: Task): void {
    this.queue.push(task);
    this.emit("taskEnqueued");
  }

  public dequeue(): Task | undefined {
    return this.queue.shift();
  }

  public length(): number {
    return this.queue.length;
  }
}

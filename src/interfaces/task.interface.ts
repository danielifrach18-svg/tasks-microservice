export interface TaskPayload {
  message: string;
}

export interface Task {
  id: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED";
  retries: number;
  creationTime: number;
  attempts: { duration: number; succeeded: boolean }[];
}

export interface TaskStats {
  tasksProcessed: number;
  totalRetries: number;
  succeeded: number;
  failed: number;
  averageProcessingTime: number;
  queueLength: number;
  idleWorkersCount: number;
  hotWorkersCount: number;
}

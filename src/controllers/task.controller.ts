import { Request, Response } from "express";
import { taskService } from "../services/task.service";
import { logger } from "../logger/logger";

export const createTask = (req: Request, res: Response): void => {
  const { message } = req.body;

  if (typeof message !== "string" || message.trim().length === 0) {
    res.status(400).send({
      error: "Expected { message: string }",
    });
    return;
  }

  try {
    const taskId = taskService.createTask({ message });
    res.status(202).json({ taskId });
  } catch (error) {
    logger.error(error);

    res.status(500).send({
      error: "Server error occurred while queuing the task",
    });
  }
};

export const getStatistics = (_req: Request, res: Response): void => {
  try {
    const stats = taskService.getStatistics();
    res.status(200).json(stats);
  } catch (error) {
    logger.error(error);
    res.status(500).send({
      error: "Server error occurred while retrieving statistics",
    });
  }
};

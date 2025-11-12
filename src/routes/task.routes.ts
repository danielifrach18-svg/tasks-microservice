import { Router } from "express";
import * as TaskController from "../controllers/task.controller";

const router = Router();

router.post("/tasks", TaskController.createTask);
router.get("/statistics", TaskController.getStatistics);

export default router;

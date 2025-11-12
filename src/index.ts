import express from "express";
import { cfg } from "./config/config";
import { logger } from "./logger/logger";
import taskRoutes from "./routes/task.routes";

const app = express();
app.use(express.json());
app.use("/", taskRoutes);

const initializeServer = () => {
  const port = cfg.SERVER_PORT;
  app.listen(port, () => {
    logger.info(
      `Server running on port ${port} (Worker Limit: ${cfg.MAX_WORKERS})`
    );
  });
};

initializeServer();

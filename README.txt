# Tasks Microservice — Home Assignment

## Overview
Microservice that accepts tasks via `POST /tasks` and processes them asynchronously using a dynamic Worker Pool.
Each task appends a log entry to a shared log file, supports simulated processing time, random failures, retries, and exposes real-time statistics via `GET /statistics`.

## Endpoints
- POST /tasks
  - Body: `{ "message": "..." }`
  - Returns: `{ "taskId": "<uuid>" }` (202 Accepted)

- GET /statistics
  - Returns TaskStats JSON:
    - tasksProcessed, totalRetries, succeeded, failed,
      averageProcessingTime, queueLength, idleWorkersCount, hotWorkersCount

## Config (.env)
See `.env` example:
SERVER_PORT=3000
TASK_SIMULATED_DURATION=500
TASK_SIMULATED_ERROR_PERCENTAGE=20
TASK_ERROR_RETRY_DELAY=1000
WORKER_TIMEOUT=5000
TASK_MAX_RETRIES=3

Note:
MAX_WORKERS is not defined here, but in src/config/config.ts
There it is set automatically based on the number of CPU cores


## Logs
- Shared worker-task log (each worker appends task entries): `logs/shared-logs.txt`


## Run
1. npm install
2. set .env
3. npm run dev


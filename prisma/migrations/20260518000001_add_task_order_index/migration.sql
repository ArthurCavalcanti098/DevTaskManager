-- DropIndex
DROP INDEX IF EXISTS "tasks_userId_status_idx";

-- CreateIndex
CREATE INDEX "tasks_userId_status_order_idx" ON "tasks"("userId", "status", "order");

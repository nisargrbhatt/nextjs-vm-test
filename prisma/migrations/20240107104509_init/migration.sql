-- CreateEnum
CREATE TYPE "DefinitionStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "RuntimeStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateTable
CREATE TABLE "Definitions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tasks" JSONB[],
    "global" JSONB,
    "status" "DefinitionStatus" NOT NULL DEFAULT 'active',
    "uiObject" JSONB,
    "date_created" DATE DEFAULT CURRENT_TIMESTAMP,
    "last_edited" DATE,

    CONSTRAINT "Definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Runtimes" (
    "id" TEXT NOT NULL,
    "workflowResults" JSONB,
    "global" JSONB,
    "workflowStatus" "RuntimeStatus" NOT NULL DEFAULT 'pending',
    "tasks" JSONB[],
    "logs" JSONB[],
    "workflowDefinitionId" TEXT NOT NULL,
    "date_created" DATE DEFAULT CURRENT_TIMESTAMP,
    "last_edited" DATE,

    CONSTRAINT "Runtimes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Runtimes" ADD CONSTRAINT "Runtimes_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "Definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

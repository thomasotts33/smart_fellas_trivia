CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "image" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Team" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "TeamMember" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "teamId" UUID NOT NULL REFERENCES "Team"("id") ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "role" TEXT NOT NULL DEFAULT 'member',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "TeamMember_teamId_userId_key" UNIQUE ("teamId", "userId")
);

CREATE TABLE "Category" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "teamId" UUID NOT NULL REFERENCES "Team"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Category_teamId_name_key" UNIQUE ("teamId", "name")
);

CREATE TABLE "Game" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "teamId" UUID NOT NULL REFERENCES "Team"("id") ON DELETE CASCADE,
  "createdById" UUID NOT NULL REFERENCES "User"("id"),
  "playedAt" TIMESTAMPTZ NOT NULL,
  "venueName" TEXT,
  "placement" INTEGER,
  "totalTeams" INTEGER,
  "prizeAmount" DECIMAL(10, 2),
  "prizeLabel" TEXT,
  "notes" TEXT,
  "totalEarned" INTEGER NOT NULL DEFAULT 0,
  "totalPossible" INTEGER NOT NULL DEFAULT 0,
  "percentCorrect" DECIMAL(5, 2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "Question" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "gameId" UUID NOT NULL REFERENCES "Game"("id") ON DELETE CASCADE,
  "categoryId" UUID NOT NULL REFERENCES "Category"("id"),
  "roundNumber" INTEGER NOT NULL,
  "questionNo" INTEGER NOT NULL,
  "wagerValue" INTEGER NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,
  "earnedPoints" INTEGER NOT NULL,
  "notes" TEXT,
  CONSTRAINT "Question_gameId_roundNumber_questionNo_key" UNIQUE ("gameId", "roundNumber", "questionNo")
);

CREATE TABLE "Halftime" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "gameId" UUID NOT NULL UNIQUE REFERENCES "Game"("id") ON DELETE CASCADE,
  "categoryLabel" TEXT,
  "partsTotal" INTEGER NOT NULL DEFAULT 4,
  "partsCorrect" INTEGER NOT NULL,
  "pointsPossible" INTEGER NOT NULL DEFAULT 12,
  "earnedPoints" INTEGER NOT NULL,
  "notes" TEXT
);

CREATE TABLE "FinalQuestion" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "gameId" UUID NOT NULL UNIQUE REFERENCES "Game"("id") ON DELETE CASCADE,
  "categoryLabel" TEXT,
  "wagerValue" INTEGER NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,
  "earnedPoints" INTEGER NOT NULL,
  "notes" TEXT
);

CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");
CREATE INDEX "Category_teamId_idx" ON "Category"("teamId");
CREATE INDEX "Game_teamId_playedAt_idx" ON "Game"("teamId", "playedAt");
CREATE INDEX "Question_categoryId_idx" ON "Question"("categoryId");
CREATE INDEX "Question_gameId_roundNumber_idx" ON "Question"("gameId", "roundNumber");

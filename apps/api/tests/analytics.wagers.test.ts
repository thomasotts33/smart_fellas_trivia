import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/db/prisma.js";
import { createApp } from "../src/index.js";
import { buildGamePayload } from "./gamePayload.js";

const app = createApp();
const ownerEmail = "phase3-wagers@smartfellas.test";

function auth(email: string) {
  return { Authorization: `Bearer ${email}` };
}

async function cleanup() {
  await prisma.game.deleteMany({ where: { team: { slug: { startsWith: "phase3-wagers" } } } });
  await prisma.team.deleteMany({ where: { slug: { startsWith: "phase3-wagers" } } });
  await prisma.user.deleteMany({ where: { email: ownerEmail } });
}

async function createTeam() {
  const response = await request(app)
    .post("/api/teams")
    .set(auth(ownerEmail))
    .send({ name: "Phase3 Wagers", slug: `phase3-wagers-${Date.now()}` });
  return response.body.id as string;
}

beforeEach(async () => {
  await cleanup();
});

afterEach(async () => {
  await cleanup();
});

describe("wager analytics", () => {
  it("returns attempts, correct count, percent correct, and net points by wager", async () => {
    const teamId = await createTeam();
    await request(app).post(`/api/teams/${teamId}/games`).set(auth(ownerEmail)).send(buildGamePayload());

    const response = await request(app).get(`/api/teams/${teamId}/analytics/wagers`).set(auth(ownerEmail));

    expect(response.status).toBe(200);
    expect(response.body.wagers.map((wager: { wagerValue: number }) => wager.wagerValue)).toContain(5);
    expect(response.body.wagers[0]).toEqual(
      expect.objectContaining({
        attempts: expect.any(Number),
        correct: expect.any(Number),
        percentCorrect: expect.any(Number),
        netPoints: expect.any(Number),
      }),
    );
  });
});

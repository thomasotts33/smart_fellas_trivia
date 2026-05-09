import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { auth } from "./auth.js";
import { prisma } from "../src/db/prisma.js";
import { createApp } from "../src/index.js";
import { buildGamePayload } from "./gamePayload.js";

const app = createApp();
const ownerEmail = "phase3-categories@smartfellas.test";

async function cleanup() {
  await prisma.game.deleteMany({ where: { team: { slug: { startsWith: "phase3-categories" } } } });
  await prisma.team.deleteMany({ where: { slug: { startsWith: "phase3-categories" } } });
  await prisma.user.deleteMany({ where: { email: ownerEmail } });
}

async function createTeam() {
  const response = await request(app)
    .post("/api/teams")
    .set(auth(ownerEmail))
    .send({ name: "Phase3 Categories", slug: `phase3-categories-${Date.now()}` });
  return response.body.id as string;
}

beforeEach(async () => {
  await cleanup();
});

afterEach(async () => {
  await cleanup();
});

describe("category analytics", () => {
  it("returns correct, total, percent, and point counts for small samples", async () => {
    const teamId = await createTeam();
    await request(app).post(`/api/teams/${teamId}/games`).set(auth(ownerEmail)).send(buildGamePayload());

    const response = await request(app).get(`/api/teams/${teamId}/analytics/categories`).set(auth(ownerEmail));

    expect(response.status).toBe(200);
    expect(response.body.categories.length).toBeGreaterThan(0);
    expect(response.body.categories[0]).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        correct: expect.any(Number),
        total: expect.any(Number),
        percentCorrect: expect.any(Number),
        pointsEarned: expect.any(Number),
        pointsPossible: expect.any(Number),
      }),
    );
  });
});

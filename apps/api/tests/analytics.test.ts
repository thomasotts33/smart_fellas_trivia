import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/db/prisma.js";
import { createApp } from "../src/index.js";
import { buildGamePayload } from "./gamePayload.js";

const app = createApp();
const ownerEmail = "phase2-analytics@smartfellas.test";

function auth(email: string) {
  return { Authorization: `Bearer ${email}` };
}

async function cleanup() {
  await prisma.game.deleteMany({ where: { team: { slug: { startsWith: "phase2-analytics" } } } });
  await prisma.team.deleteMany({ where: { slug: { startsWith: "phase2-analytics" } } });
  await prisma.user.deleteMany({ where: { email: ownerEmail } });
}

async function createTeam() {
  const response = await request(app)
    .post("/api/teams")
    .set(auth(ownerEmail))
    .send({ name: "Phase2 Analytics", slug: `phase2-analytics-${Date.now()}` });
  return response.body.id as string;
}

beforeEach(async () => {
  await cleanup();
});

afterEach(async () => {
  await cleanup();
});

describe("analytics APIs", () => {
  it("returns summary and trend data from logged games", async () => {
    const teamId = await createTeam();
    await request(app).post(`/api/teams/${teamId}/games`).set(auth(ownerEmail)).send(buildGamePayload());
    await request(app)
      .post(`/api/teams/${teamId}/games`)
      .set(auth(ownerEmail))
      .send(buildGamePayload({ playedAt: "2026-05-13T02:00:00.000Z", placement: 1 }));

    const summary = await request(app).get(`/api/teams/${teamId}/analytics/summary`).set(auth(ownerEmail));
    expect(summary.status).toBe(200);
    expect(summary.body.gamesLogged).toBe(2);
    expect(summary.body.averagePercentCorrect).toBeGreaterThan(0);

    const trends = await request(app).get(`/api/teams/${teamId}/analytics/trends`).set(auth(ownerEmail));
    expect(trends.status).toBe(200);
    expect(trends.body.percentCorrectOverTime).toHaveLength(2);
    expect(trends.body.pointsOverTime[0]).toEqual(expect.objectContaining({ value: expect.any(Number) }));
  });
});

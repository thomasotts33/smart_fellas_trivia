import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { auth } from "./auth.js";
import { prisma } from "../src/db/prisma.js";
import { createApp } from "../src/index.js";
import { buildGamePayload } from "./gamePayload.js";

const app = createApp();
const ownerEmail = "phase2-owner@smartfellas.test";
const memberEmail = "phase2-member@smartfellas.test";
const outsiderEmail = "phase2-outsider@smartfellas.test";

async function cleanup() {
  await prisma.game.deleteMany({ where: { team: { slug: { startsWith: "phase2-games-" } } } });
  await prisma.team.deleteMany({ where: { slug: { startsWith: "phase2-games-" } } });
  await prisma.user.deleteMany({ where: { email: { in: [ownerEmail, memberEmail, outsiderEmail] } } });
}

async function createTeam() {
  const response = await request(app)
    .post("/api/teams")
    .set(auth(ownerEmail))
    .send({ name: "Phase2 Team", slug: `phase2-games-${Date.now()}` });

  await request(app).get("/api/me").set(auth(memberEmail));
  await request(app)
    .post(`/api/teams/${response.body.id}/members/invite`)
    .set(auth(ownerEmail))
    .send({ email: memberEmail, role: "member" });

  return response.body.id as string;
}

beforeEach(async () => {
  await cleanup();
});

afterEach(async () => {
  await cleanup();
});

describe("game APIs", () => {
  it("creates a full game transaction and stores 18 regular questions", async () => {
    const teamId = await createTeam();
    const response = await request(app)
      .post(`/api/teams/${teamId}/games`)
      .set(auth(ownerEmail))
      .send(buildGamePayload());

    expect(response.status).toBe(201);
    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body.totals).toMatchObject({ totalPossible: 116 });

    const questionCount = await prisma.question.count({ where: { gameId: response.body.id } });
    expect(questionCount).toBe(18);
  });

  it("lists, reads, updates, and deletes games with role enforcement", async () => {
    const teamId = await createTeam();
    const createResponse = await request(app)
      .post(`/api/teams/${teamId}/games`)
      .set(auth(ownerEmail))
      .send(buildGamePayload());
    const gameId = createResponse.body.id as string;

    const memberList = await request(app).get(`/api/teams/${teamId}/games`).set(auth(memberEmail));
    expect(memberList.status).toBe(200);
    expect(memberList.body.games).toHaveLength(1);

    const memberDetail = await request(app).get(`/api/teams/${teamId}/games/${gameId}`).set(auth(memberEmail));
    expect(memberDetail.status).toBe(200);
    expect(memberDetail.body.rounds[0].questions).toHaveLength(3);

    const deniedUpdate = await request(app)
      .put(`/api/teams/${teamId}/games/${gameId}`)
      .set(auth(memberEmail))
      .send(buildGamePayload({ venueName: "Nope" }));
    expect(deniedUpdate.status).toBe(403);

    const ownerUpdate = await request(app)
      .put(`/api/teams/${teamId}/games/${gameId}`)
      .set(auth(ownerEmail))
      .send(buildGamePayload({ venueName: "Updated Bar" }));
    expect(ownerUpdate.status).toBe(200);

    const outsiderRead = await request(app).get(`/api/teams/${teamId}/games/${gameId}`).set(auth(outsiderEmail));
    expect(outsiderRead.status).toBe(403);

    const deleteResponse = await request(app).delete(`/api/teams/${teamId}/games/${gameId}`).set(auth(ownerEmail));
    expect(deleteResponse.status).toBe(204);
  });

  it("rejects invalid wager combinations before saving", async () => {
    const teamId = await createTeam();
    const payload = buildGamePayload();
    payload.rounds[0]!.questions[1]!.wagerValue = 2;

    const response = await request(app).post(`/api/teams/${teamId}/games`).set(auth(ownerEmail)).send(payload);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Round 1 must use wagers 2, 4, 6 exactly once.");
  });
});

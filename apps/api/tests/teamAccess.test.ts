import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../src/db/prisma.js";
import { createApp } from "../src/index.js";

const app = createApp();
const ownerEmail = "phase1-owner@smartfellas.test";
const memberEmail = "phase1-member@smartfellas.test";
const outsiderEmail = "phase1-outsider@smartfellas.test";

function auth(email: string) {
  return { Authorization: `Bearer ${email}`, "x-user-name": email.split("@")[0] };
}

async function cleanup() {
  await prisma.team.deleteMany({
    where: {
      slug: {
        startsWith: "phase1-",
      },
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [ownerEmail, memberEmail, outsiderEmail],
      },
    },
  });
}

afterEach(async () => {
  await cleanup();
});

describe("team access APIs", () => {
  it("syncs the authenticated user through /api/me", async () => {
    const response = await request(app).get("/api/me").set(auth(ownerEmail));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      email: ownerEmail,
      name: "phase1-owner",
      teams: [],
    });
  });

  it("requires authentication", async () => {
    const response = await request(app).get("/api/me");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication required.");
  });

  it("creates a team with owner membership and protects team detail", async () => {
    const createResponse = await request(app)
      .post("/api/teams")
      .set(auth(ownerEmail))
      .send({ name: "Phase1 Team", slug: "phase1-team" });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      name: "Phase1 Team",
      slug: "phase1-team",
      role: "owner",
    });

    const ownerRead = await request(app).get(`/api/teams/${createResponse.body.id}`).set(auth(ownerEmail));
    expect(ownerRead.status).toBe(200);
    expect(ownerRead.body.members).toEqual([
      expect.objectContaining({ email: ownerEmail, role: "owner" }),
    ]);

    const outsiderRead = await request(app).get(`/api/teams/${createResponse.body.id}`).set(auth(outsiderEmail));
    expect(outsiderRead.status).toBe(403);
  });

  it("adds existing users as members and allows category upsert for admins", async () => {
    await request(app).get("/api/me").set(auth(memberEmail));
    const createResponse = await request(app)
      .post("/api/teams")
      .set(auth(ownerEmail))
      .send({ name: "Phase1 Categories", slug: "phase1-categories" });

    const inviteResponse = await request(app)
      .post(`/api/teams/${createResponse.body.id}/members/invite`)
      .set(auth(ownerEmail))
      .send({ email: memberEmail, role: "admin" });

    expect(inviteResponse.status).toBe(201);
    expect(inviteResponse.body).toMatchObject({ email: memberEmail, role: "admin", status: "added" });

    const categoryResponse = await request(app)
      .post(`/api/teams/${createResponse.body.id}/categories`)
      .set(auth(memberEmail))
      .send({ name: "  Movies   and TV  " });

    expect(categoryResponse.status).toBe(201);
    expect(categoryResponse.body.name).toBe("Movies and TV");

    const duplicateResponse = await request(app)
      .post(`/api/teams/${createResponse.body.id}/categories`)
      .set(auth(memberEmail))
      .send({ name: "movies and tv" });

    expect(duplicateResponse.status).toBe(201);
    expect(duplicateResponse.body.id).toBe(categoryResponse.body.id);
  });
});

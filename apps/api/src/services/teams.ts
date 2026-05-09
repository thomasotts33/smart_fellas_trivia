import { prisma } from "../db/prisma.js";
import { HttpError } from "../http/errors.js";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createTeam(input: { name: string; slug?: string }, ownerId: string) {
  const slug = slugify(input.slug || input.name);

  if (!slug) {
    throw new HttpError(400, "Team slug must include letters or numbers.");
  }

  const existing = await prisma.team.findUnique({ where: { slug } });
  if (existing) {
    throw new HttpError(409, "That team slug is already taken.");
  }

  const team = await prisma.team.create({
    data: {
      name: input.name.trim(),
      slug,
      members: {
        create: {
          userId: ownerId,
          role: "owner",
        },
      },
    },
    include: {
      members: true,
    },
  });

  return {
    id: team.id,
    name: team.name,
    slug: team.slug,
    role: "owner" as const,
  };
}

export async function updateTeam(input: { teamId: string; name: string; slug: string }) {
  const slug = slugify(input.slug);

  if (!slug) {
    throw new HttpError(400, "Team slug must include letters or numbers.");
  }

  const existing = await prisma.team.findFirst({
    where: {
      slug,
      NOT: { id: input.teamId },
    },
  });

  if (existing) {
    throw new HttpError(409, "That team slug is already taken.");
  }

  const team = await prisma.team.update({
    where: { id: input.teamId },
    data: {
      name: input.name.trim(),
      slug,
    },
  });

  return {
    id: team.id,
    name: team.name,
    slug: team.slug,
  };
}

export async function getTeamDetail(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
      invites: {
        where: { status: "pending" },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!team) {
    throw new HttpError(404, "Team not found.");
  }

  return {
    id: team.id,
    name: team.name,
    slug: team.slug,
    members: team.members.map((member) => ({
      id: member.id,
      role: member.role,
      email: member.user.email,
      name: member.user.name,
    })),
    pendingInvites: team.invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      status: invite.status,
    })),
  };
}

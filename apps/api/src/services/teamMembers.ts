import { prisma } from "../db/prisma.js";
import { HttpError } from "../http/errors.js";
import type { TeamRole } from "../types/auth.js";

const managedRoles = ["admin", "member"] as const;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function assertOwnerAvailable(teamId: string, memberId: string) {
  const member = await prisma.teamMember.findUnique({ where: { id: memberId } });
  if (!member || member.teamId !== teamId) {
    throw new HttpError(404, "Team member not found.");
  }

  if (member.role !== "owner") {
    return member;
  }

  const ownerCount = await prisma.teamMember.count({
    where: {
      teamId,
      role: "owner",
    },
  });

  if (ownerCount <= 1) {
    throw new HttpError(400, "The team must keep at least one owner.");
  }

  return member;
}

export async function addTeamMemberByEmail(input: { teamId: string; email: string; role: Exclude<TeamRole, "owner"> }) {
  const email = normalizeEmail(input.email);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const invite = await prisma.teamInvite.upsert({
      where: {
        teamId_email: {
          teamId: input.teamId,
          email,
        },
      },
      create: {
        teamId: input.teamId,
        email,
        role: input.role,
      },
      update: {
        role: input.role,
        status: "pending",
        resolvedAt: null,
      },
    });

    return { email, id: invite.id, role: input.role, status: "invited" as const };
  }

  const existing = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: input.teamId,
        userId: user.id,
      },
    },
  });

  if (existing) {
    throw new HttpError(409, "That user is already a member of this team.");
  }

  const member = await prisma.teamMember.create({
    data: {
      teamId: input.teamId,
      userId: user.id,
      role: input.role,
    },
  });

  await prisma.teamInvite.updateMany({
    where: {
      teamId: input.teamId,
      email,
      status: "pending",
    },
    data: {
      status: "resolved",
      resolvedAt: new Date(),
    },
  });

  return { email, id: member.id, role: input.role, status: "added" as const };
}

export async function updateTeamMemberRole(input: { teamId: string; memberId: string; role: (typeof managedRoles)[number] }) {
  await assertOwnerAvailable(input.teamId, input.memberId);

  if (!managedRoles.includes(input.role)) {
    throw new HttpError(400, "Invalid role.");
  }

  const updated = await prisma.teamMember.update({
    where: { id: input.memberId },
    data: { role: input.role },
    include: { user: true },
  });

  return {
    id: updated.id,
    email: updated.user.email,
    name: updated.user.name,
    role: updated.role,
  };
}

export async function removeTeamMember(input: { teamId: string; memberId: string }) {
  await assertOwnerAvailable(input.teamId, input.memberId);

  await prisma.teamMember.delete({ where: { id: input.memberId } });
}

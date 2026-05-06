import { prisma } from "../db/prisma.js";
import { HttpError } from "../http/errors.js";
import type { TeamRole } from "../types/auth.js";

export async function addTeamMemberByEmail(input: { teamId: string; email: string; role: Exclude<TeamRole, "owner"> }) {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { email, role: input.role, status: "invited" as const };
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

  await prisma.teamMember.create({
    data: {
      teamId: input.teamId,
      userId: user.id,
      role: input.role,
    },
  });

  return { email, role: input.role, status: "added" as const };
}

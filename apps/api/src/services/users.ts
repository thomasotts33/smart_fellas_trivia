import { prisma } from "../db/prisma.js";

export type UserIdentity = {
  email: string;
  name?: string | null;
  image?: string | null;
};

export async function syncUser(identity: UserIdentity) {
  const email = identity.email.trim().toLowerCase();

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email },
      create: {
        email,
        name: identity.name ?? null,
        image: identity.image ?? null,
      },
      update: {
        name: identity.name ?? null,
        image: identity.image ?? null,
      },
    });

    const invites = await tx.teamInvite.findMany({
      where: {
        email,
        status: "pending",
      },
    });

    for (const invite of invites) {
      await tx.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: invite.teamId,
            userId: user.id,
          },
        },
        create: {
          teamId: invite.teamId,
          userId: user.id,
          role: invite.role,
        },
        update: {},
      });
    }

    if (invites.length > 0) {
      await tx.teamInvite.updateMany({
        where: {
          id: {
            in: invites.map((invite) => invite.id),
          },
        },
        data: {
          status: "resolved",
          resolvedAt: new Date(),
        },
      });
    }

    return user;
  });
}

export async function getUserWithTeams(userId: string) {
  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      memberships: {
        include: { team: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

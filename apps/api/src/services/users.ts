import { prisma } from "../db/prisma.js";

export type UserIdentity = {
  email: string;
  name?: string | null;
  image?: string | null;
};

export async function syncUser(identity: UserIdentity) {
  const email = identity.email.trim().toLowerCase();

  return prisma.user.upsert({
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

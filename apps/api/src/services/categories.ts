import { prisma } from "../db/prisma.js";

function normalizeCategoryName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export async function listCategories(teamId: string) {
  const categories = await prisma.category.findMany({
    where: { teamId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return { categories };
}

export async function upsertCategory(teamId: string, rawName: string) {
  const name = normalizeCategoryName(rawName);

  const existing = await prisma.category.findFirst({
    where: {
      teamId,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.category.create({
    data: {
        teamId,
        name,
    },
    select: {
      id: true,
      name: true,
    },
  });
}

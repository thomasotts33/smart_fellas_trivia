import { PrismaClient } from "../apps/api/src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "thomas@example.com" },
    update: {},
    create: {
      email: "thomas@example.com",
      name: "Thomas",
    },
  });

  const team = await prisma.team.upsert({
    where: { slug: "smartfellas" },
    update: {},
    create: {
      name: "SmartFellas",
      slug: "smartfellas",
    },
  });

  await prisma.teamMember.upsert({
    where: {
      teamId_userId: {
        teamId: team.id,
        userId: user.id,
      },
    },
    update: { role: "owner" },
    create: {
      teamId: team.id,
      userId: user.id,
      role: "owner",
    },
  });

  for (const name of ["History", "Music", "Sports", "Movies", "Science", "Literature"]) {
    await prisma.category.upsert({
      where: {
        teamId_name: {
          teamId: team.id,
          name,
        },
      },
      update: {},
      create: {
        teamId: team.id,
        name,
      },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

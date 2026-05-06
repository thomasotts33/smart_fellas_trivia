import { PrismaClient } from "../apps/api/src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "thomas@smartfellas.local" },
    update: { name: "Thomas" },
    create: {
      email: "thomas@smartfellas.local",
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

  const categories = [];
  for (const name of ["History", "Music", "Sports", "Movies", "Science", "Literature"]) {
    const category = await prisma.category.upsert({
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
    categories.push(category);
  }

  await prisma.game.deleteMany({ where: { teamId: team.id } });

  const firstGame = await prisma.game.create({
    data: {
      teamId: team.id,
      createdById: user.id,
      playedAt: new Date("2026-05-06T02:00:00.000Z"),
      venueName: "Local Bar",
      placement: 2,
      totalTeams: 12,
      prizeAmount: 25,
      prizeLabel: "Gift card",
      totalEarned: 76,
      totalPossible: 119,
      percentCorrect: 63.87,
      questions: {
        create: Array.from({ length: 18 }, (_, index) => {
          const roundNumber = Math.floor(index / 3) + 1;
          const questionNo = (index % 3) + 1;
          const wagers = roundNumber <= 3 ? [2, 4, 6] : [5, 7, 9];
          const wagerValue = wagers[index % 3];
          const isCorrect = index % 4 !== 0;

          return {
            categoryId: categories[index % categories.length]!.id,
            roundNumber,
            questionNo,
            wagerValue,
            isCorrect,
            earnedPoints: isCorrect ? wagerValue : 0,
          };
        }),
      },
      halftime: {
        create: {
          categoryLabel: "Movies",
          partsTotal: 4,
          partsCorrect: 3,
          pointsPossible: 12,
          earnedPoints: 9,
        },
      },
      finalQuestion: {
        create: {
          categoryLabel: "Literature",
          wagerValue: 8,
          isCorrect: false,
          earnedPoints: -8,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      teamId: team.id,
      createdById: user.id,
      playedAt: new Date("2026-05-13T02:00:00.000Z"),
      venueName: "Local Bar",
      placement: 1,
      totalTeams: 10,
      prizeAmount: 40,
      prizeLabel: "Tab credit",
      totalEarned: 121,
      totalPossible: 121,
      percentCorrect: 100,
      notes: `Follow-up game after ${firstGame.id}.`,
      questions: {
        create: Array.from({ length: 18 }, (_, index) => {
          const roundNumber = Math.floor(index / 3) + 1;
          const questionNo = (index % 3) + 1;
          const wagers = roundNumber <= 3 ? [2, 4, 6] : [5, 7, 9];
          const wagerValue = wagers[index % 3]!;

          return {
            categoryId: categories[(index + 2) % categories.length]!.id,
            roundNumber,
            questionNo,
            wagerValue,
            isCorrect: true,
            earnedPoints: wagerValue,
          };
        }),
      },
      halftime: {
        create: {
          categoryLabel: "Sports",
          partsTotal: 4,
          partsCorrect: 4,
          pointsPossible: 12,
          earnedPoints: 12,
        },
      },
      finalQuestion: {
        create: {
          categoryLabel: "History",
          wagerValue: 10,
          isCorrect: true,
          earnedPoints: 10,
        },
      },
    },
  });
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

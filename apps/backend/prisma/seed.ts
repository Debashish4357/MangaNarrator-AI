import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create a default test user
  const user = await prisma.user.upsert({
    where: { email: "test@manganarrator.local" },
    update: {},
    create: {
      email: "test@manganarrator.local",
      passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz", // Placeholder hash
      name: "Test Reader",
    },
  });
  console.log(`Default User created: ${user.email}`);

  // 2. Create One Punch Man Manga
  const manga = await prisma.manga.create({
    data: {
      title: "One Punch Man",
    },
  });
  console.log(`Manga created: ${manga.title} (${manga.id})`);

  // 3. Create Chapter 1
  const chapter = await prisma.chapter.create({
    data: {
      mangaId: manga.id,
      chapterNumber: 1,
      title: "One Punch",
      pdfPath: "/storage/uploads/opm_ch1.pdf",
      status: "COMPLETED",
    },
  });
  console.log(`Chapter created: Chapter ${chapter.chapterNumber} - ${chapter.title}`);

  // 4. Create Characters
  const saitama = await prisma.character.create({
    data: {
      mangaId: manga.id,
      name: "Saitama",
      description: "A hero who can defeat any opponent with a single punch.",
    },
  });
  const crablante = await prisma.character.create({
    data: {
      mangaId: manga.id,
      name: "Crablante",
      description: "A giant humanoid crab monster.",
    },
  });
  console.log(`Characters created: ${saitama.name}, ${crablante.name}`);

  // 5. Create Chronological Events (Saitama fights Crablante)
  const event1 = await prisma.storyEvent.create({
    data: {
      chapterId: chapter.id,
      eventOrder: 1,
      title: "Saitama's Daily Life",
      description: "Saitama, looking dejected in a business suit, walks down the street after a failed job interview.",
    },
  });

  const event2 = await prisma.storyEvent.create({
    data: {
      chapterId: chapter.id,
      eventOrder: 2,
      title: "Monster Appears",
      description: "Crablante, a giant humanoid crab monster wearing briefs, appears in the street, terrifying pedestrians.",
    },
  });
  console.log("Chronological StoryEvents successfully seeded.");

  // 6. Create Initial Progress Link
  await prisma.storyProgress.create({
    data: {
      userId: user.id,
      mangaId: manga.id,
      chapterId: chapter.id,
      eventId: event1.id,
    },
  });
  console.log("Default user progress bookmark seeded.");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

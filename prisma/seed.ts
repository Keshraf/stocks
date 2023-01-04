import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { seedData } from "./data";

const prisma = new PrismaClient();

const run = async () => {
  console.log("seeding...");
  const salt = bcrypt.genSaltSync();
  await Promise.all(
    seedData.map(async (data) => {
      return prisma.user.upsert({
        where: {
          email: data.email,
        },
        update: {},
        create: {
          name: data.name,
          email: data.email,
          password: data.password,
          company: {
            create: {
              name: data.company.name,
            },
          },
        },
      });
    })
  );
};

run()
  .catch((e) => {
    console.error("!!!!!!", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

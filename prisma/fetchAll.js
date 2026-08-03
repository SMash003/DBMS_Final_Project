import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const datas = await prisma.officer.findMany();

  const dataIds = datass.map((data) => data.id);
  console.log(dataIdsIds);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
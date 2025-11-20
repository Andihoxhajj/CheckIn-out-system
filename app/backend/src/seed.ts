import './env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
  const existing = await prisma.villa.count();
  if (existing >= 5) {
    // eslint-disable-next-line no-console
    console.log('Villas already seeded');
    return;
  }
  const villas = Array.from({ length: 5 }).map((_, index) => ({
    name: `Villa ${index + 1}`,
    pricePerNight: 100,
    status: 'Available',
  }));

  await prisma.villa.createMany({ data: villas });
  // eslint-disable-next-line no-console
  console.log('Seeded 5 villas');
};

seed()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


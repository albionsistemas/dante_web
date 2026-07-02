import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@dante.local';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'change-me-123';
  const name = process.env.SEED_ADMIN_NAME ?? 'Admin DANTE';

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name, role: 'SUPER_ADMIN' },
  });

  console.log(`Admin listo: ${admin.email} (contraseña sin cambios si ya existía).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

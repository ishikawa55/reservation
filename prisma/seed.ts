// prisma/seed.ts

import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// アダプターを使用してPrismaClientを初期化
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // パスワードのハッシュ化（10は計算コスト）
  const hashedDoctorPassword = await bcrypt.hash('doctor123', 10);
  const hashedPatientPassword = await bcrypt.hash('patient123', 10);

  // 院長アカウントの作成（既存データがあれば無視）
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@example.com' },
    update: {},
    create: {
      email: 'doctor@example.com',
      password: hashedDoctorPassword,
      name: '院長先生',
      role: 'DOCTOR',
    },
  });

  // テスト用患者アカウントの作成
  const patient = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      password: hashedPatientPassword,
      name: 'テスト患者',
      role: 'PATIENT',
    },
  });

  console.log({ doctor, patient });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

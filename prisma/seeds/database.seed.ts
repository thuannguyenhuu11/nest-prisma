import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltOrRounds = 10;

  const user = await prisma.user.create({
    data: {
      email: 'thuannguyen11@gmail.com',
      password: await bcrypt.hash('password', saltOrRounds),
      name: 'Thuan Nguyen',
      phone: '0123456789', // Add a valid phone number here
    },
  });

  console.log({ user });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

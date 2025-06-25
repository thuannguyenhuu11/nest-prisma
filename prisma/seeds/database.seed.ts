import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltOrRounds = 20;

  const user = await prisma.user.create({
    data: {
      email: 'thuannguyen11@gmail.com',
      password: await bcrypt.hash('password', saltOrRounds),
      name: 'Thuan Nguyen',
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

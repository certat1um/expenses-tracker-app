import users from './data/users';
import records from './data/records';
import { prisma } from '../prisma';
import { IRecord } from '../../src/record/interfaces/record';
import { IUser } from '../../src/user/interfaces/user';

const Records = records as IRecord[];
const Users = users as IUser[];

const runSeeds = async () => {
  await prisma.record.deleteMany();
  await prisma.user.deleteMany();

  await Promise.all(
    Users.map(async (user) => prisma.user.create({ data: user })),
  );

  await Promise.all(
    Records.map(async (record) => prisma.record.create({ data: record })),
  );
};

runSeeds()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

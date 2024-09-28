import users from './data/users';
import records from './data/records';
import categories from './data/categories';
import { prisma } from '../prisma';
import { IRecord } from '../../src/record/interfaces/record';
import { IUser } from '../../src/user/interfaces/user';
import { ICategory } from '../../src/category/interfaces/category';

const Records = records as IRecord[];
const Users = users as IUser[];
const Categories = categories as ICategory[];

const runSeeds = async () => {
  await prisma.record.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  await Promise.all(Users.map(async (user) => prisma.user.create({ data: user })));
  await Promise.all(Categories.map(async (category) => prisma.category.create({ data: category })));
  await Promise.all(Records.map(async (record) => prisma.record.create({ data: record })));
};

runSeeds()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

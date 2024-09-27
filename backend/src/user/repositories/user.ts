import { Service } from 'typedi';
import { IUser } from '../interfaces/user';
import { prisma } from '../../../prisma/prisma';

@Service()
export class UserRepository {
  private user = prisma.user;

  public async findBy(data: Partial<IUser>): Promise<IUser> {
    return this.user.findFirst({ where: data });
  }

  public async create(data: IUser): Promise<IUser> {
    return this.user.create({ data });
  }
}

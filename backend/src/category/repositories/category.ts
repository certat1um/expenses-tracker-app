import { Service } from 'typedi';
import { prisma } from '../../../prisma/prisma';
import { ICategory } from '../interfaces/category';

@Service()
export class CategoryRepository {
  private category = prisma.category;

  public async findByIds(idsArr: string[]): Promise<ICategory[]> {
    return this.category.findMany({ where: { id: { in: idsArr } } });
  }
}

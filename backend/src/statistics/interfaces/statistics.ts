import { IRecord } from '../../record/interfaces/record';

export interface IStatisticsRequestOptions {
  filters?: { [key: string]: any };
  // sort?: { [key: string]: any };
  // pagination?: { [key: string]: any };
}

export interface IStatisticsCategoriesInfo {
  incomes: IStatisticsCategoriesByType;
  expenses: IStatisticsCategoriesByType;
}

export interface IStatisticsCategoriesByType {
  totalAmount: number;
  categories: IStatisticsCategoryGroup[];
}

export interface IStatisticsCategoryGroup {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
}

export interface IStatisticsRecordsList {
  [key: string]: IRecord[];
}

export interface IStatisticsRecordsBySections {
  from: string;
  sum: number;
  to: string;
  records: IRecord[];
}

export type IStatisticsCategories = IStatisticsCategoriesInfo | IStatisticsCategoriesByType;

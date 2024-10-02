import { IRecord } from '../../record/interfaces/record';

export interface IStatisticsRequestOptions {
  filters?: { [key: string]: any };
  sort?: { [key: string]: any };
  pagination?: { cur_page: number; page_size: number };
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
  to: string;
  sum: number;
  recordsCount: number;
}

export type IStatisticsCategories = IStatisticsCategoriesByType;

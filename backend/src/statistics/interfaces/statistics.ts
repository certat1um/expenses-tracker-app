import { IRecord } from '../../record/interfaces/record';

export interface IStatisticsRequestOptions {
  filters?: { [key: string]: any };
  sort?: { [key: string]: any };
  pagination?: { cur_page: number; page_size: number };
}

export interface IStatisticsCategoriesInfo {
  totalAmount: number;
  categories: IStatisticsCategoryGroup[];
}

export interface IStatisticsCategoryGroup {
  categoryId: string;
  categoryName: string;
  categoryPercentage: number;
  totalAmount: number;
  recordsCount: number;
}

export interface IStatisticsRecordsList {
  [key: string]: IRecord[];
}

export interface IStatisticsLinearDiagram {
  totalAmount: number;
  averageAmount: number;
  prevMonthDiff: number;
  recordsInSections: IStatisticsRecordsInSections[];
}

export interface IStatisticsRecordsInSections {
  from: string;
  to: string;
  sum: number;
}

export interface IRecord {
  id?: string;
  type: 'income' | 'expense';
  value: string;
  userId: string;
  categoryId: string;
  createdAt?: Date;
}

export interface IRecordGroup {
  categoryId: string;
  categoryName: string;
  records: IRecord[];
}

export interface IRecordGroupsByCategories {
  incomes: IRecordGroup[];
  expenses: IRecordGroup[];
}

export interface IRecordRequestOptions {
  filters: { [key: string]: any };
  sort?: { [key: string]: any };
  pagination?: { [key: string]: any };
}

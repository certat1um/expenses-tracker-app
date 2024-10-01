export interface IRecord {
  id?: string;
  type: 'income' | 'expense';
  value: string;
  userId: string;
  categoryId: string;
  createdAt?: Date;
}

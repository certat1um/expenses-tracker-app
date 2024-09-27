export interface IRecord {
  id?: string;
  type: 'income' | 'expense';
  value: string;
  userId: string;
}

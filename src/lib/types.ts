
export type Category = 
  | 'Food'
  | 'Travel'
  | 'Bills'
  | 'Shopping'
  | 'Entertainment'
  | 'Other';

export interface Transaction {
  id: string;
  date: Date; // Changed from string to Date
  description: string;
  amount: number;
  category: Category;
}

export interface CategoryTotal {
  category: Category;
  total: number;
  percentage: number;
  color: string;
}

export interface MonthlySpending {
  month: string;
  Food: number;
  Travel: number;
  Bills: number;
  Shopping: number;
  Entertainment: number;
  Other: number;
}

export interface CSVRow {
  date: string;
  description: string;
  amount: string;
  [key: string]: string;
}

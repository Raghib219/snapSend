
import { CategoryTotal, MonthlySpending, Transaction, Category } from "./types";

export const recentTransactions: Transaction[] = [
  {
    id: "tx1",
    date: new Date("2023-05-01"),
    description: "Grocery Shopping",
    amount: 85.42,
    category: "Food",
  },
  {
    id: "tx2",
    date: new Date("2023-05-03"),
    description: "Uber Ride",
    amount: 24.99,
    category: "Travel",
  },
  {
    id: "tx3",
    date: new Date("2023-05-05"),
    description: "Netflix Subscription",
    amount: 15.99,
    category: "Entertainment",
  },
  {
    id: "tx4",
    date: new Date("2023-05-07"),
    description: "Electricity Bill",
    amount: 112.45,
    category: "Bills",
  },
  {
    id: "tx5",
    date: new Date("2023-05-10"),
    description: "Amazon Purchase",
    amount: 49.99,
    category: "Shopping",
  },
  {
    id: "tx6",
    date: new Date("2023-05-12"),
    description: "Restaurant Dinner",
    amount: 78.35,
    category: "Food",
  },
];

export const categoryTotals: CategoryTotal[] = [
  {
    category: "Food",
    total: 458.77,
    percentage: 30,
    color: "#64748b", // Slate-500 - using more subdued colors
  },
  {
    category: "Travel",
    total: 245.30,
    percentage: 16,
    color: "#475569", // Slate-600
  },
  {
    category: "Bills",
    total: 325.45,
    percentage: 21,
    color: "#334155", // Slate-700
  },
  {
    category: "Shopping",
    total: 189.99,
    percentage: 12,
    color: "#1e293b", // Slate-800
  },
  {
    category: "Entertainment",
    total: 156.49,
    percentage: 10,
    color: "#0f172a", // Slate-900
  },
  {
    category: "Other",
    total: 175.25,
    percentage: 11,
    color: "#94a3b8", // Slate-400
  },
];

export const monthlySpending: MonthlySpending[] = [
  {
    month: "Jan",
    Food: 420.50,
    Travel: 200.30,
    Bills: 305.45,
    Shopping: 150.99,
    Entertainment: 130.49,
    Other: 160.25,
  },
  {
    month: "Feb",
    Food: 385.20,
    Travel: 180.75,
    Bills: 320.45,
    Shopping: 175.99,
    Entertainment: 145.49,
    Other: 145.85,
  },
  {
    month: "Mar",
    Food: 410.80,
    Travel: 210.30,
    Bills: 315.45,
    Shopping: 200.99,
    Entertainment: 160.49,
    Other: 170.25,
  },
  {
    month: "Apr",
    Food: 435.30,
    Travel: 230.80,
    Bills: 310.45,
    Shopping: 180.99,
    Entertainment: 150.49,
    Other: 165.25,
  },
  {
    month: "May",
    Food: 458.77,
    Travel: 245.30,
    Bills: 325.45,
    Shopping: 189.99,
    Entertainment: 156.49,
    Other: 175.25,
  },
];

export const getCategoryColor = (category: string): string => {
  const matchedCategory = categoryTotals.find((c) => c.category === category);
  return matchedCategory ? matchedCategory.color : "#94a3b8"; // Default to slate-400
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};

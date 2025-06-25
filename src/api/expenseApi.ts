import { Expense } from "../types/Expense";

const API_URL = "https://expense-tracker-production-8347.up.railway.appapi/expenses";

export const fetchExpenses = async (): Promise<Expense[]> => {
  const response = await fetch(API_URL);
  return response.json();
};

export const addExpense = async (expense: Expense): Promise<Expense> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return response.json();
};

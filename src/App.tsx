import React, { useEffect, useState } from "react";
import { Expense } from "./types/Expense";
import { fetchExpenses, addExpense } from "./api/expenseApi";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import './App.css';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sortOption, setSortOption] = useState("none");
  const [dateFilter, setDateFilter] = useState("all");
  useEffect(() => {
    fetchExpenses().then(setExpenses);
  }, []);

  const handleAdd = async (expense: Expense) => {
    const newExpense = await addExpense(expense);
    setExpenses((prev) => [...prev, newExpense]);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const now = new Date();
  const dateFilteredExpenses = expenses.filter((expense) => {
  const expenseDate = new Date(expense.date);
  if (dateFilter === "week") {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return expenseDate >= oneWeekAgo && expenseDate <= now;
  } else if (dateFilter === "month") {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);
    return expenseDate >= oneMonthAgo && expenseDate <= now;
  }
  return true; // "all"
  });
  const filteredExpenses = expenses
  .filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  expense.amount.toString().includes(searchTerm)
)
  .sort((a, b) => {
    if (sortOption === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // newest first
    } else if (sortOption === "amountDesc") {
      return b.amount - a.amount;
    } else if (sortOption === "amountAsc") {
      return a.amount - b.amount;
    }
    return 0;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Expense Tracker</h1>
      <ExpenseForm onAdd={handleAdd} />
      <div>
        <h2>Summary</h2>
        <p>Total: ${expenses.reduce((sum, e) => sum + e.amount, 0)}</p>
        <p>Highest Expense: ${Math.max(...expenses.map(e => e.amount), 0)}</p>
      </div>
      <div className="filters">
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="none">Sort By</option>
        <option value="date">Date (Newest First)</option>
        <option value="amountDesc">Amount (High to Low)</option>
        <option value="amountAsc">Amount (Low to High)</option>
      </select>
      
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="week">Past Week</option>
        <option value="month">Past Month</option>
      </select>
      </div>
      <input
        type="text"
        placeholder="Search by description or amount"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ExpenseList expenses={filteredExpenses} setExpenses={setExpenses}/>
    </div>
  );
};

export default App;

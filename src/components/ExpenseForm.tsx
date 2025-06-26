import React, { useState } from "react";
import { Expense } from "../types/Expense";

interface Props {
  onAdd: (expense: Expense) => void;
}

const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState<string>('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
        alert("Amount must be greater than zero");
        return;
    }
    const today = new Date()
    const localDate=today.toLocaleDateString('en-CA');
    onAdd({ description, amount, date: localDate});
    setDescription("");
    setAmount(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        min={0.00}
        required
      />
      {/* { <label>Date: 
      {<input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
            required
        /> }
        </label> } */}
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;

import React, { useState } from "react";
import { Expense } from "../types/Expense";
import "../App.css"; 

interface Props {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpenseList: React.FC<Props> = ({ expenses, setExpenses }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedDesc, setEditedDesc] = useState('');
  const [editedAmount, setEditedAmount] = useState<number>(0);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`https://expense-tracker-production-8347.up.railway.app/api/expenses/${id}`, {
        method: 'DELETE',
      });
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id || null);
    setEditedDesc(expense.description);
    setEditedAmount(expense.amount);
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`https://expense-tracker-production-8347.up.railway.app/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, description: editedDesc, amount: editedAmount }),
      });

      const updated = await response.json();
      setExpenses(expenses.map(exp => (exp.id === id ? updated : exp)));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id} className="expense-item">
          {editingId === expense.id ? (
            <>
              <div className="expense-info">
                <input
                  type="text"
                  value={editedDesc}
                  onChange={(e) => setEditedDesc(e.target.value)}
                />
                <input
                  type="number"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(parseFloat(e.target.value))}
                />
              </div>
              <div className="expense-actions">
                <button onClick={() => handleSave(expense.id!)}>Save</button>
              </div>
            </>
          ) : (
            <>
              <span className="expense-info">
                {expense.description}: ${expense.amount.toFixed(2)}
              </span>
              <div className="expense-actions">
                <button onClick={() => handleEdit(expense)}>Edit</button>
                <button onClick={() => expense.id !== undefined && handleDelete(expense.id)}>Delete</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;

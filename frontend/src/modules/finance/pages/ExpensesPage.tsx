// @ts-nocheck
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { ExpenseList } from '../components/ExpenseList';
import { ExpenseForm } from '../components/ExpenseForm';

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  status: string;
  receipt?: string;
  budget?: { id: string; name: string };
}

interface Budget {
  id: string;
  name: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesRes, budgetsRes] = await Promise.all([
        fetch('/api/v1/finance/expenses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/v1/finance/budgets', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const expensesResult = await expensesRes.json();
      const budgetsResult = await budgetsRes.json();

      if (expensesResult.status === 'success') {
        setExpenses(expensesResult.data);
      }
      if (budgetsResult.status === 'success') {
        setBudgets(budgetsResult.data.map((b: any) => ({ id: b.id, name: b.name })));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (data: any) => {
    try {
      const response = await fetch('/api/v1/finance/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  const handleUpdateExpense = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/v1/finance/expenses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSelectedExpense(null);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[#8b5cf6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingCount = expenses.filter(e => e.status === 'Pending').length;
  const approvedCount = expenses.filter(e => e.status === 'Approved').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Expenses</h1>
          <p className="text-foreground/40">Track and manage expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#8b5cf6] text-black rounded-xl font-bold text-sm hover:bg-[#8b5cf6]/80"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <p className="text-sm text-foreground/40 mb-1">Total Expenses</p>
          <p className="text-2xl font-black text-foreground">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <p className="text-sm text-foreground/40 mb-1">Pending</p>
          <p className="text-2xl font-black text-yellow-500">{pendingCount}</p>
        </div>
        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <p className="text-sm text-foreground/40 mb-1">Approved</p>
          <p className="text-2xl font-black text-violet-500">{approvedCount}</p>
        </div>
      </div>

      <ExpenseList
        expenses={expenses}
        onAddExpense={() => setShowForm(true)}
        onSelectExpense={setSelectedExpense}
      />

      {showForm && (
        <ExpenseForm
          budgets={budgets}
          onSubmit={handleCreateExpense}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedExpense && (
        <ExpenseForm
          expense={selectedExpense}
          budgets={budgets}
          onSubmit={(data) => handleUpdateExpense(selectedExpense.id, data)}
          onClose={() => setSelectedExpense(null)}
        />
      )}
    </div>
  );
}
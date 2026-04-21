import { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  status: string;
  budget?: { name: string };
}

interface ExpenseListProps {
  expenses: Expense[];
  onAddExpense?: () => void;
  onSelectExpense?: (expense: Expense) => void;
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/20 text-yellow-500',
  Approved: 'bg-green-500/20 text-green-500',
  Rejected: 'bg-red-500/20 text-red-500',
  Reimbursed: 'bg-backgroundlue-500/20 text-blue-500',
};

const categoryIcons: Record<string, string> = {
  Supplies: '📦',
  Travel: '✈️',
  Equipment: '🔧',
  Services: '🔧',
  Other: '📄',
};

export function ExpenseList({ expenses, onAddExpense, onSelectExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || expense.status === statusFilter;
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(expenses.map(e => e.category))];

  return (
    <div className="bg-[#1a1d24] rounded-2xl border border-white/5">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Expenses</h2>
          {onAddExpense && (
            <button
              onClick={onAddExpense}
              className="flex items-center gap-2 px-4 py-2 bg-[#BAFF00] text-black rounded-xl font-bold text-sm hover:bg-[#BAFF00]/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder-white/40 text-sm focus:outline-none focus:border-[#BAFF00]/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-foreground/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground text-sm focus:outline-none focus:border-[#BAFF00]/50"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Reimbursed">Reimbursed</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground text-sm focus:outline-none focus:border-[#BAFF00]/50"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-foreground/40">
            No expenses found
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <div
              key={expense.id}
              onClick={() => onSelectExpense?.(expense)}
              className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                    {categoryIcons[expense.category] || '📄'}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{expense.description}</h4>
                    <div className="flex items-center gap-2 text-xs text-foreground/40">
                      <span>{expense.category}</span>
                      {expense.budget && (
                        <>
                          <span>•</span>
                          <span>{expense.budget.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-foreground">${expense.amount.toLocaleString()}</p>
                    <p className="text-xs text-foreground/40">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[expense.status]}`}>
                    {expense.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
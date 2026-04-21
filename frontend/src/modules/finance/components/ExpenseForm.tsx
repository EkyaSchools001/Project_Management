// @ts-nocheck
import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface ExpenseFormProps {
  expense?: {
    id: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    receipt?: string;
    budgetId?: string;
  };
  budgets?: { id: string; name: string }[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const categories = [
  'Supplies',
  'Travel',
  'Equipment',
  'Services',
  'Utilities',
  'Maintenance',
  'Other'
];

export function ExpenseForm({ expense, budgets, onSubmit, onClose }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: expense?.amount || 0,
    description: expense?.description || '',
    category: expense?.category || 'Supplies',
    date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    receipt: expense?.receipt || '',
    budgetId: expense?.budgetId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount as any),
      date: new Date(formData.date),
    });
  };

  return (
    <div className="fixed inset-0 bg-backgroundackgroundlack/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1d24] rounded-2xl p-6 w-full max-w-lg border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {expense ? 'Edit Expense' : 'Add Expense'}
          </h2>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-foreground/60 mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#BAFF00]/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/60 mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#BAFF00]/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/60 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#BAFF00]/50"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-foreground/60 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#BAFF00]/50"
              required
            />
          </div>

          {budgets && budgets.length > 0 && (
            <div>
              <label className="block text-sm text-foreground/60 mb-2">Budget</label>
              <select
                value={formData.budgetId}
                onChange={(e) => setFormData({ ...formData, budgetId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#BAFF00]/50"
              >
                <option value="">Select Budget (Optional)</option>
                {budgets.map(budget => (
                  <option key={budget.id} value={budget.id}>{budget.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm text-foreground/60 mb-2">Receipt</label>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-foreground/60">
                {formData.receipt ? formData.receipt : 'Click to upload receipt'}
              </p>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFormData({ ...formData, receipt: file.name });
                }}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-foreground font-bold hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#BAFF00] text-black rounded-xl font-bold hover:bg-[#BAFF00]/80 transition-colors"
            >
              {expense ? 'Update' : 'Add'} Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
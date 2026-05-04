import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { BudgetCard } from '../components/BudgetCard';
import { BudgetForm } from '../components/BudgetForm';

interface Budget {
  id: string;
  name: string;
  total: number;
  spent: number;
  period: string;
  startDate: string;
  endDate: string;
  project?: { name: string };
  department?: { name: string };
}

export default function BudgetsPage() {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/finance/budgets');
      if (response.data && response.data.status === 'success') {
        setBudgets(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (data: any) => {
    try {
      const response = await api.post('/finance/budgets', data);
      if (response.data && response.data.status === 'success') {
        setShowForm(false);
        fetchBudgets();
      }
    } catch (error) {
      console.error('Failed to create budget:', error);
    }
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = !periodFilter || budget.period === periodFilter;
    return matchesSearch && matchesPeriod;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[#ef4444] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Budgets</h1>
          <p className="text-foreground/40">Manage departmental and project budgets</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ef4444] text-black rounded-xl font-bold text-sm hover:bg-[#ef4444]/80"
        >
          <Plus className="w-4 h-4" /> Create Budget
        </button>
      </div>

      <div className="bg-[#1a1d24] rounded-2xl p-4 border border-white/5">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search budgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder-white/40 text-sm focus:outline-none focus:border-[#ef4444]/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-foreground/40" />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-foreground text-sm focus:outline-none focus:border-[#ef4444]/50"
            >
              <option value="">All Periods</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {filteredBudgets.length === 0 ? (
        <div className="bg-[#1a1d24] rounded-2xl p-12 border border-white/5 text-center">
          <p className="text-foreground/40 mb-4">No budgets found</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#ef4444] text-black rounded-xl font-bold text-sm hover:bg-[#ef4444]/80"
          >
            Create your first budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBudgets.map(budget => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onClick={() => setSelectedBudget(budget)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <BudgetForm
          onSubmit={handleCreateBudget}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
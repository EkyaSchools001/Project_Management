import { useState, useEffect } from 'react';
import { DollarSign, Receipt, FileText, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BudgetCard } from '../components/BudgetCard';
import { ExpenseList } from '../components/ExpenseList';
import { InvoiceCard } from '../components/InvoiceCard';
import { FinancialChart } from '../components/FinancialChart';

interface DashboardData {
  totalBudget: number;
  totalSpent: number;
  pendingExpenses: number;
  outstandingInvoices: number;
  totalIncome: number;
  recentExpenses: any[];
  recentInvoices: any[];
}

export default function FinanceDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/v1/finance/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await response.json();
      if (result.status === 'success') {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[#BAFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: data ? [
      data.totalIncome * 0.7,
      data.totalIncome * 0.8,
      data.totalIncome * 0.6,
      data.totalIncome * 0.9,
      data.totalIncome * 0.85,
      data.totalIncome
    ] : Array(6).fill(0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground">Finance Dashboard</h1>
          <p className="text-foreground/40">Financial overview and quick actions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/finance/expenses')}
            className="flex items-center gap-2 px-4 py-2 bg-[#BAFF00] text-black rounded-xl font-bold text-sm hover:bg-[#BAFF00]/80"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
          <button
            onClick={() => navigate('/finance/invoices')}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-foreground font-bold text-sm hover:bg-white/5"
          >
            <FileText className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#BAFF00]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#BAFF00]" />
            </div>
            <span className="text-sm text-foreground/40">Total Budget</span>
          </div>
          <p className="text-2xl font-black text-foreground">${(data?.totalBudget || 0).toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm text-foreground/40">Total Spent</span>
          </div>
          <p className="text-2xl font-black text-foreground">${(data?.totalSpent || 0).toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-sm text-foreground/40">Pending</span>
          </div>
          <p className="text-2xl font-black text-foreground">{data?.pendingExpenses || 0}</p>
        </div>

        <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-backgroundackgroundlue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-foreground/40">Outstanding</span>
          </div>
          <p className="text-2xl font-black text-foreground">{data?.outstandingInvoices || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FinancialChart
            type="revenue"
            data={chartData}
            title="Revenue Trend"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/finance/budgets')}
                className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl text-foreground hover:bg-white/10 transition-colors"
              >
                <span>Manage Budgets</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/finance/expenses')}
                className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl text-foreground hover:bg-white/10 transition-colors"
              >
                <span>View Expenses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/finance/invoices')}
                className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl text-foreground hover:bg-white/10 transition-colors"
              >
                <span>Invoices</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/finance/reports')}
                className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl text-foreground hover:bg-white/10 transition-colors"
              >
                <span>Reports</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Recent Expenses</h3>
            <button
              onClick={() => navigate('/finance/expenses')}
              className="text-sm text-[#BAFF00] hover:text-[#BAFF00]/80"
            >
              View all
            </button>
          </div>
          <ExpenseList expenses={data?.recentExpenses || []} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Recent Invoices</h3>
            <button
              onClick={() => navigate('/finance/invoices')}
              className="text-sm text-[#BAFF00] hover:text-[#BAFF00]/80"
            >
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {(data?.recentInvoices || []).map(invoice => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
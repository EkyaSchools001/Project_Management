import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface BudgetCardProps {
  budget: {
    id: string;
    name: string;
    total: number;
    spent: number;
    period: string;
    startDate: string;
    endDate: string;
  };
  onClick?: () => void;
}

export function BudgetCard({ budget, onClick }: BudgetCardProps) {
  const percentage = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;
  const remaining = budget.total - budget.spent;
  const isOverBudget = percentage > 100;

  const getStatusColor = () => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-yellow-500';
    return 'bg-violet-500';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5 cursor-pointer hover:border-[#8b5cf6]/30 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <div>
            <p className="font-bold text-foreground">{budget.name}</p>
            <p className="text-xs text-foreground/40">{budget.period}</p>
          </div>
        </div>
        {isOverBudget ? (
          <TrendingUp className="w-5 h-5 text-red-500" />
        ) : (
          <TrendingDown className="w-5 h-5 text-violet-500" />
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Spent</span>
          <span className="font-bold text-foreground">${budget.spent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Budget</span>
          <span className="font-bold text-foreground">${budget.total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Remaining</span>
          <span className={`font-bold ${isOverBudget ? 'text-red-500' : 'text-violet-500'}`}>
            ${remaining.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-foreground/40">Usage</span>
          <span className="text-foreground/60">{percentage.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${getStatusColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs text-foreground/40">
        <span>{new Date(budget.startDate).toLocaleDateString()}</span>
        <span>{new Date(budget.endDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
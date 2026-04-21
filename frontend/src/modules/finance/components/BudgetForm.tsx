// @ts-nocheck
import { useState } from 'react';
import { X } from 'lucide-react';

interface BudgetFormProps {
  budget?: {
    id: string;
    name: string;
    total: number;
    period: string;
    startDate: string;
    endDate: string;
    projectId?: string;
    departmentId?: string;
  };
  projects?: { id: string; name: string }[];
  departments?: { id: string; name: string }[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}

export function BudgetForm({ budget, projects, departments, onSubmit, onClose }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    name: budget?.name || '',
    total: budget?.total || 0,
    period: budget?.period || 'Monthly',
    startDate: budget?.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: budget?.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectId: budget?.projectId || '',
    departmentId: budget?.departmentId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      total: parseFloat(formData.total as any),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    });
  };

  return (
    <div className="fixed inset-0 bg-backgroundlack/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1d24] rounded-2xl p-6 w-full max-w-lg border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {budget ? 'Edit Budget' : 'Create Budget'}
          </h2>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-foreground/60 mb-2">Budget Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#8b5cf6]/50"
              placeholder="e.g., Q1 2024 Operating Budget"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/60 mb-2">Total Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.total}
              onChange={(e) => setFormData({ ...formData, total: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#8b5cf6]/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-foreground/60 mb-2">Period</label>
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#8b5cf6]/50"
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground/60 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#8b5cf6]/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-foreground/60 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#8b5cf6]/50"
                required
              />
            </div>
          </div>

          {projects && projects.length > 0 && (
            <div>
              <label className="block text-sm text-foreground/60 mb-2">Project (Optional)</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#8b5cf6]/50"
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
          )}

          {departments && departments.length > 0 && (
            <div>
              <label className="block text-sm text-foreground/60 mb-2">Department (Optional)</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-[#8b5cf6]/50"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          )}

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
              className="flex-1 px-4 py-3 bg-[#8b5cf6] text-black rounded-xl font-bold hover:bg-[#8b5cf6]/80 transition-colors"
            >
              {budget ? 'Update' : 'Create'} Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
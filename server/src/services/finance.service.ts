import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const financeService = {
  async getBudgets(filters?: { projectId?: string; departmentId?: string; period?: string }) {
    const where: any = {};
    if (filters?.projectId) where.projectId = filters.projectId;
    if (filters?.departmentId) where.departmentId = filters.departmentId;
    if (filters?.period) where.period = filters.period;
    return prisma.budget.findMany({
      where,
      include: { project: true, department: true, expenses: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getBudgetById(id: string) {
    return prisma.budget.findUnique({
      where: { id },
      include: { project: true, department: true, expenses: true }
    });
  },

  async createBudget(data: {
    name: string;
    total: number;
    period: string;
    startDate: Date;
    endDate: Date;
    projectId?: string;
    departmentId?: string;
  }) {
    return prisma.budget.create({ data });
  },

  async updateBudget(id: string, data: Partial<{
    name: string;
    total: number;
    period: string;
    startDate: Date;
    endDate: Date;
  }>) {
    return prisma.budget.update({ where: { id }, data });
  },

  async deleteBudget(id: string) {
    return prisma.budget.delete({ where: { id } });
  },

  async getExpenses(filters?: { budgetId?: string; category?: string; status?: string }) {
    const where: any = {};
    if (filters?.budgetId) where.budgetId = filters.budgetId;
    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;
    return prisma.expense.findMany({
      where,
      include: { budget: true, createdBy: true },
      orderBy: { date: 'desc' }
    });
  },

  async getExpenseById(id: string) {
    return prisma.expense.findUnique({
      where: { id },
      include: { budget: true, createdBy: true }
    });
  },

  async createExpense(data: {
    amount: number;
    description: string;
    category: string;
    date: Date;
    budgetId?: string;
    receipt?: string;
    createdById?: string;
  }) {
    const expense = await prisma.expense.create({ data });
    if (data.budgetId) {
      await prisma.budget.update({
        where: { id: data.budgetId },
        data: { spent: { increment: data.amount } }
      });
    }
    return expense;
  },

  async updateExpense(id: string, data: Partial<{
    amount: number;
    description: string;
    category: string;
    date: Date;
    receipt: string;
    status: string;
  }>) {
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (existing && data.amount && existing.budgetId) {
      const diff = data.amount - existing.amount;
      await prisma.budget.update({
        where: { id: existing.budgetId },
        data: { spent: { increment: diff } }
      });
    }
    return prisma.expense.update({ where: { id }, data });
  },

  async deleteExpense(id: string) {
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (expense?.budgetId) {
      await prisma.budget.update({
        where: { id: expense.budgetId },
        data: { spent: { decrement: expense.amount } }
      });
    }
    return prisma.expense.delete({ where: { id } });
  },

  async getInvoices(filters?: { status?: string; client?: string }) {
    const where: any = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.client) where.client = { contains: filters.client };
    return prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  },

  async getInvoiceById(id: string) {
    return prisma.invoice.findUnique({ where: { id } });
  },

  async createInvoice(data: {
    number: string;
    client: string;
    clientEmail?: string;
    amount: number;
    dueDate: Date;
    items: any;
    notes?: string;
  }) {
    return prisma.invoice.create({ data });
  },

  async updateInvoice(id: string, data: Partial<{
    client: string;
    clientEmail: string;
    amount: number;
    dueDate: Date;
    items: any;
    notes: string;
    status: string;
    paidDate: Date;
  }>) {
    return prisma.invoice.update({ where: { id }, data });
  },

  async deleteInvoice(id: string) {
    return prisma.invoice.delete({ where: { id } });
  },

  async getVendors(filters?: { category?: string }) {
    const where: any = {};
    if (filters?.category) where.category = filters.category;
    return prisma.vendor.findMany({
      where,
      include: { purchaseOrders: true },
      orderBy: { name: 'asc' }
    });
  },

  async getVendorById(id: string) {
    return prisma.vendor.findUnique({
      where: { id },
      include: { purchaseOrders: true }
    });
  },

  async createVendor(data: {
    name: string;
    email?: string;
    phone?: string;
    category: string;
    address?: string;
  }) {
    return prisma.vendor.create({ data });
  },

  async updateVendor(id: string, data: Partial<{
    name: string;
    email: string;
    phone: string;
    category: string;
    address: string;
  }>) {
    return prisma.vendor.update({ where: { id }, data });
  },

  async deleteVendor(id: string) {
    return prisma.vendor.delete({ where: { id } });
  },

  async getPurchaseOrders(filters?: { vendorId?: string; status?: string }) {
    const where: any = {};
    if (filters?.vendorId) where.vendorId = filters.vendorId;
    if (filters?.status) where.status = filters.status;
    return prisma.purchaseOrder.findMany({
      where,
      include: { vendor: true, approvedBy: true },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getPurchaseOrderById(id: string) {
    return prisma.purchaseOrder.findUnique({
      where: { id },
      include: { vendor: true, approvedBy: true }
    });
  },

  async createPurchaseOrder(data: {
    vendorId: string;
    items: any;
    total: number;
    notes?: string;
  }) {
    return prisma.purchaseOrder.create({ data });
  },

  async updatePurchaseOrder(id: string, data: Partial<{
    items: any;
    total: number;
    status: string;
    approvedById: string;
    notes: string;
  }>) {
    return prisma.purchaseOrder.update({ where: { id }, data });
  },

  async deletePurchaseOrder(id: string) {
    return prisma.purchaseOrder.delete({ where: { id } });
  },

  async generateFinancialReport(type: string, period: string, userId: string) {
    const where: any = {};
    const periodStart = new Date(period);
    const periodEnd = new Date(period);
    
    if (type === 'Expense' || type === 'ProfitLoss') {
      where.date = { gte: periodStart, lte: periodEnd };
    }
    
    const expenses = await prisma.expense.findMany({ where });
    const invoices = type === 'Income' || type === 'ProfitLoss' 
      ? await prisma.invoice.findMany({ where: { status: 'Paid' } })
      : [];
    
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = invoices.reduce((sum, i) => sum + i.amount, 0);
    
    const data = {
      type,
      period,
      totalExpenses,
      totalIncome,
      netIncome: type === 'ProfitLoss' ? totalIncome - totalExpenses : null,
      expenseCount: expenses.length,
      invoiceCount: invoices.length,
      expensesByCategory: expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {}),
      generatedAt: new Date()
    };

    return prisma.financialReport.create({
      data: {
        type: type as any,
        period,
        data,
        generatedById: userId
      }
    });
  },

  async getFinancialReports(filters?: { type?: string; period?: string }) {
    const where: any = {};
    if (filters?.type) where.type = filters.type as any;
    if (filters?.period) where.period = filters.period;
    return prisma.financialReport.findMany({
      where,
      include: { generatedBy: true },
      orderBy: { generatedAt: 'desc' }
    });
  },

  async getDashboardData() {
    const [totalBudgets, totalExpenses, pendingExpenses, outstandingInvoices, recentExpenses, recentInvoices] = await Promise.all([
      prisma.budget.aggregate({ _sum: { total: true } }),
      prisma.budget.aggregate({ _sum: { spent: true } }),
      prisma.expense.count({ where: { status: 'Pending' } }),
      prisma.invoice.count({ where: { status: { in: ['Sent', 'Overdue'] } } }),
      prisma.expense.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { budget: true } }),
      prisma.invoice.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
    ]);

    const incomeResult = await prisma.invoice.aggregate({
      where: { status: 'Paid' },
      _sum: { amount: true }
    });

    return {
      totalBudget: totalBudgets._sum.total || 0,
      totalSpent: totalExpenses._sum.spent || 0,
      pendingExpenses,
      outstandingInvoices,
      totalIncome: incomeResult._sum.amount || 0,
      recentExpenses,
      recentInvoices
    };
  },

  async calculatePnL(startDate: Date, endDate: Date) {
    const [expenses, income] = await Promise.all([
      prisma.expense.findMany({
        where: { date: { gte: startDate, lte: endDate }, status: 'Approved' }
      }),
      prisma.invoice.findMany({
        where: { status: 'Paid', paidDate: { gte: startDate, lte: endDate } }
      })
    ]);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      profitMargin: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
    };
  }
};
import { Request, Response } from 'express';
import { financeService } from '../services/finance.service';

export const financeController = {
  async getBudgets(req: Request, res: Response) {
    try {
      const budgets = await financeService.getBudgets(req.query);
      res.json({ status: 'success', data: budgets });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch budgets' });
    }
  },

  async getBudgetById(req: Request, res: Response) {
    try {
      const budget = await financeService.getBudgetById(req.params.i as string);
      if (!budget) return res.status(404).json({ error: 'Budget not found' });
      res.json({ status: 'success', data: budget });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch budget' });
    }
  },

  async createBudget(req: Request, res: Response) {
    try {
      const budget = await financeService.createBudget(req.body);
      res.status(201).json({ status: 'success', data: budget });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create budget' });
    }
  },

  async updateBudget(req: Request, res: Response) {
    try {
      const budget = await financeService.updateBudget(req.params.i as string, req.body);
      res.json({ status: 'success', data: budget });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update budget' });
    }
  },

  async deleteBudget(req: Request, res: Response) {
    try {
      await financeService.deleteBudget(req.params.i as string);
      res.json({ status: 'success', message: 'Budget deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete budget' });
    }
  },

  async getExpenses(req: Request, res: Response) {
    try {
      const expenses = await financeService.getExpenses(req.query);
      res.json({ status: 'success', data: expenses });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expenses' });
    }
  },

  async getExpenseById(req: Request, res: Response) {
    try {
      const expense = await financeService.getExpenseById(req.params.i as string);
      if (!expense) return res.status(404).json({ error: 'Expense not found' });
      res.json({ status: 'success', data: expense });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expense' });
    }
  },

  async createExpense(req: Request, res: Response) {
    try {
      const expense = await financeService.createExpense(req.body);
      res.status(201).json({ status: 'success', data: expense });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create expense' });
    }
  },

  async updateExpense(req: Request, res: Response) {
    try {
      const expense = await financeService.updateExpense(req.params.i as string, req.body);
      res.json({ status: 'success', data: expense });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update expense' });
    }
  },

  async deleteExpense(req: Request, res: Response) {
    try {
      await financeService.deleteExpense(req.params.i as string);
      res.json({ status: 'success', message: 'Expense deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  },

  async getInvoices(req: Request, res: Response) {
    try {
      const invoices = await financeService.getInvoices(req.query);
      res.json({ status: 'success', data: invoices });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  },

  async getInvoiceById(req: Request, res: Response) {
    try {
      const invoice = await financeService.getInvoiceById(req.params.i as string);
      if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
      res.json({ status: 'success', data: invoice });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch invoice' });
    }
  },

  async createInvoice(req: Request, res: Response) {
    try {
      const invoice = await financeService.createInvoice(req.body);
      res.status(201).json({ status: 'success', data: invoice });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  },

  async updateInvoice(req: Request, res: Response) {
    try {
      const invoice = await financeService.updateInvoice(req.params.i as string, req.body);
      res.json({ status: 'success', data: invoice });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update invoice' });
    }
  },

  async deleteInvoice(req: Request, res: Response) {
    try {
      await financeService.deleteInvoice(req.params.i as string);
      res.json({ status: 'success', message: 'Invoice deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete invoice' });
    }
  },

  async getVendors(req: Request, res: Response) {
    try {
      const vendors = await financeService.getVendors(req.query);
      res.json({ status: 'success', data: vendors });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vendors' });
    }
  },

  async getVendorById(req: Request, res: Response) {
    try {
      const vendor = await financeService.getVendorById(req.params.i as string);
      if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
      res.json({ status: 'success', data: vendor });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vendor' });
    }
  },

  async createVendor(req: Request, res: Response) {
    try {
      const vendor = await financeService.createVendor(req.body);
      res.status(201).json({ status: 'success', data: vendor });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create vendor' });
    }
  },

  async updateVendor(req: Request, res: Response) {
    try {
      const vendor = await financeService.updateVendor(req.params.i as string, req.body);
      res.json({ status: 'success', data: vendor });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update vendor' });
    }
  },

  async deleteVendor(req: Request, res: Response) {
    try {
      await financeService.deleteVendor(req.params.i as string);
      res.json({ status: 'success', message: 'Vendor deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete vendor' });
    }
  },

  async getPurchaseOrders(req: Request, res: Response) {
    try {
      const orders = await financeService.getPurchaseOrders(req.query);
      res.json({ status: 'success', data: orders });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch purchase orders' });
    }
  },

  async getPurchaseOrderById(req: Request, res: Response) {
    try {
      const order = await financeService.getPurchaseOrderById(req.params.i as string);
      if (!order) return res.status(404).json({ error: 'Purchase order not found' });
      res.json({ status: 'success', data: order });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch purchase order' });
    }
  },

  async createPurchaseOrder(req: Request, res: Response) {
    try {
      const order = await financeService.createPurchaseOrder(req.body);
      res.status(201).json({ status: 'success', data: order });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create purchase order' });
    }
  },

  async updatePurchaseOrder(req: Request, res: Response) {
    try {
      const order = await financeService.updatePurchaseOrder(req.params.i as string, req.body);
      res.json({ status: 'success', data: order });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update purchase order' });
    }
  },

  async deletePurchaseOrder(req: Request, res: Response) {
    try {
      await financeService.deletePurchaseOrder(req.params.i as string);
      res.json({ status: 'success', message: 'Purchase order deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete purchase order' });
    }
  },

  async generateReport(req: Request, res: Response) {
    try {
      const { type, period } = req.body;
      const userId = (req as any).user?.id;
      const report = await financeService.generateFinancialReport(type, period, userId);
      res.status(201).json({ status: 'success', data: report });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate report' });
    }
  },

  async getReports(req: Request, res: Response) {
    try {
      const reports = await financeService.getFinancialReports(req.query);
      res.json({ status: 'success', data: reports });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  },

  async getDashboard(req: Request, res: Response) {
    try {
      const dashboard = await financeService.getDashboardData();
      res.json({ status: 'success', data: dashboard });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  },

  async getPnL(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const pnl = await financeService.calculatePnL(new Date(startDate as string), new Date(endDate as string));
      res.json({ status: 'success', data: pnl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to calculate P&L' });
    }
  }
};
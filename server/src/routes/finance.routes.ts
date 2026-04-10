import { Router } from 'express';
import { financeController } from '../controllers/finance.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

// Budget Routes
router.get('/budgets', financeController.getBudgets);
router.post('/budgets', financeController.createBudget);
router.get('/budgets/:id', financeController.getBudgetById);
router.patch('/budgets/:id', financeController.updateBudget);
router.delete('/budgets/:id', financeController.deleteBudget);

// Expense Routes
router.get('/expenses', financeController.getExpenses);
router.post('/expenses', financeController.createExpense);
router.get('/expenses/:id', financeController.getExpenseById);
router.patch('/expenses/:id', financeController.updateExpense);
router.delete('/expenses/:id', financeController.deleteExpense);

// Invoice Routes
router.get('/invoices', financeController.getInvoices);
router.post('/invoices', financeController.createInvoice);
router.get('/invoices/:id', financeController.getInvoiceById);
router.patch('/invoices/:id', financeController.updateInvoice);
router.delete('/invoices/:id', financeController.deleteInvoice);

// Vendor Routes
router.get('/vendors', financeController.getVendors);
router.post('/vendors', financeController.createVendor);
router.get('/vendors/:id', financeController.getVendorById);
router.patch('/vendors/:id', financeController.updateVendor);
router.delete('/vendors/:id', financeController.deleteVendor);

// Purchase Order Routes
router.get('/purchase-orders', financeController.getPurchaseOrders);
router.post('/purchase-orders', financeController.createPurchaseOrder);
router.get('/purchase-orders/:id', financeController.getPurchaseOrderById);
router.patch('/purchase-orders/:id', financeController.updatePurchaseOrder);
router.delete('/purchase-orders/:id', financeController.deletePurchaseOrder);

// Reports Routes
router.get('/reports', financeController.getReports);
router.post('/reports', financeController.generateReport);

// Dashboard & Analytics
router.get('/dashboard', financeController.getDashboard);
router.get('/pnl', financeController.getPnL);

export default router;
import { Router } from 'express';
import { financeController } from '../controllers/finance.controller';
import { protect as authenticate } from '../middlewares/auth';
import { checkPermission } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

// Budget Routes
router.get('/budgets', checkPermission('Expense Tracking', 'view'), financeController.getBudgets);
router.post('/budgets', checkPermission('Expense Tracking', 'create'), financeController.createBudget);
router.get('/budgets/:id', checkPermission('Expense Tracking', 'view'), financeController.getBudgetById);
router.patch('/budgets/:id', checkPermission('Expense Tracking', 'edit'), financeController.updateBudget);
router.delete('/budgets/:id', checkPermission('Expense Tracking', 'delete'), financeController.deleteBudget);

// Expense Routes
router.get('/expenses', checkPermission('Expense Tracking', 'view'), financeController.getExpenses);
router.post('/expenses', checkPermission('Expense Tracking', 'create'), financeController.createExpense);
router.get('/expenses/:id', checkPermission('Expense Tracking', 'view'), financeController.getExpenseById);
router.patch('/expenses/:id', checkPermission('Expense Tracking', 'edit'), financeController.updateExpense);
router.delete('/expenses/:id', checkPermission('Expense Tracking', 'delete'), financeController.deleteExpense);

// Invoice Routes
router.get('/invoices', checkPermission('Payments', 'view'), financeController.getInvoices);
router.post('/invoices', checkPermission('Payments', 'create'), financeController.createInvoice);
router.get('/invoices/:id', checkPermission('Payments', 'view'), financeController.getInvoiceById);
router.patch('/invoices/:id', checkPermission('Payments', 'edit'), financeController.updateInvoice);
router.delete('/invoices/:id', checkPermission('Payments', 'delete'), financeController.deleteInvoice);

// Vendor Routes
router.get('/vendors', checkPermission('Payments', 'view'), financeController.getVendors);
router.post('/vendors', checkPermission('Payments', 'create'), financeController.createVendor);
router.get('/vendors/:id', checkPermission('Payments', 'view'), financeController.getVendorById);
router.patch('/vendors/:id', checkPermission('Payments', 'edit'), financeController.updateVendor);
router.delete('/vendors/:id', checkPermission('Payments', 'delete'), financeController.deleteVendor);

// Purchase Order Routes
router.get('/purchase-orders', checkPermission('Payments', 'view'), financeController.getPurchaseOrders);
router.post('/purchase-orders', checkPermission('Payments', 'create'), financeController.createPurchaseOrder);
router.get('/purchase-orders/:id', checkPermission('Payments', 'view'), financeController.getPurchaseOrderById);
router.patch('/purchase-orders/:id', checkPermission('Payments', 'edit'), financeController.updatePurchaseOrder);
router.delete('/purchase-orders/:id', checkPermission('Payments', 'delete'), financeController.deletePurchaseOrder);

// Reports Routes
router.get('/reports', checkPermission('Finance Reports', 'view'), financeController.getReports);
router.post('/reports', checkPermission('Finance Reports', 'create'), financeController.generateReport);

// Dashboard & Analytics
router.get('/dashboard', checkPermission('Finance Analytics', 'view'), financeController.getDashboard);
router.get('/pnl', checkPermission('Finance Analytics', 'view'), financeController.getPnL);

export default router;

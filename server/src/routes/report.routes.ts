import { Router } from 'express';
import * as reportController from '../controllers/report.controller';

const router = Router();

router.get('/', reportController.getAllReports);
router.post('/', reportController.createReport);
router.get('/templates', reportController.getTemplates);
router.get('/datasources', reportController.getDataSources);
router.get('/schedules', reportController.getSchedules);
router.post('/schedule', reportController.scheduleReport);
router.post('/generate', reportController.generateReport);
router.get('/:id', reportController.getReport);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);
router.post('/:id/export', reportController.exportReport);

export default router;

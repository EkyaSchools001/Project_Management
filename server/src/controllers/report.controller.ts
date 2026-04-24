import { Request, Response } from 'express';
import * as reportService from '../services/report.service';

export const getAllReports = reportService.getReports;
export const getReport = reportService.getReportById;
export const createReport = reportService.createReport;
export const updateReport = reportService.updateReport;
export const deleteReport = reportService.deleteReport;
export const generateReport = reportService.generateReportData;
export const exportReport = reportService.exportReport;
export const scheduleReport = reportService.scheduleReport;
export const getSchedules = reportService.getReportSchedules;
export const getTemplates = reportService.getReportTemplates;
export const getDataSources = reportService.getDataSources;

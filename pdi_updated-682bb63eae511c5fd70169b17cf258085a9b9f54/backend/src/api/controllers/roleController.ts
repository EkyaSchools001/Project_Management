import { Request, Response } from 'express';
import prisma from '../../infrastructure/database/prisma';

const getParam = (param: string | string[] | undefined): string => {
  return Array.isArray(param) ? param[0] : (param || '');
};

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.customRole.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    const defaultRoles = [
      { id: 'SUPERADMIN', name: 'SUPERADMIN', displayName: 'Super Admin', isDefault: true, color: '#9333ea' },
      { id: 'ADMIN', name: 'ADMIN', displayName: 'Admin', isDefault: true, color: '#3b82f6' },
      { id: 'LEADER', name: 'LEADER', displayName: 'Leader', isDefault: true, color: '#22c55e' },
      { id: 'MANAGEMENT', name: 'MANAGEMENT', displayName: 'Management', isDefault: true, color: '#f97316' },
      { id: 'TEACHER', name: 'TEACHER', displayName: 'Teacher', isDefault: true, color: '#14b8a6' },
    ];

    const allRoles = [...defaultRoles, ...roles.map(r => ({ ...r, isDefault: false }))];
    res.json({ status: 'success', data: allRoles });
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, displayName, description, permissions, color } = req.body;

    const maxOrder = await prisma.customRole.aggregate({
      _max: { order: true }
    });

    const role = await prisma.customRole.create({
      data: {
        name: name.toUpperCase().replace(/\s+/g, '_'),
        displayName,
        description,
        permissions: permissions ? JSON.stringify(permissions) : null,
        color: color || '#6366f1',
        order: (maxOrder._max.order || 0) + 1
      }
    });
    res.status(201).json({ status: 'success', data: role });
  } catch (error: any) {
    console.error('Error creating role:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { displayName, description, permissions, color, isActive, order } = req.body;

    const role = await prisma.customRole.update({
      where: { id },
      data: {
        ...(displayName && { displayName }),
        ...(description !== undefined && { description }),
        ...(permissions && { permissions: JSON.stringify(permissions) }),
        ...(color && { color }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order })
      }
    });
    res.json({ status: 'success', data: role });
  } catch (error: any) {
    console.error('Error updating role:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    await prisma.customRole.delete({ where: { id } });
    res.json({ status: 'success', message: 'Role deleted' });
  } catch (error: any) {
    console.error('Error deleting role:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.dashboardTemplate.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json({ status: 'success', data: templates });
  } catch (error: any) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, category, widgets } = req.body;
    const template = await prisma.dashboardTemplate.create({
      data: {
        name,
        description,
        category,
        widgets: JSON.stringify(widgets || [])
      }
    });
    res.status(201).json({ status: 'success', data: template });
  } catch (error: any) {
    console.error('Error creating template:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { name, description, category, widgets, isActive } = req.body;
    const template = await prisma.dashboardTemplate.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(widgets && { widgets: JSON.stringify(widgets) }),
        ...(isActive !== undefined && { isActive })
      }
    });
    res.json({ status: 'success', data: template });
  } catch (error: any) {
    console.error('Error updating template:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    await prisma.dashboardTemplate.delete({ where: { id } });
    res.json({ status: 'success', message: 'Template deleted' });
  } catch (error: any) {
    console.error('Error deleting template:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const applyTemplate = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { role, name } = req.body;

    const template = await prisma.dashboardTemplate.findUnique({ where: { id } });
    if (!template) {
      return res.status(404).json({ status: 'error', message: 'Template not found' });
    }

    const widgets = JSON.parse(template.widgets || '[]');

    const dashboard = await prisma.dashboard.create({
      data: {
        name: name || template.name,
        description: template.description,
        role: role.toUpperCase(),
        isDefault: false,
        order: 0
      }
    });

    for (let i = 0; i < widgets.length; i++) {
      const w = widgets[i];
      await prisma.dashboardWidget.create({
        data: {
          dashboardId: dashboard.id,
          widgetType: w.widgetType,
          title: w.title,
          dataSource: w.dataSource,
          config: w.config ? JSON.stringify(w.config) : null,
          positionX: w.positionX || (i % 4),
          positionY: w.positionY || Math.floor(i / 4),
          width: w.width || 4,
          height: w.height || 3,
          order: i,
          isVisible: w.isVisible !== false
        }
      });
    }

    const created = await prisma.dashboard.findUnique({
      where: { id: dashboard.id },
      include: { widgets: { orderBy: { order: 'asc' } } }
    });

    res.status(201).json({ status: 'success', data: created });
  } catch (error: any) {
    console.error('Error applying template:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

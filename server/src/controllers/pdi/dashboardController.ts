import { Request, Response } from 'express';
import { prisma } from '../../app';
import { getIO } from '../../socket';

const broadcastDashboardUpdate = (data: any) => {
  try {
    const io = getIO();
    io.emit('DASHBOARD_UPDATED', data);
    console.log('[SOCKET] Broadcasted DASHBOARD_UPDATED');
  } catch (err) {
    console.error('[SOCKET] Failed to broadcast dashboard update:', err);
  }
};

const getParam = (param: string | string[] | undefined): string => {
  return Array.isArray(param) ? param[0] : (param || '');
};

export const getDashboards = async (req: Request, res: Response) => {
  try {
    const dashboards = await prisma.dashboard.findMany({
      where: { isActive: true },
      include: { widgets: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' }
    });
    res.json({ status: 'success', data: dashboards });
  } catch (error: any) {
    console.error('Error fetching dashboards:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const dashboard = await prisma.dashboard.findUnique({
      where: { id },
      include: { widgets: { orderBy: { order: 'asc' } } }
    });
    if (!dashboard) {
      return res.status(404).json({ status: 'error', message: 'Dashboard not found' });
    }
    res.json({ status: 'success', data: dashboard });
  } catch (error: any) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getDashboardsByRole = async (req: Request, res: Response) => {
  try {
    const role = getParam(req.params.role);
    const dashboards = await prisma.dashboard.findMany({
      where: { role: role.toUpperCase(), isActive: true },
      include: { widgets: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' }
    });
    res.json({ status: 'success', data: dashboards });
  } catch (error: any) {
    console.error('Error fetching dashboards by role:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createDashboard = async (req: Request, res: Response) => {
  try {
    const { name, description, role, isDefault, order } = req.body;
    const roleUpper = role?.toUpperCase();

    if (isDefault && role) {
      await prisma.dashboard.updateMany({
        where: { role: roleUpper },
        data: { isDefault: false }
      });
    }

    const dashboard = await prisma.dashboard.create({
      data: {
        name,
        description,
        role: roleUpper,
        isDefault: isDefault || false,
        order: order || 0
      },
      include: { widgets: true }
    });

    broadcastDashboardUpdate({ action: 'CREATED', dashboardId: dashboard.id, role: dashboard.role });

    res.status(201).json({ status: 'success', data: dashboard });
  } catch (error: any) {
    console.error('Error creating dashboard:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateDashboard = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { name, description, role, isDefault, isActive, order } = req.body;
    const roleUpper = role?.toUpperCase();

    if (isDefault && role) {
      await prisma.dashboard.updateMany({
        where: { role: roleUpper },
        data: { isDefault: false }
      });
    }

    const dashboard = await prisma.dashboard.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(role && { role: roleUpper }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order })
      },
      include: { widgets: { orderBy: { order: 'asc' } } }
    });

    broadcastDashboardUpdate({ action: 'UPDATED', dashboardId: id, role: dashboard.role });

    res.json({ status: 'success', data: dashboard });
  } catch (error: any) {
    console.error('Error updating dashboard:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteDashboard = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const dashboard = await prisma.dashboard.findUnique({ where: { id } });
    await prisma.dashboard.delete({ where: { id } });

    if (dashboard) {
      broadcastDashboardUpdate({ action: 'DELETED', dashboardId: id, role: dashboard.role });
    }

    res.json({ status: 'success', message: 'Dashboard deleted' });
  } catch (error: any) {
    console.error('Error deleting dashboard:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addWidget = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { widgetType, title, dataSource, config, positionX, positionY, width, height, refreshInterval } = req.body;

    const maxOrder = await prisma.dashboardWidget.aggregate({
      where: { dashboardId: id },
      _max: { order: true }
    });

    const widget = await prisma.dashboardWidget.create({
      data: {
        dashboardId: id,
        widgetType,
        title,
        dataSource,
        config: config ? JSON.stringify(config) : null,
        positionX: positionX || 0,
        positionY: positionY || 0,
        width: width || 4,
        height: height || 3,
        order: (maxOrder._max.order || 0) + 1,
        refreshInterval
      }
    });

    const dashboard = await prisma.dashboard.findUnique({ where: { id } });
    broadcastDashboardUpdate({ 
      action: 'WIDGET_ADDED', 
      dashboardId: id, 
      widgetId: widget.id,
      role: dashboard?.role 
    });

    res.status(201).json({ status: 'success', data: widget });
  } catch (error: any) {
    console.error('Error adding widget:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateWidget = async (req: Request, res: Response) => {
  try {
    const widgetId = getParam(req.params.widgetId);
    const { title, dataSource, config, positionX, positionY, width, height, isVisible, refreshInterval, order } = req.body;

    const widget = await prisma.dashboardWidget.update({
      where: { id: widgetId },
      data: {
        ...(title && { title }),
        ...(dataSource !== undefined && { dataSource }),
        ...(config && { config: JSON.stringify(config) }),
        ...(positionX !== undefined && { positionX }),
        ...(positionY !== undefined && { positionY }),
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(isVisible !== undefined && { isVisible }),
        ...(refreshInterval !== undefined && { refreshInterval }),
        ...(order !== undefined && { order })
      }
    });

    const dashboard = await prisma.dashboard.findUnique({ where: { id: widget.dashboardId } });
    broadcastDashboardUpdate({ 
      action: 'WIDGET_UPDATED', 
      dashboardId: widget.dashboardId, 
      widgetId: widget.id,
      role: dashboard?.role 
    });

    res.json({ status: 'success', data: widget });
  } catch (error: any) {
    console.error('Error updating widget:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteWidget = async (req: Request, res: Response) => {
  try {
    const widgetId = getParam(req.params.widgetId);
    const widget = await prisma.dashboardWidget.findUnique({ where: { id: widgetId } });
    await prisma.dashboardWidget.delete({ where: { id: widgetId } });

    if (widget) {
      const dashboard = await prisma.dashboard.findUnique({ where: { id: widget.dashboardId } });
      broadcastDashboardUpdate({ 
        action: 'WIDGET_DELETED', 
        dashboardId: widget.dashboardId, 
        widgetId,
        role: dashboard?.role 
      });
    }

    res.json({ status: 'success', message: 'Widget deleted' });
  } catch (error: any) {
    console.error('Error deleting widget:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const reorderWidgets = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { widgets } = req.body;

    await Promise.all(widgets.map((w: any) =>
      prisma.dashboardWidget.update({
        where: { id: w.id },
        data: {
          order: w.order,
          positionX: w.positionX,
          positionY: w.positionY
        }
      })
    ));

    const updated = await prisma.dashboardWidget.findMany({
      where: { dashboardId: id },
      orderBy: { order: 'asc' }
    });
    res.json({ status: 'success', data: updated });
  } catch (error: any) {
    console.error('Error reordering widgets:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getWidgetTypes = async (req: Request, res: Response) => {
  try {
    const types = await prisma.widgetType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json({ status: 'success', data: types });
  } catch (error: any) {
    console.error('Error fetching widget types:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createWidgetType = async (req: Request, res: Response) => {
  try {
    const { name, displayName, description, icon, configSchema } = req.body;
    const type = await prisma.widgetType.create({
      data: {
        name: name.toLowerCase().replace(/\s+/g, '_'),
        displayName,
        description,
        icon,
        configSchema: configSchema ? JSON.stringify(configSchema) : null
      }
    });
    res.status(201).json({ status: 'success', data: type });
  } catch (error: any) {
    console.error('Error creating widget type:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateWidgetType = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { displayName, description, icon, configSchema, isActive } = req.body;
    const type = await prisma.widgetType.update({
      where: { id },
      data: {
        ...(displayName && { displayName }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(configSchema && { configSchema: JSON.stringify(configSchema) }),
        ...(isActive !== undefined && { isActive })
      }
    });
    res.json({ status: 'success', data: type });
  } catch (error: any) {
    console.error('Error updating widget type:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteWidgetType = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    await prisma.widgetType.delete({ where: { id } });
    res.json({ status: 'success', message: 'Widget type deleted' });
  } catch (error: any) {
    console.error('Error deleting widget type:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const setDefaultDashboard = async (req: Request, res: Response) => {
  try {
    const role = getParam(req.params.role);
    const id = getParam(req.params.id);

    await prisma.dashboard.updateMany({
      where: { role: role.toUpperCase() },
      data: { isDefault: false }
    });

    const dashboard = await prisma.dashboard.update({
      where: { id },
      data: { isDefault: true }
    });

    res.json({ status: 'success', data: dashboard });
  } catch (error: any) {
    console.error('Error setting default dashboard:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

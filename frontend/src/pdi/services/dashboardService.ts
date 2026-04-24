import api from "@pdi/lib/api";

export interface DashboardWidget {
  id: string;
  dashboardId: string;
  widgetType: string;
  title: string;
  dataSource?: string;
  config?: any;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  order: number;
  isVisible: boolean;
  refreshInterval?: number;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  role: string;
  isDefault: boolean;
  isActive: boolean;
  order: number;
  widgets: DashboardWidget[];
}

export interface WidgetType {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  configSchema?: any;
}

export const dashboardService = {
  getAll: async () => {
    const response = await api.get("/dashboards");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/dashboards/${id}`);
    return response.data;
  },

  getByRole: async (role: string) => {
    const response = await api.get(`/dashboards/role/${role}`);
    return response.data;
  },

  create: async (data: Partial<Dashboard>) => {
    const response = await api.post("/dashboards", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Dashboard>) => {
    const response = await api.put(`/dashboards/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/dashboards/${id}`);
    return response.data;
  },

  addWidget: async (dashboardId: string, widget: Partial<DashboardWidget>) => {
    const response = await api.post(`/dashboards/${dashboardId}/widgets`, widget);
    return response.data;
  },

  updateWidget: async (dashboardId: string, widgetId: string, widget: Partial<DashboardWidget>) => {
    const response = await api.put(`/dashboards/${dashboardId}/widgets/${widgetId}`, widget);
    return response.data;
  },

  deleteWidget: async (dashboardId: string, widgetId: string) => {
    const response = await api.delete(`/dashboards/${dashboardId}/widgets/${widgetId}`);
    return response.data;
  },

  reorderWidgets: async (dashboardId: string, widgets: { id: string; order: number; positionX: number; positionY: number }[]) => {
    const response = await api.put(`/dashboards/${dashboardId}/widgets/reorder`, { widgets });
    return response.data;
  },

  getWidgetTypes: async () => {
    const response = await api.get("/dashboards/widget-types/list");
    return response.data;
  },

  createWidgetType: async (data: Partial<WidgetType>) => {
    const response = await api.post("/dashboards/widget-types", data);
    return response.data;
  },

  updateWidgetType: async (id: string, data: Partial<WidgetType>) => {
    const response = await api.put(`/dashboards/widget-types/${id}`, data);
    return response.data;
  },

  deleteWidgetType: async (id: string) => {
    const response = await api.delete(`/dashboards/widget-types/${id}`);
    return response.data;
  },

  setDefault: async (role: string, id: string) => {
    const response = await api.put(`/dashboards/role/${role}/set-default/${id}`);
    return response.data;
  },
};

import { useState, useEffect } from 'react';
import { dashboardService, Dashboard, DashboardWidget } from '@pdi/services/dashboardService';
import api from '@pdi/lib/api';

export function useCustomDashboard(role: string) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [widgetData, setWidgetData] = useState<Record<string, any>>({});
  const [useCustom, setUseCustom] = useState<boolean | null>(null);

  useEffect(() => {
    const loadCustomDashboard = async () => {
      try {
        const res = await dashboardService.getByRole(role.toUpperCase());
        if (res.status === 'success' && res.data.length > 0) {
          const defaultDash = res.data.find((d: Dashboard) => d.isDefault) || res.data[0];
          if (defaultDash.widgets && defaultDash.widgets.length > 0) {
            setDashboard(defaultDash);
            setUseCustom(true);

            // Load widget data in parallel
            const dataPromises = defaultDash.widgets
              .filter((w: DashboardWidget) => w.dataSource)
              .map(async (widget: DashboardWidget) => {
                try {
                  const response = await api.get(widget.dataSource!);
                  return { [widget.id]: response.data };
                } catch {
                  return { [widget.id]: null };
                }
              });

            const dataResults = await Promise.all(dataPromises);
            const allData = Object.assign({}, ...dataResults);
            setWidgetData(allData);
          } else {
            setUseCustom(false);
          }
        } else {
          setUseCustom(false);
        }
      } catch (error) {
        console.error("Failed to load custom dashboard:", error);
        setUseCustom(false);
      } finally {
        setLoading(false);
      }
    };

    loadCustomDashboard();
  }, [role]);

  const toggleCustom = () => {
    setUseCustom(!useCustom);
  };

  return { dashboard, loading, widgetData, useCustom, toggleCustom, setUseCustom };
}

export default useCustomDashboard;

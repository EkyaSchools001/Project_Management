import { useState, useEffect } from "react";
import { cn } from "@pdi/lib/utils";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@pdi/components/ui/card";
import { Badge } from "@pdi/components/ui/badge";
import { Button } from "@pdi/components/ui/button";
import { Switch } from "@pdi/components/ui/switch";
import { Label } from "@pdi/components/ui/label";
import {
  Activity, BarChart3, CreditCard, Table2, List, Calendar,
  FileText, Target, Users, Clock, TrendingUp, PieChart, LayoutGrid,
  Settings, Eye, Edit3
} from "lucide-react";
import api from "@pdi/lib/api";
import { dashboardService, Dashboard, DashboardWidget } from "@pdi/services/dashboardService";
import { SecurityFeed } from './SecurityFeed';
import { useAuth } from "@pdi/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "@pdi/lib/socket";

const WIDGET_COMPONENTS: Record<string, any> = {
  Activity, BarChart3, CreditCard, Table2, List, Calendar,
  FileText, Target, Users, Clock, TrendingUp, PieChart
};

interface CustomDashboardWrapperProps {
  role: string;
  children: React.ReactNode;
}

export function CustomDashboardWrapper({ role, children }: CustomDashboardWrapperProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [useCustom, setUseCustom] = useState(false);
  const [widgetData, setWidgetData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadCustomDashboard();

    // Real-time synchronization
    const token = sessionStorage.getItem('auth_token');
    const socket = connectSocket(token || undefined);

    const handleDashboardUpdate = (data: any) => {
      if (data.role === role?.toUpperCase() || !data.role) {
        console.log('[DASHBOARD] Socket update received, reloading...', data);
        loadCustomDashboard();
      }
    };

    socket.on('DASHBOARD_UPDATED', handleDashboardUpdate);

    return () => {
      socket.off('DASHBOARD_UPDATED', handleDashboardUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const loadCustomDashboard = async () => {
    try {
      const res = await dashboardService.getByRole(role?.toUpperCase());
      if (res.status === 'success' && res.data.length > 0) {
        const defaultDash = res.data.find((d: Dashboard) => d.isDefault) || res.data[0];
        if (defaultDash.widgets && defaultDash.widgets.length > 0) {
          setDashboard(defaultDash);
          setUseCustom(true);

          const token = sessionStorage.getItem('auth_token');
          const baseUrl = (api.defaults.baseURL || '').replace(/\/$/, '');

          const dataPromises = defaultDash.widgets
            // Only fetch real API paths — skip placeholder values like 'chart', 'data', 'Bar Chart'
            .filter((w: DashboardWidget) => w.dataSource && w.dataSource.startsWith('/'))
            .map(async (widget: DashboardWidget) => {
              try {
                // Use plain axios (no global error interceptor) to avoid 404 toasts
                const response = await axios.get(`${baseUrl}${widget.dataSource}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                return { [widget.id]: response.data };
              } catch {
                return { [widget.id]: null };
              }
            });

          const dataResults = await Promise.all(dataPromises);
          setWidgetData(Object.assign({}, ...dataResults));
        }
      }
    } catch (error) {
      console.error("Failed to load custom dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWidgetIcon = (type: string) => {
    const IconComponent = WIDGET_COMPONENTS[type] || LayoutGrid;
    return <IconComponent className="w-5 h-5" />;
  };

  const renderWidgetContent = (widget: DashboardWidget) => {
    const data = widgetData[widget.id];

    if (widget.widgetType === 'stats') {
      const value = data?.count ?? data?.value ?? data?.total ?? data?.hours ?? "--";
      const subtitle = data?.subtitle ?? "Total";
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-3xl font-bold text-primary">{value}</div>
          <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>
          {data?.change !== undefined && (
            <div className={`flex items-center gap-1 text-xs mt-1 ${data.change >= 0 ? 'text-violet-500' : 'text-red-500'}`}>
              {data.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
              {Math.abs(data.change)}%
            </div>
          )}
        </div>
      );
    }

    if (widget.widgetType === 'chart_bar' || widget.widgetType === 'chart_line' || widget.widgetType === 'chart_pie') {
      const chartData = data?.data || data?.labels || [];
      return (
        <div className="flex flex-col items-center justify-center h-full">
          {getWidgetIcon(widget.widgetType)}
          <div className="text-xs text-muted-foreground mt-2">{widget.title}</div>
          {chartData.length > 0 && (
            <div className="flex items-end gap-1 mt-2 h-12">
              {chartData.slice(0, 6).map((val: number, i: number) => (
                <div
                  key={i}
                  className="w-4 bg-primary/60 rounded-t"
                  style={{ height: `${Math.max(4, (val / Math.max(...chartData)) * 40)}px` }}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (widget.widgetType === 'table') {
      const items = data?.data || data?.users || data || [];
      const columns = data?.columns || ['Name', 'Status'];
      return (
        <div className="h-full overflow-auto text-xs">
          <table className="w-full">
            <thead className="sticky top-0 bg-white border-b">
              <tr>
                {columns.slice(0, 3).map((col: string, i: number) => (
                  <th key={i} className="px-2 py-1 text-left font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 5).map((item: any, i: number) => (
                <tr key={i} className="border-b hover:bg-slate-50">
                  {columns.slice(0, 3).map((col: string, j: number) => (
                    <td key={j} className="px-2 py-1 truncate">
                      {item[col?.toLowerCase()] || item[col] || item.name || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (widget.widgetType === 'list') {
      const items = Array.isArray(data) ? data : (data?.data || []);
      return (
        <div className="h-full overflow-auto space-y-1">
          {items.slice(0, 6).map((item: any, i: number) => (
            <div key={i} className="p-2 bg-slate-50 rounded text-xs">
              <div className="font-medium truncate">{item.name || item.title || item.fullName || "Item"}</div>
              {item.status && (
                <Badge className={cn(
                  "px-2 py-0.5 rounded-full font-black text-[8px] tracking-widest uppercase border-none text-foreground shadow-sm",
                  item.status === 'Active' || item.status === 'Approved' || item.status === 'Completed' ? 'bg-violet-600' :
                  item.status === 'Pending' || item.status === 'Draft' ? 'bg-amber-500' :
                  item.status === 'Rejected' ? 'bg-rose-600' :
                  'bg-slate-500'
                )}>
                  {item.status}
                </Badge>
              )}
            </div>
          ))}
          {items.length === 0 && <div className="text-center text-muted-foreground py-4">No items</div>}
        </div>
      );
    }

    if (widget.widgetType === 'calendar') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Calendar className="w-8 h-8 mb-2 opacity-50" />
          <div className="text-xs">Calendar</div>
        </div>
      );
    }

    if (widget.widgetType === 'goals') {
      const goals = data?.data || data?.goals || [];
      return (
        <div className="h-full overflow-auto space-y-2">
          {goals.slice(0, 4).map((goal: any, i: number) => (
            <div key={i} className="p-2 bg-slate-50 rounded">
              <div className="font-medium text-xs truncate">{goal.title || goal.goalText}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${goal.progress || goal.percentage || 0}%` }} />
                </div>
                <span className="text-[10px]">{goal.progress || goal.percentage || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (widget.widgetType === 'card') {
      return (
        <div className="h-full">
          <div className="font-semibold">{data?.title || widget.title}</div>
          <div className="text-sm text-muted-foreground mt-1">{data?.description || "Info card"}</div>
        </div>
      );
    }

    if (widget.widgetType === 'security_feed') {
      return <SecurityFeed />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        {getWidgetIcon(widget.widgetType)}
        <div className="text-xs mt-2">{widget.title}</div>
      </div>
    );
  };

  const isSuperAdmin = user?.role?.toUpperCase() === 'SUPERADMIN';

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  // If custom dashboard exists and is enabled, show it
  if (useCustom && dashboard && dashboard.widgets && dashboard.widgets.length > 0) {
    return (
      <div className="space-y-4">
        {/* Toggle to switch between custom and default */}


        {/* Custom Dashboard Grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
          {dashboard.widgets
            .filter((w: DashboardWidget) => w.isVisible !== false)
            .sort((a: DashboardWidget, b: DashboardWidget) => a.order - b.order)
            .map((widget: DashboardWidget) => (
              <div
                key={widget.id}
                style={{
                  gridColumn: `span ${widget.width}`,
                  gridRow: `span ${widget.height}`
                }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span className="text-primary">{getWidgetIcon(widget.widgetType)}</span>
                      {widget.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderWidgetContent(widget)}
                  </CardContent>
                </Card>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // No custom dashboard, show default
  return (
    <div>
      {/* Show toggle even when no custom dashboard to prompt creating one */}

      {children}
    </div>
  );
}

export default CustomDashboardWrapper;

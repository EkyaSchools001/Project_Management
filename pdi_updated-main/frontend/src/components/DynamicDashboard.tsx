import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity, BarChart3, CreditCard, Table2, List, Calendar,
  FileText, Target, Users, Clock, TrendingUp, PieChart, LayoutGrid,
  ArrowUp, ArrowDown, Minus
} from "lucide-react";
import api from "@/lib/api";
import { dashboardService, Dashboard, DashboardWidget } from "@/services/dashboardService";

const WIDGET_COMPONENTS: Record<string, any> = {
  Activity, BarChart3, CreditCard, Table2, List, Calendar,
  FileText, Target, Users, Clock, TrendingUp, PieChart
};

interface DynamicDashboardProps {
  role?: string;
  id?: string;
  fallback?: React.ReactNode;
}

export function DynamicDashboard({ role, id, fallback }: DynamicDashboardProps) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [widgetData, setWidgetData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, id]);

  const loadDashboard = async () => {
    try {
      let res;
      if (id) {
        res = await dashboardService.getById(id);
      } else if (role) {
        res = await dashboardService.getByRole(role?.toUpperCase());
      } else {
        return;
      }

      if (res.status === 'success' && (id ? res.data : (res.data.length > 0))) {
        const defaultDash = id ? res.data : (res.data.find((d: Dashboard) => d.isDefault) || res.data[0]);
        setDashboard(defaultDash);

        // Load data for each widget
        const dataPromises = defaultDash.widgets?.map(async (widget: DashboardWidget) => {
          if (widget.dataSource) {
            try {
              const response = await api.get(widget.dataSource);
              return { [widget.id]: response.data };
            } catch {
              return { [widget.id]: null };
            }
          }
          return { [widget.id]: null };
        }) || [];

        const dataResults = await Promise.all(dataPromises);
        const allData = Object.assign({}, ...dataResults);
        setWidgetData(allData);
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWidgetIcon = (type: string) => {
    const IconComponent = WIDGET_COMPONENTS[type] || LayoutGrid;
    return <IconComponent className="w-6 h-6" />;
  };

  const renderWidgetContent = (widget: DashboardWidget) => {
    const data = widgetData[widget.id];

    if (widget.widgetType === 'stats') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-3xl font-bold text-primary">
            {data?.count || data?.value || data?.total || "--"}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {data?.subtitle || "Total"}
          </div>
        </div>
      );
    }

    if (widget.widgetType === 'chart_bar' || widget.widgetType === 'chart_line' || widget.widgetType === 'chart_pie') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-muted-foreground mb-2">
            {getWidgetIcon(widget.widgetType)}
          </div>
          <div className="text-sm text-muted-foreground">
            Chart: {widget.title}
          </div>
          {data?.labels && (
            <div className="mt-2 flex gap-1">
              {data.labels.slice(0, 5).map((label: string, i: number) => (
                <div key={i} className="text-[10px] bg-slate-100 px-1 rounded">{label}</div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (widget.widgetType === 'table') {
      const items = data?.data || data?.users || data?.goals || [];
      return (
        <div className="h-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b">
                {data?.columns?.slice(0, 3).map((col: string, i: number) => (
                  <th key={i} className="px-2 py-1 text-left text-xs font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 5).map((item: any, i: number) => (
                <tr key={i} className="border-b hover:bg-slate-50">
                  {data?.columns?.slice(0, 3).map((col: string, j: number) => (
                    <td key={j} className="px-2 py-1 truncate">{item[col?.toLowerCase()] || item[col] || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center text-muted-foreground py-4">No data</div>
          )}
        </div>
      );
    }

    if (widget.widgetType === 'list') {
      const items = data?.data || data?.items || data || [];
      return (
        <div className="h-full overflow-auto space-y-2">
          {Array.isArray(items) ? items.slice(0, 6).map((item: any, i: number) => (
            <div key={i} className="p-2 bg-slate-50 rounded text-sm">
              <div className="font-medium">{item.name || item.title || item.fullName || "Item"}</div>
              {item.status && (
                <Badge className={cn(
                  "px-2 py-0.5 rounded-full font-black text-[8px] tracking-widest uppercase border-none text-white shadow-sm",
                  item.status === 'Active' || item.status === 'Approved' || item.status === 'Completed' ? 'bg-black text-white hover:bg-black cursor-default' :
                  item.status === 'Pending' || item.status === 'Draft' ? 'bg-amber-500' :
                  item.status === 'Rejected' ? 'bg-rose-600' :
                  'bg-slate-500'
                )}>
                  {item.status}
                </Badge>
              )}
            </div>
          )) : (
            <div className="text-center text-muted-foreground py-4">No items</div>
          )}
        </div>
      );
    }

    if (widget.widgetType === 'calendar') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Calendar className="w-8 h-8 mb-2 opacity-50" />
          <div className="text-sm">Calendar View</div>
          <div className="text-xs mt-1">{widget.dataSource}</div>
        </div>
      );
    }

    if (widget.widgetType === 'goals') {
      const goals = data?.data || data?.goals || [];
      return (
        <div className="h-full overflow-auto space-y-2">
          {goals.slice(0, 4).map((goal: any, i: number) => (
            <div key={i} className="p-2 bg-slate-50 rounded">
              <div className="font-medium text-sm truncate">{goal.title || goal.goalText}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${goal.progress || goal.percentage || 0}%` }}
                  />
                </div>
                <span className="text-xs">{goal.progress || goal.percentage || 0}%</span>
              </div>
            </div>
          ))}
          {goals.length === 0 && (
            <div className="text-center text-muted-foreground py-4">No goals</div>
          )}
        </div>
      );
    }

    if (widget.widgetType === 'card') {
      return (
        <div className="h-full flex flex-col">
          <div className="text-lg font-semibold">{data?.title || widget.title}</div>
          <div className="text-sm text-muted-foreground mt-2">{data?.description || "Info card content"}</div>
        </div>
      );
    }

    // Default render
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        {getWidgetIcon(widget.widgetType)}
        <div className="text-sm mt-2">{widget.title}</div>
        {widget.dataSource && (
          <div className="text-[10px] mt-1 opacity-50">{widget.dataSource}</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no custom dashboard in database, show fallback
  if (!dashboard || !dashboard.widgets || dashboard.widgets.length === 0) {
    return <>{fallback}</>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4" style={{
        gridTemplateColumns: `repeat(4, minmax(0, 1fr))`
      }}>
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

export default DynamicDashboard;

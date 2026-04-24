// @ts-nocheck
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';

interface SensorData {
  timestamp: string;
  value: number;
}

interface SensorDashboardProps {
  deviceId: string;
  sensorType: string;
  unit: string;
  data: SensorData[];
  minThreshold?: number;
  maxThreshold?: number;
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1d29] border border-white/10 p-3 rounded-lg">
        <p className="text-xs text-foreground/50">{new Date(label).toLocaleString()}</p>
        <p className="text-sm font-medium text-[#ef4444]">
          {payload[0].value.toFixed(1)} {payload[0].payload.unit}
        </p>
      </div>
    );
  }
  return null;
};

export function SensorDashboard({
  deviceId,
  sensorType,
  unit,
  data,
  minThreshold,
  maxThreshold,
  title
}: SensorDashboardProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const formatted = data.map((d) => ({
        ...d,
        unit,
        timestamp: new Date(d.timestamp).getTime(),
      }));
      setChartData(formatted);

      const latestValue = data[0]?.value;
      const newAlerts: string[] = [];
      if (minThreshold && latestValue < minThreshold) {
        newAlerts.push(`Value below minimum threshold (${minThreshold})`);
      }
      if (maxThreshold && latestValue > maxThreshold) {
        newAlerts.push(`Value above maximum threshold (${maxThreshold})`);
      }
      setAlerts(newAlerts);
    }
  }, [data, unit, minThreshold, maxThreshold]);

  const latestValue = chartData[0]?.value;
  const averageValue = chartData.length > 0
    ? chartData.reduce((a, b) => a + b.value, 0) / chartData.length
    : 0;

  return (
    <Card className="bg-[#1a1d29] border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">
            {title || sensorType}
          </CardTitle>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="bg-red-500/10 text-red-400">
              Alert
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 && (
          <Alert className="mb-3 bg-red-500/10 border-red-500/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alert</AlertTitle>
            <AlertDescription>{alerts[0]}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-foreground/50">Current</p>
            <p className="text-2xl font-bold text-foreground">
              {latestValue?.toFixed(1)}
              <span className="text-sm ml-1 text-foreground/50">{unit}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/50">Average</p>
            <p className="text-2xl font-bold text-foreground/70">
              {averageValue?.toFixed(1)}
              <span className="text-sm ml-1 text-foreground/50">{unit}</span>
            </p>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                tick={{ fontSize: 10, fill: '#ffffff50' }}
                axisLine={{ stroke: '#ffffff10' }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#ffffff50' }}
                axisLine={{ stroke: '#ffffff10' }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
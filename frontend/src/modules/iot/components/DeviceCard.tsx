import { useState } from 'react';
import { Activity, Thermometer, Droplets, Zap, AlertTriangle, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

interface DeviceCardProps {
  device: {
    id: string;
    name: string;
    type: string;
    location?: string;
    status: string;
    lastSeen?: string;
    readings?: Array<{ type: string; value: number; unit: string }>;
  };
  onViewDetails?: (device: any) => void;
  onStatusChange?: (deviceId: string, status: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500';
    case 'Offline':
      return 'bg-red-500';
    case 'Maintenance':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

const getDeviceIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('temp') || t.includes('weather')) return Thermometer;
  if (t.includes('humid') || t.includes('moisture')) return Droplets;
  if (t.includes('power') || t.includes('energy')) return Zap;
  return Activity;
};

export function DeviceCard({ device, onViewDetails, onStatusChange }: DeviceCardProps) {
  const [loading, setLoading] = useState(false);
  const Icon = getDeviceIcon(device.type);
  const lastReading = device.readings?.[0];

  const handleStatusChange = async (newStatus: string) => {
    if (onStatusChange) {
      setLoading(true);
      await onStatusChange(device.id, newStatus);
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#1a1d29] border-white/10 hover:border-[#BAFF00]/30 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#BAFF00]/10">
            <Icon className="w-5 h-5 text-[#BAFF00]" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium text-foreground">{device.name}</CardTitle>
            <p className="text-xs text-foreground/50">{device.location || device.type}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1d29] border-white/10">
            <DropdownMenuItem onClick={() => onViewDetails?.(device)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Maintenance')}>
              Set Maintenance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('Offline')}>
              Set Offline
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
            <span className="text-xs text-foreground/70">{device.status}</span>
          </div>
          {lastReading && (
            <div className="text-right">
              <p className="text-lg font-semibold text-foreground">
                {lastReading.value}
                <span className="text-xs ml-1 text-foreground/50">{lastReading.unit}</span>
              </p>
              <p className="text-xs text-foreground/30 capitalize">{lastReading.type}</p>
            </div>
          )}
        </div>
        {device.lastSeen && (
          <p className="text-xs text-foreground/30 mt-2">
            Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
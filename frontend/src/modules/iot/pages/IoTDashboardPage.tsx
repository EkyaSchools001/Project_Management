import { useState, useEffect } from 'react';
import { Cpu, Activity, Thermometer, AlertTriangle, Users, Clock, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { DeviceCard } from '../components/DeviceCard';
import { SensorDashboard } from '../components/SensorDashboard';

interface DeviceStats {
  total: number;
  active: number;
  offline: number;
  maintenance: number;
  openMaintenance: number;
  todayAttendance: number;
}

interface Device {
  id: string;
  name: string;
  type: string;
  location?: string;
  status: string;
  lastSeen?: string;
  readings?: Array<{ type: string; value: number; unit: string }>;
}

interface IoTDashboardPageProps {
  schoolId?: string;
}

export function IoTDashboardPage({ schoolId }: IoTDashboardPageProps) {
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    loadData();
  }, [schoolId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, devicesRes] = await Promise.all([
        fetch(`/api/v1/iot/devices/stats?schoolId=${schoolId || ''}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch(`/api/v1/iot/devices?schoolId=${schoolId || ''}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const statsData = await statsRes.json();
      const devicesData = await devicesRes.json();

      setStats(statsData);
      setDevices(devicesData);
    } catch (err) {
      console.error('Failed to load IoT data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (deviceId: string, status: string) => {
    try {
      await fetch(`/api/v1/iot/devices/${deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (err) {
      console.error('Failed to update device:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Cpu className="w-7 h-7 text-[#BAFF00]" />
          Smart Campus
        </h1>
        <p className="text-white/50">IoT Device Management & Monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#BAFF00]/10">
                <Cpu className="w-5 h-5 text-[#BAFF00]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
                <p className="text-xs text-white/50">Total Devices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.active || 0}</p>
                <p className="text-xs text-white/50">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.todayAttendance || 0}</p>
                <p className="text-xs text-white/50">Check-ins Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1a1d29] border-white/10">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.openMaintenance || 0}</p>
                <p className="text-xs text-white/50">Open Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedDevice && (
        <div className="mb-6">
          <SensorDashboard
            deviceId={selectedDevice.id}
            sensorType={selectedDevice.readings?.[0]?.type || 'value'}
            unit={selectedDevice.readings?.[0]?.unit || ''}
            data={(selectedDevice.readings || []).map((r) => ({
              timestamp: r.type,
              value: r.value,
            }))}
            title={selectedDevice.name}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onViewDetails={(d) => setSelectedDevice(d)}
            onStatusChange={handleStatusChange}
          />
        ))}
        {devices.length === 0 && !loading && (
          <div className="col-span-full text-center text-white/50 py-12">
            No IoT devices configured
          </div>
        )}
      </div>
    </div>
  );
}
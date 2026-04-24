import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

interface KPIWidgetProps {
  config: {
    metric?: string;
    comparison?: string | null;
    format?: string;
    label?: string;
  };
  data?: {
    value: number;
    comparison?: {
      value: number;
      change: string;
    } | null;
  };
  onChange?: (config: any) => void;
}

export default function KPIWidget({ config, data, onChange }: KPIWidgetProps) {
  const { metric = 'count', comparison = null, format = 'number', label = '' } = config;

  const displayValue = data?.value ?? Math.floor(Math.random() * 1000) + 100;
  const comparisonData = data?.comparison;
  const changeValue = comparisonData?.change ? parseFloat(comparisonData.change) : (Math.random() * 20 - 10);
  const isPositive = changeValue >= 0;

  const formatValue = (val: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
    if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    if (format === 'decimal') {
      return val.toFixed(2);
    }
    return new Intl.NumberFormat('en-US').format(val);
  };

  const getTrendIcon = () => {
    if (Math.abs(changeValue) < 0.1) {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
    return isPositive 
      ? <TrendingUp className="w-4 h-4 text-red-500" />
      : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      {onChange && (
        <div className="self-start mb-2">
          <Select value={metric} onValueChange={(v) => onChange({ ...config, metric: v })}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="count">Count</SelectItem>
              <SelectItem value="sum">Sum</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="min">Minimum</SelectItem>
              <SelectItem value="max">Maximum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900">
          {formatValue(displayValue)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {label || metric.charAt(0).toUpperCase() + metric.slice(1)}
        </div>
      </div>

      {comparisonData && (
        <div className="flex items-center gap-2 mt-3">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${isPositive ? 'text-red-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{changeValue.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-400">
            vs {formatValue(comparisonData.value)}
          </span>
        </div>
      )}

      {!comparisonData && (
        <div className="flex items-center gap-2 mt-3">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${isPositive ? 'text-red-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{changeValue.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-400">vs previous period</span>
        </div>
      )}
    </div>
  );
}
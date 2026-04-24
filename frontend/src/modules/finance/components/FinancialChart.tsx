import { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialChartProps {
  type: 'revenue' | 'expense' | 'trend';
  data: {
    labels: string[];
    values: number[];
  };
  title?: string;
}

export function FinancialChart({ type, data, title }: FinancialChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const barWidth = (width - padding * 2) / data.values.length - 10;

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(...data.values) * 1.1;
    const minValue = 0;
    const range = maxValue - minValue;

    data.values.forEach((value, index) => {
      const barHeight = (value / range) * (height - padding * 2);
      const x = padding + index * (barWidth + 10);
      const y = height - padding - barHeight;

      const gradient = ctx.createLinearGradient(x, y, x, height - padding);
      if (type === 'revenue' || type === 'trend') {
        gradient.addColorStop(0, '#ef4444');
        gradient.addColorStop(1, '#ef444440');
      } else {
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(1, '#FF6B6B40');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();

      ctx.fillStyle = '#ffffff60';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(data.labels[index], x + barWidth / 2, height - 10);
    });
  }, [data, type]);

  const total = data.values.reduce((sum, val) => sum + val, 0);
  const avg = data.values.length > 0 ? total / data.values.length : 0;
  const isPositiveTrend = type === 'revenue' || type === 'trend';

  return (
    <div className="bg-[#1a1d24] rounded-2xl p-6 border border-white/5">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            {isPositiveTrend ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm text-foreground/40">Total</p>
        <p className="text-2xl font-black text-foreground">${total.toLocaleString()}</p>
      </div>

      <div className="h-48">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
        <div>
          <p className="text-xs text-foreground/40">Average</p>
          <p className="font-bold text-foreground">${avg.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-foreground/40">Period</p>
          <p className="font-bold text-foreground">{data.labels.length} months</p>
        </div>
      </div>
    </div>
  );
}
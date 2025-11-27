import React from 'react';
import { Divide, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { IDEAL_RANGES } from '../constants';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  type: keyof typeof IDEAL_RANGES | 'temperature'; // Temperature doesn't have an ideal range strictly defined in constants for this demo
  icon: React.ReactNode;
  colorClass: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, type, icon, colorClass }) => {
  let status = 'Normal';
  let statusColor = 'text-gray-500';
  let TrendIcon = Minus;

  if (type !== 'temperature') {
    const range = IDEAL_RANGES[type as keyof typeof IDEAL_RANGES];
    if (value < range.min) {
      status = 'Low';
      statusColor = 'text-amber-600';
      TrendIcon = TrendingDown;
    } else if (value > range.max) {
      status = 'High';
      statusColor = 'text-red-600';
      TrendIcon = TrendingUp;
    } else {
      status = 'Optimal';
      statusColor = 'text-emerald-600';
      TrendIcon = TrendingUp; // Just using an icon, conceptually 'steady' or 'good'
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-slate-100 ${statusColor}`}>
          {type !== 'temperature' && (status === 'Optimal' ? null : <TrendIcon className="w-3 h-3" />)}
          {status}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          <span className="text-sm text-slate-400 font-medium">{unit}</span>
        </div>
      </div>
      {type !== 'temperature' && (
        <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${status === 'Optimal' ? 'bg-emerald-500' : status === 'Low' ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(100, Math.max(0, (value / (IDEAL_RANGES[type as keyof typeof IDEAL_RANGES].max * 1.5)) * 100))}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

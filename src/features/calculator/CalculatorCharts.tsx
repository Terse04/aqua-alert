import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import type { CalculatorBreakdownItem } from '@/types';

interface CalculatorChartsProps {
  breakdown: CalculatorBreakdownItem[];
  dailyTotal: number;
}

export const CalculatorCharts: React.FC<CalculatorChartsProps> = ({
  breakdown,
  dailyTotal,
}) => {
  const chartData = breakdown.map((item) => ({
    name: item.category,
    litres: item.dailyLitres,
    percentage: item.percentage,
    color: item.color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-xs">
          <p className="font-bold text-[#103B54]">{data.name}</p>
          <p className="text-[#087EBC] font-semibold mt-0.5">
            {data.litres} Litres/day ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Doughnut Chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Usage Distribution
        </h4>
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="litres"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Total Indicator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-[#103B54] font-mono leading-none">
              {dailyTotal}
            </span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1">
              L / Day
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
          {breakdown.map((item) => (
            <div key={item.category} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-600 truncate">{item.category}</span>
              <span className="font-semibold text-[#103B54] ml-auto">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Bar Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Daily Litres by Category
        </h4>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10 }}
                width={110}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="litres" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

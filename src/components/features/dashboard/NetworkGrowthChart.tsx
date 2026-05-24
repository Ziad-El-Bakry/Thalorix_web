"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Oct', growth: 950 },
  { name: 'Nov', growth: 1050 },
  { name: 'Dec', growth: 1100 },
  { name: 'Jan', growth: 1200 },
  { name: 'Feb', growth: 1300 },
  { name: 'Mar', growth: 1400 },
];

export default function NetworkGrowthChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Network Growth</h3>
      </div>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[900, 1500]}
              ticks={[900, 1050, 1200, 1350, 1500]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="linear" 
              dataKey="growth" 
              stroke="#103B40" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#103B40', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Open Source', likes: 250, comments: 40 },
  { name: 'AI & Dev', likes: 180, comments: 20 },
  { name: 'React Tips', likes: 310, comments: 60 },
  { name: 'Migration', likes: 420, comments: 80 },
  { name: 'Architecture', likes: 580, comments: 120 },
];

export default function PostPerformanceChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Post Performance</h3>
      </div>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 10 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              domain={[0, 600]}
              ticks={[0, 150, 300, 450, 600]}
            />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              iconType="circle" 
              wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
              verticalAlign="bottom"
              align="left"
            />
            <Bar dataKey="likes" name="Likes" fill="#43B0B5" radius={[4, 4, 0, 0]} maxBarSize={12} />
            <Bar dataKey="comments" name="Comments" fill="#103B40" radius={[4, 4, 0, 0]} maxBarSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

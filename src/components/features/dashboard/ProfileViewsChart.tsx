"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', views: 400 },
  { name: 'Tue', point: true, views: 650 },
  { name: 'Wed', views: 500 },
  { name: 'Thu', point: true, views: 900 },
  { name: 'Fri', point: true, views: 700 },
  { name: 'Sat', views: 300 },
  { name: 'Sun', views: 650 },
];

export default function ProfileViewsChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Profile Views This Week</h3>
        <span className="text-sm font-semibold text-[#103B40]">+12% vs last week</span>
      </div>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#103B40" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#103B40" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              domain={[0, 1000]}
              ticks={[0, 250, 500, 750, 1000]}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{ stroke: '#103B40', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#103B40" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorViews)" 
              activeDot={{ r: 6, fill: '#103B40', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

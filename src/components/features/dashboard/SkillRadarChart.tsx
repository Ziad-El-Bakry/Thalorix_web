"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'React', A: 90, fullMark: 100 },
  { subject: 'Node.js', A: 85, fullMark: 100 },
  { subject: 'TypeScript', A: 80, fullMark: 100 },
  { subject: 'Cloud', A: 70, fullMark: 100 },
  { subject: 'Python', A: 65, fullMark: 100 },
  { subject: 'DevOps', A: 75, fullMark: 100 },
];

export default function SkillRadarChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Skill Radar</h3>
      </div>
      
      <div className="flex-1 w-full min-h-[250px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#9CA3AF', fontSize: 11 }} 
            />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#43B0B5"
              fill="#43B0B5"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

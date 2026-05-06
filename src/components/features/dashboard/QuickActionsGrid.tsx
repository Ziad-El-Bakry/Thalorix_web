"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Edit3, BarChart2, Briefcase, Sparkles, Settings, Plus, Upload } from "lucide-react";

interface ActionItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  href: string;
  color?: string;
  delay?: number;
}

function ActionItem({ icon, label, isActive, href, color = "#103B40", delay = 0 }: ActionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link 
        href={href}
        className={`group relative flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300 h-full overflow-hidden ${
          isActive 
            ? "bg-[#103B40] text-white shadow-[0_10px_25px_-5px_rgba(16,59,64,0.4)]" 
            : "bg-white text-gray-700 hover:shadow-xl border border-gray-100/50"
        }`}
      >
        {/* Background Accent */}
        {!isActive && (
          <div 
            className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500"
            style={{ backgroundColor: color }}
          />
        )}

        <div className={`p-3 rounded-xl transition-colors duration-300 ${
          isActive 
            ? "bg-white/10 text-[#43B0B5]" 
            : "bg-gray-50 text-gray-400 group-hover:bg-[#103B40]/5 group-hover:text-[#103B40]"
        }`}>
          {icon}
        </div>
        
        <div className="flex flex-col items-center gap-0.5">
          <span className={`text-[11px] font-bold tracking-wide uppercase ${
            isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"
          }`}>
            {label}
          </span>
          <div className={`h-0.5 rounded-full transition-all duration-300 ${
            isActive ? "w-4 bg-[#43B0B5]" : "w-0 bg-[#103B40] group-hover:w-4"
          }`} />
        </div>

        {isActive && (
          <motion.div 
            layoutId="active-glow"
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
          />
        )}
      </Link>
    </motion.div>
  );
}

export default function QuickActionsGrid() {
  const actions = [
    { icon: <Plus size={22} />, label: "New Post", href: "/dashboard/community", color: "#43B0B5" },
    { icon: <BarChart2 size={22} />, label: "Analytics", href: "/dashboard/analytics", color: "#3B82F6" },
    { icon: <Upload size={22} />, label: "Upload", href: "/dashboard/marketplace/upload", color: "#103B40" },
    { icon: <Briefcase size={22} />, label: "Jobs", href: "/dashboard/marketplace", color: "#F59E0B" },
    { icon: <Sparkles size={22} />, label: "AI Write", href: "/dashboard/ai-generator", color: "#8B5CF6" },
    { icon: <Settings size={22} />, label: "Settings", href: "/dashboard/profile", color: "#EC4899" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 px-1 flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#103B40]" />
          Quick Actions
        </h3>
        <div className="h-px flex-1 ml-4 bg-gradient-to-r from-gray-200 to-transparent" />
      </div>
      
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {actions.map((action, idx) => (
          <ActionItem 
            key={idx}
            {...action}
            delay={idx * 0.05}
          />
        ))}
      </div>
    </div>
  );
}


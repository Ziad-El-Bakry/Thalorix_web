import React from "react";
import { motion } from "framer-motion";
import { UserPlus, ChevronRight } from "lucide-react";
import { LIVE_ACTIVITY, PROFILE_INSIGHTS, NETWORK_SUGGESTIONS, TRENDING } from "./profile.constants";

export default function ProfileRightSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="w-full lg:w-[280px] flex-shrink-0 space-y-5"
    >
      {/* Live Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Live Activity</h3>
        <div className="space-y-3.5">
          {LIVE_ACTIVITY.map((item, i) => (
            <div key={i} className="flex items-start gap-3 group cursor-pointer">
              <div className={`mt-0.5 ${item.color}`}>
                <item.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium leading-tight group-hover:text-[#103B40] transition-colors">{item.text}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Profile Insights</h3>
        <div className="space-y-3">
          {PROFILE_INSIGHTS.map((insight, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{insight.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#103B40]">{insight.value}</span>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${insight.positive ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                  {insight.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-3 text-right italic">Top 20% this week</p>
      </div>

      {/* Grow Your Network */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Grow Your Network</h3>
        <div className="space-y-3">
          {NETWORK_SUGGESTIONS.map((person, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: person.color }}
              >
                {person.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{person.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{person.title}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-0.5 flex-shrink-0"
              >
                <UserPlus size={13} /> Add
              </motion.button>
            </div>
          ))}
          <button className="w-full text-center text-xs font-semibold text-teal-600 hover:text-teal-700 mt-2 transition-colors flex items-center justify-center gap-1">
            View all suggestions <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Trending Now */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Trending Now</h3>
        <div className="space-y-2.5">
          {TRENDING.map((item, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-pointer">
              <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
              <div>
                <p className="text-sm font-bold text-teal-600 group-hover:text-teal-700 transition-colors">{item.tag}</p>
                <p className="text-[11px] text-gray-400">{item.posts}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 space-y-1">
        <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400">
          <a href="#" className="hover:text-gray-600 transition-colors">About</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Help</a>
        </div>
        <p className="text-[11px] text-gray-300">© 2026 Thalorix</p>
      </div>
    </motion.div>
  );
}

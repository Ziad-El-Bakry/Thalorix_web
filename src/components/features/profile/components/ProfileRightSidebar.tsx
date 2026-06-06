import React from "react";
import { motion } from "framer-motion";
import { UserPlus, ChevronRight } from "lucide-react";
import { NETWORK_SUGGESTIONS } from "./profile.constants";

export default function ProfileRightSidebar() {
  return (
    <div className="w-full lg:w-[300px] flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="space-y-5 lg:sticky lg:top-24"
      >
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
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { EXPERIENCE, CERTIFICATIONS, EDUCATION } from "./profile.constants";

interface ProfileLeftSidebarProps {
  userBio: string;
  expertiseData: any[];
}

export default function ProfileLeftSidebar({ userBio, expertiseData }: ProfileLeftSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="w-full lg:w-[280px] flex-shrink-0 space-y-5"
    >
      {/* About */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">About</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{userBio}</p>
      </div>

      {/* Expertise */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Expertise</h3>
        <div className="space-y-3.5">
          {expertiseData.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                <span className="text-xs text-gray-400 font-semibold">{skill.percent}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.percent}%` }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, #103B40 0%, #1fce81 100%)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Experience</h3>
        <div className="space-y-4">
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: exp.color }}
              >
                {exp.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{exp.role}</p>
                <p className="text-xs text-teal-600 font-medium">{exp.company}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{exp.dates}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Certifications</h3>
        <div className="space-y-3">
          {CERTIFICATIONS.map((cert, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{cert.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
                <p className="text-[11px] text-gray-400">{cert.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Education</h3>
        <div className="space-y-3">
          {EDUCATION.map((edu, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{edu.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{edu.degree}</p>
                <p className="text-xs text-teal-600 font-medium">{edu.school}</p>
                <p className="text-[11px] text-gray-400">{edu.dates}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

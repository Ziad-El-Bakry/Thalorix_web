"use client";

import { Star, Download, Check } from "lucide-react";

export default function TemplateInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#103B40] mb-2">Modern Business Pitch Deck</h2>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <Star className="text-amber-400 fill-amber-400" size={16} />
            <span className="font-semibold text-gray-900">4.8</span>
            <span>(124)</span>
          </div>
          <div className="flex items-center gap-1">
            <Download size={16} />
            <span>2.2k downloads</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
             {/* Avatar */}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900 leading-tight">Design Studio Pro</p>
            <p className="text-xs text-gray-500">Verified Creator</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-3">Description</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Professional business presentation template perfect for startups and enterprises. 
          Features clean, modern design with 25+ unique slides covering all essential business needs.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-3">What's Included</h3>
        <ul className="space-y-2">
          {[
            "25+ Professional Slides",
            "PowerPoint & Keynote Files",
            "Editable Graphics & Icons",
            "Free Google Fonts",
            "Documentation & Support"
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-5 h-5 rounded-full bg-[#E5F5F0] flex items-center justify-center text-[#219653]">
                <Check size={12} strokeWidth={3} />
              </div>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

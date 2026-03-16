"use client";

import { CloudUpload, Check, FileCode2 } from "lucide-react";
import { motion } from "framer-motion";

interface UploadProgressStepProps {
  progress: number;
}

export default function UploadProgressStep({ progress }: UploadProgressStepProps) {
  return (
    <motion.div 
      key="uploading"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#A5C9D3]/30 rounded-full flex items-center justify-center mb-4">
          <CloudUpload className="text-[#123E41]" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Uploading Template</h2>
        <p className="text-sm text-gray-500">Please wait while we process your file</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-center text-sm font-semibold text-gray-900 mb-3">
            <span>Upload Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-[#123E41] rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="w-full bg-[#123E41]/5 rounded-lg py-3 flex items-center justify-center gap-2 text-sm text-[#103B40] font-medium border border-[#123E41]/10">
             <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-[#123E41] animate-bounce" style={{ animationDelay: "0ms" }}></div>
               <div className="w-1.5 h-1.5 rounded-full bg-[#123E41] animate-bounce" style={{ animationDelay: "150ms" }}></div>
             </div>
             Uploading your template, please wait...
          </div>
        </div>

        <div>
           <h3 className="font-bold text-[#103B40] text-sm mb-3">Validation Checks</h3>
           <div className="space-y-3">
              {[
                { label: "Allowed File Types", status: "PASSED" },
                { label: "Max File Size", status: "PASSED" },
                { label: "Secure File Scan", status: "PASSED" },
              ].map((check, idx) => (
                <div key={idx} className="bg-green-50 border border-green-100 rounded-xl p-3 px-4 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white">
                       <Check size={12} strokeWidth={3} />
                     </div>
                     <span className="text-sm font-semibold text-gray-900">{check.label}</span>
                   </div>
                   <span className="text-xs font-bold text-green-500">{check.status}</span>
                </div>
              ))}
           </div>
        </div>

        <div>
          <h3 className="font-bold text-[#103B40] text-sm mb-3">File Information</h3>
          <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-[#123E41] rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <FileCode2 size={24} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900 leading-tight">template-component.jsx</p>
              <p className="text-xs text-gray-500 mt-0.5">2.4 MB &middot; JavaScript React Component</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">File Size</p>
              <p className="font-bold text-sm text-gray-900">2.4 MB</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Upload Speed</p>
              <p className="font-bold text-sm text-gray-900">1.2 MB/s</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

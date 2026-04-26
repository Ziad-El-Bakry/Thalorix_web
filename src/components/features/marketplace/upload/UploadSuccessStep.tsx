"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface UploadSuccessStepProps {
  onRestart: () => void;
}

export default function UploadSuccessStep({ onRestart }: UploadSuccessStepProps) {
  return (
    <motion.div 
      key="success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col items-center mt-10"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
      >
        <Check className="text-green-500" size={48} strokeWidth={3} />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Uploaded</h2>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Successfully!</h2>
      
      <p className="text-sm text-gray-500 text-center max-w-[300px] mb-8">
        Your template has been securely upload and is now awaiting review.
      </p>

      <div className="w-full max-w-[400px] bg-white rounded-2xl p-6 shadow-sm mb-8 border border-gray-50">
         <div className="flex justify-between items-center mb-6">
           <span className="text-sm font-semibold text-gray-900">Template Status</span>
           <span className="bg-[#A5C9D3]/30 text-[#123E41] text-xs font-bold px-3 py-1 rounded-full">Pending Approval</span>
         </div>
         
         <div className="space-y-4">
           <div className="flex justify-between items-center text-sm">
             <span className="text-gray-500">Upload Time</span>
             <span className="font-semibold text-gray-900">Just now</span>
           </div>
           <div className="flex justify-between items-center text-sm">
             <span className="text-gray-500">File Size</span>
             <span className="font-semibold text-gray-900">2.4 MB</span>
           </div>
           <div className="flex justify-between items-center text-sm">
             <span className="text-gray-500">Template ID</span>
             <span className="font-semibold text-gray-900">#TPL-2024-001</span>
           </div>
         </div>
      </div>

      <div className="flex gap-4 w-full max-w-[400px]">
        <button 
          onClick={onRestart}
          className="flex-2 bg-[#A5C9D3]/60 text-[#123E41] font-bold py-3.5 rounded-xl hover:bg-[#A5C9D3] transition-colors"
         >
          Upload Another Template
        </button>
        <Link href="/dashboard/marketplace" className="flex-1">
          <button className="w-full bg-[#123E41] text-white font-bold py-3.5 rounded-xl hover:bg-[#0d2c2e] transition-colors">
            My Templates
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

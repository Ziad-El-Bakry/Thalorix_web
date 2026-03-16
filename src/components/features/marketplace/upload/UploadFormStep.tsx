"use client";

import { CloudUpload, Info, Gift, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface UploadFormStepProps {
  onNext: () => void;
}

export default function UploadFormStep({ onNext }: UploadFormStepProps) {
  return (
    <motion.div 
      key="form"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full"
    >
      <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
        <span>Step 1 of 2</span>
        <span>Template Details</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full mb-10 overflow-hidden">
        <div className="h-full bg-[#123E41] w-1/2 rounded-full"></div>
      </div>

      <div className="space-y-6">
        {/* Template Name */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Template Name<span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#123E41]"
          />
          <p className="text-xs text-red-500 mt-1.5">Template name is required</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea 
            rows={4}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#123E41] resize-none"
          ></textarea>
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-xs text-gray-400">Minimum 50 characters</p>
            <p className="text-xs text-red-500">Description must be at least 50 characters</p>
          </div>
        </div>

        {/* Template Files */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Template Files<span className="text-red-500">*</span>
          </label>
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CloudUpload className="text-gray-400" size={24} />
            </div>
            <p className="text-sm text-gray-700 font-medium">Drag & drop your files here</p>
            <p className="text-xs text-gray-400 my-1">or</p>
            <button className="text-sm font-medium text-blue-600 hover:underline">
              Browse Files
            </button>
          </div>
          
          <div className="mt-4 space-y-1.5">
            <div className="flex items-start gap-2 text-xs">
              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info size={10} className="text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-blue-600">Allowed:</span> <span className="text-blue-400">.zip, .rar, .tar.gz (Max 50MB)</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs pl-6">
                <span className="font-semibold text-blue-600">Security:</span> <span className="text-blue-400">All files are scanned for viruses</span>
            </div>
            <div className="flex items-start gap-2 text-xs pl-6">
                <span className="font-semibold text-blue-600">Include:</span> <span className="text-blue-400">README, source code, documentation</span>
            </div>
          </div>
        </div>

        {/* Pricing Model */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Pricing Model<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-green-500/20 rounded-xl p-4 flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                <Gift size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Free</p>
                <p className="text-xs text-gray-500">Open source</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-amber-500/50">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white flex-shrink-0">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Paid</p>
                <p className="text-xs text-gray-500">Set price</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Tags<span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input 
            type="text" 
            placeholder="e.g. react, dashboard, admin"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#123E41]"
          />
          <p className="text-xs text-gray-500 mt-1.5">Separate tags with commas</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button className="flex-1 bg-[#A5C9D3]/70 text-[#123E41] font-bold py-3.5 rounded-xl hover:bg-[#A5C9D3] transition-colors">
            save as Draft
          </button>
          <button 
            onClick={onNext}
            className="flex-1 bg-[#123E41] text-white font-bold py-3.5 rounded-xl hover:bg-[#0d2c2e] transition-colors"
          >
            submit Template
          </button>
        </div>
      </div>
    </motion.div>
  );
}

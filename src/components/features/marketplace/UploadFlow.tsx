"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import UploadFormStep, { TemplateFormData } from "./upload/UploadFormStep";
import UploadProgressStep from "./upload/UploadProgressStep";
import UploadSuccessStep from "./upload/UploadSuccessStep";
import { templatesService } from "@/lib/api/services/templates.service";

type UploadState = "form" | "uploading" | "success";

export default function UploadFlow() {
  const [step, setStep] = useState<UploadState>("form");
  const [progress, setProgress] = useState(0);

  const handleUpload = async (data: TemplateFormData) => {
    setStep("uploading");
    setProgress(10); // Start progress

    try {
      // Create a dummy interval to show progress while uploading
      const interval = setInterval(() => {
        setProgress(p => (p < 90 ? p + 10 : p));
      }, 500);

      await templatesService.createTemplate({
        title: data.title,
        description: data.description,
        price: data.price,
        categoryId: "60d5ecb8b392d7001f8e8e31", // Default category ID for now since we don't have a category selector
        fileUrl: data.file,
      });

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setStep("success"), 500);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload template. Make sure you are logged in as a Seller.");
      setStep("form");
      setProgress(0);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-8 pb-12 overflow-y-auto custom-scrollbar">
      
      {/* Header with Back Button */}
      <div className="w-full max-w-[600px] flex items-center mb-8 relative justify-center">
        {step === "form" && (
          <Link 
            href="/dashboard/marketplace" 
            className="absolute left-0 w-10 h-10 bg-[#123E41] text-white rounded-full flex items-center justify-center hover:bg-[#0d2c2e] transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
        )}
        <h1 className="text-xl font-bold text-gray-900">
          Upload New Template
        </h1>
      </div>

      <div className="w-full max-w-[600px]">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <UploadFormStep 
              onNext={handleUpload} 
            />
          )}

          {step === "uploading" && (
            <UploadProgressStep 
              progress={progress} 
            />
          )}

          {step === "success" && (
            <UploadSuccessStep 
              onRestart={() => { setStep("form"); setProgress(0); }} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import UploadFormStep from "./upload/UploadFormStep";
import UploadProgressStep from "./upload/UploadProgressStep";
import UploadSuccessStep from "./upload/UploadSuccessStep";

type UploadState = "form" | "uploading" | "success";

export default function UploadFlow() {
  const [step, setStep] = useState<UploadState>("form");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "uploading") {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep("success"), 500);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [step]);

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
              onNext={() => setStep("uploading")} 
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

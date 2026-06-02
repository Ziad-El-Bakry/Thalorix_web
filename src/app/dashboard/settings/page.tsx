"use client";

import { Suspense } from "react";
import SettingsPageContent from "@/components/features/profile/components/SettingsPageContent";

export default function SettingsPage() {
  return (
    <div className="w-full max-w-[1000px] mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and settings</p>
      </div>
      
      <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-gray-100 rounded-2xl" />}>
        <SettingsPageContent />
      </Suspense>
    </div>
  );
}

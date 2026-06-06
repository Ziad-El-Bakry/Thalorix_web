"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, User } from "@/lib/api/services/auth.service";
import UsersTab from "@/components/features/admin/UsersTab";

export default function AdminUsersPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = authService.getStoredUser();
    if (!user || user.role !== "admin") {
      router.push("/dashboard");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#103B40] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-sm text-gray-500 mt-1">View, edit, and manage platform users</p>
      </div>
      
      <Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-gray-100 rounded-2xl" />}>
        <UsersTab />
      </Suspense>
    </div>
  );
}

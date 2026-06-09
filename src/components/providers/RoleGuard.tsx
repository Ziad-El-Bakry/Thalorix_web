"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { authService } from "@/lib/api/services/auth.service";

interface RoleGuardProps {
  children: React.ReactNode;
}

export default function RoleGuard({ children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Determine the role from either Cookies or localStorage
    let role = Cookies.get("user_role");
    
    if (!role) {
      const user = authService.getStoredUser();
      role = user?.role;
    }

    // Default paths by role
    const getRoleDefaultPath = (userRole: string) => {
      switch (userRole) {
        case "admin":
          return "/dashboard/admin/dashboard"; // Example default admin route
        case "seller":
          return "/dashboard/seller/dashboard";
        case "user":
        default:
          return "/dashboard";
      }
    };

    // Role-based route restrictions logic
    // Add specific restricted base routes here
    const checkAccess = () => {
      if (!role) {
        // Not logged in? Handled by other auth wrappers usually, but just in case
        return true; 
      }

      // Admin routes
      if (pathname.includes("/dashboard/admin")) {
        if (role !== "admin") return false;
      }

      // Seller routes
      if (pathname.includes("/dashboard/seller")) {
        if (role !== "seller" && role !== "admin") return false;
      }

      // Specific routes for sellers or admins
      if (pathname.includes("/dashboard/marketplace/upload")) {
        if (role !== "seller" && role !== "admin") return false;
      }

      // Add more rules as needed...

      return true;
    };

    if (checkAccess()) {
      setIsAuthorized(true);
    } else {
      // Unauthorized, redirect to their default path
      const defaultPath = getRoleDefaultPath(role || "user");
      router.replace(defaultPath);
    }
  }, [pathname, router]);

  if (!isAuthorized) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}

"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function NavigationLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);
    
    // Hide it after a brief delay to simulate loading or let components mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 500ms delay
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[80vh] w-full">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}

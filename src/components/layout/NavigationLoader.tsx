"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "../shared/LoadingSpinner";

function NavigationEvents({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 1000ms delay

    return () => clearTimeout(timer);
  }, [pathname, searchParams, setIsLoading]);

  return null;
}

export default function NavigationLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        <NavigationEvents setIsLoading={setIsLoading} />
      </Suspense>
      <div style={{ display: isLoading ? 'none' : 'block' }} className="w-full h-full">
        {children}
      </div>
      {isLoading && (
        <div className="flex-1 flex items-center justify-center min-h-[80vh] w-full">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}

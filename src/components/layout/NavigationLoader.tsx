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

import { motion, AnimatePresence } from "framer-motion";
import { pageTransition } from "@/lib/utils/animations";

export default function NavigationLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        <NavigationEvents setIsLoading={setIsLoading} />
      </Suspense>
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex items-center justify-center min-h-[80vh] w-full"
          >
            <LoadingSpinner />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

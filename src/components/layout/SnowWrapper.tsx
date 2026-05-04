"use client";

import { usePathname } from "next/navigation";
import ReactSnowfall from "react-snowfall";

export default function SnowWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showSnowfall =
    pathname === "/" ||
    ["/login", "/register", "/forget-password", "/verify-email"].some((path) =>
      pathname?.startsWith(path)
    );

  return (
    <>
      {showSnowfall && (
        <ReactSnowfall color="#22D3EE" snowflakeCount={100} speed={[0.5, 1]} wind={[0.5, 1]} />
      )}
      {children}
    </>
  );
}
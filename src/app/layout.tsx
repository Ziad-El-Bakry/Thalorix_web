'use client';
import './globals.css';
import ReactSnowfall from "react-snowfall";
import { usePathname } from "next/navigation";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSnowfall = pathname === '/' || 
    ['/login', '/register', '/forget-password', '/verify-email'].some(path => pathname?.startsWith(path));

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        {showSnowfall && <ReactSnowfall color="#22D3EE" snowflakeCount={100} speed={[0.5, 1]} wind={[0.5, 1]} />}
        {children}
      </body>
    </html>
  );
}
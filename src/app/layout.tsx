'use client';
import './globals.css';
import ReactSnowfall from "react-snowfall";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactSnowfall color="#22D3EE" snowflakeCount={100} speed={[0.5, 1]} wind={[0.5, 1]} />
        {children}
      </body>
    </html>
  );
}
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import SnowWrapper from "@/components/layout/SnowWrapper";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('thalorix-appearance');
                  if (saved) {
                    var parsed = JSON.parse(saved);
                    var mode = parsed.themeMode;
                    if (mode === 'dark') {
                      document.documentElement.classList.add('dark');
                    } else if (mode === 'system') {
                      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        document.documentElement.classList.add('dark');
                      }
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <SnowWrapper>
          {children}
        </SnowWrapper>
      </body>
    </html>
  );
}
"use client"; 
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#e2e3ea] overflow-hidden">
      
      {/* Left Corner(Sidebar) */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden lg:flex flex-col items-center justify-center px-8 py-12 w-full max-w-[412px] min-h-screen bg-[#103B40] rounded-tr-[30px] rounded-br-[30px] shadow-2xl"
      >
       

        {/* Professional Logo Area */}

<Link href="/" className="group relative flex flex-col items-center justify-center z-10">
    <div className="relative flex items-center justify-center" style={{ width: '380px', height: '350px' }}>
        
        {/* (Outer Rotating Aura) */}
        <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000 blur-[50px]"
            style={{
                background: 'conic-gradient(from 0deg, #22D3EE, transparent, #22D3EE, transparent, #22D3EE)',
            }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-full h-full"
            />
        </div>
        
        {/*(Animated Neon Stroke) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            <filter id="neon-glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <motion.circle
                cx="190"
                cy="175"
                r="140"
                stroke="#22D3EE"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="150 300"
                animate={{ 
                    strokeDashoffset: [0, -450],
                    opacity: [0.4, 1, 0.4] 
                }}
                transition={{ 
                    strokeDashoffset: { duration: 4, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                filter="url(#neon-glow)"
            />
        </svg>

        <div className="relative z-30 bg-[#103B40] rounded-full p-2 border border-white/5 shadow-inner">
            <motion.div
                    whileHover={{ scale: 1.09 }}
                    transition={{ type: "spring", stiffness: 300 }}
            >
                <Image
                    src="/logoS.png"
                    alt="Thalorix Logo"
                    width={400}
                    height={400}
                    className="relative z-40 transition-all duration-700 group-hover:drop-shadow-[0_0_50px_rgba(34,211,238,0.7)]"
                />
            </motion.div>
        </div>
    </div>

    {/* (Branding Text) */}
    <div className="mt-8 flex flex-col items-center">
        <motion.span
            className="uppercase text-white text-3xl font-black tracking-[0.4em] transition-all duration-500 group-hover:text-cyan-300"
            style={{ textShadow: '0 0 15px rgba(34,211,238,0.3)' }}
        >
            THALORIX
        </motion.span>
        
        <div className="h-1.25 w-0 bg-cyan-400 mt-2 transition-all duration-700 group-hover:w-full opacity-50" />
    </div>
</Link>
    </motion.aside>

    <main className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 py-12">
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[900px]"
        >
        <section
            className="relative rounded-[40px] border-[10px] p-10 md:p-16 bg-[#f5f6fb] shadow-[20px_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[30px_30px_80px_rgba(0,0,0,0.15)] hover:-translate-y-2"
            style={{ borderColor: 'rgba(255,255,255,0.5)' }}
            >
            <div className="flex flex-col gap-8">
                <h1 className="font-black leading-[1.1] text-4xl md:text-6xl lg:text-7xl text-[#103B40]">
                Launch your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-600">Startup Now!</span>
            </h1>
                <p className="font-medium text-lg md:text-2xl text-[#346C73]">
                Code, preview, manage. Everything in one flow. Built for founders.
                </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
    <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0px 20px 40px rgba(16, 59, 64, 0.4)" }}
    whileTap={{ scale: 0.95 }}
    className="w-full sm:w-auto px-35 py-6 rounded-[35px] text-3xl font-black   transition-all shadow-2xl hover:bg-[#144a50]"
    style={{ 
    backgroundColor: '#103B40', 
    color: '#A3C9D9',
    letterSpacing: '0.05em'
    }}
>
  Login
</motion.button>
                <Link href="/register" className="text-teal-700 font-bold text-lg hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
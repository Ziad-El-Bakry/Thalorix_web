"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#e2e3ea] overflow-x-hidden overflow-y-auto">
      {/* Sidebar Section */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center px-4 py-12 w-full lg:max-w-103 lg:min-h-screen bg-[#103B40] shadow-2xl z-20"
      >
        <Link
          href="/"
          className="group relative flex flex-col items-center justify-center w-full"
        >
          <div className="relative flex items-center justify-center w-70 h-70 md:w-87.5 md:h-87.5 lg:w-95 lg:h-87.5">
            {/* Animated Aura */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000 blur-[30px] md:blur-[50px]"
              style={{
                background:
                  "conic-gradient(from 0deg, #22D3EE, transparent, #22D3EE, transparent, #22D3EE)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-full h-full"
              />
            </div>

            {/* SVG Neon Stroke - Responsive Version */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
            >
              <filter id="neon-glow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="#22D3EE"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="10"
                animate={{
                  strokeDashoffset: [0, -180],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  strokeDashoffset: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: {
                    duration: 2,
                    delay: 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="opacity-100"
                filter="url(#neon-glow)"
              />
            </svg>
            {/* Logo Image with corrected path */}
            <div className="relative z-30 bg-[#103B40] rounded-full p-2 border border-white/5 shadow-inner">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/images/thalorix.png"
                  alt="Thalorix Logo"
                  width={250}
                  height={250}
                  priority
                  className="relative z-40 w-56.25 md:w-50 lg:w-71.25 h-auto transition-all duration-700 group-hover:drop-shadow-[0_0_50px_rgba(34,211,238,0.7)]"
                />
              </motion.div>
            </div>
          </div>

          <div className="mt-4 md:mt-8 flex flex-col items-center">
            <motion.span
              className="uppercase text-white text-xl md:text-3xl font-black tracking-[0.2em] md:tracking-[0.4em] transition-all duration-500 group-hover:text-cyan-300"
              style={{ textShadow: "0 0 15px rgba(34,211,238,0.3)" }}
            >
              THALORIX
            </motion.span>
            <div className="h-0.5 w-0 bg-blue-400 mt-2 transition-all duration-700 group-hover:w-full opacity-50" />
          </div>
        </Link>
      </motion.aside>

      {/* Hero Content Section */}
      <main className="flex-1 flex items-center justify-center px-4 md:px-12 lg:px-16 py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-225"
        >
          <section
            className="relative rounded-[25px] md:rounded-[40px] border-[5px] md:border-10 p-6 md:p-16 bg-[#f5f6fb] shadow-[10px_10px_30px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[30px_30px_80px_rgba(0,0,0,0.15)]"
            style={{ borderColor: "rgba(255,255,255,0.5)" }}
          >
            <div className="flex flex-col gap-6 md:gap-8">
              <h1 className="font-black leading-[1.1] text-3xl md:text-6xl lg:text-7xl text-[#103B40]">
                <div>Launch your</div>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-700 to-cyan-600">
                  Startup Now!
                </span>
              </h1>
              <p className="font-medium text-base md:text-2xl text-[#346C73]">
                Code, preview, manage. Everything in one flow. Built for
                founders.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto cursor-pointer px-6 md:px-16 py-4 md:py-4 rounded-[20px] md:rounded-[35px] text-xl md:text-2xl font-black transition-all shadow-xl bg-[#103B40] text-[#A3C9D9] hover:bg-[#144a50]"
                >
                  <Link
                    href="/login"
                    className="text-[#A3C9D9] font-bold text-base md:text-2xl hover:underline py-2"
                  >
                    Login
                  </Link>
                </motion.button>
                <Link
                  href="/register"
                  className="text-teal-700 font-bold text-base md:text-lg hover:underline py-2"
                >
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

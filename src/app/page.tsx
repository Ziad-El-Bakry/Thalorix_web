import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
    return (
        <div style={{ backgroundColor: '#e2e3ea', minHeight: '100vh' }} className="flex flex-col lg:flex-row">
            {/* Left Sidebar */}
            <div
                className="hidden lg:flex flex-col items-center justify-center gap-8 px-6 py-8"
                style={{ width: '100%', maxWidth: '417px', minHeight: '100vh', backgroundColor: '#103B40' }}
            >
                    {/* Logo - Clickable */}
                    <Link href="/" className="group flex flex-col items-center gap-2">
                        <div className="relative">
                            {/* <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full group-hover:bg-cyan-400/40 transition-all duration-500"></div> */}
                            
                            <Image
                                src="/logoS.png"
                                alt="Thalorix Logo"
                                width={361}
                                height={346}
                                className="relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:drop-shadow-[0_0_100px_rgba(34,211,238,0.6)] transition-all duration-650"
                            />
                        </div>
                    </Link>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col" style={{ backgroundColor: '#e2e3ea', minHeight: '100vh' }}>
                    {/* Navbar */}
                    <div
                        className="flex flex-col md:flex-row items-center px-4 md:px-8 py-4 gap-4 md:gap-0"
                        style={{
                            backgroundColor: '#e2e3ea',
                            borderBottom: '1px solid rgba(0,0,0,0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <div className="flex items-center gap-4 md:gap-12 flex-1 overflow-x-auto">
                            <nav className="flex gap-4 md:gap-8 text-sm md:text-base whitespace-nowrap">
                                <Link href="/" className="text-teal-700 font-medium hover:opacity-60 transition">Home</Link>
                                <Link href="/messages" className="text-teal-700 font-medium hover:opacity-60 transition">Message</Link>
                                <Link href="/community" className="text-teal-700 font-medium hover:opacity-60 transition">Community</Link>
                                <Link href="/marketplace" className="text-teal-700 font-medium hover:opacity-60 transition">Marketplace</Link>
                                <Link href="/ai-tools" className="text-teal-700 font-medium hover:opacity-60 transition">AI Tools</Link>
                                <Link href="/profile" className="text-teal-700 font-medium hover:opacity-60 transition">Profile</Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link href="/register" className="text-teal-700 font-medium hover:opacity-75 transition text-sm md:text-base">Sign up</Link>
                            <button
                                className="px-4 md:px-6 py-2 rounded font-medium transition hover:opacity-90 text-sm md:text-base"
                                style={{
                                    backgroundColor: '#103B40',
                                    color: '#A3C9D9',
                                }}
                            >
                                Login
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex items-center justify-center px-4 md:px-8 lg:px-12 py-8 md:py-12">
                        <div
                            className="rounded-2xl md:rounded-3xl border-4 md:border-8 p-6 md:p-12 lg:p-16 flex flex-col items-start gap-8 lg:gap-14 transition hover:shadow-2xl w-full"
                            style={{
                                maxWidth: '900px',
                                backgroundColor: '#f5f6fb',
                                borderColor: 'rgba(255, 255, 255, 0.23)',
                                boxShadow: '7px 14px 4px rgba(0, 0, 0, 0.25)',
                            }}
                        >
                            {/* Hero Content */}
                            <div className="flex flex-col gap-6 md:gap-8">
                                <div>
                                    <h1
                                        className="font-bold leading-tight text-3xl md:text-5xl lg:text-6xl"
                                        style={{
                                            color: '#103B40',
                                            textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                        }}
                                    >
                                        Launch your<br />
                                        Startup Now!
                                    </h1>
                                </div>

                                <p
                                    className="font-medium text-lg md:text-2xl"
                                    style={{
                                        color: '#346C73',
                                        lineHeight: '1.2',
                                    }}
                                >
                                    Code, preview, manage. Everything in one flow.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 pt-2 md:pt-4 w-full">
                                    <button
                                        className="px-6 md:px-12 py-2 md:py-3 rounded font-medium text-sm md:text-lg transition transform hover:opacity-90 hover:scale-105 active:scale-95 w-full sm:w-auto"
                                        style={{
                                            backgroundColor: '#103B40',
                                            color: '#A3C9D9',
                                            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                        }}
                                    >
                                        Try it now for free
                                    </button>
                                    <a
                                        href="#learn"
                                        className="font-medium text-sm md:text-lg hover:opacity-75 transition"
                                        style={{ color: '#346C73' }}
                                    >
                                        Learn more
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}
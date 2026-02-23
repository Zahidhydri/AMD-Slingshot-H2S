import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Blocks, Zap, ArrowRight, Github, Code, Cpu, Share2, Play, Layout } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white/50 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] transition-all duration-300 group hover:-translate-y-1">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-blue-100/50 shadow-sm">
            <Icon className="w-7 h-7 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed font-light">{description}</p>
    </div>
);

const StepCard = ({ number, title, description, icon: Icon }) => (
    <div className="flex flex-col items-center text-center relative z-10">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-xl shadow-blue-600/20 ring-4 ring-blue-50">
            <Icon className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-2">Step {number}: {title}</h4>
        <p className="text-gray-600 text-sm max-w-[250px] leading-relaxed">{description}</p>
    </div>
);

const Home = () => {
    return (
        <div className="min-h-screen bg-[#fafcff] font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-md shadow-blue-500/20">
                                <Blocks className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-indigo-800 tracking-tight">
                                BlockForge AI
                            </span>
                        </div>
                        <div className="flex items-center space-x-6 shrink-0">
                            <a href="https://github.com/Zahidhydri/AMD-Slingshot-H2S" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2 font-medium">
                                <Github className="w-5 h-5" />
                                <span className="hidden sm:inline">Star on GitHub</span>
                            </a>
                            <Link to="/editor" className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all bg-gray-900 rounded-full hover:bg-black shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 hover:-translate-y-0.5">
                                Open Editor
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden flex-1">
                {/* Background Decor */}
                <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl isolate" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#93c5fd] to-[#c4b5fd] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center px-5 py-2 mt-8 rounded-full bg-white border border-blue-100 text-blue-700 text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-50 hover:bg-blue-50 transition-colors cursor-default">
                        <Cpu className="w-4 h-4 mr-2 text-blue-600" />
                        Built for AMD Slingshot H2S
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-8">
                        The No-Code <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative inline-block">
                            Generative App Builder
                            <svg className="absolute w-full h-4 -bottom-1 left-0 text-blue-400/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" /></svg>
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-light">
                        Empowering <span className="text-blue-600 font-semibold underline decoration-blue-200 decoration-4">all students</span> to build custom AI tools visually. Remove the technical barrier and shift from a consumer to a <span className="text-indigo-600 font-semibold italic">creator</span> of specialized AI solutions.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
                        <Link to="/editor" className="inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-full hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 w-full sm:w-auto uppercase tracking-wide">
                            Start Building Free
                            <ArrowRight className="w-6 h-6 ml-3" />
                        </Link>
                        <a href="#how-it-works" className="inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-gray-700 transition-all bg-white border-2 border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 w-full sm:w-auto shadow-sm hover:shadow hover:-translate-y-1">
                            <Play className="w-5 h-5 mr-3 text-gray-400 fill-current" />
                            See How It Works
                        </a>
                    </div>
                </div>

                {/* Dashboard Image / Animated SVG Graphic */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                    <div className="relative rounded-3xl bg-gray-900 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-[2.5rem] lg:p-4 shadow-2xl shadow-indigo-500/10">
                        <div className="bg-[#0f172a] rounded-2xl shadow-sm border border-gray-800 overflow-hidden relative">
                            {/* Browser "Chrome" - Mac Style */}
                            <div className="bg-[#1e293b] border-b border-gray-800 p-4 flex items-center justify-between">
                                <div className="flex space-x-2">
                                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 bg-[#0f172a] text-gray-400 text-xs font-mono px-6 py-1.5 rounded-md border border-gray-800 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-blue-400" /> blockforge-ai.local
                                </div>
                            </div>

                            {/* High-Fidelity Abstract Canvas SVG */}
                            <div className="w-full h-[400px] md:h-[550px] bg-[#020617] flex items-center justify-center relative overflow-hidden">
                                <svg width="100%" height="100%" className="absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="dark-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                                        </pattern>
                                        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                        <linearGradient id="edge-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8b5cf6" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feGaussianBlur stdDeviation="10" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#dark-grid)" />

                                    {/* Animated Edges */}
                                    <path d="M 280 200 C 350 200, 350 150, 420 150" fill="none" stroke="url(#edge-gradient)" strokeWidth="4" className="animate-pulse" />
                                    <circle cx="280" cy="200" r="4" fill="#60a5fa">
                                        <animateMotion dur="2s" repeatCount="indefinite" path="M 0 0 C 70 0, 70 -50, 140 -50" />
                                    </circle>

                                    <path d="M 640 150 C 700 150, 700 250, 780 250" fill="none" stroke="url(#edge-gradient-2)" strokeWidth="4" strokeDasharray="8 8">
                                        <animate attributeName="stroke-dashoffset" values="16;0" dur="1s" repeatCount="indefinite" />
                                    </path>
                                    <circle cx="640" cy="150" r="4" fill="#a78bfa">
                                        <animateMotion dur="2.5s" repeatCount="indefinite" path="M 0 0 C 60 0, 60 100, 140 100" />
                                    </circle>

                                    {/* Glassmorphic Nodes */}
                                    {/* Input Node */}
                                    <g transform="translate(60, 150)">
                                        <rect width="220" height="100" rx="16" fill="rgba(30,41,59,0.7)" stroke="rgba(59,130,246,0.5)" strokeWidth="2" filter="backdrop-blur(10px)" />
                                        <rect width="220" height="40" rx="16" fill="rgba(15,23,42,0.8)" />
                                        <circle cx="220" cy="50" r="6" fill="#3b82f6" stroke="#0f172a" strokeWidth="3" />
                                        <text x="50" y="25" fontSize="14" fontWeight="bold" fill="#f8fafc">Input Context</text>
                                        <text x="20" y="65" fontSize="12" fill="#94a3b8" fontFamily="monospace">"Explain quantum computing"</text>
                                        <path d="M 20 20 h 16 v 4 h -16 z" fill="#3b82f6" />
                                        <path d="M 20 16 h 16 v 12 h -16 z" fill="none" stroke="#3b82f6" strokeWidth="2" rx="2" />
                                    </g>

                                    {/* Action Node */}
                                    <g transform="translate(420, 100)" filter="url(#glow)">
                                        <rect width="220" height="110" rx="16" fill="rgba(30,41,59,0.9)" stroke="#8b5cf6" strokeWidth="2" />
                                        <rect width="220" height="40" rx="16" fill="rgba(15,23,42,1)" />
                                        <circle cx="0" cy="50" r="6" fill="#ec4899" stroke="#0f172a" strokeWidth="3" />
                                        <circle cx="220" cy="50" r="6" fill="#8b5cf6" stroke="#0f172a" strokeWidth="3" />
                                        <text x="45" y="25" fontSize="14" fontWeight="bold" fill="#f8fafc">AI Processor</text>
                                        <text x="20" y="65" fontSize="12" fill="#94a3b8" textLength="180">Prompt: Explain to a 5yr old.</text>
                                        <circle cx="28" cy="20" r="8" fill="none" stroke="#a855f7" strokeWidth="2" />
                                        <path d="M 26 18 l 4 4 M 30 18 l -4 4" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
                                        {/* Status indicator */}
                                        <circle cx="200" cy="20" r="4" fill="#22c55e" className="animate-pulse" />
                                    </g>

                                    {/* Output Node */}
                                    <g transform="translate(780, 200)">
                                        <rect width="220" height="100" rx="16" fill="rgba(30,41,59,0.7)" stroke="rgba(16,185,129,0.5)" strokeWidth="2" />
                                        <rect width="220" height="40" rx="16" fill="rgba(15,23,42,0.8)" />
                                        <circle cx="0" cy="50" r="6" fill="#10b981" stroke="#0f172a" strokeWidth="3" />
                                        <text x="50" y="25" fontSize="14" fontWeight="bold" fill="#f8fafc">Live Micro-App</text>
                                        <text x="20" y="65" fontSize="12" fill="#10b981" fontFamily="monospace">URL: /app/1a2b3c</text>
                                        <rect x="20" y="14" width="16" height="12" rx="2" fill="none" stroke="#10b981" strokeWidth="2" />
                                        <path d="M 24 10 l -4 4" stroke="#10b981" strokeWidth="2" />
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mission Section */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50 border-y border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                    <Sparkles size={400} />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">The Mission</span>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
                                Shifting Students from <br />
                                Users to <span className="text-blue-600 underline">Architects</span>
                            </h2>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                                        <Layout className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">The Concept</h4>
                                        <p className="text-gray-600 leading-relaxed font-light">A web-based, drag-and-drop canvas that removes the technical barrier to creating custom AI tools entirely.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                                        <Zap className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">How it Works</h4>
                                        <p className="text-gray-600 leading-relaxed font-light">Visually connect pre-configured AI blocks (Audio &rarr; Summarize &rarr; Graphic) to build tailored, specialized workflows.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                                        <Share2 className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">The Impact</h4>
                                        <p className="text-gray-600 leading-relaxed font-light">Students are no longer mere consumers of generic chatbots; they become active creators of highly tailored AI solutions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-blue-50/50">
                            <div className="rounded-[2rem] overflow-hidden bg-slate-950 aspect-[4/3] relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 mix-blend-overlay"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <Bot size={80} className="text-blue-400 mx-auto animate-bounce duration-[2000ms]" />
                                        <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                            <span className="text-white text-sm font-bold tracking-widest uppercase">App Deployment Live</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Everything you need to build faster</h2>
                        <p className="mt-4 text-xl text-gray-600">Enterprise-grade architecture abstracted into a no-code visual canvas.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <FeatureCard
                            icon={Blocks}
                            title="React Flow Canvas"
                            description="Intuitive, buttery-smooth drag-and-drop interface. Visually arrange complex NLP pipelines without looking at code."
                        />
                        <FeatureCard
                            icon={Bot}
                            title="Google Gemini"
                            description="Native integration with Google's blazing fast generative models. Capable of reasoning, summarization, and data extraction."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant FastAPI Backend"
                            description="Visual graphs are compiled into robust Python API payloads and parsed as Directed Acyclic Graphs (DAGs) on the fly."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div className="flex items-center space-x-3 mb-6 md:mb-0">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Blocks className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">BlockForge AI</span>
                        </div>
                        <div className="flex space-x-6">
                            <a href="https://github.com/Zahidhydri/AMD-Slingshot-H2S" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <span className="sr-only">GitHub</span>
                                <Github className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                        <p className="text-gray-400 text-sm font-medium">
                            &copy; {new Date().getFullYear()} BlockForge AI. All rights reserved.
                        </p>
                        <p className="text-gray-400 font-medium text-sm flex items-center justify-center gap-1.5 bg-gray-800/50 px-4 py-2 rounded-full ring-1 ring-gray-700/50">
                            Built with <span className="text-red-500 animate-pulse text-lg leading-none">❤️</span> by <a href="https://github.com/Zahidhydri" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Zahid Hydri & Taskeen Hydri</a> for the <span className="font-bold text-white tracking-wide ml-1">AMD Slingshot H2S Hackathon</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

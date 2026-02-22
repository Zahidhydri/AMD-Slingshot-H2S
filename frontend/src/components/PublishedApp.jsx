import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Play, Sparkles, Image as ImageIcon, Volume2, ArrowLeft, RefreshCw, Cpu } from 'lucide-react';

function PublishedApp() {
    const { appId } = useParams();
    const [appData, setAppData] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApp = async () => {
            try {
                const response = await fetch(`http://localhost:8000/app/${appId}`);
                if (!response.ok) throw new Error('App not found');
                const data = await response.json();
                setAppData(data);

                // Initialize input field from app data if available, but don't run automatically
                const inputNode = data.nodes?.find(n => n.type === 'input');
                if (inputNode?.data?.context && !userInput) {
                    setUserInput(inputNode.data.context);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApp();
    }, [appId]);

    const handleRun = async () => {
        if (!userInput.trim()) return;
        setIsRunning(true);
        setResult(null);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/run/${appId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_input: userInput })
            });

            if (!response.ok) throw new Error('Execution failed');

            const data = await response.json();
            setResult(data.result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsRunning(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
                <p className="text-xl font-medium animate-pulse">Initializing BlockForge Runtime...</p>
            </div>
        );
    }

    if (error && !appData) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
                <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-3xl max-w-md text-center">
                    <h1 className="text-3xl font-bold mb-4 text-red-400">404: Not Found</h1>
                    <p className="text-gray-400 mb-8">{error || "The application you're looking for doesn't exist or has been removed."}</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-2xl font-bold transition-all">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const renderResult = () => {
        if (!result) return null;

        if (result.startsWith('IMAGE:')) {
            const imageUrl = result.replace('IMAGE:', '');
            return (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-sm">
                        <ImageIcon size={18} />
                        Generated Masterpiece
                    </div>
                    <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-500/20 bg-slate-900 aspect-square relative group">
                        <img src={imageUrl} alt="Generated" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <a href={imageUrl} download target="_blank" rel="noreferrer" className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-all">Save Image</a>
                        </div>
                    </div>
                </div>
            );
        }

        if (result.startsWith('AUDIO:')) {
            const audioUrl = result.replace('AUDIO:', '');
            return (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-sm">
                        <Volume2 size={18} />
                        Synthesized Audio
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-emerald-500/20 p-8 rounded-3xl flex flex-col items-center gap-6 shadow-xl">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                            <Volume2 size={40} className="text-emerald-400" />
                        </div>
                        <audio controls className="w-full filter invert hue-rotate-180 brightness-150">
                            <source src={audioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            );
        }

        return (
            <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-sm">
                    <Sparkles size={18} />
                    AI Insights
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-xl text-gray-800 leading-relaxed text-lg border border-gray-100 italic">
                    "{result}"
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans pb-20">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 p-6 md:p-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
                        <Cpu className="text-white" size={24} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">BlockForge <span className="text-indigo-400 text-sm font-medium bg-indigo-400/10 px-2 py-0.5 rounded-lg ml-1">AI</span></span>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 px-4 py-2 rounded-full text-xs font-bold text-slate-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    DEPLOYED APP: {appId.slice(4)}
                </div>
            </header>

            <main className="relative z-10 max-w-2xl mx-auto px-6 mt-4">
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        {appData?.name || "AI Workflow"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Live</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-lg mx-auto leading-relaxed">
                        The intelligence is ready. Provide your requirements below to begin the generation.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={80} className="text-indigo-500" />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4 ml-1">Configuration & Input</label>
                            <textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Describe what you want the AI to do..."
                                className="w-full bg-slate-950/60 border-2 border-slate-800 focus:border-indigo-500 rounded-[2rem] p-8 text-white text-xl placeholder:text-slate-700 outline-none transition-all min-h-[220px] resize-none shadow-2xl"
                            />
                        </div>

                        <button
                            onClick={handleRun}
                            disabled={isRunning || !userInput.trim()}
                            className={`w-full group relative overflow-hidden h-20 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-3 active:scale-95 ${isRunning || !userInput.trim()
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)]'
                                }`}
                        >
                            {isRunning ? (
                                <>
                                    <RefreshCw className="animate-spin" size={24} />
                                    <span>Synthesizing...</span>
                                </>
                            ) : (
                                <>
                                    <Play size={24} className="fill-current" />
                                    <span>Forge Result</span>
                                </>
                            )}
                        </button>
                    </div>

                    {renderResult()}

                    {error && (
                        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center">
                            ⚠️ Error: {error}
                        </div>
                    )}
                </div>

                <footer className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium">
                        Built with
                        <Link to="/" className="text-white hover:text-indigo-400 transition-colors flex items-center gap-1 font-bold">
                            BlockForge AI
                        </Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default PublishedApp;


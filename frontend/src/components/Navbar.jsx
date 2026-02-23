import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Home, Loader2, Sparkles, Box, LayoutPanelTop } from 'lucide-react';

const Navbar = ({ onNewProject, onDeploy, isDeploying, previewAppUrl, onTogglePreview }) => {
    return (
        <nav className="h-14 border-b border-slate-800 bg-[#0f172a] px-4 flex items-center justify-between shadow-sm z-20 shrink-0">
            <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg hover:text-blue-400 transition-colors">
                    <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Box className="w-4 h-4 text-white" />
                    </div>
                    <span>BlockForge <span className="text-blue-400">Studio</span></span>
                </Link>

                <div className="flex items-center gap-2 border-l border-slate-700 pl-6">
                    <button
                        onClick={onNewProject}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-all shadow-sm"
                    >
                        <PlusCircle className="w-3.5 h-3.5" />
                        New Flow
                    </button>

                    <Link
                        to="/"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-all"
                    >
                        <Home className="w-3.5 h-3.5" />
                        Exit Studio
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* View Switcher */}
                <div className="flex items-center bg-[#0f172a] border border-slate-700 rounded-lg p-0.5 mr-2">
                    <button
                        onClick={() => previewAppUrl && onTogglePreview()}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${!previewAppUrl ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Canvas
                    </button>
                    <button
                        onClick={() => !previewAppUrl && onTogglePreview()}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${previewAppUrl ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        title="View Live App"
                    >
                        <LayoutPanelTop className="w-3.5 h-3.5" />
                        Preview
                    </button>
                </div>

                {/* Status indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded border border-slate-800 text-xs text-slate-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    IDE Active
                </div>

                <button
                    onClick={onDeploy}
                    disabled={isDeploying}
                    className={`flex items-center justify-center gap-2 px-5 py-1.5 rounded font-bold text-xs shadow-lg transition-all active:scale-95 group border ${isDeploying
                        ? 'bg-slate-800 border-slate-700 cursor-not-allowed text-slate-400'
                        : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white hover:shadow-blue-500/20'
                        }`}
                >
                    {isDeploying ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                            Compiling...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                            Build App
                        </>
                    )}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

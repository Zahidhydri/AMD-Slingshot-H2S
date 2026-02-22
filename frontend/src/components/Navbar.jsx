import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Home, PlayCircle, Loader2 } from 'lucide-react';

const Navbar = ({ onNewProject, onDeploy, isDeploying }) => {
    return (
        <nav className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shadow-sm z-20">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2 text-gray-900 font-bold text-xl">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">BF</span>
                    </div>
                    BlockForge AI
                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onNewProject}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                    >
                        <PlusCircle className="w-4 h-4" />
                        New Project
                    </button>

                    <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onDeploy}
                    disabled={isDeploying}
                    className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 group ${isDeploying
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-black hover:bg-gray-800 text-white'
                        }`}
                >
                    {isDeploying ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publishing...
                        </>
                    ) : (
                        <>
                            <PlayCircle className="w-4 h-4" />
                            Publish App
                        </>
                    )}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

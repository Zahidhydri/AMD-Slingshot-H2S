import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Blocks, ArrowLeft, Loader2, Bot, AlertTriangle, PlayCircle } from 'lucide-react';

const AppViewer = () => {
    const { id } = useParams();
    const [appData, setAppData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApp = async () => {
            try {
                // To fetch from Firebase, we added an endpoint in the backend for fetching published apps.
                // Wait, we haven't added the backend endpoint yet! We need to add one.
                const response = await fetch(`http://localhost:8000/app/${id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('App not found or no longer available.');
                    }
                    throw new Error('Failed to load the application from the server.');
                }

                const data = await response.json();
                setAppData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApp();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center font-sans">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Loading your Micro-App...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center font-sans p-6 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-red-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Error</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors w-full">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafcff] font-sans flex flex-col">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md shadow-blue-500/20">
                        <Blocks className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight">
                            {appData?.appName || 'BlockForge Micro-App'}
                        </h1>
                        <p className="text-xs text-gray-500">Live Published Endpoint</p>
                    </div>
                </div>
                <Link to="/editor" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Editor
                </Link>
            </header>

            {/* App Content */}
            <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6">
                <div className="max-w-3xl w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-8 py-6 flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                            <Bot className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Generated Result</h2>
                            <p className="text-sm text-gray-500 font-medium">This is the final output of the generated workflow.</p>
                        </div>
                    </div>

                    <div className="p-8">
                        {appData?.finalResult ? (
                            appData.finalResult.startsWith('IMAGE:') ? (
                                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner flex justify-center p-4">
                                    <img
                                        src={appData.finalResult.replace('IMAGE:', '')}
                                        alt="Generated blockforge output"
                                        className="max-w-full h-auto rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
                                    />
                                </div>
                            ) : (
                                <div className="prose prose-blue max-w-none">
                                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                                        {appData.finalResult}
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-12 text-gray-400 italic">
                                No result generated for this workflow.
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                        <PlayCircle className="w-4 h-4 text-gray-400" /> Powered by BlockForge AI & Google Gemini
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppViewer;

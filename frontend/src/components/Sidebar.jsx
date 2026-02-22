import React, { useState } from 'react';
import { Type, Sparkles, Terminal, PlayCircle, Loader2, Image as ImageIcon, Mic } from 'lucide-react';

const Sidebar = ({ reactFlowInstance, onDeploy }) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-72 border-r border-gray-200 bg-white p-6 flex flex-col gap-6 h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
            <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-1">BlockForge AI</h2>
                <p className="text-sm text-gray-500 font-medium">Build gen-ai tools with visual blocks.</p>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">
                    Available Blocks
                </h3>

                {/* Input Block */}
                <div
                    className="p-4 border border-emerald-200 rounded-xl cursor-grab hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md transition-all bg-white flex items-center justify-start gap-3 text-emerald-700 font-semibold text-sm group"
                    onDragStart={(event) => onDragStart(event, 'input')}
                    draggable
                >
                    <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                        <Type className="w-4 h-4 text-emerald-600" />
                    </div>
                    Input Block
                </div>

                {/* Gemini Block */}
                <div
                    className="p-4 border border-indigo-200 rounded-xl cursor-grab hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md transition-all bg-white flex items-center justify-start gap-3 text-indigo-700 font-semibold text-sm group"
                    onDragStart={(event) => onDragStart(event, 'gemini')}
                    draggable
                >
                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                    </div>
                    Gemini Processor
                </div>

                <div
                    className="p-4 border border-fuchsia-200 rounded-xl cursor-grab hover:bg-fuchsia-50 hover:border-fuchsia-300 hover:shadow-md transition-all bg-white flex items-center justify-start gap-3 text-fuchsia-700 font-semibold text-sm group"
                    onDragStart={(event) => onDragStart(event, 'image')}
                    draggable
                >
                    <div className="p-2 bg-fuchsia-100 rounded-lg group-hover:bg-fuchsia-200 transition-colors">
                        <ImageIcon className="w-4 h-4 text-fuchsia-600" />
                    </div>
                    Image Generator
                </div>

                {/* Audio Block */}
                <div
                    className="p-4 border border-cyan-200 rounded-xl cursor-grab hover:bg-cyan-50 hover:border-cyan-300 hover:shadow-md transition-all bg-white flex items-center justify-start gap-3 text-cyan-700 font-semibold text-sm group"
                    onDragStart={(event) => onDragStart(event, 'audio')}
                    draggable
                >
                    <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors">
                        <Mic className="w-4 h-4 text-cyan-600" />
                    </div>
                    Audio Generator
                </div>

                {/* Output Block */}
                <div
                    className="p-4 border border-orange-200 rounded-xl cursor-grab hover:bg-orange-50 hover:border-orange-300 hover:shadow-md transition-all bg-white flex items-center justify-start gap-3 text-orange-700 font-semibold text-sm group"
                    onDragStart={(event) => onDragStart(event, 'output')}
                    draggable
                >
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <Terminal className="w-4 h-4 text-orange-600" />
                    </div>
                    Output Display
                </div>
            </div>

        </aside>
    );
};

export default Sidebar;

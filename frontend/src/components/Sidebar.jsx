import React, { useState } from 'react';
import {
    LayoutTemplate, Box, Type, MousePointerClick, AlignLeft,
    Image as ImageIcon, LayoutGrid, Globe, Database, Network,
    RotateCw, Bot, Sparkles, Mic, ChevronDown, ChevronRight, GripVertical, FileTerminal
} from 'lucide-react';
import useStore from '../store';

const SidebarItem = ({ type, icon: Icon, label, description, colorClass }) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/50 cursor-grab active:cursor-grabbing border border-transparent hover:border-slate-700/50 transition-all group"
            onDragStart={(event) => onDragStart(event, type)}
            draggable
        >
            <div className="text-slate-600 group-hover:text-slate-400 transition-colors">
                <GripVertical size={14} />
            </div>
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${colorClass}`}>
                <Icon size={16} />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">{label}</span>
                <span className="text-[10px] text-slate-500 truncate w-32">{description}</span>
            </div>
        </div>
    );
};

const SidebarSection = ({ title, items, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-2 mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase hover:text-slate-300 transition-colors"
            >
                {title}
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>

            {isOpen && (
                <div className="space-y-1">
                    {items.map((item, index) => (
                        <SidebarItem key={index} {...item} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Sidebar = () => {
    const uiNodes = [
        { type: 'page', icon: LayoutTemplate, label: 'Page', description: 'Screen or Route', colorClass: 'bg-blue-500/20 text-blue-400' },
        { type: 'container', icon: Box, label: 'Container', description: 'Flex/Grid Wrapper', colorClass: 'bg-blue-500/20 text-blue-400' },
        { type: 'textInput', icon: Type, label: 'Text Input', description: 'User input field', colorClass: 'bg-blue-500/20 text-blue-400' },
        { type: 'button', icon: MousePointerClick, label: 'Button', description: 'Clickable action', colorClass: 'bg-blue-500/20 text-blue-400' },
        { type: 'form', icon: AlignLeft, label: 'Form', description: 'Form submission', colorClass: 'bg-blue-500/20 text-blue-400' },
        { type: 'imageDisplay', icon: ImageIcon, label: 'Image', description: 'Display media', colorClass: 'bg-blue-500/20 text-blue-400' },
        { type: 'listView', icon: LayoutGrid, label: 'List/Grid', description: 'Repeat data', colorClass: 'bg-blue-500/20 text-blue-400' },
        { type: 'output', icon: FileTerminal || Box, label: 'Final Output', description: 'End of logic flow', colorClass: 'bg-orange-500/20 text-orange-400' },
    ];

    const logicNodes = [
        { type: 'apiRequest', icon: Globe, label: 'API Request', description: 'Fetch/REST call', colorClass: 'bg-emerald-500/20 text-emerald-400' },
        { type: 'database', icon: Database, label: 'Database', description: 'CRUD Actions', colorClass: 'bg-emerald-500/20 text-emerald-400' },
        { type: 'condition', icon: Network, label: 'Condition', description: 'If/Else logic', colorClass: 'bg-emerald-500/20 text-emerald-400' },
        { type: 'loop', icon: RotateCw, label: 'Loop', description: 'Iterate array', colorClass: 'bg-emerald-500/20 text-emerald-400' },
    ];

    const aiNodes = [
        { type: 'gemini', icon: Bot, label: 'Gemini AI', description: 'Text generation', colorClass: 'bg-purple-500/20 text-purple-400' },
        { type: 'imageGen', icon: Sparkles, label: 'AI Image', description: 'Generate imagery', colorClass: 'bg-purple-500/20 text-purple-400' },
        { type: 'textToSpeech', icon: Mic, label: 'Text-to-Speech', description: 'Audio synthesis', colorClass: 'bg-purple-500/20 text-purple-400' },
    ];

    return (
        <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col h-full overflow-hidden shrink-0 z-10 shadow-xl">
            <div className="p-4 border-b border-slate-800">
                <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-400" />
                    Block Library
                </h2>
                <p className="text-xs text-slate-500 mt-1">Drag and drop nodes to canvas</p>

                {/* Search - Visual Only for now */}
                <div className="mt-4 relative">
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        className="w-full bg-slate-800 text-slate-300 text-xs px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-blue-500/50 border border-slate-700"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <SidebarSection title="UI Components" items={uiNodes} />
                <SidebarSection title="Data & Logic" items={logicNodes} />
                <SidebarSection title="AI Services" items={aiNodes} />
            </div>

            {/* Context/Helper footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>BlockForge AI v2.0</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Systems Operational"></span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

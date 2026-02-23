import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import useStore from '../../store';

/**
 * BaseNode wrapper for all visual programming nodes.
 * Handles the consistent styling, selected state borders,
 * title bar, and the left/right connection ports.
 */
const BaseNode = ({ id, title, icon: Icon, children, isSelected, accentColor = 'blue' }) => {
    const setSelectedNode = useStore((state) => state.setSelectedNode);
    const deleteNode = useStore((state) => state.deleteNode);

    // Color maps for the sleek IDE look
    const colorMap = {
        blue: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
        purple: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
        green: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
        orange: 'border-orange-500/50 bg-orange-500/10 text-orange-400',
        gray: 'border-gray-500/50 bg-gray-500/10 text-gray-400',
    };

    const headerTheme = colorMap[accentColor] || colorMap.blue;

    return (
        <div
            className={`
                relative bg-[#0f172a]/90 backdrop-blur-xl border rounded-xl shadow-2xl min-w-[240px]
                transition-all duration-200 ease-in-out cursor-pointer overflow-hidden
                ${isSelected ? `ring-2 ring-${accentColor}-400 ring-offset-2 ring-offset-[#0f172a] border-${accentColor}-500/70 scale-[1.02]` : 'border-slate-700/50 hover:border-slate-600'}
            `}
            onClick={() => setSelectedNode(id)}
        >
            {/* Left Handle (Input) */}
            <Handle
                type="target"
                position={Position.Left}
                className={`w-3 h-3 border-2 border-[#0f172a] bg-${accentColor}-400 rounded-full transition-all hover:scale-125`}
            />

            {/* Header */}
            <div className={`px-4 py-2 border-b border-slate-700/50 flex items-center justify-between ${headerTheme}`}>
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
                </div>
                {/* Delete Node Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent setting as selected
                        deleteNode(id);
                    }}
                    className="p-1 hover:bg-black/20 rounded opacity-50 hover:opacity-100 hover:text-red-400 transition-all"
                    title="Delete Node"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Content Body */}
            <div className="p-4 text-slate-300">
                {children}
            </div>

            {/* Right Handle (Output) */}
            <Handle
                type="source"
                position={Position.Right}
                className={`w-3 h-3 border-2 border-[#0f172a] bg-${accentColor}-400 rounded-full transition-all hover:scale-125`}
            />
        </div>
    );
};

export default BaseNode;

import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Sparkles, X } from 'lucide-react';

const GeminiNode = ({ id, data, isConnectable }) => {
    const { updateNodeData, setNodes, setEdges } = useReactFlow();

    const onDelete = () => {
        setNodes((nodes) => nodes.filter((n) => n.id !== id));
        setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
    };

    return (
        <div className={`relative bg-white rounded-2xl shadow-xl border border-gray-100 w-[340px] transition-all hover:shadow-2xl group focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:ring-offset-2 ${data.executing ? 'ring-4 ring-purple-500 shadow-purple-500/30' : ''}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-3.5 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm animate-pulse">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-white tracking-wide text-sm">Gemini Processor</h3>
                </div>
                <button
                    onClick={onDelete}
                    className="p-1.5 hover:bg-black/10 rounded-lg transition-colors text-white/80 hover:text-white"
                    title="Delete Node"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 bg-white/50 backdrop-blur-md rounded-b-2xl">
                <div className="flex flex-col gap-2">
                    <label htmlFor="system-prompt" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                        <span>System Prompt</span>
                    </label>
                    <textarea
                        id="system-prompt"
                        className="w-full text-sm p-1 bg-transparent border-0 text-gray-700 focus:ring-0 focus:outline-none resize-none placeholder:text-gray-400"
                        rows={2}
                        placeholder="e.g., Translate to French..."
                        defaultValue={data.prompt}
                        onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
                    />
                </div>
            </div>

            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                className="w-5 h-5 bg-indigo-500 border-2 border-white shadow-md rounded-full hover:bg-indigo-400 hover:scale-125 transition-all z-10"
            />

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="w-5 h-5 bg-pink-500 border-2 border-white shadow-md rounded-full hover:bg-pink-400 hover:scale-125 transition-all z-10"
            />
        </div>
    );
};

export default memo(GeminiNode);

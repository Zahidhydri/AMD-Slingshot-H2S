import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Type, X } from 'lucide-react';

const InputNode = ({ id, data, isConnectable }) => {
    const { updateNodeData, setNodes, setEdges } = useReactFlow();

    const onDelete = () => {
        setNodes((nodes) => nodes.filter((n) => n.id !== id));
        setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
    };

    return (
        <div className={`relative bg-white rounded-2xl shadow-xl border border-emerald-100 w-[340px] transition-all hover:shadow-2xl group focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:ring-offset-2 ${data.executing ? 'ring-4 ring-emerald-500 shadow-emerald-500/30' : ''}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3.5 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Type className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-white tracking-wide text-sm">Input Block</h3>
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
                    <label htmlFor="user-context" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Initial Context Data
                    </label>
                    <textarea
                        id="user-context"
                        className="w-full text-sm p-1 bg-transparent border-0 text-gray-700 focus:ring-0 focus:outline-none resize-none placeholder:text-gray-400"
                        rows={3}
                        placeholder="Type your background data here..."
                        defaultValue={data.context}
                        onChange={(e) => updateNodeData(id, { context: e.target.value })}
                    />
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="!w-7 !h-7 !bg-emerald-500 border-[3px] border-white shadow-[0_0_10px_rgba(16,185,129,0.4)] rounded-xl hover:!bg-emerald-400 hover:scale-110 transition-all z-20 flex items-center justify-center after:content-[''] after:w-2 after:h-2 after:bg-white after:rounded-full"
            />
        </div>
    );
};

export default memo(InputNode);

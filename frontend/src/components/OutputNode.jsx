import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Terminal, X } from 'lucide-react';

const OutputNode = ({ id, data, isConnectable }) => {
    const { setNodes, setEdges } = useReactFlow();

    const onDelete = () => {
        setNodes((nodes) => nodes.filter((n) => n.id !== id));
        setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
    };

    return (
        <div className={`relative bg-white rounded-2xl shadow-xl border border-orange-100 w-[340px] transition-all hover:shadow-2xl group focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:ring-offset-2 ${data.executing ? 'ring-4 ring-orange-500 shadow-orange-500/30' : ''}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-rose-400 px-5 py-3.5 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Terminal className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-white tracking-wide text-sm">Output Display</h3>
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
            <div className="p-5 space-y-4 bg-gray-50/50 backdrop-blur-md rounded-b-2xl">
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Final Generation Result
                    </label>
                    <div className="w-full min-h-[100px] text-sm p-4 rounded-xl border border-gray-200 bg-white text-gray-600 shadow-inner overflow-y-auto whitespace-pre-wrap flex items-center justify-center">
                        {data.output ? (
                            data.output.startsWith('IMAGE:') ? (
                                <img src={data.output.replace('IMAGE:', '')} alt="Generated" className="w-full h-auto max-h-[300px] object-contain rounded-lg shadow-sm" />
                            ) : data.output.startsWith('AUDIO:') ? (
                                <audio controls src={data.output.replace('AUDIO:', '')} className="w-full outline-none"></audio>
                            ) : (
                                <div className="w-full text-left">
                                    {data.output.split(/(https?:\/\/[^\s]+)/g).map((part, i) => {
                                        if (part.match(/https?:\/\/[^\s]+/)) {
                                            return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline hover:no-underline font-medium break-all">{part}</a>;
                                        }
                                        return <span key={i}>{part}</span>;
                                    })}
                                </div>
                            )
                        ) : (
                            <span className="text-gray-300 italic">Waiting for execution...</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                className="w-5 h-5 bg-orange-500 border-2 border-white shadow-md rounded-full hover:bg-orange-400 hover:scale-125 transition-all z-10"
            />
        </div>
    );
};

export default memo(OutputNode);

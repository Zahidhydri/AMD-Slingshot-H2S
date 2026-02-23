import React from 'react';
import { Bot } from 'lucide-react';
import BaseNode from './BaseNode';

const GeminiNode = ({ id, data, selected }) => {
    const sysPrompt = data?.sysPrompt || 'You are a helpful assistant...';

    return (
        <BaseNode
            id={id}
            title="Gemini 1.5 Pro"
            icon={Bot}
            isSelected={selected}
            accentColor="purple"
        >
            <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-purple-300">System Prompt</div>
                <div className="text-xs text-slate-400 line-clamp-3 bg-slate-900/50 p-2 rounded-md border border-slate-800">
                    {sysPrompt}
                </div>
            </div>
        </BaseNode>
    );
};

export default GeminiNode;

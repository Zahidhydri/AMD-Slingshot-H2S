import React from 'react';
import { Mic, Sparkles } from 'lucide-react';
import BaseNode from './BaseNode';

const TextToSpeechNode = ({ id, data, selected }) => {
    const voice = data?.voice || 'Brian';
    const text = data?.text || 'Hello world...';

    return (
        <BaseNode
            id={id}
            title="Text-to-Speech"
            icon={Sparkles}
            isSelected={selected}
            accentColor="purple"
        >
            <div className="flex flex-col gap-2 relative">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Voice:</span>
                    <span className="text-purple-300 font-bold bg-purple-500/20 px-1.5 rounded">{voice}</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-900/50 p-2 rounded-md border border-slate-800">
                    <Mic className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-400 line-clamp-2 italic">
                        "{text}"
                    </div>
                </div>
            </div>
        </BaseNode>
    );
};

export default TextToSpeechNode;

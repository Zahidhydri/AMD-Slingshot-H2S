import React from 'react';
import { RotateCw } from 'lucide-react';
import BaseNode from './BaseNode';

const LoopNode = ({ id, data, selected }) => {
    const iterable = data?.iterable || 'usersList';

    return (
        <BaseNode
            id={id}
            title="Loop"
            icon={RotateCw}
            isSelected={selected}
            accentColor="emerald"
        >
            <div className="flex flex-col gap-2 relative">
                <div className="text-sm text-center bg-slate-800/80 px-2 py-1.5 rounded-md border border-slate-700/50">
                    <span className="text-emerald-400 font-bold mr-1">FOR EACH</span>
                    <span className="text-slate-300 font-mono text-xs">{iterable}</span>
                </div>
            </div>
        </BaseNode>
    );
};

export default LoopNode;

import React from 'react';
import { AlignLeft } from 'lucide-react';
import BaseNode from './BaseNode';

const FormNode = ({ id, data, selected }) => {
    const action = data?.action || '/submit';

    return (
        <BaseNode
            id={id}
            title="Form"
            icon={AlignLeft}
            isSelected={selected}
            accentColor="blue"
        >
            <div className="flex flex-col gap-2 relative">
                <div className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded w-fit">
                    Action: <span className="text-slate-200">{action}</span>
                </div>
                {/* Visual placeholder for form area */}
                <div className="w-full h-16 border border-dashed border-blue-500/30 rounded bg-blue-500/5 flex flex-col items-center justify-center opacity-70 gap-1.5 p-2">
                    <div className="w-full h-2 bg-slate-600/50 rounded-sm"></div>
                    <div className="w-full h-2 bg-slate-600/50 rounded-sm"></div>
                    <div className="w-1/2 h-4 bg-blue-600/50 rounded-sm mt-1"></div>
                </div>
            </div>
        </BaseNode>
    );
};

export default FormNode;

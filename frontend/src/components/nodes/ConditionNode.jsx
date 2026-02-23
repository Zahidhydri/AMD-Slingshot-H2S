import React from 'react';
import { Network } from 'lucide-react';
import BaseNode from './BaseNode';
import { Handle, Position } from '@xyflow/react';

const ConditionNode = ({ id, data, selected }) => {
    const condition = data?.condition || 'If user.isPremium == true';

    return (
        <BaseNode
            id={id}
            title="Condition"
            icon={Network}
            isSelected={selected}
            accentColor="emerald"
        >
            <div className="flex flex-col gap-2 relative">
                <div className="text-sm text-center bg-slate-800/80 px-2 py-1.5 rounded-md border border-slate-700/50">
                    <span className="text-emerald-400 font-bold mr-1">IF</span>
                    <span className="text-slate-300 font-mono text-xs">{condition}</span>
                </div>
                {/* Extra handle for True/False branches are usually done dynamically, 
                    but React Flow allows multiple handles. For visual simplicity, 
                    we stick to the standard BaseNode handles right now, 
                    or we could add them here overriding BaseNode. 
                    Let's keep it simple for the AST parser. */}
            </div>
        </BaseNode>
    );
};

export default ConditionNode;

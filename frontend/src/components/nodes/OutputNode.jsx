import React from 'react';
import BaseNode from './BaseNode';
import { FileTerminal } from 'lucide-react';

const OutputNode = ({ id, data, selected }) => {
    return (
        <BaseNode id={id} title="Final Output" icon={FileTerminal} isSelected={selected} accentColor="orange">
            <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-400">Displays final result</span>
            </div>
        </BaseNode>
    );
};

export default OutputNode;

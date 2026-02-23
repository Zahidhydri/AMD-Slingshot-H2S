import React from 'react';
import { Type } from 'lucide-react';
import BaseNode from './BaseNode';
import useStore from '../../store';

const TextInputNode = ({ id, data, selected }) => {
    // Determine the label or default
    const label = data?.label || 'Text Input';
    const placeholder = data?.placeholder || 'Enter text...';

    return (
        <BaseNode
            id={id}
            title={label}
            icon={Type}
            isSelected={selected}
            accentColor="blue"
        >
            <div className="flex flex-col gap-2">
                <div className="text-xs text-slate-400 truncate">Placeholder: {placeholder}</div>
                {/* Visual representation, non-interactive on canvas */}
                <div className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-slate-500 italic opacity-70">
                    {placeholder}
                </div>
            </div>
        </BaseNode>
    );
};

export default TextInputNode;

import React from 'react';
import { Box } from 'lucide-react';
import BaseNode from './BaseNode';

const ContainerNode = ({ id, data, selected }) => {
    const direction = data?.direction || 'col';
    const padding = data?.padding || 'p-4';

    return (
        <BaseNode
            id={id}
            title="Container"
            icon={Box}
            isSelected={selected}
            accentColor="blue"
        >
            <div className="flex flex-col gap-2 relative">
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Flex: <strong className="text-slate-200">{direction === 'col' ? 'Column' : 'Row'}</strong></span>
                    <span>Pad: <strong className="text-slate-200">{padding}</strong></span>
                </div>
                <div className="w-full h-8 border border-dashed border-slate-600 rounded bg-slate-800/30 flex items-center justify-center opacity-50">
                    <div className="w-1/2 h-4 border border-slate-500 rounded-sm"></div>
                </div>
            </div>
        </BaseNode>
    );
};

export default ContainerNode;

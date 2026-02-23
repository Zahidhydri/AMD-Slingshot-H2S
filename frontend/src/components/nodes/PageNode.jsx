import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import BaseNode from './BaseNode';

const PageNode = ({ id, data, selected }) => {
    const title = data?.title || 'Home Page';
    const route = data?.route || '/';

    return (
        <BaseNode
            id={id}
            title="Page"
            icon={LayoutTemplate}
            isSelected={selected}
            accentColor="blue"
        >
            <div className="flex flex-col gap-2">
                <div className="text-lg font-bold text-slate-100">{title}</div>
                <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded inline-block w-fit">
                    Route: {route}
                </div>
            </div>
        </BaseNode>
    );
};

export default PageNode;

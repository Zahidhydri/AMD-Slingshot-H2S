import React from 'react';
import { LayoutGrid } from 'lucide-react';
import BaseNode from './BaseNode';

const ListViewNode = ({ id, data, selected }) => {
    const layout = data?.layout || 'grid'; // 'list' or 'grid'

    return (
        <BaseNode
            id={id}
            title="List / Grid"
            icon={LayoutGrid}
            isSelected={selected}
            accentColor="blue"
        >
            <div className="flex flex-col gap-2 relative">
                <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
                    {layout} Layout
                </div>

                {layout === 'list' ? (
                    <div className="flex flex-col gap-1.5 opacity-60">
                        <div className="w-full h-3 bg-slate-700 rounded-sm"></div>
                        <div className="w-full h-3 bg-slate-700 rounded-sm"></div>
                        <div className="w-2/3 h-3 bg-slate-700 rounded-sm"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-1.5 opacity-60">
                        <div className="w-full aspect-square bg-slate-700 rounded-sm"></div>
                        <div className="w-full aspect-square bg-slate-700 rounded-sm"></div>
                        <div className="w-full aspect-square bg-slate-700 rounded-sm"></div>
                        <div className="w-full aspect-square bg-slate-700 rounded-sm"></div>
                    </div>
                )}
            </div>
        </BaseNode>
    );
};

export default ListViewNode;

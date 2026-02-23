import React from 'react';
import { Database } from 'lucide-react';
import BaseNode from './BaseNode';

const DatabaseNode = ({ id, data, selected }) => {
    const action = data?.action || 'READ';
    const collection = data?.collection || 'users';

    return (
        <BaseNode
            id={id}
            title="Database"
            icon={Database}
            isSelected={selected}
            accentColor="emerald"
        >
            <div className="flex flex-col gap-2">
                <div className="text-sm font-semibold text-emerald-300">
                    {action} <span className="text-slate-400 font-normal">from</span> {collection}
                </div>
            </div>
        </BaseNode>
    );
};

export default DatabaseNode;

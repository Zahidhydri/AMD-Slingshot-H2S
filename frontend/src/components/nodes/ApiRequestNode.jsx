import React from 'react';
import { Globe } from 'lucide-react';
import BaseNode from './BaseNode';

const ApiRequestNode = ({ id, data, selected }) => {
    const method = data?.method || 'GET';
    const url = data?.url || 'https://api.example.com/data';

    return (
        <BaseNode
            id={id}
            title="API Request"
            icon={Globe}
            isSelected={selected}
            accentColor="emerald"
        >
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                            method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                        {method}
                    </span>
                    <span className="text-sm truncate text-slate-300" title={url}>
                        {url}
                    </span>
                </div>
            </div>
        </BaseNode>
    );
};

export default ApiRequestNode;

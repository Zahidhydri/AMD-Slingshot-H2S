import React from 'react';
import { MousePointerClick } from 'lucide-react';
import BaseNode from './BaseNode';

const ButtonNode = ({ id, data, selected }) => {
    const label = data?.label || 'Submit';
    const variant = data?.variant || 'primary';

    const getVariantClasses = () => {
        switch (variant) {
            case 'secondary': return 'bg-slate-700 text-slate-300 border-slate-600';
            case 'danger': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-blue-600 text-white border-blue-500';
        }
    };

    return (
        <BaseNode
            id={id}
            title="Button"
            icon={MousePointerClick}
            isSelected={selected}
            accentColor="blue"
        >
            <div className="flex flex-col gap-2">
                <button
                    disabled
                    className={`px-4 py-1.5 rounded-lg border text-sm font-semibold transition-all shadow-sm w-full text-center opacity-90 ${getVariantClasses()}`}
                >
                    {label}
                </button>
            </div>
        </BaseNode>
    );
};

export default ButtonNode;

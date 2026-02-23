import React from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import BaseNode from './BaseNode';

const ImageGenNode = ({ id, data, selected }) => {
    const prompt = data?.prompt || 'A futuristic city...';

    return (
        <BaseNode
            id={id}
            title="AI Image"
            icon={Sparkles}
            isSelected={selected}
            accentColor="purple"
        >
            <div className="flex flex-col gap-2 relative">
                <div className="flex items-start gap-2 bg-slate-900/50 p-2 rounded-md border border-slate-800">
                    <ImageIcon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-400 line-clamp-3">
                        {prompt}
                    </div>
                </div>
            </div>
        </BaseNode>
    );
};

export default ImageGenNode;

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import BaseNode from './BaseNode';

const ImageDisplayNode = ({ id, data, selected }) => {
    const src = data?.src || 'https://via.placeholder.com/150';

    return (
        <BaseNode
            id={id}
            title="Image View"
            icon={ImageIcon}
            isSelected={selected}
            accentColor="blue"
        >
            <div className="flex flex-col gap-2">
                <div className="w-full flex justify-center">
                    <div className="w-16 h-16 bg-slate-800 rounded flex items-center justify-center border border-slate-700">
                        <ImageIcon className="w-6 h-6 text-slate-500" />
                    </div>
                </div>
                <div className="text-[10px] text-slate-500 truncate text-center">
                    {src}
                </div>
            </div>
        </BaseNode>
    );
};

export default ImageDisplayNode;

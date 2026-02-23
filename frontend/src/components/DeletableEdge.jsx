import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import { X } from 'lucide-react';

const DeletableEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}) => {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeClick = (evt) => {
        evt.stopPropagation();
        setEdges((edges) => edges.filter((e) => e.id !== id));
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'auto',
                        zIndex: 1000,
                    }}
                    className="nodrag nopan"
                >
                    <button
                        className="w-5 h-5 bg-[#0f172a] border border-slate-700 shadow-md shadow-[#0f172a] rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer group z-50 relative"
                        onClick={onEdgeClick}
                        title="Delete Connection"
                    >
                        <X className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default DeletableEdge;

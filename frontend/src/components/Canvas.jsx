import React, { useState, useRef, useCallback } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';
import InputNode from './InputNode';
import GeminiNode from './GeminiNode';
import ImageNode from './ImageNode';
import AudioNode from './AudioNode';
import OutputNode from './OutputNode';
import DeletableEdge from './DeletableEdge';
import { PlayCircle, Loader2 } from 'lucide-react';

// Map our custom node types
const nodeTypes = {
    input: InputNode,
    gemini: GeminiNode,
    image: ImageNode,
    audio: AudioNode,
    output: OutputNode,
};

const edgeTypes = {
    deletableEdge: DeletableEdge,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const Canvas = () => {
    const reactFlowWrapper = useRef(null);

    // Set initial default nodes so the canvas isn't empty!
    const initialNodes = [
        {
            id: 'node-1',
            type: 'input',
            position: { x: 100, y: 150 },
            data: { context: 'Explain quantum computing in simple terms.' }
        },
        {
            id: 'node-2',
            type: 'gemini',
            position: { x: 500, y: 150 },
            data: { prompt: 'You are an expert physics teacher. Explain the input context to a 5-year-old.' }
        },
        {
            id: 'node-3',
            type: 'output',
            position: { x: 950, y: 150 },
            data: { output: null }
        }
    ];

    const initialEdges = [
        { id: 'edge-1-2', source: 'node-1', target: 'node-2', type: 'deletableEdge', animated: true, style: { stroke: '#6366f1', strokeWidth: 3 } },
        { id: 'edge-2-3', source: 'node-2', target: 'node-3', type: 'deletableEdge', animated: true, style: { stroke: '#fb923c', strokeWidth: 3 } }
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [isDeploying, setIsDeploying] = useState(false);

    // Helper to update OutputNode
    const updateOutputNode = (resultText) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.type === 'output') {
                    return { ...node, data: { ...node.data, output: resultText } };
                }
                return node;
            })
        );
    };

    const onDeploy = async () => {
        if (!reactFlowInstance) return;

        setIsDeploying(true);
        updateOutputNode("Deploying to backend execution engine (DAG)...");

        // Reset all nodes executing state before starting
        setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, executing: false } })));

        const flowData = reactFlowInstance.toObject();
        const payload = {
            nodes: flowData.nodes,
            edges: flowData.edges
        };

        try {
            const response = await fetch('http://localhost:8000/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Network response was not ok');
            }

            // Stream reading logic for Server-Sent Events via POST
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split('\n\n');

                // Keep the last partial chunk in the buffer
                buffer = events.pop() || '';

                for (const event of events) {
                    if (event.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(event.substring(6));

                            if (data.type === 'node_start') {
                                // Light up the currently executing node
                                setNodes((nds) => nds.map((n) => n.id === data.node_id ? { ...n, data: { ...n.data, executing: true } } : n));
                            } else if (data.type === 'node_finish') {
                                // Turn off executing state
                                setNodes((nds) => nds.map((n) => n.id === data.node_id ? { ...n, data: { ...n.data, executing: false, output: data.result } } : n));
                            } else if (data.type === 'complete') {
                                // Final wrap up
                                let finalMsg = "Execution finished!";
                                if (data.result) finalMsg += "\nResult: " + data.result;
                                if (data.published_url) finalMsg += "\n\n🚀 App published live at: " + data.published_url;
                                updateOutputNode(finalMsg);
                            } else if (data.type === 'error') {
                                // Force stop on error
                                setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, executing: false } })));
                                throw new Error(data.message);
                            }
                        } catch (e) {
                            if (e.message !== "Unexpected end of JSON input") {
                                throw e;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Deploy failed:", error);
            updateOutputNode(`Deploy Failed:\n${error.message}`);
        } finally {
            setIsDeploying(false);
        }
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, type: 'deletableEdge', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } }, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            // get current mouse pos to map to reactflow canvas coords
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: getId(),
                type,
                position,
                data: {
                    // Default empty states
                    context: type === 'input' ? '' : undefined,
                    prompt: (type === 'gemini' || type === 'image' || type === 'audio') ? '' : undefined,
                    output: type === 'output' ? null : undefined,
                    // Callback to update node state accurately (we'll implement real state sync later if needed)
                    onChange: (val) => { }
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes],
    );

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans">
            <Sidebar reactFlowInstance={reactFlowInstance} onDeploy={onDeploy} />
            <div className="flex-1 relative" ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    className="bg-[#f1f5f9]"
                >
                    <Background color="#cbd5e1" variant={BackgroundVariant.Dots} gap={24} size={2} />
                    <Controls className="bg-white rounded-xl shadow-lg border-gray-100 m-4" />
                    <MiniMap
                        nodeColor="#e2e8f0"
                        maskColor="rgba(248, 250, 252, 0.7)"
                        className="rounded-2xl shadow-lg border-gray-200 overflow-hidden bg-white/50 backdrop-blur-md !m-6"
                    />
                    <Panel position="top-right" className="m-6">
                        <button
                            onClick={onDeploy}
                            disabled={isDeploying}
                            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm shadow-[0_4px_14px_0_rgb(0,0,0,39%)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5 transition-all active:scale-95 group ${isDeploying ? 'bg-gray-700 cursor-not-allowed text-gray-300' : 'bg-gray-900 hover:bg-black text-white'}`}
                        >
                            {isDeploying ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Deploying...
                                </>
                            ) : (
                                <>
                                    <PlayCircle className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                                    Deploy App
                                </>
                            )}
                        </button>
                    </Panel>
                </ReactFlow>
            </div>
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <Canvas />
    </ReactFlowProvider>
);

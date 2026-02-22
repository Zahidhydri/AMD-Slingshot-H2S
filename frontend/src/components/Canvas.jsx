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
import Navbar from './Navbar';
import { PlayCircle, Loader2, X, Rocket, Copy, ExternalLink } from 'lucide-react';

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
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishedAppUrl, setPublishedAppUrl] = useState('');

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
        updateOutputNode("Packaging and publishing your app to BlockForge Cloud...");

        const flowData = reactFlowInstance.toObject();
        const payload = {
            nodes: flowData.nodes,
            edges: flowData.edges
        };

        try {
            const response = await fetch('http://localhost:8000/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Publishing failed');
            }

            const data = await response.json();
            const appId = data.app_id;
            const fullUrl = `${window.location.origin}/app/${appId}`;

            setPublishedAppUrl(fullUrl);
            setShowPublishModal(true);
            updateOutputNode(`App Published Successfully!\nID: ${appId}\nURL: ${fullUrl}`);
        } catch (error) {
            console.error("Publish failed:", error);
            updateOutputNode(`Publish Failed:\n${error.message}`);
        } finally {
            setIsDeploying(false);
        }
    };

    const onNewProject = () => {
        if (window.confirm("Are you sure you want to start a new project? This will clear the current canvas.")) {
            setNodes([]);
            setEdges([]);
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
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans">
            <Navbar onNewProject={onNewProject} onDeploy={onDeploy} isDeploying={isDeploying} />
            <div className="flex flex-1 overflow-hidden">
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

                    </ReactFlow>
                </div>
            </div>

            {/* Premium Publish Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white relative">
                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                <Rocket size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">App is Live!</h3>
                            <p className="text-indigo-100 opacity-90">Your visual workflow has been converted into a standalone mini-app.</p>
                        </div>

                        <div className="p-8">
                            <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Shareable URL</label>
                            <div className="flex items-center gap-2 p-1 bg-gray-50 border-2 border-gray-100 rounded-2xl focus-within:border-indigo-500 transition-all">
                                <input
                                    readOnly
                                    value={publishedAppUrl}
                                    className="flex-1 bg-transparent px-3 py-2 text-gray-700 font-medium outline-none"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(publishedAppUrl);
                                        alert("URL copied to clipboard!");
                                    }}
                                    className="bg-white hover:bg-gray-100 text-indigo-600 px-4 py-2 rounded-xl shadow-sm border border-gray-200 font-semibold transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Copy size={18} />
                                    Copy
                                </button>
                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                                <a
                                    href={publishedAppUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <ExternalLink size={20} />
                                    Open App
                                </a>
                                <button
                                    onClick={() => setShowPublishModal(false)}
                                    className="w-full bg-white hover:bg-gray-50 text-gray-500 py-3 rounded-2xl font-semibold transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <Canvas />
    </ReactFlowProvider>
);

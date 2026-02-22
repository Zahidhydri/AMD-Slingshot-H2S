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
import { PlayCircle, Loader2, X, Rocket, Copy, ExternalLink, Sparkles } from 'lucide-react';

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
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGeneratingApp, setIsGeneratingApp] = useState(false);
    const [isCompiling, setIsCompiling] = useState(false);

    // Add this function to handle the generation
    const onGenerateWorkflow = async () => {
        if (!aiPrompt.trim()) return;
        setIsGeneratingApp(true);

        try {
            const response = await fetch('http://localhost:8000/generate-workflow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: aiPrompt })
            });

            if (!response.ok) throw new Error('Generation failed');

            const data = await response.json();

            // Map edges to include the visual style required by the canvas
            const formattedEdges = data.edges.map(edge => ({
                ...edge,
                type: 'deletableEdge',
                animated: true,
                style: { stroke: '#8b5cf6', strokeWidth: 3 }
            }));

            setNodes(data.nodes);
            setEdges(formattedEdges);
            setAiPrompt('');

            // Fit view after a brief delay to let nodes render
            setTimeout(() => reactFlowInstance?.fitView({ padding: 0.2 }), 100);

        } catch (error) {
            alert("Failed to generate app: " + error.message);
        } finally {
            setIsGeneratingApp(false);
        }
    };

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

        setIsCompiling(true);
        const flowData = reactFlowInstance.toObject();
        const payload = {
            nodes: flowData.nodes,
            edges: flowData.edges
        };

        try {
            const response = await fetch('http://localhost:8000/publish-app', {
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
            const fullUrl = `http://localhost:8000/app/${appId}`;

            setPublishedAppUrl(fullUrl);
            setShowPublishModal(true);
        } catch (error) {
            console.error("Publish failed:", error);
            alert(`Publish Failed: ${error.message}`);
        } finally {
            setIsCompiling(false);
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

                    {/* AI App Generator Input */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-[600px] bg-white rounded-full shadow-2xl border border-indigo-100 flex items-center p-2">
                        <div className="p-2 bg-indigo-50 rounded-full text-indigo-600 ml-1">
                            <Sparkles size={20} />
                        </div>
                        <input
                            type="text"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Describe the app you want to build (e.g. 'A podcast script writer that outputs audio')..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 px-4 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && onGenerateWorkflow()}
                        />
                        <button
                            onClick={onGenerateWorkflow}
                            disabled={isGeneratingApp || !aiPrompt.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2"
                        >
                            {isGeneratingApp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate App'}
                        </button>
                    </div>
                </div>
            </div>

            {/* AI Compiling Overlay */}
            {isCompiling && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-indigo-900/40 backdrop-blur-md">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">AI is compiling your app...</h3>
                        <p className="text-gray-500 text-center max-w-xs">Our model is writing bespoke HTML, Tailwind, and JS for your workflow.</p>
                    </div>
                </div>
            )}

            {/* Premium Publish Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 flex flex-col md:flex-row h-[90vh]">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white relative md:w-1/3 flex flex-col shrink-0">
                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors md:hidden"
                            >
                                <X size={20} />
                            </button>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                <Rocket size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">App is Live!</h3>
                            <p className="text-indigo-100 opacity-90 mb-6">Your visual workflow has been converted into a standalone, AI-generated mini-app.</p>

                            <div className="mt-auto">
                                <label className="block text-sm font-semibold text-indigo-200 uppercase tracking-wider mb-2">Shareable URL</label>
                                <div className="flex items-center gap-2 p-1 bg-white/10 border border-white/20 rounded-xl focus-within:border-white/40 transition-all mb-4">
                                    <input
                                        readOnly
                                        value={publishedAppUrl}
                                        className="flex-1 bg-transparent px-3 py-2 text-white text-sm font-medium outline-none truncate"
                                    />
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(publishedAppUrl);
                                            alert("URL copied to clipboard!");
                                        }}
                                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <a
                                    href={publishedAppUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white text-indigo-600 text-center py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                                >
                                    <ExternalLink size={20} />
                                    Open App
                                </a>
                                <button
                                    onClick={() => setShowPublishModal(false)}
                                    className="w-full text-indigo-100 py-3 rounded-2xl font-semibold transition-all hover:text-white mt-2"
                                >
                                    Done
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden relative">
                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm z-10 hidden md:block"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                            <div className="p-4 border-b bg-white flex items-center justify-between">
                                <span className="font-semibold text-gray-700">Live Preview</span>
                                <div className="flex gap-1">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                            </div>
                            <iframe
                                src={publishedAppUrl}
                                className="w-full h-full border-none bg-white"
                                title="App Preview"
                            />
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

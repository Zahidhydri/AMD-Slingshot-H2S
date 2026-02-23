import React, { useRef, useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Toaster, toast } from 'react-hot-toast';

import useStore from '../store';
import Sidebar from './Sidebar';
import PropertyInspector from './PropertyInspector';
import Navbar from './Navbar';
import DeletableEdge from './DeletableEdge';
import { Loader2, Sparkles, TriangleAlert, Maximize2, X, ExternalLink } from 'lucide-react';

// Import all our new Professional Nodes
import PageNode from './nodes/PageNode';
import ContainerNode from './nodes/ContainerNode';
import TextInputNode from './nodes/TextInputNode';
import ButtonNode from './nodes/ButtonNode';
import FormNode from './nodes/FormNode';
import ImageDisplayNode from './nodes/ImageDisplayNode';
import ListViewNode from './nodes/ListViewNode';
import ApiRequestNode from './nodes/ApiRequestNode';
import DatabaseNode from './nodes/DatabaseNode';
import ConditionNode from './nodes/ConditionNode';
import LoopNode from './nodes/LoopNode';
import GeminiNode from './nodes/GeminiNode';
import ImageGenNode from './nodes/ImageGenNode';
import TextToSpeechNode from './nodes/TextToSpeechNode';

import OutputNode from './nodes/OutputNode';

// Map our custom node types
const nodeTypes = {
    page: PageNode,
    container: ContainerNode,
    textInput: TextInputNode,
    button: ButtonNode,
    form: FormNode,
    imageDisplay: ImageDisplayNode,
    listView: ListViewNode,
    apiRequest: ApiRequestNode,
    database: DatabaseNode,
    condition: ConditionNode,
    loop: LoopNode,
    gemini: GeminiNode,
    imageGen: ImageGenNode,
    textToSpeech: TextToSpeechNode,

    // Legacy maps
    input: TextInputNode,
    output: OutputNode,
    image: ImageGenNode,
    audio: TextToSpeechNode,
};

const edgeTypes = {
    deletableEdge: DeletableEdge,
};

const Canvas = () => {
    const reactFlowWrapper = useRef(null);

    // Zustand Store
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const onNodesChange = useStore((state) => state.onNodesChange);
    const onEdgesChange = useStore((state) => state.onEdgesChange);
    const onConnect = useStore((state) => state.onConnect);
    const addNode = useStore((state) => state.addNode);
    const setNodes = useStore((state) => state.setNodes);
    const setEdges = useStore((state) => state.setEdges);
    const clearCanvas = useStore((state) => state.clearCanvas);
    const setSelectedNode = useStore((state) => state.setSelectedNode);

    const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
    const [isDeploying, setIsDeploying] = React.useState(false);
    const [isNewFlowModalOpen, setIsNewFlowModalOpen] = React.useState(false);
    const [previewAppUrl, setPreviewAppUrl] = React.useState(null);
    const [lastCompiledUrl, setLastCompiledUrl] = React.useState(null);

    // Initialize default nodes ONLY if canvas is empty on first load.
    // In a real app, you'd check localStorage or a DB here.
    useEffect(() => {
        if (nodes.length === 0) {
            setNodes([
                { id: 'page-1', type: 'page', position: { x: 100, y: 150 }, data: { title: 'Home Page', route: '/' } }
            ]);
        }
    }, []);


    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) return;

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            addNode(type, position);
        },
        [reactFlowInstance, addNode]
    );

    // Clear selection when clicking empty canvas
    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    const onDeploy = async () => {
        if (!reactFlowInstance) return;

        setIsDeploying(true);
        const loadingToast = toast.loading('Compiling Universal AST...');

        const flowData = reactFlowInstance.toObject();

        try {
            const response = await fetch('http://localhost:8000/publish-app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes: flowData.nodes, edges: flowData.edges })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Publishing failed');
            }

            const data = await response.json();
            const appId = data.app_id;
            const fullUrl = `http://localhost:8000/app/${appId}`;

            toast.success('App compiled successfully!', { id: loadingToast });

            // Display in the inline preview panel instead of redirecting
            setPreviewAppUrl(fullUrl);
            setLastCompiledUrl(fullUrl);

        } catch (error) {
            console.error("Publish failed:", error);
            toast.error(`Publish Failed: ${error.message}`, { id: loadingToast });
        } finally {
            setIsDeploying(false);
        }
    };

    const onNewProject = () => {
        setIsNewFlowModalOpen(true);
    };

    const confirmNewProject = () => {
        clearCanvas();
        setIsNewFlowModalOpen(false);
        toast.success('Canvas cleared. Starting fresh!');
    };

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0f172a] font-sans">
            {/* Beautiful dark-mode native toaster */}
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid #334155',
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#0f172a' },
                    },
                }}
            />

            <Navbar
                onNewProject={onNewProject}
                onDeploy={onDeploy}
                isDeploying={isDeploying}
                previewAppUrl={previewAppUrl}
                onTogglePreview={() => {
                    if (previewAppUrl) {
                        setPreviewAppUrl(null); // Close it
                    } else if (lastCompiledUrl) {
                        setPreviewAppUrl(lastCompiledUrl); // Re-open last compiled
                    } else {
                        toast('Build an app first to preview it!', { icon: 'ℹ️' });
                    }
                }}
            />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar />

                {/* Main Content Area (Canvas + Optional Preview) */}
                <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0b1120]">
                    {/* Top half or full screen Canvas */}
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
                            onPaneClick={onPaneClick}
                            // IMPORTANT: Make sure node selection updates the active visual state in Flow
                            onNodeClick={(_, node) => setSelectedNode(node.id)}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            fitView
                            className="bg-[#0b1120]"
                            proOptions={{ hideAttribution: true }}
                        >
                            <Background color="#334155" variant={BackgroundVariant.Dots} gap={24} size={2} />

                            <Controls className="bg-[#1e293b] text-slate-300 border-none rounded-xl shadow-lg m-4 fill-slate-300 overflow-hidden hide-pro-badge" />

                            <MiniMap
                                nodeColor="#3b82f6"
                                maskColor="rgba(15, 23, 42, 0.8)"
                                className="rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden bg-[#1e293b] !m-6"
                            />
                        </ReactFlow>
                    </div>
                </div>

                <PropertyInspector />

                {/* Full Screen App Preview Overlay */}
                {previewAppUrl && (
                    <div className="absolute inset-0 z-40 bg-[#0f172a] flex flex-col animate-in fade-in duration-200">
                        {/* Panel Header */}
                        <div className="h-12 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 shadow-xl z-10">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500 transition-colors shadow-sm" onClick={() => setPreviewAppUrl(null)} title="Close Preview"></div>
                                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 cursor-pointer hover:bg-yellow-500 transition-colors shadow-sm"></div>
                                    <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 cursor-pointer flex items-center justify-center group hover:bg-green-500 transition-colors shadow-sm" onClick={() => window.open(previewAppUrl, '_blank')} title="Open in New Tab">
                                        <Maximize2 className="w-2.5 h-2.5 text-green-900 opacity-0 group-hover:opacity-100" />
                                    </div>
                                </div>
                                <div className="flex items-center ml-4 gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full text-xs text-slate-300 font-mono border border-slate-700 min-w-[300px] shadow-inner">
                                    <span className="text-slate-500">http://localhost:8000</span>{previewAppUrl.replace('http://localhost:8000', '')}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setPreviewAppUrl(null)} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors border border-slate-700 hover:bg-slate-800 px-3 py-1 rounded">
                                    Back to Studio
                                </button>
                                <button onClick={() => window.open(previewAppUrl, '_blank')} className="text-slate-400 hover:text-white transition-colors" title="Open in New Tab">
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>
                        {/* Iframe */}
                        <iframe
                            src={previewAppUrl}
                            title="App Preview"
                            className="w-full flex-1 bg-white"
                            sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                    </div>
                )}
            </div>

            {/* Compiling Overlay */}
            {isDeploying && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm">
                    <div className="bg-[#1e293b] p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-blue-500/30 animate-in zoom-in-95 duration-200">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Compiling Universal Node Graph...</h3>
                        <p className="text-slate-400 text-center max-w-xs text-sm">Translating visual topology to production-ready HTML, JS, and Tailwind CSS via Gemini.</p>
                    </div>
                </div>
            )}

            {/* New Flow Confirmation Modal */}
            {isNewFlowModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm">
                    <div className="bg-[#1e293b] w-full max-w-md p-6 rounded-2xl shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4 text-orange-400">
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <TriangleAlert className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Start New Flow?</h3>
                        </div>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Are you sure you want to start a new project? This will <strong className="text-slate-300">clear the current canvas</strong> and all unsaved progress will be lost.
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                            <button
                                onClick={() => setIsNewFlowModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmNewProject}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all shadow-lg shadow-red-600/20"
                            >
                                Yes, Clear Canvas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Canvas;

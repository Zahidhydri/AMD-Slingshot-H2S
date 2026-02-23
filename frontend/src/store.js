import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

// Help to generate unique IDs
let id = 0;
const getId = () => `node_${id++}`;

const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    selectedNode: null,

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    onConnect: (connection) => {
        set({
            edges: addEdge({ ...connection, type: 'deletableEdge', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 3 } }, get().edges),
        });
    },

    addNode: (type, position) => {
        const newNode = {
            id: getId(),
            type,
            position,
            data: {
                // Initial generic data based on type
                label: `${type} node`,
                ...getInitialNodeData(type)
            },
            // Important to set selected state on click
        };
        set({ nodes: get().nodes.concat(newNode) });
    },

    setSelectedNode: (nodeId) => {
        const node = get().nodes.find((n) => n.id === nodeId);
        set({ selectedNode: node || null });
    },

    updateNodeData: (nodeId, dataUpdate) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    // It's important that we create a new object here to trigger ReactFlow to re-render the node
                    const updatedNode = { ...node, data: { ...node.data, ...dataUpdate } };
                    // If this is the currently selected node, update the selected reference too
                    if (get().selectedNode?.id === nodeId) {
                        set({ selectedNode: updatedNode });
                    }
                    return updatedNode;
                }
                return node;
            }),
        });
    },

    clearCanvas: () => {
        set({ nodes: [], edges: [], selectedNode: null });
    },

    deleteNode: (nodeId) => {
        set({
            nodes: get().nodes.filter((n) => n.id !== nodeId),
            edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
            selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode
        });
    }
}));

// Helper to provide nice defaults
function getInitialNodeData(type) {
    switch (type) {
        case 'textInput': return { placeholder: 'Enter text...', label: 'Text Input', value: '' };
        case 'button': return { label: 'Submit', variant: 'primary' };
        case 'gemini': return { prompt: 'You are a helpful assistant...', sysPrompt: '' };
        case 'page': return { title: 'Home Page', route: '/' };
        case 'container': return { direction: 'col', padding: 'p-4' };
        default: return {};
    }
}

export default useStore;

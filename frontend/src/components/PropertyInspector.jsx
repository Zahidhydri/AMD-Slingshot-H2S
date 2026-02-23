import React from 'react';
import useStore from '../store';
import { Settings2, X, Trash2 } from 'lucide-react';

const PropertyInspector = () => {
    const selectedNode = useStore((state) => state.selectedNode);
    const updateNodeData = useStore((state) => state.updateNodeData);
    const setSelectedNode = useStore((state) => state.setSelectedNode);
    const setNodes = useStore((state) => state.setNodes);
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const setEdges = useStore((state) => state.setEdges);

    const handleDeleteNode = () => {
        setNodes(nodes.filter((n) => n.id !== id));
        setEdges(edges.filter((e) => e.source !== id && e.target !== id));
        setSelectedNode(null);
    };

    if (!selectedNode) {
        return (
            <aside className="w-72 bg-[#0f172a] border-l border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 shrink-0 z-10 hidden lg:flex">
                <Settings2 className="w-10 h-10 mb-4 opacity-20" />
                <p className="text-sm">Select a block on the canvas to configure its properties.</p>
            </aside>
        );
    }

    const { id, type, data } = selectedNode;

    const handleChange = (key, value) => {
        updateNodeData(id, { [key]: value });
    };

    const renderInput = (label, key, value, typeStr = 'text', placeholder = '') => (
        <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
            <input
                type={typeStr}
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-slate-900 text-slate-200 text-sm px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-blue-500/50 border border-slate-700 transition-all font-mono"
            />
        </div>
    );

    const renderTextarea = (label, key, value, placeholder = '') => (
        <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
            <textarea
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full bg-slate-900 text-slate-200 text-sm px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-blue-500/50 border border-slate-700 transition-all font-mono resize-none"
            />
        </div>
    );

    const renderSelect = (label, key, value, options) => (
        <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
            <select
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full bg-slate-900 text-slate-200 text-sm px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-blue-500/50 border border-slate-700 transition-all cursor-pointer"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );


    return (
        <aside className="w-72 bg-[#0f172a] border-l border-slate-800 flex flex-col h-full overflow-hidden shrink-0 z-10 shadow-xl hidden lg:flex">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-slate-400" />
                    Inspector
                </h2>
                <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                <div className="mb-6 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest">
                        {type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{id}</span>
                </div>

                {/* Common Props */}
                {renderInput('Label / Title', 'label', data.label || '', 'text', 'Display name...')}

                {/* Specific Props based on type */}
                {type === 'textInput' && (
                    <>
                        {renderInput('Placeholder', 'placeholder', data.placeholder)}
                    </>
                )}

                {type === 'button' && (
                    <>
                        {renderSelect('Variant', 'variant', data.variant, [
                            { value: 'primary', label: 'Primary (Blue)' },
                            { value: 'secondary', label: 'Secondary (Gray)' },
                            { value: 'danger', label: 'Danger (Red)' },
                        ])}
                    </>
                )}

                {type === 'gemini' && (
                    <>
                        {renderTextarea('System Prompt', 'prompt', data.prompt, 'You are a helpful assistant...')}
                    </>
                )}

                {type === 'apiRequest' && (
                    <>
                        {renderSelect('Method', 'method', data.method || 'GET', [
                            { value: 'GET', label: 'GET' },
                            { value: 'POST', label: 'POST' },
                            { value: 'PUT', label: 'PUT' },
                            { value: 'DELETE', label: 'DELETE' },
                        ])}
                        {renderInput('Endpoint URL', 'url', data.url, 'text', 'https://api...')}
                    </>
                )}

                {type === 'database' && (
                    <>
                        {renderSelect('Action', 'action', data.action || 'READ', [
                            { value: 'CREATE', label: 'Create Record' },
                            { value: 'READ', label: 'Read List/Record' },
                            { value: 'UPDATE', label: 'Update Record' },
                            { value: 'DELETE', label: 'Delete Record' },
                        ])}
                        {renderInput('Collection', 'collection', data.collection, 'text', 'users')}
                    </>
                )}

                {type === 'page' && (
                    <>
                        {renderInput('Route Path', 'route', data.route, 'text', '/home')}
                    </>
                )}

                {type === 'imageGen' && (
                    <>
                        {renderTextarea('Default Prompt', 'prompt', data.prompt, 'Describe the image...')}
                    </>
                )}

                {type === 'condition' && (
                    <>
                        {renderInput('Logic Condition', 'condition', data.condition, 'text', 'user.age > 18')}
                    </>
                )}

                {type === 'loop' && (
                    <>
                        {renderInput('Iterable Variable', 'iterable', data.iterable, 'text', 'data.items')}
                    </>
                )}

                {type === 'container' && (
                    <>
                        {renderSelect('Direction', 'direction', data.direction || 'col', [
                            { value: 'col', label: 'Vertical (Column)' },
                            { value: 'row', label: 'Horizontal (Row)' },
                        ])}
                        {renderInput('Padding (Tailwind)', 'padding', data.padding, 'text', 'p-4')}
                    </>
                )}
                {type === 'listView' && (
                    <>
                        {renderSelect('Layout', 'layout', data.layout || 'grid', [
                            { value: 'grid', label: 'Grid' },
                            { value: 'list', label: 'List' },
                        ])}
                    </>
                )}

                <div className="mt-8 pt-4 border-t border-slate-800">
                    <button
                        onClick={handleDeleteNode}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-md transition-all text-sm font-semibold"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Block
                    </button>
                    <p className="text-center text-[10px] text-slate-500 mt-2">
                        You can also select the node and press Delete or Backspace. Edge connections can be deleted by clicking their 'X' buttons.
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default PropertyInspector;

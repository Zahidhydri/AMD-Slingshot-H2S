from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse
import asyncio
import json
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import google.generativeai as genai
import os
import uuid
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize FastAPI app
app = FastAPI(title="BlockForge AI Backend")

# Enable CORS for the frontend Vite server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini Model
api_key = os.environ.get("GEMINI_API_KEY")
if api_key and api_key != "YOUR_GEMINI_API_KEY_HERE":
    genai.configure(api_key=api_key)

# Initialize Firebase Admin
try:
    cred = credentials.Certificate("firebase_credentials.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase initialized successfully")
except Exception as e:
    print(f"Warning: Firebase credentials not found or invalid: {e}")
    print("Please place your firebase_credentials.json in the backend folder to enable saving to Firestore.")
    db = None

# Fallback in-memory database for users without Firebase credentials
mock_db = {}
published_apps = {}
published_html = {} # Stores AI-generated HTML for unique app_ids

class NodePayload(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]

class EdgePayload(BaseModel):
    id: str
    source: str
    target: str

class GraphExecutionRequest(BaseModel):
    nodes: List[NodePayload]
    edges: List[EdgePayload]

class RunAppRequest(BaseModel):
    user_input: str

async def process_graph(nodes_list, edges_list, stream=True):
    """
    Core execution logic shared between live streaming and static runs.
    """
    try:
        # Build node objects and map
        node_dict = {n['id']: n for n in nodes_list}
        adj_list = {n['id']: [] for n in nodes_list}
        in_degree = {n['id']: 0 for n in nodes_list}
        
        for edge in edges_list:
            if edge['source'] in adj_list and edge['target'] in in_degree:
                adj_list[edge['source']].append(edge['target'])
                in_degree[edge['target']] += 1
                
        queue = [n_id for n_id, deg in in_degree.items() if deg == 0]
        if not queue:
            error_msg = 'Graph parsing error: Cycles detected or missing starting nodes.'
            if stream: yield f"data: {json.dumps({'type': 'error', 'message': error_msg})}\n\n"
            else: raise Exception(error_msg)
            return

        node_outputs = {}
        final_output = ""

        while queue:
            current_id = queue.pop(0)
            current_node = node_dict[current_id]
            
            if stream: yield f"data: {json.dumps({'type': 'node_start', 'node_id': current_id})}\n\n"
            
            # Combine parent outputs
            parents = [e['source'] for e in edges_list if e['target'] == current_id]
            parent_contexts = [node_outputs[p] for p in parents if p in node_outputs and node_outputs[p]]
            current_context = "\n\n---\n\n".join(parent_contexts)
            
            # NodeType Processing
            ntype = current_node['type']
            if ntype == 'input':
                current_context = current_node['data'].get('context', '')
                if stream: await asyncio.sleep(0.5)
                
            elif ntype == 'gemini':
                system_prompt = current_node['data'].get('prompt', '')
                try:
                    model = genai.GenerativeModel('gemini-2.5-flash')
                    full_prompt = f"Instruction: {system_prompt}\n\nInput Data:\n{current_context}"
                    response = model.generate_content(full_prompt)
                    current_context = response.text
                except Exception as api_err:
                    error_msg = f"Gemini API Error: {api_err}"
                    if stream: 
                        yield f"data: {json.dumps({'type': 'error', 'node_id': current_id, 'message': error_msg})}\n\n"
                        return
                    else: raise Exception(error_msg)
                
            elif ntype == 'image':
                p = current_node['data'].get('prompt', '')
                full_p = f"{p} {current_context}".strip() or "A beautiful abstract painting"
                import urllib.parse
                current_context = f"IMAGE:https://image.pollinations.ai/prompt/{urllib.parse.quote(full_p)}?width=1024&height=1024&nologo=true"
                if stream: await asyncio.sleep(0.5)
                
            elif ntype == 'audio':
                p = current_node['data'].get('prompt', '')
                full_p = (f"{p} {current_context}".strip() or "Hello")[:250]
                import urllib.parse
                current_context = f"AUDIO:https://api.streamelements.com/kappa/v2/speech?voice=Brian&text={urllib.parse.quote(full_p)}"
                if stream: await asyncio.sleep(0.5)
                
            elif ntype == 'output':
                final_output = current_context
                if stream: await asyncio.sleep(0.5)

            node_outputs[current_id] = current_context
            if stream: yield f"data: {json.dumps({'type': 'node_finish', 'node_id': current_id, 'result': current_context})}\n\n"

            for neighbor in adj_list[current_id]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0: queue.append(neighbor)

        if stream:
            yield f"data: {json.dumps({'type': 'complete', 'result': final_output})}\n\n"
        else:
            yield final_output

    except Exception as e:
        if stream: yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
        else: raise e

class GenerateWorkflowRequest(BaseModel):
    prompt: str

@app.post("/generate-workflow")
async def generate_workflow(request: GenerateWorkflowRequest):
    """
    Uses Gemini to generate a node/edge JSON structure based on a user's prompt.
    """
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    system_instruction = """
    You are an AI that builds node-based visual workflows. The user will give you a description of an app they want to build.
    You must output ONLY a valid JSON object containing two arrays: 'nodes' and 'edges'.
    
    Available Node Types:
    - input (Takes initial user context)
    - gemini (Processes text with a 'prompt' property)
    - image (Generates an image from a 'prompt' property)
    - audio (Generates Text-to-Speech from a 'prompt' property)
    - output (Displays the final result)
    
    Rules:
    1. Every graph MUST start with an 'input' node and end with an 'output' node.
    2. Nodes must have: id, type, position {x, y}, and data (containing context, prompt, or output as appropriate).
    3. Edges must have: id, source (node id), target (node id).
    4. Space nodes out horizontally (e.g., x=100, x=500, x=900).
    5. Output ONLY raw JSON, without markdown formatting.
    """
    
    full_prompt = f"{system_instruction}\n\nUser App Request: {request.prompt}"
    
    try:
        response = model.generate_content(full_prompt)
        raw_json = response.text.replace("```json", "").replace("```", "").strip()
        workflow_data = json.loads(raw_json)
        return workflow_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate workflow: {str(e)}")

@app.post("/execute")
async def execute_graph(payload: GraphExecutionRequest):
    """
    Refactored streaming execution using process_graph helper.
    """
    nodes_data = [n.model_dump() for n in payload.nodes]
    edges_data = [e.model_dump() for e in payload.edges]
    return StreamingResponse(process_graph(nodes_data, edges_data, stream=True), media_type="text/event-stream")

@app.post("/publish")
async def publish_app(payload: GraphExecutionRequest):
    app_id = f"app_{str(uuid.uuid4())[:8]}"
    published_apps[app_id] = {
        "nodes": [n.model_dump() for n in payload.nodes],
        "edges": [e.model_dump() for e in payload.edges]
    }
    return {"app_id": app_id}

@app.post("/run/{app_id}")
async def run_published_app(app_id: str, request: RunAppRequest):
    if app_id not in published_apps:
        raise HTTPException(status_code=404, detail="App not found")
    
    app_data = published_apps[app_id]
    import copy
    nodes = copy.deepcopy(app_data["nodes"])
    edges = app_data["edges"]
    
    for node in nodes:
        if node["type"] == "input":
            node["data"]["context"] = request.user_input
            break
            
    try:
        result = None
        async for r in process_graph(nodes, edges, stream=False):
            result = r
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/publish-app")
async def publish_app_ai(payload: GraphExecutionRequest):
    """
    Parses the graph, uses Gemini to generate a standalone HTML/Tailwind UI,
    and returns a unique app_id.
    """
    app_id = f"app_{str(uuid.uuid4())[:8]}"
    
    # Identify Inputs and Outputs for the AI Prompt
    inputs = [n.data.get('context', 'User Input') for n in payload.nodes if n.type == 'input']
    outputs = [n.id for n in payload.nodes if n.type == 'output']
    
    # Build a logic summary for Gemini
    logic_summary = f"The app has {len(inputs)} input fields and {len(outputs)} output sections. "
    logic_summary += "It uses the following nodes: " + ", ".join([n.type for n in payload.nodes])
    
    # Create the Gemini Prompt for Code Generation
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are an expert full-stack developer. The user has designed a visual workflow in BlockForge AI.
    Logic Summary: {logic_summary}
    Graph Data (for reference): {json.dumps(payload.model_dump())}
    
    TASK: Write a COMPLETE, single-file HTML application using Tailwind CSS and Vanilla JavaScript.
    
    REQUIREMENTS:
    1. A beautiful, modern, and responsive UI that fits the context of the app logic.
    2. Input fields for each 'input' node found in the graph.
    3. Display areas for each 'output' node.
    4. A "Run" button that gathers inputs and makes a POST request to 'http://localhost:8000/execute'.
    5. IMPORTANT: The request to '/execute' must pass the EXACT 'nodes' and 'edges' arrays from the graph data provided below, but with the 'data.context' of the 'input' nodes updated to the user's current input values.
    6. Handle the streaming response from '/execute' using the EventSource API (or fetch with a reader) to parse the 'data: ' lines correctly. Update the UI in real-time as nodes start and finish.
    7. Use Lucide icons (via CDN) and Inter font for a premium look.
    8. Add subtle animations (e.g., loading spinners) during execution.
    9. Crucial: The tool should look like a bespoke, branded app, not a developer tool. Give it a creative name and style based on the logic summary.
    10. Ensure the code is self-contained and ready to run.
    11. The backend host is 'http://localhost:8000'. Use this for the POST request.
    
    GRAPH DATA TO EMBED IN JS:
    {json.dumps(payload.model_dump())}
    
    Respond ONLY with the raw HTML code, no markdown formatting.
    """
    
    try:
        response = model.generate_content(prompt)
        generated_code = response.text.replace("```html", "").replace("```", "").strip()
        
        # Save to our "database"
        published_html[app_id] = generated_code
        # Still save the original graph for reference/backwards compatibility if needed
        published_apps[app_id] = {
            "nodes": [n.model_dump() for n in payload.nodes],
            "edges": [e.model_dump() for e in payload.edges]
        }
        
        return {"app_id": app_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Generation failed: {str(e)}")

@app.get("/app/{app_id}")
async def get_published_app(app_id: str):
    if app_id in published_html:
        return HTMLResponse(content=published_html[app_id])
    if app_id in published_apps:
        # Fallback for old apps that don't have HTML yet (optional, could just 404)
        return {"nodes": published_apps[app_id]["nodes"], "edges": published_apps[app_id]["edges"]}
    raise HTTPException(status_code=404, detail="App not found or invalid URL.")

@app.get("/")
def read_root():
    return {"message": "BlockForge AI Backend is running"}

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
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

@app.get("/app/{app_id}")
async def get_published_app(app_id: str):
    if app_id in published_apps:
        return published_apps[app_id]
    raise HTTPException(status_code=404, detail="App not found or invalid URL.")

@app.get("/")
def read_root():
    return {"message": "BlockForge AI Backend is running"}

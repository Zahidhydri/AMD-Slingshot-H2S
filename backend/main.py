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

@app.post("/execute")
async def execute_graph(payload: GraphExecutionRequest):
    """
    Receives the graph payload consisting of nodes and edges,
    executes them dynamically using a Topological Sort DAG algorithm,
    and returns a Server-Sent Events (SSE) stream to track live progress.
    """
    async def generate_execution_stream():
        try:
            # 1. Build Adjacency List and In-Degree maps for Topological Sort
            node_dict = {n.id: n for n in payload.nodes}
            adj_list = {n.id: [] for n in payload.nodes}
            in_degree = {n.id: 0 for n in payload.nodes}
            
            for edge in payload.edges:
                # Handle potential edge cases where edge target/source might not exist in nodes
                if edge.source in adj_list and edge.target in in_degree:
                    adj_list[edge.source].append(edge.target)
                    in_degree[edge.target] += 1
                    
            # 2. Find starting nodes (In-Degree == 0)
            queue = [n_id for n_id, deg in in_degree.items() if deg == 0]
            
            if not queue:
                yield f"data: {json.dumps({'type': 'error', 'message': 'Graph parsing error: Cycles detected or missing starting nodes.'})}\n\n"
                return
                
            # Dictionary to store the processed outputs of each node so they can be passed to children
            node_outputs = {}
            final_output = None
            published_url = None
            
            # 3. Breadth-First Search / Topological Sort Execution
            while queue:
                current_id = queue.pop(0)
                current_node = node_dict[current_id]
                
                # Notify frontend this node started executing
                yield f"data: {json.dumps({'type': 'node_start', 'node_id': current_id})}\n\n"
                
                # Gather inputs from parent nodes:
                # Find all parents of current_node
                parents = [e.source for e in payload.edges if e.target == current_id]
                
                # Combine parent outputs into a single context string
                parent_contexts = [node_outputs[p] for p in parents if p in node_outputs and node_outputs[p]]
                current_context = "\n\n---\n\n".join(parent_contexts)
                
                # Process based on node type
                if current_node.type == 'input':
                    # Input nodes just use their own starting context
                    current_context = current_node.data.get('context', '')
                    await asyncio.sleep(0.5) # Slight delay for UI visualization
                    
                elif current_node.type == 'gemini':
                    system_prompt = current_node.data.get('prompt', '')
                    model = genai.GenerativeModel('gemini-2.5-flash')
                    full_prompt = f"Instruction: {system_prompt}\n\nInput Data:\n{current_context}"
                    
                    try:
                        # Yield status updates for long running tasks
                        response = model.generate_content(full_prompt)
                        current_context = response.text
                    except Exception as api_err:
                        error_msg = f"Gemini API Error: {api_err}"
                        yield f"data: {json.dumps({'type': 'error', 'node_id': current_id, 'message': error_msg})}\n\n"
                        return
                    
                elif current_node.type == 'image':
                    image_prompt = current_node.data.get('prompt', '')
                    full_prompt = f"{image_prompt} {current_context}".strip()
                    if not full_prompt:
                        full_prompt = "A beautiful abstract painting, highly detailed"
                    import urllib.parse
                    encoded_prompt = urllib.parse.quote(full_prompt)
                    current_context = f"IMAGE:https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&nologo=true"
                    await asyncio.sleep(1.0) # Image gen simulation delay mapping to image API loading time
                    
                elif current_node.type == 'audio':
                    audio_prompt = current_node.data.get('prompt', '')
                    full_prompt = f"{audio_prompt} {current_context}".strip()
                    if not full_prompt:
                        full_prompt = "Hello, please add text to generate audio."
                    import urllib.parse
                    encoded_prompt = urllib.parse.quote(full_prompt[:250])  # TTS usually has strict limits, keep it under 250 chars
                    # Using StreamElements open API for TTS text to MP3
                    current_context = f"AUDIO:https://api.streamelements.com/kappa/v2/speech?voice=Brian&text={encoded_prompt}"
                    await asyncio.sleep(0.8) # TTS delay
                    
                elif current_node.type == 'output':
                    final_output = current_context
                    published_id = str(uuid.uuid4())
                    published_url = f"http://localhost:5173/app/{published_id}"
                    
                    app_data = {
                        "id": published_id,
                        "creatorId": "anonymous",
                        "appName": "My BlockForge App",
                        "flowData": {
                            "nodes": [n.model_dump() for n in payload.nodes],
                            "edges": [e.model_dump() for e in payload.edges]
                        },
                        "publishedUrl": published_url,
                        "finalResult": final_output
                    }
                    
                    if db:
                        try:
                            db.collection("workflows").document(published_id).set(app_data)
                        except Exception:
                            pass
                    else:
                        mock_db[published_id] = app_data
                        
                    await asyncio.sleep(0.5)
                
                # Store output of this node
                node_outputs[current_id] = current_context
                
                # Notify frontend this node finished
                yield f"data: {json.dumps({'type': 'node_finish', 'node_id': current_id, 'result': current_context})}\n\n"
                
                # Queue children whose dependencies are met
                for neighbor in adj_list[current_id]:
                    in_degree[neighbor] -= 1
                    if in_degree[neighbor] == 0:
                        queue.append(neighbor)
                        
            # Graph execution complete
            yield f"data: {json.dumps({'type': 'complete', 'result': final_output, 'published_url': published_url})}\n\n"
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            yield f"data: {json.dumps({'type': 'error', 'message': f'Backend Error [{type(e).__name__}]: {str(e)}'})}\n\n"

    return StreamingResponse(generate_execution_stream(), media_type="text/event-stream")

@app.get("/app/{app_id}")
async def get_published_app(app_id: str):
    """
    Fetches the saved workflow data to render in the AppViewer frontend.
    """
    if db:
        try:
            doc_ref = db.collection("workflows").document(app_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
        except Exception as fb_err:
            print(f"Firebase read error: {fb_err}")
            
    # Fallback to mock_db
    if app_id in mock_db:
        return mock_db[app_id]
        
    raise HTTPException(status_code=404, detail="Published App not found or invalid URL.")

@app.get("/")
def read_root():
    return {"message": "BlockForge AI Backend is running"}

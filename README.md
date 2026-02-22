# ⚡ BlockForge AI

**BlockForge AI** is a powerful, visual "App Builder" that allows users to design complex AI workflows using a node-based interface and publish them as standalone mini-apps.

Combine the intelligence of LLMs, the creativity of image generators, and the utility of text-to-speech tools—all without writing a single line of code.

---

## 🚀 Features

- **Visual Workflow Builder**: Intuitive drag-and-drop interface powered by `@xyflow/react` (React Flow).
- **Multi-Modal AI Blocks**:
  - **Gemini Processor**: Leverage Google's Gemini models for advanced text reasoning and processing.
  - **Image Generator**: Create stunning visuals via Stable Diffusion (Pollinations API).
  - **Audio Generator**: Synthesize high-quality speech from text.
- **One-Click Publishing**: Turn your workflow into a shared mini-app with a unique, permanent URL.
- **Premium Live App UI**: Published apps feature a sleek, professional, and responsive interface for end-users.
- **Real-time Streaming**: Watch your workflows execute step-by-step with live visual feedback.
- **Modern Tech Stack**: Built with FastAPI, React, and TailwindCSS for maximum speed and aesthetics.

---

## 🛠️ Architecture

### Frontend
- **Framework**: React + Vite
- **Styling**: TailwindCSS (Modern, glassmorphic design)
- **State Management**: React Flow + Hooks
- **Communication**: SSE (Server-Sent Events) for real-time execution feedback.

### Backend
- **Framework**: FastAPI (Python)
- **Execution Engine**: Custom Directed Acyclic Graph (DAG) processor using topological sort.
- **AI Integration**: `google-generativeai` (Gemini API)
- **Persistence**: In-memory store for published apps (easily upgradable to Firestore/PostgreSQL).

---

## 🏃 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_api_key_here
```
Run the server:
```bash
uvicorn main:app --reload
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🧩 Usage

1.  **Build**: Drag nodes from the sidebar (Input, Gemini, Image, Audio, Output).
2.  **Connect**: Link the ports (Power Ports ⚡) to define the execution flow.
3.  **Configure**: Set prompts and parameters inside each node.
4.  **Publish**: Hit "Publish App" to generate a live link.
5.  **Share**: Send the link to anyone to use your AI-powered mini-app!

---

## 🛡️ License
MIT License - Created for the AMD Slingshot H2S Hackathon.

---

*Built with ❤️ by the BlockForge Team.*

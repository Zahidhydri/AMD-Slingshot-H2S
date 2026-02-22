import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Canvas from './components/Canvas';
import Home from './pages/Home';
import AppViewer from './pages/AppViewer';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Canvas />} />
          <Route path="/app/:id" element={<AppViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

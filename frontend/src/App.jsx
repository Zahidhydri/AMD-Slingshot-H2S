import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Canvas from './components/Canvas';
import Home from './pages/Home';
import PublishedApp from './components/PublishedApp';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Canvas />} />
          <Route path="/app/:appId" element={<PublishedApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

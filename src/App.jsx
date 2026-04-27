import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortfolioView from './views/PortfolioView';
import AdminView from './views/AdminView';
import AllProjectsView from './views/AllProjectsView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioView />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/projects" element={<AllProjectsView />} />
      </Routes>
    </Router>
  );
}

export default App;

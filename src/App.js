import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AuditLog from './components/AuditLog';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/audit-log" element={<AuditLog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShortenerForm from './components/ShortenerForm';
import StatsPage from './components/StatsPage';
import RedirectHandler from './components/RedirectHandler';
import log from './logger'; // Assuming logger middleware from Pre-Test Setup is imported here

function App() {
  log('Application initialized');

  return (
    <div className="App">
      <header>
        <h1>URL Shortener</h1>
      </header>
      <Routes>
        <Route path="/" element={<ShortenerForm />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/:shortcode" element={<RedirectHandler />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
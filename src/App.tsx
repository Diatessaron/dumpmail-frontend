import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/homepage/HomePage';
import Inbox from './components/inbox/Inbox';

const App: React.FC = () => {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inbox" element={<Inbox />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;

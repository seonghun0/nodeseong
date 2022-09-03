import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
     <Routes>
        <Route path="/RegisterPage" element={<RegisterPage/>} />
        <Route path="/LoginPage" element={<LoginPage/>} />
        <Route path="/" element={<LandingPage/>} />
      </Routes>
      </div>
  </Router>
  );
}

export default App;
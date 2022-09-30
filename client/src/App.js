import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import VideoUploadPage from './components/views/VideoUploadPage/VideoUploadPage';

function App() {
  return (
    <Router>
      <div>
     <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/LoginPage" element={<LoginPage/>} />
        <Route path="/RegisterPage" element={<RegisterPage/>} />
        <Route path="/VideoUploadPage" element={<VideoUploadPage/>} />       
      </Routes>
      </div>
  </Router>
  );
}

export default App;
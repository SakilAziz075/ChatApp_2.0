import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AppPage from './pages/AppPage'; 

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat/:userEmail" element= {<AppPage/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './component/LandingPage';
import RegisterPage from './component/RegisterForm';
import LoginPage from './component/LoginForm';
import PrivateChat from './component/PrivateChat';

const App = () => {

  return (
<Router>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/chat/:id" element={<PrivateChat />} />
    <Route path="*" element={<h1>Not Found</h1>} />
  </Routes>
</Router>

  );
};

export default App;

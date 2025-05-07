import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import Admin from './Pages/Admin/Admin.jsx'
import LoginSignup from './Pages/loginSignup/LoginSignup.jsx'

// Componente de rota protegida
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('auth-token');
  return token ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/admin/*" element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AppContent />
  );
};


export default App;

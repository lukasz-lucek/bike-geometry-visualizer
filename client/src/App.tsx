import React from 'react';
import './App.css';
import AuthProvider from './contexts/AuthContext';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import PrivateRoute from './components/login/PrivateRoute';
import MainComponent from './components/MainComponent';
import Register from './components/login/Register';
import AdminRoute from './components/login/AdminRoute';
import GoogleAuthCallbackComponent from './components/adminTools/GoogleAuthCallbackComponent';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainComponent />} />
            <Route path="/app" element={<MainComponent />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/auth/callback" element={<GoogleAuthCallbackComponent />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

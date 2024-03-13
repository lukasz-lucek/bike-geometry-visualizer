import React from 'react';
import './App.css';
import AuthProvider from './contexts/AuthContext';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import PrivateRoute from './components/login/PrivateRoute';
import MainComponent from './components/MainComponent';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainComponent />} />
            <Route path="/app" element={<MainComponent />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

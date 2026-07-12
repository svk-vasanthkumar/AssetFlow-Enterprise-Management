import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { LoginForm } from './features/auth/components/LoginForm';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <LoginForm />
          </div>
        } />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'Employee']} />}>
          <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
          <Route path="/assets" element={<div>Asset Inventory Placeholder</div>} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

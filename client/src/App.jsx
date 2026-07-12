import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { LoginPage } from './features/auth/pages/LoginPage';
import { AssetList } from './features/assets/pages/AssetList';
import './App.css'; // Ensure your global styles or Tailwind imports are here or in index.css

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
<Route element={<ProtectedRoute allowedRoles={['Admin', 'Employee']} />}>
  <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
  <Route path="/assets" element={<AssetList />} />
</Route>
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

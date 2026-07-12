import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Bookings from './pages/Bookings';
import Maintenance from './pages/Maintenance';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';

/**
 * Role gate — renders children only if the user has one of the allowed roles,
 * otherwise redirects to Dashboard.
 */
function RoleGate({ roles, children }) {
  const { user } = useAuth();
  if (!roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function ProtectedLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route
            path="/employees"
            element={
              <RoleGate roles={['Admin', 'Asset Manager', 'Department Head']}>
                <Employees />
              </RoleGate>
            }
          />
          <Route path="/departments" element={<Departments />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route
            path="/reports"
            element={
              <RoleGate roles={['Admin', 'Asset Manager', 'Department Head']}>
                <Reports />
              </RoleGate>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0e1a' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Toast />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/*" element={user ? <ProtectedLayout /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

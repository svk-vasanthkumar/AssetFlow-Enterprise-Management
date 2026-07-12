import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  CalendarClock,
  Wrench,
  Bell,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/assets', icon: Package, label: 'Assets' },
  {
    path: '/employees',
    icon: Users,
    label: 'Employees',
    roles: ['Admin', 'Asset Manager', 'Department Head'],
  },
  { path: '/departments', icon: Building2, label: 'Departments' },
  { path: '/bookings', icon: CalendarClock, label: 'Bookings' },
  { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  {
    path: '/reports',
    icon: BarChart3,
    label: 'Reports',
    roles: ['Admin', 'Asset Manager', 'Department Head'],
  },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();

  const sidebarClass = [
    'sidebar',
    collapsed ? 'collapsed' : '',
    mobileOpen ? 'mobile-open' : '',
  ].filter(Boolean).join(' ');

  const handleNavClick = () => {
    // Close mobile sidebar when a nav link is clicked
    if (onMobileClose) onMobileClose();
  };

  // Filter nav items by role — items without a `roles` array are visible to all
  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <>
      <aside className={sidebarClass}>
        <div className="sidebar-logo">
          {collapsed ? (
            <span className="sidebar-logo-collapsed">AF</span>
          ) : (
            <span className="sidebar-logo-full">
              <span className="sidebar-logo-gradient">Asset</span>
              <span className="sidebar-logo-white">Flow</span>
            </span>
          )}
        </div>

        <nav className="sidebar-nav">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `sidebar-nav-item${isActive ? ' active' : ''}`
                }
                title={collapsed ? item.label : undefined}
                onClick={handleNavClick}
              >
                <Icon size={20} />
                <span className="sidebar-nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name || 'User'}</span>
              <span className="sidebar-user-role">{user?.role || 'employee'}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>

        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
      {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}
    </>
  );
}

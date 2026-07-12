import { Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { notificationAPI } from '../api/api';
import './Header.css';

export default function Header({ sidebarCollapsed, onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    notificationAPI
      .getAll()
      .then((res) => {
        const notifications = res.notifications || res || [];
        const unread = (Array.isArray(notifications) ? notifications : []).filter(
          (n) => !n.isRead
        ).length;
        setUnreadCount(unread);
      })
      .catch(() => {});
  }, []);

  return (
    <header
      className="header"
      style={{
        '--header-offset': sidebarCollapsed
          ? 'var(--sidebar-collapsed, 72px)'
          : 'var(--sidebar-width, 260px)',
      }}
    >
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <Menu size={22} />
        </button>
        <div className="header-greeting">
          <h1 className="header-title">
            Welcome back, <span className="header-user-name">{user?.name || 'User'}</span>
          </h1>
          <p className="header-subtitle">Here's what's happening today</p>
        </div>
      </div>

      <div className="header-right">
        <button
          className="header-notification-btn"
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="header-notification-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        <div className="header-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  );
}

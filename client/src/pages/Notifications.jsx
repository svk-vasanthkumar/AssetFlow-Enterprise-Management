import { useState, useEffect } from 'react';
import {
  Package,
  Wrench,
  CalendarClock,
  RotateCcw,
  MessageSquare,
  BellOff,
  CheckCheck,
  Check,
} from 'lucide-react';
import { notificationAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import PageLoader from '../components/PageLoader';

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const TYPE_ICONS = {
  Allocation: Package,
  Maintenance: Wrench,
  Booking: CalendarClock,
  Return: RotateCcw,
  General: MessageSquare,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getAll();
      const notifs = Array.isArray(res) ? res : res.notifications || [];
      setNotifications(notifs);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.isRead);
      await Promise.all(unread.map((n) => notificationAPI.markRead(n._id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <PageLoader />;

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Notifications</h1>
        {hasUnread && (
          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            <CheckCheck size={18} /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <BellOff size={48} />
          <h3>No Notifications</h3>
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notif) => {
            const IconComponent =
              TYPE_ICONS[notif.type] || TYPE_ICONS.General;

            return (
              <div
                key={notif._id}
                className={`notification-card ${!notif.isRead ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  <IconComponent size={20} />
                </div>
                <div className="notification-content">
                  <p className="notification-title">{notif.title}</p>
                  <p className="notification-message">{notif.message}</p>
                  <span className="notification-time">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>
                {!notif.isRead && (
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleMarkRead(notif._id)}
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

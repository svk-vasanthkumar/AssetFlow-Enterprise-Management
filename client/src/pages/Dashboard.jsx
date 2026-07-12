import { useState, useEffect } from 'react';
import {
  Package,
  PackageCheck,
  PackageX,
  Wrench,
  Users,
  Building2,
  CalendarClock,
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { dashboardAPI, notificationAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import PageLoader from '../components/PageLoader';

ChartJS.register(ArcElement, Tooltip, Legend);

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

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, notifRes] = await Promise.all([
          dashboardAPI.get(),
          notificationAPI.getAll(),
        ]);
        setDashboard(dashRes.dashboard || dashRes);
        const notifs = Array.isArray(notifRes)
          ? notifRes
          : notifRes.notifications || [];
        setNotifications(notifs);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  const stats = dashboard || {};

  const chartData = {
    labels: ['Available', 'Allocated', 'Under Maintenance'],
    datasets: [
      {
        data: [
          stats.availableAssets || 0,
          stats.allocatedAssets || 0,
          stats.maintenanceAssets || 0,
        ],
        backgroundColor: ['#06d6a0', '#3b82f6', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: '65%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--text-secondary)',
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Assets"
          value={stats.totalAssets || 0}
          icon={Package}
        />
        <StatCard
          title="Available"
          value={stats.availableAssets || 0}
          icon={PackageCheck}
          color="green"
        />
        <StatCard
          title="Allocated"
          value={stats.allocatedAssets || 0}
          icon={PackageX}
          color="#3b82f6"
        />
        <StatCard
          title="Maintenance"
          value={stats.maintenanceAssets || 0}
          icon={Wrench}
          color="#f59e0b"
        />
      </div>

      <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
        <StatCard
          title="Employees"
          value={stats.totalEmployees || 0}
          icon={Users}
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments || 0}
          icon={Building2}
        />
        <StatCard
          title="Active Bookings"
          value={stats.activeBookings || 0}
          icon={CalendarClock}
        />
      </div>

      <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>Asset Distribution</h3>
          </div>
          <div className="card-body" style={{ height: '300px' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="card-body">
            {recentNotifications.length === 0 ? (
              <p className="text-secondary">No recent activity</p>
            ) : (
              <div className="activity-list">
                {recentNotifications.map((notif) => (
                  <div key={notif._id} className="activity-item">
                    <div className="activity-content">
                      <p className="activity-title">{notif.title}</p>
                      <p className="activity-message">{notif.message}</p>
                    </div>
                    <span className="activity-time">
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { bookingAPI, assetAPI, employeeAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import PageLoader from '../components/PageLoader';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({});
  const toast = useToast();

  const fetchData = async () => {
    try {
      const [bookRes, assetRes, empRes] = await Promise.all([
        bookingAPI.getAll(),
        assetAPI.getAll(),
        employeeAPI.getAll(),
      ]);
      const bks = Array.isArray(bookRes) ? bookRes : bookRes.bookings || [];
      setBookings(bks);
      setAssets(assetRes.assets || []);
      const emps = Array.isArray(empRes) ? empRes : empRes.employees || [];
      setEmployees(emps);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await bookingAPI.create({
        resource: formData.resource,
        employee: formData.employee,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      toast.success('Booking created successfully');
      setShowCreateModal(false);
      setFormData({});
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancel = async () => {
    try {
      await bookingAPI.cancel(selectedBooking._id);
      toast.success('Booking cancelled successfully');
      setShowCancelDialog(false);
      setSelectedBooking(null);
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString();
  };

  const columns = [
    {
      key: 'resource',
      label: 'Resource',
      render: (row) => {
        const res = row.resource;
        if (!res) return '—';
        return `${res.assetTag || ''} - ${res.name || ''}`;
      },
    },
    {
      key: 'employee',
      label: 'Employee',
      render: (row) => row.employee?.name || '—',
    },
    {
      key: 'startTime',
      label: 'Start Time',
      render: (row) => formatDate(row.startTime),
    },
    {
      key: 'endTime',
      label: 'End Time',
      render: (row) => formatDate(row.endTime),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span
          className={`badge badge-${(row.status || '').replace(/\s+/g, '-')}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          {row.status === 'Upcoming' && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                setSelectedBooking(row);
                setShowCancelDialog(true);
              }}
              title="Cancel"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Bookings</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormData({
              resource: '',
              employee: '',
              startTime: '',
              endTime: '',
            });
            setShowCreateModal(true);
          }}
        >
          <Plus size={18} /> New Booking
        </button>
      </div>

      <DataTable columns={columns} data={bookings} searchKeys={[]} />

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Booking"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label" htmlFor="booking-resource">
              Resource
            </label>
            <select
              id="booking-resource"
              name="resource"
              className="form-select"
              value={formData.resource || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Resource</option>
              {assets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.assetTag} - {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="booking-employee">
              Employee
            </label>
            <select
              id="booking-employee"
              name="employee"
              className="form-select"
              value={formData.employee || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="booking-start">
              Start Time
            </label>
            <input
              id="booking-start"
              name="startTime"
              type="datetime-local"
              className="form-input"
              value={formData.startTime || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="booking-end">
              End Time
            </label>
            <input
              id="booking-end"
              name="endTime"
              type="datetime-local"
              className="form-input"
              value={formData.endTime || ''}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Create Booking
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
      />
    </div>
  );
}

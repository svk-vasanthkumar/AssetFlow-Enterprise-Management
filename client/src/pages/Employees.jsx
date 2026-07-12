import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { employeeAPI, departmentAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import PageLoader from '../components/PageLoader';

const ROLES = ['Employee', 'Asset Manager', 'Admin'];
const STATUSES = ['Active', 'Inactive'];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'Admin';

  const fetchData = async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
      ]);
      const emps = Array.isArray(empRes) ? empRes : empRes.employees || [];
      const depts = Array.isArray(deptRes) ? deptRes : deptRes.departments || [];
      setEmployees(emps);
      setDepartments(depts);
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

  const openEditModal = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      name: emp.name || '',
      role: emp.role || 'Employee',
      department: emp.department?._id || emp.department || '',
      status: emp.status || 'Active',
    });
    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await employeeAPI.update(selectedEmployee._id, formData);
      toast.success('Employee updated successfully');
      setShowEditModal(false);
      setSelectedEmployee(null);
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <span
          className={`badge badge-${(row.role || '').replace(/\s+/g, '-')}`}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (row) => row.department?.name || '—',
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
    ...(isAdmin ? [{
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => openEditModal(row)}
            title="Edit"
          >
            <Edit size={14} /> Edit
          </button>
        </div>
      ),
    }] : []),
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Employees</h1>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        searchKeys={['name', 'email']}
      />

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        title={`Edit Employee: ${selectedEmployee?.name || ''}`}
      >
        <form onSubmit={handleEdit}>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-name">
              Name
            </label>
            <input
              id="edit-name"
              name="name"
              type="text"
              className="form-input"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-role">
              Role
            </label>
            <select
              id="edit-role"
              name="role"
              className="form-select"
              value={formData.role || 'Employee'}
              onChange={handleChange}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-department">
              Department
            </label>
            <select
              id="edit-department"
              name="department"
              className="form-select"
              value={formData.department || ''}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-status">
              Status
            </label>
            <select
              id="edit-status"
              name="status"
              className="form-select"
              value={formData.status || 'Active'}
              onChange={handleChange}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
}

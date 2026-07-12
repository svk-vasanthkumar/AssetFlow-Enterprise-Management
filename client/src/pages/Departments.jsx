import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { departmentAPI, employeeAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import PageLoader from '../components/PageLoader';

const STATUSES = ['Active', 'Inactive'];

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'Admin';

  const fetchData = async () => {
    try {
      const [deptRes, empRes] = await Promise.all([
        departmentAPI.getAll(),
        employeeAPI.getAll(),
      ]);
      const depts = Array.isArray(deptRes) ? deptRes : deptRes.departments || [];
      const emps = Array.isArray(empRes) ? empRes : empRes.employees || [];
      setDepartments(depts);
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

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedDept(null);
    setFormData({
      name: '',
      code: '',
      head: '',
      parentDepartment: '',
      status: 'Active',
    });
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setIsEditing(true);
    setSelectedDept(dept);
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      head: dept.head?._id || dept.head || '',
      parentDepartment: dept.parentDepartment?._id || dept.parentDepartment || '',
      status: dept.status || 'Active',
    });
    setShowModal(true);
  };

  const openDeleteDialog = (dept) => {
    setSelectedDept(dept);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.head) delete payload.head;
      if (!payload.parentDepartment) delete payload.parentDepartment;

      if (isEditing) {
        await departmentAPI.update(selectedDept._id, payload);
        toast.success('Department updated successfully');
      } else {
        await departmentAPI.create(payload);
        toast.success('Department created successfully');
      }
      setShowModal(false);
      setSelectedDept(null);
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await departmentAPI.delete(selectedDept._id);
      toast.success('Department deleted successfully');
      setShowDeleteDialog(false);
      setSelectedDept(null);
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    {
      key: 'head',
      label: 'Head',
      render: (row) => row.head?.name || '—',
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
          <button
            className="btn btn-sm btn-danger"
            onClick={() => openDeleteDialog(row)}
            title="Delete"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    }] : []),
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Departments</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add Department
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={departments}
        searchKeys={['name', 'code']}
      />

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedDept(null);
        }}
        title={isEditing ? `Edit Department: ${selectedDept?.name || ''}` : 'Add New Department'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="dept-name">
              Name
            </label>
            <input
              id="dept-name"
              name="name"
              type="text"
              className="form-input"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dept-code">
              Code
            </label>
            <input
              id="dept-code"
              name="code"
              type="text"
              className="form-input"
              value={formData.code || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dept-head">
              Head
            </label>
            <select
              id="dept-head"
              name="head"
              className="form-select"
              value={formData.head || ''}
              onChange={handleChange}
            >
              <option value="">Select Head</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dept-parent">
              Parent Department
            </label>
            <select
              id="dept-parent"
              name="parentDepartment"
              className="form-select"
              value={formData.parentDepartment || ''}
              onChange={handleChange}
            >
              <option value="">None</option>
              {departments
                .filter((d) => d._id !== selectedDept?._id)
                .map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dept-status">
              Status
            </label>
            <select
              id="dept-status"
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
            {isEditing ? 'Save Changes' : 'Create Department'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedDept(null);
        }}
        onConfirm={handleDelete}
        title="Delete Department"
        message={`Are you sure you want to delete "${selectedDept?.name || ''}"? This action cannot be undone.`}
      />
    </div>
  );
}

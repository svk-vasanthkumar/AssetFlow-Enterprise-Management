import { useState, useEffect } from 'react';
import { Plus, ArrowLeftRight, RotateCcw, Edit } from 'lucide-react';
import { assetAPI, employeeAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import PageLoader from '../components/PageLoader';

const CONDITIONS = ['New', 'Good', 'Fair', 'Poor', 'Damaged'];

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [formData, setFormData] = useState({});
  const { user } = useAuth();
  const toast = useToast();
  const canManageAssets = ['Admin', 'Asset Manager'].includes(user?.role);

  const fetchData = async () => {
    try {
      const [assetRes, empRes] = await Promise.all([
        assetAPI.getAll(),
        employeeAPI.getAll(),
      ]);
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await assetAPI.create(formData);
      toast.success('Asset created successfully');
      setShowCreateModal(false);
      setFormData({});
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      await assetAPI.allocate({
        assetId: selectedAsset._id,
        employeeId: formData.employeeId,
        expectedReturn: formData.expectedReturn,
      });
      toast.success('Asset allocated successfully');
      setShowAllocateModal(false);
      setSelectedAsset(null);
      setFormData({});
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      // Get the last allocation ID from allocationHistory array
      const allocationHistory = selectedAsset.allocationHistory || [];
      const allocationId = allocationHistory[allocationHistory.length - 1];

      if (!allocationId) {
        toast.error('No active allocation found for this asset');
        return;
      }

      await assetAPI.return({
        allocationId:
          typeof allocationId === 'object' ? allocationId._id : allocationId,
        conditionOnReturn: formData.conditionOnReturn,
      });
      toast.success('Asset returned successfully');
      setShowReturnModal(false);
      setSelectedAsset(null);
      setFormData({});
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openAllocateModal = (asset) => {
    setSelectedAsset(asset);
    setFormData({ employeeId: '', expectedReturn: '' });
    setShowAllocateModal(true);
  };

  const openReturnModal = (asset) => {
    setSelectedAsset(asset);
    setFormData({ conditionOnReturn: 'Good' });
    setShowReturnModal(true);
  };

  const columns = [
    { key: 'assetTag', label: 'Asset Tag' },
    { key: 'name', label: 'Name' },
    {
      key: 'category',
      label: 'Category',
      render: (row) => row.category?.name || '—',
    },
    { key: 'serialNumber', label: 'Serial No' },
    {
      key: 'condition',
      label: 'Condition',
      render: (row) => (
        <span
          className={`badge badge-${(row.condition || '').replace(/\s+/g, '-')}`}
        >
          {row.condition}
        </span>
      ),
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
      key: 'assignedTo',
      label: 'Assigned To',
      render: (row) => row.assignedTo?.name || '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="action-buttons">
          {canManageAssets && row.status === 'Available' && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => openAllocateModal(row)}
              title="Allocate"
            >
              <ArrowLeftRight size={14} /> Allocate
            </button>
          )}
          {canManageAssets && row.status === 'Allocated' && (
            <button
              className="btn btn-sm btn-warning"
              onClick={() => openReturnModal(row)}
              title="Return"
            >
              <RotateCcw size={14} /> Return
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
        <h1>Assets</h1>
        {canManageAssets && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setFormData({
                name: '',
                serialNumber: '',
                acquisitionDate: '',
                acquisitionCost: '',
                condition: 'New',
                location: '',
                sharedBookable: false,
              });
              setShowCreateModal(true);
            }}
          >
            <Plus size={18} /> Add Asset
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={assets}
        searchKeys={['assetTag', 'name', 'serialNumber']}
      />

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Asset"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label" htmlFor="create-name">
              Name
            </label>
            <input
              id="create-name"
              name="name"
              type="text"
              className="form-input"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="create-serial">
              Serial Number
            </label>
            <input
              id="create-serial"
              name="serialNumber"
              type="text"
              className="form-input"
              value={formData.serialNumber || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="create-acq-date">
              Acquisition Date
            </label>
            <input
              id="create-acq-date"
              name="acquisitionDate"
              type="date"
              className="form-input"
              value={formData.acquisitionDate || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="create-acq-cost">
              Acquisition Cost
            </label>
            <input
              id="create-acq-cost"
              name="acquisitionCost"
              type="number"
              className="form-input"
              value={formData.acquisitionCost || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="create-condition">
              Condition
            </label>
            <select
              id="create-condition"
              name="condition"
              className="form-select"
              value={formData.condition || 'New'}
              onChange={handleChange}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="create-location">
              Location
            </label>
            <input
              id="create-location"
              name="location"
              type="text"
              className="form-input"
              value={formData.location || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label form-checkbox-label">
              <input
                name="sharedBookable"
                type="checkbox"
                checked={formData.sharedBookable || false}
                onChange={handleChange}
              />
              Shared / Bookable
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Create Asset
          </button>
        </form>
      </Modal>

      {/* Allocate Modal */}
      <Modal
        isOpen={showAllocateModal}
        onClose={() => {
          setShowAllocateModal(false);
          setSelectedAsset(null);
        }}
        title={`Allocate: ${selectedAsset?.name || ''}`}
      >
        <form onSubmit={handleAllocate}>
          <div className="form-group">
            <label className="form-label" htmlFor="allocate-employee">
              Employee
            </label>
            <select
              id="allocate-employee"
              name="employeeId"
              className="form-select"
              value={formData.employeeId || ''}
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
            <label className="form-label" htmlFor="allocate-return">
              Expected Return Date
            </label>
            <input
              id="allocate-return"
              name="expectedReturn"
              type="date"
              className="form-input"
              value={formData.expectedReturn || ''}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Allocate Asset
          </button>
        </form>
      </Modal>

      {/* Return Modal */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => {
          setShowReturnModal(false);
          setSelectedAsset(null);
        }}
        title={`Return: ${selectedAsset?.name || ''}`}
      >
        <form onSubmit={handleReturn}>
          <div className="form-group">
            <label className="form-label" htmlFor="return-condition">
              Condition on Return
            </label>
            <select
              id="return-condition"
              name="conditionOnReturn"
              className="form-select"
              value={formData.conditionOnReturn || 'Good'}
              onChange={handleChange}
              required
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-warning" style={{ width: '100%' }}>
            Confirm Return
          </button>
        </form>
      </Modal>
    </div>
  );
}

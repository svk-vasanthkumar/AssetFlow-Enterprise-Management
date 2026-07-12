import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Wrench } from 'lucide-react';
import { maintenanceAPI, assetAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import PageLoader from '../components/PageLoader';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const EXCLUDED_STATUSES = ['Under Maintenance', 'Lost', 'Retired', 'Disposed'];

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const { user } = useAuth();
  const toast = useToast();
  const canApproveResolve = ['Admin', 'Asset Manager'].includes(user?.role);

  const fetchData = async () => {
    try {
      const [maintRes, assetRes] = await Promise.all([
        maintenanceAPI.getAll(),
        assetAPI.getAll(),
      ]);
      setRecords(maintRes.maintenance || []);
      setAssets(assetRes.assets || []);
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

  const handleRaise = async (e) => {
    e.preventDefault();
    try {
      await maintenanceAPI.raise({
        asset: formData.asset,
        issue: formData.issue,
        priority: formData.priority,
        raisedBy: user?._id || user?.id,
      });
      toast.success('Maintenance request raised successfully');
      setShowRaiseModal(false);
      setFormData({});
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleApprove = async () => {
    try {
      await maintenanceAPI.approve(selectedRecord._id);
      toast.success('Maintenance request approved');
      setShowApproveDialog(false);
      setSelectedRecord(null);
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResolve = async () => {
    try {
      await maintenanceAPI.resolve(selectedRecord._id);
      toast.success('Maintenance request resolved');
      setShowResolveDialog(false);
      setSelectedRecord(null);
      await fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const availableAssets = assets.filter(
    (a) => !EXCLUDED_STATUSES.includes(a.status)
  );

  const columns = [
    {
      key: 'asset',
      label: 'Asset',
      render: (row) => {
        const a = row.asset;
        if (!a) return '—';
        return `${a.assetTag || ''} - ${a.name || ''}`;
      },
    },
    {
      key: 'issue',
      label: 'Issue',
      render: (row) => {
        const issue = row.issue || '';
        return issue.length > 50 ? `${issue.substring(0, 50)}...` : issue;
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (row) => (
        <span
          className={`badge badge-${(row.priority || '').replace(/\s+/g, '-')}`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      key: 'raisedBy',
      label: 'Raised By',
      render: (row) => row.raisedBy?.name || '—',
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
          {canApproveResolve && row.status === 'Pending' && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setSelectedRecord(row);
                setShowApproveDialog(true);
              }}
              title="Approve"
            >
              <CheckCircle size={14} /> Approve
            </button>
          )}
          {canApproveResolve && row.status === 'Approved' && (
            <button
              className="btn btn-sm btn-success"
              onClick={() => {
                setSelectedRecord(row);
                setShowResolveDialog(true);
              }}
              title="Resolve"
            >
              <Wrench size={14} /> Resolve
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
        <h1>Maintenance</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormData({
              asset: '',
              issue: '',
              priority: 'Medium',
            });
            setShowRaiseModal(true);
          }}
        >
          <Plus size={18} /> Raise Request
        </button>
      </div>

      <DataTable
        columns={columns}
        data={records}
        searchKeys={['issue']}
      />

      <Modal
        isOpen={showRaiseModal}
        onClose={() => setShowRaiseModal(false)}
        title="Raise Maintenance Request"
      >
        <form onSubmit={handleRaise}>
          <div className="form-group">
            <label className="form-label" htmlFor="maint-asset">
              Asset
            </label>
            <select
              id="maint-asset"
              name="asset"
              className="form-select"
              value={formData.asset || ''}
              onChange={handleChange}
              required
            >
              <option value="">Select Asset</option>
              {availableAssets.map((asset) => (
                <option key={asset._id} value={asset._id}>
                  {asset.assetTag} - {asset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="maint-issue">
              Issue Description
            </label>
            <textarea
              id="maint-issue"
              name="issue"
              className="form-input"
              rows={4}
              value={formData.issue || ''}
              onChange={handleChange}
              required
              placeholder="Describe the issue..."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="maint-priority">
              Priority
            </label>
            <select
              id="maint-priority"
              name="priority"
              className="form-select"
              value={formData.priority || 'Medium'}
              onChange={handleChange}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Submit Request
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showApproveDialog}
        onClose={() => {
          setShowApproveDialog(false);
          setSelectedRecord(null);
        }}
        onConfirm={handleApprove}
        title="Approve Maintenance"
        message={`Are you sure you want to approve this maintenance request for "${selectedRecord?.asset?.name || 'this asset'}"?`}
      />

      <ConfirmDialog
        isOpen={showResolveDialog}
        onClose={() => {
          setShowResolveDialog(false);
          setSelectedRecord(null);
        }}
        onConfirm={handleResolve}
        title="Resolve Maintenance"
        message={`Mark this maintenance request for "${selectedRecord?.asset?.name || 'this asset'}" as resolved?`}
      />
    </div>
  );
}

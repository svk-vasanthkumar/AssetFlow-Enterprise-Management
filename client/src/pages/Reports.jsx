import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { reportAPI } from '../api/api';
import { useToast } from '../context/ToastContext';
import DataTable from '../components/DataTable';
import PageLoader from '../components/PageLoader';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('assets');
  const [assetReport, setAssetReport] = useState([]);
  const [departmentReport, setDepartmentReport] = useState([]);
  const [maintenanceReport, setMaintenanceReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [assetRes, deptRes, maintRes] = await Promise.all([
          reportAPI.assets(),
          reportAPI.departments(),
          reportAPI.maintenance(),
        ]);
        setAssetReport(assetRes.assets || []);
        setDepartmentReport(deptRes.departments || []);
        setMaintenanceReport(maintRes.maintenance || []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const exportCSV = (data, columns, filename) => {
    if (!data || data.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const header = columns.map((c) => c.label).join(',');
    const rows = data.map((row) =>
      columns
        .map((c) => {
          let val = c.csvValue ? c.csvValue(row) : row[c.key] || '';
          val = String(val).replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(',')
    );

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${filename}.csv exported successfully`);
  };

  const formatCurrency = (value) => {
    if (value == null || value === '') return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Asset report columns
  const assetColumns = [
    { key: 'assetTag', label: 'Asset Tag' },
    { key: 'name', label: 'Name' },
    {
      key: 'category',
      label: 'Category',
      render: (row) => row.category?.name || '—',
      csvValue: (row) => row.category?.name || '',
    },
    { key: 'serialNumber', label: 'Serial No' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge badge-${(row.status || '').replace(/\s+/g, '-')}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'condition',
      label: 'Condition',
      render: (row) => (
        <span className={`badge badge-${(row.condition || '').replace(/\s+/g, '-')}`}>
          {row.condition}
        </span>
      ),
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      render: (row) => row.assignedTo?.name || '—',
      csvValue: (row) => row.assignedTo?.name || '',
    },
    {
      key: 'acquisitionCost',
      label: 'Acquisition Cost',
      render: (row) => formatCurrency(row.acquisitionCost),
      csvValue: (row) => row.acquisitionCost || '',
    },
  ];

  // Department report columns
  const departmentColumns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    {
      key: 'head',
      label: 'Head',
      render: (row) => row.head?.name || '—',
      csvValue: (row) => row.head?.name || '',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge badge-${(row.status || '').replace(/\s+/g, '-')}`}>
          {row.status}
        </span>
      ),
    },
  ];

  // Maintenance report columns
  const maintenanceColumns = [
    {
      key: 'asset',
      label: 'Asset',
      render: (row) => {
        const a = row.asset;
        if (!a) return '—';
        return `${a.assetTag || ''} - ${a.name || ''}`;
      },
      csvValue: (row) => {
        const a = row.asset;
        return a ? `${a.assetTag || ''} - ${a.name || ''}` : '';
      },
    },
    {
      key: 'issue',
      label: 'Issue',
      render: (row) => {
        const issue = row.issue || '';
        return issue.length > 60 ? `${issue.substring(0, 60)}...` : issue;
      },
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (row) => (
        <span className={`badge badge-${(row.priority || '').replace(/\s+/g, '-')}`}>
          {row.priority}
        </span>
      ),
    },
    {
      key: 'raisedBy',
      label: 'Raised By',
      render: (row) => row.raisedBy?.name || '—',
      csvValue: (row) => row.raisedBy?.name || '',
    },
    {
      key: 'technician',
      label: 'Technician',
      render: (row) => row.technician?.name || '—',
      csvValue: (row) => row.technician?.name || '',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`badge badge-${(row.status || '').replace(/\s+/g, '-')}`}>
          {row.status}
        </span>
      ),
    },
  ];

  // Summary stats
  const assetSummary = {
    total: assetReport.length,
    available: assetReport.filter((a) => a.status === 'Available').length,
    allocated: assetReport.filter((a) => a.status === 'Allocated').length,
    maintenance: assetReport.filter((a) => a.status === 'Under Maintenance').length,
  };

  const deptSummary = {
    total: departmentReport.length,
    active: departmentReport.filter((d) => d.status === 'Active').length,
    inactive: departmentReport.filter((d) => d.status === 'Inactive').length,
  };

  const maintSummary = {
    total: maintenanceReport.length,
    pending: maintenanceReport.filter((m) => m.status === 'Pending').length,
    approved: maintenanceReport.filter((m) => m.status === 'Approved').length,
    resolved: maintenanceReport.filter((m) => m.status === 'Resolved').length,
  };

  const tabs = [
    { key: 'assets', label: 'Assets' },
    { key: 'departments', label: 'Departments' },
    { key: 'maintenance', label: 'Maintenance' },
  ];

  if (loading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Reports</h1>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'assets' && (
        <div className="report-section">
          <div className="report-summary">
            <div className="summary-stat">
              <span className="summary-value">{assetSummary.total}</span>
              <span className="summary-label">Total Assets</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value" style={{ color: '#06d6a0' }}>
                {assetSummary.available}
              </span>
              <span className="summary-label">Available</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value" style={{ color: '#3b82f6' }}>
                {assetSummary.allocated}
              </span>
              <span className="summary-label">Allocated</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value" style={{ color: '#f59e0b' }}>
                {assetSummary.maintenance}
              </span>
              <span className="summary-label">Maintenance</span>
            </div>
          </div>

          <DataTable columns={assetColumns} data={assetReport} searchKeys={['assetTag', 'name', 'serialNumber']} />

          <button
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
            onClick={() => exportCSV(assetReport, assetColumns, 'asset_report')}
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      )}

      {activeTab === 'departments' && (
        <div className="report-section">
          <div className="report-summary">
            <div className="summary-stat">
              <span className="summary-value">{deptSummary.total}</span>
              <span className="summary-label">Total Departments</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value" style={{ color: '#06d6a0' }}>
                {deptSummary.active}
              </span>
              <span className="summary-label">Active</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value" style={{ color: '#ef4444' }}>
                {deptSummary.inactive}
              </span>
              <span className="summary-label">Inactive</span>
            </div>
          </div>

          <DataTable columns={departmentColumns} data={departmentReport} searchKeys={['name', 'code']} />

          <button
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
            onClick={() => exportCSV(departmentReport, departmentColumns, 'department_report')}
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="report-section">
          <div className="report-summary">
            <div className="summary-stat">
              <span className="summary-value">{maintSummary.total}</span>
              <span className="summary-label">Total Requests</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value" style={{ color: '#f59e0b' }}>
                {maintSummary.pending}
              </span>
              <span className="summary-label">Pending</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value" style={{ color: '#3b82f6' }}>
                {maintSummary.approved}
              </span>
              <span className="summary-label">Approved</span>
            </div>
            <div className="summary-stat">
              <span className="summary-value" style={{ color: '#06d6a0' }}>
                {maintSummary.resolved}
              </span>
              <span className="summary-label">Resolved</span>
            </div>
          </div>

          <DataTable columns={maintenanceColumns} data={maintenanceReport} searchKeys={['issue']} />

          <button
            className="btn btn-secondary"
            style={{ marginTop: '1rem' }}
            onClick={() => exportCSV(maintenanceReport, maintenanceColumns, 'maintenance_report')}
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      )}
    </div>
  );
}

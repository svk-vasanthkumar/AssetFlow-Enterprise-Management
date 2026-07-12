import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Inbox } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  searchKeys = [],
  searchPlaceholder = 'Search...',
  actions,
  loading = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const getValue = (row, key) => {
    if (key.includes('.')) {
      return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : ''), row);
    }
    return row[key];
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) => {
      if (searchKeys.length > 0) {
        return searchKeys.some((key) => {
          const val = getValue(row, key);
          return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
        });
      }
      return Object.values(row).some((val) => {
        if (val && typeof val === 'object') {
          return Object.values(val).some(
            (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(term)
          );
        }
        return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      let aVal = getValue(a, sortKey);
      let bVal = getValue(b, sortKey);
      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) return <ArrowUpDown size={14} />;
    return sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="table-toolbar">
          <div className="skeleton" style={{ width: 240, height: 38, borderRadius: 8 }} />
        </div>
        <div className="table-skeleton">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-row">
              {columns.map((_, j) => (
                <div
                  key={j}
                  className="skeleton"
                  style={{ height: 16, borderRadius: 4, flex: 1 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-toolbar">
        <div className="table-search">
          <Search size={16} className="table-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-input"
          />
        </div>
        {actions && <div className="table-actions">{actions}</div>}
      </div>

      {sortedData.length === 0 ? (
        <div className="table-empty">
          <Inbox size={48} strokeWidth={1} />
          <p className="table-empty-title">No data found</p>
          <p className="table-empty-subtitle">
            {searchTerm ? 'Try adjusting your search term' : 'No records to display'}
          </p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                    className={col.sortable !== false ? 'sortable' : ''}
                  >
                    <span className="th-content">
                      {col.label}
                      {col.sortable !== false && renderSortIcon(col.key)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, idx) => (
                <tr key={row._id || row.id || idx}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : getValue(row, col.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

// Added onEdit and onDelete props
export const AssetTable = ({ data, onEdit, onDelete }) => {
  // 1. Define the columns for the table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Asset Name',
        cell: (info) => <span className="font-medium text-slate-900">{info.getValue()}</span>,
      },
      {
        accessorKey: 'serialNumber',
        header: 'Serial Number',
        cell: (info) => <span className="text-slate-500 font-mono text-sm">{info.getValue()}</span>,
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          let colorClass = 'bg-slate-100 text-slate-700'; // Default
          
          if (status === 'Active') colorClass = 'bg-green-100 text-green-700';
          if (status === 'In Repair') colorClass = 'bg-red-100 text-red-700';
          if (status === 'In Storage') colorClass = 'bg-blue-100 text-blue-700';

          return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        // Updated cell to handle both edit and delete actions
        cell: (info) => (
          <div className="flex gap-3">
            <button 
              onClick={() => onEdit(info.row.original)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(info.row.original.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete] // Added dependencies so the table updates if these functions change
  );

  // 2. Initialize the TanStack table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 3. Render the UI
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-slate-200 bg-slate-50">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-4 text-sm font-semibold text-slate-600">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4 text-sm text-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

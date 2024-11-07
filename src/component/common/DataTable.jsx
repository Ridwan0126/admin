import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const DataTable = ({ data, columns, handleEdit, handleDelete, getStatusBadgeClass }) => {
  return (
    <div className="hidden lg:block">
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map(column => (
                <th key={column.key} className="p-3 text-left text-sm font-semibold text-gray-600">
                  {column.label}
                </th>
              ))}
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {columns.map(column => (
                  <td key={`${row.id}-${column.key}`} className="p-3">
                    {column.key === 'status' ? (
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(row.status)}`}>
                        {row[column.key]}
                      </span>
                    ) : column.key === 'date' ? (
                      <>
                        {row.date}
                        <br />
                        <span className="text-gray-500 text-xs">({row.time})</span>
                      </>
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
                <td className="p-3">
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-sm font-medium text-blue-600 rounded hover:bg-blue-100"
                      onClick={() => handleEdit(row)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-sm font-medium text-red-600 rounded hover:bg-red-100"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable
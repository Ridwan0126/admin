import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const DataTable = ({
  data,
  columns,
  handleEdit,
  handleDelete,
  contentType = 'default',
  onImageClick,
  imageUrlMap,
  renderActions,
  getStatusBadgeClassProp,
}) => {
  const getPrimaryKey = (row) => row.pickup_id || row.delivery_id || row.id;

  const getDefaultStatusBadgeClass = (status) => {
    if (contentType === 'users') {
      switch (status?.toLowerCase()) {
        case 'aktif':
          return 'bg-green-100 text-green-800';
        case 'nonaktif':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
    switch (status) {
      case 'Berhasil':
        return 'bg-green-100 text-green-800';
      case 'Gagal':
        return 'bg-red-100 text-red-800';
      case 'Proses':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = getStatusBadgeClassProp || getDefaultStatusBadgeClass;

  const getRoleBadgeClass = (role) => {
    let baseClasses = 'rounded-full text-xs';
    if (role?.toLowerCase() === 'admin') {
      baseClasses += ' bg-customTeal text-white sm:px-2 sm:py-1 px-1 py-0.5';
    }
    return baseClasses;
  };

  const renderCell = (row, column) => {
    const cellValue = row[column.key];

    if (column.render) {
      return column.render(cellValue, row);
    }

    switch (column.key) {
      case 'role':
        return (
          <span className="px-3 py-1 rounded-full text-white text-xs bg-customTeal">
            {cellValue}
          </span>
        );
      case 'receipt':
      case 'photo':
        return cellValue ? (
          <div className="flex items-center space-x-2">
            {/* Thumbnail Image */}
            <img
              src={imageUrlMap?.[cellValue] || `http://localhost:5000${cellValue}`}
              alt={column.key === 'photo' ? 'Photo' : 'Receipt'}
              className="w-10 h-10 object-cover rounded cursor-pointer"
              onClick={() => onImageClick?.(`http://localhost:5000${cellValue}`)}
            />
            {/* "View Image" Button */}
            <button
              className="text-blue-600 underline hover:text-blue-800"
              onClick={() => onImageClick?.(`http://localhost:5000${cellValue}`)}
            >
              View Image
            </button>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">
            {column.key === 'photo' ? 'No photo' : 'No receipt'}
          </span>
        );
      case 'status':
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(cellValue)}`}
          >
            {cellValue || 'Unknown'}
          </span>
        );
      default:
        return cellValue ?? 'N/A';
    }
  };

  return (
    <div className="hidden lg:block">
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="p-3 text-left text-sm font-semibold text-gray-600"
                >
                  {column.label}
                </th>
              ))}
              <th className="p-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={getPrimaryKey(row)} className="border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={`${getPrimaryKey(row)}-${column.key}`}
                    className="p-3"
                  >
                    {renderCell(row, column)}
                  </td>
                ))}
                <td className="p-3">
                  {renderActions ? (
                    renderActions(row)
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-sm font-medium text-blue-600 rounded hover:bg-blue-100"
                        onClick={() => handleEdit(row)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-sm font-medium text-red-600 rounded hover:bg-red-100"
                        onClick={() => handleDelete(getPrimaryKey(row))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
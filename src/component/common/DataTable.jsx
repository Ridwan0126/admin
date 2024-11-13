import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

/**
 * Komponen DataTable untuk menampilkan data dalam bentuk tabel
 * @param {Array} data - Data yang akan ditampilkan dalam tabel
 * @param {Array} columns - Konfigurasi kolom tabel
 * @param {Function} handleEdit - Fungsi untuk menangani aksi edit
 * @param {Function} handleDelete - Fungsi untuk menangani aksi hapus
 * @param {string} contentType - Tipe konten untuk menentukan tampilan status
 */
const DataTable = ({ data, columns, handleEdit, handleDelete, contentType = 'default' }) => {
  // Fungsi untuk menentukan kelas CSS badge status
  const getStatusBadgeClass = (status) => {
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

  // Fungsi untuk menentukan kelas CSS badge peran
  const getRoleBadgeClass = (role) => {
    let baseClasses = 'rounded-full text-xs';

    if (role?.toLowerCase() === 'admin') {
      baseClasses += ' bg-customTeal text-white';
      baseClasses += ' sm:px-2 sm:py-1'; // Gaya untuk desktop
      baseClasses += ' px-1 py-0.5'; // Gaya untuk mobile/tablet
    }

    return baseClasses;
  };

  return (
    // Kontainer tabel yang hanya ditampilkan pada layar besar
    <div className="hidden lg:block">
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          {/* Header tabel */}
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
          {/* Isi tabel */}
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {columns.map(column => (
                  <td key={`${row.id}-${column.key}`} className="p-3">
                    {column.key === 'status' ? (
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(row[column.key])}`}>
                        {row[column.key]}
                      </span>
                    ) : column.key === 'role' ? (
                      <span className={getRoleBadgeClass(row[column.key])}>
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

export default DataTable;
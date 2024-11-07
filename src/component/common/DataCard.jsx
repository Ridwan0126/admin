import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const DataCard = ({ data, sections, handleEdit, handleDelete }) => {
  const getStatusBadgeClass = (status) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      {/* Header with ID and status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">ID:</span>
          <span className="font-semibold">{data.id}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(data.status)}`}>
          {data.status}
        </span>
      </div>

      {/* Main content */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.title} className="border-b pb-3">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{section.title}</h3>
            <div className="space-y-2">
              {section.fields.map(field => (
                <div key={field.key} className="flex flex-col sm:flex-row sm:items-center">
                  <span className="text-gray-600 font-medium w-full sm:w-1/3">{field.label}</span>
                  <span className="text-gray-800">
                    {field.key === 'date' ? `${data[field.key]} (${data.time})` : data[field.key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button 
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
            onClick={() => handleEdit(data)}
          >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button 
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200"
            onClick={() => handleDelete(data.id)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
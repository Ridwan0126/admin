import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditModal = ({ isOpen, onClose, data, fields, onUpdate, contentType = 'default' }) => {
  // State to store form data
  const [formData, setFormData] = useState(data);

  // Sync formData with new data when modal opens with updated data
  useEffect(() => {
    if (isOpen) {
      setFormData(data || {}); // Set formData to the selected admin data or empty object if undefined
    }
  }, [isOpen, data]);

  // Generate status options based on content type
  const getStatusOptions = () => {
    if (contentType === 'users') {
      return (
        <>
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </>
      );
    }
    return (
      <>
        <option value="Berhasil">Berhasil</option>
        <option value="Gagal">Gagal</option>
        <option value="Proses">Proses</option>
      </>
    );
  };

  // Do not render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Data</h2>
          <button 
            onClick={() => {
              onClose();
              setFormData({}); // Optionally reset formData when modal closes
            }} 
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onUpdate(formData);
          onClose();
        }} className="p-4 space-y-4">
          {fields.map(field => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.key === 'status' ? (
                <select
                  name={field.key}
                  value={formData[field.key] || ''} // Ensure controlled component
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      [e.target.name]: e.target.value
                    }));
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {getStatusOptions()}
                </select>
              ) : (
                <input
                  type="text"
                  name={field.key}
                  value={formData[field.key] || ''} // Ensure controlled component
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      [e.target.name]: e.target.value
                    }));
                  }}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setFormData({}); // Reset form data when closing
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-customTeal rounded hover:bg-emerald-500 transition-colors duration-200"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
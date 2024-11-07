import React, { useState } from 'react';
import { X } from 'lucide-react';

const EditModal = ({ isOpen, onClose, data, fields, onUpdate }) => {
  const [formData, setFormData] = useState(data);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputClasses = "w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-700";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Data</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {fields.map(field => (
            <div key={field.key} className="space-y-2">
              <label className={labelClasses}>{field.label}</label>
              {field.key === 'status' ? (
                <select
                  name={field.key}
                  value={formData[field.key]}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="Berhasil">Berhasil</option>
                  <option value="Gagal">Gagal</option>
                  <option value="Proses">Proses</option>
                </select>
              ) : (
                <input
                  type="text"
                  name={field.key}
                  value={formData[field.key]}
                  onChange={handleChange}
                  className={inputClasses}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-200"
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
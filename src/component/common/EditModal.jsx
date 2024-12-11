import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditModal = ({ isOpen, onClose, data, fields, onUpdate }) => {
  const [formData, setFormData] = useState(data || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(data || {}); 
      setErrors({}); 
    }
  }, [isOpen, data]);

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onUpdate(formData); 
      onClose(); 
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Generate file preview
      setFormData((prev) => ({
        ...prev,
        banner: {
          file: file,
          preview: fileUrl
        }
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Edit Data</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label
                htmlFor={field.key}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              {field.type === 'quill' ? (
                <ReactQuill
                  value={formData[field.key] || ''}
                  onChange={(value) => handleChange(field.key, value)}
                  className={`border rounded focus:ring-2 focus:ring-blue-500 ${
                    errors[field.key] ? 'border-red-500' : ''
                  }`}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.key}
                  name={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[field.key] ? 'border-red-500' : ''
                  }`}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'file' ? (
                <div>
                  {/* Menampilkan preview gambar jika ada */}
                  {formData.banner?.preview && (
                    <div>
                      <img
                        src={formData.banner.preview}
                        alt="Banner Preview"
                        className="mb-2"
                        width="100"
                      />
                    </div>
                  )}
                  {/* Input file untuk memilih gambar baru */}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <input
                  id={field.key}
                  type={field.type || 'text'}
                  name={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder || ''}
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[field.key] ? 'border-red-500' : ''
                  }`}
                />
              )}
              {/* Validation error message */}
              {errors[field.key] && (
                <p className="text-sm text-red-500">{errors[field.key]}</p>
              )}
            </div>
          ))}

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
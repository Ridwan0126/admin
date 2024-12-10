import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';

const EditModal = ({ isOpen, onClose, data, fields, onUpdate, contentType = 'default' }) => {
  const [formData, setFormData] = useState({
    ...data,
    status: getInitialStatus() // Fungsi untuk mendapatkan status awal berdasarkan tipe konten
  });
  const fileInputRef = useRef(null);

  // Fungsi untuk mendapatkan status awal berdasarkan tipe konten
  function getInitialStatus() {
    switch (contentType) {
      case 'users':
        return data.status || 'Aktif';
      case 'blogs':
        return 'Dipublikasikan';
      default:
        return data.status || 'Proses';
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        banner: {
          file: file,
          preview: fileUrl
        }
      }));
    }
  };

  const getStatusOptions = () => {
    switch (contentType) {
      case 'users':
        return (
          <>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </>
        );
      case 'blogs':
        return (
          <>
            <option value="Dipublikasikan">Dipublikasikan</option>
          </>
        );
      default:
        return (
          <>
            <option value="Berhasil">Berhasil</option>
            <option value="Gagal">Gagal</option>
            <option value="Proses">Proses</option>
          </>
        );
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col relative">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Edit {contentType === 'blogs' ? 'Blog' : 'Data'}</h2>
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <X className="w-5 h-5 " />
          </button>
        </div>
        
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onUpdate(formData);
            onClose();
          }} 
          className="p-4 space-y-4 overflow-y-auto"
        >
          {fields.map(field => (
            <div key={field.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.key === 'banner' && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="banner-upload"
                    />
                    <label 
                      htmlFor="banner-upload"
                      className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Banner</span>
                    </label>
                    {(formData.banner?.preview || formData.banner) && (
                      <img 
                        src={
                          formData.banner?.preview || 
                          (formData.banner instanceof File 
                            ? URL.createObjectURL(formData.banner) 
                            : formData.banner)
                        } 
                        alt="Banner Preview" 
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              )}
              {field.key === 'status' && (
                <select
                  name={field.key}
                  value={formData.status}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      [e.target.name]: e.target.value
                    }));
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  // Disable status select for blogs (setelah dipublikasikan)
                  disabled={contentType === 'blogs'}
                >
                  {getStatusOptions()}
                </select>
              )}
              {field.key === 'tanggalPublikasi' ? (
                <input
                  type="date"
                  name={field.key}
                  value={formData[field.key]}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      [e.target.name]: e.target.value
                    }));
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : field.key !== 'status' && (
                <input
                  type="text"
                  name={field.key}
                  value={formData[field.key]}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      [e.target.name]: e.target.value
                    }));
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
          ))}

          <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-customTeal rounded hover:bg-customTeal transition-colors duration-200"
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
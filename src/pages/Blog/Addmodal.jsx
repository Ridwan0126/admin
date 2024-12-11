import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

const AddModal = ({ isOpen, onClose, onAdd, onImageClick }) => {
  const [formData, setFormData] = useState({
    judul: '',
    isiBlog: '', 
    penulis: '',
    tanggalPublikasi: '',
    banner: null,
    status: 'Dipublikasikan'
  });  
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);  // 'image' is the name of the field
  
      try {
        // Send the image upload request to the new blog upload route
        const response = await fetch(`http://localhost:5000/api/blogs/upload-image`, {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            banner: {
              file: data.imageUrl,  // Assuming the backend returns the file URL or path
              preview: URL.createObjectURL(file),
            }
          }));
        } else {
          console.error('Image upload failed');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBlog = {
      id: Date.now().toString(),
      judul: formData.judul,
      isiBlog: formData.isiBlog,
      penulis: formData.penulis,
      tanggalPublikasi: formData.tanggalPublikasi,
      banner: formData.banner ? formData.banner.file : null,
      status: formData.status
    };
    onAdd(newBlog);
    onClose();
    setFormData({
      judul: '',
      isiBlog: '',
      penulis: '',
      tanggalPublikasi: '',
      banner: null,
      status: 'Draft'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBannerImageClick = () => {
    if (formData.banner && onImageClick) {
      onImageClick(formData.banner.preview);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Tambah Blog Baru</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Judul Blog
            </label>
            <input
              type="text"
              name="judul"
              value={formData.judul}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Masukkan judul blog"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Isi Blog
            </label>
            <ReactQuill
              theme="snow"
              value={formData.isiBlog}
              onChange={(value) => setFormData((prev) => ({ ...prev, isiBlog: value }))}
              className="border rounded"
              placeholder="Masukkan isi blog"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Penulis
            </label>
            <input
              type="text"
              name="penulis"
              value={formData.penulis}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Nama penulis"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Publikasi
            </label>
            <input
              type="date"
              name="tanggalPublikasi"
              value={formData.tanggalPublikasi}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Banner
            </label>
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
              {formData.banner && (
                <img 
                  src={formData.banner.preview} 
                  alt="Banner Preview" 
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={handleBannerImageClick}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Dipublikasikan">Dipublikasikan</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

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
              className="flex items-center gap-2 px-4 py-2 bg-customTeal text-white rounded-md hover:bg-customTeal transition-colors duration-200"
            >
              Tambah
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
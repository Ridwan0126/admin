import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';
import AddModal from './Addmodal';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { format } from 'date-fns';

const API_URL = 'http://localhost:5000/api/blogs'; // Ganti dengan URL API Anda

const SearchBar = ({ data, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState('all');

  const performSearch = (text, field) => {
    const searchTerm = text.toLowerCase().trim();
    
    return data.filter(item => {
      if (field === 'all') {
        return Object.values(item).some(value => 
          value.toString().toLowerCase().includes(searchTerm)
        );
      } else {
        const itemValue = item[field].toString().toLowerCase();
        return itemValue.includes(searchTerm);
      }
    });
  };

  const handleInputChange = (e) => {
    const newSearchText = e.target.value;
    setSearchText(newSearchText);
    const results = performSearch(newSearchText, searchField);
    onSearch(results);
  };

  const handleFieldChange = (e) => {
    const newSearchField = e.target.value;
    setSearchField(newSearchField);
    const results = performSearch(searchText, newSearchField);
    onSearch(results);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Cari blog..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchText}
          onChange={handleInputChange}
        />
      </div>
      <div className="sm:w-48">
        <select
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchField}
          onChange={handleFieldChange}
        >
          <option value="all">Semua Field</option>
          {Object.keys(data[0] || {}).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const BlogContent = () => {
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullText, setShowFullText] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const formatDateToReadable = (isoDate) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(isoDate);
    return date.toLocaleDateString('id-ID', options);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); 
      setFormData((prev) => ({
        ...prev,
        banner: {
          file: file, 
          preview: fileUrl, 
        },
      }));
    }
  };
  

  const columns = [
    { key: 'judul', label: 'Judul', type: 'text' },
    { 
      key: 'isiBlog', 
      label: 'Isi Blog',
      type: 'quill', 
      render: (cellValue, row) => (
        <div>
          {/* Tampilkan ReactQuill dengan teks terbatas atau penuh */}
          <ReactQuill 
            value={showFullText === row.id ? cellValue : cellValue.substring(0, 150) + '...'} 
            readOnly={true} 
            theme="bubble" 
            modules={{ toolbar: false }}
          />
          <button
            className="text-blue-500 mt-2"
            onClick={() => toggleFullText(row.id)}
          >
            {showFullText === row.id ? 'Tampilkan lebih sedikit' : 'Lihat Selengkapnya'}
          </button>
        </div>
      )
    },
    { key: 'penulis', label: 'Penulis', type: 'text' },
    {
      key: 'tanggalPublikasi',
      label: 'Tanggal Publikasi',
      type: 'date',
      render: (cellValue) => <span>{formatDateToReadable(cellValue)}</span>,
    },
    {
      key: 'banner',
      label: 'Banner',
      type: 'file',
      render: (value) => {
        if (!value || typeof value !== 'string') {
          return <span className="text-gray-400 text-sm">No banner available</span>;
        }

        const fullUrl = `http://localhost:5000${value}`;
        return (
          <div className="flex items-center space-x-2">
            <img
              src={fullUrl}
              alt="Banner"
              className="w-10 h-10 object-cover rounded cursor-pointer"
              onClick={() => handleImageClick(fullUrl)}
            />
            <button
              className="text-blue-600 underline hover:text-blue-800"
              onClick={() => handleImageClick(fullUrl)}
            >
              Lihat Foto
            </button>
          </div>
        );
      },
    },
    { key: 'status', label: 'Status', type: 'select', options: [{ value: 'Dipublikasikan', label: 'Dipublikasikan' }, { value: 'Draft', label: 'Draft' }] },
  ];
  
  const cardSections = [
    {
      title: 'Blog Details',
      fields: [
        { key: 'judul', label: 'Judul' },
        { 
          key: 'isiBlog', 
          label: 'Isi Blog',
          type: 'quill', 
          render: (cellValue, row) => (
            <div>
              {/* Tampilkan ReactQuill dengan teks terbatas atau penuh */}
              <ReactQuill 
                value={showFullText === row.id ? cellValue : cellValue.substring(0, 150) + '...'} 
                readOnly={true} 
                theme="bubble" 
                modules={{ toolbar: false }}
              />
              <button
                className="text-blue-500 mt-2"
                onClick={() => toggleFullText(row.id)}
              >
                {showFullText === row.id ? 'Tampilkan lebih sedikit' : 'Lihat Selengkapnya'}
              </button>
            </div>
          )
        },
        { key: 'penulis', label: 'Penulis' },
        { 
          key: 'tanggalPublikasi', 
          label: 'Tanggal Publikasi', 
          type: 'date',
          render: (cellValue) => {
            const formattedDate = formatDateToReadable(cellValue); 
            return <span>{formattedDate}</span>; 
          }
        },
        {
          key: 'banner',
          label: 'Banner',
          type: 'file',
          render: (value) => {
            if (!value || typeof value !== 'string') {
              return <span className="text-gray-400 text-sm">No banner available</span>;
            }
    
            const fullUrl = `http://localhost:5000${value}`;
            return (
              <div className="flex items-center space-x-2">
                <img
                  src={fullUrl}
                  alt="Banner"
                  className="w-10 h-10 object-cover rounded cursor-pointer"
                  onClick={() => handleImageClick(fullUrl)}
                />
                <button
                  className="text-blue-600 underline hover:text-blue-800"
                  onClick={() => handleImageClick(fullUrl)}
                >
                  Lihat Foto
                </button>
              </div>
            );
          },
        },
        { key: 'status', label: 'Status' },
      ]
    }
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAdd = async (newBlog) => {
    try {
      const response = await axios.post(API_URL, newBlog);
      const updatedData = [...data, response.data];
      setData(updatedData);
      setFilteredData(updatedData);
      setIsAddModalOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Blog berhasil ditambahkan.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  const handleEdit = (rowData) => {
    setSelectedData(rowData);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Yakin menghapus data ini?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          const response = await axios.delete(`${API_URL}/${id}`);
          
          if (response.status === 200) {
            const newData = data.filter(item => item.id !== id);
            setData(newData);
            setFilteredData(newData);
  
            Swal.fire({
              icon: 'success',
              title: 'Berhasil!',
              text: 'Blog berhasil dihapus.',
              confirmButtonColor: '#3085d6',
            });
          } else {
            throw new Error('Failed to delete data');
          }
        } catch (error) {
          console.error('Error deleting blog:', error);
  
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat menghapus data.',
            confirmButtonColor: '#d33',
          });
        }
      }
    });
  };
  

  const handleUpdate = async (updatedData) => {
    // Pastikan id berasal dari updatedData atau selectedData
    const id = updatedData.id || selectedData?.id; // Ambil id dari updatedData atau selectedData
  
    if (!id) {
      console.error("ID not found");
      return;
    }
  
    const formData = new FormData();
    
    // Append regular fields to formData
    formData.append('judul', updatedData.judul);
    formData.append('isiBlog', updatedData.isiBlog);
    formData.append('penulis', updatedData.penulis);
    formData.append('tanggalPublikasi', updatedData.tanggalPublikasi);
    formData.append('status', updatedData.status);
  
    // Append banner file if present
    if (updatedData.banner?.file) {
      formData.append('image', updatedData.banner.file);
    }
  
    try {
    const response = await axios.put(`http://localhost:5000/api/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  
      // Assuming response.data contains the updated blog data, update the state
      const newData = response.data;
  
      // Update local state with the new data
      setData(prevData => prevData.map(item => item.id === newData.id ? newData : item));
      setFilteredData(prevFilteredData => prevFilteredData.map(item => item.id === newData.id ? newData : item));
  
      // Close the modal and reset selected data
      setIsEditModalOpen(false);
      setSelectedData(null);
  
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil diupdate.",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating data:", error);
  
      // Show error message if there's an issue during update
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error?.response?.data?.message || error?.message || "Terjadi kesalahan saat memperbarui data.",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };
  
  
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const toggleFullText = (id) => {
    setShowFullText(prev => prev === id ? null : id); // Toggle showing full text
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Daftar Blog</h2>
            <p className="text-sm text-gray-500">This is a list of all blogs</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-customTeal text-white rounded-md hover:bg-emerald-500 transition-colors duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      <SearchBar
        data={data}
        onSearch={setFilteredData}
      />

      <DataTable 
        data={filteredData}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        contentType='blogs'
        onImageClick={handleImageClick}
        renderIsiBlog={(row) => {
          const isFullText = showFullText === row.id;
          return (
            <div>
              <ReactQuill 
                value={isFullText ? row.isiBlog : row.isiBlog.substring(0, 150) + '...'} 
                readOnly={true}
                theme="snow"
                modules={{ toolbar: false }}
              />
              <button 
                className="text-blue-500" 
                onClick={() => toggleFullText(row.id)}
              >
                {isFullText ? 'Tampilkan lebih sedikit' : 'Lihat Selengkapnya'}
              </button>
            </div>
          );
        }}
      />

      <div className="lg:hidden space-y-4">
        {filteredData.map((row) => (
          <DataCard 
            key={row.id}
            data={row}
            sections={cardSections}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            contentType='blogs'
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={closeImageModal}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <img 
              src={selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage}
              alt="Full Size Banner" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {selectedData && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedData(null);
          }}
          data={selectedData}
          fields={columns.filter(col => col.key !== 'id')}
          onUpdate={handleUpdate}
          contentType='blogs'
        />
      )}

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada blog yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default BlogContent;
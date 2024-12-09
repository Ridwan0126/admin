import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';
import AddModal from './Addmodal';

// Sample initial data
const initialData = [
  {
    id: '1',
    judul: "Platform Digital Solusi Pengelolaan Sampah di Era Modern",
    isiBlog: "Dalam era digital yang semakin berkembang, pengelolaan sampah dan limbah membutuhkan pendekatan yang lebih inovatif dan terintegrasi...",
    penulis: "Tim PilahYuk",
    tanggalPublikasi: "15 November 2024",
    banner: "banner.jpg",
    status: "Dipublikasikan"
  }
];

// SearchBar Component
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
          {Object.keys(initialData[0]).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const BlogContent = () => {
  const [data, setData] = useState(initialData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedImage, setSelectedImage] = useState(null);

  const columns = [
    { key: 'judul', label: 'Judul' },
    { key: 'isiBlog', label: 'Isi Blog' },
    { key: 'penulis', label: 'Penulis' },
    { key: 'tanggalPublikasi', label: 'Tanggal Publikasi' },
    { key: 'banner', label: 'Banner' },
    { key: 'status', label: 'Status' }
  ];

  const cardSections = [
    {
      title: 'Blog Details',
      fields: [
        { key: 'judul', label: 'Judul' },
        { key: 'isiBlog', label: 'Isi Blog' },
        { key: 'penulis', label: 'Penulis' },
        { key: 'tanggalPublikasi', label: 'Tanggal Publikasi' },
        { key: 'banner', label: 'Banner' },
        { key: 'status', label: 'Status' },
      ]
    }
  ];

  const handleSearch = (searchResults) => {
    setFilteredData(searchResults);
  };

  const getStatusBadgeClass = (status) => {
    // Simplify to only handle Dipublikasikan
    switch (status) {
      case 'Dipublikasikan':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAdd = (newBlog) => {
    const updatedData = [...data, { ...newBlog, id: Date.now().toString() }];
    setData(updatedData);
    setFilteredData(updatedData);
    setIsAddModalOpen(false);
  };

  const handleEdit = (rowData) => {
    setSelectedData(rowData);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus blog ini?')) {
      const newData = data.filter(item => item.id !== id);
      setData(newData);
      setFilteredData(newData);
    }
  };

  const handleUpdate = (updatedData) => {
    const newData = data.map(item => {
      if (item.id === selectedData.id) {
        return {
          ...item,
          ...updatedData
        };
      }
      return item;
    });
    
    setData(newData);
    setFilteredData(newData);
    setIsEditModalOpen(false);
    setSelectedData(null);
  };

  // Image viewing functionality
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Daftar Blog</h2>
            <p className="text-sm text-gray-500">This is a list of latest blogs</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-customTeal text-white rounded-md hover:bg-customTeal transition-colors duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Tambah Blog</span>
          </button>
        </div>
      </div>

      <SearchBar
        data={data}
        onSearch={handleSearch}
      />

      <DataTable 
        data={filteredData}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        getStatusBadgeClass={getStatusBadgeClass}
        contentType='blogs'
        onImageClick={handleImageClick}
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

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={closeImageModal}
        >
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <img 
              src={
                selectedImage instanceof File 
                  ? URL.createObjectURL(selectedImage) 
                  : selectedImage
              }
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


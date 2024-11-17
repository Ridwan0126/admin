import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';
import { Upload, Edit2, Trash2, X } from 'lucide-react';

const initialData = [
  {
    id: "KP-20241027-0001",
    name: "Agus Santoso",
    wallet: "Dana",
    number: "085312345678",
    point: "40.000",
    give: "Rp.100.000",
    status: "Berhasil",
    receipt: null
  },
  {
    id: "KP-20241027-0002",
    name: "Budi Utomo",
    wallet: "Ovo",
    number: "085312345679",
    point: "15.000",
    give: "Rp.40.000",
    status: "Berhasil",
    receipt: null
  },
];

const ImagePreviewModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Receipt"
            className="max-h-[80vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState('all');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    
    const searchTerm = value.toLowerCase().trim();
    
    const filtered = initialData.filter(item => {
      if (searchField === 'all') {
        return Object.entries(item).some(([key, val]) => 
          key !== 'receipt' && val && val.toString().toLowerCase().includes(searchTerm)
        );
      } else {
        const fieldValue = item[searchField];
        return fieldValue && fieldValue.toString().toLowerCase().includes(searchTerm);
      }
    });
    
    onSearch(filtered);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Cari data..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      <div className="sm:w-48">
        <select
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchField}
          onChange={(e) => {
            setSearchField(e.target.value);
            const value = searchText;
            const searchTerm = value.toLowerCase().trim();
            const filtered = initialData.filter(item => {
              if (e.target.value === 'all') {
                return Object.entries(item).some(([key, val]) => 
                  key !== 'receipt' && val && val.toString().toLowerCase().includes(searchTerm)
                );
              } else {
                const fieldValue = item[e.target.value];
                return fieldValue && fieldValue.toString().toLowerCase().includes(searchTerm);
              }
            });
            onSearch(filtered);
          }}
        >
          <option value="all">Semua Field</option>
          {Object.keys(initialData[0])
            .filter(key => key !== 'receipt')
            .map(key => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))
          }
        </select>
      </div>
    </div>
  );
};

const KuyPointContent = ({ searchQuery = '' }) => {
  const [data, setData] = useState(initialData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const columns = [
    { key: 'id', label: 'ID Penukaran' },
    { key: 'name', label: 'Nama' },
    { key: 'wallet', label: 'E-Wallet' },
    { key: 'number', label: 'Nomor E-Wallet' },
    { key: 'point', label: 'Poin' },
    { key: 'give', label: 'Hadiah' },
    { 
      key: 'receipt', 
      label: 'Receipt',
      render: (value, row) => value && (
        <div className="flex items-center gap-2">
          <img 
            src={value}
            alt="Receipt" 
            className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleImageClick(value)}
          />
          <button
            onClick={() => handleDeleteReceipt(row.id)}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            title="Hapus foto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    },
    { key: 'status', label: 'Status' }
  ];

  const cardSections = [
    {
      title: 'Personal Info',
      fields: [
        { key: 'name', label: 'Nama' },
        { key: 'wallet', label: 'E-Wallet' },
        { key: 'number', label: 'Nomor E-Wallet' },
      ]
    },
    {
      title: 'Pickup Details',
      fields: [
        { key: 'id', label: 'ID Penukaran' },
        { key: 'point', label: 'Poin' },
        { key: 'give', label: 'Hadiah' },
        { 
          key: 'receipt', 
          label: 'Receipt',
          render: (value, row) => value && (
            <div className="flex items-center gap-2">
              <img 
                src={value}
                alt="Receipt" 
                className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleImageClick(value)}
              />
              <button
                onClick={() => handleDeleteReceipt(row.id)}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                title="Hapus foto"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        }
      ]
    }
  ];

  const handleSearch = (searchResults) => {
    setFilteredData(searchResults);
  };

  const handleUploadReceipt = async (rowId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        
        const newData = data.map(item =>
          item.id === rowId ? { ...item, receipt: imageUrl } : item
        );
        setData(newData);
        setFilteredData(newData);
      }
    };

    input.click();
  };

  const handleDeleteReceipt = (rowId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      const newData = data.map(item =>
        item.id === rowId ? { ...item, receipt: null } : item
      );
      setData(newData);
      setFilteredData(newData);
    }
  };

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

  const handleEdit = (rowData) => {
    setSelectedData(rowData);
    setIsEditModalOpen(true);
  };

  const handleDelete = (row) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const newData = data.filter(item => item.id !== row.id);
      setData(newData);
      setFilteredData(newData);
    }
  };

  const handleUpdate = (updatedData) => {
    const newData = data.map(item =>
      item.id === updatedData.id ? updatedData : item
    );
    setData(newData);
    setFilteredData(newData);
    setIsEditModalOpen(false);
    setSelectedData(null);
  };

  const handleImageClick = (imageUrl) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setIsImagePreviewOpen(true);
    }
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const renderActions = (row) => (
    <div className="flex gap-2">
      <button 
        className="p-2 text-sm font-medium text-blue-600 rounded hover:bg-blue-100"
        onClick={() => handleEdit(row)}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button 
        className="p-2 text-sm font-medium text-green-600 rounded hover:bg-green-100"
        onClick={() => handleUploadReceipt(row.id)}
      >
        <Upload className="w-4 h-4" />
      </button>
      <button 
        className="p-2 text-sm font-medium text-red-600 rounded hover:bg-red-100"
        onClick={() => handleDelete(row)}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Riwayat Penukaran Poin</h2>
        <p className="text-sm text-gray-500">This is a list of latest Orders</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <DataTable
        data={filteredData}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        getStatusBadgeClass={getStatusBadgeClass}
        renderActions={renderActions}
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
            onImageClick={handleImageClick}
            handleUploadReceipt={handleUploadReceipt}
          />
        ))}
      </div>

      {selectedData && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedData(null);
          }}
          data={selectedData}
          fields={columns.filter(col => col.key !== 'id' && col.key !== 'receipt')}
          onUpdate={handleUpdate}
        />
      )}

      <ImagePreviewModal
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        imageUrl={selectedImage}
      />

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default KuyPointContent;
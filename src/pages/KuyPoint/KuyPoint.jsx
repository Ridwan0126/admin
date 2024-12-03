import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';
import { Upload, Edit2, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';


const API_URL = 'http://localhost:5000/api/point-exchange';


const SearchBar = ({ data, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState('all');

  const performSearch = (text, field) => {
    if (!data || data.length === 0) return []; 
    const searchTerm = text.toLowerCase().trim();
    return data.filter((item) => {
      if (field === 'all') {
        return Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm)
        );
      } else {
        const itemValue = item[field]?.toString().toLowerCase() || '';
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
          placeholder="Cari data..."
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
          <option value="id">ID Penukaran</option>
          <option value="name">Nama</option>
          <option value="wallet">E-Wallet</option>
          <option value="number">Nomor E-Wallet</option>
          <option value="point">Poin</option>
          <option value="give">Hadiah</option>
        </select>
      </div>
    </div>
  );
};

const ImagePreviewModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded-full bg-white shadow-lg hover:bg-gray-100"
        >
          ✕
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="max-h-[85vh] w-auto object-contain"
        />
      </div>
    </div>
  );
};

const KuyPointContent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const formatCurrency = (value, currencySymbol = 'Rp') => {
    return `${currencySymbol}${new Intl.NumberFormat('id-ID').format(value)}`;
  };

  const formatPoints = (points) => {
    return `₱${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(points)}`;
  };

  const columns = [
    { key: 'id', label: 'ID Penukaran' },
    { key: 'name', label: 'Nama' },
    { key: 'wallet', label: 'E-Wallet' },
    { key: 'number', label: 'Nomor E-Wallet' },
    { key: 'point', label: 'Poin', render: (value) => formatPoints(value) },
    { key: 'give', label: 'Hadiah', render: (value) => formatCurrency(value) },
    {
      key: 'receipt',
      label: 'Receipt',
      render: (value) => {
        console.log("Receipt value:", value); 
        if (!value || typeof value !== 'string') {
            return <span className="text-gray-400 text-sm">No receipt available</span>;
        }
    
        const fullUrl = `http://localhost:5000${value}`;
        console.log("Full URL for <img>:", fullUrl); // Debug URL
    
        return (
            <div className="flex items-center space-x-2">
                <img
                    src={fullUrl}
                    alt="Receipt"
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
        { key: 'point', label: 'Poin' },
        { key: 'give', label: 'Hadiah' },
        {
          key: 'receipt',
          label: 'Receipt',
          render: (value) => {
            console.log("Receipt value in DataCard:", value); 
        
            if (!value || typeof value !== 'string') {
              return <span className="text-gray-400 text-sm">No receipt</span>;
            }
        
            const fullUrl = `http://localhost:5000${value}`;
            console.log("Full URL for <img> in DataCard:", fullUrl); 
        
            return (
              <div className="flex items-center space-x-2">
                <img
                  src={fullUrl}
                  alt="Receipt"
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
        }       
      ]
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/history`);
            const result = await response.json();
            console.log("Fetched data:", result);

            const formattedData = result.map((item) => ({
                ...item,
                receipt: typeof item.receipt === 'object' ? item.receipt.receipt : item.receipt,
            }));

            setData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    fetchData();
}, []);


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
        const formData = new FormData();
        formData.append('receipt', file);

        try {
          const response = await fetch(`${API_URL}/history/${rowId}/receipt`, {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) throw new Error('Failed to upload receipt');

          const imageUrl = await response.json();
          const newData = data.map((item) =>
            item.id === rowId ? { ...item, receipt: imageUrl } : item
          );
          setData(newData);
          setFilteredData(newData);
        } catch (error) {
          console.error('Error uploading receipt:', error);
        }
      }
    };

    input.click();
  };

  const handleDelete = async (row) => {
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
          const response = await fetch(`${API_URL}/history/${row.id}`, {
            method: 'DELETE',
          });
  
          if (!response.ok) {
            throw new Error('Failed to delete data');
          }
  
          const newData = data.filter((item) => item.id !== row.id);
          setData(newData);
          setFilteredData(newData);
  
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data berhasil dihapus.',
            confirmButtonColor: '#3085d6',
          });
        } catch (error) {
          console.error('Error deleting data:', error);
  
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
    try {
      const response = await fetch(`${API_URL}/history/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update data');

      const newData = data.map((item) =>
        item.id === updatedData.id ? updatedData : item
      );
      setData(newData);
      setFilteredData(newData);
      setIsEditModalOpen(false);
      setSelectedData(null);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil diupdate.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleImageClick = (imageUrl) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setIsImagePreviewOpen(true);
    }
  };

  const handleEdit = (rowData) => {
    setSelectedData(rowData);
    setIsEditModalOpen(true);
  };

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
        title="Upload Receipt"
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

      <SearchBar data={data} onSearch={handleSearch} />

      <DataTable data={filteredData} columns={columns} renderActions={renderActions} />

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

      {isImagePreviewOpen && (
        <ImagePreviewModal
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          imageUrl={selectedImage}
        />
      )}

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data yang ditemukan</p>
        </div>
      )}

      {isEditModalOpen && selectedData && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          data={selectedData}
          fields={[
          { key: 'name', label: 'Nama', required: true },
          { key: 'wallet', label: 'E-Wallet', required: true },
          { key: 'number', label: 'Nomor E-Wallet', required: true },
          { key: 'point', label: 'Poin', required: true },
          { key: 'give', label: 'Hadiah', required: true },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'Berhasil', label: 'Berhasil' },
              { value: 'Gagal', label: 'Gagal' },
              { value: 'Proses', label: 'Proses' }
            ]
          }
        ]}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default KuyPointContent;
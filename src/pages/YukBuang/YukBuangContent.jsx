import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';
import { X } from 'lucide-react';

// Dummy image URLs dengan placeholder yang valid
const dummyImages = {
  'sampah4.jpg': 'https://picsum.photos/400/300?random=4',
  'sampah5.jpg': 'https://picsum.photos/400/300?random=5',
  'sampah6.jpg': 'https://picsum.photos/400/300?random=6'
};

const ImagePreviewModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 rounded-full bg-white shadow-lg hover:bg-gray-100"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={dummyImages[imageUrl] || imageUrl}
          alt="Preview"
          className="max-h-[85vh] w-auto object-contain"
        />
      </div>
    </div>
  );
};

const initialData = [
  {
    id: "YP-20241027-0001",
    name: "Agus Santoso",
    location: "Jl Melati No. 12 Komplek",
    date: "Oct 27, 2024",
    time: "08:00",
    type: "Alumunium",
    amount: "30 Kg",
    photo: "sampah4.jpg",
    status: "Berhasil"
  },
  {
    id: "YP-20241027-0002",
    name: "Kepin Santoso",
    location: "Jl Melati No. 12 Komplek",
    date: "Oct 27, 2024",
    time: "08:00",
    type: "Alumunium",
    amount: "30 Kg",
    photo: "sampah5.jpg",
    status: "Berhasil"
  },
  {
    id: "YP-20241027-0003",
    name: "Ega Santoso",
    location: "Jl Melati No. 12 Komplek",
    date: "Oct 27, 2024",
    time: "08:00",
    type: "Alumunium",
    amount: "30 Kg",
    photo: "sampah6.jpg",
    status: "Berhasil"
  },
];

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
          key !== 'photo' && val.toString().toLowerCase().includes(searchTerm)
        );
      } else {
        return item[searchField].toString().toLowerCase().includes(searchTerm);
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
            // Trigger search with new field
            const value = searchText;
            const searchTerm = value.toLowerCase().trim();
            const filtered = initialData.filter(item => {
              if (e.target.value === 'all') {
                return Object.entries(item).some(([key, val]) => 
                  key !== 'photo' && val.toString().toLowerCase().includes(searchTerm)
                );
              } else {
                return item[e.target.value].toString().toLowerCase().includes(searchTerm);
              }
            });
            onSearch(filtered);
          }}
        >
          <option value="all">Semua Field</option>
          {Object.keys(initialData[0])
            .filter(key => key !== 'photo')
            .map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
        </select>
      </div>
    </div>
  );
};

const YukBuangContent = () => {
  const [data, setData] = useState(initialData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const columns = [
    { key: 'id', label: 'Pickup ID' },
    { key: 'name', label: 'Nama' },
    { key: 'location', label: 'Lokasi' },
    { key: 'date', label: 'Tanggal & Jam' },
    { key: 'type', label: 'Jenis' },
    { key: 'amount', label: 'Jumlah(Kg)' },
    { 
      key: 'photo', 
      label: 'Foto',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <img 
            src={dummyImages[value]}
            alt="Thumbnail" 
            className="w-10 h-10 object-cover rounded cursor-pointer"
            onClick={() => handleImageClick(value)}
          />
          <button
            onClick={() => handleImageClick(value)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Lihat Foto
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
        { key: 'location', label: 'Lokasi' }
      ]
    },
    {
      title: 'Pickup Details',
      fields: [
        { key: 'type', label: 'Jenis' },
        { key: 'amount', label: 'Jumlah' },
        { key: 'date', label: 'Waktu' },
        { 
          key: 'photo', 
          label: 'Foto',
          render: (value) => (
            <div className="flex items-center space-x-2">
              <img 
                src={dummyImages[value]}
                alt="Thumbnail" 
                className="w-10 h-10 object-cover rounded cursor-pointer"
                onClick={() => handleImageClick(value)}
              />
              <button
                onClick={() => handleImageClick(value)}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Lihat Foto
              </button>
            </div>
          )
        }
      ]
    }
  ];

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleSearch = (searchResults) => {
    setFilteredData(searchResults);
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

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const newData = data.filter(item => item.id !== id);
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

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Daftar Penjemputan Sampah</h2>
        <p className="text-sm text-gray-500">This is a list of latest Orders</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <DataTable
        data={filteredData}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        getStatusBadgeClass={getStatusBadgeClass}
        onImageClick={handleImageClick}
        imageUrlMap={dummyImages}
      />

      <div className="lg:hidden space-y-4">
        {filteredData.map((row) => (
          <DataCard
            key={row.id}
            data={row}
            sections={cardSections}
            handleEdit={handleEdit}
            handleDelete={() => handleDelete(row.id)}
            onImageClick={handleImageClick}
            imageUrlMap={dummyImages}
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
          fields={columns.filter(col => col.key !== 'id')}
          onUpdate={handleUpdate}
        />
      )}

      <ImagePreviewModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
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

export default YukBuangContent;
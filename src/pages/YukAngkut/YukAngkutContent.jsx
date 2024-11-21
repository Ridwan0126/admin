import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const dummyImages = {
  'sampah4.jpg': 'https://picsum.photos/400/300?random=4',
  'sampah5.jpg': 'https://picsum.photos/400/300?random=5',
  'sampah6.jpg': 'https://picsum.photos/400/300?random=6'
};

const ImagePreviewModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="relative bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
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

const SearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState('all');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const searchTerm = value.toLowerCase().trim();
    onSearch(searchTerm, searchField);
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
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="all">Semua Field</option>
          <option value="pickup_id">Pickup ID</option>
          <option value="name">Nama</option>
          <option value="location">Lokasi</option>
          <option value="driver">Driver</option>
          <option value="date">Tanggal & Jam</option>
          <option value="type">Jenis</option>
          <option value="amount">Jumlah(Kg)</option>
        </select>
      </div>
    </div>
  );
};

const YukAngkutContent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const columns = [
    { key: 'pickup_id', label: 'Pickup ID' },
    { key: 'name', label: 'Nama' },
    { key: 'location', label: 'Lokasi' },
    { key: 'driver', label: 'Driver' },
    {
      key: 'date',
      label: 'Tanggal & Jam',
      render: (value, row) => {
        const formattedDate = format(new Date(row.date), 'MMM dd, yyyy');
        const formattedTime = row.time ? format(new Date(`1970-01-01T${row.time}Z`), 'HH:mm') : '';
        return `${formattedDate} (${formattedTime})`;
      }
    },
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
          <button onClick={() => handleImageClick(value)} className="text-blue-600 hover:text-blue-800 underline">
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
        { key: 'location', label: 'Lokasi' },
        { key: 'driver', label: 'Driver' }
      ]
    },
    {
      title: 'Pickup Details',
      fields: [
        { key: 'pickup_id', label: 'Pickup ID' },
        { key: 'type', label: 'Jenis' },
        { key: 'amount', label: 'Jumlah' },
        {
          key: 'date',
          label: 'Tanggal & Jam',
          render: (value, row) => {
            const formattedDate = format(new Date(value), 'MMM dd, yyyy');
            const formattedTime = row.time
              ? format(new Date(`1970-01-01T${row.time}Z`), 'HH:mm')
              : 'N/A';
            return `${formattedDate} (${formattedTime})`;
          }
        },
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

  const handleSearch = (searchTerm, searchField) => {
    const filtered = data.filter((item) => {
      if (searchField === 'all') {
        return Object.entries(item).some(([key, val]) =>
          key !== 'photo' && val.toString().toLowerCase().includes(searchTerm)
        );
      } else {
        return item[searchField]?.toString().toLowerCase().includes(searchTerm);
      }
    });
    setFilteredData(filtered);
  };

  const handleEdit = (rowData) => {
    setSelectedData(rowData);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedData) => {
    fetch(`http://localhost:5000/api/yuk_angkut/${updatedData.pickup_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then((response) => response.json())
      .then((result) => {
        setData((prev) =>
          prev.map((item) =>
            item.pickup_id === updatedData.pickup_id ? updatedData : item
          )
        );
        setFilteredData((prev) =>
          prev.map((item) =>
            item.pickup_id === updatedData.pickup_id ? updatedData : item
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data berhasil diupdate.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });

        setIsEditModalOpen(false);
      })
      .catch((error) => console.error('Error updating data:', error));
  };

  const handleDelete = (pickupId) => {
    if (!pickupId) {
      console.error('pickup_id is undefined');
      return;
    }

    Swal.fire({
      title: 'Yakin menghapus data ini?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/api/yuk_angkut/${pickupId}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              setData((prev) => prev.filter((item) => item.pickup_id !== pickupId));
              setFilteredData((prev) => prev.filter((item) => item.pickup_id !== pickupId));

              Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data berhasil dihapus.',
                confirmButtonColor: '#3085d6',
              });
            } else {
              throw new Error('Gagal menghapus data');
            }
          })
          .catch((error) => {
            console.error('Error deleting data:', error);
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: 'Terjadi kesalahan saat menghapus data.',
              confirmButtonColor: '#d33',
            });
          });
      }
    });
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/yuk_angkut')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Daftar Penjemputan Yuk Angkut</h2>
        <p className="text-sm text-gray-500">List penjemputan terbaru</p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <DataTable
        data={filteredData}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={(pickupId) => handleDelete(pickupId)}
      />

      <div className="lg:hidden space-y-4">
        {filteredData.map((row) => (
          <DataCard
            key={row.pickup_id}
            data={row}
            sections={cardSections}
            handleEdit={handleEdit}
            handleDelete={() => handleDelete(row.pickup_id)}
            onImageClick={handleImageClick}
            imageUrlMap={dummyImages}
          />
        ))}
      </div>

      {isEditModalOpen && selectedData && (
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          data={selectedData}
          fields={[
            { key: 'name', label: 'Nama', required: true },
            { key: 'location', label: 'Lokasi', required: true },
            { key: 'driver', label: 'Driver', required: true },
            { key: 'type', label: 'Jenis', required: true },
            { key: 'amount', label: 'Jumlah(Kg)', required: true },
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

      <ImagePreviewModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} imageUrl={selectedImage} />

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default YukAngkutContent;
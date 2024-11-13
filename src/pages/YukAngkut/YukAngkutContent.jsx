import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';


// Sample data tetap sama
const initialData = [
  {
    id: "YK-20241027-0001",
    name: "Agus Santoso",
    location: "Jl Melati No. 12 Komplek",
    driver: "Fauzi Witowo",
    type: "Alumunium",
    amount: "30 Kg",
    date: "Oct 27, 2024",
    time: "08:00",
    status: "Berhasil",
  },
  {
    id: "YK-20241027-0002",
    name: "Agus Santoso",
    location: "Jl Melati No. 12 Komplek",
    driver: "Fauzi Witowo",
    type: "Alumunium",
    amount: "30 Kg",
    date: "Oct 27, 2024",
    time: "08:00",
    status: "Berhasil",
  },
];

// Komponen Search baru
const SearchBar = ({ onSearch, searchFields }) => {
  const [searchParams, setSearchParams] = useState({
    searchText: '',
    searchField: 'all'
  });

  const handleSearch = (e) => {
    const { name, value } = e.target;
    const newParams = { ...searchParams, [name]: value };
    setSearchParams(newParams);
    onSearch(newParams);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          name="searchText"
          placeholder="Cari data..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchParams.searchText}
          onChange={handleSearch}
        />
      </div>
      <div className="sm:w-48">
        <select
          name="searchField"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchParams.searchField}
          onChange={handleSearch}
        >
          <option value="all">Semua Field</option>
          {searchFields.map(field => (
            <option key={field.key} value={field.key}>
              {field.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const YukAngkutContent = ({ searchQuery = '' }) => {
  const [data, setData] = useState(initialData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  // Define columns configuration
  const columns = [
    { key: 'id', label: 'Pickup ID' },
    { key: 'name', label: 'Nama' },
    { key: 'location', label: 'Lokasi' },
    { key: 'driver', label: 'Driver' },
    { key: 'type', label: 'Jenis' },
    { key: 'amount', label: 'Jumlah(Kg)' },
    { key: 'date', label: 'Tanggal & Jam' },
    { key: 'status', label: 'Status' }
  ];

  // Define card sections for mobile view
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
        { key: 'type', label: 'Jenis' },
        { key: 'amount', label: 'Jumlah' },
        { key: 'date', label: 'Waktu' }
      ]
    }
  ];

  const handleSearch = ({ searchText, searchField }) => {
    if (!searchText) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => {
      if (searchField === 'all') {
        return Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchText.toLowerCase())
        );
      } else {
        return item[searchField].toString().toLowerCase().includes(searchText.toLowerCase());
      }
    });

    setFilteredData(filtered);
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

  // Effect untuk inisialisasi filtered data
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Daftar Penjemputan Sampah</h2>
        <p className="text-sm text-gray-500">This is a list of latest Orders</p>
      </div>

      {/* Search Component */}
      <SearchBar 
        onSearch={handleSearch}
        searchFields={columns}
      />

      {/* Desktop Table View */}
      <DataTable 
        data={filteredData}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        getStatusBadgeClass={getStatusBadgeClass}
      />

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredData.map((row) => (
          <DataCard 
            key={row.id}
            data={row}
            sections={cardSections}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit Modal */}
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

      {/* No Results Message */}
      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default YukAngkutContent;
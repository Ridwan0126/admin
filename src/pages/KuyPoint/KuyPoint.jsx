import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';

// Sample data
const initialData = [
  {
    id: "KP-20241027-0001",
    name: "Agus Santoso",
    wallet: "Dana",
    number: "085312345678",
    point: "40.000",
    give: "Rp.100.000",
    status: "Berhasil",
  },
  {
    id: "KP-20241027-0002",
    name: "Budi Utomo",
    wallet: "Ovo",
    number: "085312345679",
    point: "15.000",
    give: "Rp.40.000",
    status: "Berhasil",
  },
];

const YukAngkutContent = ({ searchQuery = '' }) => {
  const [data, setData] = useState(initialData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Define columns configuration
  const columns = [
    { key: 'id', label: 'ID Penukaran' },
    { key: 'name', label: 'Nama' },
    { key: 'wallet', label: 'E-Wallet' },
    { key: 'number', label: 'Nomor E-Wallet' },
    { key: 'point', label: 'Poin' },
    { key: 'give', label: 'Hadiah' },
    { key: 'status', label: 'Status' }
  ];

  // Define card sections for mobile view
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
      ]
    }
  ];

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
      setData(prevData => prevData.filter(item => item.id !== id));
    }
  };

  const handleUpdate = (updatedData) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === updatedData.id ? updatedData : item
      )
    );
    setIsEditModalOpen(false);
    setSelectedData(null);
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Riwayat Penukaran Poin</h2>
        <p className="text-sm text-gray-500">This is a list of latest Orders</p>
      </div>

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
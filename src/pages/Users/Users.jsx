import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';
import AddModal from './AddModal'; 
import { PlusCircle } from 'lucide-react'; 

// Sample data with unique IDs
const initialData = [
  {
    id: '1',  // Menambahkan ID unik
    name: "Agus Santoso sip",
    email: "agussantos@gmail.com",
    number: "085312345678",
    addres: "Jl Melati No. 12 Komplek",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: '2',  // Menambahkan ID unik
    name: "Agus Santoso",
    email: "agussantos@gmail.com",
    number: "085312345678",
    addres: "Jl Melati No. 12 Komplek",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: '3',  // Menambahkan ID unik
    name: "ahmad Agus Santoso",
    email: "agussantos@gmail.com",
    number: "085312345678",
    addres: "Jl Melati No. 12 Komplek",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: '4',  // Menambahkan ID unik
    name: "kepin yoga",
    email: "kepin@gmail.com",
    number: "085312345678",
    addres: "Jl Melati No. 12 Komplek",
    role: "Admin",
    status: "Aktif",
  },
];

const UsersContent = ({ searchQuery = '' }) => {
  const [data, setData] = useState(initialData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Define columns configuration
  const columns = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'number', label: 'Nomor Telepon' },
    { key: 'addres', label: 'Alamat' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' }
  ];

  const cardSections = [
    {
      title: 'Personal Info',
      fields: [
        { key: 'name', label: 'Nama' },
        { key: 'email', label: 'Email' },
        { key: 'number', label: 'Nomor Telepon' },
        { key: 'addres', label: 'Alamat' },
        { key: 'role', label: 'Role' },
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

  const handleAdd = (newUser) => {
    setData(prevData => [...prevData, newUser]);
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

  // Perbaikan fungsi handleUpdate
  const handleUpdate = (updatedData) => {
    setData(prevData => {
      return prevData.map(item => {
        // Hanya update data dengan ID yang sesuai
        if (item.id === selectedData.id) {
          return {
            ...item,
            ...updatedData
          };
        }
        return item;
      });
    });
    
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
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Daftar Admin</h2>
            <p className="text-sm text-gray-500">This is a list of latest Orders</p>
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

      <DataTable 
        data={filteredData}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        getStatusBadgeClass={getStatusBadgeClass}
        contentType='users'
      />

      <div className="lg:hidden space-y-4">
        {filteredData.map((row) => (
          <DataCard 
            key={row.id}
            data={row}
            sections={cardSections}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            contentType='users'
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
          contentType='users'
        />
      )}

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default UsersContent;
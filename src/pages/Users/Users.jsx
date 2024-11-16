import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';
import AddModal from './AddModal';
import { PlusCircle } from 'lucide-react';

// Sample data with unique IDs
const initialData = [
  {
    id: '1',
    name: "Agus Santoso sip",
    email: "agussantos@gmail.com",
    number: "085312345678",
    addres: "Jl Melati No. 12 Komplek",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: '2',
    name: "Agus Santoso",
    email: "agussantos@gmail.com",
    number: "085312345678",
    addres: "Jl Melati No. 12 Komplek",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: '3',
    name: "ahmad Agus Santoso",
    email: "agussantos@gmail.com",
    number: "085312345678",
    addres: "Jl Melati No. 12 Komplek",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: '4',
    name: "kepin yoga",
    email: "kepin@gmail.com",
    number: "085312345678",
    addres: "Jl Melati No. 12 Komplek",
    role: "Admin",
    status: "Aktif",
  },
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
          {Object.keys(initialData[0]).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const UsersContent = () => {
  const [data, setData] = useState(initialData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

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

  const handleAdd = (newUser) => {
    const updatedData = [...data, newUser];
    setData(updatedData);
    setFilteredData(updatedData);
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

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

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
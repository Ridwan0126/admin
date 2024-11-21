import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';
import AddModal from './AddModal';
import { PlusCircle } from 'lucide-react';
import Swal from 'sweetalert2';


const UsersContent = () => {
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  const columns = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'number', label: 'Nomor Telepon' },
    { key: 'address', label: 'Alamat' },
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
        { key: 'address', label: 'Alamat' },
        { key: 'role', label: 'Role' },
      ]
    }
  ];

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/admins', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch admins');
        const admins = await response.json();
        setData(admins);
        setFilteredData(admins);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  const handleSearch = (searchResults) => {
    setFilteredData(searchResults);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 text-green-800';
      case 'Tidak Aktif':
        return 'bg-red-100 text-red-800';
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
  
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Yakin menghapus admin ini?',
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
          const response = await fetch(`http://localhost:5000/api/user/admins/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil!',
              text: 'Admin berhasil dihapus.',
              confirmButtonColor: '#3085d6',
            });
  
            setData((prev) => prev.filter((admin) => admin.id !== id));
            setFilteredData((prev) => prev.filter((admin) => admin.id !== id));
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Gagal!',
              text: 'Gagal menghapus admin.',
              confirmButtonColor: '#d33',
            });
          }
        } catch (error) {
          console.error('Error deleting admin:', error);
  
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Terjadi kesalahan saat menghapus admin.',
            confirmButtonColor: '#d33',
          });
        }
      }
    });
  };

  const handleUpdate = async (updatedData) => {
    if (!selectedData || !selectedData.id) {
      console.error('Selected data is missing ID:', selectedData);
      return alert('Error: No selected admin to update.');
    }
  
    // Hilangkan `gender` dari data yang dikirim ke backend
    const dataToSend = { ...updatedData };
    delete dataToSend.gender;
  
    try {
      const response = await fetch(`http://localhost:5000/api/user/admins/${selectedData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Error updating admin:', errorDetails);
        throw new Error(`Failed to update admin: ${errorDetails}`);
      }
  
      const updatedAdmin = await response.json();
      const newData = data.map(item => (item.id === selectedData.id ? { ...item, ...updatedAdmin } : item));
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
      console.error('Error updating admin:', error);
      alert('Error updating admin');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Daftar Admin</h2>
            <p className="text-sm text-gray-500">This is a list of all admin users</p>
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

      <SearchBar data={data} onSearch={handleSearch} />

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
          fields={[
            { key: 'name', label: 'Nama', required: true },
            { key: 'email', label: 'Email', required: true },
            { key: 'number', label: 'Nomor Telepon', required: true },
            { key: 'address', label: 'Alamat', required: true },
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'Aktif', label: 'Aktif' },
                { value: 'Nonaktif', label: 'Nonaktif' },
              ]
            }
          ]}
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

// SearchBar Component untuk pencarian data
const SearchBar = ({ data, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [searchField, setSearchField] = useState('all');

  const performSearch = (text, field) => {
    const searchTerm = text.toLowerCase().trim();
    return data.filter(item => {
      if (field === 'all') {
        return Object.values(item).some(value => 
          value != null && value.toString().toLowerCase().includes(searchTerm)
        );
      } else {
        const itemValue = item[field];
        return itemValue != null && itemValue.toString().toLowerCase().includes(searchTerm);
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
          <option value="id">ID</option>
          <option value="name">Nama</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
          <option value="address">Alamat</option>
        </select>
      </div>
    </div>
  );
};

export default UsersContent;
import React, { useState, useEffect } from 'react';
import DataTable from '../../component/common/DataTable';
import DataCard from '../../component/common/DataCard';
import EditModal from '../../component/common/EditModal';

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
          {Object.keys(data[0] || {}).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const KuyPointContent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'id', label: 'ID Penukaran' },
    { key: 'name', label: 'Nama' },
    { key: 'wallet', label: 'E-Wallet' },
    { key: 'number', label: 'Nomor E-Wallet' },
    { key: 'point', label: 'Poin' },
    { key: 'give', label: 'Hadiah' },
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
      ]
    }
  ];

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/api/point-exchange/history');
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (searchResults) => {
    setFilteredData(searchResults);
  };

  const handleEdit = (rowData) => {
    setSelectedData(rowData);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/point-exchange/history/${row.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete data');
        
        const newData = data.filter(item => item.id !== row.id);
        setData(newData);
        setFilteredData(newData);
      } catch (error) {
        console.error("Error deleting data:", error);
        setError('Gagal menghapus data');
      }
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/point-exchange/history/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) throw new Error('Failed to update data');
      
      const newData = data.map(item =>
        item.id === updatedData.id ? updatedData : item
      );
      setData(newData);
      setFilteredData(newData);
      setIsEditModalOpen(false);
      setSelectedData(null);
    } catch (error) {
      console.error("Error updating data:", error);
      setError('Gagal memperbarui data');
    }
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Riwayat Penukaran Poin</h2>
        <p className="text-sm text-gray-500">This is a list of latest Orders</p>
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
        getStatusBadgeClass={(status) => {
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
        }}
      />

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

      {filteredData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada data yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default KuyPointContent;
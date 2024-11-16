import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Recycle, Truck, ArrowDownUp, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  Bar,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const fullChartData = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
  { month: "Jul", desktop: 250 },
  { month: "Aug", desktop: 237 },
  { month: "Sep", desktop: 73 },
  { month: "Oct", desktop: 209 },
  { month: "Nov", desktop: 186 },
  { month: "Dec", desktop: 300 },
];

const transactions = [
  {
    name: "Budi Santoso",
    email: "budi.s@example.com",
    amount: "50.000",
    type: "Daur Ulang"
  },
  {
    name: "Dewi Putri",
    email: "dewi.p@example.com",
    amount: "75.000",
    type: "Penjemputan"
  },
  {
    name: "Ahmad Rahman",
    email: "ahmad.r@example.com",
    amount: "100.000",
    type: "Pengantaran"
  },
  {
    name: "Siti Nurhaliza",
    email: "siti.n@example.com",
    amount: "65.000",
    type: "Daur Ulang"
  }
];

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
    <div className="mb-4 flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <input
          type="text"
          name="searchText"
          placeholder="Cari transaksi..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchParams.searchText}
          onChange={handleSearch}
        />
      </div>
      <div className="sm:w-48">
        <select
          name="searchField"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

const Dashboard = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const [currentPage, setCurrentPage] = React.useState(0);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const ITEMS_PER_PAGE = 6;

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentPage(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const getCurrentData = () => {
    if (!isMobile) return fullChartData;
    
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return fullChartData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const totalPages = Math.ceil(fullChartData.length / ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const searchFields = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'type', label: 'Tipe Transaksi' },
  ];

  const handleSearch = ({ searchText, searchField }) => {
    if (!searchText) {
      setFilteredTransactions(transactions);
      return;
    }

    const filtered = transactions.filter(item => {
      if (searchField === 'all') {
        return Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchText.toLowerCase())
        );
      } else {
        return item[searchField].toString().toLowerCase().includes(searchText.toLowerCase());
      }
    });

    setFilteredTransactions(filtered);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Status Cards - Updated grid styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card Total Daur Ulang */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm md:text-sm font-medium">Total Daur Ulang</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl md:text-2xl font-bold">500.000</div>
            <p className="text-xs md:text-xs text-muted-foreground">Kilogram (Kg)</p>
          </CardContent>
        </Card>

        {/* Card Total Penjemputan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm md:text-sm font-medium">Total Penjemputan</CardTitle>
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl md:text-2xl font-bold">250</div>
            <p className="text-xs md:text-xs text-muted-foreground">Unit/Order</p>
          </CardContent>
        </Card>

        {/* Card Total Pengantaran */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm md:text-sm font-medium">Total Pengantaran</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl md:text-2xl font-bold">100</div>
            <p className="text-xs md:text-xs text-muted-foreground">Unit/Order</p>
          </CardContent>
        </Card>

        {/* Card Total Pengguna */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
            <CardTitle className="text-sm md:text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl md:text-2xl font-bold">1,234</div>
            <p className="text-xs md:text-xs text-muted-foreground">Users</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-7">
        {/* Chart Card */}
        <Card className="md:col-span-4">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-xl">Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getCurrentData()}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 0,
                    bottom: 20
                  }}
                  barSize={isMobile ? 20 : 30}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                  />
                  <Bar 
                    dataKey="desktop" 
                    fill="rgb(85, 179, 164)" 
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      position="top"
                      offset={10}
                      fill="#666"
                      fontSize={isMobile ? 10 : 12}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Pagination Controls - Only show on mobile */}
            {isMobile && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm">
                  {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card className="md:col-span-3">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-xl">Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {/* Search Bar */}
            <SearchBar 
              onSearch={handleSearch}
              searchFields={searchFields}
            />
            
            <div className="space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Avatar" />
                      <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{transaction.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{transaction.email}</p>
                      <p className="text-xs text-muted-foreground">{transaction.type}</p>
                    </div>
                    <div className="text-sm font-medium">
                      Rp {transaction.amount}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Tidak ada transaksi yang ditemukan
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
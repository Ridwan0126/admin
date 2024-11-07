import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function to get active menu item from pathname
  const getActiveItem = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/yuk-angkut':
        return 'Yuk Angkut';
      case '/yuk-buang':
        return 'Yuk Buang';
      case '/kuy-point':
        return 'Kuy Point';
      case '/users':
        return 'Users';
      case '/profile':
        return 'Profile';
      default:
        return 'Dashboard';
    }
  };

  // Helper function to handle navigation
  const handleSetActiveItem = (menuItem) => {
    const pathMap = {
      'Dashboard': '/dashboard',
      'Yuk Angkut': '/yuk-angkut',
      'Yuk Buang': '/yuk-buang',
      'Kuy Point': '/kuy-point',
      'Users': '/users',
      'Profile': '/profile'
    };

    const path = pathMap[menuItem];
    if (path) {
      navigate(path);
    }
  };

  const activeItem = getActiveItem(location.pathname);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar 
        activeItem={activeItem} 
        setActiveItem={handleSetActiveItem}
      />
      <main className="flex-1 pb-20 lg:pb-0">
        <Navbar 
          pageTitle={activeItem} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="p-4 sm:p-6">
          {React.cloneElement(children, { searchQuery })}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
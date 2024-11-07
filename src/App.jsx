import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './component/layout/DashboardLayout';
import YukAngkutContent from './pages/YukAngkut/YukAngkutContent';
import YukBuangContent from './pages/YukBuang/YukBuangContent';
import Dashboard from './pages/Dashboard/Dashboard';
import KuyPoint from './pages/KuyPoint/KuyPoint';
import Users from './pages/Users/Users';
import Profile from './pages/Profile/Profile';


const App = () => {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/yuk-angkut" element={<YukAngkutContent />} />
          <Route path="/yuk-buang" element={<YukBuangContent />} />
          <Route path="/kuy-point" element={<KuyPoint />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
};

export default App;
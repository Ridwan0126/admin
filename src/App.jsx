import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './component/layout/DashboardLayout';
import YukAngkutContent from './pages/YukAngkut/YukAngkutContent';
import YukBuangContent from './pages/YukBuang/YukBuangContent';
import Dashboard from './pages/Dashboard/Dashboard';
import KuyPoint from './pages/KuyPoint/KuyPoint';
import Users from './pages/Users/Users';
import Settings from './pages/Settings/Settings';
import Blog from './pages/Blog/Blog';
import LoginPage from './pages/LoginPage/LoginPage';
import Navbar from './component/layout/Navbar';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        } />
        <Route path="/yuk-angkut" element={
          <DashboardLayout>
            <YukAngkutContent />
          </DashboardLayout>
        } />
        <Route path="/yuk-buang" element={
          <DashboardLayout>
            <YukBuangContent />
          </DashboardLayout>
        } />
        <Route path="/kuy-point" element={
          <DashboardLayout>
            <KuyPoint />
          </DashboardLayout>
        } />
        <Route path="/users" element={
          <DashboardLayout>
            <Users />
          </DashboardLayout>
        } />
        <Route path="/blog" element={
          <DashboardLayout>
            <Blog />
          </DashboardLayout>
        } />
        <Route path="/settings" element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
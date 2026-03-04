/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

import AdoptionHall from './pages/user/AdoptionHall';
import PigDetails from './pages/user/PigDetails';
import MyPigs from './pages/user/MyPigs';
import MyPigDetails from './pages/user/MyPigDetails';
import FeedStore from './pages/user/FeedStore';
import AdminDashboard from './pages/admin/AdminDashboard';
import PigManagement from './pages/admin/PigManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CameraManagement from './pages/admin/CameraManagement';
import Profile from './pages/user/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* User Routes */}
          <Route path="/app" element={<UserLayout />}>
            <Route index element={<AdoptionHall />} />
            <Route path="pigs/:id" element={<PigDetails />} />
            <Route path="my-pigs" element={<MyPigs />} />
            <Route path="my-pigs/:id" element={<MyPigDetails />} />
            <Route path="feed" element={<FeedStore />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="pigs" element={<PigManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="cameras" element={<CameraManagement />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}



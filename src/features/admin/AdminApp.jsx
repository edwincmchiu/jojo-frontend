import { useState } from 'react';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import EventTypeManager from './EventTypeManager';
import GroupManager from './GroupManager';
import UserManager from './UserManager';
import EventManager from './EventManager';

export default function AdminApp({ onLogout: parentLogout }) {
  const handleLogout = () => {
    // 清除 localStorage
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
    
    // 呼叫父層的 logout 函式
    if (parentLogout) {
      parentLogout();
    }
  };

  return (
    <AdminLayout onLogout={handleLogout}>
      {({ currentPage }) => {
        switch (currentPage) {
          case 'dashboard':
            return <Dashboard />;
          case 'analytics':
            return <Analytics />;
          case 'types':
            return <EventTypeManager />;
          case 'groups':
            return <GroupManager />;
          case 'users':
            return <UserManager />;
          case 'events':
            return <EventManager />;
          default:
            return <Dashboard />;
        }
      }}
    </AdminLayout>
  );
}

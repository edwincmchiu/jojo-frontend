import { useState } from 'react';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import EventTypeManager from './EventTypeManager';
import GroupManager from './GroupManager';
import UserManager from './UserManager';
import EventManager from './EventManager';

export default function AdminApp({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
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

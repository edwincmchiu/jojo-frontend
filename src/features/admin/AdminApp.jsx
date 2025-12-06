import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import Analytics from './Analytics';
import EventTypeManager from './EventTypeManager';
import GroupManager from './GroupManager';
import UserManager from './UserManager';
import EventManager from './EventManager';

export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 檢查是否已經登入
    const adminId = localStorage.getItem('adminId');
    if (adminId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

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
